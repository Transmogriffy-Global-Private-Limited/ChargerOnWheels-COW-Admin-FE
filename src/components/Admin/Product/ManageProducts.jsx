// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import AdminNavbar from "../Admin_navbar";
// import AdminSidebar from "../Admin_sidebar";
// import backgroundImage from "../../../assets/workplace.jpg";

// const BASE_URL_AND_PORT = "https://api.static.ev.transev.site";
// const API_KEY = "mlzuMoRFjdGhcFulLMaVtfwNAHycbBAf";

// const ManageProductsPage = () => {
//   const navigate = useNavigate();

//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [allProducts, setAllProducts] = useState([]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [searchResults, setSearchResults] = useState([]);
//   const [sidebarOpen, setSidebarOpen] = useState(true);

//   // State to manage current image index for products with multiple images
//   const [imageIndex, setImageIndex] = useState({});

//   useEffect(() => {
//     const fetchProducts = async () => {
//       const authToken = localStorage.getItem("auth_token");
//       try {
//         const response = await axios.get(`${BASE_URL_AND_PORT}/products/all`, {
//           headers: {
//             "Authorization": `Bearer ${authToken}`,
//             "API-KEY": API_KEY,
//           },
//         });
//         setProducts(response.data.slice(0, 8));
//         setAllProducts(response.data);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching products:", error);
//         setLoading(false);
//       }
//     };

//     fetchProducts();
//   }, []);

//   const handleSeeAll = () => {
//     setProducts(allProducts);
//   };

//   const handleProductView = (id) => {
//     navigate(`/admin/product/view/${id}`);
//   };

//   const handleProductEdit = (id) => {
//     navigate(`/admin/product/edit/${id}`);
//   };

//   const handleAddProduct = () => {
//     navigate("/add-product");
//   };

//   const handleDelistedProducts = () => {
//     navigate("/admin/delisted-products");
//   };

//   const handleSearch = async (event) => {
//     event.preventDefault();
//     const authToken = localStorage.getItem("auth_token");
//     try {
//       const response = await axios.post(
//         `${BASE_URL_AND_PORT}/products/search`,
//         { query: searchQuery, limit: "1-100" },
//         {
//           headers: {
//             "Authorization": `Bearer ${authToken}`,
//             "API-KEY": API_KEY,
//           },
//         }
//       );
//       setSearchResults(response.data);
//     } catch (error) {
//       console.error("Error searching products:", error);
//     }
//   };

//   const toggleSidebar = () => {
//     setSidebarOpen(!sidebarOpen);
//   };

//   const handleToggleListing = async (productId) => {
//     const authToken = localStorage.getItem("auth_token");
//     try {
//       const response = await axios.put(
//         `${BASE_URL_AND_PORT}/products/toggle-listing`,
//         { product_id: productId },
//         {
//           headers: {
//             "Authorization": `Bearer ${authToken}`,
//             "API-KEY": API_KEY,
//           },
//         }
//       );
//       if (response.status === 200) {
//         const updatedProducts = products.map((product) =>
//           product.id === productId
//             ? { ...product, is_listed: !product.is_listed }
//             : product
//         );
//         setProducts(updatedProducts);
//       }
//     } catch (error) {
//       console.error("Error toggling product listing:", error);
//     }
//   };

//   // Functions to handle image sliding
//   const goToNextImage = (productId) => {
//     setImageIndex((prev) => {
//       const currentIndex = prev[productId] || 0;
//       const product = products.find((product) => product.id === productId);
//       const nextIndex = (currentIndex + 1) % product.image_paths.length;
//       return { ...prev, [productId]: nextIndex };
//     });
//   };

//   const goToPrevImage = (productId) => {
//     setImageIndex((prev) => {
//       const currentIndex = prev[productId] || 0;
//       const product = products.find((product) => product.id === productId);
//       const prevIndex = (currentIndex - 1 + product.image_paths.length) % product.image_paths.length;
//       return { ...prev, [productId]: prevIndex };
//     });
//   };

//   return (
//     <div
//       className="min-h-screen bg-gradient-to-r from-white-400 via-teal-100 to-white-700 bg-cover bg-center bg-fixed"
   
//     >
//       <AdminNavbar onToggleSidebar={toggleSidebar} />

//       <div className="flex flex-1">
//         <AdminSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

//         {/* <div className="bg-white rounded-lg shadow-lg p-6 ml-70 mt-6 w-400"> */}
//          <div className="bg-white rounded-lg shadow-lg p-6 mt-6 sm:ml-0 lg:ml-65 lg:w-4/5 w-full mx-auto ">
//           <h2 className="text-3xl font-bold text-center mb-6">Manage Products</h2>

//           {/* Search Bar */}
//           <div className="flex justify-center mb-4">
//             <form onSubmit={handleSearch} className="flex space-x-2">
//               <input
//                 type="text"
//                 className="px-4 py-2 border border-gray-300 rounded-md w-full max-w-md"
//                 placeholder="Search Products"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//               />
//               <button
//                 type="submit"
//                 className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
//               >
//                 Search
//               </button>
//             </form>
//           </div>

//           {/* Action Buttons */}
//           <div className="flex justify-center mb-6 space-x-4">
//             <button
//               onClick={handleAddProduct}
//               className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition duration-300"
//             >
//               Add Product
//             </button>
//             <button
//               onClick={handleDelistedProducts}
//               className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition duration-300"
//             >
//               View Delisted Products
//             </button>
//           </div>

//           {/* Search Results */}
//           {searchQuery && searchResults.length > 0 && (
//             <div className="mb-6">
//               <h3 className="text-2xl font-semibold">Search Results</h3>
//               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//                 {searchResults.map((product) => (
//                   <div key={product.id} className="bg-white border rounded-lg p-4 shadow-md">
//                     <div className="w-full h-40 bg-gray-200 mb-4">
//                       {product.image_paths?.length > 0 ? (
//                         <img
//                           src={product.image_paths[0]}
//                           alt={product.name}
//                           className="w-full h-full object-cover rounded-lg"
//                           onError={(e) => {
//                             e.target.onerror = null;
//                             e.target.src = 'https://via.placeholder.com/150';
//                           }}
//                         />
//                       ) : (
//                         <img
//                           src="https://via.placeholder.com/150"
//                           alt={product.name}
//                           className="w-full h-full object-cover rounded-lg"
//                         />
//                       )}
//                     </div>
//                     <h3 className="text-xl font-semibold">{product.name}</h3>
//                     <p className="text-gray-600">{product.model}</p>
//                     <p className="text-gray-700 mt-2">₹{product.price}</p>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Product List */}
//           {loading ? (
//             <div className="text-center">Loading products...</div>
//           ) : (
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//               {products.map((product) => (
              
//                 <div key={product.id} className="bg-white border rounded-lg p-4 shadow-md cursor-pointer flex flex-col justify-between h-[400px] w-[300px]">
//   <div className="relative w-full h-[250px] bg-gray-200 mb-4 overflow-hidden">
//                     {/* Conditional Image Slider for Products with Multiple Images */}
//                     {product.image_paths?.length > 1 ? (
//                       <div className="flex transition-all duration-500 ease-in-out">
//                         <img
//                           src={product.image_paths[imageIndex[product.id] || 0]}
//                           alt={product.name}
//                           className="w-full h-full object-cover rounded-lg"
//                           onError={(e) => {
//                             e.target.onerror = null;
//                             e.target.src = 'https://via.placeholder.com/150';
//                           }}
//                         />
//                       </div>
//                     ) : (
//                       <img
//                         src={product.image_paths[0]}
//                         alt={product.name}
//                         className="w-full h-full object-cover rounded-lg"
//                         onError={(e) => {
//                           e.target.onerror = null;
//                           e.target.src = 'https://via.placeholder.com/150';
//                         }}
//                       />
//                     )}

