"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [hasUnread, setHasUnread] = useState(false);

  // Form states
  const [serviceTitle, setServiceTitle] = useState("");
  const [badgeText, setBadgeText] = useState("");
  
  const [targetCategory, setTargetCategory] = useState("");
  const [subCardTitle, setSubCardTitle] = useState("");

  const [pkgCategory, setPkgCategory] = useState("");
  const [pkgName, setPkgName] = useState("");
  const [pkgPrice, setPkgPrice] = useState("");
  const [featureInput, setFeatureInput] = useState("");
  const [features, setFeatures] = useState<string[]>([]);

  // Main Lists State
  const [mainServices, setMainServices] = useState<any[]>([]);
  const [subCards, setSubCards] = useState<any[]>([]);
  const [packages, setPackages] = useState<any[]>([]);

  const loadData = () => {
    const savedBookings = localStorage.getItem("admin_bookings");
    let parsedBookings: any[] = [];
    if (savedBookings) {
      parsedBookings = JSON.parse(savedBookings);
      setBookings(parsedBookings);
    }

    const lastSeenCount = parseInt(localStorage.getItem("admin_last_seen_count") || "0", 10);
    if (parsedBookings.length > lastSeenCount) {
      setHasUnread(true);
    } else {
      setHasUnread(false);
    }

    const savedServices = localStorage.getItem("admin_main_services");
    if (savedServices) {
      setMainServices(JSON.parse(savedServices));
    } else {
      const initial = [
        { id: "1", title: "PERSONAL", badge: "" },
        { id: "2", title: "OFFICIAL", badge: "" },
        { id: "3", title: "SSHOOTING", badge: "" },
      ];
      setMainServices(initial);
      localStorage.setItem("admin_main_services", JSON.stringify(initial));
    }

    const savedSubCards = localStorage.getItem("admin_sub_cards");
    if (savedSubCards) {
      setSubCards(JSON.parse(savedSubCards));
    }

    const savedPkgs = localStorage.getItem("admin_packages");
    if (savedPkgs) {
      setPackages(JSON.parse(savedPkgs));
    }
  };

  useEffect(() => {
    loadData();

    const handleStorageChange = () => {
      loadData();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("bookingUpdated", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("bookingUpdated", handleStorageChange);
    };
  }, []);

  const handleOpenBookingsModal = () => {
    setIsModalOpen(true);
    setHasUnread(false);
    localStorage.setItem("admin_last_seen_count", bookings.length.toString());
  };

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceTitle.trim()) return;
    const newItem = { id: Date.now().toString(), title: serviceTitle.trim(), badge: badgeText.trim() };
    const updated = [...mainServices, newItem];
    setMainServices(updated);
    localStorage.setItem("admin_main_services", JSON.stringify(updated));
    setServiceTitle("");
    setBadgeText("");
  };

  const handleAddSubCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetCategory || !subCardTitle.trim()) return;
    const newItem = { id: Date.now().toString(), category: targetCategory, title: subCardTitle.trim() };
    const updated = [...subCards, newItem];
    setSubCards(updated);
    localStorage.setItem("admin_sub_cards", JSON.stringify(updated));
    setSubCardTitle("");
  };

  const handleAddFeature = () => {
    if (featureInput.trim()) {
      setFeatures([...features, featureInput.trim()]);
      setFeatureInput("");
    }
  };

  const handleSavePackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pkgCategory || !pkgName.trim() || !pkgPrice.trim()) return;
    const newItem = {
      id: Date.now().toString(),
      category: pkgCategory,
      name: pkgName.trim(),
      price: pkgPrice.trim(),
      subtitle: pkgName.trim(),
      features: [...features]
    };
    const updated = [...packages, newItem];
    setPackages(updated);
    localStorage.setItem("admin_packages", JSON.stringify(updated));
    setPkgCategory("");
    setPkgName("");
    setPkgPrice("");
    setFeatures([]);
  };

  const handleDeleteService = (id: string) => {
    const updated = mainServices.filter(s => s.id !== id);
    setMainServices(updated);
    localStorage.setItem("admin_main_services", JSON.stringify(updated));
  };

  const handleDeleteSubCard = (id: string) => {
    const updated = subCards.filter(s => s.id !== id);
    setSubCards(updated);
    localStorage.setItem("admin_sub_cards", JSON.stringify(updated));
  };

  const handleDeletePackage = (id: string) => {
    const updated = packages.filter(p => p.id !== id);
    setPackages(updated);
    localStorage.setItem("admin_packages", JSON.stringify(updated));
  };

  const handleDeleteBooking = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = bookings.filter((b) => b.id !== id);
    localStorage.setItem("admin_bookings", JSON.stringify(updated));
    localStorage.setItem("admin_last_seen_count", updated.length.toString());
    setBookings(updated);
    setHasUnread(false);
    window.dispatchEvent(new Event("bookingUpdated"));
    if (selectedBooking?.id === id) {
      setSelectedBooking(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfdff] text-slate-800 font-sans p-6 md:p-10 relative">
      
      {/* Top Header */}
      <div className="max-w-7xl mx-auto flex justify-between items-center mb-10 bg-white border border-slate-100 p-5 rounded-3xl shadow-sm">
        <h1 className="text-xl md:text-2xl font-black tracking-tight text-slate-900 uppercase">
          ADMIN & DASHBOARD CONTROL
        </h1>

        <div className="flex items-center gap-4">
          <button
            onClick={handleOpenBookingsModal}
            className="relative bg-white hover:bg-slate-50 border border-slate-200 p-3 rounded-2xl transition-all cursor-pointer flex items-center justify-center shadow-sm"
            title="Received Bookings"
          >
            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>

            {hasUnread && bookings.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-purple-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow animate-pulse">
                {bookings.length}
              </span>
            )}
          </button>

          <Link
            href="/"
            className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold px-5 py-3 rounded-xl transition-all shadow-sm"
          >
            ← Back to Website
          </Link>
        </div>
      </div>

      {/* Main Control Forms */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* 1. Add Main Service */}
        <form onSubmit={handleAddService} className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xl shadow-slate-100/80 space-y-4">
          <h2 className="text-xs font-black text-purple-600 uppercase tracking-wider">1. ADD MAIN SERVICE</h2>
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-700">Service Title</label>
            <input
              type="text"
              value={serviceTitle}
              onChange={(e) => setServiceTitle(e.target.value)}
              placeholder="e.g. PERSONAL"
              required
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-purple-600 shadow-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-700">Badge Text (Optional)</label>
            <input
              type="text"
              value={badgeText}
              onChange={(e) => setBadgeText(e.target.value)}
              placeholder="e.g. NEW OFFERINGS"
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-purple-600 shadow-sm"
            />
          </div>
          <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-md shadow-purple-200 cursor-pointer">
            ADD SERVICE
          </button>
        </form>

        {/* 2. Add Service Sub-Card */}
        <form onSubmit={handleAddSubCard} className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xl shadow-slate-100/80 space-y-4">
          <h2 className="text-xs font-black text-purple-600 uppercase tracking-wider">2. ADD SERVICE SUB-CARD</h2>
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-700">Target Service Category</label>
            <select
              value={targetCategory}
              onChange={(e) => setTargetCategory(e.target.value)}
              required
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-purple-600 shadow-sm"
            >
              <option value="">Select Category</option>
              {mainServices.map((m) => (
                <option key={m.id} value={m.title}>{m.title}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-700">Sub-Card Title</label>
            <input
              type="text"
              value={subCardTitle}
              onChange={(e) => setSubCardTitle(e.target.value)}
              placeholder="e.g. Official Portfolio Setup"
              required
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-purple-600 shadow-sm"
            />
          </div>
          <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-md shadow-purple-200 cursor-pointer mt-7">
            ADD CARD
          </button>
        </form>

        {/* 3. Add Explore Package Card */}
        <form onSubmit={handleSavePackage} className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xl shadow-slate-100/80 space-y-3">
          <h2 className="text-xs font-black text-purple-600 uppercase tracking-wider">3. ADD EXPLORE PACKAGE CARD</h2>
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-700">Target Service Category</label>
            <select
              value={pkgCategory}
              onChange={(e) => setPkgCategory(e.target.value)}
              required
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-purple-600 shadow-sm"
            >
              <option value="">Select Category</option>
              {mainServices.map((m) => (
                <option key={m.id} value={m.title}>{m.title}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-700">Package Name / Title</label>
            <input
              type="text"
              value={pkgName}
              onChange={(e) => setPkgName(e.target.value)}
              placeholder="e.g. Full Day"
              required
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-purple-600 shadow-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-700">Package Price (৳)</label>
            <input
              type="text"
              value={pkgPrice}
              onChange={(e) => setPkgPrice(e.target.value)}
              placeholder="e.g. 45000"
              required
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-purple-600 shadow-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-700">Features List ({features.length} added)</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                placeholder="e.g. 4k camera shoot"
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-purple-600 shadow-sm"
              />
              <button type="button" onClick={handleAddFeature} className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-3 rounded-xl cursor-pointer shadow-sm">+</button>
            </div>
          </div>
          <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-md shadow-purple-200 cursor-pointer mt-1">
            SAVE PACKAGE
          </button>
        </form>

      </div>

      {/* Manage & Edit Existing Items Section */}
      <div className="max-w-7xl mx-auto bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-xl shadow-slate-100/80 space-y-6">
        <h2 className="text-xs font-black text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-4">
          MANAGE & EDIT EXISTING ITEMS
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="space-y-3">
            <h3 className="text-[11px] font-black text-purple-600 uppercase">MAIN SERVICES ({mainServices.length})</h3>
            {mainServices.map((item) => (
              <div key={item.id} className="bg-white border border-slate-100 rounded-2xl p-4 flex justify-between items-center shadow-sm">
                <span className="font-bold text-xs text-slate-900">{item.title}</span>
                <div className="space-x-2 text-[11px] font-bold">
                  <button onClick={() => handleDeleteService(item.id)} className="text-red-500 hover:underline cursor-pointer">Delete</button>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <h3 className="text-[11px] font-black text-purple-600 uppercase">SUB-CARDS ({subCards.length})</h3>
            {subCards.map((item) => (
              <div key={item.id} className="bg-white border border-slate-100 rounded-2xl p-4 flex justify-between items-center shadow-sm">
                <div>
                  <div className="text-[10px] font-bold text-purple-600">{item.category}</div>
                  <div className="font-bold text-xs text-slate-900">{item.title}</div>
                </div>
                <div className="space-x-2 text-[11px] font-bold">
                  <button onClick={() => handleDeleteSubCard(item.id)} className="text-red-500 hover:underline cursor-pointer">Delete</button>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <h3 className="text-[11px] font-black text-purple-600 uppercase">PACKAGES ({packages.length})</h3>
            {packages.map((item) => (
              <div key={item.id} className="bg-white border border-slate-100 rounded-2xl p-4 flex justify-between items-center shadow-sm">
                <div>
                  <div className="text-[10px] font-bold text-purple-600">{item.category} — ৳{item.price}</div>
                  <div className="font-bold text-xs text-slate-900">{item.name}</div>
                </div>
                <div className="space-x-2 text-[11px] font-bold">
                  <button onClick={() => handleDeletePackage(item.id)} className="text-red-500 hover:underline cursor-pointer">Delete</button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* RECEIVED BOOKINGS MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white border border-slate-100 w-full max-w-6xl rounded-3xl p-6 md:p-8 shadow-2xl relative my-8 max-h-[90vh] flex flex-col">
            
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-6">
              <div>
                <h2 className="text-lg md:text-xl font-black text-slate-900">
                  RECEIVED BOOKINGS LIST ({bookings.length})
                </h2>
                <p className="text-xs text-slate-500">Click any row to view full details</p>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 font-bold transition-all cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="overflow-x-auto flex-1 border border-slate-100 rounded-2xl">
              {bookings.length === 0 ? (
                <div className="text-center py-16 space-y-2">
                  <p className="text-sm font-bold text-slate-600">No bookings received yet.</p>
                  <p className="text-xs text-slate-400">Orders placed by customers will appear here.</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-700 border-b border-slate-100 uppercase tracking-wider text-[10px]">
                      <th className="p-4 font-extrabold">Client Name</th>
                      <th className="p-4 font-extrabold">Contact Info</th>
                      <th className="p-4 font-extrabold">Package & Price</th>
                      <th className="p-4 font-extrabold">Company / Type</th>
                      <th className="p-4 font-extrabold">Order Date</th>
                      <th className="p-4 font-extrabold">Requirements</th>
                      <th className="p-4 font-extrabold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {bookings.map((b) => (
                      <tr 
                        key={b.id} 
                        onClick={() => setSelectedBooking(b)}
                        className="hover:bg-purple-50/40 transition-all cursor-pointer"
                      >
                        <td className="p-4 font-bold text-slate-900">{b.fullName}</td>
                        <td className="p-4 space-y-0.5">
                          <div className="text-purple-600 font-medium">{b.businessEmail}</div>
                          <div className="text-slate-500">{b.phoneNumber}</div>
                        </td>
                        <td className="p-4">
                          <span className="bg-purple-100/60 text-purple-700 border border-purple-200/50 px-2.5 py-1 rounded-full font-bold text-[10px] whitespace-nowrap">
                            {b.packageName} {b.packagePrice && `(৳${b.packagePrice})`}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="font-semibold text-slate-900">{b.companyName}</div>
                          <div className="text-slate-400 text-[10px]">{b.businessType} • {b.teamSize}</div>
                        </td>
                        <td className="p-4 font-semibold text-slate-900">
                          {b.startDate}
                        </td>
                        <td className="p-4 max-w-xs truncate text-slate-500" title={b.message}>
                          {b.message || "N/A"}
                        </td>
                        <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={(e) => handleDeleteBooking(b.id, e)}
                            className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer text-[11px]"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
              <span>Click any row for detailed view</span>
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-5 py-2 rounded-xl transition-all shadow-sm cursor-pointer"
              >
                Close Window
              </button>
            </div>

          </div>
        </div>
      )}

      {/* DETAILED SINGLE BOOKING POPUP MODAL */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white border border-slate-100 w-full max-w-2xl rounded-3xl p-6 md:p-8 shadow-2xl relative my-8 space-y-6">
            
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <div>
                <span className="bg-purple-100 text-purple-700 font-bold text-[10px] px-3 py-1 rounded-full uppercase">Order Details</span>
                <h2 className="text-xl font-black text-slate-900 mt-1">{selectedBooking.fullName}</h2>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 font-bold transition-all cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-50/60 p-4 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Client Email</span>
                <p className="font-bold text-purple-600 text-sm">{selectedBooking.businessEmail}</p>
              </div>
              <div className="bg-slate-50/60 p-4 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Phone Number</span>
                <p className="font-bold text-slate-800 text-sm">{selectedBooking.phoneNumber}</p>
              </div>
              <div className="bg-slate-50/60 p-4 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Package Name & Price</span>
                <p className="font-bold text-slate-800 text-sm">{selectedBooking.packageName} {selectedBooking.packagePrice && `(৳${selectedBooking.packagePrice})`}</p>
              </div>
              <div className="bg-slate-50/60 p-4 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Company Name / Type</span>
                <p className="font-bold text-slate-800 text-sm">{selectedBooking.companyName} ({selectedBooking.businessType})</p>
              </div>
              <div className="bg-slate-50/60 p-4 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Team Size & Budget</span>
                <p className="font-bold text-slate-800 text-sm">{selectedBooking.teamSize} • <span className="text-purple-600">{selectedBooking.budget}</span></p>
              </div>
              <div className="bg-slate-50/60 p-4 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Order Date</span>
                <p className="font-bold text-slate-800 text-sm">{selectedBooking.startDate}</p>
              </div>
            </div>

            <div className="bg-slate-50/60 p-4 rounded-2xl border border-slate-100 space-y-1 text-xs">
              <span className="text-slate-400 font-bold uppercase text-[10px]">Client Requirements / Message</span>
              <p className="font-medium text-slate-700 whitespace-pre-wrap">{selectedBooking.message || "No specific requirements provided."}</p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedBooking(null)}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-2.5 rounded-xl transition-all shadow-md shadow-purple-200 cursor-pointer text-xs"
              >
                Close Details
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}