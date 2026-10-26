import React, { useState, useEffect } from 'react';
import AdminSidebar from '../Admin/Admin_sidebar';
import AdminNavbar from '../Admin/Admin_navbar';
import { 
  FaEnvelope, 
  FaPhoneAlt, 
  FaUser, 
  FaComment,
  FaSearch, 
  FaFilter,
  FaEye,
  FaReply,
  FaTrash,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaStar,
  FaChartLine,
  FaUsers,
  FaComments,
  FaCalendarAlt,
  FaDownload,
  FaSync,
  FaPrint,
  FaUserCircle,
  FaMailBulk,
  FaSpinner,
  FaExclamationTriangle
} from 'react-icons/fa';
import { HiOutlineRefresh } from 'react-icons/hi';
import { MdMarkEmailRead } from 'react-icons/md';

const API_KEY = 'mlzuMoRFjdGhcFulLMaVtfwNAHycbBAf';
const BASE_URL = 'https://api.static.ev.transev.site';

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

const AdminSupport = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedContact, setSelectedContact] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [sortBy, setSortBy] = useState('newest');
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [stats, setStats] = useState({
    total: 0,
    read: 0,
    unread: 0,
    responded: 0
  });

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

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    // If today
    if (date.toDateString() === now.toDateString()) {
      return `Today at ${date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      })}`;
    }
    
    // If yesterday
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday at ${date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      })}`;
    }

    // If within last 7 days
    if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago at ${date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      })}`;
    }

    // If within same year
    if (date.getFullYear() === now.getFullYear()) {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    }

    // Full date for older messages
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Get relative time string
  const getRelativeTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays}d ago`;
    } else {
      return formatDate(dateString);
    }
  };

  // ✅ Handle unauthorized access
  const handleUnauthorized = () => {
    setError('Session expired. Please login again.');
    localStorage.removeItem('auth_token');
    setTimeout(() => {
      window.location.href = '/admin/login';
    }, 2000);
  };

  // ✅ FIX: Fetch data with dynamic token
  const fetchData = async () => {
    // Check token first
    const token = getAuthToken();
    if (!token) {
      setError('Authentication required. Please login.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    console.log('Fetching contacts with token:', token ? 'Token exists' : 'No token');

    try {
      const contactRes = await fetch(`${BASE_URL}/contact/getallcontacts`, {
        method: 'GET',
        headers: getHeaders()
      });

      if (!contactRes.ok) {
        if (contactRes.status === 401) {
          handleUnauthorized();
          throw new Error('Session expired. Please login again.');
        }
        throw new Error(`Failed to fetch contacts: ${contactRes.status}`);
      }

      const contactData = await contactRes.json();
      const contactsList = contactData?.contacts || contactData?.data || [];
      
      // Add status to each contact (mock status for demo)
      const contactsWithStatus = contactsList.map((contact, index) => ({
        ...contact,
        status: index % 3 === 0 ? 'read' : index % 3 === 1 ? 'unread' : 'responded',
        readAt: index % 2 === 0 ? new Date().toISOString() : null,
        respondedAt: index % 4 === 0 ? new Date().toISOString() : null
      }));
      
      setContacts(contactsWithStatus);
      setFilteredContacts(contactsWithStatus);
      
      // Calculate stats
      setStats({
        total: contactsWithStatus.length,
        read: contactsWithStatus.filter(c => c.status === 'read').length,
        unread: contactsWithStatus.filter(c => c.status === 'unread').length,
        responded: contactsWithStatus.filter(c => c.status === 'responded').length
      });

      showToast(`Loaded ${contactsWithStatus.length} messages successfully`, 'success');
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message || 'Error fetching contact data');
      showToast(err.message || 'Error fetching contact data', 'error');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Initial fetch with retry mechanism
  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      fetchData();
    }
  }, [retryCount]);

  // Apply filters
  useEffect(() => {
    let filtered = [...contacts];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(contact =>
        contact.firstname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.lastname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.telephone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.message?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(contact => contact.status === selectedStatus);
    }

    // Date range filter
    if (dateRange.start) {
      filtered = filtered.filter(contact => 
        new Date(contact.contacted_at || contact.created_at || contact.submitted_at) >= new Date(dateRange.start)
      );
    }
    if (dateRange.end) {
      filtered = filtered.filter(contact => 
        new Date(contact.contacted_at || contact.created_at || contact.submitted_at) <= new Date(dateRange.end)
      );
    }

    // Sort
    if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.contacted_at || b.created_at || b.submitted_at) - new Date(a.contacted_at || a.created_at || a.submitted_at));
    } else if (sortBy === 'oldest') {
      filtered.sort((a, b) => new Date(a.contacted_at || a.created_at || a.submitted_at) - new Date(b.contacted_at || b.created_at || b.submitted_at));
    } else if (sortBy === 'name') {
      filtered.sort((a, b) => (a.firstname || '').localeCompare(b.firstname || ''));
    }

    setFilteredContacts(filtered);
    setCurrentPage(1);
  }, [searchTerm, selectedStatus, dateRange, sortBy, contacts]);

  // Pagination
  const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);
  const paginatedContacts = filteredContacts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Mark as read
  const markAsRead = (contactId) => {
    const token = getAuthToken();
    if (!token) {
      showToast('Session expired. Please login again.', 'error');
      return;
    }

    setContacts(prev => prev.map(contact => 
      contact.id === contactId || contact._id === contactId
        ? { ...contact, status: 'read', readAt: new Date().toISOString() }
        : contact
    ));
    showToast('Message marked as read', 'success');
  };

  // Mark as responded
  const markAsResponded = (contactId) => {
    const token = getAuthToken();
    if (!token) {
      showToast('Session expired. Please login again.', 'error');
      return;
    }

    setContacts(prev => prev.map(contact => 
      contact.id === contactId || contact._id === contactId
        ? { ...contact, status: 'responded', respondedAt: new Date().toISOString() }
        : contact
    ));
    showToast('Message marked as responded', 'success');
  };

  // Delete contact
  const deleteContact = (contactId) => {
    const token = getAuthToken();
    if (!token) {
      showToast('Session expired. Please login again.', 'error');
      return;
    }

    if (window.confirm('Are you sure you want to delete this message?')) {
      setContacts(prev => prev.filter(contact => 
        contact.id !== contactId && contact._id !== contactId
      ));
      showToast('Message deleted successfully', 'success');
    }
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Message', 'Status', 'Date'];
    const csvData = filteredContacts.map(contact => [
      `${contact.firstname || ''} ${contact.lastname || ''}`,
      contact.email || '',
      contact.telephone || '',
      contact.message || '',
      contact.status || 'unknown',
      new Date(contact.contacted_at || contact.created_at || contact.submitted_at || Date.now()).toLocaleString()
    ]);
    
    const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `support-messages-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('CSV exported successfully!', 'success');
  };

  // ✅ Refresh handler
  const handleRefresh = () => {
    setRetryCount(prev => prev + 1);
    setError(null);
  };

  // Get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case 'read':
        return { bg: 'bg-blue-100', text: 'text-blue-700', icon: <FaCheckCircle size={12} />, label: 'Read' };
      case 'unread':
        return { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: <FaClock size={12} />, label: 'Unread' };
      case 'responded':
        return { bg: 'bg-green-100', text: 'text-green-700', icon: <FaReply size={12} />, label: 'Responded' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-700', icon: <FaComment size={12} />, label: 'Pending' };
    }
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
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center gap-2"
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
          toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 text-sm`}>
          {toast.type === 'success' ? '✓' : '✗'} {toast.message}
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
                    <h1 className="text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                      Support Dashboard
                    </h1>
                    <p className="text-gray-500 text-sm md:text-base mt-1">
                      Manage customer support messages and inquiries
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <button 
                      onClick={exportToCSV}
                      className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2 text-sm transition"
                    >
                      <FaDownload size={14} />
                      Export CSV
                    </button>
                    <button 
                      onClick={handleRefresh}
                      className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      title="Refresh data"
                    >
                      <HiOutlineRefresh size={18} className="text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">Total Messages</p>
                      <p className="text-xl md:text-2xl font-bold text-gray-800">{stats.total}</p>
                    </div>
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                      <FaComments className="text-indigo-600" size={18} />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">Unread</p>
                      <p className="text-xl md:text-2xl font-bold text-yellow-600">{stats.unread}</p>
                    </div>
                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                      <FaEnvelope className="text-yellow-600" size={18} />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">Responded</p>
                      <p className="text-xl md:text-2xl font-bold text-green-600">{stats.responded}</p>
                    </div>
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <FaReply className="text-green-600" size={18} />
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl p-4 shadow-sm text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-white/80">Response Rate</p>
                      <p className="text-xl md:text-2xl font-bold">{((stats.responded / stats.total) * 100).toFixed(1) || 0}%</p>
                    </div>
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <FaChartLine className="text-white" size={18} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Filters Bar */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
                <div className="flex flex-col sm:flex-row flex-wrap gap-3">
                  <div className="flex-1 min-w-[200px] relative">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <input
                      type="text"
                      placeholder="Search by name, email, phone or message..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[130px]"
                  >
                    <option value="all">All Status</option>
                    <option value="unread">Unread</option>
                    <option value="read">Read</option>
                    <option value="responded">Responded</option>
                  </select>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[130px]"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="name">Sort by Name</option>
                  </select>

                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={dateRange.start}
                      onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                      className="px-2 py-2 border border-gray-200 rounded-lg text-sm w-[120px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="date"
                      value={dateRange.end}
                      onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                      className="px-2 py-2 border border-gray-200 rounded-lg text-sm w-[120px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Active Filters */}
                {(searchTerm || selectedStatus !== 'all' || dateRange.start || dateRange.end) && (
                  <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap items-center gap-2">
                    <span className="text-xs text-gray-500">Active filters:</span>
                    {searchTerm && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 rounded-md text-xs">
                        Search: {searchTerm}
                        <button onClick={() => setSearchTerm('')} className="hover:text-blue-800">×</button>
                      </span>
                    )}
                    {selectedStatus !== 'all' && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 rounded-md text-xs">
                        Status: {selectedStatus}
                        <button onClick={() => setSelectedStatus('all')} className="hover:text-blue-800">×</button>
                      </span>
                    )}
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedStatus('all');
                        setDateRange({ start: '', end: '' });
                        setSortBy('newest');
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
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : filteredContacts.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl">
                  <div className="text-6xl mb-4">📧</div>
                  <p className="text-gray-500 text-lg">No messages found</p>
                  <p className="text-gray-400 text-sm mt-2">Customer inquiries will appear here</p>
                </div>
              ) : (
                <>
                  {/* Messages Grid */}
                  <div className="grid grid-cols-1 gap-4">
                    {paginatedContacts.map((contact, index) => {
                      const status = getStatusBadge(contact.status);
                      const fullName = `${contact.firstname || ''} ${contact.lastname || ''}`.trim();
                      const contactDate = contact.contacted_at || contact.created_at || contact.submitted_at;
                      const formattedDate = formatDate(contactDate);
                      const relativeTime = getRelativeTime(contactDate);
                      
                      return (
                        <div
                          key={contact.id || contact._id || index}
                          className={`bg-white rounded-xl shadow-sm border hover:shadow-md transition-all duration-200 overflow-hidden ${
                            contact.status === 'unread' ? 'border-l-4 border-l-yellow-400' : 'border-gray-100'
                          }`}
                        >
                          <div className="p-4 md:p-5">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 flex-wrap mb-2">
                                  <div className="flex items-center gap-2">
                                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0">
                                      <FaUserCircle className="text-white" size={20} />
                                    </div>
                                    <div>
                                      <h3 className="font-semibold text-gray-800">{fullName || 'Anonymous'}</h3>
                                      <div className="flex items-center gap-2 text-xs text-gray-500 flex-wrap">
                                        <FaEnvelope size={10} />
                                        <span>{contact.email || 'No email'}</span>
                                        <span className="hidden sm:inline">|</span>
                                        <FaPhoneAlt size={10} className="sm:ml-0" />
                                        <span>{contact.telephone || 'No phone'}</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
                                      {status.icon}
                                      {status.label}
                                    </span>
                                    <div className="flex items-center gap-1 text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
                                      <FaCalendarAlt size={10} className="text-gray-400" />
                                      <span className="font-medium text-gray-600">{relativeTime}</span>
                                    </div>
                                  </div>
                                </div>
                                
                                <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                                  {contact.message || 'No message content'}
                                </p>
                                
                                {/* Full date tooltip on hover */}
                                <div className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                                  <span>📅</span>
                                  <span>{formattedDate}</span>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2 self-end sm:self-start">
                                <button
                                  onClick={() => {
                                    setSelectedContact(contact);
                                    setShowContactModal(true);
                                  }}
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                  title="View Details"
                                >
                                  <FaEye size={16} />
                                </button>
                                {contact.status !== 'read' && (
                                  <button
                                    onClick={() => markAsRead(contact.id || contact._id)}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                    title="Mark as Read"
                                  >
                                    <MdMarkEmailRead size={16} />
                                  </button>
                                )}
                                {contact.status !== 'responded' && (
                                  <button
                                    onClick={() => markAsResponded(contact.id || contact._id)}
                                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                                    title="Mark as Responded"
                                  >
                                    <FaReply size={16} />
                                  </button>
                                )}
                                <button
                                  onClick={() => deleteContact(contact.id || contact._id)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                  title="Delete"
                                >
                                  <FaTrash size={14} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Pagination */}
                  {filteredContacts.length > 0 && (
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
                      <div className="text-xs sm:text-sm text-gray-500">
                        Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredContacts.length)} of {filteredContacts.length} messages
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                          className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm"
                        >
                          Previous
                        </button>
                        <span className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm">
                          {currentPage}
                        </span>
                        <button
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                          className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm"
                        >
                          Next
                        </button>
                      </div>
                      <select
                        value={itemsPerPage}
                        onChange={(e) => setItemsPerPage(Number(e.target.value))}
                        className="px-2 py-1.5 border border-gray-300 rounded-lg text-sm"
                      >
                        <option value={5}>5 / page</option>
                        <option value={10}>10 / page</option>
                        <option value={20}>20 / page</option>
                        <option value={50}>50 / page</option>
                      </select>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Contact Details Modal */}
      {showContactModal && selectedContact && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4 overflow-y-auto" onClick={() => setShowContactModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-auto my-8 animate-fadeIn" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-t-2xl px-4 md:px-6 py-3 md:py-4 flex justify-between items-center">
              <h2 className="text-lg md:text-xl font-bold text-white">Message Details</h2>
              <button
                onClick={() => setShowContactModal(false)}
                className="text-white/80 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="p-4 md:p-6 max-h-[70vh] overflow-y-auto">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Full Name</p>
                    <p className="font-semibold text-sm">{`${selectedContact.firstname || ''} ${selectedContact.lastname || ''}`.trim() || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Status</p>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(selectedContact.status).bg} ${getStatusBadge(selectedContact.status).text}`}>
                      {getStatusBadge(selectedContact.status).icon}
                      {getStatusBadge(selectedContact.status).label}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Email Address</p>
                  <p className="text-sm text-gray-800">{selectedContact.email || 'N/A'}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Phone Number</p>
                  <p className="text-sm text-gray-800">{selectedContact.telephone || 'N/A'}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Message</p>
                  <div className="bg-gray-50 rounded-lg p-3 mt-1">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedContact.message || 'No message content'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Contacted Date</p>
                    <p className="text-sm font-medium text-gray-700">
                      {formatDate(selectedContact.contacted_at || selectedContact.created_at || selectedContact.submitted_at)}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {getRelativeTime(selectedContact.contacted_at || selectedContact.created_at || selectedContact.submitted_at)}
                    </p>
                  </div>
                  {selectedContact.readAt && (
                    <div>
                      <p className="text-xs text-gray-500">Read Date</p>
                      <p className="text-sm">{formatDate(selectedContact.readAt)}</p>
                    </div>
                  )}
                </div>

                {selectedContact.respondedAt && (
                  <div>
                    <p className="text-xs text-gray-500">Responded Date</p>
                    <p className="text-sm">{formatDate(selectedContact.respondedAt)}</p>
                  </div>
                )}
              </div>
            </div>
            <div className="border-t border-gray-200 px-4 md:px-6 py-3 md:py-4 flex gap-3">
              <button
                onClick={() => {
                  window.location.href = `mailto:${selectedContact.email}`;
                  setShowContactModal(false);
                }}
                className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition text-sm flex items-center justify-center gap-2"
              >
                <FaReply size={14} />
                Reply via Email
              </button>
              <button
                onClick={() => setShowContactModal(false)}
                className="flex-1 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition text-sm"
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
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
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

export default AdminSupport;