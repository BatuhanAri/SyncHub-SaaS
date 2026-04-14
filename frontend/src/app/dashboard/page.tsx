"use client";

import React from 'react';
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  Clock,
  ArrowUpRight,
  MoreVertical
} from 'lucide-react';

const stats = [
  { label: 'Total Appointments', value: '128', change: '+12%', icon: Calendar, color: 'text-blue-500' },
  { label: 'Total Customers', value: '842', change: '+18%', icon: Users, color: 'text-indigo-500' },
  { label: 'Revenue (MTD)', value: '$12,450', change: '+7%', icon: TrendingUp, color: 'text-emerald-500' },
  { label: 'Avg. Duration', value: '42m', change: '-2%', icon: Clock, color: 'text-amber-500' },
];

export default function DashboardOverview() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Dashboard Overview</h1>
        <p className="text-gray-500 text-sm mt-1">Monitor your service performance and upcoming bookings.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="glass-card p-6 group hover:border-indigo-500/30 transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 rounded-xl bg-white/5 ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                stat.change.startsWith('+') ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
              }`}>
                {stat.change}
              </span>
            </div>
            <div>
              <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
              <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Appointments */}
        <div className="lg:col-span-2 glass-card overflow-hidden">
          <div className="p-6 border-b border-white/5 flex justify-between items-center">
            <h3 className="font-semibold">Recent Appointments</h3>
            <button className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">View all</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs text-gray-500 border-b border-white/5">
                  <th className="px-6 py-4 font-medium uppercase">Customer</th>
                  <th className="px-6 py-4 font-medium uppercase">Service</th>
                  <th className="px-6 py-4 font-medium uppercase">Date</th>
                  <th className="px-6 py-4 font-medium uppercase">Status</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[1, 2, 3, 4].map((item) => (
                  <tr key={item} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-xs font-bold text-gray-400">
                          JD
                        </div>
                        <div>
                          <p className="text-sm font-medium">John Doe</p>
                          <p className="text-xs text-gray-500">john@example.com</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-300">Haircut & Styling</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <p className="text-gray-300">Oct 24, 2024</p>
                        <p className="text-xs text-gray-500">10:00 AM</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-indigo-500/10 text-indigo-400 text-[10px] font-bold uppercase tracking-wider rounded">
                        Confirmed
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-1 hover:bg-white/10 rounded transition-colors text-gray-500">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions / Integration Status */}
        <div className="space-y-6">
          <div className="glass-card p-6 bg-indigo-600 shadow-xl shadow-indigo-600/20 border-none relative overflow-hidden group cursor-pointer">
            <ArrowUpRight className="absolute top-4 right-4 text-white/40 group-hover:text-white transition-colors" />
            <div className="relative z-10 text-white">
              <h3 className="font-bold text-lg">New Appointment</h3>
              <p className="text-white/70 text-sm mt-1">Schedule a manual booking for a custom client.</p>
              <button className="mt-4 px-4 py-2 bg-white text-indigo-600 rounded-lg text-sm font-bold">Create Now</button>
            </div>
            {/* Background Decor */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
          </div>

          <div className="glass-card p-6">
            <h3 className="font-semibold mb-4">Automation Health</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/50"></div>
                  <span className="text-sm font-medium text-gray-300">n8n Instance</span>
                </div>
                <span className="text-xs text-emerald-400">Online</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/50"></div>
                  <span className="text-sm font-medium text-gray-300">WhatsApp Webhook</span>
                </div>
                <span className="text-xs text-emerald-400">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
