import { Activity, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-muted/20 py-12">
      <div className="container">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl gradient-hero flex items-center justify-center shadow-soft">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-foreground">Medical Third</span>
                <span className="text-primary font-bold"> Opinion</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              AI-powered health intelligence platform for symptom analysis, disease prediction, and outbreak monitoring.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-foreground text-sm mb-4">Product</h4>
            <ul className="space-y-2.5">
              {['Symptom Checker', 'Health Monitor', 'Outbreak Map', 'AI Assistant'].map((item) => (
                <li key={item}>
                  <span className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-foreground text-sm mb-4">Resources</h4>
            <ul className="space-y-2.5">
              {['Documentation', 'API Reference', 'Health Blog', 'Research'].map((item) => (
                <li key={item}>
                  <span className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-foreground text-sm mb-4">Legal</h4>
            <ul className="space-y-2.5">
              {['Privacy Policy', 'Terms of Service', 'HIPAA Compliance', 'Contact Us'].map((item) => (
                <li key={item}>
                  <span className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border/40 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Medical Third Opinion. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-destructive fill-destructive" /> for better healthcare
          </p>
        </div>
      </div>
    </footer>
  );
}
