
import React, { useState, useEffect, useRef } from "react";
import { FaBars, FaUserCircle, FaChevronDown, FaSignOutAlt, FaUser, FaBell, FaEnvelope } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../Admin/Admin_sidebar";
import logo from "../../assets/log.png";
import { Link, useLocation } from "react-router-dom";
const BASE_URL_AND_PORT = "https://api.static.ev.transev.site";
const API_KEY = "mlzuMoRFjdGhcFulLMaVtfwNAHycbBAf";

const AdminNavbar = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const dropdownRef = useRef(null);
  const notificationsRef = useRef(null);
  const navigate = useNavigate();

  const toggleSidebar = () => setSidebarVisible(!sidebarVisible);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const toggleNotifications = () => setNotificationsOpen(!notificationsOpen);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("auth_token");
      if (!token) return;

      try {
        const response = await fetch(`${BASE_URL_AND_PORT}/admin/profile`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "API-KEY": API_KEY,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        } else {
          console.error("❌ Failed to fetch admin profile");
        }
      } catch (error) {
        console.error("❌ Error fetching admin profile:", error);
      }
    };

    fetchUserProfile();

    // Sample notifications (replace with actual API call)
    setNotifications([
      { id: 1, title: "New user registered", time: "5 min ago", read: false },
      { id: 2, title: "Order #1234 completed", time: "1 hour ago", read: false },
      { id: 3, title: "Low stock alert", time: "3 hours ago", read: true },
    ]);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
        navigate("/login");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const goToProfile = () => {
    setDropdownOpen(false);
    navigate("/admin/profile");
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      <nav className="bg-gradient-to-r from-[#1a2f3e] to-[#2c4a5e] shadow-lg sticky top-0 z-50 w-full">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            
            {/* Left Section - Logo & Menu */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Mobile Menu Button */}
              <button 
                onClick={toggleSidebar} 
                className="lg:hidden text-white hover:text-[#ffd700] transition-colors duration-200 p-2 rounded-lg hover:bg-white/10"
                aria-label="Toggle Menu"
              >
                <FaBars size={22} />
              </button>
              
              {/* Logo */}
            <div className="flex items-center gap-2 sm:gap-3 cursor-pointer" onClick={() => navigate("/admin/dashboard")}>
  <Link to="/dashboard" className="flex items-center gap-2 sm:gap-3 group ml-2 sm:ml-8 md:ml-12">
    <div className="relative">
      <img
        src={logo}
        alt="TransEV Logo"
        className="h-8 sm:h-10 md:h-11 w-auto transition-all duration-300 group-hover:scale-105"
      />
      <div className="absolute -inset-1 bg-white/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    </div>
    
    {/* Logo Text - Hidden on very small screens */}
   
  </Link>
</div>
</div>

            {/* Right Section - Actions & Profile */}
            <div className="flex items-center gap-2 sm:gap-4">
              
              {/* Notifications */}
              <div className="relative" ref={notificationsRef}>
                {/* <button
                  onClick={toggleNotifications}
                  className="relative p-2 text-white hover:text-[#ffd700] transition-colors duration-200 rounded-lg hover:bg-white/10"
                  aria-label="Notifications"
                >
                  <FaBell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button> */}

                {/* Notifications Dropdown */}
                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl overflow-hidden z-50 animate-fadeIn">
                    <div className="p-4 bg-gradient-to-r from-[#1a2f3e] to-[#2c4a5e]">
                      <h3 className="text-white font-semibold">Notifications</h3>
                      <p className="text-white/60 text-xs mt-1">You have {unreadCount} unread notifications</p>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((notif) => (
                          <div 
                            key={notif.id} 
                            className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${!notif.read ? 'bg-blue-50' : ''}`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-2 h-2 mt-2 rounded-full ${!notif.read ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                              <div className="flex-1">
                                <p className={`text-sm ${!notif.read ? 'font-semibold text-gray-800' : 'text-gray-600'}`}>
                                  {notif.title}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-8 text-center text-gray-400">
                          <FaBell size={40} className="mx-auto mb-2 opacity-30" />
                          <p>No notifications</p>
                        </div>
                      )}
                    </div>
                    <div className="p-3 bg-gray-50 text-center">
                      <button className="text-sm text-[#1a2f3e] hover:text-[#ffd700] font-medium transition-colors">
                        View All Notifications
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Admin Profile Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={toggleDropdown}
                  className="flex items-center gap-2 sm:gap-3 hover:bg-white/10 rounded-lg p-1.5 sm:p-2 transition-all duration-200 group"
                  aria-label="Profile Menu"
                >
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-[#ffd700] to-[#ffed4a] flex items-center justify-center shadow-lg">
                      {userData?.profile_picture ? (
                        <img 
                          src={userData.profile_picture} 
                          alt="Profile" 
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <FaUserCircle className="text-[#1a2f3e] text-xl sm:text-2xl" />
                      )}
                    </div>
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
                  </div>
                  
                  {/* Admin Info */}
                  <div className="hidden md:block text-left">
                    <p className="text-white text-sm font-medium">
                      {userData?.name || "Admin User"}
                    </p>
                    <p className="text-white/60 text-xs">
                      {userData?.role || "Administrator"}
                    </p>
                  </div>
                  
                  <FaChevronDown 
                    className={`text-white/70 text-xs transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} 
                  />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl overflow-hidden z-50 animate-slideDown">
                    {/* User Info Header */}
                    <div className="p-4 bg-gradient-to-r from-[#1a2f3e] to-[#2c4a5e]">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#ffd700] to-[#ffed4a] flex items-center justify-center">
                          {userData?.profile_picture ? (
                            <img 
                              src={userData.profile_picture} 
                              alt="Profile" 
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <FaUserCircle className="text-[#1a2f3e] text-2xl" />
                          )}
                        </div>
                        <div>
                          <p className="text-white font-semibold">{userData?.name || "Admin User"}</p>
                          <p className="text-white/60 text-xs">{userData?.email || "admin@example.com"}</p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <button
                        onClick={goToProfile}
                        className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors group"
                      >
                        <FaUser className="text-gray-400 group-hover:text-[#1a2f3e]" />
                        <span className="text-sm">My Profile</span>
                      </button>
                      
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors group"
                      >
                        <FaSignOutAlt className="text-red-400 group-hover:text-red-600" />
                        <span className="text-sm">Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      {sidebarVisible && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fadeIn"
            onClick={() => setSidebarVisible(false)}
          ></div>
          <div className="absolute left-0 top-0 h-full w-72 bg-white shadow-2xl animate-slideInRight">
            <AdminSidebar 
              isVisible={sidebarVisible} 
              onClose={() => setSidebarVisible(false)} 
            />
          </div>
        </div>
      )}

      {/* Add these styles to your global CSS or tailwind.config.js */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideInRight {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }
        .animate-slideInRight {
          animation: slideInRight 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default AdminNavbar;