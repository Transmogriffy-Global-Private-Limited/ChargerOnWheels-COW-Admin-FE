// import React, { useState, useEffect } from 'react';
// import { Bar, Line, Doughnut } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   BarElement,
//   CategoryScale,
//   LinearScale,
//   Tooltip,
//   Legend,
//   ArcElement,
//   PointElement,
//   LineElement,
//   Filler
// } from 'chart.js';
// import AdminSidebar from '../Admin_sidebar';
// import AdminNavbar from '../Admin_navbar';
// // Use correct icons from react-icons/fa
// import { 
//   FaBoxOpen, 
//   FaRupeeSign, 
//   FaShoppingCart, 
//   FaUsers, 
//   FaChartLine,
//   FaArrowUp,  // Changed from FaArrowTrendUp
//   FaExclamationTriangle,
//   FaCheckCircle,
//   FaTimesCircle,
//   FaEye,
//   FaCalendarAlt,
//   FaDownload,
//   FaSync,
//   FaSearch,
//   FaFilter,
//   FaPrint,
//   FaFileExport,
//   FaInfoCircle,
//   FaBolt,
//   FaPlug,  // Changed from FaChargingStation
//   FaBatteryFull,
//   FaClock,
//   FaPercent  // Changed from FaPercentage
// } from 'react-icons/fa';
// import { HiOutlineRefresh } from 'react-icons/hi';
// import { MdPayment, MdOutlineProductionQuantityLimits } from 'react-icons/md';
// import { BiTrendingUp, BiExport } from 'react-icons/bi';

// ChartJS.register(
//   BarElement, 
//   CategoryScale, 
//   LinearScale, 
//   Tooltip, 
//   Legend,
//   ArcElement,
//   PointElement,
//   LineElement,
//   Filler
// );

// const API_KEY = 'mlzuMoRFjdGhcFulLMaVtfwNAHycbBAf';
// const BASE_URL = 'https://api.static.ev.transev.site';

// const AdminReport = () => {
//   const [contacts, setContacts] = useState([]);
//   const [reports, setReports] = useState([]);
//   const [stockAnalysis, setStockAnalysis] = useState([]);
//   const [productAnalytics, setProductAnalytics] = useState([]);
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [isMobile, setIsMobile] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [toast, setToast] = useState(null);
//   const [selectedPeriod, setSelectedPeriod] = useState('weekly');
//   const [showFilters, setShowFilters] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState('all');
//   const [dateRange, setDateRange] = useState({ start: '', end: '' });
//   const [chartType, setChartType] = useState('bar');
// const authToken = localStorage.getItem('auth_token');
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