//                     {/* Navigation Buttons */}
//                     {product.image_paths?.length > 1 && (
//                       <>
//                         <button
//                           className="absolute top-1/2 left-2 transform -translate-y-1/2 text-white bg-gray-800 bg-opacity-50 p-2 rounded-full"
//                           onClick={() => goToPrevImage(product.id)}
//                         >
//                           &#10094;
//                         </button>
//                         <button
//                           className="absolute top-1/2 right-2 transform -translate-y-1/2 text-white bg-gray-800 bg-opacity-50 p-2 rounded-full"
//                           onClick={() => goToNextImage(product.id)}
//                         >
//                           &#10095;
//                         </button>
//                       </>
//                     )}
//                   </div>
//                   <h3 className="text-xl font-semibold">{product.name}</h3>
//                   <p className="text-gray-600">{product.model}</p>
//                   <p className="text-gray-700 mt-2">₹{product.price}</p>

//                   <div className="flex justify-between mt-4">
//                     <button
//                       onClick={() => handleProductView(product.id)}
//                       className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
//                     >
//                       View
//                     </button>
//                     <button
//                       onClick={() => handleProductEdit(product.id)}
//                       className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition duration-300"
//                     >
//                       Edit
//                     </button>
//                     <button
//                       onClick={() => handleToggleListing(product.id)}
//                       className={`${
//                         product.is_listed ? 'bg-red-500' : 'bg-green-500'
//                       } text-white px-4 py-2 rounded-md hover:bg-opacity-80 transition duration-300`}
//                     >
//                       {product.is_listed ? 'Delist' : 'Show'}
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}

//           {/* See All Products */}
//           {products.length < allProducts.length && (
//             <div className="flex justify-center mt-6">
//               <button
//                 onClick={handleSeeAll}
//                 className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition duration-300"
//               >
//                 See All Products
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ManageProductsPage;

// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import AdminNavbar from "../Admin_navbar";
// import AdminSidebar from "../Admin_sidebar";
// import { FiSearch } from "react-icons/fi"; // Search icon

// const BASE_URL_AND_PORT = "https://api.static.ev.transev.site";
// const API_KEY = "mlzuMoRFjdGhcFulLMaVtfwNAHycbBAf";

// const ManageProductsPage = () => {
//   const navigate = useNavigate();

//   const [products, setProducts] = useState([]);
//   const [allProducts, setAllProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [imageIndex, setImageIndex] = useState({});
//   const [filterType, setFilterType] = useState("ALL");
//   const [showAll, setShowAll] = useState(false);

//   /* ================= FETCH PRODUCTS ================= */
//   useEffect(() => {
//     const fetchProducts = async () => {
//       const authToken = localStorage.getItem("auth_token");
//       try {
//         const response = await axios.get(
//           `${BASE_URL_AND_PORT}/products/all`,
//           {
//             headers: {
//               Authorization: `Bearer ${authToken}`,
//               "API-KEY": API_KEY,
//             },
//           }
//         );
//         setAllProducts(response.data);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching products:", error);
//         setLoading(false);
//       }
//     };

//     fetchProducts();
//   }, []);

//   /* ================= FILTER PRODUCTS ================= */
//   useEffect(() => {
//     let filtered = allProducts;

//     if (filterType !== "ALL") {
//       filtered = allProducts.filter(
//         (p) =>
//           p.name?.toUpperCase().includes(filterType) ||
//           p.model?.toUpperCase().includes(filterType)
//       );
//     }

//     setProducts(showAll ? filtered : filtered.slice(0, 8));
//   }, [filterType, allProducts, showAll]);

//   /* ================= SEARCH ================= */
//   const handleSearch = (e) => {
//     e.preventDefault();
//     const filtered = allProducts.filter((p) =>
//       p.name.toLowerCase().includes(searchQuery.toLowerCase())
//     );
//     setProducts(filtered.slice(0, 8));
//     setShowAll(false);
//   };

//   /* ================= NAVIGATION ================= */
//   const handleProductView = (id) => navigate(`/admin/product/view/${id}`);
//   const handleProductEdit = (id) => navigate(`/admin/product/edit/${id}`);
//   const handleAddProduct = () => navigate("/add-product");
//   const handleDelistedProducts = () => navigate("/admin/delisted-products");
//   const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

//   /* ================= TOGGLE LISTING ================= */
//   const handleToggleListing = async (productId) => {
//     const authToken = localStorage.getItem("auth_token");
//     try {
//       const response = await axios.put(
//         `${BASE_URL_AND_PORT}/products/toggle-listing`,
//         { product_id: productId },
//         {
//           headers: {
//             Authorization: `Bearer ${authToken}`,
//             "API-KEY": API_KEY,
//           },
//         }
//       );

//       if (response.status === 200) {
//         const updated = products.map((product) =>
//           product.id === productId
//             ? { ...product, is_listed: !product.is_listed }
//             : product
//         );
//         setProducts(updated);
//       }
//     } catch (error) {
//       console.error("Toggle listing error:", error);
//     }
//   };

//   /* ================= IMAGE SLIDER ================= */
//   const goToNextImage = (productId) => {
//     setImageIndex((prev) => {
//       const current = prev[productId] || 0;
//       const product = products.find((p) => p.id === productId);
//       const next = (current + 1) % product.image_paths.length;
//       return { ...prev, [productId]: next };
//     });
//   };

//   const goToPrevImage = (productId) => {
//     setImageIndex((prev) => {
//       const current = prev[productId] || 0;
//       const product = products.find((p) => p.id === productId);
//       const prevIndex =
//         (current - 1 + product.image_paths.length) %
//         product.image_paths.length;
//       return { ...prev, [productId]: prevIndex };
//     });
//   };

//   /* ================= SEE ALL ================= */
//   const handleSeeAll = () => {
//     setShowAll(true);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-r from-white via-teal-100 to-white bg-fixed">
//       <AdminNavbar onToggleSidebar={toggleSidebar} />

//       <div className="flex">
//         <AdminSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

//         <div className="bg-white rounded-lg shadow-lg p-6 mt-6 lg:ml-64 w-full mx-auto">
//           {/* HEADER + FILTER */}
//           <div className="flex items-center justify-between mb-6 bg-gradient-to-r from-green-500 to-blue-500 p-4 rounded-lg shadow">
//             <h2 className="text-3xl font-bold text-white">Manage Products</h2>

//             <select
//               value={filterType}
//               onChange={(e) => {
//                 setFilterType(e.target.value);
//                 setShowAll(false);
//               }}
//               className="bg-white px-4 py-2 rounded-md shadow font-semibold"
//             >
//               <option value="ALL">All Chargers</option>
//               <option value="AC">AC Charger</option>
//               <option value="DC">DC Charger</option>
//             </select>
//           </div>

//           {/* SEARCH */}
//           <div className="flex justify-center mb-4">
//             <form className="relative w-80" onSubmit={handleSearch}>
//               <input
//                 type="text"
//                 className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//                 placeholder="Search by product name"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//               />
//               <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//             </form>
//           </div>

//           {/* ACTION BUTTONS */}
//           <div className="flex justify-center mb-6 space-x-4">
//             <button
//               onClick={handleAddProduct}
//               className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600"
//             >
//               Add Product
//             </button>

