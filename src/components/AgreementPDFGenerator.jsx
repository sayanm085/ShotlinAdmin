import React from 'react';
import { Document, Page, Text, View, Image, StyleSheet, Font, pdf } from '@react-pdf/renderer';
import { Download } from 'lucide-react';
import montserratRegular from '../assets/fonts/Montserrat-Regular.ttf';
import montserratBold from '../assets/fonts/Montserrat-Bold.ttf';
import montserratLight from '../assets/fonts/Montserrat-Light.ttf';
import montserratMedium from '../assets/fonts/Montserrat-Medium.ttf';
import logo from '../assets/shotlinlogoforpdf.png';
import signature from '../assets/signature_stamp.png';
import watermark from '../assets/shotlinlogoforpdf.png';  // Subtle watermark

// Register fonts
Font.register({
  family: 'Montserrat',
  fonts: [
    { src: montserratLight, fontWeight: 300 },
    { src: montserratRegular, fontWeight: 'normal' },
    { src: montserratMedium, fontWeight: 500 },
    { src: montserratBold, fontWeight: 'bold' }
  ],
});

// Premium color palette
const COLORS = {
  primary: '#7E57C2',       // Rich purple
  secondary: '#5E35B1',     // Deep purple
  text: '#2A2A35',          // Dark gray with hint of purple
  lightText: '#696984',     // Medium gray
  border: '#E0E0EA',        // Light border
  background: '#FFFFFF',    // White background
  accent: '#FFD54F',        // Gold accent
  lightPurple: '#F3EFFB',   // Light purple background
};

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Montserrat',
    fontSize: 9,
    padding: 40,
    color: COLORS.text,
    backgroundColor: COLORS.background,
    lineHeight: 1.5,
    position: 'relative',
  },
  
  watermark: {
    position: 'absolute',
    width: 500,
    height: 500,
    top: 250,
    left: '20%',
    opacity: 0.03,
    zIndex: -1,
  },
  
  pageBorder: {
    position: 'absolute',
    top: 15,
    left: 15,
    right: 15,
    bottom: 15,
    borderWidth: 0.5,
    borderColor: COLORS.border,
    borderStyle: 'solid',
    zIndex: -1,
  },
  
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.border,
    paddingBottom: 15,
  },
  
  headerLeft: {
    width: '60%',
  },
  
  headerRight: {
    width: '40%',
    alignItems: 'flex-end',
  },
  
  logo: {
    width: 150,
    height: 60,
    objectFit: 'contain',
  },
  
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 5,
  },
  
  subtitle: {
    fontSize: 11,
    color: COLORS.secondary,
    marginBottom: 10,
    fontWeight: 'medium',
  },
  
  agreementParties: {
    marginBottom: 20,
  },
  
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 8,
    marginTop: 12,
  },
  
  partiesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 15,
  },
  
  partyBox: {
    width: '48%',
    padding: 10,
    backgroundColor: COLORS.lightPurple,
    borderRadius: 3,
  },
  
  partyTitle: {
    fontSize: 10,
    fontWeight: 'medium',
    marginBottom: 5,
    color: COLORS.secondary,
  },
  
  partyText: {
    fontSize: 9,
    marginBottom: 2,
  },
  
  section: {
    marginBottom: 8,
  },
  
  sectionHeading: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  
  paragraph: {
    fontSize: 9,
    marginBottom: 4,
    textAlign: 'justify',
  },
  
  bulletPoint: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  
  bullet: {
    width: 10,
    fontSize: 9,
  },
  
  bulletText: {
    flex: 1,
    fontSize: 9,
  },
  
  numbered: {
    flexDirection: 'row',
    marginBottom: 8,
    breakInside: 'avoid',
  },
  
  number: {
    width: 18,
    fontSize: 9,
    fontWeight: 'bold',
    marginRight: 2,
  },
  
  numberedContent: {
    flex: 1,
    fontSize: 9,
  },
  
  subSection: {
    marginLeft: 15,
    marginTop: 4,
    marginBottom: 4,
  },
  
  subBullet: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  
  dash: {
    width: 10,
    fontSize: 9,
  },
  
  dashText: {
    flex: 1,
    fontSize: 9,
  },
  
  signatureSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  
  signatureBox: {
    width: '45%',
  },
  
  signatureLine: {
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.border,
    marginTop: 40,
    marginBottom: 5,
  },
  
  signatureName: {
    fontSize: 9,
    fontWeight: 'medium',
  },
  
  signatureTitle: {
    fontSize: 8,
    color: COLORS.lightText,
  },
  
  signatureImage: {
    width: 120,
    height: 60,
    objectFit: 'contain',
    marginBottom: -30,
  },
  
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    fontSize: 8,
    color: COLORS.lightText,
    borderTopWidth: 0.5,
    borderTopColor: COLORS.border,
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  
  pageNumber: {
    position: 'absolute',
    bottom: 20,
    right: 30,
    fontSize: 8,
    color: COLORS.lightText,
  },
});

