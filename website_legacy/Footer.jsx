import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { contactInfo } from '../mockData';

const Footer = () => {
  return (
    <footer className="bg-[#2c3e73] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="mb-4">
              <img 
                src="https://customer-assets.emergentagent.com/job_learn-ace/artifacts/edbnwe58_INTELLECTUS%20ACADEMY%20logo.jpg" 
                alt="Intellectus Academy" 
                className="h-16 w-auto brightness-0 invert"
              />
            </div>
            <p className="text-gray-300 text-sm">
              Tailored tutoring that helps you own your academic success.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-300 hover:text-[#1ac8db] transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/subjects" className="text-gray-300 hover:text-[#1ac8db] transition-colors text-sm">
                  Subjects
                </Link>
              </li>
              <li>
                <Link to="/tutors" className="text-gray-300 hover:text-[#1ac8db] transition-colors text-sm">
                  Our Tutors
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-gray-300 hover:text-[#1ac8db] transition-colors text-sm">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-[#1ac8db] transition-colors text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              {contactInfo.phone.map((phone, index) => (
                <li key={index} className="flex items-center gap-2 text-sm text-gray-300">
                  <Phone className="w-4 h-4 text-[#1ac8db]" />
                  <a href={`tel:${phone.replace(/\s/g, '')}`} className="hover:text-[#1ac8db] transition-colors">
                    {phone}
                  </a>
                </li>
              ))}
              <li className="flex items-center gap-2 text-sm text-gray-300">
                <Mail className="w-4 h-4 text-[#1ac8db]" />
                <a href={`mailto:${contactInfo.email}`} className="hover:text-[#1ac8db] transition-colors">
                  {contactInfo.email}
                </a>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-300">
                <MapPin className="w-4 h-4 text-[#1ac8db] mt-0.5" />
                <span>{contactInfo.address}</span>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Operating Hours</h3>
            <div className="flex items-start gap-2 text-sm text-gray-300">
              <Clock className="w-4 h-4 text-[#1ac8db] mt-0.5" />
              <div>
                <p>Mon-Fri: 2PM-8PM</p>
                <p>Sat: 9AM-5PM</p>
                <p>Sun: Closed</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-600 mt-8 pt-8 text-center text-sm text-gray-300">
          <p>&copy; {new Date().getFullYear()} Intellectus Academy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
