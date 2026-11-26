import React, { useState, useEffect } from "react";
import Button from "@/components/ui/Button.jsx";
import Form from "@/components/ui/Form.jsx";
import Alert from "@/components/ui/Alert.jsx";
import Modal from "@/components/ui/Modal.jsx";
import { updateRecipe } from "@/services/api.js";
import { FaXmark, FaCheck, FaPen, FaCircleExclamation } from "react-icons/fa6";

export default function RecipeEditDrawer({ isOpen, onClose, onSuccess, recipe }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Main Course");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    if (recipe) {
      setTitle(recipe.title || "");
      setCategory(recipe.category || "Main Course");
      setDescription(recipe.description || "");
      setImageUrl(recipe.imageUrl || "");
      setIngredients(recipe.ingredients || "");
      setInstructions(recipe.instructions || "");
      setError("");
    }
  }, [recipe]);

  if (!isOpen || !recipe) return null;

  const handleValidateAndPromptConfirm = (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Recipe title is required.");
      return;
    }
    if (!ingredients.trim()) {
      setError("Ingredients are required.");
      return;
    }
    if (!instructions.trim()) {
      setError("Cooking instructions are required.");
      return;
    }

    setIsConfirmOpen(true);
  };

  const handleConfirmedSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      await updateRecipe(recipe.id, {
        title: title.trim(),
        category: category.trim(),
        description: description.trim(),
        imageUrl: imageUrl.trim() || undefined,
        ingredients: ingredients.trim(),
        instructions: instructions.trim(),
      });
      setLoading(false);
      setIsConfirmOpen(false);
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.message || "Failed to update recipe");
      setLoading(false);
      setIsConfirmOpen(false);
    }
  };

  const isApproved = recipe.status === "APPROVED";
  const isRejected = recipe.status === "REJECTED";

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-hidden">
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
          onClick={onClose}
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <div className="w-screen max-w-xl bg-card border-l border-border shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/40">
              <div className="flex items-center gap-2">
                <FaPen className="text-primary" size={18} />
                <div>
                  <h2 className="text-xl font-bold text-foreground">Edit Recipe</h2>
                  <p className="text-xs text-muted-foreground">ID: {recipe.id}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition cursor-pointer"
              >
                <FaXmark size={20} />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleValidateAndPromptConfirm} className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
                {error && <Alert type="error" message={error} onClose={() => setError("")} />}

                {(isApproved || isRejected) && (
                  <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-[10px] text-xs text-amber-800 flex items-start gap-2.5">
                    <FaCircleExclamation className="shrink-0 text-amber-600 mt-0.5" size={16} />
                    <div>
                      <strong className="font-bold">Moderation Notice:</strong>
                      <p className="mt-0.5">
                        This recipe is currently <strong>{recipe.status}</strong>. Saving changes as a standard user will submit it back to <strong>Pending Review</strong>.
                      </p>
                    </div>
                  </div>
                )}

                <Form
                  label="Recipe Title"
                  id="edit-recipe-title"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Authentic Nasi Goreng Spesial"
                />

                <div className="space-y-1">
                  <label htmlFor="edit-recipe-category" className="block text-xs font-semibold text-foreground">
                    Category
                  </label>
                  <select
                    id="edit-recipe-category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-md border border-input px-3 py-2 text-sm bg-background shadow-xs focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="Main Course">Main Course</option>
                    <option value="Appetizer">Appetizer</option>
                    <option value="Dessert">Dessert</option>
                    <option value="Beverage">Beverage</option>
                    <option value="Traditional">Traditional</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label htmlFor="edit-recipe-desc" className="block text-xs font-semibold text-foreground">
                    Short Description
                  </label>
                  <textarea
                    id="edit-recipe-desc"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Briefly describe your delicious recipe..."
                    className="w-full rounded-md border border-input px-3 py-2 text-sm bg-background shadow-xs focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <Form
                  label="Image URL (Optional)"
                  id="edit-recipe-image-url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                />

                {imageUrl.trim() && (
                  <div className="space-y-1">
                    <span className="block text-xs font-semibold text-muted-foreground">Image Preview</span>
                    <div className="relative rounded-lg overflow-hidden border border-border h-36 bg-muted flex items-center justify-center">
                      <img
                        src={imageUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                        onLoad={(e) => {
                          e.target.style.display = "block";
                        }}
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <label htmlFor="edit-recipe-ingredients" className="block text-xs font-semibold text-foreground">
                    Ingredients <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="edit-recipe-ingredients"
                    rows={4}
                    required
                    value={ingredients}
                    onChange={(e) => setIngredients(e.target.value)}
                    placeholder="List ingredients here, one per line..."
                    className="w-full rounded-md border border-input p-3 text-sm bg-background shadow-xs focus:outline-none focus:ring-2 focus:ring-primary font-mono text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="edit-recipe-instructions" className="block text-xs font-semibold text-foreground">
                    Cooking Instructions <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="edit-recipe-instructions"
                    rows={5}
                    required
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder="Step 1: Heat oil in a wok...&#10;Step 2: Add garlic..."
                    className="w-full rounded-md border border-input p-3 text-sm bg-background shadow-xs focus:outline-none focus:ring-2 focus:ring-primary leading-relaxed"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-muted/40">
                <Button variant="outline" size="md" type="button" onClick={onClose}>
                  Cancel
                </Button>
                <Button variant="primary" size="md" type="submit">
                  <FaCheck className="mr-1.5" /> Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        title="Confirm Recipe Updates"
        footer={
          <>
            <Button
              variant="outline"
              size="md"
              type="button"
              disabled={loading}
              onClick={() => setIsConfirmOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              type="button"
              disabled={loading}
              onClick={handleConfirmedSubmit}
            >
              {loading ? "Saving..." : "Yes, Save Changes"}
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <p className="text-sm text-foreground/85">
            Are you sure you want to save the updates to <strong className="text-foreground">"{title}"</strong>?
          </p>
          {(isApproved || isRejected) && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-[8px] text-xs text-amber-800">
              <strong>Notice:</strong> Because this recipe is currently <strong>{recipe.status}</strong>, modifying it will resubmit it for review by an administrator or reviewer before appearing in the public catalog.
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}
