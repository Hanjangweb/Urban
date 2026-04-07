import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

const getAuthHeader = () => {
    const token = localStorage.getItem("userToken");

    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

const BASE_URL = import.meta.env.VITE_BACKEND_URL

// Fetch all admin products
export const fetchAdminProducts = createAsyncThunk(
    "adminProducts/fetchAdminProducts",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${BASE_URL}/api/admin/products`, getAuthHeader())
            return response.data
        } catch (err) {
            return rejectWithValue(err.response?.data || { message: err.message })
        }
    }
)

// Create a new product
export const createProduct = createAsyncThunk(
    "adminProducts/createProduct",
    async (productData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${BASE_URL}/api/admin/products`, productData, getAuthHeader())
            return response.data
        } catch (err) {
            return rejectWithValue(err.response?.data || { message: err.message })
        }
    }
)

// Update an existing product
export const updateProduct = createAsyncThunk(
    "adminProducts/updateProduct",
    async ({ id, productData }, { rejectWithValue }) => {
        try {
            const response = await axios.put(
                `${BASE_URL}/api/admin/products/${id}`,
                productData,
                getAuthHeader()
            )
            return response.data
        } catch (err) {
            return rejectWithValue(err.response?.data || { message: err.message })
        }
    }
)

// Delete a product
export const deleteProduct = createAsyncThunk(
    "adminProducts/deleteProduct",
    async (id, { rejectWithValue }) => {  // ✅ id directly, not { id }
        try {
            await axios.delete(`${BASE_URL}/api/admin/products/${id}`, getAuthHeader())
            return id  // ✅ return id string for reducer to filter
        } catch (err) {
            return rejectWithValue(err.response?.data || { message: err.message })
        }
    }
)

const adminProductSlice = createSlice({
    name: "adminProducts",
    initialState: {
        products: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchAdminProducts.pending, (state) => { state.loading = true; state.error = null })
            .addCase(fetchAdminProducts.fulfilled, (state, action) => {
                state.loading = false
                state.products = action.payload
            })
            .addCase(fetchAdminProducts.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload?.message || action.error.message
            })

            // Create
            .addCase(createProduct.pending, (state) => { state.loading = true; state.error = null })
            .addCase(createProduct.fulfilled, (state, action) => {
                state.loading = false
                state.products.push(action.payload)
            })
            .addCase(createProduct.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload?.message || action.error.message
            })

            // Update
            .addCase(updateProduct.pending, (state) => { state.loading = true; state.error = null })
            .addCase(updateProduct.fulfilled, (state, action) => {
                state.loading = false
                const index = state.products.findIndex(p => p._id === action.payload._id)
                if (index !== -1) state.products[index] = action.payload
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload?.message || action.error.message
            })

            // Delete
            .addCase(deleteProduct.pending, (state) => { state.loading = true; state.error = null })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.loading = false
                state.products = state.products.filter(p => p._id !== action.payload) // ✅ action.payload is id string
            })
            .addCase(deleteProduct.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload?.message || action.error.message
            })
    }
})

export default adminProductSlice.reducer