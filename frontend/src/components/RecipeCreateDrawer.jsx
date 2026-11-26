import React, { useState } from "react";
import Button from "./Button.jsx";
import Form from "./Form.jsx";
import Alert from "./Alert.jsx";
import { apiRequest } from "../services/api.js";
import { FaXmark, FaChevronLeft, FaChevronRight, FaCheck } from "react-icons/fa6";

export default function RecipeCreateDrawer({ isOpen, onClose, onSuccess }) {
  const [step, setStep] = useState(1); // 1: About, 2: Ingredients, 3: Steps, 4: Summary
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Main Course");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleNext = () => {
    setError("");
    if (step === 1 && !title.trim()) {
      setError("Recipe title is required.");
      return;
    }
    if (step === 2 && !ingredients.trim()) {
      setError("Ingredients are required.");
      return;
    }
    if (step === 3 && !instructions.trim()) {
      setError("Cooking instructions are required.");
      return;
    }
    setStep((s) => Math.min(s + 1, 4));
  };

  const handlePrev = () => {
    setError("");
    setStep((s) => Math.max(s - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await apiRequest("/recipes", {
        method: "POST",
        body: JSON.stringify({
          title,
          category,
          description,
          ingredients,
          instructions,
        }),
      });
      setLoading(false);
      onSuccess?.();
      onClose();
      setStep(1);
      setTitle("");
      setCategory("Main Course");
      setDescription("");
      setIngredients("");
      setInstructions("");
    } catch (err) {
      setError(err.message || "Failed to create recipe");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-xl bg-card border-l border-border shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/40">
            <div>
              <h2 className="text-xl font-bold text-foreground">Create New Recipe</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Step {step} of 4:{" "}
                {step === 1 ? "About" : step === 2 ? "Ingredients" : step === 3 ? "Steps" : "Summary"}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition cursor-pointer"
            >
              <FaXmark size={20} />
            </button>
          </div>

          <div className="w-full bg-muted h-1.5">
            <div
              className="bg-primary h-1.5 transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
            {error && <Alert type="error" message={error} onClose={() => setError("")} />}

            {step === 1 && (
              <div className="space-y-4 animate-fadeIn">
                <h3 className="text-base font-bold text-foreground">General Information</h3>
                <Form
                  label="Recipe Title"
                  id="recipe-title"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Authentic Nasi Goreng Spesial"
                />
                <div className="space-y-1">
                  <label htmlFor="recipe-category" className="block text-xs font-semibold text-foreground">
                    Category
                  </label>
                  <select
                    id="recipe-category"
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
                  <label htmlFor="recipe-desc" className="block text-xs font-semibold text-foreground">
                    Short Description
                  </label>
                  <textarea
                    id="recipe-desc"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Briefly describe your delicious recipe..."
                    className="w-full rounded-md border border-input px-3 py-2 text-sm bg-background shadow-xs focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4 animate-fadeIn">
                <h3 className="text-base font-bold text-foreground">Ingredients Required</h3>
                <p className="text-xs text-muted-foreground">
                  List the ingredients needed, one per line or separated by commas.
                </p>
                <div className="space-y-1">
                  <textarea
                    id="recipe-ingredients"
                    rows={7}
                    value={ingredients}
                    onChange={(e) => setIngredients(e.target.value)}
                    placeholder="- 2 cups jasmine rice&#10;- 3 cloves garlic, minced&#15;- 2 eggs..."
                    className="w-full rounded-md border border-input p-3 text-sm bg-background shadow-xs focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4 animate-fadeIn">
                <h3 className="text-base font-bold text-foreground">Cooking Steps</h3>
                <p className="text-xs text-muted-foreground">
                  Provide clear instructions on how to prepare and cook this dish.
                </p>
                <div className="space-y-1">
                  <textarea
                    id="recipe-instructions"
                    rows={8}
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder="1. Heat oil in a pan...&#10;2. Sauté garlic until fragrant..."
                    className="w-full rounded-md border border-input p-3 text-sm bg-background shadow-xs focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4 animate-fadeIn">
                <h3 className="text-base font-bold text-foreground">Recipe Summary</h3>
                <p className="text-xs text-muted-foreground">
                  Review your details before publishing. Once submitted, it will be sent for review.
                </p>

                <div className="bg-muted/40 p-4 rounded-xl border border-border space-y-3 text-sm">
                  <div>
                    <span className="text-xs text-muted-foreground uppercase font-bold">Title</span>
                    <p className="font-bold text-foreground text-base">{title || "Untitled"}</p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground uppercase font-bold">Category</span>
                    <p className="text-foreground">{category}</p>
                  </div>
                  {description && (
                    <div>
                      <span className="text-xs text-muted-foreground uppercase font-bold">Description</span>
                      <p className="text-foreground/80">{description}</p>
                    </div>
                  )}
                  <div>
                    <span className="text-xs text-muted-foreground uppercase font-bold">Ingredients</span>
                    <p className="text-foreground/85 whitespace-pre-line font-mono text-xs">{ingredients}</p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground uppercase font-bold">Instructions</span>
                    <p className="text-foreground/85 whitespace-pre-line text-xs">{instructions}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-muted/40">
            {step > 1 ? (
              <Button variant="outline" size="md" onClick={handlePrev}>
                <FaChevronLeft className="mr-1.5" /> Back
              </Button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <Button variant="primary" size="md" onClick={handleNext}>
                Next <FaChevronRight className="ml-1.5" />
              </Button>
            ) : (
              <Button variant="primary" size="md" loading={loading} onClick={handleSubmit}>
                <FaCheck className="mr-1.5" /> Save Recipe
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
