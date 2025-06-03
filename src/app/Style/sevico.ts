import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        paddingTop: 10,
        paddingBottom: 15,
        paddingHorizontal: 20,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    headerTitle: {
        fontFamily: "Wellfleet",
        fontSize: 22,
        color: '#1F2937',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        marginHorizontal: 10,
        paddingHorizontal: 16,
        borderRadius: 12,
        height: 50,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        marginTop: 5,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontFamily: "Wellfleet",
        fontSize: 16,
        color: '#1F2937',
    },
    servicesList: {
        padding: 10,
    },
    serviceItem: {
        flex: 1,
        margin: 8,
        height: 120,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
        alignItems: 'center'
    },
    serviceImage: {
        width: 75,
        height: 75,
        resizeMode: "cover",
        margin: 8,
    },
    serviceText: {
        textAlign: 'center',
        marginTop: 2,
        paddingHorizontal: 8,
        fontSize: 13.5,
        color: "#333",
        fontFamily: "Wellfleet",
    },

    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.9)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        height: '90%',
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
    },
    modalBackButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F1F5F9',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        color: '#333',
        textAlign: 'center',
        marginHorizontal: 5,
        fontFamily: "Wellfleet",
    },
    subcategoryItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
        marginHorizontal: 16,
    },
    subcategoryText: {
        fontFamily: "Wellfleet",
        fontSize: 16,
        color: '#1F2937',
    },
    progressContainer: {
        padding: 20,
    },
    progressBar: {
        height: 8,
        backgroundColor: '#E2E8F0',
        borderRadius: 4,
        marginBottom: 8,
    },
    progressFill: {
        height: 8,
        backgroundColor: '#2563EB',
        borderRadius: 4,
    },
    progressText: {
        fontFamily: "Wellfleet",
        fontSize: 14,
        color: '#64748B',
        textAlign: 'right',
    },
    questionContainer: {
        flex: 1,
    },
    questionText: {
        fontFamily: "Wellfleet",
        fontSize: 18,
        color: '#1F2937',
        textAlign: 'center',
    },

    optionsContainer: {
        marginTop: 15,
    },

    optionButton: {
        backgroundColor: '#F1F5F9',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        marginHorizontal: 10,
    },

    optionButtonSelected: {
        backgroundColor: '#EBF5FF',
        borderColor: '#2563EB',
    },

    optionText: {
        fontFamily: "Wellfleet",
        fontSize: 16,
        color: '#1F2937',
    },

    optionTextSelected: {
        color: '#2563EB',
    },

    modalNavButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#E2E8F0',
    },
    backButton: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        backgroundColor: '#FFFFFF',
    },
    backButtonText: {
        fontFamily: "Wellfleet",
        fontSize: 16,
        color: '#64748B',
    },
    nextButton: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        backgroundColor: '#2563EB',
    },
    nextButtonDisabled: {
        backgroundColor: '#94A3B8',
    },
    nextButtonText: {
        fontFamily: "Wellfleet",
        fontSize: 16,
        color: '#FFFFFF',
    },
    calculationContainer: {
        padding: 20,
        flex: 1,
    },
    calculationHeader: {
        alignItems: 'center',
        marginBottom: 30,
    },
    calculationTitle: {
        fontFamily: "Wellfleet",
        fontSize: 24,
        color: '#1F2937',
        marginTop: 16,
    },
    calculationDetails: {
        backgroundColor: '#F8FAFC',
        borderRadius: 16,
        padding: 20,
        marginBottom: 30,
    },
    calculationRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    calculationLabel: {
        fontFamily: "Wellfleet",
        fontSize: 16,
        color: '#64748B',
    },
    calculationValue: {
        fontFamily: "Wellfleet",
        fontSize: 16,
        color: '#1F2937',
    },
    calculationTotal: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: '#E2E8F0',
    },
    totalLabel: {
        fontFamily: "Wellfleet",
        fontSize: 18,
        color: '#1F2937',
    },
    totalValue: {
        fontFamily: "Wellfleet",
        fontSize: 24,
        color: '#2563EB',
    },
    confirmButton: {
        backgroundColor: '#2563EB',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    confirmButtonText: {
        fontFamily: "Wellfleet",
        fontSize: 16,
        color: '#FFFFFF',
    },

    priceContainer: {
        padding: 20,
        flex: 1,
    },

    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#94A3B8',
    },

    skeletonCard: {
        width: '48%',
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        borderRadius: 12,
        padding: 8,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        height: 120,
    },
    skeletonImage: {
        backgroundColor: '#E5E7EB',
        borderRadius: 8,
        width: 85,
        height: 85,
        marginBottom: 10,
    },
    skeletonText: {
        width: '80%',
        height: 12,
        backgroundColor: '#D1D5DB',
        borderRadius: 6,
        marginBottom: 5,
    },
    productsWrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        margin: 20
    },
    noResultsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    noResultsText: {
        fontSize: 18,
        color: '#666',
        textAlign: 'center',
        fontFamily: "Wellfleet",
    }
});