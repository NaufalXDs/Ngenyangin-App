import React from "react";
import { Card } from "@/components";
import { FaBookBookmark, FaCircleCheck, FaClock, FaCircleXmark, FaChartLine } from "react-icons/fa6";

export default function WorkspaceSummary({ recipes = [] }) {
  const totalRecipes = recipes.length;
  const approvedCount = recipes.filter((r) => r.status === "APPROVED").length;
  const pendingCount = recipes.filter((r) => r.status === "PENDING").length;
  const rejectedCount = recipes.filter((r) => r.status === "REJECTED").length;

  const approvalRate = totalRecipes > 0 ? Math.round((approvedCount / totalRecipes) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <FaChartLine className="text-[#31281F]" size={22} />
        <h2 className="text-xl font-bold text-[#31281F]">Ringkasan & Performa Resep</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase">Total Resep</p>
              <h3 className="text-3xl font-extrabold text-[#31281F] mt-1">{totalRecipes}</h3>
            </div>
            <div className="p-3 bg-orange-100 text-orange-800 rounded-xl">
              <FaBookBookmark size={24} />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase">Disetujui</p>
              <h3 className="text-3xl font-extrabold text-green-700 mt-1">{approvedCount}</h3>
            </div>
            <div className="p-3 bg-green-100 text-green-800 rounded-xl">
              <FaCircleCheck size={24} />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase">Menunggu Review</p>
              <h3 className="text-3xl font-extrabold text-amber-600 mt-1">{pendingCount}</h3>
            </div>
            <div className="p-3 bg-amber-100 text-amber-800 rounded-xl">
              <FaClock size={24} />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase">Ditolak</p>
              <h3 className="text-3xl font-extrabold text-red-600 mt-1">{rejectedCount}</h3>
            </div>
            <div className="p-3 bg-red-100 text-red-800 rounded-xl">
              <FaCircleXmark size={24} />
            </div>
          </div>
        </Card>
      </div>

      {/* Performance Scorecard */}
      <Card title="Analisis Kinerja Kontribusi">
        <div className="space-y-4 py-2">
          <div className="flex justify-between items-center text-sm font-semibold">
            <span className="text-gray-700">Tingkat Keberhasilan Publikasi (Approval Rate)</span>
            <span className="text-[#31281F] font-bold">{approvalRate}%</span>
          </div>
          <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden border border-[#31281F]">
            <div
              className="bg-[#F3C743] h-full transition-all duration-500"
              style={{ width: `${approvalRate}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500">
            {approvalRate >= 75
              ? "Performa luar biasa! Sebagian besar resep Anda berhasil lolos moderasi dan dipublikasikan."
              : approvalRate >= 40
              ? "Performa cukup baik. Perhatikan alasan penolakan pada beberapa resep untuk meningkatkan kualitas."
              : "Tingkatkan detail dan kejelasan resep Anda untuk menghindari penolakan dari tim moderator."}
          </p>
        </div>
      </Card>
    </div>
  );
}
