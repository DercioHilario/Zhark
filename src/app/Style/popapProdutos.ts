import { StyleSheet, Dimensions } from "react-native";
const { width } = Dimensions.get('window');

export default StyleSheet.create({

    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        flex: 1,
        backgroundColor: '#fff',
        marginTop: 35,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        overflow: 'hidden',
    },
    closeButton: {
        position: 'absolute',
        right: 15,
        top: 15,
        zIndex: 1,
        backgroundColor: '#ffffff',
        padding: 8,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    productImage: {
        width: width,
        height: 200,
        resizeMode: 'contain',
    },
    indicators: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingVertical: 5,
    },
    indicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#ccc',
        marginHorizontal: 4,
    },
    indicatorActive: {
        backgroundColor: '#000',
    },
    detailsContainer: {
        paddingHorizontal: 10,
    },
    productName: {
        fontSize: 22,
        fontFamily: "Wellfleet",
        marginLeft: 10,
    },
    productPrice: {
        fontSize: 18,
        color: '#4CAF50',
        marginBottom: 5,
        fontFamily: "Wellfleet",
        textAlign: 'right',
        marginRight: 10,
    },
    sectionTitle: {
        fontSize: 16,
        fontFamily: "Wellfleet",
        marginTop: 0,
        marginBottom: 2,
    },
    description: {
        fontFamily: "Wellfleet",
        fontSize: 14,
        color: '#555',
        marginBottom: 5,
        textAlign: 'justify',
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    listText: {
        marginLeft: 8,
        fontSize: 14,
        color: '#333',
        fontFamily: "Wellfleet",
    },
    colorContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginVertical: 1,
    },
    colorOption: {
        width: 30,
        height: 30,
        borderRadius: 15,
        margin: 6,
        borderWidth: 2,
        borderColor: '#ccc',
    },
    colorOptionSelected: {
        borderColor: '#000',
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 1,
    },
    quantityButton: {
        padding: 8,
        backgroundColor: '#ccc',
        borderRadius: 8,
    },
    quantityText: {
        fontSize: 16,
        marginHorizontal: 12,
        fontFamily: "Wellfleet",
    },
    addToCartButton: {
        backgroundColor: '#000',
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 5,
        marginBottom: 5
    },
    addedToCartButton: {
        backgroundColor: '#4CAF50',
    },
    addToCartText: {
        color: '#fff',
        fontSize: 16,
        marginRight: 8,
        fontFamily: "Wellfleet",
    },
    checkIcon: {
        marginLeft: 4,
    },
    sizeContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginTop: 10,
        marginBottom: 20,
    },
    sizeOption: {
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        backgroundColor: '#fff',
    },
    sizeOptionSelected: {
        borderColor: '#000',
        backgroundColor: '#000',
    },
    sizeText: {
        color: '#000',
        fontSize: 16,
    },
    sizeTextSelected: {
        color: '#fff',
    },

    optionButton: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        margin: 5,
    },
    optionSelected: {
        backgroundColor: '#ddd',
        borderColor: '#000',
    },
    optionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 10,
    },
    colorButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5,
        borderWidth: 2,
        borderColor: '#ccc',
    },

    colorCircle: {
        width: 30,
        height: 30,
        borderRadius: 15,
    },
    FooterContainer: {
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        backgroundColor: '#fff',
    },
    footerFixed: {
        backgroundColor: '#E5E7EB',
        padding: 10,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
    },
    replayButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 30,
        alignSelf: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    replayText: {
        color: '#fff',
        fontSize: 16,
        marginLeft: 8,
        fontWeight: '600',
    },
});