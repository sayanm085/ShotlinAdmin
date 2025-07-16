import React from 'react';
import { Document, Page, Text, View, Image, StyleSheet, Font, pdf } from '@react-pdf/renderer';
import { Download } from 'lucide-react';
import robotoRegular from '../assets/fonts/Roboto-Regular.ttf';
import robotoBold from '../assets/fonts/Roboto-Bold.ttf';
import robotoLight from '../assets/fonts/Roboto-Light.ttf';
import robotoMedium from '../assets/fonts/Roboto-Medium.ttf';
import logo from '../assets/shotlinlogoforpdf.png'; // Use your logo
import signature from '../assets/sayansignature.png'; // Your signature image

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

// Premium color palette
const COLORS = {
  primary: '#8559DA',       // Purple accent color
  text: '#333333',          // Main text color
  secondaryText: '#666666', // Secondary text color
  light: '#FAFAFA',         // Light background
  border: '#E5E7EB',        // Border color
  success: '#4CAF50',       // Green for discounts
  tableHeader: '#8559DA',   // Table header background
  tableText: '#FFFFFF',     // Table header text
};

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Roboto',
    fontSize: 9,
    padding: 35,
    color: COLORS.text,
    backgroundColor: '#FFFFFF',
    lineHeight: 1.3,
  },
  
  // Header section
  headerTitle: {
    fontSize: 22,
    fontWeight: 500,
    color: COLORS.primary,
    marginBottom: 12,
  },
  headerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  headerCol: {
    width: '60%',
  },
  headerLogo: {
    width: '40%',
    alignItems: 'flex-end',
  },
  logo: {
    width: 250,          // INCREASED logo size
    height: 90,
    objectFit: 'contain',
    objectPosition: 'right',
  },
  infoRow: {
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    
  },
  infoLabel: {
    fontSize: 8,
    color: COLORS.secondaryText,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 9,
    marginLeft: 5,
    fontWeight: 'bold',
  },
  
  // Billing section
  billingSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  billingBox: {
    width: '48%',
    padding: 12,
    backgroundColor: COLORS.light,
    borderRadius: 4,
  },
  billingTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 8,
  },
  billingCompany: {
    fontSize: 9,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  billingAddress: {
    fontSize: 9,
    marginBottom: 8,
    lineHeight: 1.4,
  },
  billingDetail: {
    flexDirection: 'row',
    fontSize: 9,
    marginBottom: 2,
  },
  billingLabel: {
    width: 40,
    fontWeight: 'bold',
  },
  
  // Supply info
  supplyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  supplyItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  supplyLabel: {
    fontSize: 9,
    marginRight: 5,
  },
  supplyValue: {
    fontSize: 9,
    fontWeight: 'bold',
  },
  
  // Table styles
  table: {
    marginBottom: 15,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: COLORS.tableHeader,
    padding: 8,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  tableHeaderCell: {
    fontSize: 9,
    fontWeight: 'bold',
    color: COLORS.tableText,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    borderBottomStyle: 'solid',
    padding: 8,
  },
  tableRowEven: {
    backgroundColor: '#FFFFFF',
  },
  tableRowOdd: {
    backgroundColor: COLORS.light,
  },
  tableCell: {
    fontSize: 9,
  },
  // Column widths according to the requirement
  colNo: { width: '5%' },
  colDesc: { width: '28%' },
  colHSN: { width: '7%', textAlign: 'center' },
  colQty: { width: '5%', textAlign: 'center' },
  colTax: { width: '5%', textAlign: 'center' },
  colPrice: { width: '15%', textAlign: 'right' }, // Base Amount
  colGST: { width: '20%', textAlign: 'right' },   // IGST or CGST+SGST
  colTotal: { width: '15%', textAlign: 'right' }, // Total Amount
  
  // Bottom section
  bottomSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  paymentSection: {
    width: '45%',
  },
  totalsSection: {
    width: '45%',
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 8,
  },
  paymentDetail: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  paymentLabel: {
    width: '40%',
    fontSize: 9,
  },
  paymentValue: {
    fontSize: 9,
    width: '60%',
  },
  
  // Terms and notes
  termsSection: {
    marginTop: 25,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  termsTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 8,
  },
  termItem: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  termNumber: {
    width: 12,
    fontSize: 9,
  },
  termText: {
    flex: 1,
    fontSize: 9,
  },
  notesSection: {
    marginTop: 15,
    marginBottom: 20,
  },
  
  // Footer
  footer: {
    marginTop: 20,
    fontSize: 8,
    color: COLORS.secondaryText,
  },
  
  // Signature section - only signature on the right
  signatureSection: {
    flexDirection: 'row',
    justifyContent: 'flex-end', // Align to right side
    marginTop: 40,
    marginBottom: 30,
  },
  
  // Signature Block - Right Side
  signatureBlock: {
    width: '40%',
    alignItems: 'center',
  },
  signatureImage: {
    width: 150,
    height: 75,
    objectFit: 'contain',
    marginBottom: 5,
  },
  signatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    borderBottomStyle: 'solid',
    width: '100%',
    marginBottom: 5,
  },
  signatureText: {
    fontSize: 9,
    textAlign: 'center',
  },
  
  // Totals
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
    paddingBottom: 3,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    borderBottomStyle: 'solid',
  },
  totalLabel: {
    fontSize: 9,
  },
  totalValue: {
    fontSize: 9,
    textAlign: 'right',
  },
  discount: {
    color: COLORS.success,
  },
  grandTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontWeight: 'bold',
    fontSize: 10,
    marginTop: 5,
    paddingTop: 5,
    borderTopWidth: 2,
    borderTopColor: COLORS.primary,
    borderTopStyle: 'solid',
  },
  amountWords: {
    marginTop: 5,
    fontSize: 9,
    fontStyle: 'normal',
    marginBottom: 10,
  },
});

