import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useParams } from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux'
import { fetchProductDetails, fetchSimilarProducts } from '../../redux/slices/productSlice'
import { addToCart } from '../../redux/slices/cartSlice'
import ProductGrid from './ProductGrid'


const BestSellerProducts = ({ productId }) => {

    const { id } = useParams()
    const dispatch = useDispatch()

    const { selectedProduct, loading, error, similarProducts } = useSelector(
        (state) => state.products
    )

    const { user, guestId } = useSelector((state) => state.auth)

    const [mainImage, setMainImage] = useState(null)
    const [selectedSize, setSelectedSize] = useState("")
    const [selectedColor, setSelectedColor] = useState("")
    const [quantity, setQuantity] = useState(1)
    const [isButtonDisabled, setIsButtonDisabled] = useState(false)

    // FIXED ID HANDLING
    const productFetchId = productId ?? id

    //FIXED API CALL (NO UNDEFINED / NO SPAM)
    useEffect(() => {
        if (!productFetchId || typeof productFetchId !== "string") return

        dispatch(fetchProductDetails(productFetchId))
        dispatch(fetchSimilarProducts(productFetchId))

    }, [dispatch, productFetchId])

    // SAFE IMAGE SET
    useEffect(() => {
        if (selectedProduct?.images?.[0]?.url) {
            setMainImage(selectedProduct.images[0].url)
        }
    }, [selectedProduct])

    // Quantity handler
    const handleQuantityChange = (action) => {
        if (action === "minus") setQuantity((prev) => prev > 1 ? prev - 1 : 1)
        if (action === "plus") setQuantity((prev) => prev + 1)
    }

    // Add to cart
    const handleAddToCart = () => {
        if (!selectedColor || !selectedSize) {
            toast.error("Please select size and color", { duration: 1000 })
            return
        }

        setIsButtonDisabled(true)

        dispatch(
            addToCart({
                productId: productFetchId,
                quantity,
                size: selectedSize,
                color: selectedColor,
                guestId,
                userId: user?._id
            })
        )
            .then(() => {
                toast.success("Product added to cart!", { duration: 1000 })
            })
            .finally(() => {
                setIsButtonDisabled(false)
            })
    }

    if (loading) return <p>Loading...</p>
    if (error) return <p>Error: {error}</p>

    return (
        <section className='p-6'>
            {selectedProduct && (
                <div className='max-w-6xl mx-auto bg-white p-8 rounded-lg'>

                    <div className='flex flex-col md:flex-row'>

                        {/* LEFT THUMBNAILS */}
                        <div className='hidden md:flex flex-col space-y-4 mr-6'>
                            {selectedProduct?.images?.map((image, index) => (
                                image?.url && (
                                    <img
                                        key={index}
                                        src={image.url}
                                        alt={image.altText || "thumb"}
                                        className={`w-20 h-20 object-cover rounded-lg cursor-pointer border 
                                        ${mainImage === image.url ? "border-black" : "border-gray-300"}`}
                                        onClick={() => setMainImage(image.url)}
                                    />
                                )
                            ))}
                        </div>

                        {/* MAIN IMAGE */}
                        <div className='md:w-1/2'>
                            <div className='mb-4'>
                                {mainImage ? (
                                    <img
                                        src={mainImage}
                                        alt="product"
                                        className='w-full h-auto object-cover rounded-lg'
                                        onError={(e) => e.target.src = "/placeholder.png"}
                                    />
                                ) : (
                                    <div className="w-full h-64 bg-gray-100 flex items-center justify-center">
                                        Loading image...
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* MOBILE THUMBNAILS */}
                        <div className='md:hidden flex overflow-x-scroll space-x-4 mb-4'>
                            {selectedProduct?.images?.map((image, index) => (
                                image?.url && (
                                    <img
                                        key={index}
                                        src={image.url}
                                        alt="thumb"
                                        className={`w-20 h-20 object-cover rounded-lg cursor-pointer border 
                                        ${mainImage === image.url ? "border-black" : "border-gray-300"}`}
                                        onClick={() => setMainImage(image.url)}
                                    />
                                )
                            ))}
                        </div>

                        {/* RIGHT SIDE */}
                        <div className='md:w-1/2 md:ml-10'>

                            <h1 className='text-2xl md:text-3xl font-semibold'>
                                {selectedProduct.name}
                            </h1>

                            <p className='line-through text-gray-500'>
                                {selectedProduct.originalPrice}
                            </p>

                            <p className='text-xl'>
                                ${selectedProduct.price}
                            </p>

                            <p className='text-gray-600'>
                                {selectedProduct.description}
                            </p>

                            {/* COLORS */}
                            <div className='mt-4'>
                                <p>Color:</p>
                                <div className='flex gap-2'>
                                    {selectedProduct?.colors?.map((color) => (
                                        <button
                                            key={color}
                                            onClick={() => setSelectedColor(color)}
                                            className={`w-8 h-8 rounded-full border 
                                            ${selectedColor === color ? "border-black border-4" : ""}`}
                                            style={{ backgroundColor: color.toLowerCase() }}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* SIZES */}
                            <div className='mt-4'>
                                <p>Size:</p>
                                <div className='flex gap-2'>
                                    {selectedProduct?.sizes?.map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`px-4 py-2 border 
                                            ${selectedSize === size ? "bg-black text-white" : ""}`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* QUANTITY */}
                            <div className='mt-4 flex items-center gap-4'>
                                <button onClick={() => handleQuantityChange("minus")}>-</button>
                                <span>{quantity}</span>
                                <button onClick={() => handleQuantityChange("plus")}>+</button>
                            </div>

                            {/* ADD TO CART */}
                            <button
                                onClick={handleAddToCart}
                                disabled={isButtonDisabled}
                                className='bg-black text-white w-full mt-4 py-2'
                            >
                                {isButtonDisabled ? "Adding..." : "ADD TO CART"}
                            </button>

                            <div className='mt-10 text-gray-700'>
                                <h3 className='text-xl font-bold mb-'>Characteristics:</h3>
                                <table className='w-full text-left text-sm text-gray-600'>
                                    <tbody>
                                        <tr>
                                            <td className='py-1'>Brand</td>
                                            <td className='py-1'>{selectedProduct.brand}</td>
                                        </tr>
                                        <tr>
                                            <td className='py-1'>Material</td>
                                            <td className='py-1'>{selectedProduct.material}</td>
                                        </tr>
                                    </tbody>
                                </table>  
                            </div>

                        </div>
                    </div>
                </div>
            )}
        </section>
    )
}

export default BestSellerProducts