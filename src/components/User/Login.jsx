
// import React, { useState, useEffect } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { jwtDecode } from "jwt-decode";
// import { HiEye, HiEyeOff, HiMail, HiLockClosed, HiShieldCheck } from "react-icons/hi";
// import loginImage from "../../assets/new3.jpg";

// const BASE_URL = "https://api.static.ev.transev.site";
// const API_KEY = "mlzuMoRFjdGhcFulLMaVtfwNAHycbBAf";

// const LoginPage = () => {
//   const [formData, setFormData] = useState({ email: "", password: "" });
//   const [otpData, setOtpData] = useState({ otp_code: "" });
//   const [error, setError] = useState(null);
//   const [showOtpForm, setShowOtpForm] = useState(false);
//   const [userEmail, setUserEmail] = useState("");
//   const [authToken, setAuthToken] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [showSuccessPopup, setShowSuccessPopup] = useState(false);
//   const [passwordVisible, setPasswordVisible] = useState(false);

//   const navigate = useNavigate();

//   const decodeAndStoreUser = (token) => {
//     try {
//       const decoded = jwtDecode(token);
//       if (decoded?.user_id) {
//         localStorage.setItem("user_id", decoded.user_id);
//         console.log("Decoded user ID:", decoded.user_id);
//       } else {
//         console.warn("User ID not found in token.");
//       }
//     } catch (err) {
//       console.error("Error decoding token:", err);
//     }
//   };

//   useEffect(() => {
//     const token = localStorage.getItem("auth_token");
//     const loginTimestamp = parseInt(localStorage.getItem("login_timestamp"), 10);
//     const currentTime = Date.now();

//     if (token && loginTimestamp && (currentTime - loginTimestamp) < 365 * 24 * 60 * 60 * 1000) {
//       navigate("/dashboard");
//     }
//   }, [navigate]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     if (name === "otp_code") {
//       setOtpData({ ...otpData, [name]: value });
//     } else {
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);
//     setIsLoading(true);

//     try {
//       const response = await fetch(`${BASE_URL}/users/login`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "API-Key": API_KEY,
//         },
//         body: JSON.stringify(formData),
//       });

//       const authorizationHeader = response.headers.get("Authorization");

//       if (authorizationHeader?.startsWith("Bearer ")) {
//         const token = authorizationHeader.substring(7);
//         localStorage.setItem("auth_token", token);
//         localStorage.setItem("login_timestamp", Date.now());
//         setAuthToken(token);
//         decodeAndStoreUser(token);
//       }

//       if (response.status === 308) {
//         setUserEmail(formData.email);
//         setShowOtpForm(true);
//       } else if (response.ok) {
//         setShowSuccessPopup(true);
//         setTimeout(() => navigate("/dashboard"), 1500);
//       } else {
//         const data = await response.json();
//         if (response.status === 401 || response.status === 400) {
//           setError("Invalid credentials. Please check your email and password.");
//         } else {
//           setError(data.message || "Login failed.");
//         }
//       }
//     } catch (err) {
//       console.error("Login error:", err);
//       setError("An error occurred during login.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleOtpSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);
//     setIsLoading(true);

//     try {
//       const token = localStorage.getItem("auth_token");

//       const response = await fetch(`${BASE_URL}/users/2fa/verify`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${token}`,
//           "API-Key": API_KEY,
//         },
//         body: JSON.stringify({
//           email: userEmail,
//           otp_code: otpData.otp_code,
//         }),
//       });

//       const authorizationHeader = response.headers.get("Authorization");

//       if (authorizationHeader?.startsWith("Bearer ")) {
//         const newToken = authorizationHeader.substring(7);
//         localStorage.setItem("auth_token", newToken);
//         setAuthToken(newToken);
//         decodeAndStoreUser(newToken);
//       }

//       if (response.ok) {
//         setShowSuccessPopup(true);
//         setTimeout(() => navigate("/dashboard"), 1500);
//       } else {
//         const data = await response.json();
//         setError(data.message || "OTP verification failed.");
//       }
//     } catch (err) {
//       console.error("OTP error:", err);
//       setError("An error occurred during OTP verification.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div
//       className="min-h-screen flex items-center justify-center relative overflow-hidden bg-cover bg-center bg-no-repeat"
//       style={{ backgroundImage: `url(${loginImage})` }}
//     >
//       {/* Dark overlay for better readability */}
//       <div className="absolute inset-0 bg-black/50"></div>

