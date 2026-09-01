"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface ServiceCategory {
  id: string;
  title: string;
  badgeText?: string;
  description?: string;
}

interface ServiceCardData {
  id: string;
  serviceId: string;
  title: string;
  features: string[];
}

export default function ServicesPage() {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [cards, setCards] = useState<ServiceCardData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // ১. অ্যাডমিন থেকে পোস্ট হওয়া Main Categories ফেচ করা
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
        console.error("Failed to load categories:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  // ২. সিলেক্ট করা Category অনুযায়ী Cards/Plans ফেচ করা
  useEffect(() => {
    if (!selectedCategoryId) return;

    async function fetchCategoryCards() {
      try {
        // Tab 2 (Sub-cards) ফেচ API
        const res = await fetch(`/api/service-cards?serviceId=${selectedCategoryId}`, { cache: "no-store" });
        const result = await res.json();
        const data = Array.isArray(result) ? result : result.data || [];
        setCards(data);
      } catch (err) {
        console.error("Failed to load cards:", err);
      }
    }
    fetchCategoryCards();
  }, [selectedCategoryId]);

  const activeCategoryObj = categories.find(
    (c) => c.id === selectedCategoryId || c.title === selectedCategoryId
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 p-4 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Top Navbar */}
        <div className="flex justify-between items-center bg-white px-6 py-4 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-md shadow-purple-200">
              A
            </div>
            <span className="font-extrabold text-xl text-slate-950">Agdum Studio</span>
          </div>
          <Link href="/" className="text-xs font-bold text-slate-600 hover:text-purple-600 transition flex items-center gap-1">
            ← Back to Home
          </Link>
        </div>

        {/* Dynamic Title and Badge */}
        <div className="text-center space-y-3 pt-4">
          <span className="bg-purple-100 text-purple-700 text-[11px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest inline-block">
            {activeCategoryObj?.badgeText || "PREMIUM SERVICES"}
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-slate-950 tracking-tight">
            Service Plans
          </h1>
          <p className="text-slate-500 font-medium text-sm max-w-lg mx-auto">
            {activeCategoryObj?.description || "Select your category and explore custom studio offerings"}
          </p>
        </div>

        {/* Dynamic Category Tabs */}
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

        {/* Dynamic Cards Display (Matching original UI structure) */}
        {cards.length === 0 && !loading ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200">
            <p className="text-slate-400 font-bold text-sm">
              No service options added for "{activeCategoryObj?.title}" yet.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6 pt-4">
            {cards.map((card) => (
              <div 
                key={card.id} 
                className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-5 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                    <span className="text-[10px] font-black uppercase tracking-wider text-purple-600">
                      {activeCategoryObj?.title}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                      ⚡
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-extrabold text-slate-950">{card.title}</h3>

                  {/* Checklist Items */}
                  <div className="space-y-2.5 pt-2">
                    {card.features?.map((feat, idx) => (
                      <div 
                        key={idx} 
                        className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100/80"
                      >
                        <div className="w-5 h-5 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold shrink-0">
                          ✓
                        </div>
                        <span className="text-xs font-bold text-slate-700">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  href={`/booking?service=${encodeURIComponent(activeCategoryObj?.title || "")}&plan=${encodeURIComponent(card.title)}`}
                  className="w-full bg-slate-950 hover:bg-purple-600 text-white font-extrabold text-center py-3 rounded-xl transition-colors shadow-sm block text-xs tracking-wide uppercase mt-4"
                >
                  Book This Plan
                </Link>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}