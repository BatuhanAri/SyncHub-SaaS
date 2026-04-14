export interface Service {
  id: string;
  name: string;
  durationMinutes: number;
  price: number;
}

export interface Appointment {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'cancelled' | 'completed';
  service: Service;
}
