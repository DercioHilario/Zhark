export type Message = {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    createdAt: Date;
    imageUri?: string;
    status: 'sent' | 'delivered' | 'read' | 'sending' | 'failed' | 'seen';
};