//   const showToast = (message, type = 'success') => {
//     setToast({ message, type });
//     setTimeout(() => setToast(null), 3000);
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const stockRes = await fetch(`${BASE_URL}/analytics/product_stock_analysis`, {
//         headers: { 'API-KEY': API_KEY,
//             'Authorization': `Bearer ${authToken}`
//          },
//       });
//       const stockData = await stockRes.json();
//       setStockAnalysis(stockData?.product_stock_analysis || []);

//       const productRes = await fetch(`${BASE_URL}/analytics/product_analytics`, {
//         headers: { 'API-KEY': API_KEY,
//             'Authorization': `Bearer ${authToken}`
//          },
//       });
//       const productData = await productRes.json();
//       setProductAnalytics(productData?.product_analytics || []);
//     } catch (err) {
//       console.error('Fetch error:', err);
//       showToast('Error fetching analytics data', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Export to CSV
//   const exportToCSV = () => {
//     const headers = ['Product Name', 'Initial Stock', 'Remaining Stock', 'Total Ordered', 'Total Sales'];
//     const csvData = stockAnalysis.map(item => [
//       item.product_name,
//       item.initial_stock,
//       item.remaining_stock,
//       item.total_ordered,
//       productAnalytics.find(p => p.product_name === item.product_name)?.total_sales || 0
//     ]);
    
//     const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
//     const blob = new Blob([csvContent], { type: 'text/csv' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `stock-report-${new Date().toISOString().split('T')[0]}.csv`;
//     a.click();
//     URL.revokeObjectURL(url);
//     showToast('CSV exported successfully!', 'success');
//   };

//   // Print report
//   const printReport = () => {
//     window.print();
//     showToast('Print dialog opened', 'info');
//   };

//   // Calculate statistics
//   const totalProducts = productAnalytics.length;
//   const totalOrders = productAnalytics.reduce((sum, p) => sum + (p.total_orders || 0), 0);
//   const totalSales = productAnalytics.reduce((sum, p) => sum + (p.total_sales || 0), 0);
//   const lowStockItems = stockAnalysis.filter(p => (p.remaining_stock || 0) < 10).length;
//   const outOfStock = stockAnalysis.filter(p => (p.remaining_stock || 0) === 0).length;
//   const avgOrderValue = totalOrders > 0 ? (totalSales / totalOrders).toFixed(2) : 0;
//   const conversionRate = totalProducts > 0 ? ((totalOrders / totalProducts) * 100).toFixed(1) : 0;

//   // Filtered data
//   const filteredStockAnalysis = selectedProduct === 'all' 
//     ? stockAnalysis 
//     : stockAnalysis.filter(item => item.product_name === selectedProduct);
  
//   const filteredProductAnalytics = selectedProduct === 'all'
//     ? productAnalytics
//     : productAnalytics.filter(item => item.product_name === selectedProduct);

//   // Stock Chart Data
//   const stockChartData = {
//     labels: filteredStockAnalysis.map((item) => item.product_name),
//     datasets: [
//       {
//         label: 'Remaining Stock',
//         data: filteredStockAnalysis.map((item) => item.remaining_stock),
//         backgroundColor: 'rgba(34, 197, 94, 0.7)',
//         borderRadius: 8,
//         borderSkipped: false,
//       },
//       {
//         label: 'Initial Stock',
//         data: filteredStockAnalysis.map((item) => item.initial_stock),
//         backgroundColor: 'rgba(59, 130, 246, 0.7)',
//         borderRadius: 8,
//         borderSkipped: false,
//       },
//     ],
//   };

//   // Sales Chart Data
//   const salesChartData = {
//     labels: filteredProductAnalytics.map((item) => item.product_name),
//     datasets: [
//       {
//         label: 'Total Sales (₹)',
//         data: filteredProductAnalytics.map((item) => item.total_sales),
//         backgroundColor: 'rgba(139, 92, 246, 0.7)',
//         borderRadius: 8,
//         borderSkipped: false,
//       },
//       {
//         label: 'Total Orders',
//         data: filteredProductAnalytics.map((item) => item.total_orders),
//         backgroundColor: 'rgba(249, 115, 22, 0.7)',
//         borderRadius: 8,
//         borderSkipped: false,
//       },
//     ],
//   };

//   // Orders Chart Data
//   const ordersChartData = {
//     labels: filteredProductAnalytics.map((item) => item.product_name),
//     datasets: [
//       {
//         label: 'Total Orders',
//         data: filteredProductAnalytics.map((item) => item.total_orders),
//         backgroundColor: 'rgba(236, 72, 153, 0.7)',
//         borderRadius: 8,
//         borderSkipped: false,
//       },
//     ],
//   };

//   // Stock Distribution Data
//   const totalStock = stockAnalysis.reduce((sum, p) => sum + (p.initial_stock || 0), 0);
//   const soldStock = stockAnalysis.reduce((sum, p) => sum + (p.total_ordered || 0), 0);
//   const remainingStock = totalStock - soldStock;

//   const doughnutData = {
//     labels: ['Sold Stock', 'Remaining Stock'],
//     datasets: [
//       {
//         data: [soldStock, remainingStock],
//         backgroundColor: ['#10b981', '#3b82f6'],
//         borderWidth: 0,
//         cutout: '65%',
//       },
//     ],
//   };

//   // Trend Data
//   const trendData = {
//     labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
//     datasets: [
//       {
//         label: 'Monthly Sales (₹)',
//         data: [25000, 32000, 41000, 38000, 52000, 61000, 78000, 72000, 85000, 92000, 105000, 118000],
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

//   const chartOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: { position: 'top', labels: { font: { size: 11 } } },
//       tooltip: { backgroundColor: '#1f2937', titleColor: '#fff', bodyColor: '#e5e7eb' },
//     },
//     scales: {
//       y: { beginAtZero: true, grid: { color: '#e5e7eb' }, ticks: { stepSize: 5 } },
//       x: { ticks: { maxRotation: 45, minRotation: 0, font: { size: 10 } } },
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

//   // Get top performing product
//   const topProduct = productAnalytics.reduce((max, p) => 
//     (p.total_sales > (max?.total_sales || 0) ? p : max), {});
  
//   // Get low stock alert count
//   const criticalStock = stockAnalysis.filter(p => (p.remaining_stock || 0) === 0).length;

//   return (
//     <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//       {/* Toast Notification */}
//       {toast && (
//         <div className={`fixed top-20 right-4 z-50 animate-slideIn ${
//           toast.type === 'success' ? 'bg-green-500' : toast.type === 'info' ? 'bg-blue-500' : 'bg-red-500'
//         } text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 text-sm`}>
//           {toast.type === 'success' ? '✓' : toast.type === 'info' ? 'ℹ' : '✗'} {toast.message}
//         </div>
//       )}

//       <AdminNavbar onToggleSidebar={toggleSidebar} />
      
//       <div className="flex flex-1 relative">
//         <AdminSidebar 
//           isVisible={sidebarOpen} 
//           onClose={() => setSidebarOpen(false)} 
//         />

//         <main 
//           className={`
//             flex-1 transition-all duration-300 ease-in-out w-full min-h-screen
//             ${sidebarOpen ? 'lg:ml-72' : 'lg:ml-24'}
//             ${isMobile && sidebarOpen ? 'overflow-hidden' : ''}
//           `}
//         >
//           <div className="p-4 md:p-6 lg:p-8">
//             <div className="max-w-full mx-auto">
              
//               {/* Header */}
//               <div className="mb-6 md:mb-8">
//                 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//                   <div>
//                     <h1 className="text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
//                       Analytics Dashboard
//                     </h1>
//                     <p className="text-gray-500 text-sm md:text-base mt-1">
//                       Track your EV charger performance and sales analytics
//                     </p>
//                   </div>
//                   <div className="flex items-center gap-2 flex-wrap">
//                     <select 
//                       value={selectedPeriod}
//                       onChange={(e) => setSelectedPeriod(e.target.value)}
//                       className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
//                     >
//                       <option value="daily">Today</option>
//                       <option value="weekly">This Week</option>
//                       <option value="monthly">This Month</option>
//                       <option value="yearly">This Year</option>
//                     </select>
                    
//                     <button 
//                       onClick={() => setShowFilters(!showFilters)}
//                       className="px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm"
//                     >
//                       <FaFilter size={14} />
//                       Filters
//                     </button>
                    
//                     <button 
//                       onClick={exportToCSV}
//                       className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2 text-sm transition"
//                     >
//                       <FaFileExport size={14} />
//                       Export CSV
//                     </button>
                    
//                     <button 
//                       onClick={printReport}
//                       className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-2 text-sm transition"
//                     >
//                       <FaPrint size={14} />
//                       Print
//                     </button>
                    
//                     <button 
//                       onClick={fetchData}
//                       className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
//                     >
//                       <HiOutlineRefresh size={18} className="text-gray-600" />
//                     </button>
//                   </div>
//                 </div>
//               </div>

//               {/* Filters Panel */}
//               {showFilters && (
//                 <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">Product Filter</label>
//                       <select
//                         value={selectedProduct}
//                         onChange={(e) => setSelectedProduct(e.target.value)}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
//                       >
//                         <option value="all">All Products</option>
//                         {productAnalytics.map((product, idx) => (
//                           <option key={idx} value={product.product_name}>{product.product_name}</option>
//                         ))}
//                       </select>
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">Date From</label>
//                       <input
//                         type="date"
//                         value={dateRange.start}
//                         onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">Date To</label>
//                       <input
//                         type="date"
//                         value={dateRange.end}
//                         onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
//                       />
//                     </div>
//                   </div>
//                   <div className="mt-4 flex justify-end">
//                     <button
//                       onClick={() => {
//                         setSelectedProduct('all');
//                         setDateRange({ start: '', end: '' });
//                       }}
//                       className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
//                     >
//                       Clear Filters
//                     </button>
//                   </div>
//                 </div>
//               )}

//               {/* Stats Cards */}
//               <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 md:gap-4 mb-6 md:mb-8">
//                 <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-xs text-gray-500">Total Products</p>
//                       <p className="text-xl md:text-2xl font-bold text-gray-800">{totalProducts}</p>
//                     </div>
//                     <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
//                       <FaPlug className="text-indigo-600" size={18} />
//                     </div>
//                   </div>
//                 </div>

//                 <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-xs text-gray-500">Total Orders</p>
//                       <p className="text-xl md:text-2xl font-bold text-gray-800">{totalOrders}</p>
//                     </div>
//                     <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
//                       <FaShoppingCart className="text-orange-600" size={18} />
//                     </div>
//                   </div>
//                 </div>

//                 <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-xs text-gray-500">Total Sales</p>
//                       <p className="text-base md:text-lg font-bold text-gray-800">₹{totalSales.toLocaleString()}</p>
//                     </div>
//                     <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
//                       <FaRupeeSign className="text-green-600" size={18} />
//                     </div>
//                   </div>
//                 </div>

//                 <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-xs text-gray-500">Low Stock</p>
//                       <p className="text-xl md:text-2xl font-bold text-red-600">{lowStockItems}</p>
//                     </div>
//                     <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
//                       <FaExclamationTriangle className="text-red-600" size={18} />
//                     </div>
//                   </div>
//                 </div>

//                 <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-xs text-gray-500">Out of Stock</p>
//                       <p className="text-xl md:text-2xl font-bold text-red-700">{criticalStock}</p>
//                     </div>
//                     <div className="w-10 h-10 bg-red-200 rounded-full flex items-center justify-center">
//                       <FaTimesCircle className="text-red-700" size={18} />
//                     </div>
//                   </div>
//                 </div>

//                 <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-4 shadow-sm text-white">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-xs text-white/80">Avg. Order Value</p>
//                       <p className="text-sm md:text-base font-bold">₹{avgOrderValue.toLocaleString()}</p>
//                     </div>
//                     <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
//                       <FaArrowUp className="text-white" size={18} />
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Quick Insights Row */}
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
//                 <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
//                   <div className="flex items-center gap-3">
//                     <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
//                       <FaBolt className="text-blue-600" size={20} />
//                     </div>
//                     <div>
//                       <p className="text-xs text-gray-500">Top Product</p>
//                       <p className="font-semibold text-gray-800 text-sm">{topProduct.product_name || 'N/A'}</p>
//                       <p className="text-xs text-green-600">₹{topProduct.total_sales?.toLocaleString() || 0} sales</p>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
//                   <div className="flex items-center gap-3">
//                     <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
//                       <FaPercent className="text-green-600" size={20} />
//                     </div>
//                     <div>
//                       <p className="text-xs text-gray-500">Conversion Rate</p>
//                       <p className="font-semibold text-gray-800 text-lg">{conversionRate}%</p>
//                       <p className="text-xs text-gray-500">Orders per product</p>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
//                   <div className="flex items-center gap-3">
//                     <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
//                       <FaBatteryFull className="text-purple-600" size={20} />
//                     </div>
//                     <div>
//                       <p className="text-xs text-gray-500">Stock Health</p>
//                       <p className="font-semibold text-gray-800 text-lg">{((remainingStock / totalStock) * 100).toFixed(1) || 0}%</p>
//                       <p className="text-xs text-gray-500">Remaining stock</p>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4 border border-orange-100">
//                   <div className="flex items-center gap-3">
//                     <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
//                       <FaClock className="text-orange-600" size={20} />
//                     </div>
//                     <div>
//                       <p className="text-xs text-gray-500">Total Units Sold</p>
//                       <p className="font-semibold text-gray-800 text-lg">{soldStock}</p>
//                       <p className="text-xs text-gray-500">Across all products</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Loading State */}
//               {loading ? (
//                 <div className="flex justify-center items-center py-20">
//                   <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
//                 </div>
//               ) : (
//                 <>
//                   {/* Charts Grid */}
//                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//                     {/* Stock Analysis Chart */}
//                     <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100">
//                       <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
//                         <h3 className="text-base md:text-lg font-semibold text-gray-800">📦 Product Stock Analysis</h3>
//                         <div className="flex gap-2">
//                           <button 
//                             onClick={() => setChartType('bar')}
//                             className={`text-xs px-2 py-1 rounded ${chartType === 'bar' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100'}`}
//                           >
//                             Bar
//                           </button>
//                           <button 
//                             onClick={() => setChartType('line')}
//                             className={`text-xs px-2 py-1 rounded ${chartType === 'line' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100'}`}
//                           >
//                             Line
//                           </button>
//                         </div>
//                       </div>
//                       <div className="h-64 md:h-80">
//                         <Bar data={stockChartData} options={chartOptions} />
//                       </div>
//                     </div>

//                     {/* Sales Analytics Chart */}
//                     <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100">
//                       <div className="flex items-center justify-between mb-4">
//                         <h3 className="text-base md:text-lg font-semibold text-gray-800">📊 Sales Analytics</h3>
//                         <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">Revenue & Orders</span>
//                       </div>
//                       <div className="h-64 md:h-80">
//                         <Bar data={salesChartData} options={chartOptions} />
//                       </div>
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
//                     {/* Orders Chart */}
//                     <div className="lg:col-span-2 bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100">
//                       <div className="flex items-center justify-between mb-4">
//                         <h3 className="text-base md:text-lg font-semibold text-gray-800">📈 Order Analytics</h3>
//                         <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">Per Product</span>
//                       </div>
//                       <div className="h-64">
//                         <Bar data={ordersChartData} options={chartOptions} />
//                       </div>
//                     </div>

//                     {/* Stock Distribution */}
//                     <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100">
//                       <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-4">🔄 Stock Distribution</h3>
//                       <div className="h-48">
//                         <Doughnut data={doughnutData} options={doughnutOptions} />
//                       </div>
//                       <div className="mt-4 grid grid-cols-2 gap-3 text-center">
//                         <div className="p-2 bg-gray-50 rounded-xl">
//                           <p className="text-[10px] text-gray-500">Sold Stock</p>
//                           <p className="text-base font-bold text-green-600">{soldStock}</p>
//                         </div>
//                         <div className="p-2 bg-gray-50 rounded-xl">
//                           <p className="text-[10px] text-gray-500">Remaining</p>
//                           <p className="text-base font-bold text-blue-600">{remainingStock}</p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Sales Trend Chart */}
//                   <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100 mb-8">
//                     <div className="flex items-center justify-between mb-4">
//                       <h3 className="text-base md:text-lg font-semibold text-gray-800">📉 Sales Trend (Monthly)</h3>
//                       <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">+28.4% growth</span>
//                     </div>
//                     <div className="h-64 md:h-80">
//                       <Line data={trendData} options={lineChartOptions} />
//                     </div>
//                   </div>

//                   {/* Stock Status Table */}
//                   <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
//                     <div className="p-4 md:p-6 border-b border-gray-100">
//                       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
//                         <h3 className="text-base md:text-lg font-semibold text-gray-800">📋 Product Stock Status</h3>
//                         <div className="flex items-center gap-3">
//                           <div className="flex items-center gap-1 text-[10px]">
//                             <span className="w-2 h-2 bg-red-500 rounded-full"></span>
//                             <span className="text-gray-500">Low Stock (&lt;10)</span>
//                           </div>
//                           <span className="text-xs text-gray-500">Total: {stockAnalysis.length} items</span>
//                         </div>
//                       </div>
//                     </div>
                    
//                     <div className="overflow-x-auto">
//                       <table className="w-full min-w-[600px]">
//                         <thead className="bg-gray-50">
//                           <tr>
//                             <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
//                             <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Initial Stock</th>
//                             <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remaining Stock</th>
//                             <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Ordered</th>
//                             <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                           </tr>
//                         </thead>
//                         <tbody className="divide-y divide-gray-100">
//                           {filteredStockAnalysis.length > 0 ? (
//                             filteredStockAnalysis.map((product, index) => {
//                               const isLowStock = (product.remaining_stock || 0) < 10;
//                               return (
//                                 <tr key={index} className="hover:bg-gray-50 transition-colors">
//                                   <td className="px-4 md:px-6 py-3 md:py-4 text-sm font-medium text-gray-900">{product.product_name}</td>
//                                   <td className="px-4 md:px-6 py-3 md:py-4 text-sm text-gray-600">{product.initial_stock}</td>
//                                   <td className="px-4 md:px-6 py-3 md:py-4">
//                                     <span className={`font-medium text-sm ${isLowStock ? 'text-red-600' : 'text-gray-900'}`}>
//                                       {product.remaining_stock}
//                                     </span>
//                                   </td>
//                                   <td className="px-4 md:px-6 py-3 md:py-4 text-sm text-gray-600">{product.total_ordered}</td>
//                                   <td className="px-4 md:px-6 py-3 md:py-4">
//                                     <span className={`inline-flex px-2 py-1 text-xs rounded-full font-medium ${
//                                       isLowStock ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
//                                     }`}>
//                                       {isLowStock ? (product.remaining_stock === 0 ? 'Out of Stock' : 'Low Stock') : 'In Stock'}
//                                     </span>
//                                   </td>
//                                 </tr>
//                               );
//                             })
//                           ) : (
//                             <tr>
//                               <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
//                                 No stock data available
//                               </td>
//                             </tr>
//                           )}
//                         </tbody>
//                       </table>
//                     </div>
//                   </div>
//                 </>
//               )}
//             </div>
//           </div>
//         </main>
//       </div>

//       <style>{`
//         @keyframes slideIn {
//           from { transform: translateX(100%); opacity: 0; }
//           to { transform: translateX(0); opacity: 1; }
//         }
//         @keyframes fadeIn {
//           from { opacity: 0; transform: scale(0.95); }
//           to { opacity: 1; transform: scale(1); }
//         }
//         .animate-slideIn {
//           animation: slideIn 0.3s ease-out;
//         }
//         .animate-fadeIn {
//           animation: fadeIn 0.2s ease-out;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default AdminReport;

import React, { useState, useEffect, useCallback } from 'react';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
} from 'chart.js';
import AdminSidebar from '../Admin_sidebar';
import AdminNavbar from '../Admin_navbar';
import { 
  FaBoxOpen, 
  FaRupeeSign, 
  FaShoppingCart, 
  FaUsers, 
  FaChartLine,
  FaArrowUp,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimesCircle,
  FaEye,
  FaCalendarAlt,
  FaDownload,
  FaSync,
  FaSearch,
  FaFilter,
  FaPrint,
  FaFileExport,
  FaInfoCircle,
  FaBolt,
  FaPlug,
  FaBatteryFull,
  FaClock,
  FaPercent
} from 'react-icons/fa';
import { HiOutlineRefresh } from 'react-icons/hi';
import { MdPayment, MdOutlineProductionQuantityLimits } from 'react-icons/md';
import { BiTrendingUp, BiExport } from 'react-icons/bi';

