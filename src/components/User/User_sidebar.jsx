import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  FaBars, 
  FaAngleDoubleLeft, 
  FaAngleDoubleRight,
  FaHome, 
  FaBox, 
  FaShoppingCart, 
  FaClipboardList, 
  FaUserCircle, 
  FaCog, 
  FaSignOutAlt,
  FaThLarge,
  FaChartLine,
  FaBolt
} from "react-icons/fa";
import { MdDashboard, MdElectricBolt, MdOutlineSpaceDashboard, MdSpeed, MdFlashOn, MdLightbulb, MdTipsAndUpdates } from "react-icons/md";
import { HiOutlineShoppingBag, HiOutlineUser, HiOutlineCog } from "react-icons/hi";
import { FiPackage, FiShoppingCart, FiClipboard, FiHome } from "react-icons/fi";
import { LuLayoutDashboard } from "react-icons/lu";
import { FaLeaf, FaRecycle, FaBatteryFull, FaPlug, FaCar, FaBell } from "react-icons/fa";
import logo from "../../assets/log.png";

const BASE_URL_AND_PORT = "https://api.static.ev.transev.site";
const API_KEY = "mlzuMoRFjdGhcFulLMaVtfwNAHycbBAf";


const DidYouKnowCarousel = () => {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showIcon, setShowIcon] = useState(true);

  const tips = [
    { icon: <FaLeaf className="text-emerald-300 text-lg" />, text: "Zero tailpipe emissions, cleaner air.", emoji: "🌿" },
    { icon: <FaCar className="text-emerald-300 text-lg" />, text: "EVs cost less to operate.", emoji: "💰" },
    { icon: <MdElectricBolt className="text-yellow-300 text-lg" />, text: "Instant torque, faster acceleration.", emoji: "⚡" },
    { icon: <FaBatteryFull className="text-emerald-300 text-lg" />, text: "Regenerative braking saves energy.", emoji: "🔋" },
    { icon: <MdTipsAndUpdates className="text-emerald-300 text-lg" />, text: "Fewer parts, lower maintenance.", emoji: "🔧" },
    { icon: <FaPlug className="text-emerald-300 text-lg" />, text: "Charge at home conveniently.", emoji: "🏠" },
    { icon: <FaBell className="text-emerald-300 text-lg" />, text: "Quiet rides reduce noise pollution.", emoji: "🤫" },
    { icon: <MdSpeed className="text-emerald-300 text-lg" />, text: "Fast charging saves valuable time.", emoji: "⏱️" },
    { icon: <FaRecycle className="text-emerald-300 text-lg" />, text: "Batteries can be recycled.", emoji: "♻️" },
    { icon: <FaLeaf className="text-emerald-300 text-lg" />, text: "Driving electric supports sustainability.", emoji: "🌍" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setShowIcon(false);
      setTimeout(() => {
        setCurrentTipIndex((prev) => (prev + 1) % tips.length);
        setShowIcon(true);
        setIsAnimating(false);
      }, 500);
    }, 10000);

    return () => clearInterval(interval);
  }, [tips.length]);

  const currentTip = tips[currentTipIndex];

  return (
    <div className="relative overflow-hidden rounded-xl mb-0 group">
      {/* Glowing Border Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-500 rounded-xl opacity-40 group-hover:opacity-70 transition-opacity duration-500 blur-md"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 rounded-xl opacity-60 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Main Container - Same as sidebar */}
      <div className={`relative bg-gradient-to-br from-[#059669]/95 to-[#022c22]/95 backdrop-blur-sm rounded-xl m-[1px] p-3 transition-all duration-500 ${isAnimating ? 'scale-95 opacity-50' : 'scale-100 opacity-100'}`}>
        
        {/* Background Glow */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-emerald-500/20 to-transparent rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-teal-500/20 to-transparent rounded-full blur-2xl"></div>

        {/* Header - Brighter for contrast */}
        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/15 relative">
          <div className="w-7 h-7 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/40">
            <MdLightbulb className="text-white text-sm" />
          </div>
          <div>
            <h3 className="text-white font-bold text-sm tracking-wide">
              ⚡ Did You Know?
            </h3>
            <p className="text-emerald-300/80 text-[12px]">Amazing EV facts</p>
          </div>
          
          {/* Decorative Icon */}
          <div className="absolute right-0 top-0 text-emerald-400/30 text-2xl">
            {currentTip.emoji}
          </div>
        </div>

        {/* Tip Content */}
        <div className="flex items-center gap-3 min-h-[60px]">
          {/* Animated Icon Container */}
          <div className={`flex-shrink-0 transition-all duration-500 transform ${showIcon ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/20 shadow-lg backdrop-blur-sm">
              {currentTip.icon}
            </div>
          </div>

          {/* Text Content */}
          <div className={`flex-1 transition-all duration-500 transform ${showIcon ? 'translate-x-0 opacity-100' : 'translate-x-2 opacity-0'}`}>
            <p className="text-white text-xs font-medium leading-relaxed">
              {currentTip.text}
            </p>
          </div>
        </div>

        {/* Bottom Decorative Line */}
        <div className="mt-2 pt-1">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent"></div>
        </div>
      </div>
    </div>
  );
};

const Sidebar = ({ sidebarOpen = true, toggleSidebar = () => {} }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(sidebarOpen);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsExpanded(sidebarOpen);
      } else {
        setIsExpanded(false);
      }
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, [sidebarOpen]);

  // Update local state when sidebarOpen prop changes
  useEffect(() => {
    if (!isMobile) {
      setIsExpanded(sidebarOpen);
    }
  }, [sidebarOpen, isMobile]);

  const handleToggle = () => {
    const newState = !isExpanded;
    setIsExpanded(newState);
    if (toggleSidebar) {
      toggleSidebar();
    }
  };

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

  const menuItems = [
    { icon: <LuLayoutDashboard />, to: "/dashboard", label: "Dashboard" },
    { icon: <FiPackage />, to: "/products", label: "Products" },
    { icon: <FiShoppingCart />, to: "/cart", label: "Shopping Cart" },
    { icon: <FiClipboard />, to: "/order", label: "My Orders" },
    { icon: <HiOutlineUser />, to: "/profile", label: "My Profile" },
    { icon: <HiOutlineCog />, to: "/setting", label: "Settings" },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-all duration-300"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full bg-gradient-to-br from-[#059669] to-[#022c22] text-white z-50 shadow-2xl
          transition-all duration-300 ease-in-out overflow-y-auto overflow-x-hidden
          ${isMobile ? (sidebarOpen ? "translate-x-0" : "-translate-x-full") : "translate-x-0"}
          ${!isMobile && (isExpanded ? "w-72" : "w-24")}
          ${isMobile && "w-72"}
          flex flex-col
          scrollbar-hide
        `}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style jsx>{`
          aside::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        {/* Decorative top gradient */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

        {/* Header with Logo */}
        <div className="relative px-5 py-6">
          <div className="flex items-center justify-between">
            <Link 
              to="/dashboard" 
              onClick={() => {
                if (isMobile && toggleSidebar) toggleSidebar();
              }} 
              className="flex items-center gap-3 group"
            >
              <div className="relative">
                {/* Logo background glow */}
                <div className="absolute -inset-1 bg-white/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <img
                  src={logo}
                  alt="Logo"
                  className={`h-11 w-auto transition-all duration-300 relative z-10 ${
                    isExpanded || isMobile ? "block" : "hidden"
                  }`}
                />
                {(!isExpanded && !isMobile) && (
                  <div className="w-11 h-11 bg-gradient-to-br from-white to-green-100 rounded-xl flex items-center justify-center shadow-lg relative z-10">
                    <MdElectricBolt className="text-[#1a4d2e] text-2xl" />
                  </div>
                )}
              </div>
            </Link>

            {/* Desktop Toggle Button */}
            {!isMobile && (
              <button
                onClick={handleToggle}
                className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-300 hover:scale-110 group"
              >
                {isExpanded ? (
                  <FaAngleDoubleLeft className="text-white text-sm group-hover:rotate-12 transition-transform" />
                ) : (
                  <FaAngleDoubleRight className="text-white text-sm group-hover:-rotate-12 transition-transform" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Did You Know Carousel - NO GAP below */}
        {(isExpanded || isMobile) && (
          <div className="px-4">
            <DidYouKnowCarousel />
          </div>
        )}

        {/* Navigation Menu - Directly attached with no gap */}
        <div className="px-4 py-2">
          <ul className="space-y-2">
            {menuItems.map((item, index) => {
              const active = isActive(item.to);
              return (
                <li key={index}>
                  <Link
                    to={item.to}
                    onMouseEnter={() => setHoveredItem(index)}
                    onMouseLeave={() => setHoveredItem(null)}
                    onClick={() => {
                      if (isMobile && toggleSidebar) toggleSidebar();
                    }}
                    className={`
                      group relative flex items-center gap-4 px-4 py-3 rounded-xl
                      transition-all duration-300 ease-in-out
                      ${active 
                        ? 'bg-gradient-to-r from-green-400 to-green-600 text-white shadow-lg shadow-green-500/30' 
                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                      }
                      ${(!isExpanded && !isMobile) && 'justify-center px-2'}
                    `}
                  >
                    {!active && (
                      <div className={`absolute inset-0 rounded-xl bg-white/0 transition-all duration-300 ${hoveredItem === index ? 'bg-white/5' : ''}`} />
                    )}
                    
                    <span className={`relative text-xl transition-all duration-300 ${active ? 'text-white' : 'text-white/70 group-hover:text-white'} ${(!isExpanded && !isMobile) && 'text-2xl'}`}>
                      {item.icon}
                    </span>
                    
                    {(isExpanded || isMobile) && (
                      <span className={`text-sm font-medium transition-all duration-300 ${active ? 'translate-x-1' : ''}`}>
                        {item.label}
                      </span>
                    )}
                    
                    {/* Active indicator dot */}
                    {active && (isExpanded || isMobile) && (
                      <div className="absolute left-0 w-1 h-8 bg-white rounded-r-full shadow-lg" />
                    )}
                    
                    {/* Tooltip for collapsed desktop mode */}
                    {(!isExpanded && !isMobile) && (
                      <div className="absolute left-full ml-3 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-xl border border-white/10">
                        {item.label}
                        <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45" />
                      </div>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Bottom Section */}
        <div className="relative mt-auto">
          {/* Decorative divider */}
          <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          
          <div className="px-4 py-5">
            <ul className="space-y-2">
              {/* Return to Home */}
              <li>
                <Link
                  to="/"
                  onClick={() => {
                    if (isMobile && toggleSidebar) toggleSidebar();
                  }}
                  className={`
                    flex items-center gap-4 px-4 py-3 rounded-xl
                    transition-all duration-300 ease-in-out
                    text-white/70 hover:bg-white/10 hover:text-white
                    ${(!isExpanded && !isMobile) && 'justify-center px-2'}
                    group relative
                  `}
                >
                  <FiHome className="text-xl" />
                  {(isExpanded || isMobile) && <span className="text-sm font-medium">Return to Home</span>}
                  {(!isExpanded && !isMobile) && (
                    <div className="absolute left-full ml-3 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-xl border border-white/10">
                      Return to Home
                      <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45" />
                    </div>
                  )}
                </Link>
              </li>

              {/* Logout Button */}
              <li>
                <button
                  onClick={handleLogout}
                  className={`
                    w-full flex items-center gap-4 px-4 py-3 rounded-xl
                    transition-all duration-300 ease-in-out
                    text-red-300/80 hover:bg-red-500/20 hover:text-red-200
                    ${(!isExpanded && !isMobile) && 'justify-center px-2'}
                    group relative
                  `}
                >
                  <FaSignOutAlt className="text-xl" />
                  {(isExpanded || isMobile) && <span className="text-sm font-medium">Logout</span>}
                  {(!isExpanded && !isMobile) && (
                    <div className="absolute left-full ml-3 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-xl border border-white/10">
                      Logout
                      <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45" />
                    </div>
                  )}
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Decorative bottom gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
      </aside>
    </>
  );
};

export default Sidebar;