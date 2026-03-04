import { motion } from 'framer-motion';
import { Activity, ArrowRight, Shield, Brain, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

const floatingVariants = {
  animate: {
    y: [0, -10, 0],
    transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' as const },
  },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
};

interface HeroSectionProps {
  onGetStarted: () => void;
}

export function HeroSection({ onGetStarted }: HeroSectionProps) {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-primary/8 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/3 blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="max-w-3xl mx-auto text-center"
        >
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8 border border-primary/20 mx-auto">
            <Shield className="w-4 h-4" />
            AI-Powered Health Intelligence
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1] mb-6"
          >
            Your Health,{' '}
            <span className="bg-gradient-to-r from-primary to-[hsl(210_70%_45%)] bg-clip-text text-transparent">
              Predicted & Protected
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Medical Third Opinion uses advanced machine learning to analyze symptoms, predict diseases,
            and monitor epidemic outbreaks in real-time — keeping you one step ahead.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="rounded-2xl px-8 py-6 text-base font-semibold gradient-hero text-white shadow-glow hover:shadow-[0_0_40px_hsl(185_70%_38%/0.35)] transition-all duration-300 border-0"
              onClick={onGetStarted}
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-2xl px-8 py-6 text-base font-semibold border-border/60 hover:bg-muted/60 transition-all duration-300"
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Learn More
            </Button>
          </motion.div>
        </motion.div>

        {/* Floating cards */}
        <div className="hidden lg:block">
          <motion.div
            variants={floatingVariants}
            animate="animate"
            className="absolute top-20 right-[10%] glass rounded-2xl p-4 border border-border/40 shadow-card"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">AI Prediction</p>
                <p className="text-xs text-muted-foreground">98.5% accuracy</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={floatingVariants}
            animate="animate"
            style={{ animationDelay: '1s' }}
            className="absolute bottom-32 left-[8%] glass rounded-2xl p-4 border border-border/40 shadow-card"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                <MapPin className="w-5 h-5 text-accent-foreground" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Live Tracking</p>
                <p className="text-xs text-muted-foreground">Real-time outbreak map</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
