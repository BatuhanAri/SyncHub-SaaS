"use client";

import Link from "next/link";
import { Sparkles, ArrowRight, Zap, Shield, BarChart3 } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white fill-current" />
          </div>
          <span className="font-bold text-xl tracking-tight">SyncHub</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/auth/login" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
            Sign In
          </Link>
          <Link href="/auth/register" className="btn-primary py-2 px-5 text-sm">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 pt-20 pb-32 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium mb-8">
          <Sparkles className="w-3 h-3" />
          <span>v1.0 is now in early access</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
          Automate your <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">Appointments</span>
          <br />with intelligence.
        </h1>
        
        <p className="max-w-2xl mx-auto text-gray-400 text-lg mb-12">
          The all-in-one SaaS platform for multi-tenant business automation. 
          Manage bookings, sync with WhatsApp, and grow your revenue effortlessly.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/auth/register" className="btn-primary py-4 px-8 text-lg flex items-center gap-2">
            Claim your domain
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link href="/auth/login" className="px-8 py-4 rounded-lg border border-white/10 hover:bg-white/5 transition-all text-lg font-medium">
            Live Demo
          </Link>
        </div>

        {/* Feature Preview */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-card p-8 text-left group hover:border-indigo-500/30 transition-all">
            <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-indigo-500/20 transition-colors">
              <Shield className="w-6 h-6 text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold mb-3">Multi-Tenant Isolation</h3>
            <p className="text-gray-500 leading-relaxed">Enterprise-grade Row Level Security ensuring your data is always safe and isolated.</p>
          </div>
          <div className="glass-card p-8 text-left group hover:border-cyan-500/30 transition-all">
            <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-cyan-500/20 transition-colors">
              <Zap className="w-6 h-6 text-cyan-400" />
            </div>
            <h3 className="text-xl font-bold mb-3">n8n Automation</h3>
            <p className="text-gray-500 leading-relaxed">Seamlessly trigger custom workflows, WhatsApp reminders, and email sequences.</p>
          </div>
          <div className="glass-card p-8 text-left group hover:border-purple-500/30 transition-all">
            <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-500/20 transition-colors">
              <BarChart3 className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold mb-3">Dynamic Analytics</h3>
            <p className="text-gray-500 leading-relaxed">Real-time insights into your bookings, revenue, and customer engagement metrics.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
