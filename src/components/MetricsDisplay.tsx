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
        <div className={`grid grid-cols-3 gap-4 md:gap-8 py-6 border-y border-border/50 ${className}`}>
            <MetricCard
                value="50k+"
                label="Daily Transactions"
                icon={<TrendingUp className="w-4 h-4" />}
                delay="0.3s"
            />
            <MetricCard
                value="99.99%"
                label="Uptime SLA"
                icon={<Zap className="w-4 h-4" />}
                delay="0.4s"
            />
            <MetricCard
                value="10+"
                label="Projects Shipped"
                icon={<Award className="w-4 h-4" />}
                delay="0.5s"
            />
        </div>
    );
};
