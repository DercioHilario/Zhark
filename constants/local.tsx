import React, { useEffect, useState } from 'react';
import { Modal, View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../constants/supabaseClient';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { BackHandler } from 'react-native';


type Endereco = {
    id: string;
    user_id: string;
    tipo: string;
    endereco: string;
};

type LocalModalProps = {
    visible: boolean;
    onClose: () => void;
    userId: string;
    onSelect: (address: string) => void;  // nova prop para selecionar endereço
};

const tipoParaIcone = (tipo: string) => {
    switch (tipo.toLowerCase()) {
        case 'casa':
            return <Ionicons name="home" size={24} color="#333" />;
        case 'trabalho':
            return <MaterialCommunityIcons name="briefcase" size={24} color="#333" />;
        case 'faculdade':
            return <Ionicons name="school" size={24} color="#333" />;
        case 'gym':
            return <MaterialCommunityIcons name="dumbbell" size={24} color="#333" />;
        case 'amigo/a':
            return <FontAwesome5 name="users" size={24} color="#333" />;
        case 'namorado/a':
            return <FontAwesome5 name="heart" size={24} color="#333" />;
        default:
            return <Ionicons name="location" size={24} color="#333" />;
    }
};

const LocalModal: React.FC<LocalModalProps> = ({ visible, onClose, userId, onSelect }) => {
    const [enderecos, setEnderecos] = useState<Endereco[]>([]);
    const router = useRouter();

    useEffect(() => {
        if (visible && userId) {
            fetchEnderecos();
        }
    }, [visible, userId]);

    useEffect(() => {
        if (visible && userId) {
            fetchEnderecos();

            const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
                onClose();
                return true;
            });

            return () => backHandler.remove();
        }
    }, [visible, userId]);


    const fetchEnderecos = async () => {
        const { data, error } = await supabase
            .from('enderecos')
            .select('*')
            .eq('user_id', userId);

        if (error) {
            console.error('Erro ao buscar endereços:', error.message);
            setEnderecos([]);
        } else {
            setEnderecos(data ?? []);
        }
    };

    const irParaAdicionarEndereco = () => {
        onClose();
        router.push('/(categorias)/(Perfil)/Localizacao');
    };

    // Função para lidar com a seleção do endereço
    const handleSelectEndereco = (endereco: string) => {
        onSelect(endereco);
        onClose();
    };

    return (
        <Modal visible={visible} animationType="slide" transparent={true}>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>

                    <TouchableOpacity onPress={onClose} style={styles.botaoFecharTopo}>
                        <Ionicons name="close" size={28} color="#333" />
                    </TouchableOpacity>

                    <Text style={styles.titulo}>Seus Endereços</Text>

                    <FlatList
                        data={enderecos}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.itemEndereco}
                                onPress={() => handleSelectEndereco(item.endereco)}
                            >
                                {tipoParaIcone(item.tipo)}
                                <Text style={styles.textoEndereco}>{item.endereco}</Text>
                            </TouchableOpacity>
                        )}
                        ListEmptyComponent={
                            <Text style={styles.vazio}>Nenhum endereço adicionado.</Text>
                        }
                    />

                    <TouchableOpacity style={styles.botaoAdicionar} onPress={irParaAdicionarEndereco}>
                        <Ionicons name="add-circle" size={22} color="#fff" />
                        <Text style={styles.textoBotao}>Adicionar novo endereço</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
    },
    modalContainer: {
        width: '90%',
        maxHeight: '80%',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
    },
    titulo: {
        fontSize: 20,
        marginBottom: 15,
        textAlign: 'center',
        fontFamily: 'Wellfleet',
    },
    itemEndereco: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 10,
        backgroundColor: '#f2f2f2',
        borderRadius: 10,
        marginVertical: 4,
        gap: 10,
    },

    textoEndereco: {
        fontSize: 15,
        color: '#333',
        fontFamily: 'Wellfleet',
    },
    vazio: {
        marginTop: 20,
        textAlign: 'center',
        fontStyle: 'italic',
        color: '#999',
        fontFamily: 'Wellfleet',
    },
    botaoAdicionar: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#007AFF',
        borderRadius: 8,
        padding: 12,
        justifyContent: 'center',
    },
    textoBotao: {
        color: '#fff',
        marginLeft: 10,
        fontFamily: 'Wellfleet',
    },
    botaoFecharTopo: {
        position: 'absolute',
        top: 10,
        left: 10,
        zIndex: 10,
    },
});

export default LocalModal;
