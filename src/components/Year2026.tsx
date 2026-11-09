import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { useLayoutEffect, useRef, useState } from "react";
import { CURRENT_CUTOFF, year2026, type Moment } from "../data/rule";
import { EASE, fmt, useMediaQuery } from "../lib/hooks";
import { Cite, Reveal, SectionHeader } from "./ui";

const toneDot: Record<Moment["tone"], string> = {
  neutral: "bg-fg",
  outflow: "bg-outflow",
  inflow: "bg-inflow",
  pause: "bg-pause",
};
const toneLabel: Record<Moment["tone"], string> = {
  neutral: "решение",
  outflow: "продажи из ФНБ",
  inflow: "покупки в ФНБ",
  pause: "пауза",
};

export function Year2026() {
  const desktop = useMediaQuery("(min-width: 768px)");
  const reduce = useReducedMotion();
  const pinned = desktop && !reduce;

  return (
    <section id="year2026" aria-labelledby="y26-title" className={pinned ? "py-12" : "py-24"}>
      {pinned ? <Pinned /> : <Swipe />}
    </section>
  );
}

function Header() {
  return (
    <div className="px-4 md:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          id="y26-title"
          eyebrow="04 · 2026"
          title="Один год, в котором случилось всё"
          lead="За десять месяцев правило собирались ужесточить, поставили на паузу, отложили решение и предложили новую цену. А нефть успела стоить и 44, и 106 долларов."
        />
      </div>
    </div>
  );
}

function Pinned() {
  const outer = useRef<HTMLDivElement | null>(null);
  const track = useRef<HTMLOListElement | null>(null);
  const box = useRef<HTMLDivElement | null>(null);
  const [dist, setDist] = useState(0);

  useLayoutEffect(() => {
    const calc = () => {
      if (!track.current || !box.current) return;
      setDist(Math.max(track.current.scrollWidth - box.current.clientWidth, 0));
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  const { scrollYProgress } = useScroll({ target: outer, offset: ["start start", "end end"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.5 });
  const x = useTransform(smooth, [0, 1], [0, -dist]);

  return (
    <div ref={outer} style={{ height: `calc(100vh + ${dist}px)` }} className="relative">
      <div className="sticky top-0 flex h-screen flex-col justify-center gap-12 overflow-hidden">
        <Header />
        <div className="px-8">
          <div ref={box} className="mx-auto max-w-6xl">
            <motion.ol ref={track} style={{ x }} className="flex w-max gap-6">
              {year2026.map((m, i) => (
                <Card key={m.title} m={m} i={i} />
              ))}
            </motion.ol>
          </div>
          <div className="mx-auto mt-8 max-w-6xl">
            <div className="relative h-1 overflow-hidden rounded-full bg-surface-4">
              <motion.div className="absolute inset-0 origin-left rounded-full bg-oil" style={{ scaleX: smooth }} />
            </div>
            <div className="caption-5 num mt-2 flex justify-between text-faint">
              <span>лето 2025</span>
              <span>октябрь 2026</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Swipe() {
  return (
    <div className="flex flex-col gap-8">
      <Header />
      <ol className="no-scrollbar flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-2 md:scroll-px-8 md:px-8">
        {year2026.map((m, i) => (
          <Card key={m.title} m={m} i={i} />
        ))}
      </ol>
      <p className="caption-5 px-4 text-faint md:px-8">Листайте вбок</p>
    </div>
  );
}

function Card({ m, i }: { m: Moment; i: number }) {
  return (
    <li className="w-72 shrink-0 snap-start md:w-80">
      <Reveal delay={Math.min(i * 0.05, 0.3)} className="h-full">
        <article className="flex h-full flex-col rounded-2xl border border-line bg-surface-1 p-6 transition-colors duration-300 ease-soft hover:border-line-strong hover:bg-surface-2">
          <div className="flex items-center justify-between gap-2">
            <span className="caption-3 num uppercase tracking-wider text-oil">{m.when}</span>
            <span className="caption-5 flex items-center gap-2 text-faint">
              <span className={`h-2 w-2 rounded-full ${toneDot[m.tone]}`} />
              {toneLabel[m.tone]}
            </span>
          </div>
          <h3 className="heading-6 mt-4 text-fg">{m.title}</h3>
          <p className="body-6 mt-2 text-muted">
            {m.text} <Cite ids={m.sources} />
          </p>
          {m.urals !== undefined && <Gauge value={m.urals} />}
        </article>
      </Reveal>
    </li>
  );
}

/** Urals price against the 59 $ cut-off on a 0 to 110 $ scale */
function Gauge({ value }: { value: number }) {
  const max = 110;
  const above = value > CURRENT_CUTOFF;
  return (
    <div className="mt-auto pt-6">
      <div className="relative h-3 rounded-full bg-surface-3">
        <motion.div
          className={`absolute inset-y-0 left-0 w-full origin-left rounded-full ${above ? "bg-inflow" : "bg-outflow"}`}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: value / max }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: EASE, delay: 0.2 }}
        />
        <span className="absolute -inset-y-1 w-0.5 rounded-full bg-fg" style={{ left: `${(CURRENT_CUTOFF / max) * 100}%` }} />
      </div>
      <div className="caption-5 num mt-2 flex justify-between text-faint">
        <span className={above ? "text-inflow" : "text-outflow"}>Urals {fmt(value, 2)} $</span>
        <span>отсечка {CURRENT_CUTOFF} $</span>
      </div>
    </div>
  );
}
