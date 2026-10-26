import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaBars,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaTachometerAlt,
  FaUsers,
  FaBoxOpen,
  FaClipboardCheck,
  FaChartLine,
  FaCog,
  FaSignOutAlt,
  FaUserCircle,
  FaMoneyBillWave,
  FaStore,
  FaShoppingCart,
  FaHeadset,
  FaPalette,
  FaChevronDown,
  FaChevronUp,
  FaPlus,
  FaList,
  FaTrashAlt,
  FaHome
} from "react-icons/fa";
import { MdSpaceDashboard, MdOutlineProductionQuantityLimits } from "react-icons/md";
import { HiUsers } from "react-icons/hi";
import { IoSettingsSharp } from "react-icons/io5";
import logo from "../../assets/log.png";

const BASE_URL_AND_PORT = "https://api.static.ev.transev.site";
const API_KEY = "mlzuMoRFjdGhcFulLMaVtfwNAHycbBAf";

const AdminSidebar = ({ isVisible = false, onClose = () => {} }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  // Check if any dropdown item is active
  const isDropdownActive = (dropdownItems) => {
    return dropdownItems.some(item => location.pathname === item.to);
  };

  // Initialize dropdown state based on current route
  useEffect(() => {
    // Check each dropdown to see if any of their items are active
    const menuItemsWithDropdowns = menuItems.filter(item => item.isDropdown);
    
    for (const item of menuItemsWithDropdowns) {
      if (isDropdownActive(item.dropdownItems)) {
        setOpenDropdown(item.label);
        break;
      }
    }
  }, [location.pathname]);

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsExpanded(false);
      } else {
        setIsExpanded(true);
      }
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleLogout = async () => {
    const token = localStorage.getItem("auth_token");
    if (!token) return;

    try {
      const response = await fetch(`${BASE_URL_AND_PORT}/admin/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "API-Key": API_KEY,
        },
      });

      if (response.ok) {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user_role");
        localStorage.removeItem("login_timestamp");
        navigate("/");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleReturnToHome = () => {
    navigate("/");
    if (isMobile && onClose) onClose();
  };

  const toggleDropdown = (dropdownName) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
  };

  const menuItems = [
    { icon: <MdSpaceDashboard />, to: "/admin/dashboard", label: "Dashboard", color: "from-blue-500 to-cyan-500" },
    { icon: <HiUsers />, to: "/admin/users", label: "Manage Users", color: "from-green-500 to-emerald-500" },
    { 
      icon: <MdOutlineProductionQuantityLimits />, 
      label: "Product Management", 
      color: "from-purple-500 to-pink-500",
      isDropdown: true,
      dropdownItems: [
        { icon: <FaList />, to: "/manage/products", label: "All Products", color: "from-purple-500 to-pink-500" },
        { icon: <FaPlus />, to: "/add-product", label: "Add Product", color: "from-green-500 to-emerald-500" },
        { icon: <FaTrashAlt />, to: "/admin/delisted-products", label: "Delisted Products", color: "from-red-500 to-orange-500" },
      ]
    },
    { icon: <FaShoppingCart />, to: "/admin/orders", label: "Manage Orders", color: "from-orange-500 to-red-500" },
    { icon: <FaMoneyBillWave />, to: "/admin-refunds", label: "Manage Refunds", color: "from-yellow-500 to-amber-500" },
    { icon: <FaChartLine />, to: "/admin/report", label: "Analytics", color: "from-indigo-500 to-blue-500" },
    { icon: <FaHeadset />, to: "/admin/support", label: "Support", color: "from-teal-500 to-green-500" },
    { icon: <FaUserCircle />, to: "/admin/profile", label: "My Profile", color: "from-cyan-500 to-blue-500" },
    { icon: <IoSettingsSharp />, to: "/admin/settings", label: "Settings", color: "from-gray-500 to-gray-700" },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isVisible && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fadeIn"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full bg-gradient-to-b from-[#1a2f3e] to-[#0d1c26] text-white z-50 
          shadow-2xl transition-all duration-300 ease-in-out overflow-y-auto overflow-x-hidden
          flex flex-col
          ${isMobile 
            ? `${isVisible ? 'translate-x-0' : '-translate-x-full'} w-72` 
            : `${isExpanded ? 'w-72' : 'w-20'} translate-x-0`
          }
        `}
      >
        {/* Custom Scrollbar Styles */}
        <style jsx>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.2);
            border-radius: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.3);
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          .animate-fadeIn {
            animation: fadeIn 0.2s ease-out;
          }
        `}</style>

        {/* Logo Section */}
        <div className={`flex items-center justify-between px-5 py-5 border-b border-white/10 ${!isExpanded && !isMobile ? 'justify-center' : ''}`}>
          <Link 
            to="/admin/dashboard" 
            onClick={() => {
              if (isMobile && onClose) onClose();
            }} 
            className="flex items-center gap-3 group"
          >
            <div className="relative">
              <img
                src={logo}
                alt="Admin Logo"
                className={`h-10 w-auto transition-all duration-200 ${
                  (isExpanded || isMobile) ? "block" : "hidden"
                }`}
              />
              {(!isExpanded && !isMobile) && (
                <div className="w-10 h-10 bg-gradient-to-br from-white to-gray-100 rounded-xl flex items-center justify-center shadow-lg">
                  <MdSpaceDashboard className="text-[#1a2f3e] text-2xl" />
                </div>
              )}
              <div className="absolute -inset-1 bg-gradient-to-r from-[#ffd700] to-[#ffed4a] rounded-full blur opacity-0 group-hover:opacity-30 transition-opacity duration-300 -z-10"></div>
            </div>
            {(isExpanded || isMobile) && (
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                  Admin Panel
                </span>
                <span className="text-[10px] text-white/40 uppercase tracking-wider">Management Portal</span>
              </div>
            )}
          </Link>

          {/* Desktop Toggle Button */}
          {!isMobile && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200 group"
            >
              {isExpanded ? (
                <FaAngleDoubleLeft className="text-white/70 group-hover:text-white text-sm" />
              ) : (
                <FaAngleDoubleRight className="text-white/70 group-hover:text-white text-sm" />
              )}
            </button>
          )}

          {/* Mobile Close Button */}
          {isMobile && (
            <button 
              onClick={onClose} 
              className="text-white/70 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* User Profile Summary */}
        {(isExpanded || isMobile) && (
          <div className="mx-4 mt-6 p-4 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center shadow-lg">
                <FaUserCircle className="text-white text-xl" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">Admin Portal</p>
                <p className="text-xs text-blue-300">Manage your platform</p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <div className="text-center flex-1">
                <p className="text-white font-bold text-lg">9</p>
                <p className="text-[10px] text-white/50">Modules</p>
              </div>
              <div className="text-center flex-1">
                <p className="text-white font-bold text-lg">24/7</p>
                <p className="text-[10px] text-white/50">Support</p>
              </div>
              <div className="text-center flex-1">
                <p className="text-white font-bold text-lg">100%</p>
                <p className="text-[10px] text-white/50">Secure</p>
              </div>
            </div>
          </div>
        )}

        {/* Collapsed User Icon for Desktop */}
        {(!isExpanded && !isMobile) && (
          <div className="flex justify-center mt-6">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#ffd700] to-[#ffed4a] flex items-center justify-center shadow-lg">
              <FaUserCircle className="text-[#1a2f3e] text-xl" />
            </div>
          </div>
        )}

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden mt-6 px-3 custom-scrollbar">
          <div className="space-y-1">
            {menuItems.map((item, index) => {
              if (item.isDropdown) {
                const isDropdownOpen = openDropdown === item.label;
                const isAnyChildActive = isDropdownActive(item.dropdownItems);
                
                return (
                  <div key={index}>
                    {/* Dropdown Trigger */}
                    <button
                      onClick={() => toggleDropdown(item.label)}
                      className={`
                        group relative w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl 
                        transition-all duration-200 overflow-hidden
                        ${(isExpanded || isMobile) ? 'justify-between' : 'justify-center'}
                        ${isAnyChildActive 
                          ? `bg-gradient-to-r ${item.color} text-white shadow-lg` 
                          : 'text-white/70 hover:text-white hover:bg-white/10'
                        }
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`text-xl transition-transform duration-200 group-hover:scale-110 ${
                          isAnyChildActive ? 'text-white' : 'text-white/70 group-hover:text-white'
                        }`}>
                          {item.icon}
                        </span>
                        {(isExpanded || isMobile) && (
                          <span className="text-sm font-medium">{item.label}</span>
                        )}
                      </div>
                      {(isExpanded || isMobile) && (
                        <span className="text-xs">
                          {isDropdownOpen ? <FaChevronUp /> : <FaChevronDown />}
                        </span>
                      )}
                    </button>

                    {/* Dropdown Items */}
                    {(isExpanded || isMobile) && isDropdownOpen && (
                      <div className="ml-6 mt-1 space-y-1 border-l border-white/10 pl-2">
                        {item.dropdownItems.map((subItem, subIndex) => (
                          <Link
                            key={subIndex}
                            to={subItem.to}
                            onClick={() => {
                              if (isMobile && onClose) onClose();
                            }}
                            className={`
                              flex items-center gap-3 px-3 py-2 rounded-lg
                              transition-all duration-200
                              ${location.pathname === subItem.to
                                ? `bg-gradient-to-r ${subItem.color} text-white shadow-md`
                                : 'text-white/60 hover:text-white hover:bg-white/10'
                              }
                            `}
                          >
                            <span className="text-sm">{subItem.icon}</span>
                            <span className="text-xs font-medium">{subItem.label}</span>
                          </Link>
                        ))}
                      </div>
                    )}

                    {/* Tooltip for collapsed mode */}
                    {(!isExpanded && !isMobile) && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap z-20 shadow-lg border border-white/10">
                        {item.label}
                      </div>
                    )}
                  </div>
                );
              }
              
              return (
                <SidebarLink
                  key={index}
                  icon={item.icon}
                  to={item.to}
                  label={item.label}
                  showText={isExpanded || isMobile}
                  isActive={location.pathname === item.to}
                  color={item.color}
                  isMobile={isMobile}
                  onClose={onClose}
                />
              );
            })}
          </div>
        </nav>

        {/* Footer Section */}
        <div className="border-t border-white/10 mt-auto">
          
          {/* ⭐ NEW: Return to Home Button ⭐ */}
          <div className="p-3">
            <button
              onClick={handleReturnToHome}
              className={`group relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl 
              transition-all duration-200 overflow-hidden
              ${(isExpanded || isMobile) ? 'justify-start' : 'justify-center'}
              hover:bg-blue-500/10 text-blue-400 hover:text-blue-300`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/0 to-blue-500/0 group-hover:from-blue-500/5 transition-all duration-300"></div>
              <FaHome className="text-lg relative z-10" />
              {(isExpanded || isMobile) && (
                <span className="text-sm font-medium relative z-10">Return to Home</span>
              )}
              {/* Tooltip for collapsed desktop */}
              {(!isExpanded && !isMobile) && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap z-20 shadow-lg border border-white/10">
                  Return to Home
                </div>
              )}
            </button>
          </div>

          {/* Logout Button */}
          <div className="p-3 pt-0">
            <button
              onClick={handleLogout}
              className={`group relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl 
              transition-all duration-200 overflow-hidden
              ${(isExpanded || isMobile) ? 'justify-start' : 'justify-center'}
              hover:bg-red-500/10 text-red-400 hover:text-red-300`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/0 to-red-500/0 group-hover:from-red-500/5 transition-all duration-300"></div>
              <FaSignOutAlt className="text-lg relative z-10" />
              {(isExpanded || isMobile) && (
                <span className="text-sm font-medium relative z-10">Logout</span>
              )}
              {/* Tooltip for collapsed desktop */}
              {(!isExpanded && !isMobile) && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap z-20 shadow-lg border border-white/10">
                  Logout
                </div>
              )}
            </button>
          </div>

          {/* Version Info */}
          {(isExpanded || isMobile) && (
            <div className="px-4 pb-4">
              <p className="text-[10px] text-white/30 text-center">Version 2.0.0 | © 2024 Transev</p>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

// Enhanced SidebarLink Component
const SidebarLink = ({ icon, to, label, showText, isActive, color, isMobile, onClose }) => (
  <li>
    <Link
      to={to}
      onClick={() => {
        if (isMobile && onClose) onClose();
      }}
      className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl 
      transition-all duration-200 overflow-hidden
      ${showText ? 'justify-start' : 'justify-center'}
      ${isActive 
        ? `bg-gradient-to-r ${color} text-white shadow-lg` 
        : 'text-white/70 hover:text-white hover:bg-white/10'
      }`}
    >
      {/* Active Indicator */}
      {isActive && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"></div>
      )}
      
      {/* Icon with hover effect */}
      <span className={`text-xl relative z-10 transition-transform duration-200 group-hover:scale-110 ${
        isActive ? 'text-white' : 'text-white/70 group-hover:text-white'
      }`}>
        {icon}
      </span>
      
      {/* Label - Always visible on mobile, visible on desktop when expanded */}
      {showText && (
        <span className={`text-sm font-medium relative z-10 transition-all duration-200 ${
          isActive ? 'text-white' : 'text-white/80 group-hover:text-white'
        }`}>
          {label}
        </span>
      )}
      
      {/* Tooltip for collapsed desktop state */}
      {!showText && (
        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap z-20 shadow-lg border border-white/10">
          {label}
        </div>
      )}
    </Link>
  </li>
);

export default AdminSidebar;