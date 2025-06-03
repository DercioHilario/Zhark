import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },

    carousel: {
        height: 230,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: -40,
    },
    categoria: {
        fontFamily: "Wellfleet",
        fontSize: 18,
        marginBottom: 15,
        marginLeft: 15,
        marginTop: -10,
    },

    categoriesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 8,
        paddingHorizontal: 15,
    },

    categoryItem: {
        backgroundColor: 'hsla(0, 0%, 95%, 0.45)',
        borderRadius: 12,
        padding: 10,
        alignItems: 'center', // Substitui text-align: center
        justifyContent: 'center',
        borderWidth: 0.1, // Substitui border: 0.1px solid
        borderColor: 'hsla(0, 0%, 90%, 0.999)',
        shadowColor: '#000', // Equivalente ao box-shadow
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 2, // Adiciona sombra no Android
        width: '31%',
    },
    categoryItemPressed: {
        transform: [{ scale: 0.95 }], // Equivalente ao efeito de "click" (cursor pointer + transition)
    },
    categoryItemHovered: {
        transform: [{ scale: 1.05 }], // Simula o efeito de hover
    },

    imgContainer: {
        marginBottom: 8, // Adiciona espaçamento entre a imagem e o texto
    },
    img: {
        width: 65,
        height: 65,
        resizeMode: 'cover',
    },
    categoryText: {
        fontSize: 14,
        color: '#0a0a0a',
        fontFamily: "Wellfleet",
    },
    headerContainer: {
        flexDirection: 'column',
    },
    header: {
        marginBottom: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 10,
        marginTop: 5,
    },
    headerTitle: {
        fontSize: 30,
        color: 'black',
        fontFamily: "Wellfleet",
        marginLeft: 15,
    },
});
