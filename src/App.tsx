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
  Mail,
  User, 
  ArrowLeft,
  Loader2,
  Lock,
  ShieldCheck,
  Clock,
  Search,
  MapPin,
  Calendar,
  DollarSign,
  Check,
  HelpCircle
} from 'lucide-react';

// --- Types ---

type Intention = 'Vender' | 'Alquilar';
type PropertyType = 'Departamento' | 'Casa' | 'Terreno' | 'Local Comercial';
type District = 'Miraflores' | 'Surco' | 'San Isidro' | 'San Borja' | 'La Molina';
type Timeline = 'lo antes posible' | '0-3 meses' | '4-6 meses' | '7-12 meses' | 'Más de 12 meses';
type PreviousAttempt = 'Sí, por mi cuenta' | 'Sí, con otra agencia' | 'No, es la primera vez';
type Concern = string;
type HomeCondition = 'No necesita nada' | 'Necesita un poco de trabajo' | 'Necesita mucho trabajo' | 'Demoler';
type HomeValue = '$300.000 o menos' | '$300.000 - $600.000' | '$600.000 - $900.000' | '$900.000 - $1,2 millones' | '$1,2 millones o más';
type ConstructionYear = 'De estreno' | 'De 0 a 5 años' | 'De 6 a 10 años' | 'De 11 a 20 años' | 'De 20 a 50 años' | 'De 50 años a más';
type YesNo = 'Sí' | 'No';