// Main PDF component
const AgreementDocument = ({ agreementData }) => {
  const {
    clientName = '{Company name}',
    clientAddress = '{client address}',
    projectAmount = '{amount}',
    currentDate = new Date().toLocaleDateString('en-IN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }),
    agreementDate = '___ day of __________, 20__',
  } = agreementData || {};

  return (
    <Document>
      <Page style={styles.page} wrap>
        {/* Background elements */}
        <View style={styles.pageBorder} />
        <Image src={watermark} style={styles.watermark} />
        
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.title}>PROJECT DEVELOPMENT AGREEMENT</Text>
            <Text style={styles.subtitle}>Between Shotlin and {clientName}</Text>
          </View>
          <View style={styles.headerRight}>
            <Image src={logo} style={styles.logo} />
          </View>
        </View>
        
        {/* Introduction */}
        <View style={styles.section}>
          <Text style={styles.paragraph}>
            This Agreement is made on this {agreementDate}, by and between:
          </Text>
        </View>
        
        {/* Parties */}
        <View style={styles.partiesContainer}>
          <View style={styles.partyBox}>
            <Text style={styles.partyTitle}>Developer</Text>
            <Text style={styles.partyText}>Shotlin</Text>
            <Text style={styles.partyText}>
              379/N, BANIPUR PALPARA WARD 13,{'\n'}
              BANIPUR PALPARA, S.N. DEY ROAD,{'\n'}
              Habra, North 24 Parganas,{'\n'}
              West Bengal 743233, India
            </Text>
          </View>
          
          <View style={styles.partyBox}>
            <Text style={styles.partyTitle}>Client</Text>
            <Text style={styles.partyText}>{clientName}</Text>
            <Text style={styles.partyText}>{clientAddress}</Text>
          </View>
        </View>
        
        {/* Agreement Sections */}
        <View style={styles.section}>
          {/* Section 1 */}
          <View style={styles.numbered}>
            <Text style={styles.number}>1.</Text>
            <View style={styles.numberedContent}>
              <Text style={styles.sectionHeading}>Scope of Work</Text>
              <Text style={styles.paragraph}>
                The Developer shall deliver a website and/or application as per specifications outlined in Annexure
                A. The scope shall be frozen upon project initiation. Any modifications will be treated as billable
                Change Requests.
              </Text>
            </View>
          </View>
          
          {/* Section 2 */}
          <View style={styles.numbered}>
            <Text style={styles.number}>2.</Text>
            <View style={styles.numberedContent}>
              <Text style={styles.sectionHeading}>Timeline & Milestones</Text>
              <Text style={styles.paragraph}>As per Annexure B.</Text>
              <View style={styles.subSection}>
                <View style={styles.bulletPoint}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.bulletText}>
                    Delays in client inputs beyond 3 working days extend the timeline.
                  </Text>
                </View>
                <View style={styles.bulletPoint}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.bulletText}>
                    Delays over 7 days allow project pause or holding fee.
                  </Text>
                </View>
                <View style={styles.bulletPoint}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.bulletText}>
                    Non-response for 30 consecutive days marks the project inactive (Clause 10).
                  </Text>
                </View>
              </View>
            </View>
          </View>
          
          {/* Section 3 */}
          <View style={styles.numbered}>
            <Text style={styles.number}>3.</Text>
            <View style={styles.numberedContent}>
              <Text style={styles.sectionHeading}>Payment Terms</Text>
              <View style={styles.subSection}>
                <View style={styles.bulletPoint}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.bulletText}>
                    Project Value: ₹{projectAmount}+ GST
                  </Text>
                </View>
                <View style={styles.bulletPoint}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.bulletText}>
                    50% Advance before project start
                  </Text>
                </View>
                <View style={styles.bulletPoint}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.bulletText}>
                    50% before deployment or source code delivery
                  </Text>
                </View>
                <View style={styles.bulletPoint}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.bulletText}>
                    Delayed final payment beyond 7 days incurs 4% monthly interest
                  </Text>
                </View>
                <View style={styles.bulletPoint}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.bulletText}>
                    GST is mandatory and legally recoverable
                  </Text>
                </View>
                <View style={styles.bulletPoint}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.bulletText}>
                    If final payment or deployment approval is delayed beyond 15 days post-completion, the
                    Developer may close the project and quote a reactivation fee.
                  </Text>
                </View>
              </View>
            </View>
          </View>
          
          {/* Section 4 */}
          <View style={styles.numbered}>
            <Text style={styles.number}>4.</Text>
            <View style={styles.numberedContent}>
              <Text style={styles.sectionHeading}>Deployment & Source Code Delivery</Text>
              <Text style={styles.paragraph}>Delivery includes:</Text>
              <View style={styles.subSection}>
                <View style={styles.bulletPoint}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.bulletText}>
                    Full source code
                  </Text>
                </View>
                <View style={styles.bulletPoint}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.bulletText}>
                    Deployment files/instructions
                  </Text>
                </View>
                <View style={styles.bulletPoint}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.bulletText}>
                    Admin/server credentials (if applicable)
                  </Text>
                </View>
              </View>
              <Text style={styles.paragraph}>All released only after 100% payment.</Text>
            </View>
          </View>

          {/* Section 5 */}
          <View style={styles.numbered}>
            <Text style={styles.number}>5.</Text>
            <View style={styles.numberedContent}>
              <Text style={styles.sectionHeading}>Taxes</Text>
              <Text style={styles.paragraph}>
                Client bears all taxes. TDS certificates must be issued within 30 days. Non-payment of GST
                empowers the Developer to withhold delivery or initiate recovery.
              </Text>
            </View>
          </View>
          
          {/* Section 6 */}
          <View style={styles.numbered}>
            <Text style={styles.number}>6.</Text>
            <View style={styles.numberedContent}>
              <Text style={styles.sectionHeading}>Intellectual Property Rights & Licensing</Text>
              <Text style={styles.paragraph}>Upon full payment, the Client owns the deliverables.</Text>
              <Text style={styles.paragraph}>However:</Text>
              <View style={styles.subSection}>
                <View style={styles.bulletPoint}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.bulletText}>
                    Reuse, resale, redistribution, SaaS packaging, or white-labeling is prohibited without written
                    licensing
                  </Text>
                </View>
                <View style={styles.bulletPoint}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.bulletText}>
                    Internal tools and reusable code elements remain the Developer's IP
                  </Text>
                </View>
              </View>
            </View>
          </View>
          
          {/* Section 7 */}
          <View style={styles.numbered}>
            <Text style={styles.number}>7.</Text>
            <View style={styles.numberedContent}>
              <Text style={styles.sectionHeading}>Change Requests & Revisions</Text>
              <Text style={styles.paragraph}>
                Client receives two (2) functional revision rounds limited to core bugs (Annexure A).
                Design preferences, UI changes, or new features are billable Change Requests.
              </Text>
            </View>
          </View>
          
          {/* Section 8 */}
          <View style={styles.numbered}>
            <Text style={styles.number}>8.</Text>
            <View style={styles.numberedContent}>
              <Text style={styles.sectionHeading}>Core Features & Refund Policy</Text>
              <Text style={styles.paragraph}>
                "Core Features" are critical product functionalities listed in Annexure A.
                Undelivered core features must be rectified within a 15-day grace period.
                If not, a pro-rata refund may apply after deducting effort costs.
              </Text>
              <Text style={styles.paragraph}>No refund shall apply for:</Text>
              <View style={styles.subSection}>
                <View style={styles.bulletPoint}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.bulletText}>UI/UX dissatisfaction</Text>
                </View>
                <View style={styles.bulletPoint}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.bulletText}>Scope not listed in Annexure A</Text>
                </View>
                <View style={styles.bulletPoint}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.bulletText}>Client delays</Text>
                </View>
                <View style={styles.bulletPoint}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.bulletText}>Change of mind or business direction</Text>
                </View>
              </View>
            </View>
          </View>
          
          {/* Section 9 */}
          <View style={styles.numbered}>
            <Text style={styles.number}>9.</Text>
            <View style={styles.numberedContent}>
              <Text style={styles.sectionHeading}>Warranty & Maintenance (AMC)</Text>
              <Text style={styles.paragraph}>
                Developer provides 6 months of free bug-fix support.
                Excludes upgrades, redesigns, or new features.
                Post-6-month support: 10% of project cost per visit/request, or via AMC.
              </Text>
            </View>
          </View>
        </View>
      </Page>
      
      {/* Page 2 */}
      <Page style={styles.page} wrap>
        <View style={styles.pageBorder} />
        <Image src={watermark} style={styles.watermark} />
        
        <View style={styles.section}>
          {/* Section 10 */}
          <View style={styles.numbered}>
            <Text style={styles.number}>10.</Text>
            <View style={styles.numberedContent}>
              <Text style={styles.sectionHeading}>Inactivity & Reactivation</Text>
              <Text style={styles.paragraph}>
                If the Client is inactive for 30 days, the project is marked closed.
                Reactivation may incur additional charges or re-quotation based on effort or stack updates.
              </Text>
            </View>
          </View>
          
          {/* Section 11 */}
          <View style={styles.numbered}>
            <Text style={styles.number}>11.</Text>
            <View style={styles.numberedContent}>
              <Text style={styles.sectionHeading}>Backup, Hosting & Data Retention</Text>
              <Text style={styles.paragraph}>
                Post-handover, Client is responsible for hosting, backups, and server security.
                Developer retains no data, files, or credentials beyond 15 calendar days from handover.
                Recovery after that period may be unavailable or chargeable.
              </Text>
            </View>
          </View>
          
          {/* Section 12 */}
          <View style={styles.numbered}>
            <Text style={styles.number}>12.</Text>
            <View style={styles.numberedContent}>
              <Text style={styles.sectionHeading}>Client Content Legality</Text>
              <Text style={styles.paragraph}>
                Client warrants ownership and legal use of all supplied content.
                Developer is not liable for copyright, IP, or licensing violations from client-provided materials.
              </Text>
            </View>
          </View>
          
          {/* Section 13 */}
          <View style={styles.numbered}>
            <Text style={styles.number}>13.</Text>
            <View style={styles.numberedContent}>
              <Text style={styles.sectionHeading}>Limitation of Liability</Text>
              <Text style={styles.paragraph}>
                Developer's liability is capped at the total amount paid.
                Developer is not liable for:
              </Text>
              <View style={styles.subSection}>
                <View style={styles.bulletPoint}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.bulletText}>Hosting/server issues</Text>
                </View>
                <View style={styles.bulletPoint}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.bulletText}>Plugin/API bugs</Text>
                </View>
                <View style={styles.bulletPoint}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.bulletText}>Financial loss due to admin mishandling</Text>
                </View>
                <View style={styles.bulletPoint}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.bulletText}>Security breaches post-handover</Text>
                </View>
                <View style={styles.bulletPoint}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.bulletText}>Consequential or reputational loss</Text>
                </View>
              </View>
            </View>
          </View>
          
          {/* Section 14 */}
          <View style={styles.numbered}>
            <Text style={styles.number}>14.</Text>
            <View style={styles.numberedContent}>
              <Text style={styles.sectionHeading}>Indemnification</Text>
              <Text style={styles.paragraph}>
                Client shall indemnify and hold the Developer harmless from any claim, dispute, or damage arising
                from:
              </Text>
              <View style={styles.subSection}>
                <View style={styles.bulletPoint}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.bulletText}>Unlawful usage</Text>
                </View>
                <View style={styles.bulletPoint}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.bulletText}>Misuse of the platform</Text>
                </View>
                <View style={styles.bulletPoint}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.bulletText}>IP violations from Client inputs</Text>
                </View>
                <View style={styles.bulletPoint}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.bulletText}>Security breach due to client-side management</Text>
                </View>
              </View>
            </View>
          </View>
          
          {/* Section 15 */}
          <View style={styles.numbered}>
            <Text style={styles.number}>15.</Text>
            <View style={styles.numberedContent}>
              <Text style={styles.sectionHeading}>Non-Solicitation</Text>
              <Text style={styles.paragraph}>
                Client shall not directly solicit or hire any employee or subcontractor of the Developer for 12
                months post-project.
                Breach attracts damages equal to 3 months of the individual's billing rate.
              </Text>
            </View>
          </View>
          
          {/* Section 16 */}
          <View style={styles.numbered}>
            <Text style={styles.number}>16.</Text>
            <View style={styles.numberedContent}>
              <Text style={styles.sectionHeading}>Force Majeure</Text>
              <Text style={styles.paragraph}>
                Neither party is liable for delays due to events beyond control, including cyberattacks, government
                restrictions, natural disasters, server outages, or pandemics.
              </Text>
            </View>
          </View>
          
          {/* Section 17 */}
          <View style={styles.numbered}>
            <Text style={styles.number}>17.</Text>
            <View style={styles.numberedContent}>
              <Text style={styles.sectionHeading}>Security Disclaimer</Text>
              <Text style={styles.paragraph}>
                Unless specifically contracted, the Developer does not guarantee cyber security protection, SSL,
                malware audits, or compliance certifications.
                Client is responsible for all post-handover server and credential security.
              </Text>
            </View>
          </View>
          
          {/* Section 18 */}
          <View style={styles.numbered}>
            <Text style={styles.number}>18.</Text>
            <View style={styles.numberedContent}>
              <Text style={styles.sectionHeading}>Interim Work Ownership</Text>
              <Text style={styles.paragraph}>
                All previews, drafts, demos, and code remain the Developer's property until full payment.
                The Client may not use, distribute, or deploy them without written clearance.
              </Text>
            </View>
          </View>

          {/* Section 19 */}
          <View style={styles.numbered}>
            <Text style={styles.number}>19.</Text>
            <View style={styles.numberedContent}>
              <Text style={styles.sectionHeading}>Public Defamation & Reputation</Text>
              <Text style={styles.paragraph}>
                Client agrees to resolve disputes privately via written communication or arbitration.
                No negative reviews, online complaints, or defamatory posts may be published without first
                offering the Developer a chance to resolve the matter.
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.footer}>
          <Text>Generated on {currentDate}</Text>
          <Text>Page 2 of 3</Text>
        </View>
      </Page>
      
      {/* Page 3 */}
      <Page style={styles.page} wrap>
        <View style={styles.pageBorder} />
        <Image src={watermark} style={styles.watermark} />
        
        <View style={styles.section}>
          {/* Section 20 */}
          <View style={styles.numbered}>
            <Text style={styles.number}>20.</Text>
            <View style={styles.numberedContent}>
              <Text style={styles.sectionHeading}>Data Privacy & Global Compliance</Text>
              <Text style={styles.paragraph}>
                Developer shall follow best practices in handling client data.
                If applicable by law (e.g., GDPR), a separate Data Processing Addendum (DPA) shall be executed.
              </Text>
            </View>
          </View>
          
          {/* Section 21 */}
          <View style={styles.numbered}>
            <Text style={styles.number}>21.</Text>
            <View style={styles.numberedContent}>
              <Text style={styles.sectionHeading}>Scope Finalization Delays</Text>
              <Text style={styles.paragraph}>
                If the Client fails to finalize scope within 15 days of project start, or repeatedly modifies approved
                scope, the Developer may pause the project and/or charge administrative rescoping fees.
              </Text>
            </View>
          </View>
          
          {/* Section 22 */}
          <View style={styles.numbered}>
            <Text style={styles.number}>22.</Text>
            <View style={styles.numberedContent}>
              <Text style={styles.sectionHeading}>Dispute Resolution</Text>
              <Text style={styles.paragraph}>
                Disputes shall be resolved via arbitration in Kolkata, in English, under the Arbitration & Conciliation
                Act, 1996.
                If parties fail to agree on an arbitrator, the Developer may nominate one.
                Courts of Kolkata shall have exclusive jurisdiction.
              </Text>
            </View>
          </View>
          
          {/* Section 23 */}
          <View style={styles.numbered}>
            <Text style={styles.number}>23.</Text>
            <View style={styles.numberedContent}>
              <Text style={styles.sectionHeading}>Entire Agreement</Text>
              <Text style={styles.paragraph}>
                This document and its Annexures represent the complete Agreement.
                Any verbal or informal communication shall not override the terms herein.
                Amendments require written mutual consent and signatures.
              </Text>
            </View>
          </View>
        </View>
        
        {/* Signature Section */}
        <View style={styles.signatureSection}>
          <View style={styles.signatureBox}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureName}>{clientName}</Text>
            <Text style={styles.signatureTitle}>Client Signature</Text>
          </View>
          
          <View style={styles.signatureBox}>
            <Image src={signature} style={styles.signatureImage} />
            <View style={styles.signatureLine} />
            <Text style={styles.signatureName}>Shotlin</Text>
            <Text style={styles.signatureTitle}>Developer Signature</Text>
          </View>
        </View>
        
        <View style={styles.footer}>
          <Text>Generated on {currentDate}</Text>
          <Text>Page 3 of 3</Text>
        </View>
      </Page>
    </Document>
  );
};

// Main component for PDF export
const AgreementPDFGenerator = ({ agreementData, children }) => {
  const generatePdfBlob = async () => {
    const MyDocument = () => <AgreementDocument agreementData={agreementData} />;
    const blob = await pdf(<MyDocument />).toBlob();
    return blob;
  };

  const downloadPdf = async () => {
    try {
      const blob = await generatePdfBlob();
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `${agreementData?.clientName || 'Client'}_Agreement.pdf`;
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
          background: 'linear-gradient(to right, #7E57C2, #9575CD)',
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
        <span>Download Agreement</span>
      </button>
    );
  }
  
  return React.cloneElement(children, {
    onClick: handleDirectDownload
  });
};

export default AgreementPDFGenerator;