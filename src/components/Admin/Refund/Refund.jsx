import React, { useEffect, useState } from "react";
import AdminSidebar from "../Admin_sidebar";
import AdminNavbar from "../Admin_navbar";
import { 
  FaSearch, 
  FaFilter, 
  FaEye, 
  FaDownload, 
  FaSync, 
  FaTimesCircle, 
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaRupeeSign,
  FaCopy,
  FaChevronLeft,
  FaChevronRight,
  FaSpinner,
  FaUserCircle,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaCreditCard,
  FaInfoCircle
} from "react-icons/fa";
import { MdPayment, MdRefresh } from "react-icons/md";
import { HiOutlineRefresh } from "react-icons/hi";

const BASE_URL_AND_PORT = "https://api.static.ev.transev.site";
const API_KEY = "mlzuMoRFjdGhcFulLMaVtfwNAHycbBAf";
const REFUND_BASE = `${BASE_URL_AND_PORT}/razorpay-refunds`;

const AdminRefunds = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [refundMap, setRefundMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [toast, setToast] = useState(null);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
 const authToken = localStorage.getItem('auth_token');
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

  // Show toast notification
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Copy to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showToast("Copied to clipboard!", "success");
  };

  /* ---------------- FETCH CANCELED ORDERS ---------------- */
  useEffect(() => {
    const fetchOrdersAndRefunds = async () => {
      try {
        const res = await fetch(`${BASE_URL_AND_PORT}/order/allorderdata`, {
          headers: { "API-Key": API_KEY ,
              'Authorization': `Bearer ${authToken}`
          },
        });
        const data = await res.json();

        const canceledOrders = data.filter(
          (o) => o.order_status?.toLowerCase() === "canceled"
        );

        setOrders(canceledOrders);
        setFilteredOrders(canceledOrders);

        // Fetch refund details for each order
        for (const order of canceledOrders) {
          await fetchRefundDetails(order.order_id);
        }
      } catch (err) {
        console.error(err);
        showToast("Failed to load refund data", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchOrdersAndRefunds();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...orders];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.order_id?.toString().includes(searchTerm) ||
          order.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.product_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Refund status filter
    if (selectedStatus !== "all") {
      filtered = filtered.filter((order) => {
        const refund = refundMap[order.order_id];
        if (selectedStatus === "pending") return refund?.refund_status === "pending";
        if (selectedStatus === "processed") return refund?.refund_status === "processed";
        if (selectedStatus === "failed") return refund?.refund_status === "failed";
        if (selectedStatus === "no_refund") return !refund;
        return true;
      });
    }

    // Date range filter
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

    setFilteredOrders(filtered);
    setCurrentPage(1);
  }, [searchTerm, selectedStatus, dateRange, orders, refundMap]);

  /* ---------------- REFUND HELPERS ---------------- */
  const getRefundIdsByOrderId = async (orderId) => {
    const res = await fetch(`${REFUND_BASE}/get-all-refund-ids`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "API-Key": API_KEY,
          'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({ order_ids: [orderId] }),
    });
    return res.json();
  };

  const getRefundDetailsByRzpId = async (rzpRefundId) => {
    const res = await fetch(`${REFUND_BASE}/get-refund-details`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "API-Key": API_KEY,
          'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({ razorpay_refund_id: rzpRefundId }),
    });
    return res.json();
  };

  const fetchRefundDetails = async (orderId) => {
    try {
      const ids = await getRefundIdsByOrderId(orderId);
      if (!ids.refund_ids?.length) return;

      const details = await getRefundDetailsByRzpId(ids.refund_ids[0]);

      setRefundMap((prev) => ({
        ...prev,
        [orderId]: details,
      }));
    } catch (err) {
      console.error("Refund fetch error:", err);
    }
  };

  // Refresh refund status for an order
  const refreshRefundStatus = async (orderId) => {
    await fetchRefundDetails(orderId);
    showToast("Refund status refreshed!", "success");
  };

  const getRefundStatusBadge = (status) => {
    const config = {
      created: { bg: "bg-gray-100", text: "text-gray-700", icon: <FaClock size={12} />, label: "Created" },
      pending: { bg: "bg-yellow-100", text: "text-yellow-700", icon: <FaSpinner className="animate-spin" size={12} />, label: "Pending" },
      processed: { bg: "bg-green-100", text: "text-green-700", icon: <FaCheckCircle size={12} />, label: "Processed" },
      failed: { bg: "bg-red-100", text: "text-red-700", icon: <FaTimesCircle size={12} />, label: "Failed" },
    };
    const style = config[status] || config.created;
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
        {style.icon}
        {style.label}
      </span>
    );
  };

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Statistics
  const stats = {
    total: orders.length,
    refunded: Object.values(refundMap).filter(r => r?.refund_status === "processed").length,
    pending: Object.values(refundMap).filter(r => r?.refund_status === "pending").length,
    failed: Object.values(refundMap).filter(r => r?.refund_status === "failed").length,
    totalRefundAmount: Object.values(refundMap).reduce((sum, r) => sum + (r?.refund_amount_paise / 100 || 0), 0),
  };

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
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h1 className="text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      Refund Management
                    </h1>
                    <p className="text-gray-500 text-sm md:text-base mt-1">
                      Track and manage customer refunds for canceled orders
                    </p>
                  </div>
                  <button 
                    onClick={() => window.location.reload()}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                  >
                    <HiOutlineRefresh size={16} />
                    Refresh
                  </button>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 mb-6 md:mb-8">
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">Canceled Orders</p>
                      <p className="text-xl md:text-2xl font-bold text-gray-800">{stats.total}</p>
                    </div>
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                      <FaTimesCircle className="text-red-600" size={18} />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">Refunded</p>
                      <p className="text-xl md:text-2xl font-bold text-green-600">{stats.refunded}</p>
                    </div>
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <FaCheckCircle className="text-green-600" size={18} />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">Pending</p>
                      <p className="text-xl md:text-2xl font-bold text-yellow-600">{stats.pending}</p>
                    </div>
                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                      <FaClock className="text-yellow-600" size={18} />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">Failed</p>
                      <p className="text-xl md:text-2xl font-bold text-red-600">{stats.failed}</p>
                    </div>
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                      <FaExclamationTriangle className="text-red-600" size={18} />
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-4 shadow-sm text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-white/80">Total Refunded</p>
                      <p className="text-lg md:text-xl font-bold">₹{stats.totalRefundAmount.toLocaleString()}</p>
                    </div>
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <FaRupeeSign className="text-white" size={18} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Filters Bar */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
                <div className="flex flex-col sm:flex-row flex-wrap gap-3">
                  <div className="flex-1 relative">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <input
                      type="text"
                      placeholder="Search by Order ID, Customer or Product..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending Refund</option>
                    <option value="processed">Refunded</option>
                    <option value="failed">Failed</option>
                    <option value="no_refund">No Refund Initiated</option>
                  </select>

                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={dateRange.start}
                      onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                      className="px-2 py-2 border border-gray-200 rounded-lg text-sm w-[120px] focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <input
                      type="date"
                      value={dateRange.end}
                      onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                      className="px-2 py-2 border border-gray-200 rounded-lg text-sm w-[120px] focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                {/* Active Filters Display */}
                {(searchTerm || selectedStatus !== "all" || dateRange.start || dateRange.end) && (
                  <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap items-center gap-2">
                    <span className="text-xs text-gray-500">Active filters:</span>
                    {searchTerm && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-50 text-purple-600 rounded-md text-xs">
                        Search: {searchTerm}
                        <button onClick={() => setSearchTerm("")} className="hover:text-purple-800">×</button>
                      </span>
                    )}
                    {selectedStatus !== "all" && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-50 text-purple-600 rounded-md text-xs">
                        Status: {selectedStatus}
                        <button onClick={() => setSelectedStatus("all")} className="hover:text-purple-800">×</button>
                      </span>
                    )}
                    <button
                      onClick={() => {
                        setSearchTerm("");
                        setSelectedStatus("all");
                        setDateRange({ start: "", end: "" });
                      }}
                      className="text-xs text-gray-400 hover:text-gray-600"
                    >
                      Clear all
                    </button>
                  </div>
                )}
              </div>

              {/* Loading State */}
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
                  <p className="text-gray-500">Loading refund data...</p>
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl">
                  <div className="text-6xl mb-4">💰</div>
                  <p className="text-gray-500 text-lg">No refund records found</p>
                  <p className="text-gray-400 text-sm mt-2">Canceled orders with refund information will appear here</p>
                </div>
              ) : (
                <>
                  {/* Refund Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {paginatedOrders.map((order) => {
                      const refund = refundMap[order.order_id];
                      const refundStatus = refund?.refund_status || "no_refund";
                      
                      return (
                        <div
                          key={order.order_id}
                          className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:-translate-y-1"
                        >
                          {/* Card Header */}
                          <div className={`px-5 py-4 border-b ${
                            refundStatus === "processed" ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200" :
                            refundStatus === "pending" ? "bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200" :
                            refundStatus === "failed" ? "bg-gradient-to-r from-red-50 to-rose-50 border-red-200" :
                            "bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200"
                          }`}>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <FaRupeeSign className="text-gray-500" size={14} />
                                <span className="font-semibold text-gray-700">Order #{order.order_id?.slice(-8)}</span>
                              </div>
                              <button
                                onClick={() => refreshRefundStatus(order.order_id)}
                                className="text-gray-400 hover:text-purple-600 transition"
                                title="Refresh refund status"
                              >
                                <MdRefresh size={16} />
                              </button>
                            </div>
                            <div className="flex items-center justify-between mt-2">
                              {getRefundStatusBadge(refundStatus)}
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <FaCalendarAlt size={10} />
                                {new Date(order.purchase_time).toLocaleDateString("en-IN")}
                              </div>
                            </div>
                          </div>

                          {/* Card Body */}
                          <div className="p-5">
                            {/* Product Info */}
                            <h3 className="font-semibold text-gray-800 text-base mb-1">{order.product_name}</h3>
                            <p className="text-xs text-gray-500 mb-3">Model: {order.product_model}</p>

                            {/* Order Details */}
                            <div className="space-y-2 mb-4">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Order Amount</span>
                                <span className="font-bold text-gray-800">₹{order.total_amount?.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Refund Amount</span>
                                <span className="font-bold text-purple-600">
                                  ₹{refund ? (refund.refund_amount_paise / 100).toLocaleString() : "0"}
                                </span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Payment Method</span>
                                <span className="text-gray-700">{order.payment_option || "N/A"}</span>
                              </div>
                            </div>

                            {/* Cancel Reason */}
                            <div className="mb-4 p-2 bg-red-50 rounded-lg border border-red-100">
                              <p className="text-xs text-red-700">
                                <strong>Cancel Reason:</strong>{" "}
                                {order.reasonforcancel === "Admin Cancelled"
                                  ? order.otherreasonforcancel || "Admin Cancelled"
                                  : order.reasonforcancel === "other"
                                  ? order.otherreasonforcancel
                                  : order.reasonforcancel}
                              </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setSelectedOrder(order);
                                  setShowOrderDetails(true);
                                }}
                                className="flex-1 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition"
                              >
                                <FaEye size={12} />
                                View Details
                              </button>
                              
                              {refund?.rzp_refund_id && (
                                <button
                                  onClick={() => copyToClipboard(refund.rzp_refund_id)}
                                  className="py-2 px-3 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg text-sm transition"
                                  title="Copy Refund ID"
                                >
                                  <FaCopy size={12} />
                                </button>
                              )}
                            </div>

                            {/* Refund Details (if available) */}
                            {refund && (
                              <div className="mt-3 pt-3 border-t border-gray-100">
                                <p className="text-[10px] text-gray-400 truncate">
                                  <strong>Refund ID:</strong> {refund.rzp_refund_id || "N/A"}
                                </p>
                                {refund.failure_reason && (
                                  <p className="text-[10px] text-red-500 mt-1">
                                    <strong>Failure:</strong> {refund.failure_reason}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Pagination */}
                  {filteredOrders.length > 0 && (
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8">
                      <div className="text-xs sm:text-sm text-gray-500">
                        Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredOrders.length)} of {filteredOrders.length} refunds
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                          className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm"
                        >
                          <FaChevronLeft size={12} />
                        </button>
                        <span className="px-3 py-1.5 bg-purple-600 text-white rounded-lg text-sm">
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
                </>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4 overflow-y-auto" onClick={() => setShowOrderDetails(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-auto my-8 animate-fadeIn" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-t-2xl px-4 md:px-6 py-3 md:py-4 flex justify-between items-center">
              <h2 className="text-lg md:text-xl font-bold text-white">Order & Refund Details</h2>
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
                    <p className="text-xs text-gray-500">Order Status</p>
                    <span className="inline-flex px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">Canceled</span>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Customer Information</p>
                  <div className="bg-gray-50 rounded-lg p-3 mt-1">
                    <p className="font-medium text-sm">{selectedOrder.user_name || "N/A"}</p>
                    <p className="text-xs text-gray-600">{selectedOrder.user_email}</p>
                    <p className="text-xs text-gray-600">{selectedOrder.user_phonenumber}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Product Details</p>
                  <div className="bg-gray-50 rounded-lg p-3 mt-1">
                    <p className="font-medium text-sm">{selectedOrder.product_name}</p>
                    <p className="text-xs text-gray-600">Model: {selectedOrder.product_model}</p>
                    <p className="text-xs">Quantity: {selectedOrder.quantity_ordered}</p>
                    <p className="text-base font-bold text-purple-600 mt-2">₹{selectedOrder.total_amount?.toLocaleString() || 0}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Refund Information</p>
                  <div className="bg-gray-50 rounded-lg p-3 mt-1">
                    {refundMap[selectedOrder.order_id] ? (
                      <>
                        <div className="grid grid-cols-2 gap-2 mb-2">
                          <p className="text-xs text-gray-500">Refund Status</p>
                          <p>{getRefundStatusBadge(refundMap[selectedOrder.order_id].refund_status)}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mb-2">
                          <p className="text-xs text-gray-500">Refund Amount</p>
                          <p className="font-semibold">₹{(refundMap[selectedOrder.order_id].refund_amount_paise / 100).toLocaleString()}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mb-2">
                          <p className="text-xs text-gray-500">Refund ID</p>
                          <p className="text-xs font-mono break-all">{refundMap[selectedOrder.order_id].rzp_refund_id}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <p className="text-xs text-gray-500">Created At</p>
                          <p className="text-xs">{new Date(refundMap[selectedOrder.order_id].created_at).toLocaleString()}</p>
                        </div>
                        {refundMap[selectedOrder.order_id].failure_reason && (
                          <div className="mt-2 p-2 bg-red-50 rounded">
                            <p className="text-xs text-red-600"><strong>Failure Reason:</strong> {refundMap[selectedOrder.order_id].failure_reason}</p>
                          </div>
                        )}
                      </>
                    ) : (
                      <p className="text-sm text-gray-500">No refund initiated for this order</p>
                    )}
                  </div>
                </div>

                {selectedOrder.reasonforcancel && (
                  <div>
                    <p className="text-xs text-gray-500">Cancellation Reason</p>
                    <div className="bg-red-50 rounded-lg p-3 mt-1 border border-red-100">
                      <p className="text-sm text-red-700">
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
                className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
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

export default AdminRefunds;