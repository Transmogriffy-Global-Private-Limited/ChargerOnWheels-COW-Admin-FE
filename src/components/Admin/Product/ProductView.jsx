// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useParams, useNavigate } from 'react-router-dom';
// import AdminNavbar from '../Admin_navbar';
// import AdminSidebar from "../Admin_sidebar";
// import backgroundImage from '../../../assets/workplace.jpg';

// const BASE_URL_AND_PORT = 'https://api.static.ev.transev.site';
// const API_KEY = 'mlzuMoRFjdGhcFulLMaVtfwNAHycbBAf';

// const ProductViewPage = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [product, setProduct] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [imageIndex, setImageIndex] = useState(0);

//   const toggleSidebar = () => {
//     setSidebarOpen(!sidebarOpen);
//   };

//   useEffect(() => {
//     const fetchProduct = async () => {
//       const authToken = localStorage.getItem('auth_token');
//       try {
//         const response = await axios.get(
//           `${BASE_URL_AND_PORT}/products/get_by_id/${id}`,
//           {
//             headers: {
//               'Authorization': `Bearer ${authToken}`,
//               'API-KEY': API_KEY,
//             },
//           }
//         );
//         setProduct(response.data);
//         setLoading(false);
//       } catch (error) {
//         setError('Failed to load product details.');
//         setLoading(false);
//       }
//     };

//     fetchProduct();
//   }, [id]);

//   const handleNextImage = () => {
//     if (product?.image_paths?.length > 1) {
//       const nextIndex = (imageIndex + 1) % product.image_paths.length;
//       setImageIndex(nextIndex);
//     }
//   };

//   const handlePrevImage = () => {
//     if (product?.image_paths?.length > 1) {
//       const prevIndex = (imageIndex - 1 + product.image_paths.length) % product.image_paths.length;
//       setImageIndex(prevIndex);
//     }
//   };

//   if (loading) return <div className="text-center text-white p-10">Loading...</div>;
//   if (error) return <div className="text-center text-red-500 p-10">{error}</div>;

//   return (
//     <div
//       className="min-h-screen bg-gradient-to-r from-white-100 via-white-100 to-white-50 bg-fixed bg-cover bg-center"
//       // style={{ backgroundImage: `url(${backgroundImage})` }}
//     >
//       <AdminNavbar onToggleSidebar={toggleSidebar} />

//       <div className="flex flex-1 flex-col sm:flex-row">
//         <AdminSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

//         <div className="bg-white w-full px-4 py-8 sm:ml-80">
//           <div className="container mx-auto">
//             <button
//               onClick={() => navigate(-1)}
//               className="bg-blue-500 text-white px-4 py-2 rounded-md mb-6"
//             >
//               Back to Product List
//             </button>

//             {product && (
//               <div>
//                 {/* Image Display */}
//                 <div className="relative w-full max-w-xl mx-auto aspect-[4/3] bg-gray-200 mb-8 rounded-lg overflow-hidden shadow-lg">
//                   {product.image_paths?.length > 1 ? (
//                     <>
//                       <img
//                         src={product.image_paths[imageIndex]}
//                         alt={product.name}
//                         className="w-full h-full object-cover"
//                         onError={(e) => {
//                           e.target.onerror = null;
//                           e.target.src = 'https://via.placeholder.com/500';
//                         }}
//                       />
//                       <button
//                         className="absolute top-1/2 left-2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 p-2 rounded-full"
//                         onClick={handlePrevImage}
//                       >
//                         &#10094;
//                       </button>
//                       <button
//                         className="absolute top-1/2 right-2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 p-2 rounded-full"
//                         onClick={handleNextImage}
//                       >
//                         &#10095;
//                       </button>
//                     </>
//                   ) : (
//                     <img
//                       src={product.image_paths?.[0] || 'https://via.placeholder.com/500'}
//                       alt={product.name}
//                       className="w-full h-full object-cover"
//                       onError={(e) => {
//                         e.target.onerror = null;
//                         e.target.src = 'https://via.placeholder.com/500';
//                       }}
//                     />
//                   )}
//                 </div>

//                 {/* Basic Info */}
//                 <div className="mb-6 text-center sm:text-left">
//                   <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
//                   <p className="text-xl text-gray-600 mb-1">Model: {product.model}</p>
//                   {/* <p className="text-lg text-gray-700 mb-1">Price: ₹{product.price}</p> */}
//                   <div className="flex items-center gap-2 mb-1">
//   <span className="text-lg text-gray-600 font-medium">
//     Price:
//   </span>

//   {product.mrp > product.price && (
//     <span className="text-sm text-gray-500 line-through">
//       ₹{product.mrp}
//     </span>
//   )}

//   <span className="text-xl font-bold text-gray-800">
//     ₹{product.price}
//   </span>
// </div>


//                   <p className="text-lg text-gray-700">Quantity: {product.quantity}</p>
//                 </div>

//                 {/* Details Table */}
//                 <div className="overflow-x-auto bg-gray-50 p-4 rounded-lg shadow">
//                   <table className="table-auto w-full border-collapse">
//                     <tbody>
//                       {product.details && Object.entries(product.details).map(([key, value]) => {
//                         if (value && value.trim() !== "") {
//                           return (
//                             <tr key={key} className="border-b border-gray-200">
//                               <td className="font-semibold py-2 pr-4 capitalize text-gray-800">
//                                 {key.replace(/_/g, " ")}
//                               </td>
//                               <td className="py-2 text-gray-700">{value}</td>
//                             </tr>
//                           );
//                         }
//                         return null;
//                       })}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductViewPage;
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useParams, useNavigate } from 'react-router-dom';
// import AdminNavbar from '../Admin_navbar';
// import AdminSidebar from "../Admin_sidebar";
// import { 
//   FiArrowLeft, 
//   FiEdit2, 
//   FiTrash2, 
//   FiChevronLeft, 
//   FiChevronRight,
//   FiPackage,
//   FiTag,
//   FiBox,
//   FiCheckCircle,
//   FiXCircle,
//   FiInfo,
//   FiDownload,
//   FiPrinter
// } from "react-icons/fi";
// import { 
//   MdElectricBolt, 
//   MdSpeed, 
//   MdVerified, 
//   MdSecurity,
//   MdOutlineInventory,
//   MdOutlineColorLens,
//   MdOutlineModelTraining,
//   MdFlashOn,
//   MdStar,
//   MdStarHalf,
//   MdStarBorder
// } from "react-icons/md";
// import { TbCurrencyRupee } from "react-icons/tb";
// import { FaPlug, FaChargingStation, FaBolt, FaBox, FaShoppingCart } from "react-icons/fa";

