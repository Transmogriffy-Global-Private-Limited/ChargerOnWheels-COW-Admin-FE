
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import AdminSidebar from './Admin_sidebar';
// import AdminNavbar from './Admin_navbar';
// import { Bar, Doughnut, Line } from 'react-chartjs-2';
// import { 
//   Chart as ChartJS, 
//   CategoryScale, 
//   LinearScale, 
//   BarElement, 
//   Title, 
//   Tooltip, 
//   Legend,
//   ArcElement,
//   PointElement,
//   LineElement,
//   Filler
// } from 'chart.js';

// // Register Chart.js components
// ChartJS.register(
//   CategoryScale, 
//   LinearScale, 
//   BarElement, 
//   Title, 
//   Tooltip, 
//   Legend,
//   ArcElement,
//   PointElement,
//   LineElement,
//   Filler
// );

// const BASE_URL_AND_PORT = 'https://api.static.ev.transev.site';
// const API_KEY = 'mlzuMoRFjdGhcFulLMaVtfwNAHycbBAf';

// // ✅ FIX: Dynamic token and headers helper functions
// const getAuthToken = () => {
//   return localStorage.getItem('auth_token');
// };

// const getHeaders = (customHeaders = {}) => {
//   const token = getAuthToken();
//   return {
//     'API-Key': API_KEY,
//     'Content-Type': 'application/json',
//     ...(token && { 'Authorization': `Bearer ${token}` }),
//     ...customHeaders
//   };
// };

// const Dashboard = () => {
//   const navigate = useNavigate();
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [isMobile, setIsMobile] = useState(false);
//   const [productAnalytics, setProductAnalytics] = useState([]);
//   const [productStockAnalysis, setProductStockAnalysis] = useState([]);
//   const [totalSales, setTotalSales] = useState(0);
//   const [orderHistory, setOrderHistory] = useState([]);
//   const [totalChargers, setTotalChargers] = useState(131);
//   const [stockLoading, setStockLoading] = useState(true);
//   const [selectedPeriod, setSelectedPeriod] = useState('weekly');
//   const [recentOrders, setRecentOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [adminProfile, setAdminProfile] = useState({ id: '' });
//   const [retryCount, setRetryCount] = useState(0);

//   const toggleSidebar = () => {
//     setSidebarOpen(!sidebarOpen);
//   };

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

//   // ✅ FIX: Check authentication on mount
//   useEffect(() => {
//     const checkAuth = () => {
//       const token = getAuthToken();
//       if (!token) {
//         console.warn('No auth token found, redirecting to login...');
//         setError('Authentication required. Please login.');
//         setLoading(false);
//         // Redirect to login after 2 seconds
//         setTimeout(() => {
//           navigate('/admin/login');
//         }, 2000);
//         return false;
//       }
//       return true;
//     };

//     checkAuth();
//   }, [navigate]);

//   // ✅ FIX: Get admin profile with proper error handling
//   useEffect(() => {
//     const getAdminProfile = async () => {
//       try {
//         const token = getAuthToken();
//         if (!token) {
//           return;
//         }

//         console.log('Fetching admin profile...');
//         const response = await fetch(`${BASE_URL_AND_PORT}/admin/profile`, {
//           method: 'GET',
//           headers: getHeaders()
//         });

//         if (response.ok) {
//           const data = await response.json();
//           console.log('Admin profile fetched:', data);
//           setAdminProfile(data);
//           // Store admin ID for later use
//           localStorage.setItem('admin_id', data.id);
//         } else if (response.status === 401) {
//           console.error('Unauthorized - Invalid token');
//           handleUnauthorized();
//         } else {
//           console.error('Failed to fetch admin profile:', response.status);
//           setError('Failed to load admin profile');
//         }
//       } catch (error) {
//         console.error('Error fetching admin profile:', error);
//         setError('Network error. Please check your connection.');
//       }
//     };

//     getAdminProfile();
//   }, [navigate]);

//   // ✅ FIX: Main data fetching with dynamic token
//   useEffect(() => {
//     const fetchData = async () => {
//       // Check token first
//       const token = getAuthToken();
//       if (!token) {
//         setLoading(false);
//         setError('Authentication required. Please login again.');
//         return;
//       }

//       // Check if admin profile is loaded
//       const adminId = adminProfile.id || localStorage.getItem('admin_id');
//       if (!adminId) {
//         console.log('Waiting for admin profile...');
//         return;
//       }

//       setLoading(true);
//       setError(null);

//       try {
//         console.log('Fetching dashboard data with token:', token ? 'Token exists' : 'No token');

//         // ✅ FIX: Use Promise.allSettled to handle partial failures
//         const results = await Promise.allSettled([
//           // 1. Product Analytics
//           fetch(`${BASE_URL_AND_PORT}/analytics/product_analytics`, {
//             method: 'GET',
//             headers: getHeaders()
//           }),
//           // 2. Product Stock Analysis
//           fetch(`${BASE_URL_AND_PORT}/analytics/product_stock_analysis`, {
//             method: 'GET',
//             headers: getHeaders()
//           }),
//           // 3. Total Sales
//           fetch(`${BASE_URL_AND_PORT}/analytics/total_sales`, {
//             method: 'GET',
//             headers: getHeaders()
//           }),
//           // 4. Order History
//           fetch(`${BASE_URL_AND_PORT}/order/orderhistory`, {
//             method: 'POST',
//             headers: getHeaders(),
//             body: JSON.stringify({ user_id: adminId })
//           })
//         ]);

//         // Process each response
//         const [
//           productAnalyticsResult,
//           productStockAnalysisResult,
//           totalSalesResult,
//           orderHistoryResult
//         ] = results;

