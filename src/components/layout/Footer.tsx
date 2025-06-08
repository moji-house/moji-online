import Link from "next/link";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">RealEstate Digital</h3>
            <p className="text-gray-400">
              Your trusted platform for buying, selling, and renting properties in the digital age.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-gray-400 hover:text-white transition">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/properties" className="text-gray-400 hover:text-white transition">
                  Properties
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-gray-400 hover:text-white transition">
                  My Account
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Property Types</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/properties?type=apartment" className="text-gray-400 hover:text-white transition">
                  Apartments
                </Link>
              </li>
              <li>
                <Link href="/properties?type=house" className="text-gray-400 hover:text-white transition">
                  Houses
                </Link>
              </li>
              <li>
                <Link href="/properties?type=condo" className="text-gray-400 hover:text-white transition">
                  Condos
                </Link>
              </li>
              <li>
                <Link href="/properties?type=land" className="text-gray-400 hover:text-white transition">
                  Land
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <address className="text-gray-400 not-italic">
              <p>123 Real Estate Street</p>
              <p>Digital City, DC 10001</p>
              <p className="mt-2">Email: info@realestatedigital.com</p>
              <p>Phone: (123) 456-7890</p>
            </address>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-gray-400">
          <p>© {new Date().getFullYear()} RealEstate Digital. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
