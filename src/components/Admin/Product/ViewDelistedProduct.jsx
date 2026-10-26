// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import AdminNavbar from '../Admin_navbar';
// import AdminSidebar from '../Admin_sidebar';
// import backgroundImage from '../../../assets/workplace.jpg';

// const BASE_URL_AND_PORT = 'https://api.static.ev.transev.site';
// const API_KEY = 'mlzuMoRFjdGhcFulLMaVtfwNAHycbBAf';

// const DelistedProductViewPage = () => {
//   const [delistedProducts, setDelistedProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [currentImageIndex, setCurrentImageIndex] = useState({});
//   const [sidebarOpen, setSidebarOpen] = useState(true);

//   const toggleSidebar = () => {
//     setSidebarOpen(!sidebarOpen);
//   };

//   useEffect(() => {
//     const fetchDelistedProducts = async () => {
//       const authToken = localStorage.getItem('auth_token');
//       try {
//         const response = await axios.get(
//           `${BASE_URL_AND_PORT}/products/admin/get-delisted/${(currentPage - 1) * 50 + 1}-${currentPage * 50}`,
//           {
//             headers: {
//               Authorization: `Bearer ${authToken}`,
//               'API-KEY': API_KEY,
//             },
//           }
//         );
//         setDelistedProducts(response.data.products);
//         setLoading(false);
//       } catch (error) {
//         console.error('Error fetching delisted products:', error);
//         setLoading(false);
//       }
//     };

//     fetchDelistedProducts();
//   }, [currentPage]);

//   const handleNextImage = (productId) => {
//     setCurrentImageIndex((prev) => {
//       const currentIndex = prev[productId] || 0;
//       const nextIndex =
//         (currentIndex + 1) % delistedProducts.find((product) => product.id === productId).image_paths.length;
//       return { ...prev, [productId]: nextIndex };
//     });
//   };

//   const handlePrevImage = (productId) => {
//     setCurrentImageIndex((prev) => {
//       const currentIndex = prev[productId] || 0;
//       const prevIndex =
//         (currentIndex - 1 + delistedProducts.find((product) => product.id === productId).image_paths.length) %
//         delistedProducts.find((product) => product.id === productId).image_paths.length;
//       return { ...prev, [productId]: prevIndex };
//     });
//   };

//   if (loading) return <div className="text-center mt-10">Loading delisted products...</div>;

//   return (
//     <div
//       className="min-h-screen bg-cover bg-center bg-fixed bg-teal-50"
//       // style={{ backgroundImage: `url(${backgroundImage})` }}
//     >
//       <AdminNavbar onToggleSidebar={toggleSidebar} />
//       <div className="flex flex-col md:flex-row">
//         {/* Sidebar */}
//         <div className={`${sidebarOpen ? 'block' : 'hidden'} md:block md:w-64`}>
//           <AdminSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
//         </div>

//         {/* Main content */}
//         {/* <div className="flex-1 p-4 sm:p-6 md:p-8 bg-white bg-opacity-90 mt-4 md:mt-8 rounded shadow-md w-full"> */}
  
//  <div className="flex-1 p-4 sm:p-6 md:p-8 mt-4 sm:mt-6 md:mt-8 bg-white bg-opacity-90 rounded-2xl shadow-md w-full max-w-full sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl mx-auto">
  
 

  


//           <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 text-center md:text-left">
//             Delisted Products
//           </h2>

