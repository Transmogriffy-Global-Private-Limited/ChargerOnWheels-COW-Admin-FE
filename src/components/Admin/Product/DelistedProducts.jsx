// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import backgroundImage from '../../../assets/workplace.jpg';
// import AdminNavbar from '../Admin_navbar';
// import AdminSidebar from "../Admin_sidebar";

// const BASE_URL_AND_PORT = 'https://api.static.ev.transev.site';
// const API_KEY = 'mlzuMoRFjdGhcFulLMaVtfwNAHycbBAf';

// const DelistedProductsPage = () => {
//   const navigate = useNavigate();

//   const [delistedProducts, setDelistedProducts] = useState([]);
//   const [allDelistedProducts, setAllDelistedProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [searchResults, setSearchResults] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [imageIndexes, setImageIndexes] = useState({});

//   useEffect(() => {
//     const fetchDelistedProducts = async () => {
//       const authToken = localStorage.getItem('auth_token');
//       try {
//         const response = await axios.get(
//           `${BASE_URL_AND_PORT}/products/admin/get-delisted/${(currentPage - 1) * 50 + 1}-${currentPage * 50}`,
//           {
//             headers: {
//               'Authorization': `Bearer ${authToken}`,
//               'API-KEY': API_KEY,
//             },
//           }
//         );
//         setDelistedProducts(response.data.products);
//         setAllDelistedProducts(response.data.products);
//         setLoading(false);
//       } catch (error) {
//         console.error('Error fetching delisted products:', error);
//         setLoading(false);
//       }
//     };

//     fetchDelistedProducts();
//   }, [currentPage]);

//   const handleSeeAll = () => {
//     setDelistedProducts(allDelistedProducts);
//   };

//   const handleNextImage = (productId) => {
//     setImageIndexes((prev) => {
//       const currentIndex = prev[productId] || 0;
//       const nextIndex = (currentIndex + 1) % delistedProducts.find(product => product.id === productId).image_paths.length;
//       return { ...prev, [productId]: nextIndex };
//     });
//   };

//   const handlePrevImage = (productId) => {
//     setImageIndexes((prev) => {
//       const currentIndex = prev[productId] || 0;
//       const prevIndex = (currentIndex - 1 + delistedProducts.find(product => product.id === productId).image_paths.length) % delistedProducts.find(product => product.id === productId).image_paths.length;
//       return { ...prev, [productId]: prevIndex };
//     });
//   };

//   const handleSearch = async (event) => {
//     event.preventDefault();
//     const authToken = localStorage.getItem('auth_token');
//     try {
//       const response = await axios.post(
//         `${BASE_URL_AND_PORT}/products/search`,
//         { query: searchQuery, limit: '1-100' },
//         {
//           headers: {
//             'Authorization': `Bearer ${authToken}`,
//             'API-KEY': API_KEY,
//           },
//         }
//       );
//       setSearchResults(response.data.products);
//     } catch (error) {
//       console.error('Error searching delisted products:', error);
//     }
//   };

//   const handleProductView = (id) => {
//     navigate(`/admin/delistproduct/view/${id}`);
//   };

//   const handleProductEdit = (id) => {
//     navigate(`/admin/product/edit/${id}`);
//   };

//   const handleToggleListing = async (productId) => {
//     const authToken = localStorage.getItem('auth_token');
//     try {
//       const response = await axios.put(
//         `${BASE_URL_AND_PORT}/products/toggle-listing`,
//         { product_id: productId },
//         {
//           headers: {
//             'Authorization': `Bearer ${authToken}`,
//             'API-KEY': API_KEY,
//           },
//         }
//       );
//       if (response.status === 200) {
//         const updatedProducts = delistedProducts.map((product) =>
//           product.id === productId
//             ? { ...product, is_listed: !product.is_listed }
//             : product
//         );
//         setDelistedProducts(updatedProducts);
//       }
//     } catch (error) {
//       console.error('Error toggling product listing:', error);
//     }
//   };

//   const toggleSidebar = () => {
//     setSidebarOpen(!sidebarOpen);
//   };

//   return (
//     <div
//       className="min-h-screen bg-gradient-to-r from-white-400 via-green-50 to-white-700 bg-cover bg-center bg-fixed"
//       // style={{ backgroundImage: `url(${backgroundImage})` }}
//     >
//       <AdminNavbar onToggleSidebar={toggleSidebar} />

//       <div className="flex flex-1">
//         <AdminSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

