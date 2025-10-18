import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// PDF Styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
  },
  header: {
    marginBottom: 30,
    borderBottom: '2 solid #10b981',
    paddingBottom: 15,
  },
  logo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#10b981',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: '#666666',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1f2937',
  },
  date: {
    fontSize: 10,
    color: '#666666',
    marginBottom: 30,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#059669',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    width: '40%',
    fontSize: 11,
    color: '#666666',
  },
  value: {
    width: '60%',
    fontSize: 11,
    color: '#1f2937',
    fontWeight: 'bold',
  },
  adviesBox: {
    backgroundColor: '#f0fdf4',
    padding: 15,
    borderRadius: 5,
    borderLeft: '4 solid #10b981',
    marginTop: 10,
  },
  adviesText: {
    fontSize: 11,
    lineHeight: 1.6,
    color: '#1f2937',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    borderTop: '1 solid #e5e7eb',
    paddingTop: 15,
    fontSize: 9,
    color: '#9ca3af',
    textAlign: 'center',
  },
});

interface EnergyReportPDFProps {
  adres: string;
  bouwjaar: string;
  woningtype: string;
  energielabel: string;
  verwarming: string;
  isolatie: string;
  advies: string;
}

// PDF Document Component
export function EnergyReportPDF({ 
  adres, 
  bouwjaar, 
  woningtype, 
  energielabel, 
  verwarming, 
  isolatie, 
  advies 
}: EnergyReportPDFProps) {
  const datum = new Date().toLocaleDateString('nl-NL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>MeGreen</Text>
          <Text style={styles.subtitle}>Energiecoach</Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>AI Energiescan Rapport</Text>
        <Text style={styles.date}>Gegenereerd op: {datum}</Text>

        {/* Woninggegevens */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Woninggegevens</Text>
          
          <View style={styles.row}>
            <Text style={styles.label}>Adres:</Text>
            <Text style={styles.value}>{adres}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Bouwjaar:</Text>
            <Text style={styles.value}>{bouwjaar}</Text>
          </View>

          {woningtype && (
            <View style={styles.row}>
              <Text style={styles.label}>Type woning:</Text>
              <Text style={styles.value}>{woningtype}</Text>
            </View>
          )}

          <View style={styles.row}>
            <Text style={styles.label}>Energielabel:</Text>
            <Text style={styles.value}>{energielabel}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Verwarmingstype:</Text>
            <Text style={styles.value}>{verwarming}</Text>
          </View>

          {isolatie && (
            <View style={styles.row}>
              <Text style={styles.label}>Aanwezige isolatie:</Text>
              <Text style={styles.value}>{isolatie || 'Geen'}</Text>
            </View>
          )}
        </View>

        {/* AI Advies */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Persoonlijk Energieadvies</Text>
          <View style={styles.adviesBox}>
            <Text style={styles.adviesText}>{advies}</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>
            Dit advies is indicatief en gebaseerd op AI-analyse. Het is geen officieel energielabel.
          </Text>
          <Text style={{ marginTop: 5 }}>
            Voor een officieel energielabel of persoonlijk advies, neem contact op met MeGreen.
          </Text>
        </View>
      </Page>
    </Document>
  );
}

