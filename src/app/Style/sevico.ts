import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },

    header: {
        width: '100%',
        height: 45,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
    },

    headerTitle: {
        fontFamily: "Wellfleet",
        fontSize: 22,
    },


    searchContainer: {
        marginHorizontal: 10,
        marginBottom: 20,
    },

    searchContainerModel: {
        marginHorizontal: 10,

    },

    search: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f0f0f0",
        borderRadius: 20,
        paddingHorizontal: 10,
        width: "100%",
        height: 40,
        marginTop: 5,
    },
    searchInput: {
        flex: 1,
        color: "#000",
        fontFamily: "Wellfleet",
    },
    searchIcon: {
        marginLeft: 5,
    },

    listContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        alignItems: 'center',
        marginTop: 30,
    },

    serviceItem: {
        width: "45%",
        padding: 5,
        backgroundColor: "#ddd",
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 10,
        marginVertical: 8,
    },

    serviceText: {
        fontSize: 13,
        color: "#333",
        fontFamily: "Wellfleet",
    },
    serviceImage: {
        width: 70,
        height: 70,
        resizeMode: "cover",
        marginBottom: 8,
    },

    loadingText: {
        fontSize: 18,
        textAlign: "center",
        marginTop: 50,
        color: "#666",
    },

    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.84)',
        padding: 15,
    },
    modalContentQ: {
        backgroundColor: '#fff',
        borderRadius: 20,
        minHeight: '80%',
    },
    modalContent: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 5,
        alignItems: 'center',
        elevation: 5,
    },

    modalHeader: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        margin: 5,
    },

    modalTitle: {
        fontSize: 18,
        marginBottom: 10,
        color: '#333',
        textAlign: 'center',
        marginHorizontal: 10,
        fontFamily: "Wellfleet",
    },
    modalQuestion: {
        fontSize: 16,
        textAlign: 'center',
        marginVertical: 10,
        color: '#555',
    },
    modalInput: {
        width: '100%',
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 15,
    },
    modalButton: {
        backgroundColor: '#007bff',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: 'center',
    },
    modalButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },

    progressBarContainer: {
        width: "100%",
        height: 10,
        backgroundColor: "#ddd",
        borderRadius: 5,
    },

    modalBackButton: {
        marginBottom: 10,
    },

    subcategoria: {
        backgroundColor: "#ddd",
        borderRadius: 10,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 55,
        paddingHorizontal: 10,
        marginTop: 10,
    },

    subcategoriaText: {
        fontSize: 18,
        color: "#333",
        fontFamily: "Wellfleet",
    },

    progressContainer: {
        paddingHorizontal: 16,
    },
    progressBar: {
        height: 8,
        backgroundColor: '#eee',
        borderRadius: 4,
        marginBottom: 8,
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#2196F3',
        borderRadius: 4,
    },
    progressText: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        fontFamily: "Wellfleet",
    },
    questionContainer: {
        padding: 16,
        flex: 1,
    },
    questionText: {
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 20,
        fontFamily: "Wellfleet",
    },
    optionsContainer: {
        gap: 12,
    },
    optionButton: {
        padding: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#fff',
    },
    optionButtonSelected: {
        borderColor: '#2196F3',
        backgroundColor: '#E3F2FD',
    },
    optionText: {
        fontSize: 16,
        color: '#333',
        fontFamily: "Wellfleet",
    },
    optionTextSelected: {
        color: '#2196F3',
    },
    completionContainer: {
        padding: 10,
        alignItems: 'center',
    },
    completionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    completionText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        fontFamily: "Wellfleet",
    },
    modalButtonP: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
        marginBottom: 15,
    },
    modalVoltrButton: {
        backgroundColor: '#f5f5f5',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#2196F3',
        width: '45%'
    },
    modalProximoButton: {
        backgroundColor: '#2196F3',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        width: '45%'
    },
    modalProximoButtonDisabled: {
        backgroundColor: '#ccc',
    },
    modalVoltarTexto: {
        color: 'black',
        fontSize: 16,
        fontWeight: '500',
        fontFamily: "Wellfleet",
        textAlign: 'center',
    },
    orcamentoText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2E8B57',
        marginVertical: 20,
        textAlign: 'center'
    },
    finalizarButton: {
        backgroundColor: '#2E8B57',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        marginTop: 20,
        width: '80%',
        alignSelf: 'center'
    },
    finalizarButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center'
    }
});