//         // 1. Product Analytics
//         if (productAnalyticsResult.status === 'fulfilled') {
//           const response = productAnalyticsResult.value;
//           if (response.ok) {
//             const data = await response.json();
//             setProductAnalytics(data.product_analytics || []);
//           } else if (response.status === 401) {
//             handleUnauthorized();
//             return;
//           } else {
//             console.error('Product analytics error:', response.status);
//           }
//         }

//         // 2. Product Stock Analysis
//         if (productStockAnalysisResult.status === 'fulfilled') {
//           const response = productStockAnalysisResult.value;
//           if (response.ok) {
//             const data = await response.json();
//             setProductStockAnalysis(data.product_stock_analysis || []);
//             setStockLoading(false);
//           } else if (response.status === 401) {
//             handleUnauthorized();
//             return;
//           } else {
//             console.error('Stock analysis error:', response.status);
//           }
//         }

//         // 3. Total Sales
//         if (totalSalesResult.status === 'fulfilled') {
//           const response = totalSalesResult.value;
//           if (response.ok) {
//             const data = await response.json();
//             setTotalSales(data.total_sales || 0);
//           } else if (response.status === 401) {
//             handleUnauthorized();
//             return;
//           } else {
//             console.error('Total sales error:', response.status);
//           }
//         }

//         // 4. Order History
//         if (orderHistoryResult.status === 'fulfilled') {
//           const response = orderHistoryResult.value;
//           if (response.ok) {
//             const data = await response.json();
//             const orders = data.orders || [];
//             setOrderHistory(orders);
//             setRecentOrders(orders.slice(0, 5));
//           } else if (response.status === 401) {
//             handleUnauthorized();
//             return;
//           } else {
//             console.error('Order history error:', response.status);
//           }
//         }

//         // If all data failed, show error
//         if (
//           productAnalyticsResult.status === 'rejected' &&
//           productStockAnalysisResult.status === 'rejected' &&
//           totalSalesResult.status === 'rejected' &&
//           orderHistoryResult.status === 'rejected'
//         ) {
//           setError('Failed to load dashboard data. Please try again.');
//         }

//       } catch (error) {
//         console.error('Error fetching data:', error);
//         setError('Network error. Please check your connection and try again.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [adminProfile.id, navigate, retryCount]);

//   // ✅ FIX: Handle unauthorized access
//   const handleUnauthorized = () => {
//     setError('Session expired. Please login again.');
//     localStorage.removeItem('auth_token');
//     localStorage.removeItem('admin_id');
//     setTimeout(() => {
//       navigate('/admin/login');
//     }, 2000);
//   };

//   // ✅ Refresh data function
//   const refreshData = () => {
//     setRetryCount(prev => prev + 1);
//     setError(null);
//     setLoading(true);
//   };

//   // Navigate to orders page
//   const goToOrdersPage = () => {
//     navigate('/admin/orders');
//   };

//   // Calculate functions
//   const calculateTotalOrders = () => {
//     return productAnalytics.reduce((total, product) => total + (product.total_orders || 0), 0);
//   };

//   const calculateLowStockItems = () => {
//     return productStockAnalysis.filter(product => (product.remaining_stock || 0) < 10).length;
//   };

//   const calculateAverageOrderValue = () => {
//     const total = calculateTotalSalesFromAnalytics();
//     const orders = calculateTotalOrders();
//     return orders > 0 ? (total / orders).toFixed(2) : 0;
//   };

//   const calculateTotalSalesFromAnalytics = () => {
//     return productAnalytics.reduce((total, product) => total + (product.total_sales || 0), 0);
//   };

//   // Chart Data
//   const barChartData = {
//     labels: productAnalytics.map((product) => product.product_name),
//     datasets: [
//       {
//         label: 'Total Orders',
//         data: productAnalytics.map((product) => product.total_orders),
//         backgroundColor: 'rgba(34, 197, 94, 0.7)',
//         borderRadius: 8,
//         borderSkipped: false,
//       },
//     ],
//   };

//   const totalStock = productStockAnalysis.reduce((sum, p) => sum + (p.initial_stock || 0), 0);
//   const soldStock = productStockAnalysis.reduce((sum, p) => sum + (p.total_ordered || 0), 0);
//   const remainingStock = totalStock - soldStock;

//   const doughnutData = {
//     labels: ['Sold Stock', 'Remaining Stock'],
//     datasets: [
//       {
//         data: [soldStock, remainingStock],
//         backgroundColor: ['#10b981', '#3b82f6'],
//         borderWidth: 0,
//         cutout: '60%',
//       },
//     ],
//   };

//   const lineChartData = {
//     labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
//     datasets: [
//       {
//         label: 'Sales Trend',
//         data: [4200, 5800, 7200, 6800, 9100, 11500, 14200, 13800, 15600, 18900, 21400, 24800],
//         borderColor: '#10b981',
//         backgroundColor: 'rgba(16, 185, 129, 0.1)',
//         fill: true,
//         tension: 0.4,
//         pointBackgroundColor: '#10b981',
//         pointBorderColor: '#fff',
//         pointBorderWidth: 2,
//         pointRadius: 4,
//         pointHoverRadius: 6,
//       },
//     ],
//   };

//   const barChartOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: { display: false },
//       tooltip: { backgroundColor: '#1f2937', titleColor: '#fff', bodyColor: '#e5e7eb' },
//     },
//     scales: {
//       y: { beginAtZero: true, grid: { color: '#e5e7eb' }, ticks: { stepSize: 5 } },
//       x: { ticks: { maxRotation: 45, minRotation: 0, font: { size: 11 } } },
//     },
//   };

