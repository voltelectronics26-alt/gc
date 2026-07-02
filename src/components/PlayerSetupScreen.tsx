import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Check, Eye, EyeOff } from 'lucide-react';
import { GameTheme, Difficulty, i18n, themes } from '../types';
import { playClickSound, playSuccessSound, playErrorSound } from '../utils/audio';

interface PlayerSetupScreenProps {
  playerNum: 1 | 2;
  playerName: string;
  opponentName: string;
  lang: string;
  codeLength: number;
  theme: GameTheme;
  difficulty: Difficulty;
  onSave: (code: string) => void;
  onBack: () => void;
  key?: string;
}

export default function PlayerSetupScreen({
  playerNum,
  playerName,
  opponentName,
  lang,
  codeLength,
  theme,
  difficulty,
  onSave,
  onBack,
}: PlayerSetupScreenProps) {
  const t = i18n[lang] || i18n.en;
  const tc = themes[theme];
  const isRTL = lang === 'ar';

  const [code, setCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Physical keyboard support listener
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // If focused inside another input, let standard input handling run
      if (document.activeElement?.tagName === 'INPUT' && document.activeElement.id !== `player-${playerNum}-secret-input`) {
        return;
      }
      
      const key = e.key;
      if (/^[0-9]$/.test(key)) {
        e.preventDefault();
        playClickSound();
        if (code.length < codeLength) {
          setCode((prev) => prev + key);
          setErrorMsg('');
        }
      } else if (key === 'Backspace') {
        e.preventDefault();
        playClickSound();
        setCode((prev) => prev.slice(0, -1));
        setErrorMsg('');
      } else if (key === 'Enter') {
        e.preventDefault();
        triggerFormSubmit();
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [code, codeLength]);

  const validateCode = (val: string) => {
    const regex = new RegExp(`^[0-9]{${codeLength}}$`);
    return regex.test(val);
  };

  const hasDuplicates = (val: string) => {
    return new Set(val).size !== val.length;
  };

  const handleTextChange = (val: string) => {
    const numericOnly = val.replace(/[^0-9]/g, '');
    if (numericOnly.length <= codeLength) {
      setCode(numericOnly);
      setErrorMsg('');
      playClickSound();
    }
  };

  const triggerFormSubmit = () => {
    if (!validateCode(code)) {
      setErrorMsg(t.invalidCode.replace('{length}', codeLength.toString()));
      playErrorSound();
      return;
    }

    if (difficulty === 'easy' && hasDuplicates(code)) {
      setErrorMsg(isRTL ? 'الوضع السهل: لا يمكن أن يحتوي الرمز على أرقام مكررة!' : 'Easy Mode: The code cannot contain duplicate digits!');
      playErrorSound();
      return;
    }

    playSuccessSound();
    onSave(code);
    setCode(''); // reset
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerFormSubmit();
  };

  const description = playerNum === 1 
    ? t.p1SetupDesc.replace('{length}', codeLength.toString()).replace(t.player2, opponentName)
    : t.p2SetupDesc.replace('{length}', codeLength.toString()).replace(t.player1, opponentName);

  const playerTitle = playerName;
  const setupTitle = (playerNum === 1 ? t.p1Setup : t.p2Setup)
    .replace(t.player1, playerName)
    .replace(t.player2, playerName);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25 }}
      className={`game-card max-w-xl w-full p-6 md:p-8 rounded-2xl border ${tc.cardBg} ${tc.cardBorder} shadow-2xl transition-all duration-300 ${tc.glowShadow || ''}`}
    >
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => { playClickSound(); onBack(); }}
          className={`flex items-center gap-1.5 text-sm font-semibold hover:opacity-80 transition-opacity ${tc.textSecondary}`}
        >
          {isRTL ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          <span>{isRTL ? 'السابق' : 'Back'}</span>
        </button>
        <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border ${
          playerNum === 1 ? tc.p1Accent : tc.p2Accent
        }`}>
          {playerTitle}
        </span>
      </div>

      <div className="text-center mb-6">
        <h2 className={`text-2xl font-extrabold tracking-tight ${tc.textPrimary}`}>
          {setupTitle}
        </h2>
        <p className={`text-sm mt-3 px-2 leading-relaxed font-medium ${tc.textSecondary}`}>
          {description}
        </p>
        <div className="mt-2.5">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
            difficulty === 'easy' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
            difficulty === 'medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
            'bg-rose-500/10 text-rose-400 border border-rose-500/20 animate-pulse'
          }`}>
            {isRTL ? 'درجة الصعوبة الحالية: ' : 'Active Difficulty: '}
            {difficulty === 'easy' ? (isRTL ? 'سهل' : 'Easy') :
             difficulty === 'medium' ? (isRTL ? 'متوسط' : 'Medium') :
             (isRTL ? 'صعب' : 'Hard')}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="max-w-xs mx-auto relative">
          {/* Real Input (Styled offscreen and overlayed for continuous typing support) */}
          <input
            id={`player-${playerNum}-secret-input`}
            type="text"
            pattern="[0-9]*"
            inputMode="numeric"
            value={code}
            onChange={(e) => handleTextChange(e.target.value)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-default pointer-events-none z-0"
            maxLength={codeLength}
            autoFocus
            autoComplete="off"
          />

          {/* Visually stunning underscored password box row */}
          <div 
            dir="ltr"
            className="flex items-center justify-center gap-3 py-2 cursor-pointer relative z-10" 
            onClick={() => {
              playClickSound();
              document.getElementById(`player-${playerNum}-secret-input`)?.focus();
            }}
          >
            {Array.from({ length: codeLength }).map((_, idx) => {
              const char = code[idx] || '';
              const isFocused = idx === code.length;
              return (
                <div
                  key={idx}
                  className={`w-14 h-16 rounded-xl border flex flex-col items-center justify-between py-2 transition-all duration-200 ${
                    isFocused 
                      ? 'border-indigo-500 bg-indigo-500/10 shadow-[0_0_12px_rgba(99,102,241,0.25)] scale-105' 
                      : char 
                      ? 'border-white/20 bg-white/5' 
                      : 'border-white/10 bg-white/5 opacity-60'
                  }`}
                >
                  <div className="flex-1 flex items-center justify-center">
                    <span className={`text-3xl font-black font-mono ${tc.textPrimary}`}>
                      {char ? (showPassword ? char : '•') : ''}
                    </span>
                  </div>
                  {/* Thick glowing underscore underneath */}
                  <div className={`w-8 h-1 rounded-full transition-all duration-200 ${
                    isFocused ? 'bg-indigo-400 w-10 animate-pulse' : char ? 'bg-slate-400' : 'bg-white/20'
                  }`} />
                </div>
              );
            })}
          </div>

          {/* Show/Hide password toggle */}
          {code.length > 0 && (
            <div className="absolute top-1/2 -right-12 -translate-y-1/2 z-20">
              <button
                type="button"
                onClick={() => { playClickSound(); setShowPassword(!showPassword); }}
                className={`p-2 rounded-lg border transition-all ${tc.inputBg} ${tc.inputBorder} ${tc.textSecondary} hover:text-white`}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          )}
        </div>

        {errorMsg && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-500 text-sm font-semibold text-center mt-2"
          >
            {errorMsg}
          </motion.p>
        )}

        <button
          type="submit"
          className={`w-full py-4 px-6 mt-6 rounded-xl font-bold transition-all duration-200 flex items-center justify-center gap-2 ${tc.primaryBtn}`}
        >
          <span>{playerNum === 1 ? t.finish : t.startBattle}</span>
          <Check className="w-5 h-5" />
        </button>
      </form>

      {/* Helpful bottom note - STYLED AS A LARGE PROMINENT STICKY NOTE */}
      <div className={`mt-8 p-6 rounded-2xl border text-center transition-all duration-300 ${
        theme === 'light'
          ? 'bg-yellow-50 border-yellow-200 shadow-md'
          : 'bg-gradient-to-br from-yellow-500/10 to-amber-500/5 border-yellow-500/20 shadow-lg shadow-yellow-500/5'
      }`}>
        <p className={`text-xs md:text-sm font-black uppercase tracking-wider mb-2 ${theme === 'light' ? 'text-yellow-800' : 'text-yellow-400'}`}>
          {isRTL ? '📝 ملاحظة سرية هامة جداً' : '📝 IMPORTANT SECRET NOTE'}
        </p>
        <p className={`text-xs md:text-sm leading-relaxed font-bold ${
          theme === 'light' ? 'text-yellow-900/80' : 'text-amber-200/80'
        }`}>
          {isRTL 
            ? '💡 انتبه جيداً! لا تسمح لخصمك برؤية الكود أثناء إدخاله الآن. يدعم النظام الكتابة عبر لوحة المفاتيح والضغط على Enter للحفظ فوراً!'
            : '💡 Keep your screen angled away! Your opponent must not see this code. Full keyboard integration is active—just type the digits and press Enter to lock it in!'}
        </p>
      </div>
    </motion.div>
  );
}
