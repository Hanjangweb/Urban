import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUsers, addUser, deleteUser, updateUser } from '../../redux/slices/adminSlice'

const UserManagement = () => {
    const dispatch = useDispatch()
    const { user: currentUser } = useSelector((state) => state.auth) // The logged-in admin
    const { users = [], loading, error } = useSelector((state) => state.admin)
    
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "customer"
    })

    // 1. Fetch users on mount
    useEffect(() => {
        dispatch(fetchUsers())
    }, [dispatch])

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleFormSubmit = (e) => {
        e.preventDefault()
        dispatch(addUser(formData))
        setFormData({ name: "", email: "", password: "", role: "customer" })
    }

    const handleRoleChange = (userId, newRole) => {
        const userToUpdate = users.find(u => u._id === userId);
        dispatch(updateUser({ 
            id: userId, 
            role: newRole,
            name: userToUpdate.name, 
            email: userToUpdate.email 
        }));
    }

    const handleDeleteUser = (userId) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            dispatch(deleteUser(userId))
        }
    }

    return (
        <div className='max-w-7xl mx-auto p-6'>
            <h2 className='text-2xl font-bold mb-6'>User Management</h2>
            
            {loading && <p className="text-blue-500">Processing...</p>}
            {error && <p className="text-red-500 mb-4">Error: {error}</p>}

            {/* Add new user form */}
            <div className='p-6 rounded-lg mb-6 bg-gray-50 border'>
                <h3 className='text-lg font-bold mb-4'>Add New User</h3>
                <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" name='name' placeholder="Name" value={formData.name} onChange={handleChange} className='p-2 border rounded' required />
                    <input type="email" name='email' placeholder="Email" value={formData.email} onChange={handleChange} className='p-2 border rounded' required />
                    <input type="password" name='password' placeholder="Password" value={formData.password} onChange={handleChange} className='p-2 border rounded' required />
                    <select name="role" value={formData.role} onChange={handleChange} className='p-2 border rounded'>
                        <option value="customer">Customer</option>
                        <option value="admin">Admin</option>
                    </select>
                    <button className='md:col-span-2 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition' type='submit'>
                        Add User
                    </button>
                </form>
            </div>

            {/* User List */}
            <div className='overflow-x-auto shadow-md sm:rounded-lg'>
                <table className='min-w-full text-left text-gray-500'>
                    <thead className='bg-gray-100 text-xs uppercase text-gray-700'>
                        <tr>
                            <th className='py-3 px-4'>Name</th>
                            <th className='py-3 px-4'>Email</th>
                            <th className='py-3 px-4'>Role</th>
                            <th className='py-3 px-4'>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users?.map((u) => (
                            <tr className='border-b hover:bg-gray-50' key={u._id}>
                                <td className='p-4 font-medium text-gray-900'>{u.name}</td>
                                <td className='p-4'>{u.email}</td>
                                <td className='p-4'>
                                    <select 
                                        value={u.role} 
                                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                                        disabled={u._id === currentUser?._id}
                                        className='p-1 border rounded'
                                    >
                                        <option value="customer">Customer</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </td>
                                <td className='p-4'>
                                    <button 
                                        onClick={() => handleDeleteUser(u._id)}
                                        disabled={u._id === currentUser?._id}
                                        className={`${u._id === currentUser?._id ? 'bg-gray-300 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'} text-white px-4 py-2 rounded transition`}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default UserManagement