//       <div className="relative z-10 w-full max-w-md px-4">
//         {/* Glass morphism card */}
//         <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
//           {/* Gradient header */}
//           <div className="relative bg-gradient-to-r from-emerald-600 to-teal-600 py-8 px-6 text-center">
//             <div className="absolute inset-0 bg-black/10"></div>
//             <div className="relative">
//               <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-4 backdrop-blur-sm">
//                 <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//                 </svg>
//               </div>
//               <h2 className="text-3xl font-bold text-white tracking-tight">Welcome Back</h2>
//               <p className="text-emerald-100 mt-2 text-sm">Sign in to continue to your account</p>
//             </div>
//           </div>

//           {/* Success Popup */}
//           {showSuccessPopup && (
//             <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
//               <div className="bg-green-500 text-white px-6 py-3 rounded-full shadow-lg flex items-center space-x-2">
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
//                 </svg>
//                 <span className="font-medium">Login Successful!</span>
//               </div>
//             </div>
//           )}

//           <div className="p-8">
//             {!showOtpForm ? (
//               <form onSubmit={handleSubmit} className="space-y-5">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-200 mb-2">
//                     <HiMail className="inline mr-2 mb-0.5" /> Email Address
//                   </label>
//                   <input
//                     type="email"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleChange}
//                     placeholder="you@example.com"
//                     className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-200"
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-200 mb-2">
//                     <HiLockClosed className="inline mr-2 mb-0.5" /> Password
//                   </label>
//                   <div className="relative">
//                     <input
//                       type={passwordVisible ? "text" : "password"}
//                       name="password"
//                       value={formData.password}
//                       onChange={handleChange}
//                       placeholder="••••••••"
//                       className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-200 pr-12"
//                       required
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setPasswordVisible(!passwordVisible)}
//                       className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
//                     >
//                       {passwordVisible ? <HiEyeOff size={20} /> : <HiEye size={20} />}
//                     </button>
//                   </div>
//                 </div>

//                 {error && (
//                   <div className="bg-red-500/20 border border-red-400/50 text-red-200 px-4 py-2 rounded-xl text-sm">
//                     {error}
//                   </div>
//                 )}

//                 <button
//                   type="submit"
//                   disabled={isLoading}
//                   className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-400 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
//                 >
//                   {isLoading ? (
//                     <div className="flex items-center justify-center space-x-2">
//                       <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
//                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
//                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
//                       </svg>
//                       <span>Signing in...</span>
//                     </div>
//                   ) : (
//                     "Sign In"
//                   )}
//                 </button>

//                 <div className="text-center space-y-2 pt-2">
//                   <p className="text-gray-300 text-sm">
//                     Don't have an account?{" "}
//                     <Link to="/signup" className="text-emerald-300 hover:text-emerald-200 font-medium transition-colors">
//                       Create Account
//                     </Link>
//                   </p>
//                   <p>
//                     <Link to="/forgot-password" className="text-emerald-300 hover:text-emerald-200 text-sm transition-colors">
//                       Forgot Password?
//                     </Link>
//                   </p>
//                 </div>
//               </form>
//             ) : (
//               <form onSubmit={handleOtpSubmit} className="space-y-5">
//                 <div className="text-center mb-4">
//                   <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-500/20 rounded-full mb-3">
//                     <HiShieldCheck className="w-6 h-6 text-emerald-300" />
//                   </div>
//                   <h3 className="text-xl font-semibold text-white">Two-Factor Authentication</h3>
//                   <p className="text-gray-300 text-sm mt-1">
//                     Enter the verification code sent to <span className="text-emerald-300 font-medium">{userEmail}</span>
//                   </p>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-200 mb-2">OTP Code</label>
//                   <input
//                     type="text"
//                     name="otp_code"
//                     value={otpData.otp_code}
//                     onChange={handleChange}
//                     placeholder="000000"
//                     maxLength={6}
//                     className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent text-center text-2xl tracking-widest font-mono"
//                     required
//                   />
//                 </div>

