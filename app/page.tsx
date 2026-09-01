"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const [mainServices, setMainServices] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [subCards, setSubCards] = useState<any[]>([]);

  useEffect(() => {
    // Load Main Services
    const savedServices = localStorage.getItem("admin_main_services");
    if (savedServices) {
      const parsed = JSON.parse(savedServices);
      setMainServices(parsed);
      if (parsed.length > 0) {
        setActiveCategory(parsed[0].title);
      }
    } else {
      const initial = [
        { id: "1", title: "PERSONAL", badge: "" },
        { id: "2", title: "OFFICIAL", badge: "" },
        { id: "3", title: "SSHOOTING", badge: "" },
      ];
      setMainServices(initial);
      setActiveCategory("PERSONAL");
      localStorage.setItem("admin_main_services", JSON.stringify(initial));
    }

    // Load Sub-Cards
    const savedSubCards = localStorage.getItem("admin_sub_cards");
    if (savedSubCards) {
      setSubCards(JSON.parse(savedSubCards));
    }
  }, []);

  // Filter sub-cards based on selected main service category
  const filteredSubCards = subCards.filter(
    (card) => card.category?.toLowerCase() === activeCategory?.toLowerCase()
  );

  const handleExplore = () => {
    if (activeCategory) {
      router.push(`/explore/${activeCategory.toLowerCase()}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfdff] text-slate-800 font-sans p-6 md:p-10 relative">
      
      {/* Top Header: Admin Button Removed Here */}
      <div className="max-w-7xl mx-auto flex justify-between items-center mb-10">
        <h1 className="text-xl md:text-2xl font-black tracking-tight text-slate-900 uppercase">
          AGDUM STUDIO
        </h1>
      </div>

      {/* Main Container Card */}
      <div className="max-w-4xl mx-auto bg-white border border-slate-100 rounded-3xl p-6 md:p-10 shadow-xl shadow-slate-100/85 space-y-8">
        
        <div className="text-center space-y-4">
          <h2 className="text-xl md:text-2xl font-black tracking-tight text-slate-900 uppercase">
            SERVICE PLANS
          </h2>

          {/* Dynamic Main Services Tabs/Buttons */}
          <div className="flex flex-wrap justify-center gap-2">
            {mainServices.map((service) => {
              const isActive = activeCategory.toLowerCase() === service.title.toLowerCase();
              return (
                <button
                  key={service.id}
                  onClick={() => setActiveCategory(service.title)}
                  className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer shadow-sm ${
                    isActive
                      ? "bg-purple-600 text-white shadow-purple-200 shadow-md"
                      : "bg-white hover:bg-slate-50 text-slate-700 border border-slate-200"
                  }`}
                >
                  {service.title}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sub-Cards List Area */}
        <div className="space-y-4 bg-slate-50/50 border border-slate-100 rounded-2xl p-6 min-h-[220px]">
          {filteredSubCards.length === 0 ? (
            <div className="text-center py-12 space-y-1">
              <p className="text-xs font-bold text-slate-500">No sub-cards available for "{activeCategory}".</p>
              <p className="text-[11px] text-slate-400">Add cards from the admin control panel.</p>
            </div>
          ) : (
            filteredSubCards.map((card) => (
              <div
                key={card.id}
                className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm text-xs font-bold text-slate-800 transition-all hover:border-purple-300"
              >
                {card.title}
              </div>
            ))
          )}
        </div>

        {/* Explore Button */}
        <div className="flex justify-center pt-2">
          <button
            onClick={handleExplore}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-8 py-3.5 rounded-2xl transition-all shadow-md shadow-purple-200 cursor-pointer"
          >
            Explore the Feature →
          </button>
        </div>

      </div>

    </div>
  );
}