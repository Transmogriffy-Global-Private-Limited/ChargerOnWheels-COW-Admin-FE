// import React, { useEffect, useState } from "react";
// import AdminSidebar from "../Admin_sidebar";
// import AdminNavbar from "../Admin_navbar";
// import {
//   FaSearch,
//   FaFilter,
//   FaEye,
//   FaPrint,
//   FaDownload,
//   FaCheckCircle,
//   FaTimesCircle,
//   FaShippingFast,
//   FaBoxOpen,
//   FaClock,
//   FaUserCircle,
//   FaPhoneAlt,
//   FaMapMarkerAlt,
//   FaCalendarAlt,
//   FaMoneyBillWave,
//   FaCreditCard,
//   FaWallet,
//   FaTruck,
//   FaRupeeSign,
//   FaCopy,
//   FaChevronLeft,
//   FaChevronRight,
//   FaSync,
//   FaExclamationTriangle,
//   FaArrowLeft,
//   FaArrowRight,
//   FaSpinner,
//   FaMoneyBill,
//   FaHandHoldingUsd
// } from "react-icons/fa";
// import { MdOutlineLocalShipping, MdPayment } from "react-icons/md";
// import { HiOutlineRefresh } from "react-icons/hi";

// const BASE_URL_AND_PORT = "https://api.static.ev.transev.site";
// const API_KEY = "mlzuMoRFjdGhcFulLMaVtfwNAHycbBAf";
//   const authToken = localStorage.getItem('auth_token');
// const ORDER_STATUS_OPTIONS = [
//   { value: "", label: "All Orders", icon: "📊", color: "gray" },
//   { value: "Order Placed", label: "Order Placed", icon: "📦", color: "purple" },
//   { value: "Accepted", label: "Accepted", icon: "✓", color: "orange" },
//   { value: "Processing", label: "Processing", icon: "⚙️", color: "yellow" },
//   { value: "Shipped", label: "Shipped", icon: "🚚", color: "blue" },
//   { value: "Delivered", label: "Delivered", icon: "🏠", color: "green" },
// ];

// const ManageOrders = () => {
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [isMobile, setIsMobile] = useState(false);
//   const [orders, setOrders] = useState([]);
//   const [filteredOrders, setFilteredOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [updating, setUpdating] = useState({});
//   const [selectedStatus, setSelectedStatus] = useState("");
//   const [showCanceledOrders, setShowCanceledOrders] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(9);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [showOrderDetails, setShowOrderDetails] = useState(false);
//   const [dateRange, setDateRange] = useState({ start: "", end: "" });
//   const [sortBy, setSortBy] = useState("newest");
//   const [toast, setToast] = useState(null);

//   // Cancel Modal
//   const [cancelModalVisible, setCancelModalVisible] = useState(false);
//   const [cancelOrderId, setCancelOrderId] = useState(null);
//   const [cancelOtherReason, setCancelOtherReason] = useState("");

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

//   const showToast = (message, type = "success") => {
//     setToast({ message, type });
//     setTimeout(() => setToast(null), 3000);
//   };

//   // Helper function to get display status (handles null/undefined and pending)
//   const getDisplayStatus = (order) => {
//     // Check for pending status first
//     if (order.order_status === "pending" || order.order_status === "Pending") {
//       return "Order Placed";
//     }
//     if (!order.order_status || order.order_status === "null" || order.order_status === "") {
//       return "Order Placed";
//     }
//     return order.order_status;
//   };

//   // Check if order can be canceled (only Order Placed status)
//   const canCancelOrder = (order) => {
//     const displayStatus = getDisplayStatus(order);
//     return displayStatus === "Order Placed";
//   };

//   const statusColor = (status) => {
//     switch (status) {
//       case "Accepted":
//         return "bg-orange-100 text-orange-800 border-orange-200";
//       case "Processing":
//         return "bg-yellow-100 text-yellow-800 border-yellow-200";
//       case "Shipped":
//         return "bg-blue-100 text-blue-800 border-blue-200";
//       case "Delivered":
//         return "bg-green-100 text-green-800 border-green-200";
//       case "Order Placed":
//         return "bg-purple-100 text-purple-800 border-purple-200";
//       case "canceled":
//         return "bg-red-100 text-red-800 border-red-200";
//       default:
//         return "bg-gray-100 text-gray-800 border-gray-200";
//     }
//   };

//   const statusIcon = (status) => {
//     switch (status) {
//       case "Accepted": return <FaCheckCircle className="text-orange-500" />;
//       case "Processing": return <FaSpinner className="text-yellow-500 animate-spin" />;
//       case "Shipped": return <FaShippingFast className="text-blue-500" />;
//       case "Delivered": return <FaBoxOpen className="text-green-500" />;
//       case "Order Placed": return <FaClock className="text-purple-500" />;
//       default: return <FaClock className="text-gray-500" />;
//     }
//   };

//   // Fetch orders
//   useEffect(() => {
//     fetchOrders();
//   }, []);

  
// const fetchOrders = () => {
//     setLoading(true);
//     fetch(`${BASE_URL_AND_PORT}/order/allorderdata`, {
//       headers: { 
//         "API-Key": API_KEY, 
//         'Authorization': `Bearer ${authToken}`
//       },
//     })
//       .then((res) => {
//         if (!res.ok) throw new Error("Failed to fetch orders");
//         return res.json();
//       })
//       .then((data) => {
//         // Process orders using the refunds array from backend
//         const processedOrders = data.map(order => {
//           // Check if order has any successful refund
//           const hasSuccessfulRefund = order.refunds && order.refunds.some(
//             refund => refund.refund_status === "processed"
//           );
          
//           // Get the latest refund details
//           const latestRefund = order.refunds && order.refunds.length > 0 
//             ? order.refunds[order.refunds.length - 1] 
//             : null;
          
//           // Determine if order is canceled (status is 'canceled')
//           const isCanceled = order.order_status?.toLowerCase() === "canceled";
          
//           return {
//             ...order,
//             display_status: getDisplayStatus(order),
//             is_canceled: isCanceled,
//             is_refunded: hasSuccessfulRefund,
//             refund_status: latestRefund?.refund_status || null,
//             rzp_refund_id: latestRefund?.rzp_refund_id || null,
//             refund_amount: latestRefund?.refund_amount_paise ? latestRefund.refund_amount_paise / 100 : null,
//             refunds: order.refunds || []
//           };
//         });
        
//         const sorted = processedOrders.sort(
//           (a, b) => new Date(b.purchase_time) - new Date(a.purchase_time)
//         );
//         setOrders(sorted);
//         setFilteredOrders(sorted);
//       })
//       .catch((err) => {
//         console.error(err);
//         showToast("Error fetching orders. Please try again.", "error");
//       })
//       .finally(() => setLoading(false));
//   };
//   // Apply filters
//   useEffect(() => {
//     let filtered = [...orders];

//     if (showCanceledOrders) {
//       filtered = filtered.filter((order) => order.order_status?.toLowerCase() === "canceled");
//     } else {
//       if (selectedStatus) {
//         filtered = filtered.filter(
//           (order) => getDisplayStatus(order) === selectedStatus
//         );
//       }
//     }

//     if (searchTerm) {
//       filtered = filtered.filter(
//         (order) =>
//           order.order_id?.toString().includes(searchTerm) ||
//           order.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           order.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           order.product_name?.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }

//     if (dateRange.start) {
//       filtered = filtered.filter(
//         (order) => new Date(order.purchase_time) >= new Date(dateRange.start)
//       );
//     }
//     if (dateRange.end) {
//       filtered = filtered.filter(
//         (order) => new Date(order.purchase_time) <= new Date(dateRange.end)
//       );
//     }

//     if (sortBy === "newest") {
//       filtered.sort((a, b) => new Date(b.purchase_time) - new Date(a.purchase_time));
//     } else if (sortBy === "oldest") {
//       filtered.sort((a, b) => new Date(a.purchase_time) - new Date(b.purchase_time));
//     } else if (sortBy === "amount_high") {
//       filtered.sort((a, b) => (b.total_amount || 0) - (a.total_amount || 0));
//     } else if (sortBy === "amount_low") {
//       filtered.sort((a, b) => (a.total_amount || 0) - (b.total_amount || 0));
//     }

//     setFilteredOrders(filtered);
//     setCurrentPage(1);
//   }, [selectedStatus, searchTerm, dateRange, sortBy, orders, showCanceledOrders]);

//   // Update order status
//   const handleStatusChange = async (order_id, newStatus) => {
//     if (!newStatus) return;
//     setUpdating((prev) => ({ ...prev, [order_id]: true }));

//     try {
//       const response = await fetch(`${BASE_URL_AND_PORT}/order/statusupdate`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json", "API-Key": API_KEY },
//         body: JSON.stringify({ orderid: order_id, orderstatus: newStatus }),
//       });

//       if (!response.ok) throw new Error("Failed to update order status");

//       setOrders((prev) =>
//         prev.map((order) =>
//           order.order_id === order_id
//             ? { ...order, order_status: newStatus, display_status: getDisplayStatus({ ...order, order_status: newStatus }) }
//             : order
//         )
//       );

//       showToast("Order status updated successfully!", "success");
//     } catch (err) {
//       console.error(err);
//       showToast("Error updating order status", "error");
//     } finally {
//       setUpdating((prev) => ({ ...prev, [order_id]: false }));
//     }
//   };

//   // Open cancel modal
//   const openCancelModal = (orderId) => {
//     setCancelOrderId(orderId);
//     setCancelOtherReason("");
//     setCancelModalVisible(true);
//   };

//   // Admin Cancel Order
//   const handleCancelOrder = async () => {
//     const orderId = cancelOrderId;
//     if (!orderId) return;

//     const order = orders.find((o) => o.order_id === orderId);
    
