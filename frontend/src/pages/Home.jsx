import React, { useState, useEffect } from 'react'
import Hero from '../components/Home/Hero'
import GenderCollectionSection from '../components/Products/GenderCollectionSection'
import NewArrival from '../components/Products/NewArrival'
import ProductDetails from '../components/Products/ProductDetails'
import ProductGrid from '../components/Products/ProductGrid'
import TabCollection from '../components/Home/TabCollection'
import ImageWithText from '../components/Home/ImageWithText'
import TextWithIcon from '../components/Home/TextWithIcon'
import Marquee from '../components/Home/Marquee'
import { useDispatch, useSelector } from "react-redux"
import { fetchProductsByFilters } from '../redux/slices/productSlice'
import BestSellerProducts from "../components/Products/BestSellerProducts"
import axios from "axios"

const Home = () => {
  const dispatch = useDispatch()
  const { products, loading, error } = useSelector((state) => state.products)
  const [bestSellerProduct, setBestSellerProduct] = useState(null)


  useEffect(() => {
    // Fetch product for a specific collection
    dispatch(
      fetchProductsByFilters({
        gender: "Women",
        category: "Bottom Wear",
        limit: 8,
      })
    )
    // Fetch best Seller products
    const fetchBestSeller = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/products/best-seller`,
        )
        setBestSellerProduct(response.data)
      } catch (err) {
        console.error(err)
      }
    }
    fetchBestSeller()
  },[dispatch])

  return (
    <div className='p-5'>
      <Hero />
      <Marquee />
      <GenderCollectionSection />
      <NewArrival />
      
      {/* <TabCollection /> */}
      <ImageWithText />
       {/* best seller */}
      <h2 className='text-3xl text-center font-bold mb-4 m-11'>Best Seller </h2>
      {bestSellerProduct ? (
        <BestSellerProducts productId={bestSellerProduct._id} />
      ):(
        <p>Loading best seller product ... </p>
      )}
      <div className='container mx-0'>
        <h2 className='text-3xl text-center font-bold mb-10 '>Top wears for Women </h2>
        <ProductGrid products={products} loading={loading} error={error} />
      </div>
     
      <TextWithIcon />

    </div>
  )
}

export default Home
