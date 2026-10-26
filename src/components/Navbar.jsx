import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import slide1 from '../assets/c4.png';
import slide2 from '../assets/ev_charger.jpg';
import slide3 from '../assets/public.png';
import slide4 from '../assets/c3.png';
import about1 from '../assets/c2.png';
import about2 from '../assets/imagee2.jpg';
import logos from '../assets/up.png';
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [popupType, setPopupType] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [contactHovered, setContactHovered] = useState(false);
  const [contactClicked, setContactClicked] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mobilePopupType, setMobilePopupType] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  
  const BASE_URL_AND_PORT = "https://api.static.ev.transev.site";
  const API_KEY = "mlzuMoRFjdGhcFulLMaVtfwNAHycbBAf";
  const solutionCaptions = ['Home and Housing Societies', 'Office and Workplace', 'Public Places', 'Fleet Organization'];
  const aboutCaptions = ['Who we are', 'How we work'];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll);

    const initializeUser = () => {
      const storedToken = localStorage.getItem('auth_token');
      const storedRole = localStorage.getItem('user_role');
      
      console.log("🔍 Navbar Initialize - Stored Role:", storedRole);
      console.log("🔍 Stored Token exists:", !!storedToken);
      
      if (storedToken && storedRole) {
        setIsLoggedIn(true);
        setUserRole(storedRole);
        
        // Fetch profile based on role
        if (storedRole === 'admin') {
          console.log("✅ Admin role detected - fetching admin profile");
          fetchAdminProfile(storedToken);
        } else if (storedRole === 'user') {
          console.log("✅ User role detected - fetching user profile");
          fetchUserProfile(storedToken);
        } else {
          console.log("⚠️ Unknown role, defaulting to user");
          setUserRole('user');
          fetchUserProfile(storedToken);
        }
      } else if (storedToken && !storedRole) {
        // Try to detect role from token
        console.log("⚠️ No stored role, detecting from token...");
        try {
          const decoded = jwtDecode(storedToken);
          const role = (decoded.role === 'admin' || decoded.user_type === 'admin') ? 'admin' : 'user';
          localStorage.setItem('user_role', role);
          setUserRole(role);
          setIsLoggedIn(true);
          
          if (role === 'admin') {
            fetchAdminProfile(storedToken);
          } else {
            fetchUserProfile(storedToken);
          }
        } catch (error) {
          console.error("Token decode error:", error);
          setIsLoggedIn(false);
        }
      } else {
        console.log("❌ No token found");
        setIsLoggedIn(false);
        setUserData(null);
        setUserRole(null);
      }
    };

    initializeUser();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchAdminProfile = async (token) => {
    try {
      console.log("🟢 FETCHING ADMIN PROFILE API");
      const response = await fetch(`${BASE_URL_AND_PORT}/admin/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "API-KEY": API_KEY,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("✅ Admin Profile Data:", data);
        
        setUserData({
          name: data.name,
          email: data.email,
          role: 'admin',
          profile_picture: null,
        });
      } else {
        console.error("❌ Admin profile fetch failed");
        setIsLoggedIn(false);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_role');
      }
    } catch (error) {
      console.error("❌ Admin profile error:", error);
    }
  };

  const fetchUserProfile = async (token) => {
    try {
      console.log("🟢 FETCHING USER PROFILE API");
      const response = await fetch(`${BASE_URL_AND_PORT}/users/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "API-KEY": API_KEY,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("✅ User Profile Data:", data);
        
        const profilePic = data.user_data?.profile_picture;
        let profilePicUrl = null;
        
        if (profilePic && isBase64(profilePic)) {
          profilePicUrl = convertBase64ToBlob(profilePic);
        }
        
        setUserData({
          name: data.user_data?.name || data.user_data?.full_name,
          email: data.user_data?.email,
          role: 'user',
          profile_picture: profilePicUrl,
        });
      } else {
        console.error("❌ User profile fetch failed");
        setIsLoggedIn(false);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_role');
      }
    } catch (error) {
      console.error("❌ User profile error:", error);
    }
  };

  const isBase64 = (str) => {
    if (!str) return false;
    const base64Regex = /^(?:[A-Za-z0-9+\/]{4})*(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=)?$/;
    return base64Regex.test(str);
  };

  const convertBase64ToBlob = (base64String) => {
    const byteCharacters = atob(base64String);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = Array.from(slice, (char) => char.charCodeAt(0));
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    return URL.createObjectURL(new Blob(byteArrays, { type: "image/jpeg" }));
  };

  const isHomePage = location.pathname === '/';

  const handleImageClick = (caption) => {
    const formattedCaption = caption.toLowerCase().replace(/\s+/g, '-');
    if (popupType === 'solutions') navigate(`/solutions/${formattedCaption}`);
    else if (caption === 'Who we are') navigate('/about');
    else if (caption === 'How we work') navigate('/how-we-work');
  };

  const handleMobilePopupClick = (section, caption) => {
    const formattedCaption = caption.toLowerCase().replace(/\s+/g, '-');
    setMobilePopupType(null);
    if (section === 'solutions') navigate(`/solutions/${formattedCaption}`);
    else if (section === 'about') {
      if (caption === 'Who we are') navigate('/about');
      else if (caption === 'How we work') navigate('/how-we-work');
    }
  };

  const handleContactClick = () => {
    setContactClicked(true);
    setTimeout(() => navigate('/contact'), 500);
  };

  const handleUserIconClick = () => {
    console.log("🎯 User Icon Clicked - Role:", userRole);
    
    if (userRole === 'admin') {
      console.log("➡️ Redirecting to Admin Dashboard");
      navigate('/admin/dashboard');
    } else {
      console.log("➡️ Redirecting to User Dashboard");
      navigate('/dashboard');
    }
  };

  const handleLogout = async () => {
    const currentToken = localStorage.getItem("auth_token");
    if (!currentToken) return;

    try {
      const endpoint = userRole === 'admin' ? '/admin/logout' : '/users/logout';
      
      await fetch(`${BASE_URL_AND_PORT}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentToken}`,
          "API-Key": API_KEY,
        },
      }).catch(err => console.log("Logout API error:", err));

      localStorage.removeItem("auth_token");
      localStorage.removeItem("login_timestamp");
      localStorage.removeItem("user_role");
      setIsLoggedIn(false);
      setUserData(null);
      setUserRole(null);
      setShowLogoutConfirm(false);
      navigate('/');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav
      className={`top-0 left-0 w-full transition-all duration-300 z-10 ${isScrolled || !isHomePage || popupType ? 'bg-white text-black' : 'bg-transparent text-white'} ${isScrolled ? 'fixed' : 'absolute'}`}
      onMouseLeave={() => setPopupType(null)}
    >
      <div className="flex flex-wrap md:flex-nowrap items-center justify-between px-4 md:px-10 py-4 md:py-6 w-full">
        <Link to="/">
          <img src={logos} alt="Logo" className="w-20 sm:w-24 md:w-28 lg:w-32" />
        </Link>

        <div className="md:hidden flex items-center">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-black focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        <div className="hidden md:flex w-full md:w-auto justify-start md:justify-start">
          <div className="flex flex-wrap gap-4 sm:gap-6 md:gap-10 font-semibold text-sm sm:text-base md:text-xl">
            <div onMouseEnter={() => setPopupType('solutions')}>
              <Link to="/solution" className={`hover:underline ${popupType === 'solutions' ? 'underline' : ''}`}>Solutions</Link>
            </div>
            <div onMouseEnter={() => setPopupType('about')}>
              <Link to="/about" className={`hover:underline ${popupType === 'about' ? 'underline' : ''}`}>About Us</Link>
            </div>
            <div onMouseEnter={() => setPopupType(null)}>
              <Link to="/news" className="hover:underline">News</Link>
            </div>
             <div onMouseEnter={() => setPopupType(null)}>
              <Link to="/blog" className="hover:underline">Blog</Link>
            </div>
          </div>
        </div>

        <div className="flex gap-4 items-center mt-4 md:mt-0">
          {isLoggedIn ? (
            <>
              <div onClick={handleUserIconClick} className="cursor-pointer hover:opacity-80 transition-opacity">
                {userData?.profile_picture ? (
                  <img 
                    src={userData.profile_picture} 
                    alt="Profile" 
                    className="w-8 h-8 rounded-full object-cover border-2 border-gray-300"
                  />
                ) : (
                  <FaUserCircle size={30} color={isScrolled || !isHomePage || popupType ? "black" : "white"} />
                )}
              </div>
              
              {/* <button
                onClick={() => setShowLogoutConfirm(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all duration-300 text-sm font-medium"
              >
                <FaSignOutAlt size={14} />
                <span className="hidden sm:inline">Logout</span>
              </button> */}
            </>
          ) : (
            <Link to="/login" className="hover:underline font-medium text-base">Login</Link>
          )}
          
          <button
            onClick={handleContactClick}
            onMouseEnter={() => setContactHovered(true)}
            onMouseLeave={() => setContactHovered(false)}
            className="flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-black text-white rounded-full hover:bg-gray-800 transition"
          >
            Contact
            {(contactHovered || contactClicked) && (
              <div className="ml-2 w-8 h-8 sm:w-10 sm:h-10 bg-yellow-500 rounded-full flex items-center justify-center transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 sm:w-6 h-4 sm:h-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm mx-4">
            <h3 className="text-xl font-bold text-gray-800 mb-3">Confirm Logout</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to logout?</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup Section - Keep your existing code */}
      {popupType && (
        <div className="w-full px-4 md:px-10 pb-6 hidden md:block">
          {/* Your existing popup content */}
          <div className="border-t border-gray-300 py-4">
            <h2 className="text-lg font-semibold">
              {popupType === 'solutions' ? 'Solutions' : 'About Us'}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {(popupType === 'solutions' ? [slide1, slide2, slide3, slide4] : [about1, about2]).map((img, i) => (
              <div key={i} className="relative group cursor-pointer" onClick={() => handleImageClick(popupType === 'solutions' ? solutionCaptions[i] : aboutCaptions[i])}>
                <img src={img} alt="popup" className="w-full h-[220px] object-cover rounded-lg shadow-md transition-transform duration-300 transform group-hover:scale-105" />
                <span className="block mt-2 text-sm font-medium text-center">
                  {popupType === 'solutions' ? solutionCaptions[i] : aboutCaptions[i]}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'} bg-white text-black px-4 py-6 absolute top-0 left-0 w-full min-h-[20vh] z-20`}>
        <div className="flex justify-end">
          <button onClick={() => setIsMenuOpen(false)} className="text-black text-3xl font-bold">&times;</button>
        </div>
        <div className="flex flex-wrap items-center gap-6 text-base font-semibold mt-6 justify-center">
          <div onClick={() => setMobilePopupType('solutions')} className="cursor-pointer hover:underline">Solutions</div>
          <div onClick={() => setMobilePopupType('about')} className="cursor-pointer hover:underline">About Us</div>
          <Link to="/news" className="hover:underline">News</Link>
          
          {isLoggedIn ? (
            <>
              <div onClick={() => {
                setIsMenuOpen(false);
                handleUserIconClick();
              }} className="cursor-pointer hover:underline">
                {userRole === 'admin' ? 'Admin Dashboard' : 'Dashboard'}
              </div>
              <button onClick={() => {
                setIsMenuOpen(false);
                setShowLogoutConfirm(true);
              }} className="hover:underline text-red-600">
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" onClick={() => setIsMenuOpen(false)} className="hover:underline text-base">Login</Link>
          )}
          
          <button onClick={() => {
            setIsMenuOpen(false);
            handleContactClick();
          }} className="flex items-center px-3 py-2 bg-black text-white rounded-full text-sm">
            Contact
          </button>
        </div>

        {mobilePopupType && (
          <div className="w-full px-4 py-4 mt-4 bg-white">
            <h3 className="text-lg font-semibold text-center">{mobilePopupType === 'solutions' ? 'Solutions' : 'About Us'}</h3>
            <div className="grid grid-cols-2 gap-4">
              {(mobilePopupType === 'solutions' ? solutionCaptions : aboutCaptions).map((caption, index) => (
                <div key={index} className="flex flex-col items-center cursor-pointer" onClick={() => handleMobilePopupClick(mobilePopupType, caption)}>
                  <span className="text-center text-sm">{caption}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;