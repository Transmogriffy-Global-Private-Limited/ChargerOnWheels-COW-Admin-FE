// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import UserSidebar from '../User_sidebar';
// import UserNavbar from '../User_Navbar';
// import background from "../../../assets/hotels.jpg";
// import { ShoppingCartIcon } from '@heroicons/react/solid';
// import { useNavigate } from 'react-router-dom';


// const BASE_URL_AND_PORT = "https://api.static.ev.transev.site";
// const API_KEY = "mlzuMoRFjdGhcFulLMaVtfwNAHycbBAf";
// const token = localStorage.getItem('auth_token');

// function CartPage() {
//     const [cartItems, setCartItems] = useState([]);
//     const [userId, setUserId] = useState(localStorage.getItem('user_id'));
//     const [productDetails, setProductDetails] = useState({});
//     const [totalAmount, setTotalAmount] = useState(0);
//     const [paymentOption, setPaymentOption] = useState("Cash");
//     const [selectedPaymentOption, setSelectedPaymentOption] = useState({});  // Track payment option per product
//     const [sidebarOpen, setSidebarOpen] = useState(true);
//     const [showPaymentOptions, setShowPaymentOptions] = useState(null);
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [globalPaymentOption, setGlobalPaymentOption] = useState("Cash");
//     const [isAccepted, setIsAccepted] = useState(false);
// const [showPaymentModal, setShowPaymentModal] = useState(false);
// const [isProcessingPayment, setIsProcessingPayment] = useState(false);

//     const [userProfile, setUserProfile] = useState({
//   name: "",
//   email: "",
//   phone: ""
// });

// const [imageIndex, setImageIndex] = useState({});
    
//     const navigate = useNavigate();

//     const toggleSidebar = () => {
//         setSidebarOpen(!sidebarOpen);
//     };
   

//     useEffect(() => {
//         if (!userId) {
//             alert('Please login first');
//             return;
//         }
//         fetchCartItems();
//     }, [userId]);
// useEffect(() => {
//   const fetchUserProfile = async () => {
//     const token = localStorage.getItem("auth_token");

//     if (!token) {
//       navigate("/login");
//       return;
//     }

//     try {
//       const res = await fetch(`${BASE_URL_AND_PORT}/users/profile`, {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "API-KEY": API_KEY,
//         },
//       });

//       const data = await res.json();

//       if (res.ok) {
//         setUserProfile({
//           name: data.user_data?.name || "Customer",
//           email: data.user_data?.email || "",
//           phone: data.user_data?.phone || "",
//         });
//       } else {
//         console.error("Failed to fetch profile");
//       }
//     } catch (err) {
//       console.error("Profile fetch error:", err);
//     }
//   };

//   fetchUserProfile();
// }, [navigate]);

//     const fetchCartItems = async () => {
//         try {
//             const response = await axios.post(
//                 `${BASE_URL_AND_PORT}/cart/getcartdetails`,
//                 { user_id: userId },
//                 {
//                     headers: {
//                         'API-KEY': API_KEY,
//                     },
//                 }
//             );
//             setCartItems(response.data.cart_items);
//             fetchProductDetails(response.data.cart_items);
//         } catch (error) {
//             console.error('Error fetching cart items:', error);
//         }
//     };
//     const fetchUserAddresses = async () => {
//         const token = localStorage.getItem('auth_token');
      
//         try {
//           const response = await fetch(`${BASE_URL_AND_PORT}/users/address`, {
//             method: 'GET',
//             headers: {
//               Authorization: `Bearer ${token}`,
//               'API-KEY': API_KEY,
//               'Content-Type': 'application/json',
//             },
//           });
      
//           const data = await response.json();
//           if (response.ok && data?.length) {
//             setUserAddresses(data); // Store addresses
//           } else {
//             setUserAddresses([]); // No addresses available
//           }
//         } catch (error) {
//           console.error("Error fetching addresses:", error);
//         }
//       };
//       const [userAddresses, setUserAddresses] = useState([]);
//       const [defaultAddress, setDefaultAddress] = useState(null);
      
//       // Set default address after fetching user addresses
//       useEffect(() => {
//         fetchUserAddresses();
//       }, []);
      
//       useEffect(() => {
//         if (userAddresses?.length) {
//           // Find the address with is_default: true
//           const defaultAddr = userAddresses.find(address => address.is_default === true);
//           if (defaultAddr) {
//             setDefaultAddress(defaultAddr); // Set the default address
//           }
//         }
//       }, [userAddresses]);
            
//     const fetchProductDetails = async (cartItems) => {
//         const details = {};
//         let total = 0;

//         for (const item of cartItems) {
//             try {
//                 const response = await axios.get(
//                     `${BASE_URL_AND_PORT}/products/get_by_id/${item.productid}`,
//                     {
//                         headers: {
//                             'Authorization': `Bearer ${token}`,
//                             'API-KEY': API_KEY,
//                         },
//                     }
//                 );
//                 details[item.productid] = response.data;
//                 total += response.data.price * item.quantity;
//             } catch (error) {
//                 console.error('Error fetching product details:', error);
//             }
//         }

//         setProductDetails(details);
//         setTotalAmount(total);
//     };
//     const increaseQuantity = async (productId) => {
//                         try {
//                             const response = await axios.post(
//                                 `${BASE_URL_AND_PORT}/cart/increasequantity`,
//                                 {
//                                     quantity: 1,
//                                     productid: productId,
//                                      user_id: userId 
//                                 },
//                                 {
//                                     headers: {
//                                         'Authorization': `Bearer ${token}`,
//                                         'API-KEY': API_KEY
//                                     }
//                                 }
//                             );
//                             fetchCartItems();
//                         } catch (error) {
//                             if (error.response && error.response.data && error.response.data.message === "No stock available") {
//                                 alert(`No stock available for ${productDetails[productId]?.name || 'this product'}`);
//                             } else {
//                                 console.error('Error increasing quantity:', error);
//                             }
//                         }
//                     };
                
                  
    
//                     const decreaseQuantity = async (productId, currentQuantity) => {
//                       try {
//                         await axios.post(
//                           `${BASE_URL_AND_PORT}/cart/decreasemethods`,
//                           {
//                             quantity: 1,
//                             productid: productId,
//                             user_id: userId,
//                           },
//                           {
//                             headers: {
//                               Authorization: `Bearer ${token}`,
//                               'API-KEY': API_KEY,
//                             },
//                           }
//                         );
                    
//                         if (currentQuantity === 1) {
//                           // Remove the item from UI immediately
//                           setCartItems(prevItems =>
//                             prevItems.filter(item => item.productid !== productId)
//                           );
//                         } else {
//                           // Just decrease and re-fetch
//                           fetchCartItems();
//                         }
//                       } catch (error) {
//                         console.error('Error decreasing quantity:', error);
//                       }
//                     };
                    
  
//                     const removeFromCart = async (productId) => {
//                       try {
//                         const response = await axios.post(
//                           `${BASE_URL_AND_PORT}/cart/removefromcart`,
//                           {
//                             productid: productId,
//                             user_id: userId,
//                           },
//                           {
//                             headers: {
//                               Authorization: `Bearer ${token}`,
//                               'API-KEY': API_KEY,
//                               'Content-Type': 'application/json',
//                             },
//                           }
//                         );
                    
//                         if (response.data) {
//                           alert("✅ Product removed from cart successfully!");
                    
//                           // ✅ Remove the item from local state instead of full reload
//                           setCartItems(prevItems => prevItems.filter(item => item.productid !== productId));
//                         }
//                       } catch (error) {
//                         console.error("❌ Error removing item from cart:", error);
//                         alert("Failed to remove item from cart.");
//                       }
//                     };
                    
                  
//                     const placeOrder = async () => {
//                         try {
//                             if (!cartItems.length) {
//                                 alert("Your cart is empty.");
//                                 return;
//                             }
                    