//           {delistedProducts.length === 0 ? (
//             <p className="text-center text-gray-700">No delisted products found.</p>
//           ) : (
//             <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//               {delistedProducts.map((product) => (
//                 <div
//                   key={product.id}
//                   // className="border rounded-lg p-4 shadow-md bg-gray-50 hover:shadow-lg transition-shadow duration-200 w-200"
//                   className="border rounded-xl p-4 shadow-md bg-gray-50 hover:shadow-lg transition-shadow duration-200 w-full sm:w-auto max-w-full sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto">
 

               
//                   <div className="relative w-full max-w-xl mx-auto aspect-[4/3] bg-gray-200 mb-4 overflow-hidden rounded">
//                     {product.image_paths?.length > 1 ? (
//                       <>
//                         <img
//                           src={product.image_paths[currentImageIndex[product.id] || 0]}
//                           alt={product.name}
//                           className="w-full h-full object-cover"
//                           onError={(e) => {
//                             e.target.onerror = null;
//                             e.target.src = 'https://via.placeholder.com/300';
//                           }}
//                         />
//                         <button
//                           className="absolute top-1/2 left-2 transform -translate-y-1/2 text-white bg-gray-800 bg-opacity-50 p-2 rounded-full"
//                           onClick={() => handlePrevImage(product.id)}
//                         >
//                           &#10094;
//                         </button>
//                         <button
//                           className="absolute top-1/2 right-2 transform -translate-y-1/2 text-white bg-gray-800 bg-opacity-50 p-2 rounded-full"
//                           onClick={() => handleNextImage(product.id)}
//                         >
//                           &#10095;
//                         </button>
//                       </>
//                     ) : (
//                       <img
//                         src={product.image_paths?.[0] || 'https://via.placeholder.com/300'}
//                         alt={product.name}
//                         className="w-full h-full object-cover"
//                         onError={(e) => {
//                           e.target.onerror = null;
//                           e.target.src = 'https://via.placeholder.com/300';
//                         }}
//                       />
//                     )}
//                   </div>
//                   <h1 className="text-3xl font-semibold mb-4">{product.name}</h1>
//                   <p className="text-xl text-gray-600 mb-4">Model: {product.model}</p>
//                   <p className="text-lg text-gray-700 mb-4">Price: ₹{product.price}</p>
//                   {/* <p className="text-lg text-gray-700 mb-4">Quantity: {product.quantity}</p> */}

//                   {/* Table Format for Product Details */}
//                   <table className="w-full table-auto">
//                     <tbody>
//                       <tr>
//                         <td className="font-semibold">Phase</td>
//                         <td>{product.details.phase}</td>
//                       </tr>
//                       <tr>
//                         <td className="font-semibold">Cooling</td>
//                         <td>{product.details.cooling}</td>
//                       </tr>
//                       <tr>
//                         <td className="font-semibold">Current</td>
//                         <td>{product.details.current}</td>
//                       </tr>
//                       <tr>
//                         <td className="font-semibold">Display</td>
//                         <td>{product.details.display}</td>
//                       </tr>
//                       <tr>
//                         <td className="font-semibold">Gun Type</td>
//                         <td>{product.details.gun_type}</td>
//                       </tr>
//                       <tr>
//                         <td className="font-semibold">Material</td>
//                         <td>{product.details.material}</td>
//                       </tr>
//                       <tr>
//                         <td className="font-semibold">Frequency</td>
//                         <td>{product.details.frequency}</td>
//                       </tr>
//                       <tr>
//                         <td className="font-semibold">Dimensions </td>
//                         <td>{product.details.dimensions}</td>
//                       </tr>
//                       <tr>
//                         <td className="font-semibold">Protection</td>
//                         <td>{product.details.protection}</td>
//                       </tr>
//                       <tr>
//                         <td className="font-semibold">Push Button</td>
//                         <td>{product.details.push_button}</td>
//                       </tr>
//                       <tr>
//                         <td className="font-semibold">Rated Power</td>
//                         <td>{product.details.rated_power}</td>
//                       </tr>
//                       <tr>
//                         <td className="font-semibold">Cable Length</td>
//                         <td>{product.details.cable_length}</td>
//                       </tr>
//                       <tr>
//                         <td className="font-semibold">Mounting Type </td>
//                         <td>{product.details.mountingtype}</td>
//                       </tr>
//                       <tr>
//                         <td className="font-semibold">Output Voltage </td>
//                         <td>{product.details.ouput_voltage}</td>
//                       </tr>
//                       <tr>
//                         <td className="font-semibold">Operating Temps</td>
//                         <td>{product.details.operatingtemps}</td>
//                       </tr>
//                       <tr>
//                         <td className="font-semibold">Safety Regulation</td>
//                         <td>{product.details.safetyregulation}</td>
//                       </tr>
//                       <tr>
//                         <td className="font-semibold">Charging Operation</td>
//                         <td>{product.details.chargingoperation}</td>
//                       </tr>
//                       <tr>
//                         <td className="font-semibold">Ingress Protection</td>
//                         <td>{product.details.ingress_protection}</td>
//                       </tr>
//                     </tbody>
//                   </table>
//                 </div>
//               ))}
//             </div>
//           )}

