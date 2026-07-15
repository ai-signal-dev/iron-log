export type Locale = 'en' | 'ja'

const translations = {
  en: {
    // Nav
    workout: 'Workout',
    history: 'History',
    calendar: 'Calendar',
    stats: 'Stats',
    presets: 'Presets',
    settings: 'Settings',
    // Workout
    startWorkout: 'Start your workout',
    addExercise: 'Add Exercise',
    weightKg: 'Weight (kg)',
    reps: 'Reps',
    completeSet: 'Complete Set',
    completedSets: 'Completed Sets',
    set: 'Set',
    finishWorkout: 'Finish Workout',
    // Timer
    start: 'Start',
    pause: 'Pause',
    resume: 'Resume',
    reset: 'Reset',
    // Exercise Picker
    selectExercise: 'Select Exercise',
    searchExercises: 'Search exercises...',
    all: 'All',
    chest: 'Chest',
    back: 'Back',
    legs: 'Legs',
    shoulders: 'Shoulders',
    arms: 'Arms',
    core: 'Core',
    // History
    noWorkouts: 'No workouts recorded yet',
    sets: 'sets',
    // Calendar
    sun: 'Sun', mon: 'Mon', tue: 'Tue', wed: 'Wed', thu: 'Thu', fri: 'Fri', sat: 'Sat',
    // Stats
    selectExerciseLabel: 'Select Exercise',
    maxWeight: 'Max Weight (kg)',
    estimated1RM: 'Estimated 1RM (kg)',
    volume: 'Volume (kg)',
    noDataYet: 'No data yet for this exercise',
    // Presets
    presetName: 'Preset name (e.g. Chest Day)',
    savePreset: 'Save Preset',
    noPresets: 'No presets created yet',
    // Settings
    backup: 'Backup',
    exportData: 'Export Data',
    importData: 'Import Data',
    importSuccess: 'Import successful',
    importFailed: 'Import failed - invalid file',
    addCustomExercise: 'Add Custom Exercise',
    exerciseName: 'Exercise name',
    add: 'Add',
    language: 'Language',
    english: 'English',
    japanese: 'Japanese',
    userProfile: 'User Profile',
    userName: 'User name',
    switchUser: 'Switch User',
    createUser: 'Create User',
    currentUser: 'Current User',
    deleteUser: 'Delete User',
    deleteUserConfirm: 'Delete this user and all their data?',
    allDataLocal: 'All data stored locally on device',
  },
  ja: {
    // Nav
    workout: 'ワークアウト',
    history: '履歴',
    calendar: 'カレンダー',
    stats: '統計',
    presets: 'プリセット',
    settings: '設定',
    // Workout
    startWorkout: 'ワークアウトを始めよう',
    addExercise: '種目を追加',
    weightKg: '重量 (kg)',
    reps: 'レップ数',
    completeSet: 'セット完了',
    completedSets: '完了したセット',
    set: 'セット',
    finishWorkout: 'ワークアウト終了',
    // Timer
    start: 'スタート',
    pause: '一時停止',
    resume: '再開',
    reset: 'リセット',
    // Exercise Picker
    selectExercise: '種目を選択',
    searchExercises: '種目を検索...',
    all: 'すべて',
    chest: '胸',
    back: '背中',
    legs: '脚',
    shoulders: '肩',
    arms: '腕',
    core: '体幹',
    // History
    noWorkouts: 'まだ記録がありません',
    sets: 'セット',
    // Calendar
    sun: '日', mon: '月', tue: '火', wed: '水', thu: '木', fri: '金', sat: '土',
    // Stats
    selectExerciseLabel: '種目を選択',
    maxWeight: '最大重量 (kg)',
    estimated1RM: '推定1RM (kg)',
    volume: 'ボリューム (kg)',
    noDataYet: 'この種目のデータはまだありません',
    // Presets
    presetName: 'プリセット名（例: 胸の日）',
    savePreset: 'プリセット保存',
    noPresets: 'プリセットがまだありません',
    // Settings
    backup: 'バックアップ',
    exportData: 'データ書き出し',
    importData: 'データ読み込み',
    importSuccess: 'インポート成功',
    importFailed: 'インポート失敗 - 無効なファイル',
    addCustomExercise: 'カスタム種目を追加',
    exerciseName: '種目名',
    add: '追加',
    language: '言語',
    english: 'English',
    japanese: '日本語',
    userProfile: 'ユーザープロフィール',
    userName: 'ユーザー名',
    switchUser: 'ユーザー切替',
    createUser: 'ユーザー作成',
    currentUser: '現在のユーザー',
    deleteUser: 'ユーザー削除',
    deleteUserConfirm: 'このユーザーとすべてのデータを削除しますか？',
    allDataLocal: 'すべてのデータはデバイス内に保存されます',
  },
} as const

export type TranslationKey = keyof typeof translations.en

export function getTranslations(locale: Locale) {
  return translations[locale]
}
