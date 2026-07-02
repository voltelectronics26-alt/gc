import React from 'react';
import { motion } from 'motion/react';
import { 
  X, 
  Globe, 
  Palette, 
  KeyRound, 
  Sparkles, 
  Check, 
  Gamepad2, 
  ShieldAlert,
  Clock
} from 'lucide-react';
import { GameTheme, Difficulty, i18n, themes } from '../types';
import { playClickSound, playSuccessSound } from '../utils/audio';

interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  lang: string;
  setLang: (l: string) => void;
  theme: GameTheme;
  setTheme: (t: GameTheme) => void;
  codeLength: number;
  setCodeLength: (n: number) => void;
  difficulty: Difficulty;
  setDifficulty: (d: Difficulty) => void;
  timerDuration: number;
  setTimerDuration: (t: number) => void;
  onResetGame: () => void;
}

const languages = [
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
  { code: 'hi', label: 'हिंदी', flag: '🇮🇳' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
];

export default function SettingsDrawer({
  isOpen,
  onClose,
  lang,
  setLang,
  theme,
  setTheme,
  codeLength,
  setCodeLength,
  difficulty,
  setDifficulty,
  timerDuration,
  setTimerDuration,
  onResetGame,
}: SettingsDrawerProps) {
  if (!isOpen) return null;

  const t = i18n[lang] || i18n.en;
  const tc = themes[theme];
  const isRTL = lang === 'ar';

  const handleSelectTimer = (seconds: number) => {
    setTimerDuration(seconds);
    playSuccessSound();
  };

  const handleSelectTheme = (thm: GameTheme) => {
    setTheme(thm);
    playClickSound();
  };

  const handleSelectLang = (l: string) => {
    setLang(l);
    playClickSound();
  };

  const handleSelectLength = (len: number) => {
    setCodeLength(len);
    playClickSound();
    onResetGame();
  };

  const handleSelectDifficulty = (diff: Difficulty) => {
    setDifficulty(diff);
    playClickSound();
    onResetGame();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end" dir="ltr" id="settings-drawer-container">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-[4px]"
      />

      {/* Drawer Body */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 26, stiffness: 220 }}
        dir={isRTL ? 'rtl' : 'ltr'}
        className={`w-full max-w-md h-full relative z-10 flex flex-col shadow-2xl overflow-y-auto border-l border-white/10 ${tc.cardBg} ${tc.bodyBg}`}
        id="settings-drawer-panel"
      >
        {/* Header */}
        <div className="p-5 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <Gamepad2 className="w-5 h-5 text-indigo-400" />
            <h3 className={`text-lg font-black tracking-tight ${tc.textPrimary}`}>
              {isRTL ? 'إعدادات المواجهة الكاملة' : 'Global Match Settings'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition-colors hover:bg-white/10 ${tc.textSecondary}`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Body */}
        <div className="p-6 space-y-6 flex-1">
          
          {/* TURN TIMER CONFIGURATION SECTION */}
          <div className="space-y-3">
            <label className={`flex items-center gap-2 text-xs font-black uppercase tracking-wider ${tc.textPrimary}`}>
              <Clock className="w-4 h-4 text-rose-400" />
              <span>{isRTL ? 'مؤقت الدور التنازلي' : 'Turn Timer Duration'}</span>
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {[0, 15, 30, 45, 60].map((sec) => {
                const isActive = timerDuration === sec;
                return (
                  <button
                    key={sec}
                    onClick={() => handleSelectTimer(sec)}
                    className={`py-2 rounded-xl text-xs font-black border transition-all duration-200 ${
                      isActive 
                        ? 'bg-indigo-600 text-white border-transparent shadow-md' 
                        : `${tc.inputBg} ${tc.inputBorder} ${tc.textSecondary} hover:border-slate-500`
                    }`}
                  >
                    {sec === 0 ? (isRTL ? 'بدون' : 'OFF') : `${sec}s`}
                  </button>
                );
              })}
            </div>
            <p className={`text-[10px] italic leading-normal ${tc.textSecondary}`}>
              {timerDuration === 0 
                ? (isRTL ? '💡 لا يوجد مؤقت: يمتلك اللاعبون وقتاً غير محدود للتفكير في كل دور.' : '💡 Unlimited time: players have infinite time to think during their turns.')
                : (isRTL ? `💡 مؤقت نشط: ${timerDuration} ثانية لكل دور! إذا انتهى الوقت، يتم تمرير الدور للخصم فوراً!` : `💡 Active timer: ${timerDuration} seconds per turn! Turn switches immediately when time runs out!`)}
            </p>
          </div>

          {/* CHOOSE DIFFICULTY */}
          <div className="space-y-3">
            <label className={`flex items-center gap-2 text-xs font-black uppercase tracking-wider ${tc.textPrimary}`}>
              <ShieldAlert className="w-4 h-4 text-indigo-400" />
              <span>{isRTL ? 'درجة صعوبة اللعبة' : 'Game Difficulty'}</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['easy', 'medium', 'hard'] as Difficulty[]).map((diff) => {
                const isActive = difficulty === diff;
                let colorClass = '';
                if (isActive) {
                  colorClass = diff === 'easy' ? 'bg-emerald-600/25 border-emerald-500 text-emerald-300' :
                               diff === 'medium' ? 'bg-amber-600/25 border-amber-500 text-amber-300' :
                               'bg-rose-600/25 border-rose-500 text-rose-300';
                } else {
                  colorClass = `${tc.inputBg} ${tc.inputBorder} ${tc.textSecondary} hover:border-slate-500`;
                }

                return (
                  <button
                    key={diff}
                    onClick={() => handleSelectDifficulty(diff)}
                    className={`py-2 px-1 rounded-xl border text-center text-xs font-black uppercase tracking-wider transition-all duration-200 ${colorClass}`}
                  >
                    {diff === 'easy' ? (isRTL ? 'سهل' : 'Easy') :
                     diff === 'medium' ? (isRTL ? 'متوسط' : 'Medium') :
                     (isRTL ? 'صعب' : 'Hard')}
                  </button>
                );
              })}
            </div>
            <p className={`text-[10px] italic leading-normal ${tc.textSecondary}`}>
              {difficulty === 'easy' && (isRTL ? '💡 سهل: الرمز السري لن يحتوي على أرقام مكررة.' : '💡 Easy: Secret code will NOT contain duplicate digits.')}
              {difficulty === 'medium' && (isRTL ? '💡 متوسط: مسموح بتكرار الأرقام في الرمز السري.' : '💡 Medium: Duplicate digits are allowed in the secret code.')}
              {difficulty === 'hard' && (isRTL ? '💡 صعب: مسموح بالتكرار + حد أقصى 10 محاولات لكل لاعب للحل!' : '💡 Hard: Duplicates allowed + strictly max 10 guesses per player!')}
            </p>
          </div>

          {/* CODE LENGTH (DIGITS) */}
          <div className="space-y-3">
            <label className={`flex items-center gap-2 text-xs font-black uppercase tracking-wider ${tc.textPrimary}`}>
              <KeyRound className="w-4 h-4 text-indigo-400" />
              <span>{t.codeLength}</span>
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
              {[2, 3, 4, 5, 6, 7, 8].map((num) => (
                <button
                  key={num}
                  onClick={() => handleSelectLength(num)}
                  className={`py-2 rounded-xl font-black text-xs border transition-all duration-200 ${
                    codeLength === num
                      ? `bg-indigo-600 text-white border-transparent shadow-md shadow-indigo-600/10`
                      : `${tc.inputBg} ${tc.inputBorder} ${tc.textSecondary} hover:border-slate-500`
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* CHOOSE DESIGN THEME */}
          <div className="space-y-3">
            <label className={`flex items-center gap-2 text-xs font-black uppercase tracking-wider ${tc.textPrimary}`}>
              <Palette className="w-4 h-4 text-indigo-400" />
              <span>{t.chooseBg}</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['dark', 'light', 'cyber', 'forest'] as GameTheme[]).map((themeKey) => {
                const isSelected = theme === themeKey;
                const label = themeKey === 'dark' ? (isRTL ? 'الفضاء الداكن' : 'Dark Space') :
                              themeKey === 'light' ? (isRTL ? 'النهار الهادئ' : 'Soft Day') :
                              themeKey === 'cyber' ? (isRTL ? 'سايبربانك' : 'Cyberpunk') :
                              (isRTL ? 'الغابة الزمردية' : 'Forest Glow');

                return (
                  <button
                    key={themeKey}
                    onClick={() => handleSelectTheme(themeKey)}
                    className={`py-2 px-3 rounded-xl border text-xs font-black uppercase tracking-wider transition-all duration-200 ${
                      isSelected 
                        ? 'bg-indigo-600 text-white border-transparent shadow-md' 
                        : `${tc.inputBg} ${tc.inputBorder} ${tc.textSecondary} hover:border-slate-500`
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* CHOOSE LANGUAGE */}
          <div className="space-y-3">
            <label className={`flex items-center gap-2 text-xs font-black uppercase tracking-wider ${tc.textPrimary}`}>
              <Globe className="w-4 h-4 text-indigo-400" />
              <span>{t.chooseLang}</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {languages.map((item) => (
                <button
                  key={item.code}
                  onClick={() => handleSelectLang(item.code)}
                  className={`py-2 px-1 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all duration-200 ${
                    lang === item.code
                      ? 'bg-indigo-600 text-white border-transparent'
                      : `${tc.inputBg} ${tc.inputBorder} ${tc.textSecondary} hover:border-slate-500`
                  }`}
                >
                  <span className="text-sm">{item.flag}</span>
                  <span className="text-[10px] font-bold">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Sticky Note at Drawer Bottom */}
        <div className="p-5 border-t border-white/10 bg-black/10 text-center space-y-1">
          <p className={`text-[10px] font-medium leading-relaxed opacity-85 ${tc.textSecondary}`}>
            {isRTL 
              ? '⚠️ تغيير الإعدادات الأساسية (مثل طول الرمز أو درجة الصعوبة) سيعيد ضبط الجولة الحالية تلقائياً لتطبيق التغييرات.' 
              : '⚠️ Changing core parameters (like digits or difficulty) resets the current duel to apply the rules.'}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
