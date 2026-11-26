import React, { useState, useEffect } from "react";
import { Button, Card, RecipeCreateDrawer, RecipeDetailDrawer, Alert } from "@/components";
import { getMyRecipes } from "@/services/api.js";
import {
  FaBookOpenReader,
  FaClock,
  FaPlus,
  FaUtensils,
  FaListCheck,
  FaMagnifyingGlass,
  FaEye,
} from "react-icons/fa6";

export default function MyRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);

  useEffect(() => {
    fetchMyRecipes();
  }, []);

  const fetchMyRecipes = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getMyRecipes();
      setRecipes(data);
    } catch (err) {
      setError(err.message || "Failed to load my recipes");
    } finally {
      setLoading(false);
    }
  };

  const filteredRecipes = recipes.filter((recipe) => {
    const q = searchQuery.toLowerCase();
    return (
      (recipe.title && recipe.title.toLowerCase().includes(q)) ||
      (recipe.category && recipe.category.toLowerCase().includes(q)) ||
      (recipe.description && recipe.description.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {error && (
        <Alert type="error" message={error} onClose={() => setError("")} />
      )}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary text-primary-foreground rounded-xl shadow-xs">
            <FaBookOpenReader size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">My Recipes</h1>
            <p className="text-sm text-muted-foreground">
              Manage your submitted recipes and track their moderation
              status.{" "}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-72">
            <FaMagnifyingGlass
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={14}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search my recipes..."
              className="w-full rounded-[10px] border border-border bg-card pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-xs"
            />
          </div>

          <Button
            variant="primary"
            size="md"
            onClick={() => setIsCreateDrawerOpen(true)}
            className="w-full sm:w-auto shrink-0"
          >
            <FaPlus className="mr-1.5" /> Create New Recipe
          </Button>
        </div>
      </div>

      {loading ? (
        <p className="text-muted-foreground py-12 text-center">
          Loading recipes...
        </p>
      ) : filteredRecipes.length === 0 ? (
        <Card>
          <div className="text-center py-12 space-y-3">
            <p className="text-base font-medium text-foreground">
              No recipes found matching your criteria.
            </p>
            <p className="text-xs text-muted-foreground">
              Try adjusting your search query or create a new recipe.
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

                {recipe.status === "REJECTED" && recipe.rejectionReason && (
                  <div className="bg-rose-50 border border-rose-200 p-2.5 rounded-[8px] text-xs text-rose-800">
                    <strong className="block font-bold mb-0.5">
                      Rejection Reason:
                    </strong>
                    {recipe.rejectionReason}
                  </div>
                )}

                <div className="flex items-center justify-end pt-3 border-t border-border">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedRecipe(recipe);
                      setIsDetailDrawerOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 text-sm"
                  >
                    <FaEye size={13} />
                    <span>View Details</span>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <RecipeCreateDrawer
        isOpen={isCreateDrawerOpen}
        onClose={() => setIsCreateDrawerOpen(false)}
        onSuccess={fetchMyRecipes}
      />

      <RecipeDetailDrawer
        isOpen={isDetailDrawerOpen}
        onClose={() => setIsDetailDrawerOpen(false)}
        recipe={selectedRecipe}
      />
    </div>
  );
}
