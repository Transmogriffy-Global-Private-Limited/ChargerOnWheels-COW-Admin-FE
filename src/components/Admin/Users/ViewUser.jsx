import React, { useEffect, useState } from 'react';
import AdminSidebar from '../Admin_sidebar';
import AdminNavbar from '../Admin_navbar';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortOrder, setSortOrder] = useState('desc');
  const [sortType, setSortType] = useState('date');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const itemsPerPage = 10;

  const BASE_URL = "https://api.static.ev.transev.site/admin/view-users";
  const API_KEY = "mlzuMoRFjdGhcFulLMaVtfwNAHycbBAf";
  const authToken = localStorage.getItem('auth_token');

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

  // Helper function to safely convert any value to string for searching
  const safeToString = (value) => {
    if (value === null || value === undefined) return '';
    return String(value).toLowerCase();
  };

  // Fetch user details
  const fetchUserDetails = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}?limit=1-1000`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'API-Key': API_KEY,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        setUsers(data);
        setFilteredUsers(data);
        setTotalPages(Math.ceil(data.length / itemsPerPage));
      } else {
        setError('No users found');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  // Filter and search users
  useEffect(() => {
    let result = [...users];

    // Search filter - safely handles different data types
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      result = result.filter(user => {
        const name = safeToString(user.name);
        const email = safeToString(user.email);
        const userNumber = safeToString(user.user_number);
        const phoneNumber = safeToString(user.phone_number);
        
        return name.includes(searchLower) ||
               email.includes(searchLower) ||
               userNumber.includes(searchLower) ||
               phoneNumber.includes(searchLower);
      });
    }

    // Role filter
    if (selectedRole !== 'all') {
      result = result.filter(user => {
        const userRole = safeToString(user.role);
        return userRole === selectedRole.toLowerCase();
      });
    }

    // Sorting
    result.sort((a, b) => {
      if (sortType === 'date') {
        const dateA = a.created_at ? new Date(a.created_at) : new Date(0);
        const dateB = b.created_at ? new Date(b.created_at) : new Date(0);
        return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
      }
      const nameA = safeToString(a.name);
      const nameB = safeToString(b.name);
      return sortOrder === 'asc' 
        ? nameA.localeCompare(nameB) 
        : nameB.localeCompare(nameA);
    });

    setFilteredUsers(result);
    setTotalPages(Math.ceil(result.length / itemsPerPage));
    setCurrentPage(1);
  }, [searchTerm, selectedRole, users, sortType, sortOrder]);

  // Get current page users
  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Pagination
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Get unique roles for filter
  const roles = ['all', ...new Set(users.map(user => user.role).filter(Boolean))];

  // Handle user click to show details
  const handleUserClick = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm('');
  };

  // Role badge color
  const getRoleColor = (role) => {
    const roleLower = safeToString(role);
    switch (roleLower) {
      case 'admin': return 'bg-purple-100 text-purple-700';
      case 'user': return 'bg-blue-100 text-blue-700';
      case 'vendor': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <AdminNavbar onToggleSidebar={toggleSidebar} />
      
      <div className="flex flex-1 relative">
        {/* Sidebar */}
        <AdminSidebar 
          isVisible={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
        />

        {/* Main Content - Dynamic margin based on sidebar state */}
        <main 
          className={`
            flex-1 transition-all duration-300 ease-in-out w-full min-h-screen
            ${sidebarOpen ? 'lg:ml-72' : 'lg:ml-24'}
            ${isMobile && sidebarOpen ? 'overflow-hidden' : ''}
          `}
        >
          <div className="p-4 md:p-6 lg:p-8">
            <div className="max-w-full mx-auto">
              
              {/* Header Section */}
              <div className="mb-6 md:mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h1 className="text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                      User Management
                    </h1>
                    <p className="text-gray-500 text-sm md:text-base mt-1">
                      Manage and monitor all registered users
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-white rounded-xl px-3 md:px-4 py-2 shadow-sm border border-gray-100">
                      <span className="text-xs md:text-sm text-gray-500">Total Users</span>
                      <span className="ml-2 text-lg md:text-xl font-bold text-emerald-600">{users.length}</span>
                    </div>
                    <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 md:px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-sm">
                      + Add User
                    </button>
                  </div>
                </div>
              </div>

              {/* Filters Section - Responsive */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6 mb-6">
                <div className="flex flex-col md:flex-row gap-3 md:gap-4">
                  {/* Search Bar */}
                  <div className="flex-1 relative">
                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      type="text"
                      placeholder="Search by name, email, phone or user ID..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                      className="w-full pl-9 md:pl-10 pr-8 md:pr-10 py-2 text-sm md:text-base border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                    {searchTerm && (
                      <button
                        type="button"
                        onClick={clearSearch}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>

                  {/* Role Filter */}
                  <div className="relative">
                    <select
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className="appearance-none px-3 md:px-4 py-2 pr-8 md:pr-10 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent cursor-pointer text-sm md:text-base"
                    >
                      {roles.map(role => (
                        <option key={role} value={role}>
                          {role === 'all' ? 'All Roles' : (role?.charAt(0).toUpperCase() + role?.slice(1) || 'User')}
                        </option>
                      ))}
                    </select>
                    <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-3 h-3 md:w-4 md:h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>

                  {/* Sort Button */}
                  <button
                    type="button"
                    onClick={() => {
                      if (sortType === 'date') {
                        setSortType('name');
                        setSortOrder('asc');
                      } else {
                        setSortType('date');
                        setSortOrder('desc');
                      }
                    }}
                    className="flex items-center justify-center gap-2 px-3 md:px-4 py-2 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 transition-colors text-sm md:text-base"
                  >
                    <svg className="w-3 h-3 md:w-4 md:h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                    </svg>
                    <span className="text-gray-700">
                      Sort by {sortType === 'date' ? 'Recent' : 'Name'}
                    </span>
                  </button>
                </div>

                {/* Search Results Info */}
                {searchTerm && (
                  <div className="mt-3 text-xs md:text-sm text-gray-500 flex items-center justify-between">
                    <span>
                      Found {filteredUsers.length} result{filteredUsers.length !== 1 ? 's' : ''} for "{searchTerm}"
                    </span>
                    <button
                      onClick={clearSearch}
                      className="text-emerald-600 hover:text-emerald-700 font-medium text-xs md:text-sm"
                    >
                      Clear Search
                    </button>
                  </div>
                )}
              </div>

              {/* Loading State */}
              {loading && (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-b-2 border-emerald-600 mb-4"></div>
                  <p className="text-gray-500 text-sm md:text-base">Loading users...</p>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
                  <svg className="w-10 h-10 md:w-12 md:h-12 text-red-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-red-600 text-sm md:text-base">{error}</p>
                  <button onClick={fetchUserDetails} className="mt-4 text-emerald-600 hover:text-emerald-700 font-medium text-sm md:text-base">
                    Try Again
                  </button>
                </div>
              )}

              {/* Users Table - Responsive */}
              {!loading && !error && (
                <>
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[640px]">
                        <thead className="bg-gray-50 border-b border-gray-100">
                          <tr>
                            <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                              User
                            </th>
                            <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                              User ID
                            </th>
                            <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                              Contact
                            </th>
                            <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                              Role
                            </th>
                            <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                              Registered On
                            </th>
                            <th className="px-3 md:px-6 py-3 md:py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {currentUsers.length > 0 ? (
                            currentUsers.map((user) => (
                              <tr
                                key={user.id || user.user_number}
                                className="hover:bg-gray-50 transition-colors cursor-pointer"
                                onClick={() => handleUserClick(user)}
                              >
                                <td className="px-3 md:px-6 py-3 md:py-4">
                                  <div className="flex items-center gap-2 md:gap-3">
                                    <div className="relative flex-shrink-0">
                                      <img
                                        src={user.profile_picture || `https://ui-avatars.com/api/?background=10b981&color=fff&name=${encodeURIComponent(user.name || 'User')}`}
                                        alt={user.name}
                                        className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover ring-2 ring-white shadow-sm"
                                        onError={(e) => {
                                          e.target.src = `https://ui-avatars.com/api/?background=10b981&color=fff&name=${encodeURIComponent(user.name || 'User')}`;
                                        }}
                                      />
                                      <div className="absolute bottom-0 right-0 w-2 h-2 md:w-2.5 md:h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
                                    </div>
                                    <div className="min-w-0">
                                      <p className="font-medium text-gray-900 text-sm md:text-base truncate max-w-[120px] md:max-w-none">{user.name || 'N/A'}</p>
                                      <p className="text-xs text-gray-500 truncate max-w-[120px] md:max-w-none">{user.email || 'N/A'}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-3 md:px-6 py-3 md:py-4">
                                  <span className="text-xs md:text-sm font-mono text-gray-600">{user.user_number || 'N/A'}</span>
                                </td>
                                <td className="px-3 md:px-6 py-3 md:py-4">
                                  <div className="flex items-center gap-1 md:gap-2">
                                    <svg className="w-3 h-3 md:w-4 md:h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    <span className="text-xs md:text-sm text-gray-600">{user.phone_number || 'N/A'}</span>
                                  </div>
                                </td>
                                <td className="px-3 md:px-6 py-3 md:py-4">
                                  <span className={`inline-flex px-2 py-0.5 md:px-2.5 md:py-1 text-xs font-medium rounded-full ${getRoleColor(user.role)}`}>
                                    {user.role || 'User'}
                                  </span>
                                </td>
                                <td className="px-3 md:px-6 py-3 md:py-4 hidden sm:table-cell">
                                  <div className="flex flex-col">
                                    <span className="text-xs md:text-sm text-gray-900">
                                      {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                      {user.created_at ? new Date(user.created_at).toLocaleTimeString() : ''}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-3 md:px-6 py-3 md:py-4 text-right">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleUserClick(user);
                                    }}
                                    className="text-gray-400 hover:text-emerald-600 transition-colors"
                                  >
                                    <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                  </button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="6" className="px-6 py-12 text-center">
                                <div className="flex flex-col items-center">
                                  <svg className="w-12 h-12 md:w-16 md:h-16 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                  </svg>
                                  <p className="text-gray-400 text-sm md:text-base">
                                    {searchTerm ? `No users found matching "${searchTerm}"` : 'No users found'}
                                  </p>
                                  {searchTerm && (
                                    <button
                                      onClick={clearSearch}
                                      className="mt-3 text-emerald-600 hover:text-emerald-700 font-medium text-sm"
                                    >
                                      Clear Search
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination - Responsive */}
                    {filteredUsers.length > 0 && (
                      <div className="px-3 md:px-6 py-3 md:py-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="text-xs md:text-sm text-gray-500 text-center sm:text-left">
                          Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} users
                        </div>
                        <div className="flex items-center justify-center sm:justify-end gap-2">
                          <button
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-2 md:px-3 py-1 md:py-1.5 text-xs md:text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            Previous
                          </button>
                          <div className="flex gap-1">
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                              let pageNum;
                              if (totalPages <= 5) {
                                pageNum = i + 1;
                              } else if (currentPage <= 3) {
                                pageNum = i + 1;
                              } else if (currentPage >= totalPages - 2) {
                                pageNum = totalPages - 4 + i;
                              } else {
                                pageNum = currentPage - 2 + i;
                              }
                              return (
                                <button
                                  key={pageNum}
                                  onClick={() => paginate(pageNum)}
                                  className={`w-7 h-7 md:w-8 md:h-8 text-xs md:text-sm rounded-lg transition-colors ${
                                    currentPage === pageNum
                                      ? 'bg-emerald-600 text-white'
                                      : 'text-gray-600 hover:bg-gray-100'
                                  }`}
                                >
                                  {pageNum}
                                </button>
                              );
                            })}
                          </div>
                          <button
                            onClick={() => paginate(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-2 md:px-3 py-1 md:py-1.5 text-xs md:text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* User Detail Modal - Responsive */}
              {showUserModal && selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 md:p-4" onClick={() => setShowUserModal(false)}>
                  <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                    <div className="relative">
                      <div className="h-24 md:h-32 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-t-2xl"></div>
                      <button
                        onClick={() => setShowUserModal(false)}
                        className="absolute top-2 right-2 md:top-4 md:right-4 bg-white rounded-full p-1.5 shadow-md hover:bg-gray-100 transition-colors"
                      >
                        <svg className="w-4 h-4 md:w-5 md:h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                      <div className="absolute -bottom-10 md:-bottom-12 left-1/2 transform -translate-x-1/2">
                        <img
                          src={selectedUser.profile_picture || `https://ui-avatars.com/api/?background=10b981&color=fff&size=128&name=${encodeURIComponent(selectedUser.name || 'User')}`}
                          alt={selectedUser.name}
                          className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover ring-4 ring-white shadow-lg"
                          onError={(e) => {
                            e.target.src = `https://ui-avatars.com/api/?background=10b981&color=fff&size=128&name=${encodeURIComponent(selectedUser.name || 'User')}`;
                          }}
                        />
                      </div>
                    </div>
                    <div className="pt-12 md:pt-16 pb-4 md:pb-6 px-4 md:px-6">
                      <div className="text-center mb-4 md:mb-6">
                        <h2 className="text-lg md:text-xl font-bold text-gray-900">{selectedUser.name || 'N/A'}</h2>
                        <p className="text-xs md:text-sm text-gray-500 mt-1">{selectedUser.role || 'User'}</p>
                      </div>
                      <div className="space-y-3 md:space-y-4">
                        <div className="flex items-center gap-2 md:gap-3 py-2 border-b border-gray-100">
                          <svg className="w-4 h-4 md:w-5 md:h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <div className="min-w-0">
                            <p className="text-xs text-gray-400">User ID</p>
                            <p className="text-xs md:text-sm font-mono text-gray-800 break-all">{selectedUser.user_number || 'N/A'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 md:gap-3 py-2 border-b border-gray-100">
                          <svg className="w-4 h-4 md:w-5 md:h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <div className="min-w-0">
                            <p className="text-xs text-gray-400">Email Address</p>
                            <p className="text-xs md:text-sm text-gray-800 break-all">{selectedUser.email || 'N/A'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 md:gap-3 py-2 border-b border-gray-100">
                          <svg className="w-4 h-4 md:w-5 md:h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <div>
                            <p className="text-xs text-gray-400">Phone Number</p>
                            <p className="text-xs md:text-sm text-gray-800">{selectedUser.phone_number || 'N/A'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 md:gap-3 py-2">
                          <svg className="w-4 h-4 md:w-5 md:h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <div>
                            <p className="text-xs text-gray-400">Member Since</p>
                            <p className="text-xs md:text-sm text-gray-800">{selectedUser.created_at ? new Date(selectedUser.created_at).toLocaleString() : 'N/A'}</p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-5 md:mt-6 flex gap-2 md:gap-3">
                        <button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-3 md:px-4 py-2 rounded-xl font-medium transition-colors text-sm md:text-base">
                          Edit User
                        </button>
                        <button className="flex-1 border border-red-300 text-red-600 hover:bg-red-50 px-3 md:px-4 py-2 rounded-xl font-medium transition-colors text-sm md:text-base">
                          Suspend
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserList;