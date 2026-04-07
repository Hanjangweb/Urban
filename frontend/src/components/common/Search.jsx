import React, { useEffect, useState } from 'react'
import { HiMagnifyingGlass, HiMiniXMark } from 'react-icons/hi2'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchProductsByFilters, setFilters } from '../../redux/slices/productSlice'

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // lock scroll 
  useEffect(() => {
    if(isOpen){
      document.body.style.overflow = "hidden"
    }else{
      document.body.style.overflow = "auto"
    }
    return () => {
      document.body.style.overflow = "auto"
    }
  },[isOpen])

  const handleSearchToggle = () => {
    setIsOpen(!isOpen)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      dispatch(setFilters({ search: searchTerm }))
      dispatch(fetchProductsByFilters({ search: searchTerm }))
      navigate(`/collections/all?search=${searchTerm}`)
      setIsOpen(false)
    }
  }

  return (
    <>
      {/* 1. THE OVERLAY (Backdrop) */}
      {/* This prevents mouse interaction with the rest of the page */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={handleSearchToggle} // Close search if clicking outside the bar
        />
      )}

      <div
        className={`flex items-center justify-center transition-all duration-300 
        ${isOpen ? "fixed top-0 left-0 w-full bg-white h-24 z-50 shadow-lg" : "w-auto"}`}
      >
        {isOpen ? (
          <form
            onSubmit={handleSearch}
            className="relative flex items-center justify-center w-full"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the form
          >
            {/* Input Container */}
            <div className="relative w-full max-w-xl px-4">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus // Automatically focus when search opens
                className="bg-gray-100 px-4 py-3 pr-12 rounded-lg focus:outline-none w-full text-lg border border-gray-200"
              />

              {/* Search Icon inside Input */}
              <button
                type="submit"
                className="absolute right-7 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-black"
              >
                <HiMagnifyingGlass className="h-6 w-6" />
              </button>
            </div>

            {/* Close Button at the far right */}
            <button
              type="button"
              onClick={handleSearchToggle}
              className="absolute right-6 text-gray-600 hover:text-black p-2"
            >
              <HiMiniXMark className="h-7 w-7" />
            </button>
          </form>
        ) : (
          <button onClick={handleSearchToggle} className="p-2">
            <HiMagnifyingGlass className="h-6 w-6 cursor-pointer text-gray-700 hover:text-black" />
          </button>
        )}
      </div>
    </>
  )
}

export default Search