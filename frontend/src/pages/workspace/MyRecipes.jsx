import React from "react";
import Button from "../../components/Button.jsx";
import Card from "../../components/Card.jsx";

export default function MyRecipes({ recipes = [], loading = false }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-[#31281F]">Daftar Resep Saya</h2>
        <Button to="/recipes/create" variant="primary" size="md">
          + Buat Resep Baru
        </Button>
      </div>

      {loading ? (
        <p className="text-gray-500">Memuat resep...</p>
      ) : recipes.length === 0 ? (
        <Card>
          <p className="text-center text-gray-500 py-8">Anda belum memiliki resep. Yuk buat resep pertama Anda!</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <Card key={recipe.id} title={recipe.title} subtitle={recipe.category}>
              <div className="space-y-3">
                <p className="text-xs text-gray-600 line-clamp-2">{recipe.description}</p>
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <span
                    className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                      recipe.status === "APPROVED"
                        ? "bg-green-100 text-green-800"
                        : recipe.status === "REJECTED"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {recipe.status === "APPROVED"
                      ? "Disetujui"
                      : recipe.status === "REJECTED"
                      ? "Ditolak"
                      : "Menunggu Review"}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(recipe.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {recipe.status === "REJECTED" && recipe.rejectionReason && (
                  <div className="mt-2 p-2.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
                    <strong className="block font-bold mb-0.5">Alasan Penolakan:</strong>
                    {recipe.rejectionReason}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
