import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { getRecipes } from "../services/api.js";
import Button from "../components/Button.jsx";
import Card from "../components/Card.jsx";
import RecipeCard from "../components/RecipeCard.jsx";
import Alert from "../components/Alert.jsx";
import { FaBookOpen, FaPlus, FaUtensils } from "react-icons/fa6";
import bannerImg from "../assets/banner.jpeg";

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchApprovedRecipes();
  }, []);

  const fetchApprovedRecipes = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getRecipes();
      setRecipes(data);
    } catch (err) {
      setError(err.message || "Failed to load public recipes");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col bg-background min-h-screen">
      {/* Hero Section with Banner & Dark Overlay */}
      <div
        className="relative w-full py-24 sm:py-32 bg-cover bg-center flex items-center justify-center text-center px-4"
        style={{ backgroundImage: `url(${bannerImg})` }}
      >
        <div className="absolute inset-0 bg-black/55 backdrop-blur-[1px]" />
        
        <div className="relative z-10 max-w-3xl mx-auto space-y-6 text-white">
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight drop-shadow-md">
            Discover & Share Delicious Recipes
          </h1>
          <p className="text-base sm:text-lg text-gray-200 font-medium max-w-xl mx-auto drop-shadow-sm">
            Explore authentic culinary creations from our community, carefully curated and approved by expert reviewers.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Button
              variant="primary"
              size="lg"
              onClick={() => {
                const gallery = document.getElementById("recipe-gallery");
                gallery?.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-flex items-center gap-2"
            >
              <FaBookOpen /> Explore Recipes
            </Button>
            {user ? (
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate("/workspace/my-recipes")}
                className="inline-flex items-center gap-2 bg-white/10 text-white border-white/30 hover:bg-white/20"
              >
                <FaPlus /> Publish Recipe
              </Button>
            ) : (
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate("/auth/login")}
                className="inline-flex items-center gap-2 bg-white/10 text-white border-white/30 hover:bg-white/20"
              >
                Sign In to Publish
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content / Recipe Gallery */}
      <main id="recipe-gallery" className="max-w-7xl mx-auto px-6 py-16 space-y-8 w-full">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border pb-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-3">
              <FaUtensils className="text-primary" /> Approved Recipe Catalog
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Browse all published and verified recipes from our talented culinary creators.
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 bg-primary/10 text-primary rounded-full self-start md:self-auto">
            {recipes.length} Recipes Available
          </span>
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError("")} />}

        {loading ? (
          <p className="text-muted-foreground py-20 text-center text-base">
            Loading public recipes...
          </p>
        ) : recipes.length === 0 ? (
          <div className="bg-card rounded-[10px] border border-border p-16 text-center space-y-3 shadow-xs">
            <p className="text-lg font-bold text-foreground">No approved recipes found yet.</p>
            <p className="text-sm text-muted-foreground">Be the first creator to publish and share your favorite recipe!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
