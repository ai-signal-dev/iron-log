import { db, type Exercise } from './index'

const exercises: Omit<Exercise, 'id'>[] = [
  // Chest
  { name: 'Bench Press', nameJa: 'ベンチプレス', category: 'chest', isCustom: false },
  { name: 'Incline Bench Press', nameJa: 'インクラインベンチプレス', category: 'chest', isCustom: false },
  { name: 'Decline Bench Press', nameJa: 'デクラインベンチプレス', category: 'chest', isCustom: false },
  { name: 'Dumbbell Bench Press', nameJa: 'ダンベルベンチプレス', category: 'chest', isCustom: false },
  { name: 'Incline Dumbbell Press', nameJa: 'インクラインダンベルプレス', category: 'chest', isCustom: false },
  { name: 'Dumbbell Fly', nameJa: 'ダンベルフライ', category: 'chest', isCustom: false },
  { name: 'Cable Fly', nameJa: 'ケーブルフライ', category: 'chest', isCustom: false },
  { name: 'Chest Press Machine', nameJa: 'チェストプレスマシン', category: 'chest', isCustom: false },
  { name: 'Pec Deck', nameJa: 'ペックデック', category: 'chest', isCustom: false },
  { name: 'Push Up', nameJa: '腕立て伏せ', category: 'chest', isCustom: false },
  { name: 'Dips (Chest)', nameJa: 'ディップス（胸）', category: 'chest', isCustom: false },

  // Back
  { name: 'Deadlift', nameJa: 'デッドリフト', category: 'back', isCustom: false },
  { name: 'Barbell Row', nameJa: 'バーベルロウ', category: 'back', isCustom: false },
  { name: 'Dumbbell Row', nameJa: 'ダンベルロウ', category: 'back', isCustom: false },
  { name: 'Lat Pulldown', nameJa: 'ラットプルダウン', category: 'back', isCustom: false },
  { name: 'Seated Cable Row', nameJa: 'シーテッドケーブルロウ', category: 'back', isCustom: false },
  { name: 'T-Bar Row', nameJa: 'Tバーロウ', category: 'back', isCustom: false },
  { name: 'Pull Up', nameJa: '懸垂', category: 'back', isCustom: false },
  { name: 'Chin Up', nameJa: 'チンアップ', category: 'back', isCustom: false },
  { name: 'Face Pull', nameJa: 'フェイスプル', category: 'back', isCustom: false },
  { name: 'Hyperextension', nameJa: 'バックエクステンション', category: 'back', isCustom: false },
  { name: 'Rack Pull', nameJa: 'ラックプル', category: 'back', isCustom: false },
  { name: 'Pendlay Row', nameJa: 'ペンドレーロウ', category: 'back', isCustom: false },

  // Legs
  { name: 'Squat', nameJa: 'スクワット', category: 'legs', isCustom: false },
  { name: 'Front Squat', nameJa: 'フロントスクワット', category: 'legs', isCustom: false },
  { name: 'Leg Press', nameJa: 'レッグプレス', category: 'legs', isCustom: false },
  { name: 'Hack Squat', nameJa: 'ハックスクワット', category: 'legs', isCustom: false },
  { name: 'Romanian Deadlift', nameJa: 'ルーマニアンデッドリフト', category: 'legs', isCustom: false },
  { name: 'Leg Extension', nameJa: 'レッグエクステンション', category: 'legs', isCustom: false },
  { name: 'Leg Curl', nameJa: 'レッグカール', category: 'legs', isCustom: false },
  { name: 'Bulgarian Split Squat', nameJa: 'ブルガリアンスクワット', category: 'legs', isCustom: false },
  { name: 'Lunge', nameJa: 'ランジ', category: 'legs', isCustom: false },
  { name: 'Calf Raise', nameJa: 'カーフレイズ', category: 'legs', isCustom: false },
  { name: 'Seated Calf Raise', nameJa: 'シーテッドカーフレイズ', category: 'legs', isCustom: false },
  { name: 'Hip Thrust', nameJa: 'ヒップスラスト', category: 'legs', isCustom: false },
  { name: 'Goblet Squat', nameJa: 'ゴブレットスクワット', category: 'legs', isCustom: false },

  // Shoulders
  { name: 'Overhead Press', nameJa: 'オーバーヘッドプレス', category: 'shoulders', isCustom: false },
  { name: 'Dumbbell Shoulder Press', nameJa: 'ダンベルショルダープレス', category: 'shoulders', isCustom: false },
  { name: 'Arnold Press', nameJa: 'アーノルドプレス', category: 'shoulders', isCustom: false },
  { name: 'Lateral Raise', nameJa: 'サイドレイズ', category: 'shoulders', isCustom: false },
  { name: 'Front Raise', nameJa: 'フロントレイズ', category: 'shoulders', isCustom: false },
  { name: 'Rear Delt Fly', nameJa: 'リアデルトフライ', category: 'shoulders', isCustom: false },
  { name: 'Upright Row', nameJa: 'アップライトロウ', category: 'shoulders', isCustom: false },
  { name: 'Shrug', nameJa: 'シュラッグ', category: 'shoulders', isCustom: false },
  { name: 'Cable Lateral Raise', nameJa: 'ケーブルサイドレイズ', category: 'shoulders', isCustom: false },
  { name: 'Machine Shoulder Press', nameJa: 'マシンショルダープレス', category: 'shoulders', isCustom: false },

  // Arms
  { name: 'Barbell Curl', nameJa: 'バーベルカール', category: 'arms', isCustom: false },
  { name: 'Dumbbell Curl', nameJa: 'ダンベルカール', category: 'arms', isCustom: false },
  { name: 'Hammer Curl', nameJa: 'ハンマーカール', category: 'arms', isCustom: false },
  { name: 'Preacher Curl', nameJa: 'プリーチャーカール', category: 'arms', isCustom: false },
  { name: 'Concentration Curl', nameJa: 'コンセントレーションカール', category: 'arms', isCustom: false },
  { name: 'Cable Curl', nameJa: 'ケーブルカール', category: 'arms', isCustom: false },
  { name: 'Tricep Pushdown', nameJa: 'トライセプスプッシュダウン', category: 'arms', isCustom: false },
  { name: 'Overhead Tricep Extension', nameJa: 'オーバーヘッドトライセプス', category: 'arms', isCustom: false },
  { name: 'Skull Crusher', nameJa: 'スカルクラッシャー', category: 'arms', isCustom: false },
  { name: 'Close Grip Bench Press', nameJa: 'ナローベンチプレス', category: 'arms', isCustom: false },
  { name: 'Dips (Tricep)', nameJa: 'ディップス（三頭筋）', category: 'arms', isCustom: false },
  { name: 'Wrist Curl', nameJa: 'リストカール', category: 'arms', isCustom: false },

  // Core
  { name: 'Crunch', nameJa: 'クランチ', category: 'core', isCustom: false },
  { name: 'Plank', nameJa: 'プランク', category: 'core', isCustom: false },
  { name: 'Hanging Leg Raise', nameJa: 'ハンギングレッグレイズ', category: 'core', isCustom: false },
  { name: 'Cable Crunch', nameJa: 'ケーブルクランチ', category: 'core', isCustom: false },
  { name: 'Ab Roller', nameJa: 'アブローラー', category: 'core', isCustom: false },
  { name: 'Russian Twist', nameJa: 'ロシアンツイスト', category: 'core', isCustom: false },
  { name: 'Decline Sit Up', nameJa: 'デクラインシットアップ', category: 'core', isCustom: false },
  { name: 'Side Plank', nameJa: 'サイドプランク', category: 'core', isCustom: false },
  { name: 'Woodchop', nameJa: 'ウッドチョップ', category: 'core', isCustom: false },
]

export async function seedExercises() {
  try {
    const count = await db.exercises.count()
    if (count === 0) {
      await db.exercises.bulkAdd(exercises)
    } else {
      // Update existing exercises with Japanese names if missing
      const existing = await db.exercises.where('isCustom').equals(0).toArray()
      for (const ex of existing) {
        if (!ex.nameJa) {
          const match = exercises.find(e => e.name === ex.name)
          if (match) {
            await db.exercises.update(ex.id!, { nameJa: match.nameJa })
          }
        }
      }
    }
  } catch (e) {
    console.warn('Seed failed, re-creating exercises table', e)
    await db.exercises.clear()
    await db.exercises.bulkAdd(exercises)
  }
}
