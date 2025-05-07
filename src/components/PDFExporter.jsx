import React from 'react';
import { PDFDownloadLink, Document, Page, Text, View, Image, StyleSheet, Font } from '@react-pdf/renderer';
import { Download } from 'lucide-react';
import robotoRegular from '../assets/fonts/Roboto-Regular.ttf';
import robotoBold from '../assets/fonts/Roboto-SemiBold.ttf';
import logo from '../assets/logo.png'; // Adjust the path to your logo

// Register custom fonts (regular and bold)
Font.register({
  family: 'Roboto',
  fonts: [
    { src: robotoRegular, fontWeight: 'normal' },
    { src: robotoBold,    fontWeight: 'bold'   }
  ],
});

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Roboto',
    fontSize: 10,
    padding: 30,
    color: '#1A1A1A',
  },
  label: { fontFamily: 'Roboto', fontSize: 11, color: '#6B7280', marginBottom: 2, marginLeft: 4 },
  text: { fontFamily: 'Roboto', fontSize: 10, color: '#374151', marginBottom: 4 },
  textBold: { fontFamily: 'Roboto', fontSize: 10, color: '#374151', marginBottom: 4, fontWeight: 'bold' },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  heading: {
    fontFamily: 'Roboto',
    fontSize: 20,
    color: '#6A0DAD',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  bold: {
    fontFamily: 'Roboto',
    fontWeight: 'bold',
  },
  addressBox: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#F4F7FA',
    width: '47%',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#7E22CE',
    color: 'white',
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    padding: 6,
  },
  tableRow: {
    flexDirection: 'row',
    padding: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    borderBottomStyle: 'solid',
  },
  col: (width) => ({ width, paddingHorizontal: 4 }),
  rightText: { textAlign: 'right' },
  totals: { marginTop: 10, alignItems: 'flex-end' },
  notes: { marginTop: 10, fontFamily: 'Roboto', fontSize: 9, lineHeight: 1.4 },
  contact: { marginTop: 20, fontSize: 9, fontFamily: 'Roboto' },
  signature: { marginTop: 40, alignItems: 'flex-end' },
  green: { color: 'green' },
  purple: { color: '#6A0DAD' },
});

