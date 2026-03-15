import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaHammer, FaLock } from 'react-icons/fa';

const MaintenanceGuard = ({ children }) => {
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const checkStatus = async () => {
      try {
        // Import API config
        const { API_CONFIG, isBackendAvailable } = await import('../utils/apiConfig');

        // Check if backend is available first
        const backendAvailable = await isBackendAvailable();
        if (!backendAvailable) {
          if (isMounted) {
            console.log('Backend not available - skipping maintenance check');
            setLoading(false);
          }
          return;
        }

        const res = await axios.get(`${API_CONFIG.BASE_URL}/api/admin/settings/public`, {
          timeout: API_CONFIG.TIMEOUT,
          headers: { 'Content-Type': 'application/json' }
        });

        if (isMounted && res.data?.settings?.maintenanceMode) {
          setIsMaintenance(true);
        }
      } catch (e) {
        if (isMounted) {
          console.error('Status check fail - Backend server may not be running');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    // Check initially and then every 2 minutes
    const timer = setTimeout(checkStatus, 1000);
    const interval = setInterval(checkStatus, 120000);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  // Always allow admin routes
  if (window.location.pathname.startsWith('/admin')) return children;

  if (loading) return null; // Or a subtle loader

  if (isMaintenance) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-8 text-center">
        <div className="max-w-md w-full">
          <div className="w-32 h-32 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-yellow-500/20 animate-pulse">
            <FaHammer className="text-yellow-500 text-5xl" />
          </div>
          <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-4">Under Synthesis</h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-10 leading-relaxed">
            Sentinel protocol is currently optimizing core clusters. Access restricted during evolution.
          </p>
          <div className="flex items-center justify-center gap-3 py-4 px-6 bg-slate-900 border border-slate-800 rounded-3xl text-sm font-black uppercase tracking-widest text-slate-500">
            <FaLock className="text-yellow-500" /> Maintenance active
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default MaintenanceGuard;