// const BASE_URL_AND_PORT = 'https://api.static.ev.transev.site';
// const API_KEY = 'mlzuMoRFjdGhcFulLMaVtfwNAHycbBAf';

// const ProductViewPage = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [product, setProduct] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [imageIndex, setImageIndex] = useState(0);
//   const [activeTab, setActiveTab] = useState("overview");

//   const toggleSidebar = () => {
//     setSidebarOpen(!sidebarOpen);
//   };

//   useEffect(() => {
//     const fetchProduct = async () => {
//       const authToken = localStorage.getItem('auth_token');
//       try {
//         const response = await axios.get(
//           `${BASE_URL_AND_PORT}/products/get_by_id/${id}`,
//           {
//             headers: {
//               'Authorization': `Bearer ${authToken}`,
//               'API-KEY': API_KEY,
//             },
//           }
//         );
//         setProduct(response.data);
//         setLoading(false);
//       } catch (error) {
//         setError('Failed to load product details.');
//         setLoading(false);
//       }
//     };

//     fetchProduct();
//   }, [id]);

//   const handleNextImage = () => {
//     if (product?.image_paths?.length > 1) {
//       const nextIndex = (imageIndex + 1) % product.image_paths.length;
//       setImageIndex(nextIndex);
//     }
//   };

//   const handlePrevImage = () => {
//     if (product?.image_paths?.length > 1) {
//       const prevIndex = (imageIndex - 1 + product.image_paths.length) % product.image_paths.length;
//       setImageIndex(prevIndex);
//     }
//   };

//   const handleEdit = () => {
//     navigate(`/admin/product/edit/${id}`);
//   };

//   const handleDelete = async () => {
//     if (window.confirm('Are you sure you want to delete this product?')) {
//       const authToken = localStorage.getItem('auth_token');
//       try {
//         await axios.delete(`${BASE_URL_AND_PORT}/products/delete/${id}`, {
//           headers: {
//             'Authorization': `Bearer ${authToken}`,
//             'API-KEY': API_KEY,
//           },
//         });
//         navigate('/manage/products');
//       } catch (error) {
//         console.error('Delete failed:', error);
//         alert('Failed to delete product');
//       }
//     }
//   };

//   // Get charger power info for badge
//   const getChargerPower = () => {
//     if (!product) return { power: "Standard", badge: "bg-gray-100 text-gray-700", icon: "🔌" };
//     const name = product.name?.toUpperCase() || "";
//     if (name.includes("120KW")) return { power: "120kW Ultra Fast", badge: "bg-red-100 text-red-700", icon: "🔥", color: "red" };
//     if (name.includes("60KW")) return { power: "60kW Fast Charger", badge: "bg-purple-100 text-purple-700", icon: "⚡", color: "purple" };
//     if (name.includes("30KW")) return { power: "30kW DC", badge: "bg-blue-100 text-blue-700", icon: "🔌", color: "blue" };
//     if (name.includes("22KW")) return { power: "22kW AC", badge: "bg-green-100 text-green-700", icon: "🔌", color: "green" };
//     return { power: "AC Charger", badge: "bg-green-100 text-green-700", icon: "🔌", color: "green" };
//   };

//   // Render stars based on rating
//   const renderStars = (rating) => {
//     const stars = [];
//     const fullStars = Math.floor(rating);
//     const hasHalfStar = rating % 1 >= 0.5;
    
//     for (let i = 0; i < fullStars; i++) {
//       stars.push(<MdStar key={i} className="text-yellow-400 text-sm" />);
//     }
//     if (hasHalfStar) {
//       stars.push(<MdStarHalf key="half" className="text-yellow-400 text-sm" />);
//     }
//     while (stars.length < 5) {
//       stars.push(<MdStarBorder key={stars.length} className="text-yellow-400 text-sm" />);
//     }
//     return stars;
//   };

//   const powerInfo = getChargerPower();

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
//         <AdminNavbar onToggleSidebar={toggleSidebar} />
//         <div className="flex">
//           <AdminSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
//           <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'lg:ml-72' : 'lg:ml-24'}`}>
//             <div className="flex justify-center items-center h-screen">
//               <div className="text-center">
//                 <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500 mx-auto mb-4"></div>
//                 <p className="text-gray-500">Loading product details...</p>
//               </div>
//             </div>
//           </main>
//         </div>
//       </div>
//     );
//   }

//   if (error || !product) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
//         <AdminNavbar onToggleSidebar={toggleSidebar} />
//         <div className="flex">
//           <AdminSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
//           <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'lg:ml-72' : 'lg:ml-24'}`}>
//             <div className="flex justify-center items-center h-screen">
//               <div className="text-center">
//                 <div className="text-6xl mb-4">😞</div>
//                 <p className="text-red-500 text-lg">{error || 'Product not found'}</p>
//                 <button
//                   onClick={() => navigate('/manage/products')}
//                   className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
//                 >
//                   Back to Products
//                 </button>
//               </div>
//             </div>
//           </main>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
//       <AdminNavbar onToggleSidebar={toggleSidebar} />

//       <div className="flex">
//         <AdminSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

//         {/* Main Content */}
//         <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'lg:ml-72' : 'lg:ml-24'}`}>
//           <div className="p-4 md:p-6 lg:p-8">
            
//             {/* Header with Actions */}
//             <div className="mb-6">
//               <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//                 <div>
//                   <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//                     Product Details
//                   </h1>
//                   <p className="text-gray-500 mt-1">View complete product information</p>
//                 </div>
                
//                 <div className="flex gap-3">
//                   <button
//                     onClick={() => navigate('/manage/products')}
//                     className="bg-gray-100 text-gray-700 px-4 py-2 rounded-xl font-medium flex items-center gap-2 hover:bg-gray-200 transition-all duration-300"
//                   >
//                     <FiArrowLeft size={16} />
//                     Back
//                   </button>
//                   <button
//                     onClick={handleEdit}
//                     className="bg-yellow-500 text-white px-4 py-2 rounded-xl font-medium flex items-center gap-2 hover:bg-yellow-600 transition-all duration-300"
//                   >
//                     <FiEdit2 size={16} />
//                     Edit
//                   </button>
//                   <button
//                     onClick={handleDelete}
//                     className="bg-red-500 text-white px-4 py-2 rounded-xl font-medium flex items-center gap-2 hover:bg-red-600 transition-all duration-300"
//                   >
//                     <FiTrash2 size={16} />
//                     Delete
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Product Main Card */}
//             <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
//               {/* Product Header with Badge */}
//               <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
//                 <div className="flex flex-wrap items-center justify-between gap-3">
//                   <div className="flex items-center gap-3">
//                     <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
//                       <FaChargingStation className="text-white text-xl" />
//                     </div>
//                     <div>
//                       <h2 className="text-xl font-bold text-gray-800">{product.name}</h2>
//                       <p className="text-sm text-gray-500">Model: {product.model}</p>
//                     </div>
//                   </div>
//                   <div className={`px-3 py-1 rounded-full text-sm font-semibold ${powerInfo.badge}`}>
//                     {powerInfo.icon} {powerInfo.power}
//                   </div>
//                 </div>
//               </div>

