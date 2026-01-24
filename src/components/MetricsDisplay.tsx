import { TrendingUp, Zap, Award } from 'lucide-react';

interface MetricCardProps {
    value: string;
    label: string;
    icon?: React.ReactNode;
    delay?: string;
}

export const MetricCard = ({ value, label, icon, delay = '0s' }: MetricCardProps) => {
    return (
        <div
            className="text-center animate-fade-up"
            style={{ animationDelay: delay }}
        >
            <div className="flex items-center justify-center gap-2 mb-2">
                {icon && <div className="text-success">{icon}</div>}
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    {value}
                </div>
            </div>
            <div className="text-xs md:text-sm text-muted-foreground uppercase tracking-wide font-medium">
                {label}
            </div>
        </div>
    );
};

interface MetricsDisplayProps {
    className?: string;
}

export const MetricsDisplay = ({ className = '' }: MetricsDisplayProps) => {
    return (
        <section className={`py-12 bg-background/50 border-y border-border/50 ${className}`}>
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-4xl mx-auto">
                    <MetricCard
                        value="50k+"
                        label="Daily Transactions"
                        icon={<TrendingUp className="w-5 h-5" />}
                        delay="0s"
                    />
                    <MetricCard
                        value="99.99%"
                        label="Uptime SLA"
                        icon={<Zap className="w-5 h-5" />}
                        delay="0.1s"
                    />
                    <MetricCard
                        value="10+"
                        label="Projects Shipped"
                        icon={<Award className="w-5 h-5" />}
                        delay="0.2s"
                    />
                </div>
            </div>
        </section>
    );
};
