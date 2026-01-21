import React from 'react';
import { Document, Page, Text, View, Image, StyleSheet, Font, pdf } from '@react-pdf/renderer';
import { Download } from 'lucide-react';
import robotoRegular from '../assets/fonts/Roboto-Regular.ttf';
import robotoBold from '../assets/fonts/Roboto-Bold.ttf';
import robotoLight from '../assets/fonts/Roboto-Light.ttf';
import robotoMedium from '../assets/fonts/Roboto-Medium.ttf';
import montserratRegular from '../assets/fonts/Montserrat-Regular.ttf';
import montserratMedium from '../assets/fonts/Montserrat-Medium.ttf';
import montserratBold from '../assets/fonts/Montserrat-Bold.ttf';
import montserratLight from '../assets/fonts/Montserrat-Light.ttf';
import logo from '../assets/shotlinlogoforpdf.png';
import signature from '../assets/signature_stamp.png';
import watermark from '../assets/shotlinlogoforpdf.png'; // Add a subtle brand watermark image
import goldPattern from '../assets/shotlinlogoforpdf.png'; // Gold accent pattern

// Register fonts
Font.register({
  family: 'Roboto',
  fonts: [
    { src: robotoLight, fontWeight: 300 },
    { src: robotoRegular, fontWeight: 'normal' },
    { src: robotoMedium, fontWeight: 500 },
    { src: robotoBold, fontWeight: 'bold' }
  ],
});

Font.register({
  family: 'Montserrat',
  fonts: [
    { src: montserratLight, fontWeight: 300 },
    { src: montserratRegular, fontWeight: 'normal' },
    { src: montserratMedium, fontWeight: 500 },
    { src: montserratBold, fontWeight: 'bold' }
  ],
});

