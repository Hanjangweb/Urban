import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useParams } from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux'
import { fetchProductDetails, fetchSimilarProducts } from '../../redux/slices/productSlice'
import { addToCart, openCart } from '../../redux/slices/cartSlice'
import ProductGrid from './ProductGrid'

const ProductDetails = ({ productId }) => {
    const { id } = useParams()
    const dispatch = useDispatch()
    const { selectedProduct, loading, error, similarProducts } = useSelector((state) => state.products)
    const { user, guestId } = useSelector((state) => state.auth)

    const [mainImage, setMainImage] = useState(null)
    const [selectedSize, setSelectedSize] = useState("")
    const [selectedColor, setSelectedColor] = useState("")
    const [quantity, setQuantity] = useState(1)
    const [isButtonDisabled, setIsButtonDisabled] = useState(false)

    const productFetchId = productId ?? id

    useEffect(() => {
        if (!productFetchId || typeof productFetchId !== "string") return
        dispatch(fetchProductDetails(productFetchId))
        dispatch(fetchSimilarProducts(productFetchId))
    }, [dispatch, productFetchId])

    useEffect(() => {
        if (selectedProduct?.images?.[0]?.url) {
            setMainImage(selectedProduct.images[0].url)
        }
    }, [selectedProduct])

    const handleQuantityChange = (action) => {
        if (action === "minus") setQuantity((prev) => prev > 1 ? prev - 1 : 1)
        if (action === "plus") setQuantity((prev) => prev + 1)
    }

    const handleAddToCart = () => {
        if (!selectedColor || !selectedSize) {
            toast.error("Please select size and color", { duration: 1000 })
            return
        }
        setIsButtonDisabled(true)
        dispatch(addToCart({
            productId: productFetchId,
            quantity,
            size: selectedSize,
            color: selectedColor,
            guestId,
            userId: user?._id
        }))
            .then(() => {
                toast.success("Product added to cart!", { duration: 1000 })
                dispatch(openCart())
            })
            .finally(() => setIsButtonDisabled(false))
    }

    if (loading) return <div className='p-10 text-center'>Loading...</div>
    if (error) return <div className='p-10 text-center text-red-500'>Error: {error}</div>

    return (
        <section className='p-6'>
            {selectedProduct && (
                <div className='max-w-6xl mx-auto bg-white p-8 rounded-lg'>
                    <div className='flex flex-col md:flex-row gap-10'>
                        {/* LEFT SIDE: IMAGES */}
                        <div className='flex flex-col-reverse md:flex-row md:w-1/2 gap-4'>
                            {/* THUMBNAILS */}
                            <div className='flex md:flex-col overflow-x-auto md:overflow-y-auto gap-4 scrollbar-hide md:w-24'>
                                {selectedProduct?.images?.map((image, index) => (
                                    <img
                                        key={index}
                                        src={image.url}
                                        alt="thumb"
                                        className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 transition 
                                        ${mainImage === image.url ? "border-black" : "border-transparent"}`}
                                        onClick={() => setMainImage(image.url)}
                                    />
                                ))}
                            </div>
                            {/* MAIN IMAGE */}
                            <div className='flex-1'>
                                <img
                                    src={mainImage}
                                    alt="product"
                                    className='w-full h-full max-h-[600px] object-cover rounded-lg'
                                />
                            </div>
                        </div>

                        {/* RIGHT SIDE: INFO */}
                        <div className='md:w-1/2 flex flex-col gap-6'>
                            <div>
                                <h1 className='text-3xl font-bold mb-2'>{selectedProduct.name}</h1>
                                <div className='flex items-center gap-4 text-xl'>
                                    <span className='text-gray-400 line-through'>${selectedProduct.originalPrice}</span>
                                    <span className='font-semibold text-black'>${selectedProduct.price}</span>
                                </div>
                            </div>

                            <p className='text-gray-600 leading-relaxed'>{selectedProduct.description}</p>

                            {/* COLORS */}
                            <div>
                                <p className='font-medium mb-3'>Color:</p>
                                <div className='flex gap-3'>
                                    {selectedProduct?.colors?.map((color) => (
                                        <button
                                            key={color}
                                            onClick={() => setSelectedColor(color)}
                                            className={`w-10 h-10 rounded-full border-2 transition-all 
                                            ${selectedColor === color ? "border-black scale-110 shadow-md" : "border-gray-200"}`}
                                            style={{ backgroundColor: color.toLowerCase() }}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* SIZES */}
                            <div>
                                <p className='font-medium mb-3'>Size:</p>
                                <div className='flex gap-3'>
                                    {selectedProduct?.sizes?.map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`w-12 h-12 flex items-center justify-center border-2 rounded-md transition-all 
                                            ${selectedSize === size ? "bg-black text-white border-black" : "border-gray-200 hover:border-black"}`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* QUANTITY SELECTOR */}
                            <div className='flex flex-col gap-4 mt-4'>
                                <p className='font-medium'>Quantity:</p>
                                <div className='flex items-center gap-6 border w-fit px-4 py-2 rounded-lg bg-gray-50'>
                                    <button
                                        onClick={() => handleQuantityChange("minus")}
                                        className='text-2xl font-medium hover:text-red-500 transition-colors px-2'
                                    >
                                        −
                                    </button>
                                    <span className='text-lg font-semibold w-6 text-center select-none'>
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={() => handleQuantityChange("plus")}
                                        className='text-2xl font-medium hover:text-green-500 transition-colors px-2'
                                    >
                                        +
                                    </button>
                                </div>

                                <button
                                    onClick={handleAddToCart}
                                    disabled={isButtonDisabled}
                                    className='bg-black text-white py-4 rounded-lg font-bold tracking-widest hover:bg-gray-800 transition-all active:scale-[0.98] disabled:bg-gray-400 mt-2'
                                >
                                    {isButtonDisabled ? "ADDING..." : "ADD TO CART"}
                                </button>
                            </div>
                            {/* CHARACTERISTICS */}
                            <div className='mt-6 border-t pt-6'>
                                <h3 className='text-lg font-bold mb-4'>Characteristics:</h3>
                                <div className='grid grid-cols-2 gap-y-2 text-sm'>
                                    <span className='text-gray-500'>Brand</span>
                                    <span className='font-medium'>{selectedProduct.brand}</span>
                                    <span className='text-gray-500'>Material</span>
                                    <span className='font-medium'>{selectedProduct.material}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SIMILAR PRODUCTS */}
                    <div className='mt-24'>
                        <h2 className='text-2xl text-center font-bold mb-10'>You may also like</h2>
                        <ProductGrid products={similarProducts} loading={loading} error={error} />
                    </div>
                </div>
            )}
        </section>
    )
}

export default ProductDetails