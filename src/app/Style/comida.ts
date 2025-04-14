import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
        fontFamily: "Wellfleet",
        marginTop: -38,
    },

    headerContainer: {
        flexDirection: 'column',
        fontFamily: "Wellfleet",
    },
    header: {
        backgroundColor: '#F3F4F6',
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontFamily: "Wellfleet",
    },
    headerTitle: {
        fontSize: 24,
        color: 'black',
        fontFamily: "Wellfleet",
    },
    cartButton: {
        padding: 8,
        borderRadius: 20,
    },
    cartBadge: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: '#0077BE',
        borderRadius: 10,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cartBadgeText: {
        color: 'black',
        fontSize: 12,
        fontWeight: 'bold',
        fontFamily: "Wellfleet",
    },
    content: {
        flex: 1,
    },
    searchContainer: {
        margin: 10,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 8,
        paddingHorizontal: 10,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        fontFamily: "Wellfleet",
    },

    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 12,
        fontFamily: "Wellfleet",
        marginLeft: 10,
    },
    productsContainer: {
        marginHorizontal: 10,
    },
    productCard: {
        backgroundColor: 'white',
        borderRadius: 8,
        marginBottom: 16,
        width: '48%', // Ajuste para evitar excesso de margem
        height: 230,
        fontFamily: "Wellfleet",
    },
    productImage: {
        width: '100%',
        height: '50%',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
    },
    productInfo: {
        paddingHorizontal: 8,
    },
    productName: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
        marginTop: 4,
        fontFamily: "Wellfleet",
    },
    productDescription: {
        color: '#6B7280',
        marginBottom: 12,
        fontFamily: "Wellfleet",
    },
    productFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    productPrice: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1CA9C9',
        fontFamily: "Wellfleet",
    },

    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.90)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 12,
        maxHeight: '80%',
        marginHorizontal: 5,
    },
    modalImageContainer: {
        position: 'relative',
    },
    modalImage: {
        width: '100%',
        height: 250,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
    },
    modalCloseButton: {
        position: 'absolute',
        top: 16,
        right: 16,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 8,
    },
    modalInfo: {
        padding: 16,
    },
    modalTitle: {
        fontSize: 24,
        marginBottom: 8,
        fontFamily: "Wellfleet",
    },
    modalDescription: {
        color: '#6B7280',
        marginBottom: 16,
        fontFamily: "Wellfleet",
    },

    modalPrice: {
        fontSize: 24,
        color: '#1CA9C9',
        marginBottom: 16,
        fontFamily: "Wellfleet",
    },
    modalAddButton: {
        backgroundColor: '#1CA9C9',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    modalAddButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
        fontFamily: "Wellfleet",
    },
    cartModal: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    cartContent: {
        backgroundColor: 'white',
        height: '100%',
        width: '100%',
    },
    cartHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    cartTitle: {
        fontSize: 20,
        fontWeight: '600',
        fontFamily: "Wellfleet",
    },
    emptyCart: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyCartText: {
        color: '#6B7280',
        fontSize: 16,
        fontFamily: "Wellfleet",
    },
    cartItems: {
        flex: 1,
        padding: 16,
    },
    cartItem: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 12,
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    cartItemImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
    },
    cartItemInfo: {
        flex: 1,
        marginLeft: 12,
        fontFamily: "Wellfleet",
    },
    cartItemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    cartItemName: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
        fontFamily: "Wellfleet",
    },
    cartItemPrice: {
        color: '#6B7280',
        fontFamily: "Wellfleet",
    },
    quantityControls: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    quantityButton: {
        borderRadius: 5,
        paddingHorizontal: 16,
        paddingVertical: 6,
        backgroundColor: '#d6d6d6',
    },
    quantityButtonText: {
        color: 'BLACK',
        fontSize: 18,
        fontWeight: '600',
        fontFamily: "Wellfleet",
    },
    quantityText: {
        marginHorizontal: 16,
        fontSize: 16,
        fontFamily: "Wellfleet",
    },
    cartFooter: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: '600',
        fontFamily: "Wellfleet",
    },
    totalPrice: {
        fontSize: 18,
        fontFamily: "Wellfleet",
    },
    checkoutButton: {
        backgroundColor: '#1CA9C9',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    checkoutButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
        fontFamily: "Wellfleet",
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
        borderRadius: 8,
        padding: 5,
    },
    quantityValue: {
        fontSize: 18,
        marginHorizontal: 10,
        color: '#333',
        fontFamily: "Wellfleet",
    },
});