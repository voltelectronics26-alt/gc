import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Globe, 
  KeyRound, 
  Palette, 
  ChevronLeft, 
  ChevronRight, 
  User, 
  Settings, 
  Search, 
  Sparkles, 
  Check, 
  UserPlus, 
  Users 
} from 'lucide-react';
import { GameTheme, i18n, themes } from '../types';
import GCLogo from './GCLogo';

interface SettingsScreenProps {
  lang: string;
  setLang: (l: string) => void;
  codeLength: number;
  setCodeLength: (n: number) => void;
  theme: GameTheme;
  setTheme: (t: GameTheme) => void;
  onNext: () => void;
  p1Name: string;
  setP1Name: (name: string) => void;
  p2Name: string;
  setP2Name: (name: string) => void;
  key?: string;
}

const languages = [
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
  { code: 'hi', label: 'हिंदी', flag: '🇮🇳' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
  { code: 'tr', label: 'Türkçe', flag: '🇹🇷' },
];

const nameLabels: Record<string, { p1: string; p2: string; title: string; lobbyTitle: string; lobbyDesc: string; placeholder: string }> = {
  ar: { 
    title: "إضافة لاعبين / البحث عن مواجهة", 
    p1: "اللاعب الأول", 
    p2: "اللاعب الثاني",
    lobbyTitle: "غرفة المواجهة المحلية",
    lobbyDesc: "اكتب أسماء اللاعبين لبدء المعركة",
    placeholder: "اكتب الاسم هنا..."
  },
  hi: { 
    title: "खिलाड़ी जोड़ें / मैच खोजें", 
    p1: "पहला खिलाड़ी", 
    p2: "दूसरा खिलाड़ी",
    lobbyTitle: "स्थानीय द्वंद्व लॉबी",
    lobbyDesc: "अपने द्वंद्व को शुरू करने के लिए नीचे खिलाड़ियों के नाम लिखें",
    placeholder: "यहाँ नाम लिखें..."
  },
  en: { 
    title: "Add Players / Search Match", 
    p1: "First Player", 
    p2: "Second Player",
    lobbyTitle: "Local Duel Lobby",
    lobbyDesc: "Type player names below to customize your duel",
    placeholder: "Type name here..."
  },
  de: { 
    title: "Spieler hinzufügen / Spiel suchen", 
    p1: "Erster Spieler", 
    p2: "Zweiter Spieler",
    lobbyTitle: "Lokale Duell-Lobby",
    lobbyDesc: "Geben Sie Spielernamen ein, um Ihr Duell anzupassen",
    placeholder: "Name eingeben..."
  },
  fr: { 
    title: "Ajouter des joueurs / Chercher un duel", 
    p1: "Premier Joueur", 
    p2: "Second Joueur",
    lobbyTitle: "Salon de Duel Local",
    lobbyDesc: "Saisissez les noms des joueurs ci-dessous",
    placeholder: "Écrire le nom..."
  },
  es: { 
    title: "Añadir jugadores / Buscar partida", 
    p1: "Primer Jugador", 
    p2: "Segundo Jugador",
    lobbyTitle: "Vestíbulo de Duelo Local",
    lobbyDesc: "Escribe los nombres de los jugadores abajo",
    placeholder: "Escribir nombre..."
  },
  it: { 
    title: "Aggiungi giocatori / Cerca partita", 
    p1: "Primo Giocatore", 
    p2: "Secondo Giocatore",
    lobbyTitle: "Lobby Duello Locale",
    lobbyDesc: "Scrivi i nomi dei giocatori qui sotto",
    placeholder: "Scrivi nome..."
  },
  ru: { 
    title: "Добавить игроков / Поиск матча", 
    p1: "Первый игрок", 
    p2: "Второй игрок",
    lobbyTitle: "Локальное лобби дуэли",
    lobbyDesc: "Введите имена игроков для настройки дуэли",
    placeholder: "Введите имя..."
  },
  zh: { 
    title: "添加玩家 / 搜索对决", 
    p1: "第一位玩家", 
    p2: "第二位玩家",
    lobbyTitle: "本地对决大厅",
    lobbyDesc: "在下方输入玩家姓名以开始对决",
    placeholder: "在此输入姓名..."
  },
  ja: { 
    title: "プレイヤー追加 / 対戦検索", 
    p1: "1人目のプレイヤー", 
    p2: "2人目のプレイヤー",
    lobbyTitle: "ローカル対戦ロビー",
    lobbyDesc: "以下にプレイヤー名を入力して開始します",
    placeholder: "名前を入力..."
  },
  tr: { 
    title: "Oyuncu Ekle / Maç Ara", 
    p1: "Birinci Oyuncu", 
    p2: "İkinci Oyuncu",
    lobbyTitle: "Yerel Düello Lobisi",
    lobbyDesc: "Düelloyu özelleştirmek için isimleri yazın",
    placeholder: "İsim yazın..."
  }
};

export default function SettingsScreen({
  lang,
  setLang,
  codeLength,
  setCodeLength,
  theme,
  setTheme,
  onNext,
  p1Name,
  setP1Name,
  p2Name,
  setP2Name,
}: SettingsScreenProps) {
  const t = i18n[lang] || i18n.en;
  const tc = themes[theme];
  const isRTL = lang === 'ar';
  const labels = nameLabels[lang] || nameLabels.en;

  // Toggle state for collapsible general settings
  const [showSettings, setShowSettings] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      id="screen-settings"
      className={`game-card max-w-2xl w-full p-6 md:p-8 rounded-3xl border relative overflow-visible shadow-2xl transition-all duration-300 ${tc.cardBg} ${tc.cardBorder} ${tc.glowShadow || ''}`}
    >
      
      {/* 1. TOP LOGO AND TITLE */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5 relative z-20">
        
        {/* Prominent Logo on Top */}
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl transition-all duration-300 ${
            theme === 'cyber' 
              ? 'bg-zinc-950/80 text-green-400 border border-green-500/35 shadow-[0_0_10px_rgba(34,197,94,0.2)]' 
              : theme === 'forest'
              ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/35'
              : theme === 'light'
              ? 'bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-sm'
              : 'bg-indigo-950/40 text-indigo-400 border border-indigo-800/25'
          }`}>
            <GCLogo className="w-10 h-10" />
          </div>
          <div>
            <h1 className={`text-2xl font-black tracking-tight leading-none ${tc.textPrimary}`}>
              GC <span className="opacity-90">{t.title.includes('GC') ? t.title.replace('GC: ', '') : t.title}</span>
            </h1>
            <p className={`text-[10px] font-bold uppercase tracking-widest mt-1 opacity-70 ${tc.textSecondary}`}>
              {labels.lobbyTitle}
            </p>
          </div>
        </div>
      </div>



      {/* 3. ADD PLAYERS / SEARCH MATCH SECTION ON TOP */}
      <div className="space-y-6 relative z-10">
        
        {/* Lobby search notification banner */}
        <div className={`p-4 rounded-2xl border flex items-center justify-between gap-3 text-sm font-semibold transition-all duration-300 ${
          theme === 'light' 
            ? 'bg-rose-50 border-rose-100 text-rose-800' 
            : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-200'
        }`}>
          <div className="flex items-center gap-2.5">
            <Users className="w-5 h-5 text-indigo-400 animate-bounce" />
            <div className="text-left">
              <span className="block font-black text-xs uppercase tracking-wider">{labels.title}</span>
              <span className="block text-[11px] opacity-75">{labels.lobbyDesc}</span>
            </div>
          </div>
          <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse shrink-0" />
        </div>

        {/* Player Names - Inputs are made completely BOLD font & search lobby style */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          
          {/* Player 1 Input */}
          <div className="space-y-2 text-left">
            <label className={`flex items-center gap-2 text-[11px] font-black uppercase tracking-wider opacity-90 ${tc.textSecondary}`}>
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span>{labels.p1}</span>
            </label>
            <div className="relative group">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={p1Name}
                onChange={(e) => setP1Name(e.target.value)}
                placeholder={labels.placeholder}
                maxLength={15}
                className={`w-full pl-10 pr-4 py-3.5 rounded-2xl border text-lg font-black tracking-wide ${tc.inputBg} ${tc.inputBorder} ${tc.inputText} focus:outline-none transition-all duration-200 uppercase focus:ring-2 focus:ring-indigo-500/25`}
              />
            </div>
          </div>

          {/* Player 2 Input */}
          <div className="space-y-2 text-left">
            <label className={`flex items-center gap-2 text-[11px] font-black uppercase tracking-wider opacity-90 ${tc.textSecondary}`}>
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
              <span>{labels.p2}</span>
            </label>
            <div className="relative group">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={p2Name}
                onChange={(e) => setP2Name(e.target.value)}
                placeholder={labels.placeholder}
                maxLength={15}
                className={`w-full pl-10 pr-4 py-3.5 rounded-2xl border text-lg font-black tracking-wide ${tc.inputBg} ${tc.inputBorder} ${tc.inputText} focus:outline-none transition-all duration-200 uppercase focus:ring-2 focus:ring-indigo-500/25`}
              />
            </div>
          </div>

        </div>

        {/* Play/Next Action Button */}
        <button
          id="btn-to-p1"
          onClick={onNext}
          className={`w-full py-4.5 px-6 mt-6 rounded-2xl font-black text-base uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 shadow-xl ${tc.primaryBtn}`}
        >
          <span>{t.next}</span>
          {isRTL ? <ChevronLeft className="w-5 h-5 stroke-[3]" /> : <ChevronRight className="w-5 h-5 stroke-[3]" />}
        </button>

      </div>
    </motion.div>
  );
}
