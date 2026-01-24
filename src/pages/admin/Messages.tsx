
import { useEffect, useState } from 'react';
import { axiosInstance } from '@/api/axios';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { Trash2, Mail, Calendar, User, ChevronDown, ChevronUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Message {
    id: string;
    senderName: string;
    senderEmail: string;
    subject: string;
    message: string;
    createdAt: string;
    ipAddress?: string;
    read: boolean;
}

const MessageItem = ({ msg, onDelete, onRead }: { msg: Message; onDelete: (id: string) => void; onRead: (id: string) => void }) => {
    const [expanded, setExpanded] = useState(false);

    const handleExpand = async () => {
        console.log("Card clicked!", msg.id);
        const newExpanded = !expanded;
        setExpanded(newExpanded);

        if (newExpanded && !msg.read) {
            console.log("Marking as read:", msg.id);
            // Optimistic update
            onRead(msg.id);
            try {
                await axiosInstance.put(`/contact/${msg.id}/read`);
                console.log("API call success for:", msg.id);
            } catch (err) {
                console.error("Failed to mark as read", err);
                // Optionally revert if failed, but for read status it's low risk
            }
        }
    };

    return (
        <Card
            className={cn(
                "transition-all duration-200 cursor-pointer border-l-4",
                msg.read ? "border-l-transparent bg-card" : "border-l-primary bg-primary/5",
                expanded && "shadow-md scale-[1.01]"
            )}
            onClick={handleExpand}
        >
            <div className="p-4">
                <div className="flex flex-col md:flex-row gap-4 items-start justify-between">
                    <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                            <h3 className={cn("text-lg", !msg.read ? "font-bold" : "font-medium")}>
                                {msg.subject || "(No Subject)"}
                            </h3>
                            {!msg.read && (
                                <Badge variant="default" className="text-[10px] h-5 px-1.5 bg-primary text-primary-foreground">
                                    NEW
                                </Badge>
                            )}
                            <Badge variant="outline" className="text-xs font-normal text-muted-foreground border-transparent p-0">
                                <Calendar className="w-3 h-3 mr-1 inline" />
                                {new Date(msg.createdAt).toLocaleString()}
                            </Badge>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1"><User className="w-3 h-3" /> {msg.senderName}</span>
                            <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {msg.senderEmail}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(msg.id);
                            }}
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                        <div className="text-muted-foreground">
                            {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </div>
                    </div>
                </div>

                {expanded && (
                    <div className="mt-4 pt-4 border-t animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="p-4 bg-secondary/30 rounded-lg text-sm whitespace-pre-wrap font-mono leading-relaxed">
                            {msg.message}
                        </div>
                        <div className="mt-2 text-xs text-muted-foreground text-right">
                            IP: {msg.ipAddress || 'Unknown'}
                        </div>
                    </div>
                )}
            </div>
        </Card>
    );
};

const Messages = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadMessages();
    }, []);

    const loadMessages = async () => {
        try {
            const response = await axiosInstance.get<any>('/contact');
            const msgs = Array.isArray(response.data.data) ? response.data.data : (response.data || []);
            // Ensure compatibility with potentially different boolean naming
            const mapMsgs = msgs.map((m: any) => ({
                ...m,
                read: m.read !== undefined ? m.read : (m.isRead !== undefined ? m.isRead : false)
            }));
            setMessages(mapMsgs);
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
            setMessages(prev => prev.filter(m => m.id !== id));
        } catch (err) {
            toast.error('Failed to delete');
        }
    };

    const handleReadUpdate = (id: string) => {
        setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m));
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Inbox</h1>
                <Badge variant="secondary" className="text-sm">
                    {messages.filter(m => !m.read).length} Unread
                </Badge>
            </div>

            <div className="space-y-3">
                {messages.map(msg => (
                    <MessageItem
                        key={msg.id}
                        msg={msg}
                        onDelete={handleDelete}
                        onRead={handleReadUpdate}
                    />
                ))}

                {messages.length === 0 && !loading && (
                    <div className="text-center py-20 text-muted-foreground border-2 border-dashed rounded-xl">
                        <Mail className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p>No messages yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Messages;