// Luxury premium color palette
const COLORS = {
  primary: '#8A6BC1',       // Rich purple
  primaryLight: '#F2EFFB',  // Very light purple
  primaryDark: '#5D4A85',   // Deep purple
  text: '#1A1A2E',          // Almost black
  secondaryText: '#4A4A68', // Deep gray with purple undertones
  light: '#FCFCFF',         // Off-white
  border: '#E2E2EC',        // Light border with purple hint
  success: '#1B806D',       // Deep teal green
  warning: '#C97D10',       // Deep amber
  info: '#3867D6',          // Royal blue
  accent: '#E6C84F',        // Gold accent
  gold: '#BF9B30',          // Darker gold
  goldGradient: 'linear-gradient(to right, #BF9B30, #DFBD69, #BF9B30)', // Gold gradient
  tableHeader: '#655098',   // Table header - slightly darker purple
  tableHeaderGradient: 'linear-gradient(to right, #655098, #8A6BC1)', // Header gradient
  tableText: '#FFFFFF',     // Table header text
  tableRowEven: '#FFFFFF',  // Even row
  tableRowOdd: '#F9F7FE',   // Odd row with slight purple tint
  shadow: 'rgba(26, 26, 46, 0.08)', // Shadow color
};

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Montserrat',
    fontSize: 9,
    padding: 40, // Increased padding
    color: COLORS.text,
    backgroundColor: '#FFFFFF',
    lineHeight: 1.4,
    position: 'relative', // For watermark positioning
  },
  
  // Watermark image
  watermark: {
    position: 'absolute',
    width: 500,
    height: 500,
    top: 150,
    left: '20%',
    opacity: 0.04,
    zIndex: -1,
  },
  
  // Page border with gold accent
  pageBorder: {
    position: 'absolute',
    top: 14,
    left: 14,
    right: 14,
    bottom: 14,
    borderWidth: 0.5,
    borderColor: COLORS.border,
    borderStyle: 'solid',
    borderRadius: 2,
    zIndex: -1,
  },
  
  // Gold corner accent
  cornerAccent: {
    position: 'absolute',
    width: 40,
    height: 40,
    opacity: 0.8,
    zIndex: -1,
  },
  topLeftCorner: {
    top: 10,
    left: 10,
  },
  topRightCorner: {
    top: 10,
    right: 10,
    transform: 'rotate(90deg)',
  },
  bottomLeftCorner: {
    bottom: 10,
    left: 10,
    transform: 'rotate(-90deg)',
  },
  bottomRightCorner: {
    bottom: 10,
    right: 10,
    transform: 'rotate(180deg)',
  },
  
  // Luxury header section
  headerWrapper: {
    position: 'relative',
    paddingBottom: 16,
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primaryLight,
    borderBottomStyle: 'solid',
  },
  documentType: {
    fontSize: 11,
    color: COLORS.gold,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 2,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    fontFamily: 'Montserrat',
    color: COLORS.primary,
    marginBottom: 14,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 10,
    color: COLORS.secondaryText,
    marginBottom: 10,
    fontWeight: 'medium',
    letterSpacing: 0.3,
  },
  headerInfo: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerCol: {
    width: '60%',
  },
  headerLogo: {
    width: '40%',
    alignItems: 'flex-end',
  },
  logo: {
    width: 220,
    height: 85,
    objectFit: 'contain',
    objectPosition: 'right',
  },
  infoRow: {
    marginBottom: 9,
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 9,
    color: COLORS.secondaryText,
    marginRight: 6,
    minWidth: 80,
  },
  infoValue: {
    fontSize: 10,
    fontWeight: 'medium',
    color: COLORS.text,
    letterSpacing: 0.2,
  },
  
  // Enhanced luxury billing section
  billingSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  billingBox: {
    width: '48%',
    padding: 16,
    backgroundColor: COLORS.light,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: COLORS.border,
    position: 'relative', // For the accent border
  },
  billingAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 3,
    height: '100%',
    backgroundColor: COLORS.primary,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
  },
  billingTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 10,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  billingCompany: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  billingAddress: {
    fontSize: 9,
    marginBottom: 10,
    lineHeight: 1.5,
    color: COLORS.secondaryText,
  },
  billingDetail: {
    flexDirection: 'row',
    fontSize: 9,
    marginBottom: 3,
  },
  billingLabel: {
    width: 45,
    fontWeight: 'bold',
    color: COLORS.secondaryText,
  },
  
  // Enhanced supply info
  supplyContainer: {
    backgroundColor: COLORS.primaryLight,
    padding: 14,
    borderRadius: 4,
    marginBottom: 24,
  },
  supplyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  supplyItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  supplyLabel: {
    fontSize: 9,
    marginRight: 6,
    color: COLORS.secondaryText,
  },
  supplyValue: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.primary,
    letterSpacing: 0.2,
  },
  
  // Premium table styles with shadow and rounded corners
  tableContainer: {
    marginBottom: 24,
    borderRadius: 4,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: COLORS.border,
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.05)',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: COLORS.tableHeader,
    padding: 10,
    alignItems: 'center',
  },
  tableHeaderCell: {
    fontSize: 9,
    fontWeight: 'bold',
    color: COLORS.tableText,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.border,
    borderBottomStyle: 'solid',
    padding: 10,
    minHeight: 40,
    alignItems: 'center',
  },
  tableRowEven: {
    backgroundColor: COLORS.tableRowEven,
  },
  tableRowOdd: {
    backgroundColor: COLORS.tableRowOdd,
  },
  tableCell: {
    fontSize: 9,
  },
  // Column widths with better spacing
  colNo: { width: '4%' },
  colDesc: { width: '26%' },
  colHSN: { width: '7%', textAlign: 'center' },
  colQty: { width: '5%', textAlign: 'center' },
  colTax: { width: '6%', textAlign: 'center' },
  colPrice: { width: '13%', textAlign: 'right' },
  colGST: { width: '24%', textAlign: 'right' }, // Increased width for tax columns
  colTotal: { width: '15%', textAlign: 'right' },
  
  // Premium bottom section
  bottomSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    marginBottom: 20,
  },
  paymentSection: {
    width: '46%',
    padding: 15,
    backgroundColor: COLORS.light,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: COLORS.border,
  },
  totalsSection: {
    width: '46%',
    padding: 15,
    backgroundColor: COLORS.light,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: COLORS.border,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.border,
    paddingBottom: 6,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  paymentDetail: {
    flexDirection: 'row',
    marginBottom: 7,
  },
  paymentLabel: {
    width: '40%',
    fontSize: 9,
    color: COLORS.secondaryText,
  },
  paymentValue: {
    fontSize: 9,
    width: '60%',
    fontWeight: 'medium',
    letterSpacing: 0.2,
  },
  
  // Elegant terms and notes
  termsSection: {
    marginTop: 30,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.primaryLight,
    borderTopStyle: 'solid',
  },
  termsTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  termItem: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  termNumber: {
    width: 18,
    fontSize: 9,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  termText: {
    flex: 1,
    fontSize: 9,
    color: COLORS.secondaryText,
    lineHeight: 1.5,
  },
  notesSection: {
    marginTop: 18,
    marginBottom: 24,
  },
  
  // Premium footer
  footer: {
    marginTop: 30,
    fontSize: 8,
    color: COLORS.secondaryText,
    borderTopWidth: 0.5,
    borderTopColor: COLORS.primaryLight,
    paddingTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  // Luxurious signature section
  signatureSection: {
    marginTop: 50,
    marginBottom: 30,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    position: 'relative',
    paddingRight: 15,
  },
  
  // Elegant signature block
  signatureBlock: {
    width: '45%',
    alignItems: 'center',
    position: 'relative',
  },
  signatureImage: {
    width: 200, // Larger signature
    height: 100,
    objectFit: 'contain',
    marginBottom: 5,
  },
  signatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primary,
    borderBottomStyle: 'solid',
    width: '100%',
    marginBottom: 6,
  },
  signatureText: {
    fontSize: 10,
    textAlign: 'center',
    fontWeight: 'medium',
    color: COLORS.primary,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  signatureCompany: {
    fontSize: 8,
    textAlign: 'center',
    color: COLORS.secondaryText,
    marginTop: 2,
  },
  signatureStamp: {
    position: 'absolute',
    top: -15,
    right: -15,
    width: 60,
    height: 60,
    transform: 'rotate(15deg)',
    opacity: 0.8,
  },
  
  // Luxury totals section
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 7,
    paddingBottom: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.border,
    borderBottomStyle: 'solid',
  },
  totalLabel: {
    fontSize: 9,
    color: COLORS.secondaryText,
  },
  totalValue: {
    fontSize: 9,
    textAlign: 'right',
    fontWeight: 'medium',
    letterSpacing: 0.2,
  },
  discount: {
    color: COLORS.success,
  },
  grandTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontWeight: 'bold',
    fontSize: 12,
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 2,
    borderTopColor: COLORS.gold,
    borderTopStyle: 'solid',
  },
  grandTotalText: {
    color: COLORS.primaryDark,
    letterSpacing: 0.5,
  },
  grandTotalValue: {
    color: COLORS.primaryDark,
    letterSpacing: 0.5,
  },
  amountWords: {
    marginTop: 10,
    fontSize: 9,
    padding: 10,
    backgroundColor: COLORS.primaryLight,
    borderRadius: 4,
    color: COLORS.primaryDark,
    fontWeight: 'medium',
    letterSpacing: 0.2,
    lineHeight: 1.5,
    // Removed italic style that was causing the font resolution error
  },
  
  // Premium info boxes
  infoBox: {
    marginTop: 14,
    marginBottom: 16,
    padding: 14,
    borderRadius: 4,
    position: 'relative',
  },
  discountInfoBox: {
    backgroundColor: 'rgba(27, 128, 109, 0.08)',
    borderWidth: 0.5,
    borderColor: 'rgba(27, 128, 109, 0.2)',
  },
  advanceInfoBox: {
    backgroundColor: 'rgba(56, 103, 214, 0.08)',
    borderWidth: 0.5,
    borderColor: 'rgba(56, 103, 214, 0.2)',
  },
  infoIcon: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 20,
    height: 20,
  },
  infoTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  discountInfoTitle: {
    color: COLORS.success,
  },
  advanceInfoTitle: {
    color: COLORS.info,
  },
  infoBoxRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
    fontSize: 9,
  },
  
  // Luxury badges
  badge: {
    position: 'absolute',
    top: 60,
    right: 20,
    padding: 8,
    paddingHorizontal: 16,
    fontSize: 9,
    fontWeight: 'bold',
    borderRadius: 4,
    transform: 'rotate(45deg)',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  advancePaymentBadge: {
    backgroundColor: COLORS.info,
    color: 'white',
  },
  finalPaymentBadge: {
    backgroundColor: COLORS.success,
    color: 'white',
  },
  
  // Payment history section
  paymentHistory: {
    marginTop: 16,
    marginBottom: 24,
  },
  paymentHistoryTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 10,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  paymentHistoryRow: {
    flexDirection: 'row',
    marginBottom: 4,
    fontSize: 8,
    color: COLORS.secondaryText,
  },
  paymentHistoryCell: {
    marginRight: 10,
  },
  
  // Notes highlight
  notesHighlight: {
    backgroundColor: 'rgba(191, 155, 48, 0.08)',
    padding: 14,
    borderRadius: 4,
    marginBottom: 16,
    borderWidth: 0.5,
    borderColor: 'rgba(191, 155, 48, 0.2)',
    position: 'relative',
  },
  notesHighlightText: {
    fontSize: 9,
    fontWeight: 'medium',
    color: COLORS.text,
    lineHeight: 1.5,
    // Removed italic style that was causing the font resolution error
  },
  
  // Additional reference sections
  referenceSection: {
    marginTop: 14,
    padding: 14,
    borderRadius: 4,
    backgroundColor: 'rgba(56, 103, 214, 0.08)',
    borderWidth: 0.5,
    borderColor: 'rgba(56, 103, 214, 0.2)',
  },
  referenceTitle: {
    fontWeight: 'bold',
    marginBottom: 6,
    fontSize: 10,
    color: COLORS.info,
    letterSpacing: 0.3,
  },
  referenceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
    fontSize: 9,
  },
  
  // Premium dividers
  divider: {
    height: 0.5,
    backgroundColor: COLORS.border,
    marginVertical: 20,
  },
  
  // Footer logo
  footerLogo: {
    width: 80,
    height: 20,
    objectFit: 'contain',
    opacity: 0.5,
  },
  
  // Gold accent elements
  goldAccent: {
    position: 'absolute',
    height: 3,
    backgroundColor: COLORS.gold,
    borderRadius: 1.5,
  },
  smallGoldAccent: {
    width: 30,
  },
  largeGoldAccent: {
    width: 60,
  },
  
  // Additional luxury touches
  goldDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.gold,
    marginRight: 5,
  },
  pageNumber: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    fontSize: 9,
    color: COLORS.secondaryText,
    fontWeight: 'medium',
  },
});

