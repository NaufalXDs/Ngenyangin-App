import React, { useState, useEffect } from "react";
import Card from "../../components/Card.jsx";
import Button from "../../components/Button.jsx";
import WorkspaceLayout from "../../layouts/WorkspaceLayout.jsx";
import { getAdminRecipes, adminDeleteRecipe } from "../../services/api.js";
import Alert from "../../components/Alert.jsx";
import Modal from "../../components/Modal.jsx";
import {
  FaBookBookmark,
  FaMagnifyingGlass,
  FaTrashCan,
  FaUser,
  FaClock,
} from "react-icons/fa6";

export default function RecipeManagement() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRecipeId, setSelectedRecipeId] = useState(null);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getAdminRecipes();
      setRecipes(data);
    } catch (err) {
      setError(err.message || "Failed to load recipes");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRecipe = async () => {
    try {
      setError("");
      await adminDeleteRecipe(selectedRecipeId);
      setSuccess("Recipe deleted successfully");
      setIsDeleteModalOpen(false);
      setSelectedRecipeId(null);
      fetchRecipes();
    } catch (err) {
      setError(err.message || "Failed to delete recipe");
    }
  };

  const counts = {
    ALL: recipes.length,
    APPROVED: recipes.filter((r) => r.status === "APPROVED").length,
    PENDING: recipes.filter((r) => r.status === "PENDING").length,
    REJECTED: recipes.filter((r) => r.status === "REJECTED").length,
  };

  const filteredRecipes = recipes.filter((recipe) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      (recipe.title && recipe.title.toLowerCase().includes(q)) ||
      (recipe.author?.name && recipe.author.name.toLowerCase().includes(q)) ||
      (recipe.category && recipe.category.toLowerCase().includes(q));

    const matchesStatus =
      statusFilter === "ALL" || recipe.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <>
      {error && (
        <Alert type="error" message={error} onClose={() => setError("")} />
      )}
      {success && (
        <Alert
          type="success"
          message={success}
          onClose={() => setSuccess("")}
        />
      )}

      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <FaBookBookmark className="text-primary" /> Recipe Management
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Oversee, review, and manage all recipes in the system.
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <FaMagnifyingGlass
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={14}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search recipes by title or author..."
              className="w-full rounded-[10px] border border-border bg-card pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-xs"
            />
          </div>
        </div>

        {/* Status Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pb-2">
          {[
            { key: "ALL", label: "All Recipes" },
            { key: "APPROVED", label: "Approved" },
            { key: "PENDING", label: "Pending" },
            { key: "REJECTED", label: "Rejected" },
          ].map((pill) => {
            const isActive = statusFilter === pill.key;
            return (
              <button
                key={pill.key}
                onClick={() => setStatusFilter(pill.key)}
                className={`px-3.5 py-1.5 rounded-[10px] text-xs font-semibold transition border cursor-pointer ${
                  isActive
                    ? "bg-primary text-primary-foreground border-primary shadow-xs"
                    : "bg-card text-foreground border-border hover:bg-muted"
                }`}
              >
                {pill.label} ({counts[pill.key] || 0})
              </button>
            );
          })}
        </div>

        {/* Recipe Grid */}
        {loading ? (
          <p className="text-muted-foreground py-12 text-center">
            Loading recipes...
          </p>
        ) : filteredRecipes.length === 0 ? (
          <div className="bg-card rounded-[10px] border border-border p-12 text-center text-muted-foreground shadow-xs">
            <p className="text-base font-medium">
              No recipes found matching your criteria.
            </p>
            <p className="text-xs mt-1">
              Try adjusting your search query or status filter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map((recipe) => (
              <Card
                key={recipe.id}
                title={recipe.title}
                subtitle={
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <FaUser size={11} />{" "}
                    {recipe.author?.name || "Unknown Author"}
                  </span>
                }
              >
                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-2.5 py-1 rounded-[8px] text-[11px] font-bold tracking-wide uppercase ${
                        recipe.status === "APPROVED"
                          ? "bg-emerald-100 text-emerald-800"
                          : recipe.status === "REJECTED"
                            ? "bg-rose-100 text-rose-800"
                            : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {recipe.status}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <FaClock size={11} />
                      {new Date(recipe.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <div className="bg-muted/40 p-3 rounded-[8px] text-xs text-foreground/80 space-y-1.5 border border-border/50">
                    <p className="line-clamp-2">
                      <strong className="text-foreground">Category:</strong>{" "}
                      {recipe.category || "Main Course"}
                    </p>
                    <p className="line-clamp-2">
                      <strong className="text-foreground">Ingredients:</strong>{" "}
                      {recipe.ingredients}
                    </p>
                  </div>

                  {recipe.status === "REJECTED" && recipe.rejectionReason && (
                    <div className="bg-rose-50 border border-rose-200 p-2.5 rounded-[8px] text-xs text-rose-800">
                      <strong>Rejection Reason:</strong>{" "}
                      {recipe.rejectionReason}
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                    <Button
                      variant="destructive"
                      size="md"
                      onClick={() => {
                        setSelectedRecipeId(recipe.id);
                        setIsDeleteModalOpen(true);
                      }}
                      className="inline-flex items-center gap-1.5 text-sm"
                    >
                      <FaTrashCan size={14} />
                      <span>Delete Recipe</span>
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Recipe"
        footer={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDeleteRecipe}
            >
              Delete Recipe
            </Button>
          </>
        }
      >
        <p className="text-sm text-foreground/85">
          Are you sure you want to delete this recipe from the system? This
          action cannot be undone.
        </p>
      </Modal>
    </>
  );
}
