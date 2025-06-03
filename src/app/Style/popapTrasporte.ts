import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    map: {
        flex: 1,
    },

    header: {
        width: '100%',
        height: 45,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    headerTitle: {
        fontFamily: "Wellfleet",
        fontSize: 22,
    },

    searchContainer: {
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
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    formContainer: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 24,
        width: '100%',
        maxWidth: 500,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        fontFamily: "Wellfleet",
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 10,
        textAlign: 'center',
        fontFamily: "Wellfleet",
    },
    inputGroup: {
        marginBottom: 10,
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
        borderColor: '#ddd',
        borderRadius: 12,
        padding: 10,
        fontSize: 15,
        fontFamily: "Wellfleet",
    },
    locationInput: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 12,
        padding: 5,
    },
    locationTextInput: {
        flex: 1,
        marginLeft: 8,
        fontSize: 15,
        fontFamily: "Wellfleet",
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 10,
    },
    cancelButton: {
        flex: 1,
        padding: 15,
        borderRadius: 12,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
    },
    cancelButtonText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#666',
        fontFamily: "Wellfleet",
    },
    submitButton: {
        flex: 2,
        padding: 15,
        borderRadius: 12,
        backgroundColor: '#000',
        alignItems: 'center',
    },
    submitButtonDisabled: {
        backgroundColor: '#ccc',
    },
    submitButtonText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#fff',
        fontFamily: "Wellfleet",
    },
    calculatingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    calculatingText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#fff',
        fontFamily: "Wellfleet",
    },


    mapContainer: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
    },
    mapButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "white",
        width: "100%",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },

    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },

    loadingText: {
        marginTop: 10,
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
        fontFamily: "Wellfleet",
    },

    priceModalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },

    priceModalContent: {
        backgroundColor: "white",
        padding: 24,
        borderRadius: 16,
        width: "80%",
        alignItems: "center",
        elevation: 5,
    },

    priceTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 16,
    },

    priceValue: {
        fontSize: 24,
        color: "#28a745",
        marginBottom: 24,
    },

    inputWithIcon: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 8,
        marginBottom: 10,
    },

    inputFlex: {
        flex: 1,
        fontSize: 16,
        marginRight: 10,
    },

    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalContent: {
        width: "80%",
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 10,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
    },
    modalPrice: {
        fontSize: 18,
        color: "#333",
        marginBottom: 10,
    },
    modalButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    modalCancel: {
        padding: 10,
        backgroundColor: "#ccc",
        borderRadius: 5,
    },
    modalConfirm: {
        padding: 10,
        backgroundColor: "#28a745",
        borderRadius: 5,
    },
    modalText: {
        fontSize: 16,
        color: "#555",
        marginBottom: 10,
    },

});