//     // Check if order can be canceled (display_status should be "Order Placed")
//     if (!canCancelOrder(order)) {
//       showToast("You can only cancel orders that are in 'Order Placed' status.", "error");
//       setCancelModalVisible(false);
//       return;
//     }

//     setUpdating((prev) => ({ ...prev, [orderId]: true }));

//     try {
//       const res = await fetch(`${BASE_URL_AND_PORT}/order/cancelorder`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json", "API-Key": API_KEY },
//         body: JSON.stringify({
//           order_id: orderId,
//           reasonforcancel: "Admin Cancelled",
//           otherreasonforcancel: cancelOtherReason || "",
//         }),
//       });

//       if (!res.ok) throw new Error("Failed to cancel order");

//       setOrders((prev) =>
//         prev.map((o) =>
//           o.order_id === orderId
//             ? {
//                 ...o,
//                 order_status: "canceled",
//                 display_status: "canceled",
//                 is_canceled: true,
//                 reasonforcancel: "Admin Cancelled",
//                 otherreasonforcancel: cancelOtherReason || "",
//                 refund_status: null,
//                 is_refunded: false,
//                 refunds: []
//               }
//             : o
//         )
//       );

//       showToast("Order successfully canceled by admin. You can now process refund.", "success");
//     } catch (err) {
//       console.error(err);
//       showToast("Error canceling order. Please try again.", "error");
//     } finally {
//       setUpdating((prev) => ({ ...prev, [orderId]: false }));
//       setCancelModalVisible(false);
//     }
//   };

//   // Refund for canceled orders
//   const handleRefund = async (order) => {
//     if (!window.confirm("Are you sure you want to initiate refund for this canceled order?")) return;

//     // Check if payment_id exists
//     if (!order.rzp_payment_id || order.rzp_payment_id === "default_id") {
//       showToast("❌ Cannot process refund: Valid Payment ID not found for this order.", "error");
//       return;
//     }

//     setUpdating((prev) => ({ ...prev, [order.order_id]: true }));

//     try {
//       const response = await fetch(`${BASE_URL_AND_PORT}/razorpay-refunds/initiate`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json", "API-Key": API_KEY },
//         body: JSON.stringify({
//           order_id: order.order_id,
//           refund_amount_paise: order.total_amount * 100,
//           rzp_payment_id: order.rzp_payment_id,
//           rzp_order_id: order.rzp_order_id,
//           reason: `Order canceled - ${order.reasonforcancel || "Customer request"}`,
//         }),
//       });

//       const data = await response.json();
//       if (!response.ok) throw new Error(data.message || "Refund failed");

//       showToast(`✅ Refund initiated! Status: ${data.refund_status}`, "success");

//       // Refresh orders to get updated refund status
//       setTimeout(() => fetchOrders(), 2000);
//     } catch (err) {
//       console.error(err);
//       showToast("❌ Refund initiation failed. See console for details.", "error");
//     } finally {
//       setUpdating((prev) => ({ ...prev, [order.order_id]: false }));
//     }
//   };

//   // Copy to clipboard
//   const copyToClipboard = (text) => {
//     navigator.clipboard.writeText(text);
//     showToast("Copied to clipboard!", "success");
//   };

//   // Export orders to CSV
//   const exportToCSV = () => {
//     const headers = ["Order ID", "Customer", "Email", "Product", "Quantity", "Total", "Status", "Date", "Refund Status"];
//     const csvData = filteredOrders.map(order => [
//       order.order_id,
//       order.user_name,
//       order.user_email,
//       `${order.product_name} (${order.product_model})`,
//       order.quantity_ordered,
//       order.total_amount,
//       getDisplayStatus(order),
//       new Date(order.purchase_time).toLocaleString(),
//       order.is_refunded ? "Refunded" : "Not Refunded"
//     ]);
    
//     const csvContent = [headers, ...csvData].map(row => row.join(",")).join("\n");
//     const blob = new Blob([csvContent], { type: "text/csv" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `orders_${new Date().toISOString().split("T")[0]}.csv`;
//     a.click();
//     URL.revokeObjectURL(url);
//     showToast("Orders exported successfully!", "success");
//   };

//   // Pagination
//   const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
//   const paginatedOrders = filteredOrders.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   // Order statistics
//   const stats = {
//     total: orders.length,
//     placed: orders.filter(o => getDisplayStatus(o) === "Order Placed").length,
//     accepted: orders.filter(o => o.order_status === "Accepted").length,
//     processing: orders.filter(o => o.order_status === "Processing").length,
//     shipped: orders.filter(o => o.order_status === "Shipped").length,
//     delivered: orders.filter(o => o.order_status === "Delivered").length,
//     canceled: orders.filter(o => o.order_status?.toLowerCase() === "canceled").length,
//     refunded: orders.filter(o => o.is_refunded === true).length,
//     totalRevenue: orders
//       .filter(o => o.order_status?.toLowerCase() !== "canceled")
//       .reduce((sum, o) => sum + (parseFloat(o.total_amount) || 0), 0),
//   };

//   return (
//     <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//       {/* Toast Notification */}
//       {toast && (
//         <div className={`fixed top-20 right-4 z-50 animate-slideIn ${
//           toast.type === "success" ? "bg-green-500" : "bg-red-500"
//         } text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2`}>
//           {toast.type === "success" ? "✓" : "✗"} {toast.message}
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
//                 <h1 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
//                   Manage Orders
//                 </h1>
//                 <p className="text-gray-500 text-sm md:text-base mt-1">View and manage all customer orders</p>
//               </div>

//               {/* Stats Cards */}
//               <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-9 gap-3 md:gap-4 mb-6 md:mb-8">
//                 <div className="bg-white rounded-xl p-3 md:p-4 shadow-sm border border-gray-100 hover:shadow-md transition">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-xs text-gray-500">Total Orders</p>
//                       <p className="text-xl md:text-2xl font-bold text-gray-800">{stats.total}</p>
//                     </div>
//                     <div className="w-8 h-8 md:w-10 md:h-10 bg-indigo-100 rounded-full flex items-center justify-center">
//                       <FaBoxOpen className="text-indigo-600 text-sm md:text-base" />
//                     </div>
//                   </div>
//                 </div>
//                 <div className="bg-white rounded-xl p-3 md:p-4 shadow-sm border border-gray-100 hover:shadow-md transition">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-xs text-gray-500">Order Placed</p>
//                       <p className="text-xl md:text-2xl font-bold text-purple-600">{stats.placed}</p>
//                     </div>
//                     <div className="w-8 h-8 md:w-10 md:h-10 bg-purple-100 rounded-full flex items-center justify-center">
//                       <FaClock className="text-purple-600 text-sm md:text-base" />
//                     </div>
//                   </div>
//                 </div>
//                 <div className="bg-white rounded-xl p-3 md:p-4 shadow-sm border border-gray-100 hover:shadow-md transition">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-xs text-gray-500">Accepted</p>
//                       <p className="text-xl md:text-2xl font-bold text-orange-600">{stats.accepted}</p>
//                     </div>
//                     <div className="w-8 h-8 md:w-10 md:h-10 bg-orange-100 rounded-full flex items-center justify-center">
//                       <FaCheckCircle className="text-orange-600 text-sm md:text-base" />
//                     </div>
//                   </div>
//                 </div>
//                 <div className="bg-white rounded-xl p-3 md:p-4 shadow-sm border border-gray-100 hover:shadow-md transition">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-xs text-gray-500">Processing</p>
//                       <p className="text-xl md:text-2xl font-bold text-yellow-600">{stats.processing}</p>
//                     </div>
//                     <div className="w-8 h-8 md:w-10 md:h-10 bg-yellow-100 rounded-full flex items-center justify-center">
//                       <FaSpinner className="text-yellow-600 animate-spin text-sm md:text-base" />
//                     </div>
//                   </div>
//                 </div>
//                 <div className="bg-white rounded-xl p-3 md:p-4 shadow-sm border border-gray-100 hover:shadow-md transition">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-xs text-gray-500">Shipped</p>
//                       <p className="text-xl md:text-2xl font-bold text-blue-600">{stats.shipped}</p>
//                     </div>
//                     <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-100 rounded-full flex items-center justify-center">
//                       <FaTruck className="text-blue-600 text-sm md:text-base" />
//                     </div>
//                   </div>
//                 </div>
//                 <div className="bg-white rounded-xl p-3 md:p-4 shadow-sm border border-gray-100 hover:shadow-md transition">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-xs text-gray-500">Delivered</p>
//                       <p className="text-xl md:text-2xl font-bold text-green-600">{stats.delivered}</p>
//                     </div>
//                     <div className="w-8 h-8 md:w-10 md:h-10 bg-green-100 rounded-full flex items-center justify-center">
//                       <FaCheckCircle className="text-green-600 text-sm md:text-base" />
//                     </div>
//                   </div>
//                 </div>
//                 <div className="bg-white rounded-xl p-3 md:p-4 shadow-sm border border-gray-100 hover:shadow-md transition">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-xs text-gray-500">Canceled</p>
//                       <p className="text-xl md:text-2xl font-bold text-red-600">{stats.canceled}</p>
//                     </div>
//                     <div className="w-8 h-8 md:w-10 md:h-10 bg-red-100 rounded-full flex items-center justify-center">
//                       <FaTimesCircle className="text-red-600 text-sm md:text-base" />
//                     </div>
//                   </div>
//                 </div>
//                 <div className="bg-white rounded-xl p-3 md:p-4 shadow-sm border border-gray-100 hover:shadow-md transition">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-xs text-gray-500">Refunded</p>
//                       <p className="text-xl md:text-2xl font-bold text-blue-600">{stats.refunded}</p>
//                     </div>
//                     <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-100 rounded-full flex items-center justify-center">
//                       <FaMoneyBill className="text-blue-600 text-sm md:text-base" />
//                     </div>
//                   </div>
//                 </div>
//                 <div className="bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl p-3 md:p-4 shadow-sm hover:shadow-md transition text-white">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-xs text-white/80">Total Revenue</p>
//                       <p className="text-base md:text-xl font-bold">₹{stats.totalRevenue.toLocaleString("en-IN")}</p>
//                     </div>
//                     <div className="w-8 h-8 md:w-10 md:h-10 bg-white/20 rounded-full flex items-center justify-center">
//                       <FaRupeeSign className="text-white text-sm md:text-lg" />
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Filters Bar */}
//               <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 md:p-4 mb-6">
//                 <div className="flex flex-col sm:flex-row flex-wrap gap-3">
//                   <div className="flex-1 min-w-[200px] relative">
//                     <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//                     <input
//                       type="text"
//                       placeholder={showCanceledOrders ? "Search canceled orders..." : "Search orders..."}
//                       value={searchTerm}
//                       onChange={(e) => setSearchTerm(e.target.value)}
//                       className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
//                     />
//                   </div>

