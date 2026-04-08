import React, { useEffect, useRef, useState } from 'react'
import { FaFilter } from 'react-icons/fa'
import FilterSidebar from '../components/Products/FilterSidebar'
import SortOptions from '../components/Products/SortOptions'
import ProductGrid from '../components/Products/ProductGrid'
import  { useParams, useSearchParams } from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux'
import { fetchProductsByFilters } from '../redux/slices/productSlice'


const CollectionPage = () => {
    const { collection } = useParams()
    const [searchParams] = useSearchParams()
    const dispatch = useDispatch()
    const { products, loading, error } = useSelector((state) => state.products)
    const queryParams = Object.fromEntries([...searchParams ])
    const sidebarRef = useRef(null)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    useEffect(() => {
        dispatch(fetchProductsByFilters({ collection, ...queryParams }))
    }, [dispatch, collection, searchParams ])


    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen)
    }

    const handleClickOutside = (e) => {
        //Close sidebar if click outside
        if(sidebarRef.current && !sidebarRef.current.contains(e.target)) {
            setIsSidebarOpen(false)
        }
    }

    useEffect(() => {
        //Add Eventlistener for click
        document.addEventListener("mousedown", handleClickOutside)
        //clean Event listener
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
       
    },[])

    useEffect(() => {
        if(isSidebarOpen){
            document.body.style.overflow = "hidden"
        }else{
            document.body.style.overflow = ''
        }
        return () => {
            document.body.style.overflow = ''
        }
    },[isSidebarOpen])
  return (
    <>
    <div className='flex flex-col lg:flex-row'>
        {/* Overlay */}
        {isSidebarOpen && (
            <div
                className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
                onClick={() => setIsSidebarOpen(false)}
            />
        )}

        {/* Mobile filter button */}
        <button onClick={toggleSidebar } className='lg:hidden border p-2 flex items-center'>
            <FaFilter className="mr-2" /> Filters
        </button>
        {/* Filter Sidebar */}
        <div ref={sidebarRef} className={`${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} fixed inset-y-0 z-50 left-0 w-64 bg-white overflow-y-auto transition-transform duration-300 lg:static lg:translate-x-0 lg:shrink-0`}>
            <FilterSidebar className="" />
        </div>
        <div className='flex-grow p-4'>
            {/* Sort options */}
            <SortOptions />
            {/* Product grid */}
            <ProductGrid products={products} loading={loading} error={error}/>
        </div>
    </div>
    </>
  )
}

export default CollectionPage