ChartJS.register(
  BarElement, 
  CategoryScale, 
  LinearScale, 
  Tooltip, 
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
);

const API_KEY = 'mlzuMoRFjdGhcFulLMaVtfwNAHycbBAf';
const BASE_URL = 'https://api.static.ev.transev.site';

const AdminReport = () => {
  // State
  const [contacts, setContacts] = useState([]);
  const [reports, setReports] = useState([]);
  const [stockAnalysis, setStockAnalysis] = useState([]);
  const [productAnalytics, setProductAnalytics] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('all-time');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [chartType, setChartType] = useState('bar');
  const [useCustomRange, setUseCustomRange] = useState(false);
  
  const authToken = localStorage.getItem('auth_token');

  // Toggle sidebar
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

  // Toast notification
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Build query string with filters
  const buildQueryString = (baseParams = '') => {
    const params = new URLSearchParams();
    
    // If custom date range is enabled and valid
    if (useCustomRange && (dateRange.start || dateRange.end)) {
      if (dateRange.start) {
        params.append('from', new Date(dateRange.start).toISOString());
      }
      if (dateRange.end) {
        // Set end date to end of day
        const endDate = new Date(dateRange.end);
        endDate.setHours(23, 59, 59, 999);
        params.append('to', endDate.toISOString());
      }
    } else {
      // Use period filter
      params.append('period', selectedPeriod);
    }
    
    const queryString = params.toString();
    return queryString ? `?${queryString}` : '';
  };

  // Fetch data with filters
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const queryString = buildQueryString();
      
      // Fetch Stock Analysis
      const stockRes = await fetch(`${BASE_URL}/analytics/product_stock_analysis${queryString}`, {
        headers: { 
          'API-KEY': API_KEY,
          'Authorization': `Bearer ${authToken}`
        },
      });
      const stockData = await stockRes.json();
      setStockAnalysis(stockData?.product_stock_analysis || []);

      // Fetch Product Analytics
      const productRes = await fetch(`${BASE_URL}/analytics/product_analytics${queryString}`, {
        headers: { 
          'API-KEY': API_KEY,
          'Authorization': `Bearer ${authToken}`
        },
      });
      const productData = await productRes.json();
      setProductAnalytics(productData?.product_analytics || []);

      // Fetch Total Sales
      const salesRes = await fetch(`${BASE_URL}/analytics/total_sales${queryString}`, {
        headers: { 
          'API-KEY': API_KEY,
          'Authorization': `Bearer ${authToken}`
        },
      });
      const salesData = await salesRes.json();
      console.log('Total Sales Data:', salesData);

      showToast('Data updated successfully!', 'success');
    } catch (err) {
      console.error('Fetch error:', err);
      showToast('Error fetching analytics data', 'error');
    } finally {
      setLoading(false);
    }
  }, [selectedPeriod, dateRange, useCustomRange, authToken]);

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Export to CSV
  const exportToCSV = () => {
    if (stockAnalysis.length === 0) {
      showToast('No data to export', 'error');
      return;
    }

    const headers = ['Product Name', 'Initial Stock', 'Remaining Stock', 'Total Ordered', 'Total Sales'];
    const csvData = stockAnalysis.map(item => [
      item.product_name,
      item.initial_stock,
      item.remaining_stock,
      item.total_ordered,
      productAnalytics.find(p => p.product_name === item.product_name)?.total_sales || 0
    ]);
    
    const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stock-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('CSV exported successfully!', 'success');
  };

  // Print report
  const printReport = () => {
    window.print();
    showToast('Print dialog opened', 'info');
  };

  // Calculate statistics
  const totalProducts = productAnalytics.length;
  const totalOrders = productAnalytics.reduce((sum, p) => sum + (p.total_orders || 0), 0);
  const totalSales = productAnalytics.reduce((sum, p) => sum + (p.total_sales || 0), 0);
  const lowStockItems = stockAnalysis.filter(p => (p.remaining_stock || 0) < 10).length;
  const outOfStock = stockAnalysis.filter(p => (p.remaining_stock || 0) === 0).length;
  const avgOrderValue = totalOrders > 0 ? (totalSales / totalOrders).toFixed(2) : 0;
  const conversionRate = totalProducts > 0 ? ((totalOrders / totalProducts) * 100).toFixed(1) : 0;

  // Filtered data
  const filteredStockAnalysis = selectedProduct === 'all' 
    ? stockAnalysis 
    : stockAnalysis.filter(item => item.product_name === selectedProduct);
  
  const filteredProductAnalytics = selectedProduct === 'all'
    ? productAnalytics
    : productAnalytics.filter(item => item.product_name === selectedProduct);

  // Stock Chart Data
  const stockChartData = {
    labels: filteredStockAnalysis.map((item) => item.product_name),
    datasets: [
      {
        label: 'Remaining Stock',
        data: filteredStockAnalysis.map((item) => item.remaining_stock),
        backgroundColor: 'rgba(34, 197, 94, 0.7)',
        borderRadius: 8,
        borderSkipped: false,
      },
      {
        label: 'Initial Stock',
        data: filteredStockAnalysis.map((item) => item.initial_stock),
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  // Sales Chart Data
  const salesChartData = {
    labels: filteredProductAnalytics.map((item) => item.product_name),
    datasets: [
      {
        label: 'Total Sales (₹)',
        data: filteredProductAnalytics.map((item) => item.total_sales),
        backgroundColor: 'rgba(139, 92, 246, 0.7)',
        borderRadius: 8,
        borderSkipped: false,
      },
      {
        label: 'Total Orders',
        data: filteredProductAnalytics.map((item) => item.total_orders),
        backgroundColor: 'rgba(249, 115, 22, 0.7)',
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  // Orders Chart Data
  const ordersChartData = {
    labels: filteredProductAnalytics.map((item) => item.product_name),
    datasets: [
      {
        label: 'Total Orders',
        data: filteredProductAnalytics.map((item) => item.total_orders),
        backgroundColor: 'rgba(236, 72, 153, 0.7)',
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  // Stock Distribution Data
  const totalStock = stockAnalysis.reduce((sum, p) => sum + (p.initial_stock || 0), 0);
  const soldStock = stockAnalysis.reduce((sum, p) => sum + (p.total_ordered || 0), 0);
  const remainingStock = totalStock - soldStock;

  const doughnutData = {
    labels: ['Sold Stock', 'Remaining Stock'],
    datasets: [
      {
        data: [soldStock, remainingStock],
        backgroundColor: ['#10b981', '#3b82f6'],
        borderWidth: 0,
        cutout: '65%',
      },
    ],
  };

  // Trend Data (Mock - replace with real data)
  const trendData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Monthly Sales (₹)',
        data: [25000, 32000, 41000, 38000, 52000, 61000, 78000, 72000, 85000, 92000, 105000, 118000],
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

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { font: { size: 11 } } },
      tooltip: { backgroundColor: '#1f2937', titleColor: '#fff', bodyColor: '#e5e7eb' },
    },
    scales: {
      y: { beginAtZero: true, grid: { color: '#e5e7eb' }, ticks: { stepSize: 5 } },
      x: { ticks: { maxRotation: 45, minRotation: 0, font: { size: 10 } } },
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

  // Get top performing product
  const topProduct = productAnalytics.reduce((max, p) => 
    (p.total_sales > (max?.total_sales || 0) ? p : max), {});
  
  // Get low stock alert count
  const criticalStock = stockAnalysis.filter(p => (p.remaining_stock || 0) === 0).length;

  // Get period label
  const getPeriodLabel = () => {
    if (useCustomRange && (dateRange.start || dateRange.end)) {
      let label = 'Custom Range';
      if (dateRange.start && dateRange.end) {
        label = `${dateRange.start} to ${dateRange.end}`;
      } else if (dateRange.start) {
        label = `From ${dateRange.start}`;
      } else if (dateRange.end) {
        label = `Until ${dateRange.end}`;
      }
      return label;
    }
    const labels = {
      'all-time': 'All Time',
      'this-week': 'This Week',
      'this-month': 'This Month',
      'this-year': 'This Year'
    };
    return labels[selectedPeriod] || 'All Time';
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-20 right-4 z-50 animate-slideIn ${
          toast.type === 'success' ? 'bg-green-500' : toast.type === 'info' ? 'bg-blue-500' : 'bg-red-500'
        } text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 text-sm`}>
          {toast.type === 'success' ? '✓' : toast.type === 'info' ? 'ℹ' : '✗'} {toast.message}
        </div>
      )}

      <AdminNavbar onToggleSidebar={toggleSidebar} />
      
      <div className="flex flex-1 relative">
        <AdminSidebar 
          isVisible={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
        />

        <main 
          className={`
            flex-1 transition-all duration-300 ease-in-out w-full min-h-screen
            ${sidebarOpen ? 'lg:ml-72' : 'lg:ml-24'}
            ${isMobile && sidebarOpen ? 'overflow-hidden' : ''}
          `}
        >
          <div className="p-4 md:p-6 lg:p-8">
            <div className="max-w-full mx-auto">
              
              {/* Header */}
              <div className="mb-6 md:mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h1 className="text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      Analytics Dashboard
                    </h1>
                    <p className="text-gray-500 text-sm md:text-base mt-1">
                      Track your EV charger performance and sales analytics
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      <span className="font-medium">Filter:</span> {getPeriodLabel()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <select 
                      value={selectedPeriod}
                      onChange={(e) => {
                        setSelectedPeriod(e.target.value);
                        setUseCustomRange(false);
                      }}
                      className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="all-time">All Time</option>
                      <option value="this-week">This Week</option>
                      <option value="this-month">This Month</option>
                      <option value="this-year">This Year</option>
                    </select>
                    
                    <button 
                      onClick={() => setShowFilters(!showFilters)}
                      className="px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm"
                    >
                      <FaFilter size={14} />
                      Filters
                    </button>
                    
                    <button 
                      onClick={exportToCSV}
                      className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2 text-sm transition"
                    >
                      <FaFileExport size={14} />
                      Export CSV
                    </button>
                    
                    <button 
                      onClick={printReport}
                      className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-2 text-sm transition"
                    >
                      <FaPrint size={14} />
                      Print
                    </button>
                    
                    <button 
                      onClick={fetchData}
                      className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <HiOutlineRefresh size={18} className="text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Filters Panel */}
              {showFilters && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6 animate-fadeIn">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Product Filter</label>
                      <select
                        value={selectedProduct}
                        onChange={(e) => setSelectedProduct(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                      >
                        <option value="all">All Products</option>
                        {productAnalytics.map((product, idx) => (
                          <option key={idx} value={product.product_name}>{product.product_name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date From</label>
                      <input
                        type="date"
                        value={dateRange.start}
                        onChange={(e) => {
                          setDateRange({ ...dateRange, start: e.target.value });
                          setUseCustomRange(true);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date To</label>
                      <input
                        type="date"
                        value={dateRange.end}
                        onChange={(e) => {
                          setDateRange({ ...dateRange, end: e.target.value });
                          setUseCustomRange(true);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end gap-3">
                    <button
                      onClick={() => {
                        setSelectedProduct('all');
                        setDateRange({ start: '', end: '' });
                        setUseCustomRange(false);
                        setSelectedPeriod('all-time');
                      }}
                      className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                    >
                      Clear Filters
                    </button>
                    <button
                      onClick={() => {
                        fetchData();
                        setShowFilters(false);
                      }}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm transition"
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>
              )}

              {/* Stats Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 md:gap-4 mb-6 md:mb-8">
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">Total Products</p>
                      <p className="text-xl md:text-2xl font-bold text-gray-800">{totalProducts}</p>
                    </div>
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                      <FaPlug className="text-indigo-600" size={18} />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">Total Orders</p>
                      <p className="text-xl md:text-2xl font-bold text-gray-800">{totalOrders}</p>
                    </div>
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <FaShoppingCart className="text-orange-600" size={18} />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">Total Sales</p>
                      <p className="text-base md:text-lg font-bold text-gray-800">₹{totalSales.toLocaleString()}</p>
                    </div>
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <FaRupeeSign className="text-green-600" size={18} />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">Low Stock</p>
                      <p className="text-xl md:text-2xl font-bold text-red-600">{lowStockItems}</p>
                    </div>
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                      <FaExclamationTriangle className="text-red-600" size={18} />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">Out of Stock</p>
                      <p className="text-xl md:text-2xl font-bold text-red-700">{criticalStock}</p>
                    </div>
                    <div className="w-10 h-10 bg-red-200 rounded-full flex items-center justify-center">
                      <FaTimesCircle className="text-red-700" size={18} />
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-4 shadow-sm text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-white/80">Avg. Order Value</p>
                      <p className="text-sm md:text-base font-bold">₹{avgOrderValue.toLocaleString()}</p>
                    </div>
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <FaArrowUp className="text-white" size={18} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Insights Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <FaBolt className="text-blue-600" size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Top Product</p>
                      <p className="font-semibold text-gray-800 text-sm">{topProduct.product_name || 'N/A'}</p>
                      <p className="text-xs text-green-600">₹{topProduct.total_sales?.toLocaleString() || 0} sales</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <FaPercent className="text-green-600" size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Conversion Rate</p>
                      <p className="font-semibold text-gray-800 text-lg">{conversionRate}%</p>
                      <p className="text-xs text-gray-500">Orders per product</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <FaBatteryFull className="text-purple-600" size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Stock Health</p>
                      <p className="font-semibold text-gray-800 text-lg">{totalStock > 0 ? ((remainingStock / totalStock) * 100).toFixed(1) : 0}%</p>
                      <p className="text-xs text-gray-500">Remaining stock</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4 border border-orange-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <FaClock className="text-orange-600" size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Total Units Sold</p>
                      <p className="font-semibold text-gray-800 text-lg">{soldStock}</p>
                      <p className="text-xs text-gray-500">Across all products</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Loading State */}
              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                </div>
              ) : (
                <>
                  {/* Charts Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Stock Analysis Chart */}
                    <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100">
                      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                        <h3 className="text-base md:text-lg font-semibold text-gray-800">📦 Product Stock Analysis</h3>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => setChartType('bar')}
                            className={`text-xs px-2 py-1 rounded ${chartType === 'bar' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100'}`}
                          >
                            Bar
                          </button>
                          <button 
                            onClick={() => setChartType('line')}
                            className={`text-xs px-2 py-1 rounded ${chartType === 'line' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100'}`}
                          >
                            Line
                          </button>
                        </div>
                      </div>
                      <div className="h-64 md:h-80">
                        <Bar data={stockChartData} options={chartOptions} />
                      </div>
                    </div>

                    {/* Sales Analytics Chart */}
                    <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base md:text-lg font-semibold text-gray-800">📊 Sales Analytics</h3>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">Revenue & Orders</span>
                      </div>
                      <div className="h-64 md:h-80">
                        <Bar data={salesChartData} options={chartOptions} />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Orders Chart */}
                    <div className="lg:col-span-2 bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base md:text-lg font-semibold text-gray-800">📈 Order Analytics</h3>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">Per Product</span>
                      </div>
                      <div className="h-64">
                        <Bar data={ordersChartData} options={chartOptions} />
                      </div>
                    </div>

                    {/* Stock Distribution */}
                    <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100">
                      <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-4">🔄 Stock Distribution</h3>
                      <div className="h-48">
                        <Doughnut data={doughnutData} options={doughnutOptions} />
                      </div>
                      <div className="mt-4 grid grid-cols-2 gap-3 text-center">
                        <div className="p-2 bg-gray-50 rounded-xl">
                          <p className="text-[10px] text-gray-500">Sold Stock</p>
                          <p className="text-base font-bold text-green-600">{soldStock}</p>
                        </div>
                        <div className="p-2 bg-gray-50 rounded-xl">
                          <p className="text-[10px] text-gray-500">Remaining</p>
                          <p className="text-base font-bold text-blue-600">{remainingStock}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sales Trend Chart */}
                  <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100 mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-base md:text-lg font-semibold text-gray-800">📉 Sales Trend (Monthly)</h3>
                      <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">+28.4% growth</span>
                    </div>
                    <div className="h-64 md:h-80">
                      <Line data={trendData} options={lineChartOptions} />
                    </div>
                  </div>

                  {/* Stock Status Table */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 md:p-6 border-b border-gray-100">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <h3 className="text-base md:text-lg font-semibold text-gray-800">📋 Product Stock Status</h3>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1 text-[10px]">
                            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                            <span className="text-gray-500">Low Stock (&lt;10)</span>
                          </div>
                          <span className="text-xs text-gray-500">Total: {stockAnalysis.length} items</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[600px]">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
                            <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Initial Stock</th>
                            <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remaining Stock</th>
                            <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Ordered</th>
                            <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {filteredStockAnalysis.length > 0 ? (
                            filteredStockAnalysis.map((product, index) => {
                              const isLowStock = (product.remaining_stock || 0) < 10;
                              return (
                                <tr key={index} className="hover:bg-gray-50 transition-colors">
                                  <td className="px-4 md:px-6 py-3 md:py-4 text-sm font-medium text-gray-900">{product.product_name}</td>
                                  <td className="px-4 md:px-6 py-3 md:py-4 text-sm text-gray-600">{product.initial_stock}</td>
                                  <td className="px-4 md:px-6 py-3 md:py-4">
                                    <span className={`font-medium text-sm ${isLowStock ? 'text-red-600' : 'text-gray-900'}`}>
                                      {product.remaining_stock}
                                    </span>
                                  </td>
                                  <td className="px-4 md:px-6 py-3 md:py-4 text-sm text-gray-600">{product.total_ordered}</td>
                                  <td className="px-4 md:px-6 py-3 md:py-4">
                                    <span className={`inline-flex px-2 py-1 text-xs rounded-full font-medium ${
                                      isLowStock ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                                    }`}>
                                      {isLowStock ? (product.remaining_stock === 0 ? 'Out of Stock' : 'Low Stock') : 'In Stock'}
                                    </span>
                                  </td>
                                </tr>
                              );
                            })
                          ) : (
                            <tr>
                              <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                                No stock data available for the selected period
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* No Data Message */}
                  {stockAnalysis.length === 0 && productAnalytics.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
                      <FaInfoCircle className="text-gray-300 text-5xl mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-600">No Data Available</h3>
                      <p className="text-sm text-gray-400 mt-2">
                        Try selecting a different time period or adjusting your filters
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </main>
      </div>

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AdminReport;