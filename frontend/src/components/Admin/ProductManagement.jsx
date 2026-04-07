import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { deleteProduct, fetchAdminProducts } from '../../redux/slices/adminProductSlice'

const ProductManagement = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    // Fixed "cost" to "const"
    // Added default value [] to prevent crash if products is null
    const { products = [], loading, error } = useSelector((state) => state.adminProducts)

    useEffect(() => {
        dispatch(fetchAdminProducts())
    }, [dispatch])

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete the product?")) {
            dispatch(deleteProduct(id))
        }
    }

    return (
        <div className='max-w-7xl mx-auto p-6'> {/* Fixed max-auto to mx-auto */}
            <div className="flex justify-between items-center mb-6">
                <h2 className='text-2xl font-bold'>Product Management</h2>
                {/* Added Missing "Add Product" Button */}
                <Link
                    to="/admin/products/create"
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                >
                    Add Product
                </Link>
            </div>

            {loading && <p className="text-blue-500">Loading products...</p>}
            {error && <p className="text-red-500 mb-4">Error: {error}</p>}

            <div className='overflow-x-auto shadow-md sm:rounded-lg bg-white'>
                <table className='min-w-full text-left text-gray-500'>
                    <thead className='bg-gray-100 text-xs uppercase text-gray-700'>
                        <tr>
                            <th className='py-3 px-4'>Name</th>
                            <th className='py-3 px-4'>Price</th>
                            <th className='py-3 px-4'>SKU</th>
                            <th className='py-3 px-4'>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.length > 0 ? (
                            products.map((product) => (
                                <tr className='border-b hover:bg-gray-50' key={product._id}>
                                    <td className='p-4 font-medium text-gray-900 whitespace-nowrap'>{product.name}</td>
                                    <td className='p-4'>${product.price}</td>
                                    <td className='p-4'>{product.sku}</td>
                                    <td className='p-4'>
                                        <div className='flex gap-2'>
                                            <Link
                                                to={`/admin/products/${product._id}/edit`}
                                                className='bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm'
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(product._id)}
                                                className='bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700 text-sm'
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className='p-4 text-center text-gray-500' >
                                    No products found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ProductManagement