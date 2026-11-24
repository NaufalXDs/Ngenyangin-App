import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getRecipeBySlug } from "../services/api.js";
import Button from "../components/Button.jsx";
import Card from "../components/Card.jsx";
import Alert from "../components/Alert.jsx";
import {
  FaArrowLeft,
  FaShareNodes,
  FaCheck,
  FaCopy,
  FaUtensils,
  FaUser,
  FaCalendarDays,
  FaListCheck,
  FaFire,
} from "react-icons/fa6";

export default function RecipeDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

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

  // Format ingredients and instructions into clean arrays
  const ingredientsList = recipe.ingredients
    ? recipe.ingredients.split("\n").filter((item) => item.trim().length > 0)
    : [];

  const instructionsList = recipe.instructions
    ? recipe.instructions.split("\n").filter((step) => step.trim().length > 0)
    : [];

  return (
    <div className="flex-1 bg-background py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Navigation Breadcrumb / Back button */}
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition"
          >
            <FaArrowLeft /> Back to Recipes
          </Link>
          <span className="text-xs font-semibold px-3 py-1 bg-primary/10 text-primary rounded-full">
            {recipe.category || "General"}
          </span>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Recipe Information (7 cols on lg) */}
          <div className="lg:col-span-7 space-y-8">
            {/* Header info */}
            <div className="space-y-4 border-b border-border pb-6">
              <h1 className="text-3xl sm:text-5xl font-black text-foreground tracking-tight leading-tight">
                {recipe.title}
              </h1>

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

          {/* Right Column: Recipe Image & Share Card (5 cols on lg) */}
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
          </div>
        </div>
      </div>
    </div>
  );
}
