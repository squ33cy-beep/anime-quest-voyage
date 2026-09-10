import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Lang = "en" | "th";

const dict = {
  "nav.discover": { en: "Discover", th: "หน้าแรก" },
  "nav.browse": { en: "Browse", th: "ค้นหา" },
  "nav.myList": { en: "My List", th: "รายการของฉัน" },
  "nav.home": { en: "Home", th: "หน้าแรก" },
  "nav.search": { en: "Search", th: "ค้นหา" },
  "nav.saved": { en: "Saved", th: "บันทึกไว้" },
  "nav.signIn": { en: "Sign in", th: "เข้าสู่ระบบ" },
  "action.login": { en: "Log in", th: "เข้าสู่ระบบ" },
  "action.viewDetails": { en: "View Details", th: "ดูรายละเอียด" },
  "action.myList": { en: "My list", th: "เพิ่มในรายการ" },
  "action.inMyList": { en: "In my list", th: "อยู่ในรายการแล้ว" },
  "action.addToList": { en: "Add to my list", th: "เพิ่มในรายการของฉัน" },
  "action.browseAll": { en: "Browse all", th: "ดูทั้งหมด" },
  "action.browseAnime": { en: "Browse anime", th: "เลือกดูอนิเมะ" },
  "action.advancedSearch": { en: "Advanced Search", th: "ค้นหาขั้นสูง" },
  "action.clear": { en: "Clear", th: "ล้างค่า" },
  "home.popular": { en: "Popular now", th: "ยอดนิยมตอนนี้" },
  "home.airing": { en: "Currently airing", th: "กำลังออนแอร์" },
  "home.topRated": { en: "Top rated", th: "คะแนนสูงสุด" },
  "search.title": { en: "Browse the catalogue", th: "เลือกดูอนิเมะทั้งหมด" },
  "search.searching": { en: "Searching…", th: "กำลังค้นหา…" },
  "search.placeholder": { en: "Search by title…", th: "ค้นหาด้วยชื่อเรื่อง…" },
  "search.genre": { en: "Genre", th: "หมวดหมู่" },
  "search.genres": { en: "Genres", th: "หมวดหมู่" },
  "search.year": { en: "Year", th: "ปี" },
  "search.allGenres": { en: "All genres", th: "ทุกหมวดหมู่" },
  "search.allYears": { en: "All years", th: "ทุกปี" },
  "search.multiGenreHint": {
    en: "Pick several genres — results must match all of them.",
    th: "เลือกได้หลายหมวดหมู่ — ผลลัพธ์ต้องตรงทุกหมวดที่เลือก",
  },
  "search.noResults": { en: "No titles found", th: "ไม่พบอนิเมะ" },
  "search.loadError": { en: "Couldn't load results", th: "โหลดผลลัพธ์ไม่สำเร็จ" },
  "search.tryAgain": {
    en: "Try a different keyword, or loosen the genre and year filters.",
    th: "ลองใช้คำค้นอื่น หรือลดตัวกรองหมวดหมู่และปี",
  },
  "count.titles": { en: "titles match your filters.", th: "เรื่องตรงกับตัวกรองของคุณ" },
  "count.title": { en: "title matches your filters.", th: "เรื่องตรงกับตัวกรองของคุณ" },
  "fav.title": { en: "My list", th: "รายการของฉัน" },
  "fav.savedTitles": { en: "saved titles", th: "เรื่องที่บันทึกไว้" },
  "fav.savedTitle": { en: "saved title", th: "เรื่องที่บันทึกไว้" },
  "fav.emptyTitle": { en: "Nothing saved yet", th: "ยังไม่มีรายการที่บันทึก" },
  "fav.emptyBody": {
    en: "Tap the heart on any poster and it will show up here, ready for your next watchlist.",
    th: "กดรูปหัวใจบนโปสเตอร์ แล้วเรื่องนั้นจะมาปรากฏที่นี่",
  },
  "detail.score": { en: "Score", th: "คะแนน" },
  "detail.status": { en: "Status", th: "สถานะ" },
  "detail.episodes": { en: "Episodes", th: "ตอน" },
  "detail.year": { en: "Year", th: "ปี" },
  "detail.moreLikeThis": { en: "More like this", th: "เรื่องที่คล้ายกัน" },
  "detail.notFound": {
    en: "That title isn't in the catalogue",
    th: "ไม่พบเรื่องนี้ในระบบ",
  },
  "detail.notFoundBody": {
    en: "Try browsing the catalogue to find something else.",
    th: "ลองเลือกดูเรื่องอื่นในหน้าค้นหา",
  },
  "status.airing": { en: "Currently Airing", th: "กำลังออนแอร์" },
  "status.upcoming": { en: "Not Yet Aired", th: "ยังไม่ออกอากาศ" },
  "status.finished": { en: "Finished Airing", th: "ออกอากาศจบแล้ว" },
  "load.error": {
    en: "Couldn't load these titles right now. Please try again in a moment.",
    th: "โหลดรายการนี้ไม่ได้ในขณะนี้ กรุณาลองอีกครั้ง",
  },
  "misc.tba": { en: "TBA", th: "รอประกาศ" },
  "nav.schedule": { en: "My Schedule", th: "ตารางของฉัน" },
  "schedule.title": { en: "My Schedule", th: "ตารางออกอากาศของฉัน" },
  "schedule.subtitle": {
    en: "Saved titles that are currently airing, grouped by broadcast day.",
    th: "เรื่องที่บันทึกไว้และกำลังออนแอร์ จัดกลุ่มตามวันออกอากาศ",
  },
  "schedule.emptyTitle": {
    en: "No airing titles in your list",
    th: "ยังไม่มีเรื่องที่กำลังออนแอร์ในรายการ",
  },
  "schedule.emptyBody": {
    en: "Save a currently airing anime and it will appear on the day it broadcasts.",
    th: "บันทึกอนิเมะที่กำลังออนแอร์ แล้วจะปรากฏในวันที่ออกอากาศ",
  },
  "schedule.unknownDay": { en: "Day not announced", th: "ยังไม่ระบุวัน" },
  "day.monday": { en: "Monday", th: "จันทร์" },
  "day.tuesday": { en: "Tuesday", th: "อังคาร" },
  "day.wednesday": { en: "Wednesday", th: "พุธ" },
  "day.thursday": { en: "Thursday", th: "พฤหัสบดี" },
  "day.friday": { en: "Friday", th: "ศุกร์" },
  "day.saturday": { en: "Saturday", th: "เสาร์" },
  "day.sunday": { en: "Sunday", th: "อาทิตย์" },
} as const;

export type TKey = keyof typeof dict;

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (key: TKey) => string };

const LanguageContext = createContext<Ctx | null>(null);
const STORAGE_KEY = "aniverse:lang";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "th" || stored === "en") setLangState(stored);
  }, []);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo<Ctx>(
    () => ({ lang, setLang, t: (key: TKey) => dict[key][lang] }),
    [lang, setLang],
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

// Fall back to English instead of throwing, so a component rendered outside the
// provider (e.g. during a hot reload) never blanks the page.
const fallback: Ctx = {
  lang: "en",
  setLang: () => {},
  t: (key: TKey) => dict[key].en,
};

export function useLanguage(): Ctx {
  return useContext(LanguageContext) ?? fallback;
}

export function statusKey(status: "Airing" | "Upcoming" | "Finished"): TKey {
  if (status === "Airing") return "status.airing";
  if (status === "Upcoming") return "status.upcoming";
  return "status.finished";
}
