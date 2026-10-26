
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useParams, useNavigate } from 'react-router-dom';
// import AdminNavbar from '../Admin_navbar';
// import AdminSidebar from "../Admin_sidebar";

// const BASE_URL_AND_PORT = 'https://api.static.ev.transev.site';
// const API_KEY = 'mlzuMoRFjdGhcFulLMaVtfwNAHycbBAf';

// const ProductEditPage = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [updatedProductData, setUpdatedProductData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [sidebarOpen, setSidebarOpen] = useState(true);

//   const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

//   /* ================= FETCH PRODUCT ================= */
//   useEffect(() => {
//     const fetchProduct = async () => {
//       const authToken = localStorage.getItem('auth_token');
//       try {
//         const res = await axios.get(
//           `${BASE_URL_AND_PORT}/products/get_by_id/${id}`,
//           {
//             headers: {
//               Authorization: `Bearer ${authToken}`,
//               'API-KEY': API_KEY,
//             },
//           }
//         );

//         setUpdatedProductData({
//           ...res.data,
//           mrp: res.data.mrp ?? 0, // ✅ ensure mrp even if 0
//           details: {
//             ...res.data.details,
//             ocpp_present: res.data.details?.ocpp_present || 'No',
//           },
//         });

//         setLoading(false);
//       } catch (err) {
//         console.error(err);
//         setLoading(false);
//       }
//     };

//     fetchProduct();
//   }, [id]);

