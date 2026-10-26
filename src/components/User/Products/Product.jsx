// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { FaShoppingCart, FaHeart, FaRegHeart, FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
// import { FiSearch, FiFilter, FiX, FiChevronLeft, FiChevronRight, FiZoomIn } from 'react-icons/fi';
// import { MdElectricBolt, MdSpeed, MdSecurity, MdVerified, MdFlashOn } from 'react-icons/md';
// import UserSidebar from '../User_sidebar';
// import UserNavbar from '../User_Navbar';
// import { useNavigate } from "react-router-dom";
// import { Link } from "react-router-dom";
// const BASE_URL_AND_PORT = "https://api.static.ev.transev.site";
// const API_KEY = "mlzuMoRFjdGhcFulLMaVtfwNAHycbBAf";

// const ProductPage = () => {
//   const [allProducts, setAllProducts] = useState([]);
//   const [displayedProducts, setDisplayedProducts] = useState([]);
//   const [filterType, setFilterType] = useState("ALL");
//   const [popupOpen, setPopupOpen] = useState(false);
//   const [popupContent, setPopupContent] = useState({});
//   const [popupImageIndex, setPopupImageIndex] = useState(0);
//   const [contactPopup, setContactPopup] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [cart, setCart] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [imageIndex, setImageIndex] = useState({});
//   const [wishlist, setWishlist] = useState([]);
//   const [showFilters, setShowFilters] = useState(false);
//   const [priceRange, setPriceRange] = useState([0, 2000000]);
//   const [powerRange, setPowerRange] = useState([0, 200]);
//   const [hoveredProduct, setHoveredProduct] = useState(null);
//   const [toastMessage, setToastMessage] = useState(null);
//   const [isMobile, setIsMobile] = useState(false);
//   const navigate = useNavigate();

//   // Function to format price in Indian format (e.g., 7,19,990)
//   const formatIndianPrice = (price) => {
//     if (!price && price !== 0) return '0';
//     const num = Number(price);
//     if (isNaN(num)) return '0';
    
//     // Convert to string and split into integer and decimal parts
//     let [integerPart, decimalPart] = num.toString().split('.');
    
//     // Format integer part in Indian style (last 3 digits, then groups of 2)
//     const lastThree = integerPart.slice(-3);
//     const otherNumbers = integerPart.slice(0, -3);
    
//     let formattedInteger;
//     if (otherNumbers !== '') {
//       formattedInteger = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree;
//     } else {
//       formattedInteger = lastThree;
//     }
    
//     // Add decimal part if exists
//     if (decimalPart) {
//       return formattedInteger + '.' + decimalPart;
//     }
//     return formattedInteger;
//   };

//   // Get static review count for a product
//   const getReviewCount = (product) => {
//     // Use product id to generate a consistent review count
//     // This ensures the same product always shows the same review count
//     const reviewMap = {
//       // You can customize review counts per product type
//       '120kw': 187,
//       '60kw': 156,
//       '30kw': 98,
//       '22kw': 234,
//       '7kw': 312,
//     };
    
//     const productName = (product.name + ' ' + product.model).toLowerCase();
    
//     if (productName.includes('120kw')) return reviewMap['120kw'];
//     if (productName.includes('60kw')) return reviewMap['60kw'];
//     if (productName.includes('30kw')) return reviewMap['30kw'];
//     if (productName.includes('22kw')) return reviewMap['22kw'];
//     if (productName.includes('7kw')) return reviewMap['7kw'];
    
//     // Default consistent review count based on product id
//     // This ensures the same product always shows the same count
//     const idSum = String(product.id).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
//     return 50 + (idSum % 200);
//   };

//   const showToast = (message, type = 'success') => {
//     setToastMessage({ message, type });
//     setTimeout(() => setToastMessage(null), 3000);
//   };

//   // Function to refresh cart count in navbar
//   const refreshCartCount = () => {
//     window.dispatchEvent(new CustomEvent('cartUpdated'));
//   };

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const token = localStorage.getItem('auth_token');
//         const res = await axios.get(`${BASE_URL_AND_PORT}/products/all`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'API-KEY': API_KEY,
//           },
//         });
//         setAllProducts(res.data);
//         setDisplayedProducts(res.data);
//         console.log('All products loaded:', res.data); 
//       } catch (error) {
//         console.error('Error fetching products:', error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProducts();

//     const savedWishlist = localStorage.getItem('wishlist');
//     if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
    
//     // Load cart items from localStorage or API
//     const loadCart = async () => {
//       const userId = localStorage.getItem('user_id');
//       if (userId) {
//         try {
//           const token = localStorage.getItem('auth_token');
//           const response = await axios.post(`${BASE_URL_AND_PORT}/cart/getcartdetails`, {
//             user_id: userId
//           }, {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               'API-KEY': API_KEY,
//             },
//           });
//           if (response.data && response.data.cart_items) {
//             const cartProductIds = response.data.cart_items.map(item => item.productid);
//             setCart(cartProductIds);
//           }
//         } catch (error) {
//           console.error('Error loading cart:', error);
//         }
//       }
//     };
//     loadCart();
//   }, []);

//   // Listen for cart update events
//   useEffect(() => {
//     const handleCartUpdate = () => {
//       const refreshCart = async () => {
//         const userId = localStorage.getItem('user_id');
//         if (userId) {
//           try {
//             const token = localStorage.getItem('auth_token');
//             const response = await axios.post(`${BASE_URL_AND_PORT}/cart/getcartdetails`, {
//               user_id: userId
//             }, {
//               headers: {
//                 Authorization: `Bearer ${token}`,
//                 'API-KEY': API_KEY,
//               },
//             });
//             if (response.data && response.data.cart_items) {
//               const cartProductIds = response.data.cart_items.map(item => item.productid);
//               setCart(cartProductIds);
//             }
//           } catch (error) {
//             console.error('Error refreshing cart:', error);
//           }
//         }
//       };
//       refreshCart();
//     };

//     window.addEventListener('cartUpdated', handleCartUpdate);
//     return () => window.removeEventListener('cartUpdated', handleCartUpdate);
//   }, []);

//   useEffect(() => {
//     let filtered = [...allProducts];
    
//     if (filterType !== "ALL") {
//       filtered = filtered.filter(p => {
//         const nameUpper = p.name?.toUpperCase() || '';
//         const modelUpper = p.model?.toUpperCase() || '';
        
//         if (filterType === "DC") {
//           return nameUpper.includes("DC") || 
//                  modelUpper.includes("DC") ||
//                  nameUpper.includes("60KW") ||
//                  nameUpper.includes("120KW") ||
//                  modelUpper.includes("60KW") ||
//                  modelUpper.includes("120KW");
//         } else if (filterType === "AC") {
//           return nameUpper.includes("AC") || modelUpper.includes("AC");
//         }
//         return true;
//       });
//     }
    
//     if (searchQuery) {
//       filtered = filtered.filter(p =>
//         p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         p.model?.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//     }
    
//     filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
    
//     if (powerRange[1] < 200) {
//       filtered = filtered.filter(p => {
//         const power = getChargerPower(p);
//         return power >= powerRange[0] && power <= powerRange[1];
//       });
//     }
    
//     setDisplayedProducts(filtered);
//   }, [filterType, allProducts, searchQuery, priceRange, powerRange]);

//   // Get charger power from product details or name/model
//   const getChargerPower = (product) => {
//     // First try to get rated power from details
//     if (product.details?.rated_power) {
//       const ratedPowerStr = product.details.rated_power.toString();
//       const match = ratedPowerStr.match(/(\d+(?:\.\d+)?)/);
//       if (match) {
//         const power = parseFloat(match[1]);
//         if (!isNaN(power)) return power;
//       }
//     }
    
//     // Fallback to name/model detection
//     const name = product.name?.toUpperCase() || '';
//     const model = product.model?.toUpperCase() || '';
    
//     if (name.includes("120KW") || model.includes("120KW")) return 120;
//     if (name.includes("60KW") || model.includes("60KW")) return 60;
//     if (name.includes("30KW") || model.includes("30KW")) return 30;
//     if (name.includes("22KW") || model.includes("22KW")) return 22;
//     if (name.includes("7KW") || model.includes("7KW")) return 7;
    
//     return isAC(product) ? 7 : 60;
//   };

//   // Get the maximum power among all products for percentage calculation
//   const getMaxPower = () => {
//     if (allProducts.length === 0) return 120;
//     let maxPower = 0;
//     allProducts.forEach(product => {
//       const power = getChargerPower(product);
//       if (power > maxPower) maxPower = power;
//     });
//     return maxPower || 120;
//   };

//   // Calculate power percentage based on actual rated power vs max power in the system
//   const getPowerPercentage = (product) => {
//     const power = getChargerPower(product);
//     const maxPower = getMaxPower();
//     return (power / maxPower) * 100;
//   };

//   // Get color for power bar based on the actual power value
//   const getPowerBarColor = (power) => {
//     if (power >= 100) return 'bg-red-500';
//     if (power >= 50) return 'bg-purple-500';
//     if (power >= 22) return 'bg-green-500';
//     return 'bg-blue-500';
//   };

//   const isAC = (product) => {
//     const name = product.name?.toUpperCase() || '';
//     const model = product.model?.toUpperCase() || '';
//     return name.includes("AC") || model.includes("AC");
//   };

//   const isDC60KW = (product) => {
//     const name = product.name?.toUpperCase() || '';
//     const model = product.model?.toUpperCase() || '';
//     return (name.includes("60KW") || model.includes("60KW")) && !isAC(product);
//   };

//   const isDC120KW = (product) => {
//     const name = product.name?.toUpperCase() || '';
//     const model = product.model?.toUpperCase() || '';
//     return (name.includes("120KW") || model.includes("120KW")) && !isAC(product);
//   };

//   const getChargerBadge = (product) => {
//     if (isDC120KW(product)) return { text: '⚡ 120kW Ultra Fast', color: 'bg-red-100 text-red-700', icon: '🔥' };
//     if (isDC60KW(product)) return { text: '⚡ 60kW Fast Charger', color: 'bg-purple-100 text-purple-700', icon: '🚀' };
//     if (!isAC(product)) return { text: 'DC Fast Charger', color: 'bg-blue-100 text-blue-700', icon: '⚡' };
//     const power = getChargerPower(product);
//     if (power >= 22) return { text: `AC ${power}kW`, color: 'bg-green-100 text-green-700', icon: '🔌' };
//     return { text: 'AC Charger', color: 'bg-green-100 text-green-700', icon: '🔌' };
//   };

//   const handlePopupOpen = async (id) => {
//     try {
//       const token = localStorage.getItem('auth_token');
//       const res = await axios.get(`${BASE_URL_AND_PORT}/products/get_by_id/${id}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'API-KEY': API_KEY,
//         },
//       });
//       setPopupContent(res.data);
//       setPopupImageIndex(0);
//       setPopupOpen(true);
//     } catch (error) {
//       console.error('Error fetching product details:', error);
//       showToast('Failed to load product details', 'error');
//     }
//   };

//   const goToNextImage = (id) => {
//     setImageIndex(prev => {
//       const current = prev[id] || 0;
//       const product = allProducts.find(p => p.id === id);
//       return { ...prev, [id]: (current + 1) % (product?.image_paths?.length || 1) };
//     });
//   };

//   const goToPrevImage = (id) => {
//     setImageIndex(prev => {
//       const current = prev[id] || 0;
//       const product = allProducts.find(p => p.id === id);
//       return { ...prev, [id]: (current - 1 + (product?.image_paths?.length || 1)) % (product?.image_paths?.length || 1) };
//     });
//   };

//   const handleAddToCart = async (id, price) => {
//     const userId = localStorage.getItem('user_id');
//     if (!userId) {
//       showToast("Please login first", 'error');
//       return;
//     }

//     if (!cart.includes(id)) {
//       setCart([...cart, id]);
//       try {
//         const token = localStorage.getItem('auth_token');
//         await axios.post(`${BASE_URL_AND_PORT}/cart/addtocart`, {
//           user_id: userId,
//           productid: id,
//           price: price.toString(),
//         }, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'API-KEY': API_KEY,
//           },
//         });
//         showToast("Product added to cart successfully!", 'success');
//         refreshCartCount();
//       } catch (error) {
//         console.error('Error adding to cart:', error);
//         showToast("Failed to add to cart", 'error');
//         setCart(cart.filter(cartId => cartId !== id));
//       }
//     } else {
//       showToast("Product already in cart", 'info');
//     }
//   };

//   const handleRemoveFromCart = async (id) => {
//     const userId = localStorage.getItem('user_id');
//     if (!userId) return;

//     setCart(cart.filter(cartId => cartId !== id));
//     try {
//       const token = localStorage.getItem('auth_token');
//       await axios.post(`${BASE_URL_AND_PORT}/cart/removefromcart`, {
//         user_id: userId,
//         productid: id,
//       }, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'API-KEY': API_KEY,
//         },
//       });
//       showToast("Product removed from cart", 'info');
//       refreshCartCount();
//     } catch (error) {
//       console.error('Error removing from cart:', error);
//       showToast("Failed to remove from cart", 'error');
//       const response = await axios.post(`${BASE_URL_AND_PORT}/cart/getcartdetails`, {
//         user_id: userId
//       }, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'API-KEY': API_KEY,
//         },
//       });
//       if (response.data && response.data.cart_items) {
//         const cartProductIds = response.data.cart_items.map(item => item.productid);
//         setCart(cartProductIds);
//       }
//     }
//   };

//   const toggleWishlist = (productId) => {
//     let newWishlist;
//     if (wishlist.includes(productId)) {
//       newWishlist = wishlist.filter(id => id !== productId);
//       showToast("Removed from wishlist", 'info');
//     } else {
//       newWishlist = [...wishlist, productId];
//       showToast("Added to wishlist", 'success');
//     }
//     setWishlist(newWishlist);
//     localStorage.setItem('wishlist', JSON.stringify(newWishlist));
//   };

//   const getRating = (product) => {
//     if (isDC120KW(product)) return 4.9;
//     if (isDC60KW(product)) return 4.8;
//     return 4.5;
//   };

//   const renderStars = (rating) => {
//     const stars = [];
//     const fullStars = Math.floor(rating);
//     const hasHalfStar = rating % 1 >= 0.5;
    
//     for (let i = 0; i < fullStars; i++) {
//       stars.push(<FaStar key={i} className="text-yellow-400" />);
//     }
//     if (hasHalfStar) {
//       stars.push(<FaStarHalfAlt key="half" className="text-yellow-400" />);
//     }
//     while (stars.length < 5) {
//       stars.push(<FaRegStar key={stars.length} className="text-yellow-400" />);
//     }
//     return stars;
//   };

//   useEffect(() => {
//     window.scrollTo({ top: 0, left: 0, behavior: "auto" });
//   }, []);

//   const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

