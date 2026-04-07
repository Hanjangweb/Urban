import React, { useRef, useState } from 'react'

const TabCollection = () => {
const [activeTab, setActiveTab] = useState("men")
const scrollRef = useRef(null);

 // 👉 Products
  const menProducts = [
    { _id: "1", name: "Men Jacket", price: 500, images: [{ url: "https://picsum.photos/500/500?random=11" }] },
    { _id: "2", name: "Men Shirt", price: 400, images: [{ url: "https://picsum.photos/500/500?random=12" }] },
    { _id: "3", name: "Men Shoes", price: 700, images: [{ url: "https://picsum.photos/500/500?random=13" }] },
    { _id: "4", name: "Men Jacket", price: 500, images: [{ url: "https://picsum.photos/500/500?random=14" }] },
    { _id: "5", name: "Men Shirt", price: 400, images: [{ url: "https://picsum.photos/500/500?random=15" }] },
    { _id: "6", name: "Men Shoes", price: 700, images: [{ url: "https://picsum.photos/500/500?random=16" }] },
  ]

  const womenProducts = [
    { _id: "7", name: "Women Dress", price: 600, images: [{ url: "https://picsum.photos/500/500?random=21" }] },
    { _id: "8", name: "Women Top", price: 450, images: [{ url: "https://picsum.photos/500/500?random=22" }] },
    { _id: "9", name: "Women Heels", price: 800, images: [{ url: "https://picsum.photos/500/500?random=23" }] },
    { _id: "10", name: "Women Dress", price: 600, images: [{ url: "https://picsum.photos/500/500?random=24" }] },
    { _id: "11", name: "Women Top", price: 450, images: [{ url: "https://picsum.photos/500/500?random=25" }] },
    { _id: "12", name: "Women Heels", price: 800, images: [{ url: "https://picsum.photos/500/500?random=26" }] },
  ]

  const products = activeTab === "men" ? menProducts : womenProducts
  return (
    <>
      <section className='py-10 relative'>
        <div className='Container mx-auto'>
            {/* Tab */}
            <div className='flex justify-center mb-6 space-x-6'>
                <button
                onClick={() => setActiveTab("men")}
                className={`py-2 px-6 rounded ${activeTab === 'men' ? "bg-black text-white" : "bg-gray-200"}`}
                >
                    Men's Collection
                </button>
                <button
                onClick={() => setActiveTab("women")}
                className={`py-2 px-6 rounded ${activeTab === "women" ?  "bg-black text-white" : "bg-gray-200" }`}
                >
                    Women's Collection
                </button>
            </div>
           
            {/* slider  */}
            <div
            ref={scrollRef}
            className='flex overflow-x-auto space-x-6 no-scrollbar scroll-smooth'>
                {products.map((product) => (
                    <div key={product._id} className='min-w-[50%] lg:min-w-[25%] p-4  rounded-lg shadow'>
                        <img src={product.images[0].url} alt={product.name} className='w-full h-full object-cover rounded-lg mb-2' />
                        <h3 className='text-sm font-medium'>{product.name}</h3>
                        <p className='text-gray-500'>$ {product.price}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>
    </>
  )
}

export default TabCollection