//   /* ================= HANDLERS ================= */
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setUpdatedProductData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleDetailsChange = (e) => {
//     const { name, value } = e.target;
//     setUpdatedProductData((prev) => ({
//       ...prev,
//       details: {
//         ...prev.details,
//         [name]: value,
//       },
//     }));
//   };

//   /* ================= UPDATE PRODUCT ================= */
//   const handleProductUpdate = async (e) => {
//     e.preventDefault();
//     const authToken = localStorage.getItem('auth_token');

//     const payload = {
//       ...updatedProductData,
//       details: {
//         ...updatedProductData.details,
//         ocpp_present: updatedProductData.details.ocpp_present || 'No',
//       },
//     };

//     const formData = new FormData();
//     formData.append('product_data', JSON.stringify(payload));

//     try {
//       await axios.put(
//         `${BASE_URL_AND_PORT}/products/update`,
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${authToken}`,
//             'API-KEY': API_KEY,
//           },
//         }
//       );

//       navigate('/manage/products');
//     } catch (err) {
//       console.error('Update failed', err);
//     }
//   };

//   if (loading || !updatedProductData) return <div>Loading...</div>;

//   /* ================= JSX ================= */
//   return (
//     <div className="min-h-screen bg-gray-100">
//       <AdminNavbar onToggleSidebar={toggleSidebar} />
//       <div className="flex">
//         <AdminSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

//         <div className="container mx-auto p-6 bg-white mt-6 rounded shadow">
//           <button
//             onClick={() => navigate(-1)}
//             className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
//           >
//             Back
//           </button>

//           <form onSubmit={handleProductUpdate}>
//             {/* ================= BASIC INFO ================= */}
//             {['name', 'model', 'mrp', 'price', 'quantity', 'product_color'].map((field) => (
//               <div className="mb-4" key={field}>
//                 <label className="block font-medium">
//                   {field.replace('_', ' ').toUpperCase()}
//                 </label>
//                 <input
//                   type={
//                     field === 'price' || field === 'mrp' || field === 'quantity'
//                       ? 'number'
//                       : 'text'
//                   }
//                   name={field}
//                   value={
//                     updatedProductData[field] !== undefined &&
//                     updatedProductData[field] !== null
//                       ? updatedProductData[field]
//                       : ''
//                   }
//                   onChange={handleInputChange}
//                   className="border p-2 w-full"
//                 />
//               </div>
//             ))}

//             {/* ================= DETAILS ================= */}
//             <h3 className="text-xl font-semibold mt-6 mb-2">Product Details</h3>

//             {Object.entries({
//               input_voltage: 'Input Voltage',
//               phase: 'Phase',
//               current: 'Current',
//               frequency: 'Frequency',
//               protection: 'Protection',
//               dimensions: 'Dimensions',
//               display: 'Display',
//               gun_type: 'Gun Type',
//               gun_details: 'Gun Details',
//               material: 'Material',
//               rated_power: 'Rated Power',
//               fast_charger: 'Fast Charger',
//               communication: 'Communication',
//               cooling: 'Cooling',
//               ingress_protection: 'Ingress Protection',
//               push_button: 'Push Button',
//               cable_length: 'Cable Length',
//               mountingtype: 'Mounting Type',
//               ouput_voltage: 'Output Voltage',
//               operatingtemps: 'Operating Temperature',
//               safetyregulation: 'Safety Regulation',
//               chargingoperation: 'Charging Operation',
//               additional_details: 'Additional Details',
//               ocpp_present: 'OCPP Present',
//             }).map(([key, label]) => (
//               <div className="mb-4" key={key}>
//                 <label className="block font-medium">{label}</label>

//                 {key === 'ocpp_present' ? (
//                   <select
//                     name={key}
//                     value={updatedProductData.details[key]}
//                     onChange={handleDetailsChange}
//                     className="border p-2 w-full"
//                   >
//                     <option value="Yes">Yes</option>
//                     <option value="No">No</option>
//                   </select>
//                 ) : (
//                   <input
//                     type="text"
//                     name={key}
//                     value={updatedProductData.details[key] || ''}
//                     onChange={handleDetailsChange}
//                     className="border p-2 w-full"
//                   />
//                 )}
//               </div>
//             ))}

//             <button
//               type="submit"
//               className="bg-green-600 text-white px-6 py-2 rounded mt-4"
//             >
//               Update Product
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductEditPage;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import AdminNavbar from '../Admin_navbar';
import AdminSidebar from "../Admin_sidebar";
import { 
  FiSave, 
  FiArrowLeft, 
  FiX, 
  FiCheck,
  FiAlertCircle,
  FiInfo,
  FiImage
} from "react-icons/fi";
import { 
  MdElectricBolt, 
  MdSpeed, 
  MdVerified, 
  MdSecurity,
  MdOutlineInventory,
  MdOutlineColorLens,
  MdOutlineModelTraining,
  MdFlashOn
} from "react-icons/md";
import { TbCurrencyRupee } from "react-icons/tb";
import { FaPlug, FaChargingStation, FaBolt, FaBox } from "react-icons/fa";

const BASE_URL_AND_PORT = 'https://api.static.ev.transev.site';
const API_KEY = 'mlzuMoRFjdGhcFulLMaVtfwNAHycbBAf';

const ProductEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [updatedProductData, setUpdatedProductData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("basic");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  /* ================= FETCH PRODUCT ================= */
  useEffect(() => {
    const fetchProduct = async () => {
      const authToken = localStorage.getItem('auth_token');
      try {
        const res = await axios.get(
          `${BASE_URL_AND_PORT}/products/get_by_id/${id}`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
              'API-KEY': API_KEY,
            },
          }
        );

        setUpdatedProductData({
          ...res.data,
          mrp: res.data.mrp ?? 0,
          price: res.data.price ?? 0,
          quantity: res.data.quantity ?? 0,
          details: {
            ...res.data.details,
            ocpp_present: res.data.details?.ocpp_present || 'No',
          },
        });

        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch product details");
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  /* ================= HANDLERS ================= */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProductData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDetailsChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProductData((prev) => ({
      ...prev,
      details: {
        ...prev.details,
        [name]: value,
      },
    }));
  };

  /* ================= UPDATE PRODUCT ================= */
  const handleProductUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setError(null);
    
    const authToken = localStorage.getItem('auth_token');

    const payload = {
      ...updatedProductData,
      details: {
        ...updatedProductData.details,
        ocpp_present: updatedProductData.details.ocpp_present || 'No',
      },
    };

    const formData = new FormData();
    formData.append('product_data', JSON.stringify(payload));

    try {
      await axios.put(
        `${BASE_URL_AND_PORT}/products/update`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            'API-KEY': API_KEY,
          },
        }
      );
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/manage/products');
      }, 1500);
    } catch (err) {
      console.error('Update failed', err);
      setError("Failed to update product. Please try again.");
      setUpdating(false);
    }
  };

  // Form sections configuration
  const sections = {
    basic: {
      title: "Basic Information",
      icon: <FaChargingStation className="text-green-500" />,
      fields: [
        { name: "name", label: "Product Name", type: "text", placeholder: "e.g., EV Smart Charger Pro", icon: <FaPlug /> },
        { name: "model", label: "Model Number", type: "text", placeholder: "e.g., EV-SCP-001", icon: <MdOutlineModelTraining /> },
        { name: "price", label: "Selling Price", type: "number", placeholder: "e.g., 49999", icon: <TbCurrencyRupee /> },
        { name: "mrp", label: "MRP", type: "number", placeholder: "e.g., 59999", icon: <MdOutlineInventory /> },
        { name: "quantity", label: "Stock Quantity", type: "number", placeholder: "e.g., 100", icon: <FaBox /> },
        { name: "product_color", label: "Product Color", type: "text", placeholder: "e.g., White, Black", icon: <MdOutlineColorLens /> },
      ]
    },
    electrical: {
      title: "Electrical Specifications",
      icon: <MdElectricBolt className="text-blue-500" />,
      fields: [
        { name: "rated_power", label: "Rated Power", type: "text", placeholder: "e.g., 7kW, 22kW, 60kW", icon: <MdSpeed /> },
        { name: "input_voltage", label: "Input Voltage", type: "text", placeholder: "e.g., 230V / 415V" },
        { name: "ouput_voltage", label: "Output Voltage", type: "text", placeholder: "e.g., 230V" },
        { name: "current", label: "Current Rating", type: "text", placeholder: "e.g., 16A / 32A" },
        { name: "phase", label: "Phase", type: "text", placeholder: "e.g., Single / Three" },
        { name: "frequency", label: "Frequency", type: "text", placeholder: "e.g., 50Hz" },
      ]
    },
    physical: {
      title: "Physical Specifications",
      icon: <MdVerified className="text-emerald-500" />,
      fields: [
        { name: "dimensions", label: "Dimensions", type: "text", placeholder: "e.g., 310 x 220 x 90mm" },
        { name: "material", label: "Material", type: "text", placeholder: "e.g., Aluminum + PC" },
        { name: "mountingtype", label: "Mounting Type", type: "text", placeholder: "e.g., Wall mounted / Floor standing" },
        { name: "ingress_protection", label: "IP Rating", type: "text", placeholder: "e.g., IP54, IP65" },
        { name: "cable_length", label: "Cable Length", type: "text", placeholder: "e.g., 5m" },
      ]
    },
    charging: {
      title: "Charging Specifications",
      icon: <FaBolt className="text-yellow-500" />,
      fields: [
        { name: "gun_type", label: "Gun Type", type: "text", placeholder: "e.g., Type 2, CCS2" },
        { name: "gun_details", label: "Gun Details", type: "text", placeholder: "e.g., Single gun with 5m cable" },
        { name: "fast_charger", label: "Fast Charger", type: "text", placeholder: "e.g., yes / no" },
        { name: "chargingoperation", label: "Charging Operation", type: "text", placeholder: "e.g., Plug & Charge" },
        { name: "display", label: "Display", type: "text", placeholder: "e.g., Yes / No" },
        { name: "push_button", label: "Push Button", type: "text", placeholder: "e.g., Yes / No" },
      ]
    },
    technical: {
      title: "Technical Features",
      icon: <MdSecurity className="text-purple-500" />,
      fields: [
        { name: "protection", label: "Protection Features", type: "text", placeholder: "e.g., Overload, Short Circuit" },
        { name: "communication", label: "Communication", type: "text", placeholder: "e.g., Modbus, CAN, OCPP" },
        { name: "cooling", label: "Cooling Type", type: "text", placeholder: "e.g., Air cooled / Liquid cooled" },
        { name: "operatingtemps", label: "Operating Temperature", type: "text", placeholder: "e.g., -20°C to 50°C" },
        { name: "safetyregulation", label: "Safety Regulation", type: "text", placeholder: "e.g., IEC 61851" },
        { name: "ocpp_present", label: "OCPP Support", type: "select", options: ["Yes", "No"] },
      ]
    },
    additional: {
      title: "Additional Information",
      icon: <FiInfo className="text-gray-500" />,
      fields: [
        { name: "additional_details", label: "Additional Details", type: "textarea", placeholder: "Enter any additional product information..." },
      ]
    }
  };

  const tabs = [
    { id: "basic", label: "Basic Info", icon: <FaChargingStation size={16} /> },
    { id: "electrical", label: "Electrical", icon: <MdElectricBolt size={16} /> },
    { id: "physical", label: "Physical", icon: <MdVerified size={16} /> },
    { id: "charging", label: "Charging", icon: <FaBolt size={16} /> },
    { id: "technical", label: "Technical", icon: <MdSecurity size={16} /> },
    { id: "additional", label: "Additional", icon: <FiInfo size={16} /> },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
        <AdminNavbar onToggleSidebar={toggleSidebar} />
        <div className="flex">
          <AdminSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
          <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'lg:ml-72' : 'lg:ml-24'}`}>
            <div className="flex justify-center items-center h-screen">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-green-500"></div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!updatedProductData) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
      <AdminNavbar onToggleSidebar={toggleSidebar} />

      <div className="flex">
        <AdminSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

        {/* Main Content */}
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'lg:ml-72' : 'lg:ml-24'}`}>
          <div className="p-4 md:p-6 lg:p-8">
            
            {/* Header */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Edit Product
                  </h1>
                  <p className="text-gray-500 mt-1">Update your EV charger product information</p>
                </div>
                
                <button
                  onClick={() => navigate(-1)}
                  className="bg-gray-100 text-gray-700 px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 hover:bg-gray-200 transition-all duration-300"
                >
                  <FiArrowLeft size={18} />
                  Back
                </button>
              </div>
            </div>

            {/* Success/Error Messages */}
            {success && (
              <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3 animate-slideDown">
                <FiCheck className="text-green-500 text-xl" />
                <div>
                  <h3 className="font-semibold text-green-800">Product Updated Successfully!</h3>
                  <p className="text-green-600 text-sm">Redirecting to products page...</p>
                </div>
              </div>
            )}

            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 animate-slideDown">
                <FiAlertCircle className="text-red-500 text-xl" />
                <div>
                  <h3 className="font-semibold text-red-800">Error</h3>
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              </div>
            )}

            {/* Main Form Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              {/* Tabs Navigation */}
              <div className="border-b border-gray-200 bg-gray-50/50 overflow-x-auto">
                <div className="flex px-4 gap-1 min-w-max">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-5 py-3 font-medium transition-all duration-200 border-b-2 ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600 bg-white -mb-px'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {tab.icon}
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleProductUpdate} className="p-6">
                {/* Dynamic Form Sections */}
                {Object.entries(sections).map(([key, section]) => (
                  <div key={key} className={activeTab === key ? 'block' : 'hidden'}>
                    <div className="flex items-center gap-3 mb-6 pb-3 border-b border-gray-200">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                        {section.icon}
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-800">{section.title}</h2>
                        <p className="text-sm text-gray-500">Edit the {section.title.toLowerCase()}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {section.fields.map((field) => {
                        // Get the correct field value
                        let fieldValue;
                        if (field.name === "rated_power" || field.name === "input_voltage" || 
                            field.name === "ouput_voltage" || field.name === "current" ||
                            field.name === "phase" || field.name === "frequency" ||
                            field.name === "protection" || field.name === "dimensions" ||
                            field.name === "display" || field.name === "gun_type" ||
                            field.name === "gun_details" || field.name === "material" ||
                            field.name === "fast_charger" || field.name === "communication" ||
                            field.name === "cooling" || field.name === "ingress_protection" ||
                            field.name === "push_button" || field.name === "cable_length" ||
                            field.name === "mountingtype" || field.name === "operatingtemps" ||
                            field.name === "safetyregulation" || field.name === "chargingoperation" ||
                            field.name === "additional_details" || field.name === "ocpp_present") {
                          fieldValue = updatedProductData.details?.[field.name] || '';
                        } else {
                          fieldValue = updatedProductData[field.name];
                        }
                        
                        const fieldName = field.name;
                        
                        return (
                          <div key={field.name} className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                              {field.icon && <span className="text-gray-400">{field.icon}</span>}
                              {field.label}
                            </label>
                            
                            {field.type === "select" ? (
                              <select
                                name={fieldName}
                                value={fieldValue || ''}
                                onChange={handleDetailsChange}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/50"
                              >
                                <option value="">Select {field.label}</option>
                                {field.options.map(opt => (
                                  <option key={opt} value={opt}>{opt}</option>
                                ))}
                              </select>
                            ) : field.type === "textarea" ? (
                              <textarea
                                name={fieldName}
                                value={fieldValue || ''}
                                onChange={handleDetailsChange}
                                placeholder={field.placeholder}
                                rows="4"
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/50 resize-none"
                              />
                            ) : (
                              <input
                                type={field.type}
                                name={fieldName}
                                value={fieldValue !== undefined && fieldValue !== null ? fieldValue : ''}
                                onChange={field.name === "rated_power" || field.name === "input_voltage" || 
                                         field.name === "ouput_voltage" || field.name === "current" ||
                                         field.name === "phase" || field.name === "frequency" ||
                                         field.name === "protection" || field.name === "dimensions" ||
                                         field.name === "display" || field.name === "gun_type" ||
                                         field.name === "gun_details" || field.name === "material" ||
                                         field.name === "fast_charger" || field.name === "communication" ||
                                         field.name === "cooling" || field.name === "ingress_protection" ||
                                         field.name === "push_button" || field.name === "cable_length" ||
                                         field.name === "mountingtype" || field.name === "operatingtemps" ||
                                         field.name === "safetyregulation" || field.name === "chargingoperation" ||
                                         field.name === "additional_details" || field.name === "ocpp_present" 
                                         ? handleDetailsChange : handleInputChange}
                                placeholder={field.placeholder}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/50"
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {/* Preview Section */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center">
                      <FiImage className="text-purple-600 text-xl" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">Product Preview</h2>
                      <p className="text-sm text-gray-500">Current product images</p>
                    </div>
                  </div>

                  {updatedProductData.image_paths && updatedProductData.image_paths.length > 0 ? (
                    <div className="flex flex-wrap gap-3">
                      {updatedProductData.image_paths.map((img, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={img}
                            alt={`Product ${index + 1}`}
                            className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No images available</p>
                  )}
                </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="px-6 py-2.5 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updating}
                    className="px-8 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold flex items-center gap-2 hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {updating ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        Updating...
                      </>
                    ) : (
                      <>
                        <FiSave size={18} />
                        Update Product
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ProductEditPage;