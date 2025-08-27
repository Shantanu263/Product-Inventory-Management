import { useState, useEffect, useRef, useContext } from "react";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { logoutUser } from '../api';
import LayoutWrapper from './LayoutWrapper';
import { Menu, LogOut, LockKeyhole, Search, SunMedium, Moon, ShoppingCart, Box, Plus } from "lucide-react";
import { CartContext } from '../context/CartContext';

const Navbar = ({ onSearch }) => {
  const [categories, setCategories] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [userRole, setUserRole] = useState(localStorage.getItem("userRole"));

  const navigate = useNavigate();
  const location = useLocation();

  const dropdownRef = useRef(null);
  const avatarRef = useRef(null);
  const menuRef = useRef(null);
  
  const { cartItemCount } = useContext(CartContext);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
      if (avatarRef.current && !avatarRef.current.contains(e.target)) setAvatarMenuOpen(false);
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reset search on home page
  useEffect(() => {
    if (location.pathname === "/") setSearchText("");
  }, [location]);

  // Apply theme
  useEffect(() => {
    document.querySelector("html").setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Detect OS preference if not set
  useEffect(() => {
    if (!localStorage.getItem("theme")) {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setTheme(prefersDark ? "dark" : "light");
    }
  }, []);

  // Update userRole when it changes in localStorage
  useEffect(() => {
    const handleStorageChange = () => setUserRole(localStorage.getItem('userRole'));
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = async () => {
    try { await logoutUser(); } catch (err) { console.error(err); } 
    finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      navigate("/login");
    }
  };

  const handleBulkUploadClick = () => {
    document.getElementById('bulk-upload-input')?.click();
  };

  return (
    <LayoutWrapper>
      <div className="navbar bg-base-100 shadow-lg text-base-content">
        <div className="w-full px-4 flex justify-between items-center relative">

          {/* Left Section: Logo */}
          <div className="flex items-center gap-3">
            {/* Admin menu shown only for ADMIN */}
            {userRole === 'ADMIN' && (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen(prev => !prev)}
                  className="btn btn-ghost text-base-content"
                >
                  <Menu />
                </button>
                {menuOpen && (
                  <div className="absolute left-0 mt-2 z-50 bg-base-100 text-base-content border rounded-box w-52 shadow flex flex-col">
                    <Link to="/add-product" className="block px-4 py-2 hover:bg-base-200" onClick={() => setMenuOpen(false)}><Plus/> Add Product</Link>
                    <button onClick={() => { handleBulkUploadClick(); setMenuOpen(false); }} className="block px-4 py-2 text-left hover:bg-base-200">📥 Bulk Upload</button>
                    <Link to="/add-category" className="block px-4 py-2 hover:bg-base-200" onClick={() => setMenuOpen(false)}>📁 Add Category</Link>
                  </div>
                )}
              </div>
            )}

            {/* Logo */}
            <Link to="/" className="btn btn-ghost normal-case text-xl text-base-content">
              <Box/> Product Inventory
            </Link>

            {/* Bulk Upload Hidden Input */}
            {userRole === 'ADMIN' && (
              <input
                type="file"
                id="bulk-upload-input"
                accept=".xlsx,.xls"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (!file) return;
                  const formData = new FormData();
                  formData.append('file', file);
                  axios.post('/api/products/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
                    .then(() => { alert("Upload complete!"); window.location.reload(); })
                    .catch(error => { alert("Upload failed: " + (error.response?.data || error.message)); })
                    .finally(() => { e.target.value = ''; });
                }}
              />
            )}
          </div>

          {/* Center Section: Search Bar */}
          <div className="absolute left-1/2 transform -translate-x-1/2 max-w-xl w-full flex justify-center">
            <form
              onSubmit={(e) => { e.preventDefault(); if (searchText) navigate(`/search?name=${searchText}`); }}
              className="w-full max-w-xl mx-auto"
            >
              <div className="flex">
                <input
                  type="text"
                  placeholder="Search products"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="input input-bordered bg-base-200 text-base-content placeholder-base-content/50 rounded-r-none w-full"
                />
                <button type="submit" className="btn btn-primary rounded-l-none">
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {/* Orders Button - only for CUSTOMER */}
            {userRole === 'CUSTOMER' && (
              <Link to="/orders" className="btn btn-ghost btn-circle">
                <Box />
              </Link>
            )}
            {/* Cart Button - only for CUSTOMER */}
            {userRole === 'CUSTOMER' && (
              <Link to="/cart" className="btn btn-ghost btn-circle indicator">
                {cartItemCount > 0 && (
                  <span className="indicator-item badge badge-primary badge-sm rounded-full w-5 h-5 p-0 flex items-center justify-center">{cartItemCount}</span>
                )}
                <ShoppingCart />
              </Link>
            )}

            {/* Theme Toggle */}
            <button className="btn btn-ghost" onClick={() => {
                const newTheme = theme === "light" ? "black" : "light";
                setTheme(newTheme);
                document.querySelector("html").setAttribute("data-theme", newTheme);
            }}>
              {theme === "light" ? <SunMedium /> : <Moon />}
            </button>

            {/* Avatar Menu */}
            <div className="dropdown dropdown-end" ref={avatarRef}>
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                <div className="w-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <img src="https://thumbs.dreamstime.com/b/person-icon-black-background-person-outline-vector-eps-90447210.jpg" />
                </div>
              </div>
              <ul tabIndex={0} className="mt-3 z-[100] p-2 shadow menu menu-sm dropdown-content bg-base-100 text-base-content rounded-box w-52">
                <li>
                  <Link to="/change-password" className="text-base font-medium"><LockKeyhole /> Change Password</Link>
                </li>
                <li>
                  <button onClick={handleLogout} className="text-base font-medium"><LogOut /> Logout</button>
                </li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </LayoutWrapper>
  );
};

export default Navbar;
