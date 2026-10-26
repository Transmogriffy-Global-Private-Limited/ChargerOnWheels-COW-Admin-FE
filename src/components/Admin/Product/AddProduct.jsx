
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import AdminNavbar from '../Admin_navbar';
// import AdminSidebar from "../Admin_sidebar";
// import backgroundImage from '../../../assets/workplace.jpg';
// const BASE_URL_AND_PORT = "https://api.static.ev.transev.site";
// const API_KEY = "mlzuMoRFjdGhcFulLMaVtfwNAHycbBAf";

// const AddProductPage = () => {
//   const navigate = useNavigate();

//   const [product, setProduct] = useState({
//     name: "",
//     model: "",
//     mrp: "",  
//     price: "",
//     quantity: "",
//     product_color: "",
//     details: {
//       input_voltage: "230V",
//       phase: "Single",
//       current: "16A",
//       frequency: "50Hz",
//       rated_power: "250W",
//       fast_charger: "yes",
//       protection: "Overload, Short Circuit",
//       communication: "Modbus, CAN",
//       cooling: "Air cooled",
//       ingress_protection: "IP65",
//       dimensions: "W X D X H (310x220x90mm)",
//       gun_details: "Two guns",
//       gun_type: "CCS2",
//       material: "Aluminum",
//       ouput_voltage: "7.7 KW",
//       display: "Yes",
//       push_button: "Yes",
//       operatingtemps: "-10°C to 50°C",
//       chargingoperation: "Standard charging operation",
//       safetyregulation: "IEC 61000-2-2",
//       mountingtype: "Wall mounted",
//       cable_length: "10m",
//       additional_details: "This is a high-efficiency product for industrial use.",
//       ocpp_present: "Yes", // UPDATED FIELD
//     },
//   });

//   const [files, setFiles] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     if (name.includes(".")) {
//       const [section, field] = name.split(".");
//       setProduct((prevProduct) => ({
//         ...prevProduct,
//         details: {
//           ...prevProduct.details,
//           [field]: value,
//         },
//       }));
//     } else {
//       setProduct({ ...product, [name]: value });
//     }
//   };

//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

//   const handleFileChange = (e) => {
//     setFiles(e.target.files);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     const formData = new FormData();
//     formData.append("product_data", JSON.stringify(product));
//     if (files) {
//       for (let i = 0; i < files.length; i++) {
//         formData.append("files", files[i]);
//       }
//     }

//     try {
//       const authToken = localStorage.getItem("auth_token");
//       const response = await fetch(`${BASE_URL_AND_PORT}/products/add`, {
//         method: "POST",
//         headers: {
//           "Authorization": `Bearer ${authToken}`,
//           "API-KEY": API_KEY,
//         },
//         body: formData,
//       });

//       const result = await response.json();
//       if (response.ok) {
//         setSuccess(true);
//         setError(null);
//         setProduct({
//           name: "",
//           model: "",
//           mrp: "",  
//           price: "",
//           quantity: "",
//           product_color: "",
//           details: {
//             input_voltage: "230V",
//             phase: "Single",
//             current: "16A",
//             frequency: "50Hz",
//             rated_power: "250W",
//             fast_charger: "yes",
//             protection: "Overload, Short Circuit",
//             communication: "Modbus, CAN",
//             cooling: "Air cooled",
//             ingress_protection: "IP65",
//             dimensions: "W X D X H (310x220x90mm)",
//             gun_details: "Two guns",
//             gun_type: "CCS2",
//             material: "Aluminum",
//             ouput_voltage: "7.7 KW",
//             display: "Yes",
//             push_button: "Yes",
//             operatingtemps: "-10°C to 50°C",
//             chargingoperation: "Standard charging operation",
//             safetyregulation: "IEC 61000-2-2",
//             mountingtype: "Wall mounted",
//             cable_length: "10m",
//             additional_details: "This is a high-efficiency product for industrial use.",
//             ocpp_present: "Yes",
//           },
//         });
//       } else {
//         setError(result.message || "Something went wrong!");
//       }
//     } catch (err) {
//       setError("An error occurred while adding the product.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAllProduct = () => {
//     navigate("/manage/products");
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-r from-green-50 via-green-60 to-green-80 bg-cover bg-center bg-fixed">
//       <AdminNavbar onToggleSidebar={toggleSidebar} />
//       <div className="flex flex-1">
//         <AdminSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
//         <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6 md:p-8 lg:p-12 ml-0 sm:ml-10 md:ml-20 lg:ml-70 w-full sm:w-3/4 md:w-1/2 lg:w-200">
//           <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-lg">
//             <h2 className="text-3xl font-semibold mb-6 text-center text-gray-700">Add Product</h2>
//             <div className="flex justify-center mb-6 space-x-4">
//               <button
//                 onClick={handleAllProduct}
//                 className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition duration-300"
//               >
//                 View Products
//               </button>
//             </div>

