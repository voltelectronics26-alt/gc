import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Settings } from 'lucide-react';
import { GameScreen, GameTheme, Difficulty, themes } from './types';
import SettingsScreen from './components/SettingsScreen';
import PlayerSetupScreen from './components/PlayerSetupScreen';
import BattleScreen from './components/BattleScreen';
import WinnerModal from './components/WinnerModal';
import SettingsDrawer from './components/SettingsDrawer';
import GCLogo from './components/GCLogo';
import { playClickSound, playLevelUpSound, playSwitchSound } from './utils/audio';

export default function App() {
  // Game Configuration State
  const [lang, setLang] = useState<string>('ar');
  const [codeLength, setCodeLength] = useState<number>(3);
  const [theme, setTheme] = useState<GameTheme>('dark');
  const [screen, setScreen] = useState<GameScreen>('settings');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [timerDuration, setTimerDuration] = useState<number>(30); // in seconds, 0 = unlimited/no timer

  // Global Settings Drawer Toggle
  const [isSettingsDrawerOpen, setIsSettingsDrawerOpen] = useState<boolean>(false);

  // Player Names State
  const [p1Name, setP1Name] = useState<string>('Moaz');
  const [p2Name, setP2Name] = useState<string>('Budy');

  // Secret Codes & Winner state
  const [p1SecretCode, setP1SecretCode] = useState<string>('');
  const [p2SecretCode, setP2SecretCode] = useState<string>('');
  const [winner, setWinner] = useState<1 | 2 | null>(null);
  const [showWinnerModal, setShowWinnerModal] = useState<boolean>(false);

  // Synced document direction and body styling
  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  // Global Keyboard Support for S (SettingsDrawer) and R (Reset Game)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      if (
        activeEl &&
        (activeEl.tagName === 'INPUT' ||
         activeEl.tagName === 'TEXTAREA' ||
         activeEl.getAttribute('contenteditable') === 'true')
      ) {
        return;
      }

      const key = e.key.toLowerCase();
      if (key === 's') {
        e.preventDefault();
        setIsSettingsDrawerOpen((prev) => !prev);
        playClickSound();
      } else if (key === 'r') {
        e.preventDefault();
        resetGame();
        playClickSound();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const tc = themes[theme];

  const resetGame = () => {
    setP1SecretCode('');
    setP2SecretCode('');
    setWinner(null);
    setShowWinnerModal(false);
    setScreen('settings');
  };

  const handleWin = (playerNum: 1 | 2) => {
    setWinner(playerNum);
    setShowWinnerModal(true);
  };

  const toggleSettingsDrawer = () => {
    playClickSound();
    setIsSettingsDrawerOpen(!isSettingsDrawerOpen);
  };

  return (
    <div className={`min-h-screen w-full transition-colors duration-300 flex flex-col justify-between items-center relative overflow-x-hidden overflow-y-auto ${tc.bodyBg}`}>
      
      {/* Dynamic Aesthetic Background Grids and Mesh Gradients per Theme */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {theme === 'dark' && (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(#312e81_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] animate-float-1" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-rose-600/20 rounded-full blur-[150px] animate-float-2" />
            <div className="absolute top-[20%] right-[10%] w-[300px] h-[300px] bg-cyan-500/10 rounded-full blur-[100px] animate-float-3" />
          </>
        )}

        {theme === 'light' && (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-200/40 rounded-full blur-[120px] animate-float-1" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-rose-100/30 rounded-full blur-[150px] animate-float-2" />
            <div className="absolute top-[20%] right-[10%] w-[300px] h-[300px] bg-cyan-100/30 rounded-full blur-[100px] animate-float-3" />
          </>
        )}

        {theme === 'cyber' && (
          <>
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#00ff0005_1px,transparent_1px),linear-gradient(to_bottom,#00ff0005_1px,transparent_1px)] bg-[size:32px_32px]" />
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-900/25 rounded-full blur-[120px] animate-float-1" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-green-900/15 rounded-full blur-[150px] animate-float-2" />
            <div className="absolute top-[20%] right-[10%] w-[300px] h-[300px] bg-purple-500/15 rounded-full blur-[100px] animate-float-3" />
          </>
        )}

        {theme === 'forest' && (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(#064e3b_1px,transparent_1px)] [background-size:20px_20px] opacity-35" />
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-teal-800/30 rounded-full blur-[120px] animate-float-1" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-emerald-800/25 rounded-full blur-[150px] animate-float-2" />
            <div className="absolute top-[20%] right-[10%] w-[300px] h-[300px] bg-cyan-800/20 rounded-full blur-[100px] animate-float-3" />
          </>
        )}
      </div>

      {/* Top Navigation Bar / Header */}
      <header className={`w-full h-16 flex items-center justify-between px-4 md:px-8 border-b backdrop-blur-xl z-20 ${
        theme === 'light' ? 'bg-white/20 border-black/10' : 'bg-white/5 border-white/10'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
            theme === 'light' 
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' 
              : theme === 'cyber'
              ? 'bg-zinc-950 text-green-400 border border-green-500/50 shadow-[0_0_12px_rgba(34,197,94,0.3)]'
              : theme === 'forest'
              ? 'bg-emerald-800 text-white border border-emerald-600/30 shadow-md shadow-emerald-800/20'
              : 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20'
          }`}>
            <GCLogo className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-sm md:text-base font-black leading-none tracking-wider flex items-center gap-1">
              GC <span className={theme === 'light' ? 'text-indigo-600 font-bold' : 'text-indigo-400 font-bold'}>GUESS CODE</span>
            </h1>
          </div>
        </div>

        {/* Global Settings Trigger on Top Right */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex p-0.5 rounded-full border border-white/10 bg-white/5">
            {['ar', 'hi', 'en'].map((l) => (
              <button
                key={l}
                onClick={() => { playClickSound(); setLang(l); }}
                className={`px-2 py-0.5 text-[9px] font-bold rounded-full transition-all uppercase ${
                  lang === l
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white/80'
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          <button
            onClick={toggleSettingsDrawer}
            className={`p-2.5 rounded-xl border transition-all duration-200 flex items-center justify-center ${
              isSettingsDrawerOpen
                ? 'bg-indigo-600 text-white border-transparent'
                : `${tc.inputBg} ${tc.inputBorder} ${tc.textSecondary} hover:border-slate-400`
            }`}
            id="global-header-settings-btn"
            title={lang === 'ar' ? 'الإعدادات العامة للعبة' : 'Global Game Settings'}
          >
            <Settings className={`w-4.5 h-4.5 ${isSettingsDrawerOpen ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }} />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="w-full max-w-5xl z-10 flex-1 flex flex-col items-center justify-center p-4 md:p-8">
        <AnimatePresence mode="wait">
          {screen === 'settings' && (
            <SettingsScreen
              key="settings-screen"
              lang={lang}
              setLang={setLang}
              codeLength={codeLength}
              setCodeLength={setCodeLength}
              theme={theme}
              setTheme={setTheme}
              p1Name={p1Name}
              setP1Name={setP1Name}
              p2Name={p2Name}
              setP2Name={setP2Name}
              onNext={() => { playSwitchSound(); setScreen('p1-setup'); }}
            />
          )}

          {screen === 'p1-setup' && (
            <PlayerSetupScreen
              key="p1-setup-screen"
              playerNum={1}
              playerName={p1Name}
              opponentName={p2Name}
              lang={lang}
              codeLength={codeLength}
              theme={theme}
              difficulty={difficulty}
              onSave={(code) => {
                setP1SecretCode(code);
                playSwitchSound();
                setScreen('p2-setup');
              }}
              onBack={() => { playSwitchSound(); setScreen('settings'); }}
            />
          )}

          {screen === 'p2-setup' && (
            <PlayerSetupScreen
              key="p2-setup-screen"
              playerNum={2}
              playerName={p2Name}
              opponentName={p1Name}
              lang={lang}
              codeLength={codeLength}
              theme={theme}
              difficulty={difficulty}
              onSave={(code) => {
                setP2SecretCode(code);
                playSwitchSound();
                setScreen('battle');
              }}
              onBack={() => { playSwitchSound(); setScreen('p1-setup'); }}
            />
          )}

          {screen === 'battle' && (
            <BattleScreen
              key="battle-screen"
              lang={lang}
              codeLength={codeLength}
              theme={theme}
              p1SecretCode={p1SecretCode}
              p2SecretCode={p2SecretCode}
              p1Name={p1Name}
              p2Name={p2Name}
              difficulty={difficulty}
              timerDuration={timerDuration}
              onWin={handleWin}
              onReset={resetGame}
              onGoToSetup={() => { playSwitchSound(); setScreen('p1-setup'); }}
              onGoToSettings={() => { playSwitchSound(); setScreen('settings'); }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Status Bar / Footer */}
      <footer className={`w-full py-3.5 px-6 md:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 z-20 text-[10px] md:text-xs font-semibold border-t ${
        theme === 'light' ? 'bg-indigo-600 text-white border-indigo-700 shadow-lg' : 'bg-slate-950/80 text-slate-300 border-white/10 backdrop-blur-xl shadow-2xl'
      }`}>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full animate-pulse ${theme === 'light' ? 'bg-white' : 'bg-emerald-400'}`} />
            <span className="uppercase tracking-wider">
              {screen === 'settings' && (lang === 'ar' ? 'بانتظار ضبط الإعدادات...' : 'Waiting for configuration...')}
              {screen === 'p1-setup' && (lang === 'ar' ? `${p1Name} يحدد رمزه السري...` : `${p1Name} is setting their code...`)}
              {screen === 'p2-setup' && (lang === 'ar' ? `${p2Name} يحدد رمزه السري...` : `${p2Name} is setting their code...`)}
              {screen === 'battle' && (lang === 'ar' ? 'جاري اللعب...' : 'Playing...')}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4 tracking-wider text-[10px] opacity-90 font-bold">
          <span className="text-indigo-200 font-extrabold uppercase">
            {lang === 'ar' ? 'بواسطة معاذ وبودي' : 'By Moaz & Budy'}
          </span>
        </div>
      </footer>

      {/* Global Settings Slide-over Drawer */}
      <AnimatePresence>
        {isSettingsDrawerOpen && (
          <SettingsDrawer
            isOpen={isSettingsDrawerOpen}
            onClose={() => setIsSettingsDrawerOpen(false)}
            lang={lang}
            setLang={setLang}
            theme={theme}
            setTheme={setTheme}
            codeLength={codeLength}
            setCodeLength={setCodeLength}
            difficulty={difficulty}
            setDifficulty={setDifficulty}
            timerDuration={timerDuration}
            setTimerDuration={setTimerDuration}
            onResetGame={resetGame}
          />
        )}
      </AnimatePresence>

      {/* Modal is mounted outside screen list to prevent transitions interference */}
      <WinnerModal
        isOpen={showWinnerModal}
        winner={winner}
        lang={lang}
        theme={theme}
        p1Name={p1Name}
        p2Name={p2Name}
        onPlayAgain={resetGame}
      />
    </div>
  );
}
