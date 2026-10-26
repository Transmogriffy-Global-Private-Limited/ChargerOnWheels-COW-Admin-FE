import React, { useState, useEffect, useRef } from "react";
import { 
  FaBars, 
  FaHome, 
  FaUserCircle, 
  FaChevronDown, 
  FaTimes, 
  FaUser, 
  FaSignOutAlt, 
  FaCog,
  FaShoppingCart,
  FaBox,
  FaClipboardList,
  FaBolt,
  FaChartLine,
  FaThLarge
} from "react-icons/fa";
import { MdElectricBolt, MdSpeed, MdFlashOn } from "react-icons/md";
import { useNavigate, Link, useLocation } from "react-router-dom";
import Sidebar from "../User/User_sidebar";
import logo from '../../assets/log.png';

const BASE_URL_AND_PORT = "https://api.static.ev.transev.site";
const API_KEY = "mlzuMoRFjdGhcFulLMaVtfwNAHycbBAf";

const Navbar = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [userId, setUserId] = useState(null);
  const [hoveredNav, setHoveredNav] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Refs for dropdown and avatar button
  const dropdownRef = useRef(null);
  const avatarButtonRef = useRef(null);

  const toggleSidebar = () => setSidebarVisible(!sidebarVisible);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        avatarButtonRef.current &&
        !avatarButtonRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  // Close dropdown when route changes
  useEffect(() => {
    setDropdownOpen(false);
  }, [location.pathname]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Get user ID from localStorage
  useEffect(() => {
    const storedUserId = localStorage.getItem("user_id");
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  // Listen for cart update events
  useEffect(() => {
    const handleCartUpdate = () => {
      if (userId) {
        fetchCartCount();
      }
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, [userId]);

  // Fetch user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("auth_token");
      if (!token) return;

      try {
        const response = await fetch(`${BASE_URL_AND_PORT}/users/profile`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "API-KEY": API_KEY,
          },
        });

        if (response.ok) {
          const data = await response.json();
          const blobUrl = convertBase64ToBlob(data.user_data.profile_picture);
          setUserData({
            ...data.user_data,
            profile_picture: blobUrl,
          });
          if (data.user_data.id && !localStorage.getItem("user_id")) {
            localStorage.setItem("user_id", data.user_data.id);
            setUserId(data.user_data.id);
          }
        } else {
          console.error("Failed to fetch user profile");
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  // FIXED: Fetch cart count with proper quantity handling
  const fetchCartCount = async () => {
    if (!userId) return;

    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch(`${BASE_URL_AND_PORT}/cart/getcartdetails`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "API-KEY": API_KEY,
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ user_id: userId }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Cart Data for Navbar:', data); // Debug log
        
        let totalCount = 0;
        
        if (data.cart_items && Array.isArray(data.cart_items)) {
          // FIXED: Use quantity field with fallback to cart_quantity
          totalCount = data.cart_items.reduce((sum, item) => {
            // Check for both quantity and cart_quantity
            const qty = item.quantity || item.cart_quantity || 0;
            return sum + qty;
          }, 0);
        } else if (data.items && Array.isArray(data.items)) {
          // FIXED: Use quantity field with fallback
          totalCount = data.items.reduce((sum, item) => {
            const qty = item.quantity || item.cart_quantity || 0;
            return sum + qty;
          }, 0);
        } else if (data.total_quantity) {
          totalCount = data.total_quantity;
        } else if (data.count) {
          totalCount = data.count;
        }
        
        console.log('Total Cart Count:', totalCount); // Debug log
        setCartCount(totalCount);
      }
    } catch (error) {
      console.error("Error fetching cart count:", error);
    }
  };

  // Fetch cart count when userId changes
  useEffect(() => {
    if (userId) {
      fetchCartCount();
      // Refresh cart count every 30 seconds
      const interval = setInterval(fetchCartCount, 30000);
      return () => clearInterval(interval);
    }
  }, [userId]);

  const handleLogout = async () => {
    const token = localStorage.getItem("auth_token");
    if (!token) return;

    try {
      const response = await fetch(`${BASE_URL_AND_PORT}/users/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "API-Key": API_KEY,
        },
      });

      if (response.ok) {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user_id");
        navigate("/");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const goToProfile = () => navigate("/profile");
  const goToCart = () => navigate("/cart");

  const getInitial = () => {
    if (userData?.name) {
      return userData.name.charAt(0).toUpperCase();
    }
    return "U";
  };

  // Navigation links for desktop with hover effect
  const navLinks = [
    { path: "/dashboard", label: "Dashboard", icon: <FaThLarge size={18} /> },
    { path: "/products", label: "Products", icon: <FaBox size={18} /> },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav
        className={`
          fixed top-0 left-0 right-0 z-50 transition-all duration-500
          ${scrolled 
            ? 'bg-gradient-to-r from-[#065f46] to-[#022c22] shadow-2xl py-2' 
            : 'bg-gradient-to-r from-[#059669] to-[#022c22] py-3 md:py-4'
          }
        `}
      >
        <div className="w-full px-3 sm:px-4 md:px-6">
          <div className="flex items-center justify-between">
            {/* Left Section - Logo & Hamburger Menu */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Hamburger button for sidebar */}
              <button
                onClick={toggleSidebar}
                className="text-white hover:bg-white/10 p-2 rounded-xl transition-all duration-300 lg:hidden group"
                aria-label="Toggle Sidebar"
              >
                <FaBars size={18} className="sm:size-5 group-hover:scale-110 transition-transform" />
              </button>

              {/* TransEV Logo - Left Side */}
              <div className="flex items-center gap-2 sm:gap-3 cursor-pointer" onClick={() => navigate("/dashboard")}>
                <Link to="/dashboard" className="flex items-center gap-2 sm:gap-3 group ml-2 sm:ml-8 md:ml-18">
                  <div className="relative">
                    <img
                      src={logo}
                      alt="TransEV Logo"
                      className="h-8 sm:h-10 md:h-11 w-auto transition-all duration-300 group-hover:scale-105"
                    />
                    <div className="absolute -inset-1 bg-white/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                </Link>
              </div>
            </div>
            
            {/* Center Section - Desktop Navigation Links with Hover Effect */}
            <div className="hidden lg:flex items-center justify-center gap-3 xl:gap-4">
              {navLinks.map((link, index) => (
                <React.Fragment key={link.path}>
                  <Link
                    to={link.path}
                    onMouseEnter={() => setHoveredNav(index)}
                    onMouseLeave={() => setHoveredNav(null)}
                    className={`
                      relative flex items-center justify-center px-5 xl:px-7 py-2.5 rounded-xl transition-all duration-300
                      ${isActive(link.path) 
                        ? 'bg-white/20 text-white shadow-lg' 
                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                      }
                      group
                    `}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{link.icon}</span>
                      <span className={`
                        text-sm font-medium transition-all duration-300 overflow-hidden whitespace-nowrap
                        ${hoveredNav === index || isActive(link.path) ? 'max-w-[100px] opacity-100 ml-1' : 'max-w-0 opacity-0'}
                      `}>
                        {link.label}
                      </span>
                    </div>
                    {isActive(link.path) && (
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-white rounded-full"></div>
                    )}
                  </Link>
                  {/* Separator between Dashboard and Products */}
                  {index === 0 && (
                    <div className="w-px h-6 bg-white/40 mx-1"></div>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Right Section - Cart & User Info */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Cart Icon with Badge - FIXED: Shows correct count */}
              <button
                onClick={goToCart}
                className="relative text-white hover:bg-white/10 p-2 sm:p-2.5 rounded-xl transition-all duration-300 group"
                aria-label="Shopping Cart"
              >
                <FaShoppingCart size={18} className="sm:size-5 group-hover:scale-110 transition-transform" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[16px] sm:min-w-[18px] h-[16px] sm:h-[18px] bg-gradient-to-r from-orange-500 to-red-500 rounded-full text-white text-[9px] sm:text-[10px] font-bold flex items-center justify-center px-1 shadow-lg animate-pulse">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </button>

              {/* User Greeting - Desktop */}
              <div className="hidden md:flex items-center gap-2 ml-1 pr-2 border-r border-white/20">
                <div className="text-right">
                  <p className="text-white/60 text-[11px] leading-tight">Welcome back,</p>
                  <p className="text-white text-sm font-semibold leading-tight">
                    {userData?.name?.split(' ')[0] || "Guest"}
                  </p>
                </div>
              </div>

              {/* User Avatar Dropdown */}
              <div className="relative">
                <button
                  ref={avatarButtonRef}
                  onClick={toggleDropdown}
                  className="flex items-center gap-1 sm:gap-2 focus:outline-none group"
                  aria-label="User Menu"
                >
                  <div className="relative">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full overflow-hidden border-2 border-white/30 group-hover:border-white transition-all duration-300 shadow-md">
                      {userData?.profile_picture ? (
                        <img
                          src={userData.profile_picture}
                          alt="User"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center">
                          <span className="text-white font-bold text-sm">{getInitial()}</span>
                        </div>
                      )}
                    </div>
                    <div className="absolute bottom-0 right-0 w-2 sm:w-2.5 h-2 sm:h-2.5 bg-green-500 rounded-full border-2 border-[#1a4d2e]"></div>
                  </div>
                  <FaChevronDown 
                    className={`text-white/70 text-[10px] sm:text-xs transition-all duration-300 hidden sm:block ${
                      dropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div 
                    ref={dropdownRef}
                    className="absolute right-0 mt-2 sm:mt-3 w-64 bg-white rounded-2xl shadow-2xl py-2 z-50 animate-slideDown border border-gray-100"
                  >
                    <div className="px-4 py-3 sm:py-4 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-gradient-to-r from-emerald-600 to-teal-600 flex items-center justify-center">
                          {userData?.profile_picture ? (
                            <img
                              src={userData.profile_picture}
                              alt="User"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-white font-bold text-lg">{getInitial()}</span>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-800">
                            {userData?.name || "User"}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5 truncate max-w-[150px]">
                            {userData?.email || "user@example.com"}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => {
                        goToProfile();
                        setDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 sm:py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3"
                    >
                      <FaUserCircle className="text-gray-400" size={18} />
                      <span>My Profile</span>
                    </button>
                    
                    <button
                      onClick={() => {
                        goToCart();
                        setDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 sm:py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3"
                    >
                      <FaShoppingCart className="text-gray-400" size={18} />
                      <span>My Cart {cartCount > 0 && `(${cartCount})`}</span>
                    </button>
                    
                    <Link
                      to="/products"
                      onClick={() => setDropdownOpen(false)}
                      className="w-full text-left px-4 py-2.5 sm:py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3"
                    >
                      <FaBox className="text-gray-400" size={18} />
                      <span>Products</span>
                    </Link>
                    
                    <Link
                      to="/setting"
                      onClick={() => setDropdownOpen(false)}
                      className="w-full text-left px-4 py-2.5 sm:py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3"
                    >
                      <FaCog className="text-gray-400" size={18} />
                      <span>Settings</span>
                    </Link>
                    
                    <div className="border-t border-gray-100 my-1"></div>
                    
                    <button
                      onClick={() => {
                        handleLogout();
                        setDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 sm:py-3 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3"
                    >
                      <FaSignOutAlt className="text-red-400" size={18} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar for Mobile */}
      {sidebarVisible && (
        <div className="lg:hidden">
          <Sidebar isVisible={sidebarVisible} onClose={() => setSidebarVisible(false)} />
        </div>
      )}

      {/* Spacer - Dynamic based on screen size */}
      <div className="h-14 sm:h-16 md:h-18 lg:h-20"></div>

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        .animate-slideDown {
          animation: slideDown 0.25s ease-out;
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </>
  );
};

export default Navbar;

const convertBase64ToBlob = (base64String) => {
  try {
    if (!base64String) return null;
    const base64Regex = /^data:image\/[a-zA-Z]+;base64,/;
    let cleanBase64 = base64String;
    if (base64String.match(base64Regex)) {
      cleanBase64 = base64String.replace(base64Regex, "");
    }

    const byteCharacters = atob(cleanBase64);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
      const slice = byteCharacters.slice(offset, offset + 1024);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      byteArrays.push(new Uint8Array(byteNumbers));
    }

    const blob = new Blob(byteArrays, { type: "image/jpeg" });
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error("Error converting base64 to Blob:", error);
    return null;
  }
};