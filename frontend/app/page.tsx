"use client";

import { Navbar } from "@/components/Navbar";
import { useActiveAccount } from "thirdweb/react";
import Link from "next/link"; // Use Link component for client-side nav

export default function Home() {
  const account = useActiveAccount();

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="relative flex-grow min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Immersive Background */}
        <div className="absolute inset-0 z-0">
          {/* High quality nature image */}
          <img
            src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2813&auto=format&fit=crop"
            alt="Lush Greenery"
            className="w-full h-full object-cover"
          />
          {/* Gradient Overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-green-950/90"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">

          <div className="mb-8 animate-fade-in-up">
            <span className="inline-block py-2 px-6 rounded-full bg-white/10 border border-white/20 text-white text-sm font-bold tracking-widest uppercase backdrop-blur-md shadow-lg">
              Web3 Gardening
            </span>
          </div>

          <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight font-serif mb-8 text-white drop-shadow-2xl leading-tight">
            Grow Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-400">Digital Garden</span>.
          </h1>

          <p className="max-w-2xl text-xl md:text-2xl text-stone-200 mb-12 leading-relaxed drop-shadow-md font-light">
            The first platform to give your plants an immutable identity. Track their life, log their growth, and pass their legacy to future stewards.
          </p>

          <div className="flex flex-col sm:flex-row gap-6">
            <Link
              href="/register"
              className="px-10 py-5 bg-green-500 hover:bg-green-400 text-white font-bold rounded-full text-xl shadow-xl hover:shadow-green-500/50 transition-all transform hover:-translate-y-1 hover:scale-105"
            >
              Start Planting
            </Link>
            <Link
              href="/my-plants"
              className="px-10 py-5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-full text-xl backdrop-blur-md border border-white/30 transition-all hover:bg-white/15"
            >
              View Garden
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-8 h-8 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Features Grid with Plant Background */}
      <section className="py-32 bg-stone-100 relative overflow-hidden">
        {/* Subtle leaf texture overlay if desired, or just cleaner layout */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 opacity-5">
          <svg width="400" height="400" viewBox="0 0 100 100" fill="currentColor" className="text-green-900">
            <path d="M50 0 C20 0 0 20 0 50 C0 80 20 100 50 100 C80 100 100 80 100 50 C100 20 80 0 50 0 Z" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-green-700 font-bold tracking-widest uppercase text-sm mb-3">Why Nomadic Plants?</h2>
            <h3 className="text-4xl md:text-6xl font-bold text-green-950 font-serif">Nature meets Blockchain</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {/* Feature 1 */}
            <div className="group p-10 rounded-[2rem] bg-white border border-stone-200 shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="h-16 w-16 bg-green-50 rounded-2xl flex items-center justify-center text-3xl mb-8 group-hover:scale-110 transition-transform">🌱</div>
              <h4 className="text-2xl font-bold text-green-900 mb-4 font-serif">Living Identity</h4>
              <p className="text-stone-600 leading-relaxed text-lg">
                Mint a "PlantSoul" NFT. It's more than a token; it's a permanent digital record of your plant's species, name, and birth.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-10 rounded-[2rem] bg-white border border-stone-200 shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="h-16 w-16 bg-green-50 rounded-2xl flex items-center justify-center text-3xl mb-8 group-hover:scale-110 transition-transform">📸</div>
              <h4 className="text-2xl font-bold text-green-900 mb-4 font-serif">Proof of Care</h4>
              <p className="text-stone-600 leading-relaxed text-lg">
                Upload monthly photos to the blockchain. Log your plant's growth and prove your dedication to the community.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-10 rounded-[2rem] bg-white border border-stone-200 shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="h-16 w-16 bg-green-50 rounded-2xl flex items-center justify-center text-3xl mb-8 group-hover:scale-110 transition-transform">🤝</div>
              <h4 className="text-2xl font-bold text-green-900 mb-4 font-serif">Seamless Handover</h4>
              <p className="text-stone-600 leading-relaxed text-lg">
                Moving cities? Transfer stewardship instantly. The new guardian takes over, and you earn a "Steward Badge" for your legacy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 bg-green-900 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=2873&auto=format&fit=crop" className="w-full h-full object-cover opacity-20 mix-blend-overlay" />
        </div>
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <h2 className="text-4xl md:text-6xl font-bold text-white font-serif mb-8">Ready to plant your legacy?</h2>
          <p className="text-green-100 text-xl mb-12">Join the network of mindful stewards today.</p>
          <Link href="/register" className="inline-block px-12 py-5 bg-white text-green-900 font-bold rounded-full text-xl shadow-xl hover:bg-green-50 transition-transform hover:scale-105">
            Register Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-950 text-green-400 py-12 border-t border-green-900">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center items-center gap-2 mb-6 opacity-50">
            <span className="text-2xl">🌿</span>
          </div>
          <p className="text-sm opacity-60">
            &copy; {new Date().getFullYear()} Nomadic Plants. Built for the Earth, on Ethereum.
          </p>
        </div>
      </footer>
    </div>
  );
}
