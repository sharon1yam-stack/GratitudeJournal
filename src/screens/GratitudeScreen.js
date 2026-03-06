import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Alert,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { saveEntry, loadEntry } from '../utils/storage';

const { width } = Dimensions.get('window');

const DAYS_HE = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
const MONTHS_HE = [
  'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
  'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר',
];

const formatDate = (date) => {
  const day = DAYS_HE[date.getDay()];
  const num = date.getDate();
  const month = MONTHS_HE[date.getMonth()];
  const year = date.getFullYear();
  return `יום ${day}, ${num} ב${month} ${year}`;
};

const PROMPTS = [
  'אני מודה על...',
  'אני מודה על...',
  'אני מודה על...',
  'אני מודה על...',
  'אני מודה על...',
];

export default function GratitudeScreen({ navigation }) {
  const today = new Date();
  const [items, setItems] = useState(['', '', '', '', '']);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadEntry(today).then((data) => {
      setItems(data);
      const allFilled = data.some((item) => item.trim().length > 0);
      setSaved(allFilled);
    });
  }, []);

  const updateItem = (index, text) => {
    const updated = [...items];
    updated[index] = text;
    setItems(updated);
    setSaved(false);
  };

  const handleSave = async () => {
    const hasContent = items.some((item) => item.trim().length > 0);
    if (!hasContent) {
      Alert.alert('רגע...', 'נסה למלא לפחות הודייה אחת 🌊');
      return;
    }
    await saveEntry(today, items);
    setSaved(true);
    Alert.alert('נשמר! 🌅', 'ההודיות שלך ליום זה נשמרו בהצלחה');
  };

  return (
    <ImageBackground
      source={require('../../assets/background.jpeg')}
      style={styles.gradient}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="height">
          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Header row: History button (left) | Date (right) */}
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.historyBtn}
                onPress={() => navigation.navigate('History')}
              >
                <Text style={styles.historyBtnText}>היסטוריה 📋</Text>
              </TouchableOpacity>
              <Text style={styles.dateText}>{formatDate(today)}</Text>
            </View>

            {/* Title area */}
            <View style={styles.titleBlock}>
<Text style={styles.title}>יומן הודייה</Text>
              <Text style={styles.subtitle}>חמישה דברים שמאירים את יומי</Text>
            </View>

            {/* 5 Gratitude inputs */}
            {items.map((item, index) => (
              <View key={index} style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardLabel}>✨ {index + 1}</Text>
                </View>
                <TextInput
                  style={styles.input}
                  value={item}
                  onChangeText={(text) => updateItem(index, text)}
                  placeholder={PROMPTS[index]}
                  placeholderTextColor="#A8C8D8"
                  multiline
                  textAlign="right"
                  textAlignVertical="top"
                  returnKeyType="next"
                />
              </View>
            ))}

            {/* Save button */}
            <TouchableOpacity
              style={[styles.saveBtn, saved && styles.saveBtnSaved]}
              onPress={handleSave}
              activeOpacity={0.8}
            >
              <Text style={styles.saveBtnText}>
                {saved ? '✓  נשמר בהצלחה' : 'שמור את ההודיות'}
              </Text>
            </TouchableOpacity>

            {/* Decorative wave footer */}
            <View style={styles.waveContainer}>
              <View style={styles.waveTop} />
              <View style={styles.waveBottom} />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  overlay: { flex: 1, backgroundColor: 'rgba(255,255,255,0.15)' },
  safe: { flex: 1 },
  scroll: { padding: 20, paddingBottom: 40 },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
  },
  dateText: {
    fontSize: 13,
    color: '#4A7A90',
    fontWeight: '700',
    textAlign: 'right',
    flexShrink: 1,
  },
  historyBtn: {
    backgroundColor: 'rgba(126,200,200,0.35)',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
  },
  historyBtnText: {
    color: '#2E6A80',
    fontSize: 13,
    fontWeight: '700',
  },

  // Title
  titleBlock: {
    alignItems: 'center',
    marginBottom: 30,
  },
  waveEmoji: { fontSize: 44, marginBottom: 6 },
  title: {
    fontSize: 30,
    fontWeight: '900',
    color: '#2E6A80',
    textAlign: 'center',
    letterSpacing: 1,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: '#B5622A',
    textAlign: 'center',
  },

  // Gratitude cards
  card: {
    backgroundColor: 'rgba(255,255,255,0.68)',
    borderRadius: 18,
    padding: 14,
    marginBottom: 14,
    shadowColor: '#6AAABB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 4,
  },
  cardHeader: {
    alignItems: 'flex-end',
    marginBottom: 4,
  },
  cardLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#7EC8C8',
  },
  input: {
    fontSize: 16,
    color: '#2E5060',
    minHeight: 52,
    textAlign: 'right',
  },

  // Save button
  saveBtn: {
    backgroundColor: '#7EC8C8',
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
    shadowColor: '#4AAABB',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  saveBtnSaved: {
    backgroundColor: '#88D8A8',
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  // Decorative wave at bottom
  waveContainer: { alignItems: 'center', marginTop: 4 },
  waveTop: {
    width: width - 40,
    height: 30,
    backgroundColor: 'rgba(126,200,200,0.25)',
    borderTopLeftRadius: 80,
    borderTopRightRadius: 80,
  },
  waveBottom: {
    width: width - 80,
    height: 16,
    backgroundColor: 'rgba(126,200,200,0.15)',
    borderTopLeftRadius: 60,
    borderTopRightRadius: 60,
    marginTop: 4,
  },
});
