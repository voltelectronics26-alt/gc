export type GameScreen = 'settings' | 'p1-setup' | 'p2-setup' | 'battle';

export type GameTheme = 'dark' | 'light' | 'cyber' | 'forest';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface GuessItem {
  guess: string;
  correctPos: number;
  wrongPos: number;
}

export interface TranslationSet {
  title: string;
  settings: string;
  codeLength: string;
  chooseLang: string;
  chooseBg: string;
  next: string;
  finish: string;
  startBattle: string;
  p1Setup: string;
  p2Setup: string;
  p1SetupDesc: string;
  p2SetupDesc: string;
  p1Board: string;
  p2Board: string;
  enterGuess: string;
  guessBtn: string;
  correctPos: string;
  wrongPos: string;
  winnerMsg: string;
  playAgain: string;
  themeDark: string;
  themeLight: string;
  themeCyber: string;
  themeForest: string;
  invalidCode: string;
  history: string;
  showCode: string;
  hideCode: string;
  player1: string;
  player2: string;
  digits: string;
  difficulty?: string;
  easy?: string;
  medium?: string;
  hard?: string;
  level?: string;
  hintBtn?: string;
  hintsLeft?: string;
  hintUsed?: string;
  levelUp?: string;
  noDuplicates?: string;
  duplicatesAllowed?: string;
  limitTurns?: string;
}

