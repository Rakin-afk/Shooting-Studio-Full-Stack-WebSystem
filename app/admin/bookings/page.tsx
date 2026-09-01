"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);

  const loadBookings = () => {
    const saved = localStorage.getItem("admin_bookings");
    if (saved) {
      setBookings(JSON.parse(saved));
    } else {
      setBookings([]);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleDelete = (id: string) => {
    const updated = bookings.filter((b) => b.id !== id);
    localStorage.setItem("admin_bookings", JSON.stringify(updated));
    setBookings(updated);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 md:p-10 font-sans space-y-8">
      {/* Top Header */}
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight text-white">
          RECEIVED BOOKINGS ({bookings.length})
        </h1>
        <div className="flex items-center gap-3">
          <button
            onClick={loadBookings}
            className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer"
          >
            Refresh List
          </button>
          <Link
            href="/admin"
            className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all border border-slate-700"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>

      {/* Bookings Container */}
      <div className="max-w-7xl mx-auto bg-slate-950 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl">
        {bookings.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <p className="text-sm font-bold text-slate-400">No bookings received yet.</p>
            <p className="text-xs text-slate-600">When users book a service from your website, they will appear here instantly.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bookings.map((b) => (
              <div 
                key={b.id} 
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm relative"
              >
                <div className="flex justify-between items-start border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="font-black text-base text-purple-400">{b.fullName}</h3>
                    <p className="text-xs text-slate-400">{b.businessEmail} • {b.phoneNumber}</p>
                  </div>
                  <span className="bg-purple-950 text-purple-300 border border-purple-800 text-[10px] font-extrabold px-3 py-1 rounded-full">
                    {b.packageName} {b.packagePrice && `(৳${b.packagePrice})`}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
                  <p><strong className="text-slate-500">Company:</strong> {b.companyName}</p>
                  <p><strong className="text-slate-500">Type:</strong> {b.businessType}</p>
                  <p><strong className="text-slate-500">Team Size:</strong> {b.teamSize}</p>
                  <p><strong className="text-slate-500">Start Date:</strong> {b.startDate}</p>
                  <p><strong className="text-slate-500">Budget:</strong> {b.budget}</p>
                </div>

                {b.message && (
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/60 text-xs text-slate-400">
                    <strong className="text-slate-500 block mb-1">Requirements:</strong>
                    {b.message}
                  </div>
                )}

                <div className="flex justify-between items-center pt-2 border-t border-slate-800 text-[11px] text-slate-500">
                  <span>Submitted: {b.dateSubmitted}</span>
                  <button
                    onClick={() => handleDelete(b.id)}
                    className="text-red-400 hover:text-red-300 font-bold cursor-pointer transition-all"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}