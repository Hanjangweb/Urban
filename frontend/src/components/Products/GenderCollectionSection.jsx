import React from 'react'
import MenCollections from '../../assets/mens-collection.webp'
import WomenCollections from '../../assets/womens-collection.webp'
import { Link } from 'react-router-dom'
const GenderCollectionSection = () => {
  return (
    <>
      <section className='py-16 px-4 lg:px-0'>
        <div className='container mx-auto flex flex-col md:flex-row gap-8'>
            {/* Women collection */}
            <div className='relative flex-1'>
                <img src={WomenCollections} alt="Women collection" className='w-full h-[400px] md:h-[700px]  object-cover' />
                <div className='absolute bottom-8 left-8 text-center bg-transparent md:bg-white bg-opacity-90 p-4'>
                    <h2 className='text-2xl font-bold text-white md:text-gray-900 mb-3'>Women's collection</h2>
                    <Link to="/collections/all?gender=Women" className='text-white md:text-gray-900 underline'>
                        Shop Now
                    </Link>
                </div>
            </div>
            {/* Men's collection */}
            <div className='relative flex-1'>
                <img src={MenCollections} alt="men collection" className='w-full h-[400px] md:h-[700px] object-cover' />
                <div className='absolute bottom-8 left-8 text-center bg-transparent md:bg-white bg-opacity-90 p-4'>
                    <h2 className='text-2xl font-bold text-white md:text-gray-900 mb-3'>Men's collection</h2>
                    <Link to="/collections/all?gender=Men" className='text-white md:text-gray-900 underline'>
                        Shop Now
                    </Link>
                </div>
            </div>
        </div>
      </section>
    </>
  )
}

export default GenderCollectionSection