//         <div className="flex flex-1 justify-center items-center p-6">
//           <div className=" bg-white rounded-lg shadow-lg p-6 w-full md:w-4/5 lg:w-3/5">
//             <h2 className="text-3xl font-bold text-center mb-6">Delisted Products</h2>

//             {/* Search Bar */}
//             <div className="flex justify-center mb-4">
//               <form onSubmit={handleSearch} className="flex space-x-2">
//                 <input
//                   type="text"
//                   className="px-4 py-2 border border-gray-300 rounded-md w-full max-w-md"
//                   placeholder="Search Delisted Products"
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                 />
//                 <button
//                   type="submit"
//                   className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
//                 >
//                   Search
//                 </button>
//               </form>
//             </div>

//             {/* Search Results */}
//             {searchQuery && searchResults.length > 0 && (
//               <div className="mb-6">
//                 <h3 className="text-2xl font-semibold">Search Results</h3>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//                   {searchResults.map((product) => (
//                     <div key={product.id} className="bg-white border rounded-lg p-4 shadow-md">
//                       <div className="w-full h-40 bg-gray-200 mb-4">
//                         <img
//                           src={product.image_paths?.[0] || 'https://via.placeholder.com/150'}
//                           alt={product.name}
//                           className="w-full h-full object-cover rounded-lg"
//                           onError={(e) => {
//                             e.target.onerror = null;
//                             e.target.src = 'https://via.placeholder.com/150';
//                           }}
//                         />
//                       </div>
//                       <h3 className="text-xl font-semibold">{product.name}</h3>
//                       <p className="text-gray-600">{product.model}</p>
//                       <p className="text-gray-700 mt-2">₹{product.price}</p>
//                       <div className="flex justify-between mt-4">
//                         <button
//                           onClick={() => handleProductView(product.id)}
//                           className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
//                         >
//                           View
//                         </button>
//                         {!product.is_listed && (
//                           <button
//                             onClick={() => handleToggleListing(product.id)}
//                             className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
//                           >
//                             Listing
//                           </button>
//                         )}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Main Product Display */}
//             {loading ? (
//               <div className="text-center">Loading delisted products...</div>
//             ) : (
//               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//                 {delistedProducts.map((product) => (
//                   <div key={product.id} className="bg-white border rounded-lg p-4 shadow-md cursor-pointer">
//                     {/* Image Slider Section */}
//                     <div className="relative w-full h-[190px] bg-gray-200 mb-6">
//                       {product.image_paths?.length > 1 ? (
//                         <>
//                           <img
//                             src={product.image_paths[imageIndexes[product.id] || 0]}
//                             alt={product.name}
//                             className="w-full h-full object-cover rounded-lg"
//                             onError={(e) => {
//                               e.target.onerror = null;
//                               e.target.src = 'https://via.placeholder.com/500';
//                             }}
//                           />
//                           <button
//                             className="absolute top-1/2 left-2 transform -translate-y-1/2 text-white bg-gray-800 bg-opacity-50 p-2 rounded-full"
//                             onClick={() => handlePrevImage(product.id)}
//                           >
//                             &#10094;
//                           </button>
//                           <button
//                             className="absolute top-1/2 right-2 transform -translate-y-1/2 text-white bg-gray-800 bg-opacity-50 p-2 rounded-full"
//                             onClick={() => handleNextImage(product.id)}
//                           >
//                             &#10095;
//                           </button>
//                         </>
//                       ) : (
//                         <img
//                           src={product.image_paths?.[0] || 'https://via.placeholder.com/500'}
//                           alt={product.name}
//                           className="w-full h-full object-cover rounded-lg"
//                           onError={(e) => {
//                             e.target.onerror = null;
//                             e.target.src = 'https://via.placeholder.com/500';
//                           }}
//                         />
//                       )}
//                     </div>
//                     <h3 className="text-xl font-semibold">{product.name}</h3>
//                     <p className="text-gray-600">{product.model}</p>
//                     <p className="text-gray-700 mt-2">₹{product.price}</p>
//                     <div className="flex justify-between mt-4">
//                       <button
//                         onClick={() => handleProductView(product.id)}
//                         className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
//                       >
//                         View
//                       </button>
//                       {!product.is_listed && (
//                         <button
//                           onClick={() => handleToggleListing(product.id)}
//                           className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
//                         >
//                           Listing
//                         </button>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}

