import { useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import { useRef, useState } from "react";

const LINES = ["Правило работает, пока в него верят.", "Каждая поправка учит рынок", "ждать следующую."];

/** Mandatory tagline reveal (B11): words light up one at a time as the block scrolls past */
export function TaglineReveal() {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduce = useReducedMotion();
  const words = LINES.map((l) => l.split(" "));
  const total = words.flat().length;
  const [lit, setLit] = useState(reduce ? total : 0);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (reduce) return;
    const n = Math.round(v * total);
    setLit((prev) => (prev === n ? prev : n));
  });

  let k = 0;
  return (
    <section aria-label="Главный вывод" className="px-4 py-24 md:px-8">
      <div ref={ref} className="mx-auto max-w-6xl">
        <p className="heading-4 sm:heading-3 md:heading-1 max-w-[680px] md:max-w-[880px]">
          {words.map((line, li) => (
            <span key={li} className="block">
              {line.map((w) => {
                const i = k++;
                const on = reduce || i < lit;
                return (
                  <span key={i}>
                    <span
                      className="inline-block transition-opacity duration-500 ease-soft"
                      style={{ opacity: on ? 1 : 0.28 }}
                    >
                      {w}
                    </span>{" "}
                  </span>
                );
              })}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
