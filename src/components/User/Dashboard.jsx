// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Bar } from 'react-chartjs-2';
// import { Link } from "react-router-dom";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
// } from 'chart.js';
// import UserSidebar from '../User/User_sidebar';
// import UserNavbar from '../User/User_Navbar';
// import Ac_Charger from '../../assets/walmount.png';
// import DC_charger from '../../assets/portable.png';
// import newcharger from '../../assets/DC60.png';
// import { 
//   ShoppingBag, 
//   TrendingUp, 
//   Package, 
//   Activity, 
//   Zap, 
//   BatteryCharging,
//   Award,
//   Calendar
// } from 'lucide-react';

// const BASE_URL_AND_PORT = 'https://api.static.ev.transev.site';
// const API_KEY = 'mlzuMoRFjdGhcFulLMaVtfwNAHycbBAf';

// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// const Dashboard = () => {
//   const [purchaseData, setPurchaseData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [totalOrders, setTotalOrders] = useState(0);
//   const [orders, setOrders] = useState([]);
//   const [recentActivity, setRecentActivity] = useState([]);
//   const [sidebarOpen, setSidebarOpen] = useState(true);
  
//   const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

//   useEffect(() => {
//     const userId = localStorage.getItem('user_id');
//     if (!userId) {
//       console.error('User ID not found in localStorage');
//       setLoading(false);
//       return;
//     }

//     const fetchPurchaseData = async () => {
//       try {
//         const response = await fetch(
//           `${BASE_URL_AND_PORT}/analytics/user_purchase_summary`,
//           {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//               'API-Key': API_KEY,
//             },
//             body: JSON.stringify({ user_id: userId }),
//           }
//         );

//         if (!response.ok) throw new Error('Failed to fetch purchase data');
//         const data = await response.json();
//         setPurchaseData(data.user_purchase_summary || []);
//       } catch (error) {
//         console.error('Error fetching purchase data:', error);
//       }
//     };

//     const fetchTotalOrders = async () => {
//       try {
//         const response = await fetch(
//           `${BASE_URL_AND_PORT}/analytics/user_total_spent_and_orders`,
//           {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//               'API-Key': API_KEY,
//             },
//             body: JSON.stringify({ user_id: userId }),
//           }
//         );

//         if (!response.ok) throw new Error('Failed to fetch total orders');
//         const data = await response.json();
//         const summary = data.user_total_spent_and_orders || {};
//         setTotalOrders(summary.total_orders || 0);
//       } catch (error) {
//         console.error('Error fetching total orders:', error);
//       }
//     };

//     Promise.all([fetchPurchaseData(), fetchTotalOrders()]).finally(() => setLoading(false));
//   }, []);

//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const userId = localStorage.getItem("user_id");
//         if (!userId) {
//           console.error("User ID not found in localStorage");
//           return;
//         }

//         const response = await axios.post(
//           `${BASE_URL_AND_PORT}/order/orderhistory`,
//           { user_id: userId },
//           {
//             headers: {
//               "Content-Type": "application/json",
//               "API-Key": API_KEY,
//             },
//           }
//         );

//         setOrders(response.data.slice(0, 4));

//         const activity = response.data.map(order => ({
//           type: 'Order',
//           description: `Ordered ${order.product_name} – ₹${order.total_amount}`,
//           purchase_time: order.purchase_time,
//         }));
        
//         purchaseData.forEach(item => {
//           activity.push({
//             type: 'Purchase',
//             description: `Purchased ${item.product_name} – ${item.total_items_purchased} units`,
//             purchase_time: item.purchase_time,
//           });
//         });
        
//         activity.sort((a, b) => new Date(b.purchase_time) - new Date(a.purchase_time));
//         setRecentActivity(activity.slice(0, 5));
//       } catch (error) {
//         console.error("Error fetching order history:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOrders();
//   }, [purchaseData]);