//             <button
//               onClick={handleDelistedProducts}
//               className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600"
//             >
//               View Delisted Products
//             </button>
//           </div>

//           {/* PRODUCTS GRID */}
//           {loading ? (
//             <div className="text-center text-gray-600">Loading...</div>
//           ) : products.length === 0 ? (
//             <div className="text-center py-20 text-gray-500 text-lg">
//               No products found
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//               {products.map((product) => (
//                 <div
//                   key={product.id}
//                   className="bg-white border rounded-lg p-4 shadow-md flex flex-col justify-between h-[400px]"
//                 >
//                   <div className="relative w-full h-[220px] bg-gray-200 mb-4 overflow-hidden">
//                     <img
//                       src={product.image_paths?.[imageIndex[product.id] || 0]}
//                       alt={product.name}
//                       className="w-full h-full object-cover rounded-lg"
//                     />
//                     {product.image_paths?.length > 1 && (
//                       <>
//                         <button
//                           onClick={() => goToPrevImage(product.id)}
//                           className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
//                         >
//                           &#10094;
//                         </button>
//                         <button
//                           onClick={() => goToNextImage(product.id)}
//                           className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
//                         >
//                           &#10095;
//                         </button>
//                       </>
//                     )}
//                   </div>

//                   <h3 className="text-lg font-semibold">{product.name}</h3>
//                   <p className="text-gray-600">{product.model}</p>
//                   <p className="text-gray-700">₹{product.price}</p>

//                   <div className="flex justify-between mt-4">
//                     <button
//                       onClick={() => handleProductView(product.id)}
//                       className="bg-blue-500 text-white px-3 py-1 rounded-md"
//                     >
//                       View
//                     </button>

//                     <button
//                       onClick={() => handleProductEdit(product.id)}
//                       className="bg-yellow-500 text-white px-3 py-1 rounded-md"
//                     >
//                       Edit
//                     </button>

//                     <button
//                       onClick={() => handleToggleListing(product.id)}
//                       className={`${
//                         product.is_listed ? "bg-red-500" : "bg-green-500"
//                       } text-white px-3 py-1 rounded-md`}
//                     >
//                       {product.is_listed ? "Delist" : "Show"}
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}

//           {/* See All Products */}
//           {!showAll && products.length >= 8 && products.length < allProducts.length && (
//             <div className="flex justify-center mt-6">
//               <button
//                 onClick={handleSeeAll}
//                 className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition duration-300"
//               >
//                 See All Products
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ManageProductsPage;


// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import AdminNavbar from "../Admin_navbar";
// import AdminSidebar from "../Admin_sidebar";
// import { 
//   FiSearch, 
//   FiPlus, 
//   FiEye, 
//   FiEdit2, 
//   FiTrash2, 
//   FiChevronLeft, 
//   FiChevronRight,
//   FiGrid,
//   FiList,
//   FiFilter,
//   FiX,
//   FiDownload,
//   FiRefreshCw
// } from "react-icons/fi";
// import { 
//   MdElectricBolt, 
//   MdSpeed, 
//   MdVerified, 
//   MdOutlineInventory,
//   MdOutlineCategory,
//   MdOutlinePriceChange,
//   MdOutlineStorefront
// } from "react-icons/md";
// import { FaBox, FaShoppingCart, FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
// import { HiOutlineViewGrid, HiOutlineViewList } from "react-icons/hi";
// import { TbCurrencyRupee } from "react-icons/tb";

// const BASE_URL_AND_PORT = "https://api.static.ev.transev.site";
// const API_KEY = "mlzuMoRFjdGhcFulLMaVtfwNAHycbBAf";

// const ManageProductsPage = () => {
//   const navigate = useNavigate();

//   const [products, setProducts] = useState([]);
//   const [allProducts, setAllProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [imageIndex, setImageIndex] = useState({});
//   const [filterType, setFilterType] = useState("ALL");
//   const [showAll, setShowAll] = useState(false);
//   const [viewMode, setViewMode] = useState("grid");
//   const [selectedProducts, setSelectedProducts] = useState([]);
//   const [showFilters, setShowFilters] = useState(false);
//   const [priceRange, setPriceRange] = useState([0, 2000000]);
//   const [selectedCategory, setSelectedCategory] = useState("all");
//   const [sortBy, setSortBy] = useState("newest");

//   /* ================= FETCH PRODUCTS ================= */
//   useEffect(() => {
//     const fetchProducts = async () => {
//       const authToken = localStorage.getItem("auth_token");
//       try {
//         const response = await axios.get(
//           `${BASE_URL_AND_PORT}/products/all`,
//           {
//             headers: {
//               Authorization: `Bearer ${authToken}`,
//               "API-KEY": API_KEY,
//             },
//           }
//         );
//         setAllProducts(response.data);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching products:", error);
//         setLoading(false);
//       }
//     };

//     fetchProducts();
//   }, []);

//   /* ================= FILTER & SORT PRODUCTS ================= */
//   useEffect(() => {
//     let filtered = [...allProducts];

//     // Filter by type
//     if (filterType !== "ALL") {
//       filtered = filtered.filter(
//         (p) =>
//           p.name?.toUpperCase().includes(filterType) ||
//           p.model?.toUpperCase().includes(filterType)
//       );
//     }

//     // Filter by category
//     if (selectedCategory !== "all") {
//       filtered = filtered.filter((p) => {
//         const name = p.name?.toLowerCase() || "";
//         const model = p.model?.toLowerCase() || "";
//         if (selectedCategory === "ac") return name.includes("ac") || model.includes("ac");
//         if (selectedCategory === "dc") return name.includes("dc") || model.includes("dc");
//         if (selectedCategory === "fast") return name.includes("60kw") || name.includes("120kw");
//         return true;
//       });
//     }

//     // Filter by price
//     filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

//     // Sort products
//     if (sortBy === "newest") {
//       filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
//     } else if (sortBy === "price-low") {
//       filtered.sort((a, b) => a.price - b.price);
//     } else if (sortBy === "price-high") {
//       filtered.sort((a, b) => b.price - a.price);
//     } else if (sortBy === "name-asc") {
//       filtered.sort((a, b) => a.name.localeCompare(b.name));
//     }

//     setProducts(showAll ? filtered : filtered.slice(0, 8));
//   }, [filterType, allProducts, showAll, selectedCategory, priceRange, sortBy]);

//   /* ================= SEARCH ================= */
//   const handleSearch = (e) => {
//     e.preventDefault();
//     const filtered = allProducts.filter((p) =>
//       p.name.toLowerCase().includes(searchQuery.toLowerCase())
//     );
//     setProducts(filtered.slice(0, 8));
//     setShowAll(false);
//   };

//   const clearSearch = () => {
//     setSearchQuery("");
//     setFilterType("ALL");
//     setSelectedCategory("all");
//     setPriceRange([0, 2000000]);
//     setSortBy("newest");
//     setShowFilters(false);
//   };

//   /* ================= NAVIGATION ================= */
//   const handleProductView = (id) => navigate(`/admin/product/view/${id}`);
//   const handleProductEdit = (id) => navigate(`/admin/product/edit/${id}`);
//   const handleAddProduct = () => navigate("/add-product");
//   const handleDelistedProducts = () => navigate("/admin/delisted-products");
//   const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

