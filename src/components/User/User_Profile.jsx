import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UserIcon, 
  MailIcon, 
  PhoneIcon, 
  PencilIcon, 
  CheckCircleIcon,
  XCircleIcon,
  PlusCircleIcon,
  TrashIcon,
  HomeIcon,
  CameraIcon,
  ShieldCheckIcon
} from '@heroicons/react/outline';
import { 
  FaMapMarkerAlt, 
  FaUserCircle, 
  FaEnvelope, 
  FaPhoneAlt, 
  FaEdit, 
  FaSave, 
  FaTimes, 
  FaTrash, 
  FaPlus, 
  FaCheck, 
  FaSpinner,
  FaBuilding,
  FaCity,
  FaFlag,
  FaHome,
  FaBriefcase,
  FaUserEdit,
  FaAddressCard
} from 'react-icons/fa';
import UserSidebar from '../User/User_sidebar';
import UserNavbar from '../User/User_Navbar';
import background from "../../assets/ev_charger.jpg";

const Profile = () => {
  const BASE_URL_AND_PORT = "https://api.static.ev.transev.site";
  const API_KEY = "mlzuMoRFjdGhcFulLMaVtfwNAHycbBAf";
  const [user, setUser] = useState(null);
  const [newImage, setNewImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [userAddresses, setUserAddresses] = useState([]);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [editingAddressData, setEditingAddressData] = useState(null);
  const [editingAddressType, setEditingAddressType] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
   const [isMobile, setIsMobile] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    about: '',
    email: '',
    phone_number: '',
    role: '',
    address: '',
    email_verified: false,
  });
  
  const [isUpdated, setIsUpdated] = useState(false);
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const navigate = useNavigate();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    const fetchUserData = async () => {
      setIsPageLoading(true);
      const token = localStorage.getItem('auth_token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch(`${BASE_URL_AND_PORT}/users/profile`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'API-KEY': API_KEY,
          },
        });

        const data = await response.json();
        if (response.ok) {
          setUser(data.user_data);
          await fetchUserAddresses();
          setFormData(data.user_data);
          setSuccessMessage('');
          setError('');
          await fetchProfilePicture();
        } else {
          setError(data.message || 'Failed to fetch user details');
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
        setError('An error occurred while fetching user details.');
      } finally {
        setTimeout(() => setIsPageLoading(false), 500);
      }
    };
    fetchUserData();
  }, [navigate]);

  const fetchUserAddresses = async () => {
    const token = localStorage.getItem('auth_token');
    try {
      const response = await fetch(`${BASE_URL_AND_PORT}/users/address`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'API-KEY': API_KEY,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (response.ok && data?.length) {
        setUserAddresses(data);
      } else {
        setUserAddresses([]);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  const fetchProfilePicture = async () => {
    const token = localStorage.getItem('auth_token');
    try {
      const response = await fetch(`${BASE_URL_AND_PORT}/users/profile-picture`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'API-Key': API_KEY,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setProfilePicture(data.profile_picture);
      }
    } catch (error) {
      console.error('Error fetching profile picture:', error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImage(reader.result);
        setImageFile(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadProfilePicture = async () => {
    if (!imageFile) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", imageFile);
    const token = localStorage.getItem("auth_token");

    try {
      const response = await fetch(`${BASE_URL_AND_PORT}/users/profile-picture/upload`, {
        method: "POST",
        headers: {
          "API-Key": API_KEY,
          "Authorization": `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        fetchProfilePicture();
        setNewImage(null);
        setImageFile(null);
        setSuccessMessage("Profile picture uploaded successfully!");
        setError("");
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        const data = await response.json();
        setError(data?.detail || "Failed to upload profile picture.");
      }
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      setError("An error occurred while uploading the profile picture.");
    } finally {
      setIsUploading(false);
    }
  };

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
      phone_number: formData.phone_number,
    };

    try {
      const response = await fetch(`${BASE_URL_AND_PORT}/users/update`, {
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
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError(data.message || 'Failed to update user details');
      }
    } catch (error) {
      console.error('Error updating details:', error);
      setError('An error occurred while updating details.');
    }
  };

  const handleVerifyEmail = async () => {
    const token = localStorage.getItem('auth_token');
    const requestData = {
      email: formData.email,
      purpose: 'Mail Verification',
    };

    try {
      const response = await fetch(`${BASE_URL_AND_PORT}/users/otp/generate`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'API-KEY': API_KEY,
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();
      if (response.ok) {
        setShowOtpPopup(true);
        setOtpError('');
      } else {
        setOtpError(data.message || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      setOtpError('An error occurred while sending OTP.');
    }
  };

  const handleVerifyOtp = async () => {
    const token = localStorage.getItem('auth_token');
    const payload = {
      email: formData.email,
      otp_code: otp,
      purpose: "Mail Verification",
    };

    try {
      const response = await fetch(`${BASE_URL_AND_PORT}/users/otp/verify/email`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'API-KEY': API_KEY,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok) {
        setFormData((prevData) => ({
          ...prevData,
          email_verified: true,
        }));
        setShowOtpPopup(false);
        setSuccessMessage('Email verified successfully!');
        setError('');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setOtpError(data.message || 'Invalid OTP');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setOtpError('An error occurred while verifying OTP.');
    }
  };

  const handleSetDefaultAddress = async (addressType, customTypeName = null) => {
    const token = localStorage.getItem('auth_token');
    let url;
    if (addressType === 'Other' && customTypeName) {
      url = `${BASE_URL_AND_PORT}/users/address/Other/set-default?custom_name=${customTypeName}`;
    } else {
      url = `${BASE_URL_AND_PORT}/users/address/${addressType}/set-default`;
    }

    try {
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'API-KEY': API_KEY,
        },
      });
      if (response.ok) {
        setSuccessMessage(`${addressType} address set as default.`);
        fetchUserAddresses();
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        const data = await response.json();
        setError('Failed to set default address: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error setting default address:', error);
      setError('An error occurred while setting default address.');
    }
  };

  const handleDeleteAddress = async (addressType, customTypeName = null) => {
    const token = localStorage.getItem('auth_token');
    let url;
    if (addressType === 'Other' && customTypeName) {
      url = `${BASE_URL_AND_PORT}/users/address/Other?custom_name=${customTypeName}`;
    } else {
      url = `${BASE_URL_AND_PORT}/users/address/${addressType}`;
    }

    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'API-KEY': API_KEY,
        },
      });

      if (response.ok) {
        setSuccessMessage(`${addressType} address deleted successfully.`);
        setUserAddresses(prevAddresses =>
          prevAddresses.filter(addr =>
            addressType === 'Other'
              ? addr.custom_type_name !== customTypeName
              : addr.type !== addressType
          )
        );
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        const data = await response.json();
        setError("Failed to delete address: " + (data.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Error deleting address:", error);
      setError("An error occurred while deleting the address.");
    }
  };

  const handleEditButtonClick = (addressType, address) => {
    setEditingAddressData(address);
    setEditingAddressType(addressType);
    setShowEditPopup(true);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingAddressData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmitEditedAddress = async () => {
    const token = localStorage.getItem("auth_token");
    const updatedData = { ...editingAddressData };

    try {
      let response;
      if (editingAddressType === "Other") {
        response = await fetch(
          `${BASE_URL_AND_PORT}/users/address/Other?custom_name=${updatedData.custom_type_name}`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              'API-KEY': API_KEY,
            },
            body: JSON.stringify(updatedData),
          }
        );
      } else {
        response = await fetch(
          `${BASE_URL_AND_PORT}/users/address/${editingAddressType}`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              'API-KEY': API_KEY,
            },
            body: JSON.stringify(updatedData),
          }
        );
      }

      if (response.ok) {
        setSuccessMessage(`${editingAddressType} address updated successfully.`);
        fetchUserAddresses();
        setShowEditPopup(false);
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        const data = await response.json();
        setError("Failed to update address: " + (data.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Error updating address:", error);
      setError("An error occurred while updating the address.");
    }
  };

  const groupedAddresses = userAddresses.reduce((acc, address) => {
    if (!acc[address.type]) {
      acc[address.type] = [];
    }
    acc[address.type].push(address);
    return acc;
  }, {});

  const getAddressIcon = (type) => {
    switch(type) {
      case 'Home': return <FaHome className="h-5 w-5 text-blue-600" />;
      case 'Office': return <FaBriefcase className="h-5 w-5 text-purple-600" />;
      default: return <FaMapMarkerAlt className="h-5 w-5 text-orange-600" />;
    }
  };

  const getAddressBgColor = (type) => {
    switch(type) {
      case 'Home': return "bg-blue-50 border-blue-200";
      case 'Office': return "bg-purple-50 border-purple-200";
      default: return "bg-orange-50 border-orange-200";
    }
  };

  // Loading Component
  if (isPageLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <UserNavbar onToggleSidebar={toggleSidebar} />
        <div className="flex">
          <UserSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
          <div className="flex-1 flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="relative">
                <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-blue-600 mx-auto"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <FaUserCircle className="h-8 w-8 text-blue-300 animate-pulse" />
                </div>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-700">Loading Profile...</h3>
              <p className="text-sm text-gray-500 mt-1">Please wait while we fetch your information</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
 <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <UserNavbar onToggleSidebar={toggleSidebar} />
      
      <div className="flex flex-1 relative">
        {/* Sidebar */}
        <UserSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

        {/* Main Content - Dynamic margin based on sidebar state */}
        <main 
          className={`
            flex-1 transition-all duration-300 ease-in-out w-full
            ${sidebarOpen ? 'lg:ml-72' : 'lg:ml-24'}
            ${isMobile && sidebarOpen ? 'overflow-hidden' : ''}
          `}
        >
          <div className="p-4 md:p-6 lg:p-8">
            {/* Header with Breadcrumb */}
            <div className="mb-8">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                <span className="text-blue-600">Home</span>
                <span>/</span>
                <span className="text-gray-700 font-medium">My Profile</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-md">
                  <UserIcon className="h-6 w-6 text-white" />
                </div>
                My Profile
              </h1>
              <p className="text-gray-500 mt-2 ml-2">Manage your personal information, addresses and preferences</p>
            </div>

            {/* Main Profile Card */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Profile Card */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden sticky top-24 transition-all duration-300 hover:shadow-xl">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -ml-12 -mb-12"></div>
                    <div className="relative">
                      <div 
                        className="w-32 h-32 rounded-full border-4 border-white bg-white overflow-hidden cursor-pointer mx-auto shadow-lg transition-transform duration-300 hover:scale-105"
                        onClick={() => document.getElementById("image-upload").click()}
                      >
                        {newImage || profilePicture ? (
                          <img
                            src={newImage || profilePicture}
                            alt="Profile"
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center w-full h-full bg-gradient-to-br from-gray-100 to-gray-200">
                            <FaUserCircle className="h-16 w-16 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => document.getElementById("image-upload").click()}
                        className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-2 shadow-lg hover:bg-blue-700 transition-all duration-300 hover:scale-110"
                      >
                        <CameraIcon className="h-4 w-4 text-white" />
                      </button>
                      <input
                        type="file"
                        id="image-upload"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </div>
                    <h2 className="text-white text-xl font-bold mt-4">{formData.name || "User"}</h2>
                    <p className="text-blue-100 text-sm mt-1">{formData.role || "Customer"}</p>
                    <div className="mt-3 inline-flex items-center gap-1 bg-white/20 rounded-full px-3 py-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-xs text-white">Active</span>
                    </div>
                  </div>

                  {imageFile && (
                    <div className="p-4 border-b border-gray-200 bg-gray-50">
                      <button
                        onClick={handleUploadProfilePicture}
                        disabled={isUploading}
                        className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-2 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-md"
                      >
                        {isUploading ? <FaSpinner className="animate-spin" /> : <CameraIcon className="h-4 w-4" />}
                        {isUploading ? "Uploading..." : "Upload New Picture"}
                      </button>
                    </div>
                  )}

                  <div className="p-5 space-y-4">
                    <div className="flex items-center gap-3 text-gray-600 p-2 rounded-lg hover:bg-gray-50 transition">
                      <MailIcon className="h-5 w-5 text-gray-400" />
                      <span className="text-sm break-all flex-1">{formData.email}</span>
                      {formData.email_verified ? (
                        <CheckCircleIcon className="h-5 w-5 text-green-500" />
                      ) : (
                        <button onClick={handleVerifyEmail} className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full hover:bg-yellow-200 transition">
                          Verify
                        </button>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-gray-600 p-2 rounded-lg hover:bg-gray-50 transition">
                      <PhoneIcon className="h-5 w-5 text-gray-400" />
                      <span className="text-sm">{formData.phone_number || "Not provided"}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600 p-2 rounded-lg hover:bg-gray-50 transition">
                      <FaAddressCard className="h-5 w-5 text-gray-400" />
                      <span className="text-sm">Member since: {new Date().getFullYear()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Tabs Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Tab Navigation */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-1 flex gap-1">
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`flex-1 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                      activeTab === 'profile' 
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <FaUserEdit className="h-4 w-4" />
                    Personal Info
                  </button>
                  <button
                    onClick={() => setActiveTab('addresses')}
                    className={`flex-1 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                      activeTab === 'addresses' 
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <FaMapMarkerAlt className="h-4 w-4" />
                    Addresses
                  </button>
                </div>

                {/* Personal Information Tab */}
                {activeTab === 'profile' && (
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden animate-fadeIn">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                      <div className="flex justify-between items-center flex-wrap gap-3">
                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                          <FaUserEdit className="text-blue-600" />
                          Personal Information
                        </h3>
                        {!isEditing ? (
                          <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl text-sm font-medium transition-all duration-300 shadow-md"
                          >
                            <PencilIcon className="h-4 w-4" />
                            Edit Profile
                          </button>
                        ) : (
                          <div className="flex gap-2">
                            <button
                              onClick={handleUpdateDetails}
                              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl text-sm font-medium transition-all duration-300"
                            >
                              <FaSave className="h-3 w-3" />
                              Save Changes
                            </button>
                            <button
                              onClick={() => setIsEditing(false)}
                              className="flex items-center gap-2 px-5 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl text-sm font-medium transition-all duration-300"
                            >
                              <FaTimes className="h-3 w-3" />
                              Cancel
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="p-6 space-y-5">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-300"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-300"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                        <input
                          type="tel"
                          name="phone_number"
                          value={formData.phone_number}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-300"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Addresses Tab */}
                {activeTab === 'addresses' && (
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden animate-fadeIn">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                      <div className="flex justify-between items-center flex-wrap gap-3">
                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                          <FaMapMarkerAlt className="text-blue-600" />
                          Saved Addresses
                        </h3>
                        <button
                          onClick={() => navigate('/address')}
                          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-xl text-sm font-medium transition-all duration-300 shadow-md"
                        >
                          <PlusCircleIcon className="h-4 w-4" />
                          Add New Address
                        </button>
                      </div>
                    </div>
                    <div className="p-6">
                      {Object.keys(groupedAddresses).length > 0 ? (
                        <div className="space-y-4">
                          {Object.keys(groupedAddresses).map((addressType) => (
                            <div key={addressType} className={`${getAddressBgColor(addressType)} rounded-xl p-4 border transition-all duration-300 hover:shadow-md`}>
                              <div className="flex items-center gap-2 mb-3">
                                {getAddressIcon(addressType)}
                                <h4 className="font-bold text-gray-800">{addressType}</h4>
                              </div>
                              <div className="space-y-3">
                                {groupedAddresses[addressType].map((address) => (
                                  <div key={address.id} className={`p-4 rounded-xl transition-all duration-300 ${address.is_default ? 'bg-white shadow-md border-2 border-green-300' : 'bg-white shadow-sm border border-gray-200'}`}>
                                    {address.is_default && (
                                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full mb-2">
                                        <CheckCircleIcon className="h-3 w-3" />
                                        Default Address
                                      </span>
                                    )}
                                    <div className="space-y-1 text-sm text-gray-600">
                                      <p><span className="font-medium">Building:</span> {address.house_building}</p>
                                      <p><span className="font-medium">Street:</span> {address.locality_street}</p>
                                      {address.landmark && <p><span className="font-medium">Landmark:</span> {address.landmark}</p>}
                                      <p><span className="font-medium">City:</span> {address.city}</p>
                                      <p><span className="font-medium">State:</span> {address.state}</p>
                                      <p><span className="font-medium">PIN Code:</span> {address.pin}</p>
                                      <p><span className="font-medium">Country:</span> {address.country}</p>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-3">
                                      {!address.is_default && (
                                        <button
                                          onClick={() => handleSetDefaultAddress(addressType, addressType === 'Other' ? address.custom_type_name : null)}
                                          className="text-xs bg-green-100 text-green-700 px-3 py-1.5 rounded-lg hover:bg-green-200 transition-all duration-300 font-medium"
                                        >
                                          <CheckCircleIcon className="inline mr-1 h-3 w-3" />
                                          Set as Default
                                        </button>
                                      )}
                                      <button
                                        onClick={() => handleEditButtonClick(addressType, address)}
                                        className="text-xs bg-yellow-100 text-yellow-700 px-3 py-1.5 rounded-lg hover:bg-yellow-200 transition-all duration-300 font-medium"
                                      >
                                        <FaEdit className="inline mr-1 h-3 w-3" />
                                        Edit
                                      </button>
                                      <button
                                        onClick={() => handleDeleteAddress(addressType, addressType === 'Other' ? address.custom_type_name : null)}
                                        className="text-xs bg-red-100 text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-200 transition-all duration-300 font-medium"
                                      >
                                        <TrashIcon className="inline mr-1 h-3 w-3" />
                                        Delete
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FaMapMarkerAlt className="h-10 w-10 text-gray-300" />
                          </div>
                          <p className="text-gray-500 font-medium">No addresses saved yet</p>
                          <p className="text-sm text-gray-400 mt-1">Add your first address for faster checkout</p>
                          <button
                            onClick={() => navigate('/address')}
                            className="mt-4 text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1"
                          >
                            <PlusCircleIcon className="h-4 w-4" />
                            Add Address
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Messages */}
            {error && (
              <div className="fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-xl shadow-lg animate-slideIn z-50">
                <div className="flex items-center gap-2">
                  <XCircleIcon className="h-5 w-5" />
                  {error}
                </div>
              </div>
            )}
            {successMessage && (
              <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg animate-slideIn z-50">
                <div className="flex items-center gap-2">
                  <CheckCircleIcon className="h-5 w-5" />
                  {successMessage}
                </div>
              </div>
            )}

            {/* OTP Popup */}
            {showOtpPopup && (
              <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 animate-fadeIn">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 transform transition-all duration-300 scale-100">
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <ShieldCheckIcon className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">Email Verification</h3>
                    <p className="text-sm text-gray-500 mt-1">Enter the OTP sent to your email</p>
                  </div>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter 6-digit OTP"
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-2xl tracking-widest"
                    maxLength="6"
                  />
                  {otpError && <p className="text-red-500 text-sm text-center mt-2">{otpError}</p>}
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={handleVerifyOtp}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-2.5 rounded-xl font-semibold transition-all duration-300"
                    >
                      Verify OTP
                    </button>
                    <button
                      onClick={() => setShowOtpPopup(false)}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2.5 rounded-xl font-semibold transition-all duration-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Edit Address Modal */}
            {showEditPopup && editingAddressData && (
              <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 animate-fadeIn">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100">
                  <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 rounded-t-2xl">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-bold text-white">Edit {editingAddressType} Address</h3>
                      <button onClick={() => setShowEditPopup(false)} className="text-white/80 hover:text-white transition-all duration-300">
                        <FaTimes className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  <div className="p-6 space-y-3">
                    {editingAddressType === "Other" && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Custom Type Name</label>
                        <p className="p-2 bg-gray-100 rounded-lg text-gray-600">{editingAddressData.custom_type_name || "No custom name"}</p>
                      </div>
                    )}
                    {[
                      { field: "house_building", label: "House/Building", placeholder: "House number, building name" },
                      { field: "locality_street", label: "Locality/Street", placeholder: "Street address" },
                      { field: "landmark", label: "Landmark", placeholder: "Nearby landmark" },
                      { field: "city", label: "City", placeholder: "City name" },
                      { field: "po_ps", label: "PO/PS", placeholder: "Post office / Police station" },
                      { field: "district", label: "District", placeholder: "District name" },
                      { field: "state", label: "State", placeholder: "State name" },
                      { field: "pin", label: "PIN Code", placeholder: "Postal code" },
                      { field: "country", label: "Country", placeholder: "Country name" }
                    ].map(({ field, label, placeholder }) => (
                      <div key={field}>
                        <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{label}</label>
                        <input
                          type="text"
                          name={field}
                          value={editingAddressData[field] || ''}
                          onChange={handleEditInputChange}
                          placeholder={placeholder}
                          className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        />
                      </div>
                    ))}
                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={handleSubmitEditedAddress}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-2.5 rounded-xl font-semibold transition-all duration-300"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={() => setShowEditPopup(false)}
                        className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2.5 rounded-xl font-semibold transition-all duration-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Profile;