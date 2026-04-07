import React from 'react'
import { Link } from 'react-router-dom'

const ProductGrid = ({ products, loading, error }) => {
  if (loading) return <p className="p-4 text-gray-500">Loading...</p>
  if (error) return <p className="p-4 text-red-500">Error: {error}</p>

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product, index) => (
        <Link
          key={product._id || index}
          to={`/product/${product._id}`}
          className="group block bg-white rounded-lg border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
        >
          <div className="aspect-[3/4] w-full overflow-hidden bg-gray-50">
            <img
              src={product.images[0].url}
              alt={product.images[0].altText || product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="p-3">
            <h3 className="text-sm font-medium text-gray-900 truncate">{product.name}</h3>
            <p className="text-sm text-gray-500 mt-1">${product.price}</p>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default ProductGrid