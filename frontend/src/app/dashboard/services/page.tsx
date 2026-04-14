"use client";

import React, { useEffect, useState } from 'react';
import { 
  Package, 
  Plus, 
  Clock, 
  DollarSign, 
  AlertCircle,
  MoreVertical
} from 'lucide-react';
import api from '@/lib/api';
import { Service } from '@/lib/types';

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchServices = async () => {
    try {
      const response = await api.get('/services');
      setServices(response.data);
      setLoading(false);
    } catch (err: any) {
      setError('Failed to load services.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Services</h1>
          <p className="text-gray-500 text-sm mt-1">Manage the services and pricing your business offers.</p>
        </div>
        <button className="btn-primary flex items-center gap-2 justify-center">
          <Plus className="w-4 h-4" />
          Add Service
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
          <button onClick={() => {setLoading(true); fetchServices();}} className="mt-4 text-indigo-400 hover:underline">Try again</button>
        </div>
      ) : services.length === 0 ? (
        <div className="glass-card p-20 text-center">
          <Package className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold">No services found</h3>
          <p className="text-gray-500 mt-1 max-w-sm mx-auto">Create services like "Haircut" or "Consultation" so customers can book them.</p>
          <button className="mt-6 btn-primary">Add Your First Service</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div key={service.id} className="glass-card p-6 hover:border-indigo-500/30 transition-all group relative">
              <button className="absolute top-4 right-4 p-1 rounded-lg hover:bg-white/5 text-gray-500">
                <MoreVertical className="w-4 h-4" />
              </button>
              
              <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-6 border border-indigo-500/20 group-hover:bg-indigo-500/20 transition-colors">
                <Package className="w-6 h-6 text-indigo-400" />
              </div>

              <h3 className="text-lg font-bold mb-4">{service.name}</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-white/5">
                  <span className="text-xs text-gray-500 flex items-center gap-1.5 uppercase tracking-wider font-semibold">
                    <Clock className="w-3.5 h-3.5" />
                    Duration
                  </span>
                  <span className="text-sm text-gray-300 font-medium">{service.durationMinutes} minutes</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-white/5">
                  <span className="text-xs text-gray-500 flex items-center gap-1.5 uppercase tracking-wider font-semibold">
                    <DollarSign className="w-3.5 h-3.5" />
                    Price
                  </span>
                  <span className="text-sm font-bold text-white">${service.price}</span>
                </div>
              </div>

              <div className="mt-6">
                <button className="w-full py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold text-gray-400 hover:text-white transition-all">
                  Edit Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
