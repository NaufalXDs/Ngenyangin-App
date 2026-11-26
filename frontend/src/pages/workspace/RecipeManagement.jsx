import React, { useState, useEffect } from "react";
import { Button, Alert, Modal, Form, RecipeDetailDrawer, RecipeEditDrawer } from "@/components";
import { getAdminRecipes, adminDeleteRecipe, moderateRecipe } from "@/services/api.js";
import {
  FaBookBookmark,
  FaMagnifyingGlass,
  FaTrashCan,
  FaEye,
  FaPen,
  FaChevronLeft,
  FaChevronRight,
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
  const [confirmRecipeIdInput, setConfirmRecipeIdInput] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [selectedEditRecipe, setSelectedEditRecipe] = useState(null);

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

  const handleStatusChange = async (recipeId, newStatus) => {
    try {
      setError("");
      await moderateRecipe(recipeId, {
        status: newStatus,
        rejectionReason:
          newStatus === "REJECTED" ? "Updated by administrator" : undefined,
      });
      setSuccess("Recipe status updated successfully");
      fetchRecipes();
    } catch (err) {
      setError(err.message || "Failed to update recipe status");
    }
  };

  const handleDeleteRecipe = async () => {
    if (confirmRecipeIdInput.trim() !== selectedRecipeId) {
      setDeleteError("Recipe ID does not match. Please type the exact recipe ID.");
      return;
    }
    try {
      setDeleteError("");
      await adminDeleteRecipe(selectedRecipeId);
      setSuccess("Recipe deleted successfully");
      setIsDeleteModalOpen(false);
      setSelectedRecipeId(null);
      setConfirmRecipeIdInput("");
      fetchRecipes();
    } catch (err) {
      setDeleteError(err.message || "Failed to delete recipe");
    }
  };

  const counts = {
    ALL: recipes.length,
    APPROVED: recipes.filter((r) => r.status === "APPROVED").length,
    PENDING: recipes.filter((r) => r.status === "PENDING").length,
    REJECTED: recipes.filter((r) => r.status === "REJECTED").length,
  };

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

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

  const totalPages = Math.ceil(filteredRecipes.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedRecipes = filteredRecipes.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <>
      <div className="my-6">
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
      </div>

      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary text-primary-foreground rounded-xl shadow-xs">
              <FaBookBookmark size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Recipe Management
              </h1>
              <p className="text-sm text-muted-foreground">
                Oversee, review, and manage all recipes in the system.
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
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
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
                onClick={() => {
                  setStatusFilter(pill.key);
                  setCurrentPage(1);
                }}
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

        {/* Recipe Table View */}
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
          <div className="bg-card rounded-[10px] border border-border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/50 border-b border-border text-foreground font-semibold">
                  <tr>
                    <th className="px-6 py-3.5">Recipe</th>
                    <th className="px-6 py-3.5">Author</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5">Submitted Date</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {paginatedRecipes.map((recipe) => (
                    <tr
                      key={recipe.id}
                      className="hover:bg-muted/35 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="min-w-0 space-y-1">
                          <p className="font-semibold text-foreground truncate">
                            {recipe.title}
                          </p>
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-primary/10 text-primary">
                            {recipe.category || "Main Course"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="min-w-0">
                          <p className="font-medium text-foreground text-xs">
                            {recipe.author?.name || "Unknown"}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {recipe.author?.email}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={recipe.status}
                          onChange={(e) =>
                            handleStatusChange(recipe.id, e.target.value)
                          }
                          className={`border rounded-lg px-2.5 py-1.5 text-xs font-bold tracking-wide uppercase focus:outline-none focus:ring-2 focus:ring-primary shadow-xs cursor-pointer ${
                            recipe.status === "APPROVED"
                              ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                              : recipe.status === "REJECTED"
                                ? "bg-rose-100 text-rose-800 border-rose-300"
                                : "bg-amber-100 text-amber-800 border-amber-300"
                          }`}
                        >
                          <option value="APPROVED">APPROVED</option>
                          <option value="PENDING">PENDING</option>
                          <option value="REJECTED">REJECTED</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground text-xs font-medium">
                        {new Date(recipe.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <Button
                          variant="outline"
                          size="md"
                          onClick={() => {
                            setSelectedEditRecipe(recipe);
                            setIsEditDrawerOpen(true);
                          }}
                          className="inline-flex items-center gap-1.5 text-sm"
                        >
                          <FaPen size={12} />
                          <span>Edit</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="md"
                          onClick={() => {
                            setSelectedRecipe(recipe);
                            setIsDetailDrawerOpen(true);
                          }}
                          className="inline-flex items-center gap-1.5 text-sm"
                        >
                          <FaEye size={14} />
                          <span>View Details</span>
                        </Button>
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
                          <span>Delete</span>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {filteredRecipes.length > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-border bg-card">
                <span className="text-xs sm:text-sm text-muted-foreground">
                  Showing <strong className="text-foreground">{startIndex + 1}</strong> to{" "}
                  <strong className="text-foreground">
                    {Math.min(startIndex + ITEMS_PER_PAGE, filteredRecipes.length)}
                  </strong>{" "}
                  of <strong className="text-foreground">{filteredRecipes.length}</strong> recipes
                </span>

                <div className="flex items-center gap-1.5">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    className="gap-1 px-2.5"
                  >
                    <FaChevronLeft size={12} />
                    <span>Prev</span>
                  </Button>

                  <div className="flex items-center gap-1 px-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        type="button"
                        onClick={() => setCurrentPage(page)}
                        className={`w-8 h-8 rounded-[8px] text-xs font-semibold transition cursor-pointer ${
                          currentPage === page
                            ? "bg-primary text-primary-foreground shadow-xs"
                            : "text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    className="gap-1 px-2.5"
                  >
                    <span>Next</span>
                    <FaChevronRight size={12} />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Recipe Deletion"
        footer={
          <>
            <Button
              variant="outline"
              size="md"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="md"
              onClick={handleDeleteRecipe}
            >
              Confirm Delete
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-foreground/85">
            This action is permanent and cannot be undone. To confirm, please type the exact Recipe ID below:
          </p>
          <div className="p-3 bg-muted rounded-[8px] font-mono text-xs font-bold text-foreground select-all break-all">
            {selectedRecipeId}
          </div>
          <Form
            label="Type Recipe ID to Confirm"
            id="confirm-recipe-id-mgmt"
            value={confirmRecipeIdInput}
            onChange={(e) => setConfirmRecipeIdInput(e.target.value)}
            placeholder="Paste or type recipe ID here..."
          />
          {deleteError && <p className="text-xs font-semibold text-red-600">{deleteError}</p>}
        </div>
      </Modal>

      <RecipeDetailDrawer
        isOpen={isDetailDrawerOpen}
        onClose={() => setIsDetailDrawerOpen(false)}
        recipe={selectedRecipe}
      />

      <RecipeEditDrawer
        isOpen={isEditDrawerOpen}
        onClose={() => setIsEditDrawerOpen(false)}
        onSuccess={fetchRecipes}
        recipe={selectedEditRecipe}
      />
    </>
  );
}
