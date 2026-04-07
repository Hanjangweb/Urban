import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { createProduct } from '../../redux/slices/adminProductSlice';
import { toast } from 'sonner';

const AddProductPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [productData, setProductData] = useState({
        name: "",
        description: "",
        price: 0,
        countInStock: 0,
        sku: "",
        category: "",
        brand: "",
        sizes: [],
        colors: [],
        collections: "",
        material: "",
        gender: "",
        images: []
    });

    const [uploading, setUploading] = useState(false);

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
            setProductData((prev) => ({
                ...prev,
                images: [...prev.images, { url: data.imageUrl, altText: "" }]
            }));
            toast.success("Image uploaded");
        } catch {
            toast.error("Image upload failed");
        } finally {
            setUploading(false);
        }
    };

    const removeImage = (index) => {
        setProductData((prev) => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    // Clean single handleSubmit — no duplicate axios call
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prevent submission if image isn't finished uploading
        if (uploading) return toast.error("Please wait for image upload to finish");
        if (productData.images.length === 0) return toast.error("At least one image is required");

        const finalProductData = {
            ...productData,
            // Ensure Numbers
            price: Number(productData.price) || 0,
            countInStock: Number(productData.countInStock) || 0,

            // Ensure Required Strings (Fallback to defaults if empty)
            material: productData.material.trim() || "Cotton Blend",
            collections: productData.collections.trim() || "New Arrival",
            brand: productData.brand.trim() || "Generic",
            category: productData.category.trim() || "Uncategorized",
            images: productData.images.map(img => img.url),
            // Fix Arrays (Schema requires [String])
            sizes: productData.sizes.filter(s => s !== "").length ? productData.sizes : ["M"],
            colors: productData.colors.filter(c => c !== "").length ? productData.colors : ["Black"],

            // Defaults for other schema fields
            isFeatured: false,
            isPublished: true,
            discountPrice: 0,
        };


        try {
            console.log("Payload being sent:", finalProductData);
            await dispatch(createProduct(finalProductData)).unwrap();
            toast.success("Product created successfully!");
            navigate("/admin/products");
        } catch (err) {
            // This will now catch the error from rejectWithValue
            console.error("Backend Error Details:", err);
            toast.error(err?.message || "Check backend console for Validation Error");
        }
    };

    return (
        <div className='max-w-5xl mx-auto p-6 bg-white shadow rounded'>
            <h2 className='text-3xl font-bold mb-6'>Add Product</h2>

            <form onSubmit={handleSubmit} className='space-y-6'>

                {/* NAME */}
                <div>
                    <label className='block mb-1 font-medium'>Product Name</label>
                    <input type="text" name="name" value={productData.name}
                        onChange={handleChange}
                        className='w-full border p-2 rounded' required />
                </div>

                {/* DESCRIPTION */}
                <div>
                    <label className='block mb-1 font-medium'>Description</label>
                    <textarea name="description" value={productData.description}
                        onChange={handleChange}
                        className='w-full border p-2 rounded' rows={4} required />
                </div>

                {/* PRICE + STOCK */}
                <div className='grid grid-cols-2 gap-4'>
                    <div>
                        <label className='block mb-1 font-medium'>Price</label>
                        <input type="number" name="price" value={productData.price}
                            onChange={handleChange}
                            className='w-full border p-2 rounded' />
                    </div>
                    <div>
                        <label className='block mb-1 font-medium'>Stock</label>
                        <input type="number" name="countInStock" value={productData.countInStock}
                            onChange={handleChange}
                            className='w-full border p-2 rounded' />
                    </div>
                </div>

                {/* SKU + CATEGORY */}
                <div className='grid grid-cols-2 gap-4'>
                    <div>
                        <label className='block mb-1 font-medium'>SKU</label>
                        <input type="text" name="sku" value={productData.sku}
                            onChange={handleChange}
                            className='w-full border p-2 rounded' />
                    </div>
                    <div>
                        <label className='block mb-1 font-medium'>Category</label>
                        <input type="text" name="category" value={productData.category}
                            onChange={handleChange}
                            className='w-full border p-2 rounded' />
                    </div>
                </div>

                {/* BRAND + GENDER */}
                <div className='grid grid-cols-2 gap-4'>
                    <div>
                        <label className='block mb-1 font-medium'>Brand</label>
                        <input type="text" name="brand" value={productData.brand}
                            onChange={handleChange}
                            className='w-full border p-2 rounded' />
                    </div>
                    <div>
                        <label className='block mb-1 font-medium'>Gender</label>
                        <select name="gender" value={productData.gender}
                            onChange={handleChange}
                            className='w-full border p-2 rounded'>
                            <option value="">Select</option>
                            <option>Men</option>
                            <option>Women</option>
                            <option>Unisex</option>
                        </select>
                    </div>
                </div>

                {/* COLLECTION + MATERIAL */}
                <div className='grid grid-cols-2 gap-4'>
                    <div>
                        <label className='block mb-1 font-medium'>Collection</label>
                        <input type="text" name="collections" value={productData.collections}
                            onChange={handleChange}
                            className='w-full border p-2 rounded' />
                    </div>
                    <div>
                        <label className='block mb-1 font-medium'>Material</label>
                        <input type="text" name="material" value={productData.material}
                            onChange={handleChange}
                            className='w-full border p-2 rounded' />
                    </div>
                </div>

                {/* SIZES */}
                <div>
                    <label className='block mb-1 font-medium'>Sizes (comma-separated)</label>
                    <input type="text"
                        value={productData.sizes.join(", ")}
                        onChange={(e) => setProductData({
                            ...productData,
                            sizes: e.target.value.split(",").map(s => s.trim())
                        })}
                        className='w-full border p-2 rounded'
                        placeholder="S, M, L, XL" />
                </div>

                {/* COLORS */}
                <div>
                    <label className='block mb-1 font-medium'>Colors (comma-separated)</label>
                    <input type="text"
                        value={productData.colors.join(", ")}
                        onChange={(e) => setProductData({
                            ...productData,
                            colors: e.target.value.split(",").map(c => c.trim())
                        })}
                        className='w-full border p-2 rounded'
                        placeholder="Red, Blue, Black" />
                </div>

                {/* IMAGE UPLOAD */}
                <div>
                    <label className='block mb-1 font-medium'>Upload Image</label>
                    <input type="file" onChange={handleImageUpload} disabled={uploading} />
                    {uploading && <p className='text-blue-500 mt-1'>Uploading...</p>}
                </div>

                {/* IMAGE PREVIEW */}
                <div className='flex gap-4 flex-wrap'>
                    {productData.images.map((img, i) => (
                        img.url && (
                            <div key={i} className="relative">
                                <img src={img.url} alt="preview"
                                    className='w-24 h-24 object-cover rounded shadow' />
                                <button type="button" onClick={() => removeImage(i)}
                                    className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center'>
                                    ×
                                </button>
                            </div>
                        )
                    ))}
                </div>

                {/* SUBMIT */}
                <button type="submit" disabled={uploading}
                    className='w-full bg-black text-white py-3 rounded disabled:opacity-50'>
                    Create Product
                </button>

            </form>
        </div>
    );
};

export default AddProductPage;