const QuotePDF = ({ quote }) => {
  const {
    id,
    created,
    expectedDate,
    projectName,
    clientName,
    clientAddress,
    currency,
    includeGST,
    gst,
    items,
    subtotal,
    discountPercent,
    discountAmount,
    total,
    totalInWords,
  } = quote;

  // Split client address into lines
  const clientAddressLines = clientAddress
    ? clientAddress.split(',').map((line) => line.trim())
    : [];

  const createdDate = new Date(created).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  const expDate = expectedDate
    ? new Date(expectedDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
    : '';
  const currencySymbol = currency === 'INR' ? '₹' : '$';

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.row}>
          <Text style={styles.heading}>Quotation</Text>
          <Image src={logo} style={{ width: 60, height: 60 }} />
        </View>

        {/* Quotation Info */}
        <View style={[styles.row, { marginBottom: 8 }]}>  
          <View>
            <Text style={styles.text}><Text style={styles.label}>Quotation#:</Text> <Text style={styles.textBold}>{id}</Text></Text>
            <Text style={styles.text}><Text style={styles.label}>Created Date:</Text> <Text style={styles.textBold}>{createdDate}</Text></Text>
            {expDate && <Text style={styles.text}><Text style={styles.label}>Expected Date:</Text> <Text style={styles.textBold}>{expDate}</Text></Text>}
            <Text style={styles.text}><Text style={styles.label}>Project Name:</Text> <Text style={styles.textBold}>{projectName}</Text></Text>
          </View>
        </View>

        {/* From / To Address */}
        <View style={styles.row}>
          {/* Quotation By */}
          <View style={styles.addressBox}>
            <Text style={{marginBottom: 2}} ><Text style={styles.label}>Quotation by: </Text> <Text style={styles.textBold}>Shotlin</Text></Text>
            
            
            <Text style={{marginBottom: 2}} ><Text style={styles.label}>Address: </Text >
              {['379/N, BANIPUR PALPARA WARD 13', 'BANIPUR PALPARA', 'S.N. DEY ROAD', 'North 24 Parganas, West Bengal 743287, India'].map((line, idx) => (
                <Text key={idx} style={styles.textBold}>{line}</Text>
              ))} </Text>

            <Text style={{marginBottom: 2}}><Text style={styles.label}>GST: </Text> <Text style={styles.textBold}>AAHATPM4170HDC</Text></Text>

          </View>

          {/* Quotation To */}
          <View style={styles.addressBox}>
            <Text style={{marginBottom: 2}}><Text style={styles.label}>Quotation to : </Text> <Text style={styles.textBold}>{clientName}</Text></Text>



            <Text style={{marginBottom: 2}}><Text style={styles.label}>Address : </Text>
              {clientAddressLines.map((line, idx) => (
                <Text key={idx} style={styles.textBold}>{line}</Text>
              ))}</Text>

            <Text style={{marginBottom: 2}}><Text style={styles.label}>PAN:</Text> <Text style={styles.textBold}>{'DSADDSA11'}</Text></Text>

          </View>
        </View>

        {/* Supply Info */}
        <View style={[styles.row, { marginTop: 4 }]}>  
          <View style={{ width: '47%', alignItems: 'center' }}>
            <Text style={styles.text}><Text style={styles.label}>Place of Supply:</Text> <Text style={styles.textBold}>HABRA</Text></Text>
          </View>
          <View style={{ width: '47%', alignItems: 'center' }}>
            <Text style={styles.text}><Text style={styles.label}>Country of Supply:</Text> <Text style={styles.textBold}>INDIA</Text></Text>
          </View>
        </View>

        {/* Items Table */}
        <View style={{ marginTop: 10 }}>
          <View style={styles.tableHeader}>
            <Text style={styles.col('50%')}>Service # / Services</Text>
            <Text style={[styles.col('50%'), styles.rightText]}>Amount</Text>
          </View>
          {items.map((item, idx) => (
            <View style={styles.tableRow} key={idx}>
              <Text style={styles.col('50%')}><Text style={styles.textBold}>{idx + 1}.</Text> {item.service}</Text>
              <Text style={[styles.col('50%'), styles.rightText]}>{currencySymbol}{parseFloat(item.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}</Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totals}>
          <Text style={styles.text}>Sub Total: {currencySymbol}{subtotal.toLocaleString()}</Text>
          {includeGST && <Text style={styles.text}>GST: {currencySymbol}{gst.toLocaleString()}</Text>}
          {typeof discountPercent !== 'undefined' && <Text style={styles.green}>Discount ({discountPercent}%): -{currencySymbol}{discountAmount.toLocaleString()}</Text>}
          <Text style={[styles.textBold, { marginTop: 4 }]}>Total: {currencySymbol}{total.toLocaleString()}</Text>
          {totalInWords && <>
            <Text style={[styles.text, { fontSize: 9, marginTop: 2 }]}>Invoice Total (in words)</Text>
            <Text style={styles.text}>{totalInWords}</Text>
          </>}
        </View>

        {/* Terms & Notes */}
        <View style={styles.notes}>
          <Text style={[styles.textBold, { fontSize: 13, marginBottom: 10 }]}>Terms and Conditions</Text>
          <Text style={styles.text}>1. We guarantee that the website will function as per the agreed-upon specifications. Any defects found within 60 days of project completion will be fixed at no additional cost.</Text>
          <Text style={styles.text}>2. The above rates are valid for 30 days from the date of this quotation</Text>
          <Text style={styles.text}>3. The estimated completion timeline for the project is 8-12 weeks/2 months from the official start date. Delays due to client feedback, additional feature requests, or unforeseen issues may extend this timeframe. </Text>
          <Text style={[styles.textBold, styles.purple, { fontSize: 13, marginTop: 8, marginBottom: 10 }]}>Additional Notes</Text>
          <Text style={styles.text}>pon full payment, all intellectual property rights for the project will be transferred to the client.</Text>
        </View>

        {/* Contact Info */}
        <View style={styles.contact}>
          <Text style={styles.text}>For any enquiries, email us on <Text style={styles.textBold}>support@shotlin.in</Text> or call us on <Text style={styles.textBold}>+919382214304</Text></Text>
        </View>

        {/* Signature */}
        <View style={styles.signature}>
          <Text style={styles.textBold}>Authorized Signature</Text>
          <Text style={[styles.textBold, styles.purple]}>For Shotlin</Text>
          <Text style={[styles.textBold, styles.purple]}>Authorized Signatory</Text>
        </View>
      </Page>
    </Document>
  );
};

export default function PDFExporter({ quote, children }) {
  return (
    <PDFDownloadLink
      document={<QuotePDF quote={quote} />}
      fileName={`quotation_${quote.id}.pdf`}
      style={{ textDecoration: 'none' }}
    >
      {({ loading }) =>children || <button disabled={loading}><Download /></button>}
    </PDFDownloadLink>
  );
}