//               {/* Image Gallery Section */}
//               <div className="p-6 border-b border-gray-200">
//                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//                   {/* Main Image */}
//                   <div className="lg:col-span-2">
//                     <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden aspect-square max-w-2xl mx-auto">
//                       <img
//                         src={product.image_paths?.[imageIndex] || 'https://via.placeholder.com/500'}
//                         alt={product.name}
//                         className="w-full h-full object-contain p-4"
//                       />
//                       {product.image_paths?.length > 1 && (
//                         <>
//                           <button
//                             onClick={handlePrevImage}
//                             className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-all duration-300"
//                           >
//                             <FiChevronLeft size={20} />
//                           </button>
//                           <button
//                             onClick={handleNextImage}
//                             className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-all duration-300"
//                           >
//                             <FiChevronRight size={20} />
//                           </button>
//                         </>
//                       )}
//                     </div>
                    
//                     {/* Thumbnails */}
//                     {product.image_paths?.length > 1 && (
//                       <div className="flex justify-center gap-2 mt-4">
//                         {product.image_paths.map((img, idx) => (
//                           <button
//                             key={idx}
//                             onClick={() => setImageIndex(idx)}
//                             className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
//                               imageIndex === idx ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-400'
//                             }`}
//                           >
//                             <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
//                           </button>
//                         ))}
//                       </div>
//                     )}
//                   </div>

//                   {/* Product Info Panel */}
//                   <div className="space-y-4">
//                     {/* Price Card */}
//                     <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4">
//                       <div className="flex items-center gap-2 mb-2">
//                         <TbCurrencyRupee className="text-blue-600 text-xl" />
//                         <span className="text-gray-600">Price</span>
//                       </div>
//                       <div className="flex items-baseline gap-2">
//                         {product.mrp > product.price && (
//                           <span className="text-lg text-gray-400 line-through">₹{product.mrp?.toLocaleString()}</span>
//                         )}
//                         <span className="text-3xl font-bold text-blue-600">₹{product.price?.toLocaleString()}</span>
//                       </div>
//                       {product.mrp > product.price && (
//                         <div className="mt-1">
//                           <span className="text-sm text-green-600">
//                             Save ₹{(product.mrp - product.price).toLocaleString()} ({Math.round((product.mrp - product.price) / product.mrp * 100)}% off)
//                           </span>
//                         </div>
//                       )}
//                     </div>

//                     {/* Stock Status */}
//                     <div className="bg-white rounded-xl border border-gray-200 p-4">
//                       <div className="flex items-center justify-between">
//                         <div className="flex items-center gap-2">
//                           <FaBox className="text-gray-400" />
//                           <span className="text-gray-600">Stock Status</span>
//                         </div>
//                         {product.quantity > 0 ? (
//                           <div className="flex items-center gap-2">
//                             <FiCheckCircle className="text-green-500" />
//                             <span className="text-green-600 font-semibold">In Stock ({product.quantity} units)</span>
//                           </div>
//                         ) : (
//                           <div className="flex items-center gap-2">
//                             <FiXCircle className="text-red-500" />
//                             <span className="text-red-600 font-semibold">Out of Stock</span>
//                           </div>
//                         )}
//                       </div>
//                     </div>

//                     {/* Rating */}
//                     <div className="bg-white rounded-xl border border-gray-200 p-4">
//                       <div className="flex items-center justify-between">
//                         <div className="flex items-center gap-2">
//                           <MdStar className="text-yellow-400" />
//                           <span className="text-gray-600">Customer Rating</span>
//                         </div>
//                         <div className="flex items-center gap-2">
//                           {renderStars(4.5)}
//                           <span className="text-gray-500 text-sm">(128 reviews)</span>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Quick Actions */}
//                     <div className="flex gap-3">
//                       <button className="flex-1 bg-blue-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-blue-600 transition">
//                         <FaShoppingCart size={16} />
//                         Add to Cart
//                       </button>
//                       <button className="flex-1 bg-green-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-green-600 transition">
//                         <FiDownload size={16} />
//                         Download Specs
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Tabs Navigation */}
//               <div className="border-b border-gray-200 bg-gray-50/50 overflow-x-auto">
//                 <div className="flex px-6 gap-2">
//                   <button
//                     onClick={() => setActiveTab("overview")}
//                     className={`px-5 py-3 font-medium transition-all duration-200 border-b-2 ${
//                       activeTab === "overview"
//                         ? 'border-blue-500 text-blue-600'
//                         : 'border-transparent text-gray-500 hover:text-gray-700'
//                     }`}
//                   >
//                     Overview
//                   </button>
//                   <button
//                     onClick={() => setActiveTab("specifications")}
//                     className={`px-5 py-3 font-medium transition-all duration-200 border-b-2 ${
//                       activeTab === "specifications"
//                         ? 'border-blue-500 text-blue-600'
//                         : 'border-transparent text-gray-500 hover:text-gray-700'
//                     }`}
//                   >
//                     Technical Specifications
//                   </button>
//                   <button
//                     onClick={() => setActiveTab("details")}
//                     className={`px-5 py-3 font-medium transition-all duration-200 border-b-2 ${
//                       activeTab === "details"
//                         ? 'border-blue-500 text-blue-600'
//                         : 'border-transparent text-gray-500 hover:text-gray-700'
//                     }`}
//                   >
//                     Product Details
//                   </button>
//                 </div>
//               </div>

//               {/* Tab Content */}
//               <div className="p-6">
//                 {/* Overview Tab */}
//                 {activeTab === "overview" && (
//                   <div className="space-y-6">
//                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                       <div className="bg-gray-50 rounded-xl p-4 text-center">
//                         <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
//                           <MdElectricBolt className="text-blue-600 text-xl" />
//                         </div>
//                         <p className="text-sm text-gray-500">Rated Power</p>
//                         <p className="font-semibold text-gray-800">{product.details?.rated_power || 'N/A'}</p>
//                       </div>
//                       <div className="bg-gray-50 rounded-xl p-4 text-center">
//                         <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
//                           <MdSpeed className="text-green-600 text-xl" />
//                         </div>
//                         <p className="text-sm text-gray-500">Charging Speed</p>
//                         <p className="font-semibold text-gray-800">{powerInfo.power}</p>
//                       </div>
//                       <div className="bg-gray-50 rounded-xl p-4 text-center">
//                         <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
//                           <MdSecurity className="text-purple-600 text-xl" />
//                         </div>
//                         <p className="text-sm text-gray-500">IP Rating</p>
//                         <p className="font-semibold text-gray-800">{product.details?.ingress_protection || 'N/A'}</p>
//                       </div>
//                       <div className="bg-gray-50 rounded-xl p-4 text-center">
//                         <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
//                           <FaPlug className="text-yellow-600 text-xl" />
//                         </div>
//                         <p className="text-sm text-gray-500">Connector Type</p>
//                         <p className="font-semibold text-gray-800">{product.details?.gun_type || 'N/A'}</p>
//                       </div>
//                     </div>
                    
