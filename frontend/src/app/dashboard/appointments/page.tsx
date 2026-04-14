"use client";

import React, { useEffect, useState } from 'react';
import { 
  Calendar, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Clock, 
  Mail, 
  Phone,
  AlertCircle
} from 'lucide-react';
import api from '@/lib/api';
import { Appointment } from '@/lib/types';
import { format } from 'date-fns';
import AppointmentModal from './components/AppointmentModal';

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAppointments = async () => {
    try {
      const response = await api.get('/appointments');
      setAppointments(response.data);
      setLoading(false);
    } catch (err: any) {
      setError('Failed to load appointments.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
      case 'cancelled': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'completed': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  return (
    <div className="space-y-8">
      <AppointmentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={() => {
          setLoading(true);
          fetchAppointments();
        }}
      />
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Appointments</h1>
          <p className="text-gray-500 text-sm mt-1">Manage and track your customer bookings.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center gap-2 justify-center"
        >
          <Plus className="w-4 h-4" />
          New Appointment
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search by customer name or email..." 
            className="input-field pl-10 h-10"
          />
        </div>
        <button className="flex items-center gap-2 px-4 h-10 rounded-lg border border-white/10 hover:bg-white/5 transition-colors text-sm font-medium">
          <Filter className="w-4 h-4" />
          Filters
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
        </div>
      ) : error ? (
        <div className="glass-card p-10 text-center">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-4" />
          <p className="text-gray-400">{error}</p>
          <button onClick={() => {setLoading(true); fetchAppointments();}} className="mt-4 text-indigo-400 hover:underline">Try again</button>
        </div>
      ) : appointments.length === 0 ? (
        <div className="glass-card p-20 text-center">
          <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold">No appointments found</h3>
          <p className="text-gray-500 mt-1 max-w-sm mx-auto">Start by creating your first appointment or share your booking link with customers.</p>
          <button className="mt-6 btn-primary">Create First Appointment</button>
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs text-gray-500 border-b border-white/5 bg-white/[0.01]">
                  <th className="px-6 py-4 font-medium uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-4 font-medium uppercase tracking-wider">Service</th>
                  <th className="px-6 py-4 font-medium uppercase tracking-wider">Date & Time</th>
                  <th className="px-6 py-4 font-medium uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {appointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-indigo-500/10 flex items-center justify-center text-xs font-bold text-indigo-400 border border-indigo-500/20">
                          {apt.customerName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-200">{apt.customerName}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="flex items-center gap-1 text-[11px] text-gray-500">
                              <Mail className="w-3 h-3" />
                              {apt.customerEmail}
                            </span>
                            {apt.customerPhone && (
                              <span className="flex items-center gap-1 text-[11px] text-gray-500">
                                <Phone className="w-3 h-3" />
                                {apt.customerPhone}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-white/5 border border-white/5">
                        <span className="text-sm text-gray-300 font-medium">{apt.service?.name}</span>
                        <span className="text-[10px] text-gray-500 bg-white/5 px-1.5 rounded">
                          {apt.service?.durationMinutes}m
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-sm">
                        <p className="text-gray-200 font-medium">
                          {format(new Date(apt.startTime), 'MMM d, yyyy')}
                        </p>
                        <p className="text-xs text-indigo-400 mt-0.5 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {format(new Date(apt.startTime), 'hh:mm a')}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(apt.status)}`}>
                        {apt.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-500 hover:text-white">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
