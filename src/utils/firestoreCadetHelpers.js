/**
 * Firestore Cadet Helpers
 * Cloud-based cadet management with automatic sync
 */

import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '../config/firebase';

const CADETS_COLLECTION = 'cadets';

/**
 * Get all cadets from Firestore (one-time read)
 */
export const getCadets = async () => {
  try {
    const cadetQuery = query(collection(db, CADETS_COLLECTION));
    const querySnapshot = await getDocs(cadetQuery);
    
    const cadets = [];
    querySnapshot.forEach(doc => {
      cadets.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    
    return cadets;
  } catch (error) {
    console.error('Error fetching cadets:', error);
    return [];
  }
};

/**
 * Subscribe to real-time cadet updates
 * Automatically updates when any user adds/deletes/updates a cadet
 */
export const subscribeToCadets = (callback) => {
  try {
    const cadetQuery = query(collection(db, CADETS_COLLECTION));
    
    const unsubscribe = onSnapshot(cadetQuery, (querySnapshot) => {
      const cadets = [];
      querySnapshot.forEach(doc => {
        cadets.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      callback(cadets);
    }, (error) => {
      console.error('Error subscribing to cadets:', error);
      callback([]);
    });
    
    return unsubscribe; // Return unsubscribe function for cleanup
  } catch (error) {
    console.error('Error setting up cadet subscription:', error);
    return () => {}; // Return no-op function
  }
};

/**
 * Add a new cadet to Firestore
 */
export const addCadet = async (cadetData) => {
  try {
    const docRef = await addDoc(collection(db, CADETS_COLLECTION), {
      ...cadetData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    
    return {
      id: docRef.id,
      ...cadetData,
    };
  } catch (error) {
    console.error('Error adding cadet:', error);
    throw error;
  }
};

/**
 * Update an existing cadet
 */
export const updateCadet = async (cadetId, updates) => {
  try {
    const cadetRef = doc(db, CADETS_COLLECTION, cadetId);
    await updateDoc(cadetRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
    
    return {
      id: cadetId,
      ...updates,
    };
  } catch (error) {
    console.error('Error updating cadet:', error);
    throw error;
  }
};

/**
 * Delete a cadet
 */
export const deleteCadet = async (cadetId) => {
  try {
    await deleteDoc(doc(db, CADETS_COLLECTION, cadetId));
    return true;
  } catch (error) {
    console.error('Error deleting cadet:', error);
    throw error;
  }
};

/**
 * Generate unique ID for cadet
 * Format: SD/SW + Gender + RegimentalNumber
 * Example: SD/001, SW/F002
 */
export const generateUniqueId = (gender, regimentalNumber) => {
  const genderPrefix = gender === 'Male' ? 'SD' : 'SW';
  return `${genderPrefix}/${regimentalNumber}`;
};