//   /* ================= TOGGLE LISTING ================= */
//   const handleToggleListing = async (productId) => {
//     const authToken = localStorage.getItem("auth_token");
//     try {
//       const response = await axios.put(
//         `${BASE_URL_AND_PORT}/products/toggle-listing`,
//         { product_id: productId },
//         {
//           headers: {
//             Authorization: `Bearer ${authToken}`,
//             "API-KEY": API_KEY,
//           },
//         }
//       );

//       if (response.status === 200) {
//         const updated = products.map((product) =>
//           product.id === productId
//             ? { ...product, is_listed: !product.is_listed }
//             : product
//         );
//         setProducts(updated);
//       }
//     } catch (error) {
//       console.error("Toggle listing error:", error);
//     }
//   };

//   /* ================= BULK ACTIONS ================= */
//   const handleSelectProduct = (productId) => {
//     setSelectedProducts(prev =>
//       prev.includes(productId)
//         ? prev.filter(id => id !== productId)
//         : [...prev, productId]
//     );
//   };

//   const handleSelectAll = () => {
//     if (selectedProducts.length === products.length) {
//       setSelectedProducts([]);
//     } else {
//       setSelectedProducts(products.map(p => p.id));
//     }
//   };

//   /* ================= IMAGE SLIDER ================= */
//   const goToNextImage = (productId) => {
//     setImageIndex((prev) => {
//       const current = prev[productId] || 0;
//       const product = products.find((p) => p.id === productId);
//       const next = (current + 1) % product.image_paths.length;
//       return { ...prev, [productId]: next };
//     });
//   };

//   const goToPrevImage = (productId) => {
//     setImageIndex((prev) => {
//       const current = prev[productId] || 0;
//       const product = products.find((p) => p.id === productId);
//       const prevIndex =
//         (current - 1 + product.image_paths.length) %
//         product.image_paths.length;
//       return { ...prev, [productId]: prevIndex };
//     });
//   };

//   /* ================= STATS ================= */
//   const totalProducts = allProducts.length;
//   const listedProducts = allProducts.filter(p => p.is_listed).length;
//   const delistedProducts = totalProducts - listedProducts;
//   const totalValue = allProducts.reduce((sum, p) => sum + (p.price || 0), 0);

//   /* ================= RENDER STARS ================= */
//   const renderStars = (rating) => {
//     const stars = [];
//     const fullStars = Math.floor(rating);
//     const hasHalfStar = rating % 1 >= 0.5;
    
//     for (let i = 0; i < fullStars; i++) {
//       stars.push(<FaStar key={i} className="text-yellow-400 text-xs" />);
//     }
//     if (hasHalfStar) {
//       stars.push(<FaStarHalfAlt key="half" className="text-yellow-400 text-xs" />);
//     }
//     while (stars.length < 5) {
//       stars.push(<FaRegStar key={stars.length} className="text-yellow-400 text-xs" />);
//     }
//     return stars;
//   };
//  /* ================= SEE ALL ================= */
//   const handleSeeAll = () => {
//     setShowAll(true);
//   };
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
//       <AdminNavbar onToggleSidebar={toggleSidebar} />

//       <div className="flex">
//         <AdminSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

//         {/* Main Content */}
//         <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'lg:ml-72' : 'lg:ml-24'}`}>
//           <div className="p-4 md:p-6 lg:p-8">
            
//             {/* Header Section */}
//             <div className="mb-8">
//               <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//                 <div>
//                   <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
//                     Manage Products
//                   </h1>
//                   <p className="text-gray-500 mt-1">Manage your EV charger inventory</p>
//                 </div>
                
//                 <div className="flex gap-3">
//                   <button
//                     onClick={handleAddProduct}
//                     className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 hover:shadow-lg transition-all duration-300 hover:scale-105"
//                   >
//                     <FiPlus size={18} />
//                     Add Product
//                   </button>
//                   <button
//                     onClick={handleDelistedProducts}
//                     className="bg-gradient-to-r from-red-500 to-red-600 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 hover:shadow-lg transition-all duration-300"
//                   >
//                     <FiTrash2 size={18} />
//                     Delisted
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Stats Cards */}
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
//               <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-gray-500 text-sm">Total Products</p>
//                     <p className="text-2xl font-bold text-gray-800">{totalProducts}</p>
//                   </div>
//                   <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
//                     <FaBox className="text-blue-600 text-2xl" />
//                   </div>
//                 </div>
//               </div>
              
//               <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-gray-500 text-sm">Listed Products</p>
//                     <p className="text-2xl font-bold text-green-600">{listedProducts}</p>
//                   </div>
//                   <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
//                     <MdVerified className="text-green-600 text-2xl" />
//                   </div>
//                 </div>
//               </div>
              
//               <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-gray-500 text-sm">Delisted Products</p>
//                     <p className="text-2xl font-bold text-red-600">{delistedProducts}</p>
//                   </div>
//                   <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
//                     <MdOutlineInventory className="text-red-600 text-2xl" />
//                   </div>
//                 </div>
//               </div>
              
//               <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-gray-500 text-sm">Total Value</p>
//                     <p className="text-2xl font-bold text-purple-600">₹{(totalValue / 100000).toFixed(1)}L+</p>
//                   </div>
//                   <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
//                     <TbCurrencyRupee className="text-purple-600 text-2xl" />
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Search and Filter Bar */}
//             <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
//               <div className="flex flex-col md:flex-row gap-4">
//                 {/* Search */}
//                 <form onSubmit={handleSearch} className="flex-1 relative">
//                   <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
//                   <input
//                     type="text"
//                     placeholder="Search products by name..."
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                   />
//                   {searchQuery && (
//                     <button
//                       type="button"
//                       onClick={clearSearch}
//                       className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                     >
//                       <FiX size={18} />
//                     </button>
//                   )}
//                 </form>

//                 {/* Filters and View Toggle */}
//                 <div className="flex gap-3">
//                   <button
//                     onClick={() => setShowFilters(!showFilters)}
//                     className={`px-4 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all duration-300 ${
//                       showFilters ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                     }`}
//                   >
//                     <FiFilter size={16} />
//                     Filters
//                   </button>

//                   <select
//                     value={sortBy}
//                     onChange={(e) => setSortBy(e.target.value)}
//                     className="px-4 py-2.5 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
//                   >
//                     <option value="newest">Newest First</option>
//                     <option value="price-low">Price: Low to High</option>
//                     <option value="price-high">Price: High to Low</option>
//                     <option value="name-asc">Name: A to Z</option>
//                   </select>

//                   <div className="flex bg-gray-100 rounded-xl p-1">
//                     <button
//                       onClick={() => setViewMode("grid")}
//                       className={`p-2 rounded-lg transition-all duration-300 ${viewMode === "grid" ? 'bg-white shadow text-green-600' : 'text-gray-500'}`}
//                     >
//                       <HiOutlineViewGrid size={20} />
//                     </button>
//                     <button
//                       onClick={() => setViewMode("list")}
//                       className={`p-2 rounded-lg transition-all duration-300 ${viewMode === "list" ? 'bg-white shadow text-green-600' : 'text-gray-500'}`}
//                     >
//                       <HiOutlineViewList size={20} />
//                     </button>
//                   </div>
//                 </div>
//               </div>

