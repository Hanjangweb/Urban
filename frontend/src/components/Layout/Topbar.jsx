import React from "react"
import { TbBrandMeta } from "react-icons/tb"
import { IoLogoInstagram } from "react-icons/io"
import { RiTwitterXLine } from "react-icons/ri"

const Topbar = () => {
  return (
    <div className="bg-red-600 text-white text-sm py-2">
      <div className="container mx-auto flex items-center justify-between px-6">

        {/* Left Icons */}
        <div className="flex items-center space-x-4">
          <TbBrandMeta className="text-lg cursor-pointer hover:opacity-80" />
          <IoLogoInstagram className="text-lg cursor-pointer hover:opacity-80" />
          <RiTwitterXLine className="text-lg cursor-pointer hover:opacity-80" />
        </div>

        {/* Center Text */}
        <div className="flex-1 text-center">
          <span>We ship worldwide — Fast and reliable shipping!</span>
        </div>

        {/* Right Contact */}
        <div className="hidden md:block">
          <span className="text-sm">+1 (234) 567-890</span>
        </div>

      </div>
    </div>
  )
}

export default Topbar