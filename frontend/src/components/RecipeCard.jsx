import React from "react";
import { Link } from "react-router-dom";
import { FaClock, FaUser } from "react-icons/fa6";
import Card from "./Card.jsx";

export default function RecipeCard({ recipe }) {
  const { title, slug, imageUrl, cookingTime, author, status } = recipe;

  const statusColors = {
    APPROVED: "bg-green-100 text-green-800",
    PENDING: "bg-yellow-100 text-yellow-800",
    REJECTED: "bg-red-100 text-red-800",
  };

  return (
    <Card className="group overflow-hidden transition hover:-translate-y-1">
      <Link to={`/recipes/${slug}`} className="block relative h-48 overflow-hidden bg-gray-100 -mx-6 -mt-6 mb-4">
        <img
          src={imageUrl || "/banner.png"}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {status && (
          <span
            className={`absolute top-3 right-3 rounded-full px-3 py-1 text-xs font-semibold ${
              statusColors[status] || "bg-gray-100 text-gray-800"
            }`}
          >
            {status}
          </span>
        )}
      </Link>
      
      <div>
        <Link to={`/recipes/${slug}`}>
          <h4 className="font-serif text-lg font-bold text-[#31281F] line-clamp-1 hover:text-orange-600 transition">
            {title}
          </h4>
        </Link>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
        <span className="flex items-center gap-1.5 truncate">
          <FaUser className="text-gray-400" />
          <span className="truncate">{author?.name || "Admin"}</span>
        </span>
        {cookingTime && (
          <span className="flex items-center gap-1.5 shrink-0">
            <FaClock className="text-gray-400" />
            {cookingTime} mins
          </span>
        )}
      </div>
    </Card>
  );
}
