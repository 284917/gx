import { ArrowDown, ArrowRight } from "@phosphor-icons/react";
import { animate, motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { EASE } from "../lib/hooks";
import { RuleChart } from "./RuleChart";
import { Cite } from "./ui";

const stats = [
  { n: 4, label: "пересмотра параметров правила с 2022 года", cite: [3, 5, 11] },
  { n: 2, label: "паузы в покупках и продажах валюты", cite: [4, 8] },
  { n: 3, label: "разные цены отсечения для одного 2027 года", cite: [3, 5, 11] },
];

export function Hero() {
  const reduce = useReducedMotion();
  const fade = (delay: number) => ({
    initial: { opacity: 0, y: reduce ? 0 : 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: EASE, delay },
  });

  return (
    <section id="top" aria-labelledby="hero-title" className="relative px-4 pb-16 pt-24 md:px-8 md:pb-24">
      <div className="mx-auto max-w-6xl">
        <motion.p {...fade(0)} className="caption-4 inline-flex items-center gap-2 rounded-full border border-line px-3 py-1 text-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-oil" />
          VIII Горчаковские чтения · РАНХиГС · ноябрь 2026
        </motion.p>

        <motion.h1 {...fade(0.08)} id="hero-title" className="heading-3 sm:heading-2 md:heading-1 hero-gradient mt-6 max-w-[680px] pb-1">
          Правило, которое
          <br />
          переписывают
        </motion.h1>

        <motion.p {...fade(0.16)} className="body-3 md:title-2 mt-6 max-w-[680px] text-muted">
          Бюджетное правило должно защищать бюджет России от нефтяных качелей. Работает оно, только пока в него верят. Здесь собраны данные о том, как часто его меняли с 2017 года и что это делает с доверием к фискальной политике.
        </motion.p>

        <motion.div {...fade(0.24)} className="mt-8 flex flex-wrap items-center gap-4">
          <a
            href="#simulator"
            className="button-md group inline-flex items-center gap-2 rounded-xl bg-fg px-3 py-2 text-ink transition-[transform,opacity] duration-300 ease-soft hover:-translate-y-0.5 hover:opacity-90 active:translate-y-px active:scale-[0.98]"
          >
            Открыть симулятор
            <ArrowRight weight="bold" className="h-4 w-4 transition-transform duration-300 ease-soft group-hover:translate-x-0.5" />
          </a>
          <a
            href="#mechanism"
            className="caption-1 inline-flex items-center gap-2 rounded-lg px-2 py-1 text-muted transition-colors duration-300 ease-soft hover:text-fg"
          >
            <ArrowDown className="h-4 w-4" />
            Читать по порядку
          </a>
        </motion.div>

        <motion.dl {...fade(0.32)} className="mt-12 grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-3">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl border border-line bg-surface-1 p-4">
              <dt className="sr-only">{s.label}</dt>
              <dd>
                <CountUp to={s.n} className="heading-3 num block text-fg" />
                <span className="caption-2 mt-2 block text-muted">
                  {s.label} <Cite ids={s.cite} />
                </span>
              </dd>
            </div>
          ))}
        </motion.dl>

        <motion.div {...fade(0.4)} className="mt-16 rounded-3xl border border-line bg-surface-1 p-4 md:p-8">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-2">
            <div>
              <p className="title-3 text-fg">Цена отсечения и цена нефти</p>
              <p className="caption-2 text-muted">Доллары за баррель Urals, 2017–2027</p>
            </div>
          </div>
          <RuleChart />
        </motion.div>
      </div>
    </section>
  );
}

function CountUp({ to, className }: { to: number; className?: string }) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const [v, setV] = useState(reduce ? to : 0);
  useEffect(() => {
    if (!inView || reduce) return;
    const c = animate(0, to, { duration: 1.2, ease: EASE, onUpdate: (x) => setV(Math.round(x)) });
    return () => c.stop();
  }, [inView, to, reduce]);
  return (
    <span ref={ref} className={className}>
      {v}
    </span>
  );
}
