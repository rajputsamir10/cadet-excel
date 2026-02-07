/**
 * LocalStorage Helpers
 * Manages cadet data persistence
 */

const CADETS_KEY = 'cadets';
const SD_COUNTER_KEY = 'sdCounter';
const SW_COUNTER_KEY = 'swCounter';

// Get all cadets from LocalStorage
export const getCadets = () => {
  try {
    const data = localStorage.getItem(CADETS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading cadets:', error);
    return [];
  }
};

// Save cadets to LocalStorage
export const saveCadets = (cadets) => {
  try {
    localStorage.setItem(CADETS_KEY, JSON.stringify(cadets));
  } catch (error) {
    console.error('Error saving cadets:', error);
  }
};

// Add a new cadet
export const addCadet = (cadet) => {
  const cadets = getCadets();
  
  // Check for duplicate Regimental Number
  if (cadets.some(c => c.regimentalNumber === cadet.regimentalNumber)) {
    throw new Error(`Regimental Number ${cadet.regimentalNumber} already exists!`);
  }
  
  cadets.push(cadet);
  saveCadets(cadets);
  return cadets;
};

// Delete cadet by ID
export const deleteCadet = (uniqueId) => {
  const cadets = getCadets();
  const filtered = cadets.filter(c => c.uniqueId !== uniqueId);
  saveCadets(filtered);
  return filtered;
};

// Get counter value
export const getCounter = (type) => {
  const key = type === 'SD' ? SD_COUNTER_KEY : SW_COUNTER_KEY;
  const count = localStorage.getItem(key);
  return count ? parseInt(count, 10) : 0;
};

// Increment counter
export const incrementCounter = (type) => {
  const key = type === 'SD' ? SD_COUNTER_KEY : SW_COUNTER_KEY;
  const current = getCounter(type);
  const newCount = current + 1;
  localStorage.setItem(key, newCount.toString());
  return newCount;
};

// Reset all data (for testing)
export const resetAllData = () => {
  localStorage.removeItem(CADETS_KEY);
  localStorage.removeItem(SD_COUNTER_KEY);
  localStorage.removeItem(SW_COUNTER_KEY);
};
