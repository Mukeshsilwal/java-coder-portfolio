import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Calendar, MapPin, Award, ExternalLink, BookOpen } from 'lucide-react';
import { publicApi } from '@/api/services';
import { Education as EducationType } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

const Education = () => {
    const [education, setEducation] = useState<EducationType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEducation = async () => {
            try {
                const data = await publicApi.getEducation();
                setEducation(data);
            } catch (error) {
                console.error("Failed to fetch education", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEducation();
    }, []);

    if (loading) {
        return (
            <section id="education" className="py-20 bg-background/50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <Skeleton className="h-10 w-48 mx-auto mb-4" />
                        <Skeleton className="h-4 w-64 mx-auto" />
                    </div>
                    <div className="max-w-4xl mx-auto space-y-8">
                        {[1, 2, 3].map((i) => (
                            <Skeleton key={i} className="h-40 w-full rounded-2xl" />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (education.length === 0) return null;

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "itemListElement": education.map((edu, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "item": {
                "@type": "Course",
                "name": edu.degree,
                "description": edu.description,
                "provider": {
                    "@type": "EducationalOrganization",
                    "name": edu.institution,
                    "address": edu.location
                }
            }
        }))
    };

    useEffect(() => {
        if (education.length > 0) {
            const script = document.createElement('script');
            script.type = 'application/ld+json';
            script.innerHTML = JSON.stringify(structuredData);
            document.head.appendChild(script);
            return () => {
                document.head.removeChild(script);
            };
        }
    }, [education]);

    return (
        <section id="education" className="py-24 relative overflow-hidden bg-background">
            {/* Background Decorative Elements */}
            <div className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10 animate-pulse" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl -z-10" />

            <div className="container mx-auto px-4 relative">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 flex items-center justify-center gap-3">
                            <GraduationCap className="text-primary w-8 h-8" />
                            Education <span className="text-primary text-gradient">Journey</span>
                        </h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            My academic background and certifications that shaped my technical foundation.
                        </p>
                    </motion.div>
                </div>

                <div className="relative max-w-5xl mx-auto">
                    {/* Vertical Line for Desktop & Mobile */}
                    <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/50 via-border to-transparent" />

                    <div className="space-y-12">
                        {education.map((item, index) => (
                            <EducationCard key={item.id} item={item} index={index} isLast={index === education.length - 1} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

interface EducationCardProps {
    item: EducationType;
    index: number;
    isLast: boolean;
}

const EducationCard = ({ item, index, isLast }: EducationCardProps) => {
    const isEven = index % 2 === 0;

    return (
        <motion.div
            initial={{ opacity: 0, x: isEven ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className={`relative flex items-center w-full ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}
        >
            {/* Dot on Timeline */}
            <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background z-10 shadow-[0_0_15px_rgba(var(--primary),0.5)]" />

            {/* Content Container */}
            <div className={`w-full md:w-[45%] pl-12 md:pl-0 ${isEven ? 'md:pr-12 md:text-right' : 'md:pl-12 md:text-left'}`}>
                <div className="p-6 rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-md hover:border-primary/30 transition-all group">
                    <div className={`flex items-center gap-2 mb-2 text-xs font-mono text-primary ${isEven ? 'md:justify-end' : 'md:justify-start'}`}>
                        <Calendar className="w-3 h-3" />
                        {new Date(item.startDate).getFullYear()} - {item.endDate ? new Date(item.endDate).getFullYear() : item.status}
                    </div>

                    <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                        {item.degree}
                    </h3>

                    <div className={`flex items-center gap-2 text-secondary-foreground font-medium mb-3 ${isEven ? 'md:justify-end' : 'md:justify-start'}`}>
                        <BookOpen className="w-4 h-4 text-primary/70" />
                        {item.institution}
                    </div>

                    <div className={`flex flex-wrap gap-4 text-sm text-muted-foreground mb-4 ${isEven ? 'md:justify-end' : 'md:justify-start'}`}>
                        {item.location && (
                            <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {item.location}
                            </span>
                        )}
                        {item.grade && (
                            <span className="flex items-center gap-1">
                                <Award className="w-3 h-3" />
                                {item.grade}
                            </span>
                        )}
                    </div>

                    <p className="text-sm text-muted-foreground leading-relaxed">
                        {item.description}
                    </p>

                    {item.certificateUrl && (
                        <div className={`mt-4 flex ${isEven ? 'md:justify-end' : 'md:justify-start'}`}>
                            <a
                                href={item.certificateUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
                            >
                                <ExternalLink className="w-3 h-3" />
                                View Certificate
                            </a>
                        </div>
                    )}
                </div>
            </div>

            {/* Spacer for the other side on desktop */}
            <div className="hidden md:block w-[10%]" />
            <div className="hidden md:block w-[45%]" />
        </motion.div>
    );
};

export default Education;
