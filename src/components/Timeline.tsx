import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { events, statusLabel, type RuleStatus } from "../data/rule";
import { EASE } from "../lib/hooks";
import { Chip, Cite, SectionHeader } from "./ui";

const toneOf = (s: RuleStatus) => (s === "active" ? "neutral" : s === "proposed" ? "oil" : "pause") as "neutral" | "oil" | "pause";

export function Timeline() {
  const [idx, setIdx] = useState(0);
  const refs = useRef<(HTMLElement | null)[]>([]);
  const reduce = useReducedMotion();

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setIdx(Number((e.target as HTMLElement).dataset.idx));
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const ev = events[idx];
  const swap = {
    initial: { opacity: 0, y: reduce ? 0 : 32 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: reduce ? 0 : -32 },
    transition: { duration: 0.5, ease: EASE },
  };

  return (
    <section id="timeline" aria-labelledby="timeline-title" className="px-4 py-24 md:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          id="timeline-title"
          eyebrow="02 · Хронология"
          title="Десять лет поправок"
          lead="Каждое решение по отдельности объяснимо: санкции, падение цен, новые расходы. Вопрос в частоте. Пролистайте, как менялся главный параметр правила."
        />

        <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          {/* Sticky state panel */}
          <div className="sticky top-20 z-10 self-start lg:top-24">
            <div className="rounded-3xl border border-line bg-surface-1/90 p-4 backdrop-blur-xl md:p-8">
              <p className="caption-4 hidden text-faint md:block">Год, к которому относится параметр</p>
              <div className="flex items-start justify-between gap-4 md:mt-2">
                <div className="relative h-10 overflow-hidden md:h-16">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.p key={ev.when} {...swap} className="heading-3 md:heading-1 num text-fg">
                      {ev.year}
                    </motion.p>
                  </AnimatePresence>
                </div>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span key={ev.status} {...swap}>
                    <Chip tone={toneOf(ev.status)}>{statusLabel[ev.status]}</Chip>
                  </motion.span>
                </AnimatePresence>
              </div>

              <div className="mt-4 hidden md:block">
                <p className="caption-4 text-faint">{ev.paramLabel}</p>
                <div className="relative h-10 overflow-hidden">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.p
                      key={ev.id}
                      {...swap}
                      className={`heading-3 num ${ev.status === "paused" ? "text-pause" : ev.status === "proposed" ? "text-oil" : "text-fg"}`}
                    >
                      {ev.param}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </div>

              {/* Progress rail */}
              <div className="mt-4 md:mt-8">
                <div className="relative h-1 rounded-full bg-surface-4">
                  <motion.div
                    className="absolute inset-y-0 left-0 w-full origin-left rounded-full bg-oil"
                    animate={{ scaleX: (idx + 1) / events.length }}
                    transition={{ duration: 0.5, ease: EASE }}
                  />
                </div>
                <ol className="mt-3 hidden grid-cols-8 gap-1 md:grid">
                  {events.map((e, i) => (
                    <li key={e.id}>
                      <button
                        onClick={() => refs.current[i]?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" })}
                        className="group block w-full rounded-md py-2"
                        aria-label={`${e.when}: ${e.title}`}
                        title={`${e.when}: ${e.title}`}
                      >
                        <span
                          className={`mx-auto block h-2 w-2 rounded-full transition-[transform,background-color] duration-300 ease-soft group-hover:scale-125 ${
                            i === idx ? "scale-125 bg-oil" : i < idx ? "bg-fg/60" : "bg-surface-4"
                          }`}
                        />
                      </button>
                    </li>
                  ))}
                </ol>
                <p className="caption-5 mt-1 hidden text-faint md:block">
                  {ev.when} · {ev.title}
                </p>
              </div>
            </div>
          </div>

          {/* Event cards */}
          <ol className="relative flex flex-col gap-6 lg:pb-24">
            <span aria-hidden className="absolute bottom-0 left-4 top-0 w-px bg-line md:left-6" />
            {events.map((e, i) => {
              const on = i === idx;
              return (
                <li key={e.id} ref={(el) => (refs.current[i] = el)} data-idx={i} className="relative pl-10 md:pl-16">
                  <span
                    aria-hidden
                    className={`absolute left-4 top-6 h-3 w-3 -translate-x-1/2 rounded-full border-2 transition-colors duration-500 ease-soft md:left-6 ${
                      on ? "border-oil bg-oil" : "border-surface-4 bg-ink"
                    }`}
                  />
                  <article
                    className={`rounded-2xl border p-4 transition-[opacity,transform,border-color] duration-500 ease-soft md:p-6 ${
                      on ? "border-line-strong bg-surface-2 opacity-100" : "border-line bg-surface-1 opacity-60"
                    }`}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="caption-3 num uppercase tracking-wider text-oil">{e.when}</span>
                      <Chip tone={toneOf(e.status)}>{e.param}</Chip>
                    </div>
                    <h3 className="heading-6 mt-3 text-fg">{e.title}</h3>
                    <p className="body-6 mt-2 text-muted">
                      {e.text} <Cite ids={e.sources} />
                    </p>
                  </article>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
