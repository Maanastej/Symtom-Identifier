import { motion } from 'framer-motion';
import { Brain, MapPin, Bell, Heart, MessageCircle, BarChart3, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const features = [
  {
    icon: Brain,
    title: 'AI Disease Prediction',
    description: 'Advanced KNN + AI models analyze your symptoms and health profile to predict potential conditions with high accuracy.',
    color: 'bg-primary/10 text-primary',
  },
  {
    icon: MapPin,
    title: 'Outbreak Mapping',
    description: 'Interactive geospatial maps visualize disease spread patterns in real-time, helping you stay informed about your area.',
    color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  },
  {
    icon: Bell,
    title: 'Epidemic Alerts',
    description: 'Automated threshold-based alerts notify you when disease cases exceed normal levels in your region.',
    color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  },
  {
    icon: Heart,
    title: 'Health Monitoring',
    description: 'Track vital signs, sleep, activity, and stress with trend analysis, weekly summaries, and critical alerts.',
    color: 'bg-red-500/10 text-red-600 dark:text-red-400',
  },
  {
    icon: MessageCircle,
    title: 'AI Health Assistant',
    description: 'Chat with an AI-powered health assistant for personalized guidance, explanations, and wellness tips.',
    color: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
  },
  {
    icon: BarChart3,
    title: 'Trend Analytics',
    description: 'Visualize your health data over time with interactive charts and discover patterns in your wellness journey.',
    color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
};

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4 border border-primary/20">
            <Zap className="w-3.5 h-3.5" />
            Powerful Features
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Everything You Need for{' '}
            <span className="bg-gradient-to-r from-primary to-[hsl(210_70%_45%)] bg-clip-text text-transparent">
              Smarter Health
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            From symptom analysis to outbreak monitoring, Medical Third Opinion provides a comprehensive suite of intelligent health tools.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature) => (
            <motion.div key={feature.title} variants={cardVariants}>
              <Card className="h-full group hover:shadow-glow hover:-translate-y-1 transition-all duration-300 border-border/40 bg-card/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
