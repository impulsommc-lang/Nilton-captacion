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
  Briefcase,
  Layers,
  ShieldCheck,
  Clock,
  Search,
  MapPin,
  Calendar,
  DollarSign,
  Check,
  HelpCircle,
  Radio,
  Users,
  LineChart,
  Cpu,
  Sparkles,
  Globe,
  Video,
  Target,
  UserCheck,
  Network,
  Eye,
  Activity,
  Award,
  Shield,
  Send
} from 'lucide-react';

// --- Types ---

type PropertyType = 'Departamento' | 'Casa' | 'Oficina' | 'Terreno' | 'Otro';

interface QuizData {
  intention: 'Vender' | 'Alquilar' | 'Valuar' | null;
  type: PropertyType | null;
  address: string;
  district: string;
  value: string;
  currency: 'USD' | 'PEN';
  timeline: string | null;
  attempted: string | null;
  state: string | null; // Physical condition state
  name: string;
  phone: string;
  email: string;
  acceptTerms: boolean;
}

// --- List of Lima High-End Districts ---
const PREMIUM_DISTRICTS = [
  'Miraflores',
  'San Isidro',
  'Santiago de Surco',
  'San Borja',
  'La Molina',
  'Barranco',
  'Lince',
  'Magdalena del Mar',
  'Jesús María',
  'Pueblo Libre',
  'San Miguel',
  'Surquillo',
  'Chorrillos',
  'Otro distrito'
];

