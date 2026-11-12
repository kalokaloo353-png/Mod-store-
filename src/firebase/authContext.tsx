import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, googleProvider, db, handleFirestoreError, OperationType } from './config';
import { UserProfile } from '../types/mod';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  error: string | null;
  clearError: () => void;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, displayName: string) => Promise<void>;
  logOut: () => Promise<void>;
  updateProfileDetails: (displayName: string, bio: string) => Promise<void>;
  isAuthModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  authMode: 'signin' | 'signup';
  setAuthMode: (mode: 'signin' | 'signup') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  const clearError = () => setError(null);

  // Sync profile document in Firestore
  const syncUserProfile = async (firebaseUser: User, explicitDisplayName?: string) => {
    try {
      const userRef = doc(db, 'users', firebaseUser.uid);
      const snap = await getDoc(userRef);

      if (snap.exists()) {
        setUserProfile(snap.data() as UserProfile);
      } else {
        const newProfile: UserProfile = {
          userId: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: explicitDisplayName || firebaseUser.displayName || 'Modder',
          bio: 'Gaming enthusiast & mod curator on Modstore',
          role: 'Verified Modder',
          createdAt: new Date().toISOString(),
          reputation: 100,
        };
        await setDoc(userRef, newProfile);
        setUserProfile(newProfile);
      }
    } catch (err) {
      console.error('Failed to sync user profile:', err);
      // Fallback local representation if offline
      setUserProfile({
        userId: firebaseUser.uid,
        email: firebaseUser.email || '',
        displayName: explicitDisplayName || firebaseUser.displayName || 'Modder',
        bio: 'Modstore member',
        role: 'Verified Modder',
        createdAt: new Date().toISOString(),
      });
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await syncUserProfile(currentUser);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      setError(null);
      const res = await signInWithPopup(auth, googleProvider);
      if (res.user) {
        await syncUserProfile(res.user);
        setAuthModalOpen(false);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Google sign in failed';
      // Suppress user popup closed error into friendly notice
      if (msg.includes('popup-closed-by-user')) {
        setError('Sign in was canceled. Please try again.');
      } else {
        setError(msg);
      }
      throw err;
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    try {
      setError(null);
      const res = await signInWithEmailAndPassword(auth, email, pass);
      if (res.user) {
        await syncUserProfile(res.user);
        setAuthModalOpen(false);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid email or password';
      if (msg.includes('user-not-found') || msg.includes('wrong-password') || msg.includes('invalid-credential')) {
        setError('Incorrect email address or password.');
      } else if (msg.includes('invalid-email')) {
        setError('Please enter a valid email address.');
      } else {
        setError(msg);
      }
      throw err;
    }
  };

  const signUpWithEmail = async (email: string, pass: string, displayName: string) => {
    try {
      setError(null);
      const res = await createUserWithEmailAndPassword(auth, email, pass);
      if (res.user) {
        await updateProfile(res.user, { displayName });
        await syncUserProfile(res.user, displayName);
        setAuthModalOpen(false);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Sign up failed';
      if (msg.includes('email-already-in-use')) {
        setError('An account with this email already exists.');
      } else if (msg.includes('weak-password')) {
        setError('Password should be at least 6 characters.');
      } else {
        setError(msg);
      }
      throw err;
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setUserProfile(null);
    } catch (err) {
      console.error('Sign out failed', err);
    }
  };

  const updateProfileDetails = async (displayName: string, bio: string) => {
    if (!user) return;
    try {
      setError(null);
      await updateProfile(user, { displayName });
      const userRef = doc(db, 'users', user.uid);
      const updated: Partial<UserProfile> = {
        displayName,
        bio,
      };
      await setDoc(userRef, updated, { merge: true });
      setUserProfile((prev) => (prev ? { ...prev, displayName, bio } : null));
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${user.uid}`);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        error,
        clearError,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        logOut,
        updateProfileDetails,
        isAuthModalOpen,
        setAuthModalOpen,
        authMode,
        setAuthMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