//   const chartData = {
//     labels: purchaseData.map((item) => item.product_name),
//     datasets: [
//       {
//         label: 'Chargers Purchased',
//         data: purchaseData.map((item) => item.total_items_purchased),
//         backgroundColor: [
//           '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899',
//         ],
//         borderRadius: 8,
//         borderSkipped: false,
//       },
//     ],
//   };

//   const chartOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: { 
//         display: true, 
//         position: 'top',
//         labels: {
//           usePointStyle: true,
//           boxWidth: 10,
//           font: { size: 12, weight: 500 }
//         }
//       },
//       tooltip: {
//         backgroundColor: '#1F2937',
//         titleColor: '#F9FAFB',
//         bodyColor: '#D1D5DB',
//         padding: 12,
//         cornerRadius: 8,
//       }
//     },
//     scales: {
//       y: {
//         beginAtZero: true,
//         grid: { color: '#E5E7EB', drawBorder: false },
//         ticks: { stepSize: 1, font: { size: 11 } },
//       },
//       x: {
//         grid: { display: false },
//         ticks: { font: { size: 11, weight: 500 } },
//       },
//     },
//   };

//   const totalChargers = purchaseData.reduce((sum, item) => sum + item.total_items_purchased, 0);
//   const totalAmount = purchaseData.reduce((sum, item) => sum + item.total_purchase_amount, 0);

//   const statCards = [
//     { title: 'Total Products', value: totalChargers, icon: Package, color: 'from-blue-500 to-blue-600', bgLight: 'bg-blue-50', textColor: 'text-blue-600', borderColor: 'border-blue-100' },
//     { title: 'Total Spend', value: `₹${totalAmount.toLocaleString()}`, icon: TrendingUp, color: 'from-emerald-500 to-emerald-600', bgLight: 'bg-emerald-50', textColor: 'text-emerald-600', borderColor: 'border-emerald-100' },
//     { title: 'Total Orders', value: totalOrders, icon: ShoppingBag, color: 'from-purple-500 to-purple-600', bgLight: 'bg-purple-50', textColor: 'text-purple-600', borderColor: 'border-purple-100' },
//   ];

//   const chargers = [
//     { name: 'Portable EV Charger', type: 'Home & Travel', color: 'emerald', image: DC_charger, badge: 'Best Seller' },
//     { name: 'Wall Mounting EV Charger', type: 'Home & Commercial', color: 'blue', image: Ac_Charger, badge: 'Most Popular' },
//     { name: 'DC Fast Charger', type: 'Commercial', color: 'orange', image: newcharger, badge: 'Fast Charging' },
//   ];

//   return (
//     <div className="flex flex-col min-h-screen bg-gray-50">
//       <UserNavbar onToggleSidebar={toggleSidebar} />
      
//       <div className="flex flex-1">
//         <UserSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

//         <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
//           <div className="max-w-7xl mx-auto space-y-8">
//             {/* Header Section */}
//             <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//               <div>
//                 <h1 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">Dashboard</h1>
//                 <p className="text-gray-500 mt-1">Welcome back! Here's your EV charging overview</p>
//               </div>
//               <div className="flex items-center gap-3">
//                 <div className="bg-white rounded-xl px-4 py-2 shadow-sm border border-gray-100">
//                   <div className="flex items-center gap-2 text-sm text-gray-600">
//                     <Calendar size={16} />
//                     <span>{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Stats Grid */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//               {statCards.map((stat, index) => (
//                 <div key={index} className={`bg-white rounded-2xl shadow-sm border ${stat.borderColor} hover:shadow-md transition-shadow duration-200 overflow-hidden`}>
//                   <div className="p-6">
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <p className="text-sm font-medium text-gray-500 mb-1">{stat.title}</p>
//                         <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
//                       </div>
//                       <div className={`w-12 h-12 ${stat.bgLight} rounded-xl flex items-center justify-center`}>
//                         <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
//                       </div>
//                     </div>
//                   </div>
//                   <div className={`h-1 bg-gradient-to-r ${stat.color}`} />
//                 </div>
//               ))}
//             </div>

