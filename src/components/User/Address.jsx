// import React, { useState } from "react";
// import UserSidebar from '../User/User_sidebar';
// import UserNavbar from '../User/User_Navbar';
// import background from "../../assets/new3.jpg";
// import { useNavigate } from "react-router-dom";
// const BASE_URL_AND_PORT = "https://api.static.ev.transev.site"; // Define the base URL and port
// const API_KEY = "mlzuMoRFjdGhcFulLMaVtfwNAHycbBAf"; // Your API key
// const token = localStorage.getItem("auth_token"); // Retrieve the token

// const AddAddressForm = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     type: "",
//     custom_type_name: "",
//     house_building: "",
//     locality_street: "",
//     landmark: "",
//     city: "",
//     po_ps: "",
//     district: "",
//     state: "",
//     pin: "",
//     country: "",
//     is_default: false,
//   });

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const response = await fetch(`${BASE_URL_AND_PORT}/users/address`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "API-KEY": API_KEY,
//         Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
//       },
//       body: JSON.stringify(formData),
//     });

//     if (response.ok) {
//       // Successfully added the address
//       alert("Address added successfully!");
//       navigate("/profile");
//     } else {
//       // There was an error
//       alert("Error occurred.");
//     }
//   };
//  const [sidebarOpen, setSidebarOpen] = useState(true);
     
//       const toggleSidebar = () => {
//           setSidebarOpen(!sidebarOpen);
//       };
//   return (
//     <div
//            className=" min-h-screen bg-gradient-to-r from-teal-400 via-teal-500 to-teal-700 bg-cover bg-center bg-fixed"
//            style={{ background: `url(${background})` }}
//          >
//       {/* User Navbar */}
//       <UserNavbar onToggleSidebar={toggleSidebar} />

//       {/* Main Container */}
//       <div className="flex flex-1">
//         {/* Sidebar */}
//         <UserSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
//         {/* <div className="w-[40%] mx-auto mt-10 bg-white p-6 rounded-lg shadow-lg"> */}
//         <div className="w-[40%] mx-auto mt-10 bg-white p-6 rounded-lg shadow-lg relative">
//         <button
//   type="button"
//   onClick={() => navigate("/profile")}
//   className="absolute top-2 right-2 text-gray-600 hover:text-black text-2xl font-bold"
//   title="Close"
// >
//   &times;
// </button>
//       <h2 className="text-2xl font-semibold text-center mb-6">Add Address</h2>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label htmlFor="type" className="block text-sm font-medium text-gray-700">
//             Address Type
//           </label>
//           <select
//             id="type"
//             name="type"
//             value={formData.type}
//             onChange={handleChange}
//             required
//             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//           >
//             <option value="">Select</option>
//             <option value="Home">Home</option>
//             <option value="Work">Work</option>
//             <option value="Other">Other</option>
//           </select>
//         </div>
//         {formData.type === "Other" && (
//           <div>
//             <label htmlFor="custom_type_name" className="block text-sm font-medium text-gray-700">
//               Custom Type Name
//             </label>
//             <input
//               type="text"
//               id="custom_type_name"
//               name="custom_type_name"
//               value={formData.custom_type_name}
//               onChange={handleChange}
//               className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//             />
//           </div>
//         )}
//         <div>
//           <label htmlFor="house_building" className="block text-sm font-medium text-gray-700">
//             House/Building Number
//           </label>
//           <input
//             type="text"
//             id="house_building"
//             name="house_building"
//             value={formData.house_building}
//             onChange={handleChange}
//             required
//             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//           />
//         </div>
//         <div>
//           <label htmlFor="locality_street" className="block text-sm font-medium text-gray-700">
//             Locality/Street
//           </label>
//           <input
//             type="text"
//             id="locality_street"
//             name="locality_street"
//             value={formData.locality_street}
//             onChange={handleChange}
//             required
//             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//           />
//         </div>
//         <div>
//           <label htmlFor="landmark" className="block text-sm font-medium text-gray-700">
//             Landmark
//           </label>
//           <input
//             type="text"
//             id="landmark"
//             name="landmark"
//             value={formData.landmark}
//             onChange={handleChange}
//             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//           />
//         </div>
//         <div>
//           <label htmlFor="city" className="block text-sm font-medium text-gray-700">
//             City
//           </label>
//           <input
//             type="text"
//             id="city"
//             name="city"
//             value={formData.city}
//             onChange={handleChange}
//             required
//             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//           />
//         </div>
//         <div>
//           <label htmlFor="po_ps" className="block text-sm font-medium text-gray-700">
//             Post Office/Police Station
//           </label>
//           <input
//             type="text"
//             id="po_ps"
//             name="po_ps"
//             value={formData.po_ps}
//             onChange={handleChange}
//             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//           />
//         </div>
//         <div>
//           <label htmlFor="district" className="block text-sm font-medium text-gray-700">
//             District
//           </label>
//           <input
//             type="text"
//             id="district"
//             name="district"
//             value={formData.district}
//             onChange={handleChange}
//             required
//             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//           />
//         </div>
//         <div>
//           <label htmlFor="state" className="block text-sm font-medium text-gray-700">
//             State
//           </label>
//           <input
//             type="text"
//             id="state"
//             name="state"
//             value={formData.state}
//             onChange={handleChange}
//             required
//             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//           />
//         </div>
//         <div>
//           <label htmlFor="pin" className="block text-sm font-medium text-gray-700">
//             PIN Code
//           </label>
//           <input
//             type="text"
//             id="pin"
//             name="pin"
//             value={formData.pin}
//             onChange={handleChange}
//             required
//             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//           />
//         </div>
//         <div>
//           <label htmlFor="country" className="block text-sm font-medium text-gray-700">
//             Country
//           </label>
//           <input
//             type="text"
//             id="country"
//             name="country"
//             value={formData.country}
//             onChange={handleChange}
//             required
//             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//           />
//         </div>
//         <div>
//           <label htmlFor="is_default" className="block text-sm font-medium text-gray-700">
//             Set as Default
//           </label>
//           <input
//             type="checkbox"
//             id="is_default"
//             name="is_default"
//             checked={formData.is_default}
//             onChange={handleChange}
//             className="mt-1"
//           />
//         </div>
//         <div className="mt-4">
//           <button
//             type="submit"
//             className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md shadow-md hover:bg-indigo-700"
//           >
//             Add Address
//           </button>
//         </div>
//       </form>
//     </div>
//     </div>
//     </div>
//   );
// };

// export default AddAddressForm;
import React, { useState } from "react";
import UserSidebar from '../User/User_sidebar';
import UserNavbar from '../User/User_Navbar';
import background from "../../assets/new3.jpg";
import { useNavigate } from "react-router-dom";
import { 
  HomeIcon, 
  OfficeBuildingIcon, 
  MapIcon, 
  LocationMarkerIcon,
  MailIcon,
  PhoneIcon,
  CheckCircleIcon,
  XCircleIcon
} from "@heroicons/react/outline";
import { 
  FaMapMarkerAlt, 
  FaBuilding, 
  FaStreetView, 
  FaCity, 
  FaFlag, 
  FaHome, 
  FaBriefcase,
  FaPlusCircle,
  FaSave,
  FaTimes
} from "react-icons/fa";

const BASE_URL_AND_PORT = "https://api.static.ev.transev.site";
const API_KEY = "mlzuMoRFjdGhcFulLMaVtfwNAHycbBAf";

const AddAddressForm = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    type: "",
    custom_type_name: "",
    house_building: "",
    locality_street: "",
    landmark: "",
    city: "",
    po_ps: "",
    district: "",
    state: "",
    pin: "",
    country: "",
    is_default: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${BASE_URL_AND_PORT}/users/address`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "API-KEY": API_KEY,
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("✅ Address added successfully!");
        navigate("/profile");
      } else {
        const error = await response.json();
        alert("❌ Error: " + (error.message || "Failed to add address"));
      }
    } catch (error) {
      console.error("Error adding address:", error);
      alert("❌ An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const inputClasses = "mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white";
  const labelClasses = "block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <UserNavbar onToggleSidebar={toggleSidebar} />

      <div className="flex">
        <UserSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'} w-full`}>
          <div className="p-4 md:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
              {/* Header */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-100 rounded-xl">
                    <FaMapMarkerAlt className="h-6 w-6 text-blue-600" />
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Add New Address</h1>
                </div>
                <p className="text-gray-500 ml-2">Enter your address details below</p>
              </div>

              {/* Form Card */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <FaPlusCircle className="h-5 w-5 text-white" />
                      <h2 className="text-xl font-bold text-white">Address Information</h2>
                    </div>
                    <button
                      onClick={() => navigate("/profile")}
                      className="text-white/80 hover:text-white transition-all duration-300 hover:scale-110"
                      title="Close"
                    >
                      <FaTimes className="h-5 w-5" />
                    </button>
                  </div>
                  <p className="text-blue-100 text-sm mt-1">Please fill in all required fields</p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                  {/* Address Type Selection */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, type: "Home"})}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 flex items-center justify-center gap-3 ${
                        formData.type === "Home" 
                          ? "border-blue-500 bg-blue-50 shadow-md" 
                          : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                      }`}
                    >
                      <FaHome className={`h-5 w-5 ${formData.type === "Home" ? "text-blue-600" : "text-gray-400"}`} />
                      <span className={`font-medium ${formData.type === "Home" ? "text-blue-600" : "text-gray-600"}`}>Home</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, type: "Work"})}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 flex items-center justify-center gap-3 ${
                        formData.type === "Work" 
                          ? "border-purple-500 bg-purple-50 shadow-md" 
                          : "border-gray-200 hover:border-purple-300 hover:bg-gray-50"
                      }`}
                    >
                      <FaBriefcase className={`h-5 w-5 ${formData.type === "Work" ? "text-purple-600" : "text-gray-400"}`} />
                      <span className={`font-medium ${formData.type === "Work" ? "text-purple-600" : "text-gray-600"}`}>Work</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, type: "Other"})}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 flex items-center justify-center gap-3 ${
                        formData.type === "Other" 
                          ? "border-orange-500 bg-orange-50 shadow-md" 
                          : "border-gray-200 hover:border-orange-300 hover:bg-gray-50"
                      }`}
                    >
                      <FaMapMarkerAlt className={`h-5 w-5 ${formData.type === "Other" ? "text-orange-600" : "text-gray-400"}`} />
                      <span className={`font-medium ${formData.type === "Other" ? "text-orange-600" : "text-gray-600"}`}>Other</span>
                    </button>
                  </div>

                  {formData.type === "Other" && (
                    <div className="animate-fadeIn">
                      <label className={labelClasses}>
                        <FaMapMarkerAlt className="h-4 w-4 text-orange-500" />
                        Custom Type Name
                      </label>
                      <input
                        type="text"
                        name="custom_type_name"
                        value={formData.custom_type_name}
                        onChange={handleChange}
                        placeholder="e.g., Vacation Home, Warehouse, etc."
                        className={inputClasses}
                        required
                      />
                    </div>
                  )}

                  {/* Address Fields Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className={labelClasses}>
                        <FaBuilding className="h-4 w-4 text-blue-500" />
                        House/Building Number *
                      </label>
                      <input
                        type="text"
                        name="house_building"
                        value={formData.house_building}
                        onChange={handleChange}
                        placeholder="e.g., 123, Sunrise Apartments"
                        className={inputClasses}
                        required
                      />
                    </div>

                    <div>
                      <label className={labelClasses}>
                        <FaStreetView className="h-4 w-4 text-blue-500" />
                        Locality/Street *
                      </label>
                      <input
                        type="text"
                        name="locality_street"
                        value={formData.locality_street}
                        onChange={handleChange}
                        placeholder="e.g., Main Street, MG Road"
                        className={inputClasses}
                        required
                      />
                    </div>

                    <div>
                      <label className={labelClasses}>
                        <LocationMarkerIcon className="h-4 w-4 text-blue-500" />
                        Landmark
                      </label>
                      <input
                        type="text"
                        name="landmark"
                        value={formData.landmark}
                        onChange={handleChange}
                        placeholder="e.g., Near City Mall, Opposite Park"
                        className={inputClasses}
                      />
                    </div>

                    <div>
                      <label className={labelClasses}>
                        <FaCity className="h-4 w-4 text-blue-500" />
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="e.g., Mumbai, Delhi, Bangalore"
                        className={inputClasses}
                        required
                      />
                    </div>

                    <div>
                      <label className={labelClasses}>
                        <MailIcon className="h-4 w-4 text-blue-500" />
                        Post Office/Police Station
                      </label>
                      <input
                        type="text"
                        name="po_ps"
                        value={formData.po_ps}
                        onChange={handleChange}
                        placeholder="e.g., Andheri East PS, Bandra PO"
                        className={inputClasses}
                      />
                    </div>

                    <div>
                      <label className={labelClasses}>
                        <MapIcon className="h-4 w-4 text-blue-500" />
                        District *
                      </label>
                      <input
                        type="text"
                        name="district"
                        value={formData.district}
                        onChange={handleChange}
                        placeholder="e.g., Mumbai Suburban, Central Delhi"
                        className={inputClasses}
                        required
                      />
                    </div>

                    <div>
                      <label className={labelClasses}>
                        <FaFlag className="h-4 w-4 text-blue-500" />
                        State *
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        placeholder="e.g., Maharashtra, Delhi, Karnataka"
                        className={inputClasses}
                        required
                      />
                    </div>

                    <div>
                      <label className={labelClasses}>
                        <PhoneIcon className="h-4 w-4 text-blue-500" />
                        PIN Code *
                      </label>
                      <input
                        type="text"
                        name="pin"
                        value={formData.pin}
                        onChange={handleChange}
                        placeholder="e.g., 400001, 110001"
                        className={inputClasses}
                        required
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className={labelClasses}>
                        <FaFlag className="h-4 w-4 text-blue-500" />
                        Country *
                      </label>
                      <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        placeholder="e.g., India"
                        className={inputClasses}
                        required
                      />
                    </div>
                  </div>

                  {/* Default Address Toggle */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div>
                      <label className="font-semibold text-gray-800 flex items-center gap-2">
                        <CheckCircleIcon className="h-5 w-5 text-green-500" />
                        Set as Default Address
                      </label>
                      <p className="text-sm text-gray-500 mt-1">Make this your primary shipping address</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="is_default"
                        checked={formData.is_default}
                        onChange={handleChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => navigate("/profile")}
                      className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <FaTimes className="h-4 w-4" />
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                          Adding Address...
                        </>
                      ) : (
                        <>
                          <FaSave className="h-4 w-4" />
                          Save Address
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* Help Section */}
              <div className="mt-6 bg-blue-50 rounded-xl p-4 border border-blue-200">
                <div className="flex items-start gap-3">
                  <div className="p-1">
                    <CheckCircleIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-800">Need help?</h4>
                    <p className="text-sm text-blue-600">
                      Make sure to enter accurate address details for smooth delivery. 
                      Fields marked with * are required.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AddAddressForm;