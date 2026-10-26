// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/Home';
import AboutPage from './components/About';
import NewsPage from './components/News';
import Solution from './components/Solution';
import Contact  from './components/Contact';
import ApartmentBuildings from './components/Apartmentbuildings';
import Workplace from './components/Workplace';
import PublicPlace from './components/PublicPlaces';
import FleetOrganization from './components/FleetOrganization';
import Work from './components/work';
import Signup from './components/User/Signup';
import Login from './components/User/Login';
import ForgotPasswordPage from './components/User/ForgetPassword';
import UserProfile from './components/User/User_Profile';
import UserNavbar from './components/User/User_Navbar';
import UserSidebar from './components/User/User_sidebar';
import Dashboard from './components/User/Dashboard';
import AdminSignup from './components/Admin/Signup';
import AdminLogin from './components/Admin/Login';
import AdminForgetPassword from './components/Admin/ForgetPassword';
import AdminDashboard from './components/Admin/Admindashboard';
import AdminProfile from './components/Admin/AdminProfile';
import AddProduct from './components/Admin/Product/AddProduct';
import ManageProducts from './components/Admin/Product/ManageProducts';
import DelistedProducts from './components/Admin/Product/DelistedProducts';
import ProductView from './components/Admin/Product/ProductView';
import ProductEdit from './components/Admin/Product/ProductEdit';
import Product from './components/User/Products/Product';
import Cart from './components/User/Cart/Cart';
import UserOrder from './components/User/Order/Order';
import Address from './components/User/Address';
import Setting from './components/User/Settings/Setting';
import ManageUser from './components/Admin/Users/ViewUser';
import ManageOrder from './components/Admin/AdminOrder/ManageOrder';
import Adminsetting from './components/Admin/Settings/Adminsetting';
import AdminReports from './components/Admin/Report/Report';
import ViewDelistedProduct from './components/Admin/Product/ViewDelistedProduct';
import HRMS from './components/HRMS';
import Education from './components/Education';
import Hospital from './components/Hospital';
import Job from './components/Job';
import Cms from './components/cms';
import Ecom from './components/Ecom';
import Park from './components/Park';
import Food from './components/Food';
import CRM from './components/CRM';
import Privacy from './components/PrivacyStatement';
import Terms from './components/TermsandConditions';
import IndustrialSupport from './components/IndustriesSupport';
import { Image } from 'lucide-react';
import VerifyEmail from './components/User/VerifyEmail';
import AdminRefunds from './components/Admin/Refund/Refund';
import CancellationPolicy from './components/CancellationandRefundPolicy';
import ShippingPolicy from './components/ShippingPolicy'
import AdminSupport from './components/Admin/Support'
import Blog from './components/Blog';
import DurgapurBlog from './components/Bhingeemore';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/solution" element={<Solution />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/solutions/home-and-housing-societies" element={<ApartmentBuildings />} />
        <Route path="/solutions/office-and-workplace" element={<Workplace />} />
        <Route path="/solutions/public-places" element={<PublicPlace />} />
        <Route path="/solutions/fleet-organization" element={<FleetOrganization />} />
        <Route path="/how-we-work" element={<Work />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/profile" element={<UserProfile />} /> 
        <Route path="/usernavbar" element={<UserNavbar />} />
        <Route path="/usersidebar" element={<UserSidebar />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin/signup" element={<AdminSignup/>} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/forgot-password" element={<AdminForgetPassword />} /> 
        <Route path="/admin/dashboard" element={<AdminDashboard />} /> 
        <Route path="/admin/profile" element={<AdminProfile />} /> 
        <Route path="/add-product" element={<AddProduct />} /> 
        <Route path="/manage/products" element={<ManageProducts />} /> 
        <Route path="/admin/delisted-products" element={<DelistedProducts />} /> 
        <Route path="/admin/product/view/:id" element={<ProductView />} /> {/* Product View Page */}
        <Route path="/admin/product/edit/:id" element={<ProductEdit />} /> {/* Product Edit Page */}
        <Route path="/products" element={<Product />} /> 
        <Route path="/cart" element={<Cart />} /> 
        <Route path="/order" element={<UserOrder />} /> 
        <Route path="/address" element={<Address />} /> 
        <Route path="/setting" element={<Setting />} /> 
        <Route path="/admin/users" element={<ManageUser />} /> 
        <Route path="/admin/orders" element={<ManageOrder />} /> 
        <Route path="/admin/settings" element={<Adminsetting />} /> 
        <Route path="/admin/report" element={<AdminReports />} /> 
        <Route path="/admin/delistproduct/view/:id" element={<ViewDelistedProduct />} /> 
        <Route path="/hrms" element={<HRMS/>} /> 
        <Route path="/education" element={<Education/>} /> 
        <Route path="/health" element={<Hospital/>} /> 
        <Route path="/job" element={<Job/>} /> 
        <Route path="/charger" element={<Cms/>} /> 
        <Route path="/e-com" element={<Ecom/>} /> 
        <Route path="/park" element={<Park/>} /> 
        <Route path="/food" element={<Food/>} /> 
        <Route path="/crm" element={<CRM/>} /> 
        <Route path="/privacy-policy" element={<Privacy/>} /> 
        <Route path="/terms-conditions" element={<Terms/>} /> 
         <Route path="/industrialsupport" element={<IndustrialSupport/>} />
           <Route path="/verify-email" element={<VerifyEmail/>} />
              <Route path="/admin-refunds" element={<AdminRefunds/>} />
                <Route path="/cancellation-policy" element={<CancellationPolicy/>} />
              <Route path="/shipping-policy" element={<ShippingPolicy/>} />
                <Route path="/admin/support" element={<AdminSupport/>} />
                <Route path="/blog" element={<Blog/>} />
                    <Route path="/durgapur-bhiringee-more" element={<DurgapurBlog/>} />
         </Routes>
    </Router>
  );
}

export default App;



