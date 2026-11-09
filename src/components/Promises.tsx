import { ArrowDownRight, CurrencyRub } from "@phosphor-icons/react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { promises2027 } from "../data/rule";
import { EASE, fmt } from "../lib/hooks";
import { Cite, Reveal, SectionHeader } from "./ui";

const MAX = 70;
const BAR_H = 240;

export function Promises() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -20% 0px" });
  const reduce = useReducedMotion();
  const total = promises2027[0].value - promises2027[promises2027.length - 1].value;

  return (
    <section id="promises" aria-labelledby="promises-title" className="px-4 py-24 md:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          id="promises-title"
          eyebrow="03 · Один год, три цены"
          title="Сколько будет стоить нефть в бюджете 2027 года"
          lead="Правило должно задавать ориентир на годы вперёд. Для 2027 года ориентир за три года назвали трижды, и каждый раз по новой формуле."
        />

        <Reveal className="mt-12">
          <div ref={ref} className="rounded-3xl border border-line bg-surface-1 p-4 md:p-8">
            <div className="grid grid-cols-3 gap-2 md:gap-8">
              {promises2027.map((p, i) => {
                const h = (p.value / MAX) * BAR_H;
                const prev = i > 0 ? promises2027[i - 1] : null;
                const last = i === promises2027.length - 1;
                const delay = reduce ? 0 : 0.2 + i * 0.5;
                return (
                  <div key={p.when} className="flex flex-col">
                    <div className="relative" style={{ height: BAR_H + 56 }}>
                      {/* previous level ghost */}
                      {prev && (
                        <motion.div
                          className="absolute inset-x-2 border-t-2 border-dashed border-faint md:inset-x-6"
                          style={{ bottom: (prev.value / MAX) * BAR_H }}
                          initial={{ opacity: 0 }}
                          animate={inView ? { opacity: 1 } : {}}
                          transition={{ duration: 0.4, ease: EASE, delay }}
                        />
                      )}
                      <motion.div
                        className={`absolute inset-x-2 bottom-0 rounded-t-xl md:inset-x-6 ${last ? "bg-oil" : i === 0 ? "bg-surface-4" : "bg-pause/60"}`}
                        style={{ height: h, originY: 1 }}
                        initial={{ scaleY: reduce ? 1 : 0, opacity: reduce ? 0 : 1 }}
                        animate={inView ? { scaleY: 1, opacity: 1 } : {}}
                        transition={{ duration: 0.9, ease: EASE, delay }}
                      />
                      <motion.div
                        className="absolute inset-x-0 text-center"
                        style={{ bottom: h + 12 }}
                        initial={{ opacity: 0, y: reduce ? 0 : 12 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, ease: EASE, delay: delay + 0.5 }}
                      >
                        <span className={`heading-5 md:heading-3 num ${last ? "text-oil" : "text-fg"}`}>{fmt(p.value, p.value % 1 ? 1 : 0)} $</span>
                        {prev && (
                          <span className="caption-3 num mt-1 flex items-center justify-center gap-1 text-outflow">
                            <ArrowDownRight weight="bold" className="h-3 w-3" />
                            {fmt(prev.value - p.value, prev.value - p.value < 10 && (prev.value - p.value) % 1 ? 1 : 0)} $
                          </span>
                        )}
                      </motion.div>
                    </div>
                    <div className="mt-4 border-t border-line pt-4">
                      <p className="title-4 num text-fg">{p.when}</p>
                      <p className="caption-5 mt-1 text-muted">
                        {p.label} <Cite ids={p.sources} />
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 flex flex-col gap-4 border-t border-line pt-6 md:flex-row md:items-center md:justify-between">
              <p className="body-5 text-fg">
                Итого ориентир для одного года сдвинулся на <span className="num text-oil">{fmt(total, 1)} $</span> за баррель.
              </p>
              <p className="caption-5 text-faint">2027 год: значение из проекта бюджета, принятого Госдумой в первом чтении</p>
            </div>
          </div>
        </Reveal>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <Reveal delay={0.05}>
            <div className="h-full rounded-2xl border border-line bg-surface-1 p-6">
              <CurrencyRub className="h-6 w-6 text-oil" />
              <p className="title-2 mt-4 text-fg">Каждый доллар цены отсечения стоит от 0,4 до 0,6 % курса рубля</p>
              <p className="body-6 mt-2 text-muted">
                Так оценивает связь Дмитрий Полевой, инвестиционный директор УК «Астра Управление активами». Ниже отсечка, больше покупок валюты, слабее рубль. <Cite ids={[7]} />
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="h-full rounded-2xl border border-line bg-surface-1 p-6">
              <span className="heading-5 num text-oil">≈ 4 ₽</span>
              <p className="title-2 mt-4 text-fg">на столько, по оценке БКС, ослабнет среднегодовой курс 2027 года при отсечке 50 $</p>
              <p className="body-6 mt-2 text-muted">
                Оценка аналитика «БКС Мир инвестиций» Ильи Фёдорова. Это прогноз, а не факт, но он показывает цену каждого пересмотра для рынка. <Cite ids={[24]} />
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