// Helper functions for formatting
const convertToWords = (amount) => {
  if (!amount) return '';
  
  const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  
  const sayNumber = (num) => {
    if (num < 10) return units[num];
    if (num < 20) return teens[num - 10];
    return tens[Math.floor(num / 10)] + (num % 10 ? '-' + units[num % 10] : '');
  };
  
  // Handling Indian number system (with lakhs and crores)
  const numStr = Math.round(amount).toString();
  let result = '';
  
  if (numStr.length > 7) { // Crores
    const crores = parseInt(numStr.substring(0, numStr.length - 7));
    if (crores > 0) {
      result += sayNumber(crores) + ' Crore ';
    }
  }
  
  if (numStr.length > 5) { // Lakhs
    const lakhs = parseInt(numStr.substring(Math.max(0, numStr.length - 7), numStr.length - 5));
    if (lakhs > 0) {
      result += sayNumber(lakhs) + ' Lakh ';
    }
  }
  
  if (numStr.length > 3) { // Thousands
    const thousands = parseInt(numStr.substring(Math.max(0, numStr.length - 5), numStr.length - 3));
    if (thousands > 0) {
      result += sayNumber(thousands) + ' Thousand ';
    }
  }
  
  if (numStr.length > 2) { // Hundreds
    const hundreds = parseInt(numStr.substring(Math.max(0, numStr.length - 3), numStr.length - 2));
    if (hundreds > 0) {
      result += sayNumber(hundreds) + ' Hundred ';
    }
  }
  
  // Tens and units
  const tensUnits = parseInt(numStr.substring(Math.max(0, numStr.length - 2)));
  if (tensUnits > 0) {
    if (result !== '') result += 'And ';
    result += sayNumber(tensUnits);
  }
  
  if (result === '') result = 'Zero';
  
  return result + ' Rupees Only';
};

