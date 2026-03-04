import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const testimonials = [
  {
    name: 'Dr. Priya Sharma',
    role: 'General Physician',
    initials: 'PS',
    content: 'Medical Third Opinion has transformed how I pre-screen patients. The symptom analysis is remarkably accurate and saves valuable consultation time.',
    rating: 5,
  },
  {
    name: 'Rahul Verma',
    role: 'Health Enthusiast',
    initials: 'RV',
    content: 'The health monitoring features are incredible. I love tracking my vitals and getting weekly summaries with actionable insights.',
    rating: 5,
  },
  {
    name: 'Dr. Anil Kapoor',
    role: 'Epidemiologist',
    initials: 'AK',
    content: 'The outbreak mapping feature is exactly what public health needs. Real-time visualization of disease spread patterns is game-changing.',
    rating: 5,
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' as const } },
};

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Trusted by Healthcare Professionals
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            See what doctors and users say about Medical Third Opinion.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto"
        >
          {testimonials.map((t) => (
            <motion.div key={t.name} variants={cardVariants}>
              <Card className="h-full border-border/40 bg-card/80 backdrop-blur-sm hover:shadow-card transition-shadow duration-300">
                <CardContent className="p-6 flex flex-col h-full">
                  <Quote className="w-8 h-8 text-primary/20 mb-4" />
                  <p className="text-foreground/90 text-sm leading-relaxed flex-1 mb-6">"{t.content}"</p>
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10 rounded-xl">
                      <AvatarFallback className="rounded-xl gradient-hero text-white text-xs font-semibold">
                        {t.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
