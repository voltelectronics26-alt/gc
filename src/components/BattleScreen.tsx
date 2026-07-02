import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, 
  RotateCcw, 
  Target, 
  RefreshCw, 
  AlertCircle, 
  Award, 
  Lightbulb, 
  Sparkles, 
  Gamepad2, 
  HelpCircle 
} from 'lucide-react';
import { GameTheme, Difficulty, i18n, themes, GuessItem } from '../types';
import { playClickSound, playSuccessSound, playErrorSound, playSwitchSound } from '../utils/audio';

interface BattleScreenProps {
  lang: string;
  codeLength: number;
  theme: GameTheme;
  p1SecretCode: string;
  p2SecretCode: string;
  p1Name: string;
  p2Name: string;
  difficulty: Difficulty;
  timerDuration: number;
  onWin: (player: 1 | 2) => void;
  onReset: () => void;
  onGoToSetup: () => void;
  onGoToSettings: () => void;
  key?: string;
}

const turnLabels: Record<string, { turn: string; waiting: string }> = {
  ar: { turn: "دور {name} للتخمين الآن! 🤔", waiting: "بانتظار دور {name}..." },
  hi: { turn: "अब {name} की अनुमान लगाने की बारी है! 🤔", waiting: "{name} की प्रतीक्षा की जा रही है..." },
  en: { turn: "It's {name}'s turn to guess! 🤔", waiting: "Waiting for {name}..." },
  de: { turn: "{name} ist an der Reihe zu raten! 🤔", waiting: "Warten auf {name}..." },
  fr: { turn: "C'est au tour de {name} de deviner ! 🤔", waiting: "En attente de {name}..." },
  es: { turn: "¡Es el turno de {name} para adivinar! 🤔", waiting: "Esperando a {name}..." },
  it: { turn: "È il turno di {name} di indovinare! 🤔", waiting: "In attesa di {name}..." },
  ru: { turn: "Очередь {name} угадывать! 🤔", waiting: "Ожидание {name}..." },
  zh: { turn: "现在轮到 {name} 猜了！🤔", waiting: "等待 {name}..." },
  ja: { turn: "{name} の推測する番です！🤔", waiting: "{name} を待っています..." },
  tr: { turn: "Tahmin sırası {name} oyuncusunda! 🤔", waiting: "{name} bekleniyor..." }
};