//   const doughnutOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: { position: 'bottom', labels: { font: { size: 11 }, usePointStyle: true } },
//       tooltip: { backgroundColor: '#1f2937' },
//     },
//   };

//   const lineChartOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: { position: 'top', labels: { font: { size: 11 } } },
//       tooltip: { callbacks: { label: (ctx) => `₹${ctx.raw.toLocaleString()}` } },
//     },
//     scales: {
//       y: { ticks: { callback: (value) => `₹${value.toLocaleString()}` } },
//     },
//   };

//   // ✅ Loading state with better UI
//   if (loading) {
//     return (
//       <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//         <AdminNavbar onToggleSidebar={toggleSidebar} />
//         <div className="flex flex-1 justify-center items-center p-4">
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600 mx-auto"></div>
//             <p className="mt-4 text-gray-600 text-sm md:text-base">Loading dashboard...</p>
//             <p className="text-gray-400 text-xs mt-1">Please wait while we fetch your data</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // ✅ Error state with retry option
//   if (error) {
//     return (
//       <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//         <AdminNavbar onToggleSidebar={toggleSidebar} />
//         <div className="flex flex-1 justify-center items-center p-4">
//           <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-lg border border-red-100">
//             <div className="text-center">
//               <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
//                 </svg>
//               </div>
//               <h3 className="text-lg font-semibold text-gray-800 mb-2">Something went wrong</h3>
//               <p className="text-gray-600 text-sm mb-4">{error}</p>
//               <div className="flex gap-3 justify-center flex-wrap">
//                 <button 
//                   onClick={refreshData}
//                   className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm flex items-center gap-2"
//                 >
//                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//                   </svg>
//                   Retry
//                 </button>
//                 <button 
//                   onClick={() => navigate('/admin/login')}
//                   className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm"
//                 >
//                   Go to Login
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Main Dashboard Render
//   return (
//     <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//       <AdminNavbar onToggleSidebar={toggleSidebar} />
      
//       <div className="flex flex-1 relative">
//         {/* Sidebar */}
//         <AdminSidebar 
//           isVisible={sidebarOpen} 
//           onClose={() => setSidebarOpen(false)} 
//         />

//         {/* Main Content */}
//         <main 
//           className={`
//             flex-1 transition-all duration-300 ease-in-out w-full min-h-screen
//             ${sidebarOpen ? 'lg:ml-72' : 'lg:ml-24'}
//             ${isMobile && sidebarOpen ? 'overflow-hidden' : ''}
//           `}
//         >
//           <div className="p-3 md:p-4 lg:p-6 xl:p-8">
//             <div className="max-w-full mx-auto space-y-4 md:space-y-6 lg:space-y-8">
              
//               {/* Header with Greeting */}
//               <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4">
//                 <div>
//                   <h1 className="text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
//                     Dashboard
//                   </h1>
//                   <p className="text-gray-500 text-xs md:text-sm lg:text-base mt-1">
//                     Welcome back! Here's what's happening with your EV chargers today.
//                   </p>
//                 </div>
//                 <div className="flex items-center gap-2 md:gap-3">
//                   <select 
//                     value={selectedPeriod}
//                     onChange={(e) => setSelectedPeriod(e.target.value)}
//                     className="px-2 md:px-3 py-1.5 md:py-2 bg-white border border-gray-200 rounded-lg text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
//                   >
//                     <option value="daily">Today</option>
//                     <option value="weekly">This Week</option>
//                     <option value="monthly">This Month</option>
//                     <option value="yearly">This Year</option>
//                   </select>
//                   <button 
//                     onClick={refreshData}
//                     className="p-1.5 md:p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
//                     title="Refresh data"
//                   >
//                     <svg className="w-4 h-4 md:w-5 md:h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//                     </svg>
//                   </button>
//                 </div>
//               </div>

