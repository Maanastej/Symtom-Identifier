import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const stats = [
  { label: 'Diseases Tracked', value: 200, suffix: '+' },
  { label: 'Prediction Accuracy', value: 98, suffix: '%' },
  { label: 'Active Users', value: 5000, suffix: '+' },
  { label: 'Reports Processed', value: 12000, suffix: '+' },
];

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!started) return;
    let start = 0;
    const duration = 1500;
    const stepTime = 16;
    const steps = duration / stepTime;
    const increment = value / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [value, started]);

  return (
    <motion.div
      onViewportEnter={() => setStarted(true)}
      viewport={{ once: true }}
    >
      <span className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-primary to-[hsl(210_70%_45%)] bg-clip-text text-transparent">
        {count.toLocaleString()}{suffix}
      </span>
    </motion.div>
  );
}

export function StatsSection() {
  return (
    <section className="py-20 border-y border-border/40 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              <p className="text-muted-foreground text-sm mt-2 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
