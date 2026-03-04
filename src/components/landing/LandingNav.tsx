import { motion } from 'framer-motion';
import { Activity, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';

interface LandingNavProps {
  onGetStarted: () => void;
}

export function LandingNav({ onGetStarted }: LandingNavProps) {
  const { theme, setTheme } = useTheme();

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl"
    >
      <div className="container flex h-16 items-center justify-between mx-auto px-4">
        <a href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl gradient-hero flex items-center justify-center shadow-soft">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-foreground">Medical Third</span>
          <span className="text-primary font-bold">Opinion</span>
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {['Features', 'How It Works', 'Testimonials'].map((item) => (
            <button
              key={item}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
              onClick={() =>
                document.getElementById(item.toLowerCase().replace(/\s+/g, '-'))?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              {item}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-xl"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            <Sun className="h-[1.15rem] w-[1.15rem] rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.15rem] w-[1.15rem] rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
          </Button>
          <Button
            className="rounded-xl gradient-hero text-white border-0 shadow-soft font-semibold"
            onClick={onGetStarted}
          >
            Sign In
          </Button>
        </div>
      </div>
    </motion.header>
  );
}