//               {/* Stats Cards Grid */}
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
//                 <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-gray-500 text-xs md:text-sm font-medium">Total Chargers</p>
//                       <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 mt-1">{productAnalytics.length}</h3>
//                       <span className="text-[10px] md:text-xs text-green-600 mt-2 inline-flex items-center gap-1">↑ 12% from last month</span>
//                     </div>
//                     <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
//                       <svg className="w-5 h-5 md:w-6 md:h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
//                       </svg>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-gray-500 text-xs md:text-sm font-medium">Total Orders</p>
//                       <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 mt-1">{calculateTotalOrders()}</h3>
//                       <span className="text-[10px] md:text-xs text-green-600 mt-2 inline-flex items-center gap-1">↑ 8% from last month</span>
//                     </div>
//                     <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-xl flex items-center justify-center">
//                       <svg className="w-5 h-5 md:w-6 md:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
//                       </svg>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-gray-500 text-xs md:text-sm font-medium">Total Sales</p>
//                       <h3 className="text-sm md:text-xl lg:text-2xl font-bold text-gray-800 mt-1">₹{totalSales.toLocaleString()}</h3>
//                       <span className="text-[10px] md:text-xs text-green-600 mt-2 inline-flex items-center gap-1">↑ 23% from last month</span>
//                     </div>
//                     <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-100 rounded-xl flex items-center justify-center">
//                       <svg className="w-5 h-5 md:w-6 md:h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                       </svg>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-gray-500 text-xs md:text-sm font-medium">Avg. Order Value</p>
//                       <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 mt-1">₹{calculateAverageOrderValue()}</h3>
//                       <span className="text-[10px] md:text-xs text-gray-500 mt-2">From {calculateTotalOrders()} orders</span>
//                     </div>
//                     <div className="w-10 h-10 md:w-12 md:h-12 bg-amber-100 rounded-xl flex items-center justify-center">
//                       <svg className="w-5 h-5 md:w-6 md:h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
//                       </svg>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Charts Row */}
//               <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
//                 {/* Bar Chart */}
//                 <div className="lg:col-span-2 bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100">
//                   <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
//                     <h3 className="text-base md:text-lg font-semibold text-gray-800">Performance Overview</h3>
//                     <div className="flex gap-2">
//                       <button className="px-2 md:px-3 py-1 text-[10px] md:text-xs bg-emerald-50 text-emerald-600 rounded-lg">Orders</button>
//                       <button className="px-2 md:px-3 py-1 text-[10px] md:text-xs text-gray-500 hover:bg-gray-50 rounded-lg">Revenue</button>
//                     </div>
//                   </div>
//                   <div className="h-56 md:h-64 lg:h-72">
//                     {productAnalytics.length > 0 ? (
//                       <Bar data={barChartData} options={barChartOptions} />
//                     ) : (
//                       <div className="flex items-center justify-center h-full text-gray-400 text-sm">
//                         No data available
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 {/* Doughnut Chart */}
//                 <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100">
//                   <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-4">Stock Distribution</h3>
//                   <div className="h-40 md:h-44 lg:h-48">
//                     <Doughnut data={doughnutData} options={doughnutOptions} />
//                   </div>
//                   <div className="mt-4 grid grid-cols-2 gap-3 text-center">
//                     <div className="p-2 bg-gray-50 rounded-xl">
//                       <p className="text-[10px] md:text-xs text-gray-500">Sold Stock</p>
//                       <p className="text-base md:text-lg font-bold text-emerald-600">{soldStock}</p>
//                     </div>
//                     <div className="p-2 bg-gray-50 rounded-xl">
//                       <p className="text-[10px] md:text-xs text-gray-500">Remaining</p>
//                       <p className="text-base md:text-lg font-bold text-blue-600">{remainingStock}</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Sales Trend & Recent Orders */}
//               <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
//                 {/* Line Chart */}
//                 <div className="lg:col-span-2 bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100">
//                   <div className="flex items-center justify-between mb-4">
//                     <h3 className="text-base md:text-lg font-semibold text-gray-800">Sales Trend</h3>
//                     <span className="text-[10px] md:text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">+28.4%</span>
//                   </div>
//                   <div className="h-56 md:h-64">
//                     <Line data={lineChartData} options={lineChartOptions} />
//                   </div>
//                 </div>

//                 {/* Recent Orders */}
//                 <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100">
//                   <div className="flex items-center justify-between mb-4">
//                     <h3 className="text-base md:text-lg font-semibold text-gray-800">Recent Orders</h3>
//                     <button 
//                       onClick={goToOrdersPage}
//                       className="text-[10px] md:text-xs text-emerald-600 hover:text-emerald-700 font-medium transition-colors flex items-center gap-1"
//                     >
//                       View All
//                       <svg className="w-3 h-3 md:w-3.5 md:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                       </svg>
//                     </button>
//                   </div>
//                   <div className="space-y-3">
//                     {recentOrders.length > 0 ? (
//                       recentOrders.map((order, idx) => (
//                         <div 
//                           key={idx} 
//                           className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0 cursor-pointer hover:bg-gray-50 transition-colors rounded-lg px-2"
//                           onClick={() => navigate('/admin/orders')}
//                         >
//                           <div className="flex-1 min-w-0">
//                             <p className="text-xs md:text-sm font-medium text-gray-800 truncate">Order #{order.order_id?.slice(-6) || 'N/A'}</p>
//                             <p className="text-[10px] md:text-xs text-gray-400">{new Date(order.created_at || Date.now()).toLocaleDateString()}</p>
//                           </div>
//                           <div className="text-right ml-3">
//                             <p className="text-xs md:text-sm font-semibold text-gray-800">₹{order.total_amount || 0}</p>
//                             <span className="text-[8px] md:text-[10px] px-2 py-0.5 bg-green-100 text-green-700 rounded-full whitespace-nowrap">
//                               {order.status || 'Completed'}
//                             </span>
//                           </div>
//                         </div>
//                       ))
//                     ) : (
//                       <p className="text-gray-400 text-xs md:text-sm text-center py-4">No recent orders</p>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {/* Stock Status Table */}
//               <div className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
//                 <div className="p-4 md:p-6 border-b border-gray-100">
//                   <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
//                     <h3 className="text-base md:text-lg font-semibold text-gray-800">Charger Stock Status</h3>
//                     <div className="flex items-center gap-3">
//                       <div className="flex items-center gap-1 text-[10px] md:text-xs">
//                         <span className="w-2 h-2 md:w-3 md:h-3 bg-red-500 rounded-full"></span>
//                         <span className="text-gray-500">Low Stock (&lt;10)</span>
//                       </div>
//                       <span className="text-[10px] md:text-xs text-gray-500">Total: {productStockAnalysis.length} items</span>
//                     </div>
//                   </div>
//                 </div>
                