//                   {!showCanceledOrders && (
//                     <select
//                       value={selectedStatus}
//                       onChange={(e) => setSelectedStatus(e.target.value)}
//                       className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm min-w-[140px]"
//                     >
//                       {ORDER_STATUS_OPTIONS.map((opt) => (
//                         <option key={opt.value} value={opt.value}>
//                           {opt.icon} {opt.label}
//                         </option>
//                       ))}
//                     </select>
//                   )}

//                   <select
//                     value={sortBy}
//                     onChange={(e) => setSortBy(e.target.value)}
//                     className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm min-w-[140px]"
//                   >
//                     <option value="newest">Newest First</option>
//                     <option value="oldest">Oldest First</option>
//                     <option value="amount_high">Highest Amount</option>
//                     <option value="amount_low">Lowest Amount</option>
//                   </select>

//                   <div className="flex gap-2">
//                     <input
//                       type="date"
//                       value={dateRange.start}
//                       onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
//                       className="px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm w-[120px]"
//                     />
//                     <input
//                       type="date"
//                       value={dateRange.end}
//                       onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
//                       className="px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm w-[120px]"
//                     />
//                   </div>

//                   <button
//                     onClick={exportToCSV}
//                     className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2 transition text-sm"
//                   >
//                     <FaDownload size={12} />
//                     Export
//                   </button>

//                   <button
//                     onClick={fetchOrders}
//                     className="px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg flex items-center gap-2 transition text-sm"
//                   >
//                     <HiOutlineRefresh size={12} />
//                     Refresh
//                   </button>
//                 </div>
//               </div>

//               {/* Toggle Buttons */}
//               <div className="mb-6 flex justify-center sm:justify-end gap-3">
//                 <button
//                   onClick={() => {
//                     setShowCanceledOrders(false);
//                     setSelectedStatus("");
//                   }}
//                   className={`px-4 py-2 rounded-lg flex items-center gap-2 transition text-sm font-medium ${
//                     !showCanceledOrders
//                       ? "bg-indigo-600 text-white shadow-md"
//                       : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//                   }`}
//                 >
//                   <FaBoxOpen size={14} />
//                   All Orders
//                 </button>
//                 <button
//                   onClick={() => {
//                     setShowCanceledOrders(true);
//                     setSelectedStatus("");
//                   }}
//                   className={`px-4 py-2 rounded-lg flex items-center gap-2 transition text-sm font-medium ${
//                     showCanceledOrders
//                       ? "bg-red-600 text-white shadow-md"
//                       : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//                   }`}
//                 >
//                   <FaTimesCircle size={14} />
//                   Canceled Orders ({stats.canceled})
//                 </button>
//               </div>

//               {/* Orders Grid */}
//               {loading ? (
//                 <div className="flex justify-center items-center py-20">
//                   <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
//                 </div>
//               ) : paginatedOrders.length === 0 ? (
//                 <div className="text-center py-20 bg-white rounded-xl">
//                   <div className="text-6xl mb-4">{showCanceledOrders ? "❌" : "📦"}</div>
//                   <p className="text-gray-500 text-lg">
//                     {showCanceledOrders 
//                       ? "No canceled orders found" 
//                       : "No orders found"}
//                   </p>
//                 </div>
//               ) : (
//                 <>
//                   {/* Mobile View */}
//                   <div className="block md:hidden space-y-4">
//                     {paginatedOrders.map((order) => {
//                       const displayStatus = getDisplayStatus(order);
//                       const canCancel = canCancelOrder(order);
//                       const isRefunded = order.is_refunded === true;
//                       const showRefundButton = showCanceledOrders && order.is_canceled === true && !isRefunded;
//                       const showRefundDoneButton = showCanceledOrders && order.is_canceled === true && isRefunded;

//                       return (
//                         <div key={order.order_id} className="bg-white rounded-xl shadow-lg p-4">
//                           <div className="flex justify-between items-start mb-3">
//                             <div>
//                               <div className="flex items-center gap-2 mb-1">
//                                 <span className="text-lg">{statusIcon(displayStatus)}</span>
//                                 <span className="font-semibold text-gray-700">#{order.order_id.slice(-8)}</span>
//                               </div>
//                               <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor(displayStatus)}`}>
//                                 {displayStatus}
//                               </span>
//                             </div>
//                             <button
//                               onClick={() => copyToClipboard(order.order_id.toString())}
//                               className="text-gray-400 hover:text-indigo-600"
//                             >
//                               <FaCopy size={14} />
//                             </button>
//                           </div>

//                           <div className="space-y-2 mb-3">
//                             <div className="flex items-center gap-2">
//                               <FaUserCircle className="text-indigo-600" />
//                               <div>
//                                 <p className="font-medium text-sm">{order.user_name}</p>
//                                 <p className="text-xs text-gray-500">{order.user_email}</p>
//                               </div>
//                             </div>
//                             <div className="flex justify-between text-sm">
//                               <span className="text-gray-500">Qty: {order.quantity_ordered}</span>
//                               <span className="font-bold text-indigo-600">₹{parseFloat(order.total_amount).toLocaleString() || 0}</span>
//                             </div>
//                             <div className="flex items-center gap-2 text-xs text-gray-500">
//                               <FaCalendarAlt size={10} />
//                               {new Date(order.purchase_time).toLocaleDateString("en-IN")}
//                             </div>
//                           </div>

//                           <div className="flex gap-2">
//                             <button
//                               onClick={() => {
//                                 setSelectedOrder(order);
//                                 setShowOrderDetails(true);
//                               }}
//                               className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold"
//                             >
//                               View Details
//                             </button>
//                             {showRefundButton && (
//                               <button
//                                 onClick={() => handleRefund(order)}
//                                 disabled={updating[order.order_id]}
//                                 className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2"
//                               >
//                                 {updating[order.order_id] ? <FaSpinner className="animate-spin" size={14} /> : <FaHandHoldingUsd size={14} />}
//                                 Refund
//                               </button>
//                             )}
//                             {showRefundDoneButton && (
//                               <button
//                                 disabled={true}
//                                 className="flex-1 py-2 bg-blue-500 text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2 cursor-not-allowed opacity-80"
//                               >
//                                 <FaCheckCircle size={14} />
//                                 Refund Done
//                               </button>
//                             )}
//                             {canCancel && !showCanceledOrders && (
//                               <button
//                                 onClick={() => openCancelModal(order.order_id)}
//                                 className="py-2 px-3 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm"
//                               >
//                                 Cancel
//                               </button>
//                             )}
//                           </div>
//                           {order.is_refunded && order.rzp_refund_id && (
//                             <div className="mt-2 text-xs text-gray-400 text-center">
//                               Refund ID: {order.rzp_refund_id.slice(-8)}
//                             </div>
//                           )}
//                         </div>
//                       );
//                     })}
//                   </div>

//                   {/* Desktop View */}
//                   <div className="hidden md:grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
//                     {paginatedOrders.map((order) => {
//                       const displayStatus = getDisplayStatus(order);
//                       const canCancel = canCancelOrder(order);
//                       const isRefunded = order.is_refunded === true;
//                       const showRefundButton = showCanceledOrders && order.is_canceled === true && !isRefunded;
//                       const showRefundDoneButton = showCanceledOrders && order.is_canceled === true && isRefunded;

//                       return (
//                         <div
//                           key={order.order_id}
//                           className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:-translate-y-1"
//                         >
//                           <div className={`px-5 py-4 border-b ${
//                             showCanceledOrders 
//                               ? "bg-gradient-to-r from-red-50 to-red-100 border-red-200" 
//                               : "bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200"
//                           }`}>
//                             <div className="flex items-center justify-between">
//                               <div className="flex items-center gap-2">
//                                 <span className="text-lg">{statusIcon(displayStatus)}</span>
//                                 <span className="font-semibold text-gray-700">Order #{order.order_id.slice(-8)}</span>
//                               </div>
//                               <div className="flex items-center gap-2">
//                                 {order.is_refunded && order.rzp_refund_id && (
//                                   <span className="text-[10px] text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
//                                     Refunded
//                                   </span>
//                                 )}
//                                 <button
//                                   onClick={() => copyToClipboard(order.order_id.toString())}
//                                   className="text-gray-400 hover:text-indigo-600 transition"
//                                 >
//                                   <FaCopy size={14} />
//                                 </button>
//                               </div>
//                             </div>
//                             <div className="flex items-center justify-between mt-2">
//                               <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor(displayStatus)}`}>
//                                 {displayStatus}
//                               </span>
//                               <div className="flex items-center gap-1 text-xs text-gray-500">
//                                 <FaCalendarAlt size={10} />
//                                 {new Date(order.purchase_time).toLocaleDateString("en-IN", {
//                                   day: "numeric",
//                                   month: "short",
//                                   year: "numeric",
//                                 })}
//                               </div>
//                             </div>
//                           </div>

