import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Home() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/auth/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-black shadow px-6 py-4 flex justify-between items-center m-0">
        <h1 className="text-xl font-bold text-orange-600">🍲 Ngenyangin</h1>
        <div className="space-x-4">
          {user ? (
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-gray-700">Halo, {user.name} ({user.role})</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="space-x-2">
              <Link
                to="/auth/login"
                className="px-4 py-2 text-orange-600 border border-orange-600 rounded-lg text-sm font-medium hover:bg-orange-50 transition"
              >
                Login
              </Link>
              <Link
                to="/auth/register"
                className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </nav>
      <main className="max-w-4xl mx-auto px-6 py-12 text-center">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Temukan & Bagikan Resep Makanan Favoritmu</h2>
        <p className="text-lg text-gray-600 mb-8">Platform berbagi resep kuliner nusantara dan internasional dengan kurasi reviewer terpercaya.</p>
        <div className="bg-white rounded-xl shadow p-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Katalog Resep Segera Hadir</h3>
          <p className="text-gray-500">Fitur publikasi dan moderasi resep sedang dalam tahap pengembangan aktif.</p>
        </div>
      </main>
    </div>
  );
}
