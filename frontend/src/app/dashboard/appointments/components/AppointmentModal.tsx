"use client";

import React, { useState, useEffect } from 'react';
import { X, Calendar, User, Mail, Phone, Clock, Loader2, Check } from 'lucide-react';
import api from '@/lib/api';
import { Service } from '@/lib/types';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AppointmentModal({ isOpen, onClose, onSuccess }: AppointmentModalProps) {
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    serviceId: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    startTime: '',
    date: ''
  });

  useEffect(() => {
    if (isOpen) {
      fetchServices();
    }
  }, [isOpen]);

  const fetchServices = async () => {
    try {
      const response = await api.get('/services');
      setServices(response.data);
      if (response.data.length > 0) {
        setFormData(prev => ({ ...prev, serviceId: response.data[0].id }));
      }
    } catch (err) {
      console.error('Failed to fetch services', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Combine date and time
      const startDateTime = new Date(`${formData.date}T${formData.startTime}:00Z`);
      
      await api.post('/appointments', {
        serviceId: formData.serviceId,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        startTime: startDateTime.toISOString(),
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create appointment. Check time availability.');
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="glass-card w-full max-w-lg relative z-10 overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <h2 className="text-xl font-bold">New Appointment</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Service</label>
              <select 
                className="input-field appearance-none cursor-pointer"
                value={formData.serviceId}
                onChange={(e) => setFormData({...formData, serviceId: e.target.value})}
                required
              >
                {services.map(s => (
                  <option key={s.id} value={s.id} className="bg-[#111116]">{s.name} ({s.durationMinutes} min - ${s.price})</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                  <input 
                    type="date" 
                    className="input-field pl-10" 
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Time (UTC)</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                  <input 
                    type="time" 
                    className="input-field pl-10" 
                    required
                    value={formData.startTime}
                    onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Customer Name</label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                <input 
                  type="text" 
                  placeholder="John Doe"
                  className="input-field pl-10" 
                  required
                  value={formData.customerName}
                  onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                  <input 
                    type="email" 
                    placeholder="john@example.com"
                    className="input-field pl-10 text-sm" 
                    required
                    value={formData.customerEmail}
                    onChange={(e) => setFormData({...formData, customerEmail: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                  <input 
                    type="tel" 
                    placeholder="+1 234..."
                    className="input-field pl-10 text-sm" 
                    value={formData.customerPhone}
                    onChange={(e) => setFormData({...formData, customerPhone: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 transition-colors text-sm font-medium"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="flex-1 btn-primary flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Check className="w-4 h-4" /> Create</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
