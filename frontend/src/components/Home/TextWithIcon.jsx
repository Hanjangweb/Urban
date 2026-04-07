import React from 'react'
import { HiArrowPathRoundedSquare, HiChatBubbleLeftRight, HiOutlineCreditCard, HiShoppingBag } from 'react-icons/hi2'

const TextWithIcon = () => {
  return (
    <>
      <section className='py-16 px-4 bg-white'>
        <div className='container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-center'>
            {/* Feature 1 */}
            <div className='flex flex-col items-center'>
                <div className='p-4 rounded-full mb-4'>
                    <HiShoppingBag className='text-4xl ' />
                </div>
                <h4 className='tracking-tighter mb-2 uppercase'>Free international Shipping</h4>
                <p className='text-gray-600 text-sm tracking-tighter'>On all orders over $100.00</p>
            </div>
             {/* Feature 2 */}
            <div className='flex flex-col items-center'>
                <div className='p-4 rounded-full mb-4'>
                    <HiArrowPathRoundedSquare className='text-4xl' />
                </div>
                <h4 className='tracking-tighter mb-2 uppercase'>45 days return</h4>
                <p className='text-gray-600 text-sm tracking-tighter'>Money back gaurantee</p>
            </div>
             {/* Feature 3 */}
            <div className='flex flex-col items-center'>
                <div className='p-4 rounded-full mb-4'>
                    <HiOutlineCreditCard className='text-4xl' />
                </div>
                <h4 className='tracking-tighter mb-2 uppercase'>Secure checkout</h4>
                <p className='text-gray-600 text-sm tracking-tighter'>100% secure checkout process</p>
            </div>
             {/* Feature 4 */}
            <div className='flex flex-col items-center'>
                <div className='p-4 rounded-full mb-4'>
                    <HiChatBubbleLeftRight className='text-4xl' />
                </div>
                <h4 className='tracking-tighter mb-2 uppercase'>24/7 Support</h4>
                <p className='text-gray-600 text-sm tracking-tighter'>We are here to assist anytime.</p>
            </div>
        </div>
      </section>
    </>
  )
}

export default TextWithIcon
