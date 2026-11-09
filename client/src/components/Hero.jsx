import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white">
      <div className="max-w-7xl mx-auto px-6 py-24 flex flex-col lg:flex-row items-center justify-between gap-12">
        <div className="lg:w-1/2">
          <span className="bg-white text-indigo-700 px-4 py-1 rounded-full text-sm font-semibold">
            Welcome to NovaCart
          </span>

          <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight mt-6">
            Shop Smarter.
            <br />
            Live Better.
          </h1>

          <p className="text-lg mt-6 text-indigo-100 leading-8">
            Discover premium fashion, electronics, accessories and lifestyle
            products at unbeatable prices. Experience fast delivery, secure
            payments and hassle-free shopping.
          </p>

          <div className="flex flex-wrap gap-4 mt-8">
            <Link
              to="/products"
              className="bg-white text-indigo-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Shop Now
            </Link>

            <Link
              to="/register"
              className="border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-indigo-700 transition"
            >
              Create Account
            </Link>
          </div>

          <div className="flex gap-10 mt-12">
            <div>
              <h2 className="text-3xl font-bold">10K+</h2>
              <p className="text-indigo-100">Happy Customers</p>
            </div>

            <div>
              <h2 className="text-3xl font-bold">5K+</h2>
              <p className="text-indigo-100">Premium Products</p>
            </div>

            <div>
              <h2 className="text-3xl font-bold">99%</h2>
              <p className="text-indigo-100">Customer Satisfaction</p>
            </div>
          </div>
        </div>

        <div className="lg:w-1/2 flex justify-center">
          <img
            src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800"
            alt="Shopping"
            className="rounded-3xl shadow-2xl w-full max-w-lg object-cover"
          />
        </div>
      </div>
    </section>
  );
}

export default Hero;
