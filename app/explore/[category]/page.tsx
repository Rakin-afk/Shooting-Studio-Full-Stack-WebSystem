"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function ExploreCategoryPage() {
  const params = useParams();
  const categoryName = decodeURIComponent((params?.category as string) || "");
  
  const [packages, setPackages] = useState<any[]>([]);

  useEffect(() => {
    const savedPkgs = localStorage.getItem("admin_packages");
    if (savedPkgs) {
      const allPkgs = JSON.parse(savedPkgs);
      const filtered = allPkgs.filter((p: any) => p.category === categoryName);
      setPackages(filtered);
    }
  }, [categoryName]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-6 md:p-10 font-sans space-y-10">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight text-slate-900">
          Explore Plans: <span className="text-purple-600">{categoryName}</span>
        </h1>
        <Link
          href="/"
          className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-5 py-3 rounded-xl transition-all shadow"
        >
          ← Back to Home
        </Link>
      </div>

      <div className="max-w-5xl mx-auto space-y-6">
        {packages.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-3 shadow-sm">
            <p className="text-sm font-bold text-slate-700">No packages found for this category.</p>
            <p className="text-xs text-slate-400">Add packages from the Admin Control Panel under section 3.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {packages.map((pkg) => (
              <div 
                key={pkg.id} 
                className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm flex flex-col justify-between space-y-6"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="text-base font-black text-slate-900">{pkg.name}</h3>
                    <span className="bg-purple-100 text-purple-700 text-xs font-extrabold px-3 py-1 rounded-full">
                      ৳{pkg.price}
                    </span>
                  </div>

                  {pkg.features && pkg.features.length > 0 && (
                    <ul className="space-y-2 pt-2 border-t border-slate-100">
                      {pkg.features.map((feat: string, idx: number) => (
                        <li key={idx} className="text-xs text-slate-600 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-purple-600 rounded-full"></span>
                          {feat}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <Link
                  href={`/booking?package=${encodeURIComponent(pkg.name)}&price=${encodeURIComponent(pkg.price)}`}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold py-3 rounded-xl transition-all text-center shadow-sm block"
                >
                  Book This Package →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}