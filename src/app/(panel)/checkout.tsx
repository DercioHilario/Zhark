import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, TextInput, Modal, Dimensions, BackHandler } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCartStore } from '../../stores/cartStore';
import { Trash2, Plus, Minus } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../../constants/supabaseClient';
import { Checkbox } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { CustomAlert } from '../../../constants/CustomAlert';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import LocalModal from '../../../constants/local';


interface CartItem {
    id: number;
    nome: string;
    preço: string;
    descrição: string;
    imagem: string;
    imagens: string[];
    quantity: number;
    tempo_entrega_minutos: number;
}

export default function CartScreen() {
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertTitle, setAlertTitle] = useState('');
    const [alertOnConfirm, setAlertOnConfirm] = useState<(() => void) | undefined>(undefined);
    const [alertShowCancel, setAlertShowCancel] = useState(false);
    const { items, removeFromCart, updateQuantity } = useCartStore();
    const [userPoints, setUserPoints] = useState<number>(0);
    const [userId, setUserId] = useState<string | null>(null);
    const router = useRouter();
    const [sendToAnotherPerson, setSendToAnotherPerson] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        senderName: '',
        senderPhone: '',
        recebName: '',
        recipientName: '',
        recipientPhone: '',
        deliveryLocation: '',
        locationReference: '',
        customMessage: '',
        location: ''
    });

    const [isMapModalVisible, setIsMapModalVisible] = useState(false);

    const onSelectAddress = (address: string) => {
        if (sendToAnotherPerson) {
            setFormData({ ...formData, location: address });
        } else {
            setFormData({ ...formData, deliveryLocation: address });
        }
        setIsMapModalVisible(false);
    };

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user }, error } = await supabase.auth.getUser();
            if (error || !user) return;
            setUserId(user.id);
            fetchUserPoints(user.id);
        };

        fetchUser();
    }, []);

    useEffect(() => {
        const backAction = () => {
            if (showModal) {
                setShowModal(false); // Fecha o modal
                return true; // Evita o comportamento padrão de sair do app
            }
            return false;
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction
        );

        return () => backHandler.remove(); // Limpa o listener
    }, [showModal]);

    const fetchUserPoints = async (id: string) => {
        const { data, error } = await supabase
            .from('users')
            .select('points')
            .eq('id', id)
            .single();

        if (!error && data?.points !== undefined) {
            setUserPoints(data.points);
        }
    };

    const handleIncreaseQuantity = (item: CartItem) => {
        updateQuantity(item.id, item.quantity + 1);
    };

    const handleDecreaseQuantity = (item: CartItem) => {
        if (item.quantity > 1) {
            updateQuantity(item.id, item.quantity - 1);
        }
    };

    const handleRemoveItem = (item: CartItem) => {
        removeFromCart(item.id);
    };

    const total = items.reduce((sum, item) => {
        const rawPrice = item.preço?.replace(' Z-coins ', '');
        const price = parseFloat(rawPrice);
        if (isNaN(price)) return sum;
        return sum + price * item.quantity;
    }, 0);

    const handleConfirmCheckout = () => {

        setShowModal(false);
        handleCheckout();
    };

    const isFormValid = () => {
        if (sendToAnotherPerson) {
            return (
                formData.senderName?.trim() &&
                formData.recebName?.trim() &&
                formData.senderPhone?.trim() &&
                formData.location?.trim()
            );
        } else {
            return (
                formData.recipientName?.trim() &&
                formData.recipientPhone?.trim() &&
                formData.deliveryLocation?.trim()
            );
        }
    };


    const showCustomAlert = (title: string, message: string, onConfirm?: () => void, showCancel = false) => {
        setAlertTitle(title);
        setAlertMessage(message);
        setAlertOnConfirm(() => onConfirm);
        setAlertShowCancel(showCancel);
        setAlertVisible(true);
    };

    const handleCheckout = async () => {
        if (!userId) {
            showCustomAlert('Erro', 'Usuário não identificado.');
            return;
        }

        const requiredPoints = Math.floor(total);

        if (userPoints < requiredPoints) {
            showCustomAlert(
                'Pontos Insuficientes',
                'Você não tem pontos suficientes para finalizar a compra.\n\nGostaria de recarregar?',
                () => router.push('/(categorias)/(Perfil)/RecargaPontos'),
                true
            );
            return;
        }

        const cartItems = useCartStore.getState().items;

        // Tempo estimado baseado em cada produto e sua quantidade

        const estimatedDelivery = cartItems.reduce((maxTime, item) => {
            const itemTime = Number(item.tempo_entrega_minutos) || 0;
            const itemDeliveryTime = itemTime * item.quantity;
            return Math.max(maxTime, itemDeliveryTime);
        }, 0);

        const items = cartItems.map(item => ({
            id: item.id,
            nome: item.nome,
            quantidade: item.quantity,
            preço: item.preço,
            tempo_entrega_minutos: item.tempo_entrega_minutos,
        }));

        const itemsJson = JSON.stringify(items);

        // Inserir pedido no banco de dados
        const { error: insertError } = await supabase.from('pedidos').insert({
            user_id: userId,
            items: itemsJson,
            total: requiredPoints,
            status: 'pendente',
            tempo_entrega_minutos: estimatedDelivery.toString(), // conversão aqui
            created_at: new Date().toISOString(),
        });

        if (insertError) {
            console.error('Erro ao salvar pedido:', insertError);
            showCustomAlert('Erro', 'Não foi possível salvar o pedido.');
            return;
        }

        // Atualiza os pontos do usuário
        const newPoints = userPoints - requiredPoints;
        const { error: updateError } = await supabase
            .from('users')
            .update({ points: newPoints })
            .eq('id', userId);

        if (updateError) {
            showCustomAlert('Erro', 'Não foi possível atualizar os pontos.');
            return;
        }

        setUserPoints(newPoints);

        showCustomAlert(
            'Sucesso',
            `Pedido realizado! Entrega estimada em ${estimatedDelivery} minutos.`,
            () => {
                useCartStore.getState().clearCart();
            }
        );
    };



    if (items.length === 0) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Meu Carrinho</Text>
                </View>
                <View style={styles.emptyContainer}>
                    <Image
                        source={require('../../../assets/img/empty.gif')}
                        style={styles.emptyImage}
                        resizeMode="contain"
                    />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Meu Carrinho</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
                {items.map((item: CartItem) => (
                    <View key={`${item.id}`} style={styles.cartItems}>
                        <View style={styles.cartItem}>
                            <Image source={{ uri: item.imagem }} style={styles.itemImage} />
                            <View style={styles.itemDetails}>
                                <View style={styles.cartItemHeader}>
                                    <Text style={styles.itemName} numberOfLines={1} ellipsizeMode="tail">
                                        {item.nome}
                                    </Text>
                                    <TouchableOpacity onPress={() => handleRemoveItem(item)} style={styles.removeButton}>
                                        <Trash2 size={24} color="#FF4444" />
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.quantityContainer}>
                                    <View style={styles.quantityControls}>
                                        <TouchableOpacity
                                            style={styles.quantityButton}
                                            onPress={() => handleDecreaseQuantity(item)}
                                        >
                                            <Minus size={20} color="#000000" />
                                        </TouchableOpacity>
                                        <Text style={styles.quantityText}>{item.quantity}</Text>
                                        <TouchableOpacity
                                            style={styles.quantityButton}
                                            onPress={() => handleIncreaseQuantity(item)}
                                        >
                                            <Plus size={20} color="#000000" />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                ))}
            </ScrollView>

            <View style={styles.cartFooter}>
                <View style={styles.totalContainer}>
                    <Text style={styles.totalLabel}>Total:</Text>
                    <Text style={styles.totalAmount}>
                        {total.toFixed(0)} Z-coins
                    </Text>
                </View>
                <TouchableOpacity style={styles.checkoutButton} onPress={() => setShowModal(true)}>
                    <Text style={styles.checkoutText}>Finalizar Compra</Text>
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
                    <Checkbox
                        status={sendToAnotherPerson ? 'checked' : 'unchecked'}
                        onPress={() => setSendToAnotherPerson(!sendToAnotherPerson)}
                        color="#1de8ff"
                    />
                    <Text onPress={() => setSendToAnotherPerson(!sendToAnotherPerson)} style={styles.sendToOtherText} >
                        Marque se o pedido é para outra pessoa.
                    </Text>
                </View>
            </View>

            <Modal
                visible={showModal}
                animationType="fade"
                transparent={true}
                onRequestClose={() => setShowModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>

                        {/* Botão de fechar */}
                        <TouchableOpacity
                            onPress={() => setShowModal(false)}
                            style={styles.closeButton}
                        >
                            <Ionicons name="close" size={28} color="black" />
                        </TouchableOpacity>

                        <Text style={styles.modalTitle}>Detalhes da Entrega</Text>

                        {sendToAnotherPerson ? (
                            <>
                                <Text style={styles.label}>Nome do Comprador:</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Teu nome completo"
                                    value={formData.senderName}
                                    onChangeText={(text) =>
                                        setFormData({ ...formData, senderName: text })
                                    }
                                />

                                <Text style={styles.label}>Nome do Destinatário:</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="(quem vai receber o pedido)"
                                    value={formData.recebName}
                                    onChangeText={(text) =>
                                        setFormData({ ...formData, recebName: text })
                                    }
                                />

                                <Text style={styles.label}>Telefone do Destinatário:</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Número de quem recebe"
                                    keyboardType="phone-pad"
                                    value={formData.senderPhone}
                                    onChangeText={(text) =>
                                        setFormData({ ...formData, senderPhone: text })
                                    }
                                />

                                <Text style={styles.label}>Local da Entrega:</Text>
                                <View style={styles.inputWithIcon}>
                                    <TextInput
                                        style={styles.inputFlex}
                                        placeholder="Selecione a localização  👉"
                                        value={formData.location}
                                        onChangeText={(text) =>
                                            setFormData({ ...formData, location: text })
                                        }
                                        editable={false}
                                    />
                                    <TouchableOpacity onPress={() => setIsMapModalVisible(true)}>
                                        <FontAwesome5 name="map-marked-alt" size={24} color="black" />
                                    </TouchableOpacity>
                                </View>

                                <Text style={styles.label}>Mensagem personalizada (opcional):</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Exemplo: “Feliz aniversário!”"
                                    value={formData.customMessage}
                                    onChangeText={(text) =>
                                        setFormData({ ...formData, customMessage: text })
                                    }
                                />
                            </>
                        ) : (
                            <>
                                <Text style={styles.label}>Nome Completo:</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Nome de quem envia"
                                    value={formData.recipientName}
                                    onChangeText={(text) =>
                                        setFormData({ ...formData, recipientName: text })
                                    }
                                />

                                <Text style={styles.label}>Número de Telefone:</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Número de quem envia"
                                    keyboardType="phone-pad"
                                    value={formData.recipientPhone}
                                    onChangeText={(text) =>
                                        setFormData({ ...formData, recipientPhone: text })
                                    }
                                />

                                <Text style={styles.label}>Local da Entrega:</Text>
                                <View style={styles.inputWithIcon} >
                                    <TextInput
                                        style={styles.inputFlex}
                                        placeholder="Selecione a localização  👉"
                                        value={formData.deliveryLocation}
                                        onChangeText={(text) =>
                                            setFormData({ ...formData, deliveryLocation: text })
                                        }
                                        editable={false}
                                    />
                                    <TouchableOpacity onPress={() => setIsMapModalVisible(true)}>
                                        <FontAwesome5 name="map-marked-alt" size={24} color="black" />
                                    </TouchableOpacity>
                                </View>

                                <Text style={styles.label}>Referência:</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Referência de localização (opcional)"
                                    value={formData.locationReference}
                                    onChangeText={(text) =>
                                        setFormData({ ...formData, locationReference: text })
                                    }
                                />
                            </>
                        )}

                        {/* Botão de confirmação */}
                        <TouchableOpacity
                            style={[
                                styles.confirmButton,
                                { backgroundColor: isFormValid() ? '#28a745' : '#aaa' },
                            ]}
                            disabled={!isFormValid()}
                            onPress={handleConfirmCheckout}
                        >
                            <Text style={styles.confirmText}>Confirmar</Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </Modal>

            {/* Modal de mapa */}
            {typeof userId === 'string' && (
                <LocalModal
                    visible={isMapModalVisible}
                    onClose={() => setIsMapModalVisible(false)}
                    userId={userId}
                    onSelect={onSelectAddress}
                />
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
        </SafeAreaView>
    );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        backgroundColor: '#fff',
    },
    headerTitle: {
        fontSize: 24,
        color: '#000',
        fontFamily: 'Wellfleet',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyImage: {
        height: width * 0.6,
        width: width * 0.5,
        marginBottom: 100,
        resizeMode: 'contain',
    },
    title: {
        fontSize: 22,
        paddingVertical: 10,
        textAlign: 'center',
        fontFamily: 'Wellfleet',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    cartItems: {
        flex: 1,
        paddingHorizontal: 12,
    },
    cartItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 8,
        marginVertical: 5,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        height: 110,
    },
    itemImage: {
        width: width * 0.25,
        height: '100%',
        borderRadius: 10,
        resizeMode: 'contain',
    },
    itemDetails: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'space-between',
    },
    itemName: {
        fontSize: 16,
        marginBottom: 4,
        fontWeight: '600',
        fontFamily: 'Wellfleet',
        marginRight: 1,
        flex: 1,
    },

    itemPrice: {
        fontSize: 15,
        color: '#666',
        fontWeight: '600',
        fontFamily: 'Wellfleet',
    },
    cartItemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    removeButton: {
        bottom: 8,
        padding: 5,
        left: 5,
    },
    quantityContainer: {
        marginTop: 8,
    },
    quantityControls: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    quantityButton: {
        padding: 8,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
    },
    quantityText: {
        fontSize: 16,
        fontFamily: 'Wellfleet',
    },
    cartFooter: {
        paddingTop: 12,
        paddingHorizontal: 12,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        backgroundColor: '#fff',
    },
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    totalLabel: {
        fontSize: 18,
        fontFamily: 'Wellfleet',
    },
    totalAmount: {
        fontSize: 18,
        fontFamily: 'Wellfleet',
        color: '#1de8ff',
    },
    checkoutButton: {
        backgroundColor: '#1de8ff',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    checkoutText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'Wellfleet',
    },
    sendToOtherText: {
        marginLeft: 1,
        fontSize: 12,
        color: '#333',
        flex: 1,
        fontFamily: 'Wellfleet',
    },


    // MODAL
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
    },
    modalContainer: {
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontFamily: 'Wellfleet',
        marginBottom: 10,
        textAlign: 'center',
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: 'black',
        marginBottom: 5,
        fontFamily: "Wellfleet",
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
        fontFamily: "Wellfleet",
    },
    confirmButton: {
        marginTop: 10,
        padding: 14,
        borderRadius: 8,
        alignItems: 'center'
    },
    confirmText: {
        color: '#fff',
        fontSize: 18,
        fontFamily: 'Wellfleet',
    },

    inputWithIcon: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        paddingHorizontal: 10,
        marginBottom: 10,
        borderColor: '#ccc',
        borderRadius: 8,
        fontFamily: 'Wellfleet',
    },

    inputFlex: {
        flex: 1,
        fontFamily: 'Wellfleet',
    },

    closeButton: {
        position: 'absolute',
        right: 10,
        top: 10,
        zIndex: 10,
    },

});
