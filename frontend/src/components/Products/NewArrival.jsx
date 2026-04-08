import React, { useEffect, useRef, useState } from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import axios from "axios"

const NewArrival = () => {
    const scrollRef = useRef(null)
    const [isDragging, setIsDragging] = useState(false)
    const [startX, setStartX] = useState(0)
    const [scrollLeft, setScrollLeft] = useState(0)
    const [canScrollLeft, setCanScrollLeft] = useState(false)
    const [canScrollRight, setCanScrollRight] = useState(true)
    const [newArrivals, setNewArrivals] = useState([])

    useEffect(() => {
        let isMounted = true

        const fetchNewArrivals = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/api/products/new-arrival`
                )
                if (isMounted) {
                    setNewArrivals(response.data)
                }
            } catch (err) {
                console.error(err)
            }
        }

        fetchNewArrivals()

        return () => {
            isMounted = false
        }
    }, [])

    const handleMouseDown = (e) => {
        setIsDragging(true)
        setStartX(e.pageX - scrollRef.current.offsetLeft)
        setScrollLeft(scrollRef.current.scrollLeft)
    }

    const handleMouseMove = (e) => {
        if (!isDragging) return
        const x = e.pageX - scrollRef.current.offsetLeft
        const walk = (x - startX) * 2
        scrollRef.current.scrollLeft = scrollLeft - walk
    }

    const handleMouseUpOrLeave = () => {
        setIsDragging(false)
    }

    // Scroll direction
    const scroll = (direction) => {
        const scrollAmount = direction === "left" ? -300 : 300
        scrollRef.current.scrollBy({
            left: scrollAmount,
            behavior: "smooth"
        })
    }

    // Update scroll buttons
    const updateScrollButtons = () => {
        const container = scrollRef.current
        if (container) {
            const leftScroll = container.scrollLeft
            const rightScrollable =
                container.scrollWidth - (leftScroll + container.clientWidth) > 5

            setCanScrollLeft(leftScroll > 0)
            setCanScrollRight(rightScrollable)
        }
    }  // removed console.log outside the if(container) block — would crash if container is null

    useEffect(() => {
        const container = scrollRef.current
        if (container) {
            container.addEventListener("scroll", updateScrollButtons)
            updateScrollButtons()
            return () => container.removeEventListener("scroll", updateScrollButtons)
        }
    }, [newArrivals])

    return (
        <section className=' px-4 lg:px-0'>
            <div className='container mx-auto text-center mb-10 relative'>
                <h2 className='text-3xl font-bold mb-4'>Explore New Arrivals</h2>
                <p>Discover the latest styles straight off the runway, freshly added to keep your wardrobe on the cutting edge of fashion.</p>
                {/* Scroll buttons */}
                <div className='absolute right-0 top-1 hidden sm:flex space-x-2'>
                    <button
                        onClick={() => scroll("left")}
                        disabled={!canScrollLeft}
                        className={`p-2 rounded border ${canScrollLeft
                            ? "bg-white text-black"
                            : "bg-gray-200 cursor-not-allowed"
                            }`}>
                        <FiChevronLeft className='text-2xl' />
                    </button>
                    <button
                        onClick={() => scroll("right")}
                        disabled={!canScrollRight}
                        className={`p-2 rounded border ${canScrollRight
                            ? "bg-white text-black"
                            : "bg-gray-200 cursor-not-allowed"
                            }`}>
                        <FiChevronRight className='text-2xl' />
                    </button>
                </div>

                {/* Scrollable content */}
                {/* Scrollable content */}
                <div
                    ref={scrollRef}
                    style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
                    className="mt-6 overflow-x-scroll no-scrollbar flex space-x-6"
                    onMouseDown={handleMouseDown}
                    onMouseLeave={handleMouseUpOrLeave}
                    onMouseUp={handleMouseUpOrLeave}
                    onMouseMove={handleMouseMove}
                >
                    {newArrivals.map((product) => (
                        <div
                            key={product._id}
                            className={`min-w-[70%] sm:min-w-[50%] lg:min-w-[30%] relative rounded-lg overflow-hidden transition-shadow duration-300 ${!isDragging ? 'hover:shadow-xl' : ''
                                }`}
                        >
                            <img
                                src={product.images[0]?.url}
                                alt={product.images[0]?.altText || product.name}
                                className='w-full h-[400px] md:h-[500px] object-cover'
                                draggable="false"
                            />
                            {/* Overlay */}
                            <div className='absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 backdrop-blur-md text-white p-4 rounded-b-lg'>
                                <Link
                                    to={`/product/${product._id}`}
                                    onClick={(e) => isDragging && e.preventDefault()}
                                    className='block'
                                >
                                    <h4 className='font-medium'>{product.name}</h4>
                                    <p className='mt-1'>${product.price}</p>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default NewArrival