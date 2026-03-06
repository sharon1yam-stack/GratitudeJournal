import AsyncStorage from '@react-native-async-storage/async-storage';

// Returns a YYYY-MM-DD string for the given date (defaults to today)
export const getDateKey = (date = new Date()) => {
  return date.toISOString().split('T')[0];
};

// Save the 5 gratitude items for a specific date
export const saveEntry = async (date, items) => {
  const key = `entry_${getDateKey(date)}`;
  await AsyncStorage.setItem(key, JSON.stringify(items));
};

// Load the 5 gratitude items for a specific date (returns blanks if none saved)
export const loadEntry = async (date) => {
  const key = `entry_${getDateKey(date)}`;
  const data = await AsyncStorage.getItem(key);
  return data ? JSON.parse(data) : ['', '', '', '', ''];
};

// Load all saved entries, sorted newest first
export const loadAllEntries = async () => {
  const keys = await AsyncStorage.getAllKeys();
  const entryKeys = keys.filter((k) => k.startsWith('entry_'));
  if (entryKeys.length === 0) return [];
  const pairs = await AsyncStorage.multiGet(entryKeys);
  return pairs
    .map(([key, value]) => ({
      date: key.replace('entry_', ''),
      items: JSON.parse(value),
    }))
    .sort((a, b) => b.date.localeCompare(a.date));
};