//                 <div className="overflow-x-auto">
//                   <table className="w-full min-w-[500px]">
//                     <thead className="bg-gray-50">
//                       <tr>
//                         <th className="px-3 md:px-6 py-3 text-left text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
//                         <th className="px-3 md:px-6 py-3 text-left text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-wider">Initial Stock</th>
//                         <th className="px-3 md:px-6 py-3 text-left text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-wider">Remaining Stock</th>
//                         <th className="px-3 md:px-6 py-3 text-left text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-wider">Total Ordered</th>
//                         <th className="px-3 md:px-6 py-3 text-left text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                       </tr>
//                     </thead>
//                     <tbody className="divide-y divide-gray-100">
//                       {stockLoading ? (
//                         <tr>
//                           <td colSpan="5" className="px-6 py-12 text-center">
//                             <div className="flex justify-center">
//                               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
//                             </div>
//                           </td>
//                         </tr>
//                       ) : productStockAnalysis.length > 0 ? (
//                         productStockAnalysis.map((product, index) => {
//                           const isLowStock = (product.remaining_stock || 0) < 10;
//                           return (
//                             <tr key={index} className="hover:bg-gray-50 transition-colors">
//                               <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm font-medium text-gray-900">{product.product_name}</td>
//                               <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-gray-600">{product.initial_stock}</td>
//                               <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm">
//                                 <span className={`font-medium ${isLowStock ? 'text-red-600' : 'text-gray-900'}`}>
//                                   {product.remaining_stock}
//                                 </span>
//                               </td>
//                               <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-gray-600">{product.total_ordered}</td>
//                               <td className="px-3 md:px-6 py-3 md:py-4">
//                                 <span className={`inline-flex px-2 py-0.5 md:py-1 text-[8px] md:text-[10px] rounded-full font-medium ${
//                                   isLowStock ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
//                                 }`}>
//                                   {isLowStock ? 'Low Stock' : 'In Stock'}
//                                 </span>
//                               </td>
//                             </tr>
//                           );
//                         })
//                       ) : (
//                         <tr>
//                           <td colSpan="5" className="px-6 py-12 text-center text-gray-400 text-sm">No stock data available</td>
//                         </tr>
//                       )}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AdminSidebar from './Admin_sidebar';
import AdminNavbar from './Admin_navbar';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
);

const BASE_URL_AND_PORT = 'https://api.static.ev.transev.site';
const API_KEY = 'mlzuMoRFjdGhcFulLMaVtfwNAHycbBAf';

// Helper functions
const getAuthToken = () => {
  return localStorage.getItem('auth_token');
};

const getHeaders = (customHeaders = {}) => {
  const token = getAuthToken();
  return {
    'API-Key': API_KEY,
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...customHeaders
  };
};

