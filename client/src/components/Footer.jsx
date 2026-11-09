import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-4 gap-10">
        <div>
          <h2 className="text-3xl font-bold text-indigo-400">NovaCart</h2>

          <p className="mt-4 text-gray-300 leading-7">
            NovaCart is your one-stop destination for premium shopping. Discover
            quality products, secure payments, and fast delivery.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Quick Links</h3>

          <ul className="space-y-2">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/products">Products</Link>
            </li>
            <li>
              <Link to="/cart">Cart</Link>
            </li>
            <li>
              <Link to="/wishlist">Wishlist</Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Customer</h3>

          <ul className="space-y-2">
            <li>Help Center</li>
            <li>Shipping</li>
            <li>Returns</li>
            <li>Privacy Policy</li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Follow Us</h3>

          <div className="flex gap-4 text-2xl">
            <FaFacebook className="hover:text-indigo-400 cursor-pointer" />
            <FaInstagram className="hover:text-pink-500 cursor-pointer" />
            <FaTwitter className="hover:text-blue-400 cursor-pointer" />
            <FaLinkedin className="hover:text-blue-500 cursor-pointer" />
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700 py-5 text-center text-gray-400">
        © {new Date().getFullYear()} NovaCart. All Rights Reserved.
      </div>
    </footer>
  );
}

export default Footer;
