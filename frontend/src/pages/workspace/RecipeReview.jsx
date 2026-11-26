import React, { useState, useEffect } from "react";
import { Button, Card, Alert, RecipeDetailDrawer } from "@/components";
import { getPendingRecipes, moderateRecipe } from "@/services/api.js";
import {
  FaClipboardList,
  FaMagnifyingGlass,
  FaEye,
  FaClock,
  FaUtensils,
  FaListCheck,
} from "react-icons/fa6";
import noPictureImg from "@/assets/nopicture.png";

export default function RecipeReview() {
  const [pendingRecipes, setPendingRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);

  useEffect(() => {
    fetchPendingRecipes();
  }, []);

  const fetchPendingRecipes = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getPendingRecipes();
      setPendingRecipes(data);
    } catch (err) {
      setError(err.message || "Failed to load review queue");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      setError("");
      await moderateRecipe(id, { status: "APPROVED" });
      setSuccess("Recipe successfully approved");
      fetchPendingRecipes();
    } catch (err) {
      setError(err.message || "Failed to approve recipe");
      throw err;
    }
  };

  const handleReject = async (id, reason) => {
    try {
      setError("");
      await moderateRecipe(id, { status: "REJECTED", rejectionReason: reason });
      setSuccess("Recipe successfully rejected");
      fetchPendingRecipes();
    } catch (err) {
      setError(err.message || "Failed to reject recipe");
      throw err;
    }
  };

  const filteredRecipes = pendingRecipes.filter((recipe) => {
    const q = searchQuery.toLowerCase();
    return (
      (recipe.title && recipe.title.toLowerCase().includes(q)) ||
      (recipe.author?.name && recipe.author.name.toLowerCase().includes(q)) ||
      (recipe.category && recipe.category.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
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

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary text-primary-foreground rounded-xl shadow-xs">
            <FaClipboardList size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Recipe Review Queue
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage recipes waiting for moderation
            </p>
          </div>
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
            placeholder="Search pending recipes by title or author..."
            className="w-full rounded-[10px] border border-border bg-card pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-xs"
          />
        </div>
      </div>

      {loading ? (
        <p className="text-muted-foreground py-12 text-center">
          Loading review queue...
        </p>
      ) : filteredRecipes.length === 0 ? (
        <Card>
          <div className="text-center py-12 space-y-2">
            <p className="text-base font-medium text-foreground">
              No pending recipes found matching your search.
            </p>
            <p className="text-xs text-muted-foreground">
              All caught up or try adjusting your search query.
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map((recipe) => (
            <Card
              key={recipe.id}
              title={recipe.title}
              subtitle={
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-primary/10 text-primary">
                  {recipe.category || "Main Course"}
                </span>
              }
            >
              <div className="space-y-4 pt-1">
                {/* Recipe Image Banner */}
                <div className="relative h-44 w-full rounded-lg overflow-hidden bg-muted border border-border shadow-xs flex items-center justify-center">
                  <img
                    src={recipe.imageUrl || noPictureImg}
                    alt={recipe.title}
                    className="w-full h-full object-cover object-center"
                    onError={(e) => {
                      e.target.src = noPictureImg;
                    }}
                  />
                </div>

                {/* Recipe Info */}
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
                    {recipe.status === "APPROVED"
                      ? "Approved"
                      : recipe.status === "REJECTED"
                        ? "Rejected"
                        : "Pending Review"}
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

                {recipe.description && (
                  <p className="text-xs text-foreground/80 line-clamp-2">
                    {recipe.description}
                  </p>
                )}

                <div className="bg-muted/40 p-3 rounded-[8px] text-xs text-foreground/80 space-y-1.5 border border-border/50">
                  <p className="line-clamp-2">
                    <strong className="text-foreground flex items-center gap-1">
                      <FaUtensils size={11} className="text-primary" />{" "}
                      Ingredients:
                    </strong>{" "}
                    {recipe.ingredients}
                  </p>
                  <p className="line-clamp-2">
                    <strong className="text-foreground flex items-center gap-1">
                      <FaListCheck size={11} className="text-primary" />{" "}
                      Instructions:
                    </strong>{" "}
                    {recipe.instructions}
                  </p>
                </div>
              </div>

              {/* Footer info & View Details button */}
              <div className="pt-3 border-t border-border flex items-center justify-end mt-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedRecipe(recipe);
                    setIsDetailDrawerOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 text-xs"
                >
                  <FaEye size={13} />
                  <span>View Details</span>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <RecipeDetailDrawer
        isOpen={isDetailDrawerOpen}
        onClose={() => setIsDetailDrawerOpen(false)}
        recipe={selectedRecipe}
        showModeration={true}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
}
