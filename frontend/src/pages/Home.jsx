import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Home() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex flex-1 flex-col bg-gray-50">
      <main className="max-w-4xl mx-auto px-6 py-12 text-center">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
          Temukan & Bagikan Resep Makanan Favoritmu
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          Platform berbagi resep kuliner nusantara dan internasional dengan
          kurasi reviewer terpercaya.
        </p>
        <div className="bg-white rounded-xl shadow p-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Katalog Resep Segera Hadir
          </h3>
          <p className="text-gray-500">
            Fitur publikasi dan moderasi resep sedang dalam tahap pengembangan
            aktif.
          </p>
        </div>
      </main>
    </div>
  );
}
