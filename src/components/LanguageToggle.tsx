import { useLanguage, type Lang } from "@/lib/i18n";

const options: { value: Lang; label: string }[] = [
  { value: "th", label: "TH" },
  { value: "en", label: "EN" },
];

export function LanguageToggle() {
  const { lang, setLang } = useLanguage();

  return (
    <div
      role="group"
      aria-label="Language"
      className="inline-flex shrink-0 items-center rounded-full border border-line bg-panel/60 p-0.5 backdrop-blur-md"
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => setLang(option.value)}
          aria-pressed={lang === option.value}
          className={`rounded-full px-2.5 py-1 text-xs font-bold transition ${
            lang === option.value
              ? "bg-gradient-to-r from-brand to-cyan text-primary-foreground shadow-md shadow-brand/30"
              : "text-slate-400 hover:text-foreground"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
