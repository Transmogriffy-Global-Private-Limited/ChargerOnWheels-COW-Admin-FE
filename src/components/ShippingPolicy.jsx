import React from "react";
import Navbar from "../components/Navbar"; // Navbar import
import logo1 from "../assets/tv.png";
import { FaTwitter, FaInstagram, FaFacebook } from "react-icons/fa";
import { Helmet } from "react-helmet";

const ShippingPolicy = () => {
  return (
    <div className="bg-white text-gray-900 min-h-screen">
      <Helmet>
  <title>Shipping Policy | TransEV</title>
  <meta
    name="description"
    content="Read TransEV's Shipping Policy to understand delivery timelines, shipping methods, charges, and tracking information for all orders across India."
  />
  <meta name="keywords" content="Shipping Policy, EV charging products shipping, delivery timeline, shipping charges, tracking orders India" />
  <link rel="canonical" href="https://transev.site/shipping-policy" />

  {/* Open Graph / Facebook */}
  <meta property="og:title" content="Shipping Policy | TransEV" />
  <meta property="og:description" content="Learn about TransEV's shipping methods, delivery timelines, and order tracking for all EV charging products across India." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://transev.site/shipping-policy" />
  <meta property="og:image" content="https://transev.site/images/shipping-policy-og.jpg" />

  {/* Twitter Card */}
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Shipping Policy | TransEV" />
  <meta name="twitter:description" content="Understand TransEV's shipping process, delivery time, and tracking for all orders across India." />
  <meta name="twitter:image" content="https://transev.site/images/shipping-policy-og.jpg" />
  <meta name="robots" content="index, follow" />
</Helmet>

      {/* Navbar */}
      <Navbar />

      {/* Header Section */}
      <div className="bg-blue-50 pt-36 pb-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-blue-900 mb-4">
            Shipping Policy
          </h1>
          <p className="text-lg sm:text-xl text-gray-700">
            Thank you for shopping with us. Please read our shipping policies carefully before placing your order.
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Last Updated: 20 January 2026
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-10 max-w-4xl">
        {/* Introduction */}
        <p className="text-lg text-gray-800 mb-8">
          We aim to provide fast and reliable delivery for all orders placed on our website. Please read our Shipping Policy carefully to understand how we process and deliver your products.
        </p>

        {/* Section 1 */}
        <section className="mb-6">
          <h2 className="mb-3 text-xl font-semibold text-gray-800">1. Shipping Method</h2>
          <p className="text-gray-600 mb-2">
            We ship all orders using surface/road transportation on a door‑delivery basis across India.
          </p>
          <p className="text-gray-600">
            Our official courier partner is: <strong>➡️ Delhivery Courier & others</strong>
          </p>
        </section>

        {/* Section 2 */}
        <section className="mb-6">
          <h2 className="mb-3 text-xl font-semibold text-gray-800">2. Delivery Timeline</h2>
          <p className="text-gray-600 mb-2">
            Orders are typically delivered within 3–10 working days across India.
          </p>
          <p className="text-gray-600">Delivery times may vary depending on:</p>
          <ul className="list-disc pl-5 space-y-1 text-gray-600 mb-2">
            <li>Your delivery location</li>
            <li>Order size or shipment weight</li>
            <li>Courier network availability</li>
            <li>Public holidays or unforeseen logistics delays</li>
          </ul>
          <p className="text-gray-600">We make every effort to ensure timely delivery.</p>
        </section>

        {/* Section 3 */}
        <section className="mb-6">
          <h2 className="mb-3 text-xl font-semibold text-gray-800">3. Order Processing Time</h2>
          <p className="text-gray-600">
            All orders are processed within 2–3 working days after payment confirmation. Orders placed on weekends or public holidays will be processed on the next working day.
          </p>
        </section>

        {/* Section 4 */}
        <section className="mb-6">
          <h2 className="mb-3 text-xl font-semibold text-gray-800">4. Shipping Charges</h2>
          <p className="text-gray-600">
            Shipping charges (if applicable) will be displayed at checkout before payment. Any special shipping requirements may incur additional charges.
          </p>
        </section>

        {/* Section 5 */}
        <section className="mb-6">
          <h2 className="mb-3 text-xl font-semibold text-gray-800">5. Tracking Your Order</h2>
          <p className="text-gray-600">
            Once your order is shipped, you will receive a tracking number and a link to track your shipment through Delhivery’s tracking portal.
          </p>
        </section>

        {/* Section 6 */}
        <section className="mb-6">
          <h2 className="mb-3 text-xl font-semibold text-gray-800">6. Delivery Attempts</h2>
          <p className="text-gray-600">
            The courier will attempt delivery at your provided address. If the delivery is missed, the courier may attempt again or contact you for rescheduling.
          </p>
        </section>

        {/* Section 7 */}
        <section className="mb-6">
          <h2 className="mb-3 text-xl font-semibold text-gray-800">7. Incorrect Address or Failed Delivery</h2>
          <p className="text-gray-600">We are not responsible for delays or failed deliveries caused by:</p>
          <ul className="list-disc pl-5 space-y-1 text-gray-600">
            <li>Incorrect or incomplete addresses</li>
            <li>Unreachable phone numbers</li>
            <li>Customer unavailability at the delivery location</li>
          </ul>
          <p className="text-gray-600 mt-2">
            In such cases, additional re‑shipping charges may apply.
          </p>
        </section>

        {/* Section 8 */}
        <section className="mb-6">
          <h2 className="mb-3 text-xl font-semibold text-gray-800">8. Damaged or Lost Packages</h2>
          <p className="text-gray-600">
            If your package arrives damaged or is missing, please contact us within 24–48 hours with photos or video proof so we can assist you promptly.
          </p>
        </section>
      </div>

      {/* Footer Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center px-8">
          {/* Logo Section */}
          <div className="flex items-center space-x-4 mb-6 sm:mb-0">
            <img src={logo1} alt="Company Logo" className="w-32 h-32" />
          </div>

          {/* Contact Section */}
          <div className="text-center sm:text-right">
            <div className="text-3xl sm:text-5xl font-semibold text-gray-800 mb-4">
              <a href="tel:+02033453310" className="hover:underline transition">
                033-4601 5366
              </a>
            </div>

            <div className="text-3xl sm:text-5xl font-semibold text-gray-800">
              <a href="mailto:tgwbin@gmail.com" className="hover:underline transition mt-2">
                tgwbin@gmail.com
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

export default ShippingPolicy;
