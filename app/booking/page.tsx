"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function BookingForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const packageName = searchParams.get("package") || "Selected Service";
  const packagePrice = searchParams.get("price") || "";

  const [fullName, setFullName] = useState("");
  const [businessEmail, setBusinessEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [startDate, setStartDate] = useState("");
  const [budget, setBudget] = useState("");
  const [message, setMessage] = useState("");

  // Get today's date safely in client side
  const todayStr = typeof window !== "undefined" ? new Date().toISOString().split("T")[0] : "";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const phoneRegex = /^[+]?[\d\s-]{10,15}$/;
    if (!phoneRegex.test(phoneNumber)) {
      alert("Please enter a valid phone number (at least 10 digits).");
      return;
    }

    const newBooking = {
      id: Date.now().toString(),
      packageName,
      packagePrice,
      fullName,
      businessEmail,
      phoneNumber,
      companyName,
      businessType,
      teamSize,
      startDate,
      budget,
      message,
      dateSubmitted: new Date().toLocaleString(),
    };

    if (typeof window !== "undefined") {
      const existingBookings = JSON.parse(localStorage.getItem("admin_bookings") || "[]");
      localStorage.setItem("admin_bookings", JSON.stringify([newBooking, ...existingBookings]));
    }

    alert("Your request has been sent successfully!");
    router.push("/");
  };

  return (
    <div className="bg-white w-full max-w-2xl rounded-3xl p-6 md:p-8 shadow-2xl relative border border-slate-100 my-8">
      <button
        onClick={() => router.push("/")}
        className="absolute top-6 right-6 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 font-bold transition-all cursor-pointer"
      >
        ✕
      </button>

      <div className="inline-block bg-slate-100 border border-slate-300 px-4 py-1.5 rounded-full font-bold text-xs text-slate-800 uppercase tracking-wide mb-4">
        {packageName} {packagePrice && `(৳${packagePrice})`} — All night
      </div>

      <h2 className="text-xl md:text-2xl font-black text-slate-900 mb-6">
        Tell Us About Your Business
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-700">Full Name</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Azmine Sadik"
              className="w-full bg-[#f1f5f9] border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:outline-none focus:border-purple-600"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-700">Business Email</label>
            <input
              type="email"
              required
              value={businessEmail}
              onChange={(e) => setBusinessEmail(e.target.value)}
              placeholder="you@company.com"
              className="w-full bg-[#f1f5f9] border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:outline-none focus:border-purple-600"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-700">Phone Number</label>
            <input
              type="tel"
              required
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+8801779846022"
              className="w-full bg-[#f1f5f9] border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:outline-none focus:border-purple-600"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-700">Company Name</label>
            <input
              type="text"
              required
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Company name"
              className="w-full bg-[#f1f5f9] border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:outline-none focus:border-purple-600"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-700">Business Type</label>
            <select
              required
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
              className="w-full bg-[#f1f5f9] border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:outline-none focus:border-purple-600"
            >
              <option value="">Select business Type</option>
              <option value="Agency">Agency</option>
              <option value="E-commerce">E-commerce</option>
              <option value="Corporate">Corporate</option>
              <option value="Startup">Startup</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-700">Team/User Size</label>
            <select
              required
              value={teamSize}
              onChange={(e) => setTeamSize(e.target.value)}
              className="w-full bg-[#f1f5f9] border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:outline-none focus:border-purple-600"
            >
              <option value="">Select user size</option>
              <option value="1-10">1-10 Members</option>
              <option value="11-50">11-50 Members</option>
              <option value="50+">50+ Members</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-700">Expected Start Date</label>
            <input
              type="date"
              required
              min={todayStr}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-[#f1f5f9] border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:outline-none focus:border-purple-600"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-700">Estimated Budget</label>
            <select
              required
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full bg-[#f1f5f9] border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:outline-none focus:border-purple-600"
            >
              <option value="">Select budget</option>
              <option value="৳10,000 - ৳30,000">৳10,000 - ৳30,000</option>
              <option value="৳30,000 - ৳70,000">৳30,000 - ৳70,000</option>
              <option value="৳70,000+">৳70,000+</option>
            </select>
          </div>
        </div>

        <div className="space-y-1 pt-1">
          <label className="text-[11px] font-bold text-slate-700">Write what you want</label>
          <textarea
            required
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Describe your current process, required features, integrations & challenges"
            className="w-full bg-[#f1f5f9] border border-slate-200 rounded-xl p-4 text-xs text-slate-800 focus:outline-none focus:border-purple-600 resize-none"
          ></textarea>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="w-full bg-[#e8edf5] hover:bg-[#dfe6f2] border border-slate-300 text-slate-900 font-bold text-xs py-4 rounded-2xl transition-all shadow-sm flex justify-center items-center gap-2 cursor-pointer"
          >
            <span>SEND MY REQUEST</span>
            <span className="text-sm">→</span>
          </button>
        </div>
      </form>
    </div>
  );
}

export default function BookingPage() {
  return (
    <div className="min-h-screen bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <Suspense fallback={<div className="text-white text-xs font-bold">Loading...</div>}>
        <BookingForm />
      </Suspense>
    </div>
  );
}