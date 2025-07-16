/**
 * Utility functions for invoice operations
 */

import { nanoid } from 'nanoid';

/**
 * Format currency in Indian Rupee format
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2
  }).format(amount);
};

/**
 * Create an empty service item with default values
 * @returns {Object} Empty service item
 */
export const createEmptyService = () => {
  return {
    id: nanoid(),
    name: '',
    description: '',
    quantity: 1,
    unitPrice: 0,
    hsnSacCode: '',
    amount: 0
  };
};

/**
 * Calculate invoice totals based on services, tax, and discount
 * @param {Array} services - Array of service items
 * @param {Object} tax - Tax configuration
 * @param {Object} discount - Discount configuration
 * @returns {Object} Calculated totals
 */
export const calculateTotals = (services, tax, discount) => {
  // Calculate subtotal
  const subtotal = services.reduce((sum, service) => {
    return sum + (service.unitPrice * service.quantity);
  }, 0);
  
  // Calculate discount amount
  let discountAmount = 0;
  if (discount.enabled && discount.value) {
    discountAmount = discount.type === 'percentage'
      ? (subtotal * discount.value / 100)
      : Math.min(discount.value, subtotal); // Can't discount more than subtotal
  }
  
  // Calculate tax amount
  let taxAmount = 0;
  if (tax.enabled && tax.rate) {
    taxAmount = (subtotal - discountAmount) * (tax.rate / 100);
  }
  
  // Calculate total
  const total = subtotal - discountAmount + taxAmount;
  
  return {
    subtotal,
    discountAmount,
    taxAmount,
    total
  };
};

/**
 * Convert number to words (Indian Rupees)
 * @param {number} amount - Amount to convert
 * @returns {string} Amount in words
 */
export const amountInWords = (amount) => {
  // This is a simplified version. In production, use a proper library
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
  
  const formattedAmount = formatter.format(amount)
    .replace('₹', '')
    .trim();
  
  return `${formattedAmount} Rupees Only`;
};