"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

interface PackageItem {
  id: string;
  category: string;
  name: string;
  price: string;
  features: string[];
}

function PackagesContent() {
  const searchParams = useSearchParams();
  const serviceName = searchParams.get("service") || "PERSONAL";

  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [selectedPkg, setSelectedPkg] = useState<PackageItem | null>(null);

  // Today's date in YYYY-MM-DD format to restrict past dates
  const todayStr = new Date().toISOString().split("T")[0];

  // Booking Form State
  const [fullName, setFullName] = useState("");
  const [businessEmail, setBusinessEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [userSize, setUserSize] = useState("");
  const [expectedStartDate, setExpectedStartDate] = useState("");
  const [estimatedBudget, setEstimatedBudget] = useState("");
  const [writeWhatYouWant, setWriteWhatYouWant] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await fetch("/api/services");
        if (res.ok) {
          const data = await res.json();
          setPackages(data.packages || []);
        }
      } catch (err) {
        console.error("Failed to load packages", err);
      }
    };
    fetchPackages();
  }, []);

  const filteredPackages = packages.filter((p) => p.category === serviceName);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    // BD Phone Number Validation
    const bdPhoneRegex = /^(?:\+88)?01[3-9]\d{8}$/;
    if (!bdPhoneRegex.test(phoneNumber.trim())) {
      setErrorMsg("দয়া করে একটি সঠিক বাংলাদেশি মোবাইল নম্বর দিন (যেমন: 01712345678)");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(businessEmail.trim())) {
      setErrorMsg("দয়া করে একটি ভ্যালিড ইমেইল এড্রেস দিন");
      return;
    }

    // Past Date Validation check on submit
    if (expectedStartDate < todayStr) {
      setErrorMsg("অতীতের কোনো তারিখ সিলেক্ট করা যাবে না। দয়া করে আজকের বা ভবিষ্যতের তারিখ দিন।");
      return;
    }

    if (!selectedPkg) return;

    const bookingData = {
      serviceCategory: serviceName,
      packageName: selectedPkg.name,
      fullName,
      email: businessEmail,
      phone: phoneNumber,
      companyName,
      businessType,
      userSize,
      startDate: expectedStartDate,
      budget: estimatedBudget,
      message: writeWhatYouWant,
    };

    const res = await fetch("/api/booking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookingData),
    });

    if (res.ok) {
      setSubmitted(true);
    } else {
      setErrorMsg("বুকিং সাবমিট করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 font-sans text-slate-800 relative">
      <div className="max-w-5xl mx-auto space-y-10">
        <div className="flex justify-between items-center">
          <Link
            href="/"
            className="text-xs font-bold text-purple-600 bg-purple-50 border border-purple-200 hover:bg-purple-100 px-4 py-2.5 rounded-xl transition-all"
          >
            ← Back to Services
          </Link>
          <span className="bg-purple-100 text-purple-700 text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
            {serviceName} PACKAGES
          </span>
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 uppercase">
            {serviceName} PACKAGES
          </h1>
          <p className="text-xs text-slate-500">
            Exclusive pricing and features tailored for {serviceName.toLowerCase()} plans.
          </p>
        </div>

        {filteredPackages.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-16">
            No packages available for <strong className="text-slate-700">{serviceName}</strong> right now.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPackages.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-6 hover:border-purple-300 transition-all"
              >
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-5 rounded-2xl text-center shadow">
                    <span className="text-[10px] font-bold uppercase tracking-widest block opacity-80">
                      {pkg.name}
                    </span>
                    <span className="text-2xl font-black mt-1 block">৳{pkg.price}</span>
                  </div>

                  {pkg.features && pkg.features.length > 0 && (
                    <div className="space-y-2">
                      {pkg.features.map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                          <span className="text-purple-600 font-bold">✓</span> {feat}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => {
                    setSelectedPkg(pkg);
                    setSubmitted(false);
                    setErrorMsg("");
                  }}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs py-3.5 rounded-xl uppercase tracking-wider transition-all shadow cursor-pointer"
                >
                  BOOK NOW
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Expanded & High-Visibility Booking Modal Form */}
      {selectedPkg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-md p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-3xl p-8 md:p-10 rounded-[36px] shadow-2xl space-y-6 relative my-8 border border-purple-100">
            <div className="flex justify-between items-start border-b pb-4">
              <div>
                <span className="bg-purple-100 text-purple-700 text-[11px] font-bold px-3 py-1 rounded-md inline-block mb-2">
                  {serviceName} — {selectedPkg.name}
                </span>
                <h3 className="text-2xl md:text-3xl font-black text-slate-900">
                  Tell Us About Your Business
                </h3>
              </div>
              <button
                onClick={() => setSelectedPkg(null)}
                className="text-slate-400 hover:text-slate-800 text-2xl font-bold p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-all cursor-pointer"
              >
                ✕
              </button>
            </div>

            {errorMsg && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-xs font-bold p-3.5 rounded-xl">
                ⚠️ {errorMsg}
              </div>
            )}

            {submitted ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-3xl font-bold shadow-sm">
                  ✓
                </div>
                <h4 className="text-2xl font-black text-slate-900">Request Sent Successfully!</h4>
                <p className="text-sm text-slate-500">We have received your accurate project details and will get back to you soon.</p>
                <button
                  onClick={() => setSelectedPkg(null)}
                  className="bg-purple-600 text-white px-8 py-3 rounded-xl text-xs font-bold shadow hover:bg-purple-700 transition-all"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-5 text-sm">
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block font-bold text-slate-800 mb-2">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full border border-slate-300 rounded-xl p-3.5 bg-slate-50 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all text-sm"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-800 mb-2">Business Email *</label>
                    <input
                      type="email"
                      required
                      value={businessEmail}
                      onChange={(e) => setBusinessEmail(e.target.value)}
                      className="w-full border border-slate-300 rounded-xl p-3.5 bg-slate-50 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all text-sm"
                      placeholder="you@company.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block font-bold text-slate-800 mb-2">Phone Number (BD Valid Only) *</label>
                    <input
                      type="text"
                      required
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full border border-slate-300 rounded-xl p-3.5 bg-slate-50 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all text-sm"
                      placeholder="e.g. 01712345678"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">Must be a valid 11-digit Bangladeshi mobile number</span>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-800 mb-2">Company Name *</label>
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full border border-slate-300 rounded-xl p-3.5 bg-slate-50 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all text-sm"
                      placeholder="Your company name"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block font-bold text-slate-800 mb-2">Business Type *</label>
                    <select
                      required
                      value={businessType}
                      onChange={(e) => setBusinessType(e.target.value)}
                      className="w-full border border-slate-300 rounded-xl p-3.5 bg-slate-50 focus:ring-2 focus:ring-purple-500 focus:outline-none text-slate-800 transition-all text-sm"
                    >
                      <option value="">Select business Type</option>
                      <option value="Agency">Agency</option>
                      <option value="E-commerce">E-commerce</option>
                      <option value="Startup">Startup</option>
                      <option value="Personal Portfolio">Personal Portfolio</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-800 mb-2">Team/User Size *</label>
                    <select
                      required
                      value={userSize}
                      onChange={(e) => setUserSize(e.target.value)}
                      className="w-full border border-slate-300 rounded-xl p-3.5 bg-slate-50 focus:ring-2 focus:ring-purple-500 focus:outline-none text-slate-800 transition-all text-sm"
                    >
                      <option value="">Select user size</option>
                      <option value="1-5 members">1-5 members</option>
                      <option value="6-20 members">6-20 members</option>
                      <option value="21-50 members">21-50 members</option>
                      <option value="50+ members">50+ members</option>
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block font-bold text-slate-800 mb-2">Expected Start Date *</label>
                    <input
                      type="date"
                      required
                      min={todayStr}
                      value={expectedStartDate}
                      onChange={(e) => setExpectedStartDate(e.target.value)}
                      className="w-full border border-slate-300 rounded-xl p-3.5 bg-slate-50 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all text-slate-800 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-800 mb-2">Estimated Budget *</label>
                    <select
                      required
                      value={estimatedBudget}
                      onChange={(e) => setEstimatedBudget(e.target.value)}
                      className="w-full border border-slate-300 rounded-xl p-3.5 bg-slate-50 focus:ring-2 focus:ring-purple-500 focus:outline-none text-slate-800 transition-all text-sm"
                    >
                      <option value="">Select budget</option>
                      <option value="৳10,000 - ৳30,000">৳10,000 - ৳30,000</option>
                      <option value="৳30,000 - ৳60,000">৳30,000 - ৳60,000</option>
                      <option value="৳60,000 - ৳1,00,000">৳60,000 - ৳1,00,000</option>
                      <option value="৳1,00,000+">৳1,00,000+</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-2">Write what you want *</label>
                  <textarea
                    required
                    rows={4}
                    value={writeWhatYouWant}
                    onChange={(e) => setWriteWhatYouWant(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl p-3.5 bg-slate-50 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all text-slate-800 text-sm"
                    placeholder="Describe your current process, required features, integrations & challenges in detail"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-slate-900 hover:bg-purple-600 text-white font-bold py-4 rounded-2xl uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 text-sm cursor-pointer"
                >
                  <span>Send My Request</span>
                  <span>→</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function PackagesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-xs text-slate-400">Loading packages...</div>}>
      <PackagesContent />
    </Suspense>
  );
}