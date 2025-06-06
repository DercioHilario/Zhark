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
        borderBlockColor: 'red'
    },

    sectionTitle: {
        fontSize: 20,
        fontFamily: "Wellfleet",
        color: '#000000',
        marginLeft: 10,
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
        width: "48%",
        backgroundColor: "#fefefe",
        borderRadius: 12,
        padding: 8,
        marginBottom: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },

    productImage: {
        width: '100%',
        height: 150,
        borderRadius: 8,
        resizeMode: 'contain',
        padding: 5,
    },
    productInfo: {
        marginHorizontal: 1,
        alignItems: 'center'
    },
    productName: {
        fontSize: 13,
        fontFamily: "Wellfleet",
        textAlign: 'center'
    },
    productPrice: {
        fontSize: 14,
        color: '#888',
        fontFamily: "Wellfleet",
    },

    skeletonCard: {
        width: '48%',
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        borderRadius: 12,
        padding: 8,
        marginBottom: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    skeletonImage: {
        width: '100%',
        height: 150,
        backgroundColor: '#E5E7EB',
        borderRadius: 8,
        marginBottom: 10,
    },
    skeletonText: {
        width: '80%',
        height: 12,
        backgroundColor: '#D1D5DB',
        borderRadius: 6,
        marginBottom: 6,
    },
    skeletonTextShort: {
        width: '50%',
        height: 12,
        backgroundColor: '#D1D5DB',
        borderRadius: 6,
    },

    noResultsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    noResultsText: {
        fontSize: 18,
        color: '#666',
        textAlign: 'center',
        fontFamily: "Wellfleet",
    },

    categoryButton: {
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        marginHorizontal: 5,
        borderWidth: 1,
        borderColor: '#D1D5DB',
    },
    categoryButtonActive: {
        backgroundColor: '#2563EB',
        borderColor: '#2563EB',
    },
    categoryText: {
        color: '#4B5563',
        fontSize: 14,
        fontFamily: "Wellfleet",
    },
    categoryTextActive: {
        color: '#FFFFFF',
        fontFamily: "Wellfleet",
    },

});