//   // Handle responsive sidebar state
//   useEffect(() => {
//     const handleResize = () => {
//       const mobile = window.innerWidth < 768;
//       setIsMobile(mobile);
//       if (window.innerWidth >= 1024) {
//         setSidebarOpen(true);
//       } else if (window.innerWidth < 1024 && window.innerWidth >= 768) {
//         setSidebarOpen(false);
//       } else {
//         setSidebarOpen(false);
//       }
//     };
    
//     handleResize();
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   return (
//     <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//       <UserNavbar onToggleSidebar={toggleSidebar} />
      
//       <div className="flex flex-1 relative">
//         {/* Sidebar */}
//         <UserSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

//         {/* Main Content - Dynamic margin based on sidebar state */}
//         <main 
//           className={`
//             flex-1 transition-all duration-300 ease-in-out w-full
//             ${sidebarOpen ? 'lg:ml-72' : 'lg:ml-24'}
//             ${isMobile && sidebarOpen ? 'overflow-hidden' : ''}
//           `}
//         >
//           <div className="p-4 md:p-6 lg:p-8">
//             {/* Toast Notification */}
//             {toastMessage && (
//               <div className={`fixed top-20 right-4 z-50 animate-slideIn ${
//                 toastMessage.type === 'success' ? 'bg-green-500' : 
//                 toastMessage.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
//               } text-white px-6 py-3 rounded-lg shadow-lg`}>
//                 {toastMessage.message}
//               </div>
//             )}

//             {/* Hero Section */}
//             <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-xl mb-6 md:mb-8">
//               <div className="absolute inset-0 bg-black opacity-20"></div>
//               <div className="relative z-10 px-4 py-8 md:px-8 md:py-12 lg:px-12 lg:py-16">
//                 <div className="max-w-2xl">
//                   <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 md:mb-4">Discover Our EV Chargers</h1>
//                   <p className="text-blue-100 text-sm md:text-base lg:text-lg mb-4 md:mb-6">
//                     From 3.3kW home chargers to 120kW ultra-fast DC chargers. Find the perfect charging solution for your needs.
//                   </p>
//                   <div className="flex gap-3 md:gap-4 flex-wrap">
//                     <button className="bg-white text-blue-600 px-4 md:px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition text-sm md:text-base">Shop Now</button>
//                     <Link to="/about">
//                       <button className="border-2 border-white text-white px-4 md:px-6 py-2 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition text-sm md:text-base">
//                         Learn More
//                       </button>
//                     </Link>
//                   </div>
//                 </div>
//               </div>
//               <div className="absolute right-0 bottom-0 opacity-10 hidden md:block">
//                 <MdElectricBolt size={200} className="text-white" />
//               </div>
//             </div>

//             {/* Quick Category Filters */}
//             <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
//               <button
//                 onClick={() => { setFilterType('ALL'); setSearchQuery(''); setPowerRange([0, 200]); }}
//                 className={`px-4 py-2 rounded-full text-sm font-semibold transition whitespace-nowrap ${filterType === 'ALL' && !searchQuery ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
//               >
//                 All Products
//               </button>
//               <button
//                 onClick={() => { setFilterType('AC'); setSearchQuery(''); setPowerRange([0, 200]); }}
//                 className={`px-4 py-2 rounded-full text-sm font-semibold transition whitespace-nowrap ${filterType === 'AC' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
//               >
//                 🔌 AC Chargers
//               </button>
//               <button
//                 onClick={() => { setFilterType('DC'); setSearchQuery(''); setPowerRange([0, 200]); }}
//                 className={`px-4 py-2 rounded-full text-sm font-semibold transition whitespace-nowrap ${filterType === 'DC' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
//               >
//                 ⚡ All DC Chargers
//               </button>
//             </div>

//             {/* Controls Bar */}
//             <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 md:p-4 mb-6">
//               <div className="flex flex-col md:flex-row gap-3 md:gap-4 items-stretch md:items-center justify-between">
//                 <div className="relative w-full md:w-96">
//                   <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
//                   <input
//                     type="text"
//                     className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
//                     placeholder="Search by name or power (e.g., 60kW, 120kW)..."
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                   />
//                   {searchQuery && (
//                     <button
//                       onClick={() => setSearchQuery('')}
//                       className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                     >
//                       <FiX size={18} />
//                     </button>
//                   )}
//                 </div>

//                 <div className="flex gap-3 w-full md:w-auto">
//                   <select
//                     value={filterType}
//                     onChange={(e) => setFilterType(e.target.value)}
//                     className="flex-1 md:flex-none px-4 py-2.5 border border-gray-300 rounded-lg bg-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
//                   >
//                     <option value="ALL">All Chargers</option>
//                     <option value="AC">AC Charger (7kW-22kW)</option>
//                     <option value="DC">DC Fast Charger (30kW-120kW)</option>
//                   </select>

//                   <button
//                     onClick={() => setShowFilters(!showFilters)}
//                     className="flex-1 md:flex-none px-4 py-2.5 border border-gray-300 rounded-lg bg-white font-medium flex items-center justify-center gap-2 hover:bg-gray-50 transition text-sm md:text-base"
//                   >
//                     <FiFilter size={18} />
//                     Filters
//                   </button>
//                 </div>
//               </div>

//               {showFilters && (
//                 <div className="mt-4 pt-4 border-t border-gray-200">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">Price Range: ₹{formatIndianPrice(priceRange[0])} - ₹{formatIndianPrice(priceRange[1])}</label>
//                       <input
//                         type="range"
//                         min="0"
//                         max="2000000"
//                         step="10000"
//                         value={priceRange[1]}
//                         onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
//                         className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">Power Range: {powerRange[0]}kW - {powerRange[1]}kW</label>
//                       <input
//                         type="range"
//                         min="0"
//                         max="200"
//                         step="5"
//                         value={powerRange[1]}
//                         onChange={(e) => setPowerRange([powerRange[0], parseInt(e.target.value)])}
//                         className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
//                       />
//                       <div className="flex justify-between text-xs text-gray-500 mt-1">
//                         <span>7kW</span>
//                         <span>22kW</span>
//                         <span>30kW</span>
//                         <span>60kW</span>
//                         <span>120kW</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Products Grid */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
//               {loading ? (
//                 <div className="col-span-full flex justify-center py-20">
//                   <div className="animate-spin rounded-full h-12 w-12 md:h-16 md:w-16 border-t-4 border-b-4 border-blue-600"></div>
//                 </div>
//               ) : displayedProducts.length === 0 ? (
//                 <div className="col-span-full text-center py-20">
//                   <div className="text-gray-400 text-5xl md:text-6xl mb-4">🔌</div>
//                   <p className="text-gray-500 text-base md:text-lg">No products found matching your criteria.</p>
//                   <p className="text-gray-400 text-sm mt-2">Try searching for "60kW" or "120kW" to find DC fast chargers.</p>
//                   <button
//                     onClick={() => { setSearchQuery(''); setFilterType('ALL'); setPriceRange([0, 2000000]); setPowerRange([0, 200]); }}
//                     className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
//                   >
//                     Clear all filters
//                   </button>
//                 </div>
//               ) : (
//                 displayedProducts.map((product) => {
//                   const rating = getRating(product);
//                   const chargerPower = getChargerPower(product);
//                   const badge = getChargerBadge(product);
//                   const isDCProduct = !isAC(product);
//                   const powerPercentage = getPowerPercentage(product);
//                   const powerBarColor = getPowerBarColor(chargerPower);
//                   const reviewCount = getReviewCount(product);
                  
//                   return (
//                     <div
//                       key={product.id}
//                       className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:-translate-y-1"
//                       onMouseEnter={() => setHoveredProduct(product.id)}
//                       onMouseLeave={() => setHoveredProduct(null)}
//                     >
//                       <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 h-56 md:h-64 overflow-hidden cursor-pointer">
//                         <img
//                           src={product.image_paths?.[imageIndex[product.id] || 0] || 'https://via.placeholder.com/300'}
//                           alt={product.name}
//                           className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
//                           onClick={() => handlePopupOpen(product.id)}
//                         />
                        
//                         {/* Power Badge */}
//                         <div className="absolute top-3 left-3 z-10">
//                           <span className={`text-xs font-semibold px-2 py-1 rounded-full ${badge.color}`}>
//                             {badge.icon} {badge.text}
//                           </span>
//                         </div>

//                         {/* Special Badge for 60kW and 120kW */}
//                         {(isDC60KW(product) || isDC120KW(product)) && (
//                           <div className="absolute top-3 right-3 z-10">
//                             <span className={`text-xs font-bold px-2 py-1 rounded-full ${isDC120KW(product) ? 'bg-red-500 text-white' : 'bg-orange-500 text-white'}`}>
//                               {isDC120KW(product) ? 'ULTRA FAST' : 'FAST CHARGE'}
//                             </span>
//                           </div>
//                         )}

//                         {hoveredProduct === product.id && (
//                           <div 
//                             className="absolute bottom-4 left-0 right-0 flex items-center justify-center transition-all duration-300 cursor-pointer"
//                             onClick={() => handlePopupOpen(product.id)}
//                           >
//                             <button className="bg-black/40 backdrop-blur-sm border-2 border-emerald-400 rounded-full px-4 py-2 flex items-center gap-2 text-emerald-400 text-sm font-bold shadow-lg transform transition-all duration-300 hover:scale-105 hover:bg-black/60 hover:border-emerald-300 hover:text-emerald-300 active:scale-95">
//                               <FiZoomIn size={14} />
//                               <span>Quick View</span>
//                             </button>
//                           </div>
//                         )}
                        
//                         <button
//                           onClick={() => toggleWishlist(product.id)}
//                           className="absolute bottom-3 right-3 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-red-50 transition z-10"
//                         >
//                           {wishlist.includes(product.id) ? (
//                             <FaHeart className="text-red-500" size={16} />
//                           ) : (
//                             <FaRegHeart className="text-gray-400 hover:text-red-500" size={16} />
//                           )}
//                         </button>

//                         {product.image_paths?.length > 1 && (
//                           <>
//                             <button
//                               onClick={(e) => { e.stopPropagation(); goToPrevImage(product.id); }}
//                               className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition z-10"
//                             >
//                               <FiChevronLeft size={14} />
//                             </button>
//                             <button
//                               onClick={(e) => { e.stopPropagation(); goToNextImage(product.id); }}
//                               className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition z-10"
//                             >
//                               <FiChevronRight size={14} />
//                             </button>
//                           </>
//                         )}
//                       </div>

//                       <div className="p-4">
//                         <div className="flex items-center justify-between mb-1">
//                           <h3 className="font-bold text-gray-800 text-base md:text-lg line-clamp-1">{product.name}</h3>
//                           {isDCProduct && <MdFlashOn className="text-purple-500" size={18} />}
//                         </div>
//                         <p className="text-gray-500 text-xs md:text-sm mb-2">{product.model}</p>
                        
//                         {/* Power Indicator Bar */}
//                         <div className="mb-2">
//                           <div className="flex justify-between text-xs text-gray-500 mb-1">
//                             <span>Rated Power</span>
//                             <span className="font-semibold">{chargerPower} kW</span>
//                           </div>
//                           <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
//                             <div 
//                               className={`h-full rounded-full ${powerBarColor} transition-all duration-500`}
//                               style={{ width: `${powerPercentage}%` }}
//                             />
//                           </div>
//                         </div>

//                         <div className="flex items-center gap-1 mb-2">
//                           {renderStars(rating)}
//                           <span className="text-xs text-gray-500 ml-1">({reviewCount} reviews)</span>
//                         </div>

//                         <div className="mb-3">
//                           <span className="text-xl md:text-2xl font-bold text-blue-600">₹{formatIndianPrice(product.price)}</span>
//                           {product.mrp && product.mrp > product.price && (
//                             <span className="text-xs md:text-sm text-gray-400 line-through ml-2">₹{formatIndianPrice(product.mrp)}</span>
//                           )}
//                           {isDCProduct && (
//                             <span className="text-xs text-gray-500 ml-2">+ GST</span>
//                           )}
//                         </div>

//                         {isAC(product) ? (
//                           product.quantity > 0 ? (
//                             <button
//                               onClick={() => handleAddToCart(product.id, product.price)}
//                               className={`w-full py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 transition text-sm md:text-base ${cart.includes(product.id) ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
//                             >
//                               <FaShoppingCart size={14} />
//                               {cart.includes(product.id) ? 'Added to Cart' : 'Add to Cart'}
//                             </button>
//                           ) : (
//                             <button className="w-full py-2.5 rounded-lg font-semibold bg-gray-300 text-gray-500 cursor-not-allowed text-sm md:text-base">
//                               Out of Stock
//                             </button>
//                           )
//                         ) : (
//                           <button
//                             onClick={() => setContactPopup(true)}
//                             className="w-full py-2.5 rounded-lg font-semibold bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white transition text-sm md:text-base"
//                           >
//                             {isDC60KW(product) ? 'Get Quote for 60kW' : isDC120KW(product) ? 'Get Quote for 120kW' : 'Contact Sales Team'}
//                           </button>
//                         )}
//                       </div>
//                     </div>
//                   );
//                 })
//               )}
//             </div>
//           </div>
//         </main>
//       </div>

//       {/* Contact Popup */}
//       {contactPopup && (
//         <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[9999] animate-fadeIn p-4">
//           <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
//             <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4">
//               <h3 className="text-xl font-bold text-white">Contact Sales Team</h3>
//             </div>
//             <div className="p-6">
//               <p className="text-gray-600 mb-4">
//                 For enquiries about <span className="font-semibold text-orange-600">DC Fast Chargers (60kW, 120kW)</span>, please reach out to our dedicated sales team.
//               </p>
//               <div className="bg-gray-50 rounded-lg p-4 mb-6">
//                 <p className="text-sm text-gray-500 mb-1">Email us at</p>
//                 <a
//                   href="mailto:tgwbin@gmail.com"
//                   className="text-lg font-semibold text-blue-600 hover:underline break-all"
//                 >
//                   tgwbin@gmail.com
//                 </a>
//               </div>
//               <button
//                 onClick={() => setContactPopup(false)}
//                 className="w-full py-3 bg-gray-800 hover:bg-gray-900 text-white rounded-lg font-semibold transition"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Product Details Popup */}
//       {popupOpen && popupContent.id && (
//         <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-[9999] p-4 animate-fadeIn overflow-y-auto">
//           <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl">
//             <button
//               className="absolute top-4 right-4 z-10 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-all duration-300 hover:scale-110"
//               onClick={() => setPopupOpen(false)}
//             >
//               <FiX size={18} />
//             </button>

//             <div className="p-4 md:p-6 lg:p-8">
//               <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
//                 {/* Left - Image Gallery */}
//                 <div className="lg:w-1/2">
//                   <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden shadow-lg">
//                     <img
//                       src={popupContent.image_paths?.[popupImageIndex] || 'https://via.placeholder.com/400'}
//                       alt={popupContent.name}
//                       className="w-full h-64 md:h-80 lg:h-96 object-contain p-4 cursor-pointer transition-transform duration-300 hover:scale-105"
//                       onClick={() => setPopupImageIndex(prev => (prev + 1) % (popupContent.image_paths?.length || 1))}
//                     />
//                     {popupContent.image_paths?.length > 1 && (
//                       <>
//                         <button
//                           onClick={() => setPopupImageIndex(prev => (prev - 1 + popupContent.image_paths.length) % popupContent.image_paths.length)}
//                           className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-all duration-300 hover:scale-110"
//                         >
//                           <FiChevronLeft size={18} />
//                         </button>
//                         <button
//                           onClick={() => setPopupImageIndex(prev => (prev + 1) % popupContent.image_paths.length)}
//                           className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-all duration-300 hover:scale-110"
//                         >
//                           <FiChevronRight size={18} />
//                         </button>
//                       </>
//                     )}
//                     <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
//                       Click image to see next
//                     </div>
//                   </div>
                  
//                   {/* Thumbnails */}
//                   {popupContent.image_paths?.length > 1 && (
//                     <div className="flex gap-2 mt-4 justify-center flex-wrap">
//                       {popupContent.image_paths.map((img, idx) => (
//                         <button
//                           key={idx}
//                           onClick={() => setPopupImageIndex(idx)}
//                           className={`w-14 h-14 md:w-16 md:h-16 rounded-xl overflow-hidden border-2 transition-all duration-300 hover:scale-105 ${
//                             popupImageIndex === idx 
//                               ? 'border-blue-500 ring-2 ring-blue-200 shadow-md' 
//                               : 'border-gray-200 hover:border-gray-300'
//                           }`}
//                         >
//                           <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
//                         </button>
//                       ))}
//                     </div>
//                   )}
//                 </div>

//                 {/* Right - Product Details */}
//                 <div className="lg:w-1/2">
//                   {/* Badges */}
//                   <div className="mb-4 flex flex-wrap gap-2">
//                     <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-semibold ${
//                       isAC(popupContent) 
//                         ? 'bg-green-100 text-green-700' 
//                         : 'bg-purple-100 text-purple-700'
//                     }`}>
//                       {isAC(popupContent) ? '🔌 AC Charger' : `⚡ DC Fast Charger ${getChargerPower(popupContent)}kW`}
//                     </span>
//                     {(isDC60KW(popupContent) || isDC120KW(popupContent)) && (
//                       <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-semibold ${
//                         isDC120KW(popupContent) 
//                           ? 'bg-red-100 text-red-700' 
//                           : 'bg-orange-100 text-orange-700'
//                       }`}>
//                         {isDC120KW(popupContent) ? '🔥 Ultra Fast Charging' : '🚀 Fast Charge Technology'}
//                       </span>
//                     )}
//                   </div>
                  
//                   <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 mb-2">{popupContent.name}</h2>
//                   <p className="text-gray-500 text-sm md:text-base mb-4">Model: {popupContent.model}</p>
                  
//                   {/* Rating */}
//                   <div className="flex items-center gap-4 mb-4">
//                     <div className="flex items-center gap-1">
//                       {renderStars(getRating(popupContent))}
//                     </div>
//                     <span className="text-sm text-gray-500">({getReviewCount(popupContent)} customer reviews)</span>
//                   </div>

//                   {/* Price */}
//                   <div className="mb-4">
//                     <span className="text-3xl md:text-4xl font-bold text-blue-600">₹{formatIndianPrice(popupContent.price)}</span>
//                     {popupContent.mrp && popupContent.mrp > popupContent.price && (
//                       <span className="text-gray-400 line-through ml-2 text-lg">₹{formatIndianPrice(popupContent.mrp)}</span>
//                     )}
//                     {!isAC(popupContent) && (
//                       <span className="text-sm text-gray-500 ml-2">+ GST</span>
//                     )}
//                   </div>

//                   {/* Key Features */}
//                   <div className="grid grid-cols-2 gap-3 mb-6">
//                     <div className="flex items-center gap-2 text-sm text-gray-600 p-2 bg-gray-50 rounded-lg">
//                       <MdVerified className="text-green-600" size={18} />
//                       <span>12 Months Warranty</span>
//                     </div>
//                     <div className="flex items-center gap-2 text-sm text-gray-600 p-2 bg-gray-50 rounded-lg">
//                       <MdSecurity className="text-blue-600" size={18} />
//                       <span>Safety Certified</span>
//                     </div>
//                     {popupContent.details?.cable_length && (
//                       <div className="flex items-center gap-2 text-sm text-gray-600 p-2 bg-gray-50 rounded-lg">
//                         <MdSpeed className="text-orange-600" size={18} />
//                         <span>Cable: {popupContent.details.cable_length}</span>
//                       </div>
//                     )}
//                   </div>

//                   {/* Action Buttons */}
//                   <div className="space-y-3">
//                     {isAC(popupContent) ? (
//                       popupContent.quantity > 0 ? (
//                         <button
//                           onClick={() => handleAddToCart(popupContent.id, popupContent.price)}
//                           className={`w-full py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${
//                             cart.includes(popupContent.id) 
//                               ? 'bg-green-500 hover:bg-green-600' 
//                               : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
//                           } text-white shadow-md hover:shadow-lg`}
//                         >
//                           <FaShoppingCart size={18} />
//                           {cart.includes(popupContent.id) ? 'Added to Cart' : 'Add to Cart'}
//                         </button>
//                       ) : (
//                         <button className="w-full py-3.5 bg-gray-300 text-gray-500 rounded-xl font-semibold cursor-not-allowed">
//                           Out of Stock
//                         </button>
//                       )
//                     ) : (
//                       <button
//                         onClick={() => {
//                           setContactPopup(true);
//                           setPopupOpen(false);
//                         }}
//                         className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
//                       >
//                         Request Quote for {getChargerPower(popupContent)}kW DC Charger
//                       </button>
//                     )}
                    
//                     <button
//                       onClick={() => toggleWishlist(popupContent.id)}
//                       className={`w-full py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 border-2 transition-all duration-300 ${
//                         wishlist.includes(popupContent.id) 
//                           ? 'border-red-500 text-red-500 bg-red-50' 
//                           : 'border-gray-300 text-gray-700 hover:border-blue-500 hover:bg-blue-50'
//                       }`}
//                     >
//                       {wishlist.includes(popupContent.id) ? <FaHeart /> : <FaRegHeart />}
//                       {wishlist.includes(popupContent.id) ? 'Saved to Wishlist' : 'Add to Wishlist'}
//                     </button>
//                   </div>

//                   {/* Disclaimer */}
//                   <div className="mt-6 p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border border-red-200">
//                     <p className="text-sm text-red-700">
//                       <strong>⚠️ Disclaimer:</strong> Cancellations & Refunds Policy applies.
//                       <button
//                         onClick={() => navigate("/cancellation-policy")}
//                         className="ml-2 text-red-600 underline hover:text-red-800 font-medium"
//                       >
//                         Read more →
//                       </button>
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {/* Technical Specifications */}
//               {popupContent.details && Object.keys(popupContent.details).filter(k => popupContent.details[k] && popupContent.details[k] !== 'N/A').length > 0 && (
//                 <div className="mt-10">
//                   <div className="flex items-center justify-between mb-6">
//                     <div className="flex items-center gap-3">
//                       <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"></div>
//                       <div>
//                         <h3 className="text-xl md:text-2xl font-bold text-gray-800">Technical Specifications</h3>
//                         <p className="text-sm text-gray-500 mt-0.5">Complete technical details and specifications</p>
//                       </div>
//                     </div>
//                     <div className="text-xs text-gray-400 bg-gray-100 px-3 py-1.5 rounded-full">
//                       {Object.entries(popupContent.details).filter(([_, v]) => v && v !== 'N/A').length} Specifications
//                     </div>
//                   </div>
                  
//                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//                     {Object.entries(popupContent.details).map(([key, value]) => {
//                       if (!value || value === 'N/A') return null;
                      
//                       const labels = {
//                         phase: 'Phase', cooling: 'Cooling Type', rated_power: 'Rated Power',
//                         ingress_protection: 'IP Rating', current: 'Current Rating',
//                         display: 'Display Type', gun_type: 'Gun Type', material: 'Material',
//                         dimensions: 'Dimensions', protection: 'Protection Features',
//                         communication: 'Communication', cable_length: 'Cable Length',
//                         input_voltage: 'Input Voltage', ouput_voltage: 'Output Voltage',
//                         operatingtemps: 'Operating Temperature', ocpp_present: 'OCPP Support',
//                         efficiency: 'Efficiency', warranty: 'Warranty', weight: 'Weight',
//                         frequency: 'Frequency', mountingtype: 'Mounting Type'
//                       };
                      
//                       const getIcon = (key) => {
//                         const icons = {
//                           rated_power: '⚡', current: '🔌', efficiency: '📊', warranty: '🛡️',
//                           weight: '⚖️', dimensions: '📏', operatingtemps: '🌡️', phase: '🔄',
//                           cooling: '❄️', ingress_protection: '💧', display: '🖥️',
//                           gun_type: '🔫', material: '🏗️', protection: '🛡️',
//                           communication: '📡', cable_length: '📏', input_voltage: '⚡',
//                           ouput_voltage: '⚡', ocpp_present: '🌐', frequency: '📶',
//                           mountingtype: '🔧'
//                         };
//                         return icons[key] || '🔧';
//                       };
                      
//                       const getBadgeColor = (key, value) => {
//                         if (key === 'rated_power' && value.toString().includes('kW')) {
//                           return 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200';
//                         }
//                         if (key === 'efficiency' && value.toString().includes('%')) {
//                           return 'bg-gradient-to-br from-green-50 to-green-100 border-green-200';
//                         }
//                         if (key === 'warranty') {
//                           return 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200';
//                         }
//                         if (key === 'operatingtemps') {
//                           return 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200';
//                         }
//                         return 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200';
//                       };
                      
//                       const formatValue = (value) => {
//                         if (typeof value === 'boolean') {
//                           return value ? (
//                             <span className="inline-flex items-center gap-1 text-green-600">
//                               <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                               </svg>
//                               Supported
//                             </span>
//                           ) : (
//                             <span className="inline-flex items-center gap-1 text-gray-400">
//                               <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                               </svg>
//                               Not Supported
//                             </span>
//                           );
//                         }
//                         return value;
//                       };
                      
//                       return (
//                         <div 
//                           key={key} 
//                           className={`group rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 ${getBadgeColor(key, value)} border`}
//                         >
//                           <div className="flex items-start gap-3">
//                             <div className="text-2xl">{getIcon(key)}</div>
//                             <div className="flex-1">
//                               <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
//                                 {labels[key] || key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
//                               </div>
//                               <div className="font-bold text-gray-800 break-words text-base">
//                                 {formatValue(value)}
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
      
//       <style>{`
//         @keyframes fadeIn {
//           from { opacity: 0; }
//           to { opacity: 1; }
//         }
//         @keyframes slideIn {
//           from { transform: translateX(100%); opacity: 0; }
//           to { transform: translateX(0); opacity: 1; }
//         }
//         .animate-fadeIn {
//           animation: fadeIn 0.2s ease-out;
//         }
//         .animate-slideIn {
//           animation: slideIn 0.3s ease-out;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default ProductPage;

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { FaShoppingCart, FaHeart, FaRegHeart, FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
// import { FiSearch, FiFilter, FiX, FiChevronLeft, FiChevronRight, FiZoomIn } from 'react-icons/fi';
// import { MdElectricBolt, MdSpeed, MdSecurity, MdVerified, MdFlashOn } from 'react-icons/md';
// import UserSidebar from '../User_sidebar';
// import UserNavbar from '../User_Navbar';
// import { useNavigate } from "react-router-dom";
// import { Link } from "react-router-dom";

// const BASE_URL_AND_PORT = "https://api.static.ev.transev.site";
// const API_KEY = "mlzuMoRFjdGhcFulLMaVtfwNAHycbBAf";

// const ProductPage = () => {
//   const [allProducts, setAllProducts] = useState([]);
//   const [displayedProducts, setDisplayedProducts] = useState([]);
//   const [filterType, setFilterType] = useState("ALL");
//   const [popupOpen, setPopupOpen] = useState(false);
//   const [popupContent, setPopupContent] = useState({});
//   const [popupImageIndex, setPopupImageIndex] = useState(0);
//   const [contactPopup, setContactPopup] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [cart, setCart] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [imageIndex, setImageIndex] = useState({});
//   const [wishlist, setWishlist] = useState([]);
//   const [showFilters, setShowFilters] = useState(false);
//   const [priceRange, setPriceRange] = useState([0, 2000000]);
//   const [powerRange, setPowerRange] = useState([0, 200]);
//   const [hoveredProduct, setHoveredProduct] = useState(null);
//   const [toastMessage, setToastMessage] = useState(null);
//   const [isMobile, setIsMobile] = useState(false);
//   const navigate = useNavigate();

//   // Function to format price in Indian format (e.g., 7,19,990)
//   const formatIndianPrice = (price) => {
//     if (!price && price !== 0) return '0';
//     const num = Number(price);
//     if (isNaN(num)) return '0';
    
//     let [integerPart, decimalPart] = num.toString().split('.');
//     const lastThree = integerPart.slice(-3);
//     const otherNumbers = integerPart.slice(0, -3);
    
//     let formattedInteger;
//     if (otherNumbers !== '') {
//       formattedInteger = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree;
//     } else {
//       formattedInteger = lastThree;
//     }
    
//     if (decimalPart) {
//       return formattedInteger + '.' + decimalPart;
//     }
//     return formattedInteger;
//   };

//   // Get charger power from product details or name/model - IMPROVED
//   const getChargerPower = (product) => {
//     if (!product) return 0;
    
//     // First try to get rated power from details
//     if (product.details?.rated_power) {
//       const ratedPowerStr = product.details.rated_power.toString();
//       const match = ratedPowerStr.match(/(\d+(?:\.\d+)?)/);
//       if (match) {
//         const power = parseFloat(match[1]);
//         if (!isNaN(power) && power > 0) return power;
//       }
//     }
    
//     // Fallback to name/model detection - with better accuracy
//     const name = product.name?.toUpperCase() || '';
//     const model = product.model?.toUpperCase() || '';
//     const fullText = name + ' ' + model;
    
//     // Check for specific power ratings
//     if (fullText.includes('120KW') || fullText.includes('120 KW')) return 120;
//     if (fullText.includes('60KW') || fullText.includes('60 KW')) return 60;
//     if (fullText.includes('30KW') || fullText.includes('30 KW')) return 30;
//     if (fullText.includes('22KW') || fullText.includes('22 KW')) return 22;
//     if (fullText.includes('7KW') || fullText.includes('7 KW')) return 7;
//     if (fullText.includes('3.3KW') || fullText.includes('3.3 KW')) return 3.3;
    
//     // For AC chargers without clear power rating, default to 7kW
//     if (isAC(product)) return 7;
    
//     // For DC chargers without clear power rating, default to 60kW
//     return 60;
//   };

//   // Get the maximum power among all products for percentage calculation
//   const getMaxPower = () => {
//     if (allProducts.length === 0) return 120;
//     let maxPower = 0;
//     allProducts.forEach(product => {
//       const power = getChargerPower(product);
//       if (power > maxPower) maxPower = power;
//     });
//     return maxPower || 120;
//   };

//   // Calculate power percentage based on actual rated power vs max power in the system
//   const getPowerPercentage = (product) => {
//     const power = getChargerPower(product);
//     const maxPower = getMaxPower();
//     return (power / maxPower) * 100;
//   };

//   // Get color for power bar based on the actual power value
//   const getPowerBarColor = (power) => {
//     if (power >= 100) return 'bg-red-500';
//     if (power >= 50) return 'bg-purple-500';
//     if (power >= 22) return 'bg-green-500';
//     return 'bg-blue-500';
//   };

//   // Get static review count for a product
//   const getReviewCount = (product) => {
//     const reviewMap = {
//       '120kw': 187,
//       '60kw': 156,
//       '30kw': 98,
//       '22kw': 234,
//       '7kw': 312,
//     };
    
//     const productName = (product.name + ' ' + product.model).toLowerCase();
    
//     if (productName.includes('120kw')) return reviewMap['120kw'];
//     if (productName.includes('60kw')) return reviewMap['60kw'];
//     if (productName.includes('30kw')) return reviewMap['30kw'];
//     if (productName.includes('22kw')) return reviewMap['22kw'];
//     if (productName.includes('7kw')) return reviewMap['7kw'];
    
//     const idSum = String(product.id).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
//     return 50 + (idSum % 200);
//   };

//   const showToast = (message, type = 'success') => {
//     setToastMessage({ message, type });
//     setTimeout(() => setToastMessage(null), 3000);
//   };

//   // Function to refresh cart count in navbar
//   const refreshCartCount = () => {
//     window.dispatchEvent(new CustomEvent('cartUpdated'));
//   };

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const token = localStorage.getItem('auth_token');
//         const res = await axios.get(`${BASE_URL_AND_PORT}/products/all`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'API-KEY': API_KEY,
//           },
//         });
//         setAllProducts(res.data);
//         setDisplayedProducts(res.data);
//         console.log('All products loaded:', res.data);
//       } catch (error) {
//         console.error('Error fetching products:', error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProducts();

//     const savedWishlist = localStorage.getItem('wishlist');
//     if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
    
//     // Load cart items from localStorage or API
//     const loadCart = async () => {
//       const userId = localStorage.getItem('user_id');
//       if (userId) {
//         try {
//           const token = localStorage.getItem('auth_token');
//           const response = await axios.post(`${BASE_URL_AND_PORT}/cart/getcartdetails`, {
//             user_id: userId
//           }, {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               'API-KEY': API_KEY,
//             },
//           });
//           if (response.data && response.data.cart_items) {
//             const cartProductIds = response.data.cart_items.map(item => item.productid);
//             setCart(cartProductIds);
//           }
//         } catch (error) {
//           console.error('Error loading cart:', error);
//         }
//       }
//     };
//     loadCart();
//   }, []);

//   // Listen for cart update events
//   useEffect(() => {
//     const handleCartUpdate = () => {
//       const refreshCart = async () => {
//         const userId = localStorage.getItem('user_id');
//         if (userId) {
//           try {
//             const token = localStorage.getItem('auth_token');
//             const response = await axios.post(`${BASE_URL_AND_PORT}/cart/getcartdetails`, {
//               user_id: userId
//             }, {
//               headers: {
//                 Authorization: `Bearer ${token}`,
//                 'API-KEY': API_KEY,
//               },
//             });
//             if (response.data && response.data.cart_items) {
//               const cartProductIds = response.data.cart_items.map(item => item.productid);
//               setCart(cartProductIds);
//             }
//           } catch (error) {
//             console.error('Error refreshing cart:', error);
//           }
//         }
//       };
//       refreshCart();
//     };

//     window.addEventListener('cartUpdated', handleCartUpdate);
//     return () => window.removeEventListener('cartUpdated', handleCartUpdate);
//   }, []);

//   // FIXED: Apply filters including power range correctly
//   useEffect(() => {
//     let filtered = [...allProducts];
    
//     // Apply type filter
//     if (filterType !== "ALL") {
//       filtered = filtered.filter(p => {
//         const nameUpper = p.name?.toUpperCase() || '';
//         const modelUpper = p.model?.toUpperCase() || '';
        
//         if (filterType === "DC") {
//           return nameUpper.includes("DC") || 
//                  modelUpper.includes("DC") ||
//                  nameUpper.includes("60KW") ||
//                  nameUpper.includes("120KW") ||
//                  modelUpper.includes("60KW") ||
//                  modelUpper.includes("120KW");
//         } else if (filterType === "AC") {
//           return nameUpper.includes("AC") || modelUpper.includes("AC");
//         }
//         return true;
//       });
//     }
    
//     // Apply search query
//     if (searchQuery) {
//       filtered = filtered.filter(p =>
//         p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         p.model?.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//     }
    
//     // Apply price range
//     filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
    
//     // FIXED: Apply power range filter based on actual charger power
//     // Only filter if we're not showing all power ranges (0-200 means show all)
//     if (powerRange[1] < 200 || powerRange[0] > 0) {
//       filtered = filtered.filter(p => {
//         const power = getChargerPower(p);
//         return power >= powerRange[0] && power <= powerRange[1];
//       });
//     }
    
//     setDisplayedProducts(filtered);
//   }, [filterType, allProducts, searchQuery, priceRange, powerRange]);

//   const isAC = (product) => {
//     const name = product.name?.toUpperCase() || '';
//     const model = product.model?.toUpperCase() || '';
//     return name.includes("AC") || model.includes("AC");
//   };

//   const isDC60KW = (product) => {
//     const name = product.name?.toUpperCase() || '';
//     const model = product.model?.toUpperCase() || '';
//     const power = getChargerPower(product);
//     return power === 60 && !isAC(product);
//   };

//   const isDC120KW = (product) => {
//     const name = product.name?.toUpperCase() || '';
//     const model = product.model?.toUpperCase() || '';
//     const power = getChargerPower(product);
//     return power === 120 && !isAC(product);
//   };

//   const getChargerBadge = (product) => {
//     const power = getChargerPower(product);
//     if (isDC120KW(product)) return { text: '⚡ DC 120kW ', color: 'bg-red-100 text-red-700', icon: '🔥' };
//     if (isDC60KW(product)) return { text: '⚡ DC 60kW ', color: 'bg-purple-100 text-purple-700', icon: '🚀' };
//     if (!isAC(product) && power >= 30) return { text: `⚡ DC ${power}kW Charger`, color: 'bg-blue-100 text-blue-700', icon: '⚡' };
//     if (power >= 22) return { text: `🔌 AC ${power}kW`, color: 'bg-green-100 text-green-700', icon: '🔌' };
//     return { text: '🔌 AC Charger', color: 'bg-green-100 text-green-700', icon: '🔌' };
//   };

//   const handlePopupOpen = async (id) => {
//     try {
//       const token = localStorage.getItem('auth_token');
//       const res = await axios.get(`${BASE_URL_AND_PORT}/products/get_by_id/${id}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'API-KEY': API_KEY,
//         },
//       });
//       setPopupContent(res.data);
//       setPopupImageIndex(0);
//       setPopupOpen(true);
//     } catch (error) {
//       console.error('Error fetching product details:', error);
//       showToast('Failed to load product details', 'error');
//     }
//   };

//   const goToNextImage = (id) => {
//     setImageIndex(prev => {
//       const current = prev[id] || 0;
//       const product = allProducts.find(p => p.id === id);
//       return { ...prev, [id]: (current + 1) % (product?.image_paths?.length || 1) };
//     });
//   };

//   const goToPrevImage = (id) => {
//     setImageIndex(prev => {
//       const current = prev[id] || 0;
//       const product = allProducts.find(p => p.id === id);
//       return { ...prev, [id]: (current - 1 + (product?.image_paths?.length || 1)) % (product?.image_paths?.length || 1) };
//     });
//   };

//   const handleAddToCart = async (id, price) => {
//     const userId = localStorage.getItem('user_id');
//     if (!userId) {
//       showToast("Please login first", 'error');
//       return;
//     }

//     if (!cart.includes(id)) {
//       setCart([...cart, id]);
//       try {
//         const token = localStorage.getItem('auth_token');
//         await axios.post(`${BASE_URL_AND_PORT}/cart/addtocart`, {
//           user_id: userId,
//           productid: id,
//           price: price.toString(),
//         }, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'API-KEY': API_KEY,
//           },
//         });
//         showToast("Product added to cart successfully!", 'success');
//         refreshCartCount();
//       } catch (error) {
//         console.error('Error adding to cart:', error);
//         showToast("Failed to add to cart", 'error');
//         setCart(cart.filter(cartId => cartId !== id));
//       }
//     } else {
//       showToast("Product already in cart", 'info');
//     }
//   };

//   const handleRemoveFromCart = async (id) => {
//     const userId = localStorage.getItem('user_id');
//     if (!userId) return;

//     setCart(cart.filter(cartId => cartId !== id));
//     try {
//       const token = localStorage.getItem('auth_token');
//       await axios.post(`${BASE_URL_AND_PORT}/cart/removefromcart`, {
//         user_id: userId,
//         productid: id,
//       }, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'API-KEY': API_KEY,
//         },
//       });
//       showToast("Product removed from cart", 'info');
//       refreshCartCount();
//     } catch (error) {
//       console.error('Error removing from cart:', error);
//       showToast("Failed to remove from cart", 'error');
//       const token = localStorage.getItem('auth_token');
//       const response = await axios.post(`${BASE_URL_AND_PORT}/cart/getcartdetails`, {
//         user_id: userId
//       }, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'API-KEY': API_KEY,
//         },
//       });
//       if (response.data && response.data.cart_items) {
//         const cartProductIds = response.data.cart_items.map(item => item.productid);
//         setCart(cartProductIds);
//       }
//     }
//   };

//   const toggleWishlist = (productId) => {
//     let newWishlist;
//     if (wishlist.includes(productId)) {
//       newWishlist = wishlist.filter(id => id !== productId);
//       showToast("Removed from wishlist", 'info');
//     } else {
//       newWishlist = [...wishlist, productId];
//       showToast("Added to wishlist", 'success');
//     }
//     setWishlist(newWishlist);
//     localStorage.setItem('wishlist', JSON.stringify(newWishlist));
//   };

//   const getRating = (product) => {
//     const power = getChargerPower(product);
//     if (power >= 100) return 4.9;
//     if (power >= 50) return 4.8;
//     if (power >= 22) return 4.6;
//     return 4.5;
//   };

//   const renderStars = (rating) => {
//     const stars = [];
//     const fullStars = Math.floor(rating);
//     const hasHalfStar = rating % 1 >= 0.5;
    
//     for (let i = 0; i < fullStars; i++) {
//       stars.push(<FaStar key={i} className="text-yellow-400" />);
//     }
//     if (hasHalfStar) {
//       stars.push(<FaStarHalfAlt key="half" className="text-yellow-400" />);
//     }
//     while (stars.length < 5) {
//       stars.push(<FaRegStar key={stars.length} className="text-yellow-400" />);
//     }
//     return stars;
//   };

//   useEffect(() => {
//     window.scrollTo({ top: 0, left: 0, behavior: "auto" });
//   }, []);

//   const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

//   // Handle responsive sidebar state
//   useEffect(() => {
//     const handleResize = () => {
//       const mobile = window.innerWidth < 768;
//       setIsMobile(mobile);
//       if (window.innerWidth >= 1024) {
//         setSidebarOpen(true);
//       } else if (window.innerWidth < 1024 && window.innerWidth >= 768) {
//         setSidebarOpen(false);
//       } else {
//         setSidebarOpen(false);
//       }
//     };
    
//     handleResize();
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   // Power range preset buttons
//   const setPowerPreset = (min, max) => {
//     setPowerRange([min, max]);
//   };

//   return (
//     <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//       <UserNavbar onToggleSidebar={toggleSidebar} />
      
//       <div className="flex flex-1 relative">
//         {/* Sidebar */}
//         <UserSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

//         {/* Main Content - Dynamic margin based on sidebar state */}
//         <main 
//           className={`
//             flex-1 transition-all duration-300 ease-in-out w-full
//             ${sidebarOpen ? 'lg:ml-72' : 'lg:ml-24'}
//             ${isMobile && sidebarOpen ? 'overflow-hidden' : ''}
//           `}
//         >
//           <div className="p-4 md:p-6 lg:p-8">
//             {/* Toast Notification */}
//             {toastMessage && (
//               <div className={`fixed top-20 right-4 z-50 animate-slideIn ${
//                 toastMessage.type === 'success' ? 'bg-green-500' : 
//                 toastMessage.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
//               } text-white px-6 py-3 rounded-lg shadow-lg`}>
//                 {toastMessage.message}
//               </div>
//             )}

//             {/* Hero Section */}
//             <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-xl mb-6 md:mb-8">
//               <div className="absolute inset-0 bg-black opacity-20"></div>
//               <div className="relative z-10 px-4 py-8 md:px-8 md:py-12 lg:px-12 lg:py-16">
//                 <div className="max-w-2xl">
//                   <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 md:mb-4">Discover Our EV Chargers</h1>
//                   <p className="text-blue-100 text-sm md:text-base lg:text-lg mb-4 md:mb-6">
//                     From 3.3kW home chargers to 120kW ultra-fast DC chargers. Find the perfect charging solution for your needs.
//                   </p>
//                   <div className="flex gap-3 md:gap-4 flex-wrap">
//                     <button className="bg-white text-blue-600 px-4 md:px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition text-sm md:text-base">Shop Now</button>
//                     <Link to="/about">
//                       <button className="border-2 border-white text-white px-4 md:px-6 py-2 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition text-sm md:text-base">
//                         Learn More
//                       </button>
//                     </Link>
//                   </div>
//                 </div>
//               </div>
//               <div className="absolute right-0 bottom-0 opacity-10 hidden md:block">
//                 <MdElectricBolt size={200} className="text-white" />
//               </div>
//             </div>

//             {/* Quick Category Filters */}
//             <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
//               <button
//                 onClick={() => { setFilterType('ALL'); setSearchQuery(''); setPowerRange([0, 200]); }}
//                 className={`px-4 py-2 rounded-full text-sm font-semibold transition whitespace-nowrap ${filterType === 'ALL' && !searchQuery ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
//               >
//                 All Products
//               </button>
//               <button
//                 onClick={() => { setFilterType('AC'); setSearchQuery(''); setPowerRange([0, 200]); }}
//                 className={`px-4 py-2 rounded-full text-sm font-semibold transition whitespace-nowrap ${filterType === 'AC' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
//               >
//                 🔌 AC Chargers
//               </button>
//               <button
//                 onClick={() => { setFilterType('DC'); setSearchQuery(''); setPowerRange([0, 200]); }}
//                 className={`px-4 py-2 rounded-full text-sm font-semibold transition whitespace-nowrap ${filterType === 'DC' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
//               >
//                 ⚡ All DC Chargers
//               </button>
//             </div>

//             {/* Controls Bar */}
//             <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 md:p-4 mb-6">
//               <div className="flex flex-col md:flex-row gap-3 md:gap-4 items-stretch md:items-center justify-between">
//                 <div className="relative w-full md:w-96">
//                   <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
//                   <input
//                     type="text"
//                     className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
//                     placeholder="Search by name or power (e.g., 60kW, 120kW)..."
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                   />
//                   {searchQuery && (
//                     <button
//                       onClick={() => setSearchQuery('')}
//                       className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                     >
//                       <FiX size={18} />
//                     </button>
//                   )}
//                 </div>

//                 <div className="flex gap-3 w-full md:w-auto">
//                   <select
//                     value={filterType}
//                     onChange={(e) => setFilterType(e.target.value)}
//                     className="flex-1 md:flex-none px-4 py-2.5 border border-gray-300 rounded-lg bg-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
//                   >
//                     <option value="ALL">All Chargers</option>
//                     <option value="AC">AC Charger (7kW-22kW)</option>
//                     <option value="DC">DC Fast Charger (30kW-120kW)</option>
//                   </select>

//                   <button
//                     onClick={() => setShowFilters(!showFilters)}
//                     className="flex-1 md:flex-none px-4 py-2.5 border border-gray-300 rounded-lg bg-white font-medium flex items-center justify-center gap-2 hover:bg-gray-50 transition text-sm md:text-base"
//                   >
//                     <FiFilter size={18} />
//                     Filters
//                   </button>
//                 </div>
//               </div>

//               {showFilters && (
//                 <div className="mt-4 pt-4 border-t border-gray-200">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">Price Range: ₹{formatIndianPrice(priceRange[0])} - ₹{formatIndianPrice(priceRange[1])}</label>
//                       <input
//                         type="range"
//                         min="0"
//                         max="2000000"
//                         step="10000"
//                         value={priceRange[1]}
//                         onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
//                         className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">Power Range: {powerRange[0]}kW - {powerRange[1]}kW</label>
//                       <input
//                         type="range"
//                         min="0"
//                         max="200"
//                         step="5"
//                         value={powerRange[1]}
//                         onChange={(e) => setPowerRange([powerRange[0], parseInt(e.target.value)])}
//                         className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
//                       />
                      
//                       {/* FIXED: Power preset buttons for better filtering */}
//                       <div className="flex flex-wrap gap-2 mt-3">
//                         <button
//                           onClick={() => setPowerPreset(0, 7)}
//                           className={`text-xs px-3 py-1 rounded-full transition ${
//                             powerRange[0] === 0 && powerRange[1] === 7
//                               ? 'bg-purple-600 text-white'
//                               : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//                           }`}
//                         >
//                           Up to 7kW
//                         </button>
//                         <button
//                           onClick={() => setPowerPreset(7, 22)}
//                           className={`text-xs px-3 py-1 rounded-full transition ${
//                             powerRange[0] === 7 && powerRange[1] === 22
//                               ? 'bg-purple-600 text-white'
//                               : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//                           }`}
//                         >
//                           7kW - 22kW
//                         </button>
//                         <button
//                           onClick={() => setPowerPreset(22, 30)}
//                           className={`text-xs px-3 py-1 rounded-full transition ${
//                             powerRange[0] === 22 && powerRange[1] === 30
//                               ? 'bg-purple-600 text-white'
//                               : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//                           }`}
//                         >
//                           22kW - 30kW
//                         </button>
//                         <button
//                           onClick={() => setPowerPreset(30, 60)}
//                           className={`text-xs px-3 py-1 rounded-full transition ${
//                             powerRange[0] === 30 && powerRange[1] === 60
//                               ? 'bg-purple-600 text-white'
//                               : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//                           }`}
//                         >
//                           30kW - 60kW
//                         </button>
//                         <button
//                           onClick={() => setPowerPreset(60, 120)}
//                           className={`text-xs px-3 py-1 rounded-full transition ${
//                             powerRange[0] === 60 && powerRange[1] === 120
//                               ? 'bg-purple-600 text-white'
//                               : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//                           }`}
//                         >
//                           60kW - 120kW
//                         </button>
//                         <button
//                           onClick={() => setPowerPreset(0, 200)}
//                           className={`text-xs px-3 py-1 rounded-full transition ${
//                             powerRange[0] === 0 && powerRange[1] === 200
//                               ? 'bg-purple-600 text-white'
//                               : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//                           }`}
//                         >
//                           All Powers
//                         </button>
//                       </div>
                      
//                       <div className="flex justify-between text-xs text-gray-500 mt-3">
//                         <span>Home (3.3-7kW)</span>
//                         <span>Fast AC (22kW)</span>
//                         <span>DC Fast (30kW)</span>
//                         <span>DC Fast (60kW)</span>
//                         <span>Ultra Fast (120kW)</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Products Grid */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
//               {loading ? (
//                 <div className="col-span-full flex justify-center py-20">
//                   <div className="animate-spin rounded-full h-12 w-12 md:h-16 md:w-16 border-t-4 border-b-4 border-blue-600"></div>
//                 </div>
//               ) : displayedProducts.length === 0 ? (
//                 <div className="col-span-full text-center py-20">
//                   <div className="text-gray-400 text-5xl md:text-6xl mb-4">🔌</div>
//                   <p className="text-gray-500 text-base md:text-lg">No products found matching your criteria.</p>
//                   <p className="text-gray-400 text-sm mt-2">Try adjusting the power range or price filters.</p>
//                   <button
//                     onClick={() => { setSearchQuery(''); setFilterType('ALL'); setPriceRange([0, 2000000]); setPowerRange([0, 200]); }}
//                     className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
//                   >
//                     Clear all filters
//                   </button>
//                 </div>
//               ) : (
//                 displayedProducts.map((product) => {
//                   const rating = getRating(product);
//                   const chargerPower = getChargerPower(product);
//                   const badge = getChargerBadge(product);
//                   const isDCProduct = !isAC(product);
//                   const powerPercentage = getPowerPercentage(product);
//                   const powerBarColor = getPowerBarColor(chargerPower);
//                   const reviewCount = getReviewCount(product);
                  
//                   return (
//                     <div
//                       key={product.id}
//                       className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:-translate-y-1"
//                       onMouseEnter={() => setHoveredProduct(product.id)}
//                       onMouseLeave={() => setHoveredProduct(null)}
//                     >
//                       <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 h-56 md:h-64 overflow-hidden cursor-pointer">
//                         <img
//                           src={product.image_paths?.[imageIndex[product.id] || 0] || 'https://via.placeholder.com/300'}
//                           alt={product.name}
//                           className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
//                           onClick={() => handlePopupOpen(product.id)}
//                         />
                        
//                         {/* Power Badge */}
//                         <div className="absolute top-3 left-3 z-10">
//                           <span className={`text-xs font-semibold px-2 py-1 rounded-full ${badge.color}`}>
//                             {badge.icon} {badge.text}
//                           </span>
//                         </div>

//                         {/* Special Badge for 60kW and 120kW */}
//                         {(isDC60KW(product) || isDC120KW(product)) && (
//                           <div className="absolute top-3 right-3 z-10">
//                             <span className={`text-xs font-bold px-2 py-1 rounded-full ${isDC120KW(product) ? 'bg-red-500 text-white' : 'bg-orange-500 text-white'}`}>
//                               {isDC120KW(product) ? 'ULTRA FAST' : 'FAST CHARGE'}
//                             </span>
//                           </div>
//                         )}

//                         {hoveredProduct === product.id && (
//                           <div 
//                             className="absolute bottom-4 left-0 right-0 flex items-center justify-center transition-all duration-300 cursor-pointer"
//                             onClick={() => handlePopupOpen(product.id)}
//                           >
//                             <button className="bg-black/40 backdrop-blur-sm border-2 border-emerald-400 rounded-full px-4 py-2 flex items-center gap-2 text-emerald-400 text-sm font-bold shadow-lg transform transition-all duration-300 hover:scale-105 hover:bg-black/60 hover:border-emerald-300 hover:text-emerald-300 active:scale-95">
//                               <FiZoomIn size={14} />
//                               <span>Quick View</span>
//                             </button>
//                           </div>
//                         )}
                        
//                         <button
//                           onClick={() => toggleWishlist(product.id)}
//                           className="absolute bottom-3 right-3 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-red-50 transition z-10"
//                         >
//                           {wishlist.includes(product.id) ? (
//                             <FaHeart className="text-red-500" size={16} />
//                           ) : (
//                             <FaRegHeart className="text-gray-400 hover:text-red-500" size={16} />
//                           )}
//                         </button>

//                         {product.image_paths?.length > 1 && (
//                           <>
//                             <button
//                               onClick={(e) => { e.stopPropagation(); goToPrevImage(product.id); }}
//                               className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition z-10"
//                             >
//                               <FiChevronLeft size={14} />
//                             </button>
//                             <button
//                               onClick={(e) => { e.stopPropagation(); goToNextImage(product.id); }}
//                               className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition z-10"
//                             >
//                               <FiChevronRight size={14} />
//                             </button>
//                           </>
//                         )}
//                       </div>

//                       <div className="p-4">
//                         <div className="flex items-center justify-between mb-1">
//                           <h3 className="font-bold text-gray-800 text-base md:text-lg line-clamp-1">{product.name}</h3>
//                           {isDCProduct && <MdFlashOn className="text-purple-500" size={18} />}
//                         </div>
//                         <p className="text-gray-500 text-xs md:text-sm mb-2">{product.model}</p>
                        
//                         {/* Power Indicator Bar - Shows the actual rated power */}
//                         <div className="mb-2">
//                           <div className="flex justify-between text-xs text-gray-500 mb-1">
//                             <span>Rated Power</span>
//                             <span className="font-semibold">{chargerPower} kW</span>
//                           </div>
//                           <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
//                             <div 
//                               className={`h-full rounded-full ${powerBarColor} transition-all duration-500`}
//                               style={{ width: `${powerPercentage}%` }}
//                             />
//                           </div>
//                         </div>

//                         <div className="flex items-center gap-1 mb-2">
//                           {renderStars(rating)}
//                           <span className="text-xs text-gray-500 ml-1">({reviewCount} reviews)</span>
//                         </div>

//                         <div className="mb-3">
//                           <span className="text-xl md:text-2xl font-bold text-blue-600">₹{formatIndianPrice(product.price)}</span>
//                           {product.mrp && product.mrp > product.price && (
//                             <span className="text-xs md:text-sm text-gray-400 line-through ml-2">₹{formatIndianPrice(product.mrp)}</span>
//                           )}
//                           {isDCProduct && (
//                             <span className="text-xs text-gray-500 ml-2">+ GST</span>
//                           )}
//                         </div>

//                         {isAC(product) ? (
//                           product.quantity > 0 ? (
//                             <button
//                               onClick={() => handleAddToCart(product.id, product.price)}
//                               className={`w-full py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 transition text-sm md:text-base ${cart.includes(product.id) ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
//                             >
//                               <FaShoppingCart size={14} />
//                               {cart.includes(product.id) ? 'Added to Cart' : 'Add to Cart'}
//                             </button>
//                           ) : (
//                             <button className="w-full py-2.5 rounded-lg font-semibold bg-gray-300 text-gray-500 cursor-not-allowed text-sm md:text-base">
//                               Out of Stock
//                             </button>
//                           )
//                         ) : (
//                           <button
//                             onClick={() => setContactPopup(true)}
//                             className="w-full py-2.5 rounded-lg font-semibold bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white transition text-sm md:text-base"
//                           >
//                             {chargerPower >= 30 ? `Get Quote for ${chargerPower}kW` : 'Contact Sales Team'}
//                           </button>
//                         )}
//                       </div>
//                     </div>
//                   );
//                 })
//               )}
//             </div>
//           </div>
//         </main>
//       </div>

//       {/* Contact Popup */}
//       {contactPopup && (
//         <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[9999] animate-fadeIn p-4">
//           <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
//             <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4">
//               <h3 className="text-xl font-bold text-white">Contact Sales Team</h3>
//             </div>
//             <div className="p-6">
//               <p className="text-gray-600 mb-4">
//                 For enquiries about <span className="font-semibold text-orange-600">DC Fast Chargers (30kW, 60kW, 120kW)</span>, please reach out to our dedicated sales team.
//               </p>
//               <div className="bg-gray-50 rounded-lg p-4 mb-6">
//                 <p className="text-sm text-gray-500 mb-1">Email us at</p>
//                 <a
//                   href="mailto:tgwbin@gmail.com"
//                   className="text-lg font-semibold text-blue-600 hover:underline break-all"
//                 >
//                   tgwbin@gmail.com
//                 </a>
//               </div>
//               <button
//                 onClick={() => setContactPopup(false)}
//                 className="w-full py-3 bg-gray-800 hover:bg-gray-900 text-white rounded-lg font-semibold transition"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Product Details Popup */}
//       {popupOpen && popupContent.id && (
//         <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-[9999] p-4 animate-fadeIn overflow-y-auto">
//           <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl">
//             <button
//               className="absolute top-4 right-4 z-10 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-all duration-300 hover:scale-110"
//               onClick={() => setPopupOpen(false)}
//             >
//               <FiX size={18} />
//             </button>

//             <div className="p-4 md:p-6 lg:p-8">
//               <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
//                 {/* Left - Image Gallery */}
//                 <div className="lg:w-1/2">
//                   <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden shadow-lg">
//                     <img
//                       src={popupContent.image_paths?.[popupImageIndex] || 'https://via.placeholder.com/400'}
//                       alt={popupContent.name}
//                       className="w-full h-64 md:h-80 lg:h-96 object-contain p-4 cursor-pointer transition-transform duration-300 hover:scale-105"
//                       onClick={() => setPopupImageIndex(prev => (prev + 1) % (popupContent.image_paths?.length || 1))}
//                     />
//                     {popupContent.image_paths?.length > 1 && (
//                       <>
//                         <button
//                           onClick={() => setPopupImageIndex(prev => (prev - 1 + popupContent.image_paths.length) % popupContent.image_paths.length)}
//                           className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-all duration-300 hover:scale-110"
//                         >
//                           <FiChevronLeft size={18} />
//                         </button>
//                         <button
//                           onClick={() => setPopupImageIndex(prev => (prev + 1) % popupContent.image_paths.length)}
//                           className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-all duration-300 hover:scale-110"
//                         >
//                           <FiChevronRight size={18} />
//                         </button>
//                       </>
//                     )}
//                     <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
//                       Click image to see next
//                     </div>
//                   </div>
                  
//                   {/* Thumbnails */}
//                   {popupContent.image_paths?.length > 1 && (
//                     <div className="flex gap-2 mt-4 justify-center flex-wrap">
//                       {popupContent.image_paths.map((img, idx) => (
//                         <button
//                           key={idx}
//                           onClick={() => setPopupImageIndex(idx)}
//                           className={`w-14 h-14 md:w-16 md:h-16 rounded-xl overflow-hidden border-2 transition-all duration-300 hover:scale-105 ${
//                             popupImageIndex === idx 
//                               ? 'border-blue-500 ring-2 ring-blue-200 shadow-md' 
//                               : 'border-gray-200 hover:border-gray-300'
//                           }`}
//                         >
//                           <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
//                         </button>
//                       ))}
//                     </div>
//                   )}
//                 </div>

//                 {/* Right - Product Details */}
//                 <div className="lg:w-1/2">
//                   {/* Badges */}
//                   <div className="mb-4 flex flex-wrap gap-2">
//                     <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-semibold ${
//                       isAC(popupContent) 
//                         ? 'bg-green-100 text-green-700' 
//                         : 'bg-purple-100 text-purple-700'
//                     }`}>
//                       {isAC(popupContent) ? '🔌 AC Charger' : `⚡ DC Fast Charger ${getChargerPower(popupContent)}kW`}
//                     </span>
//                     {(isDC60KW(popupContent) || isDC120KW(popupContent)) && (
//                       <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-semibold ${
//                         isDC120KW(popupContent) 
//                           ? 'bg-red-100 text-red-700' 
//                           : 'bg-orange-100 text-orange-700'
//                       }`}>
//                         {isDC120KW(popupContent) ? '🔥 Ultra Fast Charging' : '🚀 Fast Charge Technology'}
//                       </span>
//                     )}
//                   </div>
                  
//                   <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 mb-2">{popupContent.name}</h2>
//                   <p className="text-gray-500 text-sm md:text-base mb-4">Model: {popupContent.model}</p>
                  
//                   {/* Rating */}
//                   <div className="flex items-center gap-4 mb-4">
//                     <div className="flex items-center gap-1">
//                       {renderStars(getRating(popupContent))}
//                     </div>
//                     <span className="text-sm text-gray-500">({getReviewCount(popupContent)} customer reviews)</span>
//                   </div>

//                   {/* Price */}
//                   <div className="mb-4">
//                     <span className="text-3xl md:text-4xl font-bold text-blue-600">₹{formatIndianPrice(popupContent.price)}</span>
//                     {popupContent.mrp && popupContent.mrp > popupContent.price && (
//                       <span className="text-gray-400 line-through ml-2 text-lg">₹{formatIndianPrice(popupContent.mrp)}</span>
//                     )}
//                     {!isAC(popupContent) && (
//                       <span className="text-sm text-gray-500 ml-2">+ GST</span>
//                     )}
//                   </div>

//                   {/* Key Features */}
//                   <div className="grid grid-cols-2 gap-3 mb-6">
//                     <div className="flex items-center gap-2 text-sm text-gray-600 p-2 bg-gray-50 rounded-lg">
//                       <MdVerified className="text-green-600" size={18} />
//                       <span>12 Months Warranty</span>
//                     </div>
//                     <div className="flex items-center gap-2 text-sm text-gray-600 p-2 bg-gray-50 rounded-lg">
//                       <MdSecurity className="text-blue-600" size={18} />
//                       <span>Safety Certified</span>
//                     </div>
//                     {popupContent.details?.cable_length && (
//                       <div className="flex items-center gap-2 text-sm text-gray-600 p-2 bg-gray-50 rounded-lg">
//                         <MdSpeed className="text-orange-600" size={18} />
//                         <span>Cable: {popupContent.details.cable_length}</span>
//                       </div>
//                     )}
//                   </div>

//                   {/* Action Buttons */}
//                   <div className="space-y-3">
//                     {isAC(popupContent) ? (
//                       popupContent.quantity > 0 ? (
//                         <button
//                           onClick={() => handleAddToCart(popupContent.id, popupContent.price)}
//                           className={`w-full py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${
//                             cart.includes(popupContent.id) 
//                               ? 'bg-green-500 hover:bg-green-600' 
//                               : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
//                           } text-white shadow-md hover:shadow-lg`}
//                         >
//                           <FaShoppingCart size={18} />
//                           {cart.includes(popupContent.id) ? 'Added to Cart' : 'Add to Cart'}
//                         </button>
//                       ) : (
//                         <button className="w-full py-3.5 bg-gray-300 text-gray-500 rounded-xl font-semibold cursor-not-allowed">
//                           Out of Stock
//                         </button>
//                       )
//                     ) : (
//                       <button
//                         onClick={() => {
//                           setContactPopup(true);
//                           setPopupOpen(false);
//                         }}
//                         className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
//                       >
//                         Request Quote for {getChargerPower(popupContent)}kW DC Charger
//                       </button>
//                     )}
                    
//                     <button
//                       onClick={() => toggleWishlist(popupContent.id)}
//                       className={`w-full py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 border-2 transition-all duration-300 ${
//                         wishlist.includes(popupContent.id) 
//                           ? 'border-red-500 text-red-500 bg-red-50' 
//                           : 'border-gray-300 text-gray-700 hover:border-blue-500 hover:bg-blue-50'
//                       }`}
//                     >
//                       {wishlist.includes(popupContent.id) ? <FaHeart /> : <FaRegHeart />}
//                       {wishlist.includes(popupContent.id) ? 'Saved to Wishlist' : 'Add to Wishlist'}
//                     </button>
//                   </div>

//                   {/* Disclaimer */}
//                   <div className="mt-6 p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border border-red-200">
//                     <p className="text-sm text-red-700">
//                       <strong>⚠️ Disclaimer:</strong> Cancellations & Refunds Policy applies.
//                       <button
//                         onClick={() => navigate("/cancellation-policy")}
//                         className="ml-2 text-red-600 underline hover:text-red-800 font-medium"
//                       >
//                         Read more →
//                       </button>
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {/* Technical Specifications */}
//               {popupContent.details && Object.keys(popupContent.details).filter(k => popupContent.details[k] && popupContent.details[k] !== 'N/A').length > 0 && (
//                 <div className="mt-10">
//                   <div className="flex items-center justify-between mb-6">
//                     <div className="flex items-center gap-3">
//                       <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"></div>
//                       <div>
//                         <h3 className="text-xl md:text-2xl font-bold text-gray-800">Technical Specifications</h3>
//                         <p className="text-sm text-gray-500 mt-0.5">Complete technical details and specifications</p>
//                       </div>
//                     </div>
//                     <div className="text-xs text-gray-400 bg-gray-100 px-3 py-1.5 rounded-full">
//                       {Object.entries(popupContent.details).filter(([_, v]) => v && v !== 'N/A').length} Specifications
//                     </div>
//                   </div>
                  
//                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//                     {Object.entries(popupContent.details).map(([key, value]) => {
//                       if (!value || value === 'N/A') return null;
                      
//                       const labels = {
//                         phase: 'Phase', cooling: 'Cooling Type', rated_power: 'Rated Power',
//                         ingress_protection: 'IP Rating', current: 'Current Rating',
//                         display: 'Display Type', gun_type: 'Gun Type', material: 'Material',
//                         dimensions: 'Dimensions', protection: 'Protection Features',
//                         communication: 'Communication', cable_length: 'Cable Length',
//                         input_voltage: 'Input Voltage', ouput_voltage: 'Output Voltage',
//                         operatingtemps: 'Operating Temperature', ocpp_present: 'OCPP Support',
//                         efficiency: 'Efficiency', warranty: 'Warranty', weight: 'Weight',
//                         frequency: 'Frequency', mountingtype: 'Mounting Type'
//                       };
                      
//                       const getIcon = (key) => {
//                         const icons = {
//                           rated_power: '⚡', current: '🔌', efficiency: '📊', warranty: '🛡️',
//                           weight: '⚖️', dimensions: '📏', operatingtemps: '🌡️', phase: '🔄',
//                           cooling: '❄️', ingress_protection: '💧', display: '🖥️',
//                           gun_type: '🔫', material: '🏗️', protection: '🛡️',
//                           communication: '📡', cable_length: '📏', input_voltage: '⚡',
//                           ouput_voltage: '⚡', ocpp_present: '🌐', frequency: '📶',
//                           mountingtype: '🔧'
//                         };
//                         return icons[key] || '🔧';
//                       };
                      
//                       const getBadgeColor = (key, value) => {
//                         if (key === 'rated_power' && value.toString().includes('kW')) {
//                           return 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200';
//                         }
//                         if (key === 'efficiency' && value.toString().includes('%')) {
//                           return 'bg-gradient-to-br from-green-50 to-green-100 border-green-200';
//                         }
//                         if (key === 'warranty') {
//                           return 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200';
//                         }
//                         if (key === 'operatingtemps') {
//                           return 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200';
//                         }
//                         return 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200';
//                       };
                      
//                       const formatValue = (value) => {
//                         if (typeof value === 'boolean') {
//                           return value ? (
//                             <span className="inline-flex items-center gap-1 text-green-600">
//                               <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                               </svg>
//                               Supported
//                             </span>
//                           ) : (
//                             <span className="inline-flex items-center gap-1 text-gray-400">
//                               <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                               </svg>
//                               Not Supported
//                             </span>
//                           );
//                         }
//                         return value;
//                       };
                      
//                       return (
//                         <div 
//                           key={key} 
//                           className={`group rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 ${getBadgeColor(key, value)} border`}
//                         >
//                           <div className="flex items-start gap-3">
//                             <div className="text-2xl">{getIcon(key)}</div>
//                             <div className="flex-1">
//                               <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
//                                 {labels[key] || key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
//                               </div>
//                               <div className="font-bold text-gray-800 break-words text-base">
//                                 {formatValue(value)}
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
      
//       <style>{`
//         @keyframes fadeIn {
//           from { opacity: 0; }
//           to { opacity: 1; }
//         }
//         @keyframes slideIn {
//           from { transform: translateX(100%); opacity: 0; }
//           to { transform: translateX(0); opacity: 1; }
//         }
//         .animate-fadeIn {
//           animation: fadeIn 0.2s ease-out;
//         }
//         .animate-slideIn {
//           animation: slideIn 0.3s ease-out;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default ProductPage;



import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaShoppingCart, FaHeart, FaRegHeart, FaStar, FaStarHalfAlt, FaRegStar, FaUserCircle, FaThumbsUp, FaCalendarAlt } from 'react-icons/fa';
import { FiSearch, FiFilter, FiX, FiChevronLeft, FiChevronRight, FiZoomIn } from 'react-icons/fi';
import { MdElectricBolt, MdSpeed, MdSecurity, MdVerified, MdFlashOn } from 'react-icons/md';
import UserSidebar from '../User_sidebar';
import UserNavbar from '../User_Navbar';
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const BASE_URL_AND_PORT = "https://api.static.ev.transev.site";
const API_KEY = "mlzuMoRFjdGhcFulLMaVtfwNAHycbBAf";

const ProductPage = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [filterType, setFilterType] = useState("ALL");
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupContent, setPopupContent] = useState({});
  const [popupImageIndex, setPopupImageIndex] = useState(0);
  const [contactPopup, setContactPopup] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageIndex, setImageIndex] = useState({});
  const [wishlist, setWishlist] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 2000000]);
  const [powerRange, setPowerRange] = useState([0, 200]);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  
  // Review States
  const [reviewSummary, setReviewSummary] = useState({});
  const [productReviews, setProductReviews] = useState({});
  const [loadingReviews, setLoadingReviews] = useState({});
  const [reviewsPopupOpen, setReviewsPopupOpen] = useState(false);
  const [selectedProductForReviews, setSelectedProductForReviews] = useState(null);
  const [reviewsLimit, setReviewsLimit] = useState("1-10");
  const [currentReviews, setCurrentReviews] = useState([]);
  
  const navigate = useNavigate();

  // Function to format price in Indian format
  const formatIndianPrice = (price) => {
    if (!price && price !== 0) return '0';
    const num = Number(price);
    if (isNaN(num)) return '0';
    
    let [integerPart, decimalPart] = num.toString().split('.');
    const lastThree = integerPart.slice(-3);
    const otherNumbers = integerPart.slice(0, -3);
    
    let formattedInteger;
    if (otherNumbers !== '') {
      formattedInteger = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree;
    } else {
      formattedInteger = lastThree;
    }
    
    if (decimalPart) {
      return formattedInteger + '.' + decimalPart;
    }
    return formattedInteger;
  };

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
  const fetchProductReviews = async (productId, limit = "1-10") => {
    if (!productId) return;
    
    setLoadingReviews(prev => ({ ...prev, [productId]: true }));
    try {
      const response = await axios.get(
        BASE_URL_AND_PORT + "/products/reviews/" + productId + "?limit=" + limit,
        {
          headers: {
            "API-KEY": API_KEY,
          },
        }
      );
      
      setProductReviews(prev => ({
        ...prev,
        [productId]: response.data.reviews || []
      }));
      
      return response.data.reviews || [];
    } catch (error) {
      console.error("Error fetching product reviews:", error);
      setProductReviews(prev => ({
        ...prev,
        [productId]: []
      }));
      return [];
    } finally {
      setLoadingReviews(prev => ({ ...prev, [productId]: false }));
    }
  };

  // Open reviews popup
  const openReviewsPopup = async (product) => {
    setSelectedProductForReviews(product);
    const reviews = await fetchProductReviews(product.id, "1-10");
    setCurrentReviews(reviews);
    setReviewsPopupOpen(true);
  };

  // Load more reviews
  const loadMoreReviews = async () => {
    if (!selectedProductForReviews) return;
    
    const currentStart = parseInt(reviewsLimit.split("-")[0]);
    const newStart = currentStart + 10;
    const newLimit = newStart + "-" + (newStart + 9);
    setReviewsLimit(newLimit);
    
    const newReviews = await fetchProductReviews(selectedProductForReviews.id, newLimit);
    setCurrentReviews(prev => [...prev, ...newReviews]);
  };

  // Get charger power
  const getChargerPower = (product) => {
    if (!product) return 0;
    
    if (product.details?.rated_power) {
      const ratedPowerStr = product.details.rated_power.toString();
      const match = ratedPowerStr.match(/(\d+(?:\.\d+)?)/);
      if (match) {
        const power = parseFloat(match[1]);
        if (!isNaN(power) && power > 0) return power;
      }
    }
    
    const name = product.name?.toUpperCase() || '';
    const model = product.model?.toUpperCase() || '';
    const fullText = name + ' ' + model;
    
    if (fullText.includes('120KW') || fullText.includes('120 KW')) return 120;
    if (fullText.includes('60KW') || fullText.includes('60 KW')) return 60;
    if (fullText.includes('30KW') || fullText.includes('30 KW')) return 30;
    if (fullText.includes('22KW') || fullText.includes('22 KW')) return 22;
    if (fullText.includes('7KW') || fullText.includes('7 KW')) return 7;
    if (fullText.includes('3.3KW') || fullText.includes('3.3 KW')) return 3.3;
    
    if (isAC(product)) return 7;
    return 60;
  };

  const getMaxPower = () => {
    if (allProducts.length === 0) return 120;
    let maxPower = 0;
    allProducts.forEach(product => {
      const power = getChargerPower(product);
      if (power > maxPower) maxPower = power;
    });
    return maxPower || 120;
  };

  const getPowerPercentage = (product) => {
    const power = getChargerPower(product);
    const maxPower = getMaxPower();
    return (power / maxPower) * 100;
  };

  const getPowerBarColor = (power) => {
    if (power >= 100) return 'bg-red-500';
    if (power >= 50) return 'bg-purple-500';
    if (power >= 22) return 'bg-green-500';
    return 'bg-blue-500';
  };

  const isAC = (product) => {
    const name = product.name?.toUpperCase() || '';
    const model = product.model?.toUpperCase() || '';
    return name.includes("AC") || model.includes("AC");
  };

  const isDC60KW = (product) => {
    const power = getChargerPower(product);
    return power === 60 && !isAC(product);
  };

  const isDC120KW = (product) => {
    const power = getChargerPower(product);
    return power === 120 && !isAC(product);
  };

  const getChargerBadge = (product) => {
    const power = getChargerPower(product);
    if (isDC120KW(product)) return { text: '⚡ DC 120kW ', color: 'bg-red-100 text-red-700', icon: '🔥' };
    if (isDC60KW(product)) return { text: '⚡ DC 60kW ', color: 'bg-purple-100 text-purple-700', icon: '🚀' };
    if (!isAC(product) && power >= 30) return { text: `⚡ DC ${power}kW Charger`, color: 'bg-blue-100 text-blue-700', icon: '⚡' };
    if (power >= 22) return { text: `🔌 AC ${power}kW`, color: 'bg-green-100 text-green-700', icon: '🔌' };
    return { text: '🔌 AC Charger', color: 'bg-green-100 text-green-700', icon: '🔌' };
  };

  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const refreshCartCount = () => {
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const res = await axios.get(BASE_URL_AND_PORT + "/products/all", {
          headers: {
            Authorization: `Bearer ${token}`,
            'API-KEY': API_KEY,
          },
        });
        setAllProducts(res.data);
        setDisplayedProducts(res.data);
        
        for (const product of res.data) {
          fetchReviewSummary(product.id);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();

    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
    
    const loadCart = async () => {
      const userId = localStorage.getItem('user_id');
      if (userId) {
        try {
          const token = localStorage.getItem('auth_token');
          const response = await axios.post(BASE_URL_AND_PORT + "/cart/getcartdetails", {
            user_id: userId
          }, {
            headers: {
              Authorization: `Bearer ${token}`,
              'API-KEY': API_KEY,
            },
          });
          if (response.data && response.data.cart_items) {
            const cartProductIds = response.data.cart_items.map(item => item.productid);
            setCart(cartProductIds);
          }
        } catch (error) {
          console.error('Error loading cart:', error);
        }
      }
    };
    loadCart();
  }, []);

  useEffect(() => {
    const handleCartUpdate = () => {
      const refreshCart = async () => {
        const userId = localStorage.getItem('user_id');
        if (userId) {
          try {
            const token = localStorage.getItem('auth_token');
            const response = await axios.post(BASE_URL_AND_PORT + "/cart/getcartdetails", {
              user_id: userId
            }, {
              headers: {
                Authorization: `Bearer ${token}`,
                'API-KEY': API_KEY,
              },
            });
            if (response.data && response.data.cart_items) {
              const cartProductIds = response.data.cart_items.map(item => item.productid);
              setCart(cartProductIds);
            }
          } catch (error) {
            console.error('Error refreshing cart:', error);
          }
        }
      };
      refreshCart();
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, []);

  useEffect(() => {
    let filtered = [...allProducts];
    
    if (filterType !== "ALL") {
      filtered = filtered.filter(p => {
        const nameUpper = p.name?.toUpperCase() || '';
        const modelUpper = p.model?.toUpperCase() || '';
        
        if (filterType === "DC") {
          return nameUpper.includes("DC") || 
                 modelUpper.includes("DC") ||
                 nameUpper.includes("60KW") ||
                 nameUpper.includes("120KW") ||
                 modelUpper.includes("60KW") ||
                 modelUpper.includes("120KW");
        } else if (filterType === "AC") {
          return nameUpper.includes("AC") || modelUpper.includes("AC");
        }
        return true;
      });
    }
    
    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.model?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
    
    if (powerRange[1] < 200 || powerRange[0] > 0) {
      filtered = filtered.filter(p => {
        const power = getChargerPower(p);
        return power >= powerRange[0] && power <= powerRange[1];
      });
    }
    
    setDisplayedProducts(filtered);
  }, [filterType, allProducts, searchQuery, priceRange, powerRange]);

  const handlePopupOpen = async (id) => {
    try {
      const token = localStorage.getItem('auth_token');
      const res = await axios.get(BASE_URL_AND_PORT + "/products/get_by_id/" + id, {
        headers: {
          Authorization: `Bearer ${token}`,
          'API-KEY': API_KEY,
        },
      });
      setPopupContent(res.data);
      setPopupImageIndex(0);
      setPopupOpen(true);
      
      await fetchProductReviews(id, "1-10");
      await fetchReviewSummary(id);
    } catch (error) {
      console.error('Error fetching product details:', error);
      showToast('Failed to load product details', 'error');
    }
  };

  const goToNextImage = (id) => {
    setImageIndex(prev => {
      const current = prev[id] || 0;
      const product = allProducts.find(p => p.id === id);
      return { ...prev, [id]: (current + 1) % (product?.image_paths?.length || 1) };
    });
  };

  const goToPrevImage = (id) => {
    setImageIndex(prev => {
      const current = prev[id] || 0;
      const product = allProducts.find(p => p.id === id);
      return { ...prev, [id]: (current - 1 + (product?.image_paths?.length || 1)) % (product?.image_paths?.length || 1) };
    });
  };

  const handleAddToCart = async (id, price) => {
    const userId = localStorage.getItem('user_id');
    if (!userId) {
      showToast("Please login first", 'error');
      return;
    }

    if (!cart.includes(id)) {
      setCart([...cart, id]);
      try {
        const token = localStorage.getItem('auth_token');
        await axios.post(BASE_URL_AND_PORT + "/cart/addtocart", {
          user_id: userId,
          productid: id,
          price: price.toString(),
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
            'API-KEY': API_KEY,
          },
        });
        showToast("Product added to cart successfully!", 'success');
        refreshCartCount();
      } catch (error) {
        console.error('Error adding to cart:', error);
        showToast("Failed to add to cart", 'error');
        setCart(cart.filter(cartId => cartId !== id));
      }
    } else {
      showToast("Product already in cart", 'info');
    }
  };

  const toggleWishlist = (productId) => {
    let newWishlist;
    if (wishlist.includes(productId)) {
      newWishlist = wishlist.filter(id => id !== productId);
      showToast("Removed from wishlist", 'info');
    } else {
      newWishlist = [...wishlist, productId];
      showToast("Added to wishlist", 'success');
    }
    setWishlist(newWishlist);
    localStorage.setItem('wishlist', JSON.stringify(newWishlist));
  };

  const renderStars = (rating, size = "text-sm") => {
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

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

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

  const setPowerPreset = (min, max) => {
    setPowerRange([min, max]);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <UserNavbar onToggleSidebar={toggleSidebar} />
      
      <div className="flex flex-1 relative">
        <UserSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

        <main 
          className={`
            flex-1 transition-all duration-300 ease-in-out w-full
            ${sidebarOpen ? 'lg:ml-72' : 'lg:ml-24'}
            ${isMobile && sidebarOpen ? 'overflow-hidden' : ''}
          `}
        >
          <div className="p-4 md:p-6 lg:p-8">
            {/* Toast Notification */}
            {toastMessage && (
              <div className={`fixed top-20 right-4 z-50 animate-slideIn ${
                toastMessage.type === 'success' ? 'bg-green-500' : 
                toastMessage.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
              } text-white px-6 py-3 rounded-lg shadow-lg`}>
                {toastMessage.message}
              </div>
            )}

            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-xl mb-6 md:mb-8">
              <div className="absolute inset-0 bg-black opacity-20"></div>
              <div className="relative z-10 px-4 py-8 md:px-8 md:py-12 lg:px-12 lg:py-16">
                <div className="max-w-2xl">
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 md:mb-4">Discover Our EV Chargers</h1>
                  <p className="text-blue-100 text-sm md:text-base lg:text-lg mb-4 md:mb-6">
                    From 3.3kW home chargers to 120kW ultra-fast DC chargers. Find the perfect charging solution for your needs.
                  </p>
                  <div className="flex gap-3 md:gap-4 flex-wrap">
                    <button className="bg-white text-blue-600 px-4 md:px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition text-sm md:text-base">Shop Now</button>
                    <Link to="/about">
                      <button className="border-2 border-white text-white px-4 md:px-6 py-2 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition text-sm md:text-base">
                        Learn More
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="absolute right-0 bottom-0 opacity-10 hidden md:block">
                <MdElectricBolt size={200} className="text-white" />
              </div>
            </div>

            {/* Quick Category Filters */}
            <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
              <button
                onClick={() => { setFilterType('ALL'); setSearchQuery(''); setPowerRange([0, 200]); }}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition whitespace-nowrap ${filterType === 'ALL' && !searchQuery ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                All Products
              </button>
              <button
                onClick={() => { setFilterType('AC'); setSearchQuery(''); setPowerRange([0, 200]); }}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition whitespace-nowrap ${filterType === 'AC' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                🔌 AC Chargers
              </button>
              <button
                onClick={() => { setFilterType('DC'); setSearchQuery(''); setPowerRange([0, 200]); }}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition whitespace-nowrap ${filterType === 'DC' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                ⚡ All DC Chargers
              </button>
            </div>

            {/* Controls Bar */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 md:p-4 mb-6">
              <div className="flex flex-col md:flex-row gap-3 md:gap-4 items-stretch md:items-center justify-between">
                <div className="relative w-full md:w-96">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
                    placeholder="Search by name or power (e.g., 60kW, 120kW)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <FiX size={18} />
                    </button>
                  )}
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="flex-1 md:flex-none px-4 py-2.5 border border-gray-300 rounded-lg bg-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                  >
                    <option value="ALL">All Chargers</option>
                    <option value="AC">AC Charger (7kW-22kW)</option>
                    <option value="DC">DC Fast Charger (30kW-120kW)</option>
                  </select>

                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex-1 md:flex-none px-4 py-2.5 border border-gray-300 rounded-lg bg-white font-medium flex items-center justify-center gap-2 hover:bg-gray-50 transition text-sm md:text-base"
                  >
                    <FiFilter size={18} />
                    Filters
                  </button>
                </div>
              </div>

              {showFilters && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Price Range: ₹{formatIndianPrice(priceRange[0])} - ₹{formatIndianPrice(priceRange[1])}</label>
                      <input
                        type="range"
                        min="0"
                        max="2000000"
                        step="10000"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Power Range: {powerRange[0]}kW - {powerRange[1]}kW</label>
                      <input
                        type="range"
                        min="0"
                        max="200"
                        step="5"
                        value={powerRange[1]}
                        onChange={(e) => setPowerRange([powerRange[0], parseInt(e.target.value)])}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                      />
                      
                      <div className="flex flex-wrap gap-2 mt-3">
                        <button onClick={() => setPowerPreset(0, 7)} className={`text-xs px-3 py-1 rounded-full transition ${powerRange[0] === 0 && powerRange[1] === 7 ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>Up to 7kW</button>
                        <button onClick={() => setPowerPreset(7, 22)} className={`text-xs px-3 py-1 rounded-full transition ${powerRange[0] === 7 && powerRange[1] === 22 ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>7kW - 22kW</button>
                        <button onClick={() => setPowerPreset(22, 30)} className={`text-xs px-3 py-1 rounded-full transition ${powerRange[0] === 22 && powerRange[1] === 30 ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>22kW - 30kW</button>
                        <button onClick={() => setPowerPreset(30, 60)} className={`text-xs px-3 py-1 rounded-full transition ${powerRange[0] === 30 && powerRange[1] === 60 ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>30kW - 60kW</button>
                        <button onClick={() => setPowerPreset(60, 120)} className={`text-xs px-3 py-1 rounded-full transition ${powerRange[0] === 60 && powerRange[1] === 120 ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>60kW - 120kW</button>
                        <button onClick={() => setPowerPreset(0, 200)} className={`text-xs px-3 py-1 rounded-full transition ${powerRange[0] === 0 && powerRange[1] === 200 ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>All Powers</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {loading ? (
                <div className="col-span-full flex justify-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 md:h-16 md:w-16 border-t-4 border-b-4 border-blue-600"></div>
                </div>
              ) : displayedProducts.length === 0 ? (
                <div className="col-span-full text-center py-20">
                  <div className="text-gray-400 text-5xl md:text-6xl mb-4">🔌</div>
                  <p className="text-gray-500 text-base md:text-lg">No products found matching your criteria.</p>
                  <button onClick={() => { setSearchQuery(''); setFilterType('ALL'); setPriceRange([0, 2000000]); setPowerRange([0, 200]); }} className="mt-4 text-blue-600 hover:text-blue-700 font-medium">Clear all filters</button>
                </div>
              ) : (
                displayedProducts.map((product) => {
                  const chargerPower = getChargerPower(product);
                  const badge = getChargerBadge(product);
                  const isDCProduct = !isAC(product);
                  const powerPercentage = getPowerPercentage(product);
                  const powerBarColor = getPowerBarColor(chargerPower);
                  const productSummary = reviewSummary[product.id] || { average_rating: 0, review_count: 0 };

                  return (
                    <div
                      key={product.id}
                      className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:-translate-y-1 relative"
                      onMouseEnter={() => setHoveredProduct(product.id)}
                      onMouseLeave={() => setHoveredProduct(null)}
                    >
                      <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 h-56 md:h-64 overflow-hidden cursor-pointer">
                        <img
                          src={product.image_paths?.[imageIndex[product.id] || 0] || 'https://via.placeholder.com/300'}
                          alt={product.name}
                          className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                          onClick={() => handlePopupOpen(product.id)}
                        />
                        
                        <div className="absolute top-3 left-3 z-10">
                          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${badge.color}`}>{badge.icon} {badge.text}</span>
                        </div>

                        {(isDC60KW(product) || isDC120KW(product)) && (
                          <div className="absolute top-3 right-3 z-10">
                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${isDC120KW(product) ? 'bg-red-500 text-white' : 'bg-orange-500 text-white'}`}>{isDC120KW(product) ? 'ULTRA FAST' : 'FAST CHARGE'}</span>
                          </div>
                        )}

                        {/* Quick View Button at Bottom on Hover */}
                        {hoveredProduct === product.id && (
                          <div 
                            className="absolute bottom-4 left-0 right-0 flex items-center justify-center transition-all duration-300 cursor-pointer z-20"
                            onClick={() => handlePopupOpen(product.id)}
                          >
                            <button className="bg-black/70 backdrop-blur-sm border-2 border-emerald-400 rounded-full px-5 py-2.5 flex items-center gap-2 text-emerald-400 text-sm font-bold shadow-lg transform transition-all duration-300 hover:scale-105 hover:bg-black/80">
                              <FiZoomIn size={16} />
                              <span>Quick View</span>
                            </button>
                          </div>
                        )}
                        
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
                          className="absolute bottom-3 right-3 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-red-50 transition z-10"
                        >
                          {wishlist.includes(product.id) ? (
                            <FaHeart className="text-red-500" size={16} />
                          ) : (
                            <FaRegHeart className="text-gray-400 hover:text-red-500" size={16} />
                          )}
                        </button>

                        {product.image_paths?.length > 1 && (
                          <>
                            <button
                              onClick={(e) => { e.stopPropagation(); goToPrevImage(product.id); }}
                              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition z-10"
                            >
                              <FiChevronLeft size={14} />
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); goToNextImage(product.id); }}
                              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition z-10"
                            >
                              <FiChevronRight size={14} />
                            </button>
                          </>
                        )}
                      </div>

                      <div className="p-4">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-bold text-gray-800 text-base md:text-lg line-clamp-1">{product.name}</h3>
                          {isDCProduct && <MdFlashOn className="text-purple-500" size={18} />}
                        </div>
                        <p className="text-gray-500 text-xs md:text-sm mb-2">{product.model}</p>
                        
                        <div className="mb-2">
                          <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>Rated Power</span>
                            <span className="font-semibold">{chargerPower} kW</span>
                          </div>
                          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${powerBarColor} transition-all duration-500`}
                              style={{ width: `${powerPercentage}%` }}
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mb-2 cursor-pointer hover:bg-gray-50 p-1 rounded-lg transition" onClick={() => openReviewsPopup(product)}>
                          {renderStars(productSummary.average_rating, "text-xs")}
                          <span className="text-xs text-gray-500">({productSummary.review_count} reviews)</span>
                        </div>

                        <div className="mb-3">
                          <span className="text-xl md:text-2xl font-bold text-blue-600">₹{formatIndianPrice(product.price)}</span>
                          {product.mrp && product.mrp > product.price && <span className="text-xs md:text-sm text-gray-400 line-through ml-2">₹{formatIndianPrice(product.mrp)}</span>}
                          {isDCProduct && <span className="text-xs text-gray-500 ml-2">+ GST</span>}
                        </div>

                        {isAC(product) ? (
                          product.quantity > 0 ? (
                            <button
                              onClick={() => handleAddToCart(product.id, product.price)}
                              className={`w-full py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 transition text-sm md:text-base ${cart.includes(product.id) ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
                            >
                              <FaShoppingCart size={14} />
                              {cart.includes(product.id) ? 'Added to Cart' : 'Add to Cart'}
                            </button>
                          ) : (
                            <button className="w-full py-2.5 rounded-lg font-semibold bg-gray-300 text-gray-500 cursor-not-allowed text-sm md:text-base">
                              Out of Stock
                            </button>
                          )
                        ) : (
                          <button
                            onClick={() => setContactPopup(true)}
                            className="w-full py-2.5 rounded-lg font-semibold bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white transition text-sm md:text-base"
                          >
                            {chargerPower >= 30 ? `Get Quote for ${chargerPower}kW` : 'Contact Sales Team'}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Contact Popup */}
      {contactPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[9999] animate-fadeIn p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4">
              <h3 className="text-xl font-bold text-white">Contact Sales Team</h3>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">For enquiries about <span className="font-semibold text-orange-600">DC Fast Chargers (30kW, 60kW, 120kW)</span>, please reach out to our dedicated sales team.</p>
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-500 mb-1">Email us at</p>
                <a href="mailto:tgwbin@gmail.com" className="text-lg font-semibold text-blue-600 hover:underline break-all">tgwbin@gmail.com</a>
              </div>
              <button onClick={() => setContactPopup(false)} className="w-full py-3 bg-gray-800 hover:bg-gray-900 text-white rounded-lg font-semibold transition">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Product Details Popup */}
      {popupOpen && popupContent.id && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-[9999] p-4 animate-fadeIn overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl">
            <button
              className="absolute top-4 right-4 z-10 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-all duration-300 hover:scale-110"
              onClick={() => setPopupOpen(false)}
            >
              <FiX size={18} />
            </button>

            <div className="p-4 md:p-6 lg:p-8">
              <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                {/* Left - Image Gallery */}
                <div className="lg:w-1/2">
                  <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden shadow-lg">
                    <img
                      src={popupContent.image_paths?.[popupImageIndex] || 'https://via.placeholder.com/400'}
                      alt={popupContent.name}
                      className="w-full h-64 md:h-80 lg:h-96 object-contain p-4 cursor-pointer transition-transform duration-300 hover:scale-105"
                      onClick={() => setPopupImageIndex(prev => (prev + 1) % (popupContent.image_paths?.length || 1))}
                    />
                    {popupContent.image_paths?.length > 1 && (
                      <>
                        <button
                          onClick={() => setPopupImageIndex(prev => (prev - 1 + popupContent.image_paths.length) % popupContent.image_paths.length)}
                          className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-all duration-300 hover:scale-110"
                        >
                          <FiChevronLeft size={18} />
                        </button>
                        <button
                          onClick={() => setPopupImageIndex(prev => (prev + 1) % popupContent.image_paths.length)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-all duration-300 hover:scale-110"
                        >
                          <FiChevronRight size={18} />
                        </button>
                      </>
                    )}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                      Click image to see next
                    </div>
                  </div>
                  
                  {popupContent.image_paths?.length > 1 && (
                    <div className="flex gap-2 mt-4 justify-center flex-wrap">
                      {popupContent.image_paths.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setPopupImageIndex(idx)}
                          className={`w-14 h-14 md:w-16 md:h-16 rounded-xl overflow-hidden border-2 transition-all duration-300 hover:scale-105 ${
                            popupImageIndex === idx 
                              ? 'border-blue-500 ring-2 ring-blue-200 shadow-md' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right - Product Details */}
                <div className="lg:w-1/2">
                  <div className="mb-4 flex flex-wrap gap-2">
                    <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-semibold ${
                      isAC(popupContent) 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-purple-100 text-purple-700'
                    }`}>
                      {isAC(popupContent) ? '🔌 AC Charger' : `⚡ DC Fast Charger ${getChargerPower(popupContent)}kW`}
                    </span>
                    {(isDC60KW(popupContent) || isDC120KW(popupContent)) && (
                      <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-semibold ${
                        isDC120KW(popupContent) 
                          ? 'bg-red-100 text-red-700' 
                          : 'bg-orange-100 text-orange-700'
                      }`}>
                        {isDC120KW(popupContent) ? '🔥 Ultra Fast Charging' : '🚀 Fast Charge Technology'}
                      </span>
                    )}
                  </div>
                  
                  <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 mb-2">{popupContent.name}</h2>
                  <p className="text-gray-500 text-sm md:text-base mb-4">Model: {popupContent.model}</p>
                  
                  <div className="flex items-center gap-4 mb-4 cursor-pointer" onClick={() => openReviewsPopup(popupContent)}>
                    {renderStars(reviewSummary[popupContent.id]?.average_rating || 0, "text-sm")}
                    <span className="text-sm text-gray-500">({reviewSummary[popupContent.id]?.review_count || 0} customer reviews)</span>
                  </div>

                  <div className="mb-4">
                    <span className="text-3xl md:text-4xl font-bold text-blue-600">₹{formatIndianPrice(popupContent.price)}</span>
                    {popupContent.mrp && popupContent.mrp > popupContent.price && <span className="text-gray-400 line-through ml-2 text-lg">₹{formatIndianPrice(popupContent.mrp)}</span>}
                    {!isAC(popupContent) && <span className="text-sm text-gray-500 ml-2">+ GST</span>}
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-600 p-2 bg-gray-50 rounded-lg"><MdVerified className="text-green-600" size={18} /><span>12 Months Warranty</span></div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 p-2 bg-gray-50 rounded-lg"><MdSecurity className="text-blue-600" size={18} /><span>Safety Certified</span></div>
                    {popupContent.details?.cable_length && <div className="flex items-center gap-2 text-sm text-gray-600 p-2 bg-gray-50 rounded-lg"><MdSpeed className="text-orange-600" size={18} /><span>Cable: {popupContent.details.cable_length}</span></div>}
                  </div>

                  <div className="space-y-3">
                    {isAC(popupContent) ? (
                      popupContent.quantity > 0 ? (
                        <button
                          onClick={() => handleAddToCart(popupContent.id, popupContent.price)}
                          className={`w-full py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${
                            cart.includes(popupContent.id) 
                              ? 'bg-green-500 hover:bg-green-600' 
                              : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
                          } text-white shadow-md hover:shadow-lg`}
                        >
                          <FaShoppingCart size={18} />
                          {cart.includes(popupContent.id) ? 'Added to Cart' : 'Add to Cart'}
                        </button>
                      ) : (
                        <button className="w-full py-3.5 bg-gray-300 text-gray-500 rounded-xl font-semibold cursor-not-allowed">
                          Out of Stock
                        </button>
                      )
                    ) : (
                      <button
                        onClick={() => { setContactPopup(true); setPopupOpen(false); }}
                        className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
                      >
                        Request Quote for {getChargerPower(popupContent)}kW DC Charger
                      </button>
                    )}
                    
                    <button
                      onClick={() => toggleWishlist(popupContent.id)}
                      className={`w-full py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 border-2 transition-all duration-300 ${
                        wishlist.includes(popupContent.id) 
                          ? 'border-red-500 text-red-500 bg-red-50' 
                          : 'border-gray-300 text-gray-700 hover:border-blue-500 hover:bg-blue-50'
                      }`}
                    >
                      {wishlist.includes(popupContent.id) ? <FaHeart /> : <FaRegHeart />}
                      {wishlist.includes(popupContent.id) ? 'Saved to Wishlist' : 'Add to Wishlist'}
                    </button>
                  </div>

                  <div className="mt-6 p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border border-red-200">
                    <p className="text-sm text-red-700">
                      <strong>⚠️ Disclaimer:</strong> Cancellations & Refunds Policy applies.
                      <button onClick={() => navigate("/cancellation-policy")} className="ml-2 text-red-600 underline hover:text-red-800 font-medium">Read more →</button>
                    </p>
                  </div>
                </div>
              </div>

              {/* Technical Specifications */}
              {popupContent.details && Object.keys(popupContent.details).filter(k => popupContent.details[k] && popupContent.details[k] !== 'N/A').length > 0 && (
                <div className="mt-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"></div>
                      <div>
                        <h3 className="text-xl md:text-2xl font-bold text-gray-800">Technical Specifications</h3>
                        <p className="text-sm text-gray-500 mt-0.5">Complete technical details and specifications</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(popupContent.details).map(([key, value]) => {
                      if (!value || value === 'N/A') return null;
                      
                      const labels = { phase: 'Phase', cooling: 'Cooling Type', rated_power: 'Rated Power', ingress_protection: 'IP Rating', current: 'Current Rating', display: 'Display Type', gun_type: 'Gun Type', material: 'Material', dimensions: 'Dimensions', protection: 'Protection Features', communication: 'Communication', cable_length: 'Cable Length', input_voltage: 'Input Voltage', ouput_voltage: 'Output Voltage', operatingtemps: 'Operating Temperature', ocpp_present: 'OCPP Support' };
                      const icons = { rated_power: '⚡', current: '🔌', efficiency: '📊', warranty: '🛡️', weight: '⚖️', dimensions: '📏', operatingtemps: '🌡️', phase: '🔄', cooling: '❄️', ingress_protection: '💧', display: '🖥️', gun_type: '🔫', material: '🏗️', protection: '🛡️', communication: '📡', cable_length: '📏', input_voltage: '⚡', ouput_voltage: '⚡', ocpp_present: '🌐' };
                      
                      return (
                        <div key={key} className="group rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200">
                          <div className="flex items-start gap-3">
                            <div className="text-2xl">{icons[key] || '🔧'}</div>
                            <div className="flex-1">
                              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{labels[key] || key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</div>
                              <div className="font-bold text-gray-800 break-words text-base">{value}</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reviews Popup Modal */}
      {reviewsPopupOpen && selectedProductForReviews && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex justify-center items-center z-[10000] p-4 animate-fadeIn overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full relative max-h-[85vh] overflow-y-auto animate-slideUp">
            <button
              className="absolute top-4 right-4 z-20 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-500 hover:bg-gradient-to-r hover:from-red-500 hover:to-rose-600 hover:text-white transition-all duration-300"
              onClick={() => setReviewsPopupOpen(false)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            <div className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-yellow-100 rounded-xl"><FaStar className="h-6 w-6 text-yellow-500" /></div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Customer Reviews</h2>
                  <p className="text-sm text-gray-500">for {selectedProductForReviews.name}</p>
                </div>
              </div>

              {/* Rating Summary */}
              {reviewSummary[selectedProductForReviews.id] && (
                <div className="mb-6 p-5 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-2xl">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Average Rating</p>
                      <div className="flex items-center gap-2">
                        <span className="text-4xl font-bold text-gray-800">{reviewSummary[selectedProductForReviews.id].average_rating || 0}</span>
                        {renderStars(reviewSummary[selectedProductForReviews.id].average_rating || 0, "text-xl")}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 mb-1">Total Reviews</p>
                      <p className="text-3xl font-bold text-gray-800">{reviewSummary[selectedProductForReviews.id].review_count || 0}</p>
                    </div>
                  </div>
                  
                  {/* Rating Breakdown */}
                  {reviewSummary[selectedProductForReviews.id].rating_breakdown && (
                    <div className="mt-4 pt-4 border-t border-amber-200">
                      {[5, 4, 3, 2, 1].map(star => (
                        <div key={star} className="flex items-center gap-3 mb-2">
                          <span className="text-sm w-8">{star} ★</span>
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${(reviewSummary[selectedProductForReviews.id].rating_breakdown[star] / reviewSummary[selectedProductForReviews.id].review_count) * 100 || 0}%` }} />
                          </div>
                          <span className="text-xs text-gray-500 w-8">{reviewSummary[selectedProductForReviews.id].rating_breakdown[star] || 0}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Reviews List */}
              {loadingReviews[selectedProductForReviews.id] ? (
                <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-400 border-t-transparent"></div></div>
              ) : currentReviews.length > 0 ? (
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                  {currentReviews.map((review) => (
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
                          <span>{new Date(review.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                        </div>
                      </div>
                      {review.review && <p className="text-gray-700 leading-relaxed mt-3 pl-12">{review.review}</p>}
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

              {/* Load More Button */}
              {currentReviews.length >= 10 && (
                <button onClick={loadMoreReviews} className="mt-6 w-full py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300">
                  Load More Reviews
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(40px) scale(0.96); } to { opacity: 1; transform: translateY(0) scale(1); } }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
        .animate-slideIn { animation: slideIn 0.3s ease-out; }
        .animate-slideUp { animation: slideUp 0.4s cubic-bezier(0.34, 1.2, 0.64, 1); }
      `}</style>
    </div>
  );
};

export default ProductPage;