// Helper to build query params
const buildQueryParams = (period, from, to) => {
  const params = new URLSearchParams();
  
  if (period && !from && !to) {
    params.append('period', period);
  }
  
  if (from) {
    params.append('from', from);
  }
  
  if (to) {
    params.append('to', to);
  }
  
  return params.toString();
};

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [productAnalytics, setProductAnalytics] = useState([]);
  const [productStockAnalysis, setProductStockAnalysis] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const [orderHistory, setOrderHistory] = useState([]);
  const [totalChargers, setTotalChargers] = useState(131);
  const [stockLoading, setStockLoading] = useState(true);
  
  // Filter states
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');
  const [showCustomRange, setShowCustomRange] = useState(false);
  
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adminProfile, setAdminProfile] = useState({ id: '' });
  const [retryCount, setRetryCount] = useState(0);

  // Period options mapping
  const periodOptions = [
    { value: '', label: 'All Time' },
    { value: 'this-week', label: 'This Week' },
    { value: 'this-month', label: 'This Month' },
    { value: 'this-year', label: 'This Year' },
    { value: 'custom', label: 'Custom Range' }
  ];

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

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = () => {
      const token = getAuthToken();
      if (!token) {
        console.warn('No auth token found, redirecting to login...');
        setError('Authentication required. Please login.');
        setLoading(false);
        setTimeout(() => {
          navigate('/admin/login');
        }, 2000);
        return false;
      }
      return true;
    };

    checkAuth();
  }, [navigate]);

  // Get admin profile
  useEffect(() => {
    const getAdminProfile = async () => {
      try {
        const token = getAuthToken();
        if (!token) {
          return;
        }

        console.log('Fetching admin profile...');
        const response = await fetch(`${BASE_URL_AND_PORT}/admin/profile`, {
          method: 'GET',
          headers: getHeaders()
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Admin profile fetched:', data);
          setAdminProfile(data);
          localStorage.setItem('admin_id', data.id);
        } else if (response.status === 401) {
          console.error('Unauthorized - Invalid token');
          handleUnauthorized();
        } else {
          console.error('Failed to fetch admin profile:', response.status);
          setError('Failed to load admin profile');
        }
      } catch (error) {
        console.error('Error fetching admin profile:', error);
        setError('Network error. Please check your connection.');
      }
    };

    getAdminProfile();
  }, [navigate]);

  // Fetch data with filters
  useEffect(() => {
    const fetchData = async () => {
      const token = getAuthToken();
      if (!token) {
        setLoading(false);
        setError('Authentication required. Please login again.');
        return;
      }

      const adminId = adminProfile.id || localStorage.getItem('admin_id');
      if (!adminId) {
        console.log('Waiting for admin profile...');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        console.log('Fetching dashboard data with filters...');
        console.log('Period:', selectedPeriod);
        console.log('Custom From:', customFrom);
        console.log('Custom To:', customTo);

        // Build query parameters for GET endpoints
        let fromValue = customFrom || '';
        let toValue = customTo || '';
        
        // If custom range is selected but no dates provided, use current date
        if (selectedPeriod === 'custom') {
          if (!fromValue) {
            fromValue = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days ago
          }
          if (!toValue) {
            toValue = new Date().toISOString();
          }
        }

        const queryParams = buildQueryParams(
          selectedPeriod === 'custom' ? '' : selectedPeriod,
          fromValue,
          toValue
        );
        
        const urlSuffix = queryParams ? `?${queryParams}` : '';

        // Fetch endpoints with filters
        const endpoints = [
          // 1. Product Analytics (GET with query params)
          {
            url: `${BASE_URL_AND_PORT}/analytics/product_analytics${urlSuffix}`,
            options: { method: 'GET', headers: getHeaders() }
          },
          // 2. Product Stock Analysis (GET with query params)
          {
            url: `${BASE_URL_AND_PORT}/analytics/product_stock_analysis${urlSuffix}`,
            options: { method: 'GET', headers: getHeaders() }
          },
          // 3. Total Sales (GET with query params)
          {
            url: `${BASE_URL_AND_PORT}/analytics/total_sales${urlSuffix}`,
            options: { method: 'GET', headers: getHeaders() }
          }
        ];

        // Execute all requests
        const results = await Promise.allSettled(
          endpoints.map(async (endpoint) => {
            const response = await fetch(endpoint.url, endpoint.options);
            if (response.status === 401) {
              throw new Error('UNAUTHORIZED');
            }
            if (!response.ok) {
              throw new Error(`HTTP ${response.status}`);
            }
            return response.json();
          })
        );

        // Process results
        const [productAnalyticsData, productStockData, totalSalesData] = results;

        // Check for unauthorized
        if (results.some(r => r.status === 'rejected' && r.reason?.message === 'UNAUTHORIZED')) {
          handleUnauthorized();
          return;
        }

        // 1. Product Analytics
        if (productAnalyticsData.status === 'fulfilled') {
          setProductAnalytics(productAnalyticsData.value.product_analytics || []);
        } else {
          console.error('Product analytics error:', productAnalyticsData.reason);
        }

        // 2. Product Stock Analysis
        if (productStockData.status === 'fulfilled') {
          setProductStockAnalysis(productStockData.value.product_stock_analysis || []);
          setStockLoading(false);
        } else {
          console.error('Stock analysis error:', productStockData.reason);
        }

        // 3. Total Sales
        if (totalSalesData.status === 'fulfilled') {
          setTotalSales(totalSalesData.value.total_sales || 0);
        } else {
          console.error('Total sales error:', totalSalesData.reason);
        }

        // 4. Fetch Order History (POST - filters in query string)
        const orderQueryParams = buildQueryParams(
          selectedPeriod === 'custom' ? '' : selectedPeriod,
          fromValue,
          toValue
        );
        const orderUrlSuffix = orderQueryParams ? `?${orderQueryParams}` : '';
        
        const orderResponse = await fetch(
          `${BASE_URL_AND_PORT}/order/orderhistory${orderUrlSuffix}`,
          {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ user_id: adminId })
          }
        );

        if (orderResponse.status === 401) {
          handleUnauthorized();
          return;
        }

        if (orderResponse.ok) {
          const orderData = await orderResponse.json();
          const orders = orderData.orders || [];
          setOrderHistory(orders);
          setRecentOrders(orders.slice(0, 5));
        } else {
          console.error('Order history error:', orderResponse.status);
        }

      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Network error. Please check your connection and try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [adminProfile.id, navigate, retryCount, selectedPeriod, customFrom, customTo]);

  // Handle unauthorized access
  const handleUnauthorized = () => {
    setError('Session expired. Please login again.');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('admin_id');
    setTimeout(() => {
      navigate('/admin/login');
    }, 2000);
  };

  // Refresh data function
  const refreshData = () => {
    setRetryCount(prev => prev + 1);
    setError(null);
    setLoading(true);
  };

  // Handle filter change
  const handlePeriodChange = (value) => {
    setSelectedPeriod(value);
    if (value !== 'custom') {
      setShowCustomRange(false);
      setCustomFrom('');
      setCustomTo('');
    } else {
      setShowCustomRange(true);
      // Set default custom range: last 30 days
      const from = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const to = new Date();
      setCustomFrom(from.toISOString().slice(0, 16));
      setCustomTo(to.toISOString().slice(0, 16));
    }
  };

  // Apply custom range
  const applyCustomRange = () => {
    if (customFrom && customTo && customFrom > customTo) {
      setError('"From" date cannot be later than "To" date');
      return;
    }
    setError(null);
    refreshData();
  };

  // Navigate to orders page
  const goToOrdersPage = () => {
    navigate('/admin/orders');
  };

  // Calculate functions
  const calculateTotalOrders = () => {
    return productAnalytics.reduce((total, product) => total + (product.total_orders || 0), 0);
  };

  const calculateLowStockItems = () => {
    return productStockAnalysis.filter(product => (product.remaining_stock || 0) < 10).length;
  };

  const calculateAverageOrderValue = () => {
    const total = calculateTotalSalesFromAnalytics();
    const orders = calculateTotalOrders();
    return orders > 0 ? (total / orders).toFixed(2) : 0;
  };

  const calculateTotalSalesFromAnalytics = () => {
    return productAnalytics.reduce((total, product) => total + (product.total_sales || 0), 0);
  };

  // Chart Data
  const barChartData = {
    labels: productAnalytics.map((product) => product.product_name),
    datasets: [
      {
        label: 'Total Orders',
        data: productAnalytics.map((product) => product.total_orders),
        backgroundColor: 'rgba(34, 197, 94, 0.7)',
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const totalStock = productStockAnalysis.reduce((sum, p) => sum + (p.initial_stock || 0), 0);
  const soldStock = productStockAnalysis.reduce((sum, p) => sum + (p.total_ordered || 0), 0);
  const remainingStock = totalStock - soldStock;

  const doughnutData = {
    labels: ['Sold Stock', 'Remaining Stock'],
    datasets: [
      {
        data: [soldStock, remainingStock],
        backgroundColor: ['#10b981', '#3b82f6'],
        borderWidth: 0,
        cutout: '60%',
      },
    ],
  };

  const lineChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Sales Trend',
        data: [4200, 5800, 7200, 6800, 9100, 11500, 14200, 13800, 15600, 18900, 21400, 24800],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#10b981',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { backgroundColor: '#1f2937', titleColor: '#fff', bodyColor: '#e5e7eb' },
    },
    scales: {
      y: { beginAtZero: true, grid: { color: '#e5e7eb' }, ticks: { stepSize: 5 } },
      x: { ticks: { maxRotation: 45, minRotation: 0, font: { size: 11 } } },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { font: { size: 11 }, usePointStyle: true } },
      tooltip: { backgroundColor: '#1f2937' },
    },
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { font: { size: 11 } } },
      tooltip: { callbacks: { label: (ctx) => `₹${ctx.raw.toLocaleString()}` } },
    },
    scales: {
      y: { ticks: { callback: (value) => `₹${value.toLocaleString()}` } },
    },
  };

  // Loading state with better UI
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <AdminNavbar onToggleSidebar={toggleSidebar} />
        <div className="flex flex-1 justify-center items-center p-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 text-sm md:text-base">Loading dashboard...</p>
            <p className="text-gray-400 text-xs mt-1">Please wait while we fetch your data</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state with retry option
  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <AdminNavbar onToggleSidebar={toggleSidebar} />
        <div className="flex flex-1 justify-center items-center p-4">
          <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-lg border border-red-100">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Something went wrong</h3>
              <p className="text-gray-600 text-sm mb-4">{error}</p>
              <div className="flex gap-3 justify-center flex-wrap">
                <button 
                  onClick={refreshData}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Retry
                </button>
                <button 
                  onClick={() => navigate('/admin/login')}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm"
                >
                  Go to Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Dashboard Render
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <AdminNavbar onToggleSidebar={toggleSidebar} />
      
      <div className="flex flex-1 relative">
        {/* Sidebar */}
        <AdminSidebar 
          isVisible={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
        />

        {/* Main Content */}
        <main 
          className={`
            flex-1 transition-all duration-300 ease-in-out w-full min-h-screen
            ${sidebarOpen ? 'lg:ml-72' : 'lg:ml-24'}
            ${isMobile && sidebarOpen ? 'overflow-hidden' : ''}
          `}
        >
          <div className="p-3 md:p-4 lg:p-6 xl:p-8">
            <div className="max-w-full mx-auto space-y-4 md:space-y-6 lg:space-y-8">
              
              {/* Header with Greeting and Filters */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4">
                <div>
                  <h1 className="text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    Dashboard
                  </h1>
                  <p className="text-gray-500 text-xs md:text-sm lg:text-base mt-1">
                    Welcome back! Here's what's happening with your EV chargers today.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2 md:gap-3">
                  {/* Period Filter Dropdown */}
                  <select 
                    value={selectedPeriod}
                    onChange={(e) => handlePeriodChange(e.target.value)}
                    className="px-2 md:px-3 py-1.5 md:py-2 bg-white border border-gray-200 rounded-lg text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 min-w-[120px]"
                  >
                    {periodOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  
                  {/* Refresh Button */}
                  <button 
                    onClick={refreshData}
                    className="p-1.5 md:p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    title="Refresh data"
                  >
                    <svg className="w-4 h-4 md:w-5 md:h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Custom Range Filters */}
              {showCustomRange && (
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                  <div className="flex flex-wrap items-end gap-3">
                    <div className="flex-1 min-w-[150px]">
                      <label className="block text-xs font-medium text-gray-700 mb-1">From</label>
                      <input
                        type="datetime-local"
                        value={customFrom}
                        onChange={(e) => setCustomFrom(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div className="flex-1 min-w-[150px]">
                      <label className="block text-xs font-medium text-gray-700 mb-1">To</label>
                      <input
                        type="datetime-local"
                        value={customTo}
                        onChange={(e) => setCustomTo(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <button
                      onClick={applyCustomRange}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
                    >
                      Apply Range
                    </button>
                    <button
                      onClick={() => {
                        setShowCustomRange(false);
                        setSelectedPeriod('');
                        setCustomFrom('');
                        setCustomTo('');
                        refreshData();
                      }}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm"
                    >
                      Clear
                    </button>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-2">
                    {customFrom && customTo ? `Showing data from ${new Date(customFrom).toLocaleDateString()} to ${new Date(customTo).toLocaleDateString()}` : 'Select date range and click Apply'}
                  </p>
                </div>
              )}

              {/* Active Filter Indicator */}
              {selectedPeriod && !showCustomRange && (
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">
                    Showing: {periodOptions.find(opt => opt.value === selectedPeriod)?.label || selectedPeriod}
                  </span>
                </div>
              )}

              {/* Stats Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
                <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-xs md:text-sm font-medium">Total Chargers</p>
                      <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 mt-1">{productAnalytics.length}</h3>
                      <span className="text-[10px] md:text-xs text-green-600 mt-2 inline-flex items-center gap-1">↑ 12% from last month</span>
                    </div>
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 md:w-6 md:h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-xs md:text-sm font-medium">Total Orders</p>
                      <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 mt-1">{calculateTotalOrders()}</h3>
                      <span className="text-[10px] md:text-xs text-green-600 mt-2 inline-flex items-center gap-1">↑ 8% from last month</span>
                    </div>
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 md:w-6 md:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-xs md:text-sm font-medium">Total Sales</p>
                      <h3 className="text-sm md:text-xl lg:text-2xl font-bold text-gray-800 mt-1">₹{totalSales.toLocaleString()}</h3>
                      <span className="text-[10px] md:text-xs text-green-600 mt-2 inline-flex items-center gap-1">↑ 23% from last month</span>
                    </div>
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 md:w-6 md:h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-xs md:text-sm font-medium">Avg. Order Value</p>
                      <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 mt-1">₹{calculateAverageOrderValue()}</h3>
                      <span className="text-[10px] md:text-xs text-gray-500 mt-2">From {calculateTotalOrders()} orders</span>
                    </div>
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 md:w-6 md:h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                {/* Bar Chart */}
                <div className="lg:col-span-2 bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                    <h3 className="text-base md:text-lg font-semibold text-gray-800">Performance Overview</h3>
                    <div className="flex gap-2">
                      <button className="px-2 md:px-3 py-1 text-[10px] md:text-xs bg-emerald-50 text-emerald-600 rounded-lg">Orders</button>
                      <button className="px-2 md:px-3 py-1 text-[10px] md:text-xs text-gray-500 hover:bg-gray-50 rounded-lg">Revenue</button>
                    </div>
                  </div>
                  <div className="h-56 md:h-64 lg:h-72">
                    {productAnalytics.length > 0 ? (
                      <Bar data={barChartData} options={barChartOptions} />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                        No data available for selected period
                      </div>
                    )}
                  </div>
                </div>

                {/* Doughnut Chart */}
                <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100">
                  <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-4">Stock Distribution</h3>
                  <div className="h-40 md:h-44 lg:h-48">
                    <Doughnut data={doughnutData} options={doughnutOptions} />
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3 text-center">
                    <div className="p-2 bg-gray-50 rounded-xl">
                      <p className="text-[10px] md:text-xs text-gray-500">Sold Stock</p>
                      <p className="text-base md:text-lg font-bold text-emerald-600">{soldStock}</p>
                    </div>
                    <div className="p-2 bg-gray-50 rounded-xl">
                      <p className="text-[10px] md:text-xs text-gray-500">Remaining</p>
                      <p className="text-base md:text-lg font-bold text-blue-600">{remainingStock}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sales Trend & Recent Orders */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                {/* Line Chart */}
                <div className="lg:col-span-2 bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base md:text-lg font-semibold text-gray-800">Sales Trend</h3>
                    <span className="text-[10px] md:text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">+28.4%</span>
                  </div>
                  <div className="h-56 md:h-64">
                    <Line data={lineChartData} options={lineChartOptions} />
                  </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base md:text-lg font-semibold text-gray-800">Recent Orders</h3>
                    <button 
                      onClick={goToOrdersPage}
                      className="text-[10px] md:text-xs text-emerald-600 hover:text-emerald-700 font-medium transition-colors flex items-center gap-1"
                    >
                      View All
                      <svg className="w-3 h-3 md:w-3.5 md:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                  <div className="space-y-3">
                    {recentOrders.length > 0 ? (
                      recentOrders.map((order, idx) => (
                        <div 
                          key={idx} 
                          className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0 cursor-pointer hover:bg-gray-50 transition-colors rounded-lg px-2"
                          onClick={() => navigate('/admin/orders')}
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-xs md:text-sm font-medium text-gray-800 truncate">Order #{order.order_id?.slice(-6) || 'N/A'}</p>
                            <p className="text-[10px] md:text-xs text-gray-400">{new Date(order.created_at || Date.now()).toLocaleDateString()}</p>
                          </div>
                          <div className="text-right ml-3">
                            <p className="text-xs md:text-sm font-semibold text-gray-800">₹{order.total_amount || 0}</p>
                            <span className="text-[8px] md:text-[10px] px-2 py-0.5 bg-green-100 text-green-700 rounded-full whitespace-nowrap">
                              {order.status || 'Completed'}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-400 text-xs md:text-sm text-center py-4">No recent orders</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Stock Status Table */}
              <div className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 md:p-6 border-b border-gray-100">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <h3 className="text-base md:text-lg font-semibold text-gray-800">Charger Stock Status</h3>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-[10px] md:text-xs">
                        <span className="w-2 h-2 md:w-3 md:h-3 bg-red-500 rounded-full"></span>
                        <span className="text-gray-500">Low Stock (&lt;10)</span>
                      </div>
                      <span className="text-[10px] md:text-xs text-gray-500">Total: {productStockAnalysis.length} items</span>
                    </div>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[500px]">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 md:px-6 py-3 text-left text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
                        <th className="px-3 md:px-6 py-3 text-left text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-wider">Initial Stock</th>
                        <th className="px-3 md:px-6 py-3 text-left text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-wider">Remaining Stock</th>
                        <th className="px-3 md:px-6 py-3 text-left text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-wider">Total Ordered</th>
                        <th className="px-3 md:px-6 py-3 text-left text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {stockLoading ? (
                        <tr>
                          <td colSpan="5" className="px-6 py-12 text-center">
                            <div className="flex justify-center">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                            </div>
                          </td>
                        </tr>
                      ) : productStockAnalysis.length > 0 ? (
                        productStockAnalysis.map((product, index) => {
                          const isLowStock = (product.remaining_stock || 0) < 10;
                          return (
                            <tr key={index} className="hover:bg-gray-50 transition-colors">
                              <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm font-medium text-gray-900">{product.product_name}</td>
                              <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-gray-600">{product.initial_stock}</td>
                              <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm">
                                <span className={`font-medium ${isLowStock ? 'text-red-600' : 'text-gray-900'}`}>
                                  {product.remaining_stock}
                                </span>
                              </td>
                              <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-gray-600">{product.total_ordered}</td>
                              <td className="px-3 md:px-6 py-3 md:py-4">
                                <span className={`inline-flex px-2 py-0.5 md:py-1 text-[8px] md:text-[10px] rounded-full font-medium ${
                                  isLowStock ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                                }`}>
                                  {isLowStock ? 'Low Stock' : 'In Stock'}
                                </span>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan="5" className="px-6 py-12 text-center text-gray-400 text-sm">No stock data available</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;