import { useState } from 'react';
import { Mail, MapPin, Send, Github, Linkedin, MessageSquare, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { publicApi } from '@/api/services';

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await publicApi.sendMessage({
        senderName: formData.name,
        senderEmail: formData.email,
        message: formData.message,
        subject: 'New Portfolio Inquiry'
      });

      setIsSuccess(true);
      toast({
        title: "Message Sent Successfully",
        description: `Thanks ${formData.name}, your message has been delivered. I'll respond to ${formData.email} shortly.`,
      });

      // Reset after delay if needed, or leave success state
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      toast({
        title: "Transmission Failed",
        description: "We couldn't send your message right now. Please check your connection or try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <section id="contact" className="section-padding relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute bottom-0 right-0 w-[min(500px,80vw)] h-[min(500px,80vw)] bg-primary/5 rounded-full blur-[128px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">

          {/* Section Header */}
          <div className="text-center mb-16 md:mb-24">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium tracking-wide uppercase mb-4 animate-fade-in">
              <MessageSquare className="w-3 h-3" />
              Contact
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight animate-fade-up">
              Let's Start a <span className="gradient-text">Conversation</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto animate-fade-up" style={{ animationDelay: '0.1s' }}>
              Have a project in mind or want to discuss backend architecture?
              I'm always open to new challenges.
            </p>
          </div>

          <div className="grid lg:grid-cols-5 gap-12 lg:gap-8">
            {/* Left: Contact Info */}
            <div className="lg:col-span-2 space-y-8 animate-fade-up" style={{ animationDelay: '0.2s' }}>
              <div className="glass-card p-8 rounded-2xl border border-border/50 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <h3 className="text-2xl font-bold mb-8 relative z-10">Get in Touch</h3>

                <div className="space-y-8 relative z-10">
                  <div className="flex items-start gap-4 group/item">
                    <div className="w-12 h-12 rounded-xl bg-background border border-border flex items-center justify-center flex-shrink-0 group-hover/item:border-primary/50 transition-colors">
                      <Mail className="w-5 h-5 text-foreground group-hover/item:text-primary transition-colors" />
                    </div>
                    <div>
                      <p className="font-semibold mb-1">Email</p>
                      <a
                        href="mailto:mukeshsilwal5@gmail.com"
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        mukeshsilwal5@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 group/item">
                    <div className="w-12 h-12 rounded-xl bg-background border border-border flex items-center justify-center flex-shrink-0 group-hover/item:border-accent/50 transition-colors">
                      <MapPin className="w-5 h-5 text-foreground group-hover/item:text-accent transition-colors" />
                    </div>
                    <div>
                      <p className="font-semibold mb-1">Location</p>
                      <p className="text-muted-foreground">
                        Godawari-02, Lalitpur, Nepal
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-10 pt-8 border-t border-border/50 relative z-10">
                  <p className="font-medium mb-4 text-sm uppercase tracking-wider text-muted-foreground">Social Profiles</p>
                  <div className="flex items-center gap-3">
                    <a
                      href="https://github.com/Mukeshsilwal"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-lg bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary hover:scale-105 transition-all"
                      aria-label="GitHub"
                    >
                      <Github className="w-5 h-5" />
                    </a>
                    <a
                      href="https://linkedin.com/in/Mukeshsilwal"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-lg bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary hover:scale-105 transition-all"
                      aria-label="LinkedIn"
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Form or Success */}
            <div className="lg:col-span-3 animate-fade-up" style={{ animationDelay: '0.3s' }}>
              <div className="glass-card p-8 md:p-10 rounded-2xl border border-border/50 relative overflow-hidden h-full flex flex-col justify-center">

                {isSuccess ? (
                  <div className="text-center py-10 animate-fade-in">
                    <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-success/20">
                      <CheckCircle className="w-10 h-10 text-success animate-bounce-short" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">Message Received!</h3>
                    <p className="text-muted-foreground max-w-md mx-auto mb-8">
                      Thanks for reaching out, {formData.name || 'Friend'}. I'll read your message and respond to <span className="text-foreground font-medium">{formData.email}</span> shortly.
                    </p>
                    <Button
                      onClick={() => setIsSuccess(false)}
                      variant="outline"
                      className="border-primary/20 hover:bg-primary/10 text-primary"
                    >
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium ml-1">
                          Name
                        </label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="John Doe"
                          required
                          className="bg-secondary/30 border-border focus:border-primary h-12 transition-all duration-300"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium ml-1">
                          Email
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="john@example.com"
                          required
                          className="bg-secondary/30 border-border focus:border-primary h-12 transition-all duration-300"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-medium ml-1">
                        Message
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell me about your project context..."
                        required
                        rows={6}
                        className="bg-secondary/30 border-border focus:border-primary resize-none p-4 leading-relaxed transition-all duration-300"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-12 bg-primary text-primary-foreground font-semibold hover:bg-primary/90 glow-primary transition-all duration-300 rounded-xl"
                    >
                      {isSubmitting ? (
                        'Sending...'
                      ) : (
                        <>
                          Send Message
                          <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1" />
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
