import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import { fetchOrderDetails } from '../redux/slices/orderSlice'

const OrderDetailsPage = () => {
    const { id } = useParams()
    const dispatch = useDispatch()
    const { orderDetails, loading, error } = useSelector((state) => state.orders)

    useEffect(() => {
        dispatch(fetchOrderDetails(id))
    }, [dispatch, id])

    if (loading) return <div className="p-10 text-center">Loading...</div>
    if (error) return <div className="p-10 text-center text-red-500">Error: {error}</div>

    return (
        <section className='max-w-7xl mx-auto p-4 sm:p-6'>
            <h2 className='text-2xl md:text-3xl font-bold mb-6'>Order Details</h2>
            
            {!orderDetails ? (
                <p>No order details found</p>
            ) : (
                <div className='p-4 sm:p-8 rounded-lg border border-gray-200 bg-white'>
                    {/* Header Info: ID, Date, and Status Badges */}
                    <div className='flex flex-col sm:flex-row justify-between items-start mb-8 border-b pb-6 gap-4'>
                        <div>
                            <h3 className='text-lg md:text-xl font-semibold uppercase tracking-tight'>
                                Order ID: #{orderDetails._id}
                            </h3>
                            <p className='text-gray-500 mt-1'>
                                {new Date(orderDetails.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                        <div className='flex flex-col gap-2 sm:items-end'>
                            <span className={`${orderDetails.isPaid ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"} px-4 py-1 rounded-full text-xs font-bold uppercase`}>
                                {orderDetails.isPaid ? "Approved" : "Pending Payment"}
                            </span>
                            <span className={`${orderDetails.isDelivery ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600"} px-4 py-1 rounded-full text-xs font-bold uppercase`}>
                                {orderDetails.isDelivery ? "Delivered" : "Delivery Pending"}
                            </span>
                        </div>
                    </div>

                    {/* Customer, Payment, and Shipping info Grid */}
                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-10'>
                        <div>
                            <h4 className='text-xs uppercase text-gray-400 font-bold mb-3 tracking-wider'>Payment Info</h4>
                            <p className="text-gray-700"><strong>Method:</strong> {orderDetails.paymentMethod}</p>
                            <p className="text-gray-700"><strong>Status:</strong> {orderDetails.isPaid ? "Paid" : "Unpaid"}</p>
                        </div>
                        <div>
                            <h4 className='text-xs uppercase text-gray-400 font-bold mb-3 tracking-wider'>Shipping Info</h4>
                            <p className="text-gray-700"><strong>Method:</strong> {orderDetails.shippingMethod}</p>
                            <p className="text-gray-700">
                                <strong>Address:</strong> {`${orderDetails.shippingAddress.city}, ${orderDetails.shippingAddress.country}`}
                            </p>
                        </div>
                    </div>

                    {/* Product List Table */}
                    <div className='overflow-x-auto'>
                        <h4 className='text-lg font-semibold mb-4'>Products</h4>
                        <table className='min-w-full text-gray-600 mb-4'>
                            <thead className='bg-gray-50 border-b border-gray-200'>
                                <tr>
                                    <th className='py-3 px-4 text-left font-semibold'>Name</th>
                                    <th className='py-3 px-4 text-center font-semibold'>Unit Price</th>
                                    <th className='py-3 px-4 text-center font-semibold'>Quantity</th>
                                    <th className='py-3 px-4 text-right font-semibold'>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orderDetails.orderItems.map((item) => (
                                    <tr className='border-b hover:bg-gray-50 transition' key={item.productId}>
                                        <td className='py-4 px-4 flex items-center'>
                                            <img src={item.image} alt={item.name} className='w-12 h-12 object-cover rounded-lg mr-4 border' />
                                            <Link to={`/product/${item.productId}`} className='text-blue-600 hover:underline font-medium'>
                                                {item.name}
                                            </Link>
                                        </td>
                                        <td className='py-4 px-4 text-center'>
                                            ${item.price.toLocaleString()}
                                        </td>
                                        <td className='py-4 px-4 text-center'>
                                            {item.quantity}
                                        </td>
                                        <td className='py-4 px-4 text-right font-semibold text-gray-900'>
                                            ${(item.price * item.quantity).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer: Back link */}
                    <div className="mt-8 border-t pt-6">
                        <Link to="/my-orders" className='text-blue-500 hover:text-blue-700 font-medium flex items-center'>
                            ← Back to my orders
                        </Link>
                    </div>
                </div>
            )}
        </section>
    )
}

export default OrderDetailsPage