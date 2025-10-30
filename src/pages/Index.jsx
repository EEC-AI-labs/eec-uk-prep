import {
  Shield,
  BookOpen,
  FileCheck,
  Globe,
  ArrowRight,
  CheckCircle,
  CheckCircle2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
// import studyAbroadImg from "@/images/study-abroad.jpg";
// import interviewPrepImg from "@/images/interview-prep.jpg";
// import visaDocsImg from "@/images/document.jpg";

export default function Index() {
  return (
    <div className="flex flex-col w-full min-h-screen">
      {/* Header */}
      <header className="bg-surface/90 backdrop-blur-lg sticky top-0 z-40 shadow-sm border-b border-border">
        <nav className="w-full max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-foreground">
                UK Pre-CAS Prep by EEC
              </span>
            </div>
            <Link to="/prep">
              <Button size="default">Start Preparation</Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 via-background to-accent/5 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-foreground tracking-tight mb-6">
              Ace Your UK Pre-CAS Interview
              <span className="block text-primary mt-2">
                with AI-Powered Preparation
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Get personalized, hyper-realistic interview practice powered by
              advanced AI. Build confidence and credibility for your UK student
              visa interview.
            </p>
            <Link to="/prep">
              <Button size="lg" className="group">
                Start Your Preparation
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          {/* Hero Image */}
          <div className="mt-12 rounded-2xl overflow-hidden shadow-2xl border border-border">
          <img src="/images/study-abroad.jpg" alt="Study Abroad" />
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="py-20 px-4 bg-surface">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              What is UK Pre-CAS Interview Preparation?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The Pre-CAS interview is a critical step in your UK student visa
              journey. Our AI tool helps you prepare comprehensively and
              confidently.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
            <img src="/images/interview-prep.jpg" alt="Interview prep" />

            </div>
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-foreground">
                Hyper-Personalized Interview Practice
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Our AI analyzes your unique profile - your chosen university,
                course, funding source, career goals, and background - to
                generate tailored interview questions and model answers that
                reflect your specific situation.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    27+ personalized questions covering all interview areas
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    Real-time voice recording and transcript analysis
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    AI feedback with detailed improvement suggestions
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    Multi-language support (English, Hindi, Gujarati)
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 md:order-2">
              <h3 className="text-2xl font-bold text-foreground">
                Master Every Aspect of Your Interview
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                From explaining your course choice to demonstrating financial
                capability and discussing your return plans, our tool covers
                every critical topic that UK visa officers evaluate during
                Pre-CAS interviews.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    Practice 24/7 at your own pace
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    Track your progress with practice history
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    Build confidence with unlimited retakes
                  </span>
                </li>
              </ul>
            </div>
            <div className="md:order-1">
            <img src="/images/document.jpg" alt="Visa Documents" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-background to-primary/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Why Choose Our AI Prep Tool?
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-card p-8 rounded-xl shadow-lg border border-border hover:shadow-xl transition-shadow">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">
                Personalized Content
              </h3>
              <p className="text-muted-foreground">
                Every question, guidance, and model answer is tailored to your
                specific profile and circumstances.
              </p>
            </div>

            <div className="bg-card p-8 rounded-xl shadow-lg border border-border hover:shadow-xl transition-shadow">
              <div className="h-12 w-12 bg-accent/10 rounded-lg flex items-center justify-center mb-6">
                <FileCheck className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">
                Expert Feedback
              </h3>
              <p className="text-muted-foreground">
                Receive detailed feedback on your answers with scores,
                strengths, and areas for improvement.
              </p>
            </div>

            <div className="bg-card p-8 rounded-xl shadow-lg border border-border hover:shadow-xl transition-shadow">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                <Globe className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">
                Anytime, Anywhere
              </h3>
              <p className="text-muted-foreground">
                Practice at your convenience with multi-language support and
                24/7 availability.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary to-primary/80">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-6">
            Ready to Ace Your Pre-CAS Interview?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8">
            Start your personalized preparation journey now. Build confidence,
            master your narrative, and increase your chances of visa success.
          </p>
          <Link to="/prep">
            <Button size="lg" variant="secondary" className="group">
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface border-t border-border py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-muted-foreground">
            © 2025 UK Pre-CAS Prep by EEC. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
