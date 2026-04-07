import React from 'react'

const Marquee = () => {
     const items = [
    "Free Shipping on Orders Over $100",
    "24/7 Customer Support",
    " 100% Original Products",
    " Easy 45-Day Returns",
    " Fast Delivery Across India",
  ];
  return (
    <>
      <div className="relative overflow-hidden bg-gray-700 text-white mt-9 py-4">

        {/* Left */}
        <div className="absolute left-0 top-0 h-full w-20 bg-gradient-to-r from-black to-transparent z-10"></div>

        {/* Right */}
        <div className="absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-black to-transparent z-10"></div>

        <div className="flex whitespace-nowrap animate-marquee gap-12 hover:[animation-play-state:paused]">
            {[...items, ...items].map((text, index) => (
            <span key={index} className="text-sm md:text-base font-medium">
                {text}
            </span>
            ))}
        </div>
    </div>
    </>
  )
}

export default Marquee
