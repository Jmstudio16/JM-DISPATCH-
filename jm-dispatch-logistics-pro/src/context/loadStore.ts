import { create } from 'zustand';

interface Load {
  id: string;
  origin: string;
  destination: string;
  price: number;
  status: 'available' | 'assigned' | 'accepted' | 'rejected';
  assignedTo?: string;
}

interface LoadStore {
  loads: Load[];
  createLoad: (load: Load) => void;
  assignLoad: (id: string, driverId: string) => void;
  updateStatus: (id: string, status: Load['status']) => void;
}

export const useLoadStore = create<LoadStore>((set) => ({
  loads: [],
  createLoad: (load) =>
    set((state) => ({ loads: [...state.loads, load] })),
  assignLoad: (id, driverId) =>
    set((state) => ({
      loads: state.loads.map((l) =>
        l.id === id ? { ...l, status: 'assigned', assignedTo: driverId } : l
      ),
    })),
  updateStatus: (id, status) =>
    set((state) => ({
      loads: state.loads.map((l) =>
        l.id === id ? { ...l, status } : l
      ),
    })),
}));
