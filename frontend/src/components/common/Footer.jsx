import React from 'react'
import { IoLogoInstagram } from 'react-icons/io'
import { RiTwitterXLine } from 'react-icons/ri'
import { TbBrandMeta } from 'react-icons/tb'
import { FiPhoneCall } from 'react-icons/fi'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t mt-10">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 px-6 py-12">

        {/* Newsletter */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
          <p className="text-gray-500 mb-4 text-sm">
            Be the first to hear about new products, exclusive events, and offers.
          </p>

          <form className="flex">
            <input
              type="email"
              placeholder="Enter your email"
              className="p-3 w-full text-sm border border-gray-300 rounded-l-md focus:outline-none"
            />
            <button className="bg-black text-white px-5 text-sm rounded-r-md hover:bg-gray-800">
              Subscribe
            </button>
          </form>
        </div>

        {/* Shop */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Shop</h3>
          <ul className="space-y-2 text-gray-600 text-sm">
            <li><Link to="/collections/all?category=Top Wear&gender=Men">Men's Top Wear</Link></li>
            <li><Link to="/collections/all?category=Top Wear&gender=Women">Women's Top Wear</Link></li>
            <li><Link to="/collections/all?category=Bottom Wear&gender=Men">Men's Bottom Wear</Link></li>
            <li><Link to="/collections/all?category=Bottom Wear&gender=Women">Women's Bottom Wear</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Support</h3>
          <ul className="space-y-2 text-gray-600 text-sm">
            <li><Link to="#">Contact Us</Link></li>
            <li><Link to="#">About Us</Link></li>
            <li><Link to="#">FAQs</Link></li>
            <li><Link to="#">Features</Link></li>
          </ul>
        </div>

        {/* Contact + Social */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Follow Us</h3>

          {/* Icons Row */}
          <div className="flex space-x-4 mb-6 text-gray-600">
            <a href="#"><TbBrandMeta className="h-5 w-5 hover:text-black" /></a>
            <a href="#"><IoLogoInstagram className="h-5 w-5 hover:text-black" /></a>
            <a href="#"><RiTwitterXLine className="h-5 w-5 hover:text-black" /></a>
          </div>

          {/* Contact */}
          <p className="text-gray-500 text-sm mb-1">Call Us</p>
          <p className="flex items-center text-sm font-medium">
            <FiPhoneCall className="mr-2" />
            0123-456-789
          </p>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t py-4 text-center text-sm text-gray-500">
        © 2026 URBAN. All Rights Reserved.
      </div>
    </footer>
  )
}

export default Footer