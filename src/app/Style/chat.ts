import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    chatContainer: {
        flex: 1,
        paddingHorizontal: 10,
    },
    messageContainer: {
        marginVertical: 5,
        padding: 10,
        maxWidth: '80%',
        borderBottomStartRadius: 10,
        borderTopStartRadius: 10,
        borderTopEndRadius: 10,
    },
    userMessage: {
        backgroundColor: '#DCF8C6',
        alignSelf: 'flex-end',
    },
    botMessage: {
        backgroundColor: '#F1F0F0',
        alignSelf: 'flex-start',
    },
    messageText: {
        fontSize: 16,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderTopWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#fff',
    },
    input: {
        flex: 1,
        fontSize: 16,
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: '#f2f2f2',
        borderRadius: 20,
        marginRight: 10,
    },
    recordingIndicator: {
        position: 'absolute',
        bottom: 90,
        left: 20,
        right: 20,
        backgroundColor: '#fefefe',
        borderRadius: 12,
        padding: 8,
        marginBottom: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    recordingText: {
        fontSize: 16,
        color: '#d32f2f',
        marginBottom: 5,
    },
    progressBarContainer: {
        height: 6,
        backgroundColor: '#FFD180',
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressBar: {
        height: 6,
        backgroundColor: '#FF6F00',
    },
    audioActionBar: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        paddingVertical: 15,
        backgroundColor: '#F5F5F5',
        borderTopWidth: 1,
        borderColor: '#ccc',
    },
    sendButton: {
        backgroundColor: '#4CAF50',
        borderRadius: 50,
        padding: 15,
        elevation: 2,
    },
    cancelButton: {
        backgroundColor: '#F44336',
        borderRadius: 50,
        padding: 15,
        elevation: 2,
    },
    // Novos estilos para o feedback de pressionar o botão
    holdFeedbackContainer: {
        alignItems: 'center',
        marginBottom: 10,
    },
    holdText: {
        fontSize: 14,
        color: '#555',
        marginBottom: 4,
    },
    holdProgressBarBackground: {
        height: 5,
        width: '80%',
        backgroundColor: '#ccc',
        borderRadius: 5,
        overflow: 'hidden',
    },
    holdProgressBar: {
        height: 5,
        backgroundColor: '#075e54',
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: 300,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
    },
    modalCloseButton: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    modalTitle: {
        fontSize: 18,
        marginBottom: 15,
    },
    modalOption: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },

    mediaOptionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#f0f0f0',
        paddingVertical: 10,
        borderTopWidth: 1,
        borderColor: '#ddd',
    },

    mediaOptionButton: {
        alignItems: 'center',
    },

    mediaOptionText: {
        fontSize: 12,
        color: '#075e54',
        marginTop: 4,
    },
});

export default styles;