//                 {error && (
//                   <div className="bg-red-500/20 border border-red-400/50 text-red-200 px-4 py-2 rounded-xl text-sm">
//                     {error}
//                   </div>
//                 )}

//                 <button
//                   type="submit"
//                   disabled={isLoading}
//                   className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed"
//                 >
//                   {isLoading ? (
//                     <div className="flex items-center justify-center space-x-2">
//                       <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
//                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
//                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
//                       </svg>
//                       <span>Verifying...</span>
//                     </div>
//                   ) : (
//                     "Verify OTP"
//                   )}
//                 </button>

//                 <button
//                   type="button"
//                   onClick={() => setShowOtpForm(false)}
//                   className="w-full text-gray-400 hover:text-gray-300 text-sm mt-2 transition-colors"
//                 >
//                   ← Back to Login
//                 </button>
//               </form>
//             )}
//           </div>

//           {/* Footer note */}
//           <div className="bg-white/5 px-8 py-4 text-center border-t border-white/10">
//             <p className="text-gray-400 text-xs">
//               Secure login powered by AES-256 encryption
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;

import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { HiEye, HiEyeOff, HiMail, HiLockClosed, HiShieldCheck } from "react-icons/hi";
import loginImage from "../../assets/new3.jpg";

const BASE_URL = "https://api.static.ev.transev.site";
const API_KEY = "mlzuMoRFjdGhcFulLMaVtfwNAHycbBAf";

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [otpData, setOtpData] = useState({ otp_code: "" });
  const [error, setError] = useState(null);
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [authToken, setAuthToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const navigate = useNavigate();

  const decodeAndStoreUser = (token) => {
    try {
      const decoded = jwtDecode(token);
      console.log("🔐 Decoded User Token:", decoded);
      
      if (decoded?.user_id) {
        localStorage.setItem("user_id", decoded.user_id);
        console.log("Decoded user ID:", decoded.user_id);
      }
      
      // ⭐⭐⭐ CRITICAL: Store user role in localStorage ⭐⭐⭐
      // For user login, always set role as 'user'
      localStorage.setItem("user_role", "user");
      console.log("✅ Stored user_role in localStorage: user");
      
      // Store login timestamp
      localStorage.setItem("login_timestamp", Date.now().toString());
      
    } catch (err) {
      console.error("Error decoding token:", err);
      // Fallback: set role as user
      localStorage.setItem("user_role", "user");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    const loginTimestamp = parseInt(localStorage.getItem("login_timestamp"), 10);
    const currentTime = Date.now();

    if (token && loginTimestamp && (currentTime - loginTimestamp) < 365 * 24 * 60 * 60 * 1000) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "otp_code") {
      setOtpData({ ...otpData, [name]: value });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      console.log("🟢 Attempting user login...");
      const response = await fetch(`${BASE_URL}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "API-Key": API_KEY,
        },
        body: JSON.stringify(formData),
      });

      const authorizationHeader = response.headers.get("Authorization");

      if (authorizationHeader?.startsWith("Bearer ")) {
        const token = authorizationHeader.substring(7);
        localStorage.setItem("auth_token", token);
        localStorage.setItem("login_timestamp", Date.now().toString());
        setAuthToken(token);
        decodeAndStoreUser(token);
      }

      if (response.status === 308) {
        console.log("🟢 2FA required");
        setUserEmail(formData.email);
        setShowOtpForm(true);
      } else if (response.ok) {
        console.log("✅ User login successful!");
        
        // Ensure role is set
        if (!localStorage.getItem("user_role")) {
          localStorage.setItem("user_role", "user");
        }
        
        setShowSuccessPopup(true);
        setTimeout(() => navigate("/dashboard"), 1500);
      } else {
        const data = await response.json();
        if (response.status === 401 || response.status === 400) {
          setError("Invalid credentials. Please check your email and password.");
        } else {
          setError(data.message || "Login failed.");
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred during login.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const token = localStorage.getItem("auth_token");

      console.log("🟢 Verifying OTP...");
      const response = await fetch(`${BASE_URL}/users/2fa/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "API-Key": API_KEY,
        },
        body: JSON.stringify({
          email: userEmail,
          otp_code: otpData.otp_code,
        }),
      });

      const authorizationHeader = response.headers.get("Authorization");

      if (authorizationHeader?.startsWith("Bearer ")) {
        const newToken = authorizationHeader.substring(7);
        localStorage.setItem("auth_token", newToken);
        setAuthToken(newToken);
        decodeAndStoreUser(newToken);
      }

      if (response.ok) {
        console.log("✅ OTP verified successfully!");
        
        // Ensure role is set
        if (!localStorage.getItem("user_role")) {
          localStorage.setItem("user_role", "user");
        }
        
        setShowSuccessPopup(true);
        setTimeout(() => navigate("/dashboard"), 1500);
      } else {
        const data = await response.json();
        setError(data.message || "OTP verification failed.");
      }
    } catch (err) {
      console.error("OTP error:", err);
      setError("An error occurred during OTP verification.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${loginImage})` }}
    >
      {/* Dark overlay for better readability */}
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative z-10 w-full max-w-md px-4">
        {/* Glass morphism card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Gradient header */}
          <div className="relative bg-gradient-to-r from-emerald-600 to-teal-600 py-8 px-6 text-center">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-4 backdrop-blur-sm">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-white tracking-tight">Welcome Back</h2>
              <p className="text-emerald-100 mt-2 text-sm">Sign in to continue to your account</p>
            </div>
          </div>

          {/* Success Popup */}
          {showSuccessPopup && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
              <div className="bg-green-500 text-white px-6 py-3 rounded-full shadow-lg flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-medium">Login Successful!</span>
              </div>
            </div>
          )}

          <div className="p-8">
            {!showOtpForm ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    <HiMail className="inline mr-2 mb-0.5" /> Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    <HiLockClosed className="inline mr-2 mb-0.5" /> Password
                  </label>
                  <div className="relative">
                    <input
                      type={passwordVisible ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-200 pr-12"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setPasswordVisible(!passwordVisible)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {passwordVisible ? <HiEyeOff size={20} /> : <HiEye size={20} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-500/20 border border-red-400/50 text-red-200 px-4 py-2 rounded-xl text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-400 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </button>

                <div className="text-center space-y-2 pt-2">
                  <p className="text-gray-300 text-sm">
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-emerald-300 hover:text-emerald-200 font-medium transition-colors">
                      Create Account
                    </Link>
                  </p>
                  <p>
                    <Link to="/forgot-password" className="text-emerald-300 hover:text-emerald-200 text-sm transition-colors">
                      Forgot Password?
                    </Link>
                  </p>
                </div>
              </form>
            ) : (
              <form onSubmit={handleOtpSubmit} className="space-y-5">
                <div className="text-center mb-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-500/20 rounded-full mb-3">
                    <HiShieldCheck className="w-6 h-6 text-emerald-300" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">Two-Factor Authentication</h3>
                  <p className="text-gray-300 text-sm mt-1">
                    Enter the verification code sent to <span className="text-emerald-300 font-medium">{userEmail}</span>
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">OTP Code</label>
                  <input
                    type="text"
                    name="otp_code"
                    value={otpData.otp_code}
                    onChange={handleChange}
                    placeholder="000000"
                    maxLength={6}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent text-center text-2xl tracking-widest font-mono"
                    required
                  />
                </div>

                {error && (
                  <div className="bg-red-500/20 border border-red-400/50 text-red-200 px-4 py-2 rounded-xl text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      <span>Verifying...</span>
                    </div>
                  ) : (
                    "Verify OTP"
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setShowOtpForm(false)}
                  className="w-full text-gray-400 hover:text-gray-300 text-sm mt-2 transition-colors"
                >
                  ← Back to Login
                </button>
              </form>
            )}
          </div>

          {/* Footer note */}
          <div className="bg-white/5 px-8 py-4 text-center border-t border-white/10">
            <p className="text-gray-400 text-xs">
              Secure login powered by AES-256 encryption
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;