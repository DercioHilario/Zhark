import { View, Text, TouchableOpacity, TextInput, FlatList, Image, Modal, ActivityIndicator, BackHandler } from "react-native";
import React, { useState, useCallback, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { useRouter, useFocusEffect } from "expo-router";
import { Search, X, ChevronRight, Calculator } from "lucide-react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import styles from "../Style/sevico";
import { supabase } from '../../../constants/supabaseClient';
import ConfirmarPedidoModal from '../../../components/ConfirmarPedidoModal';
import LocalModal from '../../../constants/local';
import { CustomAlert } from '../../../constants/CustomAlert';

type Category = {
    id: number;
    nome: string;
    imagem: string;
    subcategories: Subcategory[];
};

type Subcategory = {
    id: number;
    nome: string;
};

type Question = {
    id: string;
    question: string;
    options: Option[];
};

type Option = {
    id: number;
    option_text: string;
};

export default function ServicesScreen() {
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [showCalculation, setShowCalculation] = useState(false);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [calculationDetails, setCalculationDetails] = useState({
        basePrice: 0,
        additionalFees: [] as { description: string; value: number }[],
        total: 0
    });
    const [searchQuery, setSearchQuery] = useState("");
    const [categories, setCategories] = useState<Category[]>([]);
    const [filteredCategories, setFilteredCategories] = useState<Category[]>([]); // Estado para categorias filtradas
    const additionalFees: { description: string; value: number }[] = [];
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const [userPoints, setUserPoints] = useState<number>(0);
    const [userId, setUserId] = React.useState<string | null>(null);
    const [totalPrice, setTotalPrice] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [isMapModalVisible, setIsMapModalVisible] = useState(false);
    const [deliveryLocation, setDeliveryLocation] = useState('');
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertTitle, setAlertTitle] = useState('');
    const [alertOnConfirm, setAlertOnConfirm] = useState<(() => void) | undefined>(undefined);
    const [alertShowCancel, setAlertShowCancel] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchUserPoints = async (id: string) => {
        const { data, error } = await supabase
            .from('users')
            .select('points')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Erro ao buscar pontos do usuário:', error);
            return;
        }

        if (data) {
            setUserPoints(data.points);
        }
    };

    useEffect(() => {
        const getUser = async () => {
            const {
                data: { user },
                error,
            } = await supabase.auth.getUser();

            if (error) {
                console.error('Erro ao obter usuário:', error);
                return;
            }

            if (user) {
                setUserId(user.id);
                fetchUserPoints(user.id);
            }
        };

        getUser();
    }, []);


    useEffect(() => {
        // Filtra as categorias que possuem subcategorias que correspondem à pesquisa
        if (searchQuery) {
            const filtered = categories.filter((category) =>
                category.subcategories.some((subcategory) =>
                    subcategory.nome.toLowerCase().includes(searchQuery.toLowerCase())
                )
            );
            setFilteredCategories(filtered);
        } else {
            setFilteredCategories(categories);
        }
    }, [searchQuery, categories]);

    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                // Redireciona para a tela anterior
                router.replace('/(panel)/inicio'); // ou router.push() se preferir empilhar
                return true; // evita que o app feche
            };

            const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

            return () => subscription.remove();
        }, [])
    );

    const showCustomAlert = (title: string, message: string, onConfirm?: () => void, showCancel = false) => {
        setAlertTitle(title);
        setAlertMessage(message);
        setAlertOnConfirm(() => onConfirm);
        setAlertShowCancel(showCancel);
        setAlertVisible(true);
    };

    const fetchCategories = async () => {
        setIsLoading(true); // Inicia carregamento
        const { data, error } = await supabase
            .from('categories')
            .select('id, nome, imagem, subcategories (id, nome)');

        if (error) {
            console.error('Erro ao buscar categorias:', error);
        } else {
            setCategories(data as Category[]);
        }

        setIsLoading(false); // Finaliza carregamento
    };

    const fetchQuestions = async (subcategoryId: number) => {
        const { data, error } = await supabase
            .from('questions')
            .select('id, question, options (id, option_text)')
            .eq('subcategory_id', subcategoryId);

        if (error) {
            console.error('Erro ao buscar perguntas:', error);
        } else {
            setQuestions(data || []);
        }
    };

    const calculateServicePrice = async () => {
        const { data, error } = await supabase
            .from('service_pricing')
            .select('*')
            .eq('subcategory', selectedSubcategory);

        if (error) {
            console.error('Erro ao buscar dados do Supabase:', error);
            return;
        }

        let basePrice = 0;
        const additionalFees: { description: string; value: number }[] = [];

        data.forEach(item => {
            // Preço base (caso especial com answer_value = 'base')
            if (item.answer_value === 'base') {
                basePrice = item.price;
                return;
            }

            // Taxas adicionais com base nas respostas
            const userAnswer = answers[item.question_id];  // <-- aqui está a chave
            if (userAnswer && userAnswer === item.answer_value) {
                additionalFees.push({ description: item.description, value: item.price });
            }
        });

        const total = basePrice + additionalFees.reduce((sum, fee) => sum + fee.value, 0);

        setCalculationDetails({ basePrice, additionalFees, total });
        setShowCalculation(true);
    };

    const handleFinalizarPedido = async ({
        recipientName,
        recipientPhone,
        deliveryLocation,
        locationReference,
    }: {
        recipientName: string;
        recipientPhone: string;
        deliveryLocation: string;
        locationReference: string;
    }) => {
        if (!userId) {
            showCustomAlert('Erro', 'Usuário não identificado.');
            return;
        }

        const requiredPoints = Math.floor(calculationDetails.total);

        if (userPoints < requiredPoints) {
            showCustomAlert(
                'Pontos Insuficientes',
                'Você não tem pontos suficientes para finalizar a compra.\n\nGostaria de recarregar?',
                () => router.push('/(categorias)/(Perfil)/RecargaPontos'),
                true
            );
            return;
        }

        setIsLoading(true);

        try {
            const newPoints = userPoints - requiredPoints;

            // Atualiza pontos do usuário
            const { error: pontosError } = await supabase
                .from('users')
                .update({ points: newPoints })
                .eq('id', userId);

            if (pontosError) {
                console.error('Erro ao atualizar pontos:', pontosError);
                showCustomAlert('Erro', 'Não foi possível finalizar a compra.');
                setIsLoading(false);
                return;
            }

            // Monta objeto pedido — note que selectedSubcategory é string, não objeto
            const pedidoObj = {
                categoria: selectedCategory ? selectedCategory.nome : null,
                subcategoria: selectedSubcategory, // sem .nome
                respostas: answers,
                recipientName,
                recipientPhone,
                deliveryLocation,
                locationReference,
            };

            const itemsString = JSON.stringify([pedidoObj]);

            // Insere o pedido na tabela 'pedidos'
            const { error: pedidoError } = await supabase
                .from('pedidos')
                .insert([
                    {
                        user_id: userId,
                        items: itemsString,
                        total: calculationDetails.total,
                        status: 'pendente',
                        created_at: new Date().toISOString(),
                        tempo_entrega_minutos: 30,  // por exemplo, 30 minutos, defina conforme seu caso
                    },
                ]);

            if (pedidoError) {
                console.error('Erro ao salvar pedido:', pedidoError);
                showCustomAlert('Erro', 'Não foi possível salvar o pedido.');
                setIsLoading(false);
                return;
            }

            setUserPoints(newPoints);

            // Limpa dados da compra
            setSelectedCategory(null);
            setSelectedSubcategory(null);
            setCurrentStep(0);
            setAnswers({});
            setShowCalculation(false);

            showCustomAlert('Sucesso', 'Compra finalizada com sucesso!', () => {
                router.push('/(categorias)/servicos');
            });

        } catch (error) {
            console.error('Erro geral ao finalizar:', error);
            showCustomAlert('Erro', 'Ocorreu um erro inesperado.');
        } finally {
            setIsLoading(false);
        }
    };

    const currentQuestions = questions;
    const progress = currentQuestions.length > 0 ? ((currentStep + 1) / currentQuestions.length) * 100 : 0;

    const handleNext = () => {
        if (currentStep < currentQuestions.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            calculateServicePrice();
        }
    };

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        } else {
            setSelectedSubcategory(null);
        }
    };

    const handleAnswer = (answer: string) => {
        setAnswers(prev => ({
            ...prev,
            [currentQuestions[currentStep].id]: answer
        }));
        setSelectedOption(answer); // <-- adiciona isso para mudar a cor
    };

    const goToHome = useCallback(() => {
        router.replace('/(panel)/inicio');
    }, [router]);

    return (
        <View style={styles.container}>
            <StatusBar style="auto" />
            <View style={styles.header}>
                <TouchableOpacity onPress={goToHome}>
                    <MaterialCommunityIcons name="arrow-left" size={28} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Serviços</Text>
                <TouchableOpacity>
                    <MaterialCommunityIcons name="arrow-left" size={28} color="white" />
                </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
                <Search size={20} color="#94A3B8" style={styles.searchIcon} />
                <TextInput
                    placeholder="O que você está procurando?"
                    placeholderTextColor="#94A3B8"
                    style={styles.searchInput}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            {isLoading ? (
                <View style={styles.productsWrapper}>
                    {[...Array(8)].map((_, index) => (
                        <View key={index} style={styles.skeletonCard}>
                            <View style={styles.skeletonImage} />
                            <View style={styles.skeletonText} />
                        </View>
                    ))}
                </View>
            ) : filteredCategories.length > 0 ? (
                <FlatList
                    data={filteredCategories}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={2}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.serviceItem}
                            onPress={() => setSelectedCategory(item)}
                        >
                            <Image source={{ uri: item.imagem }} style={styles.serviceImage} />
                            <Text style={styles.serviceText}>{item.nome}</Text>
                        </TouchableOpacity>
                    )}
                    contentContainerStyle={styles.servicesList}
                />
            ) : (
                <View style={styles.noResultsContainer}>
                    <Text style={styles.noResultsText}>
                        O Serviço "{searchQuery}" não existe!
                    </Text>
                </View>
            )}

            {/* Modal de subcategorias */}
            <Modal visible={!!selectedCategory} transparent animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <TouchableOpacity onPress={() => setSelectedCategory(null)} style={styles.modalBackButton}>
                                <X size={24} color="#1F2937" />
                            </TouchableOpacity>
                            <Text style={styles.modalTitle}>{selectedCategory?.nome}</Text>
                            <View style={{ width: 24 }} />
                        </View>

                        <FlatList
                            data={selectedCategory?.subcategories}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.subcategoryItem}
                                    onPress={() => {
                                        setSelectedSubcategory(item.nome);
                                        setCurrentStep(0);
                                        setAnswers({});
                                        setShowCalculation(false);
                                        fetchQuestions(item.id);
                                    }}
                                >
                                    <Text style={styles.subcategoryText}>{item.nome}</Text>
                                    <ChevronRight size={20} color="#94A3B8" />
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </View>
            </Modal>

            <Modal visible={!!selectedSubcategory} transparent animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <TouchableOpacity
                                style={styles.modalBackButton}
                                onPress={() => setSelectedSubcategory(null)}
                            >
                                <X size={24} color="#1F2937" />
                            </TouchableOpacity>
                            <Text style={styles.modalTitle}>{selectedSubcategory}</Text>
                            <View style={{ width: 24 }} />
                        </View>

                        {!showCalculation ? (
                            <>
                                <View style={styles.progressContainer}>
                                    <View style={styles.progressBar}>
                                        <View style={[styles.progressFill, { width: `${progress}%` }]} />
                                    </View>
                                    <Text style={styles.progressText}>
                                        {currentStep + 1} de {currentQuestions.length}
                                    </Text>
                                </View>

                                <View style={styles.questionContainer}>
                                    <Text style={styles.questionText}>
                                        {currentQuestions[currentStep]?.question}
                                    </Text>
                                    <View style={styles.optionsContainer}>
                                        {currentQuestions[currentStep]?.options.map((option) => (
                                            <TouchableOpacity
                                                key={option.id}
                                                style={[
                                                    styles.optionButton,
                                                    selectedOption === option.option_text && styles.optionButtonSelected,
                                                ]}
                                                onPress={() => handleAnswer(option.option_text)}
                                            >
                                                <Text
                                                    style={[
                                                        styles.optionText,
                                                        selectedOption === option.option_text && styles.optionTextSelected,
                                                    ]}
                                                >
                                                    {option.option_text}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>

                                </View>

                                <View style={styles.modalNavButtons}>
                                    <TouchableOpacity
                                        style={styles.backButton}
                                        onPress={handlePrevious}
                                    >
                                        <Text style={styles.backButtonText}>Voltar</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[
                                            styles.nextButton,
                                            !answers[currentQuestions[currentStep]?.id] &&
                                            styles.nextButtonDisabled
                                        ]}
                                        onPress={handleNext}
                                        disabled={!answers[currentQuestions[currentStep]?.id]}
                                    >
                                        <Text style={styles.nextButtonText}>
                                            {currentStep < currentQuestions.length - 1 ? 'Próximo' : 'Calcular'}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        ) : (
                            <View style={styles.calculationContainer}>
                                <View style={styles.calculationHeader}>
                                    <Calculator size={40} color="#2563EB" />
                                    <Text style={styles.calculationTitle}>Cálculo do Serviço</Text>
                                </View>

                                <View style={styles.calculationDetails}>
                                    <View style={styles.calculationRow}>
                                        <Text style={styles.calculationLabel}>Preço Base:</Text>
                                        <Text style={styles.calculationValue}>
                                            {calculationDetails.basePrice.toFixed()} Z-coins
                                        </Text>
                                    </View>

                                    {calculationDetails.additionalFees.map((fee, index) => (
                                        <View key={index} style={styles.calculationRow}>
                                            <Text style={styles.calculationLabel}>{fee.description}:</Text>
                                            <Text style={styles.calculationValue}>
                                                {fee.value.toFixed()} Z-coins
                                            </Text>
                                        </View>
                                    ))}

                                    <View style={styles.calculationTotal}>
                                        <Text style={styles.totalLabel}>Total:</Text>
                                        <Text style={styles.totalValue}>
                                            {calculationDetails.total.toFixed()} Z-coins
                                        </Text>
                                    </View>
                                </View>
                                <TouchableOpacity
                                    style={styles.confirmButton}
                                    onPress={() => setShowConfirmModal(true)}
                                >
                                    <Text style={styles.confirmButtonText}>Confirmar Serviço</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </View>
            </Modal>
            <>
                <ConfirmarPedidoModal
                    visible={showConfirmModal}
                    onClose={() => setShowConfirmModal(false)}
                    onConfirm={(dados) => {
                        setShowConfirmModal(false);
                        handleFinalizarPedido(dados); // agora recebe os dados do formulário
                    }}
                    isLoading={isLoading}
                    deliveryLocation={deliveryLocation}
                    setDeliveryLocation={setDeliveryLocation}
                    setIsMapModalVisible={setIsMapModalVisible}
                />

                {userId && (
                    <LocalModal
                        visible={isMapModalVisible}
                        onClose={() => setIsMapModalVisible(false)}
                        userId={userId}
                        onSelect={(localSelecionado) => {
                            setDeliveryLocation(localSelecionado);
                            setIsMapModalVisible(false);
                        }}
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

            </>
        </View>
    );
}