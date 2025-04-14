import { View, Text, TouchableOpacity, TextInput, Modal, ActivityIndicator } from "react-native";
import styles from "../../Style/popapTrasporte";
import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import * as Font from "expo-font";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import MapView, { Marker, MapPressEvent } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import * as Location from "expo-location";

const GOOGLE_MAPS_API_KEY = "AIzaSyBs6S1u7wVG8_6vM_suHchO_fEhbgfHhto"; // 🔥 Substitua pela sua API Key do Google

interface LocationType {
    latitude: number;
    longitude: number;
}

export default function Servico() {
    const [fontsLoaded, setFontsLoaded] = useState(false);
    const [formData, setFormData] = useState({ nome: "", telefone: "", origem: "", destino: "" });
    const [modalVisible, setModalVisible] = useState(false);
    const [mapMode, setMapMode] = useState<"origem" | "destino">("origem");
    const [currentLocation, setCurrentLocation] = useState<LocationType | null>(null);
    const [selectedLocation, setSelectedLocation] = useState<LocationType | null>(null);
    const [destinationLocation, setDestinationLocation] = useState<LocationType | null>(null);
    const [mapLoading, setMapLoading] = useState(true);
    const [isCalculating, setIsCalculating] = useState(false);
    const router = useRouter();

    const handleSubmit = () => {
        setIsCalculating(true);
        // Simulate API call for price calculation
        setTimeout(() => {
            setIsCalculating(false);
            // Navigate to confirmation screen (to be implemented)
            router.push('/');
        }, 2000);
    };

    useEffect(() => {
        const loadFonts = async () => {
            try {
                await Font.loadAsync({
                    Wellfleet: require("../../../../assets/fonts/Wellfleet-Regular.ttf"),
                });
                setFontsLoaded(true);
            } catch (error) {
                console.error("Erro ao carregar fontes:", error);
            }
        };
        loadFonts();
    }, []);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                console.error("Permissão de localização negada.");
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setCurrentLocation({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            });
        })();
    }, []);

    const handleSelectLocation = (e: MapPressEvent) => {
        const { latitude, longitude } = e.nativeEvent.coordinate;
        if (mapMode === "origem") {
            setSelectedLocation({ latitude, longitude });
        } else {
            setDestinationLocation({ latitude, longitude });
        }
    };

    const confirmLocation = () => {
        if (mapMode === "origem" && selectedLocation) {
            setFormData({ ...formData, origem: `Lat: ${selectedLocation.latitude}, Lng: ${selectedLocation.longitude}` });
        } else if (mapMode === "destino" && destinationLocation) {
            setFormData({ ...formData, destino: `Lat: ${destinationLocation.latitude}, Lng: ${destinationLocation.longitude}` });
        }
        setModalVisible(false);
    };

    if (!fontsLoaded) {
        return <Text>Carregando fontes...</Text>;
    }

    return (
        <View style={styles.container}>
            <StatusBar style="auto" />

            <Animated.View entering={FadeIn} style={styles.overlay}>
                <View style={styles.formContainer}>
                    <Animated.Text entering={FadeInDown.delay(100)} style={styles.title}>
                        Solicite sua Corrida
                    </Animated.Text>

                    <Animated.View entering={FadeInDown.delay(200)} style={styles.inputGroup}>
                        <Text style={styles.label}>Nome</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Digite seu nome"
                            value={formData.nome}
                            onChangeText={(text) => setFormData({ ...formData, nome: text })}
                        />
                    </Animated.View>

                    <Animated.View entering={FadeInDown.delay(300)} style={styles.inputGroup}>
                        <Text style={styles.label}>Número de Telefone</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Digite seu telefone"
                            keyboardType="phone-pad"
                            value={formData.telefone}
                            onChangeText={(text) => setFormData({ ...formData, telefone: text })}
                        />
                    </Animated.View>

                    <Animated.View entering={FadeInDown.delay(200)} style={styles.inputGroup}>
                        <Text style={styles.label}>Local de Partida</Text>
                        <TouchableOpacity style={styles.locationInput} onPress={() => { setMapMode("origem"); setModalVisible(true); }}>
                            <MaterialCommunityIcons name="map-marker" size={20} color="#666" />
                            <TextInput style={styles.locationTextInput} placeholder="Local de partida" value={formData.origem} editable={false} />
                        </TouchableOpacity>
                    </Animated.View>

                    <Animated.View entering={FadeInDown.delay(300)} style={styles.inputGroup}>
                        <Text style={styles.label}>Destino</Text>
                        <TouchableOpacity style={styles.locationInput} onPress={() => { setMapMode("destino"); setModalVisible(true); }}>
                            <MaterialCommunityIcons name="map-marker" size={20} color="#666" />
                            <TextInput style={styles.locationTextInput} placeholder="Local do destino" value={formData.destino} editable={false} />
                        </TouchableOpacity>
                    </Animated.View>
                    <Animated.View
                        entering={FadeInDown.delay(600)}
                        style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={() => router.back()}>
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.submitButton,
                                (!formData.nome || !formData.telefone || !formData.origem || !formData.destino) &&
                                styles.submitButtonDisabled
                            ]}
                            disabled={!formData.nome || !formData.telefone || !formData.origem || !formData.destino || isCalculating}
                            onPress={handleSubmit}>
                            {isCalculating ? (
                                <View style={styles.calculatingContainer}>
                                    <Text style={styles.calculatingText}>Calculando...</Text>
                                </View>
                            ) : (
                                <Text style={styles.submitButtonText}>Calcular Preço</Text>
                            )}
                        </TouchableOpacity>
                    </Animated.View>

                </View>
            </Animated.View>

            {/* MODAL DO MAPA */}
            <Modal visible={modalVisible} animationType="slide">
                <View style={styles.mapContainer}>
                    {mapLoading && (
                        <View style={styles.loadingOverlay}>
                            <ActivityIndicator size="large" color="#0000ff" />
                            <Text style={styles.loadingText}>Aguarde um instante, carregando o mapa...</Text>
                        </View>
                    )}
                    {currentLocation && (
                        <MapView
                            style={styles.map}
                            initialRegion={{
                                latitude: selectedLocation?.latitude || currentLocation.latitude,
                                longitude: selectedLocation?.longitude || currentLocation.longitude,
                                latitudeDelta: 0.01,
                                longitudeDelta: 0.01,
                            }}
                            onPress={handleSelectLocation}
                            onMapReady={() => setMapLoading(false)}
                        >
                            {selectedLocation && <Marker coordinate={selectedLocation} title="Local de Partida" pinColor="blue" />}
                            {destinationLocation && <Marker coordinate={destinationLocation} title="Destino" pinColor="red" />}

                            {selectedLocation && destinationLocation && (
                                <MapViewDirections
                                    origin={selectedLocation}
                                    destination={destinationLocation}
                                    apikey={GOOGLE_MAPS_API_KEY}
                                    strokeWidth={5}
                                    strokeColor="blue"
                                />
                            )}
                        </MapView>
                    )}
                    <View style={styles.mapButtons}>
                        <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                            <Text style={styles.cancelButtonText}>Fechar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.submitButton} onPress={confirmLocation}>
                            <Text style={styles.submitButtonText}>Confirmar Local</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

        </View>
    );
}
