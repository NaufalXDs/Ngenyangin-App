import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext.jsx";
import { getRecipes } from "@/services/api.js";
import { Button, RecipeCard, Alert } from "@/components";
import {
  FaBookOpen,
  FaPlus,
  FaUtensils,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa6";
import bannerImg from "../assets/banner.jpeg";

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 9;

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

  const totalPages = Math.ceil(recipes.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedRecipes = recipes.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  return (
    <div className="flex flex-1 flex-col bg-background min-h-screen">
      <div
        className="relative w-full min-h-207 bg-cover bg-center flex items-center justify-center text-center px-4"
        style={{ backgroundImage: `url(${bannerImg})` }}
      >
        <div className="absolute inset-0 bg-black/55 backdrop-blur-[1px]" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-6 text-white">
          <h1 className="text-4xl sm:text-6xl text-primary font-black tracking-tight drop-shadow-md">
            Masak Enak, hidup kenyang.
          </h1>
          <p className="text-base sm:text-lg text-gray-200 font-medium max-w-xl mx-auto drop-shadow-sm">
            Temukan resep rumahan yang mudah, teruji, dan dibagikan langsung
            oleh mereka yang suka memasak.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Button
              variant="primary"
              size="lg"
              onClick={() => {
                const gallery = document.getElementById("recipe-gallery");
                gallery?.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-flex items-center gap-2 border-0"
            >
              <FaBookOpen /> Explore Recipes
            </Button>
            {user ? (
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate("/workspace/my-recipes")}
                className="inline-flex items-center gap-2 bg-white/10 text-white hover:bg-white/20 border-0"
              >
                <FaPlus /> Publish Recipe
              </Button>
            ) : (
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate("/auth/login")}
                className="inline-flex items-center gap-2 bg-white/10 text-white hover:bg-white/20"
              >
                Sign In to Publish
              </Button>
            )}
          </div>
        </div>
      </div>

      <main
        id="recipe-gallery"
        className="max-w-7xl mx-auto px-6 py-16 space-y-8 w-full"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border pb-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-3">
              <FaUtensils className="text-primary" /> Recipes Catalog
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Browse all published and verified recipes from our talented
              culinary creators.
            </p>
          </div>
        </div>

        {error && (
          <Alert type="error" message={error} onClose={() => setError("")} />
        )}

        {loading ? (
          <p className="text-muted-foreground py-20 text-center text-base">
            Loading public recipes...
          </p>
        ) : recipes.length === 0 ? (
          <div className="bg-card rounded-[10px] border border-border p-16 text-center space-y-3 shadow-xs">
            <p className="text-lg font-bold text-foreground">
              No approved recipes found yet.
            </p>
            <p className="text-sm text-muted-foreground">
              Be the first creator to publish and share your favorite recipe!
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedRecipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>

            {recipes.length > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border border-border bg-card rounded-[10px] shadow-xs">
                <span className="text-xs sm:text-sm text-muted-foreground">
                  Showing{" "}
                  <strong className="text-foreground">{startIndex + 1}</strong>{" "}
                  to{" "}
                  <strong className="text-foreground">
                    {Math.min(startIndex + ITEMS_PER_PAGE, recipes.length)}
                  </strong>{" "}
                  of{" "}
                  <strong className="text-foreground">{recipes.length}</strong>{" "}
                  recipes
                </span>

                <div className="flex items-center gap-1.5">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => {
                      setCurrentPage((p) => Math.max(p - 1, 1));
                      document
                        .getElementById("recipe-gallery")
                        ?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="gap-1 px-2.5"
                  >
                    <FaChevronLeft size={12} />
                    <span>Prev</span>
                  </Button>

                  <div className="flex items-center gap-1 px-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          type="button"
                          onClick={() => {
                            setCurrentPage(page);
                            document
                              .getElementById("recipe-gallery")
                              ?.scrollIntoView({ behavior: "smooth" });
                          }}
                          className={`w-8 h-8 rounded-[8px] text-xs font-semibold transition cursor-pointer ${
                            currentPage === page
                              ? "bg-primary text-primary-foreground shadow-xs"
                              : "text-muted-foreground hover:bg-muted"
                          }`}
                        >
                          {page}
                        </button>
                      ),
                    )}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() => {
                      setCurrentPage((p) => Math.min(p + 1, totalPages));
                      document
                        .getElementById("recipe-gallery")
                        ?.scrollIntoView({ behavior: "smooth" });
                    }}
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
      </main>
    </div>
  );
}