export default function App() {
  // Navigation stack state for perfect goBack behavior
  const [historyStack, setHistoryStack] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState<string>('portada');

  const [quizData, setQuizData] = useState<QuizData>({
    intention: null,
    type: null,
    address: '',
    district: '',
    value: '',
    currency: 'USD',
    timeline: null,
    attempted: null,
    state: null,
    name: '',
    phone: '',
    email: '',
    acceptTerms: true
  });

  const [otherDistrict, setOtherDistrict] = useState('');
  const [showAddressSuggestions, setShowAddressSuggestions] = useState(false);
  const [redirectProgress, setRedirectProgress] = useState(0);

  // Dynamic status/progress calculations
  const totalQuizSteps = 6;
  const getQuizStepNumber = () => {
    switch (currentStep) {
      case 'quiz_step_1': return 1;
      case 'quiz_step_2': return 2;
      case 'quiz_step_3': return 3;
      case 'quiz_step_5': return 4;
      case 'quiz_step_4': return 5;
      case 'quiz_step_6': return 6;
      case 'contacto': return 6; // Last form step
      default: return 0;
    }
  };

  const getStepProgressPercentage = () => {
    const steps = [
      'portada',
      'quiz_step_1',
      'quiz_step_2',
      'alcance_digital',
      'quiz_step_3',
      'fuerza_comercial',
      'quiz_step_5',
      'analisis_mercado',
      'quiz_step_4',
      'quiz_step_6',
      'contacto'
    ];
    
    const idx = steps.indexOf(currentStep);
    if (idx === -1) return 100;
    return Math.min(100, Math.floor(((idx + 1) / steps.length) * 100));
  };

  // Safe navigation function
  const goTo = (nextStep: string) => {
    setHistoryStack(prev => [...prev, currentStep]);
    setCurrentStep(nextStep);
    
    // Quick auto scroll to top of component
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = () => {
    if (historyStack.length > 0) {
      const prev = historyStack[historyStack.length - 1];
      setHistoryStack(prevStack => prevStack.slice(0, -1));
      setCurrentStep(prev);
    } else {
      setCurrentStep('portada');
    }
  };

  // Safe triggers on crucial properties to synchronize prices
  const handleIntentionChange = (intention: 'Vender' | 'Alquilar' | 'Valuar') => {
    let defaultValue = '200000';
    if (intention === 'Alquilar') {
      defaultValue = quizData.currency === 'USD' ? '2000' : '7000';
    } else {
      defaultValue = quizData.currency === 'USD' ? '200000' : '700000';
    }
    setQuizData(prev => ({
      ...prev,
      intention,
      value: defaultValue
    }));
  };

  const handleCurrencyChange = (currency: 'USD' | 'PEN') => {
    let defaultValue = '200000';
    if (quizData.intention === 'Alquilar') {
      defaultValue = currency === 'USD' ? '2000' : '7000';
    } else {
      defaultValue = currency === 'USD' ? '200000' : '700000';
    }
    setQuizData(prev => ({
      ...prev,
      currency,
      value: defaultValue
    }));
  };

  // Trigger loading screen with real-time feedback and direct auto-redirection to WhatsApp
  useEffect(() => {
    if (currentStep === 'processing') {
      setRedirectProgress(0);
      const interval = setInterval(() => {
        setRedirectProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          // Dynamic increment to feel realistic and interactive
          const increment = Math.floor(Math.random() * 8) + 4;
          return Math.min(prev + increment, 100);
        });
      }, 120);
      return () => clearInterval(interval);
    }
  }, [currentStep]);

  // Handle auto-redirection immediately upon reaching 100% to go to thank you screen first, then auto-trigger WhatsApp
  useEffect(() => {
    if (currentStep === 'processing' && redirectProgress === 100) {
      const timer = setTimeout(() => {
        setCurrentStep('confirmacion');
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [redirectProgress, currentStep]);

  useEffect(() => {
    if (currentStep === 'confirmacion') {
      const timer = setTimeout(() => {
        window.location.href = getWhatsAppLink();
      }, 1800);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  const formatValueWithDots = (val: string | number) => {
    if (val === undefined || val === null || val === '') return '';
    const numStr = val.toString().replace(/\D/g, '');
    if (!numStr) return '';
    return Number(numStr).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  // Formatted price representation for high aesthetic consistency
  const formattedPrice = () => {
    if (!quizData.value) return '';
    const num = Number(quizData.value);
    if (isNaN(num)) return quizData.value;
    return num.toLocaleString('es-PE');
  };

  // Dynamic slider range params
  const getSliderParams = () => {
    const isVender = quizData.intention === 'Vender';
    const isUSD = quizData.currency === 'USD';
    
    if (isVender) {
      if (isUSD) {
        return { min: 40000, max: 1500000, step: 10000 };
      } else {
        return { min: 100000, max: 5000000, step: 20000 };
      }
    } else {
      if (isUSD) {
        return { min: 200, max: 10000, step: 100 };
      } else {
        return { min: 600, max: 35000, step: 200 };
      }
    }
  };

  const sliderParams = getSliderParams();
  const sliderPercentage = (() => {
    const val = Number(quizData.value) || sliderParams.min;
    const pct = ((val - sliderParams.min) / (sliderParams.max - sliderParams.min)) * 100;
    return Math.min(Math.max(pct, 0), 100);
  })();

  // Main WhatsApp link compiler using real Unicode emojis
  const getWhatsAppLink = () => {
    const formattedValue = quizData.value
      ? `${quizData.currency === 'USD' ? 'US$' : 'S/'} ${Number(quizData.value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`
      : 'No especificada';

    const message = `Hola Honne. Acabo de completar la solicitud.\n\n` +
      `👤 *Nombre:* ${quizData.name}\n` +
      `📞 *WhatsApp / Teléfono:* ${quizData.phone}\n` +
      `✉️ *Email:* ${quizData.email || 'No especificado'}\n` +
      `🎯 *Intención:* ${quizData.intention || 'Vender'}\n` +
      `🏠 *Tipo:* ${quizData.type || 'Departamento'}\n` +
      `📍 *Ubicación:* ${quizData.address || 'No especificada'}\n` +
      `📅 *Antigüedad:* De estreno\n` +
      `💰 *Expectativa:* ${formattedValue}\n` +
      `⏰ *Urgencia:* ${quizData.timeline || 'lo antes posible'}\n` +
      `🔄 *Historial:* ${quizData.attempted || 'No, es la primera vez'}\n` +
      `🛒 *Busca comprar:* No\n` +
      `🤝 *Trabaja con agente:* No\n` +
      `⚠️ *Preocupación:* que me estafen\n\n` +
      `Me gustaría recibir mi Ruta de Venta Honne y agendar una breve llamada.`;
    
    return `https://wa.me/51922142073?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="min-h-screen bg-white font-sans text-brand-black selection:bg-brand-gold overflow-hidden">
      <div className="app-shell-grid lg:h-screen">
        
        {/* --- DESKTOP SIDEBAR (Visual presentation & dynamically updated Diagnostic state) --- */}
        <aside className="hero-side hidden lg:flex bg-black text-white relative flex-col justify-between p-12 border-r border-gray-medium overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
              className="w-full h-full object-cover opacity-20" 
              alt="Premium Real Estate" 
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/90 to-black"></div>
          </div>
          
          <div className="relative z-10 flex flex-col h-full justify-between">
            {/* Logo */}
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-[0.4em] uppercase brand-logo-border pl-4 border-l-4 border-brand-gold text-brand-gold">HONNE</span>
              <span className="text-[9px] text-zinc-400 uppercase tracking-widest pl-4 mt-1 font-mono">Inmobiliaria de elite</span>
            </div>

            {/* Dynamic visual preview of current captured data - keeps the tool alive & highly responsive */}
            <div className="my-auto py-10">
              {quizData.intention || quizData.type || quizData.address ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-4"
                >
                  {/* Interactive compatibility meter card */}
                  <div className="bg-gradient-to-br from-zinc-900 via-black to-zinc-900 border border-zinc-800 p-5 rounded-lg text-left shadow-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[9px] uppercase tracking-wider text-brand-gold font-bold">ÍNDICE DE VIABILIDAD COMERCIAL</span>
                      <span className="text-xs font-black text-brand-gold font-mono">
                        {(() => {
                          let score = 25;
                          if (quizData.intention) score += 15;
                          if (quizData.type) score += 15;
                          if (quizData.district || quizData.address) score += 15;
                          if (quizData.value && Number(quizData.value) > 0) score += 15;
                          if (quizData.timeline) score += 15;
                          return Math.min(score, 100);
                        })()}%
                      </span>
                    </div>

                    {/* Progress tracking line */}
                    <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden mb-3.5">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-brand-gold to-yellow-400 origin-left"
                        animate={{ 
                          width: `${(() => {
                            let score = 25;
                            if (quizData.intention) score += 15;
                            if (quizData.type) score += 15;
                            if (quizData.district || quizData.address) score += 15;
                            if (quizData.value && Number(quizData.value) > 0) score += 15;
                            if (quizData.timeline) score += 15;
                            return Math.min(score, 100);
                          })()}%` 
                        }}
                        transition={{ type: 'spring', stiffness: 80 }}
                      />
                    </div>

                    <p className="text-[10px] text-zinc-400 font-semibold italic">
                      {(() => {
                        let score = 25;
                        if (quizData.intention) score += 15;
                        if (quizData.type) score += 15;
                        if (quizData.district || quizData.address) score += 15;
                        if (quizData.value && Number(quizData.value) > 0) score += 15;
                        if (quizData.timeline) score += 15;
                        
                        if (score < 50) return "🚀 Iniciando diagnóstico comercial...";
                        if (score < 80) return "📊 Generando curva de equilibrio de precio...";
                        return "✨ ¡Diagnóstico Express Optimizado para WhatsApp!";
                      })()}
                    </p>
                  </div>

                  <div className="bg-zinc-900/80 border border-zinc-800 p-5 rounded-lg backdrop-blur">
                    <p className="text-[9px] uppercase text-zinc-400 tracking-widest font-black mb-3.5 border-b border-zinc-800/60 pb-1.5">RESUMEN DE SOLICITUD</p>
                    <div className="space-y-3 font-mono text-xs">
                      {quizData.intention && (
                        <div className="flex justify-between border-b border-zinc-800/40 pb-1.5 text-zinc-350">
                          <span>🎯 Objetivo:</span>
                          <span className="text-white font-bold">{quizData.intention === 'Vender' ? 'Venta de propiedad' : 'Alquiler'}</span>
                        </div>
                      )}
                      {quizData.type && (
                        <div className="flex justify-between border-b border-zinc-800/40 pb-1.5 text-zinc-350">
                          <span>🏠 Tipo:</span>
                          <span className="text-white font-bold">{quizData.type}</span>
                        </div>
                      )}
                      {quizData.address && (
                        <div className="flex justify-between border-b border-zinc-800/40 pb-1.5 text-zinc-350">
                          <span>📍 Ubicación:</span>
                          <span className="text-white font-bold max-w-[140px] truncate">{quizData.address}</span>
                        </div>
                      )}
                      {quizData.district && (
                        <div className="flex justify-between border-b border-zinc-800/40 pb-1.5 text-zinc-350">
                          <span>🏷️ Distrito:</span>
                          <span className="text-white font-bold">{quizData.district}</span>
                        </div>
                      )}
                      {quizData.value && (
                        <div className="flex justify-between border-b border-zinc-800/40 pb-1.5 text-zinc-350">
                          <span>💰 Expectativa:</span>
                          <span className="text-brand-gold font-bold font-sans">
                            {quizData.currency === 'USD' ? 'US$' : 'S/'} {Number(quizData.value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                          </span>
                        </div>
                      )}
                      {quizData.timeline && (
                        <div className="flex justify-between border-b border-zinc-800/40 pb-1.5 text-zinc-350">
                          <span>⏰ Plazo:</span>
                          <span className="text-white font-bold uppercase text-[9px] tracking-wider">{quizData.timeline}</span>
                        </div>
                      )}
                      {quizData.attempted && (
                        <div className="flex justify-between text-zinc-350">
                          <span>🔄 Historial:</span>
                          <span className="text-white font-bold text-[9px]">{quizData.attempted}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  <h1 className="text-3xl font-bold leading-[1.1] tracking-tight">
                    Vende o alquila tu propiedad con la mejor estrategia digital del país
                  </h1>
                  <p className="text-xs text-justify leading-relaxed text-gray-400 font-light max-w-[340px]">
                    Descubre cómo comercializamos propiedades de forma eficiente utilizando análisis de mercado exclusivo y las principales herramientas tecnológicas globales.
                  </p>
                </div>
              )}
            </div>

            {/* Footer indicator */}
            <div className="mt-auto pt-6 flex justify-between items-center text-zinc-500 font-mono text-[9px] tracking-widest uppercase">
              <span>© 2020 Honne Inmobiliaria</span>
              <span>LIMA, PERÚ</span>
            </div>
          </div>
        </aside>

        {/* --- INTERACTIVE PRESENTATION & DIAGNOSTIC STAGES CONTAINER --- */}
        <main className="quiz-side flex flex-col bg-white relative h-screen max-h-[100dvh] overflow-hidden">
          
          {/* Top visual progress bar matching current state progression */}
          <div className="progress-container h-1 w-full bg-gray-light absolute top-0 left-0 z-30">
            <motion.div 
              className="progress-bar h-full bg-brand-gold origin-left"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: getStepProgressPercentage() / 100 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
            />
          </div>

          {/* Interactive Shell Body */}
          <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar pt-1 bg-white">
            <AnimatePresence mode="wait">
              
              {/* --- STAGE 1: PORTADA --- */}
              {currentStep === 'portada' && (
                <motion.div 
                  key="portada"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="flex-1 min-h-[84vh] sm:min-h-0 flex flex-col justify-between p-4.5 xs:p-6 sm:p-8 container max-w-xl mx-auto"
                >
                  {/* Title and Description Group */}
                  <div className="space-y-1.5">
                    {/* Small Brand Header for mobile */}
                    <div className="lg:hidden flex items-center gap-2 mb-1">
                      <span className="text-base font-black tracking-[0.3em] uppercase brand-logo-border pl-3 border-l-4 border-brand-gold text-brand-black">HONNE</span>
                    </div>

                    {/* Main Display Heading */}
                    <h2 className="text-lg sm:text-xl md:text-2xl font-black tracking-tight leading-tight text-left">
                      ¿Quieres vender tu propiedad en <br />
                      <span className="bg-brand-gold text-brand-black px-2 py-0.5 text-xs sm:text-sm md:text-base font-black inline-block mt-0.5 uppercase tracking-wider">
                        Lima Top o Moderna?
                      </span>
                    </h2>

                    <p className="text-gray-500 text-[11px] sm:text-xs font-semibold leading-normal text-left">
                      Descubre cómo comercializamos propiedades utilizando marketing digital, análisis de mercado, tecnología e inteligencia artificial.
                    </p>
                  </div>

                  {/* Staged premium visualization */}
                  <div className="w-full h-48 xs:h-56 sm:h-64 md:h-72 overflow-hidden rounded-sm relative shadow-sm my-2">
                    <img 
                      src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80" 
                      className="w-full h-full object-cover" 
                      alt="Modern apartment interior" 
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Key Metrics Columns */}
                  <div className="grid grid-cols-2 gap-2 mb-2 text-left font-sans">
                    <div className="p-2 sm:p-2.5 bg-gray-light border-l-2 border-brand-gold flex flex-col justify-center min-h-[42px]">
                      <p className="text-xs sm:text-sm font-extrabold text-brand-black">+700 mil</p>
                      <p className="text-[8.5px] sm:text-[9px] text-gray-400 uppercase tracking-wider font-semibold">seguidores</p>
                    </div>
                    <div className="p-2 sm:p-2.5 bg-gray-light border-l-2 border-brand-gold flex flex-col justify-center min-h-[42px]">
                      <p className="text-xs sm:text-sm font-extrabold text-brand-black">+50</p>
                      <p className="text-[8.5px] sm:text-[9px] text-gray-400 uppercase tracking-wider font-semibold">agentes inmobiliarios</p>
                    </div>
                    <div className="p-2 sm:p-2.5 bg-gray-light border-l-2 border-brand-gold flex flex-col justify-center min-h-[42px]">
                      <p className="text-xs sm:text-sm font-extrabold text-brand-black">12</p>
                      <p className="text-[8.5px] sm:text-[9px] text-gray-400 uppercase tracking-wider font-semibold">portales inmobiliarios</p>
                    </div>
                    <div className="p-2 sm:p-2.5 bg-gray-light border-l-2 border-brand-gold bg-brand-gold/5 flex flex-col justify-center min-h-[42px]">
                      <p className="text-xs sm:text-sm font-extrabold text-brand-black">Tecnología e IA</p>
                      <p className="text-[8.5px] sm:text-[9px] text-gray-400 uppercase tracking-wider font-semibold">comercialmente aplicada</p>
                    </div>
                  </div>

                  <button 
                    onClick={() => goTo('quiz_step_1')}
                    className="btn-geometric-primary group w-full flex items-center justify-center gap-4 py-3 sm:py-3.5"
                  >
                    CONOCER LA ESTRATEGIA
                    <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform" />
                  </button>
                </motion.div>
              )}
              {/* --- STAGE 3: ALCANCE DIGITAL --- */}
              {currentStep === 'alcance_digital' && (
                <motion.div 
                  key="alcance_digital"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex-1 flex flex-col p-4 sm:p-6 md:p-8 container max-w-xl mx-auto justify-center text-left"
                >
                  <div className="flex items-center justify-between mb-4">
                    <button onClick={goBack} className="p-1.5 hover:bg-gray-light rounded-full transition-colors text-gray-400 hover:text-brand-black">
                      <ArrowLeft size={16} />
                    </button>
                    <span className="text-[10px] font-extrabold uppercase tracking-wide text-zinc-400 font-mono">// COBERTURA DIGITAL</span>
                    <div className="w-8"></div>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-black leading-tight mb-2">
                    Porque no basta con publicarlas en uno o dos lugares.
                  </h2>
                  <p className="text-zinc-500 text-[11px] leading-normal mb-5">
                    Desplegamos una infraestructura publicitaria robusta diseñada para captar el 100% de la demanda potencial:
                  </p>

                  {/* Gigantic visual metric block */}
                  <div className="bg-zinc-900 text-white p-5 sm:p-6 text-left mb-4.5 border-l-4 border-brand-gold">
                    <span className="font-mono text-[9px] tracking-widest uppercase text-zinc-400">PÚBLICO ALCANZADO</span>
                    <div className="text-3xl sm:text-4xl font-black text-brand-gold tracking-tight leading-none mt-1">+700K</div>
                    <p className="text-[10px] sm:text-[11px] font-bold text-zinc-300 uppercase tracking-wide mt-1">SEGUIDORES</p>
                  </div>

                  {/* Detailed features columns */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left mb-6 font-sans">
                    <div className="p-3 border border-gray-medium rounded-sm bg-white">
                      <Globe size={16} className="text-brand-black mb-2" />
                      <h4 className="text-xs font-black uppercase tracking-wide text-brand-black">PORTALES INMOBILIARIOS</h4>
                      <p className="text-[10px] text-gray-500 leading-normal mt-1 font-semibold">Exposición simultánea en todos los portales inmobiliarios líderes del Perú.</p>
                    </div>

                    <div className="p-3 border border-gray-medium rounded-sm bg-white">
                      <Video size={16} className="text-brand-black mb-2" />
                      <h4 className="text-xs font-black uppercase tracking-wide text-brand-black">PRODUCCIÓN AUDIOVISUAL</h4>
                      <p className="text-[10px] text-gray-500 leading-normal mt-1 font-semibold">producción audiovisual especializada y profesional, seguimiento y remarketing.</p>
                    </div>

                    <div className="p-3 border border-gray-medium rounded-sm bg-white">
                      <Target size={16} className="text-brand-black mb-2" />
                      <h4 className="text-xs font-black uppercase tracking-wide text-brand-black">CAMPAÑAS PUBLICITARIAS</h4>
                      <p className="text-[10px] text-gray-500 leading-normal mt-1 font-semibold">segmetacion y campañas publicitarias</p>
                    </div>
                  </div>

                  <button 
                    onClick={() => goTo('quiz_step_3')}
                    className="btn-geometric-primary w-full flex items-center justify-center gap-4 py-3 sm:py-3.5"
                  >
                    CONTINUAR
                    <ArrowRight size={14} />
                  </button>
                </motion.div>
              )}


              {/* --- STAGE 4: FUERZA COMERCIAL --- */}
              {currentStep === 'fuerza_comercial' && (
                <motion.div 
                  key="fuerza_comercial"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex-1 flex flex-col p-4 sm:p-6 md:p-8 container max-w-xl mx-auto justify-center"
                >
                  <div className="flex items-center justify-between mb-4">
                    <button onClick={goBack} className="p-1.5 hover:bg-gray-light rounded-full transition-colors text-gray-400 hover:text-brand-black">
                      <ArrowLeft size={16} />
                    </button>
                    <span className="text-[10px] font-extrabold uppercase tracking-wide text-zinc-400 font-mono">// EL EQUIPO</span>
                    <div className="w-8"></div>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-black text-left leading-tight mb-4">
                    Tu propiedad no la promueve una persona. La promueve un equipo.
                  </h2>

                  {/* Overlapping interactive avatar representations mimicking screenshot +43 indicator */}
                  <div className="flex items-center gap-3 bg-gray-light p-4 rounded-sm border border-gray-medium/80 mb-5">
                    <div className="flex -space-x-2.5 overflow-hidden">
                      {['M', 'S', 'B', 'H', 'R', 'P'].map((initial, i) => (
                        <div 
                          key={i} 
                          className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-[9px] font-black bg-zinc-900 text-brand-gold font-sans shadow-sm ring-1 ring-zinc-200`}
                        >
                          {initial}
                        </div>
                      ))}
                      <div className="w-8 h-8 rounded-full bg-brand-gold text-brand-black border-2 border-white flex items-center justify-center text-[9px] font-black shadow-sm ring-1 ring-zinc-200">
                        +43
                      </div>
                    </div>
                    <div className="text-left">
                      <span className="text-[8.5px] uppercase tracking-wider text-gray-400 font-bold block leading-none">Agentes Activos</span>
                      <span className="text-[11px] font-extrabold text-brand-black">Sinergia comercial constante en Lima</span>
                    </div>
                  </div>

                  <div className="space-y-4 text-left mb-6 font-sans">
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-brand-gold/20 flex items-center justify-center mt-0.5 shrink-0">
                        <div className="w-2 h-2 bg-brand-gold rounded-full" />
                      </div>
                      <div>
                        <p className="text-xs font-extrabold text-brand-black uppercase tracking-wider">Red colaborativa de +10mil agentes</p>
                        <p className="text-[10px] text-gray-500 mt-0.5 leading-normal">gracias a nuestro modelo de exclusividad compartida que maximiza la visibilidad de tu propiedad</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-brand-gold/20 flex items-center justify-center mt-0.5 shrink-0">
                        <div className="w-2 h-2 bg-brand-gold rounded-full" />
                      </div>
                      <div>
                        <p className="text-xs font-extrabold text-brand-black uppercase tracking-wider">Visitas calificadas, sin perder tu tiempo</p>
                        <p className="text-[10px] text-gray-500 mt-0.5 leading-normal">Filtramos rigurosamente a los interesados antes de programar una visita, evitando curiosos no calificados.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-brand-gold/20 flex items-center justify-center mt-0.5 shrink-0">
                        <div className="w-2 h-2 bg-brand-gold rounded-full" />
                      </div>
                      <div>
                        <p className="text-xs font-extrabold text-brand-black uppercase tracking-wider">seguimiento constante a clientes interesados</p>
                        <p className="text-[10px] text-gray-500 mt-0.5 leading-normal">que quedan registrados en una base de datos para hacer remarketing con IA</p>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => goTo('quiz_step_5')}
                    className="btn-geometric-primary w-full flex items-center justify-center gap-4 py-3 sm:py-3.5"
                  >
                    CONTINUAR
                    <ArrowRight size={14} />
                  </button>
                </motion.div>
              )}


              {/* --- STAGE 5: ANÁLISIS DE MERCADO / ACM CURVE --- */}
              {currentStep === 'analisis_mercado' && (
                <motion.div 
                  key="analisis_mercado"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex-1 flex flex-col p-4 sm:p-6 md:p-8 container max-w-xl mx-auto justify-center text-left"
                >
                  <div className="flex items-center justify-between mb-4">
                    <button onClick={goBack} className="p-1.5 hover:bg-gray-light rounded-full transition-colors text-gray-400 hover:text-brand-black">
                      <ArrowLeft size={16} />
                    </button>
                    <span className="text-[10px] font-extrabold uppercase tracking-wide text-zinc-400 font-mono">// ESTRATEGIA</span>
                    <div className="w-8"></div>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-black leading-tight mb-2">
                    Antes de fijar un precio, analizamos el mercado.
                  </h2>
                  <p className="text-gray-500 text-[11px] leading-relaxed mb-6 font-sans">
                    Utilizamos un Análisis Comparativo de Mercado (ACM) estructurado para evitar que tu propiedad quede estancada o se venda por debajo de su valor real.
                  </p>

                  {/* PREMIUM SVG BELL CURVE CHART ("Punto de equilibrio") */}
                  <div className="bg-gray-light p-4 rounded-sm border border-gray-medium/80 relative mb-5 flex flex-col items-center justify-center">
                    <span className="text-[7.5px] font-mono tracking-widest text-gray-400 absolute top-2 right-3 uppercase font-extrabold">Algoritmo de Posicionamiento v2.0</span>
                    
                    <svg viewBox="0 0 400 180" className="w-full h-24 sm:h-28 font-sans mt-2">
                      <defs>
                        <linearGradient id="curveGradient" x1="0%" y1="100%" x2="0%" y2="0%">
                          <stop offset="0%" stopColor="#fff" stopOpacity={0.1} />
                          <stop offset="100%" stopColor="#ffed51" stopOpacity={0.35} />
                        </linearGradient>
                      </defs>

                      {/* Equilibrium Area Fill */}
                      <path 
                        d="M 40,150 C 120,150 140,30 200,30 C 260,30 280,150 360,150 Z" 
                        fill="url(#curveGradient)" 
                      />

                      {/* Base axis */}
                      <line x1="20" y1="150" x2="380" y2="150" stroke="#CCCCCC" strokeWidth="1.5" strokeLinecap="round" />

                      {/* Main elegant bell curve */}
                      <path 
                        d="M 40,150 C 120,150 140,30 200,30 C 260,30 280,150 360,150" 
                        fill="none" 
                        stroke="#111111" 
                        strokeWidth="3.5" 
                        strokeLinecap="round" 
                      />

                      {/* Dashed vertical lines indicating zones */}
                      <line x1="200" y1="30" x2="200" y2="150" stroke="#111111" strokeWidth="1" strokeDasharray="3,3" />
                      <line x1="120" y1="100" x2="120" y2="150" stroke="#CCCCCC" strokeWidth="1" strokeDasharray="3,3" />
                      <line x1="280" y1="100" x2="280" y2="150" stroke="#CCCCCC" strokeWidth="1" strokeDasharray="3,3" strokeOpacity={0.5} />

                      {/* Equilibrium Glowing Dot */}
                      <circle cx="200" cy="30" r="7" fill="#111111" className="animate-pulse" />
                      <circle cx="200" cy="30" r="3.5" fill="#ffed51" />
                    </svg>

                    {/* Chart legends matching the references */}
                    <div className="grid grid-cols-3 w-full text-center mt-3.5 text-[8.5px] uppercase tracking-wider font-extrabold font-mono">
                      <div className="text-gray-400">
                        <p>📉 Barato</p>
                        <p className="text-[7.5px] font-normal text-gray-400 lowercase italic">pierdes rentabilidad</p>
                      </div>
                      <div className="text-zinc-900 border-x border-gray-medium/80 px-1 bg-brand-gold/15">
                        <p>✨ Equilibrio</p>
                        <p className="text-[7.5px] font-normal text-gray-500 lowercase italic">precio ideal</p>
                      </div>
                      <div className="text-rose-500">
                        <p>📈 Muy Caro</p>
                        <p className="text-[7.5px] font-normal text-gray-400 lowercase italic">sin llamadas ni visitas</p>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-500 text-[11px] text-justify leading-relaxed mb-6 italic border-l-2 border-brand-gold pl-3 font-medium">
                    "Identificamos la ventana de oportunidad exacta donde el valor percibido del cliente se intersecta con la máxima rentabilidad para ti."
                  </p>

                  <button 
                    onClick={() => goTo('quiz_step_4')}
                    className="btn-geometric-primary w-full flex items-center justify-center gap-4 py-3 sm:py-3.5"
                  >
                    CONTINUAR
                    <ArrowRight size={14} />
                  </button>
                </motion.div>
              )}


              {/* --- QUIZ STEP 1: INTENCIÓN --- */}
              {currentStep === 'quiz_step_1' && (
                <motion.div 
                  key="quiz_step_1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex-1 flex flex-col p-4 sm:p-6 md:p-8 container max-w-lg mx-auto justify-center text-left"
                >
                  <div className="flex justify-between items-center mb-6">
                    <button onClick={goBack} className="p-1.5 hover:bg-gray-light rounded-full transition-colors text-gray-400 hover:text-brand-black">
                      <ArrowLeft size={16} />
                    </button>
                    <div className="w-8"></div>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-black mb-6 text-brand-black">¿Qué deseas hacer con tu propiedad?</h2>

                  <div className="space-y-3 w-full">
                    <button 
                      onClick={() => {
                        handleIntentionChange('Vender');
                        goTo('quiz_step_2');
                      }} 
                      className={`w-full py-4 px-5 border text-left flex items-center justify-between transition-all duration-300 rounded-sm hover:border-brand-black cursor-pointer bg-white group ${quizData.intention === 'Vender' ? 'border-brand-black bg-gray-light ring-1 ring-brand-black font-black' : 'border-gray-medium'}`}
                    >
                      <span className="text-xs uppercase tracking-wider font-extrabold text-brand-black">Vender</span>
                      <div className="w-4 h-4 rounded-full border border-gray-medium flex items-center justify-center">
                        {quizData.intention === 'Vender' && <div className="w-2 h-2 bg-brand-gold rounded-full" />}
                      </div>
                    </button>

                    <button 
                      onClick={() => {
                        handleIntentionChange('Alquilar');
                        goTo('quiz_step_2');
                      }} 
                      className={`w-full py-4 px-5 border text-left flex items-center justify-between transition-all duration-300 rounded-sm hover:border-brand-black cursor-pointer bg-white group ${quizData.intention === 'Alquilar' ? 'border-brand-black bg-gray-light ring-1 ring-brand-black font-black' : 'border-gray-medium'}`}
                    >
                      <span className="text-xs uppercase tracking-wider font-extrabold text-brand-black">Alquilar</span>
                      <div className="w-4 h-4 rounded-full border border-gray-medium flex items-center justify-center">
                        {quizData.intention === 'Alquilar' && <div className="w-2 h-2 bg-brand-gold rounded-full" />}
                      </div>
                    </button>

                    <button 
                      onClick={() => {
                        handleIntentionChange('Valuar');
                        goTo('quiz_step_2');
                      }} 
                      className={`w-full py-4 px-5 border text-left flex items-center justify-between transition-all duration-300 rounded-sm hover:border-brand-black cursor-pointer bg-white group ${quizData.intention === 'Valuar' ? 'border-brand-black bg-gray-light ring-1 ring-brand-black font-black' : 'border-gray-medium'}`}
                    >
                      <span className="text-xs uppercase tracking-wider font-extrabold text-brand-black">Solo quiero valuarla</span>
                      <div className="w-4 h-4 rounded-full border border-gray-medium flex items-center justify-center">
                        {quizData.intention === 'Valuar' && <div className="w-2 h-2 bg-brand-gold rounded-full" />}
                      </div>
                    </button>
                  </div>
                </motion.div>
              )}


              {/* --- QUIZ STEP 2: TIPO DE PROPIEDAD --- */}
              {currentStep === 'quiz_step_2' && (
                <motion.div 
                  key="quiz_step_2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex-1 flex flex-col p-4 sm:p-6 md:p-8 container max-w-xl mx-auto justify-center text-left"
                >
                  <div className="flex justify-between items-center mb-6">
                    <button onClick={goBack} className="p-1.5 hover:bg-gray-light rounded-full transition-colors text-gray-400 hover:text-brand-black">
                      <ArrowLeft size={16} />
                    </button>
                    <div className="w-8"></div>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-black mb-6 text-brand-black">¿Qué tipo de propiedad es?</h2>

                  <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-5 gap-2.5">
                    {[
                      { type: 'Departamento', icon: Building2 },
                      { type: 'Casa', icon: Home },
                      { type: 'Oficina', icon: Briefcase },
                      { type: 'Terreno', icon: MapIcon },
                      { type: 'Otro', icon: Layers }
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <button 
                          key={item.type}
                          onClick={() => {
                            setQuizData(prev => ({ ...prev, type: item.type as PropertyType }));
                            goTo('alcance_digital');
                          }}
                          className={`border p-4 flex flex-col items-center justify-center gap-2 rounded-sm transition-all duration-300 hover:border-brand-black cursor-pointer bg-white ${quizData.type === item.type ? 'border-brand-black bg-gray-light ring-1 ring-brand-black font-black' : 'border-gray-medium'}`}
                        >
                          <div className="w-8 h-8 rounded-full border border-gray-medium/60 flex items-center justify-center shrink-0">
                            <Icon size={14} className="text-brand-black" />
                          </div>
                          <span className="text-[10px] font-extrabold uppercase tracking-wide text-brand-black">{item.type}</span>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}


              {/* --- QUIZ STEP 3: UBICACIÓN Y DISTRITO --- */}
              {currentStep === 'quiz_step_3' && (
                <motion.div 
                  key="quiz_step_3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex-1 flex flex-col p-4 sm:p-6 md:p-8 container max-w-xl mx-auto text-left justify-center"
                >
                  <div className="flex justify-between items-center mb-6">
                    <button onClick={goBack} className="p-1.5 hover:bg-gray-light rounded-full transition-colors text-gray-400 hover:text-brand-black">
                      <ArrowLeft size={16} />
                    </button>
                    <div className="w-8"></div>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-black mb-6 text-brand-black">¿En qué distrito se encuentra?</h2>

                  <div className="space-y-4 font-sans">
                    {/* Input box for writing directly */}
                    <div className="bg-gray-light p-4 rounded-sm border border-gray-medium/60">
                      <label className="text-[9px] font-mono tracking-widest font-extrabold uppercase text-gray-400 block mb-2">// Escribe tu distrito directamente</label>
                      <input 
                        type="text"
                        value={quizData.district || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setQuizData(prev => ({
                            ...prev,
                            district: val,
                            address: val
                          }));
                        }}
                        placeholder="Nombre de tu distrito..."
                        className="w-full bg-white border border-gray-medium focus:border-brand-black px-4 py-3 text-xs font-black uppercase text-brand-black focus:outline-none rounded-sm font-mono tracking-wider focus:ring-1 focus:ring-brand-black"
                      />
                    </div>

                    {/* Quick select grid */}
                    <div>
                      <p className="text-[9px] uppercase font-mono tracking-widest font-bold text-gray-400 mb-2.5">// O selecciona de Lima Top & Lima Moderna:</p>
                      <div className="grid grid-cols-2 xs:grid-cols-3 gap-2 max-h-[185px] overflow-y-auto pr-1 no-scrollbar border-b border-gray-light pb-2">
                        {PREMIUM_DISTRICTS.filter(d => d !== 'Otro distrito').map((d) => {
                          const isSelected = !!quizData.district && quizData.district.toLowerCase() === d.toLowerCase();
                          return (
                            <button
                              type="button"
                              key={d}
                              onClick={() => {
                                setQuizData(prev => ({
                                  ...prev,
                                  district: d,
                                  address: d
                                }));
                              }}
                              className={`py-2.5 px-2 border text-center rounded-sm transition-all duration-200 text-[10px] font-extrabold uppercase tracking-wide cursor-pointer bg-white hover:border-brand-black ${
                                isSelected 
                                  ? 'border-brand-black bg-gray-light ring-1 ring-brand-black font-black text-brand-black' 
                                  : 'border-gray-medium text-gray-500'
                              }`}
                            >
                              {d}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="pt-2">
                      <button 
                        disabled={!quizData.district || !quizData.district.trim()}
                        onClick={() => goTo('fuerza_comercial')}
                        className="btn-geometric-primary w-full flex items-center justify-center gap-4 py-3 sm:py-3.5 disabled:opacity-30 disabled:pointer-events-none"
                      >
                        CONTINUAR
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}


              {/* --- QUIZ STEP 4: EXPECTATIVA ECONÓMICA WITH SLIDER --- */}
              {currentStep === 'quiz_step_4' && (
                <motion.div 
                  key="quiz_step_4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex-1 flex flex-col p-4 sm:p-6 md:p-8 container max-w-xl mx-auto justify-center text-left"
                >
                  <div className="flex justify-between items-center mb-6">
                    <button onClick={goBack} className="p-1.5 hover:bg-gray-light rounded-full transition-colors text-gray-400 hover:text-brand-black">
                      <ArrowLeft size={16} />
                    </button>
                    <div className="w-8"></div>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-black mb-1.5 text-brand-black">¿Cuál es tu expectativa económica?</h2>
                  <p className="text-gray-400 mb-6 text-[11px]">
                    {quizData.intention === 'Alquilar' ? '¿Cuánto esperas obtener por la renta?' : '¿Cuánto esperas obtener por la venta?'}
                  </p>

                  <div className="space-y-4">
                    {/* Dollar/Sol Selection Tabs */}
                    <div className="flex justify-center">
                      <div className="flex bg-gray-light p-0.5 rounded-sm border border-gray-medium">
                        <button 
                          onClick={() => handleCurrencyChange('USD')}
                          className={`px-4 py-1.5 text-[9px] font-extrabold uppercase tracking-widest transition-all ${quizData.currency === 'USD' ? 'bg-brand-gold text-brand-black shadow-sm' : 'text-gray-400 hover:text-brand-black'}`}
                        >
                          DÓLARES (US$)
                        </button>
                        <button 
                          onClick={() => handleCurrencyChange('PEN')}
                          className={`px-4 py-1.5 text-[9px] font-extrabold uppercase tracking-widest transition-all ${quizData.currency === 'PEN' ? 'bg-brand-gold text-brand-black shadow-sm' : 'text-gray-400 hover:text-brand-black'}`}
                        >
                          SOLES (S/)
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {/* Fully Custom responsive Range Slider matching design reference (placed ABOVE the price input) */}
                      <div className="space-y-2 pb-1 bg-gray-light/50 p-3 rounded-sm border border-gray-medium/40">
                        {/* Slide explanation graphic helper representing drag capability */}
                        <div className="flex items-center gap-2 justify-center py-1.5 px-3 bg-zinc-900 border border-brand-gold/20 rounded-sm select-none">
                          <svg width="18" height="10" viewBox="0 0 24 12" className="animate-pulse shrink-0">
                            <path d="M4 6H20M4 6L8 2M4 6L8 10M20 6L16 2M20 6L16 10" stroke="#ffed51" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <span className="text-[9px] font-black uppercase tracking-wider text-brand-gold font-mono leading-none">
                            BARRA INTERACTIVA · DESLIZA PARA AJUSTAR
                          </span>
                        </div>

                        <div className="relative w-full h-2.5 bg-gray-light rounded-full border border-gray-medium mt-3 mb-1">
                          {/* Active filled track */}
                          <div 
                            className="absolute top-0 left-0 h-full bg-brand-black rounded-full"
                            style={{ width: `${sliderPercentage}%` }}
                          />
                          {/* Real slider thumb controller overlay */}
                          <input 
                            type="range"
                            min={sliderParams.min}
                            max={sliderParams.max}
                            step={sliderParams.step}
                            value={quizData.value || sliderParams.min}
                            onChange={(e) => setQuizData(prev => ({ ...prev, value: e.target.value }))}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          />
                          {/* Visible handle thumb */}
                          <div 
                            className="absolute top-1/2 -mt-2 w-4 h-4 bg-brand-gold border-2 border-brand-black rounded-full shadow-md pointer-events-none transform -translate-x-1/2 flex items-center justify-center"
                            style={{ left: `${sliderPercentage}%` }}
                          >
                            <div className="w-1.5 h-1.5 bg-brand-black rounded-full" />
                          </div>
                        </div>

                        <div className="flex justify-between text-[8px] text-gray-500 font-mono font-extrabold">
                          <span>{quizData.currency === 'USD' ? 'US$' : 'S/'} {Number(sliderParams.min).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</span>
                          <span>{quizData.currency === 'USD' ? 'US$' : 'S/'} {Number(sliderParams.max).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</span>
                        </div>
                      </div>

                      {/* Price reader display input block (placed BELOW physical slider) */}
                      <div className="space-y-2">
                        <div className="bg-gray-light border border-gray-medium p-3 rounded-sm flex items-center justify-between shadow-inner">
                          <span className="text-base font-black text-gray-400 uppercase tracking-wider font-mono mr-4 shrink-0 select-none">
                            {quizData.currency === 'USD' ? 'US$' : 'S/'}
                          </span>
                          
                          <input 
                            type="text"
                            value={formatValueWithDots(quizData.value)}
                            onChange={(e) => {
                              const rawNum = e.target.value.replace(/\D/g, '');
                              setQuizData(prev => ({ ...prev, value: rawNum }));
                            }}
                            className="w-full bg-transparent text-right text-xl font-black focus:outline-none text-brand-black font-mono"
                            placeholder="000.000"
                          />
                        </div>

                        {quizData.value && (
                          <div className="flex justify-between items-center px-2.5 bg-zinc-900 text-brand-gold text-[10px] font-black py-1.5 rounded-sm shadow-sm select-none">
                            <span className="uppercase font-mono tracking-widest text-[8px] text-zinc-400">EXPECTATIVA DE {quizData.intention === 'Alquilar' ? 'RENTA' : 'VENTA'}:</span>
                            <span className="font-mono text-xs sm:text-sm">
                              {quizData.currency === 'USD' ? 'US$' : 'S/'} {Number(quizData.value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Dynamic Strategy Feedback Card */}
                      {(() => {
                        const val = Number(quizData.value) || 0;
                        const isUSD = quizData.currency === 'USD';
                        const isVender = quizData.intention === 'Vender';
                        let strategy = {
                          title: "💡 Estimación Inicial",
                          desc: "Mueve el control para ver la estrategia óptima de marketing y análisis digital recomendada por Honne."
                        };

                        if (val > 0) {
                          if (isVender) {
                            if (isUSD) {
                              if (val < 150000) {
                                strategy = {
                                  title: "⚡ Segmento de Alta Liquidez",
                                  desc: "Propiedades con rotación sumamente veloz. Perfecto para captar compradores aptos con crédito aprobado rápido."
                                };
                              } else if (val <= 450000) {
                                strategy = {
                                  title: "📊 Segmento Residencial Premium",
                                  desc: "Mercado intermedio altamente competitivo. Destacaremos tu propiedad con Home Staging digital y video con drones."
                                };
                              } else {
                                strategy = {
                                  title: "💎 Segmento Luxury Exclusive",
                                  desc: "Elite inmobiliaria. Activaremos relaciones directas corporativas y pautas segmentadas para perfiles A1."
                                };
                              }
                            } else {
                              if (val < 550000) {
                                strategy = {
                                  title: "⚡ Segmento de Alta Liquidez S/",
                                  desc: "Demanda activa inmediata en Lima. Venta ágil recomendada aplicando tácticas express."
                                };
                              } else if (val <= 1650000) {
                                strategy = {
                                  title: "📊 Segmento Residencial Premium S/",
                                  desc: "Ideal para captar familias de alto nivel. Exposición extendida en portales de elite."
                                };
                              } else {
                                strategy = {
                                  title: "💎 Segmento Luxury Exclusive S/",
                                  desc: "Segmento de alta alcurnia. Pauta selectiva y producción audiovisual premium de primer orden."
                                };
                              }
                            }
                          } else {
                            if (isUSD) {
                              if (val < 1200) {
                                strategy = {
                                  title: "🏢 Alquiler Residencial Express",
                                  desc: "Alta velocidad de ocupación. Aplicaremos filtros de riesgo digital sumamente rigurosos para tu tranquilidad."
                                };
                              } else {
                                strategy = {
                                  title: "💼 Alquiler Corporativo & Elite",
                                  desc: "Perfil de embajadas, multinacionales y directores. Conexión directa a redes cerradas de reubicación."
                                };
                              }
                            } else {
                              if (val < 4200) {
                                strategy = {
                                  title: "🏢 Alquiler Residencial Express S/",
                                  desc: "Arrendamiento veloz. Evaluamos antecedentes crediticios en tiempo real para inquilinos 100% seguros."
                                };
                              } else {
                                strategy = {
                                  title: "💼 Alquiler Corporativo & Elite S/",
                                  desc: "Networking premium. Ideal para ejecutivos senior o expatriados con respaldo corporativo directo."
                                };
                              }
                            }
                          }
                        }

                        return (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            key={strategy.title}
                            className="bg-brand-gold/10 border border-brand-gold/30 p-3 rounded-sm text-left mt-3"
                          >
                            <div className="flex items-center gap-1.5 text-zinc-900 mb-0.5 font-bold text-[10px] uppercase tracking-wide">
                              <Sparkles size={11} className="text-brand-gold fill-brand-gold shrink-0 animate-pulse" />
                              {strategy.title}
                            </div>
                            <p className="text-[9.5px] text-zinc-650 leading-relaxed font-semibold">
                              {strategy.desc}
                            </p>
                          </motion.div>
                        );
                      })()}

                      <p className="text-[9px] text-gray-400 text-center italic mt-1.5">
                        Puedes ajustarlo directamente escribiendo o moviendo la barra.
                      </p>
                    </div>

                    <div className="pt-2">
                      <button 
                        disabled={!quizData.value || Number(quizData.value) <= 0}
                        onClick={() => goTo('quiz_step_6')}
                        className="btn-geometric-primary w-full flex items-center justify-center gap-4 py-3 disabled:opacity-30 disabled:pointer-events-none"
                      >
                        CONTINUAR
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}


              {/* --- QUIZ STEP 5: TIMELINE --- */}
              {currentStep === 'quiz_step_5' && (
                <motion.div 
                  key="quiz_step_5"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex-1 flex flex-col p-4 sm:p-6 md:p-8 container max-w-lg mx-auto justify-center text-left"
                >
                  <div className="flex justify-between items-center mb-6">
                    <button onClick={goBack} className="p-1.5 hover:bg-gray-light rounded-full transition-colors text-gray-400 hover:text-brand-black">
                      <ArrowLeft size={16} />
                    </button>
                    <div className="w-8"></div>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-black mb-6 text-brand-black">
                    ¿En cuánto tiempo te gustaría vender?
                  </h2>

                  <div className="space-y-3">
                    {[
                      'Lo antes posible',
                      'En 1 - 3 meses',
                      'En 3 - 6 meses',
                      'Solo estoy explorando'
                    ].map((item) => (
                      <button 
                        key={item}
                        onClick={() => {
                          setQuizData(prev => ({ ...prev, timeline: item }));
                          goTo('analisis_mercado');
                        }}
                        className={`w-full py-4 px-5 border text-left flex items-center justify-between transition-all duration-300 rounded-sm hover:border-brand-black cursor-pointer bg-white group ${quizData.timeline === item ? 'border-brand-black bg-gray-light ring-1 ring-brand-black font-black' : 'border-gray-medium'}`}
                      >
                        <span className="text-xs uppercase tracking-wide font-extrabold text-brand-black">{item}</span>
                        <div className="w-4 h-4 rounded-full border border-gray-medium flex items-center justify-center">
                          {quizData.timeline === item && <div className="w-2 h-2 bg-brand-gold rounded-full" />}
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}


              {/* --- QUIZ STEP 6: HISTORIAL --- */}
              {currentStep === 'quiz_step_6' && (
                <motion.div 
                  key="quiz_step_6"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex-1 flex flex-col p-4 sm:p-6 md:p-8 container max-w-lg mx-auto justify-center text-left"
                >
                  <div className="flex justify-between items-center mb-6">
                    <button onClick={goBack} className="p-1.5 hover:bg-gray-light rounded-full transition-colors text-gray-400 hover:text-brand-black">
                      <ArrowLeft size={16} />
                    </button>
                    <div className="w-8"></div>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-black mb-6 text-brand-black">
                    Actualmente, ¿cómo estás gestionando la venta de tu propiedad?
                  </h2>

                  <div className="space-y-3">
                    {[
                      'Aún no la estoy ofreciendo',
                      'La estoy ofreciendo por mi cuenta',
                      'La estoy trabajando con un agente inmobiliario'
                    ].map((item) => (
                      <button 
                        key={item}
                        onClick={() => {
                          setQuizData(prev => ({ ...prev, attempted: item }));
                          goTo('contacto');
                        }}
                        className={`w-full py-4 px-5 border text-left flex items-center justify-between transition-all duration-300 rounded-sm hover:border-brand-black cursor-pointer bg-white group ${quizData.attempted === item ? 'border-brand-black bg-gray-light ring-1 ring-brand-black font-black' : 'border-gray-medium'}`}
                      >
                        <span className="text-xs uppercase tracking-wide font-extrabold text-brand-black">{item}</span>
                        <div className="w-4 h-4 rounded-full border border-gray-medium flex items-center justify-center">
                          {quizData.attempted === item && <div className="w-2 h-2 bg-brand-gold rounded-full" />}
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}


              {/* --- DATOS DE CONTACTO: ÚLTIMO PASO --- */}
              {currentStep === 'contacto' && (
                <motion.div 
                  key="contacto"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex-1 flex flex-col p-4 sm:p-6 container max-w-lg mx-auto text-left justify-center"
                >
                  <div className="flex justify-between items-center mb-4">
                    <button onClick={goBack} className="p-1.5 hover:bg-gray-light rounded-full transition-colors text-gray-400 hover:text-brand-black">
                      <ArrowLeft size={16} />
                    </button>
                    <span className="text-[8px] font-extrabold uppercase tracking-[0.2em] text-zinc-400">ÚLTIMO PASO</span>
                    <div className="w-8"></div>
                  </div>

                  <h2 className="text-base sm:text-lg md:text-xl font-black mb-1 text-center text-brand-black">¿Te gustaría que revisemos tu caso?</h2>
                  <p className="text-gray-400 mb-4 text-center text-[11px]">
                    Déjanos tus datos y un especialista de Honne se pondrá en contacto contigo de inmediato.
                  </p>

                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      // Fire Meta Pixel conversion event
                      if (typeof window !== 'undefined' && (window as any).fbq) {
                        try {
                          (window as any).fbq('track', 'Lead');
                          (window as any).fbq('track', 'ClientePotencial');
                        } catch (err) {
                          console.error("Meta Pixel tracking error:", err);
                        }
                      }
                      goTo('processing');
                    }} 
                    className="space-y-3"
                  >
                    {/* Full Name */}
                    <div className="space-y-1">
                      <label className="text-[8px] uppercase tracking-widest font-extrabold text-gray-400">Nombre y Apellidos</label>
                      <div className="relative flex items-center bg-gray-light border border-gray-medium focus-within:border-brand-black rounded-sm transition-all">
                        <input 
                          required
                          type="text" 
                          value={quizData.name}
                          onChange={(e) => setQuizData(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Tu nombre completo..."
                          className="w-full bg-transparent px-4 py-3 text-xs font-semibold focus:outline-none pr-10 text-brand-black"
                        />
                        <User size={14} className="absolute right-4 text-gray-400" />
                      </div>
                    </div>

                    {/* WhatsApp */}
                    <div className="space-y-1">
                      <label className="text-[8px] uppercase tracking-widest font-extrabold text-gray-400">WhatsApp / Teléfono</label>
                      <div className="relative flex items-center bg-gray-light border border-gray-medium focus-within:border-brand-black rounded-sm transition-all">
                        <input 
                          required
                          type="tel" 
                          value={quizData.phone}
                          onChange={(e) => setQuizData(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="Tu número de contacto..."
                          className="w-full bg-transparent px-4 py-3 text-xs font-semibold focus:outline-none pr-10 text-brand-black"
                        />
                        <Phone size={14} className="absolute right-4 text-gray-400" />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-1">
                      <label className="text-[8px] uppercase tracking-widest font-extrabold text-gray-400">Correo electrónico (opcional)</label>
                      <div className="relative flex items-center bg-gray-light border border-gray-medium focus-within:border-brand-black rounded-sm transition-all">
                        <input 
                          type="email" 
                          value={quizData.email}
                          onChange={(e) => setQuizData(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="ejemplo@correo.com"
                          className="w-full bg-transparent px-4 py-3 text-xs font-semibold focus:outline-none pr-10 text-brand-black"
                        />
                        <Mail size={14} className="absolute right-4 text-gray-400" />
                      </div>
                    </div>

                    {/* Policy checkbox preselected */}
                    <div className="flex items-start gap-2 pt-1">
                      <input 
                        required
                        type="checkbox" 
                        id="accept-terms"
                        checked={quizData.acceptTerms}
                        onChange={(e) => setQuizData(prev => ({ ...prev, acceptTerms: e.target.checked }))}
                        className="w-3.5 h-3.5 accent-brand-gold mt-0.5 shrink-0 cursor-pointer"
                      />
                      <label htmlFor="accept-terms" className="text-[9px] text-gray-400 font-semibold select-none cursor-pointer leading-tight mb-3">
                        Acepto la <span className="underline text-brand-black">política de privacidad</span> y el <span className="underline text-brand-black">tratamiento de datos</span>.
                      </label>
                    </div>

                    <button 
                      type="submit"
                      disabled={!quizData.name || !quizData.phone || !quizData.acceptTerms}
                      className="w-full bg-green-500 hover:bg-green-600 active:scale-[0.99] disabled:bg-gray-400 text-white font-extrabold py-3.5 px-6 rounded-sm flex items-center justify-center gap-3 transition-all uppercase tracking-widest text-[10px] shadow-md shadow-green-500/10 cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
                    >
                      <Phone size={13} fill="currentColor" />
                      ENVIAR POR WHATSAPP
                      <ArrowRight size={13} />
                    </button>
                    <p className="text-[9px] text-zinc-400 text-center font-medium mt-1">
                      ⚠️ Al presionar, ingresarás a la pantalla de redirección y se abrirá tu chat de WhatsApp automáticamente.
                    </p>
                  </form>
                </motion.div>
              )}


              {/* --- STAGE 13: INTERACTIVE REDIRECTION INTERLUDE --- */}
              {currentStep === 'processing' && (
                <motion.div 
                  key="processing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 flex flex-col p-6 text-center justify-center max-w-lg mx-auto"
                >
                  <div className="relative mb-8 flex flex-col items-center">
                    {/* Concentric engaging glowing spinner */}
                    <div className="relative w-24 h-24 mb-6">
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        className="absolute inset-0 border-4 border-gray-lighter border-t-green-500 rounded-full"
                      />
                      <motion.div 
                        animate={{ rotate: -360 }}
                        transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                        className="absolute inset-2 border-2 border-gray-light border-b-brand-gold rounded-full opacity-70"
                      />
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-lg font-black font-mono text-brand-black">{redirectProgress}%</span>
                        <span className="text-[8px] uppercase tracking-wider text-green-600 font-extrabold animate-pulse">POSTING</span>
                      </div>
                    </div>

                    {/* Progress Bar Container */}
                    <div className="w-full bg-gray-light h-1.5 rounded-full overflow-hidden mb-6 border border-gray-medium/40">
                      <motion.div 
                        className="h-full bg-green-500 origin-left"
                        animate={{ width: `${redirectProgress}%` }}
                        transition={{ duration: 0.1 }}
                      />
                    </div>
                  </div>
                  
                  {/* Dynamic engaging micro-steps to hook the lead */}
                  <div className="bg-gray-light/60 border border-gray-medium/40 p-4.5 rounded-sm text-left space-y-2 mb-6 shadow-inner">
                    <p className="text-[9px] uppercase tracking-widest text-zinc-400 font-monobold font-bold mb-1 border-b border-gray-medium/50 pb-1">Análisis de Viabilidad Honne</p>
                    
                    <div className="flex items-center gap-2 text-xs">
                      <CheckCircle2 size={13} className={redirectProgress >= 20 ? "text-green-500" : "text-gray-300"} />
                      <span className={`text-[11px] font-semibold ${redirectProgress >= 20 ? "text-brand-black" : "text-gray-400"}`}>
                        Sincronizando información de {quizData.name || 'tu propiedad'}...
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <CheckCircle2 size={13} className={redirectProgress >= 55 ? "text-green-500" : "text-gray-300"} />
                      <span className={`text-[11px] font-semibold ${redirectProgress >= 55 ? "text-brand-black" : "text-gray-400"}`}>
                        Estableciendo modelo de equilibrio en {quizData.district || 'Lima'}...
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <CheckCircle2 size={13} className={redirectProgress >= 85 ? "text-green-500" : "text-gray-300"} />
                      <span className={`text-[11px] font-semibold ${redirectProgress >= 85 ? "text-brand-black" : "text-gray-400"}`}>
                        Inyectando diagnóstico a sistema express Honne...
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <Loader2 size={13} className={`animate-spin ${redirectProgress >= 95 ? "text-green-500" : "text-gray-400"}`} />
                      <span className={`text-[11px] font-extrabold uppercase ${redirectProgress >= 95 ? "text-green-600" : "text-gray-450"}`}>
                        {redirectProgress === 100 ? "Redirigiendo de inmediato a WhatsApp..." : "Preparando desvío seguro de datos..."}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-base font-black mb-1.5 tracking-tight text-brand-black uppercase">
                    Redirigiéndote a WhatsApp...
                  </h3>
                  
                  <p className="text-[11px] text-zinc-500 font-medium max-w-sm mx-auto leading-relaxed mb-4">
                    Estamos abriendo tu ventana de comunicación directa. En caso de que no se abra automáticamente, toca el botón verde para asegurar tu prioridad.
                  </p>

                  {/* Fallback & Acceleration Button */}
                  <a 
                    href={getWhatsAppLink()}
                    className="w-full py-3 sm:py-3.5 bg-green-500 hover:bg-green-600 font-extrabold uppercase tracking-widest text-[10px] text-white flex items-center justify-center gap-2 transition-all text-center shadow-md shadow-green-500/10 cursor-pointer rounded-sm"
                  >
                    <Phone size={13} fill="currentColor" />
                    IR DIRECTO A WHATSAPP EXPRESS
                  </a>
                </motion.div>
              )}


              {/* --- STAGE 13 FINAL: CONFIRMACIÓN & OPCIÓN WHATSAPP --- */}
              {currentStep === 'confirmacion' && (
                <motion.div 
                  key="confirmacion"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 overflow-y-auto no-scrollbar flex flex-col justify-center"
                >
                  <div className="container max-w-3xl mx-auto p-4 sm:p-6">
                    
                    {/* Standard header tracking matching reference */}
                    <div className="flex border-b border-gray-medium pb-2 justify-between font-mono text-[8px] tracking-widest text-zinc-400 font-bold mb-4 uppercase">
                      <span>13 / CONFIRMACIÓN</span>
                      <span>13 / OPCIÓN WHATSAPP</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-left">
                      
                      {/* Left Block: Check and Thank you message */}
                      <div className="md:col-span-6 p-4 border border-gray-medium flex flex-col justify-between rounded-sm bg-white">
                        <div className="flex flex-col">
                          <div className="w-10 h-10 bg-brand-gold rounded-full flex items-center justify-center mb-3 shadow-md border border-brand-black/10">
                            <CheckCircle2 size={18} className="text-brand-black" />
                          </div>
                          
                          <h2 className="text-lg font-black mb-2 leading-tight text-brand-black">¡Datos Recibidos!</h2>
                          
                          <p className="text-[11px] text-gray-500 leading-relaxed font-medium mb-3">
                            Tu solicitud ha sido guardada con éxito en nuestra plataforma. Para ser atendido lo más rápido posible, te pedimos que <span className="font-extrabold text-brand-black">toques el botón de WhatsApp</span> para enviar la consulta directo a nuestro equipo express. ¡Te atenderemos de inmediato!
                          </p>
                        </div>

                        {/* Staged portfolio apartment image inside thank you box */}
                        <div className="w-full h-24 overflow-hidden relative shadow-inner">
                          <img 
                            src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                            className="w-full h-full object-cover grayscale brightness-90 hover:grayscale-0 transition-all duration-700"
                            alt="Interior staged living room"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      </div>

                      {/* Right Block: Direct contact via WhatsApp card */}
                      <div className="md:col-span-6 flex flex-col gap-4">
                        
                        {/* WhatsApp Card Container */}
                        <div className="p-4 border-2 border-green-500 bg-green-500/[0.03] flex flex-col rounded-sm">
                          <div className="flex items-center gap-1.5 text-green-600 mb-2">
                            <Send size={12} className="animate-bounce" />
                            <span className="text-[8px] font-black uppercase tracking-widest font-mono">Paso Final Obligatorio</span>
                          </div>

                          <h3 className="text-xs font-black mb-1 uppercase text-brand-black">PROCESAR CONSULTA POR WHATSAPP</h3>
                          <p className="text-[10px] text-gray-600 font-semibold mb-4 leading-relaxed">
                            ⚠️ Presiona el botón verde para enviar los datos de tu quiz directo a nuestro asesor y recibir tu Ruta de Venta Honne de inmediato.
                          </p>

                          <a 
                            href={getWhatsAppLink()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-3 bg-green-500 hover:bg-green-600 font-extrabold uppercase tracking-widest text-[10px] text-white flex items-center justify-center gap-2 transition-all text-center shadow-lg shadow-green-500/20 cursor-pointer transform hover:scale-[1.01]"
                          >
                            <Phone size={12} />
                            ENVIAR CONSULTA POR WHATSAPP
                          </a>

                          <span className="text-[8px] text-gray-400 mt-2 text-center font-semibold uppercase tracking-wider">
                            Atención express inmediata 24/7
                          </span>
                        </div>

                        {/* Four Honne pillars values for security enforcement */}
                        <div className="p-4 border border-gray-medium rounded-sm space-y-2 bg-white">
                          <h4 className="text-[8px] font-black uppercase tracking-widest text-gray-400 mb-1">Tu beneficio con Honne</h4>
                          
                          <div className="flex gap-2.5 items-start">
                            <span className="text-xs">🎯</span>
                            <div>
                              <p className="text-[10px] font-extrabold uppercase tracking-wider text-brand-black leading-none">Ruta de venta express</p>
                              <p className="text-[8px] text-gray-400 leading-none mt-0.5">Diagnóstico preciso de precio del mercado y demanda potencial.</p>
                            </div>
                          </div>

                          <div className="flex gap-2.5 items-start">
                            <span className="text-xs">✅</span>
                            <div>
                              <p className="text-[10px] font-extrabold uppercase tracking-wider text-brand-black leading-none">Transparencia y seguridad</p>
                              <p className="text-[8px] text-gray-400 leading-none mt-0.5">Acompañamiento legal completo para una venta sin complicaciones.</p>
                            </div>
                          </div>
                        </div>

                      </div>

                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Simple Bottom Footer inside active shell */}
          <footer className="p-6 border-t border-gray-medium bg-white z-20 flex justify-between items-center shrink-0">
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-30">© 2018 - 2020 Honne Inmobiliaria</span>
            <div className="flex gap-4 opacity-30">
              <Phone size={14} className="cursor-pointer" />
              <Mail size={14} className="cursor-pointer" strokeWidth={2.4} />
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
