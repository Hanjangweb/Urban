import React from 'react'
import { Link } from 'react-router-dom'
import FeaturedImage from "../../assets/featured.webp"
const ImageWithText = () => {
  return (
    <>
      <section className=' px-4 lg:px-0'>
        <div className='my-3'>
          <h3 className='p-6 mb-10 text-center font-bold uppercase text-3xl'>Comfort First, Compliments Later</h3>
        </div>
        <div className='constainer mx-auto flex flex-col-reverse lg:flex-row items-center bg-green-50 rounded-3xl'>
          {/* left content */}
          <div className='lg:w-1/2 p-8 text-center lg:text-left'>
            <h2 className='text-lg font-semibold text-gray-700 mb-2'>
              Comfort and Style
            </h2>
            <h2 className='text-4xl lg:text-5xl font-bold mb-6'>
              Apparel made for your everyday life
            </h2>
            <p className='text-lg text-gray-600 mb-6'>
              Discover high-quality, comfortable clothing that effortless blends fashion and funtion. Designed to make you look and feel great every day .
            </p>
            <Link 
              to="/collections/all"
              className='bg-black text-white px-6 py-3 rounded-lg text-lg hover:bg-gray-800'
            >
              Shop Now
            </Link>
          </div>
          {/* Ro\ight Content */}
          <div className='lg:w-1/2'>
            <img src={FeaturedImage} alt="Image" className='w-full h-full object-cover lg:rounded-tr-3xl lg:rounded-br-3xl' ></img>
          </div>
        </div>
      </section>
    </>
  )
}

export default ImageWithText
