import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, Mail, Lock, User } from 'lucide-react';
import { motion } from 'framer-motion';

import { LandingNav } from '@/components/landing/LandingNav';
import { HeroSection } from '@/components/landing/HeroSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { StatsSection } from '@/components/landing/StatsSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { TestimonialsSection } from '@/components/landing/TestimonialsSection';
import { CTASection } from '@/components/landing/CTASection';
import { Footer } from '@/components/layout/Footer';

export function AuthForm() {
  const { signIn, signUp } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupName, setSignupName] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(loginEmail, loginPassword);
    setLoading(false);
    if (error) toast.error(error.message);
    else toast.success('Welcome back!');
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signUp(signupEmail, signupPassword, signupName);
    setLoading(false);
    if (error) toast.error(error.message);
    else toast.success('Account created! Please sign in.');
  };

  const scrollToAuth = () => {
    document.getElementById('auth-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      <LandingNav onGetStarted={scrollToAuth} />
      <HeroSection onGetStarted={scrollToAuth} />
      <StatsSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />

      {/* Auth Section */}
      <section id="auth-section" className="py-24 bg-muted/20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-md mx-auto"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">Get Started</h2>
              <p className="text-muted-foreground">Create an account or sign in to continue.</p>
            </div>

            <Card className="border-border/40 shadow-card">
              <CardContent className="p-6">
                <Tabs defaultValue="login">
                  <TabsList className="grid w-full grid-cols-2 rounded-xl bg-muted/50 mb-6">
                    <TabsTrigger value="login" className="rounded-lg text-sm font-medium">Sign In</TabsTrigger>
                    <TabsTrigger value="signup" className="rounded-lg text-sm font-medium">Sign Up</TabsTrigger>
                  </TabsList>

                  <TabsContent value="login">
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="login-email" className="text-sm font-medium">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input id="login-email" type="email" placeholder="you@example.com" className="pl-10 rounded-xl" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="login-password" className="text-sm font-medium">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input id="login-password" type="password" placeholder="••••••••" className="pl-10 rounded-xl" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required />
                        </div>
                      </div>
                      <Button type="submit" disabled={loading} className="w-full rounded-xl gradient-hero text-white border-0 font-semibold py-5">
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sign In'}
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="signup">
                    <form onSubmit={handleSignup} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signup-name" className="text-sm font-medium">Full Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input id="signup-name" placeholder="John Doe" className="pl-10 rounded-xl" value={signupName} onChange={(e) => setSignupName(e.target.value)} required />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-email" className="text-sm font-medium">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input id="signup-email" type="email" placeholder="you@example.com" className="pl-10 rounded-xl" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} required />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-password" className="text-sm font-medium">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input id="signup-password" type="password" placeholder="••••••••" className="pl-10 rounded-xl" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} required minLength={6} />
                        </div>
                      </div>
                      <Button type="submit" disabled={loading} className="w-full rounded-xl gradient-hero text-white border-0 font-semibold py-5">
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Account'}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <p className="text-center text-xs text-muted-foreground mt-4">
              🔒 Your data is encrypted and stored securely.
            </p>
          </motion.div>
        </div>
      </section>

      <CTASection onGetStarted={scrollToAuth} />
      <Footer />
    </div>
  );
}
