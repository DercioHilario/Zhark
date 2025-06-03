// components/MapaModal.tsx
import React, { useEffect, useState } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import MapView, { Marker, Region, MapPressEvent } from 'react-native-maps';
import * as Location from 'expo-location';

type Props = {
    visible: boolean;
    onClose: () => void;
    onConfirm: (location: { latitude: number; longitude: number }) => void;
};

export default function MapaModal({ visible, onClose, onConfirm }: Props) {
    const [region, setRegion] = useState<Region | null>(null);
    const [selectedLocation, setSelectedLocation] = useState<{ latitude: number; longitude: number } | null>(null);

    useEffect(() => {
        if (visible) {
            (async () => {
                const { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    Alert.alert('Permissão negada', 'Precisamos da sua localização para continuar.');
                    return;
                }

                const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
                const coords = {
                    latitude: loc.coords.latitude,
                    longitude: loc.coords.longitude,
                };

                const regionData = {
                    ...coords,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                };

                setRegion(regionData);
                setSelectedLocation(coords);
            })();
        }
    }, [visible]);

    const handleMapPress = (e: MapPressEvent) => {
        const coords = e.nativeEvent.coordinate;
        setSelectedLocation(coords);
        setRegion({
            ...coords,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
        });
    };

    return (
        <Modal visible={visible} animationType="slide">
            <View style={styles.container}>
                {region ? (
                    <>
                        <MapView
                            style={styles.map}
                            region={region}
                            mapType="hybrid"
                            onPress={handleMapPress}
                        >
                            {selectedLocation && <Marker coordinate={selectedLocation} />}
                        </MapView>

                        <View style={styles.buttons}>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => selectedLocation && onConfirm(selectedLocation)}
                            >
                                <Text style={styles.buttonText}>Confirmar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.button, styles.cancel]} onPress={onClose}>
                                <Text style={styles.buttonText}>Cancelar</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                ) : (
                    <ActivityIndicator size="large" color="#007BFF" />
                )}
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    map: { flex: 1 },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 15,
        backgroundColor: '#fff',
    },
    button: {
        backgroundColor: '#007BFF',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    cancel: {
        backgroundColor: 'gray',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
