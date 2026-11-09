import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-8xl font-extrabold text-indigo-600">404</h1>

        <h2 className="text-4xl font-bold mt-4">Page Not Found</h2>

        <p className="text-gray-600 mt-4">
          The page you're looking for doesn't exist.
        </p>

        <Link
          to="/"
          className="inline-block mt-8 bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