//             {success && <div className="text-green-500 mb-4 text-center">Product added successfully!</div>}
//             {error && <div className="text-red-500 mb-4 text-center">{error}</div>}

//             <form onSubmit={handleSubmit}>
//               {["name", "model", "mrp","price", "quantity", "product_color"].map((field) => (
//                 <div key={field} className="mb-4">
//                   <label className="block text-gray-600" htmlFor={field}>{field.replace("_", " ").toUpperCase()}</label>
//                   <input
//                    type={field === "price" || field === "mrp" || field === "quantity" ? "number" : "text"}
//                     id={field}
//                     name={field}
//                     value={product[field]}
//                     onChange={handleChange}
//                     required
//                     className="mt-2 px-4 py-2 w-full border rounded-md"
//                   />
//                 </div>
//               ))}

//               <div className="space-y-4">
//                 {Object.entries(product.details).map(([key, value]) => (
//                   <div key={key} className="mb-4">
//                     <label className="block text-gray-600" htmlFor={key}>{key.replace("_", " ").toUpperCase()}</label>

//                     {/* OCPP Dropdown */}
//                     {key === "ocpp_present" ? (
//                       <select
//                         id={key}
//                         name={`details.${key}`}
//                         value={value}
//                         onChange={handleChange}
//                         className="mt-2 px-4 py-2 w-full border rounded-md"
//                       >
//                         <option value="Yes">Yes</option>
//                         <option value="No">No</option>
//                       </select>
//                     ) : (
//                       <input
//                         type="text"
//                         id={key}
//                         name={`details.${key}`}
//                         value={value}
//                         onChange={handleChange}
//                         className="mt-2 px-4 py-2 w-full border rounded-md"
//                       />
//                     )}
//                   </div>
//                 ))}
//               </div>

//               <div className="mb-4">
//                 <label className="block text-gray-600" htmlFor="files">Upload Files</label>
//                 <input
//                   type="file"
//                   id="files"
//                   name="files"
//                   multiple
//                   onChange={handleFileChange}
//                   className="mt-2 px-4 py-2 w-full border rounded-md"
//                 />
//               </div>

//               <div className="flex justify-center">
//                 <button
//                   type="submit"
//                   className="bg-blue-500 text-white px-8 py-3 rounded-md hover:bg-blue-600 transition duration-300"
//                   disabled={loading}
//                 >
//                   {loading ? "Submitting..." : "Add Product"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddProductPage;
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from '../Admin_navbar';
import AdminSidebar from "../Admin_sidebar";
import { 
  FiUpload, 
  FiX, 
  FiPlus, 
  FiTrash2, 
  FiSave,
  FiList,
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
  MdOutlinePriceChange,
  MdOutlineInventory,
  MdOutlineColorLens,
  MdOutlineModelTraining
} from "react-icons/md";
import { TbCurrencyRupee } from "react-icons/tb";
import { FaPlug, FaChargingStation, FaBolt } from "react-icons/fa";

const BASE_URL_AND_PORT = "https://api.static.ev.transev.site";
const API_KEY = "mlzuMoRFjdGhcFulLMaVtfwNAHycbBAf";