//               {/* Advanced Filters */}
//               {showFilters && (
//                 <div className="mt-4 pt-4 border-t border-gray-100">
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
//                       <select
//                         value={selectedCategory}
//                         onChange={(e) => setSelectedCategory(e.target.value)}
//                         className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//                       >
//                         <option value="all">All Products</option>
//                         <option value="ac">AC Chargers</option>
//                         <option value="dc">DC Chargers</option>
//                         {/* <option value="fast">Fast Chargers (60kW+)</option> */}
//                       </select>
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
//                       <div className="flex items-center gap-2">
//                         <span className="text-sm text-gray-500">₹{priceRange[0].toLocaleString()}</span>
//                         <input
//                           type="range"
//                           min="0"
//                           max="2000000"
//                           step="50000"
//                           value={priceRange[1]}
//                           onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
//                           className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-500"
//                         />
//                         <span className="text-sm text-gray-500">₹{priceRange[1].toLocaleString()}</span>
//                       </div>
//                     </div>
//                     <div className="flex items-end">
//                       <button
//                         onClick={clearSearch}
//                         className="w-full py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
//                       >
//                         Reset Filters
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Bulk Actions Bar */}
//             {selectedProducts.length > 0 && (
//               <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-4 mb-6 text-white flex items-center justify-between">
//                 <div>
//                   <span className="font-semibold">{selectedProducts.length} products selected</span>
//                 </div>
//                 <div className="flex gap-3">
//                   <button className="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition">
//                     Bulk Delete
//                   </button>
//                   <button className="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition">
//                     Bulk Delist
//                   </button>
//                   <button onClick={() => setSelectedProducts([])} className="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition">
//                     Cancel
//                   </button>
//                 </div>
//               </div>
//             )}

//             {/* Products Grid/List View */}
//             {loading ? (
//               <div className="flex justify-center items-center py-20">
//                 <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-green-500"></div>
//               </div>
//             ) : products.length === 0 ? (
//               <div className="text-center py-20 bg-white rounded-2xl">
//                 <div className="text-6xl mb-4">📦</div>
//                 <p className="text-gray-500 text-lg">No products found</p>
//                 <button
//                   onClick={clearSearch}
//                     className="mt-4 text-green-600 hover:text-green-700 font-medium"
//                 >
//                   Clear all filters
//                 </button>
//               </div>
//             ) : viewMode === "grid" ? (
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//                 {products.map((product) => (
//                   <div
//                     key={product.id}
//                     className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${
//                       selectedProducts.includes(product.id) ? 'ring-2 ring-green-500' : ''
//                     }`}
//                   >
//                     {/* Checkbox */}
//                     <div className="relative z-10 p-3">
//                       <input
//                         type="checkbox"
//                         checked={selectedProducts.includes(product.id)}
//                         onChange={() => handleSelectProduct(product.id)}
//                         className="w-4 h-4 rounded border-gray-300 text-green-500 focus:ring-green-500"
//                       />
//                     </div>

//                     {/* Image */}
//                     <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden group cursor-pointer"
//                          onClick={() => handleProductView(product.id)}>
//                       <img
//                         src={product.image_paths?.[imageIndex[product.id] || 0] || 'https://via.placeholder.com/300'}
//                         alt={product.name}
//                         className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
//                       />
//                       {product.image_paths?.length > 1 && (
//                         <>
//                           <button
//                             onClick={(e) => { e.stopPropagation(); goToPrevImage(product.id); }}
//                             className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition"
//                           >
//                             <FiChevronLeft size={14} />
//                           </button>
//                           <button
//                             onClick={(e) => { e.stopPropagation(); goToNextImage(product.id); }}
//                             className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition"
//                           >
//                             <FiChevronRight size={14} />
//                           </button>
//                         </>
//                       )}
                      
//                       {/* Status Badge */}
//                       <span className={`absolute top-3 right-3 px-2 py-1 rounded-lg text-xs font-semibold ${
//                         product.is_listed 
//                           ? 'bg-green-500 text-white' 
//                           : 'bg-red-500 text-white'
//                       }`}>
//                         {product.is_listed ? 'Listed' : 'Delisted'}
//                       </span>
//                     </div>

//                     {/* Info */}
//                     <div className="p-4">
//                       <div className="flex items-center justify-between mb-1">
//                         <h3 className="font-bold text-gray-800 text-base line-clamp-1">{product.name}</h3>
//                         {product.name?.toUpperCase().includes("DC") && (
//                           <MdElectricBolt className="text-purple-500" size={16} />
//                         )}
//                       </div>
//                       <p className="text-gray-500 text-xs mb-2">{product.model}</p>
                      
//                       {/* Rating */}
//                       <div className="flex items-center gap-1 mb-2">
//                         {renderStars(4.5)}
//                         <span className="text-xs text-gray-500 ml-1">(45)</span>
//                       </div>

//                       <div className="mb-3">
//                         <span className="text-xl font-bold text-green-600">₹{product.price?.toLocaleString()}</span>
//                         {product.mrp && product.mrp > product.price && (
//                           <span className="text-xs text-gray-400 line-through ml-2">₹{product.mrp?.toLocaleString()}</span>
//                         )}
//                       </div>

//                       {/* Actions */}
//                       <div className="flex gap-2">
//                         <button
//                           onClick={() => handleProductView(product.id)}
//                           className="flex-1 bg-blue-500 text-white px-3 py-2 rounded-lg font-medium text-sm hover:bg-blue-600 transition flex items-center justify-center gap-1"
//                         >
//                           <FiEye size={14} /> View
//                         </button>
//                         <button
//                           onClick={() => handleProductEdit(product.id)}
//                           className="flex-1 bg-yellow-500 text-white px-3 py-2 rounded-lg font-medium text-sm hover:bg-yellow-600 transition flex items-center justify-center gap-1"
//                         >
//                           <FiEdit2 size={14} /> Edit
//                         </button>
//                         <button
//                           onClick={() => handleToggleListing(product.id)}
//                           className={`px-3 py-2 rounded-lg font-medium text-sm transition flex items-center justify-center gap-1 ${
//                             product.is_listed 
//                               ? 'bg-red-500 text-white hover:bg-red-600' 
//                               : 'bg-green-500 text-white hover:bg-green-600'
//                           }`}
//                         >
//                           {product.is_listed ? 'Delist' : 'Show'}
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               // List View
//               <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
//                 <div className="overflow-x-auto">
//                   <table className="w-full">
//                     <thead className="bg-gray-50 border-b border-gray-200">
//                       <tr>
//                         <th className="px-4 py-3 text-left">
//                           <input
//                             type="checkbox"
//                             checked={selectedProducts.length === products.length && products.length > 0}
//                             onChange={handleSelectAll}
//                             className="w-4 h-4 rounded border-gray-300 text-green-500 focus:ring-green-500"
//                           />
//                         </th>
//                         <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Product</th>
//                         <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Model</th>
//                         <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Price</th>
//                         <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Status</th>
//                         <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Actions</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {products.map((product) => (
//                         <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
//                           <td className="px-4 py-3">
//                             <input
//                               type="checkbox"
//                               checked={selectedProducts.includes(product.id)}
//                               onChange={() => handleSelectProduct(product.id)}
//                               className="w-4 h-4 rounded border-gray-300 text-green-500 focus:ring-green-500"
//                             />
//                           </td>
//                           <td className="px-4 py-3">
//                             <div className="flex items-center gap-3">
//                               <img
//                                 src={product.image_paths?.[0] || 'https://via.placeholder.com/40'}
//                                 alt={product.name}
//                                 className="w-10 h-10 rounded-lg object-cover"
//                               />
//                               <span className="font-medium text-gray-800">{product.name}</span>
//                             </div>
//                           </td>
//                           <td className="px-4 py-3 text-gray-600">{product.model}</td>
//                           <td className="px-4 py-3 font-semibold text-green-600">₹{product.price?.toLocaleString()}</td>
//                           <td className="px-4 py-3">
//                             <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${
//                               product.is_listed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
//                             }`}>
//                               {product.is_listed ? 'Listed' : 'Delisted'}
//                             </span>
//                           </td>
//                           <td className="px-4 py-3">
//                             <div className="flex gap-2">
//                               <button onClick={() => handleProductView(product.id)} className="p-1.5 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition">
//                                 <FiEye size={14} />
//                               </button>
//                               <button onClick={() => handleProductEdit(product.id)} className="p-1.5 bg-yellow-100 text-yellow-600 rounded-lg hover:bg-yellow-200 transition">
//                                 <FiEdit2 size={14} />
//                               </button>
//                               <button onClick={() => handleToggleListing(product.id)} className={`p-1.5 rounded-lg transition ${
//                                 product.is_listed ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-green-100 text-green-600 hover:bg-green-200'
//                               }`}>
//                                 {product.is_listed ? 'Delist' : 'Show'}
//                               </button>
//                             </div>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             )}

