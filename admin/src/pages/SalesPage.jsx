import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Users, 
  TrendingUp, 
  Shield, 
  Zap, 
  Smartphone, 
  Laptop, 
  Cloud, 
  CheckCircle,
  ArrowRight,
  Menu,
  X,
  Target,
  Database,
  Phone,
  MessageSquare,
  FileSpreadsheet,
  UserCheck,
  Calendar,
  Clock,
  DollarSign,
  Package,
  Settings,
  SmartphoneIcon,
  Globe,
  LayoutDashboard
} from 'lucide-react';

const SalesPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(prev => ({
            ...prev,
            [entry.target.id]: entry.isIntersecting
          }));
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('[data-animate]').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const fadeInClass = (id) => 
    `transition-all duration-1000 ${isVisible[id] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="relative z-50 bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">Centralized Sales OS</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#problem" className="text-white/80 hover:text-white transition-colors">The Problem</a>
              <a href="#solution" className="text-white/80 hover:text-white transition-colors">Our Solution</a>
              <a href="#pricing" className="text-white/80 hover:text-white transition-colors">Pricing</a>
              <a href="#contact" className="text-white/80 hover:text-white transition-colors">Get Started</a>
              <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105">
                Book Demo
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden pb-4">
              <div className="flex flex-col space-y-4 pt-4">
                <a href="#problem" className="text-white/80 hover:text-white transition-colors">The Problem</a>
                <a href="#solution" className="text-white/80 hover:text-white transition-colors">Our Solution</a>
                <a href="#pricing" className="text-white/80 hover:text-white transition-colors">Pricing</a>
                <a href="#contact" className="text-white/80 hover:text-white transition-colors">Get Started</a>
                <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full hover:from-blue-600 hover:to-purple-700 transition-all">
                  Book Demo
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-screen">
            <div data-animate id="hero" className={fadeInClass('hero')}>
              <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Replace WhatsApp Chaos with
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> Centralized Sales</span>
              </h1>
              <p className="text-lg text-white/80 mb-8 leading-relaxed">
                A standardized sales operating system for SMEs making ₦1M–₦50M monthly. 
                Eliminate spreadsheet guesswork and founder-dependent selling.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 flex items-center justify-center">
                  Book Free Demo
                  <ArrowRight className="ml-2 w-5 h-5" />
                </button>
                <button className="border-2 border-white/30 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/10 transition-all">
                  View Case Studies
                </button>
              </div>
            </div>
            
            <div data-animate id="hero-image" className={`${fadeInClass('hero-image')} relative`}>
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl blur-xl opacity-30"></div>
                <div className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center space-x-2 bg-red-500/20 text-red-300 px-3 py-1 rounded-full text-sm">
                      <Phone className="w-4 h-4" />
                      <span>Current Reality</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                      <MessageSquare className="w-5 h-5 text-red-400" />
                      <span className="text-white/80">Instagram DMs & WhatsApp chaos</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                      <FileSpreadsheet className="w-5 h-5 text-red-400" />
                      <span className="text-white/80">Excel files & phone memory</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                      <UserCheck className="w-5 h-5 text-red-400" />
                      <span className="text-white/80">Founder-dependent decisions</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                      <Clock className="w-5 h-5 text-red-400" />
                      <span className="text-white/80">Missed follow-ups & forgotten customers</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem Section */}
      <section id="problem" className="py-20 bg-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-red-500/20 text-red-300 px-4 py-2 rounded-full mb-6">
              <Target className="w-5 h-5" />
              <span>THE PROBLEM</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Your Sales Are Leaking Revenue Daily
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              SMEs lose revenue due to fragmented channels, zero customer memory, and operational fragility.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                title: "Revenue Leakage", 
                items: ["Missed follow-ups", "Forgotten customers", "Inconsistent pricing", "Untracked abandoned orders"],
                icon: DollarSign,
                color: "text-red-400"
              },
              { 
                title: "Operational Fragility", 
                items: ["Business stalls when founder is away", "Staff make inconsistent decisions", "No standardized process", "Reactive decision-making"],
                icon: Database,
                color: "text-orange-400"
              },
              { 
                title: "Growth Ceiling", 
                items: ["Cannot scale ads profitably", "Cannot measure ROI", "Cannot systemize retention", "Emotional decisions"],
                icon: TrendingUp,
                color: "text-yellow-400"
              },
              { 
                title: "Customer Trust Erosion", 
                items: ["Conflicting information", "Delayed responses", "Unprofessional experience", "Platform dependency"],
                icon: Shield,
                color: "text-pink-400"
              }
            ].map((problem, index) => (
              <div 
                key={index}
                data-animate 
                id={`problem-${index}`}
                className={`${fadeInClass(`problem-${index}`)} bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all`}
              >
                <div className={`w-12 h-12 ${problem.color.replace('text', 'bg').replace('400', '500/20')} rounded-lg flex items-center justify-center mb-4`}>
                  <problem.icon className={`w-6 h-6 ${problem.color}`} />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">{problem.title}</h3>
                <ul className="space-y-2">
                  {problem.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start space-x-2 text-white/70">
                      <div className="w-1.5 h-1.5 bg-white/50 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Solution Section */}
      <section id="solution" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-green-500/20 text-green-300 px-4 py-2 rounded-full mb-6">
              <CheckCircle className="w-5 h-5" />
              <span>OUR SOLUTION</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              One System. Complete Control.
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              A pre-built, configurable sales operating system that replaces chaos with clarity.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {[
              {
                title: "Sales-Focused Website",
                description: "Capture demand, legitimize your business, and feed structured data into the system.",
                features: ["SEO-indexed pages", "Product/service listings", "Order capture", "Integrated system"],
                icon: Globe,
                color: "from-blue-500 to-blue-600"
              },
              {
                title: "Customer Mobile App",
                description: "Own customer access, eliminate platform dependency, and drive repeat sales.",
                features: ["Customer accounts", "Order history", "Push notifications", "Direct communication"],
                icon: SmartphoneIcon,
                color: "from-purple-500 to-purple-600"
              },
              {
                title: "Admin Dashboard",
                description: "Visibility and control without technical complexity. If you can use WhatsApp, you can use this.",
                features: ["Orders management", "Customer insights", "Payment tracking", "Staff actions"],
                icon: LayoutDashboard,
                color: "from-green-500 to-green-600"
              }
            ].map((component, index) => (
              <div 
                key={index}
                data-animate 
                id={`solution-${index}`}
                className={`${fadeInClass(`solution-${index}`)} bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all`}
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${component.color} rounded-lg flex items-center justify-center mb-4`}>
                  <component.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{component.title}</h3>
                <p className="text-white/70 mb-4">{component.description}</p>
                <ul className="space-y-2">
                  {component.features.map((feature, featIndex) => (
                    <li key={featIndex} className="flex items-center space-x-2 text-white/80">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* ICP Section */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">Ideal Customer Profile</h3>
              <p className="text-white/70">This is who we serve. No exceptions.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: "Business Type", value: "Retail, E-commerce, Service (B2C)" },
                { label: "Monthly Revenue", value: "₦1M – ₦50M" },
                { label: "Team Size", value: "3 – 50 staff" },
                { label: "Founder Profile", value: "Non-technical, hands-on, overwhelmed" }
              ].map((icp, index) => (
                <div key={index} className="text-center p-4 bg-white/5 rounded-lg">
                  <div className="text-white/60 text-sm mb-1">{icp.label}</div>
                  <div className="text-white font-semibold">{icp.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-blue-500/20 text-blue-300 px-4 py-2 rounded-full mb-6">
              <DollarSign className="w-5 h-5" />
              <span>PRICING & REVENUE MODEL</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              High-Ticket Setup + Recurring Revenue
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Filters unserious buyers and ensures sustainable growth.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-white/20 rounded-2xl p-8 text-center">
              <div className="text-3xl font-bold text-white mb-2">₦500k – ₦3M</div>
              <div className="text-white/70 mb-4">One-time Setup Fee</div>
              <ul className="space-y-2 text-white/80">
                <li className="flex items-center justify-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>System configuration</span>
                </li>
                <li className="flex items-center justify-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>UI customization</span>
                </li>
                <li className="flex items-center justify-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Deployment & training</span>
                </li>
                <li className="flex items-center justify-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Filters unserious buyers</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-white/20 rounded-2xl p-8 text-center">
              <div className="text-3xl font-bold text-white mb-2">₦50k – ₦300k</div>
              <div className="text-white/70 mb-4">Monthly Subscription</div>
              <ul className="space-y-2 text-white/80">
                <li className="flex items-center justify-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Hosting & maintenance</span>
                </li>
                <li className="flex items-center justify-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Ongoing support</span>
                </li>
                <li className="flex items-center justify-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>System optimization</span>
                </li>
                <li className="flex items-center justify-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Recurring revenue model</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <div className="inline-block bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3">
              <div className="text-white font-semibold">Before CSMS → Chaos, Guessing, Founder Dependence</div>
              <div className="text-white/70 text-sm">After CSMS → Centralized Sales, Clear Data, Predictable Revenue</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div data-animate id="cta" className={fadeInClass('cta')}>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Eliminate Sales Chaos?
            </h2>
            <p className="text-xl text-white/70 mb-8">
              Book your free demo today. See how we can transform your sales operations in 30 minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105">
                Book Free 30-Min Demo
              </button>
              <button className="border-2 border-white/30 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/10 transition-all">
                Download Full Proposal
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="py-12 border-t border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">Centralized Sales OS</span>
              </div>
              <p className="text-white/60">
                A standardized sales operating system for revenue-generating SMEs.
              </p>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">The Problem</h3>
              <ul className="space-y-2 text-white/60">
                <li>Revenue leakage</li>
                <li>Operational fragility</li>
                <li>Growth ceiling</li>
                <li>Customer trust erosion</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Our Solution</h3>
              <ul className="space-y-2 text-white/60">
                <li>Sales-focused website</li>
                <li>Customer mobile app</li>
                <li>Admin dashboard</li>
                <li>UI design system</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-white/60">
                <li>demo@centralizedsalesos.com</li>
                <li>+234 XXX XXX XXXX</li>
                <li>Lagos, Nigeria</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/20 mt-12 pt-8 text-center text-white/60">
            <p>&copy; 2026 Centralized Sales OS. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SalesPage;