//                           <div className="p-5">
//                             <div className="flex items-start gap-3 mb-4">
//                               <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
//                                 <FaUserCircle className="text-indigo-600 text-xl" />
//                               </div>
//                               <div className="flex-1 min-w-0">
//                                 <p className="font-semibold text-gray-800 truncate">{order.user_name}</p>
//                                 <p className="text-xs text-gray-500 truncate">{order.user_email}</p>
//                                 <div className="flex items-center gap-1 mt-1">
//                                   <FaPhoneAlt size={10} className="text-gray-400" />
//                                   <p className="text-xs text-gray-500">{order.user_phonenumber}</p>
//                                 </div>
//                               </div>
//                             </div>

//                             <div className="mb-4 p-3 bg-gray-50 rounded-lg">
//                               <p className="font-medium text-gray-800 text-sm">{order.product_name}</p>
//                               <p className="text-xs text-gray-500">Model: {order.product_model}</p>
//                               <div className="flex justify-between items-center mt-2">
//                                 <span className="text-xs text-gray-500">Qty: {order.quantity_ordered}</span>
//                                 <span className="font-bold text-indigo-600">₹{parseFloat(order.total_amount).toLocaleString() || 0}</span>
//                               </div>
//                             </div>

//                             <div className="space-y-2 mb-4">
//                               <div className="flex items-center gap-2 text-xs text-gray-600">
//                                 <MdPayment size={14} />
//                                 <span>Payment: {order.payment_option || "N/A"}</span>
//                               </div>
//                               <div className="flex items-start gap-2 text-xs text-gray-600">
//                                 <FaMapMarkerAlt size={12} className="mt-0.5" />
//                                 <span className="line-clamp-2">{order.deliveryaddress || order.address || "Address not provided"}</span>
//                               </div>
//                             </div>

//                             {!showCanceledOrders && displayStatus !== "canceled" && displayStatus !== "Delivered" && (
//                               <div className="mb-3">
//                                 <select
//                                   value={order.order_status === "null" || !order.order_status || order.order_status === "pending" ? "Order Placed" : order.order_status}
//                                   onChange={(e) => {
//                                     let statusValue = e.target.value;
//                                     if (statusValue === "Order Placed") statusValue = "null";
//                                     handleStatusChange(order.order_id, statusValue);
//                                   }}
//                                   disabled={updating[order.order_id]}
//                                   className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                                 >
//                                   <option value="Order Placed">📦 Order Placed</option>
//                                   <option value="Accepted">✓ Accepted</option>
//                                   <option value="Processing">⚙️ Processing</option>
//                                   <option value="Shipped">🚚 Shipped</option>
//                                   <option value="Delivered">🏠 Delivered</option>
//                                 </select>
//                               </div>
//                             )}

//                             <div className="flex gap-2">
//                               <button
//                                 onClick={() => {
//                                   setSelectedOrder(order);
//                                   setShowOrderDetails(true);
//                                 }}
//                                 className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition"
//                               >
//                                 <FaEye size={12} />
//                                 View Details
//                               </button>

//                               {showRefundButton && (
//                                 <button
//                                   onClick={() => handleRefund(order)}
//                                   disabled={updating[order.order_id]}
//                                   className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition disabled:opacity-50"
//                                 >
//                                   {updating[order.order_id] ? <FaSpinner className="animate-spin" /> : <FaHandHoldingUsd size={14} />}
//                                   Refund
//                                 </button>
//                               )}

//                               {showRefundDoneButton && (
//                                 <button
//                                   disabled={true}
//                                   className="flex-1 py-2 bg-blue-500 text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2 cursor-not-allowed opacity-80"
//                                 >
//                                   <FaCheckCircle size={14} />
//                                   Refund Done
//                                 </button>
//                               )}

//                               {canCancel && !showCanceledOrders && (
//                                 <button
//                                   onClick={() => openCancelModal(order.order_id)}
//                                   disabled={updating[order.order_id]}
//                                   className="py-2 px-3 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold transition disabled:opacity-50"
//                                 >
//                                   Cancel
//                                 </button>
//                               )}
//                             </div>

//                             {/* Show refund details if already refunded */}
//                             {order.is_refunded === true && (
//                               <div className="mt-3 p-2 bg-blue-50 rounded-lg border border-blue-200">
//                                 <p className="text-xs text-blue-700 font-medium flex items-center justify-center gap-1">
//                                   <FaCheckCircle size={12} />
//                                   Refund Completed Successfully
//                                 </p>
//                                 {order.rzp_refund_id && (
//                                   <p className="text-[10px] text-blue-500 text-center mt-1">
//                                     Refund ID: {order.rzp_refund_id}
//                                   </p>
//                                 )}
//                                 {order.refund_amount && (
//                                   <p className="text-[10px] text-blue-500 text-center">
//                                     Amount: ₹{order.refund_amount.toLocaleString()}
//                                   </p>
//                                 )}
//                               </div>
//                             )}

//                             {order.reasonforcancel && !order.is_refunded && (
//                               <div className="mt-3 p-2 bg-red-50 rounded-lg border border-red-100">
//                                 <p className="text-xs text-red-700">
//                                   <strong>Cancel Reason:</strong>{" "}
//                                   {order.reasonforcancel === "Admin Cancelled"
//                                     ? order.otherreasonforcancel || "Admin Cancelled"
//                                     : order.reasonforcancel === "other"
//                                     ? order.otherreasonforcancel
//                                     : order.reasonforcancel}
//                                 </p>
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 </>
//               )}

//               {/* Pagination */}
//               {!loading && filteredOrders.length > 0 && (
//                 <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8">
//                   <div className="text-xs sm:text-sm text-gray-500">
//                     Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredOrders.length)} of {filteredOrders.length} orders
//                   </div>
//                   <div className="flex gap-2">
//                     <button
//                       onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//                       disabled={currentPage === 1}
//                       className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm"
//                     >
//                       <FaChevronLeft size={12} />
//                     </button>
//                     <span className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-sm">
//                       {currentPage}
//                     </span>
//                     <button
//                       onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
//                       disabled={currentPage === totalPages}
//                       className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm"
//                     >
//                       <FaChevronRight size={12} />
//                     </button>
//                   </div>
//                   <select
//                     value={itemsPerPage}
//                     onChange={(e) => setItemsPerPage(Number(e.target.value))}
//                     className="px-2 py-1.5 border border-gray-300 rounded-lg text-sm"
//                   >
//                     <option value={6}>6 / page</option>
//                     <option value={9}>9 / page</option>
//                     <option value={12}>12 / page</option>
//                     <option value={24}>24 / page</option>
//                   </select>
//                 </div>
//               )}
//             </div>
//           </div>
//         </main>
//       </div>

//       {/* Cancel Reason Modal */}
//       {cancelModalVisible && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
//           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto animate-fadeIn">
//             <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-t-2xl px-4 md:px-6 py-3 md:py-4">
//               <h2 className="text-lg md:text-xl font-bold text-white">Cancel Order</h2>
//             </div>
//             <div className="p-4 md:p-6">
//               <p className="text-sm md:text-base text-gray-600 mb-4">Please provide a reason for cancellation:</p>
//               <textarea
//                 placeholder="Enter cancellation reason..."
//                 value={cancelOtherReason}
//                 onChange={(e) => setCancelOtherReason(e.target.value)}
//                 rows={4}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
//               />
//               <div className="flex gap-3 mt-6">
//                 <button
//                   onClick={() => setCancelModalVisible(false)}
//                   className="flex-1 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition text-sm"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleCancelOrder}
//                   className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition text-sm"
//                 >
//                   Confirm Cancel
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Order Details Modal */}
//       {showOrderDetails && selectedOrder && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4 overflow-y-auto">
//           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-auto my-8 animate-fadeIn">
//             <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-t-2xl px-4 md:px-6 py-3 md:py-4 flex justify-between items-center">
//               <h2 className="text-lg md:text-xl font-bold text-white">Order Details</h2>
//               <button
//                 onClick={() => setShowOrderDetails(false)}
//                 className="text-white/80 hover:text-white"
//               >
//                 ✕
//               </button>
//             </div>
//             <div className="p-4 md:p-6 max-h-[70vh] overflow-y-auto">
//               <div className="space-y-4">
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <p className="text-xs text-gray-500">Order ID</p>
//                     <p className="font-semibold text-sm">{selectedOrder.order_id}</p>
//                   </div>
//                   <div>
//                     <p className="text-xs text-gray-500">Status</p>
//                     <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor(getDisplayStatus(selectedOrder))}`}>
//                       {getDisplayStatus(selectedOrder)}
//                     </span>
//                   </div>
//                 </div>

//                 <div>
//                   <p className="text-xs text-gray-500">Customer Information</p>
//                   <div className="bg-gray-50 rounded-lg p-3 mt-1">
//                     <p className="font-medium text-sm">{selectedOrder.user_name}</p>
//                     <p className="text-xs text-gray-600">{selectedOrder.user_email}</p>
//                     <p className="text-xs text-gray-600">{selectedOrder.user_phonenumber}</p>
//                   </div>
//                 </div>

//                 <div>
//                   <p className="text-xs text-gray-500">Delivery Address</p>
//                   <div className="bg-gray-50 rounded-lg p-3 mt-1">
//                     <p className="text-xs md:text-sm">{selectedOrder.deliveryaddress || selectedOrder.address || "Address not provided"}</p>
//                   </div>
//                 </div>

