
import React from "react";
import Navbar from "../components/Navbar"; // Navbar import
import logo1 from "../assets/tv.png";
import { FaInstagram, FaFacebook } from "react-icons/fa";
import { Helmet } from "react-helmet";
const CancellationRefundPolicy = () => {
 return (
    <div className="bg-white text-gray-900 min-h-screen">
      {/* SEO Meta Tags */}
      <Helmet>
        <title>Cancellations & Refunds Policy | TransEV</title>
        <meta
          name="description"
          content="Read TransEV's detailed cancellation and refund policy. Understand the terms, conditions, and process for order cancellations and refunds."
        />
        <meta
          name="keywords"
          content="TransEV, cancellations, refunds, EV charging, order policy, electric vehicles"
        />
        <meta name="robots" content="index, follow" />

        {/* Open Graph / Facebook */}
        <meta property="og:title" content="Cancellations & Refunds Policy | TransEV" />
        <meta
          property="og:description"
          content="Read TransEV's detailed cancellation and refund policy. Understand the terms, conditions, and process for order cancellations and refunds."
        />
        <meta property="og:image" content={logo1} />
        <meta property="og:url" content="https://www.transev.site/cancellation-refund-policy" />
        <meta property="og:type" content="website" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Cancellations & Refunds Policy | TransEV" />
        <meta
          name="twitter:description"
          content="Read TransEV's detailed cancellation and refund policy. Understand the terms, conditions, and process for order cancellations and refunds."
        />
        <meta name="twitter:image" content={logo1} />
      </Helmet>
      {/* Navbar */}
      <Navbar />

    {/* Header Section */}
<div className="bg-blue-50 pt-32 pb-12">
  <div className="max-w-4xl mx-auto px-4 text-center">
    <h1 className="text-4xl sm:text-5xl font-extrabold text-blue-900 mb-4">
      Cancellations & Refunds Policy
    </h1>
    <p className="text-lg sm:text-xl text-gray-700">
      Please read our cancellation and refund policies carefully before placing your order.
    </p>
  </div>
</div>



      {/* Main Content */}
      <div className="container mx-auto px-4 py-10">
        {/* Highlight Notice */}
        <div className="mb-8 rounded-lg border-l-4 border-orange-500 bg-orange-50 p-4">
          <p className="text-sm leading-relaxed text-orange-800">
            Once an order is placed and accepted by us, it cannot be cancelled or
            returned. Please ensure all product details are reviewed carefully
            before placing your order. By confirming the order, you agree to
            this policy.
          </p>
        </div>

        {/* Section 1 */}
        <section className="mb-8">
          <h2 className="mb-3 text-xl font-semibold text-gray-800">
            1. Order Cancellation Policy
          </h2>
          <ul className="list-disc space-y-2 pl-5 text-gray-600">
            <li>Orders can be cancelled only before they are accepted.</li>
            <li>Once an order is placed and accepted, it cannot be cancelled.</li>
            <li>Accepted orders are final and non-refundable.</li>
            <li>
              Customers must review all product details carefully before placing
              an order.
            </li>
          </ul>
        </section>

        {/* Section 2 */}
        <section className="mb-8">
          <h2 className="mb-3 text-xl font-semibold text-gray-800">2. Refund Policy</h2>

          <h3 className="mb-2 text-lg font-medium text-gray-700">Automatic Refunds</h3>
          <ul className="list-disc space-y-2 pl-5 text-gray-600">
            <li>
              Refunds are applicable only if the order is cancelled before acceptance.
            </li>
            <li>Eligible refunds are processed automatically.</li>
            <li>Refunds will be credited within 5–7 business days.</li>
          </ul>

          <h3 className="mb-2 mt-5 text-lg font-medium text-gray-700">No Refund After Acceptance</h3>
          <ul className="list-disc space-y-2 pl-5 text-gray-600">
            <li>Orders accepted by the admin cannot be cancelled.</li>
            <li>No refunds will be issued after order acceptance.</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section>
          <h2 className="mb-3 text-xl font-semibold text-gray-800">3. Important Notes</h2>
          <ul className="list-disc space-y-2 pl-5 text-gray-600">
            <li>Refund processing time may vary depending on banks or payment providers.</li>
            <li>Business days exclude weekends and public holidays.</li>
            <li>By placing an order, you agree to this policy.</li>
          </ul>
        </section>
      </div>

      {/* Footer Section */}
   <div className="bg-white-50 py-16">
          <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center px-8">
            
            {/* Logo Section */}
            <div className="flex items-center space-x-4 mb-6 sm:mb-0">
              <img src={logo1} alt="Company Logo" className="w-32 h-32" />
            </div>
        
            {/* Contact Section */}
            <div className="text-center sm:text-right">
              <div className="text-3xl sm:text-5xl font-semibold text-gray-800 mb-4">
                <a
                  href="tel:+02033453310"
                  className="relative inline-block hover:text-black-500"
                >
                  <span className="hover:underline transition-all duration-300">033-4601 5366</span>
                </a>
              </div>
        
              <div className="text-3xl sm:text-5xl font-semibold text-gray-800">
                <a
                  href="mailto:tgwbin@gmail.com"
                  className="relative inline-block hover:text-black-500"
                >
                  <span className="hover:underline transition-all duration-300 mt-2 ">tgwbin@gmail.com</span>
                </a>
              </div>
            </div>
          </div>
          </div>
              <footer className="bg-white text-black py-8 mt-20">
                <div className="container mx-auto flex flex-col sm:flex-row justify-between px-8">
                  {/* First Section - Experts and Client Portal */}
                  <div className="w-full sm:w-1/3 mb-8 sm:mb-0">
                    <h4 className="text-xl sm:text-xl font-semibold mb-4">
                      Pioneers in smart EV charging solutions <br />
                    
                    </h4>
        
                    <a
                      href="#"
                      className="inline-flex items-center px-6 py-3 bg-black text-white font-semibold rounded-full transition-all duration-300 hover:bg-yellow-500 hover:text-black hover:scale-105"
                    >
                      <span>Client portal</span>
                      <div className="ml-4 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center transition-all duration-300 group-hover:w-10 group-hover:h-10">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-5 h-5 text-white transition-transform duration-300 group-hover:translate-x-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                          />
                        </svg>
                      </div>
                    </a>
                  </div>
        
                  {/* Second Section - Navigation, Social Media, Legal Links */}
                  <div className="w-full sm:w-2/3 flex flex-col sm:flex-row justify-between sm:space-x-12 mt-10 sm:mt-0">
                    {/* Navigation Links */}
                    <div className="mb-8 sm:mb-0">
                      <h5 className="text-lg font-semibold mb-5">Navigation</h5>
                      <ul className="space-y-2">
                        <li><a href="/solution" className="text-gray hover:underline text-lg">Solutions</a></li>
                        <li><a href="/contact" className="text-gray hover:underline text-lg">Contact</a></li>
                        <li><a href="/careers" className="text-gray hover:underline text-lg">Careers</a></li>
                      
                      </ul>
                    </div>
        
                    {/* Follow Us Links */}
                    <div className="mb-8 sm:mb-0">
                      <h5 className="text-lg font-semibold mb-5">Follow us</h5>
                      <ul className="space-y-2">
                         <li>
                        <a
                          href="https://x.com/transevIN?t=yJ30BdH5D7TME1ZZQiQisw&s=09"
                          className="text-gray hover:underline text-lg"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            width="28"
                            height="28"
                          >
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                          </svg>
                        </a>
                      </li>
                                 <li><a href="https://www.instagram.com/__transmogrify__?igsh=MWRzY25tc2wzMnk1ag==" className="text-gray hover:underline text-lg"> <FaInstagram color="#E1306C" size={28} /></a></li>
                                 <li><a href="https://www.facebook.com/share/1NvgEQvwxG/" className="text-gray hover:underline text-lg"> <FaFacebook color="#1877F2" size={28} /></a></li>
                      </ul>
                    </div>
        
                    {/* Legal Links */}
                    <div>
                      <h5 className="text-lg font-semibold mb-5">Legal</h5>
                      <ul className="space-y-2">
                        <li><a href="/terms-conditions" className="text-gray hover:underline text-lg">Terms & Conditions</a></li>
                        <li><a href="/privacy-policy" className="text-gray hover:underline text-lg">Privacy Policy</a></li>
                       <li><a href="/shipping-policy" className="text-gray hover:underline text-lg">Shipping Policy</a></li>
                        <li><a href="/cancellation-policy" className="text-gray hover:underline text-lg">Cancellations and Refunds</a></li>
                      </ul>
                    </div>
                  </div>
                </div>
        
                {/* Footer Bottom Section */}
                <div className="text-center mt-8 text-lg lg:mr-300">
                  <p>&copy; TransEV 2025. All Rights Reserved.</p>
                </div>
              </footer>
    </div>
  );
};

export default CancellationRefundPolicy;
