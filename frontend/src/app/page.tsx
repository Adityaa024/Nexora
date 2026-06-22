'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Clock, Activity, Users, ScanLine, BrainCircuit, Zap } from 'lucide-react';
import Link from 'next/link';
import { Hero } from '@/components/ui/animated-hero';
import { StackedCircularFooter } from '@/components/ui/stacked-circular-footer';

import { TestimonialsColumn } from '@/components/ui/testimonials-columns-1';

const testimonials = [
  {
    text: "This ERP revolutionized our operations, streamlining finance and inventory. The cloud-based platform keeps us productive, even remotely.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces",
    name: "Briana Patton",
    role: "Operations Manager",
  },
  {
    text: "Implementing this ERP was smooth and quick. The customizable, user-friendly interface made team training effortless.",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=faces",
    name: "Bilal Ahmed",
    role: "IT Manager",
  },
  {
    text: "The support team is exceptional, guiding us through setup and providing ongoing assistance, ensuring our satisfaction.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces",
    name: "Saman Malik",
    role: "Customer Support Lead",
  },
  {
    text: "This ERP's seamless integration enhanced our business operations and efficiency. Highly recommend for its intuitive interface.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces",
    name: "Omar Raza",
    role: "CEO",
  },
  {
    text: "Its robust features and quick support have transformed our workflow, making us significantly more efficient.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=faces",
    name: "Zainab Hussain",
    role: "Project Manager",
  },
  {
    text: "The smooth implementation exceeded expectations. It streamlined processes, improving overall business performance.",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&h=100&fit=crop&crop=faces",
    name: "Aliza Khan",
    role: "Business Analyst",
  },
  {
    text: "Our business functions improved with a user-friendly design and positive customer feedback.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces",
    name: "Farhan Siddiqui",
    role: "Marketing Director",
  },
  {
    text: "They delivered a solution that exceeded expectations, understanding our needs and enhancing our operations.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=faces",
    name: "Sana Sheikh",
    role: "Sales Manager",
  },
  {
    text: "Using this ERP, our online presence and conversions significantly improved, boosting business performance.",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=faces",
    name: "Hassan Ali",
    role: "E-commerce Manager",
  },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

const Testimonials = () => {
  return (
    <section className="bg-slate-50 my-32 relative overflow-hidden">
      <div className="container z-10 mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center max-w-[540px] mx-auto"
        >
          <div className="flex justify-center mb-6">
            <div className="border border-emerald-200 bg-emerald-50 text-emerald-700 py-1.5 px-5 rounded-full text-sm font-bold tracking-wide uppercase">Testimonials</div>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 text-center">
            What our users say
          </h2>
          <p className="text-center mt-5 text-lg text-slate-500 max-w-md">
            Discover how clinics and hospitals are radically transforming their operations.
          </p>
        </motion.div>

        <div className="flex justify-center gap-6 mt-16 [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)] max-h-[740px] overflow-hidden">
          <TestimonialsColumn testimonials={firstColumn} duration={25} />
          <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={35} />
          <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={30} />
        </div>
      </div>
    </section>
  );
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      {/* Dynamic Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-400/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/20 blur-[120px] pointer-events-none" />

      {/* Navbar */}
      <nav className="border-b border-slate-200/50 bg-white/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-700 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tight text-emerald-900 uppercase">Nexora</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login" className="text-slate-600 hover:text-emerald-700 font-bold transition-colors">
                Login
              </Link>
              <Link href="/signup" className="bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-emerald-800 transition-all shadow-lg shadow-emerald-700/20 hover:shadow-emerald-700/40 transform hover:-translate-y-0.5">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-24 relative z-10">
        {/* Hero Section */}
        <Hero />

        {/* Live Tracking Card Preview */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, type: "spring" }}
          className="mt-12 max-w-2xl mx-auto bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-emerald-900/10 border border-white/50 overflow-hidden relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="bg-emerald-700/95 backdrop-blur-md px-8 py-6 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-emerald-300" />
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <p className="text-emerald-100 text-sm font-bold uppercase tracking-widest">Live Token Tracking</p>
            </div>
            <h2 className="text-white text-5xl font-black tracking-tight drop-shadow-md">T-20260412-1</h2>
          </div>
          <div className="p-8 grid grid-cols-2 gap-6 text-center">
            <div className="bg-slate-50/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-100 shadow-sm transition-transform hover:scale-105">
              <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-2">Min Wait</p>
              <p className="text-4xl font-black text-slate-800">14 <span className="text-lg font-bold text-slate-400">mins</span></p>
            </div>
            <div className="bg-slate-50/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-100 shadow-sm transition-transform hover:scale-105">
              <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-2">Patients Ahead</p>
              <p className="text-4xl font-black text-slate-800">2</p>
            </div>
          </div>
        </motion.div>

        {/* Bento Grid Features */}
        <div className="mt-40 mb-20 text-center">
          <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-4">Powered by Next-Gen Tech</h2>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto">Everything a modern clinic needs to completely eliminate waiting room friction.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Feature 1 - Spans 2 columns */}
          <motion.div 
            whileHover={{ y: -5 }} 
            className="md:col-span-2 bg-gradient-to-br from-purple-600 to-indigo-700 p-8 rounded-3xl shadow-xl shadow-purple-900/20 text-white relative overflow-hidden"
          >
            <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[150%] bg-white/10 rotate-12 blur-2xl pointer-events-none" />
            <BrainCircuit className="w-12 h-12 text-purple-200 mb-6" />
            <h3 className="text-2xl font-black mb-2">Gemini AI Triage</h3>
            <p className="text-purple-100 text-lg leading-relaxed max-w-md">Our integrated AI reads patient symptoms instantly and dynamically adjusts queue priority to ensure critical patients are seen first.</p>
          </motion.div>

          {/* Feature 2 */}
          <motion.div 
            whileHover={{ y: -5 }} 
            className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col justify-between"
          >
            <ScanLine className="w-12 h-12 text-emerald-600 mb-6" />
            <div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">QR Check-in</h3>
              <p className="text-slate-500 leading-relaxed">Patients instantly scan their arrival using secure QR codes generated directly on their phones.</p>
            </div>
          </motion.div>

          {/* Feature 3 */}
          <motion.div 
            whileHover={{ y: -5 }} 
            className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col justify-between"
          >
            <Zap className="w-12 h-12 text-amber-500 mb-6" />
            <div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">Zero Refresh</h3>
              <p className="text-slate-500 leading-relaxed">Live WebSockets and fast polling keep the dashboard totally synced without ever reloading the page.</p>
            </div>
          </motion.div>

          {/* Feature 4 - Spans 2 columns */}
          <motion.div 
            whileHover={{ y: -5 }} 
            className="md:col-span-2 bg-slate-900 p-8 rounded-3xl shadow-xl shadow-slate-900/20 text-white relative overflow-hidden flex items-center justify-between"
          >
            <div className="absolute bottom-[-50%] left-[-20%] w-[60%] h-[150%] bg-emerald-500/20 rotate-45 blur-3xl pointer-events-none" />
            <div className="relative z-10 max-w-md">
              <Users className="w-12 h-12 text-slate-400 mb-6" />
              <h3 className="text-2xl font-black mb-2">Superuser Control</h3>
              <p className="text-slate-400 text-lg leading-relaxed">Clinics get a dedicated dashboard to call patients, end sessions, and monitor wait times all from a single pane of glass.</p>
            </div>
          </motion.div>
        </div>

      </main>
      
      <Testimonials />
      
      <StackedCircularFooter />
    </div>
  );
}