export default function BattleScreen({
  lang,
  codeLength,
  theme,
  p1SecretCode,
  p2SecretCode,
  p1Name,
  p2Name,
  difficulty,
  timerDuration,
  onWin,
  onReset,
  onGoToSetup,
  onGoToSettings,
}: BattleScreenProps) {
  const t = i18n[lang] || i18n.en;
  const tc = themes[theme];
  const isRTL = lang === 'ar';
  const turns = turnLabels[lang] || turnLabels.en;

  // Render Mastermind-style physical Black & White pegs for the Guess History panel
  const renderPegs = (correct: number, wrong: number) => {
    const pegs = [];
    
    // Add black pegs for correct positions (perfect matches)
    for (let i = 0; i < correct; i++) {
      pegs.push(
        <div 
          key={`black-${i}`} 
          className="w-3 h-3 rounded-full bg-neutral-950 border border-neutral-700/80 ring-1 ring-white/10 shadow-[inset_0_1px_2.5px_rgba(0,0,0,0.85),0_1px_1.5px_rgba(255,255,255,0.1)] shrink-0" 
          title={isRTL ? 'رقم صحيح وموقع صحيح (مؤشر أسود)' : 'Correct digit & position (Black Peg)'}
        />
      );
    }
    
    // Add white pegs for wrong positions (value matches only)
    for (let i = 0; i < wrong; i++) {
      pegs.push(
        <div 
          key={`white-${i}`} 
          className="w-3 h-3 rounded-full bg-white border border-neutral-300 shadow-[0_1px_1.5px_rgba(0,0,0,0.12),inset_0_1px_0.5px_rgba(255,255,255,0.95)] shrink-0" 
          title={isRTL ? 'رقم صحيح وموقع خاطئ (مؤشر أبيض)' : 'Correct digit, wrong position (White Peg)'}
        />
      );
    }
    
    // Add empty peg holes for the remaining code length
    const remaining = codeLength - (correct + wrong);
    for (let i = 0; i < remaining; i++) {
      pegs.push(
        <div 
          key={`empty-${i}`} 
          className="w-3 h-3 rounded-full bg-neutral-900/40 border border-dashed border-white/10 shadow-[inset_0_1px_1.5px_rgba(0,0,0,0.6)] shrink-0" 
          title={isRTL ? 'مكان فارغ' : 'Empty Peg Slot'}
        />
      );
    }

    return (
      <div className="flex items-center gap-1 bg-black/20 p-1 rounded-lg border border-white/5 shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)]">
        {pegs}
      </div>
    );
  };

  // Active turn state (1 = Player 1, 2 = Player 2)
  const [activeTurn, setActiveTurn] = useState<1 | 2>(1);

  // Countdown Timer state
  const [timeLeft, setTimeLeft] = useState<number>(timerDuration);

  // Game States for each board
  const [p1Guesses, setP1Guesses] = useState<GuessItem[]>([]);
  const [p2Guesses, setP2Guesses] = useState<GuessItem[]>([]);

  const [p1CurrentInput, setP1CurrentInput] = useState('');
  const [p2CurrentInput, setP2CurrentInput] = useState('');

  const [p1Error, setP1Error] = useState('');
  const [p2Error, setP2Error] = useState('');

  // Hints States
  const [p1HintsLeft, setP1HintsLeft] = useState(1);
  const [p2HintsLeft, setP2HintsLeft] = useState(1);
  const [p1ActiveHint, setP1ActiveHint] = useState('');
  const [p2ActiveHint, setP2ActiveHint] = useState('');

  // Notepad States
  const [p1Note, setP1Note] = useState('');
  const [p2Note, setP2Note] = useState('');

  // Turn switching overlay animation states
  const [showTurnOverlay, setShowTurnOverlay] = useState(false);
  const [overlayTurnPlayer, setOverlayTurnPlayer] = useState<1 | 2>(1);

  useEffect(() => {
    setOverlayTurnPlayer(activeTurn);
    setShowTurnOverlay(true);
    const timer = setTimeout(() => {
      setShowTurnOverlay(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, [activeTurn]);

  const p1HistoryRef = useRef<HTMLDivElement>(null);
  const p2HistoryRef = useRef<HTMLDivElement>(null);

  // Focus active player input on mount and turn changes
  useEffect(() => {
    const activeInputId = activeTurn === 1 ? 'p1-guess-input' : 'p2-guess-input';
    const activeInput = document.getElementById(activeInputId);
    if (activeInput) {
      activeInput.focus();
    }
  }, [activeTurn]);

  // Handle active turn countdown timer
  useEffect(() => {
    if (timerDuration === 0) return;

    setTimeLeft(timerDuration);

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          playErrorSound();
          setActiveTurn((curr) => {
            const nextTurn = curr === 1 ? 2 : 1;
            playSwitchSound();
            return nextTurn;
          });
          return timerDuration;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeTurn, timerDuration]);

  // Physical Keyboard Support
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Ignore key events if focused in textarea
      if (document.activeElement?.tagName === 'TEXTAREA') {
        return;
      }
      
      // If focused inside another player's input, let standard process run
      if (document.activeElement?.tagName === 'INPUT' && 
          document.activeElement.id !== (activeTurn === 1 ? 'p1-guess-input' : 'p2-guess-input')) {
        return;
      }

      const key = e.key;

      if (activeTurn === 1) {
        if (/^[0-9]$/.test(key)) {
          e.preventDefault();
          playClickSound();
          if (p1CurrentInput.length < codeLength) {
            setP1CurrentInput((prev) => prev + key);
            setP1Error('');
          }
        } else if (key === 'Backspace') {
          e.preventDefault();
          playClickSound();
          setP1CurrentInput((prev) => prev.slice(0, -1));
          setP1Error('');
        } else if (key === 'Enter') {
          e.preventDefault();
          handleP1Submit();
        }
      } else {
        if (/^[0-9]$/.test(key)) {
          e.preventDefault();
          playClickSound();
          if (p2CurrentInput.length < codeLength) {
            setP2CurrentInput((prev) => prev + key);
            setP2Error('');
          }
        } else if (key === 'Backspace') {
          e.preventDefault();
          playClickSound();
          setP2CurrentInput((prev) => prev.slice(0, -1));
          setP2Error('');
        } else if (key === 'Enter') {
          e.preventDefault();
          handleP2Submit();
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [activeTurn, p1CurrentInput, p2CurrentInput, codeLength]);

  // Bulls and Cows Logic
  const evaluateGuess = (guess: string, secret: string) => {
    let correctPos = 0;
    let wrongPos = 0;
    const secretUsed = Array(secret.length).fill(false);
    const guessUsed = Array(guess.length).fill(false);

    // Pass 1: exact matches
    for (let i = 0; i < guess.length; i++) {
      if (guess[i] === secret[i]) {
        correctPos++;
        secretUsed[i] = true;
        guessUsed[i] = true;
      }
    }

    // Pass 2: wrong position matches
    for (let i = 0; i < guess.length; i++) {
      if (guessUsed[i]) continue;
      for (let j = 0; j < secret.length; j++) {
        if (!secretUsed[j] && guess[i] === secret[j]) {
          wrongPos++;
          secretUsed[j] = true;
          break;
        }
      }
    }

    return { correctPos, wrongPos };
  };

  const handleP1Submit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (activeTurn !== 1) return;
    const guessVal = p1CurrentInput.trim();
    const regex = new RegExp(`^[0-9]{${codeLength}}$`);

    if (!regex.test(guessVal)) {
      setP1Error(t.invalidCode.replace('{length}', codeLength.toString()));
      playErrorSound();
      return;
    }

    setP1Error('');
    const result = evaluateGuess(guessVal, p2SecretCode);
    const newGuess: GuessItem = {
      guess: guessVal,
      correctPos: result.correctPos,
      wrongPos: result.wrongPos,
    };

    const updatedGuesses = [newGuess, ...p1Guesses];
    setP1Guesses(updatedGuesses);
    setP1CurrentInput('');

    if (result.correctPos === codeLength) {
      playSuccessSound();
      onWin(1);
    } else {
      // Hard Mode validation: Max 10 turns
      if (difficulty === 'hard' && updatedGuesses.length >= 10) {
        setP1Error(isRTL ? 'انتهت محاولاتك الـ 10! لقد كسب الخصم المواجهة!' : 'You used all 10 guesses! Opponent wins!');
        playErrorSound();
        setTimeout(() => onWin(2), 2000);
        return;
      }

      playSwitchSound();
      setActiveTurn(2);
    }
  };

  const handleP2Submit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (activeTurn !== 2) return;
    const guessVal = p2CurrentInput.trim();
    const regex = new RegExp(`^[0-9]{${codeLength}}$`);

    if (!regex.test(guessVal)) {
      setP2Error(t.invalidCode.replace('{length}', codeLength.toString()));
      playErrorSound();
      return;
    }

    setP2Error('');
    const result = evaluateGuess(guessVal, p1SecretCode);
    const newGuess: GuessItem = {
      guess: guessVal,
      correctPos: result.correctPos,
      wrongPos: result.wrongPos,
    };

    const updatedGuesses = [newGuess, ...p2Guesses];
    setP2Guesses(updatedGuesses);
    setP2CurrentInput('');

    if (result.correctPos === codeLength) {
      playSuccessSound();
      onWin(2);
    } else {
      // Hard Mode validation: Max 10 turns
      if (difficulty === 'hard' && updatedGuesses.length >= 10) {
        setP2Error(isRTL ? 'انتهت محاولاتك الـ 10! لقد كسب الخصم المواجهة!' : 'You used all 10 guesses! Opponent wins!');
        playErrorSound();
        setTimeout(() => onWin(1), 2000);
        return;
      }

      playSwitchSound();
      setActiveTurn(1);
    }
  };

  const cleanNumericInput = (val: string, setter: (v: string) => void, clearError: () => void) => {
    const clean = val.replace(/[^0-9]/g, '');
    if (clean.length <= codeLength) {
      setter(clean);
      clearError();
      playClickSound();
    }
  };

  // Help/Hint generator for players
  const triggerGetHint = (playerNum: 1 | 2) => {
    const targetSecret = playerNum === 1 ? p2SecretCode : p1SecretCode;
    const opponentName = playerNum === 1 ? p2Name : p1Name;

    // Hint generator logic
    const hintTypes = ['contains', 'not-contains', 'first-digit'];
    const selectedType = hintTypes[Math.floor(Math.random() * hintTypes.length)];
    let finalHint = '';

    if (selectedType === 'contains') {
      const idx = Math.floor(Math.random() * targetSecret.length);
      const digit = targetSecret[idx];
      finalHint = isRTL 
        ? `تلميح: الكود السري لـ ${opponentName} يحتوي على الرقم "${digit}"!` 
        : `Clue: ${opponentName}'s secret code contains the digit "${digit}"!`;
    } else if (selectedType === 'not-contains') {
      const unusedDigits = ['0','1','2','3','4','5','6','7','8','9'].filter(d => !targetSecret.includes(d));
      const digit = unusedDigits.length > 0 ? unusedDigits[Math.floor(Math.random() * unusedDigits.length)] : '9';
      finalHint = isRTL 
        ? `تلميح: الرقم "${digit}" غير موجود نهائياً في الكود السري لـ ${opponentName}.` 
        : `Clue: The digit "${digit}" is NOT in ${opponentName}'s secret code.`;
    } else {
      const firstDigit = parseInt(targetSecret[0], 10);
      const isOdd = firstDigit % 2 !== 0;
      const oddEvenStr = isRTL ? (isOdd ? 'فردي' : 'زوجي') : (isOdd ? 'odd' : 'even');
      finalHint = isRTL 
        ? `تلميح: الرقم الأول في الرمز السري لـ ${opponentName} هو رقم ${oddEvenStr}.` 
        : `Clue: The first digit of ${opponentName}'s secret code is an ${oddEvenStr} number.`;
    }

    if (playerNum === 1) {
      setP1ActiveHint(finalHint);
      setP1HintsLeft(0);
    } else {
      setP2ActiveHint(finalHint);
      setP2HintsLeft(0);
    }
    playSuccessSound();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`game-card max-w-5xl w-full p-4 md:p-6 rounded-2xl border ${tc.cardBg} ${tc.cardBorder} shadow-2xl transition-all duration-300 ${tc.glowShadow || ''}`}
    >
      {/* Turn Banner with Active Turn Timer countdown badge */}
      <div className="mb-6 flex flex-col items-center gap-3">
        <motion.div
          key={activeTurn}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`px-6 py-3 rounded-2xl flex items-center gap-3 border shadow-lg font-bold tracking-wide text-sm md:text-base transition-all duration-300 ${
            activeTurn === 1
              ? 'bg-rose-500/10 border-rose-500/20 text-rose-300 shadow-rose-500/5'
              : 'bg-cyan-500/10 border-cyan-500/20 text-cyan-300 shadow-cyan-500/5'
          }`}
        >
          <span className={`w-3 h-3 rounded-full animate-ping ${
            activeTurn === 1 ? 'bg-rose-400' : 'bg-cyan-400'
          }`} />
          <span>
            {turns.turn.replace('{name}', activeTurn === 1 ? p1Name : p2Name)}
          </span>
        </motion.div>

        {/* Turn Countdown display */}
        {timerDuration > 0 && (
          <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 shadow-md">
            <span className="text-rose-400 animate-pulse">⏱️</span>
            <span className="text-xs font-black font-mono tracking-widest text-rose-300">
              {isRTL ? `المتبقي: ${timeLeft} ثوانٍ` : `TIME LEFT: ${timeLeft}s`}
            </span>
          </div>
        )}
      </div>

      {/* Split Screen Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Player 1 Guessing Board */}
        <div className={`space-y-4 p-5 md:p-6 rounded-3xl border transition-all ${
          activeTurn === 1 ? 'ring-2 ring-rose-500/30' : 'opacity-85'
        } ${
          theme === 'light'
            ? 'bg-rose-500/[0.03] border-rose-500/10'
            : 'bg-rose-500/[0.05] border-rose-500/20 shadow-inner'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full bg-rose-500 shadow-md shadow-rose-500/30 ${activeTurn === 1 ? 'animate-pulse' : 'opacity-55'}`} />
              <h3 id="p1-board-title" className={`text-base md:text-lg font-extrabold tracking-tight ${tc.textPrimary}`}>
                {t.p1Board.replace(t.player1, p1Name).replace(t.player2, p2Name)}
              </h3>
            </div>
            
            {/* Turns Limit display on Hard difficulty */}
            {difficulty === 'hard' && (
              <span className="px-2 py-0.5 text-[9px] font-black rounded-full bg-rose-950 text-rose-400 border border-rose-800/30">
                {isRTL ? `المحاولات: ${p1Guesses.length}/10` : `Guesses: ${p1Guesses.length}/10`}
              </span>
            )}
          </div>

          <div className="relative">
            {activeTurn !== 1 && (
              <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] rounded-xl flex items-center justify-center z-10 p-2 text-center">
                <span className="text-xs font-bold px-3 py-1.5 bg-rose-950/90 text-rose-300 rounded-lg border border-rose-800/40">
                  {turns.waiting.replace('{name}', p2Name)}
                </span>
              </div>
            )}
            
            <form onSubmit={handleP1Submit} className="space-y-3 w-full">
              <div className="relative">
                {/* Real hidden input */}
                <input
                  id="p1-guess-input"
                  type="text"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  value={p1CurrentInput}
                  onChange={(e) => cleanNumericInput(e.target.value, setP1CurrentInput, () => setP1Error(''))}
                  maxLength={codeLength}
                  disabled={activeTurn !== 1}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-default pointer-events-none z-0"
                  autoComplete="off"
                />

                {/* Styled underscored boxes row */}
                <div 
                  dir="ltr"
                  className="flex items-center justify-center gap-2 cursor-pointer relative z-10 py-1"
                  onClick={() => {
                    if (activeTurn === 1) {
                      playClickSound();
                      document.getElementById('p1-guess-input')?.focus();
                    }
                  }}
                >
                  {Array.from({ length: codeLength }).map((_, idx) => {
                    const char = p1CurrentInput[idx] || '';
                    const isFocused = activeTurn === 1 && idx === p1CurrentInput.length;
                    return (
                      <div
                        key={idx}
                        className={`w-12 h-14 rounded-lg border flex flex-col items-center justify-between py-1.5 transition-all duration-200 ${
                          isFocused 
                            ? 'border-rose-500 bg-rose-500/10 scale-105' 
                            : char 
                            ? 'border-white/20 bg-white/5' 
                            : 'border-white/10 bg-white/5 opacity-50'
                        }`}
                      >
                        <div className="flex-1 flex items-center justify-center">
                          <span className={`text-2xl font-black font-mono ${tc.textPrimary}`}>
                            {char}
                          </span>
                        </div>
                        <div className={`w-6 h-0.5 rounded-full transition-all duration-200 ${
                          isFocused ? 'bg-rose-400 w-8' : char ? 'bg-slate-400' : 'bg-white/15'
                        }`} />
                      </div>
                    );
                  })}
                </div>
              </div>

              <button
                id="p1-guess-btn"
                type="submit"
                disabled={activeTurn !== 1}
                className={`w-full py-3 rounded-xl font-black transition-all duration-200 bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/20 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-30 disabled:scale-100 disabled:shadow-none`}
              >
                <span>{isRTL ? 'إرسال التخمين' : 'Submit Guess'}</span>
                <Send className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
              </button>
            </form>
          </div>

          {p1Error && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-rose-400 text-xs font-semibold flex items-center gap-1"
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{p1Error}</span>
            </motion.p>
          )}

          {/* Player 1 Hint Panel */}
          <div className="p-3.5 rounded-xl border border-dashed border-white/10 bg-white/5 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-black uppercase tracking-wider ${tc.textSecondary}`}>
                {isRTL ? 'تلميحات اللاعب 1' : 'Player 1 Hints Clues'}
              </span>
              {p1HintsLeft > 0 ? (
                <button
                  type="button"
                  onClick={() => triggerGetHint(1)}
                  disabled={activeTurn !== 1}
                  className="px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-indigo-600 text-white hover:bg-indigo-500 flex items-center gap-1 transition-all active:scale-95 disabled:opacity-40"
                >
                  <Lightbulb className="w-3.5 h-3.5 animate-pulse" />
                  <span>{isRTL ? 'طلب تلميح' : 'Get Clue'}</span>
                </button>
              ) : (
                <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest flex items-center gap-1">
                  <span>{isRTL ? 'تم استخدام التلميح' : 'Hint Used'}</span>
                </span>
              )}
            </div>
            
            <AnimatePresence>
              {p1ActiveHint && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="p-2.5 rounded-lg bg-indigo-600/10 border border-indigo-500/20 flex items-center gap-2 text-xs font-bold text-indigo-300"
                >
                  <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse shrink-0" />
                  <p>{p1ActiveHint}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* History P1 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className={`text-[10px] font-bold uppercase tracking-wider ${tc.textSecondary}`}>
                {t.history}
              </h4>
              <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-white/5 border border-white/10 ${tc.textSecondary}`}>
                {isRTL ? `المحاولات: ${p1Guesses.length}` : `Attempts: ${p1Guesses.length}`}
              </span>
            </div>

            {/* Peg Legend */}
            <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-slate-400/90 border-b border-white/5 pb-1.5 px-1 bg-black/10 rounded py-1">
              <span>{isRTL ? 'التخمين' : 'Guess'}</span>
              <div className="flex items-center gap-2.5">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-slate-950 border border-slate-700 ring-1 ring-white/10" />
                  <span>{isRTL ? 'صحيح' : 'Perfect'}</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-white border border-slate-300" />
                  <span>{isRTL ? 'مكان خاطئ' : 'Wrong Spot'}</span>
                </span>
              </div>
            </div>

            <div
              ref={p1HistoryRef}
              className={`h-40 overflow-y-auto space-y-2 pr-1.5 custom-scrollbar`}
              style={{ contentVisibility: 'auto' }}
            >
              <AnimatePresence initial={false}>
                {p1Guesses.length === 0 ? (
                  <div className={`h-full flex flex-col items-center justify-center opacity-40 py-8 ${tc.textSecondary}`}>
                     <Target className="w-8 h-8 mb-2 stroke-[1.5]" />
                     <span className="text-xs font-medium">{t.enterGuess}</span>
                  </div>
                ) : (
                  p1Guesses.map((item, index) => (
                    <motion.div
                      key={`p1-guess-${p1Guesses.length - index}`}
                      initial={{ opacity: 0, x: isRTL ? 15 : -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`flex items-center justify-between p-2.5 bg-white/5 border border-white/10 rounded-xl transition-colors font-mono hover:bg-white/10`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold opacity-40">
                          #{p1Guesses.length - index}
                        </span>
                        <span className={`text-lg font-black tracking-widest ${tc.textPrimary}`}>
                          {item.guess}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="flex gap-2 text-[10px] font-sans font-black">
                          <span className="flex items-center gap-1 text-emerald-400" title={isRTL ? 'رقم وموقع صحيح' : 'Correct value and spot'}>
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span>{item.correctPos}</span>
                          </span>
                          <span className="flex items-center gap-1 text-amber-400" title={isRTL ? 'رقم صحيح وموقع خاطئ' : 'Correct value but wrong spot'}>
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            <span>{item.wrongPos}</span>
                          </span>
                        </div>
                        {renderPegs(item.correctPos, item.wrongPos)}
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Notepad P1 - enlarged significantly */}
          <div className="space-y-1.5 pt-3 border-t border-white/10">
            <h4 className={`text-[10px] font-bold uppercase tracking-wider ${tc.textSecondary}`}>
              {isRTL ? `مفكرة ${p1Name} (اكتب أرقامك أو توقعاتك)` : `${p1Name}'s Notepad (Notes)`}
            </h4>
            <textarea
              id="p1-notepad"
              value={p1Note}
              onChange={(e) => setP1Note(e.target.value)}
              placeholder={isRTL ? 'اكتب ملاحظاتك، خمن، أو احذف الأرقام هنا...' : 'Write notes, guesses, or eliminate digits here...'}
              className={`w-full h-32 px-3 py-2 text-xs rounded-xl border resize-none focus:outline-none transition-all duration-200 leading-relaxed ${tc.inputBg} ${tc.inputBorder} ${tc.inputText}`}
            />
          </div>
        </div>

        {/* Player 2 Guessing Board */}
        <div className={`space-y-4 p-5 md:p-6 rounded-3xl border transition-all ${
          activeTurn === 2 ? 'ring-2 ring-cyan-500/30' : 'opacity-85'
        } ${
          theme === 'light'
            ? 'bg-cyan-500/[0.03] border-cyan-500/10'
            : 'bg-cyan-500/[0.05] border-cyan-500/20 shadow-inner'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full bg-cyan-500 shadow-md shadow-cyan-500/30 ${activeTurn === 2 ? 'animate-pulse' : 'opacity-55'}`} />
              <h3 id="p2-board-title" className={`text-base md:text-lg font-extrabold tracking-tight ${tc.textPrimary}`}>
                {t.p2Board.replace(t.player2, p2Name).replace(t.player1, p1Name)}
              </h3>
            </div>
            
            {/* Turns Limit display on Hard difficulty */}
            {difficulty === 'hard' && (
              <span className="px-2 py-0.5 text-[9px] font-black rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800/30">
                {isRTL ? `المحاولات: ${p2Guesses.length}/10` : `Guesses: ${p2Guesses.length}/10`}
              </span>
            )}
          </div>

          <div className="relative">
            {activeTurn !== 2 && (
              <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] rounded-xl flex items-center justify-center z-10 p-2 text-center">
                <span className="text-xs font-bold px-3 py-1.5 bg-cyan-950/90 text-cyan-300 rounded-lg border border-cyan-800/40">
                  {turns.waiting.replace('{name}', p1Name)}
                </span>
              </div>
            )}
            
            <form onSubmit={handleP2Submit} className="space-y-3 w-full">
              <div className="relative">
                {/* Real hidden input */}
                <input
                  id="p2-guess-input"
                  type="text"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  value={p2CurrentInput}
                  onChange={(e) => cleanNumericInput(e.target.value, setP2CurrentInput, () => setP2Error(''))}
                  maxLength={codeLength}
                  disabled={activeTurn !== 2}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-default pointer-events-none z-0"
                  autoComplete="off"
                />

                {/* Styled underscored boxes row */}
                <div 
                  dir="ltr"
                  className="flex items-center justify-center gap-2 cursor-pointer relative z-10 py-1"
                  onClick={() => {
                    if (activeTurn === 2) {
                      playClickSound();
                      document.getElementById('p2-guess-input')?.focus();
                    }
                  }}
                >
                  {Array.from({ length: codeLength }).map((_, idx) => {
                    const char = p2CurrentInput[idx] || '';
                    const isFocused = activeTurn === 2 && idx === p2CurrentInput.length;
                    return (
                      <div
                        key={idx}
                        className={`w-12 h-14 rounded-lg border flex flex-col items-center justify-between py-1.5 transition-all duration-200 ${
                          isFocused 
                            ? 'border-cyan-500 bg-cyan-500/10 scale-105' 
                            : char 
                            ? 'border-white/20 bg-white/5' 
                            : 'border-white/10 bg-white/5 opacity-50'
                        }`}
                      >
                        <div className="flex-1 flex items-center justify-center">
                          <span className={`text-2xl font-black font-mono ${tc.textPrimary}`}>
                            {char}
                          </span>
                        </div>
                        <div className={`w-6 h-0.5 rounded-full transition-all duration-200 ${
                          isFocused ? 'bg-cyan-400 w-8' : char ? 'bg-slate-400' : 'bg-white/15'
                        }`} />
                      </div>
                    );
                  })}
                </div>
              </div>

              <button
                id="p2-guess-btn"
                type="submit"
                disabled={activeTurn !== 2}
                className={`w-full py-3 rounded-xl font-black transition-all duration-200 bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-600/20 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-30 disabled:scale-100 disabled:shadow-none`}
              >
                <span>{isRTL ? 'إرسال التخمين' : 'Submit Guess'}</span>
                <Send className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
              </button>
            </form>
          </div>

          {p2Error && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-cyan-400 text-xs font-semibold flex items-center gap-1"
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{p2Error}</span>
            </motion.p>
          )}

          {/* Player 2 Hint Panel */}
          <div className="p-3.5 rounded-xl border border-dashed border-white/10 bg-white/5 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-black uppercase tracking-wider ${tc.textSecondary}`}>
                {isRTL ? 'تلميحات اللاعب 2' : 'Player 2 Hints Clues'}
              </span>
              {p2HintsLeft > 0 ? (
                <button
                  type="button"
                  onClick={() => triggerGetHint(2)}
                  disabled={activeTurn !== 2}
                  className="px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-indigo-600 text-white hover:bg-indigo-500 flex items-center gap-1 transition-all active:scale-95 disabled:opacity-40"
                >
                  <Lightbulb className="w-3.5 h-3.5 animate-pulse" />
                  <span>{isRTL ? 'طلب تلميح' : 'Get Clue'}</span>
                </button>
              ) : (
                <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest flex items-center gap-1">
                  <span>{isRTL ? 'تم استخدام التلميح' : 'Hint Used'}</span>
                </span>
              )}
            </div>
            
            <AnimatePresence>
              {p2ActiveHint && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="p-2.5 rounded-lg bg-indigo-600/10 border border-indigo-500/20 flex items-center gap-2 text-xs font-bold text-indigo-300"
                >
                  <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse shrink-0" />
                  <p>{p2ActiveHint}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* History P2 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className={`text-[10px] font-bold uppercase tracking-wider ${tc.textSecondary}`}>
                {t.history}
              </h4>
              <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-white/5 border border-white/10 ${tc.textSecondary}`}>
                {isRTL ? `المحاولات: ${p2Guesses.length}` : `Attempts: ${p2Guesses.length}`}
              </span>
            </div>

            {/* Peg Legend */}
            <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-slate-400/90 border-b border-white/5 pb-1.5 px-1 bg-black/10 rounded py-1">
              <span>{isRTL ? 'التخمين' : 'Guess'}</span>
              <div className="flex items-center gap-2.5">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-slate-950 border border-slate-700 ring-1 ring-white/10" />
                  <span>{isRTL ? 'رقم وموقع صحيح' : 'Perfect'}</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-white border border-slate-300" />
                  <span>{isRTL ? 'رقم صحيح فقط' : 'Wrong Spot'}</span>
                </span>
              </div>
            </div>

            <div
              ref={p2HistoryRef}
              className={`h-40 overflow-y-auto space-y-2 pr-1.5 custom-scrollbar`}
              style={{ contentVisibility: 'auto' }}
            >
              <AnimatePresence initial={false}>
                {p2Guesses.length === 0 ? (
                  <div className={`h-full flex flex-col items-center justify-center opacity-40 py-8 ${tc.textSecondary}`}>
                    <Target className="w-8 h-8 mb-2 stroke-[1.5]" />
                    <span className="text-xs font-medium">{t.enterGuess}</span>
                  </div>
                ) : (
                  p2Guesses.map((item, index) => (
                    <motion.div
                      key={`p2-guess-${p2Guesses.length - index}`}
                      initial={{ opacity: 0, x: isRTL ? -15 : 15 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`flex items-center justify-between p-2.5 bg-white/5 border border-white/10 rounded-xl transition-colors font-mono hover:bg-white/10`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold opacity-40">
                          #{p2Guesses.length - index}
                        </span>
                        <span className={`text-lg font-black tracking-widest ${tc.textPrimary}`}>
                          {item.guess}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="flex gap-2 text-[10px] font-sans font-black">
                          <span className="flex items-center gap-1 text-emerald-400" title={isRTL ? 'رقم وموقع صحيح' : 'Correct value and spot'}>
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span>{item.correctPos}</span>
                          </span>
                          <span className="flex items-center gap-1 text-amber-400" title={isRTL ? 'رقم صحيح وموقع خاطئ' : 'Correct value but wrong spot'}>
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            <span>{item.wrongPos}</span>
                          </span>
                        </div>
                        {renderPegs(item.correctPos, item.wrongPos)}
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Notepad P2 - enlarged significantly */}
          <div className="space-y-1.5 pt-3 border-t border-white/10">
            <h4 className={`text-[10px] font-bold uppercase tracking-wider ${tc.textSecondary}`}>
              {isRTL ? `مفكرة ${p2Name} (اكتب أرقامك أو توقعاتك)` : `${p2Name}'s Notepad (Notes)`}
            </h4>
            <textarea
              id="p2-notepad"
              value={p2Note}
              onChange={(e) => setP2Note(e.target.value)}
              placeholder={isRTL ? 'اكتب ملاحظاتك، خمن، أو احذف الأرقام هنا...' : 'Write notes, guesses, or eliminate digits here...'}
              className={`w-full h-32 px-3 py-2 text-xs rounded-xl border resize-none focus:outline-none transition-all duration-200 leading-relaxed ${tc.inputBg} ${tc.inputBorder} ${tc.inputText}`}
            />
          </div>
        </div>

      </div>

      {/* Helpful big note requested by the user - absolutely styled with NO bullet points */}
      <div className={`mt-8 p-6 rounded-2xl border text-left space-y-3 relative overflow-hidden shadow-lg ${
        theme === 'light'
          ? 'bg-amber-50/70 border-amber-200/60 text-amber-950'
          : 'bg-indigo-950/20 border-white/5 text-slate-300'
      }`}>
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-yellow-400 animate-spin" />
          <h4 className="text-sm font-black uppercase tracking-wider">
            {isRTL ? '📖 دليل كسر الشفرات والمواجهة' : '📖 CODEBREAKER COMBAT MANUAL'}
          </h4>
        </div>
        <p className="text-xs font-semibold leading-relaxed">
          {isRTL 
            ? 'مرحبا بك في معركة المنطق الكبرى! كسر الشفرة هي مواجهة ثنائية حاسمة حيث يملك كل لاعب رقماً سرياً مخفياً. هدفك هو تخمين رقم خصمك قبل أن يكتشف رقمك الخاص. بعد كل تخمين، ستحصل على تقرير دقيق بالنقاط:' 
            : 'Welcome to the ultimate duel of minds! Both players have set their secret passcodes. Your objective is to crack the opponent\'s code first using logic and analytical skills.'}
        </p>
        <p className="text-xs leading-relaxed">
          {isRTL 
            ? 'الأرقام ذات اللون الأخضر تمثل المواقع الصحيحة تماماً في الكود السري للخصم، بينما تمثل الأرقام ذات اللون الأصفر الأرقام التي توجد في الكود السري ولكن في أماكن أخرى خاطئة.' 
            : 'Green indicators represent correct digits in their exact slots. Yellow indicators show correct digits placed in the wrong slots.'}
        </p>
        <p className="text-xs leading-relaxed opacity-90 border-t border-white/5 pt-2">
          {isRTL
            ? '⌨️ اختصارات لوحة المفاتيح: اكتب الأرقام (0-9) للملء السريع، واضغط (Backspace) للمسح، و (Enter) لإرسال التخمين. استخدم "مفكرة الملاحظات" المخصصة لكل لاعب لتسجيل استنتاجاتك وحذف الأرقام المستحيلة.'
            : '⌨️ Shortcuts: Type digits (0-9) to fill, Backspace to delete, and Enter to submit. Use your custom Notepad area on your board to write down possibilities and cross out eliminated options.'}
        </p>
      </div>

      {/* Reset / Return to Main Menu Button / Detour routes */}
      <div className="mt-8 pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          id="btn-detour-setup"
          onClick={() => { playClickSound(); onGoToSetup(); }}
          className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold transition-all duration-200 border flex items-center justify-center gap-2 text-xs ${tc.inputBg} ${tc.inputBorder} ${tc.textPrimary} hover:border-slate-500 active:scale-95`}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{isRTL ? 'إعادة تعيين الرموز السرية' : 'Re-enter Secret Codes'}</span>
        </button>

        <button
          id="btn-detour-settings"
          onClick={() => { playClickSound(); onGoToSettings(); }}
          className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold transition-all duration-200 flex items-center justify-center gap-2 text-xs text-white bg-indigo-600 hover:bg-indigo-500 active:scale-95 shadow-md shadow-indigo-600/20`}
        >
          <span>{isRTL ? 'العودة إلى الإعدادات العامة' : 'Return to General Settings'}</span>
        </button>

        <button
          id="btn-restart-game"
          onClick={() => { playClickSound(); onReset(); }}
          className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold transition-all duration-200 border flex items-center justify-center gap-2 text-xs ${tc.inputBg} ${tc.inputBorder} ${tc.textSecondary} hover:border-slate-400 active:scale-95`}
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>{t.playAgain}</span>
        </button>
      </div>

      {/* 🌟 PREMIUM IMMERSIVE TURN TRANSITION OVERLAY */}
      <AnimatePresence>
        {showTurnOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/75 backdrop-blur-md rounded-2xl overflow-hidden"
          >
            {/* Swoosh banner sliding left to right */}
            <motion.div
              initial={{ x: '-100%', opacity: 0 }}
              animate={{ x: '0%', opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 180 }}
              className={`w-full py-8 md:py-12 border-y flex flex-col items-center justify-center gap-3 relative shadow-2xl ${
                overlayTurnPlayer === 1
                  ? 'bg-gradient-to-r from-rose-950/80 via-rose-900/50 to-rose-950/80 border-rose-500/30'
                  : 'bg-gradient-to-r from-cyan-950/80 via-cyan-900/50 to-cyan-950/80 border-cyan-500/30'
              }`}
            >
              {/* Glowing background circles */}
              <div className={`absolute w-36 h-36 rounded-full blur-3xl opacity-45 animate-pulse ${
                overlayTurnPlayer === 1 ? 'bg-rose-500' : 'bg-cyan-500'
              }`} />

              <span className={`text-[10px] md:text-xs font-black tracking-widest uppercase px-3.5 py-1 rounded-full border ${
                overlayTurnPlayer === 1 
                  ? 'bg-rose-500/15 border-rose-500/30 text-rose-300' 
                  : 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300'
              }`}>
                {isRTL ? 'الخطوة التالية' : 'NEXT TURN'}
              </span>

              <h2 className="text-3xl md:text-5xl font-black tracking-wider text-white text-center flex items-center gap-4 drop-shadow-[0_0_12px_rgba(255,255,255,0.2)]">
                {overlayTurnPlayer === 1 ? p1Name : p2Name}
              </h2>

              <p className="text-xs md:text-sm font-semibold text-slate-300 tracking-wide text-center px-4">
                {isRTL ? 'استعد للبحث وتخمين الرمز السري!' : 'Get ready to crack the code!'}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
