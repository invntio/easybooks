import { inHTMLData } from 'xss-filters';

/**
 * Cleans a string from XSS attacks.
 * @param {string} data - The string to be cleaned.
 * @returns string clean of XSS attacks
 */
export function xssCleanString(data: string) {
  return inHTMLData(data).trim();
}

/**
 * Cleans an object from XSS attacks.
 * @param {object} data - The object to be cleaned.
 * @returns object clean of XSS attacks
 */
export function xssCleanObject(data: object) {
  const stringifiedObject = JSON.stringify(data);
  const cleanedObject = inHTMLData(stringifiedObject).trim();
  return JSON.parse(cleanedObject);
}
