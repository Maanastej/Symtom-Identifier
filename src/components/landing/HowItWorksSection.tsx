import { motion } from 'framer-motion';
import { ClipboardList, Brain, BarChart3, Bell } from 'lucide-react';

const steps = [
  {
    icon: ClipboardList,
    title: 'Report Symptoms',
    description: 'Select your symptoms from our comprehensive database or describe them freely.',
    step: '01',
  },
  {
    icon: Brain,
    title: 'AI Analysis',
    description: 'Our AI engine analyzes your symptoms against thousands of conditions using KNN + GPT models.',
    step: '02',
  },
  {
    icon: BarChart3,
    title: 'Get Predictions',
    description: 'Receive ranked predictions with confidence scores, severity levels, and actionable advice.',
    step: '03',
  },
  {
    icon: Bell,
    title: 'Stay Protected',
    description: 'Monitor your health trends, get critical alerts, and track regional outbreak patterns.',
    step: '04',
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const stepVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
};

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 bg-muted/20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Four simple steps to smarter health management.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto"
        >
          {steps.map((s, i) => (
            <motion.div key={s.step} variants={stepVariants} className="relative text-center group">
              <div className="text-5xl font-black text-primary/10 mb-4">{s.step}</div>
              <div className="w-14 h-14 rounded-2xl gradient-hero flex items-center justify-center mx-auto mb-4 shadow-soft group-hover:shadow-glow transition-shadow duration-300">
                <s.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.description}</p>
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 -right-4 w-8 h-0.5 bg-border/60" />
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