//                             const defaultAddr = userAddresses.find(address => address.is_default);
//                             if (!defaultAddr) {
//                                 alert("Please set a default delivery address before placing an order.");
//                                 return;
//                             }
                    
//                             const deliveryAddress = `House Building: ${defaultAddr.house_building}, Locality/Street: ${defaultAddr.locality_street}, City: ${defaultAddr.city}, Landmark: ${defaultAddr.landmark}, PO/PS: ${defaultAddr.po_ps}, State: ${defaultAddr.state}, Country: ${defaultAddr.country}, Pin: ${defaultAddr.pin}`;
                    
//                             // Prepare product info
//                             const products = cartItems.map(item => ({
//                                 productid: item.productid,
//                                 quantity: item.quantity
//                             }));
                    
//                             const pricedProducts = cartItems.map(item => {
//                                 const product = productDetails[item.productid];
//                                 return {
//                                     productid: item.productid,
//                                     quantity: item.quantity,
//                                     price: product.price
//                                 };
//                             });
                    
//                             const totalAmount = pricedProducts.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                    
//                             const orderPayload = {
//                                 user_id: userId,
//                                 paymentoption: globalPaymentOption,
//                                 orderstatus: "null",
//                                 deliveryaddress: deliveryAddress,
//                                 products: pricedProducts
//                             };
                    
//                             // 🔁 Handle Cash Payment (No Razorpay)
//                             if (globalPaymentOption === "Cash") {
//                                 const response = await axios.post(`${BASE_URL_AND_PORT}/order/addorder`, orderPayload, {
//                                     headers: { 'API-KEY': API_KEY },
//                                 });
                    
//                                 if (response.data) {
//                                     alert("✅ Order placed successfully via Cash!");
//                                     navigate("/order");
//                                 } else {
//                                     alert("❌ Failed to place Cash order.");
//                                 }
                    
//                                 return;
//                             }
                    
//                             // 🔁 UPI or Card – Use Razorpay
//                             const createPaymentRes = await axios.post(
//                                 `${BASE_URL_AND_PORT}/payments/createpayment`,
//                                 {
//                                     user_id: userId,
//                                     products: products // productid and quantity only
//                                 },
//                                 { headers: { 'API-KEY': API_KEY } }
//                             );
                    
//                             const razorpayOrderId = createPaymentRes.data.order_id;
                    
//                             if (!razorpayOrderId) {
//                                 alert("❌ Failed to create Razorpay order.");
//                                 return;
//                             }
                    
//                             // ✅ Call Razorpay handler with full data
//                             const script = document.createElement('script');
//                             script.src = 'https://checkout.razorpay.com/v1/checkout.js';
//                             script.async = true;
//                             script.onload = () => {
//                                 handlePayment(razorpayOrderId, totalAmount, pricedProducts, orderPayload);
//                             };
//                             document.body.appendChild(script);
                    
//                         } catch (error) {
//                             console.error("❌ Error placing orders:", error);
//                             alert("❌ Something went wrong while placing the order.");
//                         }
//                     };
                   

            
// //     const handlePayment = async (orderId, totalAmount, pricedProducts, orderPayload) => {
// //   const options = {
// //     // key: 'rzp_live_kaJZ4jkMErixqW',
// //     key: 'rzp_test_nzmqxQYhvCH9rD',
// //     amount: totalAmount * 100,
// //     currency: 'INR',
// //     name: 'Transmogrify Global Pvt Ltd',
// //     description: 'Order Payment',
// //     order_id: orderId,

// //     handler: async function (response) {
// //       try {
// //         // 1️⃣ Verify payment
// //         const verifyResponse = await axios.post(
// //           `${BASE_URL_AND_PORT}/payments/verifypayment`,
// //           {
// //             razorpaypaymentid: response.razorpay_payment_id,
// //             user_id: userId,
// //             products: pricedProducts,
// //           },
// //           { headers: { 'API-KEY': API_KEY } }
// //         );

// //         // 2️⃣ Extract razorpay payment id safely
// //         const rzpPaymentId =
// //           verifyResponse?.data?.transactions?.[0]?.razorpaypaymentid;

// //         if (!rzpPaymentId) {
// //           throw new Error("Razorpay payment id not found after verification");
// //         }

// //         // 3️⃣ Add order with NON-NULL rzp_payment_id
// //         const orderRes = await axios.post(
// //           `${BASE_URL_AND_PORT}/order/addorder`,
// //           {
// //             ...orderPayload,
// //             rzp_payment_id: rzpPaymentId, // ✅ NEVER NULL
// //           },
// //           { headers: { 'API-KEY': API_KEY } }
// //         );

// //         if (orderRes.data) {
// //           alert("✅ Payment successful and order placed!");
// //           navigate("/order");
// //         }
// //       } catch (err) {
// //         console.error(err);
// //         alert("❌ Payment verification or order creation failed");
// //       }
// //     },
// //   };

// //   const rzp = new window.Razorpay(options);
// //   rzp.open();
// // };

// const handlePayment = async (
//   razorpayOrderId,
//   totalAmount,
//   pricedProducts,
//   orderPayload
// ) => {
//   const options = {
//      // key: 'rzp_live_kaJZ4jkMErixqW',
//     key: 'rzp_test_nzmqxQYhvCH9rD',
//     amount: totalAmount * 100,
//     currency: 'INR',
//     name: 'Transmogrify Global Pvt Ltd',
//     description: 'Order Payment',
//     order_id: razorpayOrderId,

//     handler: async function (response) {
//       setIsProcessingPayment(true); // 🔄 START LOADER

//       try {
//         // 1️⃣ Verify payment
//         const verifyResponse = await axios.post(
//           `${BASE_URL_AND_PORT}/payments/verifypayment`,
//           {
//             razorpaypaymentid: response.razorpay_payment_id,
//             user_id: userId,
//             products: pricedProducts,
//           },
//           { headers: { 'API-KEY': API_KEY } }
//         );

//         const rzpPaymentId =
//           verifyResponse?.data?.transactions?.[0]?.razorpaypaymentid;

//         if (!rzpPaymentId) {
//           throw new Error("Razorpay payment id not found");
//         }

//         // 2️⃣ Add order
//         const orderRes = await axios.post(
//           `${BASE_URL_AND_PORT}/order/addorder`,
//           {
//             ...orderPayload,
//             rzp_payment_id: rzpPaymentId,
//             rzp_order_id: razorpayOrderId,
//           },
//           { headers: { 'API-KEY': API_KEY } }
//         );

//         if (orderRes.data) {
//           setIsProcessingPayment(false); // ✅ STOP LOADER
//           alert("✅ Payment successful and order placed!");
//           navigate("/order");
//         }
//       } catch (error) {
//         console.error(error);
//         setIsProcessingPayment(false); // ❌ STOP LOADER
//         alert("❌ Payment verification or order creation failed");
//       }
//     },
//   };

//   const rzp = new window.Razorpay(options);
//   rzp.open();
// };

             
//     return (
//         <div
//             className="min-h-screen bg-gradient-to-r from-white-100 via-white-100 to-white-100 bg-cover bg-center bg-fixed"
            
//         >
//             <UserNavbar onToggleSidebar={toggleSidebar} />
//             <div className="flex flex-1">
//                 <UserSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
//                 {/* <div className="container mx-auto p-4 pt-6 mt-10 bg-[#f0f0f0] ml-55"> */}
//                 <div className="w-full px-4 py-6 mt-10 bg-orange sm:max-w-7xl mx-auto">
          
//                    <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-green-600 text-center sm:text-left lg:text-center">
//   Your Cart
// </h2>
 
//                     <div className="flex flex-col">
//                         <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
//                             <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
                          