//           {/* Pagination */}
//           <div className="flex justify-center items-center gap-4 mt-10">
//             <button
//               onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//               className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
//               disabled={currentPage === 1}
//             >
//               Previous
//             </button>
//             <span className="text-lg font-medium text-gray-800">Page {currentPage}</span>
//             <button
//               onClick={() => setCurrentPage((prev) => prev + 1)}
//               className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
//             >
//               Next
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DelistedProductViewPage;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import AdminNavbar from '../Admin_navbar';
import AdminSidebar from "../Admin_sidebar";
import { FiArrowLeft, FiEdit2, FiArrowUp, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { MdElectricBolt, MdSpeed, MdVerified, MdSecurity, MdStar, MdStarHalf, MdStarBorder } from "react-icons/md";
import { TbCurrencyRupee } from "react-icons/tb";
import { FaChargingStation, FaBolt } from "react-icons/fa";

const BASE_URL_AND_PORT = 'https://api.static.ev.transev.site';
const API_KEY = 'mlzuMoRFjdGhcFulLMaVtfwNAHycbBAf';

const DelistedProductViewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [imageIndex, setImageIndex] = useState(0);
  const [relisting, setRelisting] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Fetch single delisted product by ID - Fetch all delisted products and find by ID
  useEffect(() => {
    const fetchDelistedProduct = async () => {
      const authToken = localStorage.getItem('auth_token');
      setLoading(true);
      try {
        // Fetch all delisted products (1-100 range to get the specific product)
        const response = await axios.get(
          `${BASE_URL_AND_PORT}/products/admin/get-delisted/1-100`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
              'API-KEY': API_KEY,
            },
          }
        );
        
        // Extract products array from response
        let productsData = [];
        if (response.data && response.data.products && Array.isArray(response.data.products)) {
          productsData = response.data.products;
        } else if (response.data && Array.isArray(response.data)) {
          productsData = response.data;
        } else {
          productsData = [];
        }
        
        // Find the specific product by ID
        const foundProduct = productsData.find(p => p.id === id);
        
        if (foundProduct) {
          setProduct(foundProduct);
          setError(null);
        } else {
          setError('Product not found in delisted products');
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching delisted product:', error);
        setError('Failed to load product details. Please try again.');
        setLoading(false);
      }
    };

    if (id) {
      fetchDelistedProduct();
    }
  }, [id]);

  const handleNextImage = () => {
    if (product?.image_paths?.length > 1) {
      setImageIndex((prev) => (prev + 1) % product.image_paths.length);
    }
  };

  const handlePrevImage = () => {
    if (product?.image_paths?.length > 1) {
      setImageIndex((prev) => (prev - 1 + product.image_paths.length) % product.image_paths.length);
    }
  };

  // Handle relist product
  const handleRelist = async () => {
    setRelisting(true);
    const authToken = localStorage.getItem('auth_token');
    try {
      const response = await axios.put(
        `${BASE_URL_AND_PORT}/products/toggle-listing`,
        { product_id: product.id },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            'API-KEY': API_KEY,
          },
        }
      );
      if (response.status === 200) {
        showToast('Product relisted successfully!', 'success');
        setTimeout(() => {
          navigate('/delisted-products');
        }, 1500);
      }
    } catch (error) {
      console.error('Error relisting product:', error);
      showToast('Failed to relist product', 'error');
    } finally {
      setRelisting(false);
    }
  };

  const getChargerPower = () => {
    if (!product) return { power: "Standard", badge: "bg-gray-100 text-gray-700", icon: "🔌" };
    const name = product.name?.toUpperCase() || "";
    const power = product.details?.rated_power || "";
    
    if (name.includes("120KW") || power.includes("120")) 
      return { power: "120kW Ultra Fast", badge: "bg-red-100 text-red-700", icon: "🔥" };
    if (name.includes("60KW") || power.includes("60")) 
      return { power: "60kW Fast Charger", badge: "bg-purple-100 text-purple-700", icon: "⚡" };
    if (name.includes("30KW") || power.includes("30")) 
      return { power: "30kW DC", badge: "bg-blue-100 text-blue-700", icon: "🔌" };
    if (name.includes("22KW") || power.includes("22")) 
      return { power: "22kW AC", badge: "bg-green-100 text-green-700", icon: "🔌" };
    return { power: "AC Charger", badge: "bg-green-100 text-green-700", icon: "🔌" };
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    for (let i = 0; i < fullStars; i++) stars.push(<MdStar key={i} className="text-yellow-400 text-sm" />);
    if (hasHalfStar) stars.push(<MdStarHalf key="half" className="text-yellow-400 text-sm" />);
    while (stars.length < 5) stars.push(<MdStarBorder key={stars.length} className="text-yellow-400 text-sm" />);
    return stars;
  };