//             {/* See All Button */}
//             {!showAll && products.length >= 8 && products.length < allProducts.length && (
//               <div className="flex justify-center mt-8">
//                 <button
//                   onClick={handleSeeAll}
//                   className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
//                 >
//                   See All Products ({allProducts.length - products.length} more)
//                 </button>
//               </div>
//             )}
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default ManageProductsPage;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminNavbar from "../Admin_navbar";
import AdminSidebar from "../Admin_sidebar";
import { 
  FiSearch, 
  FiPlus, 
  FiEye, 
  FiEdit2, 
  FiTrash2, 
  FiChevronLeft, 
  FiChevronRight,
  FiGrid,
  FiList,
  FiFilter,
  FiX,
  FiDownload,
  FiRefreshCw
} from "react-icons/fi";
import { 
  MdElectricBolt, 
  MdSpeed, 
  MdVerified, 
  MdOutlineInventory,
  MdOutlineCategory,
  MdOutlinePriceChange,
  MdOutlineStorefront,
  MdStar,
  MdStarHalf,
  MdStarOutline
} from "react-icons/md";
import { FaBox, FaShoppingCart, FaStar, FaStarHalfAlt, FaRegStar, FaThumbsUp, FaCalendarAlt } from "react-icons/fa";
import { HiOutlineViewGrid, HiOutlineViewList } from "react-icons/hi";
import { TbCurrencyRupee } from "react-icons/tb";

const BASE_URL_AND_PORT = "https://api.static.ev.transev.site";
const API_KEY = "mlzuMoRFjdGhcFulLMaVtfwNAHycbBAf";

