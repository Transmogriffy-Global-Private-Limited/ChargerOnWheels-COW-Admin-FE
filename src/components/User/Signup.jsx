import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiEye, HiEyeOff, HiUser, HiMail, HiLockClosed, HiPhone, HiArrowLeft, HiCheckCircle, HiLightningBolt } from "react-icons/hi";
import signupImage from "../../assets/holiday.jpg";
import logo from "../../assets/logo.png"; // Add your logo path here

const BASE_URL = "https://api.static.ev.transev.site";
const API_KEY = "mlzuMoRFjdGhcFulLMaVtfwNAHycbBAf";

const SignupPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState("success");
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlertMessage(null);

    const requestBody = {
      name,
      email,
      password,
      phone_number: phoneNumber || null,
    };

    try {
      const signupRes = await fetch(`${BASE_URL}/users/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "API-KEY": API_KEY,
        },
        body: JSON.stringify(requestBody),
      });

      if (signupRes.ok) {
        const signupData = await signupRes.json();
        const token = signupData.token;
        localStorage.setItem("auth_token", token);

        const profileRes = await fetch(`${BASE_URL}/users/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "API-KEY": API_KEY,
          },
        });

        const profileData = await profileRes.json();

        if (profileRes.ok) {
          if (!profileData.user_data.email_verified) {
            setAlertMessage("Signup successful! Please verify your email.");
            setAlertType("success");
            setTimeout(() => navigate("/verify-email"), 2000);
          } else {
            setAlertMessage("Signup successful! Redirecting to dashboard...");
            setAlertType("success");
            setTimeout(() => navigate("/dashboard"), 2000);
          }
        } else {
          setAlertMessage(profileData.detail || "Failed to fetch profile");
          setAlertType("error");
        }
      } else {
        let errorMessage = "Signup failed";
        try {
          const data = await signupRes.json();
          if (data && data.detail) {
            errorMessage = data.detail;
          }
        } catch (err) {
          errorMessage = await signupRes.text();
        }
        setAlertMessage(errorMessage);
        setAlertType("error");
      }
    } catch (err) {
      console.error(err);
      setAlertMessage("Something went wrong. Please try again.");
      setAlertType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleTermsClick = (e) => {
    e.preventDefault();
    navigate("/terms-conditions");
  };

  const handlePrivacyClick = (e) => {
    e.preventDefault();
    navigate("/privacy-policy");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Image Section */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105 transition-transform duration-700 hover:scale-110"
          style={{ backgroundImage: `url(${signupImage})` }}
        >
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/90 via-teal-800/85 to-cyan-900/90"></div>
        </div>
        
        {/* Content overlay on image */}
        <div className="relative z-10 flex flex-col justify-between p-12 text-white h-full">
          <div className="space-y-6">
            {/* Logo/Brand */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
                {logo ? (
                  <img src={logo} alt="TransEv Logo" className="w-8 h-8 object-contain" />
                ) : (
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-tight">TransEv</h2>
                <p className="text-emerald-100 text-sm">EV Charging Solutions</p>
              </div>
            </div>

            {/* Testimonial/Quote */}
            <div className="mt-16 space-y-4">
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <HiLightningBolt className="text-emerald-300" />
                <span className="text-sm">Join 10,000+ EV drivers</span>
              </div>
              <h1 className="text-4xl font-bold leading-tight">
                Power Your EV Journey<br />
                <span className="text-emerald-300">With TransEv</span>
              </h1>
              <p className="text-gray-200 text-lg leading-relaxed">
                Create an account to find charging stations, track your charging history, and manage your EV profile.
              </p>
            </div>

            {/* Features list */}
            <div className="space-y-3 mt-8">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-emerald-500/30 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-gray-100">Find nearby charging stations</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-emerald-500/30 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-gray-100">Real-time charging availability</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-emerald-500/30 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-gray-100">Easy payment & billing</span>
              </div>
            </div>
          </div>

          {/* Footer text on image */}
          <div className="text-sm text-gray-300">
            <p>© 2024 TransEv. All rights reserved.</p>
          </div>
        </div>

        {/* Animated decorative elements */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-teal-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      {/* Right side - Form Section with lighter green background */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-emerald-100 via-green-100 to-cyan-200">
        <div className="w-full max-w-md">
          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Header with EV theme */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-8 pt-8 pb-6 text-center relative">
              <div className="absolute top-2 right-2">
                <HiLightningBolt className="text-white/20 text-6xl" />
              </div>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-4 backdrop-blur-sm">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white">Create an Account</h2>
              <p className="text-emerald-100 text-sm mt-1">Join the EV revolution today</p>
            </div>

            {/* Alert Message */}
            {alertMessage && (
              <div className={`mx-6 mt-4 px-4 py-3 rounded-lg ${
                alertType === "success" 
                  ? "bg-green-50 border border-green-200 text-green-800" 
                  : "bg-red-50 border border-red-200 text-red-800"
              }`}>
                <div className="flex items-center space-x-2">
                  {alertType === "success" ? (
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                  <span className="text-sm">{alertMessage}</span>
                </div>
              </div>
            )}

            {/* Form */}
            <div className="px-8 py-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <HiUser className="inline mr-2 mb-0.5 text-emerald-600" /> Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <HiMail className="inline mr-2 mb-0.5 text-emerald-600" /> Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <HiLockClosed className="inline mr-2 mb-0.5 text-emerald-600" /> Password
                  </label>
                  <div className="relative">
                    <input
                      type={passwordVisible ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 pr-12"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setPasswordVisible(!passwordVisible)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-emerald-600 transition-colors"
                    >
                      {passwordVisible ? <HiEyeOff size={20} /> : <HiEye size={20} />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Password must be at least 8 characters</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <HiPhone className="inline mr-2 mb-0.5 text-emerald-600" /> Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                    placeholder="+1234567890"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none mt-6"
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      <span>Creating account...</span>
                    </div>
                  ) : (
                    "Sign Up"
                  )}
                </button>

                <div className="text-center space-y-2 pt-4">
                  <p className="text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link to="/login" className="text-emerald-600 hover:text-emerald-700 font-semibold transition-colors">
                      Sign In
                    </Link>
                  </p>
                  <p>
                    <Link to="/" className="text-gray-500 hover:text-emerald-600 text-sm transition-colors inline-flex items-center space-x-1">
                      <HiArrowLeft className="inline mr-1" />
                      Back to Home
                    </Link>
                  </p>
                </div>
              </form>
            </div>

            {/* Footer with clickable Terms and Privacy Policy */}
            <div className="bg-gray-50 px-8 py-4 text-center border-t border-gray-200">
              <p className="text-gray-500 text-xs">
                By signing up, you agree to our{" "}
                <button 
                  onClick={handleTermsClick}
                  className="text-emerald-600 hover:text-emerald-700 hover:underline transition-colors font-medium"
                >
                  Terms of Service
                </button>{" "}
                and{" "}
                <button 
                  onClick={handlePrivacyClick}
                  className="text-emerald-600 hover:text-emerald-700 hover:underline transition-colors font-medium"
                >
                  Privacy Policy
                </button>
              </p>
            </div>
          </div>

          {/* EV Charging Stats */}
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-emerald-600 font-bold text-xl">500+</div>
              <div className="text-gray-500 text-xs">Charging Stations</div>
            </div>
            <div className="text-center">
              <div className="text-emerald-600 font-bold text-xl">24/7</div>
              <div className="text-gray-500 text-xs">Support</div>
            </div>
            <div className="text-center">
              <div className="text-emerald-600 font-bold text-xl">100%</div>
              <div className="text-gray-500 text-xs">Green Energy</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;