export const i18n: Record<string, TranslationSet> = {
  ar: {
    title: "GC: خمن الرمز",
    settings: "الإعدادات العامة",
    codeLength: "طول الرمز (عدد الأرقام):",
    chooseLang: "اختر لغة اللعبة:",
    chooseBg: "اختر تصميم اللعبة والخلفية:",
    next: "التالي",
    finish: "حفظ وإنهاء",
    startBattle: "ابدأ التحدي",
    p1Setup: "اللاعب 1: أدخل رمزك السري",
    p2Setup: "اللاعب 2: أدخل رمزك السري",
    p1SetupDesc: "اكتب {length} أرقام دون أن يراها اللاعب 2. هذا هو الرمز الذي سيحاول تخمينه!",
    p2SetupDesc: "اكتب {length} أرقام دون أن يراها اللاعب 1. هذا هو الرمز الذي سيحاول تخمينه!",
    p1Board: "اللاعب 1 (خمن رمز اللاعب 2)",
    p2Board: "اللاعب 2 (خمن رمز اللاعب 1)",
    enterGuess: "أدخل تخمينك...",
    guessBtn: "خمن",
    correctPos: "في مكانه الصحيح",
    wrongPos: "موجود بمكان آخر",
    winnerMsg: "🎉 مبروك! اللاعب {player} فاز باللعبة وكسر الشفرة!",
    playAgain: "إعادة اللعب",
    themeDark: "الفضاء الداكن",
    themeLight: "النهار الهادئ",
    themeCyber: "السايبربانك",
    themeForest: "الغابة الزمردية",
    invalidCode: "يرجى إدخال رمز صحيح يتكون من {length} أرقام بالضبط!",
    history: "سجل التخمينات",
    showCode: "إظهار الرمز",
    hideCode: "إخفاء الرمز",
    player1: "اللاعب 1",
    player2: "اللاعب 2",
    digits: "أرقام",
    difficulty: "درجة الصعوبة",
    easy: "سهل (بدون أرقام مكررة)",
    medium: "متوسط (أرقام مكررة مسموحة)",
    hard: "صعب (مكرر + حد أقصى 10 محاولات)",
    level: "المستوى",
    hintBtn: "تلميح سريع",
    hintsLeft: "التلميحات المتبقية",
    hintUsed: "تم استهلاك التلميح",
    levelUp: "تم تجاوز المستوى بنجاح!",
    noDuplicates: "بدون تكرار",
    duplicatesAllowed: "تكرار مسموح",
    limitTurns: "حد المحاولات"
  },
  hi: {
    title: "GC: कोड अनुमान",
    settings: "सामान्य सेटिंग्स",
    codeLength: "कोड की लंबाई (अंक):",
    chooseLang: "भाषा चुनें:",
    chooseBg: "थीम चुनें:",
    next: "अगला",
    finish: "सुरक्षित करें",
    startBattle: "द्वंद्व शुरू करें",
    p1Setup: "खिलाड़ी 1: गुप्त कोड सेट करें",
    p2Setup: "खिलाड़ी 2: गुप्त कोड सेट करें",
    p1SetupDesc: "खिलाड़ी 2 से गुप्त {length} अंक दर्ज करें।",
    p2SetupDesc: "खिलाड़ी 1 से गुप्त {length} अंक दर्ज करें।",
    p1Board: "खिलाड़ी 1 (खिलाड़ी 2 के कोड का अनुमान लगाएं)",
    p2Board: "खिलाड़ी 2 (खिलाड़ी 1 के कोड का अनुमान लगाएं)",
    enterGuess: "अनुमान दर्ज करें...",
    guessBtn: "अनुमान लगाएं",
    correctPos: "सही स्थान पर",
    wrongPos: "गलत स्थान लेकिन सही अंक",
    winnerMsg: "🎉 बधाई हो! खिलाड़ी {player} ने कोड क्रैक किया और जीत हासिल की!",
    playAgain: "फिर से खेलें",
    themeDark: "डार्क स्पेस",
    themeLight: "सॉफ्ट डे",
    themeCyber: "साइबरपंक",
    themeForest: "एमराल्ड फॉरेस्ट",
    invalidCode: "कृपया ठीक {length} अंकों का मान्य कोड दर्ज करें!",
    history: "अनुमान इतिहास",
    showCode: "कोड दिखाएं",
    hideCode: "कोड छुपाएं",
    player1: "खिलाड़ी 1",
    player2: "खिलाड़ी 2",
    digits: "अंक",
    difficulty: "कठिनाई",
    easy: "आसान (कोई डुप्लिकेट नहीं)",
    medium: "मध्यम (डुप्लिकेट की अनुमति)",
    hard: "कठिन (डुप्लिकेट + अधिकतम 10 प्रयास)",
    hintBtn: "संकेत लें",
    hintsLeft: "संकेत शेष",
    hintUsed: "संकेत सक्रिय",
    noDuplicates: "कोई डुप्लिकेट नहीं",
    duplicatesAllowed: "डुप्लिकेट की अनुमति",
    limitTurns: "प्रयास सीमित करें"
  },
  en: {
    title: "GC: Guess Code",
    settings: "General Settings",
    codeLength: "Code Length (Digits):",
    chooseLang: "Choose Language:",
    chooseBg: "Choose Game Theme:",
    next: "Next",
    finish: "Save & Finish",
    startBattle: "Start Duel",
    p1Setup: "Player 1: Set Your Secret Code",
    p2Setup: "Player 2: Set Your Secret Code",
    p1SetupDesc: "Enter {length} digits. Keep it hidden from Player 2!",
    p2SetupDesc: "Enter {length} digits. Keep it hidden from Player 1!",
    p1Board: "Player 1 (Guess Player 2's Code)",
    p2Board: "Player 2 (Guess Player 1's Code)",
    enterGuess: "Enter your guess...",
    guessBtn: "Guess",
    correctPos: "Correct spot",
    wrongPos: "Wrong spot but right number",
    winnerMsg: "🎉 Congratulations! Player {player} cracked the code and won!",
    playAgain: "Play Again",
    themeDark: "Dark Space",
    themeLight: "Soft Day",
    themeCyber: "Cyberpunk",
    themeForest: "Emerald Forest",
    invalidCode: "Please enter a valid code of exactly {length} digits!",
    history: "Guess History",
    showCode: "Show Code",
    hideCode: "Hide Code",
    player1: "Player 1",
    player2: "Player 2",
    digits: "Digits",
    difficulty: "Difficulty",
    easy: "Easy (No duplicate digits)",
    medium: "Medium (Duplicates allowed)",
    hard: "Hard (Duplicates + Max 10 turns)",
    level: "Level",
    hintBtn: "Get Hint",
    hintsLeft: "Hints Left",
    hintUsed: "Hint Activated",
    levelUp: "Level Cleared!",
    noDuplicates: "No Duplicates",
    duplicatesAllowed: "Duplicates Allowed",
    limitTurns: "Limit Turns"
  },
  de: {
    title: "GC: Guess Code",
    settings: "Allgemeine Einstellungen",
    codeLength: "Codelänge (Ziffern):",
    chooseLang: "Sprache wählen:",
    chooseBg: "Thema wählen:",
    next: "Weiter",
    finish: "Speichern & Beenden",
    startBattle: "Duell starten",
    p1Setup: "Spieler 1: Geheimcode festlegen",
    p2Setup: "Spieler 2: Geheimcode festlegen",
    p1SetupDesc: "Geben Sie {length} Ziffern ein (vor Spieler 2 verbergen)!",
    p2SetupDesc: "Geben Sie {length} Ziffern ein (vor Spieler 1 verbergen)!",
    p1Board: "Spieler 1 (Rät den Code von Spieler 2)",
    p2Board: "Spieler 2 (Rät den Code von Spieler 1)",
    enterGuess: "Tipp eingeben...",
    guessBtn: "Raten",
    correctPos: "An der richtigen Stelle",
    wrongPos: "Falsche Stelle, aber richtige Zahl",
    winnerMsg: "🎉 Glückwunsch! Spieler {player} hat den Code geknackt!",
    playAgain: "Nochmal spielen",
    themeDark: "Dunkler Weltraum",
    themeLight: "Sanfter Tag",
    themeCyber: "Cyberpunk",
    themeForest: "Smaragdwald",
    invalidCode: "Bitte geben Sie einen gültigen Code mit genau {length} Ziffern ein!",
    history: "Tipp-Verlauf",
    showCode: "Code anzeigen",
    hideCode: "Code ausblenden",
    player1: "Spieler 1",
    player2: "Spieler 2",
    digits: "Ziffern"
  },
  fr: {
    title: "Duel de Décodeurs",
    settings: "Paramètres Généraux",
    codeLength: "Longueur du code (chiffres) :",
    chooseLang: "Choisir la langue :",
    chooseBg: "Choisir le thème :",
    next: "Suivant",
    finish: "Enregistrer & Terminer",
    startBattle: "Démarrer le Duel",
    p1Setup: "Joueur 1 : Définir le code secret",
    p2Setup: "Joueur 2 : Définir le code secret",
    p1SetupDesc: "Entrez {length} chiffres à l'abri du Joueur 2 !",
    p2SetupDesc: "Entrez {length} chiffres à l'abri du Joueur 1 !",
    p1Board: "Joueur 1 (Devine le code du Joueur 2)",
    p2Board: "Joueur 2 (Devine le code du Joueur 1)",
    enterGuess: "Entrez votre essai...",
    guessBtn: "Deviner",
    correctPos: "À la bonne place",
    wrongPos: "Mauvaise place mais bon chiffre",
    winnerMsg: "🎉 Félicitations ! Le Joueur {player} a gagné !",
    playAgain: "Rejouer",
    themeDark: "Espace Sombre",
    themeLight: "Jour Doux",
    themeCyber: "Cyberpunk",
    themeForest: "Forêt d'Émeraude",
    invalidCode: "Veuillez entrer un code valide de exactement {length} chiffres !",
    history: "Historique",
    showCode: "Afficher",
    hideCode: "Masquer",
    player1: "Joueur 1",
    player2: "Joueur 2",
    digits: "Chiffres"
  },
  es: {
    title: "Duelo de Códigos",
    settings: "Ajustes Generales",
    codeLength: "Longitud del Código (Dígitos):",
    chooseLang: "Elegir Idioma:",
    chooseBg: "Elegir Tema:",
    next: "Siguiente",
    finish: "Guardar y Finalizar",
    startBattle: "Iniciar Duelo",
    p1Setup: "Jugador 1: Define tu Código Secreto",
    p2Setup: "Jugador 2: Define tu Código Secreto",
    p1SetupDesc: "Ingresa {length} dígitos ocultos del Jugador 2.",
    p2SetupDesc: "Ingresa {length} dígitos ocultos del Jugador 1.",
    p1Board: "Jugador 1 (Adivina el código del Jugador 2)",
    p2Board: "Jugador 2 (Adivina el código del Jugador 1)",
    enterGuess: "Ingresa tu intento...",
    guessBtn: "Adivinar",
    correctPos: "En el lugar correcto",
    wrongPos: "Lugar equivocado pero número correcto",
    winnerMsg: "🎉 ¡Felicidades! ¡El Jugador {player} ha ganado!",
    playAgain: "Jugar de Nuevo",
    themeDark: "Espacio Oscuro",
    themeLight: "Día Suave",
    themeCyber: "Cyberpunk",
    themeForest: "Bosque de Esmeralda",
    invalidCode: "¡Ingresa un código válido de exactamente {length} dígitos!",
    history: "Historial de Intentos",
    showCode: "Mostrar",
    hideCode: "Ocultar",
    player1: "Jugador 1",
    player2: "Jugador 2",
    digits: "Dígitos"
  },
  it: {
    title: "Duello di Codici",
    settings: "Impostazioni Generali",
    codeLength: "Lunghezza Codice (Cifre):",
    chooseLang: "Scegli Lingua:",
    chooseBg: "Scegli Tema:",
    next: "Avanti",
    finish: "Salva e Finisci",
    startBattle: "Inizia Duello",
    p1Setup: "Giocatore 1: Imposta il Codice",
    p2Setup: "Giocatore 2: Imposta il Codice",
    p1SetupDesc: "Inserisci {length} cifre nascosto dal Giocatore 2.",
    p2SetupDesc: "Inserisci {length} cifre nascosto dal Giocatore 1.",
    p1Board: "Giocatore 1 (Indovina il codice del Giocatore 2)",
    p2Board: "Giocatore 2 (Indovina il codice del Giocatore 1)",
    enterGuess: "Inserisci tentativo...",
    guessBtn: "Indovina",
    correctPos: "Al posto giusto",
    wrongPos: "Posto errato ma cifra corretta",
    winnerMsg: "🎉 Congratulazioni! Il Giocatore {player} ha vinto!",
    playAgain: "Gioca Ancora",
    themeDark: "Spazio Oscuro",
    themeLight: "Giorno Delicato",
    themeCyber: "Cyberpunk",
    themeForest: "Foresta di Smeraldo",
    invalidCode: "Inserisci un codice valido di esattamente {length} cifre!",
    history: "Cronologia",
    showCode: "Mostra",
    hideCode: "Nascondi",
    player1: "Giocatore 1",
    player2: "Giocatore 2",
    digits: "Cifre"
  },
  ru: {
    title: "Дуэль Взломщиков",
    settings: "Общие Настройки",
    codeLength: "Длина кода (цифры):",
    chooseLang: "Выберите язык:",
    chooseBg: "Выберите тему:",
    next: "Далее",
    finish: "Сохранить и закончить",
    startBattle: "Начать дуэль",
    p1Setup: "Игрок 1: Задайте секретный код",
    p2Setup: "Игрок 2: Задайте секретный код",
    p1SetupDesc: "Введите {length} цифр скрытно от Игрока 2.",
    p2SetupDesc: "Введите {length} цифр скрытно от Игрока 1.",
    p1Board: "Игрок 1 (Угадывает код Игрока 2)",
    p2Board: "Игрок 2 (Угадывает код Игрока 1)",
    enterGuess: "Введите догадку...",
    guessBtn: "Угадать",
    correctPos: "На своем месте",
    wrongPos: "В другом месте, но цифра верна",
    winnerMsg: "🎉 Поздравляем! Игрок {player} разгадал код!",
    playAgain: "Играть снова",
    themeDark: "Темный космос",
    themeLight: "Светлый день",
    themeCyber: "Киберпанк",
    themeForest: "Изумрудный лес",
    invalidCode: "Введите корректный код ровно из {length} цифр!",
    history: "История попыток",
    showCode: "Показать код",
    hideCode: "Скрыть код",
    player1: "Игрок 1",
    player2: "Игрок 2",
    digits: "Цифры"
  },
  zh: {
    title: "密码破译双人对决",
    settings: "通用设置",
    codeLength: "密码长度 (数字位数):",
    chooseLang: "选择语言:",
    chooseBg: "选择游戏主题:",
    next: "下一步",
    finish: "保存并完成",
    startBattle: "开始对决",
    p1Setup: "玩家 1：设置秘密密码",
    p2Setup: "玩家 2：设置秘密密码",
    p1SetupDesc: "输入 {length} 位数字，不要让玩家 2 看到。",
    p2SetupDesc: "输入 {length} 位数字，不要让玩家 1 看到。",
    p1Board: "玩家 1 (猜测玩家 2 的密码)",
    p2Board: "玩家 2 (猜测玩家 1 的密码)",
    enterGuess: "输入猜测...",
    guessBtn: "猜测",
    correctPos: "位置正确",
    wrongPos: "数字对但位置错",
    winnerMsg: "🎉 恭喜！玩家 {player} 成功破译密码！",
    playAgain: "再玩一次",
    themeDark: "深邃太空",
    themeLight: "温和白昼",
    themeCyber: "赛博朋克",
    themeForest: "翡翠森林",
    invalidCode: "请输入正好 {length} 位有效数字密码！",
    history: "猜测记录",
    showCode: "显示密码",
    hideCode: "隐藏密码",
    player1: "玩家 1",
    player2: "玩家 2",
    digits: "位数字"
  },
  ja: {
    title: "コードブレイカー",
    settings: "全般設定",
    codeLength: "コードの長さ（桁数）:",
    chooseLang: "言語を選択:",
    chooseBg: "テーマを選択:",
    next: "次へ",
    finish: "保存して終了",
    startBattle: "デュエル開始",
    p1Setup: "プレイヤー 1: コード設定",
    p2Setup: "プレイヤー 2: コード設定",
    p1SetupDesc: "プレイヤー 2 に秘密で {length} 桁の数字を入力してください。",
    p2SetupDesc: "プレイヤー 1 に秘密で {length} 桁の数字を入力してください。",
    p1Board: "プレイヤー 1 (相手のコードを推理)",
    p2Board: "プレイヤー 2 (相手のコードを推理)",
    enterGuess: "推測を入力...",
    guessBtn: "推理",
    correctPos: "位置も合っている",
    wrongPos: "数字のみ合っている",
    winnerMsg: "🎉 おめでとうございます！プレイヤー {player} の勝利です！",
    playAgain: "もう一度遊ぶ",
    themeDark: "ダークスペース",
    themeLight: "ソフトデイ",
    themeCyber: "サイバーパンク",
    themeForest: "エメラルドの森",
    invalidCode: "正確に {length} 桁のコードを入力してください！",
    history: "推測履歴",
    showCode: "表示",
    hideCode: "非表示",
    player1: "プレイヤー 1",
    player2: "プレイヤー 2",
    digits: "桁"
  },
  tr: {
    title: "Kod Kırıcı Düellosu",
    settings: "Genel Ayarlar",
    codeLength: "Kod Uzunluğu (Basamak):",
    chooseLang: "Dil Seçin:",
    chooseBg: "Tema Seçin:",
    next: "İleri",
    finish: "Kaydet ve Bitir",
    startBattle: "Düelloyu Başlat",
    p1Setup: "Oyuncu 1: Gizli Kodunu Belirle",
    p2Setup: "Oyuncu 2: Gizli Kodunu Belirle",
    p1SetupDesc: "Oyuncu 2'den gizli {length} basamaklı kod girin.",
    p2SetupDesc: "Oyuncu 1'den gizli {length} basamaklı kod girin.",
    p1Board: "Oyuncu 1 (Oyuncu 2'nin kodunu tahmin ediyor)",
    p2Board: "Oyuncu 2 (Oyuncu 1'in kodunu tahmin ediyor)",
    enterGuess: "Tahmininizi girin...",
    guessBtn: "Tahmin Et",
    correctPos: "Doğru Konumda",
    wrongPos: "Yanlış Konumda ama doğru sayı",
    winnerMsg: "🎉 Tebrikler! Oyuncu {player} kodu kırdı ve kazandı!",
    playAgain: "Tekrar Oyna",
    themeDark: "Karanlık Uzay",
    themeLight: "Yumuşak Gün",
    themeCyber: "Siberpunk",
    themeForest: "Zümrüt Ormanı",
    invalidCode: "Lütfen tam olarak {length} basamaklı bir kod girin!",
    history: "Tahmin Geçmişi",
    showCode: "Göster",
    hideCode: "Gizle",
    player1: "Oyuncu 1",
    player2: "Oyuncu 2",
    digits: "Basamak"
  }
};

