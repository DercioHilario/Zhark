import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, Modal, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, BackHandler } from 'react-native';
import * as Location from 'expo-location';
import { supabase } from '../../../../constants/supabaseClient';
import MapaModal from '../../../../constants/MapaModal';
import { FontAwesome5, MaterialCommunityIcons, Ionicons, AntDesign, MaterialIcons } from '@expo/vector-icons';
import { CustomAlert } from '../../../../constants/CustomAlert';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';

type Endereco = {
    id: string;
    tipo: string;
    endereco: string;
    latitude: number;
    longitude: number;
    created_at?: string;
};

export default function LocalizacaoScreen() {
    const [enderecos, setEnderecos] = useState<Endereco[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [novoEndereco, setNovoEndereco] = useState('');
    const [tipoSelecionado, setTipoSelecionado] = useState('');
    const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const [mapaVisible, setMapaVisible] = useState(false);
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertTitle, setAlertTitle] = useState('');
    const [alertOnConfirm, setAlertOnConfirm] = useState<(() => void) | undefined>(undefined);
    const [alertShowCancel, setAlertShowCancel] = useState(false);

    const router = useRouter();
    const goToHome = useCallback(() => {
        router.replace('/(panel)/inicio');
    }, [router]);

    const tiposEndereco = ['Casa', 'Trabalho', 'Faculdade', 'Gym', 'Amigo/a', 'Namorado/a', 'Outro'];

    const tipoIcones: Record<string, JSX.Element> = {
        Casa: <FontAwesome5 name="home" size={18} color="#007BFF" />,
        Trabalho: <MaterialCommunityIcons name="briefcase" size={18} color="#007BFF" />,
        Faculdade: <Ionicons name="school" size={18} color="#007BFF" />,
        Gym: <FontAwesome5 name="dumbbell" size={18} color="#007BFF" />,
        'Amigo/a': <FontAwesome5 name="users" size={18} color="#007BFF" />,  // chave com barra é válida como string
        'Namorado/a': <FontAwesome5 name="heart" size={18} color="#007BFF" />,
        Outro: <MaterialIcons name="location-on" size={18} color="#007BFF" />
    };


    useEffect(() => {
        carregarEnderecos();
    }, []);

    useEffect(() => {
        const handleBackPress = () => {
            if (modalVisible) {
                setModalVisible(false);
                return true; // impede que a tela seja fechada
            }
            return false; // permite comportamento normal
        };

        const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);

        return () => backHandler.remove();
    }, [modalVisible]);

    const showCustomAlert = (
        title: string,
        message: string,
        onConfirm?: () => void,
        showCancel = false
    ) => {
        setAlertTitle(title);
        setAlertMessage(message);
        setAlertOnConfirm(() => onConfirm);
        setAlertShowCancel(showCancel);
        setAlertVisible(true);
    };

    const carregarEnderecos = async () => {
        const { data, error } = await supabase
            .from('enderecos')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) {
            console.error(error);
        } else {
            setEnderecos(data as Endereco[]);
        }
    };

    const obterLocalizacao = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            showCustomAlert('Permissão negada', 'Você precisa permitir o acesso à localização.');
            return;
        }

        const location = await Location.getCurrentPositionAsync({});
        setLocation(location.coords);
    };

    const deletarEndereco = async (id: string) => {
        showCustomAlert('Confirmar exclusão', 'Tem certeza que deseja excluir este endereço?', async () => {
            const { error } = await supabase.from('enderecos').delete().eq('id', id);
            if (error) {
                console.error(error);
                showCustomAlert('Erro', 'Não foi possível excluir o endereço.');
            } else {
                carregarEnderecos();
                showCustomAlert('Sucesso', 'Endereço excluído com sucesso!');
            }
        });
    };

    const adicionarEndereco = async () => {
        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser();

        if (!user || userError) {
            showCustomAlert('Erro', 'Não foi possível identificar o usuário.');
            return;
        }

        if (!novoEndereco || !tipoSelecionado || !location) {
            showCustomAlert('Atenção', 'Preencha todos os campos e obtenha a localização.');
            return;
        }

        const { error } = await supabase.from('enderecos').insert([
            {
                user_id: user.id,
                tipo: tipoSelecionado,
                endereco: novoEndereco,
                latitude: location.latitude,
                longitude: location.longitude,
            },
        ]);

        if (error) {
            console.error(error);
            showCustomAlert('Erro', 'Não foi possível salvar o endereço.');
        } else {
            carregarEnderecos();
            setNovoEndereco('');
            setTipoSelecionado('');
            setModalVisible(false);
            showCustomAlert('Sucesso', 'Endereço adicionado com sucesso!');
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar style="auto" />
            <View style={styles.header}>
                <TouchableOpacity onPress={goToHome}>
                    <MaterialCommunityIcons name="arrow-left" size={28} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Meus Endereços</Text>
                <TouchableOpacity>
                    <MaterialCommunityIcons name="arrow-left" size={28} color="white" />
                </TouchableOpacity>
            </View>

            <FlatList
                data={enderecos}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <View>
                            <Text style={styles.tipoTexto}>
                                {tipoIcones[item.tipo]} <Text style={styles.tipoLabel}>{item.tipo}</Text>
                            </Text>
                            <Text style={styles.enderecoTexto}>{item.endereco}</Text>
                        </View>
                        <TouchableOpacity onPress={() => deletarEndereco(item.id)}>
                            <Ionicons name="trash" size={24} color="red" />
                        </TouchableOpacity>
                    </View>
                )}
            />

            <TouchableOpacity
                style={styles.fab}
                onPress={async () => {
                    setModalVisible(true);
                    await obterLocalizacao();
                }}
            >
                <AntDesign name="pluscircle" size={60} color="#007BFF" />
            </TouchableOpacity>

            <Modal visible={modalVisible} animationType="slide" transparent>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    style={styles.modalBackground}
                >
                    <ScrollView contentContainerStyle={styles.modalContainer}>
                        <TouchableOpacity style={styles.closeIcon} onPress={() => setModalVisible(false)}>
                            <Ionicons name="close" size={24} color="#333" />
                        </TouchableOpacity>

                        <Text style={styles.modalTitulo}>Tipo de Endereço:</Text>

                        {tiposEndereco.map((tipo) => (
                            <TouchableOpacity key={tipo} onPress={() => setTipoSelecionado(tipo)} style={styles.tipoBotao}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    {tipoIcones[tipo]}
                                    <Text
                                        style={[
                                            styles.tipoTexto,
                                            {
                                                color: tipoSelecionado === tipo ? '#007BFF' : '#333',
                                                marginLeft: 8,
                                            },
                                        ]}
                                    >
                                        {tipo}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        ))}

                        <TextInput
                            placeholder="selecione no mapa"
                            value={novoEndereco}
                            onChangeText={setNovoEndereco}
                            style={styles.input}
                            placeholderTextColor="#999"
                            editable={false}
                        />

                        <TouchableOpacity
                            style={styles.mapa}
                            onPress={() => setMapaVisible(true)}
                        >
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <MaterialIcons name="location-on" size={20} color="#007BFF" />
                                <Text style={styles.mapText}>Selecionar no mapa</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.adicionarEnderecoButton}
                            onPress={adicionarEndereco}
                        >
                            <Text style={styles.addToCartText}>Salvar!</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </KeyboardAvoidingView>
            </Modal>

            <MapaModal
                visible={mapaVisible}
                onClose={() => setMapaVisible(false)}
                onConfirm={(coords) => {
                    setLocation(coords);
                    setNovoEndereco(`Lat: ${coords.latitude.toFixed(6)}, Lng: ${coords.longitude.toFixed(6)}`);
                    setMapaVisible(false);
                    showCustomAlert('Localização selecionada!', `Lat: ${coords.latitude}, Lng: ${coords.longitude}`);
                }}
            />

            <CustomAlert
                visible={alertVisible}
                title={alertTitle}
                message={alertMessage}
                showCancel={alertShowCancel}
                onCancel={() => setAlertVisible(false)}
                onConfirm={() => {
                    setAlertVisible(false);
                    alertOnConfirm && alertOnConfirm();
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        backgroundColor: '#fff',
        flexGrow: 1,
    },

    header: {
        backgroundColor: 'white',
        paddingHorizontal: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontFamily: "Wellfleet",
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 28,
        fontFamily: "Wellfleet",
        color: '#000000',
    },

    adicionarEnderecoButton: {
        backgroundColor: 'green',
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 5,
        marginBottom: 5
    },

    CancelarEnderecoButton: {
        backgroundColor: 'red',
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 5,
        marginBottom: 5
    },

    addToCartText: {
        color: '#fff',
        fontSize: 16,
        marginRight: 8,
        fontFamily: "Wellfleet",
    },
    checkIcon: {
        marginLeft: 4,
    },
    card: {
        padding: 15,
        backgroundColor: '#f2f2f2',
        marginBottom: 12,
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    tipoTexto: {
        fontSize: 16,
        fontFamily: 'Wellfleet-Regular',
    },
    tipoLabel: {
        marginLeft: 4,
    },
    enderecoTexto: {
        fontFamily: 'Wellfleet-Regular',
        marginTop: 4,
        color: '#444',
    },
    coordTexto: {
        fontSize: 12,
        color: '#777',
        fontFamily: 'Wellfleet-Regular',
        marginTop: 4,
    },
    modalBackground: {
        flex: 1,
        backgroundColor: '#000000aa',
        justifyContent: 'center',
        padding: 20,
    },
    modalContainer: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
    },
    modalTitulo: {
        fontSize: 18,
        marginBottom: 10,
        fontFamily: 'Wellfleet-Regular',
    },
    tipoBotao: {
        padding: 10,
        borderRadius: 6,
        backgroundColor: '#f0f0f0',
        marginBottom: 6,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginTop: 10,
        marginBottom: 5,
        fontFamily: 'Wellfleet-Regular',
    },
    fab: {
        position: 'absolute',
        bottom: 30,
        right: 30,
    },

    closeIcon: {
        position: 'absolute',
        top: 16,
        right: 16,
        zIndex: 10,
    },

    mapa: {
        backgroundColor: '#F0F0F0',
        padding: 12,
        borderRadius: 8,
        marginBottom: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },

    mapText: {
        fontSize: 16,
        color: '#007BFF',
        marginLeft: 5,
        fontWeight: '600',
        fontFamily: 'Wellfleet-Regular',
    },
});
