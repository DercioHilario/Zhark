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
            subcategories: ['Celular', 'Computador', 'Aparelho de Som', 'Ar condicionado', 'Eletrodomésticos', 'Fogão', 'Fone de Ouvido', 'Geladeira e freezer', 'Impressora', 'Instrumentos Musicais', 'Lava roupa', 'Micro-ondas', 'Relógios', 'Secadora de Roupas', 'Smartwatch', 'Tablet', 'Telefone (não celular)', 'Televisão', 'Vídeo game']
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

        'Celular': [
            {
                id: '1',
                question: 'Qual é o problema do seu celular?',
                options: ['Tela quebrada', 'Bateria viciada', 'Não liga', 'Problema no som', 'Outro']
            },
            {
                id: '2',
                question: 'Qual é a marca do seu celular?',
                options: ['Samsung', 'Apple', 'Xiaomi', 'Motorola', 'Outra']
            },
            {
                id: '3',
                question: 'Qual é o modelo do aparelho?',
                options: ['Informarei depois', 'Não sei o modelo', 'Outro']
            },
            {
                id: '4',
                question: 'O celular ainda está na garantia?',
                options: ['Sim', 'Não', 'Não sei']
            },
            {
                id: '5',
                question: 'Você prefere atendimento?',
                options: ['Presencial', 'Buscar em casa', 'Envio por correio']
            }
        ],

        'Computador': [
            {
                id: '1',
                question: 'Qual tipo de computador você deseja consertar?',
                options: ['Notebook', 'PC (desktop)', 'All-in-One']
            },
            {
                id: '2',
                question: 'Qual é o problema que está enfrentando?',
                options: ['Não liga', 'Tela com defeito', 'Desempenho lento', 'Problema com internet', 'Outro']
            },
            {
                id: '3',
                question: 'Qual o sistema operacional?',
                options: ['Windows', 'macOS', 'Linux', 'Não sei']
            },
            {
                id: '4',
                question: 'Você já levou o computador para outro técnico antes?',
                options: ['Sim', 'Não']
            },
            {
                id: '5',
                question: 'Qual forma de atendimento você prefere?',
                options: ['Presencial', 'Buscar em casa', 'Atendimento remoto']
            }
        ],
        'Eletrodomésticos': [
            {
                id: '1',
                question: 'Qual tipo de eletrodoméstico precisa de conserto?',
                options: ['Geladeira', 'Fogão', 'Micro-ondas', 'Máquina de lavar', 'Outro']
            },
            {
                id: '2',
                question: 'Qual é o problema apresentado?',
                options: ['Não liga', 'Barulho estranho', 'Não funciona corretamente', 'Outro']
            },
            {
                id: '3',
                question: 'Qual a marca do aparelho?',
                options: ['Brastemp', 'Electrolux', 'Consul', 'Samsung', 'Outra']
            },
            {
                id: '4',
                question: 'Há quanto tempo o problema começou?',
                options: ['Hoje', 'Alguns dias', 'Mais de uma semana', 'Mais de um mês']
            },
            {
                id: '5',
                question: 'Qual forma de atendimento você prefere?',
                options: ['Presencial', 'Buscar em casa']
            }
        ],
        'Fogão': [
            {
                id: '1',
                question: 'Qual tipo de fogão você possui?',
                options: ['4 bocas', '5 bocas', 'Cooktop', 'Industrial']
            },
            {
                id: '2',
                question: 'Qual é o problema apresentado?',
                options: ['Boca não acende', 'Forno não funciona', 'Vazamento de gás', 'Outro']
            },
            {
                id: '3',
                question: 'A instalação é a gás ou elétrica?',
                options: ['Gás', 'Elétrica', 'Não sei']
            },
            {
                id: '4',
                question: 'Qual é a marca do fogão?',
                options: ['Brastemp', 'Consul', 'Electrolux', 'Outra']
            },
            {
                id: '5',
                question: 'Você prefere atendimento?',
                options: ['Presencial', 'Buscar em casa']
            }
        ],
        'Fone de Ouvido': [
            {
                id: '1',
                question: 'O fone é com ou sem fio?',
                options: ['Com fio', 'Bluetooth']
            },
            {
                id: '2',
                question: 'Qual é o problema apresentado?',
                options: ['Sem som', 'Um lado não funciona', 'Problema no carregamento', 'Outro']
            },
            {
                id: '3',
                question: 'Qual é a marca do fone?',
                options: ['Apple', 'Samsung', 'JBL', 'Xiaomi', 'Outra']
            },
            {
                id: '4',
                question: 'O fone está na garantia?',
                options: ['Sim', 'Não', 'Não sei']
            },
            {
                id: '5',
                question: 'Qual forma de atendimento você prefere?',
                options: ['Presencial', 'Envio por correio']
            }
        ],
        'Geladeira e freezer': [
            {
                id: '1',
                question: 'Qual tipo de aparelho você possui?',
                options: ['Geladeira', 'Freezer', 'Duplex', 'Side by Side']
            },
            {
                id: '2',
                question: 'Qual é o problema apresentado?',
                options: ['Não gela', 'Barulho estranho', 'Vazamento de água', 'Outro']
            },
            {
                id: '3',
                question: 'Qual é a marca?',
                options: ['Electrolux', 'Brastemp', 'Consul', 'Samsung', 'Outra']
            },
            {
                id: '4',
                question: 'Há quanto tempo o problema começou?',
                options: ['Hoje', 'Alguns dias', 'Mais de uma semana']
            },
            {
                id: '5',
                question: 'Forma de atendimento preferida?',
                options: ['Presencial', 'Buscar em casa']
            }
        ],
        'Impressora': [
            {
                id: '1',
                question: 'Qual tipo de impressora você possui?',
                options: ['Jato de tinta', 'Laser', 'Multifuncional']
            },
            {
                id: '2',
                question: 'Qual é o problema apresentado?',
                options: ['Não imprime', 'Papel enroscando', 'Erro no scanner', 'Outro']
            },
            {
                id: '3',
                question: 'Marca da impressora?',
                options: ['HP', 'Epson', 'Canon', 'Brother', 'Outra']
            },
            {
                id: '4',
                question: 'Sistema operacional do computador conectado?',
                options: ['Windows', 'macOS', 'Linux', 'Outro']
            },
            {
                id: '5',
                question: 'Você prefere atendimento?',
                options: ['Presencial', 'Atendimento remoto', 'Envio por correio']
            }
        ],
        'Instrumentos Musicais': [
            {
                id: '1',
                question: 'Qual tipo de instrumento precisa de conserto?',
                options: ['Violão', 'Guitarra', 'Teclado', 'Bateria', 'Outro']
            },
            {
                id: '2',
                question: 'Qual é o problema apresentado?',
                options: ['Problema no som', 'Não liga', 'Quebra ou trinca', 'Outro']
            },
            {
                id: '3',
                question: 'É um instrumento acústico ou eletrônico?',
                options: ['Acústico', 'Eletrônico']
            },
            {
                id: '4',
                question: 'Há quanto tempo o problema começou?',
                options: ['Hoje', 'Alguns dias', 'Mais de uma semana']
            },
            {
                id: '5',
                question: 'Forma de atendimento preferida?',
                options: ['Presencial', 'Envio por correio']
            }
        ],
        'Aparelho de Som': [
            {
                id: '1',
                question: 'Qual tipo de aparelho de som você possui?',
                options: ['Mini System', 'Caixa de som Bluetooth', 'Som automotivo', 'Home Theater', 'Outro']
            },
            {
                id: '2',
                question: 'Qual é o problema apresentado?',
                options: ['Sem som', 'Não liga', 'Som distorcido', 'Problema com Bluetooth', 'Outro']
            },
            {
                id: '3',
                question: 'Qual é a marca do aparelho?',
                options: ['Sony', 'LG', 'Samsung', 'JBL', 'Outra']
            },
            {
                id: '4',
                question: 'Há quanto tempo o problema começou?',
                options: ['Hoje', 'Alguns dias', 'Mais de uma semana', 'Mais de um mês']
            },
            {
                id: '5',
                question: 'Qual tipo de atendimento você prefere?',
                options: ['Presencial', 'Buscar em casa', 'Envio por correio']
            }
        ],

        'Ar condicionado': [
            {
                id: '1',
                question: 'Qual tipo de ar condicionado você possui?',
                options: ['Janela', 'Split', 'Portátil']
            },
            {
                id: '2',
                question: 'Qual é o problema apresentado?',
                options: ['Não liga', 'Não gela', 'Barulho estranho', 'Vazamento de água', 'Outro']
            },
            {
                id: '3',
                question: 'Qual a marca do ar condicionado?',
                options: ['LG', 'Samsung', 'Carrier', 'Gree', 'Outra']
            },
            {
                id: '4',
                question: 'Há quanto tempo o problema começou?',
                options: ['Hoje', 'Alguns dias', 'Mais de uma semana', 'Mais de um mês']
            },
            {
                id: '5',
                question: 'Qual forma de atendimento você prefere?',
                options: ['Presencial', 'Buscar em casa']
            }
        ],

        'Lava roupa': [
            {
                id: '1',
                question: 'Qual tipo de máquina de lavar você possui?',
                options: ['Lava e seca', 'Automática', 'Semiautomática']
            },
            {
                id: '2',
                question: 'Qual é o problema apresentado?',
                options: ['Não liga', 'Vazamento de água', 'Não centrifuga', 'Outro']
            },
            {
                id: '3',
                question: 'Qual a marca da máquina de lavar?',
                options: ['Brastemp', 'Electrolux', 'Samsung', 'LG', 'Outra']
            },
            {
                id: '4',
                question: 'Há quanto tempo o problema começou?',
                options: ['Hoje', 'Alguns dias', 'Mais de uma semana', 'Mais de um mês']
            },
            {
                id: '5',
                question: 'Qual forma de atendimento você prefere?',
                options: ['Presencial', 'Buscar em casa']
            }
        ],
        'Micro-ondas': [
            {
                id: '1',
                question: 'Qual é a marca do micro-ondas?',
                options: ['LG', 'Samsung', 'Brastemp', 'Panasonic', 'Outra']
            },
            {
                id: '2',
                question: 'Qual é o problema apresentado?',
                options: ['Não liga', 'Não esquenta', 'Barulho estranho', 'Outro']
            },
            {
                id: '3',
                question: 'O micro-ondas é de embutir ou de mesa?',
                options: ['Embutir', 'Mesa']
            },
            {
                id: '4',
                question: 'Há quanto tempo o problema começou?',
                options: ['Hoje', 'Alguns dias', 'Mais de uma semana', 'Mais de um mês']
            },
            {
                id: '5',
                question: 'Qual forma de atendimento você prefere?',
                options: ['Presencial', 'Buscar em casa']
            }
        ],
        'Relógios': [
            {
                id: '1',
                question: 'Qual tipo de relógio você possui?',
                options: ['Digital', 'Analógico', 'Smartwatch']
            },
            {
                id: '2',
                question: 'Qual é o problema apresentado?',
                options: ['Não funciona', 'Peca quebrada', 'Precisando de manutenção', 'Outro']
            },
            {
                id: '3',
                question: 'Qual é a marca do relógio?',
                options: ['Casio', 'Rolex', 'Samsung', 'Apple', 'Outra']
            },
            {
                id: '4',
                question: 'O relógio é à prova d\'água?',
                options: ['Sim', 'Não']
            },
            {
                id: '5',
                question: 'Qual forma de atendimento você prefere?',
                options: ['Presencial', 'Envio por correio']
            }
        ],
        'Secadora de Roupas': [
            {
                id: '1',
                question: 'Qual tipo de secadora você possui?',
                options: ['Secadora de tambor', 'Secadora de parede']
            },
            {
                id: '2',
                question: 'Qual é o problema apresentado?',
                options: ['Não liga', 'Não seca', 'Barulho estranho', 'Outro']
            },
            {
                id: '3',
                question: 'Qual a marca da secadora?',
                options: ['Brastemp', 'Electrolux', 'Samsung', 'LG', 'Outra']
            },
            {
                id: '4',
                question: 'Há quanto tempo o problema começou?',
                options: ['Hoje', 'Alguns dias', 'Mais de uma semana', 'Mais de um mês']
            },
            {
                id: '5',
                question: 'Qual forma de atendimento você prefere?',
                options: ['Presencial', 'Buscar em casa']
            }
        ],
        'Smartwatch': [
            {
                id: '1',
                question: 'Qual marca de smartwatch você possui?',
                options: ['Apple', 'Samsung', 'Garmin', 'Xiaomi', 'Outra']
            },
            {
                id: '2',
                question: 'Qual é o problema apresentado?',
                options: ['Não liga', 'Tela quebrada', 'Problema de carregamento', 'Outro']
            },
            {
                id: '3',
                question: 'O smartwatch é à prova d\'água?',
                options: ['Sim', 'Não']
            },
            {
                id: '4',
                question: 'Há quanto tempo o problema começou?',
                options: ['Hoje', 'Alguns dias', 'Mais de uma semana', 'Mais de um mês']
            },
            {
                id: '5',
                question: 'Qual forma de atendimento você prefere?',
                options: ['Presencial', 'Envio por correio']
            }
        ],
        'Tablet': [
            {
                id: '1',
                question: 'Qual é a marca do seu tablet?',
                options: ['Apple', 'Samsung', 'Huawei', 'Lenovo', 'Outra']
            },
            {
                id: '2',
                question: 'Qual é o problema apresentado?',
                options: ['Não liga', 'Tela quebrada', 'Problema de carregamento', 'Outro']
            },
            {
                id: '3',
                question: 'O tablet tem problema com o touch?',
                options: ['Sim', 'Não']
            },
            {
                id: '4',
                question: 'Há quanto tempo o problema começou?',
                options: ['Hoje', 'Alguns dias', 'Mais de uma semana', 'Mais de um mês']
            },
            {
                id: '5',
                question: 'Qual forma de atendimento você prefere?',
                options: ['Presencial', 'Envio por correio']
            }
        ],
        'Telefone (não celular)': [
            {
                id: '1',
                question: 'Qual modelo de telefone você possui?',
                options: ['Fixo', 'Comercial', 'Telefone sem fio']
            },
            {
                id: '2',
                question: 'Qual é o problema apresentado?',
                options: ['Não liga', 'Problema de som', 'Problema de conexão', 'Outro']
            },
            {
                id: '3',
                question: 'Qual é a marca do telefone?',
                options: ['Intelbras', 'Motorola', 'Panasonic', 'Philips', 'Outra']
            },
            {
                id: '4',
                question: 'Há quanto tempo o problema começou?',
                options: ['Hoje', 'Alguns dias', 'Mais de uma semana', 'Mais de um mês']
            },
            {
                id: '5',
                question: 'Qual forma de atendimento você prefere?',
                options: ['Presencial', 'Envio por correio']
            }
        ],
        'Televisão': [
            {
                id: '1',
                question: 'Qual tipo de televisão você possui?',
                options: ['LED', 'LCD', 'Plasma', 'Smart TV']
            },
            {
                id: '2',
                question: 'Qual é o problema apresentado?',
                options: ['Não liga', 'Imagem ruim', 'Sem som', 'Outro']
            },
            {
                id: '3',
                question: 'Qual a marca da televisão?',
                options: ['Samsung', 'LG', 'Sony', 'Philips', 'Outra']
            },
            {
                id: '4',
                question: 'Há quanto tempo o problema começou?',
                options: ['Hoje', 'Alguns dias', 'Mais de uma semana', 'Mais de um mês']
            },
            {
                id: '5',
                question: 'Qual forma de atendimento você prefere?',
                options: ['Presencial', 'Buscar em casa']
            }
        ],
        'Vídeo game': [
            {
                id: '1',
                question: 'Qual console de vídeo game você possui?',
                options: ['PlayStation', 'Xbox', 'Nintendo Switch', 'Outro']
            },
            {
                id: '2',
                question: 'Qual é o problema apresentado?',
                options: ['Não liga', 'Problema no controle', 'Problema no jogo', 'Outro']
            },
            {
                id: '3',
                question: 'Aparenta algum dano físico?',
                options: ['Sim', 'Não']
            },
            {
                id: '4',
                question: 'Há quanto tempo o problema começou?',
                options: ['Hoje', 'Alguns dias', 'Mais de uma semana', 'Mais de um mês']
            },
            {
                id: '5',
                question: 'Qual forma de atendimento você prefere?',
                options: ['Presencial', 'Envio por correio']
            }
        ],
        //AULAS

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

        'Reforço Escolar': [
            {
                id: '1',
                question: 'Qual a matéria em que você precisa de reforço?',
                options: ['Matemática', 'Português', 'Ciências', 'História', 'Geografia', 'Outras']
            },
            {
                id: '2',
                question: 'Qual seu nível escolar?',
                options: ['Ensino Fundamental', 'Ensino Médio', 'Ensino Superior']
            },
            {
                id: '3',
                question: 'Prefere aulas presenciais ou online?',
                options: ['Presenciais', 'Online']
            }
        ],

        'Direção': [
            {
                id: '1',
                question: 'Qual seu nível de experiência?',
                options: ['Iniciante', 'Intermediário', 'Avançado']
            },
            {
                id: '2',
                question: 'Qual tipo de veículo você deseja aprender a dirigir?',
                options: ['Carro', 'Moto', 'Caminhão']
            },
            {
                id: '3',
                question: 'Onde prefere fazer as aulas?',
                options: ['Na cidade', 'Em estrada']
            }
        ],
        'Esportes Eletrônicos': [
            {
                id: '1',
                question: 'Qual jogo você joga?',
                options: ['League of Legends', 'CS:GO', 'Fortnite', 'Outros']
            },
            {
                id: '2',
                question: 'Qual seu nível no jogo?',
                options: ['Iniciante', 'Intermediário', 'Avançado']
            },
            {
                id: '3',
                question: 'Você prefere jogar competitivo ou casual?',
                options: ['Competitivo', 'Casual']
            }
        ],
        'Esportes': [
            {
                id: '1',
                question: 'Qual esporte você pratica?',
                options: ['Futebol', 'Vôlei', 'Basquete', 'Natação', 'Outro']
            },
            {
                id: '2',
                question: 'Qual seu nível de experiência?',
                options: ['Iniciante', 'Intermediário', 'Avançado']
            },
            {
                id: '3',
                question: 'Qual seu principal objetivo com o esporte?',
                options: ['Condicionamento físico', 'Competição', 'Diversão', 'Desenvolvimento pessoal']
            }
        ],
        'Fotografia': [
            {
                id: '1',
                question: 'Qual seu nível de experiência em fotografia?',
                options: ['Iniciante', 'Intermediário', 'Avançado']
            },
            {
                id: '2',
                question: 'Qual tipo de fotografia você mais se interessa?',
                options: ['Retrato', 'Paisagens', 'Fotografia de eventos', 'Outro']
            },
            {
                id: '3',
                question: 'Você prefere aprender por videoaulas ou material escrito?',
                options: ['Videoaulas', 'Material escrito']
            }
        ],
        'Idiomas': [
            {
                id: '1',
                question: 'Qual idioma você quer aprender?',
                options: ['Inglês', 'Espanhol', 'Francês', 'Alemão', 'Outro']
            },
            {
                id: '2',
                question: 'Qual seu nível no idioma?',
                options: ['Iniciante', 'Intermediário', 'Avançado']
            },
            {
                id: '3',
                question: 'Qual formato de aula você prefere?',
                options: ['Presenciais', 'Online']
            }
        ],
        'Informática': [
            {
                id: '1',
                question: 'Qual sua experiência em informática?',
                options: ['Iniciante', 'Intermediário', 'Avançado']
            },
            {
                id: '2',
                question: 'Quais tópicos você deseja aprender?',
                options: ['Pacote Office', 'Programação', 'Design gráfico', 'Redes', 'Outro']
            },
            {
                id: '3',
                question: 'Você prefere aulas presenciais ou online?',
                options: ['Presenciais', 'Online']
            }
        ],
        'Jogos': [
            {
                id: '1',
                question: 'Qual gênero de jogo você mais gosta?',
                options: ['Ação', 'Estratégia', 'RPG', 'Simulação', 'Outro']
            },
            {
                id: '2',
                question: 'Você prefere jogar sozinho ou em equipe?',
                options: ['Sozinho', 'Em equipe']
            }
        ],
        'Marketing Digital': [
            {
                id: '1',
                question: 'Qual sua experiência com marketing digital?',
                options: ['Iniciante', 'Intermediário', 'Avançado']
            },
            {
                id: '2',
                question: 'Quais áreas do marketing digital você quer aprender?',
                options: ['SEO', 'Redes sociais', 'Email marketing', 'PPC', 'Outro']
            },
            {
                id: '3',
                question: 'Você prefere aprender por videoaulas ou material escrito?',
                options: ['Videoaulas', 'Material escrito']
            }
        ],
        'Moda': [
            {
                id: '1',
                question: 'Qual seu estilo de moda?',
                options: ['Casual', 'Formal', 'Esportivo', 'Descontraído', 'Outro']
            },
            {
                id: '2',
                question: 'Você prefere aprender sobre moda masculina ou feminina?',
                options: ['Masculina', 'Feminina']
            }
        ],
        'TV e Teatro': [
            {
                id: '1',
                question: 'Você tem experiência com atuação?',
                options: ['Sim', 'Não']
            },
            {
                id: '2',
                question: 'Qual tipo de atuação mais lhe interessa?',
                options: ['Teatro', 'Televisão', 'Cinema', 'Outro']
            }
        ],
        'Música': [
            {
                id: '1',
                question: 'Qual instrumento musical você deseja aprender?',
                options: ['Violão', 'Piano', 'Bateria', 'Guitarra', 'Outro']
            },
            {
                id: '2',
                question: 'Qual seu nível de experiência?',
                options: ['Iniciante', 'Intermediário', 'Avançado']
            }
        ],
        'Pré-Vestibular': [
            {
                id: '1',
                question: 'Qual sua área de interesse?',
                options: ['Exatas', 'Humanas', 'Biológicas', 'Outras']
            },
            {
                id: '2',
                question: 'Você prefere aulas presenciais ou online?',
                options: ['Presenciais', 'Online']
            }
        ], 'Diarista': [
            {
                id: '1',
                question: 'Quantos dias por semana você necessita de serviços?',
                options: ['1 dia', '2 dias', '3 dias', 'Mais de 3 dias']
            },
            {
                id: '2',
                question: 'Qual o tamanho da sua residência?',
                options: ['Pequena', 'Média', 'Grande']
            },
            {
                id: '3',
                question: 'Você prefere um serviço mais geral ou específico?',
                options: ['Geral', 'Específico (ex: limpeza de cozinha, banheiro, etc.)']
            }
        ],
        'Cozinheira': [
            {
                id: '1',
                question: 'Qual o tipo de comida você prefere?',
                options: ['Caseira', 'Gourmet', 'Fit', 'Vegana', 'Outras']
            },
            {
                id: '2',
                question: 'Você tem alguma restrição alimentar?',
                options: ['Sim', 'Não']
            },
            {
                id: '3',
                question: 'Qual a frequência das refeições que você precisa?',
                options: ['Diária', 'Semanal', 'Eventual']
            }
        ],
        'Babá': [
            {
                id: '1',
                question: 'Qual a faixa etária da criança?',
                options: ['Bebê (0-2 anos)', 'Criança (3-5 anos)', 'Adolescente (6-12 anos)']
            },
            {
                id: '2',
                question: 'Qual o horário de serviço necessário?',
                options: ['Diurno', 'Noturno', '24 horas']
            },
            {
                id: '3',
                question: 'Você prefere uma babá com experiência ou sem?',
                options: ['Com experiência', 'Sem experiência']
            }
        ],
        'Lavadeira': [
            {
                id: '1',
                question: 'Qual a quantidade de roupa que você precisa lavar por semana?',
                options: ['Pequena quantidade', 'Média quantidade', 'Grande quantidade']
            },
            {
                id: '2',
                question: 'Você precisa de serviço de lavanderia para roupas delicadas?',
                options: ['Sim', 'Não']
            },
            {
                id: '3',
                question: 'Qual o tipo de serviço você prefere?',
                options: ['Lavagem simples', 'Lavagem e passar roupa']
            }
        ],
        'Limpeza de Piscina': [
            {
                id: '1',
                question: 'Qual o tamanho da sua piscina?',
                options: ['Pequena', 'Média', 'Grande']
            },
            {
                id: '2',
                question: 'Qual a frequência necessária para a limpeza?',
                options: ['Semanal', 'Quinzenal', 'Mensal']
            },
            {
                id: '3',
                question: 'Você possui algum sistema de filtragem?',
                options: ['Sim', 'Não']
            }
        ],
        'Personal Shopper': [
            {
                id: '1',
                question: 'Qual seu estilo de roupa?',
                options: ['Casual', 'Formal', 'Descontraído', 'Esportivo', 'Outro']
            },
            {
                id: '2',
                question: 'Qual é seu orçamento para compras?',
                options: ['Baixo', 'Médio', 'Alto']
            },
            {
                id: '3',
                question: 'Você prefere receber sugestões ou fazer compras por conta própria?',
                options: ['Sugestões', 'Comprar por conta própria']
            }
        ],
        'Segurança Particular': [
            {
                id: '1',
                question: 'Qual a necessidade de segurança?',
                options: ['Residencial', 'Comercial', 'Pessoal']
            },
            {
                id: '2',
                question: 'Qual o nível de risco da sua situação?',
                options: ['Baixo', 'Médio', 'Alto']
            },
            {
                id: '3',
                question: 'Você precisa de um segurança armado?',
                options: ['Sim', 'Não']
            }
        ],
        'Segurança Patrimonial': [
            {
                id: '1',
                question: 'Qual o tamanho da área a ser protegida?',
                options: ['Pequena', 'Média', 'Grande']
            },
            {
                id: '2',
                question: 'Qual o nível de segurança você deseja?',
                options: ['Monitoramento', 'Segurança 24h', 'Prevenção e alarme']
            },
            {
                id: '3',
                question: 'Você prefere usar câmeras de segurança?',
                options: ['Sim', 'Não']
            }
        ],
        'Personal Organizer': [
            {
                id: '1',
                question: 'Qual o tamanho da área que precisa ser organizada?',
                options: ['Pequena', 'Média', 'Grande']
            },
            {
                id: '2',
                question: 'Quais áreas você precisa organizar?',
                options: ['Casa', 'Escritório', 'Outras']
            },
            {
                id: '3',
                question: 'Você prefere um serviço de organização contínuo ou pontual?',
                options: ['Contínuo', 'Pontual']
            }
        ],
        'Motorista': [
            {
                id: '1',
                question: 'Qual o tipo de transporte você precisa?',
                options: ['Carro', 'Van', 'Caminhão']
            },
            {
                id: '2',
                question: 'Qual a frequência do serviço?',
                options: ['Diária', 'Semanal', 'Eventual']
            },
            {
                id: '3',
                question: 'Você precisa de um motorista que fale outro idioma?',
                options: ['Sim', 'Não']
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