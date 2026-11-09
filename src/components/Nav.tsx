import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { EASE, useActiveSection } from "../lib/hooks";
import { Logo } from "./Logo";

export const NAV_LINKS = [
  { id: "mechanism", label: "Механизм" },
  { id: "timeline", label: "Хронология" },
  { id: "year2026", label: "2026" },
  { id: "simulator", label: "Симулятор" },
  { id: "trust", label: "Доверие" },
  { id: "proposal", label: "Выводы" },
  { id: "faq", label: "Вопросы" },
];

const IDS = NAV_LINKS.map((l) => l.id);

export function Nav({ home = true }: { home?: boolean }) {
  const active = useActiveSection(home ? IDS : []);
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 });

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const href = (id: string) => (home ? `#${id}` : `/#${id}`);

  return (
    <>
      {home && (
        <motion.div
          aria-hidden
          className="fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-oil"
          style={{ scaleX: progress }}
        />
      )}
      <header className="pointer-events-none fixed inset-x-0 top-3 z-40 flex justify-center px-4">
        <nav
          aria-label="Основная навигация"
          className="pointer-events-auto flex items-center gap-2 rounded-2xl border border-line bg-surface-1/70 p-2 backdrop-blur-xl"
        >
          <a
            href={home ? "#top" : "/"}
            className="flex items-center gap-2 rounded-xl px-2 py-1 transition-opacity duration-300 ease-soft hover:opacity-80"
            aria-label="Отсечка, на главную"
          >
            <Logo className="h-6 w-6" />
            <span className="title-4 text-fg">Отсечка</span>
          </a>

          <ul className="hidden items-center lg:flex">
            {NAV_LINKS.map((l) => {
              const isActive = active === l.id;
              return (
                <li key={l.id} className="relative">
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-lg bg-surface-3"
                      transition={{ duration: reduce ? 0 : 0.5, ease: EASE }}
                    />
                  )}
                  <a
                    href={href(l.id)}
                    aria-current={isActive ? "true" : undefined}
                    className={`caption-1 relative block rounded-lg px-3 py-1 transition-colors duration-300 ease-soft ${
                      isActive ? "text-fg" : "text-muted hover:text-fg"
                    }`}
                  >
                    {l.label}
                  </a>
                </li>
              );
            })}
          </ul>

          <a
            href={href("simulator")}
            className="button-sm hidden rounded-xl bg-fg px-3 py-1 text-ink transition-[transform,opacity] duration-300 ease-soft hover:opacity-90 active:scale-[0.98] sm:inline-flex"
          >
            Открыть симулятор
          </a>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Закрыть меню" : "Открыть меню"}
            className="relative grid h-8 w-8 place-items-center rounded-lg transition-colors duration-300 ease-soft hover:bg-surface-3 active:scale-[0.98] lg:hidden"
          >
            <motion.span
              className="absolute h-0.5 w-4 rounded-full bg-fg"
              animate={open ? { rotate: 45, y: 0 } : { rotate: 0, y: -3 }}
              transition={{ duration: 0.5, ease: EASE }}
            />
            <motion.span
              className="absolute h-0.5 w-4 rounded-full bg-fg"
              animate={open ? { rotate: -45, y: 0 } : { rotate: 0, y: 3 }}
              transition={{ duration: 0.5, ease: EASE }}
            />
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-30 bg-ink/95 backdrop-blur-2xl lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            <ul className="flex h-full flex-col justify-center gap-2 px-6">
              {NAV_LINKS.map((l, i) => (
                <motion.li
                  key={l.id}
                  initial={{ opacity: 0, y: reduce ? 0 : 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: EASE, delay: Math.min(i * 0.05, 0.4) }}
                >
                  <a
                    href={href(l.id)}
                    onClick={() => setOpen(false)}
                    aria-current={active === l.id ? "true" : undefined}
                    className={`heading-4 block rounded-xl py-2 transition-colors duration-300 ease-soft ${
                      active === l.id ? "text-oil" : "text-fg hover:text-oil"
                    }`}
                  >
                    {l.label}
                  </a>
                </motion.li>
              ))}
              <motion.li
                initial={{ opacity: 0, y: reduce ? 0 : 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: EASE, delay: 0.4 }}
                className="mt-6"
              >
                <a
                  href={href("simulator")}
                  onClick={() => setOpen(false)}
                  className="button-md inline-flex rounded-xl bg-fg px-3 py-2 text-ink"
                >
                  Открыть симулятор
                </a>
              </motion.li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
