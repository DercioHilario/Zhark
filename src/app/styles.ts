import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        backgroundColor: "#fff",
        paddingHorizontal: 15,
    },
    logoContainer: {
        marginTop: 45,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",

    },
    logo: {
        width: 225,
        height: 150,
        resizeMode: "contain",
    },
    formContainer: {
        width: "100%",
        height: 350,
        backgroundColor: "#FFFFFF", // Fundo branco
        borderRadius: 10,
        padding: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3, // Para Android
    },
    title: {
        textAlign: 'center',
        fontSize: 25,
        marginBottom: 15,
        fontFamily: "Wellfleet"
    },
    subtitle: {
        fontSize: 17,
        marginBottom: 2,
        fontFamily: "Wellfleet"
    },
    input: {
        height: 40,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        paddingHorizontal: 15,
        fontSize: 16,
        marginBottom: 10,
        width: "100%",
        fontFamily: "Wellfleet"
    },

    passwordContainer: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        position: "relative",
        gap: 10,
    },
    passwordInput: {
        flex: 1,
        paddingRight: 40, // Para dar espaço ao ícone,
    },
    eyeButton: {
        position: "absolute",
        right: 10,
        top: "15%",
        flex: 1,
    },
    button: {
        width: "100%",
        height: 45,
        backgroundColor: "#000",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        marginTop: 10,
    },

    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontFamily: "Wellfleet"
    },

    ou: {
        color: "#ccc",
        textAlign: 'center',
        fontSize: 17,
        fontFamily: "Wellfleet",
        marginTop: 10,
    },
    createContainer: {
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    createButton: {
        padding: 10,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
    },
    createButtonText: {
        color: "#007BFF",
        fontSize: 18,
        fontFamily: "Wellfleet"
    },

    modalContainer: {
        flex: 1,
        alignItems: "center",
        backgroundColor: "#fff",
        paddingHorizontal: 15,
        justifyContent: "center",

    },

    modalContent: {
        width: "100%",
        height: 400,
        backgroundColor: "#FFFFFF", // Fundo branco
        borderRadius: 10,
        padding: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3, // Para Android
    },

    modalTitle: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 15,
        fontFamily: "Wellfleet",
    },
    modalsubTitle: {
        fontSize: 14,
        marginBottom: 10,
        textAlign: 'center',
        fontFamily: "Wellfleet",
        width: "110%",
    },
    phoneInputContainer: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        position: "relative",
        gap: 1,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
    },

    callingCode: {
        marginLeft: -12,
        marginRight: 5,
    },

    input1: {
        marginTop: 2.1,
    },
    inputmodal: {
        height: 45,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        paddingHorizontal: 15,
        fontSize: 16,
        width: "100%"
    },

    modalButtonsContainer: {
        borderColor: "#1cc",

    },
    backButton: {
        padding: 15,
        borderRadius: 8,
        alignItems: "center",
    },
    backButtonText: {
        color: "red",
        fontSize: 16,
        fontFamily: "Wellfleet"
    }

});