export interface ThemeClasses {
  bodyBg: string;
  cardBg: string;
  cardBorder: string;
  textPrimary: string;
  textSecondary: string;
  inputBg: string;
  inputBorder: string;
  inputText: string;
  primaryBtn: string;
  accentText: string;
  p1Accent: string;
  p2Accent: string;
  scrollbarThumb: string;
  glowShadow?: string;
}

export const themes: Record<GameTheme, ThemeClasses> = {
  dark: {
    bodyBg: "bg-slate-950 text-slate-100 font-sans",
    cardBg: "bg-white/5 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] border border-white/10",
    cardBorder: "border-white/10",
    textPrimary: "text-white",
    textSecondary: "text-slate-400",
    inputBg: "bg-white/10",
    inputBorder: "border-white/20 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20",
    inputText: "text-white font-mono",
    primaryBtn: "bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-600/20 transition-all active:scale-95",
    accentText: "text-indigo-400",
    p1Accent: "bg-rose-500/20 text-rose-300 border-rose-500/30",
    p2Accent: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
    scrollbarThumb: "bg-white/10"
  },
  light: {
    bodyBg: "bg-slate-100 text-slate-800 font-sans",
    cardBg: "bg-white/40 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(31,41,55,0.08)] border border-white/40",
    cardBorder: "border-white/40",
    textPrimary: "text-slate-900",
    textSecondary: "text-slate-500",
    inputBg: "bg-white/30",
    inputBorder: "border-white/30 focus:border-indigo-600/50 focus:ring-2 focus:ring-indigo-600/20",
    inputText: "text-slate-900 font-mono",
    primaryBtn: "bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-600/20 transition-all active:scale-95",
    accentText: "text-indigo-600",
    p1Accent: "bg-rose-500/15 text-rose-600 border border-rose-200",
    p2Accent: "bg-cyan-500/15 text-cyan-600 border border-cyan-200",
    scrollbarThumb: "bg-slate-300"
  },
  cyber: {
    bodyBg: "bg-black text-green-400 font-mono",
    cardBg: "bg-zinc-950/40 border border-green-500/30 backdrop-blur-md shadow-[0_8px_32px_0_rgba(34,197,94,0.1)]",
    cardBorder: "border-green-500/30",
    textPrimary: "text-green-400",
    textSecondary: "text-green-600/80",
    inputBg: "bg-black/5",
    inputBorder: "border-green-500/20 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20",
    inputText: "text-green-400 font-mono",
    primaryBtn: "bg-purple-600 hover:bg-purple-500 text-yellow-300 border border-purple-400/40 shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all active:scale-95",
    accentText: "text-purple-400",
    p1Accent: "bg-red-950/20 text-red-400 border border-red-500/30",
    p2Accent: "bg-cyan-950/20 text-cyan-400 border border-cyan-500/30",
    scrollbarThumb: "bg-green-950"
  },
  forest: {
    bodyBg: "bg-emerald-950 text-emerald-100 font-sans",
    cardBg: "bg-emerald-900/30 backdrop-blur-xl border border-emerald-500/10 shadow-[0_8px_32px_0_rgba(4,47,46,0.3)]",
    cardBorder: "border-emerald-500/10",
    textPrimary: "text-emerald-50",
    textSecondary: "text-emerald-300",
    inputBg: "bg-emerald-950/40",
    inputBorder: "border-emerald-500/25 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20",
    inputText: "text-emerald-100 font-mono",
    primaryBtn: "bg-teal-600 hover:bg-teal-500 text-white rounded-xl shadow-lg shadow-teal-500/20 transition-all active:scale-95",
    accentText: "text-teal-400",
    p1Accent: "bg-rose-950/20 text-rose-300 border border-rose-800/30",
    p2Accent: "bg-cyan-950/20 text-cyan-300 border border-cyan-800/30",
    scrollbarThumb: "bg-emerald-800"
  }
};
