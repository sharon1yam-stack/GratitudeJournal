import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { loadAllEntries } from '../utils/storage';

const MONTHS_HE = [
  'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
  'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר',
];
const DAYS_HE = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];

const formatDate = (dateStr) => {
  const date = new Date(dateStr + 'T00:00:00');
  const day = DAYS_HE[date.getDay()];
  const num = date.getDate();
  const month = MONTHS_HE[date.getMonth()];
  const year = date.getFullYear();
  return `יום ${day}, ${num} ב${month} ${year}`;
};

export default function HistoryScreen({ navigation }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllEntries()
      .then(setEntries)
      .finally(() => setLoading(false));
  }, []);

  return (
    <ImageBackground
      source={require('../../assets/background.jpeg')}
      style={styles.gradient}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
      <SafeAreaView style={styles.safe}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backBtnText}>→ חזרה</Text>
          </TouchableOpacity>
          <Text style={styles.title}>ההודיות שלי 🌊</Text>
        </View>

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#7EC8C8"
            style={{ marginTop: 60 }}
          />
        ) : (
          <ScrollView
            contentContainerStyle={styles.scroll}
            showsVerticalScrollIndicator={false}
          >
            {entries.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyEmoji}>🌱</Text>
                <Text style={styles.emptyText}>
                  עדיין אין הודיות שמורות{'\n'}התחל למלא את היומן!
                </Text>
              </View>
            ) : (
              entries.map(({ date, items }) => {
                const filled = items.filter((i) => i && i.trim().length > 0);
                if (filled.length === 0) return null;
                return (
                  <View key={date} style={styles.card}>
                    <View style={styles.cardHeaderRow}>
                      <Text style={styles.cardCount}>{filled.length}/5</Text>
                      <Text style={styles.cardDate}>{formatDate(date)}</Text>
                    </View>
                    <View style={styles.divider} />
                    {filled.map((item, idx) => (
                      <Text key={idx} style={styles.cardItem}>
                        ✨  {item}
                      </Text>
                    ))}
                  </View>
                );
              })
            )}
          </ScrollView>
        )}
      </SafeAreaView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  overlay: { flex: 1, backgroundColor: 'rgba(255,255,255,0.15)' },
  safe: { flex: 1 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 14,
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: '#2E6A80',
    textAlign: 'right',
  },
  backBtn: {
    backgroundColor: 'rgba(126,200,200,0.35)',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
  },
  backBtnText: {
    color: '#2E6A80',
    fontWeight: '700',
    fontSize: 14,
  },

  scroll: { padding: 20, paddingTop: 6, paddingBottom: 40 },

  emptyContainer: { alignItems: 'center', marginTop: 60 },
  emptyEmoji: { fontSize: 50, marginBottom: 14 },
  emptyText: {
    fontSize: 16,
    color: '#6AAABB',
    textAlign: 'center',
    lineHeight: 26,
  },

  card: {
    backgroundColor: 'rgba(255,255,255,0.70)',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#6AAABB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 4,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardDate: {
    fontSize: 14,
    fontWeight: '800',
    color: '#3D7A8A',
    textAlign: 'right',
  },
  cardCount: {
    fontSize: 12,
    color: '#7EC8C8',
    fontWeight: '700',
    backgroundColor: 'rgba(126,200,200,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(126,200,200,0.3)',
    marginBottom: 10,
  },
  cardItem: {
    fontSize: 14,
    color: '#3D5A68',
    textAlign: 'right',
    paddingVertical: 4,
    lineHeight: 22,
  },
});
