import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { supabase } from '@/constants/supabaseClient';
import { userAuth } from '@/src/contexts/AuthContext';
import { CustomAlert } from '../../../../constants/CustomAlert';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter, useFocusEffect } from 'expo-router';

interface Item {
    id: string;
    nome: string;
    quantidade: number;
    preço: number;
    tempo_entrega_minutos: number;
    topico?: string;
    tipo_aula?: string;
    subcategoria?: string;
    categoria?: string;
}

interface Pedido {
    id: string;
    user_id: string;
    total: number;
    status: string;
    tempo_entrega_minutos: number;
    created_at: string;
    items: Item[] | null;
}

export default function MeusPedidos() {
    const { user: contextUser } = userAuth();
    const [userId, setUserId] = useState<string | null>(null);
    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const [tick, setTick] = useState(0);
    const [loading, setLoading] = useState(true);
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertTitle, setAlertTitle] = useState('');
    const [alertOnConfirm, setAlertOnConfirm] = useState<(() => void) | undefined>(undefined);
    const [alertShowCancel, setAlertShowCancel] = useState(false);

    const showCustomAlert = (title: string, message: string, onConfirm?: () => void, showCancel = false) => {
        setAlertTitle(title);
        setAlertMessage(message);
        setAlertOnConfirm(() => onConfirm);
        setAlertShowCancel(showCancel);
        setAlertVisible(true);
    };

    const router = useRouter();
    const goToHome = useCallback(() => {
        router.replace('/(panel)/inicio');
    }, [router]);

    useEffect(() => {
        const loadUser = async () => {
            if (contextUser) {
                setUserId(contextUser.id);
            } else {
                const { data: { user }, error } = await supabase.auth.getUser();
                if (!error && user) setUserId(user.id);
            }
        };
        loadUser();
    }, [contextUser]);

    const fetchPedidos = useCallback(async (uid: string) => {
        setLoading(true);
        const { data, error } = await supabase
            .from('pedidos')
            .select('*')
            .eq('user_id', uid)
            .order('created_at', { ascending: false });

        if (!error) {
            const pedidosComItems = (data || []).map(p => ({
                ...p,
                items: Array.isArray(p.items)
                    ? p.items
                    : typeof p.items === 'string'
                        ? JSON.parse(p.items)
                        : [],
            }));
            setPedidos(pedidosComItems);
        } else {
            console.error('Erro ao buscar pedidos:', error.message);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        if (userId) fetchPedidos(userId);
    }, [userId, fetchPedidos]);

    // Atualiza o tick a cada segundo para atualizar timers
    useEffect(() => {
        const interval = setInterval(() => setTick(t => t + 1), 1000);
        return () => clearInterval(interval);
    }, []);

    // Calcula o tempo restante da entrega
    const calcularTempoRestante = (createdAt: string, minutos: number) => {
        const criado = new Date(createdAt).getTime();
        const agora = Date.now();
        const prazo = criado + minutos * 60 * 1000;
        const restante = prazo - agora;
        const segundosTotais = Math.max(0, Math.floor(restante / 1000));
        return {
            minutos: Math.floor(segundosTotais / 60),
            segundos: segundosTotais % 60,
        };
    };

    // Remove um pedido pelo ID
    const handleRemovePedido = async (pedidoId: string) => {
        try {
            const { error } = await supabase
                .from('pedidos')
                .delete()
                .eq('id', pedidoId);

            if (error) {
                console.error('Erro ao deletar pedido:', error.message);
                showCustomAlert('Erro', 'Não foi possível remover o pedido.');
                return;
            }

            setPedidos(prev => prev.filter(p => p.id !== pedidoId));
        } catch (err) {
            console.error('Erro inesperado:', err);
            showCustomAlert('Erro', 'Erro inesperado ao remover pedido.');
        }
    };

    // Marca atraso e aumenta tempo de entrega
    const handleAtraso = async (pedidoId: string) => {
        showCustomAlert(
            "Desculpe pela demora!", "Sua entrega está a caminho e chegará em instantes."
        );

        const pedido = pedidos.find(p => p.id === pedidoId);
        if (!pedido) return;

        const novoTempo = 10; // 10 minutos fixos para reiniciar o timer
        const agoraISO = new Date().toISOString(); // horário atual em ISO para 'created_at'

        const { error } = await supabase
            .from('pedidos')
            .update({ tempo_entrega_minutos: novoTempo, created_at: agoraISO }) // Atualiza também o created_at
            .eq('id', pedidoId);

        if (error) {
            console.error('Erro ao atualizar o tempo de entrega:', error.message);
            return;
        }

        setPedidos(prev =>
            prev.map(p =>
                p.id === pedidoId
                    ? { ...p, tempo_entrega_minutos: novoTempo, created_at: agoraISO }
                    : p
            )
        );
    };


    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="auto" />
            <View style={styles.header}>
                <TouchableOpacity onPress={goToHome}>
                    <MaterialCommunityIcons name="arrow-left" size={28} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Meus Pedidos</Text>
                <TouchableOpacity>
                    <MaterialCommunityIcons name="arrow-left" size={28} color="white" />
                </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#4CAF50" />
                        <Text style={styles.loadingText}>Carregando...</Text>
                    </View>
                ) : pedidos.length === 0 ? (
                    <Text style={styles.noOrders}>Nenhum pedido encontrado.</Text>
                ) : (
                    pedidos.map((pedido) => {
                        const tempo = calcularTempoRestante(pedido.created_at, pedido.tempo_entrega_minutos);
                        const tempoEncerrado = tempo.minutos === 0 && tempo.segundos === 0;

                        return (
                            <View key={pedido.id} style={styles.pedidoBox}>
                                <Text style={styles.text}><Text style={styles.label}>Total:</Text> {pedido.total} pontos</Text>
                                <Text style={styles.text}><Text style={styles.label}>Status:</Text> {pedido.status}</Text>
                                <Text style={styles.text}>
                                    <Text style={styles.label}>
                                        {tempoEncerrado ? 'Tempo encerrado!' : 'Tempo restante:'}
                                    </Text>{' '}
                                    {!tempoEncerrado && `${tempo.minutos}m ${tempo.segundos}s`}
                                </Text>

                                <Text style={styles.label}>Itens:</Text>
                                {pedido.items && pedido.items.length > 0 ? (
                                    pedido.items.map((item, index) => {
                                        const temNomeEQuantidade = item.nome && item.quantidade;
                                        return (
                                            <Text key={item.id || index} style={styles.text}>
                                                {temNomeEQuantidade ? (
                                                    `${item.nome} x ${item.quantidade} - ${item.preço || 'N/A'} pontos`
                                                ) : (
                                                    <>
                                                        {item.topico ? (
                                                            `Tópico: ${item.topico}`
                                                        ) : (
                                                            `Categoria: ${item.categoria || 'Não especificado'} | ${item.subcategoria || 'Não especificado'}`
                                                        )}
                                                        {item.tipo_aula ? ` | ${item.tipo_aula}` : ''}
                                                    </>
                                                )}
                                            </Text>
                                        );
                                    })
                                ) : (
                                    <Text style={styles.text}>Nenhum item</Text>
                                )}


                                {tempoEncerrado && (
                                    <View>
                                        <Text style={styles.TextPergunta}>A sua encomenda já chegou?</Text>
                                        <View style={styles.buttonsRow}>
                                            <TouchableOpacity
                                                onPress={() => handleRemovePedido(pedido.id)}
                                                style={styles.buttonSim}
                                            >
                                                <Text style={styles.buttonText}>Sim</Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                onPress={() => handleAtraso(pedido.id)}
                                                style={styles.buttonNao}
                                            >
                                                <Text style={styles.buttonText}>Não</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )}
                            </View>
                        );
                    })
                )}


                {/* Custom Alert */}
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
            </ScrollView>
        </SafeAreaView>
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
    },
    headerTitle: {
        fontSize: 28,
        fontFamily: "Wellfleet",
        color: '#000000',
    },

    scrollContainer: {
        padding: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        fontFamily: 'Wellfleet',
        fontSize: 16,
        color: '#555',
    },
    title: {
        fontSize: 24,
        fontFamily: 'Wellfleet-Regular',
        color: '#222',
        textAlign: 'center',
    },
    noOrders: {
        fontSize: 16,
        fontFamily: 'Wellfleet-Regular',
        color: '#999',
        textAlign: 'center',
        marginTop: 40,
    },
    pedidoBox: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 15,
        marginBottom: 15,
        borderRadius: 10,
        backgroundColor: '#fafafa',
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 1,
    },
    text: {
        fontSize: 16,
        fontFamily: 'Wellfleet-Regular',
        color: '#888',
        marginBottom: 6,
    },
    label: {
        fontFamily: 'Wellfleet-Regular',
        color: '#000',
    },
    buttonsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
        gap: 12,
    },
    buttonSim: {
        flex: 1,
        paddingVertical: 12,
        backgroundColor: '#4CAF50',
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonNao: {
        flex: 1,
        paddingVertical: 12,
        backgroundColor: '#f44336',
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontFamily: 'Wellfleet-Regular',
    },

    TextPergunta: {
        color: 'black',
        textAlign: 'center',
        fontFamily: 'Wellfleet-Regular',
    }
});
