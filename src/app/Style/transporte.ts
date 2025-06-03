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

    handle: {
        width: 40,
        height: 4,
        backgroundColor: '#DDD',
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        marginBottom: 20,
        fontFamily: "Wellfleet",
    },
    optionsContainer: {
        padding: 15,
    },
    optionCard: {
        backgroundColor: '#fff',
        borderRadius: 15,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    selectedCard: {
        borderWidth: 2,
        borderColor: '#000',
    },
    optionImage: {
        width: '100%',
        height: 120,
        resizeMode: 'contain',
    },
    optionInfo: {
        padding: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    optionName: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 5,
        fontFamily: "Wellfleet",
        textAlign: 'center',
    },
    optionDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
        fontFamily: "Wellfleet",
        textAlign: 'center',
    },
    bookButton: {
        backgroundColor: '#000',
        paddingVertical: 10,
        marginHorizontal: 15,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 30,
    },
    bookButtonDisabled: {
        backgroundColor: '#CCC',
    },
    bookButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
        fontFamily: "Wellfleet",
    },

});
