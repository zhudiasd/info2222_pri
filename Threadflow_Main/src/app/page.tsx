'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CommunicationSystem from '@/components/ThreadFlow';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  return <CommunicationSystem />;
} 