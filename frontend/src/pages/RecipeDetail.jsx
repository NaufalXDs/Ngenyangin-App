import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { getRecipeBySlug, moderateRecipe, adminDeleteRecipe } from "../services/api.js";
import Button from "../components/Button.jsx";
import Card from "../components/Card.jsx";
import Alert from "../components/Alert.jsx";
import Modal from "../components/Modal.jsx";
import Form from "../components/Form.jsx";
import {
  FaArrowLeft,
  FaShareNodes,
  FaCheck,
  FaCopy,
  FaUtensils,
  FaCalendarDays,
  FaListCheck,
  FaFire,
  FaShieldHalved,
  FaTrashCan,
} from "react-icons/fa6";

export default function RecipeDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [copied, setCopied] = useState(false);

  // Admin Delete Modal state with ID confirmation
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [confirmRecipeIdInput, setConfirmRecipeIdInput] = useState("");
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    fetchRecipe();
  }, [slug]);

  const fetchRecipe = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getRecipeBySlug(slug);
      setRecipe(data);
    } catch (err) {
      setError(err.message || "Failed to load recipe");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      setError("");
      setSuccess("");
      await moderateRecipe(recipe.id, {
        status: newStatus,
        rejectionReason: newStatus === "REJECTED" ? "Rejected by administrator" : undefined,
      });
      setSuccess(`Recipe status successfully updated to ${newStatus}`);
      fetchRecipe();
    } catch (err) {
      setError(err.message || "Failed to update recipe status");
    }
  };

  const handleDeleteRecipe = async () => {
    if (confirmRecipeIdInput.trim() !== recipe.id) {
      setDeleteError("Recipe ID does not match. Please type the exact recipe ID to confirm.");
      return;
    }
    try {
      setDeleteError("");
      await adminDeleteRecipe(recipe.id);
      setIsDeleteModalOpen(false);
      navigate("/");
    } catch (err) {
      setDeleteError(err.message || "Failed to delete recipe");
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share && recipe) {
      try {
        await navigator.share({
          title: recipe.title,
          text: recipe.description || `Check out this delicious ${recipe.title} recipe on Ngenyangin!`,
          url: window.location.href,
        });
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Error sharing:", err);
        }
      }
    } else {
      handleCopyLink();
    }
  };

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-[60vh] bg-background">
        <div className="text-center space-y-3">
          <FaUtensils className="animate-bounce mx-auto text-primary text-3xl" />
          <p className="text-muted-foreground font-medium text-base">Loading recipe details...</p>
        </div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20 text-center space-y-6">
        <Alert type="error" message={error || "Recipe not found."} />
        <Button variant="primary" onClick={() => navigate("/")} className="inline-flex items-center gap-2">
          <FaArrowLeft /> Back to Home
        </Button>
      </div>
    );
  }

  const ingredientsList = recipe.ingredients
    ? recipe.ingredients.split("\n").filter((item) => item.trim().length > 0)
    : [];

  const instructionsList = recipe.instructions
    ? recipe.instructions.split("\n").filter((step) => step.trim().length > 0)
    : [];

  const isAdmin = user && user.role === "ADMIN";

  return (
    <div className="flex-1 bg-background py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {success && <Alert type="success" message={success} onClose={() => setSuccess("")} />}
        {error && <Alert type="error" message={error} onClose={() => setError("")} />}

        {/* Navigation Breadcrumb / Back button */}
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition"
          >
            <FaArrowLeft /> Back to Recipes
          </Link>
          <div className="flex items-center gap-2">
            {isAdmin && (
              <span className="text-xs font-bold px-3 py-1 bg-rose-100 text-rose-800 rounded-full flex items-center gap-1">
                <FaShieldHalved /> Admin Mode
              </span>
            )}
            <span className="text-xs font-semibold px-3 py-1 bg-primary/10 text-primary rounded-full">
              {recipe.category || "General"}
            </span>
          </div>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Recipe Information (7 cols on lg) */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4 border-b border-border pb-6">
              <h1 className="text-3xl sm:text-5xl font-black text-foreground tracking-tight leading-tight">
                {recipe.title}
              </h1>

              {/* Recipe ID visible ONLY to ADMIN */}
              {isAdmin && (
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-muted rounded-md font-mono text-xs text-muted-foreground border border-border">
                  <span>Recipe ID:</span>
                  <strong className="text-foreground select-all">{recipe.id}</strong>
                </div>
              )}

              {recipe.description && (
                <p className="text-base sm:text-lg text-muted-foreground font-normal leading-relaxed">
                  {recipe.description}
                </p>
              )}

              {/* Author & Meta */}
              <div className="flex flex-wrap items-center gap-6 pt-2 text-xs sm:text-sm text-muted-foreground">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-primary/15 text-primary flex items-center justify-center font-bold text-xs">
                    {(recipe.author?.username || recipe.author?.name || "C").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      {recipe.author?.name || recipe.author?.username || "Community Chef"}
                    </p>
                    {recipe.author?.username && (
                      <p className="text-[11px] text-muted-foreground">@{recipe.author.username}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <FaCalendarDays className="text-primary/70" />
                  <span>
                    {new Date(recipe.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Ingredients Section */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
                <FaListCheck className="text-primary" /> Ingredients
              </h2>
              <div className="bg-card border border-border rounded-[10px] p-6 shadow-xs">
                <ul className="space-y-3">
                  {ingredientsList.map((ingredient, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm sm:text-base text-foreground/90">
                      <span className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                      <span>{ingredient}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Instructions Section */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
                <FaFire className="text-primary" /> Cooking Instructions
              </h2>
              <div className="space-y-4">
                {instructionsList.map((step, idx) => (
                  <div
                    key={idx}
                    className="flex gap-4 p-5 bg-card border border-border rounded-[10px] shadow-xs"
                  >
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm shrink-0">
                      {idx + 1}
                    </span>
                    <p className="text-sm sm:text-base text-foreground/90 leading-relaxed pt-1">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Recipe Image, Share Card & Admin Actions (5 cols on lg) */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            {/* Recipe Image Card */}
            <div className="overflow-hidden rounded-[14px] border border-border bg-card shadow-sm">
              <img
                src={recipe.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"}
                alt={recipe.title}
                className="w-full h-72 sm:h-80 object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Recipe Sharing Card */}
            <Card
              title="Share This Recipe"
              subtitle="Spread the love for delicious food with your friends and family"
              headerAction={<FaShareNodes className="text-primary" size={20} />}
            >
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={window.location.href}
                    className="w-full text-xs sm:text-sm bg-muted/50 border border-border rounded-[8px] px-3 py-2 text-muted-foreground outline-none font-mono"
                  />
                  <Button
                    variant="primary"
                    size="md"
                    onClick={handleCopyLink}
                    className="shrink-0 inline-flex items-center gap-2"
                  >
                    {copied ? (
                      <>
                        <FaCheck className="text-green-300" /> Copied
                      </>
                    ) : (
                      <>
                        <FaCopy /> Copy
                      </>
                    )}
                  </Button>
                </div>

                {navigator.share && (
                  <Button
                    variant="outline"
                    size="md"
                    onClick={handleNativeShare}
                    className="w-full inline-flex items-center justify-center gap-2"
                  >
                    <FaShareNodes /> Share with Device
                  </Button>
                )}

                {copied && (
                  <p className="text-xs font-semibold text-green-600 text-center animate-fade-in">
                    Link successfully copied to clipboard!
                  </p>
                )}
              </div>
            </Card>

            {/* Admin Quick Actions Card (Visible ONLY to ADMIN) */}
            {isAdmin && (
              <Card
                title="Admin Actions"
                subtitle="Manage recipe status and system moderation"
                headerAction={<FaShieldHalved className="text-rose-600" size={20} />}
                className="border-rose-200 bg-rose-50/30"
              >
                <div className="space-y-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">Change Status</label>
                    <select
                      value={recipe.status}
                      onChange={(e) => handleStatusChange(e.target.value)}
                      className="w-full border border-border bg-card rounded-[10px] px-3 py-2 text-sm font-bold uppercase focus:outline-none focus:ring-2 focus:ring-primary shadow-xs cursor-pointer"
                    >
                      <option value="APPROVED">APPROVED</option>
                      <option value="PENDING">PENDING</option>
                      <option value="REJECTED">REJECTED</option>
                    </select>
                  </div>

                  <div className="pt-2 border-t border-border">
                    <Button
                      variant="destructive"
                      size="md"
                      onClick={() => {
                        setConfirmRecipeIdInput("");
                        setDeleteError("");
                        setIsDeleteModalOpen(true);
                      }}
                      className="w-full inline-flex items-center justify-center gap-2"
                    >
                      <FaTrashCan /> Delete Recipe
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Admin Delete Confirmation Modal requiring exact Recipe ID */}
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
            {recipe.id}
          </div>
          <Form
            label="Type Recipe ID to Confirm"
            id="confirm-recipe-id"
            value={confirmRecipeIdInput}
            onChange={(e) => setConfirmRecipeIdInput(e.target.value)}
            placeholder="Paste or type recipe ID here..."
          />
          {deleteError && <p className="text-xs font-semibold text-red-600">{deleteError}</p>}
        </div>
      </Modal>
    </div>
  );
}
