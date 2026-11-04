import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Button from "../components/Button.jsx";
import Card from "../components/Card.jsx";
import RecipeCard from "../components/RecipeCard.jsx";
import Modal from "../components/Modal.jsx";
import Form from "../components/Form.jsx";
import Alert from "../components/Alert.jsx";
import { FaBookOpen, FaBell } from "react-icons/fa6";

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // State for testing interactive reusable components
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState(
    "Selamat datang di Ngenyangin Web App!",
  );
  const [testInput, setTestInput] = useState("");

  const sampleRecipe = {
    title: "Nasi Goreng Spesial Nusantara",
    slug: "nasi-goreng-spesial-nusantara",
    imageUrl: "/banner.png",
    cookingTime: 25,
    author: { name: "Chef Admin" },
    status: "APPROVED",
  };

  return (
    <div className="flex flex-1 flex-col bg-orange-50/50">
      <main className="max-w-5xl mx-auto px-6 py-12 space-y-10">
        {/* Hero Section */}
        <div className="text-center">
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-[#31281F] mb-4">
            Temukan & Bagikan Resep Makanan Favoritmu
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Platform berbagi resep kuliner nusantara dan internasional dengan
            kurasi reviewer terpercaya.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate("/recipes")}
            >
              <span className="inline-flex items-center gap-2">
                <FaBookOpen /> Jelajahi Resep
              </span>
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={() => setIsModalOpen(true)}
            >
              <span className="inline-flex items-center gap-2">
                <FaBell /> Test Modal & Alert
              </span>
            </Button>
          </div>
        </div>

        {/* Alert Test */}
        {alertMessage && (
          <Alert
            type="success"
            message={alertMessage}
            onClose={() => setAlertMessage("")}
          />
        )}

        {/* Grid Section for Reusable Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* General Card Component Test */}
          <Card
            title="Tentang Ngenyangin"
            subtitle="Platform Resep Modern"
            headerAction={<FaBookOpen className="text-orange-500" size={20} />}
            footer={
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setAlertMessage("Tombol dalam Card diklik!")}
              >
                Klik Aksi
              </Button>
            }
          >
            <p className="text-sm text-gray-600 mb-4">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Esse hic
              eos aut nemo at possimus consequatur fuga dolorum officia.
              Quibusdam optio debitis corporis molestiae.
            </p>
            <Form
              label="Test Form di dalam Card"
              id="test-input"
              value={testInput}
              onChange={(e) => setTestInput(e.target.value)}
              placeholder="Ketik sesuatu..."
            />
          </Card>

          {/* RecipeCard Component Test */}
          <div>
            <h3 className="font-serif text-xl font-bold text-[#31281F] mb-4">
              Contoh RecipeCard
            </h3>
            <RecipeCard recipe={sampleRecipe} />
          </div>
        </div>

        {/* Modal Component Test */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Modal Test Interaktif"
          footer={
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsModalOpen(false)}
              >
                Tutup
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  setAlertMessage("Aksi modal berhasil dijalankan!");
                  setIsModalOpen(false);
                }}
              >
                Simpan Perubahan
              </Button>
            </>
          }
        >
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Ini adalah contoh penggunaan komponen <strong>Modal.jsx</strong>{" "}
              yang reusable. Anda dapat menampilkan form, konfirmasi, atau
              detail data di sini.
            </p>
            <Form
              label="Nama Masukkan"
              id="modal-input"
              placeholder="Masukkan data..."
            />
          </div>
        </Modal>
      </main>
    </div>
  );
}
