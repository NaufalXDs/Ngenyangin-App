import React from "react";
import Button from "@/components/ui/Button.jsx";
import { FaXmark, FaClock, FaUtensils, FaListCheck, FaBookOpen } from "react-icons/fa6";

export default function RecipeDetailDrawer({ isOpen, onClose, recipe }) {
  if (!isOpen || !recipe) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 left-0 max-w-full flex pr-10">
        <div className="w-screen max-w-lg bg-card border-r border-border shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/40">
            <div className="flex items-center gap-2">
              <FaBookOpen className="text-primary" size={20} />
              <h2 className="text-xl font-bold text-foreground">Recipe Details</h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition cursor-pointer"
            >
              <FaXmark size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-primary/10 text-primary">
                  {recipe.category || "Main Course"}
                </span>
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
              </div>
              <h1 className="text-2xl font-bold text-foreground">{recipe.title}</h1>
              <p className="text-sm text-muted-foreground">ID: {recipe.id}</p>
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                <FaClock size={12} />
                Created on{" "}
                {new Date(recipe.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>

            {recipe.description && (
              <div className="space-y-1">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Description</h3>
                <p className="text-sm text-foreground/85 bg-muted/30 p-3.5 rounded-xl border border-border">
                  {recipe.description}
                </p>
              </div>
            )}

            <div className="space-y-1.5">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <FaUtensils className="text-primary" size={12} /> Ingredients
              </h3>
              <div className="bg-muted/40 p-4 rounded-xl text-foreground/90 whitespace-pre-line border border-border font-mono text-xs">
                {recipe.ingredients}
              </div>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <FaListCheck className="text-primary" size={12} /> Cooking Instructions
              </h3>
              <div className="bg-muted/40 p-4 rounded-xl text-foreground/90 whitespace-pre-line border border-border text-xs leading-relaxed">
                {recipe.instructions}
              </div>
            </div>

            {recipe.status === "REJECTED" && recipe.rejectionReason && (
              <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl text-xs text-rose-800 space-y-1">
                <strong className="block font-bold text-sm">Rejection Reason:</strong>
                <p>{recipe.rejectionReason}</p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end px-6 py-4 border-t border-border bg-muted/40">
            <Button variant="outline" size="md" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
