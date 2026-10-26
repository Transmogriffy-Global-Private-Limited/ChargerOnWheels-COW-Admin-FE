
import React from "react";
import Navbar from "../components/Navbar"; // Import the Navbar
import logo from '../assets/transev logo.png';
import logos from '../assets/up.png';
import { FaTwitter, FaInstagram, FaFacebook } from 'react-icons/fa';
import logo1 from '../assets/tv.png';
import { Helmet } from 'react-helmet';
const PrivacyPolicy = () => {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
       <Helmet>
        <title>Privacy Policy | TransEV</title>
        <meta
          name="description"
          content="Read TransEV's Privacy Policy to understand how we collect, use, and protect your personal information while using our website or mobile application."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://transev.site/privacy-policy" />

        {/* Open Graph / Facebook */}
        <meta property="og:title" content="Privacy Policy | TransEV" />
        <meta property="og:description" content="Learn how TransEV collects, uses, and safeguards your personal data through our website and mobile application." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://transev.site/privacy-policy" />
        <meta property="og:image" content="https://transev.site/images/privacy-policy-og.jpg" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Privacy Policy | TransEV" />
        <meta name="twitter:description" content="Learn how TransEV collects, uses, and safeguards your personal data through our website and mobile application." />
        <meta name="twitter:image" content="https://transev.site/images/privacy-policy-og.jpg" />

        <meta name="robots" content="index, follow" />
      </Helmet>
      <Navbar /> {/* Add Navbar */}

      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl mx-auto my-6">
        <h1 className="text-4xl font-semibold text-center text-gray-900 mb-6 mt-20">
          Privacy Policy
        </h1>

        <section className="space-y-6">
          <p className="text-gray-800 text-base">
            TRANSMOGRIFFY GLOBAL PRIVATE LIMITED (“we” or “us” or “our”) respects the privacy of our users
            (“user” or “you”). This Privacy Policy explains how we collect, use, disclose, and safeguard
            your information when you visit our mobile application or website TRANSEV. Please read this Privacy
            Policy carefully. IF YOU DO NOT AGREE WITH THE TERMS OF THIS PRIVACY POLICY, PLEASE DO NOT ACCESS
            THE APPLICATION.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900">Changes to This Privacy Policy</h2>
          <p className="text-gray-800 text-base">
            We may update our Privacy Policy from time to time. Thus, we advise you to review this page periodically
            for any changes. We will notify you of any changes by posting the new Privacy Policy on this page.
            These changes are effective immediately after they are posted on this page.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900">Collection of Your Information</h2>
          <p className="text-gray-800 text-base">
            We may collect information about you in a variety of ways. The information we may collect via the
            Application depends on the content and materials you use, and includes:
          </p>

          <h3 className="text-xl font-semibold text-orange-700">Personal Data</h3>
          <p className="text-gray-800 text-base">
            Demographic and other personally identifiable information (such as your name and email address) that
            you voluntarily give to us when choosing to participate in various activities related to the Application,
            such as chat, posting messages in comment sections, or in our forums, liking posts, sending feedback, and
            responding to surveys.
          </p>

          <h3 className="text-xl font-semibold text-orange-700">Derivative Data</h3>
          <p className="text-gray-800 text-base">
            Information our servers automatically collect when you access the Application, such as your native actions
            that are integral to the Application, including your location, liking, as well as other interactions with
            the Application via server log files.
          </p>

          <h3 className="text-xl font-semibold text-orange-700">Geo-location Information</h3>
          <p className="text-gray-800 text-base">
            We may request access or permission to track location-based information from your mobile device, either
            continuously or while you are using the Application, to provide location-based services. If you wish to
            change our access or permissions, you may do so in your device’s settings, but location-based services
            will cease to work.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900">Use of Your Information</h2>
          <p className="text-gray-800 text-base">
            Having accurate information about you allows us to provide you with a smooth, efficient, and customized
            experience. We may use the information we collect about you to:
          </p>

          <ul className="list-disc pl-5 space-y-2 text-gray-800">
            <li>Deliver targeted advertising, coupons, newsletters, and other information regarding promotions and the Application.</li>
            <li>Enable user-to-user communications.</li>
            <li>Fulfill and manage purchases, orders, payments, and other transactions related to the Application.</li>
            <li>Generate a personal profile about you to make future visits to the Application more personalized.</li>
            <li>Increase the efficiency and operation of the Application.</li>
            <li>Notify you of updates to the Application.</li>
            <li>Request feedback and contact you about your use of the Application.</li>
            <li>Resolve disputes and troubleshoot problems.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-900">Disclosure of Your Information</h2>
          <p className="text-gray-800 text-base">
            We may share your information in the following situations:
          </p>

          <ul className="list-disc pl-5 space-y-2 text-gray-800">
            <li><strong>By law or to protect rights:</strong> If we believe the release of information is necessary to respond to legal processes or to protect rights, property, and safety.</li>
            <li><strong>Third-party Service Providers:</strong> We may share your information with third parties that perform services for us, including payment processing and marketing assistance.</li>
            <li><strong>Marketing Communications:</strong> With your consent, we may share your information with third parties for marketing purposes.</li>
            <li><strong>Online Postings:</strong> When you post content to the Application, your posts may be publicly visible.</li>
            <li><strong>Third-party Advertisers:</strong> We may use third-party companies to serve ads when you visit the Application.</li>
            <li><strong>Business Partners:</strong> We may share your information with our business partners to offer you certain products, services, or promotions.</li>
            <li><strong>Sale or Bankruptcy:</strong> In the event of reorganization, sale, or bankruptcy, your information may be transferred to a third party.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-900">Tracking Technologies</h2>
          <h3 className="text-xl font-semibold text-gray-900">Cookies and Web Beacons</h3>
          <p className="text-gray-800 text-base">
            We may use cookies, web beacons, tracking pixels, and other tracking technologies on the Application to
            help customize the Application and improve your experience.
          </p>

          <h3 className="text-xl font-semibold text-gray-900">Website Analytics</h3>
          <p className="text-gray-800 text-base">
            We may partner with third-party vendors such as Google Analytics to analyze and track users’ use of the
            Application.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900">Security of Your Information</h2>
          <p className="text-gray-800 text-base">
            We use administrative, technical, and physical security measures to help protect your personal information.
            However, no security measures are perfect, and we cannot guarantee the complete security of your data.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900">Policy for Children</h2>
          <p className="text-gray-800 text-base">
            We do not knowingly solicit information from or market to children under the age of 13.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900">Options Regarding Your Information</h2>
          <h3 className="text-xl font-semibold text-gray-900">Account Information</h3>
          <p className="text-gray-800 text-base">
            You may review or change the information in your account or terminate your account by logging into your
            account settings or contacting us.
          </p>

          <h3 className="text-xl font-semibold text-gray-900">Emails and Communications</h3>
          <p className="text-gray-800 text-base">
            You may opt-out of receiving emails or other communications from us by updating your preferences in your
            account settings or contacting us.
          </p>

          <h2 className="text-2xl font-semibold text-yellow-900">Contact Us</h2>
          <p className="text-gray-800 text-base">
            If you have any questions or suggestions regarding this Privacy Policy, please do not hesitate to contact us.
          </p>
        </section>
      </div>
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

export default PrivacyPolicy;