//                                 <div className="overflow-hidden">
//                                     <table className="min-w-full">
//                                     {cartItems.length > 0 && (
//                                         <thead className="bg-white border-b">
//                                             <tr>
//                                                 <th className="text-sm font-medium text-gray-900 px-6 py-4 text-left">Product</th>
//                                                 <th className="text-sm font-medium text-gray-900 px-6 py-4 text-left">Quantity</th>
//                                                 <th className="text-sm font-medium text-gray-900 px-6 py-4 text-left">Price</th>
//                                                 <th className="text-sm font-medium text-gray-900 px-6 py-4 text-left">Actions</th>
//                                             </tr>
//                                         </thead>
//  )}
//                                        <tbody>
//   {cartItems.length > 0 ? (
//     cartItems.map((item) => (
//       <tr key={item.productid} className="bg-white border-b">
//         {/* <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//           {productDetails[item.productid] && (
//             <div className="flex items-center space-x-4">
//               <img
//                 src={productDetails[item.productid].image_paths[imageIndex[item.productid] || 0]}
//                 alt={productDetails[item.productid].name}
//                 className="w-20 h-20 object-cover rounded"
//               />
//               <span>{productDetails[item.productid].name}</span>
             
//             </div>
//           )}
//         </td> */}
// <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//   {productDetails[item.productid] && (
//     <div className="flex flex-col items-center space-y-2">
//       <img
//         src={productDetails[item.productid].image_paths[imageIndex[item.productid] || 0]}
//         alt={productDetails[item.productid].name}
//         className="w-20 h-20 object-cover rounded"
//       />
//       <span className="text-center">{productDetails[item.productid].name}</span>
//     </div>
//   )}
// </td>

//         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//           <div className="flex items-center">
          
//            <button
//   className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-3 rounded"
//   onClick={() => decreaseQuantity(item.productid, item.quantity)}
// >
//   -
// </button>


//             <span className="px-4">{item.quantity}</span>
//             <button
//               className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-3 rounded"
//               onClick={() => increaseQuantity(item.productid)}
//             >
//               +
//             </button>
//           </div>
//         </td>

//         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//           ₹{item.price}
//         </td>

//         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//           <button
//             className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded flex items-center"
//             onClick={() => removeFromCart(item.productid)}
//           >
//             Remove Cart
//             <ShoppingCartIcon className="h-5 w-5 ml-2" />
//           </button>
//         </td>
//       </tr>
//     ))
//   ) : (
//     <tr>
//       <td colSpan="4" className="text-center py-6 text-gray-500">
//         No items in your cart.
//       </td>
//     </tr>
//   )}
// </tbody>

//                                     </table>
//                                     <div className="mt-6 text-center bg-white p-4 rounded shadow-lg">
           
//             {cartItems.length > 0 && (
//     <button
//         className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded shadow"
//         onClick={() => setIsModalOpen(true)}
//     >
//          Place Order
//     </button>
// )}
// {isProcessingPayment && (
//   <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
//     <div className="bg-white p-6 rounded-xl shadow-2xl flex flex-col items-center">
      
//       {/* 🔄 Spinner */}
//       <svg
//         className="animate-spin h-12 w-12 text-green-600 mb-4"
//         xmlns="http://www.w3.org/2000/svg"
//         fill="none"
//         viewBox="0 0 24 24"
//       >
//         <circle
//           className="opacity-25"
//           cx="12"
//           cy="12"
//           r="10"
//           stroke="currentColor"
//           strokeWidth="4"
//         />
//         <path
//           className="opacity-75"
//           fill="currentColor"
//           d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
//         />
//       </svg>

//       <p className="text-gray-700 font-semibold text-sm">
//         Processing your payment, please wait...
//       </p>
//     </div>
//   </div>
// )}

//         </div>
      
//   {isModalOpen && (
//   <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
//     <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md mx-4">

//       {/* 🔴 DISCLAIMER */}
//       <div className="border border-red-300 bg-red-50 rounded-lg p-4 mb-4">
//         <h3 className="text-red-700 font-bold text-lg mb-2">⚠️ Disclaimer</h3>
//         <p className="text-sm text-red-700 leading-relaxed">
//           No Return & No Cancellation Policy.
//           <br /><br />
//           Once an order is placed and accepted by us, it cannot be cancelled or
//           returned. Please ensure all product details are reviewed carefully
//           before placing your order. By confirming the order, you agree to this
//           policy.
//         </p>
//       </div>

//       {/* ✅ ACCEPT CHECKBOX */}
//       <div className="flex items-start gap-2 mb-4">
//         <input
//           type="checkbox"
//           checked={isAccepted}
//           onChange={(e) => setIsAccepted(e.target.checked)}
//           className="mt-1 h-4 w-4 accent-red-600"
//         />
//         {/* <p className="text-sm text-gray-700">
//           I accept the <span className="font-semibold">No Return & No Cancellation Policy</span>
//         </p> */}
//         <p className="text-sm text-gray-700">
//   I accept the{" "}
//   <span className="font-semibold">
//     <a
//       href="/cancellation-policy"
//       className="text-blue-600 underline hover:text-blue-800"
//     >
//       Refunds and Cancellations Policy
//     </a>
//   </span>
// </p>

//       </div>

//       <div className="flex justify-end gap-3">
//         <button
//           className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
//           onClick={() => {
//             setIsModalOpen(false);
//             setIsAccepted(false);
//           }}
//         >
//           Cancel
//         </button>

//         <button
//           disabled={!isAccepted}
//           className={`px-4 py-2 rounded text-white font-semibold ${
//             isAccepted
//               ? 'bg-green-600 hover:bg-green-700'
//               : 'bg-gray-400 cursor-not-allowed'
//           }`}
//           onClick={() => {
//             setIsModalOpen(false);
//             setShowPaymentModal(true);
//           }}
//         >
//           Continue
//         </button>
//       </div>
//     </div>
//   </div>
// )}
// {showPaymentModal && (
//   <div
//     className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40"
//     style={{
//       backgroundImage: `url(${background})`,
//       backgroundSize: 'cover',
//       backgroundPosition: 'center',
//     }}
//   >
//     <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md mx-4">

//       <h2 className="text-lg font-bold mb-4 text-gray-800">
//         Select Payment Method
//       </h2>

//       <select
//         className="w-full border px-4 py-2 rounded mb-4 focus:ring-2 focus:ring-green-500"
//         value={globalPaymentOption}
//         onChange={(e) => setGlobalPaymentOption(e.target.value)}
//       >
//         <option value="">Select Payment Option</option>
//         <option value="UPI">UPI</option>
//         <option value="Card">Card</option>
//       </select>

//       <div className="flex justify-end gap-3">
//         <button
//           className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
//           onClick={() => setShowPaymentModal(false)}
//         >
//           Cancel
//         </button>

//         {(globalPaymentOption === "UPI" ||
//           globalPaymentOption === "Card") && (
//           <button
//             className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded font-bold"
//             onClick={() => {
//               setShowPaymentModal(false);
//               setIsAccepted(false);
//               placeOrder();
//             }}
//           >
//             Confirm & Pay
//           </button>
//         )}
//       </div>
//     </div>
//   </div>
// )}





       



//                                     <div className="bg-white shadow-lg rounded-lg p-6 w-full md:w-96 ml-auto mb-150">
//   <div className="flex justify-between items-center mb-4">
//     <h3 className="font-semibold text-xl text-gray-800">Delivery Address</h3>
//     <button
//       onClick={() => navigate('/profile')}
//       className="text-sm text-blue-600 hover:text-blue-800 underline "
//     >
//       Change
//     </button>
//   </div>

//   {defaultAddress ? (
//     <div className="space-y-1 text-sm text-gray-700">
//       <p><strong>House Building:</strong> {defaultAddress.house_building}</p>
//       <p><strong>Locality/Street:</strong> {defaultAddress.locality_street}</p>
//       <p><strong>Land Mark:</strong> {defaultAddress.landmark}</p>
//       <p><strong>City:</strong> {defaultAddress.city}</p>
//       <p><strong>State:</strong> {defaultAddress.state}</p>
//       <p><strong>Country:</strong> {defaultAddress.country}</p>
//       <p><strong>Pin:</strong> {defaultAddress.pin}</p>
//     </div>
//   ) : (
//     <p className="text-gray-500 text-sm">No default address set.</p>
//   )}
// </div>