// Convert number to words function for Indian currency format
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

// Main PDF component
const InvoicePDF = ({ documentData }) => {
  // Extract invoice data
  const invoice = documentData.quotation || documentData;
  
  // Default values as specified
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
  } = invoice;

  // Format dates
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }).toUpperCase();
  };

  // Document type and dates
  const documentType = type === 'quotation' ? 'Quotation' : 'Invoice';
  const createdDate = formatDate(issueDate);
  const dueOrExpectedDate = formatDate(type === 'quotation' ? expectedDeliveryDate : dueDate);

  // Currency formatting with FIXED rupee symbol
  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return 'Rs. 0';
    
    // Using "Rs." instead of the Unicode rupee symbol to avoid rendering issues
    return `Rs. ${Number(amount).toLocaleString('en-IN')}`;
  };

  // Format address
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

  const clientAddress = client?.address ? formatAddress(client.address) : 
                        client?.fullAddress || '';

  // Default terms if none provided
  const defaultTerms = [
    'Please pay within 15 days from the date of invoice, overdue interest @ 14% will be charged on delayed payments.',
    'Please quote invoice number when remitting funds.'
  ];

  const displayTerms = termsAndConditions.length > 0 ? termsAndConditions : defaultTerms;
  
  // Determine tax structure (IGST vs CGST+SGST)
  const useIGST = summary?.gst?.igst && summary.gst.igst.amount > 0;
  
  // Calculate amount in words
  const amountInWords = summary?.amountInWords || convertToWords(summary?.total || 0);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header - Invoice Title and Info */}
        <Text style={styles.headerTitle}>{documentType}</Text>
        
        <View style={styles.headerInfo}>
          <View style={styles.headerCol}>
            <View style={styles.infoRow}>
              
              <Text style={styles.infoLabel}>{documentType}#</Text>
              <Text style={styles.infoValue}>{invoiceNumber}</Text>
             
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{documentType} Date</Text>
              <Text style={styles.infoValue}>{createdDate}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{type === 'quotation' ? 'Valid Until' : 'Due Date'}</Text>
              <Text style={styles.infoValue}>{dueOrExpectedDate}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Project</Text>
              <Text style={styles.infoValue}>{projectDetails?.name}</Text>
            </View>
          </View>
          
          <View style={styles.headerLogo}>
            <Image src={logo} style={styles.logo} />
          </View>
        </View>
        
        {/* Billing Information */}
        <View style={styles.billingSection}>
          {/* Billed By */}
          <View style={styles.billingBox}>
            <Text style={styles.billingTitle}>Billed by</Text>
            <Text style={styles.billingCompany}>{sellerDetails?.companyName || 'Foobar Labs'}</Text>
            <Text style={styles.billingAddress}>
              {sellerDetails?.address || 
                '46, Raghuveer Dham Society\nSurat, Gujarat, India - 395006'}
            </Text>
            
            <View style={styles.billingDetail}>
              <Text style={styles.billingLabel}>GSTIN</Text>
              <Text>{sellerDetails?.gstNumber || '29ABCED1234F2Z5'}</Text>
            </View>
            <View style={styles.billingDetail}>
              <Text style={styles.billingLabel}>PAN</Text>
              <Text>{sellerDetails?.panNumber || 'ABCED1234F'}</Text>
            </View>
          </View>
          
          {/* Billed To */}
          <View style={styles.billingBox}>
            <Text style={styles.billingTitle}>Billed to</Text>
            <Text style={styles.billingCompany}>{client?.name || 'Wox Studio'}</Text>
            <Text style={styles.billingAddress}>{clientAddress || '305, 3rd Floor Orion mall, Bengaluru,\nKarnataka, India - 560055'}</Text>
            
            <View style={styles.billingDetail}>
              <Text style={styles.billingLabel}>GSTIN</Text>
              <Text>{client?.gstin || '29VGCED1234K2Z6'}</Text>
            </View>
            <View style={styles.billingDetail}>
              <Text style={styles.billingLabel}>PAN</Text>
              <Text>{client?.panNumber || 'VGCED1234K'}</Text>
            </View>
          </View>
        </View>
        
        {/* Place and Country of Supply */}
        <View style={styles.supplyRow}>
          <View style={styles.supplyItem}>
            <Text style={styles.supplyLabel}>Place of Supply</Text>
            <Text style={styles.supplyValue}>{location?.placeOfSupply || 'Karnataka'}</Text>
          </View>
          
          <View style={styles.supplyItem}>
            <Text style={styles.supplyLabel}>Country of Supply</Text>
            <Text style={styles.supplyValue}>{location?.countryOfSupply || 'India'}</Text>
          </View>
        </View>
        
        {/* Items Table */}
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, styles.colNo]}>Item #</Text>
            <Text style={[styles.tableHeaderCell, styles.colDesc]}>Item description</Text>
            <Text style={[styles.tableHeaderCell, styles.colHSN]}>HSN</Text>
            <Text style={[styles.tableHeaderCell, styles.colQty]}>Qty.</Text>
            <Text style={[styles.tableHeaderCell, styles.colTax]}>GST</Text>
            <Text style={[styles.tableHeaderCell, styles.colPrice]}>Amount</Text>
            
            {useIGST ? (
              <Text style={[styles.tableHeaderCell, styles.colGST]}>IGST</Text>
            ) : (
              <Text style={[styles.tableHeaderCell, styles.colGST]}>CGST,SGST</Text>
            )}
            
            <Text style={[styles.tableHeaderCell, styles.colTotal]}>Total Amount</Text>
          </View>
          
          {/* Table Rows */}
          {(services || []).map((service, idx) => {
            const taxRate = service.taxRate || 18;
            const baseAmount = service.unitPrice * (service.quantity || 1);
            
            // Tax calculations based on structure
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
            
            // Calculate total amount including taxes
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
                  {idx + 1}.
                </Text>
                <Text style={[styles.tableCell, styles.colDesc]}>
                  {service.name}
                  {service.description ? `\n${service.description}` : ''}
                </Text>
                <Text style={[styles.tableCell, styles.colHSN]}>
                  {service.hsnSacCode || (idx % 2 === 0 ? '02' : '06')}
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
                    {formatCurrency(cgstAmount)}, {formatCurrency(sgstAmount)}
                  </Text>
                )}
                
                <Text style={[styles.tableCell, styles.colTotal]}>
                  {formatCurrency(totalAmount)}
                </Text>
              </View>
            );
          })}
        </View>
        
        {/* Bottom Section - Payment Details and Totals */}
        <View style={styles.bottomSection}>
          {/* Bank & Payment Details */}
          <View style={styles.paymentSection}>
            <Text style={styles.sectionTitle}>Bank & Payment Details</Text>
            
            <View style={styles.paymentDetail}>
              <Text style={styles.paymentLabel}>Account Holder Name</Text>
              <Text style={styles.paymentValue}>{sellerDetails?.companyName || 'Shotlin'}</Text>
            </View>
            <View style={styles.paymentDetail}>
              <Text style={styles.paymentLabel}>Account Number</Text>
              <Text style={styles.paymentValue}>{sellerDetails?.accountNumber || '45366287987'}</Text>
            </View>
            <View style={styles.paymentDetail}>
              <Text style={styles.paymentLabel}>IFSC</Text>
              <Text style={styles.paymentValue}>{sellerDetails?.ifsc || 'HDFC0018159'}</Text>
            </View>
            <View style={styles.paymentDetail}>
              <Text style={styles.paymentLabel}>Account Type</Text>
              <Text style={styles.paymentValue}>{sellerDetails?.accountType || 'Savings'}</Text>
            </View>
            <View style={styles.paymentDetail}>
              <Text style={styles.paymentLabel}>Bank</Text>
              <Text style={styles.paymentValue}>{sellerDetails?.bankName || 'HDFC Bank'}</Text>
            </View>
            <View style={styles.paymentDetail}>
              <Text style={styles.paymentLabel}>UPI</Text>
              <Text style={styles.paymentValue}>{sellerDetails?.upi || 'foobarlabs@okhdfc'}</Text>
            </View>
          </View>
          
          {/* Totals Section */}
          <View style={styles.totalsSection}>
            <Text style={styles.sectionTitle}>Price Summary</Text>
            
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Sub Total</Text>
              <Text style={styles.totalValue}>{formatCurrency(summary?.subtotal)}</Text>
            </View>
            
            {summary?.discount > 0 && (
              <View style={styles.totalRow}>
                <Text style={[styles.totalLabel, styles.discount]}>
                  Discount{summary.discountRate ? `(${summary.discountRate}%)` : ''}
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
              <Text>Total</Text>
              <Text>{formatCurrency(summary?.total)}</Text>
            </View>
            
            {/* Amount in words */}
            <View style={styles.amountWords}>
              <Text style={styles.totalLabel}>
                {documentType} Total (in words)
              </Text>
              <Text style={styles.totalValue}>
                {amountInWords}
              </Text>
            </View>
          </View>
        </View>
        
        {/* Only signature on right side */}
        <View style={styles.signatureSection}>
          <View style={styles.signatureBlock}>
            <Image src={signature} style={styles.signatureImage} />
            <View style={styles.signatureLine} />
            <Text style={styles.signatureText}>Authorized Signatory</Text>
          </View>
        </View>
        
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
        <View style={styles.notesSection}>
          <Text style={styles.termsTitle}>Additional Notes</Text>
          <Text style={styles.termText}>
            {notes || 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using Content here, content here.'}
          </Text>
        </View>
        
        {/* Footer */}
        <View style={styles.footer}>
          <Text>For any enquiries, email us on {sellerDetails?.email || 'foobarlabs@gmail.com'} or call us on {sellerDetails?.phone || '+91 98765 43210'}</Text>
        </View>
      </Page>
    </Document>
  );
};

// Main component for PDF export
const PDFExporter = ({ data, children }) => {
  // Get invoice data
  const documentData = data?.quotation ? data : data;
  const invoice = documentData?.quotation || documentData;
  
  // Generate filename
  const fileName = `${invoice?.invoiceNumber || 'QUO-202507-0001'}.pdf`;
  
  // Generate PDF blob
  const generatePdfBlob = async () => {
    const MyDocument = () => <InvoicePDF documentData={documentData} />;
    const blob = await pdf(<MyDocument />).toBlob();
    return blob;
  };

  // Direct download function
  const downloadPdf = async () => {
    try {
      const blob = await generatePdfBlob();
      const url = URL.createObjectURL(blob);
      
      // Create link and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };
  
  // Handle direct download
  const handleDirectDownload = async () => {
    await downloadPdf();
  };

  // If no children provided, return a default button
  if (!children) {
    return (
      <button
        onClick={handleDirectDownload}
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px', 
          padding: '8px 16px',
          backgroundColor: '#8559DA', // Purple from the design
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '500'
        }}
      >
        <Download size={16} />
        <span>Download PDF</span>
      </button>
    );
  }
  
  // If children are provided, wrap them with our download handler
  return React.cloneElement(children, {
    onClick: handleDirectDownload
  });
};

export default PDFExporter;