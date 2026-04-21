/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  Home, 
  Map as MapIcon, 
  Store, 
  ArrowRight, 
  CheckCircle2, 
  Phone, 
  User, 
  ArrowLeft,
  Loader2,
  Lock,
  ShieldCheck,
  Clock,
  Search
} from 'lucide-react';

// --- Types ---

type PropertyType = 'Departamento' | 'Casa' | 'Terreno' | 'Local Comercial';
type District = 'Miraflores' | 'Surco' | 'San Isidro' | 'San Borja' | 'La Molina' | 'Otro';
type Timeline = 'Menos de 3 meses' | '3 a 6 meses' | 'Solo exploro el mercado';
type PreviousAttempt = 'Sí, por mi cuenta' | 'Sí, con otra agencia' | 'No, es la primera vez';
type Concern = 'Malbaratar mi patrimonio' | 'Tiempo perdido con curiosos' | 'Problemas legales/seguridad';

interface QuizData {
  type: PropertyType | null;
  district: string | null;
  timeline: Timeline | null;
  attempted: PreviousAttempt | null;
  concern: Concern | null;
}

// --- Components ---

export default function App() {
  const [step, setStep] = useState<'hero' | 'quiz' | 'processing' | 'result'>('hero');
  const [quizStep, setQuizStep] = useState(1);
  const [quizData, setQuizData] = useState<QuizData>({
    type: null,
    district: null,
    timeline: null,
    attempted: null,
    concern: null,
  });
  const [otherDistrict, setOtherDistrict] = useState('');
  
  const totalSteps = 5;
  const progress = (quizStep / totalSteps) * 100;

  const quizRef = useRef<HTMLDivElement>(null);

  const startQuiz = () => {
    setStep('quiz');
  };

  const nextStep = () => {
    if (quizStep < totalSteps) {
      setQuizStep(quizStep + 1);
    } else {
      setStep('processing');
    }
  };

  const prevStep = () => {
    if (quizStep > 1) {
      setQuizStep(quizStep - 1);
    } else {
      setStep('hero');
    }
  };

  useEffect(() => {
    if (step === 'processing') {
      const timer = setTimeout(() => {
        setStep('result');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  return (
    <div className="min-h-screen lg:min-h-0 bg-white font-sans text-brand-black selection:bg-brand-gold overflow-hidden">
      <div className="app-shell-grid lg:h-screen">
        
        {/* Hero Side (Sidebar) - Hidden on Mobile */}
        <aside className="hero-side hidden lg:flex bg-black text-white relative flex-col justify-between p-16 border-r border-gray-medium overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
              className="w-full h-full object-cover opacity-40" 
              alt="Luxury property" 
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 hero-image-overlay"></div>
          </div>
          
          <div className="relative z-10 flex flex-col h-full">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col mb-32"
            >
              <span className="text-xl font-extrabold tracking-[0.4em] uppercase brand-logo-border pl-4">HONNE</span>
            </motion.div>
            <div className="flex-1 flex flex-col justify-center">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-5xl font-bold leading-[1.1] mb-6 tracking-tight"
              >
                Vende tu propiedad en tiempo récord
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                transition={{ delay: 0.5 }}
                className="text-base leading-relaxed text-white font-light max-w-[300px]"
              >
                👉 Descubre la estrategia de comercialización de Honne Inmobiliaria para vender al mejor precio y sin perder tiempo con curiosos.
              </motion.p>
            </div>
            <div className="mt-auto">
              <span className="text-[11px] uppercase tracking-[0.2em] opacity-60">Especialistas en Captación</span>
            </div>
          </div>
        </aside>

        {/* Content Side */}
        <main className="quiz-side flex flex-col bg-white relative h-screen max-h-[100dvh] overflow-hidden">
          {/* Progress Bar */}
          <div className="progress-container h-1 w-full bg-gray-light absolute top-0 left-0 z-30">
            <motion.div 
              className="progress-bar h-full bg-brand-gold origin-left"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: step === 'quiz' ? progress / 100 : step === 'processing' || step === 'result' ? 1 : 0 }}
              transition={{ duration: 0.5 }}
            />
          </div>

          <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar pt-1">
            <AnimatePresence mode="wait">
              {step === 'hero' && (
                <motion.div 
                  key="hero"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 text-center"
                >
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="lg:hidden mb-8"
                  >
                     <span className="text-xl font-extrabold tracking-[0.4em] uppercase brand-logo-border pl-4">HONNE</span>
                  </motion.div>
                  <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="lg:hidden text-4xl md:text-6xl font-bold mb-6 tracking-tighter max-w-2xl mx-auto leading-tight"
                  >
                    Vende tu propiedad en <span className="text-brand-gold italic">tiempo récord</span>
                  </motion.h1>
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="lg:hidden text-gray-500 mb-10 max-w-lg mx-auto text-sm md:text-base px-4"
                  >
                    👉 Descubre la estrategia de comercialización de Honne Inmobiliaria para vender al mejor precio.
                  </motion.p>
                  
                  <button 
                    onClick={startQuiz}
                    className="btn-geometric-primary group w-full sm:w-auto"
                  >
                    Empezar evaluación gratuita
                    <ArrowRight size={16} className="inline ml-3 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <div className="ornament-text hidden sm:block">00</div>
                </motion.div>
              )}

              {step === 'quiz' && (
                <motion.div 
                  key="quiz"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 md:p-20 text-center"
                >
                  <span className="step-indicator text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 mb-6 font-sans">
                    Paso {String(quizStep).padStart(2, '0')} / {String(totalSteps).padStart(2, '0')}
                  </span>
                  
                  <div className="w-full max-w-2xl flex flex-col items-center">
                    <AnimatePresence mode="wait">
                      {quizStep === 1 && (
                        <motion.div 
                          key="step1" 
                          initial={{ opacity: 0, x: 40, filter: 'blur(10px)' }} 
                          animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }} 
                          exit={{ opacity: 0, x: -40, filter: 'blur(10px)' }} 
                          className="w-full"
                        >
                          <h2 className="text-2xl md:text-3xl font-bold mb-8 md:mb-12 max-w-[500px] mx-auto px-2">¿Qué tipo de propiedad evalúas vender?</h2>
                          <div className="grid grid-cols-2 gap-3 sm:gap-5 w-full max-w-[540px] mx-auto">
                            {(['Departamento', 'Casa', 'Terreno', 'Local Comercial'] as PropertyType[]).map((type, i) => {
                              const icons = { 'Departamento': Building2, 'Casa': Home, 'Terreno': MapIcon, 'Local Comercial': Store };
                              const Icon = icons[type];
                              return (
                                <motion.button 
                                  key={type} 
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: i * 0.1 }}
                                  onClick={() => { setQuizData({ ...quizData, type }); nextStep(); }} 
                                  className="option-card !p-4 sm:!p-8"
                                >
                                  <div className="option-icon-wrapper !w-8 !h-8 sm:!w-10 sm:!h-10"><Icon size={14} className="sm:size-16" /></div>
                                  <span className="option-label text-[10px] sm:text-xs font-bold uppercase tracking-wider">{type}</span>
                                </motion.button>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                      {quizStep === 2 && (
                        <motion.div 
                          key="step2" 
                          initial={{ opacity: 0, x: 40, filter: 'blur(10px)' }} 
                          animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }} 
                          exit={{ opacity: 0, x: -40, filter: 'blur(10px)' }} 
                          className="w-full"
                        >
                          <h2 className="text-2xl md:text-3xl font-bold mb-8 md:mb-12 max-w-[500px] mx-auto text-balance px-2">¿En qué distrito se encuentra?</h2>
                          <div className="grid grid-cols-2 gap-3 sm:gap-5 w-full max-w-[540px] mx-auto">
                            {(['Miraflores', 'Surco', 'San Isidro', 'San Borja', 'La Molina'] as District[]).map((d, i) => (
                              <motion.button 
                                key={d} 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                onClick={() => { setQuizData({ ...quizData, district: d }); nextStep(); }} 
                                className="option-card !p-4 sm:!p-8"
                              >
                                <span className="option-label text-[10px] sm:text-xs font-bold uppercase tracking-wider">{d}</span>
                              </motion.button>
                            ))}
                            <motion.div 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.3 }}
                              className="col-span-2 sm:col-span-2 p-4 sm:p-6 bg-gray-light border border-dashed border-gray-medium"
                            >
                              <p className="text-[9px] uppercase tracking-widest font-bold opacity-40 mb-2 text-left">¿Otro distrito?</p>
                              <div className="flex gap-2">
                                <input 
                                  type="text" 
                                  placeholder="Distrito..." 
                                  value={otherDistrict}
                                  onChange={(e) => setOtherDistrict(e.target.value)}
                                  className="flex-1 bg-white border border-gray-medium px-4 py-2 text-sm focus:outline-none focus:border-brand-black transition-all"
                                />
                                <button disabled={!otherDistrict.trim()} onClick={() => { setQuizData({ ...quizData, district: otherDistrict }); nextStep(); }} className="bg-brand-black text-brand-gold px-4 disabled:opacity-30 group active:scale-95 transition-transform"><ArrowRight size={16} /></button>
                              </div>
                            </motion.div>
                          </div>
                        </motion.div>
                      )}
                      {quizStep === 3 && (
                        <motion.div 
                          key="step3" 
                          initial={{ opacity: 0, x: 40, filter: 'blur(10px)' }} 
                          animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }} 
                          exit={{ opacity: 0, x: -40, filter: 'blur(10px)' }} 
                          className="w-full"
                        >
                          <h2 className="text-2xl md:text-3xl font-bold mb-8 md:mb-12 max-w-[500px] mx-auto px-2">¿Cuándo necesitas el dinero?</h2>
                          <div className="flex flex-col gap-3 w-full max-w-[500px] mx-auto">
                            {(['Menos de 3 meses', '3 a 6 meses', 'Solo exploro el mercado'] as Timeline[]).map((t, i) => (
                              <motion.button 
                                key={t} 
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                onClick={() => { setQuizData({ ...quizData, timeline: t }); nextStep(); }} 
                                className="option-card !flex-row !justify-start !px-6 sm:!px-8 !py-4 sm:!py-8"
                              >
                                <div className="option-icon-wrapper !w-8 !h-8 sm:!w-10 sm:!h-10"><Clock size={14} /></div>
                                <span className="option-label text-[10px] sm:text-xs font-bold uppercase tracking-wider text-left">{t}</span>
                              </motion.button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                      {quizStep === 4 && (
                        <motion.div 
                          key="step4" 
                          initial={{ opacity: 0, x: 40, filter: 'blur(10px)' }} 
                          animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }} 
                          exit={{ opacity: 0, x: -40, filter: 'blur(10px)' }} 
                          className="w-full"
                        >
                          <h2 className="text-2xl md:text-3xl font-bold mb-8 md:mb-12 max-w-[500px] mx-auto px-2">¿Has intentado venderla antes?</h2>
                          <div className="flex flex-col gap-3 w-full max-w-[500px] mx-auto">
                            {(['Sí, por mi cuenta', 'Sí, con otra agencia', 'No, es la primera vez'] as PreviousAttempt[]).map((a, i) => (
                              <motion.button 
                                key={a} 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                onClick={() => { setQuizData({ ...quizData, attempted: a }); nextStep(); }} 
                                className="option-card !py-5 sm:!py-8"
                              >
                                <span className="option-label text-[10px] sm:text-xs font-bold uppercase tracking-wider text-center">{a}</span>
                              </motion.button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                      {quizStep === 5 && (
                        <motion.div 
                          key="step5" 
                          initial={{ opacity: 0, x: 40, filter: 'blur(10px)' }} 
                          animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }} 
                          exit={{ opacity: 0, x: -40, filter: 'blur(10px)' }} 
                          className="w-full"
                        >
                          <h2 className="text-2xl md:text-3xl font-bold mb-8 md:mb-12 max-w-[500px] mx-auto px-2">¿Cuál es tu mayor preocupación?</h2>
                          <div className="flex flex-col gap-3 w-full max-w-[500px] mx-auto">
                            {(['Malbaratar mi patrimonio', 'Tiempo perdido con curiosos', 'Problemas legales/seguridad'] as Concern[]).map((c, i) => (
                              <motion.button 
                                key={c} 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                onClick={() => { setQuizData({ ...quizData, concern: c }); nextStep(); }} 
                                className="option-card !flex-row !justify-between !px-6 sm:!px-8 !py-5 sm:!py-8 text-left"
                              >
                                <span className="option-label text-[10px] sm:text-xs font-bold uppercase tracking-wider pr-4">{c}</span>
                                <ShieldCheck size={18} className="text-brand-gold shrink-0" />
                              </motion.button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="ornament-text hidden sm:block">{String(quizStep).padStart(2, '0')}</div>
                </motion.div>
              )}

              {step === 'processing' && (
                <motion.div 
                  key="processing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 flex flex-col items-center justify-center p-6 text-center"
                >
                  <div className="relative mb-8">
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="w-16 h-16 border-2 border-gray-medium border-t-brand-gold rounded-full" />
                    <div className="absolute inset-0 flex items-center justify-center"><Loader2 size={24} className="animate-pulse" /></div>
                  </div>
                  <h2 className="text-xl font-bold mb-4">Analizando mercado en <br/><span className="text-brand-gold uppercase tracking-tighter">{quizData.district || 'Lima'}</span>...</h2>
                  <div className="max-w-xs p-5 bg-gray-light border border-gray-medium rounded-sm text-left flex gap-3">
                    <CheckCircle2 size={16} className="text-brand-black shrink-0 mt-0.5" />
                    <p className="text-xs italic text-gray-500">Filtrando al 100% de los interesados antes de las visitas.</p>
                  </div>
                  <div className="ornament-text hidden sm:block">99</div>
                </motion.div>
              )}

              {step === 'result' && (
                <motion.div 
                  key="result"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex-1 overflow-y-auto no-scrollbar"
                >
                  <ResultSection data={quizData} />
                  <div className="ornament-text hidden sm:block">OK</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer Bar */}
          <footer className="footer-bar mt-auto px-6 py-4 sm:px-12 sm:py-8 flex justify-between items-center border-t border-gray-medium bg-white z-20">
            <div className="agent-info flex items-center gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-medium rounded-full overflow-hidden flex items-center justify-center">
                <User size={16} className="text-gray-500" />
              </div>
              <div className="agent-details">
                <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-brand-black">Angela Carmona</p>
                <p className="text-[8px] sm:text-[10px] text-gray-500 font-medium">922 142 073</p>
              </div>
            </div>
            
            <div className="nav-buttons flex gap-2 sm:gap-3">
              {step === 'quiz' && (
                <button onClick={prevStep} className="btn-geometric-secondary !px-4 sm:!px-8 !py-3 sm:!py-4">Volver</button>
              )}
              {step === 'hero' && (
                <button onClick={startQuiz} className="btn-geometric-primary !px-6 sm:!px-10 !py-3 sm:!py-4">Empezar</button>
              )}
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}

// --- Specific View Components ---

function HeroSection({ onStart }: { onStart: () => void }) {
  return (
    <motion.section 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col lg:flex-row min-h-[calc(100vh-64px)]"
    >
      <div className="flex-1 flex flex-col justify-center px-6 md:px-12 lg:px-24 py-20">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <span className="inline-block px-3 py-1 bg-brand-gold text-[10px] font-bold uppercase tracking-[0.2em] mb-8">
            Premium Real Estate
          </span>
          <h1 className="text-5xl md:text-7xl font-bold leading-[0.9] tracking-tighter mb-8 max-w-xl">
            Vende tu propiedad en <span className="text-brand-gold italic">tiempo récord</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-500 mb-12 max-w-lg leading-relaxed">
            👉 Descubre la estrategia de comercialización de <span className="text-brand-black font-semibold">Honne Inmobiliaria</span> para vender al mejor precio y sin perder tiempo con curiosos.
          </p>
          <button 
            onClick={onStart}
            className="group relative inline-flex items-center gap-4 bg-brand-black text-white px-8 py-5 text-sm font-bold uppercase tracking-widest hover:bg-brand-gold hover:text-brand-black transition-all overflow-hidden"
          >
            <span className="relative z-10 text-brand-gold group-hover:text-brand-black">Empezar evaluación gratuita</span>
            <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>

        <div className="mt-20 flex gap-12 items-center opacity-40">
          <div className="flex flex-col">
            <span className="text-2xl font-bold">100+</span>
            <span className="text-[10px] uppercase tracking-widest">Ventas Exitosas</span>
          </div>
          <div className="h-8 w-px bg-gray-200"></div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold">12m</span>
            <span className="text-[10px] uppercase tracking-widest">Promedio Cierre</span>
          </div>
        </div>
      </div>
      
      <div className="flex-1 relative min-h-[400px] lg:min-h-0 overflow-hidden">
        <img 
          src="https://picsum.photos/seed/luxury-property/1200/1600" 
          alt="Luxury Property" 
          className="absolute inset-0 w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-black/40 to-transparent"></div>
        <div className="absolute bottom-12 left-12 right-12 text-white">
          <p className="text-[10px] uppercase tracking-[0.3em] font-bold mb-2">Honne Inmobiliaria</p>
          <p className="font-serif italic text-2xl max-w-xs">Elevamos los estándares de comercialización en Lima.</p>
        </div>
      </div>
    </motion.section>
  );
}

function QuizStep1({ onSelect }: { onSelect: (val: PropertyType) => void }) {
  const options: { label: PropertyType; icon: any }[] = [
    { label: 'Departamento', icon: Building2 },
    { label: 'Casa', icon: Home },
    { label: 'Terreno', icon: MapIcon },
    { label: 'Local Comercial', icon: Store },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="w-full"
    >
      <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2 text-center">¿Qué tipo de propiedad evalúas vender?</h2>
      <p className="text-gray-400 text-center mb-12">Selecciona la opción que mejor describa tu inmueble.</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {options.map((opt) => (
          <button
            key={opt.label}
            onClick={() => onSelect(opt.label)}
            className="group flex flex-col items-center justify-center p-8 bg-white border border-gray-100 hover:border-brand-gold hover:bg-gray-50 transition-all text-center relative overflow-hidden"
          >
            <div className="p-4 rounded-full bg-gray-50 group-hover:bg-brand-gold transition-colors mb-4">
              <opt.icon size={32} className="group-hover:text-brand-black" />
            </div>
            <span className="font-bold uppercase tracking-widest text-xs">{opt.label}</span>
          </button>
        ))}
      </div>
    </motion.div>
  );
}

function QuizStep2({ onSelect, otherValue, onOtherChange }: { onSelect: (val: string) => void, otherValue: string, onOtherChange: (val: string) => void }) {
  const districts: District[] = ['Miraflores', 'Surco', 'San Isidro', 'San Borja', 'La Molina'];

  return (
    <motion.div 
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="w-full"
    >
      <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2 text-center text-balance">¿En qué distrito se encuentra?</h2>
      <p className="text-gray-400 text-center mb-12">El valor de mercado varía significativamente según la ubicación.</p>
      
      <div className="grid grid-cols-2 gap-3 mb-4">
        {districts.map((d) => (
          <button
            key={d}
            onClick={() => onSelect(d)}
            className="p-5 flex items-center justify-center bg-white border border-gray-100 hover:border-brand-gold hover:bg-gray-50 transition-all font-bold uppercase tracking-widest text-[10px]"
          >
            {d}
          </button>
        ))}
      </div>
      
      <div className="mt-4 p-6 bg-gray-50 border border-dashed border-gray-200">
        <p className="text-[10px] uppercase tracking-widest font-bold opacity-40 mb-3">¿Otro distrito?</p>
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="Escribe el distrito..." 
            value={otherValue}
            onChange={(e) => onOtherChange(e.target.value)}
            className="flex-1 bg-white border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-brand-gold transition-colors"
          />
          <button 
            disabled={!otherValue.trim()}
            onClick={() => onSelect(otherValue)}
            className="bg-brand-black text-white px-5 disabled:opacity-30 disabled:cursor-not-allowed group"
          >
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function QuizStep3({ onSelect }: { onSelect: (val: Timeline) => void }) {
  const options: { label: Timeline; icon: any; desc: string }[] = [
    { label: 'Menos de 3 meses', icon: Clock, desc: 'Prioridad alta para cierre rápido.' },
    { label: '3 a 6 meses', icon: Search, desc: 'Planeación estratégica a mediano plazo.' },
    { label: 'Solo exploro el mercado', icon: MapIcon, desc: 'Evaluando opciones y valorización.' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="w-full"
    >
      <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2 text-center">¿En qué línea de tiempo necesitas el dinero?</h2>
      <p className="text-gray-400 text-center mb-12">Ajustaremos la agresividad de la estrategia según tu urgencia.</p>
      
      <div className="space-y-3">
        {options.map((opt) => (
          <button
            key={opt.label}
            onClick={() => onSelect(opt.label)}
            className="w-full flex items-center gap-6 p-6 bg-white border border-gray-100 hover:border-brand-gold hover:bg-gray-50 transition-all text-left group"
          >
            <div className="w-12 h-12 flex items-center justify-center bg-gray-50 group-hover:bg-brand-gold rounded-full transition-colors shrink-0">
              <opt.icon size={20} />
            </div>
            <div>
              <span className="block font-bold uppercase tracking-widest text-xs mb-1">{opt.label}</span>
              <span className="text-xs text-gray-400">{opt.desc}</span>
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  );
}

function QuizStep4({ onSelect }: { onSelect: (val: PreviousAttempt) => void }) {
  const options: PreviousAttempt[] = ['Sí, por mi cuenta', 'Sí, con otra agencia', 'No, es la primera vez'];

  return (
    <motion.div 
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="w-full"
    >
      <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2 text-center">¿Has intentado venderla antes?</h2>
      <p className="text-gray-400 text-center mb-12">Queremos entender el historial comercial de la propiedad.</p>
      
      <div className="space-y-3">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onSelect(opt)}
            className="w-full p-6 bg-white border border-gray-100 hover:border-brand-gold hover:bg-brand-black hover:text-white transition-all text-center group"
          >
            <span className="font-bold uppercase tracking-widest text-xs">{opt}</span>
          </button>
        ))}
      </div>
    </motion.div>
  );
}

function QuizStep5({ onSelect }: { onSelect: (val: Concern) => void }) {
  const options: { label: Concern; icon: any }[] = [
    { label: 'Malbaratar mi patrimonio', icon: Lock },
    { label: 'Tiempo perdido con curiosos', icon: User },
    { label: 'Problemas legales/seguridad', icon: ShieldCheck },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="w-full"
    >
      <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2 text-center">¿Cuál es tu mayor preocupación?</h2>
      <p className="text-gray-400 text-center mb-12">En Honne nos enfocamos en resolver lo que más te importa.</p>
      
      <div className="space-y-3">
        {options.map((opt) => (
          <button
            key={opt.label}
            onClick={() => onSelect(opt.label)}
            className="w-full flex items-center justify-between p-6 bg-white border border-gray-100 hover:border-brand-gold hover:bg-gray-50 transition-all text-left"
          >
            <span className="font-bold uppercase tracking-widest text-xs">{opt.label}</span>
            <opt.icon size={18} className="text-brand-gold" />
          </button>
        ))}
      </div>
    </motion.div>
  );
}

function ProcessingSection({ district }: { district: string }) {
  return (
    <motion.section 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center p-6 text-center"
    >
      <div className="relative mb-12">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-24 h-24 border-2 border-gray-100 border-t-brand-gold rounded-full"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 size={32} className="animate-pulse text-brand-black" />
        </div>
      </div>
      
      <motion.h2 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold mb-4"
      >
        Analizando comportamiento del mercado en <span className="text-brand-gold">{district}</span>...
      </motion.h2>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="max-w-md p-6 bg-gray-50 border border-gray-100 rounded-2xl flex gap-4 items-start text-left"
      >
        <div className="bg-brand-gold p-2 rounded-full shrink-0">
          <CheckCircle2 size={16} />
        </div>
        <p className="text-sm text-gray-500 italic">
          "Sabías que en Honne filtramos al 100% de los interesados antes de llevarlos a tu propiedad."
        </p>
      </motion.div>
    </motion.section>
  );
}

function ResultSection({ data }: { data: QuizData }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSent(true);
  };

  const getWhatsAppLink = () => {
    const message = `Hola Angela, soy *${name}*. Acabo de completar el Quiz Inmobiliario para vender mi propiedad.\n\n` +
      `*DETALLES DE LA PROPIEDAD:*\n` +
      `🏠 *Tipo:* ${data.type}\n` +
      `📍 *Distrito:* ${data.district}\n` +
      `📅 *Urgencia:* ${data.timeline}\n` +
      `🔄 *Historial:* ${data.attempted}\n` +
      `⚠️ *Preocupación:* ${data.concern}\n\n` +
      `Me gustaría recibir mi Hoja de Ruta de Venta y agendar una breve llamada.`;
    
    return `https://wa.me/51922142073?text=${encodeURIComponent(message)}`;
  };

  if (isSent) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="h-full min-h-[400px] flex flex-col items-center justify-center p-6 sm:p-12 text-center"
      >
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-brand-gold rounded-full flex items-center justify-center mb-6 sm:mb-8">
          <CheckCircle2 size={32} />
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tighter leading-none">¡Excelente, {name}!</h2>
        <p className="text-sm sm:text-base text-gray-500 max-w-sm mb-10 font-light leading-relaxed">
          Angela Carmona revisará tu información y te contactará en breve vía WhatsApp con tu Hoja de Ruta personalizada.
        </p>
        <a 
          href={getWhatsAppLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-geometric-primary flex items-center justify-center gap-4 !w-full sm:!w-auto !px-10 !py-5"
        >
          Enviar al WhatsApp de Angela
        </a>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col min-h-full">
      <div className="p-8 sm:p-16 lg:p-20 flex flex-col items-center text-center border-b border-gray-medium">
        <div className="flex items-center gap-2 mb-6 text-brand-gold">
          <Lock size={12} />
          <span className="text-[9px] uppercase font-bold tracking-widest text-brand-black/40">Acceso Restringido • Privacidad Total</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-bold tracking-tighter mb-6 leading-tight">Tu Hoja de Ruta de Venta está <span className="italic underline underline-offset-4 decoration-brand-gold decoration-4">lista</span>.</h2>
        <p className="text-sm sm:text-base text-gray-500 max-w-md font-light leading-relaxed">
          Completa tus datos para enviarlos por WhatsApp y recibir tu estrategia personalizada de inmediato.
        </p>
      </div>

      <div className="p-8 sm:p-16 lg:p-20 bg-gray-light">
        <form onSubmit={handleSubmit} className="w-full max-w-sm mx-auto space-y-6 sm:space-y-8">
          <div className="grid gap-5">
            <div className="space-y-2 text-left">
              <label className="text-[9px] uppercase tracking-widest font-bold opacity-40 flex items-center gap-2">
                <User size={10} /> Nombre Completo
              </label>
              <input 
                required
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nombre..."
                className="w-full bg-white border border-gray-medium px-5 py-3.5 text-sm focus:outline-none focus:border-brand-black transition-all"
              />
            </div>
            
            <div className="space-y-2 text-left">
              <label className="text-[9px] uppercase tracking-widest font-bold opacity-40 flex items-center gap-2">
                <Phone size={10} /> WhatsApp
              </label>
              <div className="relative">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 flex items-center gap-2 pr-3 border-r border-gray-medium">
                  <span className="text-[10px] font-bold tracking-tighter">🇵🇪 +51</span>
                </div>
                <input 
                  required
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="999..."
                  className="w-full bg-white border border-gray-medium pl-20 pr-5 py-3.5 text-sm focus:outline-none focus:border-brand-black transition-all"
                />
              </div>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full btn-geometric-primary !py-5 flex items-center justify-center gap-3 active:scale-95 transition-transform"
          >
            <span className="relative z-10">Generar Mensaje WhatsApp</span>
            <ArrowRight size={16} className="relative z-10" />
          </button>
          
            <p className="text-[9px] text-center text-gray-400 leading-relaxed max-w-[240px] mx-auto uppercase tracking-wider font-bold opacity-40">
            Seguridad y confidencialidad garantizada por Honne Inmobiliaria.
          </p>
        </form>
      </div>
    </div>
  );
}
