import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from './Admin_sidebar';
import AdminNavbar from './Admin_navbar';
import { 
  FaUserCircle, 
  FaEnvelope, 
  FaLock, 
  FaUserTag, 
  FaSave, 
  FaTimes, 
  FaEdit, 
  FaCheckCircle,
  FaShieldAlt,
  FaBell,
  FaCamera,
  FaPhone,
  FaMapMarkerAlt,
  FaSpinner,
  FaArrowLeft,
  FaArrowRight,
  FaUser,
  FaIdCard,
  FaCalendarAlt,
  FaGlobe,
  FaBuilding,
  FaHeart,
  FaStar
} from 'react-icons/fa';
import { HiOutlineRefresh } from 'react-icons/hi';

const Profile = () => {
  const BASE_URL_AND_PORT = "https://api.static.ev.transev.site";
  const API_KEY = "mlzuMoRFjdGhcFulLMaVtfwNAHycbBAf";

  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    about: '',
    email: '',
    phone_number: '',
    role: '',
    address: '',
    email_verified: false,
    password: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [activeTab, setActiveTab] = useState('profile');
  const [hoveredCard, setHoveredCard] = useState(null);

  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Handle responsive sidebar state
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else if (window.innerWidth < 1024 && window.innerWidth >= 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(false);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const showNotification = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('auth_token');
      const userId = localStorage.getItem('user_id');

      if (!token || !userId) {
        navigate('/admin/login');
        return;
      }

      try {
        const response = await fetch(`${BASE_URL_AND_PORT}/admin/profile`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'API-KEY': API_KEY,
          },
        });

        const data = await response.json();
        if (response.ok) {
          const userData = data.user_data || data;
          setUser(userData);
          setFormData({ ...formData, ...userData });
        } else {
          setError(data.message || 'Failed to fetch user details');
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
        setError('An error occurred while fetching user details.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setIsUpdated(true);
  };

  const handleUpdateDetails = async () => {
    const token = localStorage.getItem('auth_token');
  
    const dataToUpdate = {
      name: formData.name,
      email: formData.email,
      password: formData.password || '',
    };
  
    try {
      const response = await fetch(`${BASE_URL_AND_PORT}/admin/update`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'API-KEY': API_KEY,
        },
        body: JSON.stringify(dataToUpdate),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setUser(data.updatedUser);
        setIsEditing(false);
        setIsUpdated(false);
        setSuccessMessage('User details updated successfully!');
        setError('');
        showNotification('Profile updated successfully!', 'success');
      } else {
        setError(data.message || 'Failed to update user details');
        setSuccessMessage('');
        showNotification(data.message || 'Failed to update profile', 'error');
      }
    } catch (error) {
      console.error('Error updating details:', error);
      setError('An error occurred while updating details.');
      setSuccessMessage('');
      showNotification('An error occurred while updating profile', 'error');
    }
  };

  const handleVerifyEmail = async () => {
    const token = localStorage.getItem('auth_token');
    const userId = localStorage.getItem('user_id');

    try {
      const response = await fetch(`${BASE_URL_AND_PORT}/admin/otp/generate`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'API-KEY': API_KEY,
        },
        body: JSON.stringify({ id: userId, purpose: 'Mail Verification' }),
      });

      const data = await response.json();

      if (response.ok) {
        setShowOtpPopup(true);
        setOtpError('');
        showNotification('OTP sent to your email!', 'info');
      } else {
        setOtpError(data.message || 'Failed to send OTP');
        showNotification(data.message || 'Failed to send OTP', 'error');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      setOtpError('An error occurred while sending OTP.');
    }
  };

  const handleVerifyOtp = async () => {
    const token = localStorage.getItem('auth_token');

    try {
      const response = await fetch(`${BASE_URL_AND_PORT}/admin/otp/verify/email`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'API-KEY': API_KEY,
        },
        body: JSON.stringify({
          email: formData.email,
          otp_code: otp,
          purpose: 'Mail Verification',
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setFormData((prevData) => ({
          ...prevData,
          email_verified: true,
        }));
        setShowOtpPopup(false);
        setSuccessMessage('Email verified successfully!');
        showNotification('Email verified successfully!', 'success');
      } else {
        setOtpError(data.message || 'Invalid OTP');
        showNotification(data.message || 'Invalid OTP', 'error');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setOtpError('An error occurred while verifying OTP.');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
        <AdminNavbar onToggleSidebar={toggleSidebar} />
        <div className="flex flex-1 relative">
          <AdminSidebar isVisible={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500 mx-auto"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <FaUserCircle className="text-purple-300 text-2xl" />
                </div>
              </div>
              <p className="text-white/70 text-lg mt-4 font-light">Loading your profile...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'profile', label: 'Profile Information', icon: <FaUser size={14} /> },
    // { id: 'security', label: 'Security', icon: <FaShieldAlt size={14} /> },
    // { id: 'notifications', label: 'Notifications', icon: <FaBell size={14} /> },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className={`fixed top-20 right-4 z-50 animate-slideIn ${
          toastType === 'success' ? 'bg-gradient-to-r from-emerald-500 to-green-500' : 
          toastType === 'error' ? 'bg-gradient-to-r from-red-500 to-rose-500' : 
          'bg-gradient-to-r from-blue-500 to-cyan-500'
        } text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-sm font-medium backdrop-blur-sm`}>
          <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
            {toastType === 'success' ? '✓' : toastType === 'error' ? '✗' : 'ℹ'}
          </div>
          {toastMessage}
        </div>
      )}

      <AdminNavbar onToggleSidebar={toggleSidebar} />
      
      <div className="flex flex-1 relative">
        <AdminSidebar 
          isVisible={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
        />

        <main 
          className={`
            flex-1 transition-all duration-500 ease-out w-full min-h-screen
            ${sidebarOpen ? 'lg:ml-72' : 'lg:ml-24'}
            ${isMobile && sidebarOpen ? 'overflow-hidden' : ''}
          `}
        >
          <div className="p-4 md:p-6 lg:p-8">
            <div className="max-w-5xl mx-auto">
              
              {/* Breadcrumb */}
              <div className="mb-6">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-white/50">Dashboard</span>
                  <span className="text-white/30">›</span>
                  <span className="text-purple-400">Profile</span>
                </div>
              </div>

              {/* Header */}
              <div className="mb-8">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent animate-gradient">
                  Profile Settings
                </h1>
                <p className="text-white/50 text-sm md:text-base mt-2 font-light">
                  Manage your account information and preferences
                </p>
              </div>

              {/* Main Card */}
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
                {/* Profile Cover */}
                <div className="relative h-40 md:h-48 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600">
                  {/* Animated gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
                  
                  {/* Avatar Section */}
                  <div className="absolute -bottom-12 left-6 md:left-8">
                    <div className="relative group">
                      <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 p-0.5">
                        <div className="w-full h-full rounded-2xl bg-slate-900 flex items-center justify-center overflow-hidden">
                          <FaUserCircle className="text-purple-400 w-16 h-16 md:w-20 md:h-20" />
                        </div>
                      </div>
                      <button className="absolute bottom-0 right-0 bg-white rounded-full p-1.5 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-90 group-hover:scale-100">
                        <FaCamera className="text-purple-600 w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Decorative elements */}
                  <div className="absolute top-4 right-4 opacity-20">
                    <div className="w-20 h-20 rounded-full bg-white blur-2xl"></div>
                  </div>
                </div>

                {/* Profile Content */}
                <div className="pt-16 pb-6 md:pb-8 px-6 md:px-8">
                  {/* User Info Header */}
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 pb-4 border-b border-white/10">
                    <div>
                      <h2 className="text-2xl md:text-3xl font-bold text-white">{formData.name || 'Admin User'}</h2>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-500/20 border border-purple-500/30 text-purple-300 rounded-full text-xs font-medium backdrop-blur-sm">
                          <FaShieldAlt size={10} />
                          {formData.role || 'Administrator'}
                        </span>
                        {formData.email_verified && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-500/20 border border-green-500/30 text-green-300 rounded-full text-xs font-medium backdrop-blur-sm">
                            <FaCheckCircle size={10} />
                            Email Verified
                          </span>
                        )}
                      </div>
                    </div>
                    <div>
                      {!isEditing ? (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="group px-6 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-medium transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                          <FaEdit size={14} className="group-hover:rotate-12 transition-transform" />
                          Edit Profile
                        </button>
                      ) : (
                        <div className="flex gap-3">
                          <button
                            onClick={handleUpdateDetails}
                            className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white rounded-xl font-medium transition-all duration-300 flex items-center gap-2 shadow-lg"
                          >
                            <FaSave size={14} />
                            Save Changes
                          </button>
                          <button
                            onClick={() => {
                              setIsEditing(false);
                              setFormData({ ...formData, ...user });
                            }}
                            className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all duration-300 flex items-center gap-2 backdrop-blur-sm border border-white/20"
                          >
                            <FaTimes size={14} />
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Tabs */}
                  <div className="flex gap-2 mb-6 border-b border-white/10">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2.5 text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                          activeTab === tab.id
                            ? 'text-purple-400 border-b-2 border-purple-500'
                            : 'text-white/50 hover:text-white/80'
                        }`}
                      >
                        {tab.icon}
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Profile Tab Content */}
                  {activeTab === 'profile' && (
                    <div className="space-y-5">
                      {/* Stats Cards */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                        {[
                          { label: 'Member Since', value: '2024', icon: <FaCalendarAlt size={16} />, color: 'purple' },
                          { label: 'Account Status', value: 'Active', icon: <FaCheckCircle size={16} />, color: 'green' },
                          { label: 'Security Level', value: 'High', icon: <FaShieldAlt size={16} />, color: 'blue' }
                        ].map((stat, idx) => (
                          <div 
                            key={idx}
                            className={`bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-${stat.color}-500/50 transition-all duration-300 transform hover:-translate-y-1`}
                          >
                            <div className={`flex items-center gap-2 text-${stat.color}-400 mb-2`}>
                              {stat.icon}
                              <span className="text-xs uppercase tracking-wider text-white/50">{stat.label}</span>
                            </div>
                            <p className="text-white text-lg font-semibold">{stat.value}</p>
                          </div>
                        ))}
                      </div>

                      {/* Name Field */}
                      <div className="group">
                        <label className="block text-sm font-medium text-white/70 mb-2">
                          <FaUser className="inline mr-2 text-purple-400" size={14} />
                          Full Name
                        </label>
                        <div className={`relative ${isEditing ? 'animate-pulse-border' : ''}`}>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className={`w-full px-4 py-3 bg-white/5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-white placeholder-white/30 ${
                              isEditing 
                                ? 'border-purple-500/50 focus:border-transparent' 
                                : 'border-white/10 cursor-not-allowed opacity-70'
                            }`}
                          />
                        </div>
                      </div>

                      {/* Email Field */}
                      <div>
                        <label className="block text-sm font-medium text-white/70 mb-2">
                          <FaEnvelope className="inline mr-2 text-purple-400" size={14} />
                          Email Address
                        </label>
                        <div className="flex flex-col sm:flex-row gap-3">
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className={`flex-1 px-4 py-3 bg-white/5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-white placeholder-white/30 ${
                              isEditing 
                                ? 'border-purple-500/50 focus:border-transparent' 
                                : 'border-white/10 cursor-not-allowed opacity-70'
                            }`}
                          />
                          {!formData.email_verified && isEditing && (
                            <button
                              onClick={handleVerifyEmail}
                              className="px-5 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white rounded-xl font-medium transition-all duration-300 whitespace-nowrap shadow-lg"
                            >
                              Verify Email
                            </button>
                          )}
                          {formData.email_verified && (
                            <div className="flex items-center gap-2 px-4 py-3 bg-green-500/10 backdrop-blur-sm rounded-xl border border-green-500/30">
                              <FaCheckCircle className="text-green-400" size={16} />
                              <span className="text-green-300 text-sm font-medium">Verified</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Phone Number Field */}
                      {/* <div>
                        <label className="block text-sm font-medium text-white/70 mb-2">
                          <FaPhone className="inline mr-2 text-purple-400" size={14} />
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone_number"
                          value={formData.phone_number || '+91 XXXXXXXXXX'}
                          disabled={true}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white/50 cursor-not-allowed"
                        />
                        <p className="text-xs text-white/30 mt-1">Contact admin to change phone number</p>
                      </div> */}

                      {/* Role Field */}
                      <div>
                        <label className="block text-sm font-medium text-white/70 mb-2">
                          <FaUserTag className="inline mr-2 text-purple-400" size={14} />
                          Role
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            name="role"
                            value={formData.role}
                            disabled={true}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white/50 cursor-not-allowed"
                          />
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <FaShieldAlt className="text-purple-400/50" size={14} />
                          </div>
                        </div>
                      </div>

                      {/* Error Message */}
                      {error && (
                        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 backdrop-blur-sm">
                          <p className="text-red-400 text-sm">{error}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Security Tab Content */}
                  {activeTab === 'security' && (
                    <div className="space-y-5">
                      {/* Password Field */}
                      <div>
                        <label className="block text-sm font-medium text-white/70 mb-2">
                          <FaLock className="inline mr-2 text-purple-400" size={14} />
                          Password
                        </label>
                        <input
                          type="password"
                          name="password"
                          value={formData.password || ''}
                          onChange={handleChange}
                          disabled={!isEditing}
                          placeholder={isEditing ? "Enter new password (leave blank to keep current)" : "••••••••"}
                          className={`w-full px-4 py-3 bg-white/5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-white placeholder-white/30 ${
                            isEditing 
                              ? 'border-purple-500/50 focus:border-transparent' 
                              : 'border-white/10 cursor-not-allowed opacity-70'
                          }`}
                        />
                        {isEditing && (
                          <p className="text-xs text-white/40 mt-1 flex items-center gap-1">
                            <FaInfoCircle size={10} />
                            Leave blank to keep current password
                          </p>
                        )}
                      </div>

                      {/* Two-Factor Authentication Card */}
                      <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-xl p-5 border border-purple-500/20 mt-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                              <FaShieldAlt className="text-purple-400" size={20} />
                            </div>
                            <div>
                              <h4 className="font-semibold text-white">Two-Factor Authentication</h4>
                              <p className="text-xs text-white/50 mt-1">Add an extra layer of security to your account</p>
                            </div>
                          </div>
                          <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition border border-white/20">
                            Enable
                          </button>
                        </div>
                      </div>

                      {/* Recent Activity */}
                      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10">
                        <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                          <FaClock size={14} className="text-purple-400" />
                          Recent Login Activity
                        </h4>
                        <div className="space-y-2">
                          {[
                            { device: 'Chrome on Windows', location: 'Kolkata, India', time: '2 hours ago', ip: '103.xxx.xx.xx' },
                            { device: 'Safari on Mac', location: 'Mumbai, India', time: '2 days ago', ip: '203.xxx.xx.xx' }
                          ].map((activity, idx) => (
                            <div key={idx} className="flex justify-between items-center py-2 border-b border-white/10 last:border-0">
                              <div>
                                <p className="text-white text-sm font-medium">{activity.device}</p>
                                <p className="text-white/40 text-xs">{activity.location}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-white/40 text-xs">{activity.time}</p>
                                <p className="text-white/30 text-xs">{activity.ip}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Notifications Tab Content */}
                  {activeTab === 'notifications' && (
                    <div className="space-y-4">
                      {[
                        { title: 'Email Notifications', description: 'Receive email updates about your account activity', enabled: true },
                        { title: 'Security Alerts', description: 'Get notified about suspicious login attempts', enabled: true },
                        { title: 'Marketing Updates', description: 'Receive promotional emails and updates', enabled: false },
                        { title: 'Order Updates', description: 'Get notifications about order status changes', enabled: true }
                      ].map((notification, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-purple-500/30 transition-all duration-300">
                          <div>
                            <h4 className="font-medium text-white">{notification.title}</h4>
                            <p className="text-xs text-white/40 mt-1">{notification.description}</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" defaultChecked={notification.enabled} className="sr-only peer" />
                            <div className="w-11 h-6 bg-white/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-purple-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Security Information Footer */}
                  <div className="mt-8 pt-6 border-t border-white/10">
                    <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 backdrop-blur-sm rounded-xl p-4 border border-blue-500/20">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                          <FaShieldAlt className="text-blue-400" size={18} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-white text-sm">Security Information</h4>
                          <p className="text-xs text-white/40 mt-1">
                            Your account is protected with industry-standard security measures. 
                            For any security concerns, please contact the system administrator.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* OTP Verification Modal */}
      {showOtpPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50 p-4 animate-fadeIn">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl w-full max-w-md mx-auto overflow-hidden border border-white/20">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4">
              <h3 className="text-xl font-bold text-white">Email Verification</h3>
              <p className="text-purple-200 text-sm mt-1">Enter the OTP sent to your email</p>
            </div>
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FaEnvelope className="text-purple-400" size={28} />
                </div>
                <p className="text-white/70 text-sm">
                  We've sent a verification code to <br />
                  <span className="font-semibold text-white">{formData.email}</span>
                </p>
              </div>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit OTP"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white text-center text-2xl tracking-widest placeholder-white/30"
                maxLength="6"
                autoFocus
              />
              {otpError && (
                <p className="text-red-400 text-sm text-center mt-2">{otpError}</p>
              )}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleVerifyOtp}
                  className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-semibold transition-all duration-300"
                >
                  Verify OTP
                </button>
                <button
                  onClick={() => {
                    setShowOtpPopup(false);
                    setOtp('');
                    setOtpError('');
                  }}
                  className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all duration-300 border border-white/20"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        .animate-shimmer {
          animation: shimmer 2s ease-in-out infinite;
        }
        .animate-pulse-border {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default Profile;