const formatDateWithTime = (dateString) => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).toUpperCase();
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).toUpperCase();
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

// Using proper ₹ symbol for currency
const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return '₹0';
  return `₹${Number(amount).toLocaleString('en-IN')}`;
};

const formatAddress = (address) => {
  if (!address) return '';
  if (typeof address === 'string') return address;
  
  const { street, city, state, postalCode, country } = address;
  return [
    street,
    [city, state, postalCode].filter(Boolean).join(', '),
    country
  ].filter(Boolean).join('\n');
};

const formatPaymentMethod = (method) => {
  if (!method) return '';
  return method
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Main PDF component
const InvoicePDF = ({ documentData }) => {
  const invoice = documentData?.quotation || documentData?.invoice || documentData;
  const discountDetails = documentData?.discountDetails;
  
  // Default values
  const defaultValues = {
    invoiceNumber: 'QUO-202507-0001',
    issueDate: '2025-07-15',
    expectedDeliveryDate: '2025-08-14',
    projectName: 'TechNova Strategic Consulting'
  };
  
  const {
    invoiceNumber = defaultValues.invoiceNumber,
    type = 'quotation',
    issueDate = defaultValues.issueDate,
    dueDate,
    expectedDeliveryDate = defaultValues.expectedDeliveryDate,
    client,
    services,
    summary,
    location,
    sellerDetails,
    projectDetails = { name: defaultValues.projectName },
    termsAndConditions = [],
    notes,
    payment = {},
    paymentRelationship = {},
  } = invoice;

  // Determine document type and other variables
  const getDocumentTypeName = () => {
    switch (type) {
      case 'quotation': return 'Quotation';
      case 'advance': return 'Advance Payment Invoice';
      case 'final': return 'Final Invoice';
      default: return 'Invoice';
    }
  };
  
  const documentType = getDocumentTypeName();
  const createdDate = formatDate(issueDate);
  const dueOrExpectedDate = formatDate(type === 'quotation' ? expectedDeliveryDate : dueDate);
  const clientAddress = client?.address ? formatAddress(client.address) : client?.fullAddress || '';
  const displayTerms = termsAndConditions.length > 0 ? termsAndConditions : [
    'Please pay within 15 days from the date of invoice, overdue interest @ 14% will be charged on delayed payments.',
    'Please quote invoice number when remitting funds.'
  ];
  
  const useIGST = summary?.gst?.igst && summary.gst.igst.amount > 0;
  const amountInWords = summary?.amountInWords || convertToWords(summary?.total || 0);
  
  const isAdvanceInvoice = type === 'advance';
  const isFinalInvoice = type === 'final';
  const advancePaymentPercent = paymentRelationship?.advancePaymentPercent || 0;
  const originalQuotationAmount = paymentRelationship?.originalQuotationAmount || 0;
  
  const hasPaymentHistory = payment?.partialPayments && payment.partialPayments.length > 0;
  const paymentHistory = payment?.partialPayments || [];
  
  const advanceInvoices = paymentRelationship?.advanceInvoices || [];
  const hasAdvanceInvoices = advanceInvoices.length > 0;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Background elements */}
        <View style={styles.pageBorder} />
        <Image src={watermark} style={styles.watermark} />
        <Image src={goldPattern} style={[styles.cornerAccent, styles.topLeftCorner]} />
        <Image src={goldPattern} style={[styles.cornerAccent, styles.topRightCorner]} />
        <Image src={goldPattern} style={[styles.cornerAccent, styles.bottomLeftCorner]} />
        <Image src={goldPattern} style={[styles.cornerAccent, styles.bottomRightCorner]} />
        
        {/* Gold accent bars */}
        <View style={[styles.goldAccent, styles.smallGoldAccent, { top: 25, left: 40 }]} />
        <View style={[styles.goldAccent, styles.largeGoldAccent, { top: 25, right: 40 }]} />
        
        {/* Document Type Badge for Advance/Final */}
        {isAdvanceInvoice && (
          <View style={[styles.badge, styles.advancePaymentBadge]}>
            <Text>ADVANCE PAYMENT</Text>
          </View>
        )}
        {isFinalInvoice && (
          <View style={[styles.badge, styles.finalPaymentBadge]}>
            <Text>FINAL INVOICE</Text>
          </View>
        )}
        
        {/* Luxury Header Section */}
        <View style={styles.headerWrapper}>
          <Text style={styles.documentType}>{type.toUpperCase()}</Text>
          <Text style={styles.headerTitle}>{documentType}</Text>
          
          <View style={styles.headerInfo}>
            <View style={styles.headerCol}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Reference:</Text>
                <Text style={styles.infoValue}>{invoiceNumber}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Issue Date:</Text>
                <Text style={styles.infoValue}>{createdDate}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>{type === 'quotation' ? 'Valid Until:' : 'Due Date:'}</Text>
                <Text style={styles.infoValue}>{dueOrExpectedDate}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Project:</Text>
                <Text style={styles.infoValue}>{projectDetails?.name}</Text>
              </View>
              
              {isAdvanceInvoice && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Advance:</Text>
                  <Text style={styles.infoValue}>{advancePaymentPercent}% of Quote Value</Text>
                </View>
              )}
              
              {isFinalInvoice && paymentRelationship.paymentDescription && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Payment:</Text>
                  <Text style={styles.infoValue}>{paymentRelationship.paymentDescription}</Text>
                </View>
              )}
            </View>
            
            <View style={styles.headerLogo}>
              <Image src={logo} style={styles.logo} />
            </View>
          </View>
        </View>
        
        {/* Discount Info (if available) */}
        {discountDetails && (
          <View style={[styles.infoBox, styles.discountInfoBox]}>
            <Text style={[styles.infoTitle, styles.discountInfoTitle]}>Discount Applied</Text>
            <View style={styles.infoBoxRow}>
              <Text>Discount Code: <Text style={{ fontWeight: 'bold' }}>{discountDetails.code}</Text></Text>
              <Text>{discountDetails.name} ({discountDetails.type === 'percentage' ? `${discountDetails.value}%` : formatCurrency(discountDetails.value)})</Text>
            </View>
            <View style={styles.infoBoxRow}>
              <Text>Discount Amount:</Text>
              <Text style={{ color: COLORS.success, fontWeight: 'bold' }}>{formatCurrency(discountDetails.discountAmount)}</Text>
            </View>
          </View>
        )}
        
        {/* Advance Invoice Reference for Final Invoices */}
        {isFinalInvoice && hasAdvanceInvoices && (
          <View style={styles.referenceSection}>
            <Text style={styles.referenceTitle}>Previous Advance Payments</Text>
            {advanceInvoices.map((advance, idx) => (
              <View key={idx} style={styles.referenceRow}>
                <Text>Invoice: {advance.invoice}</Text>
                <Text>Date: {formatDate(advance.date)}</Text>
                <Text>Amount: {formatCurrency(advance.amount)}</Text>
                <Text>({advance.percent}%)</Text>
              </View>
            ))}
          </View>
        )}
        
        {/* Luxury Billing Information */}
        <View style={styles.billingSection}>
          {/* Billed By */}
          <View style={styles.billingBox}>
            <View style={styles.billingAccent} />
            <Text style={styles.billingTitle}>Billed by</Text>
            <Text style={styles.billingCompany}>{sellerDetails?.companyName || 'Shotlin'}</Text>
            <Text style={styles.billingAddress}>
              {sellerDetails?.address || 'Address Not Available'}
            </Text>
            
            {sellerDetails?.gstNumber && (
              <View style={styles.billingDetail}>
                <Text style={styles.billingLabel}>GSTIN</Text>
                <Text>{sellerDetails.gstNumber}</Text>
              </View>
            )}
            {sellerDetails?.panNumber && (
              <View style={styles.billingDetail}>
                <Text style={styles.billingLabel}>PAN</Text>
                <Text>{sellerDetails.panNumber}</Text>
              </View>
            )}
          </View>
          
          {/* Billed To */}
          <View style={styles.billingBox}>
            <View style={styles.billingAccent} />
            <Text style={styles.billingTitle}>Billed to</Text>
            <Text style={styles.billingCompany}>{client?.name || 'Client Name Not Available'}</Text>
            <Text style={styles.billingAddress}>{clientAddress || 'Address Not Available'}</Text>
            
            {client?.gstin && (
              <View style={styles.billingDetail}>
                <Text style={styles.billingLabel}>GSTIN</Text>
                <Text>{client.gstin}</Text>
              </View>
            )}
            {client?.panNumber && (
              <View style={styles.billingDetail}>
                <Text style={styles.billingLabel}>PAN</Text>
                <Text>{client.panNumber}</Text>
              </View>
            )}
          </View>
        </View>
        
        {/* Premium Supply Info */}
        <View style={styles.supplyContainer}>
          <View style={styles.supplyRow}>
            <View style={styles.supplyItem}>
              <View style={styles.goldDot} />
              <Text style={styles.supplyLabel}>Place of Supply:</Text>
              <Text style={styles.supplyValue}>{location?.placeOfSupply || 'Not Specified'}</Text>
            </View>
            
            <View style={styles.supplyItem}>
              <View style={styles.goldDot} />
              <Text style={styles.supplyLabel}>Country of Supply:</Text>
              <Text style={styles.supplyValue}>{location?.countryOfSupply || 'India'}</Text>
            </View>
          </View>
        </View>
        
        {/* Payment Status & History (if available) */}
        {hasPaymentHistory && (
          <View style={styles.paymentHistory}>
            <Text style={styles.paymentHistoryTitle}>Payment History</Text>
            <View style={styles.tableContainer}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderCell, { width: '20%' }]}>Date</Text>
                <Text style={[styles.tableHeaderCell, { width: '20%' }]}>Reference</Text>
                <Text style={[styles.tableHeaderCell, { width: '20%' }]}>Method</Text>
                <Text style={[styles.tableHeaderCell, { width: '20%', textAlign: 'right' }]}>Amount</Text>
                <Text style={[styles.tableHeaderCell, { width: '20%' }]}>Notes</Text>
              </View>
              {paymentHistory.map((payment, idx) => (
                <View key={idx} style={[
                  styles.tableRow,
                  idx % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd
                ]}>
                  <Text style={[styles.tableCell, { width: '20%' }]}>{formatDateWithTime(payment.date)}</Text>
                  <Text style={[styles.tableCell, { width: '20%' }]}>{payment.reference}</Text>
                  <Text style={[styles.tableCell, { width: '20%' }]}>
                    {formatPaymentMethod(payment.paymentMethod)}
                  </Text>
                  <Text style={[styles.tableCell, { width: '20%', textAlign: 'right' }]}>
                    {formatCurrency(payment.amount)}
                  </Text>
                  <Text style={[styles.tableCell, { width: '20%' }]}>{payment.notes || '-'}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
        
        {/* Luxury Items Table */}
        <View style={styles.tableContainer}>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, styles.colNo]}>#</Text>
            <Text style={[styles.tableHeaderCell, styles.colDesc]}>Description</Text>
            <Text style={[styles.tableHeaderCell, styles.colHSN]}>HSN</Text>
            <Text style={[styles.tableHeaderCell, styles.colQty]}>Qty</Text>
            <Text style={[styles.tableHeaderCell, styles.colTax]}>GST%</Text>
            <Text style={[styles.tableHeaderCell, styles.colPrice]}>Amount</Text>
            
            {useIGST ? (
              <Text style={[styles.tableHeaderCell, styles.colGST]}>IGST</Text>
            ) : (
              <Text style={[styles.tableHeaderCell, styles.colGST]}>CGST | SGST</Text>
            )}
            
            <Text style={[styles.tableHeaderCell, styles.colTotal]}>Total</Text>
          </View>
          
          {/* Table Rows */}
          {(services || []).map((service, idx) => {
            const taxRate = service.taxRate || 18;
            const baseAmount = service.amount || (service.unitPrice * (service.quantity || 1));
            
            let igstAmount = 0;
            let cgstAmount = 0;
            let sgstAmount = 0;
            
            if (useIGST) {
              igstAmount = baseAmount * taxRate / 100;
            } else {
              const halfRate = taxRate / 2;
              cgstAmount = baseAmount * halfRate / 100;
              sgstAmount = baseAmount * halfRate / 100;
            }
            
            const totalAmount = baseAmount + (useIGST ? igstAmount : (cgstAmount + sgstAmount));
            
            return (
              <View 
                key={idx} 
                style={[
                  styles.tableRow,
                  idx % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd
                ]}
              >
                <Text style={[styles.tableCell, styles.colNo]}>
                  {idx + 1}
                </Text>
                <Text style={[styles.tableCell, styles.colDesc]}>
                  <Text style={{ fontWeight: 'bold' }}>{service.name}</Text>
                  {service.description ? `\n${service.description}` : ''}
                </Text>
                <Text style={[styles.tableCell, styles.colHSN]}>
                  {service.hsnSacCode || '-'}
                </Text>
                <Text style={[styles.tableCell, styles.colQty]}>
                  {service.quantity || 1}
                </Text>
                <Text style={[styles.tableCell, styles.colTax]}>
                  {taxRate}%
                </Text>
                <Text style={[styles.tableCell, styles.colPrice]}>
                  {formatCurrency(baseAmount)}
                </Text>
                
                {useIGST ? (
                  <Text style={[styles.tableCell, styles.colGST]}>
                    {formatCurrency(igstAmount)}
                  </Text>
                ) : (
                  <Text style={[styles.tableCell, styles.colGST]}>
                    {formatCurrency(cgstAmount)} | {formatCurrency(sgstAmount)}
                  </Text>
                )}
                
                <Text style={[styles.tableCell, styles.colTotal]}>
                  {formatCurrency(totalAmount)}
                </Text>
              </View>
            );
          })}
        </View>
        
        {/* Notes Section (with highlight if provided) */}
        {notes && (
          <View style={styles.notesHighlight}>
            <Text style={styles.notesHighlightText}>{notes}</Text>
          </View>
        )}
        
        {/* Luxury Bottom Section */}
        <View style={styles.bottomSection}>
          {/* Bank & Payment Details */}
          <View style={styles.paymentSection}>
            <Text style={styles.sectionTitle}>Bank & Payment Details</Text>
            
            <View style={styles.paymentDetail}>
              <Text style={styles.paymentLabel}>Account Holder</Text>
              <Text style={styles.paymentValue}>{sellerDetails?.companyName || 'Shotlin'}</Text>
            </View>
            <View style={styles.paymentDetail}>
              <Text style={styles.paymentLabel}>Account Number</Text>
              <Text style={styles.paymentValue}>{sellerDetails?.accountNumber || '29680200000800'}</Text>
            </View>
            <View style={styles.paymentDetail}>
              <Text style={styles.paymentLabel}>IFSC</Text>
              <Text style={styles.paymentValue}>{sellerDetails?.ifsc || 'BARB0HABRAX'}</Text>
            </View>
            <View style={styles.paymentDetail}>
              <Text style={styles.paymentLabel}>Account Type</Text>
              <Text style={styles.paymentValue}>{sellerDetails?.accountType || 'Current Account'}</Text>
            </View>
            <View style={styles.paymentDetail}>
              <Text style={styles.paymentLabel}>Bank</Text>
              <Text style={styles.paymentValue}>{sellerDetails?.bankName || 'Bank of Baroda'}</Text>
            </View>
            <View style={styles.paymentDetail}>
              <Text style={styles.paymentLabel}>UPI</Text>
              <Text style={styles.paymentValue}>{sellerDetails?.upi || 'shotlin@axl'}</Text>
            </View>
            
            {/* Payment Status */}
            {payment && payment.status && (
              <View style={[styles.paymentDetail, { marginTop: 10, marginBottom: 0 }]}>
                <Text style={[styles.paymentLabel, { fontWeight: 'bold' }]}>Payment Status</Text>
                <Text style={[
                  styles.paymentValue, 
                  { 
                    fontWeight: 'bold', 
                    color: payment.status === 'completed' ? COLORS.success : 
                           payment.status === 'pending' ? COLORS.warning : COLORS.text
                  }
                ]}>
                  {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                </Text>
              </View>
            )}
            
            {/* Remaining/Paid Amount */}
            {payment && (
              <>
                {typeof payment.totalPaid !== 'undefined' && (
                  <View style={styles.paymentDetail}>
                    <Text style={styles.paymentLabel}>Amount Paid</Text>
                    <Text style={[styles.paymentValue, { color: COLORS.success, fontWeight: 'bold' }]}>
                      {formatCurrency(payment.totalPaid)}
                    </Text>
                  </View>
                )}
                {typeof payment.remainingAmount !== 'undefined' && (
                  <View style={styles.paymentDetail}>
                    <Text style={styles.paymentLabel}>Remaining</Text>
                    <Text style={[styles.paymentValue, { 
                      fontWeight: 'bold',
                      color: payment.remainingAmount > 0 ? COLORS.warning : COLORS.success 
                    }]}>
                      {formatCurrency(payment.remainingAmount)}
                    </Text>
                  </View>
                )}
              </>
            )}
          </View>
          
          {/* Premium Totals Section */}
          <View style={styles.totalsSection}>
            <Text style={styles.sectionTitle}>Price Summary</Text>
            
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal</Text>
              <Text style={styles.totalValue}>{formatCurrency(summary?.subtotal)}</Text>
            </View>
            
            {summary?.discount > 0 && (
              <View style={styles.totalRow}>
                <Text style={[styles.totalLabel, styles.discount]}>
                  Discount{summary.discountRate ? ` (${summary.discountRate}%)` : ''}
                </Text>
                <Text style={[styles.totalValue, styles.discount]}>- {formatCurrency(summary.discount)}</Text>
              </View>
            )}
            
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Taxable Amount</Text>
              <Text style={styles.totalValue}>
                {formatCurrency(summary?.subtotal - (summary?.discount || 0))}
              </Text>
            </View>
            
            {/* Tax amounts based on structure */}
            {useIGST ? (
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>
                  IGST ({summary?.gst?.igst?.rate || 18}%)
                </Text>
                <Text style={styles.totalValue}>
                  {formatCurrency(summary?.gst?.igst?.amount)}
                </Text>
              </View>
            ) : (
              <>
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>
                    CGST ({summary?.gst?.cgst?.rate || 9}%)
                  </Text>
                  <Text style={styles.totalValue}>
                    {formatCurrency(summary?.gst?.cgst?.amount)}
                  </Text>
                </View>
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>
                    SGST ({summary?.gst?.sgst?.rate || 9}%)
                  </Text>
                  <Text style={styles.totalValue}>
                    {formatCurrency(summary?.gst?.sgst?.amount)}
                  </Text>
                </View>
              </>
            )}
            
            {/* Grand Total */}
            <View style={styles.grandTotal}>
              <Text style={styles.grandTotalText}>Total</Text>
              <Text style={styles.grandTotalValue}>{formatCurrency(summary?.total)}</Text>
            </View>
            
            {/* Amount in words */}
            <View style={styles.amountWords}>
              <Text>
                {amountInWords}
              </Text>
            </View>
            
            {/* Original quotation amount for Advance invoices */}
            {isAdvanceInvoice && originalQuotationAmount > 0 && (
              <View style={[styles.infoBox, styles.advanceInfoBox, {marginTop: 10, marginBottom: 0}]}>
                <Text style={[styles.infoTitle, styles.advanceInfoTitle]}>Quotation Reference</Text>
                <View style={styles.infoBoxRow}>
                  <Text>Original Quote:</Text>
                  <Text style={{fontWeight: 'bold'}}>{formatCurrency(originalQuotationAmount)}</Text>
                </View>
                <View style={styles.infoBoxRow}>
                  <Text>Advance ({advancePaymentPercent}%):</Text>
                  <Text style={{fontWeight: 'bold', color: COLORS.info}}>{formatCurrency(summary?.total)}</Text>
                </View>
              </View>
            )}
          </View>
        </View>
        
        {/* Luxury Signature section */}
        <View style={styles.signatureSection}>
          <View style={styles.signatureBlock}>
            <Image src={signature} style={styles.signatureImage} />
            <View style={styles.signatureLine} />
            <Text style={styles.signatureText}>Authorized Signatory</Text>
            <Text style={styles.signatureCompany}>{sellerDetails?.companyName || 'Shotlin'}</Text>
          </View>
        </View>
        
        {/* Divider */}
        <View style={styles.divider} />
        
        {/* Terms and Conditions */}
        <View style={styles.termsSection}>
          <Text style={styles.termsTitle}>Terms and Conditions</Text>
          
          {displayTerms.map((term, idx) => (
            <View key={idx} style={styles.termItem}>
              <Text style={styles.termNumber}>{idx + 1}.</Text>
              <Text style={styles.termText}>{term}</Text>
            </View>
          ))}
        </View>
        
        {/* Additional Notes */}
        {!notes && (
          <View style={styles.notesSection}>
            <Text style={styles.termsTitle}>Additional Notes</Text>
            <Text style={styles.termText}>
              Thank you for your business. We appreciate your prompt payment and continued support.
            </Text>
          </View>
        )}
        
        {/* Luxury Footer */}
        <View style={styles.footer}>
          <Text>Generated on {new Date().toLocaleDateString('en-IN', {day: '2-digit', month: 'long', year: 'numeric'})}</Text>
          <Text>For enquiries: {sellerDetails?.email || 'contact@shotlin.com'} | {sellerDetails?.phone || '+91 9876543210'}</Text>
        </View>
        
        {/* Page number */}
        <Text style={styles.pageNumber}>Page 1 of 1</Text>
      </Page>
    </Document>
  );
};

// Main component for PDF export
const PDFExporter = ({ data, children }) => {
  const documentData = data || {};
  const invoice = documentData?.quotation || documentData?.invoice || documentData;
  const fileName = `${invoice?.invoiceNumber || 'Invoice'}.pdf`;
  
  const generatePdfBlob = async () => {
    const MyDocument = () => <InvoicePDF documentData={documentData} />;
    const blob = await pdf(<MyDocument />).toBlob();
    return blob;
  };

  const downloadPdf = async () => {
    try {
      const blob = await generatePdfBlob();
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };
  
  const handleDirectDownload = async () => {
    await downloadPdf();
  };

  if (!children) {
    return (
      <button
        onClick={handleDirectDownload}
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px', 
          padding: '12px 20px',
          background: 'linear-gradient(to right, #8A6BC1, #9575CD)',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '500',
          boxShadow: '0 3px 10px rgba(138, 107, 193, 0.3)'
        }}
      >
        <Download size={16} />
        <span>Download PDF</span>
      </button>
    );
  }
  
  return React.cloneElement(children, {
    onClick: handleDirectDownload
  });
};

export default PDFExporter;