const ManageProductsPage = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [imageIndex, setImageIndex] = useState({});
  const [filterType, setFilterType] = useState("ALL");
  const [showAll, setShowAll] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 2000000]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  
  // Review States
  const [reviewSummary, setReviewSummary] = useState({});
  const [reviewsPopupOpen, setReviewsPopupOpen] = useState(false);
  const [selectedProductForReviews, setSelectedProductForReviews] = useState(null);
  const [productReviews, setProductReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);

  /* ================= FETCH PRODUCTS ================= */
  useEffect(() => {
    const fetchProducts = async () => {
      const authToken = localStorage.getItem("auth_token");
      try {
        const response = await axios.get(
          BASE_URL_AND_PORT + "/products/all",
          {
            headers: {
              Authorization: "Bearer " + authToken,
              "API-KEY": API_KEY,
            },
          }
        );
        setAllProducts(response.data);
        
        for (const product of response.data) {
          await fetchReviewSummary(product.id);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Fetch review summary for a product
  const fetchReviewSummary = async (productId) => {
    if (!productId) return;
    
    try {
      const response = await axios.get(
        BASE_URL_AND_PORT + "/products/reviews/summary/" + productId,
        {
          headers: {
            "API-KEY": API_KEY,
          },
        }
      );
      
      setReviewSummary(prev => ({
        ...prev,
        [productId]: response.data
      }));
    } catch (error) {
      console.error("Error fetching review summary:", error);
      setReviewSummary(prev => ({
        ...prev,
        [productId]: {
          average_rating: 0,
          review_count: 0,
          rating_breakdown: { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 }
        }
      }));
    }
  };

  // Fetch product reviews
  const fetchProductReviews = async (productId, limit = "1-20") => {
    if (!productId) return;
    
    setLoadingReviews(true);
    try {
      const response = await axios.get(
        BASE_URL_AND_PORT + "/products/reviews/" + productId + "?limit=" + limit,
        {
          headers: {
            "API-KEY": API_KEY,
          },
        }
      );
      
      setProductReviews(response.data.reviews || []);
    } catch (error) {
      console.error("Error fetching product reviews:", error);
      setProductReviews([]);
    } finally {
      setLoadingReviews(false);
    }
  };

  // Open reviews popup
  const openReviewsPopup = async (product) => {
    setSelectedProductForReviews(product);
    await fetchReviewSummary(product.id);
    await fetchProductReviews(product.id, "1-20");
    setReviewsPopupOpen(true);
  };

  /* ================= FILTER & SORT PRODUCTS ================= */
  useEffect(() => {
    let filtered = [...allProducts];

    if (filterType !== "ALL") {
      filtered = filtered.filter(
        (p) =>
          p.name?.toUpperCase().includes(filterType) ||
          p.model?.toUpperCase().includes(filterType)
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((p) => {
        const name = p.name?.toLowerCase() || "";
        const model = p.model?.toLowerCase() || "";
        if (selectedCategory === "ac") return name.includes("ac") || model.includes("ac");
        if (selectedCategory === "dc") return name.includes("dc") || model.includes("dc");
        if (selectedCategory === "fast") return name.includes("60kw") || name.includes("120kw");
        return true;
      });
    }

    filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    if (sortBy === "newest") {
      filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (sortBy === "price-low") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === "name-asc") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "rating") {
      filtered.sort((a, b) => {
        const ratingA = reviewSummary[a.id]?.average_rating || 0;
        const ratingB = reviewSummary[b.id]?.average_rating || 0;
        return ratingB - ratingA;
      });
    }

    setProducts(showAll ? filtered : filtered.slice(0, 8));
  }, [filterType, allProducts, showAll, selectedCategory, priceRange, sortBy, reviewSummary]);

  /* ================= SEARCH ================= */
  const handleSearch = (e) => {
    e.preventDefault();
    const filtered = allProducts.filter((p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setProducts(filtered.slice(0, 8));
    setShowAll(false);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setFilterType("ALL");
    setSelectedCategory("all");
    setPriceRange([0, 2000000]);
    setSortBy("newest");
    setShowFilters(false);
  };

  /* ================= NAVIGATION ================= */
  const handleProductView = (id) => navigate("/admin/product/view/" + id);
  const handleProductEdit = (id) => navigate("/admin/product/edit/" + id);
  const handleAddProduct = () => navigate("/add-product");
  const handleDelistedProducts = () => navigate("/admin/delisted-products");
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  /* ================= TOGGLE LISTING ================= */
  const handleToggleListing = async (productId) => {
    const authToken = localStorage.getItem("auth_token");
    try {
      const response = await axios.put(
        BASE_URL_AND_PORT + "/products/toggle-listing",
        { product_id: productId },
        {
          headers: {
            Authorization: "Bearer " + authToken,
            "API-KEY": API_KEY,
          },
        }
      );

      if (response.status === 200) {
        const updated = products.map((product) =>
          product.id === productId
            ? { ...product, is_listed: !product.is_listed }
            : product
        );
        setProducts(updated);
      }
    } catch (error) {
      console.error("Toggle listing error:", error);
    }
  };

  /* ================= BULK ACTIONS ================= */
  const handleSelectProduct = (productId) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map(p => p.id));
    }
  };

  /* ================= IMAGE SLIDER ================= */
  const goToNextImage = (productId) => {
    setImageIndex((prev) => {
      const current = prev[productId] || 0;
      const product = products.find((p) => p.id === productId);
      const next = (current + 1) % product.image_paths.length;
      return { ...prev, [productId]: next };
    });
  };

  const goToPrevImage = (productId) => {
    setImageIndex((prev) => {
      const current = prev[productId] || 0;
      const product = products.find((p) => p.id === productId);
      const prevIndex =
        (current - 1 + product.image_paths.length) %
        product.image_paths.length;
      return { ...prev, [productId]: prevIndex };
    });
  };

  /* ================= STATS ================= */
  const totalProducts = allProducts.length;
  const listedProducts = allProducts.filter(p => p.is_listed).length;
  const delistedProducts = totalProducts - listedProducts;
  const totalValue = allProducts.reduce((sum, p) => sum + (p.price || 0), 0);
  const averageRating = allProducts.reduce((sum, p) => {
    const rating = reviewSummary[p.id]?.average_rating || 0;
    return sum + rating;
  }, 0) / (allProducts.length || 1);

  /* ================= RENDER STARS - FIXED ================= */
  const renderStars = (rating, size = "text-xs") => {
    const numRating = Number(rating);
    if (isNaN(numRating) || numRating === 0) {
      return (
        <div className="flex items-center gap-0.5">
          {[...Array(5)].map((_, i) => (
            <FaRegStar key={i} className={size + " text-gray-300"} />
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
          <FaStar key={i} className={size + " text-yellow-400"} />
        ))}
        {hasHalfStar && <FaStarHalfAlt className={size + " text-yellow-400"} />}
        {[...Array(emptyStars)].map((_, i) => (
          <FaRegStar key={i} className={size + " text-gray-300"} />
        ))}
      </div>
    );
  };

  /* ================= SEE ALL ================= */
  const handleSeeAll = () => {
    setShowAll(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
      <AdminNavbar onToggleSidebar={toggleSidebar} />

      <div className="flex">
        <AdminSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

        <main className={"flex-1 transition-all duration-300 " + (sidebarOpen ? 'lg:ml-72' : 'lg:ml-24')}>
          <div className="p-4 md:p-6 lg:p-8">
            
            {/* Header Section */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                    Manage Products
                  </h1>
                  <p className="text-gray-500 mt-1">Manage your EV charger inventory and reviews</p>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={handleAddProduct}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 hover:shadow-lg transition-all duration-300 hover:scale-105"
                  >
                    <FiPlus size={18} />
                    Add Product
                  </button>
                  <button
                    onClick={handleDelistedProducts}
                    className="bg-gradient-to-r from-red-500 to-red-600 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 hover:shadow-lg transition-all duration-300"
                  >
                    <FiTrash2 size={18} />
                    Delisted
                  </button>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Total Products</p>
                    <p className="text-2xl font-bold text-gray-800">{totalProducts}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <FaBox className="text-blue-600 text-2xl" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Listed Products</p>
                    <p className="text-2xl font-bold text-green-600">{listedProducts}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <MdVerified className="text-green-600 text-2xl" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Delisted Products</p>
                    <p className="text-2xl font-bold text-red-600">{delistedProducts}</p>
                  </div>
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                    <MdOutlineInventory className="text-red-600 text-2xl" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Total Value</p>
                    <p className="text-2xl font-bold text-purple-600">₹{(totalValue / 100000).toFixed(1)}L+</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <TbCurrencyRupee className="text-purple-600 text-2xl" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Avg Rating</p>
                    <div className="flex items-center gap-1">
                      <p className="text-2xl font-bold text-yellow-500">{averageRating.toFixed(1)}</p>
                      <MdStar className="text-yellow-400 text-xl" />
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                    <MdStar className="text-yellow-500 text-2xl" />
                  </div>
                </div>
              </div>
            </div>

            {/* Search and Filter Bar */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <form onSubmit={handleSearch} className="flex-1 relative">
                  <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search products by name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                    className={"px-4 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all duration-300 " + (
                      showFilters ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    )}
                  >
                    <FiFilter size={16} />
                    Filters
                  </button>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2.5 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="newest">Newest First</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="name-asc">Name: A to Z</option>
                    <option value="rating">Highest Rated</option>
                  </select>

                  <div className="flex bg-gray-100 rounded-xl p-1">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={"p-2 rounded-lg transition-all duration-300 " + (viewMode === "grid" ? 'bg-white shadow text-green-600' : 'text-gray-500')}
                    >
                      <HiOutlineViewGrid size={20} />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={"p-2 rounded-lg transition-all duration-300 " + (viewMode === "list" ? 'bg-white shadow text-green-600' : 'text-gray-500')}
                    >
                      <HiOutlineViewList size={20} />
                    </button>
                  </div>
                </div>
              </div>

              {showFilters && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <option value="all">All Products</option>
                        <option value="ac">AC Chargers</option>
                        <option value="dc">DC Chargers</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">₹{priceRange[0].toLocaleString()}</span>
                        <input
                          type="range"
                          min="0"
                          max="2000000"
                          step="50000"
                          value={priceRange[1]}
                          onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                          className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-500"
                        />
                        <span className="text-sm text-gray-500">₹{priceRange[1].toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="flex items-end">
                      <button
                        onClick={clearSearch}
                        className="w-full py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                      >
                        Reset Filters
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bulk Actions Bar */}
            {selectedProducts.length > 0 && (
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-4 mb-6 text-white flex items-center justify-between">
                <div>
                  <span className="font-semibold">{selectedProducts.length} products selected</span>
                </div>
                <div className="flex gap-3">
                  <button className="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition">
                    Bulk Delete
                  </button>
                  <button className="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition">
                    Bulk Delist
                  </button>
                  <button onClick={() => setSelectedProducts([])} className="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition">
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Products Grid/List View */}
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-green-500"></div>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl">
                <div className="text-6xl mb-4">📦</div>
                <p className="text-gray-500 text-lg">No products found</p>
                <button onClick={clearSearch} className="mt-4 text-green-600 hover:text-green-700 font-medium">
                  Clear all filters
                </button>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => {
                  const productRating = reviewSummary[product.id] || { average_rating: 0, review_count: 0 };
                  
                  return (
                    <div
                      key={product.id}
                      className={"bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 " + (
                        selectedProducts.includes(product.id) ? 'ring-2 ring-green-500' : ''
                      )}
                    >
                      <div className="relative z-10 p-3">
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(product.id)}
                          onChange={() => handleSelectProduct(product.id)}
                          className="w-4 h-4 rounded border-gray-300 text-green-500 focus:ring-green-500"
                        />
                      </div>

                      <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden group cursor-pointer"
                           onClick={() => handleProductView(product.id)}>
                        <img
                          src={product.image_paths?.[imageIndex[product.id] || 0] || 'https://via.placeholder.com/300'}
                          alt={product.name}
                          className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                        />
                        {product.image_paths?.length > 1 && (
                          <>
                            <button
                              onClick={(e) => { e.stopPropagation(); goToPrevImage(product.id); }}
                              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition"
                            >
                              <FiChevronLeft size={14} />
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); goToNextImage(product.id); }}
                              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition"
                            >
                              <FiChevronRight size={14} />
                            </button>
                          </>
                        )}
                        
                        <span className={"absolute top-3 right-3 px-2 py-1 rounded-lg text-xs font-semibold " + (
                          product.is_listed ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                        )}>
                          {product.is_listed ? 'Listed' : 'Delisted'}
                        </span>
                      </div>

                      <div className="p-4">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-bold text-gray-800 text-base line-clamp-1">{product.name}</h3>
                          {product.name?.toUpperCase().includes("DC") && (
                            <MdElectricBolt className="text-purple-500" size={16} />
                          )}
                        </div>
                        <p className="text-gray-500 text-xs mb-2">{product.model}</p>
                        
                        <div 
                          className="flex items-center gap-2 mb-2 cursor-pointer hover:bg-gray-50 p-1 rounded-lg transition"
                          onClick={() => openReviewsPopup(product)}
                        >
                          {renderStars(productRating.average_rating, "text-xs")}
                          <span className="text-xs text-gray-500">({productRating.review_count} reviews)</span>
                        </div>

                        <div className="mb-3">
                          <span className="text-xl font-bold text-green-600">₹{product.price?.toLocaleString()}</span>
                          {product.mrp && product.mrp > product.price && (
                            <span className="text-xs text-gray-400 line-through ml-2">₹{product.mrp?.toLocaleString()}</span>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => handleProductView(product.id)}
                            className="flex-1 bg-blue-500 text-white px-3 py-2 rounded-lg font-medium text-sm hover:bg-blue-600 transition flex items-center justify-center gap-1"
                          >
                            <FiEye size={14} /> View
                          </button>
                          <button
                            onClick={() => handleProductEdit(product.id)}
                            className="flex-1 bg-yellow-500 text-white px-3 py-2 rounded-lg font-medium text-sm hover:bg-yellow-600 transition flex items-center justify-center gap-1"
                          >
                            <FiEdit2 size={14} /> Edit
                          </button>
                          <button
                            onClick={() => handleToggleListing(product.id)}
                            className={"px-3 py-2 rounded-lg font-medium text-sm transition flex items-center justify-center gap-1 " + (
                              product.is_listed ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-green-500 text-white hover:bg-green-600'
                            )}
                          >
                            {product.is_listed ? 'Delist' : 'Show'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left">
                          <input
                            type="checkbox"
                            checked={selectedProducts.length === products.length && products.length > 0}
                            onChange={handleSelectAll}
                            className="w-4 h-4 rounded border-gray-300 text-green-500 focus:ring-green-500"
                          />
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Product</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Model</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Price</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Rating</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Status</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => {
                        const productRating = reviewSummary[product.id] || { average_rating: 0, review_count: 0 };
                        
                        return (
                          <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                            <td className="px-4 py-3">
                              <input
                                type="checkbox"
                                checked={selectedProducts.includes(product.id)}
                                onChange={() => handleSelectProduct(product.id)}
                                className="w-4 h-4 rounded border-gray-300 text-green-500 focus:ring-green-500"
                              />
                            </td>
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
                            <td className="px-4 py-3 font-semibold text-green-600">₹{product.price?.toLocaleString()}</td>
                            <td className="px-4 py-3">
                              <div 
                                className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-1 rounded-lg transition"
                                onClick={() => openReviewsPopup(product)}
                              >
                                {renderStars(productRating.average_rating, "text-xs")}
                                <span className="text-xs text-gray-500">({productRating.review_count})</span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className={"px-2 py-1 rounded-lg text-xs font-semibold " + (
                                product.is_listed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                              )}>
                                {product.is_listed ? 'Listed' : 'Delisted'}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex gap-2">
                                <button onClick={() => handleProductView(product.id)} className="p-1.5 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition">
                                  <FiEye size={14} />
                                </button>
                                <button onClick={() => handleProductEdit(product.id)} className="p-1.5 bg-yellow-100 text-yellow-600 rounded-lg hover:bg-yellow-200 transition">
                                  <FiEdit2 size={14} />
                                </button>
                                <button onClick={() => handleToggleListing(product.id)} className={"p-1.5 rounded-lg transition " + (
                                  product.is_listed ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-green-100 text-green-600 hover:bg-green-200'
                                )}>
                                  {product.is_listed ? 'Delist' : 'Show'}
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

            {/* See All Button */}
            {!showAll && products.length >= 8 && products.length < allProducts.length && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={handleSeeAll}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  See All Products ({allProducts.length - products.length} more)
                </button>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Reviews Popup Modal */}
      {reviewsPopupOpen && selectedProductForReviews && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex justify-center items-center z-[10000] p-4 animate-fadeIn overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full relative max-h-[85vh] overflow-y-auto animate-slideUp">
            <button
              className="absolute top-4 right-4 z-20 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-500 hover:bg-gradient-to-r hover:from-red-500 hover:to-rose-600 hover:text-white transition-all duration-300"
              onClick={() => setReviewsPopupOpen(false)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-yellow-100 rounded-xl">
                  <FaStar className="h-6 w-6 text-yellow-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Customer Reviews</h2>
                  <p className="text-sm text-gray-500">for {selectedProductForReviews.name}</p>
                </div>
              </div>

              {reviewSummary[selectedProductForReviews.id] && (
                <div className="mb-6 p-5 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-2xl">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Average Rating</p>
                      <div className="flex items-center gap-2">
                        <span className="text-4xl font-bold text-gray-800">
                          {reviewSummary[selectedProductForReviews.id].average_rating || 0}
                        </span>
                        {renderStars(reviewSummary[selectedProductForReviews.id].average_rating || 0, "text-xl")}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 mb-1">Total Reviews</p>
                      <p className="text-3xl font-bold text-gray-800">
                        {reviewSummary[selectedProductForReviews.id].review_count || 0}
                      </p>
                    </div>
                  </div>
                  
                  {reviewSummary[selectedProductForReviews.id].rating_breakdown && (
                    <div className="mt-4 pt-4 border-t border-amber-200">
                      {[5, 4, 3, 2, 1].map(star => (
                        <div key={star} className="flex items-center gap-3 mb-2">
                          <span className="text-sm w-8">{star} ★</span>
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-yellow-400 rounded-full" 
                              style={{ 
                                width: ((reviewSummary[selectedProductForReviews.id].rating_breakdown[star] / 
                                reviewSummary[selectedProductForReviews.id].review_count) * 100 || 0) + "%" 
                              }} 
                            />
                          </div>
                          <span className="text-xs text-gray-500 w-8">
                            {reviewSummary[selectedProductForReviews.id].rating_breakdown[star] || 0}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {loadingReviews ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-400 border-t-transparent"></div>
                </div>
              ) : productReviews.length > 0 ? (
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                  {productReviews.map((review) => (
                    <div key={review.id} className="bg-gray-50 rounded-xl p-5 border border-gray-100 hover:shadow-md transition-all duration-300">
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
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <FaCalendarAlt size={10} />
                          <span>
                            {new Date(review.created_at).toLocaleDateString("en-IN", { 
                              day: "numeric", 
                              month: "short", 
                              year: "numeric" 
                            })}
                          </span>
                        </div>
                      </div>
                      {review.review && (
                        <p className="text-gray-700 leading-relaxed mt-3 pl-12">{review.review}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-3">📝</div>
                  <p className="text-gray-500">No reviews yet for this product</p>
                  <p className="text-sm text-gray-400 mt-1">Be the first to share your experience!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(40px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.4s cubic-bezier(0.34, 1.2, 0.64, 1);
        }
      `}</style>
    </div>
  );
};

export default ManageProductsPage;