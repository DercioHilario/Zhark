import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    headerContainer: {
        flexDirection: 'column',
    },
    header: {
        backgroundColor: 'white',
        paddingHorizontal: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontFamily: "Wellfleet",
    },
    headerTitle: {
        fontSize: 28,
        fontFamily: "Wellfleet",
        color: '#000000',
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#666666',
        marginTop: 4,
    },
    searchContainer: {
        backgroundColor: '#F3F4F6',
        margin: 10,
        flexDirection: 'row',
        alignItems: 'center',
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

    featuredSection: {
        padding: 5,
    },

    sectionTitle: {
        fontSize: 20,
        fontFamily: "Wellfleet",
        marginBottom: 1,
        color: '#000000',
        marginLeft: 10,
    },

    backButton: {
        padding: 8,
    },
    productsWrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },

    productsContainer: {
        flex: 1,
        paddingHorizontal: 5,
    },

    productCard: {
        width: '48%', // dois por linha com espaço entre
        backgroundColor: '#F3F4F6',
        borderRadius: 8,
        marginBottom: 10,
        padding: 0,
    },
    productImage: {
        width: '100%',
        height: 150,
        borderRadius: 8,
    },
    productInfo: {
        marginHorizontal: 5,
        marginVertical: 2,

    },
    productName: {
        fontSize: 16,
        fontFamily: "Wellfleet",
    },
    productPrice: {
        fontSize: 14,
        color: '#888',
        fontFamily: "Wellfleet",
    },
});