//                 <div>
//                   <p className="text-xs text-gray-500">Product Details</p>
//                   <div className="bg-gray-50 rounded-lg p-3 mt-1">
//                     <p className="font-medium text-sm">{selectedOrder.product_name}</p>
//                     <p className="text-xs text-gray-600">Model: {selectedOrder.product_model}</p>
//                     <p className="text-xs">Quantity: {selectedOrder.quantity_ordered}</p>
//                     <p className="text-base md:text-lg font-bold text-indigo-600 mt-2">₹{parseFloat(selectedOrder.total_amount).toLocaleString() || 0}</p>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <p className="text-xs text-gray-500">Payment Method</p>
//                     <p className="font-medium text-sm">{selectedOrder.payment_option || "N/A"}</p>
//                   </div>
//                   <div>
//                     <p className="text-xs text-gray-500">Payment ID</p>
//                     <p className="text-xs font-mono text-gray-600">{selectedOrder.rzp_payment_id || "N/A"}</p>
//                   </div>
//                 </div>

//                 {selectedOrder.rzp_order_id && selectedOrder.rzp_order_id !== "default_id" && (
//                   <div>
//                     <p className="text-xs text-gray-500">Razorpay Order ID</p>
//                     <p className="text-xs font-mono text-gray-600">{selectedOrder.rzp_order_id}</p>
//                   </div>
//                 )}

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <p className="text-xs text-gray-500">Order Date</p>
//                     <p className="font-medium text-sm">
//                       {new Date(selectedOrder.purchase_time).toLocaleString("en-IN", {
//                         dateStyle: "medium",
//                         timeStyle: "short",
//                       })}
//                     </p>
//                   </div>
//                   {selectedOrder.is_refunded === true && (
//                     <div>
//                       <p className="text-xs text-gray-500">Refund Status</p>
//                       <p className="text-sm text-green-600 font-medium">Completed</p>
//                     </div>
//                   )}
//                 </div>

//                 {/* Refund Status in Modal */}
//                 {selectedOrder.is_refunded === true && (
//                   <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
//                     <p className="text-sm text-blue-700 font-medium flex items-center gap-2">
//                       <FaCheckCircle size={14} />
//                       Refund Status: Completed
//                     </p>
//                     {selectedOrder.rzp_refund_id && (
//                       <p className="text-xs text-blue-600 mt-1">Refund ID: {selectedOrder.rzp_refund_id}</p>
//                     )}
//                     {selectedOrder.refund_amount && (
//                       <p className="text-xs text-blue-600 mt-1">Refund Amount: ₹{selectedOrder.refund_amount.toLocaleString()}</p>
//                     )}
//                   </div>
//                 )}

//                 {selectedOrder.reasonforcancel && !selectedOrder.is_refunded && (
//                   <div>
//                     <p className="text-xs text-gray-500">Cancellation Reason</p>
//                     <div className="bg-red-50 rounded-lg p-3 mt-1 border border-red-100">
//                       <p className="text-xs md:text-sm text-red-700">
//                         {selectedOrder.reasonforcancel === "Admin Cancelled"
//                           ? selectedOrder.otherreasonforcancel || "Admin Cancelled"
//                           : selectedOrder.reasonforcancel === "other"
//                           ? selectedOrder.otherreasonforcancel
//                           : selectedOrder.reasonforcancel}
//                       </p>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//             <div className="border-t border-gray-200 px-4 md:px-6 py-3 md:py-4">
//               <button
//                 onClick={() => setShowOrderDetails(false)}
//                 className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition text-sm"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <style>{`
//         @keyframes slideIn {
//           from { transform: translateX(100%); opacity: 0; }
//           to { transform: translateX(0); opacity: 1; }
//         }
//         @keyframes fadeIn {
//           from { opacity: 0; transform: scale(0.95); }
//           to { opacity: 1; transform: scale(1); }
//         }
//         .animate-slideIn { animation: slideIn 0.3s ease-out; }
//         .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
//         .line-clamp-2 {
//           display: -webkit-box;
//           -webkit-line-clamp: 2;
//           -webkit-box-orient: vertical;
//           overflow: hidden;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default ManageOrders;

import React, { useEffect, useState } from "react";
import AdminSidebar from "../Admin_sidebar";
import AdminNavbar from "../Admin_navbar";
import {
  FaSearch,
  FaFilter,
  FaEye,
  FaPrint,
  FaDownload,
  FaCheckCircle,
  FaTimesCircle,
  FaShippingFast,
  FaBoxOpen,
  FaClock,
  FaUserCircle,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaCreditCard,
  FaWallet,
  FaTruck,
  FaRupeeSign,
  FaCopy,
  FaChevronLeft,
  FaChevronRight,
  FaSync,
  FaExclamationTriangle,
  FaArrowLeft,
  FaArrowRight,
  FaSpinner,
  FaMoneyBill,
  FaHandHoldingUsd
} from "react-icons/fa";
import { MdOutlineLocalShipping, MdPayment } from "react-icons/md";
import { HiOutlineRefresh } from "react-icons/hi";

const BASE_URL_AND_PORT = "https://api.static.ev.transev.site";
const API_KEY = "mlzuMoRFjdGhcFulLMaVtfwNAHycbBAf";

// ✅ FIX: Dynamic token and headers helper functions
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

const ORDER_STATUS_OPTIONS = [
  { value: "", label: "All Orders", icon: "📊", color: "gray" },
  { value: "Order Placed", label: "Order Placed", icon: "📦", color: "purple" },
  { value: "Accepted", label: "Accepted", icon: "✓", color: "orange" },
  { value: "Processing", label: "Processing", icon: "⚙️", color: "yellow" },
  { value: "Shipped", label: "Shipped", icon: "🚚", color: "blue" },
  { value: "Delivered", label: "Delivered", icon: "🏠", color: "green" },
];

