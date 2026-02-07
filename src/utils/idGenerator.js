/**
 * Unique ID Generator
 * Generates SD/SW IDs based on gender and regimental number
 */

import {
  getCounter,
  incrementCounter,
} from './localStorageHelpers';

/**
 * Determine ID type (SD or SW) based on gender and regimental number
 * @param {string} gender - Male or Female
 * @param {string} regimentalNumber - Regimental Number
 * @returns {string} 'SD' or 'SW'
 */
export const determineIdType = (gender, regimentalNumber) => {
  // Check if regimental number contains SD or SW
  if (regimentalNumber.toUpperCase().includes('SD')) {
    return 'SD';
  }
  if (regimentalNumber.toUpperCase().includes('SW')) {
    return 'SW';
  }

  // Default to gender-based assignment
  return gender === 'Female' ? 'SW' : 'SD';
};

/**
 * Generate unique ID (SD1, SD2, SW1, SW2, etc.)
 * @param {string} gender - Male or Female
 * @param {string} regimentalNumber - Regimental Number
 * @returns {string} Unique ID like SD1, SW2, etc.
 */
export const generateUniqueId = (gender, regimentalNumber) => {
  const idType = determineIdType(gender, regimentalNumber);
  const counter = incrementCounter(idType);
  return `${idType}${counter}`;
};
