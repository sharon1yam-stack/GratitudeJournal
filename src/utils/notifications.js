import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

export const scheduleDailyNotification = async () => {
  // Notifications only work on a real physical device
  if (!Device.isDevice) {
    console.log('Push notifications require a physical device.');
    return;
  }

  // Request permission
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    console.log('Notification permission not granted.');
    return;
  }

  // Create Android notification channel
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('daily-reminder', {
      name: 'תזכורת יומית',
      importance: Notifications.AndroidImportance.HIGH,
      sound: true,
      vibrationPattern: [0, 250, 250, 250],
    });
  }

  // Cancel any previously scheduled notifications to avoid duplicates
  await Notifications.cancelAllScheduledNotificationsAsync();

  // Schedule a daily notification at 21:00 (9 PM)
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '🌅 זמן להודייה',
      body: 'על מה אתה מודה היום? פתח את היומן ✨',
      sound: true,
      channelId: 'daily-reminder',
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 21,
      minute: 0,
    },
  });

  console.log('Daily 9 PM notification scheduled.');
};