//                     <div className="bg-gray-50 rounded-xl p-4">
//                       <h3 className="font-semibold text-gray-800 mb-2">Product Highlights</h3>
//                       <ul className="space-y-2">
//                         {product.details?.fast_charger === 'yes' && (
//                           <li className="flex items-center gap-2 text-sm text-gray-600">
//                             <FiCheckCircle className="text-green-500" />
//                             Fast Charging Support
//                           </li>
//                         )}
//                         {product.details?.display === 'Yes' && (
//                           <li className="flex items-center gap-2 text-sm text-gray-600">
//                             <FiCheckCircle className="text-green-500" />
//                             LCD Display for real-time monitoring
//                           </li>
//                         )}
//                         {product.details?.ocpp_present === 'Yes' && (
//                           <li className="flex items-center gap-2 text-sm text-gray-600">
//                             <FiCheckCircle className="text-green-500" />
//                             OCPP Compliant for smart charging
//                           </li>
//                         )}
//                         <li className="flex items-center gap-2 text-sm text-gray-600">
//                           <FiCheckCircle className="text-green-500" />
//                           {product.details?.protection || 'Multiple'} protection features
//                         </li>
//                       </ul>
//                     </div>
//                   </div>
//                 )}

//                 {/* Specifications Tab */}
//                 {activeTab === "specifications" && (
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     {product.details && Object.entries(product.details).map(([key, value]) => {
//                       if (value && value.trim() !== "" && key !== 'additional_details') {
//                         const labels = {
//                           rated_power: 'Rated Power',
//                           input_voltage: 'Input Voltage',
//                           ouput_voltage: 'Output Voltage',
//                           current: 'Current Rating',
//                           phase: 'Phase',
//                           frequency: 'Frequency',
//                           protection: 'Protection Features',
//                           dimensions: 'Dimensions',
//                           gun_type: 'Gun Type',
//                           gun_details: 'Gun Details',
//                           material: 'Material',
//                           cooling: 'Cooling Type',
//                           ingress_protection: 'IP Rating',
//                           cable_length: 'Cable Length',
//                           mountingtype: 'Mounting Type',
//                           operatingtemps: 'Operating Temperature',
//                           communication: 'Communication Protocol',
//                           fast_charger: 'Fast Charger',
//                           display: 'Display',
//                           push_button: 'Push Button',
//                           chargingoperation: 'Charging Operation',
//                           safetyregulation: 'Safety Regulation',
//                           ocpp_present: 'OCPP Support'
//                         };
                        
//                         return (
//                           <div key={key} className="bg-gray-50 rounded-xl p-3">
//                             <p className="text-xs text-gray-500 mb-1">{labels[key] || key.replace(/_/g, ' ')}</p>
//                             <p className="text-sm font-medium text-gray-800">{value}</p>
//                           </div>
//                         );
//                       }
//                       return null;
//                     })}
//                   </div>
//                 )}

//                 {/* Details Tab */}
//                 {activeTab === "details" && (
//                   <div className="space-y-4">
//                     <div className="grid grid-cols-2 gap-4">
//                       <div className="bg-gray-50 rounded-xl p-3">
//                         <p className="text-xs text-gray-500">Product Name</p>
//                         <p className="text-sm font-medium text-gray-800">{product.name}</p>
//                       </div>
//                       <div className="bg-gray-50 rounded-xl p-3">
//                         <p className="text-xs text-gray-500">Model Number</p>
//                         <p className="text-sm font-medium text-gray-800">{product.model}</p>
//                       </div>
//                       <div className="bg-gray-50 rounded-xl p-3">
//                         <p className="text-xs text-gray-500">Color</p>
//                         <p className="text-sm font-medium text-gray-800">{product.product_color || 'N/A'}</p>
//                       </div>
//                       <div className="bg-gray-50 rounded-xl p-3">
//                         <p className="text-xs text-gray-500">Added On</p>
//                         <p className="text-sm font-medium text-gray-800">{new Date(product.created_at).toLocaleDateString()}</p>
//                       </div>
//                     </div>
                    
//                     {product.details?.additional_details && (
//                       <div className="bg-gray-50 rounded-xl p-4">
//                         <h3 className="font-semibold text-gray-800 mb-2">Additional Information</h3>
//                         <p className="text-sm text-gray-600">{product.details.additional_details}</p>
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default ProductViewPage;



import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import AdminNavbar from '../Admin_navbar';
import AdminSidebar from "../Admin_sidebar";
import { 
  FiArrowLeft, 
  FiEdit2, 
  FiTrash2, 
  FiChevronLeft, 
  FiChevronRight,
  FiPackage,
  FiTag,
  FiBox,
  FiCheckCircle,
  FiXCircle,
  FiInfo,
  FiDownload,
  FiPrinter,
  FiEye,
  FiEyeOff,
  FiRefreshCw
} from "react-icons/fi";
import { 
  MdElectricBolt, 
  MdSpeed, 
  MdVerified, 
  MdSecurity,
  MdOutlineInventory,
  MdOutlineColorLens,
  MdOutlineModelTraining,
  MdFlashOn,
  MdStar,
  MdStarHalf,
  MdStarBorder,
  MdDelete,
  MdVisibility,
  MdVisibilityOff
} from "react-icons/md";
import { TbCurrencyRupee } from "react-icons/tb";
import { FaPlug, FaChargingStation, FaBolt, FaBox, FaShoppingCart, FaThumbsUp, FaCalendarAlt, FaUserCircle } from "react-icons/fa";

const BASE_URL_AND_PORT = 'https://api.static.ev.transev.site';
const API_KEY = 'mlzuMoRFjdGhcFulLMaVtfwNAHycbBAf';

const ProductViewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [imageIndex, setImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("overview");
  
  // Review States
  const [reviewSummary, setReviewSummary] = useState(null);
  const [allReviews, setAllReviews] = useState([]); // Store all reviews (visible + hidden)
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [reviewsLimit, setReviewsLimit] = useState("1-50"); // Fetch more reviews at once
  const [hasMoreReviews, setHasMoreReviews] = useState(false);
  const [deletingReviewId, setDeletingReviewId] = useState(null);
  const [updatingVisibilityId, setUpdatingVisibilityId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [filterVisibility, setFilterVisibility] = useState("all"); // all, visible, hidden

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      const authToken = localStorage.getItem('auth_token');
      try {
        const response = await axios.get(
          BASE_URL_AND_PORT + "/products/get_by_id/" + id,
          {
            headers: {
              'Authorization': 'Bearer ' + authToken,
              'API-KEY': API_KEY,
            },
          }
        );
        setProduct(response.data);
        
        await fetchReviewSummary(id);
        await fetchAllReviews(id);
        
        setLoading(false);
      } catch (error) {
        setError('Failed to load product details.');
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Fetch review summary (only visible reviews for public display)
  const fetchReviewSummary = async (productId) => {
    try {
      const response = await axios.get(
        BASE_URL_AND_PORT + "/products/reviews/summary/" + productId,
        {
          headers: {
            "API-KEY": API_KEY,
          },
        }
      );
      setReviewSummary(response.data);
    } catch (error) {
      console.error("Error fetching review summary:", error);
      setReviewSummary({
        average_rating: 0,
        review_count: 0,
        rating_breakdown: { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 }
      });
    }
  };

  // Fetch ALL reviews for admin (includes both visible and hidden)
  const fetchAllReviews = async (productId, limit = "1-50") => {
    setLoadingReviews(true);
    try {
      // Admin sees all reviews regardless of visibility
      const response = await axios.get(
        BASE_URL_AND_PORT + "/products/reviews/" + productId + "?limit=" + limit,
        {
          headers: {
            "API-KEY": API_KEY,
          },
        }
      );
      
      setAllReviews(response.data.reviews || []);
      setHasMoreReviews(response.data.reviews?.length >= 50);
    } catch (error) {
      console.error("Error fetching all reviews:", error);
      setAllReviews([]);
    } finally {
      setLoadingReviews(false);
    }
  };

  // Load more reviews
  const loadMoreReviews = async () => {
    const currentStart = parseInt(reviewsLimit.split("-")[0]);
    const newStart = currentStart + 50;
    const newLimit = newStart + "-" + (newStart + 49);
    setReviewsLimit(newLimit);
    
    try {
      const response = await axios.get(
        BASE_URL_AND_PORT + "/products/reviews/" + id + "?limit=" + newLimit,
        {
          headers: {
            "API-KEY": API_KEY,
          },
        }
      );
      
      setAllReviews(prev => [...prev, ...(response.data.reviews || [])]);
      setHasMoreReviews(response.data.reviews?.length >= 50);
    } catch (error) {
      console.error("Error loading more reviews:", error);
    }
  };

  // Delete a review
  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review? This action cannot be undone.")) {
      return;
    }
    
    setDeletingReviewId(reviewId);
    const authToken = localStorage.getItem('auth_token');
    
    try {
      const response = await axios.delete(
        BASE_URL_AND_PORT + "/products/reviews/" + reviewId,
        {
          headers: {
            "API-KEY": API_KEY,
            "Authorization": "Bearer " + authToken,
          },
        }
      );
      
      if (response.status === 200) {
        showToast("Review deleted successfully!", 'success');
        await fetchAllReviews(id, reviewsLimit);
        await fetchReviewSummary(id);
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      if (error.response?.data?.detail) {
        showToast(error.response.data.detail, 'error');
      } else {
        showToast("Failed to delete review. Please try again.", 'error');
      }
    } finally {
      setDeletingReviewId(null);
    }
  };

  // Toggle review visibility (hide/unhide) - Admin can control
  const handleToggleVisibility = async (reviewId, currentVisibility) => {
    setUpdatingVisibilityId(reviewId);
    const authToken = localStorage.getItem('auth_token');
    const newVisibility = !currentVisibility;
    
    try {
      const response = await axios.put(
        BASE_URL_AND_PORT + "/products/admin/reviews/visibility",
        {
          review_id: reviewId,
          is_visible: newVisibility
        },
        {
          headers: {
            "API-KEY": API_KEY,
            "Authorization": "Bearer " + authToken,
            "Content-Type": "application/json"
          },
        }
      );
      
      if (response.status === 200) {
        showToast(
          newVisibility ? "Review is now VISIBLE to customers!" : "Review is now HIDDEN from customers!",
          'success'
        );
        
        // Update the review in the local state
        setAllReviews(prevReviews =>
          prevReviews.map(review =>
            review.id === reviewId
              ? { ...review, is_visible: newVisibility }
              : review
          )
        );
        
        // Refresh summary to update counts (summary only counts visible reviews)
        await fetchReviewSummary(id);
      }
    } catch (error) {
      console.error("Error updating review visibility:", error);
      if (error.response?.data?.detail) {
        showToast(error.response.data.detail, 'error');
      } else {
        showToast("Failed to update review visibility. Please try again.", 'error');
      }
    } finally {
      setUpdatingVisibilityId(null);
    }
  };

  // Filter reviews based on visibility
  const getFilteredReviews = () => {
    if (filterVisibility === "all") return allReviews;
    if (filterVisibility === "visible") return allReviews.filter(r => r.is_visible === true);
    if (filterVisibility === "hidden") return allReviews.filter(r => r.is_visible === false);
    return allReviews;
  };

  // Get stats for filtered reviews
  const getFilterStats = () => {
    const visible = allReviews.filter(r => r.is_visible === true).length;
    const hidden = allReviews.filter(r => r.is_visible === false).length;
    return { visible, hidden, total: allReviews.length };
  };

  const handleNextImage = () => {
    if (product?.image_paths?.length > 1) {
      const nextIndex = (imageIndex + 1) % product.image_paths.length;
      setImageIndex(nextIndex);
    }
  };

  const handlePrevImage = () => {
    if (product?.image_paths?.length > 1) {
      const prevIndex = (imageIndex - 1 + product.image_paths.length) % product.image_paths.length;
      setImageIndex(prevIndex);
    }
  };

  const handleEdit = () => {
    navigate("/admin/product/edit/" + id);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const authToken = localStorage.getItem('auth_token');
      try {
        await axios.delete(BASE_URL_AND_PORT + "/products/delete/" + id, {
          headers: {
            'Authorization': 'Bearer ' + authToken,
            'API-KEY': API_KEY,
          },
        });
        navigate('/manage/products');
      } catch (error) {
        console.error('Delete failed:', error);
        alert('Failed to delete product');
      }
    }
  };

  // Get charger power info
  const getChargerPower = () => {
    if (!product) return { power: "Standard", badge: "bg-gray-100 text-gray-700", icon: "🔌", color: "gray" };
    const name = product.name?.toUpperCase() || "";
    if (name.includes("120KW")) return { power: "120kW Ultra Fast", badge: "bg-red-100 text-red-700", icon: "🔥", color: "red" };
    if (name.includes("60KW")) return { power: "60kW Fast Charger", badge: "bg-purple-100 text-purple-700", icon: "⚡", color: "purple" };
    if (name.includes("30KW")) return { power: "30kW DC", badge: "bg-blue-100 text-blue-700", icon: "🔌", color: "blue" };
    if (name.includes("22KW")) return { power: "22kW AC", badge: "bg-green-100 text-green-700", icon: "🔌", color: "green" };
    return { power: "AC Charger", badge: "bg-green-100 text-green-700", icon: "🔌", color: "green" };
  };

  // Render stars based on rating
  const renderStars = (rating, size = "text-sm") => {
    const numRating = Number(rating);
    if (isNaN(numRating) || numRating === 0) {
      return (
        <div className="flex items-center gap-0.5">
          {[...Array(5)].map((_, i) => (
            <MdStarBorder key={i} className={size + " text-gray-300"} />
          ))}
        </div>
      );
    }
    
    const fullStars = Math.floor(numRating);
    const hasHalfStar = numRating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(fullStars)].map((_, i) => (
          <MdStar key={i} className={size + " text-yellow-400"} />
        ))}
        {hasHalfStar && <MdStarHalf className={size + " text-yellow-400"} />}
        {[...Array(emptyStars)].map((_, i) => (
          <MdStarBorder key={i} className={size + " text-gray-300"} />
        ))}
      </div>
    );
  };

  const powerInfo = getChargerPower();
  const filterStats = getFilterStats();
  const filteredReviews = getFilteredReviews();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
        <AdminNavbar onToggleSidebar={toggleSidebar} />
        <div className="flex">
          <AdminSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
          <main className={"flex-1 transition-all duration-300 " + (sidebarOpen ? 'lg:ml-72' : 'lg:ml-24')}>
            <div className="flex justify-center items-center h-screen">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-500">Loading product details...</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
        <AdminNavbar onToggleSidebar={toggleSidebar} />
        <div className="flex">
          <AdminSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
          <main className={"flex-1 transition-all duration-300 " + (sidebarOpen ? 'lg:ml-72' : 'lg:ml-24')}>
            <div className="flex justify-center items-center h-screen">
              <div className="text-center">
                <div className="text-6xl mb-4">😞</div>
                <p className="text-red-500 text-lg">{error || 'Product not found'}</p>
                <button
                  onClick={() => navigate('/manage/products')}
                  className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
                >
                  Back to Products
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
      <AdminNavbar onToggleSidebar={toggleSidebar} />

      <div className="flex">
        <AdminSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

        <main className={"flex-1 transition-all duration-300 " + (sidebarOpen ? 'lg:ml-72' : 'lg:ml-24')}>
          <div className="p-4 md:p-6 lg:p-8">
            
            {/* Toast Notification */}
            {toastMessage && (
              <div className={"fixed top-20 right-4 z-50 animate-slideIn " + (
                toastMessage.type === 'success' ? 'bg-green-500' : 'bg-red-500'
              ) + " text-white px-6 py-3 rounded-lg shadow-lg"}>
                {toastMessage.message}
              </div>
            )}

            {/* Header with Actions */}
            <div className="mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Product Details
                  </h1>
                  <p className="text-gray-500 mt-1">View complete product information and manage reviews</p>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => navigate('/manage/products')}
                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-xl font-medium flex items-center gap-2 hover:bg-gray-200 transition-all duration-300"
                  >
                    <FiArrowLeft size={16} />
                    Back
                  </button>
                  <button
                    onClick={handleEdit}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-xl font-medium flex items-center gap-2 hover:bg-yellow-600 transition-all duration-300"
                  >
                    <FiEdit2 size={16} />
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="bg-red-500 text-white px-4 py-2 rounded-xl font-medium flex items-center gap-2 hover:bg-red-600 transition-all duration-300"
                  >
                    <FiTrash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            </div>

            {/* Product Main Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              {/* Product Header */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <FaChargingStation className="text-white text-xl" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">{product.name}</h2>
                      <p className="text-sm text-gray-500">Model: {product.model}</p>
                    </div>
                  </div>
                  <div className={"px-3 py-1 rounded-full text-sm font-semibold " + powerInfo.badge}>
                    {powerInfo.icon} {powerInfo.power}
                  </div>
                </div>
              </div>

              {/* Image Gallery Section */}
              <div className="p-6 border-b border-gray-200">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                    <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden aspect-square max-w-2xl mx-auto">
                      <img
                        src={product.image_paths?.[imageIndex] || 'https://via.placeholder.com/500'}
                        alt={product.name}
                        className="w-full h-full object-contain p-4"
                      />
                      {product.image_paths?.length > 1 && (
                        <>
                          <button
                            onClick={handlePrevImage}
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-all duration-300"
                          >
                            <FiChevronLeft size={20} />
                          </button>
                          <button
                            onClick={handleNextImage}
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-all duration-300"
                          >
                            <FiChevronRight size={20} />
                          </button>
                        </>
                      )}
                    </div>
                    
                    {product.image_paths?.length > 1 && (
                      <div className="flex justify-center gap-2 mt-4">
                        {product.image_paths.map((img, idx) => (
                          <button
                            key={idx}
                            onClick={() => setImageIndex(idx)}
                            className={"w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 " + (
                              imageIndex === idx ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-400'
                            )}
                          >
                            <img src={img} alt={"Thumb " + (idx + 1)} className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Product Info Panel */}
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <TbCurrencyRupee className="text-blue-600 text-xl" />
                        <span className="text-gray-600">Price</span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        {product.mrp > product.price && (
                          <span className="text-lg text-gray-400 line-through">₹{product.mrp?.toLocaleString()}</span>
                        )}
                        <span className="text-3xl font-bold text-blue-600">₹{product.price?.toLocaleString()}</span>
                      </div>
                      {product.mrp > product.price && (
                        <div className="mt-1">
                          <span className="text-sm text-green-600">
                            Save ₹{(product.mrp - product.price).toLocaleString()} ({Math.round((product.mrp - product.price) / product.mrp * 100)}% off)
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FaBox className="text-gray-400" />
                          <span className="text-gray-600">Stock Status</span>
                        </div>
                        {product.quantity > 0 ? (
                          <div className="flex items-center gap-2">
                            <FiCheckCircle className="text-green-500" />
                            <span className="text-green-600 font-semibold">In Stock ({product.quantity} units)</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <FiXCircle className="text-red-500" />
                            <span className="text-red-600 font-semibold">Out of Stock</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Real Rating from API - Only visible reviews count */}
                    <div className="bg-white rounded-xl border border-gray-200 p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MdStar className="text-yellow-400" />
                          <span className="text-gray-600">Customer Rating (Visible Reviews)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {renderStars(reviewSummary?.average_rating || 0, "text-sm")}
                          <span className="text-gray-500 text-sm">({reviewSummary?.review_count || 0} reviews)</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button className="flex-1 bg-blue-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-blue-600 transition">
                        <FaShoppingCart size={16} />
                        Add to Cart
                      </button>
                      <button className="flex-1 bg-green-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-green-600 transition">
                        <FiDownload size={16} />
                        Download Specs
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs Navigation */}
              <div className="border-b border-gray-200 bg-gray-50/50 overflow-x-auto">
                <div className="flex px-6 gap-2">
                  <button
                    onClick={() => setActiveTab("overview")}
                    className={"px-5 py-3 font-medium transition-all duration-200 border-b-2 " + (
                      activeTab === "overview"
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    )}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setActiveTab("specifications")}
                    className={"px-5 py-3 font-medium transition-all duration-200 border-b-2 " + (
                      activeTab === "specifications"
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    )}
                  >
                    Technical Specifications
                  </button>
                  <button
                    onClick={() => setActiveTab("details")}
                    className={"px-5 py-3 font-medium transition-all duration-200 border-b-2 " + (
                      activeTab === "details"
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    )}
                  >
                    Product Details
                  </button>
                  <button
                    onClick={() => setActiveTab("reviews")}
                    className={"px-5 py-3 font-medium transition-all duration-200 border-b-2 " + (
                      activeTab === "reviews"
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    )}
                  >
                    Reviews Management
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {/* Overview Tab */}
                {activeTab === "overview" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-gray-50 rounded-xl p-4 text-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                          <MdElectricBolt className="text-blue-600 text-xl" />
                        </div>
                        <p className="text-sm text-gray-500">Rated Power</p>
                        <p className="font-semibold text-gray-800">{product.details?.rated_power || 'N/A'}</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-4 text-center">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                          <MdSpeed className="text-green-600 text-xl" />
                        </div>
                        <p className="text-sm text-gray-500">Charging Speed</p>
                        <p className="font-semibold text-gray-800">{powerInfo.power}</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-4 text-center">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                          <MdSecurity className="text-purple-600 text-xl" />
                        </div>
                        <p className="text-sm text-gray-500">IP Rating</p>
                        <p className="font-semibold text-gray-800">{product.details?.ingress_protection || 'N/A'}</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-4 text-center">
                        <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                          <FaPlug className="text-yellow-600 text-xl" />
                        </div>
                        <p className="text-sm text-gray-500">Connector Type</p>
                        <p className="font-semibold text-gray-800">{product.details?.gun_type || 'N/A'}</p>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h3 className="font-semibold text-gray-800 mb-2">Product Highlights</h3>
                      <ul className="space-y-2">
                        {product.details?.fast_charger === 'yes' && (
                          <li className="flex items-center gap-2 text-sm text-gray-600">
                            <FiCheckCircle className="text-green-500" />
                            Fast Charging Support
                          </li>
                        )}
                        {product.details?.display === 'Yes' && (
                          <li className="flex items-center gap-2 text-sm text-gray-600">
                            <FiCheckCircle className="text-green-500" />
                            LCD Display for real-time monitoring
                          </li>
                        )}
                        {product.details?.ocpp_present === 'Yes' && (
                          <li className="flex items-center gap-2 text-sm text-gray-600">
                            <FiCheckCircle className="text-green-500" />
                            OCPP Compliant for smart charging
                          </li>
                        )}
                        <li className="flex items-center gap-2 text-sm text-gray-600">
                          <FiCheckCircle className="text-green-500" />
                          {product.details?.protection || 'Multiple'} protection features
                        </li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* Specifications Tab */}
                {activeTab === "specifications" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {product.details && Object.entries(product.details).map(([key, value]) => {
                      if (value && value.trim() !== "" && key !== 'additional_details') {
                        const labels = {
                          rated_power: 'Rated Power',
                          input_voltage: 'Input Voltage',
                          ouput_voltage: 'Output Voltage',
                          current: 'Current Rating',
                          phase: 'Phase',
                          frequency: 'Frequency',
                          protection: 'Protection Features',
                          dimensions: 'Dimensions',
                          gun_type: 'Gun Type',
                          gun_details: 'Gun Details',
                          material: 'Material',
                          cooling: 'Cooling Type',
                          ingress_protection: 'IP Rating',
                          cable_length: 'Cable Length',
                          mountingtype: 'Mounting Type',
                          operatingtemps: 'Operating Temperature',
                          communication: 'Communication Protocol',
                          fast_charger: 'Fast Charger',
                          display: 'Display',
                          push_button: 'Push Button',
                          chargingoperation: 'Charging Operation',
                          safetyregulation: 'Safety Regulation',
                          ocpp_present: 'OCPP Support'
                        };
                        
                        return (
                          <div key={key} className="bg-gray-50 rounded-xl p-3">
                            <p className="text-xs text-gray-500 mb-1">{labels[key] || key.replace(/_/g, ' ')}</p>
                            <p className="text-sm font-medium text-gray-800">{value}</p>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                )}

                {/* Details Tab */}
                {activeTab === "details" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 rounded-xl p-3">
                        <p className="text-xs text-gray-500">Product Name</p>
                        <p className="text-sm font-medium text-gray-800">{product.name}</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3">
                        <p className="text-xs text-gray-500">Model Number</p>
                        <p className="text-sm font-medium text-gray-800">{product.model}</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3">
                        <p className="text-xs text-gray-500">Color</p>
                        <p className="text-sm font-medium text-gray-800">{product.product_color || 'N/A'}</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3">
                        <p className="text-xs text-gray-500">Added On</p>
                        <p className="text-sm font-medium text-gray-800">{new Date(product.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    {product.details?.additional_details && (
                      <div className="bg-gray-50 rounded-xl p-4">
                        <h3 className="font-semibold text-gray-800 mb-2">Additional Information</h3>
                        <p className="text-sm text-gray-600">{product.details.additional_details}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Reviews Management Tab - Admin can see ALL reviews */}
                {activeTab === "reviews" && (
                  <div className="space-y-6">
                    {/* Admin Stats Card - Shows all reviews (visible + hidden) */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6">
                      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <MdVisibility className="text-blue-600" />
                        Admin Review Overview
                      </h3>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-gray-800">{filterStats.total}</p>
                          <p className="text-xs text-gray-500">Total Reviews</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-green-600">{filterStats.visible}</p>
                          <p className="text-xs text-gray-500">Visible to Customers</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-red-600">{filterStats.hidden}</p>
                          <p className="text-xs text-gray-500">Hidden from Customers</p>
                        </div>
                      </div>
                    </div>

                    {/* Rating Summary - Only visible reviews count for public display */}
                    {reviewSummary && (
                      <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-2xl p-6">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Public Average Rating (Visible Reviews Only)</p>
                            <div className="flex items-center gap-2">
                              <span className="text-4xl font-bold text-gray-800">{reviewSummary.average_rating || 0}</span>
                              {renderStars(reviewSummary.average_rating || 0, "text-xl")}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-600 mb-1">Public Review Count</p>
                            <p className="text-3xl font-bold text-gray-800">{reviewSummary.review_count || 0}</p>
                          </div>
                          <button
                            onClick={() => {
                              fetchReviewSummary(id);
                              fetchAllReviews(id, reviewsLimit);
                            }}
                            className="px-4 py-2 bg-white rounded-lg text-gray-600 hover:bg-gray-50 transition flex items-center gap-2"
                          >
                            <FiRefreshCw size={14} />
                            Refresh
                          </button>
                        </div>
                        
                        {/* Rating Breakdown */}
                        {reviewSummary.rating_breakdown && (
                          <div className="mt-4 pt-4 border-t border-amber-200">
                            {[5, 4, 3, 2, 1].map(star => (
                              <div key={star} className="flex items-center gap-3 mb-2">
                                <span className="text-sm w-8">{star} ★</span>
                                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-yellow-400 rounded-full" 
                                    style={{ 
                                      width: ((reviewSummary.rating_breakdown[star] / reviewSummary.review_count) * 100 || 0) + "%" 
                                    }} 
                                  />
                                </div>
                                <span className="text-xs text-gray-500 w-8">{reviewSummary.rating_breakdown[star] || 0}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Filter Tabs for Admin */}
                    <div className="flex gap-3 border-b border-gray-200 pb-3">
                      <button
                        onClick={() => setFilterVisibility("all")}
                        className={"px-4 py-2 rounded-lg font-medium transition-all duration-200 " + (
                          filterVisibility === "all"
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        )}
                      >
                        All Reviews ({filterStats.total})
                      </button>
                      <button
                        onClick={() => setFilterVisibility("visible")}
                        className={"px-4 py-2 rounded-lg font-medium transition-all duration-200 " + (
                          filterVisibility === "visible"
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        )}
                      >
                        <FiEye className="inline mr-1" size={14} />
                        Visible ({filterStats.visible})
                      </button>
                      <button
                        onClick={() => setFilterVisibility("hidden")}
                        className={"px-4 py-2 rounded-lg font-medium transition-all duration-200 " + (
                          filterVisibility === "hidden"
                            ? 'bg-red-500 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        )}
                      >
                        <FiEyeOff className="inline mr-1" size={14} />
                        Hidden ({filterStats.hidden})
                      </button>
                    </div>

                    {/* Reviews List - Admin sees ALL reviews */}
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <FaThumbsUp className="text-yellow-500" />
                        {filterVisibility === "all" && "All Customer Reviews"}
                        {filterVisibility === "visible" && "Visible Reviews (Customers can see)"}
                        {filterVisibility === "hidden" && "Hidden Reviews (Customers cannot see)"}
                      </h3>
                      
                      {loadingReviews ? (
                        <div className="flex justify-center py-12">
                          <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-400 border-t-transparent"></div>
                        </div>
                      ) : filteredReviews.length > 0 ? (
                        <div className="space-y-4">
                          {filteredReviews.map((review) => (
                            <div key={review.id} className={"rounded-xl p-5 border transition-all duration-300 " + (
                              review.is_visible 
                                ? 'bg-green-50 border-green-200 hover:shadow-md' 
                                : 'bg-red-50 border-red-200 hover:shadow-md'
                            )}>
                              <div className="flex items-start justify-between mb-3 flex-wrap gap-2">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                                    {review.user_name?.charAt(0).toUpperCase() || "U"}
                                  </div>
                                  <div>
                                    <p className="font-semibold text-gray-800">{review.user_name || "Anonymous User"}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                      {renderStars(review.rating, "text-sm")}
                                      {review.verified_purchase && (
                                        <span className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                                          <FaThumbsUp size={10} /> Verified Purchase
                                        </span>
                                      )}
                                      <span className={"text-xs px-2 py-0.5 rounded-full font-semibold " + (
                                        review.is_visible 
                                          ? 'bg-green-200 text-green-700' 
                                          : 'bg-red-200 text-red-700'
                                      )}>
                                        {review.is_visible ? 'Visible to Customers' : 'Hidden from Customers'}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="flex items-center gap-1 text-xs text-gray-400">
                                    <FaCalendarAlt size={10} />
                                    <span>{new Date(review.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                                  </div>
                                  <div className="flex gap-2">
                                    {/* Toggle Visibility Button */}
                                    <button
                                      onClick={() => handleToggleVisibility(review.id, review.is_visible)}
                                      disabled={updatingVisibilityId === review.id}
                                      className={"p-1.5 rounded-lg transition " + (
                                        review.is_visible 
                                          ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200' 
                                          : 'bg-green-100 text-green-600 hover:bg-green-200'
                                      )}
                                      title={review.is_visible ? "Hide from customers" : "Show to customers"}
                                    >
                                      {updatingVisibilityId === review.id ? (
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></div>
                                      ) : review.is_visible ? (
                                        <FiEyeOff size={14} />
                                      ) : (
                                        <FiEye size={14} />
                                      )}
                                    </button>
                                    {/* Delete Button */}
                                    <button
                                      onClick={() => handleDeleteReview(review.id)}
                                      disabled={deletingReviewId === review.id}
                                      className="p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                                      title="Delete Review"
                                    >
                                      {deletingReviewId === review.id ? (
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-600 border-t-transparent"></div>
                                      ) : (
                                        <MdDelete size={14} />
                                      )}
                                    </button>
                                  </div>
                                </div>
                              </div>
                              {review.review && (
                                <p className="text-gray-700 leading-relaxed mt-3 pl-12">{review.review}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12 bg-gray-50 rounded-xl">
                          <div className="text-6xl mb-3">📝</div>
                          <p className="text-gray-500">No reviews found</p>
                          <p className="text-sm text-gray-400 mt-1">
                            {filterVisibility === "all" && "No reviews available for this product"}
                            {filterVisibility === "visible" && "No visible reviews found"}
                            {filterVisibility === "hidden" && "No hidden reviews found"}
                          </p>
                        </div>
                      )}

                      {/* Load More Button */}
                      {hasMoreReviews && (
                        <button
                          onClick={loadMoreReviews}
                          className="mt-6 w-full py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                        >
                          Load More Reviews
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ProductViewPage;