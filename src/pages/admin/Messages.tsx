
import { useEffect, useState } from 'react';
import { axiosInstance } from '@/api/axios';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { Trash2, Mail, Calendar, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Message {
    id: string;
    senderName: string;
    senderEmail: string;
    subject: string;
    message: string;
    createdAt: string;
    ipAddress?: string;
}

const Messages = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadMessages();
    }, []);

    const loadMessages = async () => {
        try {
            const response = await axiosInstance.get<any>('/contact');
            // Check if response.data is the array or if it's wrapped in { status, message, data: [...] }
            const msgs = Array.isArray(response.data) ? response.data : (response.data.data || []);
            setMessages(msgs);
        } catch (err) {
            console.error(err);
            toast.error('Failed to load messages');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this message?')) return;
        try {
            await axiosInstance.delete(`/contact/${id}`);
            toast.success('Message deleted');
            loadMessages();
        } catch (err) {
            toast.error('Failed to delete');
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Inbox</h1>

            <div className="space-y-4">
                {messages.map(msg => (
                    <Card key={msg.id} className="p-6 transition-all hover:bg-muted/10">
                        <div className="flex flex-col md:flex-row gap-4 items-start">
                            <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <h3 className="font-bold text-lg">{msg.subject}</h3>
                                    <Badge variant="outline" className="text-xs font-normal">
                                        <Calendar className="w-3 h-3 mr-1" />
                                        {new Date(msg.createdAt).toLocaleString()}
                                    </Badge>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1"><User className="w-3 h-3" /> {msg.senderName}</span>
                                    <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {msg.senderEmail}</span>
                                </div>
                                <div className="mt-4 p-4 bg-secondary/30 rounded-lg text-sm whitespace-pre-wrap font-mono">
                                    {msg.message}
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" className="text-destructive shrink-0" onClick={() => handleDelete(msg.id)}>
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </Card>
                ))}
                {messages.length === 0 && !loading && (
                    <div className="text-center py-20 text-muted-foreground">
                        <Mail className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        No messages yet.
                    </div>
                )}
            </div>
        </div>
    );
};

export default Messages;
