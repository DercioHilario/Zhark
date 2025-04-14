import { View, Text, TouchableOpacity, TextInput, FlatList, Image, Modal } from "react-native";
import styles from "../Style/sevico";
import React, { useState, useEffect, useCallback } from "react";
import { StatusBar } from "expo-status-bar";
import * as Font from "expo-font";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';

export default function Servico() {
    const [fontsLoaded, setFontsLoaded] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<{
        name: string;
        image: any;
        subcategories: string[]
    } | null>(null);
    const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [showOrcamento, setShowOrcamento] = useState(false);
    const [orcamentoValue, setOrcamentoValue] = useState(0);
    const router = useRouter();

    const categories = [
        {
            name: 'Assistência Técnica',
            image: require("../../../assets/img/tecnico.png"),
            subcategories: ['Celular', 'Computador', 'Aparelho de Som', 'Ar condicionado', 'Eletrodomésticos', 'Fogão', 'Fone de Ouvido', 'Geladeira e freezer', 'Impressora', 'Instrumentos Musicais', 'Lava Louça', 'Lava roupa', 'Micro-ondas', 'Relógios', 'Secadora de Roupas', 'Smartwatch', 'Tablet', 'Telefone (não celular)', 'Televisão', 'Vídeo game']
        },
        {
            name: 'Aulas',
            image: require("../../../assets/img/graduacao.png"),
            subcategories: ['Luta', 'Dança', 'Reforço Escolar', 'Desenvolvimento Web', 'Direção', 'Esportes Eletrônicos', 'Esportes', 'Fotografia', 'Idiomas', 'Informática', 'Jogos', 'Marketing Digital', 'Moda', 'TV e Teatro', 'Música', 'Pré-Vestibular']
        },
        {
            name: 'Serviços Domésticos',
            image: require("../../../assets/img/produtos.png"),
            subcategories: ['Diarista', 'Cozinheira', 'Babá', 'Lavadeira', 'Limpeza de Piscina', 'Personal Shopper', 'Segurança Particular', 'Segurança Patrimonial', 'Personal Organizer', 'Motorista']
        },
        {
            name: 'Eventos',
            image: require("../../../assets/img/eventos.png"),
            subcategories: ['Fotografia', 'Buffet', 'Decoração', 'Animador de festas', 'Bandas e cantores', 'Bartenders', 'Celebrantes', 'Churrasqueiro', 'Confeitaria', 'Djs', 'Garçons e Copeiras', 'Personal Chef', 'Segurança',]
        },
        {
            name: 'Moda e Beleza',
            image: require("../../../assets/img/beleza.png"),
            subcategories: ['Cabeleireiro', 'Manicure e pedicure', 'Maquiagem', 'Bronzeamento', 'Depilação', 'Designer de Cílios', 'Designer de Sobrancelhas', 'Personal Stylist',]
        },
        {
            name: 'Autos',
            image: require("../../../assets/img/manutencao.png"),
            subcategories: ['Ar Condicionado Automotivo', 'Guincho', 'Som Automotivo',],
        },
        {
            name: 'Design e Tecnologia',
            image: require("../../../assets/img/designer-de-web.png"),
            subcategories: ['Criação de Logos', 'Criação de Marca', 'Desenvolvimento de Games', 'Desenvolvimento de Sites e Sistemas', 'Panfletagem', 'Produção gráfica', 'Serviços de TI', 'Web Design', 'Ux - Ui Design',],
        },
        {
            name: 'Saúde',
            image: require("../../../assets/img/cuidados-de-saude.png"),
            subcategories: ['Aconselhamento', 'Cuidador de Pessoas', 'Dentista', 'Fisioterapeuta', 'Enfermeira', 'Médico', 'Fonoaudiólogo', 'Hipnoterapia', 'Nutricionista', 'Psicanalista', 'Psicólogo', 'Quiropraxia', 'Remoção de Tatuagem',],
        }
    ];

    interface Question {
        id: string;
        question: string;
        options: string[];
    }

    type QuestionsByCategory = {
        [key: string]: Question[];
    };

    const questions: QuestionsByCategory = {
        'Luta': [
            {
                id: '1',
                question: 'Gostaria que a aula fosse?',
                options: ['Presencial', 'Online']
            },
            {
                id: '2',
                question: 'Qual sua experiência com artes marciais?',
                options: ['Iniciante', 'Intermediário', 'Avançado', 'Nenhuma experiência']
            },
            {
                id: '3',
                question: 'Qual seu principal objetivo?',
                options: ['Defesa pessoal', 'Competição', 'Condicionamento físico', 'Desenvolvimento pessoal']
            },
            {
                id: '4',
                question: 'Qual estilo de luta mais te interessa?',
                options: ['Jiu-jitsu', 'Muay Thai', 'Karatê', 'Boxe', 'Outro']
            }
        ],
        'Dança': [
            {
                id: '1',
                question: 'Qual seu nível de dança?',
                options: ['Iniciante', 'Intermediário', 'Avançado']
            },
            {
                id: '2',
                question: 'Qual estilo de dança você prefere?',
                options: ['Street Dance', 'Ballet', 'Contemporâneo', 'Forró', 'Samba']
            },
            {
                id: '3',
                question: 'Com que frequência pretende praticar?',
                options: ['1x por semana', '2x por semana', '3x ou mais por semana']
            }
        ],
        'Desenvolvimento Web': [
            {
                id: '1',
                question: 'Qual sua experiência com programação?',
                options: ['Iniciante', 'Intermediário', 'Avançado']
            },
            {
                id: '2',
                question: 'Qual área mais te interessa?',
                options: ['Front-end', 'Back-end', 'Full-stack']
            },
            {
                id: '3',
                question: 'Quais tecnologias você quer aprender?',
                options: ['React/Angular', 'Node.js', 'Python', 'Java']
            }
        ],
        'Idiomas': [
            {
                id: '1',
                question: 'Qual seu nível no idioma escolhido?',
                options: ['Iniciante', 'Intermediário', 'Avançado']
            },
            {
                id: '2',
                question: 'Qual seu principal objetivo?',
                options: ['Viagem', 'Trabalho', 'Estudos', 'Hobby']
            },
            {
                id: '3',
                question: 'Quanto tempo pode dedicar aos estudos?',
                options: ['30 min/dia', '1h/dia', '2h ou mais/dia']
            }
        ]
    };

    const calculateOrcamento = () => {
        let baseValue = 100;

        Object.entries(answers).forEach(([questionId, answer]) => {
            switch (answer) {
                case 'Avançado':
                    baseValue += 100;
                    break;
                case 'Intermediário':
                    baseValue += 50;
                    break;
                case 'Presencial':
                    baseValue += 30;
                    break;
                case '2x por semana':
                    baseValue += 40;
                    break;
                case '3x ou mais por semana':
                    baseValue += 80;
                    break;
            }
        });

        return baseValue;
    };

    const handleFinalizarPedido = () => {
        router.replace("/(panel)/inicio");
    };

    const currentQuestions = selectedSubcategory ? questions[selectedSubcategory] || [] : [];
    const progress = currentQuestions.length > 0 ? ((currentStep + 1) / currentQuestions.length) * 100 : 0;

    const handleNext = () => {
        if (currentStep < currentQuestions.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            // Quando chegar na última pergunta, calcular e mostrar o orçamento
            const valor = calculateOrcamento();
            setOrcamentoValue(valor);
            setShowOrcamento(true);
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
        if (currentQuestions[currentStep]) {
            setAnswers({
                ...answers,
                [currentQuestions[currentStep].id]: answer,
            });

            // Se for a última pergunta, calcular e mostrar o orçamento automaticamente
            if (currentStep === currentQuestions.length - 1) {
                const valor = calculateOrcamento();
                setOrcamentoValue(valor);
                setShowOrcamento(true);
            }
        }
    };

    useEffect(() => {
        (async () => {
            try {
                await Font.loadAsync({
                    Wellfleet: require("../../../assets/fonts/Wellfleet-Regular.ttf"),
                });
                setFontsLoaded(true);
            } catch (error) {
                console.error("Erro ao carregar fontes:", error);
            }
        })();
    }, []);

    const goToInicio = useCallback(() => {
        router.replace("/(panel)/inicio");
    }, [router]);

    if (!fontsLoaded) {
        return <Text style={styles.loadingText}>Carregando fontes...</Text>;
    }

    return (
        <View style={styles.container}>
            <StatusBar style="auto" />
            <View style={styles.header}>
                <TouchableOpacity onPress={goToInicio}>
                    <MaterialCommunityIcons name="arrow-left" size={28} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>SERVIÇOS</Text>
                <View style={{ width: 28 }} />
            </View>

            <View style={styles.searchContainer}>
                <View style={styles.search}>
                    <TextInput
                        placeholder="O que você quer?"
                        placeholderTextColor="#666"
                        style={styles.searchInput}
                    />
                    <Ionicons name="search-outline" size={20} color="#666" style={styles.searchIcon} />
                </View>
            </View>

            <FlatList
                data={categories}
                keyExtractor={(item) => item.name}
                numColumns={2}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.serviceItem} onPress={() => setSelectedCategory(item)}>
                        <Image source={item.image} style={styles.serviceImage} />
                        <Text style={styles.serviceText}>{item.name}</Text>
                    </TouchableOpacity>
                )}
                contentContainerStyle={{ paddingBottom: 20 }}
                showsVerticalScrollIndicator={false}
            />

            <Modal visible={!!selectedCategory} transparent animationType="fade">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <TouchableOpacity style={styles.modalBackButton} onPress={() => setSelectedCategory(null)}>
                                <AntDesign name="closecircleo" size={24} color="black" />
                            </TouchableOpacity>
                            <Text style={styles.modalTitle}>{selectedCategory?.name}</Text>
                            <View style={{ width: 28 }} />
                        </View>
                        <View style={styles.searchContainerModel}>
                            <View style={styles.search}>
                                <TextInput
                                    placeholder="O que você quer?"
                                    placeholderTextColor="#666"
                                    style={styles.searchInput}
                                />
                                <Ionicons name="search-outline" size={20} color="#666" style={styles.searchIcon} />
                            </View>
                        </View>
                        <FlatList
                            data={selectedCategory?.subcategories || []}
                            keyExtractor={(item) => item}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.subcategoria}
                                    onPress={() => {
                                        setSelectedSubcategory(item);
                                        setCurrentStep(0);
                                        setAnswers({});
                                        setShowOrcamento(false);
                                    }}
                                >
                                    <Text style={styles.subcategoriaText}>{item}</Text>
                                    <AntDesign name="right" size={24} color="black" />
                                </TouchableOpacity>
                            )}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>
                </View>
            </Modal>

            <Modal visible={!!selectedSubcategory} transparent animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContentQ}>
                        <View style={styles.modalHeader}>
                            <TouchableOpacity style={styles.modalBackButton} onPress={() => setSelectedSubcategory(null)}>
                                <AntDesign name="closecircleo" size={24} color="black" />
                            </TouchableOpacity>
                            <Text style={styles.modalTitle}> Perguntas sobre {selectedSubcategory}</Text>
                            <View style={{ width: 28 }} />
                        </View>

                        <View style={styles.progressContainer}>
                            <View style={styles.progressBar}>
                                <View
                                    style={[
                                        styles.progressFill,
                                        { width: `${progress}%` }
                                    ]}
                                />
                            </View>
                            <Text style={styles.progressText}>
                                {currentStep + 1} de {currentQuestions.length}
                            </Text>
                        </View>

                        {currentQuestions.length > 0 && currentStep < currentQuestions.length ? (
                            <View style={styles.questionContainer}>
                                <Text style={styles.questionText}>
                                    {currentQuestions[currentStep].question}
                                </Text>
                                <View style={styles.optionsContainer}>
                                    {currentQuestions[currentStep].options.map((option) => (
                                        <TouchableOpacity
                                            key={option}
                                            style={[
                                                styles.optionButton,
                                                answers[currentQuestions[currentStep].id] === option &&
                                                styles.optionButtonSelected
                                            ]}
                                            onPress={() => handleAnswer(option)}
                                        >
                                            <Text style={[
                                                styles.optionText,
                                                answers[currentQuestions[currentStep].id] === option &&
                                                styles.optionTextSelected
                                            ]}>
                                                {option}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        ) : (
                            <View style={styles.completionContainer}>
                                <Text style={styles.completionTitle}>Questionário Concluído!</Text>
                                {showOrcamento && (
                                    <>
                                        <Text style={styles.orcamentoText}>
                                            Orçamento Estimado: R$ {orcamentoValue.toFixed(2)}
                                        </Text>
                                        <TouchableOpacity
                                            style={styles.finalizarButton}
                                            onPress={handleFinalizarPedido}
                                        >
                                            <Text style={styles.finalizarButtonText}>
                                                Finalizar Pedido
                                            </Text>
                                        </TouchableOpacity>
                                    </>
                                )}
                            </View>
                        )}

                        <View style={styles.modalButtonP}>
                            <TouchableOpacity
                                style={styles.modalVoltrButton}
                                onPress={handlePrevious}
                            >
                                <Text style={styles.modalVoltarTexto}>Voltar</Text>
                            </TouchableOpacity>

                            {currentStep < currentQuestions.length - 1 ? (
                                <TouchableOpacity
                                    style={[
                                        styles.modalProximoButton,
                                        !answers[currentQuestions[currentStep]?.id] && styles.modalProximoButtonDisabled
                                    ]}
                                    onPress={handleNext}
                                    disabled={!answers[currentQuestions[currentStep]?.id]}
                                >
                                    <Text style={styles.modalVoltarTexto}>Próximo</Text>
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity
                                    style={[
                                        styles.modalProximoButton,
                                        !answers[currentQuestions[currentStep]?.id] && styles.modalProximoButtonDisabled
                                    ]}
                                    onPress={handleNext}
                                    disabled={!answers[currentQuestions[currentStep]?.id]}
                                >
                                    <Text style={styles.modalVoltarTexto}>Calcular</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}