const AddProductPage = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [uploadedImages, setUploadedImages] = useState([]);

  const [product, setProduct] = useState({
    name: "",
    model: "",
    mrp: "",  
    price: "",
    quantity: "",
    product_color: "",
    details: {
      input_voltage: "230V",
      phase: "Single",
      current: "16A",
      frequency: "50Hz",
      rated_power: "7kW",
      fast_charger: "no",
      protection: "Overload, Short Circuit, Over Voltage",
      communication: "Modbus, CAN, OCPP",
      cooling: "Air cooled",
      ingress_protection: "IP54",
      dimensions: "310 x 220 x 90mm",
      gun_details: "Single gun",
      gun_type: "Type 2",
      material: "Aluminum + PC",
      ouput_voltage: "230V",
      display: "Yes",
      push_button: "Yes",
      operatingtemps: "-20°C to 50°C",
      chargingoperation: "Plug & Charge",
      safetyregulation: "IEC 61851, IEC 61000",
      mountingtype: "Wall mounted",
      cable_length: "5m",
      additional_details: "",
      ocpp_present: "Yes",
    },
  });

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [section, field] = name.split(".");
      setProduct((prevProduct) => ({
        ...prevProduct,
        details: {
          ...prevProduct.details,
          [field]: value,
        },
      }));
    } else {
      setProduct({ ...product, [name]: value });
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setUploadedImages(prev => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const formData = new FormData();
    formData.append("product_data", JSON.stringify(product));
    
    uploadedImages.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const authToken = localStorage.getItem("auth_token");
      const response = await fetch(`${BASE_URL_AND_PORT}/products/add`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${authToken}`,
          "API-KEY": API_KEY,
        },
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/manage/products");
        }, 2000);
      } else {
        setError(result.message || "Something went wrong!");
      }
    } catch (err) {
      setError("An error occurred while adding the product.");
    } finally {
      setLoading(false);
    }
  };

  const handleAllProduct = () => {
    navigate("/manage/products");
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
        { name: "mrp", label: "MRP", type: "number", placeholder: "e.g., 59999", icon: <MdOutlinePriceChange /> },
        { name: "quantity", label: "Stock Quantity", type: "number", placeholder: "e.g., 100", icon: <MdOutlineInventory /> },
        { name: "product_color", label: "Product Color", type: "text", placeholder: "e.g., White, Black", icon: <MdOutlineColorLens /> },
      ]
    },
    electrical: {
      title: "Electrical Specifications",
      icon: <MdElectricBolt className="text-blue-500" />,
      fields: [
        { name: "rated_power", label: "Rated Power", type: "select", options: ["3.3kW", "7kW", "11kW", "22kW", "30kW", "60kW", "120kW"], icon: <MdSpeed /> },
        { name: "input_voltage", label: "Input Voltage", type: "text", placeholder: "e.g., 230V / 415V" },
        { name: "ouput_voltage", label: "Output Voltage", type: "text", placeholder: "e.g., 230V" },
        { name: "current", label: "Current Rating", type: "text", placeholder: "e.g., 16A / 32A" },
        { name: "phase", label: "Phase", type: "select", options: ["Single", "Three"] },
        { name: "frequency", label: "Frequency", type: "text", placeholder: "e.g., 50Hz" },
      ]
    },
    physical: {
      title: "Physical Specifications",
      icon: <MdVerified className="text-emerald-500" />,
      fields: [
        { name: "dimensions", label: "Dimensions", type: "text", placeholder: "e.g., 310 x 220 x 90mm" },
        { name: "weight", label: "Weight", type: "text", placeholder: "e.g., 5kg" },
        { name: "material", label: "Material", type: "text", placeholder: "e.g., Aluminum + PC" },
        { name: "color", label: "Color", type: "text", placeholder: "e.g., White" },
        { name: "mountingtype", label: "Mounting Type", type: "select", options: ["Wall mounted", "Floor standing", "Portable"] },
        { name: "ingress_protection", label: "IP Rating", type: "select", options: ["IP54", "IP55", "IP65", "IP67"] },
      ]
    },
    charging: {
      title: "Charging Specifications",
      icon: <FaBolt className="text-yellow-500" />,
      fields: [
        { name: "gun_type", label: "Gun Type", type: "select", options: ["Type 1", "Type 2", "CCS1", "CCS2", "CHAdeMO"] },
        { name: "gun_details", label: "Gun Details", type: "text", placeholder: "e.g., Single gun with 5m cable" },
        { name: "cable_length", label: "Cable Length", type: "text", placeholder: "e.g., 5m" },
        { name: "fast_charger", label: "Fast Charger", type: "select", options: ["yes", "no"] },
        { name: "chargingoperation", label: "Charging Operation", type: "text", placeholder: "e.g., Plug & Charge" },
        { name: "display", label: "Display", type: "select", options: ["Yes", "No"] },
        { name: "push_button", label: "Push Button", type: "select", options: ["Yes", "No"] },
      ]
    },
    technical: {
      title: "Technical Features",
      icon: <MdSecurity className="text-purple-500" />,
      fields: [
        { name: "protection", label: "Protection Features", type: "text", placeholder: "e.g., Overload, Short Circuit" },
        { name: "communication", label: "Communication", type: "text", placeholder: "e.g., Modbus, CAN, OCPP" },
        { name: "cooling", label: "Cooling Type", type: "select", options: ["Air cooled", "Liquid cooled", "Natural cooling"] },
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

  const renderField = (field) => {
    const value = field.name.includes(".") 
      ? product.details[field.name.split(".")[1]] 
      : product[field.name];
    
    const fieldName = field.name.includes(".") ? field.name : field.name;

    if (field.type === "select") {
      return (
        <select
          name={fieldName}
          value={value}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50/50"
          required={field.required}
        >
          <option value="">Select {field.label}</option>
          {field.options.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      );
    }
    
    if (field.type === "textarea") {
      return (
        <textarea
          name={fieldName}
          value={value}
          onChange={handleChange}
          placeholder={field.placeholder}
          rows="4"
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 resize-none"
        />
      );
    }
    
    return (
      <input
        type={field.type}
        name={fieldName}
        value={value}
        onChange={handleChange}
        placeholder={field.placeholder}
        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50/50"
        required={field.required}
      />
    );
  };

  const tabs = [
    { id: "basic", label: "Basic Info", icon: <FaChargingStation size={16} /> },
    { id: "electrical", label: "Electrical", icon: <MdElectricBolt size={16} /> },
    { id: "physical", label: "Physical", icon: <MdVerified size={16} /> },
    { id: "charging", label: "Charging", icon: <FaBolt size={16} /> },
    { id: "technical", label: "Technical", icon: <MdSecurity size={16} /> },
    { id: "additional", label: "Additional", icon: <FiInfo size={16} /> },
  ];

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
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                    Add New Product
                  </h1>
                  <p className="text-gray-500 mt-1">Create a new EV charger product listing</p>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={handleAllProduct}
                    className="bg-gray-100 text-gray-700 px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 hover:bg-gray-200 transition-all duration-300"
                  >
                    <FiList size={18} />
                    View Products
                  </button>
                </div>
              </div>
            </div>

            {/* Success/Error Messages */}
            {success && (
              <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3 animate-slideDown">
                <FiCheck className="text-green-500 text-xl" />
                <div>
                  <h3 className="font-semibold text-green-800">Product Added Successfully!</h3>
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
                          ? 'border-green-500 text-green-600 bg-white -mb-px'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {tab.icon}
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6">
                {/* Dynamic Form Sections */}
                {Object.entries(sections).map(([key, section]) => (
                  <div key={key} className={activeTab === key ? 'block' : 'hidden'}>
                    <div className="flex items-center gap-3 mb-6 pb-3 border-b border-gray-200">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
                        {section.icon}
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-800">{section.title}</h2>
                        <p className="text-sm text-gray-500">Fill in the {section.title.toLowerCase()}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {section.fields.map((field) => {
                        const fieldValue = field.name.includes(".")
                          ? product.details[field.name.split(".")[1]]
                          : product[field.name];
                        
                        const fieldName = field.name.includes(".") ? field.name : field.name;
                        
                        return (
                          <div key={field.name} className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                              {field.icon && <span className="text-gray-400">{field.icon}</span>}
                              {field.label}
                              <span className="text-red-500">*</span>
                            </label>
                            
                            {field.type === "select" ? (
                              <select
                                name={fieldName}
                                value={fieldValue}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50/50"
                              >
                                <option value="">Select {field.label}</option>
                                {field.options.map(opt => (
                                  <option key={opt} value={opt}>{opt}</option>
                                ))}
                              </select>
                            ) : field.type === "textarea" ? (
                              <textarea
                                name={fieldName}
                                value={fieldValue}
                                onChange={handleChange}
                                placeholder={field.placeholder}
                                rows="4"
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50/50 resize-none"
                              />
                            ) : (
                              <input
                                type={field.type}
                                name={fieldName}
                                value={fieldValue}
                                onChange={handleChange}
                                placeholder={field.placeholder}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50/50"
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {/* Image Upload Section - Always Visible */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                      <FiImage className="text-blue-600 text-xl" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">Product Images</h2>
                      <p className="text-sm text-gray-500">Upload product photos (multiple images allowed)</p>
                    </div>
                  </div>

                  {/* Image Upload Area */}
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-green-400 transition-all duration-300">
                    <input
                      type="file"
                      id="files"
                      multiple
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="files"
                      className="flex flex-col items-center justify-center cursor-pointer"
                    >
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-3">
                        <FiUpload className="text-green-600 text-2xl" />
                      </div>
                      <p className="text-gray-600 font-medium">Click to upload images</p>
                      <p className="text-gray-400 text-sm mt-1">PNG, JPG, JPEG up to 5MB each</p>
                    </label>
                  </div>

                  {/* Image Preview */}
                  {uploadedImages.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700 mb-3">Uploaded Images ({uploadedImages.length})</p>
                      <div className="flex flex-wrap gap-3">
                        {uploadedImages.map((file, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Preview ${index + 1}`}
                              className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-200"
                            >
                              <FiX size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleAllProduct}
                    className="px-6 py-2.5 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold flex items-center gap-2 hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        Adding Product...
                      </>
                    ) : (
                      <>
                        <FiSave size={18} />
                        Add Product
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

export default AddProductPage;