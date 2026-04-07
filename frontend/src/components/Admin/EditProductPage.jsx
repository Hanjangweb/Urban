import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchProductDetails } from '../../redux/slices/productSlice';
import axios from 'axios';
import { updateProduct } from '../../redux/slices/adminProductSlice';

const EditProductPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const { selectedProduct } = useSelector((state) => state.products);

    const [productData, setProductData] = useState({
        name: "", description: "", price: 0, countInStock: 0,
        sku: "", category: "", brand: "", sizes: [],
        colors: [], collections: "", material: "", gender: "", images: []
    });

    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (id) dispatch(fetchProductDetails(id));
    }, [dispatch, id]);

    useEffect(() => {
        if (selectedProduct) {
            setProductData({
                ...selectedProduct,
                images: selectedProduct.images?.filter(img => img.url) || []
            });
        }
    }, [selectedProduct]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("image", file);

        try {
            setUploading(true);
            const { data } = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/upload`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );
            // ✅ This correctly adds the Cloudinary URL to state
            setProductData((prev) => ({
                ...prev,
                images: [...prev.images, { url: data.imageUrl, altText: "" }]
            }));
        } catch (err) {
            console.error("Image upload failed:", err);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {  // ✅ make async
        e.preventDefault();

        const finalProductData = {
            ...productData,
            images: productData.images.filter(img => img.url && img.url.trim() !== ""),
            price: Number(productData.price),
            countInStock: Number(productData.countInStock)
        };

        // ✅ FIXED: await the dispatch so update completes before navigating
        await dispatch(updateProduct({ id, productData: finalProductData })).unwrap();

        navigate("/admin/products");
    };

    return (
        <div className='max-w-5xl mx-auto p-6 shadow-md rounded-md'>
            <h2 className='text-3xl font-bold mb-6'>Edit Product</h2>
            <form onSubmit={handleSubmit}>
                <div className='mb-6'>
                    <label className='block font-semibold mb-2'>Name</label>
                    <input type="text" name='name' value={productData.name}
                        onChange={handleChange}
                        className='w-full border border-gray-300 rounded-md p-2' required />
                </div>

                <div className='mb-6'>
                    <label className='block font-semibold mb-2'>Description</label>
                    <textarea name="description" onChange={handleChange}
                        value={productData.description} rows={4}
                        className='w-full border-gray-300 rounded-md p-2 border' required />
                </div>

                <div className='grid grid-cols-2 gap-4 mb-6'>
                    <div>
                        <label className='block font-semibold mb-2'>Price</label>
                        <input type="number" name='price' value={productData.price}
                            onChange={handleChange}
                            className='w-full border border-gray-300 rounded-md p-2' />
                    </div>
                    <div>
                        <label className='block font-semibold mb-2'>Count in Stock</label>
                        <input type="number" name='countInStock' value={productData.countInStock}
                            onChange={handleChange}
                            className='w-full border border-gray-300 rounded-md p-2' />
                    </div>
                </div>

                <div className='mb-6'>
                    <label className='block font-semibold mb-2'>Sizes (Comma-separated)</label>
                    <input type="text" value={productData.sizes.join(", ")}
                        onChange={(e) => setProductData({
                            ...productData,
                            sizes: e.target.value.split(",").map(s => s.trim())
                        })}
                        className='w-full border border-gray-300 rounded-md p-2' />
                </div>

                <div className='mb-6'>
                    <label className='block font-semibold mb-2'>Colors (Comma-separated)</label>
                    <input type="text" value={productData.colors.join(", ")}
                        onChange={(e) => setProductData({
                            ...productData,
                            colors: e.target.value.split(",").map(c => c.trim())
                        })}
                        className='w-full border border-gray-300 rounded-md p-2' />
                </div>

                <div className='mb-6'>
                    <label className='block font-semibold mb-2'>Upload Image</label>
                    <input type="file" onChange={handleImageUpload} />
                    {uploading && <p className="text-blue-500 mt-1">Uploading...</p>}

                    <div className='flex flex-wrap gap-4 mt-4'>
                        {productData.images?.map((image, index) => (
                            image.url && (
                                <div key={index} className="relative">
                                    <img
                                        src={image.url}
                                        alt="product"
                                        className='w-20 h-20 object-cover rounded-md shadow-md'
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setProductData({
                                            ...productData,
                                            images: productData.images.filter((_, i) => i !== index)
                                        })}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                                    >
                                        ×
                                    </button>
                                </div>
                            )
                        ))}
                    </div>
                </div>

                <button
                    type='submit'
                    disabled={uploading}  // ✅ prevent submit while image is still uploading
                    className='w-full bg-green-600 text-white py-2 uppercase rounded-md hover:bg-green-700 transition-colors disabled:opacity-50'
                >
                    Update Product
                </button>
            </form>
        </div>
    );
};

export default EditProductPage;