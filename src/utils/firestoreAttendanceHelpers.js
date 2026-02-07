/**
 * Firestore Attendance Helpers
 * Cloud-based attendance tracking with automatic sync
 */

import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  onSnapshot,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '../config/firebase';

const ATTENDANCE_COLLECTION = 'attendance';

/**
 * Get all attendance records from Firestore
 */
export const getAllAttendance = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, ATTENDANCE_COLLECTION));
    const records = [];
    querySnapshot.forEach(doc => {
      records.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    return records;
  } catch (error) {
    console.error('Error fetching attendance:', error);
    return [];
  }
};

/**
 * Subscribe to real-time attendance updates
 * Automatically updates when any user marks attendance
 */
export const subscribeToAttendance = (callback) => {
  try {
    const unsubscribe = onSnapshot(
      collection(db, ATTENDANCE_COLLECTION),
      (querySnapshot) => {
        const records = [];
        querySnapshot.forEach(doc => {
          records.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        callback(records);
      },
      (error) => {
        console.error('Error subscribing to attendance:', error);
        callback([]);
      }
    );
    
    return unsubscribe;
  } catch (error) {
    console.error('Error setting up attendance subscription:', error);
    return () => {};
  }
};

/**
 * Save attendance with status for a specific date
 * Format: { cadetId, status } where status is P/A/R/M/C
 */
export const saveAttendanceWithStatus = async (date, statusRecords) => {
  try {
    const attendanceRef = doc(db, ATTENDANCE_COLLECTION, date);
    
    await setDoc(attendanceRef, {
      date,
      records: statusRecords,
      savedAt: new Date().toISOString(),
    }, { merge: true });
    
    return {
      date,
      records: statusRecords,
    };
  } catch (error) {
    console.error('Error saving attendance with status:', error);
    throw error;
  }
};

/**
 * Save attendance (old format for backward compatibility)
 * Format: array of cadet IDs marked present
 */
export const saveAttendance = async (date, presentCadetIds) => {
  try {
    const attendanceRef = doc(db, ATTENDANCE_COLLECTION, date);
    
    await setDoc(attendanceRef, {
      date,
      presentCadets: presentCadetIds,
      savedAt: new Date().toISOString(),
    }, { merge: true });
    
    return {
      date,
      presentCadets: presentCadetIds,
    };
  } catch (error) {
    console.error('Error saving attendance:', error);
    throw error;
  }
};

/**
 * Get attendance for a specific date
 */
export const getAttendanceForDate = async (date) => {
  try {
    const attendanceRef = doc(db, ATTENDANCE_COLLECTION, date);
    const docSnap = await getDoc(attendanceRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return { date, records: [], presentCadets: [] };
    }
  } catch (error) {
    console.error('Error fetching attendance for date:', error);
    return { date, records: [], presentCadets: [] };
  }
};

/**
 * Subscribe to real-time updates for a specific date
 */
export const subscribeToDateAttendance = (date, callback) => {
  try {
    const attendanceRef = doc(db, ATTENDANCE_COLLECTION, date);
    
    const unsubscribe = onSnapshot(attendanceRef, (docSnap) => {
      if (docSnap.exists()) {
        callback(docSnap.data());
      } else {
        callback({ date, records: [], presentCadets: [] });
      }
    }, (error) => {
      console.error('Error subscribing to date attendance:', error);
      callback({ date, records: [], presentCadets: [] });
    });
    
    return unsubscribe;
  } catch (error) {
    console.error('Error setting up date subscription:', error);
    return () => {};
  }
};

/**
 * Get attendance records for a date range
 */
export const getAttendanceByDateRange = async (startDate, endDate) => {
  try {
    const allAttendance = await getAllAttendance();
    return allAttendance.filter(a => a.date >= startDate && a.date <= endDate);
  } catch (error) {
    console.error('Error fetching attendance by date range:', error);
    return [];
  }
};

/**
 * Get status of a cadet on a specific date
 */
export const getCadetStatusOnDate = (cadetId, date, allAttendance) => {
  const dateRecord = allAttendance.find(a => a.date === date);
  if (!dateRecord) return 'A';

  // Handle new format (records with status)
  if (dateRecord.records) {
    const cadetRecord = dateRecord.records.find(r => r.cadetId === cadetId);
    return cadetRecord ? cadetRecord.status : 'A';
  }

  // Handle old format (presentCadets array)
  if (dateRecord.presentCadets) {
    return dateRecord.presentCadets.includes(cadetId) ? 'P' : 'A';
  }

  return 'A';
};

/**
 * Delete attendance for a specific date
 */
export const deleteAttendance = async (date) => {
  try {
    await deleteDoc(doc(db, ATTENDANCE_COLLECTION, date));
    return true;
  } catch (error) {
    console.error('Error deleting attendance:', error);
    throw error;
  }
};