//                                 </div>
                                
//                             </div>
                            
//                         </div>
                        
//                     </div>
                    
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default CartPage;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserSidebar from '../User_sidebar';
import UserNavbar from '../User_Navbar';
import background from "../../../assets/hotels.jpg";
import { ShoppingCartIcon, TrashIcon, CreditCardIcon, CashIcon, ShieldCheckIcon, TruckIcon, ClockIcon, XIcon } from '@heroicons/react/solid';
import { FaRupeeSign, FaMinus, FaPlus, FaMapMarkerAlt, FaUser, FaEnvelope, FaPhoneAlt, FaCheckCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const BASE_URL_AND_PORT = "https://api.static.ev.transev.site";
const API_KEY = "mlzuMoRFjdGhcFulLMaVtfwNAHycbBAf";

function CartPage() {
    const [cartItems, setCartItems] = useState([]);
    const [userId, setUserId] = useState(localStorage.getItem('user_id'));
    const [productDetails, setProductDetails] = useState({});
    const [totalAmount, setTotalAmount] = useState(0);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [globalPaymentOption, setGlobalPaymentOption] = useState("UPI");
    const [isAccepted, setIsAccepted] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
    const [couponCode, setCouponCode] = useState("");
    const [discount, setDiscount] = useState(0);
    const [shippingCharge, setShippingCharge] = useState(0);
    const [savedCards, setSavedCards] = useState([]);
    const [selectedCard, setSelectedCard] = useState(null);
    const [showAddCardModal, setShowAddCardModal] = useState(false);
    const [suggestedProducts, setSuggestedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [removingItem, setRemovingItem] = useState(null);
    const [increasingItem, setIncreasingItem] = useState(null);
    const [decreasingItem, setDecreasingItem] = useState(null);
    const [showRemoveConfirm, setShowRemoveConfirm] = useState(null);
    const [toast, setToast] = useState(null);
    const [isMobile, setIsMobile] = useState(false);
    const [razorpayOrderId, setRazorpayOrderId] = useState(null);
    const [pricedProducts, setPricedProducts] = useState([]);

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

    const [userProfile, setUserProfile] = useState({
        name: "",
        email: "",
        phone_number: ""
    });

    const [imageIndex, setImageIndex] = useState({});
    const navigate = useNavigate();

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    // Show toast message
    const showToast = (message, type = 'error') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    // Function to refresh cart count in navbar
    const refreshCartCount = () => {
        window.dispatchEvent(new CustomEvent('cartUpdated'));
    };

    useEffect(() => {
        if (!userId) {
            alert('Please login first');
            navigate('/login');
            return;
        }
        fetchCartItems();
        fetchSuggestedProducts();
    }, [userId]);

    useEffect(() => {
        const fetchUserProfile = async () => {
            const token = localStorage.getItem("auth_token");
            if (!token) {
                navigate("/login");
                return;
            }
            try {
                const res = await fetch(`${BASE_URL_AND_PORT}/users/profile`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "API-KEY": API_KEY,
                    },
                });
                const data = await res.json();
                if (res.ok) {
                    setUserProfile({
                        name: data.user_data?.name || "Customer",
                        email: data.user_data?.email || "",
                        phone_number: data.user_data?.phone_number || "",
                    });
                }
            } catch (err) {
                console.error("Profile fetch error:", err);
            }
        };
        fetchUserProfile();
    }, [navigate]);

    
const fetchCartItems = async () => {
    setLoading(true);
    try {
        const token = localStorage.getItem('auth_token');
        const response = await axios.post(
            `${BASE_URL_AND_PORT}/cart/getcartdetails`,
            { user_id: userId },
            { headers: { 'API-KEY': API_KEY, Authorization: `Bearer ${token}` } }
        );
        
        console.log('Cart API Response:', response.data); // Debug log
        
        // Map the response to ensure quantity field exists
        if (response.data && response.data.cart_items) {
            const mappedItems = response.data.cart_items.map(item => ({
                ...item,
                // If backend returns 'cart_quantity', map it to 'quantity'
                quantity: item.quantity || item.cart_quantity || 1
            }));
            
            console.log('Mapped Cart Items:', mappedItems); // Debug log
            
            setCartItems(mappedItems);
            await fetchProductDetails(mappedItems);
        } else {
            setCartItems([]);
            setProductDetails({});
        }
    } catch (error) {
        console.error('Error fetching cart items:', error);
        if (error.response?.status === 401) {
            localStorage.removeItem('auth_token');
            navigate('/login');
        }
        showToast('❌ Failed to load cart items', 'error');
    } finally {
        setLoading(false);
    }
};
    const fetchSuggestedProducts = async () => {
        try {
            const token = localStorage.getItem('auth_token');
            const response = await axios.get(`${BASE_URL_AND_PORT}/products/all`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'API-KEY': API_KEY,
                },
            });
            setSuggestedProducts(response.data.slice(0, 4));
        } catch (error) {
            console.error('Error fetching suggested products:', error);
        }
    };

    const fetchProductDetails = async (cartItems) => {
    const details = {};
    let total = 0;
    const token = localStorage.getItem('auth_token');
    
    for (const item of cartItems) {
        try {
            const response = await axios.get(
                `${BASE_URL_AND_PORT}/products/get_by_id/${item.productid}`,
                { headers: { 'Authorization': `Bearer ${token}`, 'API-KEY': API_KEY } }
            );
            
            // Store product details WITH quantity
            details[item.productid] = {
                ...response.data,
                quantity: item.quantity || 1 // Use the quantity from cartItems
            };
            total += response.data.price * (item.quantity || 1);
        } catch (error) {
            console.error('Error fetching product details:', error);
        }
    }
    setProductDetails(details);
    setTotalAmount(total);
    setShippingCharge(0);
};

    const fetchUserAddresses = async () => {
        const token = localStorage.getItem('auth_token');
        try {
            const response = await fetch(`${BASE_URL_AND_PORT}/users/address`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'API-KEY': API_KEY,
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            if (response.ok && data?.length) {
                setUserAddresses(data);
            } else {
                setUserAddresses([]);
            }
        } catch (error) {
            console.error("Error fetching addresses:", error);
        }
    };

    const [userAddresses, setUserAddresses] = useState([]);
    const [defaultAddress, setDefaultAddress] = useState(null);

    useEffect(() => {
        fetchUserAddresses();
    }, []);

    useEffect(() => {
        if (userAddresses?.length) {
            const defaultAddr = userAddresses.find(address => address.is_default === true);
            if (defaultAddr) {
                setDefaultAddress(defaultAddr);
            }
        }
    }, [userAddresses]);

    useEffect(() => {
        let newTotal = 0;
        cartItems.forEach(item => {
            const product = productDetails[item.productid];
            if (product) {
                newTotal += product.price * item.quantity;
            }
        });
        setTotalAmount(newTotal);
    }, [cartItems, productDetails]);

    const increaseQuantity = async (productId) => {
        setIncreasingItem(productId);
        try {
            const token = localStorage.getItem('auth_token');
            await axios.post(
                `${BASE_URL_AND_PORT}/cart/increasequantity`,
                { quantity: 1, productid: productId, user_id: userId },
                { headers: { 'Authorization': `Bearer ${token}`, 'API-KEY': API_KEY } }
            );
            
            await fetchCartItems();
            refreshCartCount();
            
            const product = productDetails[productId];
            if (product) {
                showToast(`✓ Quantity increased for ${product.name}`, 'success');
            }
        } catch (error) {
            console.error('Error increasing quantity:', error);
            if (error.response?.data?.detail === "Product is out of stock" || 
                error.response?.data?.message === "No stock available") {
                showToast(`❌ Out of stock! Cannot add more ${productDetails[productId]?.name || 'this product'}`, 'error');
            } else {
                showToast(`❌ Failed to increase quantity for ${productDetails[productId]?.name || 'product'}`, 'error');
            }
        } finally {
            setIncreasingItem(null);
        }
    };

    const decreaseQuantity = async (productId, currentQuantity) => {
        if (currentQuantity === 1) {
            setShowRemoveConfirm({
                productId: productId,
                productName: productDetails[productId]?.name || 'this product'
            });
            return;
        }
        
        setDecreasingItem(productId);
        try {
            const token = localStorage.getItem('auth_token');
            await axios.post(
                `${BASE_URL_AND_PORT}/cart/decreasemethods`,
                { quantity: 1, productid: productId, user_id: userId },
                { headers: { Authorization: `Bearer ${token}`, 'API-KEY': API_KEY } }
            );
            
            await fetchCartItems();
            refreshCartCount();
            
            const product = productDetails[productId];
            if (product) {
                showToast(`✓ Quantity decreased for ${product.name}`, 'success');
            }
        } catch (error) {
            console.error('Error decreasing quantity:', error);
            showToast(`❌ Failed to decrease quantity for ${productDetails[productId]?.name || 'product'}`, 'error');
        } finally {
            setDecreasingItem(null);
        }
    };

    const confirmRemoveFromCart = async () => {
        if (!showRemoveConfirm) return;
        
        const { productId, productName } = showRemoveConfirm;
        setRemovingItem(productId);
        setShowRemoveConfirm(null);
        
        try {
            const token = localStorage.getItem('auth_token');
            await axios.post(
                `${BASE_URL_AND_PORT}/cart/removefromcart`,
                { productid: productId, user_id: userId },
                { headers: { Authorization: `Bearer ${token}`, 'API-KEY': API_KEY } }
            );
            
            setCartItems(prevItems => prevItems.filter(item => item.productid !== productId));
            setProductDetails(prevDetails => {
                const newDetails = { ...prevDetails };
                delete newDetails[productId];
                return newDetails;
            });
            
            refreshCartCount();
            showToast(`✓ ${productName} removed from cart`, 'success');
        } catch (error) {
            console.error("Error removing item from cart:", error);
            showToast(`❌ Failed to remove ${productName} from cart`, 'error');
        } finally {
            setRemovingItem(null);
        }
    };

    const removeFromCart = async (productId) => {
        const productName = productDetails[productId]?.name || 'this product';
        setShowRemoveConfirm({
            productId: productId,
            productName: productName
        });
    };

    const applyCoupon = () => {
        if (couponCode === "SAVE10") {
            setDiscount(totalAmount * 0.1);
            showToast("🎉 Coupon applied! 10% discount added.", 'success');
        } else if (couponCode === "SAVE20") {
            setDiscount(totalAmount * 0.2);
            showToast("🎉 Coupon applied! 20% discount added.", 'success');
        } else {
            showToast("❌ Invalid coupon code", 'error');
        }
    };

    // Updated placeOrder function with proper payment flow
    const placeOrder = async () => {
        try {
            if (!cartItems.length) {
                showToast("Your cart is empty", 'error');
                return;
            }

            const defaultAddr = userAddresses.find(address => address.is_default);
            if (!defaultAddr) {
                showToast("Please set a default delivery address before placing an order.", 'error');
                return;
            }

            const deliveryAddress = `House: ${defaultAddr.house_building}, Street: ${defaultAddr.locality_street}, City: ${defaultAddr.city}, Landmark: ${defaultAddr.landmark}, State: ${defaultAddr.state}, Pin: ${defaultAddr.pin}`;

            // Prepare products array for payment
            const productsForPayment = cartItems.map(item => ({
                productid: item.productid,
                quantity: item.quantity
            }));

            // Store priced products for order creation
            const pricedProductsData = cartItems.map(item => {
                const product = productDetails[item.productid];
                return { 
                    productid: item.productid, 
                    quantity: item.quantity, 
                    price: product.price 
                };
            });
            setPricedProducts(pricedProductsData);

            const finalAmount = totalAmount - discount;

            // Cash on Delivery flow
            if (globalPaymentOption === "Cash") {
                const orderPayload = {
                    user_id: userId,
                    paymentoption: globalPaymentOption,
                    orderstatus: "pending",
                    deliveryaddress: deliveryAddress,
                    products: pricedProductsData,
                    total_amount: finalAmount,
                    shipping_charge: 0
                };

                const response = await axios.post(`${BASE_URL_AND_PORT}/order/addorder`, orderPayload, {
                    headers: { 'API-KEY': API_KEY },
                });
                
                if (response.data) {
                    showToast("✅ Order placed successfully via Cash!", 'success');
                    refreshCartCount();
                    setTimeout(() => navigate("/order"), 1500);
                }
                return;
            }

            // Online Payment Flow (UPI or Card)
            // Step 1: Create Razorpay Order
            const createPaymentRes = await axios.post(
                `${BASE_URL_AND_PORT}/payments/createpayment`,
                { 
                    user_id: userId, 
                    products: productsForPayment 
                },
                { headers: { 'API-KEY': API_KEY } }
            );

            const razorpayOrderId = createPaymentRes.data.order_id;
            if (!razorpayOrderId) {
                showToast("❌ Failed to create Razorpay order.", 'error');
                return;
            }

            setRazorpayOrderId(razorpayOrderId);

            // Step 2: Load Razorpay script and initialize payment
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.async = true;
            script.onload = () => {
                handlePayment(razorpayOrderId, finalAmount, productsForPayment, pricedProductsData, deliveryAddress);
            };
            document.body.appendChild(script);

        } catch (error) {
            console.error("Error placing orders:", error);
            showToast("Something went wrong while placing the order.", 'error');
        }
    };

    // Updated handlePayment function with proper verification
    const handlePayment = async (razorpayOrderId, finalAmount, productsForPayment, pricedProductsData, deliveryAddress) => {
        const options = {
            key: 'rzp_test_nzmqxQYhvCH9rD', // Replace with your actual key
            amount: finalAmount * 100, // Amount in paise
            currency: 'INR',
            name: 'Transmogrify Global Pvt Ltd',
            description: 'Order Payment',
            order_id: razorpayOrderId,
            prefill: {
                name: userProfile.name,
                email: userProfile.email,
                contact: userProfile.phone_number
            },
            theme: {
                color: '#2563eb'
            },
            handler: async function (response) {
                setIsProcessingPayment(true);
                
                try {
                    // IMPORTANT: Send complete verification data matching backend schema
                    const verificationData = {
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_signature: response.razorpay_signature,
                        user_id: userId,
                        products: productsForPayment // Send products array for verification
                    };

                    console.log("🔐 Verification Data:", verificationData);

                    // Step 1: Verify payment with Razorpay
                    const verifyResponse = await axios.post(
                        `${BASE_URL_AND_PORT}/payments/verifypayment`,
                        verificationData,
                        { headers: { 'API-KEY': API_KEY } }
                    );

                    console.log("✅ Verification Response:", verifyResponse.data);

                    if (!verifyResponse.data.transactions || verifyResponse.data.transactions.length === 0) {
                        throw new Error("Payment verification failed - No transactions found");
                    }

                    // Step 2: Create order after successful verification
                    const orderPayload = {
                        user_id: userId,
                        paymentoption: globalPaymentOption,
                        orderstatus: "pending",
                        deliveryaddress: deliveryAddress,
                        products: pricedProductsData,
                        total_amount: finalAmount,
                        shipping_charge: 0,
                        rzp_payment_id: response.razorpay_payment_id,
                        rzp_order_id: response.razorpay_order_id
                    };

                    const orderResponse = await axios.post(
                        `${BASE_URL_AND_PORT}/order/addorder`,
                        orderPayload,
                        { headers: { 'API-KEY': API_KEY } }
                    );

                    setIsProcessingPayment(false);
                    showToast("✅ Payment successful and order placed!", 'success');
                    refreshCartCount();
                    
                    // Clear cart and navigate to orders
                    setTimeout(() => {
                        navigate("/order");
                    }, 1500);

                } catch (error) {
                    console.error("❌ Payment Verification Error:", error);
                    setIsProcessingPayment(false);
                    
                    if (error.response?.data?.detail) {
                        showToast(`❌ ${error.response.data.detail}`, 'error');
                    } else {
                        showToast("❌ Payment verification or order creation failed", 'error');
                    }
                }
            },
            modal: {
                ondismiss: function() {
                    setIsProcessingPayment(false);
                    showToast("Payment cancelled", 'error');
                }
            }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
    };

    const subtotal = totalAmount;
    const finalTotal = subtotal - discount;

    // Loading Skeleton Component
    const LoadingSkeleton = () => (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 md:p-8 space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex flex-col sm:flex-row items-center gap-4 animate-pulse">
                        <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>
                        <div className="flex-1 w-full">
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                        <div className="w-24 h-8 bg-gray-200 rounded"></div>
                        <div className="w-16 h-8 bg-gray-200 rounded"></div>
                    </div>
                ))}
            </div>
        </div>
    );

    // Mobile Cart Item Component
    const MobileCartItem = ({ item }) => {
        const product = productDetails[item.productid];
        if (!product) return null;
        
        const itemTotal = product.price * item.quantity;
        
        return (
            <div className="bg-white rounded-xl shadow-sm mb-4 p-4">
                <div className="flex gap-4">
                    <img
                        src={product.image_paths?.[0] || 'https://via.placeholder.com/80'}
                        alt={product.name}
                        className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 text-sm mb-1">{product.name}</h3>
                        <p className="text-xs text-gray-500 mb-2">{product.model}</p>
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-xs text-gray-400">Price per item</p>
                                <p className="font-bold text-blue-600 text-sm">₹{product.price?.toLocaleString()}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-gray-400">Total</p>
                                <p className="font-bold text-gray-800">₹{itemTotal.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => decreaseQuantity(item.productid, item.quantity)}
                            disabled={decreasingItem === item.productid || increasingItem === item.productid}
                            className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition disabled:opacity-50"
                        >
                            {decreasingItem === item.productid ? (
                                <div className="w-3 h-3 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <FaMinus size={12} />
                            )}
                        </button>
                        <span className="font-semibold w-8 text-center">{item.quantity}</span>
                        <button
                            onClick={() => increaseQuantity(item.productid)}
                            disabled={increasingItem === item.productid || decreasingItem === item.productid}
                            className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition disabled:opacity-50"
                        >
                            {increasingItem === item.productid ? (
                                <div className="w-3 h-3 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <FaPlus size={12} />
                            )}
                        </button>
                    </div>
                    <button
                        onClick={() => removeFromCart(item.productid)}
                        disabled={removingItem === item.productid}
                        className="text-red-500 hover:text-red-700 transition"
                    >
                        {removingItem === item.productid ? (
                            <div className="w-5 h-5 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <TrashIcon className="h-5 w-5" />
                        )}
                    </button>
                </div>
                {item.quantity === 1 && (
                    <p className="text-xs text-orange-500 mt-2 text-center">Click - to remove item</p>
                )}
            </div>
        );
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
                    <div className="p-3 md:p-4 lg:p-6 xl:p-8">
                        {/* Toast Notification */}
                        {toast && (
                            <div className={`fixed top-20 right-3 md:right-4 z-50 animate-slideIn ${
                                toast.type === 'success' ? 'bg-green-500' : 
                                toast.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
                            } text-white px-4 md:px-6 py-2 md:py-3 rounded-lg shadow-lg flex items-center gap-2 text-sm md:text-base`}>
                                {toast.type === 'success' ? '✓' : toast.type === 'error' ? '✗' : 'ℹ'}
                                {toast.message}
                            </div>
                        )}

                        {/* Header */}
                        <div className="mb-4 md:mb-6 lg:mb-8">
                            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800">Shopping Cart</h1>
                            <p className="text-sm md:text-base text-gray-500 mt-1">Review and manage your items</p>
                        </div>

                        {loading ? (
                            <LoadingSkeleton />
                        ) : cartItems.length === 0 ? (
                            <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 text-center">
                                <div className="text-5xl md:text-6xl mb-4">🛒</div>
                                <h2 className="text-xl md:text-2xl font-semibold text-gray-700 mb-2">Your cart is empty</h2>
                                <p className="text-sm md:text-base text-gray-500 mb-6">Looks like you haven't added any items yet</p>
                                <button
                                    onClick={() => navigate('/products')}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 md:px-6 py-2.5 md:py-3 rounded-lg font-semibold transition text-sm md:text-base"
                                >
                                    Continue Shopping
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col lg:flex-row gap-4 md:gap-6 lg:gap-8">
                                {/* Cart Items Section */}
                                <div className="lg:w-2/3">
                                    {/* Mobile View */}
                                    <div className="block lg:hidden">
                                        {cartItems.map((item) => (
                                            <MobileCartItem key={item.productid} item={item} />
                                        ))}
                                    </div>

                                    {/* Desktop Table View */}
                                    <div className="hidden lg:block bg-white rounded-2xl shadow-sm overflow-hidden">
                                        <div className="overflow-x-auto">
                                            <table className="w-full">
                                                <thead className="bg-gray-50 border-b border-gray-200">
                                                    <tr>
                                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Product</th>
                                                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">Quantity</th>
                                                        <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">Price</th>
                                                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {cartItems.map((item) => {
                                                        const product = productDetails[item.productid];
                                                        if (!product) return null;
                                                        const itemTotal = product.price * item.quantity;
                                                        
                                                        return (
                                                            <tr key={item.productid} className="border-b border-gray-100 hover:bg-gray-50 transition">
                                                                <td className="px-6 py-4">
                                                                    <div className="flex items-center gap-4">
                                                                        <img
                                                                            src={product.image_paths?.[0] || 'https://via.placeholder.com/80'}
                                                                            alt={product.name}
                                                                            className="w-16 h-16 object-cover rounded-lg"
                                                                        />
                                                                        <div>
                                                                            <h3 className="font-semibold text-gray-800">{product.name}</h3>
                                                                            <p className="text-sm text-gray-500">{product.model}</p>
                                                                            <p className="text-xs text-gray-400 mt-1">₹{product.price?.toLocaleString()} each</p>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4">
                                                                    <div className="flex items-center justify-center gap-3">
                                                                        <button
                                                                            onClick={() => decreaseQuantity(item.productid, item.quantity)}
                                                                            disabled={decreasingItem === item.productid || increasingItem === item.productid}
                                                                            className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition disabled:opacity-50 disabled:cursor-not-allowed"
                                                                            title="Decrease quantity"
                                                                        >
                                                                            {decreasingItem === item.productid ? (
                                                                                <div className="w-3 h-3 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                                                                            ) : (
                                                                                <FaMinus size={12} />
                                                                            )}
                                                                        </button>
                                                                        <span className="font-semibold w-8 text-center">{item.quantity}</span>
                                                                        <button
                                                                            onClick={() => increaseQuantity(item.productid)}
                                                                            disabled={increasingItem === item.productid || decreasingItem === item.productid}
                                                                            className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition disabled:opacity-50 disabled:cursor-not-allowed"
                                                                            title="Increase quantity"
                                                                        >
                                                                            {increasingItem === item.productid ? (
                                                                                <div className="w-3 h-3 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                                                                            ) : (
                                                                                <FaPlus size={12} />
                                                                            )}
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4 text-right">
                                                                    <span className="font-bold text-blue-600 text-lg">₹{itemTotal.toLocaleString()}</span>
                                                                </td>
                                                                <td className="px-6 py-4 text-center">
                                                                    <button
                                                                        onClick={() => removeFromCart(item.productid)}
                                                                        disabled={removingItem === item.productid}
                                                                        className="text-red-500 hover:text-red-700 transition disabled:opacity-50"
                                                                        title="Remove item"
                                                                    >
                                                                        {removingItem === item.productid ? (
                                                                            <div className="w-5 h-5 border-2 border-red-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
                                                                        ) : (
                                                                            <TrashIcon className="h-5 w-5" />
                                                                        )}
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    {/* Suggested Products - Mobile Optimized */}
                                    <div className="mt-6 md:mt-8">
                                        <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4">You May Also Like</h3>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
                                            {suggestedProducts.map((product) => (
                                                <div 
                                                    key={product.id} 
                                                    className="bg-white rounded-xl shadow-sm p-2 md:p-3 hover:shadow-md transition cursor-pointer" 
                                                    onClick={() => navigate(`/products`)}
                                                >
                                                    <img 
                                                        src={product.image_paths?.[0]} 
                                                        alt={product.name} 
                                                        className="w-full h-20 md:h-24 object-contain mb-2" 
                                                    />
                                                    <p className="text-xs font-medium text-gray-700 truncate">{product.name}</p>
                                                    <p className="text-xs text-blue-600 font-bold">₹{product.price?.toLocaleString()}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Order Summary Section - Responsive */}
                                <div className="lg:w-1/3">
                                    <div className="bg-white rounded-2xl shadow-sm p-4 md:p-5 lg:p-6 sticky top-20 md:top-24">
                                        <h3 className="text-base md:text-lg font-bold text-gray-800 mb-3 md:mb-4">Order Summary</h3>
                                        
                                        {/* User Info - Responsive */}
                                        <div className="bg-gray-50 rounded-lg p-3 md:p-4 mb-3 md:mb-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <FaUser className="text-gray-400" size={12} />
                                                <span className="text-xs md:text-sm text-gray-600 truncate">{userProfile.name}</span>
                                            </div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <FaEnvelope className="text-gray-400" size={12} />
                                                <span className="text-xs md:text-sm text-gray-600 truncate">{userProfile.email}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <FaPhoneAlt className="text-gray-400" size={12} />
                                                <span className="text-xs md:text-sm text-gray-600">{userProfile.phone_number}</span>
                                            </div>
                                        </div>

                                        {/* Delivery Address - Responsive */}
                                        <div className="border-b border-gray-200 pb-3 md:pb-4 mb-3 md:mb-4">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="font-semibold text-gray-700 text-sm md:text-base">Delivery Address</span>
                                                <button onClick={() => navigate('/profile')} className="text-xs text-blue-600 hover:underline">Change</button>
                                            </div>
                                            {defaultAddress ? (
                                                <div className="flex gap-2 text-xs md:text-sm text-gray-600">
                                                    <FaMapMarkerAlt className="text-gray-400 mt-0.5 flex-shrink-0" size={12} />
                                                    <span className="break-words">{defaultAddress.house_building}, {defaultAddress.locality_street}, {defaultAddress.city}, {defaultAddress.state} - {defaultAddress.pin}</span>
                                                </div>
                                            ) : (
                                                <p className="text-xs md:text-sm text-gray-500">No default address set</p>
                                            )}
                                        </div>

                                        {/* Price Breakdown - Responsive */}
                                        <div className="space-y-2 md:space-y-3 mb-3 md:mb-4">
                                            <div className="flex justify-between text-gray-600 text-sm md:text-base">
                                                <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                                                <span>₹{subtotal.toLocaleString()}</span>
                                            </div>
                                            {discount > 0 && (
                                                <div className="flex justify-between text-green-600 text-sm md:text-base">
                                                    <span>Discount</span>
                                                    <span>-₹{discount.toLocaleString()}</span>
                                                </div>
                                            )}
                                            <div className="flex justify-between text-gray-600 text-sm md:text-base">
                                                <span>Shipping</span>
                                                <span className="text-green-600 font-semibold">Free</span>
                                            </div>
                                            <div className="border-t border-gray-200 pt-2 md:pt-3">
                                                <div className="flex justify-between font-bold text-gray-800">
                                                    <span className="text-sm md:text-base">Total</span>
                                                    <span className="text-lg md:text-xl text-blue-600">₹{finalTotal.toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Coupon Code - Responsive */}
                                        <div className="mb-3 md:mb-4">
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    placeholder="Coupon code"
                                                    value={couponCode}
                                                    onChange={(e) => setCouponCode(e.target.value)}
                                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                                />
                                                <button
                                                    onClick={applyCoupon}
                                                    className="px-3 md:px-4 py-2 bg-gray-800 text-white rounded-lg text-xs md:text-sm font-semibold hover:bg-gray-900 transition"
                                                >
                                                    Apply
                                                </button>
                                            </div>
                                        </div>

                                        {/* Delivery Info - Responsive */}
                                        <div className="bg-green-50 rounded-lg p-3 mb-3 md:mb-4">
                                            <div className="flex items-center gap-2 text-xs md:text-sm text-green-700">
                                                <TruckIcon className="h-3 w-3 md:h-4 md:w-4" />
                                                <span className="font-semibold">Free Shipping on all orders!</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs md:text-sm text-green-700 mt-1">
                                                <ClockIcon className="h-3 w-3 md:h-4 md:w-4" />
                                                <span>Estimated delivery: 5-7 business days</span>
                                            </div>
                                        </div>

                                        {/* Place Order Button - Responsive */}
                                        {/* <button
                                            onClick={() => setIsModalOpen(true)}
                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 md:py-3 rounded-lg font-semibold transition duration-200 flex items-center justify-center gap-2 text-sm md:text-base"
                                        >
                                            <ShoppingCartIcon className="h-4 w-4 md:h-5 md:w-5" />
                                            Proceed to Checkout
                                        </button> */}
                                        <button
    onClick={() => setIsModalOpen(true)}
    className="w-full bg-gray-400 cursor-not-allowed py-2.5 md:py-3 rounded-lg font-semibold flex items-center justify-center gap-2 text-sm md:text-base opacity-70"
    disabled
>
    <ShoppingCartIcon className="h-4 w-4 md:h-5 md:w-5" />
    Technical Issue - Try Again Later
</button>

<div className="mt-3 text-center">
    <p className="text-xs md:text-sm text-gray-500 mb-2">Having trouble placing order?</p>
    <button
        onClick={() => window.location.href = 'mailto:tgwbin@gmail.com?subject=Order%20Placement%20Issue&body=Hello%20Team,%0A%0AI%20am%20facing%20issues%20while%20placing%20my%20order.%20Please%20assist%20me.%0A%0AOrder%20Details:%0A-%20Product:%20%0A-%20Quantity:%20%0A-%20Issue%20Description:%20%0A%0AThank%20you.'}
        className="text-blue-600 hover:text-blue-700 text-xs md:text-sm font-medium underline transition"
    >
        Contact Sales Team →
    </button>
</div> 

                                        {/* Secure Payment Badge - Responsive */}
                                        <div className="flex items-center justify-center gap-2 mt-3 md:mt-4 text-xs text-gray-500">
                                            <ShieldCheckIcon className="h-3 w-3 md:h-4 md:w-4 text-green-500" />
                                            <span>100% Secure Payments</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {/* Remove Item Confirmation Modal - Responsive */}
            {showRemoveConfirm && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 animate-fadeIn p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto transform transition-all duration-300">
                        <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-t-2xl px-4 md:px-6 py-3 md:py-4">
                            <div className="flex justify-between items-center">
                                <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
                                    <XIcon className="h-4 w-4 md:h-5 md:w-5" />
                                    Remove Item
                                </h2>
                                <button onClick={() => setShowRemoveConfirm(null)} className="text-white/80 hover:text-white transition">
                                    <XIcon className="h-4 w-4 md:h-5 md:w-5" />
                                </button>
                            </div>
                        </div>
                        
                        <div className="p-4 md:p-6">
                            <div className="text-center mb-4 md:mb-6">
                                <div className="text-4xl md:text-5xl mb-3 md:mb-4">⚠️</div>
                                <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-2">Remove from Cart?</h3>
                                <p className="text-sm md:text-base text-gray-600">
                                    Are you sure you want to remove <span className="font-semibold text-red-600">{showRemoveConfirm.productName}</span> from your cart?
                                </p>
                                <p className="text-xs md:text-sm text-gray-500 mt-2">This action cannot be undone.</p>
                            </div>
                            
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowRemoveConfirm(null)}
                                    className="flex-1 py-2 md:py-2.5 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition text-sm md:text-base"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmRemoveFromCart}
                                    className="flex-1 py-2 md:py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition text-sm md:text-base"
                                >
                                    Remove Item
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Disclaimer Modal - Responsive */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto animate-fadeIn">
                        <div className="p-4 md:p-6">
                            <div className="flex justify-between items-center mb-3 md:mb-4">
                                <h3 className="text-lg md:text-xl font-bold text-gray-800">Confirm Order</h3>
                                <button onClick={() => { setIsModalOpen(false); setIsAccepted(false); }} className="text-gray-400 hover:text-gray-600">
                                    <XIcon className="h-5 w-5 md:h-6 md:w-6" />
                                </button>
                            </div>
                            
                            <div className="border border-red-200 bg-red-50 rounded-lg p-3 md:p-4 mb-3 md:mb-4">
                                <h4 className="text-red-700 font-bold mb-1 md:mb-2 text-sm md:text-base">⚠️ Important Notice</h4>
                                <p className="text-xs md:text-sm text-red-600">
                                    No Return & No Cancellation Policy. Once an order is placed, it cannot be cancelled or returned.
                                </p>
                            </div>

                            <div className="flex items-start gap-2 mb-4 md:mb-6">
                                <input
                                    type="checkbox"
                                    checked={isAccepted}
                                    onChange={(e) => setIsAccepted(e.target.checked)}
                                    className="mt-1 h-3 w-3 md:h-4 md:w-4 accent-blue-600"
                                />
                                <p className="text-xs md:text-sm text-gray-700">
                                    I accept the <button onClick={() => navigate("/cancellation-policy")} className="text-blue-600 underline">Refunds and Cancellations Policy</button>
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => { setIsModalOpen(false); setIsAccepted(false); }}
                                    className="flex-1 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition text-sm md:text-base"
                                >
                                    Cancel
                                </button>
                                <button
                                    disabled={!isAccepted}
                                    onClick={() => { setIsModalOpen(false); setShowPaymentModal(true); }}
                                    className={`flex-1 py-2 rounded-lg font-semibold transition text-sm md:text-base ${isAccepted ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                                >
                                    Continue
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Payment Modal - Responsive */}
            {showPaymentModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm animate-fadeIn p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto transform transition-all duration-300 animate-slideUp">
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-2xl px-4 md:px-6 py-3 md:py-4">
                            <div className="flex justify-between items-center">
                                <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
                                    <CreditCardIcon className="h-4 w-4 md:h-5 md:w-5" />
                                    Select Payment Method
                                </h2>
                                <button onClick={() => setShowPaymentModal(false)} className="text-white/80 hover:text-white transition">
                                    <XIcon className="h-4 w-4 md:h-5 md:w-5" />
                                </button>
                            </div>
                            <p className="text-blue-100 text-xs md:text-sm mt-1">Choose your preferred payment option</p>
                        </div>

                        <div className="p-4 md:p-6">
                            <div className="space-y-3 mb-4 md:mb-6">
                                <label className={`flex items-center p-3 md:p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                                    globalPaymentOption === "UPI" ? 'border-blue-500 bg-blue-50 shadow-md' : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                                }`}>
                                    <input type="radio" name="payment" value="UPI" checked={globalPaymentOption === "UPI"} onChange={(e) => setGlobalPaymentOption(e.target.value)} className="mr-3 h-3 w-3 md:h-4 md:w-4 text-blue-600 focus:ring-blue-500" />
                                    <div className="flex items-center justify-between flex-1">
                                        <div className="flex items-center gap-2 md:gap-3">
                                            <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                <svg className="h-4 w-4 md:h-5 md:w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-800 text-sm md:text-base">UPI</p>
                                                <p className="text-xs text-gray-500 hidden sm:block">Google Pay, PhonePe, Paytm</p>
                                            </div>
                                        </div>
                                        {globalPaymentOption === "UPI" && <FaCheckCircle className="h-4 w-4 md:h-5 md:w-5 text-blue-500" />}
                                    </div>
                                </label>

                                <label className={`flex items-center p-3 md:p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                                    globalPaymentOption === "Card" ? 'border-purple-500 bg-purple-50 shadow-md' : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                                }`}>
                                    <input type="radio" name="payment" value="Card" checked={globalPaymentOption === "Card"} onChange={(e) => setGlobalPaymentOption(e.target.value)} className="mr-3 h-3 w-3 md:h-4 md:w-4 text-purple-600 focus:ring-purple-500" />
                                    <div className="flex items-center justify-between flex-1">
                                        <div className="flex items-center gap-2 md:gap-3">
                                            <div className="w-8 h-8 md:w-10 md:h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                                <CreditCardIcon className="h-4 w-4 md:h-5 md:w-5 text-purple-600" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-800 text-sm md:text-base">Card</p>
                                                <p className="text-xs text-gray-500 hidden sm:block">Credit / Debit Card</p>
                                            </div>
                                        </div>
                                        {globalPaymentOption === "Card" && <FaCheckCircle className="h-4 w-4 md:h-5 md:w-5 text-purple-500" />}
                                    </div>
                                </label>
                            </div>

                            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-3 md:p-4 mb-4 md:mb-6">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs md:text-sm text-gray-600">Total Amount</span>
                                    <span className="text-xl md:text-2xl font-bold text-blue-600">₹{finalTotal.toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button onClick={() => setShowPaymentModal(false)} className="flex-1 py-2 md:py-2.5 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition text-sm md:text-base">Cancel</button>
                                <button onClick={() => { setShowPaymentModal(false); placeOrder(); }} disabled={!globalPaymentOption} className={`flex-1 py-2 md:py-2.5 rounded-xl font-semibold transition flex items-center justify-center gap-2 text-sm md:text-base ${globalPaymentOption ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md hover:shadow-lg' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>
                                    <ShieldCheckIcon className="h-3 w-3 md:h-4 md:w-4" />
                                    Confirm & Pay
                                </button>
                            </div>

                            <div className="mt-3 md:mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
                                <ShieldCheckIcon className="h-3 w-3 md:h-4 md:w-4 text-green-500" />
                                <span>100% Secure Payments</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Processing Payment Modal - Responsive */}
            {isProcessingPayment && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 flex flex-col items-center">
                        <div className="animate-spin rounded-full h-12 w-12 md:h-16 md:w-16 border-t-4 border-b-4 border-blue-600 mb-3 md:mb-4"></div>
                        <p className="text-gray-700 font-semibold text-sm md:text-base">Processing your payment...</p>
                        <p className="text-xs md:text-sm text-gray-500 mt-1">Please do not close this window</p>
                    </div>
                </div>
            )}

            <style jsx>{`
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
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }
                @keyframes slideUp {
                    from {
                        transform: translateY(50px);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
                .animate-slideIn {
                    animation: slideIn 0.3s ease-out;
                }
                .animate-fadeIn {
                    animation: fadeIn 0.2s ease-out;
                }
                .animate-slideUp {
                    animation: slideUp 0.3s ease-out;
                }
            `}</style>
        </div>
    );
}

export default CartPage;