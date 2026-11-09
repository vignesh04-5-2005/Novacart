import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";

function Profile() {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-indigo-600 text-white flex items-center justify-center text-4xl font-bold">
            {user.name.charAt(0).toUpperCase()}
          </div>

          <div>
            <h1 className="text-3xl font-bold">{user.name}</h1>

            <p className="text-gray-600 mt-2">{user.email}</p>
          </div>
        </div>

        <hr className="my-8" />

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-indigo-50 rounded-xl p-6 text-center">
            <h2 className="text-3xl font-bold text-indigo-600">0</h2>

            <p className="mt-2 text-gray-600">Orders</p>
          </div>

          <div className="bg-green-50 rounded-xl p-6 text-center">
            <h2 className="text-3xl font-bold text-green-600">0</h2>

            <p className="mt-2 text-gray-600">Wishlist</p>
          </div>

          <div className="bg-yellow-50 rounded-xl p-6 text-center">
            <h2 className="text-3xl font-bold text-yellow-600">0</h2>

            <p className="mt-2 text-gray-600">Cart Items</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
