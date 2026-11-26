import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaMagnifyingGlass,
  FaXmark,
  FaUtensils,
  FaClock,
} from "react-icons/fa6";
import { getRecipes } from "@/services/api.js";
import noPictureImg from "@/assets/nopicture.png";

export default function NavbarSearch() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  // Lazy prefetch approved recipes once on search focus
  const handlePrefetch = async () => {
    if (hasFetched || loading) return;
    try {
      setLoading(true);
      const data = await getRecipes();
      if (Array.isArray(data)) {
        setRecipes(data.filter((r) => !r.status || r.status === "APPROVED"));
      }
      setHasFetched(true);
    } catch (err) {
      console.error("Failed to prefetch recipes for live search:", err);
    } finally {
      setLoading(false);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard navigation & dismissal
  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const handleSelectRecipe = (slug) => {
    setIsOpen(false);
    setQuery("");
    navigate(`/recipes/${slug}`);
  };

  const handleClear = () => {
    setQuery("");
    inputRef.current?.focus();
  };

  // Filter recipes in-memory
  const trimmedQuery = query.trim().toLowerCase();
  const filteredRecipes = trimmedQuery
    ? recipes
        .filter((r) => {
          const title = (r.title || "").toLowerCase();
          const category = (r.category || "").toLowerCase();
          const description = (r.description || "").toLowerCase();
          return (
            title.includes(trimmedQuery) ||
            category.includes(trimmedQuery) ||
            description.includes(trimmedQuery)
          );
        })
        .slice(0, 5)
    : [];

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Search Bar Input */}
      <div className="relative flex items-center w-full">
        <FaMagnifyingGlass
          size={16}
          className="absolute left-3.5 text-muted-foreground pointer-events-none"
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => {
            handlePrefetch();
            setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search recipes, ingredients..."
          className="w-full rounded-[10px] border border-border bg-card pl-9 pr-8 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-xs transition-all"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 p-0.5 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted cursor-pointer transition"
            aria-label="Clear search"
          >
            <FaXmark size={14} />
          </button>
        )}
      </div>

      {/* Floating Dropdown */}
      {isOpen && trimmedQuery && (
        <div className="absolute left-0 right-0 top-full mt-2 w-full min-w-[280px] bg-card border border-border rounded-[12px] shadow-xl z-50 overflow-hidden divide-y divide-border/60 animate-in fade-in slide-in-from-top-1 duration-150">
          {loading && !hasFetched ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Searching recipes...
            </div>
          ) : filteredRecipes.length === 0 ? (
            <div className="p-5 text-center text-sm text-muted-foreground">
              <FaUtensils className="mx-auto mb-2 text-muted-foreground/60" size={20} />
              No recipes found matching <strong className="text-foreground">"{query}"</strong>
            </div>
          ) : (
            <div>
              <div className="px-3 py-1.5 bg-muted/40 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                Matching Recipes ({filteredRecipes.length})
              </div>
              {filteredRecipes.map((recipe) => (
                <div
                  key={recipe.id}
                  onClick={() => handleSelectRecipe(recipe.slug)}
                  className="flex items-center gap-3 px-3 py-2.5 hover:bg-muted/60 transition-colors cursor-pointer group"
                >
                  <img
                    src={recipe.imageUrl || noPictureImg}
                    alt={recipe.title}
                    className="w-11 h-11 rounded-[8px] object-cover bg-muted shrink-0 border border-border/50 group-hover:scale-105 transition-transform"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground truncate group-hover:text-primary transition-colors">
                      {recipe.title}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                      <span className="truncate">{recipe.category || "General"}</span>
                      {recipe.cookingTime && (
                        <span className="flex items-center gap-1 shrink-0">
                          • <FaClock size={10} /> {recipe.cookingTime}m
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
