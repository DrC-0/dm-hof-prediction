import { useState, useEffect } from 'react';
import type { User } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';

const DEBUG_USER = {
  uid: 'debug-uid',
  displayName: 'デバッグユーザー',
  photoURL: null,
} as unknown as User;

export const useAuth = () => {
  const isDebug = new URLSearchParams(window.location.search).get('debug') === '1';

  const [user, setUser] = useState<User | null>(isDebug ? DEBUG_USER : null);
  const [loading, setLoading] = useState(!isDebug);

  useEffect(() => {
    if (isDebug) return;
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [isDebug]);

  return { user, loading };
};