const ManageOrders = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState({});
  const [selectedStatus, setSelectedStatus] = useState("");
  const [showCanceledOrders, setShowCanceledOrders] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [sortBy, setSortBy] = useState("newest");
  const [toast, setToast] = useState(null);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  // Cancel Modal
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [cancelOrderId, setCancelOrderId] = useState(null);
  const [cancelOtherReason, setCancelOtherReason] = useState("");

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

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

  // ✅ Check authentication on mount
  useEffect(() => {
    const checkAuth = () => {
      const token = getAuthToken();
      if (!token) {
        setError('Authentication required. Please login.');
        setLoading(false);
        setTimeout(() => {
          window.location.href = '/admin/login';
        }, 2000);
        return false;
      }
      return true;
    };

    checkAuth();
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Helper function to get display status (handles null/undefined and pending)
  const getDisplayStatus = (order) => {
    // Check for pending status first
    if (order.order_status === "pending" || order.order_status === "Pending") {
      return "Order Placed";
    }
    if (!order.order_status || order.order_status === "null" || order.order_status === "") {
      return "Order Placed";
    }
    return order.order_status;
  };

  // Check if order can be canceled (only Order Placed status)
  const canCancelOrder = (order) => {
    const displayStatus = getDisplayStatus(order);
    return displayStatus === "Order Placed";
  };

  const statusColor = (status) => {
    switch (status) {
      case "Accepted":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "Processing":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Shipped":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "Order Placed":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "canceled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const statusIcon = (status) => {
    switch (status) {
      case "Accepted": return <FaCheckCircle className="text-orange-500" />;
      case "Processing": return <FaSpinner className="text-yellow-500 animate-spin" />;
      case "Shipped": return <FaShippingFast className="text-blue-500" />;
      case "Delivered": return <FaBoxOpen className="text-green-500" />;
      case "Order Placed": return <FaClock className="text-purple-500" />;
      default: return <FaClock className="text-gray-500" />;
    }
  };

  // ✅ FIX: Fetch orders with dynamic token
  const fetchOrders = () => {
    // Check token first
    const token = getAuthToken();
    if (!token) {
      setError('Authentication required. Please login.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    console.log('Fetching orders with token:', token ? 'Token exists' : 'No token');

    fetch(`${BASE_URL_AND_PORT}/order/allorderdata`, {
      method: 'GET',
      headers: getHeaders()
    })
      .then((res) => {
        if (!res.ok) {
          if (res.status === 401) {
            // Token expired or invalid
            handleUnauthorized();
            throw new Error("Session expired. Please login again.");
          }
          throw new Error(`Failed to fetch orders: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        // Process orders using the refunds array from backend
        const processedOrders = data.map(order => {
          // Check if order has any successful refund
          const hasSuccessfulRefund = order.refunds && order.refunds.some(
            refund => refund.refund_status === "processed"
          );
          
          // Get the latest refund details
          const latestRefund = order.refunds && order.refunds.length > 0 
            ? order.refunds[order.refunds.length - 1] 
            : null;
          
          // Determine if order is canceled (status is 'canceled')
          const isCanceled = order.order_status?.toLowerCase() === "canceled";
          
          return {
            ...order,
            display_status: getDisplayStatus(order),
            is_canceled: isCanceled,
            is_refunded: hasSuccessfulRefund,
            refund_status: latestRefund?.refund_status || null,
            rzp_refund_id: latestRefund?.rzp_refund_id || null,
            refund_amount: latestRefund?.refund_amount_paise ? latestRefund.refund_amount_paise / 100 : null,
            refunds: order.refunds || []
          };
        });
        
        const sorted = processedOrders.sort(
          (a, b) => new Date(b.purchase_time) - new Date(a.purchase_time)
        );
        setOrders(sorted);
        setFilteredOrders(sorted);
        showToast(`Loaded ${sorted.length} orders successfully`, "success");
      })
      .catch((err) => {
        console.error('Error fetching orders:', err);
        setError(err.message || "Error fetching orders. Please try again.");
        showToast(err.message || "Error fetching orders. Please try again.", "error");
      })
      .finally(() => setLoading(false));
  };

  // ✅ Handle unauthorized access
  const handleUnauthorized = () => {
    setError('Session expired. Please login again.');
    localStorage.removeItem('auth_token');
    setTimeout(() => {
      window.location.href = '/admin/login';
    }, 2000);
  };

  // ✅ Initial fetch with retry mechanism
  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      fetchOrders();
    }
  }, [retryCount]);

  // Apply filters
  useEffect(() => {
    let filtered = [...orders];

    if (showCanceledOrders) {
      filtered = filtered.filter((order) => order.order_status?.toLowerCase() === "canceled");
    } else {
      if (selectedStatus) {
        filtered = filtered.filter(
          (order) => getDisplayStatus(order) === selectedStatus
        );
      }
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.order_id?.toString().includes(searchTerm) ||
          order.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.product_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (dateRange.start) {
      filtered = filtered.filter(
        (order) => new Date(order.purchase_time) >= new Date(dateRange.start)
      );
    }
    if (dateRange.end) {
      filtered = filtered.filter(
        (order) => new Date(order.purchase_time) <= new Date(dateRange.end)
      );
    }

    if (sortBy === "newest") {
      filtered.sort((a, b) => new Date(b.purchase_time) - new Date(a.purchase_time));
    } else if (sortBy === "oldest") {
      filtered.sort((a, b) => new Date(a.purchase_time) - new Date(b.purchase_time));
    } else if (sortBy === "amount_high") {
      filtered.sort((a, b) => (b.total_amount || 0) - (a.total_amount || 0));
    } else if (sortBy === "amount_low") {
      filtered.sort((a, b) => (a.total_amount || 0) - (b.total_amount || 0));
    }

    setFilteredOrders(filtered);
    setCurrentPage(1);
  }, [selectedStatus, searchTerm, dateRange, sortBy, orders, showCanceledOrders]);

  // Update order status
  const handleStatusChange = async (order_id, newStatus) => {
    if (!newStatus) return;
    
    // Check token
    const token = getAuthToken();
    if (!token) {
      showToast("Session expired. Please login again.", "error");
      return;
    }

    setUpdating((prev) => ({ ...prev, [order_id]: true }));

    try {
      const response = await fetch(`${BASE_URL_AND_PORT}/order/statusupdate`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ orderid: order_id, orderstatus: newStatus }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          handleUnauthorized();
          throw new Error("Session expired. Please login again.");
        }
        throw new Error("Failed to update order status");
      }

      setOrders((prev) =>
        prev.map((order) =>
          order.order_id === order_id
            ? { ...order, order_status: newStatus, display_status: getDisplayStatus({ ...order, order_status: newStatus }) }
            : order
        )
      );

      showToast("Order status updated successfully!", "success");
    } catch (err) {
      console.error(err);
      showToast(err.message || "Error updating order status", "error");
    } finally {
      setUpdating((prev) => ({ ...prev, [order_id]: false }));
    }
  };

  // Open cancel modal
  const openCancelModal = (orderId) => {
    const token = getAuthToken();
    if (!token) {
      showToast("Session expired. Please login again.", "error");
      return;
    }
    setCancelOrderId(orderId);
    setCancelOtherReason("");
    setCancelModalVisible(true);
  };

  // Admin Cancel Order
  const handleCancelOrder = async () => {
    const orderId = cancelOrderId;
    if (!orderId) return;

    // Check token
    const token = getAuthToken();
    if (!token) {
      showToast("Session expired. Please login again.", "error");
      setCancelModalVisible(false);
      return;
    }

    const order = orders.find((o) => o.order_id === orderId);
    
    // Check if order can be canceled (display_status should be "Order Placed")
    if (!canCancelOrder(order)) {
      showToast("You can only cancel orders that are in 'Order Placed' status.", "error");
      setCancelModalVisible(false);
      return;
    }

    setUpdating((prev) => ({ ...prev, [orderId]: true }));

    try {
      const res = await fetch(`${BASE_URL_AND_PORT}/order/cancelorder`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          order_id: orderId,
          reasonforcancel: "Admin Cancelled",
          otherreasonforcancel: cancelOtherReason || "",
        }),
      });

      if (!res.ok) {
        if (res.status === 401) {
          handleUnauthorized();
          throw new Error("Session expired. Please login again.");
        }
        throw new Error("Failed to cancel order");
      }

      setOrders((prev) =>
        prev.map((o) =>
          o.order_id === orderId
            ? {
                ...o,
                order_status: "canceled",
                display_status: "canceled",
                is_canceled: true,
                reasonforcancel: "Admin Cancelled",
                otherreasonforcancel: cancelOtherReason || "",
                refund_status: null,
                is_refunded: false,
                refunds: []
              }
            : o
        )
      );

      showToast("Order successfully canceled by admin. You can now process refund.", "success");
    } catch (err) {
      console.error(err);
      showToast(err.message || "Error canceling order. Please try again.", "error");
    } finally {
      setUpdating((prev) => ({ ...prev, [orderId]: false }));
      setCancelModalVisible(false);
    }
  };

  // Refund for canceled orders
  const handleRefund = async (order) => {
    // Check token
    const token = getAuthToken();
    if (!token) {
      showToast("Session expired. Please login again.", "error");
      return;
    }

    if (!window.confirm("Are you sure you want to initiate refund for this canceled order?")) return;

    // Check if payment_id exists
    if (!order.rzp_payment_id || order.rzp_payment_id === "default_id") {
      showToast("❌ Cannot process refund: Valid Payment ID not found for this order.", "error");
      return;
    }

    setUpdating((prev) => ({ ...prev, [order.order_id]: true }));

    try {
      const response = await fetch(`${BASE_URL_AND_PORT}/razorpay-refunds/initiate`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          order_id: order.order_id,
          refund_amount_paise: order.total_amount * 100,
          rzp_payment_id: order.rzp_payment_id,
          rzp_order_id: order.rzp_order_id,
          reason: `Order canceled - ${order.reasonforcancel || "Customer request"}`,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        if (response.status === 401) {
          handleUnauthorized();
          throw new Error("Session expired. Please login again.");
        }
        throw new Error(data.message || "Refund failed");
      }

      showToast(`✅ Refund initiated! Status: ${data.refund_status}`, "success");

      // Refresh orders to get updated refund status
      setTimeout(() => fetchOrders(), 2000);
    } catch (err) {
      console.error(err);
      showToast(err.message || "❌ Refund initiation failed.", "error");
    } finally {
      setUpdating((prev) => ({ ...prev, [order.order_id]: false }));
    }
  };

  // Copy to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showToast("Copied to clipboard!", "success");
  };

  // Export orders to CSV
  const exportToCSV = () => {
    const headers = ["Order ID", "Customer", "Email", "Product", "Quantity", "Total", "Status", "Date", "Refund Status"];
    const csvData = filteredOrders.map(order => [
      order.order_id,
      order.user_name,
      order.user_email,
      `${order.product_name} (${order.product_model})`,
      order.quantity_ordered,
      order.total_amount,
      getDisplayStatus(order),
      new Date(order.purchase_time).toLocaleString(),
      order.is_refunded ? "Refunded" : "Not Refunded"
    ]);
    
    const csvContent = [headers, ...csvData].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Orders exported successfully!", "success");
  };

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Order statistics
  const stats = {
    total: orders.length,
    placed: orders.filter(o => getDisplayStatus(o) === "Order Placed").length,
    accepted: orders.filter(o => o.order_status === "Accepted").length,
    processing: orders.filter(o => o.order_status === "Processing").length,
    shipped: orders.filter(o => o.order_status === "Shipped").length,
    delivered: orders.filter(o => o.order_status === "Delivered").length,
    canceled: orders.filter(o => o.order_status?.toLowerCase() === "canceled").length,
    refunded: orders.filter(o => o.is_refunded === true).length,
    totalRevenue: orders
      .filter(o => o.order_status?.toLowerCase() !== "canceled")
      .reduce((sum, o) => sum + (parseFloat(o.total_amount) || 0), 0),
  };

  // ✅ Refresh handler
  const handleRefresh = () => {
    setRetryCount(prev => prev + 1);
    setError(null);
  };

  // ✅ Error state with retry
  if (error && !loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <AdminNavbar onToggleSidebar={toggleSidebar} />
        <div className="flex flex-1 relative">
          <AdminSidebar isVisible={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <main className={`flex-1 transition-all duration-300 ease-in-out w-full min-h-screen ${sidebarOpen ? 'lg:ml-72' : 'lg:ml-24'} ${isMobile && sidebarOpen ? 'overflow-hidden' : ''}`}>
            <div className="p-4 md:p-6 lg:p-8">
              <div className="max-w-full mx-auto">
                <div className="bg-white rounded-xl p-8 max-w-md mx-auto shadow-lg border border-red-100">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FaExclamationTriangle className="w-8 h-8 text-red-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Something went wrong</h3>
                    <p className="text-gray-600 text-sm mb-4">{error}</p>
                    <div className="flex gap-3 justify-center flex-wrap">
                      <button 
                        onClick={handleRefresh}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm flex items-center gap-2"
                      >
                        <FaSync className="w-4 h-4" />
                        Retry
                      </button>
                      <button 
                        onClick={() => window.location.href = '/admin/login'}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm"
                      >
                        Go to Login
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-20 right-4 z-50 animate-slideIn ${
          toast.type === "success" ? "bg-green-500" : "bg-red-500"
        } text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2`}>
          {toast.type === "success" ? "✓" : "✗"} {toast.message}
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
                <h1 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Manage Orders
                </h1>
                <p className="text-gray-500 text-sm md:text-base mt-1">View and manage all customer orders</p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-9 gap-3 md:gap-4 mb-6 md:mb-8">
                <div className="bg-white rounded-xl p-3 md:p-4 shadow-sm border border-gray-100 hover:shadow-md transition">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">Total Orders</p>
                      <p className="text-xl md:text-2xl font-bold text-gray-800">{stats.total}</p>
                    </div>
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                      <FaBoxOpen className="text-indigo-600 text-sm md:text-base" />
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-3 md:p-4 shadow-sm border border-gray-100 hover:shadow-md transition">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">Order Placed</p>
                      <p className="text-xl md:text-2xl font-bold text-purple-600">{stats.placed}</p>
                    </div>
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <FaClock className="text-purple-600 text-sm md:text-base" />
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-3 md:p-4 shadow-sm border border-gray-100 hover:shadow-md transition">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">Accepted</p>
                      <p className="text-xl md:text-2xl font-bold text-orange-600">{stats.accepted}</p>
                    </div>
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <FaCheckCircle className="text-orange-600 text-sm md:text-base" />
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-3 md:p-4 shadow-sm border border-gray-100 hover:shadow-md transition">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">Processing</p>
                      <p className="text-xl md:text-2xl font-bold text-yellow-600">{stats.processing}</p>
                    </div>
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                      <FaSpinner className="text-yellow-600 animate-spin text-sm md:text-base" />
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-3 md:p-4 shadow-sm border border-gray-100 hover:shadow-md transition">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">Shipped</p>
                      <p className="text-xl md:text-2xl font-bold text-blue-600">{stats.shipped}</p>
                    </div>
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <FaTruck className="text-blue-600 text-sm md:text-base" />
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-3 md:p-4 shadow-sm border border-gray-100 hover:shadow-md transition">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">Delivered</p>
                      <p className="text-xl md:text-2xl font-bold text-green-600">{stats.delivered}</p>
                    </div>
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <FaCheckCircle className="text-green-600 text-sm md:text-base" />
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-3 md:p-4 shadow-sm border border-gray-100 hover:shadow-md transition">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">Canceled</p>
                      <p className="text-xl md:text-2xl font-bold text-red-600">{stats.canceled}</p>
                    </div>
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-red-100 rounded-full flex items-center justify-center">
                      <FaTimesCircle className="text-red-600 text-sm md:text-base" />
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-3 md:p-4 shadow-sm border border-gray-100 hover:shadow-md transition">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">Refunded</p>
                      <p className="text-xl md:text-2xl font-bold text-blue-600">{stats.refunded}</p>
                    </div>
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <FaMoneyBill className="text-blue-600 text-sm md:text-base" />
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl p-3 md:p-4 shadow-sm hover:shadow-md transition text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-white/80">Total Revenue</p>
                      <p className="text-base md:text-xl font-bold">₹{stats.totalRevenue.toLocaleString("en-IN")}</p>
                    </div>
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <FaRupeeSign className="text-white text-sm md:text-lg" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Filters Bar */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 md:p-4 mb-6">
                <div className="flex flex-col sm:flex-row flex-wrap gap-3">
                  <div className="flex-1 min-w-[200px] relative">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder={showCanceledOrders ? "Search canceled orders..." : "Search orders..."}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                    />
                  </div>

                  {!showCanceledOrders && (
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm min-w-[140px]"
                    >
                      {ORDER_STATUS_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.icon} {opt.label}
                        </option>
                      ))}
                    </select>
                  )}

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm min-w-[140px]"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="amount_high">Highest Amount</option>
                    <option value="amount_low">Lowest Amount</option>
                  </select>

                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={dateRange.start}
                      onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                      className="px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm w-[120px]"
                    />
                    <input
                      type="date"
                      value={dateRange.end}
                      onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                      className="px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm w-[120px]"
                    />
                  </div>

                  <button
                    onClick={exportToCSV}
                    className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2 transition text-sm"
                  >
                    <FaDownload size={12} />
                    Export
                  </button>

                  <button
                    onClick={handleRefresh}
                    className="px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg flex items-center gap-2 transition text-sm"
                  >
                    <HiOutlineRefresh size={12} />
                    Refresh
                  </button>
                </div>
              </div>

              {/* Toggle Buttons */}
              <div className="mb-6 flex justify-center sm:justify-end gap-3">
                <button
                  onClick={() => {
                    setShowCanceledOrders(false);
                    setSelectedStatus("");
                  }}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 transition text-sm font-medium ${
                    !showCanceledOrders
                      ? "bg-indigo-600 text-white shadow-md"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  <FaBoxOpen size={14} />
                  All Orders
                </button>
                <button
                  onClick={() => {
                    setShowCanceledOrders(true);
                    setSelectedStatus("");
                  }}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 transition text-sm font-medium ${
                    showCanceledOrders
                      ? "bg-red-600 text-white shadow-md"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  <FaTimesCircle size={14} />
                  Canceled Orders ({stats.canceled})
                </button>
              </div>

              {/* Orders Grid */}
              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
                </div>
              ) : paginatedOrders.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl">
                  <div className="text-6xl mb-4">{showCanceledOrders ? "❌" : "📦"}</div>
                  <p className="text-gray-500 text-lg">
                    {showCanceledOrders 
                      ? "No canceled orders found" 
                      : "No orders found"}
                  </p>
                </div>
              ) : (
                <>
                  {/* Mobile View */}
                  <div className="block md:hidden space-y-4">
                    {paginatedOrders.map((order) => {
                      const displayStatus = getDisplayStatus(order);
                      const canCancel = canCancelOrder(order);
                      const isRefunded = order.is_refunded === true;
                      const showRefundButton = showCanceledOrders && order.is_canceled === true && !isRefunded;
                      const showRefundDoneButton = showCanceledOrders && order.is_canceled === true && isRefunded;

                      return (
                        <div key={order.order_id} className="bg-white rounded-xl shadow-lg p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-lg">{statusIcon(displayStatus)}</span>
                                <span className="font-semibold text-gray-700">#{order.order_id.slice(-8)}</span>
                              </div>
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor(displayStatus)}`}>
                                {displayStatus}
                              </span>
                            </div>
                            <button
                              onClick={() => copyToClipboard(order.order_id.toString())}
                              className="text-gray-400 hover:text-indigo-600"
                            >
                              <FaCopy size={14} />
                            </button>
                          </div>

                          <div className="space-y-2 mb-3">
                            <div className="flex items-center gap-2">
                              <FaUserCircle className="text-indigo-600" />
                              <div>
                                <p className="font-medium text-sm">{order.user_name}</p>
                                <p className="text-xs text-gray-500">{order.user_email}</p>
                              </div>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">Qty: {order.quantity_ordered}</span>
                              <span className="font-bold text-indigo-600">₹{parseFloat(order.total_amount).toLocaleString() || 0}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <FaCalendarAlt size={10} />
                              {new Date(order.purchase_time).toLocaleDateString("en-IN")}
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setSelectedOrder(order);
                                setShowOrderDetails(true);
                              }}
                              className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold"
                            >
                              View Details
                            </button>
                            {showRefundButton && (
                              <button
                                onClick={() => handleRefund(order)}
                                disabled={updating[order.order_id]}
                                className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2"
                              >
                                {updating[order.order_id] ? <FaSpinner className="animate-spin" size={14} /> : <FaHandHoldingUsd size={14} />}
                                Refund
                              </button>
                            )}
                            {showRefundDoneButton && (
                              <button
                                disabled={true}
                                className="flex-1 py-2 bg-blue-500 text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2 cursor-not-allowed opacity-80"
                              >
                                <FaCheckCircle size={14} />
                                Refund Done
                              </button>
                            )}
                            {canCancel && !showCanceledOrders && (
                              <button
                                onClick={() => openCancelModal(order.order_id)}
                                className="py-2 px-3 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm"
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                          {order.is_refunded && order.rzp_refund_id && (
                            <div className="mt-2 text-xs text-gray-400 text-center">
                              Refund ID: {order.rzp_refund_id.slice(-8)}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Desktop View */}
                  <div className="hidden md:grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {paginatedOrders.map((order) => {
                      const displayStatus = getDisplayStatus(order);
                      const canCancel = canCancelOrder(order);
                      const isRefunded = order.is_refunded === true;
                      const showRefundButton = showCanceledOrders && order.is_canceled === true && !isRefunded;
                      const showRefundDoneButton = showCanceledOrders && order.is_canceled === true && isRefunded;

                      return (
                        <div
                          key={order.order_id}
                          className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:-translate-y-1"
                        >
                          <div className={`px-5 py-4 border-b ${
                            showCanceledOrders 
                              ? "bg-gradient-to-r from-red-50 to-red-100 border-red-200" 
                              : "bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200"
                          }`}>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-lg">{statusIcon(displayStatus)}</span>
                                <span className="font-semibold text-gray-700">Order #{order.order_id.slice(-8)}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                {order.is_refunded && order.rzp_refund_id && (
                                  <span className="text-[10px] text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                                    Refunded
                                  </span>
                                )}
                                <button
                                  onClick={() => copyToClipboard(order.order_id.toString())}
                                  className="text-gray-400 hover:text-indigo-600 transition"
                                >
                                  <FaCopy size={14} />
                                </button>
                              </div>
                            </div>
                            <div className="flex items-center justify-between mt-2">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor(displayStatus)}`}>
                                {displayStatus}
                              </span>
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <FaCalendarAlt size={10} />
                                {new Date(order.purchase_time).toLocaleDateString("en-IN", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </div>
                            </div>
                          </div>

                          <div className="p-5">
                            <div className="flex items-start gap-3 mb-4">
                              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <FaUserCircle className="text-indigo-600 text-xl" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-gray-800 truncate">{order.user_name}</p>
                                <p className="text-xs text-gray-500 truncate">{order.user_email}</p>
                                <div className="flex items-center gap-1 mt-1">
                                  <FaPhoneAlt size={10} className="text-gray-400" />
                                  <p className="text-xs text-gray-500">{order.user_phonenumber}</p>
                                </div>
                              </div>
                            </div>

                            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                              <p className="font-medium text-gray-800 text-sm">{order.product_name}</p>
                              <p className="text-xs text-gray-500">Model: {order.product_model}</p>
                              <div className="flex justify-between items-center mt-2">
                                <span className="text-xs text-gray-500">Qty: {order.quantity_ordered}</span>
                                <span className="font-bold text-indigo-600">₹{parseFloat(order.total_amount).toLocaleString() || 0}</span>
                              </div>
                            </div>

                            <div className="space-y-2 mb-4">
                              <div className="flex items-center gap-2 text-xs text-gray-600">
                                <MdPayment size={14} />
                                <span>Payment: {order.payment_option || "N/A"}</span>
                              </div>
                              <div className="flex items-start gap-2 text-xs text-gray-600">
                                <FaMapMarkerAlt size={12} className="mt-0.5" />
                                <span className="line-clamp-2">{order.deliveryaddress || order.address || "Address not provided"}</span>
                              </div>
                            </div>

                            {!showCanceledOrders && displayStatus !== "canceled" && displayStatus !== "Delivered" && (
                              <div className="mb-3">
                                <select
                                  value={order.order_status === "null" || !order.order_status || order.order_status === "pending" ? "Order Placed" : order.order_status}
                                  onChange={(e) => {
                                    let statusValue = e.target.value;
                                    if (statusValue === "Order Placed") statusValue = "null";
                                    handleStatusChange(order.order_id, statusValue);
                                  }}
                                  disabled={updating[order.order_id]}
                                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                  <option value="Order Placed">📦 Order Placed</option>
                                  <option value="Accepted">✓ Accepted</option>
                                  <option value="Processing">⚙️ Processing</option>
                                  <option value="Shipped">🚚 Shipped</option>
                                  <option value="Delivered">🏠 Delivered</option>
                                </select>
                              </div>
                            )}

                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setSelectedOrder(order);
                                  setShowOrderDetails(true);
                                }}
                                className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition"
                              >
                                <FaEye size={12} />
                                View Details
                              </button>

                              {showRefundButton && (
                                <button
                                  onClick={() => handleRefund(order)}
                                  disabled={updating[order.order_id]}
                                  className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition disabled:opacity-50"
                                >
                                  {updating[order.order_id] ? <FaSpinner className="animate-spin" /> : <FaHandHoldingUsd size={14} />}
                                  Refund
                                </button>
                              )}

                              {showRefundDoneButton && (
                                <button
                                  disabled={true}
                                  className="flex-1 py-2 bg-blue-500 text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2 cursor-not-allowed opacity-80"
                                >
                                  <FaCheckCircle size={14} />
                                  Refund Done
                                </button>
                              )}

                              {canCancel && !showCanceledOrders && (
                                <button
                                  onClick={() => openCancelModal(order.order_id)}
                                  disabled={updating[order.order_id]}
                                  className="py-2 px-3 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold transition disabled:opacity-50"
                                >
                                  Cancel
                                </button>
                              )}
                            </div>

                            {/* Show refund details if already refunded */}
                            {order.is_refunded === true && (
                              <div className="mt-3 p-2 bg-blue-50 rounded-lg border border-blue-200">
                                <p className="text-xs text-blue-700 font-medium flex items-center justify-center gap-1">
                                  <FaCheckCircle size={12} />
                                  Refund Completed Successfully
                                </p>
                                {order.rzp_refund_id && (
                                  <p className="text-[10px] text-blue-500 text-center mt-1">
                                    Refund ID: {order.rzp_refund_id}
                                  </p>
                                )}
                                {order.refund_amount && (
                                  <p className="text-[10px] text-blue-500 text-center">
                                    Amount: ₹{order.refund_amount.toLocaleString()}
                                  </p>
                                )}
                              </div>
                            )}

                            {order.reasonforcancel && !order.is_refunded && (
                              <div className="mt-3 p-2 bg-red-50 rounded-lg border border-red-100">
                                <p className="text-xs text-red-700">
                                  <strong>Cancel Reason:</strong>{" "}
                                  {order.reasonforcancel === "Admin Cancelled"
                                    ? order.otherreasonforcancel || "Admin Cancelled"
                                    : order.reasonforcancel === "other"
                                    ? order.otherreasonforcancel
                                    : order.reasonforcancel}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}

              {/* Pagination */}
              {!loading && filteredOrders.length > 0 && (
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8">
                  <div className="text-xs sm:text-sm text-gray-500">
                    Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredOrders.length)} of {filteredOrders.length} orders
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm"
                    >
                      <FaChevronLeft size={12} />
                    </button>
                    <span className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-sm">
                      {currentPage}
                    </span>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm"
                    >
                      <FaChevronRight size={12} />
                    </button>
                  </div>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => setItemsPerPage(Number(e.target.value))}
                    className="px-2 py-1.5 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value={6}>6 / page</option>
                    <option value={9}>9 / page</option>
                    <option value={12}>12 / page</option>
                    <option value={24}>24 / page</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Cancel Reason Modal */}
      {cancelModalVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto animate-fadeIn">
            <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-t-2xl px-4 md:px-6 py-3 md:py-4">
              <h2 className="text-lg md:text-xl font-bold text-white">Cancel Order</h2>
            </div>
            <div className="p-4 md:p-6">
              <p className="text-sm md:text-base text-gray-600 mb-4">Please provide a reason for cancellation:</p>
              <textarea
                placeholder="Enter cancellation reason..."
                value={cancelOtherReason}
                onChange={(e) => setCancelOtherReason(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
              />
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setCancelModalVisible(false)}
                  className="flex-1 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCancelOrder}
                  className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition text-sm"
                >
                  Confirm Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-auto my-8 animate-fadeIn">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-t-2xl px-4 md:px-6 py-3 md:py-4 flex justify-between items-center">
              <h2 className="text-lg md:text-xl font-bold text-white">Order Details</h2>
              <button
                onClick={() => setShowOrderDetails(false)}
                className="text-white/80 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="p-4 md:p-6 max-h-[70vh] overflow-y-auto">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Order ID</p>
                    <p className="font-semibold text-sm">{selectedOrder.order_id}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Status</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor(getDisplayStatus(selectedOrder))}`}>
                      {getDisplayStatus(selectedOrder)}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Customer Information</p>
                  <div className="bg-gray-50 rounded-lg p-3 mt-1">
                    <p className="font-medium text-sm">{selectedOrder.user_name}</p>
                    <p className="text-xs text-gray-600">{selectedOrder.user_email}</p>
                    <p className="text-xs text-gray-600">{selectedOrder.user_phonenumber}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Delivery Address</p>
                  <div className="bg-gray-50 rounded-lg p-3 mt-1">
                    <p className="text-xs md:text-sm">{selectedOrder.deliveryaddress || selectedOrder.address || "Address not provided"}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Product Details</p>
                  <div className="bg-gray-50 rounded-lg p-3 mt-1">
                    <p className="font-medium text-sm">{selectedOrder.product_name}</p>
                    <p className="text-xs text-gray-600">Model: {selectedOrder.product_model}</p>
                    <p className="text-xs">Quantity: {selectedOrder.quantity_ordered}</p>
                    <p className="text-base md:text-lg font-bold text-indigo-600 mt-2">₹{parseFloat(selectedOrder.total_amount).toLocaleString() || 0}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Payment Method</p>
                    <p className="font-medium text-sm">{selectedOrder.payment_option || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Payment ID</p>
                    <p className="text-xs font-mono text-gray-600">{selectedOrder.rzp_payment_id || "N/A"}</p>
                  </div>
                </div>

                {selectedOrder.rzp_order_id && selectedOrder.rzp_order_id !== "default_id" && (
                  <div>
                    <p className="text-xs text-gray-500">Razorpay Order ID</p>
                    <p className="text-xs font-mono text-gray-600">{selectedOrder.rzp_order_id}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Order Date</p>
                    <p className="font-medium text-sm">
                      {new Date(selectedOrder.purchase_time).toLocaleString("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>
                  {selectedOrder.is_refunded === true && (
                    <div>
                      <p className="text-xs text-gray-500">Refund Status</p>
                      <p className="text-sm text-green-600 font-medium">Completed</p>
                    </div>
                  )}
                </div>

                {/* Refund Status in Modal */}
                {selectedOrder.is_refunded === true && (
                  <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                    <p className="text-sm text-blue-700 font-medium flex items-center gap-2">
                      <FaCheckCircle size={14} />
                      Refund Status: Completed
                    </p>
                    {selectedOrder.rzp_refund_id && (
                      <p className="text-xs text-blue-600 mt-1">Refund ID: {selectedOrder.rzp_refund_id}</p>
                    )}
                    {selectedOrder.refund_amount && (
                      <p className="text-xs text-blue-600 mt-1">Refund Amount: ₹{selectedOrder.refund_amount.toLocaleString()}</p>
                    )}
                  </div>
                )}

                {selectedOrder.reasonforcancel && !selectedOrder.is_refunded && (
                  <div>
                    <p className="text-xs text-gray-500">Cancellation Reason</p>
                    <div className="bg-red-50 rounded-lg p-3 mt-1 border border-red-100">
                      <p className="text-xs md:text-sm text-red-700">
                        {selectedOrder.reasonforcancel === "Admin Cancelled"
                          ? selectedOrder.otherreasonforcancel || "Admin Cancelled"
                          : selectedOrder.reasonforcancel === "other"
                          ? selectedOrder.otherreasonforcancel
                          : selectedOrder.reasonforcancel}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="border-t border-gray-200 px-4 md:px-6 py-3 md:py-4">
              <button
                onClick={() => setShowOrderDetails(false)}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-slideIn { animation: slideIn 0.3s ease-out; }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default ManageOrders;