import React from 'react'
import Topbar from '../Layout/Topbar'
import Navbar from './Navbar'

const Header = () => {
  return (
    <header className='bg-slate-400'>
      {/* Topbar */}
      <Topbar />

      {/* Navbar */}
      <Navbar />
    </header>
  )
}

export default Header