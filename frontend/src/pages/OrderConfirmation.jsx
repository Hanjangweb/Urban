import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { clearCart } from '../redux/slices/cartSlice'

const OrderConfirmation = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { checkout } = useSelector((state) => state.checkout)

    useEffect(() => {
        if (checkout && checkout._id) {
            dispatch(clearCart())
            localStorage.removeItem("cart")
        } else {
            // Redirect if someone tries to access this page directly without an order
            navigate("/my-orders") 
        }
    }, [checkout, dispatch, navigate])

    const calculateEstimateDelivery = (createdAt) => {
        const orderDate = new Date(createdAt)
        orderDate.setDate(orderDate.getDate() + 10)
        return orderDate.toLocaleDateString()
    }

    // If checkout is missing during a refresh, show a loader instead of crashing
    if (!checkout) return <div className='text-center py-20'>Loading order details...</div>

    return (
        <div className='max-w-4xl mx-auto p-6 bg-white'>
            <h1 className='text-4xl font-bold text-center text-emerald-700 mb-8'>
                Thank you for your order!
            </h1>

            <div className='p-6 rounded-lg border'>
                <div className='flex flex-col md:flex-row justify-between mb-10 gap-4'>
                    <div>
                        <h2 className='text-xl font-semibold'>Order ID: {checkout._id}</h2>
                        <p className='text-gray-600'>
                            Order Date: {new Date(checkout.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                    <div>
                        <p className='text-emerald-700 font-medium'>
                            Estimated Delivery: {calculateEstimateDelivery(checkout.createdAt)}
                        </p>
                    </div>
                </div>

                {/* Order items */}
                <div className='mb-10'>
                    {checkout.checkoutItems?.map((item) => (
                        <div className='flex items-center mb-4 border-b pb-4' key={item.productId || item._id}>
                            <img src={item.image} alt={item.name} className='w-16 h-16 object-cover rounded-md mr-4' />
                            <div>
                                <h4 className='text-md font-semibold'>{item.name}</h4>
                                <p className='text-sm text-gray-500'>{item.color} | {item.size}</p>
                            </div>
                            <div className='ml-auto text-right'>
                                <p className='text-md font-semibold'>$ {item.price}</p>
                                <p className='text-sm text-gray-500'>Qty: {item.quantity}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Payment and Delivery info */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-8 border-t pt-6'>
                    <div>
                        <h4 className='text-lg font-semibold mb-2'>Payment</h4>
                        <p className='text-gray-600'>{checkout.paymentMethod || "PayPal"}</p>
                        <p className='text-sm text-emerald-600 font-medium'>Status: Paid</p>
                    </div>
                    <div>
                        <h4 className='text-lg font-semibold mb-2'>Delivery Address</h4>
                        {/* Fixed spelling to shippingAddress */}
                        <p className='text-gray-600'>{checkout.shippingAddress?.address}</p>
                        <p className='text-gray-600'>
                            {checkout.shippingAddress?.city}, {checkout.shippingAddress?.country}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OrderConfirmation