//             {/* New Arrivals Section */}
//             <section>
//               <div className="flex items-center justify-between mb-5">
//                 <div>
//                   <h2 className="text-xl font-bold text-gray-800">New Arrival EV Chargers</h2>
//                   <p className="text-sm text-gray-500 mt-0.5">Latest models with advanced technology</p>
//                 </div>
//                 {/* <button className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
//                   View All →
//                 </button> */}
//                 <Link 
//   to="/products"
//   className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
// >
//   View All →
// </Link>
//               </div>
              
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {chargers.map((charger, index) => (
//                   <div key={index} className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
//                     <div className="relative overflow-hidden bg-gray-50 h-64">
//                       <img
//                         src={charger.image}
//                         alt={charger.name}
//                         className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
//                       />
//                       <span className={`absolute top-3 right-3 bg-${charger.color}-100 text-${charger.color}-700 text-xs font-semibold px-2.5 py-1 rounded-full`}>
//                         {charger.badge}
//                       </span>
//                     </div>
//                     <div className="p-5">
//                       <div className="flex items-center gap-2 mb-2">
//                         <Zap size={16} className={`text-${charger.color}-500`} />
//                         <span className={`text-xs font-medium text-${charger.color}-600 bg-${charger.color}-50 px-2 py-0.5 rounded-full`}>
//                           {charger.type}
//                         </span>
//                       </div>
//                       <h4 className="font-bold text-lg text-gray-800 mb-1">{charger.name}</h4>
//                       <p className="text-sm text-gray-500 mb-4">Efficient charging solution for your EV</p>
//                       {/* <button className="w-full py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-sm font-medium transition-colors">
//                         Learn More
//                       </button> */}
//                       <Link to="/products">
//   <button className="w-full py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-sm font-medium transition-colors">
//     Learn More
//   </button>
// </Link>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </section>

//             {/* Charts & Activity Grid */}
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//               {/* Purchase Summary Chart */}
//               {!loading && purchaseData.length > 0 && (
//                 <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
//                   <div className="flex items-center justify-between mb-4">
//                     <div>
//                       <h2 className="text-lg font-semibold text-gray-800">Purchase Summary</h2>
//                       <p className="text-xs text-gray-500 mt-0.5">Product-wise distribution</p>
//                     </div>
//                     <div className="flex items-center gap-1 text-xs text-gray-400">
//                       <Activity size={12} />
//                       <span>Last 30 days</span>
//                     </div>
//                   </div>
//                   <div className="h-72">
//                     <Bar data={chartData} options={chartOptions} />
//                   </div>
//                 </div>
//               )}

//               {/* Recent Activity */}
//               <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
//                 <div className="p-5 border-b border-gray-100">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <h2 className="text-lg font-semibold text-gray-800">Recent Activity</h2>
//                       <p className="text-xs text-gray-500 mt-0.5">Your latest transactions</p>
//                     </div>
//                     <Award size={18} className="text-gray-400" />
//                   </div>
//                 </div>
//                 <div className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
//                   {recentActivity.length > 0 ? (
//                     recentActivity.map((item, i) => (
//                       <div key={i} className="p-4 hover:bg-gray-50 transition-colors">
//                         <div className="flex items-start gap-3">
//                           <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
//                             item.type === 'Order' ? 'bg-blue-100' : 'bg-emerald-100'
//                           }`}>
//                             {item.type === 'Order' ? (
//                               <ShoppingBag size={14} className="text-blue-600" />
//                             ) : (
//                               <BatteryCharging size={14} className="text-emerald-600" />
//                             )}
//                           </div>
//                           <div className="flex-1 min-w-0">
//                             <p className="text-sm font-medium text-gray-800 truncate">{item.description}</p>
//                             <div className="flex items-center gap-2 mt-1">
//                               <span className={`text-xs px-2 py-0.5 rounded-full ${
//                                 item.type === 'Order' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'
//                               }`}>
//                                 {item.type}
//                               </span>
//                               <span className="text-xs text-gray-400">
//                                 {new Date(item.purchase_time).toLocaleString('en-IN', {
//                                   day: 'numeric',
//                                   month: 'short',
//                                   hour: '2-digit',
//                                   minute: '2-digit',
//                                 })}
//                               </span>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     ))
//                   ) : (
//                     <div className="p-8 text-center text-gray-500">
//                       <Activity size={32} className="mx-auto mb-2 text-gray-300" />
//                       <p className="text-sm">No recent activity found.</p>
//                     </div>
//                   )}
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
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Link } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import UserSidebar from '../User/User_sidebar';
import UserNavbar from '../User/User_Navbar';
import Ac_Charger from '../../assets/walmount.png';
import DC_charger from '../../assets/portable.png';
import newcharger from '../../assets/DC60.png';
import { 
  ShoppingBag, 
  TrendingUp, 
  Package, 
  Activity, 
  Zap, 
  BatteryCharging,
  Award,
  Calendar,
  ArrowRight
} from 'lucide-react';

const BASE_URL_AND_PORT = 'https://api.static.ev.transev.site';
const API_KEY = 'mlzuMoRFjdGhcFulLMaVtfwNAHycbBAf';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [purchaseData, setPurchaseData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalOrders, setTotalOrders] = useState(0);
  const [orders, setOrders] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
 const token = localStorage.getItem("auth_token");
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

  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    if (!userId) {
      console.error('User ID not found in localStorage');
      setLoading(false);
      return;
    }

    const fetchPurchaseData = async () => {
      try {
        const response = await fetch(
          `${BASE_URL_AND_PORT}/analytics/user_purchase_summary`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'API-Key': API_KEY,
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ user_id: userId }),
          }
        );

        if (!response.ok) throw new Error('Failed to fetch purchase data');
        const data = await response.json();
        setPurchaseData(data.user_purchase_summary || []);
      } catch (error) {
        console.error('Error fetching purchase data:', error);
      }
    };

    const fetchTotalOrders = async () => {
      try {
        const response = await fetch(
          `${BASE_URL_AND_PORT}/analytics/user_total_spent_and_orders`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'API-Key': API_KEY,
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ user_id: userId }),
          }
        );

        if (!response.ok) throw new Error('Failed to fetch total orders');
        const data = await response.json();
        const summary = data.user_total_spent_and_orders || {};
        setTotalOrders(summary.total_orders || 0);
      } catch (error) {
        console.error('Error fetching total orders:', error);
      }
    };

    Promise.all([fetchPurchaseData(), fetchTotalOrders()]).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userId = localStorage.getItem("user_id");
        if (!userId) {
          console.error("User ID not found in localStorage");
          return;
        }

        const response = await axios.post(
          `${BASE_URL_AND_PORT}/order/orderhistory`,
          { user_id: userId },
          {
            headers: {
              "Content-Type": "application/json",
              "API-Key": API_KEY,
              "Authorization": `Bearer ${token}`
            },
          }
        );

        setOrders(response.data.slice(0, 4));

        const activity = response.data.map(order => ({
          type: 'Order',
          description: `Ordered ${order.product_name} – ₹${order.total_amount}`,
          purchase_time: order.purchase_time,
        }));
        
        purchaseData.forEach(item => {
          activity.push({
            type: 'Purchase',
            description: `Purchased ${item.product_name} – ${item.total_items_purchased} units`,
            purchase_time: item.purchase_time,
          });
        });
        
        activity.sort((a, b) => new Date(b.purchase_time) - new Date(a.purchase_time));
        setRecentActivity(activity.slice(0, 5));
      } catch (error) {
        console.error("Error fetching order history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [purchaseData]);

  const chartData = {
    labels: purchaseData.map((item) => item.product_name),
    datasets: [
      {
        label: 'Chargers Purchased',
        data: purchaseData.map((item) => item.total_items_purchased),
        backgroundColor: [
          '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899',
        ],
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        display: true, 
        position: 'top',
        labels: {
          usePointStyle: true,
          boxWidth: 10,
          font: { size: isMobile ? 10 : 12, weight: 500 }
        }
      },
      tooltip: {
        backgroundColor: '#1F2937',
        titleColor: '#F9FAFB',
        bodyColor: '#D1D5DB',
        padding: 12,
        cornerRadius: 8,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: '#E5E7EB', drawBorder: false },
        ticks: { stepSize: 1, font: { size: isMobile ? 9 : 11 } },
      },
      x: {
        grid: { display: false },
        ticks: { 
          font: { size: isMobile ? 9 : 11, weight: 500 },
          rotation: isMobile ? 45 : 0,
          maxRotation: 45,
          minRotation: 45
        },
      },
    },
  };

  const totalChargers = purchaseData.reduce((sum, item) => sum + item.total_items_purchased, 0);
  const totalAmount = purchaseData.reduce((sum, item) => sum + item.total_purchase_amount, 0);

  const statCards = [
    { title: 'Total Products', value: totalChargers, icon: Package, color: 'from-blue-500 to-blue-600', bgLight: 'bg-blue-50', textColor: 'text-blue-600', borderColor: 'border-blue-100' },
    { title: 'Total Spend', value: `₹${totalAmount.toLocaleString()}`, icon: TrendingUp, color: 'from-emerald-500 to-emerald-600', bgLight: 'bg-emerald-50', textColor: 'text-emerald-600', borderColor: 'border-emerald-100' },
    { title: 'Total Orders', value: totalOrders, icon: ShoppingBag, color: 'from-purple-500 to-purple-600', bgLight: 'bg-purple-50', textColor: 'text-purple-600', borderColor: 'border-purple-100' },
  ];

  const chargers = [
    { name: 'Portable EV Charger', type: 'Home & Travel', color: 'emerald', image: DC_charger, badge: 'Best Seller' },
    { name: 'Wall Mounting EV Charger', type: 'Home & Commercial', color: 'blue', image: Ac_Charger, badge: 'Most Popular' },
    { name: 'DC Fast Charger', type: 'Commercial', color: 'orange', image: newcharger, badge: 'Fast Charging' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <UserNavbar onToggleSidebar={toggleSidebar} />
      
      <div className="flex flex-1 relative">
        {/* Sidebar */}
        <UserSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

        {/* Main Content - Dynamic margin based on sidebar state */}
        <main 
          className={`
            flex-1 transition-all duration-300 ease-in-out w-full
            ${sidebarOpen ? 'lg:ml-72' : 'lg:ml-24'}
            ${isMobile && sidebarOpen ? 'overflow-hidden' : ''}
          `}
        >
          <div className="p-3 sm:p-4 md:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6 md:space-y-8">
              
              {/* Header Section */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">Dashboard</h1>
                  <p className="text-sm sm:text-base text-gray-500 mt-1">Welcome back! Here's your EV charging overview</p>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="bg-white rounded-xl px-3 sm:px-4 py-2 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600">
                      <Calendar size={isMobile ? 14 : 16} />
                      <span>{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                {statCards.map((stat, index) => (
                  <div key={index} className={`bg-white rounded-xl sm:rounded-2xl shadow-sm border ${stat.borderColor} hover:shadow-md transition-shadow duration-200 overflow-hidden`}>
                    <div className="p-4 sm:p-5 md:p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1">{stat.title}</p>
                          <p className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 break-words">{stat.value}</p>
                        </div>
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 ${stat.bgLight} rounded-xl flex items-center justify-center`}>
                          <stat.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.textColor}`} />
                        </div>
                      </div>
                    </div>
                    <div className={`h-1 bg-gradient-to-r ${stat.color}`} />
                  </div>
                ))}
              </div>

              {/* New Arrivals Section */}
              <section className="space-y-3 sm:space-y-4 md:space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                  <div>
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">New Arrival EV Chargers</h2>
                    <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Latest models with advanced technology</p>
                  </div>
                  <Link 
                    to="/products"
                    className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors inline-flex items-center gap-1"
                  >
                    View All <ArrowRight size={14} />
                  </Link>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
                  {chargers.map((charger, index) => (
                    <div key={index} className="group bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                      <div className="relative overflow-hidden bg-gray-50 h-48 sm:h-56 md:h-64">
                        <img
                          src={charger.image}
                          alt={charger.name}
                          className="w-full h-full object-contain p-3 sm:p-4 group-hover:scale-105 transition-transform duration-300"
                        />
                        <span className={`absolute top-2 sm:top-3 right-2 sm:right-3 bg-${charger.color}-100 text-${charger.color}-700 text-xs font-semibold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full`}>
                          {charger.badge}
                        </span>
                      </div>
                      <div className="p-4 sm:p-5">
                        <div className="flex items-center gap-2 mb-2">
                          <Zap size={isMobile ? 14 : 16} className={`text-${charger.color}-500`} />
                          <span className={`text-xs font-medium text-${charger.color}-600 bg-${charger.color}-50 px-2 py-0.5 rounded-full`}>
                            {charger.type}
                          </span>
                        </div>
                        <h4 className="font-bold text-base sm:text-lg text-gray-800 mb-1">{charger.name}</h4>
                        <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">Efficient charging solution for your EV</p>
                        <Link to="/products">
                          <button className="w-full py-1.5 sm:py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-colors">
                            Learn More
                          </button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Charts & Activity Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
                {/* Purchase Summary Chart */}
                {!loading && purchaseData.length > 0 && (
                  <div className="lg:col-span-2 bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 mb-4">
                      <div>
                        <h2 className="text-base sm:text-lg font-semibold text-gray-800">Purchase Summary</h2>
                        <p className="text-xs text-gray-500 mt-0.5">Product-wise distribution</p>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Activity size={12} />
                        <span>Last 30 days</span>
                      </div>
                    </div>
                    <div className="h-64 sm:h-72 md:h-80">
                      <Bar data={chartData} options={chartOptions} />
                    </div>
                  </div>
                )}

                {/* Recent Activity */}
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-4 sm:p-5 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-base sm:text-lg font-semibold text-gray-800">Recent Activity</h2>
                        <p className="text-xs text-gray-500 mt-0.5">Your latest transactions</p>
                      </div>
                      <Award size={isMobile ? 16 : 18} className="text-gray-400" />
                    </div>
                  </div>
                  <div className="divide-y divide-gray-100 max-h-[300px] sm:max-h-[350px] md:max-h-[400px] overflow-y-auto">
                    {recentActivity.length > 0 ? (
                      recentActivity.map((item, i) => (
                        <div key={i} className="p-3 sm:p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex items-start gap-2 sm:gap-3">
                            <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                              item.type === 'Order' ? 'bg-blue-100' : 'bg-emerald-100'
                            }`}>
                              {item.type === 'Order' ? (
                                <ShoppingBag size={isMobile ? 12 : 14} className="text-blue-600" />
                              ) : (
                                <BatteryCharging size={isMobile ? 12 : 14} className="text-emerald-600" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs sm:text-sm font-medium text-gray-800 truncate">{item.description}</p>
                              <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-1">
                                <span className={`text-xs px-1.5 sm:px-2 py-0.5 rounded-full ${
                                  item.type === 'Order' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'
                                }`}>
                                  {item.type}
                                </span>
                                <span className="text-xs text-gray-400">
                                  {new Date(item.purchase_time).toLocaleString('en-IN', {
                                    day: 'numeric',
                                    month: 'short',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center text-gray-500">
                        <Activity size={32} className="mx-auto mb-2 text-gray-300" />
                        <p className="text-sm">No recent activity found.</p>
                      </div>
                    )}
                  </div>
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