import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { HiOutlineUser, HiOutlineShoppingBag, HiBars3BottomRight } from 'react-icons/hi2';
import Search from './Search';
import CardDrawer from '../Layout/CardDrawer';
import { useDispatch, useSelector } from 'react-redux';
import { toggleCart } from '../../redux/slices/cartSlice';


const Navbar = () => {
  const dispatch = useDispatch();
  const [navDrawerOpen, setNavDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { cart, isCartOpen } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const cartItemCount = cart?.products?.reduce((total, product) => total + product.quantity, 0) || 0;

  // Shrink navbar on scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (navDrawerOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [navDrawerOpen])
  return (
    <>
      <nav className={` sticky top-0 z-40 bg-white transition-all duration-300 ${scrolled ? 'py-2 shadow-md' : 'py-0'
        }`}>
        <div className="container mx-auto flex items-center justify-between px-6 py-4">

          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-bold tracking-wide relative after:absolute  after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-black after:transition-all after:duration-300 hover:after:w-full"
          >
            URBAN
          </Link>

          {/* Nav links */}
          <div className="hidden md:flex space-x-8">
            {[
              { to: "/collections/all?gender=Women", label: "Women" },
              { to: "/collections/all?gender=Men", label: "Men" },
              { to: "/collections/all?category=Top Wear", label: "Top Wear" },
              { to: "/collections/all?category=Bottom Wear", label: "Bottom Wear" },
            ].map(({ to, label }) => (
              <NavLink
                key={label}
                to={to}
                className={() => {
                  const currentParams = new URLSearchParams(window.location.search)
                  const linkParams = new URLSearchParams(to.split('?')[1])
                  const active = [...linkParams].every(
                    ([key, val]) => currentParams.get(key) === val
                  )
                  return `text-sm uppercase relative pb-1 transition-colors duration-200
                  after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-black
                  after:transition-all after:duration-300
                  ${active
                      ? 'text-black after:w-full'
                      : 'text-gray-600 hover:text-black after:w-0 hover:after:w-full'
                    }`
                }}
              >
                {label}
              </NavLink>
            ))}
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-5">
            {user?.role === "admin" && (
              <Link
                to="/admin"
                className="bg-black px-3 py-1 rounded text-sm text-white hover:bg-gray-800 transition-colors duration-200"
              >
                Admin
              </Link>
            )}

            {/* Profile */}
            <Link
              to="/profile"
              className="p-1 rounded-full hover:bg-gray-100 transition-all duration-200 hover:scale-110"
            >
              <HiOutlineUser className="h-6 w-6" />
            </Link>

            {/* Cart */}
            <button
              onClick={() => dispatch(toggleCart())}
              className="relative p-1 rounded-full hover:bg-gray-100 transition-all duration-200 hover:scale-110"
            >
              <HiOutlineShoppingBag className="h-6 w-6 text-gray-700" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs min-w-[18px] h-[18px] flex items-center justify-center rounded-full transition-transform duration-200 scale-100">
                  {cartItemCount}
                </span>
              )}
            </button>

            <Search />

            {/* Mobile menu button */}
            <button
              onClick={() => setNavDrawerOpen(!navDrawerOpen)}
              className="md:hidden p-1 rounded-full hover:bg-gray-100 transition-all duration-200 hover:rotate-90"
            >
              <HiBars3BottomRight className="h-6 w-6" />
            </button>
          </div>
        </div>
      </nav>
      {/* Nav Drawer for mobile */}
     
        <div className={`fixed inset-0 z-50 flex transition-opacity duration-300 ${navDrawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
          {/* Overlay */}
         <div className={`flex-1 bg-black bg-opacity-40 ${navDrawerOpen ? 'pointer-events-auto' : 'pointer-events-none'}`} onClick={() => setNavDrawerOpen(false)} />

          {/* Drawer */}
          <div className={`w-64 bg-white h-full shadow-xl flex flex-col p-6 space-y-6 overflow-y-auto transition-transform duration-300 ${navDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <button
              onClick={() => setNavDrawerOpen(false)}
              className="self-end text-gray-500 hover:text-black text-xl"
            >
              ✕
            </button>
            {[
              { to: "/collections/all?gender=Women", label: "Women" },
              { to: "/collections/all?gender=Men", label: "Men" },
              { to: "/collections/all?category=Top Wear", label: "Top Wear" },
              { to: "/collections/all?category=Bottom Wear", label: "Bottom Wear" },
            ].map(({ to, label }) => (
              <Link
                key={label}
                to={to}
                onClick={() => setNavDrawerOpen(false)}
                className="text-lg font-medium text-gray-700 hover:text-black border-b pb-3"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      <CardDrawer drawerOpen={isCartOpen} toggleCartDrawer={() => dispatch(toggleCart())} />
    </>
  );
};

export default Navbar;