//             {/* See All Button */}
//             {delistedProducts.length < allDelistedProducts.length && (
//               <div className="flex justify-center mt-6">
//                 <button
//                   onClick={handleSeeAll}
//                   className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition duration-300"
//                 >
//                   See All Delisted Products
//                 </button>
//               </div>
//             )}

//             {/* Pagination */}
//             <div className="flex justify-center mt-6">
//               <button
//                 onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
//                 className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
//               >
//                 Previous
//               </button>
//               <button
//                 onClick={() => setCurrentPage((prev) => prev + 1)}
//                 className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 ml-4"
//               >
//                 Next
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DelistedProductsPage;


import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from '../Admin_navbar';
import AdminSidebar from "../Admin_sidebar";
import { 
  FiSearch, 
  FiEye, 
  FiEdit2, 
  FiRefreshCw,
  FiChevronLeft, 
  FiChevronRight,
  FiX,
  FiArrowUp,
  FiGrid,
  FiList,
  FiFilter,
  FiTrash2
} from "react-icons/fi";
import { 
  MdElectricBolt, 
  MdVerified, 
  MdOutlineInventory,
  MdSpeed,
  MdFlashOn
} from "react-icons/md";
import { FaBox, FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { HiOutlineViewGrid, HiOutlineViewList } from "react-icons/hi";

const BASE_URL_AND_PORT = 'https://api.static.ev.transev.site';
const API_KEY = 'mlzuMoRFjdGhcFulLMaVtfwNAHycbBAf';

const DelistedProductsPage = () => {
  const navigate = useNavigate();

  const [delistedProducts, setDelistedProducts] = useState([]);
  const [allDelistedProducts, setAllDelistedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [imageIndexes, setImageIndexes] = useState({});
  const [viewMode, setViewMode] = useState("grid");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filterType, setFilterType] = useState("ALL");
  const [totalDelisted, setTotalDelisted] = useState(0);
  const [relistingProduct, setRelistingProduct] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Fetch delisted products
  const fetchDelistedProducts = useCallback(async () => {
    const authToken = localStorage.getItem('auth_token');
    setLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL_AND_PORT}/products/admin/get-delisted/1-100`,
        {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'API-KEY': API_KEY,
          },
        }
      );
      
      // Handle different response formats - FIXED to extract products array
      let productsData = [];
      if (response.data && response.data.products && Array.isArray(response.data.products)) {
        productsData = response.data.products;
      } else if (response.data && Array.isArray(response.data)) {
        productsData = response.data;
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        productsData = response.data.data;
      } else {
        productsData = [];
      }
      
      setDelistedProducts(productsData);
      setAllDelistedProducts(productsData);
      setTotalDelisted(productsData.length);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching delisted products:', error);
      setDelistedProducts([]);
      setAllDelistedProducts([]);
      setLoading(false);
      showToast('Failed to fetch delisted products', 'error');
    }
  }, []);

  useEffect(() => {
    fetchDelistedProducts();
  }, [fetchDelistedProducts]);

  // Handle relist product
  const handleRelist = async (productId) => {
    setRelistingProduct(productId);
    const authToken = localStorage.getItem('auth_token');
    try {
      const response = await axios.put(
        `${BASE_URL_AND_PORT}/products/toggle-listing`,
        { product_id: productId },
        {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'API-KEY': API_KEY,
          },
        }
      );
      if (response.status === 200) {
        // Remove from delisted list without page refresh
        const updatedList = delistedProducts.filter(p => p.id !== productId);
        setDelistedProducts(updatedList);
        setAllDelistedProducts(updatedList);
        setTotalDelisted(updatedList.length);
        showToast('Product relisted successfully!', 'success');
      }
    } catch (error) {
      console.error('Error relisting product:', error);
      showToast('Failed to relist product', 'error');
    } finally {
      setRelistingProduct(null);
    }
  };

  // Handle search
  const handleSearch = (event) => {
    event.preventDefault();
    if (!searchQuery.trim()) {
      setDelistedProducts(allDelistedProducts);
      return;
    }
    
    const filtered = allDelistedProducts.filter(p =>
      p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.model?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setDelistedProducts(filtered);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setDelistedProducts(allDelistedProducts);
    setFilterType("ALL");
  };

  // Filter products
  useEffect(() => {
    let filtered = [...allDelistedProducts];
    
    if (filterType !== "ALL") {
      filtered = filtered.filter(p => {
        const name = p.name?.toUpperCase() || "";
        if (filterType === "AC") return name.includes("AC");
        if (filterType === "DC") return name.includes("DC");
        if (filterType === "60KW") return name.includes("60KW");
        if (filterType === "120KW") return name.includes("120KW");
        return true;
      });
    }
    
    setDelistedProducts(filtered);
  }, [filterType, allDelistedProducts]);

  // Image navigation
  const handleNextImage = (productId) => {
    setImageIndexes((prev) => {
      const currentIndex = prev[productId] || 0;
      const product = delistedProducts.find(p => p.id === productId);
      if (!product?.image_paths?.length) return prev;
      const nextIndex = (currentIndex + 1) % product.image_paths.length;
      return { ...prev, [productId]: nextIndex };
    });
  };

  const handlePrevImage = (productId) => {
    setImageIndexes((prev) => {
      const currentIndex = prev[productId] || 0;
      const product = delistedProducts.find(p => p.id === productId);
      if (!product?.image_paths?.length) return prev;
      const prevIndex = (currentIndex - 1 + product.image_paths.length) % product.image_paths.length;
      return { ...prev, [productId]: prevIndex };
    });
  };

  // Navigate to delisted product view page
  const handleProductView = (id) => {
    navigate(`/admin/delistproduct/view/${id}`);
  };
const handleProductEdit = (id) => {
    navigate(`/admin/product/edit/${id}`);
  };
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Get charger power info
  const getChargerPower = (product) => {
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

  // Render stars
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="text-yellow-400 text-xs" />);
    }
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="text-yellow-400 text-xs" />);
    }
    while (stars.length < 5) {
      stars.push(<FaRegStar key={stars.length} className="text-yellow-400 text-xs" />);
    }
    return stars;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
      <AdminNavbar onToggleSidebar={toggleSidebar} />

      <div className="flex">
        <AdminSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

        {/* Main Content */}
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'lg:ml-72' : 'lg:ml-24'}`}>
          <div className="p-4 md:p-6 lg:p-8">
            
            {/* Toast Notification */}
            {toastMessage && (
              <div className={`fixed top-20 right-4 z-50 animate-slideIn ${
                toastMessage.type === 'success' ? 'bg-green-500' : 'bg-red-500'
              } text-white px-6 py-3 rounded-lg shadow-lg`}>
                {toastMessage.message}
              </div>
            )}

            {/* Header */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                    Delisted Products
                  </h1>
                  <p className="text-gray-500 mt-1">Products currently hidden from customer view</p>
                </div>
                
                <button
                  onClick={fetchDelistedProducts}
                  className="bg-gray-100 text-gray-700 px-4 py-2.5 rounded-xl font-medium flex items-center gap-2 hover:bg-gray-200 transition-all duration-300"
                >
                  <FiRefreshCw size={16} className={loading ? "animate-spin" : ""} />
                  Refresh
                </button>
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl p-6 mb-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm">Total Delisted Products</p>
                  <p className="text-3xl font-bold">{totalDelisted}</p>
                </div>
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                  <MdOutlineInventory size={32} className="text-white" />
                </div>
              </div>
            </div>

            {/* Search and Filter Bar */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <form onSubmit={handleSearch} className="flex-1 relative">
                  <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search delisted products by name or model..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <FiX size={18} />
                    </button>
                  )}
                </form>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`px-4 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all duration-300 ${
                      showFilters ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <FiFilter size={16} />
                    Filters
                  </button>

                  <div className="flex bg-gray-100 rounded-xl p-1">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 rounded-lg transition-all duration-300 ${viewMode === "grid" ? 'bg-white shadow text-red-600' : 'text-gray-500'}`}
                    >
                      <HiOutlineViewGrid size={20} />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 rounded-lg transition-all duration-300 ${viewMode === "list" ? 'bg-white shadow text-red-600' : 'text-gray-500'}`}
                    >
                      <HiOutlineViewList size={20} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Filters */}
              {showFilters && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => setFilterType("ALL")}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                        filterType === "ALL" ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setFilterType("AC")}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                        filterType === "AC" ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      AC Chargers
                    </button>
                    <button
                      onClick={() => setFilterType("DC")}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                        filterType === "DC" ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      DC Chargers
                    </button>
                    <button
                      onClick={() => setFilterType("60KW")}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                        filterType === "60KW" ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      60kW Fast
                    </button>
                    <button
                      onClick={() => setFilterType("120KW")}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                        filterType === "120KW" ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      120kW Ultra
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Products Display */}
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-red-500"></div>
              </div>
            ) : !delistedProducts || delistedProducts.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl">
                <div className="text-6xl mb-4">🎉</div>
                <p className="text-gray-500 text-lg">No delisted products found</p>
                <p className="text-gray-400 text-sm mt-2">All products are currently listed</p>
                <button
                  onClick={fetchDelistedProducts}
                  className="mt-4 text-red-600 hover:text-red-700 font-medium"
                >
                  Refresh
                </button>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {delistedProducts.map((product) => {
                  if (!product) return null;
                  const powerInfo = getChargerPower(product);
                  const isDCProduct = product.name?.toUpperCase().includes("DC");
                  
                  return (
                    <div
                      key={product.id}
                      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    >
                      {/* Image Section */}
                      <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden group cursor-pointer"
                           onClick={() => handleProductView(product.id)}>
                        <img
                          src={product.image_paths?.[imageIndexes[product.id] || 0] || 'https://via.placeholder.com/300'}
                          alt={product.name || 'Product'}
                          className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                        />
                        {product.image_paths && product.image_paths.length > 1 && (
                          <>
                            <button
                              onClick={(e) => { e.stopPropagation(); handlePrevImage(product.id); }}
                              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition"
                            >
                              <FiChevronLeft size={14} />
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleNextImage(product.id); }}
                              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition"
                            >
                              <FiChevronRight size={14} />
                            </button>
                          </>
                        )}
                        
                        {/* Power Badge */}
                        <div className="absolute top-3 left-3">
                          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${powerInfo.badge}`}>
                            {powerInfo.icon} {powerInfo.power}
                          </span>
                        </div>
                        
                        {/* Delisted Badge */}
                        <span className="absolute top-3 right-3 px-2 py-1 rounded-lg text-xs font-semibold bg-red-500 text-white shadow-lg">
                          Delisted
                        </span>
                      </div>

                      {/* Info Section */}
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-bold text-gray-800 text-base line-clamp-1">{product.name}</h3>
                          {isDCProduct && <MdElectricBolt className="text-purple-500" size={16} />}
                        </div>
                        <p className="text-gray-500 text-xs mb-2">{product.model}</p>
                        
                        {/* Rating */}
                        <div className="flex items-center gap-1 mb-2">
                          {renderStars(4.5)}
                          <span className="text-xs text-gray-500 ml-1">(45)</span>
                        </div>

                        <div className="mb-3">
                          <span className="text-xl font-bold text-gray-600">₹{product.price?.toLocaleString()}</span>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleProductView(product.id)}
                            className="flex-1 bg-blue-500 text-white px-3 py-2 rounded-lg font-medium text-sm hover:bg-blue-600 transition flex items-center justify-center gap-1"
                          >
                            <FiEye size={14} /> View
                          </button>
                          <button
                            onClick={() => handleRelist(product.id)}
                            disabled={relistingProduct === product.id}
                            className="flex-1 bg-green-500 text-white px-3 py-2 rounded-lg font-medium text-sm hover:bg-green-600 transition flex items-center justify-center gap-1 disabled:opacity-50"
                          >
                            {relistingProduct === product.id ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                            ) : (
                              <><FiArrowUp size={14} /> Relist</>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              // List View
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Product</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Model</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Type</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Price</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {delistedProducts.map((product) => {
                        if (!product) return null;
                        const powerInfo = getChargerPower(product);
                        return (
                          <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <img
                                  src={product.image_paths?.[0] || 'https://via.placeholder.com/40'}
                                  alt={product.name}
                                  className="w-10 h-10 rounded-lg object-cover"
                                />
                                <span className="font-medium text-gray-800">{product.name}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-gray-600">{product.model}</td>
                            <td className="px-4 py-3">
                              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${powerInfo.badge}`}>
                                {powerInfo.icon} {powerInfo.power}
                              </span>
                            </td>
                            <td className="px-4 py-3 font-semibold text-gray-600">₹{product.price?.toLocaleString()}</td>
                            <td className="px-4 py-3">
                              <div className="flex gap-2">
                                <button onClick={() => handleProductView(product.id)} className="p-1.5 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition">
                                  <FiEye size={14} />
                                </button>
                                <button onClick={() => handleRelist(product.id)} className="p-1.5 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition">
                                  <FiArrowUp size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
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

export default DelistedProductsPage;