import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchAdminProducts } from '../redux/slices/adminProductSlice'
import { fetchAllOrders } from '../redux/slices/adminOrderSlice'

const AdminHomePage = () => {
    const dispatch = useDispatch()
    
    const {
        products = [], // Default to empty array
        loading: productsLoading,
        error: productsError,
    } = useSelector((state) => state.adminProducts)

    const {
        orders = [], // Default to empty array
        totalOrders,
        totalSales,
        loading: ordersLoading,
        error: ordersError,
    } = useSelector((state) => state.adminOrders)

    useEffect(() => {
        dispatch(fetchAdminProducts())
        dispatch(fetchAllOrders())
    }, [dispatch])

    // Loading State
    if (productsLoading || ordersLoading) {
        return <div className="p-6 text-center">Loading Dashboard Data...</div>
    }

    return (
        <div className='max-w-7xl mx-auto p-6'> {/* Fixed mx-auto */}
            <h1 className='text-3xl font-bold mb-6'>Dashboard</h1>

            {productsError || ordersError ? (
                <p className='text-red-500'>
                    Error: {productsError || ordersError}
                </p>
            ) : (
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {/* Revenue Card */}
                    <div className='p-4 shadow-md rounded-lg bg-white border'>
                        <h2 className='text-xl font-semibold'>Revenue</h2>
                        <p className='text-2xl font-bold'>${totalSales.toFixed(2)}</p>
                    </div>

                    {/* Total Orders Card */}
                    <div className='p-4 shadow-md rounded-lg bg-white border'>
                        <h2 className='text-xl font-semibold'>Total Orders</h2>
                        <p className='text-2xl font-bold'>{totalOrders || 0}</p>
                        <Link to="/admin/orders" className='text-blue-500 hover:underline text-sm'>
                            Manage Orders
                        </Link>
                    </div>

                    {/* Total Products Card */}
                    <div className='p-4 shadow-md rounded-lg bg-white border'>
                        <h2 className='text-xl font-semibold'>Total Products</h2>
                        <p className='text-2xl font-bold'>{products.length}</p>
                        <Link to="/admin/products" className='text-blue-500 hover:underline text-sm'>
                            Manage Products {/* Fixed text */}
                        </Link>
                    </div>
                </div>
            )}

            {/* Recent Orders Table */}
            <div className='mt-12'>
                <h2 className='text-2xl font-bold mb-6'>Recent Orders</h2>
                <div className='overflow-x-auto bg-white rounded-lg shadow'>
                    <table className='min-w-full text-left text-gray-500'>
                        <thead className='bg-gray-100 text-xs uppercase text-gray-700'>
                            <tr>
                                <th className='py-3 px-4'>Order ID</th>
                                <th className='py-3 px-4'>User</th>
                                <th className='py-3 px-4'>Total Price</th>
                                <th className='py-3 px-4'>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.length > 0 ? (
                                // Show only the 5 most recent orders for a "Recent Orders" feel
                                orders.slice(0, 5).map((order) => (
                                    <tr className='border-b hover:bg-gray-50 cursor-pointer' key={order._id}>
                                        <td className='p-4 text-sm font-medium text-gray-900'>#{order._id.slice(-6)}</td>
                                        <td className='p-4 text-sm'>{order.user?.name || "Guest"}</td>
                                        <td className='p-4 text-sm'>${order.totalPrice.toFixed(2)}</td>
                                        <td className='p-4 text-sm'>
                                            <span className={`px-2 py-1 rounded text-xs ${
                                                order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className='p-4 text-center text-gray-500 italic'>
                                        No recent orders found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default AdminHomePage