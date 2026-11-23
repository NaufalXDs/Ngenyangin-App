import React, { useState, useEffect } from "react";
import Button from "../../components/Button.jsx";
import Card from "../../components/Card.jsx";
import { getPendingRecipes, moderateRecipe } from "../../services/api.js";
import Alert from "../../components/Alert.jsx";
import Modal from "../../components/Modal.jsx";
import Form from "../../components/Form.jsx";
import { FaClipboardList, FaCheck, FaXmark } from "react-icons/fa6";

export default function RecipeReview() {
  const [pendingRecipes, setPendingRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [selectedRecipeId, setSelectedRecipeId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    fetchPendingRecipes();
  }, []);

  const fetchPendingRecipes = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getPendingRecipes();
      setPendingRecipes(data);
    } catch (err) {
      setError(err.message || "Failed to load review queue");
    } finally {
      setLoading(false);
    }
  };

  const handleModerate = async (id, status, reason = "") => {
    try {
      setError("");
      await moderateRecipe(id, { status, rejectionReason: reason });
      setSuccess(`Recipe successfully ${status === "APPROVED" ? "approved" : "rejected"}`);
      setIsRejectModalOpen(false);
      setRejectionReason("");
      fetchPendingRecipes();
    } catch (err) {
      setError(err.message || "Failed to moderate recipe");
    }
  };

  return (
    <div className="space-y-6">
      {error && <Alert type="error" message={error} onClose={() => setError("")} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess("")} />}

      <div className="flex items-center gap-2">
        <FaClipboardList className="text-primary" size={22} />
        <h2 className="text-2xl font-bold text-foreground">Recipe Review Queue</h2>
      </div>

      {loading ? (
        <p className="text-muted-foreground py-12 text-center">Loading review queue...</p>
      ) : pendingRecipes.length === 0 ? (
        <Card>
          <p className="text-center text-muted-foreground py-8">No recipes waiting for review at the moment.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pendingRecipes.map((recipe) => (
            <Card key={recipe.id} title={recipe.title} subtitle={`By: ${recipe.author?.name} (${recipe.author?.email})`}>
              <div className="space-y-3">
                <p className="text-xs font-semibold text-muted-foreground">Category: {recipe.category}</p>
                <div className="bg-muted/40 p-3 rounded-[8px] text-xs text-foreground/80 space-y-1 border border-border">
                  <p><strong>Ingredients:</strong> {recipe.ingredients.substring(0, 100)}...</p>
                  <p><strong>Instructions:</strong> {recipe.instructions.substring(0, 100)}...</p>
                </div>
                <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                  <Button
                    variant="destructive"
                    size="md"
                    onClick={() => {
                      setSelectedRecipeId(recipe.id);
                      setIsRejectModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 text-sm"
                  >
                    <FaXmark size={14} /> Reject
                  </Button>
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => handleModerate(recipe.id, "APPROVED")}
                    className="inline-flex items-center gap-1.5 text-sm"
                  >
                    <FaCheck size={14} /> Approve
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        title="Rejection Reason"
        footer={
          <>
            <Button variant="outline" size="md" onClick={() => setIsRejectModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="md"
              onClick={() => handleModerate(selectedRecipeId, "REJECTED", rejectionReason)}
            >
              Submit Rejection
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-xs text-muted-foreground">
            Provide a rejection reason so the recipe author can improve and resubmit.
          </p>
          <Form
            label="Reason"
            id="rejection-reason"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Example: Instructions are incomplete..."
            required
          />
        </div>
      </Modal>
    </div>
  );
}
