import React from 'react'
import HeroImage from '../../assets/rabbit-hero.webp'
import { Link } from 'react-router-dom'
const Hero = () => {
  return (
    <>
      <section className='relative'>
        <img src={HeroImage} alt="" className='w-full h-[400px] md:h-[600px] lg:h-[750px] object-cover' />

        <div className='absolute inset-0 bg-black bg-opacity-5 flex items-center justify-center'>
            <div className='text-center text-white p-6'>
                <h1 className="text-4xl md:text-9xl font-bold mb-4 uppercase tracking-tighter">
                 Vacation <br /> Ready
                </h1>
                <p className='tracking-tighter md:text-lg text-sm mb-6'>Explore our vacation-ready outfits with fast worldwide shipping.</p>
                <Link to="/collections/all" className='bg-white text-gray-950 px-6 py-2 rounded-sm text-lg hover:bg-gray-400'>
                    Shop
                </Link>
            </div>
        </div>
      </section>
    </>
  )
}
        
export default Hero