interface QuizData {
  intention: Intention | null;
  type: PropertyType | null;
  address: string | null;
  condition: HomeCondition | null;
  value: HomeValue | string | null;
  currency: 'USD' | 'PEN';
  year: ConstructionYear | null;
  buying: YesNo | null;
  agent: YesNo | null;
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
    intention: null,
    type: null,
    address: null,
    condition: null,
    value: null,
    currency: 'USD',
    year: null,
    buying: null,
    agent: null,
    district: null,
    timeline: null,
    attempted: null,
    concern: null,
  });
  const [otherDistrict, setOtherDistrict] = useState('');
  const [addressInput, setAddressInput] = useState('');
  const [showAddressSuggestions, setShowAddressSuggestions] = useState(false);
  
  const totalSteps = 11;
  const progress = (quizStep / totalSteps) * 100;

  const quizRef = useRef<HTMLDivElement>(null);

  const startQuiz = () => {
    setStep('quiz');
    setQuizStep(1);
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
                className="text-4xl sm:text-5xl font-bold leading-[1.1] mb-6 tracking-tight"
              >
                Vende o Alquila tu propiedad con el respaldo de Honne
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                transition={{ delay: 0.5 }}
                className="text-sm sm:text-base leading-relaxed text-white font-light max-w-[300px]"
              >
                👉 Descubre la mejor estrategia de comercialización inmobiliaria para cerrar al mejor precio y sin perder tiempo.
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
                    Vende o Alquila tu propiedad con <span className="text-brand-gold italic">Honne</span>
                  </motion.h1>
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="lg:hidden text-gray-500 mb-10 max-w-lg mx-auto text-sm md:text-base px-4"
                  >
                    👉 Descubre la estrategia de comercialización de Honne Inmobiliaria para vender o alquilar al mejor precio.
                  </motion.p>
                  
                  <button 
                    onClick={startQuiz}
                    className="btn-geometric-primary group w-full sm:w-auto"
                  >
                    Iniciar diagnóstico gratuito
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
                  <div className="w-full max-w-3xl">
                    <div className="flex justify-between items-center mb-8 px-4">
                      <button 
                        onClick={prevStep}
                        className="p-2 hover:bg-gray-light rounded-full transition-colors text-gray-400 hover:text-brand-black"
                      >
                        <ArrowLeft size={20} />
                      </button>
                      <span className="step-indicator text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 font-sans">
                        Paso {String(quizStep).padStart(2, '0')} / {String(totalSteps).padStart(2, '0')}
                      </span>
                      <div className="w-10"></div>
                    </div>
                    
                    <div className="w-full flex flex-col items-center">
                      <AnimatePresence mode="wait">
                        {quizStep === 1 && (
                          <motion.div 
                            key="step1" 
                            initial={{ opacity: 0, x: 20 }} 
                            animate={{ opacity: 1, x: 0 }} 
                            exit={{ opacity: 0, x: -20 }} 
                            className="w-full"
                          >
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4">¿Cuál es tu intención principal?</h2>
                            <p className="text-gray-400 mb-12 max-w-sm mx-auto text-xs sm:text-sm">Personalizaremos tu Ruta Honne según tu objetivo.</p>
                            <div className="grid grid-cols-2 gap-4 w-full max-w-[500px] mx-auto">
                              {(['Vender', 'Alquilar'] as ('Vender' | 'Alquilar')[]).map((opt) => (
                                <button 
                                  key={opt}
                                  onClick={() => { setQuizData({ ...quizData, intention: opt as Intention }); nextStep(); }} 
                                  className="option-card !py-12 flex flex-col items-center gap-4"
                                >
                                  <span className="option-label text-sm sm:text-lg font-bold uppercase tracking-[0.2em]">{opt === 'Vender' ? 'Quiero Vender' : 'Quiero Alquilar'}</span>
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}

                        {quizStep === 2 && (
                          <motion.div 
                            key="step2" 
                            initial={{ opacity: 0, x: 20 }} 
                            animate={{ opacity: 1, x: 0 }} 
                            exit={{ opacity: 0, x: -20 }} 
                            className="w-full"
                          >
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4">¿Qué tipo de propiedad deseas {quizData.intention === 'Vender' ? 'vender' : 'alquilar'}?</h2>
                            <p className="text-gray-400 mb-12 max-w-sm mx-auto text-xs sm:text-sm">Selecciona la categoría que mejor describa tu inmueble.</p>
                            <div className="grid grid-cols-2 gap-3 sm:gap-5 w-full max-w-[540px] mx-auto">
                              {(['Departamento', 'Casa', 'Terreno', 'Local Comercial'] as PropertyType[]).map((type, i) => {
                                const icons = { 'Departamento': Building2, 'Casa': Home, 'Terreno': MapIcon, 'Local Comercial': Store };
                                const Icon = icons[type];
                                return (
                                  <motion.button 
                                    key={type} 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    onClick={() => { setQuizData({ ...quizData, type }); nextStep(); }} 
                                    className={`option-card flex flex-col items-center justify-center gap-3 p-4 sm:p-8 h-full ${quizData.type === type ? 'selected ring-2 ring-brand-gold' : ''}`}
                                  >
                                    <div className="option-icon-wrapper !w-10 !h-10 sm:!w-12 sm:!h-12">
                                      <Icon size={20} className="sm:size-24" />
                                    </div>
                                    <span className="option-label text-[10px] sm:text-xs font-bold uppercase tracking-wider">{type}</span>
                                  </motion.button>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}

                        {quizStep === 3 && (
                          <motion.div 
                            key="step3" 
                            initial={{ opacity: 0, x: 20 }} 
                            animate={{ opacity: 1, x: 0 }} 
                            exit={{ opacity: 0, x: -20 }} 
                            className="w-full max-w-[540px] mx-auto text-left"
                          >
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 text-center">¿Cuál es la dirección de la propiedad?</h2>
                            <p className="text-gray-400 mb-12 text-center text-xs sm:text-sm">Ingresa la ubicación exacta para un análisis geográfico preciso.</p>
                            
                            <div className="relative mb-8">
                              <label className="text-[9px] uppercase tracking-widest font-bold opacity-40 mb-2 block pl-1">Dirección del inmueble</label>
                              <div className="bg-white border-2 border-brand-gold/10 focus-within:border-brand-gold rounded-sm flex items-center p-4 gap-4 shadow-sm transition-all group">
                                <Search size={20} className="text-gray-300 group-focus-within:text-brand-gold transition-colors" />
                                <input 
                                  type="text"
                                  value={addressInput}
                                  onChange={(e) => {
                                    setAddressInput(e.target.value);
                                    setShowAddressSuggestions(e.target.value.length > 2);
                                  }}
                                  onFocus={() => addressInput.length > 2 && setShowAddressSuggestions(true)}
                                  placeholder="Ej. Av. Larco 123, Miraflores..."
                                  className="flex-1 focus:outline-none text-brand-black bg-transparent text-sm sm:text-base font-medium"
                                />
                              </div>

                              <AnimatePresence>
                                {showAddressSuggestions && (
                                  <motion.div 
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute top-full left-0 right-0 bg-white border border-gray-medium shadow-2xl z-50 mt-2 overflow-hidden rounded-sm"
                                  >
                                    {[
                                      "Av. Larco 123, Miraflores, Lima",
                                      "Ca. Los Olivos 456, San Isidro, Lima",
                                      "Jr. Batalla de Junín 789, Surco, Lima",
                                      "Av. Paseo de la República 1011, San Borja, Lima"
                                    ].filter(a => a.toLowerCase().includes(addressInput.toLowerCase())).map((item) => (
                                      <button 
                                        key={item}
                                        onClick={() => {
                                          setAddressInput(item);
                                          setQuizData({ ...quizData, address: item });
                                          setShowAddressSuggestions(false);
                                        }}
                                        className="w-full p-4 flex items-center gap-4 hover:bg-gray-light transition-colors text-left border-b border-gray-50 last:border-0"
                                      >
                                        <MapPin size={16} className="text-brand-gold shrink-0" />
                                        <span className="text-xs sm:text-sm font-medium">{item}</span>
                                      </button>
                                    ))}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>

                            <button 
                              disabled={!addressInput}
                              onClick={() => {
                                if (quizData.address !== addressInput) {
                                  setQuizData({ ...quizData, address: addressInput });
                                }
                                nextStep();
                              }}
                              className="btn-geometric-primary !w-full !py-6 flex items-center justify-center gap-4 disabled:opacity-30 text-xs sm:text-sm font-bold uppercase tracking-widest"
                            >
                              Continuar <ArrowRight size={18} />
                            </button>
                          </motion.div>
                        )}

                        {quizStep === 4 && (
                          <motion.div key="step4" className="w-full max-w-[500px] mx-auto">
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 sm:mb-10">¿Cuál es la antigüedad de tu propiedad?</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-1 gap-2 sm:gap-3">
                              {[
                                'De estreno', 'De 0 a 5 años', 'De 6 a 10 años', 
                                'De 11 a 20 años', 'De 20 a 50 años', 'De 50 años a más'
                              ].map((item, i) => (
                                <motion.button 
                                  key={item}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: i * 0.05 }}
                                  onClick={() => { 
                                    setQuizData({ ...quizData, year: item as ConstructionYear }); 
                                    nextStep(); 
                                  }} 
                                  className="option-card flex items-center justify-between !py-3 sm:!py-5 !px-4 sm:!px-8"
                                >
                                  <span className="option-label text-[9px] sm:text-xs font-bold uppercase tracking-widest">{item}</span>
                                  <Calendar size={12} className="text-brand-gold opacity-50 shrink-0" />
                                </motion.button>
                              ))}
                            </div>
                          </motion.div>
                        )}

                        {quizStep === 5 && (
                          <motion.div key="step5" className="w-full max-w-[500px] mx-auto">
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-4">Expectativa económica</h2>
                            <p className="text-gray-400 mb-6 sm:mb-8 text-[10px] sm:text-sm">¿Cuánto esperas obtener por la {quizData.intention === 'Vender' ? 'venta' : 'renta'}?</p>
                            
                            <div className="space-y-4 sm:space-y-6">
                              {/* Currency Selector */}
                              <div className="flex justify-center mb-4 sm:mb-6">
                                <div className="flex bg-gray-light p-1 rounded-sm border border-gray-medium">
                                  <button 
                                    onClick={() => setQuizData({ ...quizData, currency: 'USD' })}
                                    className={`px-4 sm:px-6 py-1.5 sm:py-2 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest transition-all ${quizData.currency === 'USD' ? 'bg-brand-gold text-brand-black shadow-sm' : 'text-gray-400 hover:text-brand-black'}`}
                                  >
                                    Dólares ($)
                                  </button>
                                  <button 
                                    onClick={() => setQuizData({ ...quizData, currency: 'PEN' })}
                                    className={`px-4 sm:px-6 py-1.5 sm:py-2 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest transition-all ${quizData.currency === 'PEN' ? 'bg-brand-gold text-brand-black shadow-sm' : 'text-gray-400 hover:text-brand-black'}`}
                                  >
                                    Soles (S/)
                                  </button>
                                </div>
                              </div>

                              <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-brand-gold">
                                  {quizData.currency === 'USD' ? '$' : 'S/'}
                                </span>
                                <input 
                                  type="number"
                                  placeholder="Ingresa un monto"
                                  className="w-full bg-gray-light border-2 border-transparent focus:border-brand-gold p-3 sm:p-4 pl-10 sm:pl-12 rounded-sm text-sm font-bold focus:outline-none transition-all"
                                  value={typeof quizData.value === 'string' && !quizData.value.includes('$') && !quizData.value.includes('S/') ? quizData.value : ''}
                                  onChange={(e) => setQuizData({ ...quizData, value: e.target.value })}
                                />
                              </div>

                              <div className="flex items-center gap-2">
                                <div className="h-[1px] bg-gray-medium flex-1" />
                                <span className="text-[9px] sm:text-[10px] font-bold uppercase opacity-30">O elige un rango</span>
                                <div className="h-[1px] bg-gray-medium flex-1" />
                              </div>

                              <div className="grid grid-cols-1 gap-1.5 sm:gap-2">
                                {(quizData.intention === 'Vender' 
                                  ? (quizData.currency === 'USD' 
                                      ? ['$300.000 o menos', '$300.000 - $600.000', '$600.000 - $900.000', '$900.000 - $1,2 millones', '$1,2 millones o más']
                                      : ['S/ 1.000.000 o menos', 'S/ 1.000.000 - S/ 2.500.000', 'S/ 2.500.000 - S/ 4.000.000', 'S/ 4.000.000 o más'])
                                  : (quizData.currency === 'USD'
                                      ? ['$1.000 o menos', '$1.000 - $3.000', '$3.000 - $5.000', '$5.000 - $8.000', '$8.000 o más']
                                      : ['S/ 3.500 o menos', 'S/ 3.500 - S/ 6.500', 'S/ 6.500 - S/ 10.000', 'S/ 10.000 o más'])
                                ).map((item) => (
                                  <button 
                                    key={item}
                                    onClick={() => { setQuizData({ ...quizData, value: item }); nextStep(); }}
                                    className={`p-3 sm:p-4 border border-gray-medium hover:border-brand-gold hover:bg-brand-gold/5 transition-all text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-left ${quizData.value === item ? 'border-brand-gold bg-brand-gold/5' : ''}`}
                                  >
                                    {item}
                                  </button>
                                ))}
                              </div>

                              {quizData.value && typeof quizData.value === 'string' && quizData.value.length > 0 && !quizData.value.includes('$') && !quizData.value.includes('S/') && (
                                <button 
                                  onClick={nextStep}
                                  className="btn-geometric-primary !w-full !py-3 sm:!py-4"
                                >
                                  Confirmar Monto
                                </button>
                              )}
                            </div>
                          </motion.div>
                        )}

                        {quizStep === 6 && (
                          <motion.div key="step6" className="w-full max-w-[500px] mx-auto">
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 sm:mb-10">¿Cuándo te gustaría {quizData.intention === 'Vender' ? 'vender' : 'alquilar'}?</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-1 gap-2 sm:gap-3">
                              {[
                                'lo antes posible', '0-3 meses', 
                                '4-6 meses', '7-12 meses', 'Más de 12 meses'
                              ].map((item, i) => (
                                <motion.button 
                                  key={item} 
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: i * 0.05 }}
                                  onClick={() => { setQuizData({ ...quizData, timeline: item as Timeline }); nextStep(); }} 
                                  className="option-card !py-4 sm:!py-6 font-bold"
                                >
                                  <span className="option-label text-[10px] sm:text-xs uppercase tracking-widest">{item}</span>
                                </motion.button>
                              ))}
                            </div>
                          </motion.div>
                        )}

                        {quizStep === 7 && (
                          <motion.div key="step7" className="w-full max-w-[500px] mx-auto">
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 px-4 text-balance">¿También estás buscando comprar una propiedad?</h2>
                            <p className="text-gray-400 mb-12 text-[10px] sm:text-xs">Ofrecemos estrategias para transacciones simultáneas.</p>
                            <div className="grid grid-cols-2 gap-4">
                              {['No', 'Sí'].map((item) => (
                                <button 
                                  key={item} 
                                  onClick={() => { setQuizData({ ...quizData, buying: item as YesNo }); nextStep(); }} 
                                  className="option-card !py-10 sm:!py-12"
                                >
                                  <span className="option-label text-sm sm:text-base font-bold uppercase tracking-[0.2em]">{item}</span>
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}

                        {quizStep === 8 && (
                          <motion.div key="step8" className="w-full max-w-[500px] mx-auto">
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-12">¿Trabajas actualmente con un agente?</h2>
                            <div className="grid grid-cols-2 gap-4">
                              {['No', 'Sí'].map((item) => (
                                <button 
                                  key={item} 
                                  onClick={() => { setQuizData({ ...quizData, agent: item as YesNo }); nextStep(); }} 
                                  className="option-card !py-10 sm:!py-12"
                                >
                                  <span className="option-label text-sm sm:text-base font-bold uppercase tracking-[0.2em]">{item}</span>
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}

                        {quizStep === 9 && (
                          <motion.div key="step9" className="w-full max-w-[500px] mx-auto">
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-10">¿Has intentado {quizData.intention === 'Vender' ? 'venderla' : 'alquilarla'} antes?</h2>
                            <div className="grid gap-3">
                              {(['Sí, por mi cuenta', 'Sí, con otra agencia', 'No, es la primera vez'] as PreviousAttempt[]).map((a, i) => (
                                <motion.button 
                                  key={a} 
                                  initial={{ opacity: 0, x: 20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: i * 0.1 }}
                                  onClick={() => { setQuizData({ ...quizData, attempted: a }); nextStep(); }} 
                                  className="option-card !py-6 sm:!py-7"
                                >
                                  <span className="option-label text-[10px] sm:text-xs font-bold uppercase tracking-widest">{a}</span>
                                </motion.button>
                              ))}
                            </div>
                          </motion.div>
                        )}

                        {quizStep === 10 && (
                          <motion.div key="step10" className="w-full max-w-[500px] mx-auto">
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 tracking-tight">¿Cuál es tu mayor preocupación?</h2>
                            <p className="text-gray-400 mb-6 sm:mb-12 text-[10px] sm:text-xs">Entender tus prioridades nos ayuda a diseñar el mejor plan.</p>
                            <div className="grid grid-cols-1 sm:grid-cols-1 gap-2 sm:gap-3">
                              {[
                                { label: 'Malbaratar mi patrimonio', icon: Lock },
                                { label: 'Tiempo perdido con curiosos', icon: User },
                                { label: 'Problemas legales/seguridad', icon: ShieldCheck }
                              ].map((item, i) => (
                                <motion.button 
                                  key={item.label}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: i * 0.1 }}
                                  onClick={() => { setQuizData({ ...quizData, concern: item.label }); nextStep(); }} 
                                  className={`option-card flex items-center justify-between !py-4 sm:!py-7 !px-6 sm:!px-10 ${quizData.concern === item.label ? 'border-brand-gold bg-brand-gold/5' : ''}`}
                                >
                                  <span className="option-label text-[9px] sm:text-xs font-bold uppercase tracking-widest text-left pr-4">{item.label}</span>
                                  <item.icon size={16} className="text-brand-gold shrink-0" />
                                </motion.button>
                              ))}
                            </div>

                            <div className="mt-6 sm:mt-10 space-y-3 sm:space-y-4">
                              <div className="flex items-center gap-2">
                                <div className="h-[1px] bg-gray-medium flex-1" />
                                <span className="text-[9px] font-bold uppercase opacity-30 tracking-[0.2em]">O escribe tu preocupación</span>
                                <div className="h-[1px] bg-gray-medium flex-1" />
                              </div>
                              <div className="relative">
                                <textarea 
                                  placeholder="Escribe aquí tu mayor preocupación..."
                                  value={!['Malbaratar mi patrimonio', 'Tiempo perdido con curiosos', 'Problemas legales/seguridad'].includes(quizData.concern || '') ? quizData.concern || '' : ''}
                                  onChange={(e) => setQuizData({ ...quizData, concern: e.target.value })}
                                  className="w-full bg-gray-light border-2 border-transparent focus:border-brand-gold p-4 sm:p-5 rounded-sm text-sm font-bold focus:outline-none transition-all min-h-[80px] sm:min-h-[100px] resize-none"
                                />
                              </div>
                              {quizData.concern && quizData.concern.length > 0 && !['Malbaratar mi patrimonio', 'Tiempo perdido con curiosos', 'Problemas legales/seguridad'].includes(quizData.concern) && (
                                <motion.button 
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  onClick={nextStep}
                                  className="btn-geometric-primary !w-full !py-4 sm:!py-5 flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-[0.2em]"
                                >
                                  Continuar <ArrowRight size={16} />
                                </motion.button>
                              )}
                            </div>
                          </motion.div>
                        )}

                        {quizStep === 11 && (
                          <motion.div key="step11" className="w-full max-w-[440px] mx-auto">
                            <div className="flex flex-col items-center text-center mb-10 sm:mb-16">
                              <div className="w-16 h-16 sm:w-24 sm:h-24 bg-brand-gold rounded-full flex items-center justify-center mb-6 sm:mb-8 shadow-2xl shadow-brand-gold/30">
                                <ShieldCheck size={32} className="text-brand-black sm:size-12" />
                                </div>
                              <h2 className="text-xl sm:text-4xl font-bold mb-4 sm:mb-6 tracking-tighter italic uppercase underline decoration-brand-gold/30">Análisis Completo</h2>
                              <p className="text-gray-500 font-medium leading-relaxed text-[10px] sm:text-sm px-4">
                                Hemos recopilado toda la información necesaria para preparar tu <span className="text-brand-black font-extrabold underline decoration-brand-gold decoration-2">Ruta de {quizData.intention === 'Vender' ? 'Venta' : 'Alquiler'} Honne Personalizada</span>.
                              </p>
                            </div>
                            <button 
                              onClick={nextStep}
                              className="w-full btn-geometric-primary !py-5 sm:!py-7 flex items-center justify-center gap-6 text-[10px] sm:text-xs font-extrabold uppercase tracking-[0.4em] shadow-2xl"
                            >
                              Finalizar Evaluación <ArrowRight size={20} />
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                  <div className="ornament-text hidden sm:block">{String(quizStep).padStart(2, '0')}</div>
                </motion.div>
              )}

              {step === 'processing' && (
                <ProcessingSection district={quizData.district || quizData.address} />
              )}

              {step === 'result' && (
                <motion.div 
                  key="result"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 overflow-y-auto"
                >
                  <ResultSection data={quizData} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <footer className="p-6 border-t border-gray-medium bg-white z-20 flex justify-between items-center shrink-0">
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-30">© 2020 Honne Inmobiliaria</span>
            <div className="flex gap-4 opacity-30">
              <Phone size={14} />
              <Mail size={14} />
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}

// --- Specialized Internal Components ---

function ProcessingSection({ district }: { district: string | null }) {
  return (
    <motion.section 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-full flex flex-col items-center justify-center p-6 text-center"
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
        Generando tu Ruta de Venta Honne personalizada...
      </motion.h2>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="max-w-md p-6 bg-gray-50 border border-gray-100 rounded-2xl flex gap-4 items-start text-left mx-auto"
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
  const [email, setEmail] = useState('');

  const getWhatsAppLink = () => {
    const formattedValue = typeof data.value === 'string' && !data.value.includes('$') && !data.value.includes('S/') 
      ? `${data.currency === 'USD' ? '$' : 'S/'} ${data.value}`
      : data.value;

    const message = `*Honne Inmobiliaria - Nueva Solicitud*\n\n` +
      `👤 *Nombre:* ${name}\n` +
      `✉️ *Email:* ${email}\n` +
      `🎯 *Intención:* ${data.intention}\n` +
      `🏠 *Tipo:* ${data.type}\n` +
      `📍 *Ubicación:* ${data.address || 'No especificada'}\n` +
      `📅 *Antigüedad:* ${data.year || 'No especificada'}\n` +
      `💰 *Expectativa:* ${formattedValue || 'No especificada'}\n` +
      `⏰ *Urgencia:* ${data.timeline}\n` +
      `🔄 *Historial:* ${data.attempted}\n` +
      `🛒 *Busca comprar:* ${data.buying || 'N/A'}\n` +
      `🤝 *Trabaja con agente:* ${data.agent || 'N/A'}\n` +
      `⚠️ *Preocupación:* ${data.concern || 'No especificada'}`;
    
    return `https://wa.me/51922142073?text=${encodeURIComponent(message)}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.open(getWhatsAppLink(), '_blank');
  };

  return (
    <div className="flex flex-col min-h-full">
      <div className="p-6 sm:p-16 lg:p-20 flex flex-col items-center text-center border-b border-gray-medium">
        <div className="flex items-center gap-2 mb-4 sm:mb-6 text-brand-gold">
          <Lock size={12} />
          <span className="text-[9px] uppercase font-bold tracking-widest text-brand-black/40">Acceso Restringido • Privacidad Total</span>
        </div>
        <h2 className="text-2xl sm:text-5xl font-bold tracking-tighter mb-4 sm:mb-6 leading-tight">Tu Ruta de Venta Honne está <span className="italic underline underline-offset-4 decoration-brand-gold decoration-4">lista</span>.</h2>
        <p className="text-xs sm:text-base text-gray-500 max-w-md font-light leading-relaxed">
          Ingresa tus datos finales para <span className="text-brand-black font-bold">abrir WhatsApp</span> y enviar tu solicitud automáticamente.
        </p>
      </div>

      <div className="p-6 sm:p-16 lg:p-20 bg-gray-light">
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
                <Mail size={10} /> Correo electrónico
              </label>
              <div className="relative">
                <input 
                  required
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ejemplo@correo.com"
                  className="w-full bg-white border border-gray-medium px-5 py-3.5 text-sm focus:outline-none focus:border-brand-black transition-all"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <button 
              type="submit"
              className="w-full btn-geometric-primary !py-5 flex items-center justify-center gap-3 active:scale-95 transition-transform"
            >
              <span className="relative z-10">Solicitar a WhatsApp</span>
              <ArrowRight size={16} className="relative z-10" />
            </button>
            <p className="text-[10px] text-gray-400 text-center italic">
              * Al hacer clic, se abrirá WhatsApp con tu mensaje listo para enviar.
            </p>
          </div>
          
          <p className="text-[9px] text-center text-gray-400 leading-relaxed max-w-[240px] mx-auto uppercase tracking-wider font-bold opacity-40 pt-4">
            Seguridad y confidencialidad garantizada por Honne Inmobiliaria.
          </p>
        </form>
      </div>
    </div>
  );
}
