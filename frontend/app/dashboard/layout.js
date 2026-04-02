'use client';
import { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import TopNav from '../../components/TopNav';
import BookingModal from '../../components/BookingModal';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({ children }) {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const router = useRouter();

  const handleBookingSuccess = () => {
    // Refresh the page data
    router.refresh();
    // For client components that fetch on mount, a reload might be needed if not using server actions
    window.location.reload(); 
  };

  return (
    <div className="flex fixed inset-0 bg-background overflow-hidden font-sans text-foreground antialiased transition-colors duration-300">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 relative">
        <TopNav onBookClick={() => setIsBookingModalOpen(true)} />
        <main className="flex-1 overflow-y-auto px-10 pt-28 pb-8 relative scroll-smooth no-scrollbar">
          {children}
        </main>
      </div>

      <BookingModal 
        isOpen={isBookingModalOpen} 
        onClose={() => setIsBookingModalOpen(false)} 
        onBookingSuccess={handleBookingSuccess}
      />
    </div>
  );
}
