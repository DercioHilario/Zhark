import { View, Text, StyleSheet, Platform } from 'react-native';
import { WebView } from 'react-native-webview';

interface MapComponentProps {
  style?: any;
  initialRegion?: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
}

export default function MapComponent({ 
  initialRegion = {
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  },
  style 
}: MapComponentProps) {
  if (Platform.OS === 'web') {
    // Use Google Maps embed for web platform
    return (
      <iframe
        src={`https://www.google.com/maps/embed/v1/view?key=YOUR_API_KEY&center=${initialRegion.latitude},${initialRegion.longitude}&zoom=13`}
        style={{
          border: 0,
          width: '100%',
          height: '100%',
          ...style,
        }}
        allowFullScreen
      />
    );
  }

  // For native platforms, use a static map image as WebView might be heavy
  return (
    <View style={[styles.container, style]}>
      <View style={styles.mapPlaceholder}>
        <Text style={styles.placeholderText}>
          Loading map...
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
  },
  placeholderText: {
    color: '#666',
    fontSize: 16,
  },
});