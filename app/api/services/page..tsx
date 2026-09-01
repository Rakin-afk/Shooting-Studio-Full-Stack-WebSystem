"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface ServiceCategory {
  id: string;
  title: string;
  badgeText?: string;
  description?: string;
}

interface SubCardItem {
  id: string;
  serviceId: string;
  title: string;
  features?: string[];
}

export default function DynamicServicesPage() {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [rawSubCards, setRawSubCards] = useState<SubCardItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // ১. Main Services ফেচ করা
  useEffect(() => {
    async function fetchCategories() {
      try {
        setLoading(true);
        const res = await fetch("/api/services", { cache: "no-store" });
        const result = await res.json();
        const data = Array.isArray(result) ? result : result.data || [];
        
        if (data.length > 0) {
          setCategories(data);
          setSelectedCategoryId(data[0].id || data[0].title);
        }
      } catch (err) {
        console.error("Error loading categories:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  // ২. সিলেক্ট করা সার্ভিস অনুযায়ী Sub-Cards ফেচ করা
  useEffect(() => {
    if (!selectedCategoryId) return;

    async function fetchSubCards() {
      try {
        const res = await fetch(`/api/service-cards?serviceId=${selectedCategoryId}`, { cache: "no-store" });
        const result = await res.json();
        const data = Array.isArray(result) ? result : result.data || [];
        setRawSubCards(data);
      } catch (err) {
        console.error("Error loading cards:", err);
      }
    }
    fetchSubCards();
  }, [selectedCategoryId]);

  const activeCategory = categories.find(
    (c) => c.id === selectedCategoryId || c.title === selectedCategoryId
  );

  // ব্যাকএন্ডের সব ইনপুট ডাটাকে ২টি কার্ডে সমানভাবে ভাগ করা
  const totalItems = rawSubCards.map((item) => item.title).filter(Boolean);
  const midPoint = Math.ceil(totalItems.length / 2);
  
  const card1Features = totalItems.slice(0, midPoint);
  const card2Features = totalItems.slice(midPoint);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 p-4 md:p-10 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Top Header */}
        <div className="flex justify-between items-center bg-white px-6 py-4 rounded-2xl shadow-xs border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-sm shadow-purple-200">
              A
            </div>
            <span className="font-extrabold text-xl text-slate-950">Agdum Studio</span>
          </div>
          <Link href="/admin" className="text-xs font-bold text-purple-600 bg-purple-50 px-4 py-2 rounded-xl hover:bg-purple-100 transition">
            Admin Dashboard →
          </Link>
        </div>

        {/* Dynamic Badge & Title */}
        <div className="text-center space-y-3 pt-2">
          <span className="bg-purple-100 text-purple-700 text-[11px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest inline-block">
            {activeCategory?.badgeText || "PREMIUM SERVICES"}
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-slate-950 tracking-tight">
            Service Plans
          </h1>
          <p className="text-slate-500 font-medium text-sm max-w-lg mx-auto">
            {activeCategory?.description || "Select your category and explore custom studio offerings"}
          </p>
        </div>

        {/* Category Selector Tabs */}
        {loading ? (
          <div className="text-center py-4 font-bold text-slate-400">Loading categories...</div>
        ) : (
          <div className="flex justify-center">
            <div className="bg-white p-1.5 rounded-2xl border border-slate-200/60 shadow-xs flex gap-2 overflow-x-auto max-w-full">
              {categories.map((cat) => {
                const catKey = cat.id || cat.title;
                const isActive = selectedCategoryId === catKey;
                return (
                  <button
                    key={catKey}
                    onClick={() => setSelectedCategoryId(catKey)}
                    className={`px-6 py-2.5 rounded-xl font-extrabold text-sm transition-all duration-200 whitespace-nowrap ${
                      isActive
                        ? "bg-purple-600 text-white shadow-md shadow-purple-200"
                        : "text-slate-600 hover:text-slate-950 hover:bg-slate-50"
                    }`}
                  >
                    {cat.title}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Vertical Cards Layout */}
        {totalItems.length === 0 && !loading ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200">
            <p className="text-slate-400 font-bold text-sm">
              No features added for "{activeCategory?.title}" yet.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8 pt-4">
            
            {/* CARD 1 */}
            <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6 flex flex-col justify-between">
              <div className="space-y-6">
                <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-purple-600">
                      {activeCategory?.title}
                    </span>
                    <h3 className="text-2xl font-black text-slate-950 mt-1">
                      {activeCategory?.title} Studio Option A
                    </h3>
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                    ⚡
                  </div>
                </div>

                {/* Checklist items */}
                <div className="space-y-3">
                  {card1Features.map((featText, idx) => (
                    <div key={idx} className="flex items-center gap-3.5 bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100">
                      <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold shrink-0">
                        ✓
                      </div>
                      <span className="text-xs font-bold text-slate-800">
                        {featText}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <button className="w-full bg-slate-950 hover:bg-purple-600 text-white font-extrabold py-4 rounded-2xl transition-colors shadow-md text-xs uppercase tracking-wider mt-6">
                Book Option A
              </button>
            </div>

            {/* CARD 2 */}
            <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6 flex flex-col justify-between">
              <div className="space-y-6">
                <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-purple-600">
                      {activeCategory?.title}
                    </span>
                    <h3 className="text-2xl font-black text-slate-950 mt-1">
                      {activeCategory?.title} Studio Option B
                    </h3>
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                    ✨
                  </div>
                </div>

                {/* Checklist items */}
                <div className="space-y-3">
                  {(card2Features.length > 0 ? card2Features : card1Features).map((featText, idx) => (
                    <div key={idx} className="flex items-center gap-3.5 bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100">
                      <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold shrink-0">
                        ✓
                      </div>
                      <span className="text-xs font-bold text-slate-800">
                        {featText}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <button className="w-full bg-slate-950 hover:bg-purple-600 text-white font-extrabold py-4 rounded-2xl transition-colors shadow-md text-xs uppercase tracking-wider mt-6">
                Book Option B
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}