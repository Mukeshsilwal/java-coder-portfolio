interface StatusBadgeProps {
    available?: boolean;
    experience?: string;
    className?: string;
}

export const StatusBadge = ({
    available = true,
    experience = "5+ Years Experience",
    className = ''
}: StatusBadgeProps) => {
    return (
        <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full 
                    bg-gradient-to-r from-success/10 to-primary/10 
                    border border-success/20 backdrop-blur-xl
                    animate-fade-up ${className}`}>
            {available && (
                <>
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full 
                           rounded-full bg-success opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 
                           bg-success shadow-glow-accent"></span>
                    </span>
                    <span className="text-sm font-semibold text-foreground">
                        Available for Work
                    </span>
                </>
            )}
            {experience && (
                <>
                    <span className="text-sm text-muted-foreground">•</span>
                    <span className="text-sm text-muted-foreground">
                        {experience}
                    </span>
                </>
            )}
        </div>
    );
};