const handleProductEdit = (id) => {
    navigate(`/admin/product/edit/${id}`);
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <AdminNavbar onToggleSidebar={toggleSidebar} />
        <div className="flex">
          <AdminSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
          <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'lg:ml-72' : 'lg:ml-24'}`}>
            <div className="flex justify-center items-center h-96">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-red-500 mx-auto mb-4"></div>
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <AdminNavbar onToggleSidebar={toggleSidebar} />
        <div className="flex">
          <AdminSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
          <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'lg:ml-72' : 'lg:ml-24'}`}>
            <div className="flex justify-center items-center h-96">
              <div className="text-center">
                <div className="text-6xl mb-4">😞</div>
                <p className="text-red-500 text-lg">{error || "Product not found."}</p>
                <button
                  onClick={() => navigate('/delisted-products')}
                  className="mt-4 bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition"
                >
                  Back to Delisted Products
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const powerInfo = getChargerPower();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <AdminNavbar onToggleSidebar={toggleSidebar} />
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed top-20 right-4 z-50 animate-slideIn ${
          toastMessage.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white px-6 py-3 rounded-lg shadow-lg`}>
          {toastMessage.message}
        </div>
      )}

      <div className="flex">
        <AdminSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        
        <main className={`flex-1 transition-all duration-300 p-4 md:p-6 lg:p-8 ${sidebarOpen ? 'lg:ml-72' : 'lg:ml-24'}`}>
          <div className="max-w-6xl mx-auto">
            {/* Back Button */}
            <button 
              onClick={() => navigate('/admin/delisted-products')} 
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
            >
              <FiArrowLeft /> Back to Delisted Products
            </button>

            {/* Product Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              {/* Header */}
              <div className="p-6 border-b bg-gradient-to-r from-red-50 to-orange-50">
                <div className="flex flex-wrap justify-between items-start gap-4">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{product.name}</h1>
                    <p className="text-gray-500 mt-1">Model: {product.model}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${powerInfo.badge}`}>
                    {powerInfo.icon} {powerInfo.power}
                  </span>
                </div>
              </div>

              <div className="p-6">
                {/* Image and Price Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Image Gallery */}
                  <div>
                    <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden aspect-square">
                      <img 
                        src={product.image_paths?.[imageIndex] || 'https://via.placeholder.com/500'} 
                        alt={product.name} 
                        className="w-full h-full object-contain p-4"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/500';
                        }}
                      />
                      {product.image_paths?.length > 1 && (
                        <>
                          <button 
                            onClick={handlePrevImage} 
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white hover:bg-black/70 transition"
                          >
                            <FiChevronLeft size={20} />
                          </button>
                          <button 
                            onClick={handleNextImage} 
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white hover:bg-black/70 transition"
                          >
                            <FiChevronRight size={20} />
                          </button>
                        </>
                      )}
                    </div>
                    
                    {/* Thumbnails */}
                    {product.image_paths?.length > 1 && (
                      <div className="flex justify-center gap-2 mt-4">
                        {product.image_paths.map((img, idx) => (
                          <button
                            key={idx}
                            onClick={() => setImageIndex(idx)}
                            className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                              imageIndex === idx ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-200 hover:border-gray-400'
                            }`}
                          >
                            <img 
                              src={img} 
                              alt={`Thumb ${idx + 1}`} 
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://via.placeholder.com/60';
                              }}
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="space-y-6">
                    {/* Price Card */}
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4">
                      <div className="flex items-baseline gap-2">
                        {product.mrp > product.price && (
                          <span className="text-lg text-gray-400 line-through">₹{product.mrp?.toLocaleString()}</span>
                        )}
                        <span className="text-3xl font-bold text-red-600">₹{product.price?.toLocaleString()}</span>
                      </div>
                      {product.mrp > product.price && (
                        <div className="mt-1">
                          <span className="text-sm text-green-600">
                            Save ₹{(product.mrp - product.price).toLocaleString()} ({Math.round((product.mrp - product.price) / product.mrp * 100)}% off)
                          </span>
                        </div>
                      )}
                      <div className="mt-2 flex items-center gap-2">
                        {renderStars(4.5)}
                        <span className="text-sm text-gray-500">(128 reviews)</span>
                      </div>
                    </div>

                    {/* Stock Status */}
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Stock Status</span>
                        <span className="font-semibold text-gray-800">{product.quantity || 0} units available</span>
                      </div>
                    </div>

                    {/* Warning Card */}
                    <div className="bg-red-50 rounded-xl p-4 text-center border border-red-200">
                      <p className="text-red-700 font-semibold">
                        ⚠️ This product is currently DELISTED and not visible to customers.
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-4">
                      {/* <button 
                        onClick={() => navigate(`/admin/product/edit/${product.id}`)} 
                        className="flex items-center justify-center gap-2 bg-yellow-500 text-white py-2.5 rounded-lg font-medium hover:bg-yellow-600 transition"
                      >
                        <FiEdit2 size={16} /> Edit Product
                      </button> */}
                      <button 
                        onClick={handleRelist}
                        disabled={relisting}
                        className="flex items-center justify-center gap-2 bg-green-500 text-white py-2.5 rounded-lg font-medium hover:bg-green-600 transition disabled:opacity-50"
                      >
                        {relisting ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        ) : (
                          <><FiArrowUp size={16} /> Relist Product</>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Technical Specifications */}
                <div className="mt-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <MdElectricBolt className="text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800">Technical Specifications</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {product.details && Object.entries(product.details).map(([key, value]) => {
                      if (value && value !== "" && key !== 'additional_details') {
                        const labels = {
                          rated_power: 'Rated Power',
                          input_voltage: 'Input Voltage',
                          ouput_voltage: 'Output Voltage',
                          current: 'Current Rating',
                          phase: 'Phase',
                          frequency: 'Frequency',
                          protection: 'Protection',
                          dimensions: 'Dimensions',
                          gun_type: 'Gun Type',
                          gun_details: 'Gun Details',
                          material: 'Material',
                          cooling: 'Cooling',
                          ingress_protection: 'IP Rating',
                          cable_length: 'Cable Length',
                          mountingtype: 'Mounting Type',
                          operatingtemps: 'Operating Temp',
                          communication: 'Communication',
                          fast_charger: 'Fast Charger',
                          display: 'Display',
                          push_button: 'Push Button',
                          chargingoperation: 'Charging Operation',
                          safetyregulation: 'Safety Regulation',
                          ocpp_present: 'OCPP Support'
                        };
                        return (
                          <div key={key} className="bg-gray-50 rounded-lg p-3">
                            <p className="text-xs text-gray-500 mb-1">{labels[key] || key.replace(/_/g, ' ')}</p>
                            <p className="text-sm font-medium text-gray-800">{value}</p>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                  
                  {product.details?.additional_details && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-gray-800 mb-1">Additional Information</h4>
                      <p className="text-gray-600">{product.details.additional_details}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default DelistedProductViewPage;