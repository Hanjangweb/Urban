import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

// Async thunk to fetch all users (admin only)
export const fetchUsers = createAsyncThunk(
    "admin/fetchUsers",          
    async (_, { rejectWithValue }) => {   
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/admin/users`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("userToken")}`
                    }
                }
            )
            return response.data
        } catch (err) {
            console.error(err)
            return rejectWithValue(err.response.data)  
        }
    }
)

// Async thunk to create a user (admin only)
export const addUser = createAsyncThunk(
    "admin/addUser",             
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/admin/users`,
                userData,        
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("userToken")}`
                    }
                }
            )
            return response.data
        } catch (err) {
            console.error(err)
            return rejectWithValue(err.response.data)
        }
    }
)

// Async thunk to update a user (admin only)
export const updateUser = createAsyncThunk(
    "admin/updateUser",
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/admin/users/${userData.id}`,
                userData,
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` }
                }
            )
            // If backend returns a message, return userData (so we have the ID and new role)
            // If backend returns the user, return response.data
            return response.data.user || response.data; 
        } catch (err) {
            return rejectWithValue(err.response.data)
        }
    }
)

// Async thunk to delete a user (admin only)
export const deleteUser = createAsyncThunk(
    "admin/deleteUser",
    async (id, { rejectWithValue }) => { 
        try {
            await axios.delete( 
                `${import.meta.env.VITE_BACKEND_URL}/api/admin/users/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("userToken")}`
                    }
                }
            )
            return id 
        } catch (err) {
            return rejectWithValue(err.response.data)
        }
    }
)

// createSlice
const adminSlice = createSlice({   
    name: "admin",
    initialState: {
        users: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch users
            .addCase(fetchUsers.pending, (state) => {       
                state.loading = true
                state.error = null
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false
                state.users = action.payload               
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload?.message || action.error.message
            })

            // Add user
            .addCase(addUser.pending, (state) => {         
                state.loading = true
                state.error = null
            })
            .addCase(addUser.fulfilled, (state, action) => {
                state.loading = false
                state.users.push(action.payload)           
            })
            .addCase(addUser.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload?.message || action.error.message
            })

            // Update user
            .addCase(updateUser.pending, (state) => {      
                state.loading = true
                state.error = null
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.loading = false;
                // The backend usually returns the updated user object as action.payload
                const updatedUser = action.payload;

                if (updatedUser && updatedUser._id) {
                    const index = state.users.findIndex((u) => u._id === updatedUser._id);
                    if (index !== -1) {
                        // This is the line that forces React to re-render WITHOUT a reload
                        state.users[index] = updatedUser;
                    }
                }
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload?.message || action.error.message
            })

            // Delete user
            .addCase(deleteUser.pending, (state) => {      
                state.loading = true
                state.error = null
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.loading = false
                // Since action.payload is now just the ID string:
                state.users = state.users.filter(u => u._id !== action.payload) 
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload?.message || action.error.message
            })
    }
})

export default adminSlice.reducer  