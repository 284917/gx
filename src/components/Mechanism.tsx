import { Bank, Vault } from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { EASE, useMeasure } from "../lib/hooks";
import { Reveal, SectionHeader } from "./ui";

const steps = [
  {
    title: "Минфин задаёт цену отсечения",
    text: "В 2026 году это 59 $ за баррель Urals. Бюджет планирует расходы так, будто нефть стоит ровно столько.",
    cite: [6],
  },
  {
    title: "Налоги с цены выше уходят в резервы",
    text: "Когда нефть дороже, Минфин покупает на эти доходы валюту и золото в ФНБ. Сверхдоходы не разгоняют текущие расходы.",
    cite: [2],
  },
  {
    title: "Если нефть дешевле, разницу берут из ФНБ",
    text: "Минфин продаёт валюту, и бюджет получает плановую сумму. Так было в 2020 году и с лета 2025 по февраль 2026 года.",
    cite: [2, 8],
  },
];

type Mode = "high" | "low";

export function Mechanism() {
  const [mode, setMode] = useState<Mode>("high");
  return (
    <section id="mechanism" aria-labelledby="mechanism-title" className="px-4 py-24 md:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          id="mechanism-title"
          eyebrow="01 · Механизм"
          title="Как устроено бюджетное правило"
          lead="Идея простая: тратить так, будто нефть всегда стоит одинаково, а всё, что сверху, откладывать. Тогда бюджет не зависит от того, куда качнулась цена."
        />

        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <ol className="flex flex-col gap-4">
            {steps.map((s, i) => {
              const lit = i === 0 || (mode === "high" ? i === 1 : i === 2);
              return (
                <Reveal as="li" key={s.title} delay={i * 0.08}>
                  <div
                    className={`flex gap-4 rounded-2xl border p-4 transition-colors duration-500 ease-soft ${
                      lit ? "border-line-strong bg-surface-2" : "border-line bg-transparent"
                    }`}
                  >
                    <span
                      className={`body-4 num grid h-8 w-8 shrink-0 place-items-center rounded-full border transition-colors duration-500 ease-soft ${
                        lit ? "border-oil text-oil" : "border-line text-faint"
                      }`}
                    >
                      {i + 1}
                    </span>
                    <div>
                      <h3 className={`title-2 transition-colors duration-500 ease-soft ${lit ? "text-fg" : "text-muted"}`}>{s.title}</h3>
                      <p className="body-6 mt-1 text-muted">
                        {s.text}
                      </p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </ol>

          <Reveal delay={0.1}>
            <div className="rounded-3xl border border-line bg-surface-1 p-4 md:p-6">
              <div role="radiogroup" aria-label="Цена нефти" className="relative grid grid-cols-2 rounded-xl bg-surface-3 p-1">
                {(
                  [
                    ["high", "Нефть дороже отсечки"],
                    ["low", "Нефть дешевле отсечки"],
                  ] as const
                ).map(([k, label]) => (
                  <button
                    key={k}
                    role="radio"
                    aria-checked={mode === k}
                    onClick={() => setMode(k)}
                    className={`button-sm relative z-10 rounded-lg px-3 py-2 transition-colors duration-300 ease-soft active:scale-[0.98] ${
                      mode === k ? "text-ink" : "text-muted hover:text-fg"
                    }`}
                  >
                    {mode === k && (
                      <motion.span
                        layoutId="mech-toggle"
                        className="absolute inset-0 -z-10 rounded-lg bg-fg"
                        transition={{ duration: 0.5, ease: EASE }}
                      />
                    )}
                    {label}
                  </button>
                ))}
              </div>
              <FlowDiagram mode={mode} />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function FlowDiagram({ mode }: { mode: Mode }) {
  const reduce = useReducedMotion();
  const [ref, { width }] = useMeasure<HTMLDivElement>();
  const H = 280;
  const cutPct = 0.55;
  const pricePct = mode === "high" ? 0.82 : 0.36;
  const dist = Math.max(width - 180, 80);

  return (
    <div ref={ref} className="relative mt-6 grid grid-cols-[96px_1fr] gap-4" style={{ height: H }}>
      {/* Price column */}
      <div className="relative h-full overflow-hidden rounded-2xl border border-line bg-surface-2">
        <motion.div
          className="absolute inset-x-0 bottom-0 rounded-t-xl bg-oil/80"
          style={{ height: H, originY: 1 }}
          initial={false}
          animate={{ scaleY: pricePct }}
          transition={{ duration: 0.8, ease: EASE }}
        />
        {/* Part above cut-off */}
        <motion.div
          className="absolute inset-x-0 bg-inflow"
          style={{ height: H * (1 - cutPct), top: 0, originY: 1 }}
          initial={false}
          animate={{ scaleY: mode === "high" ? (pricePct - cutPct) / (1 - cutPct) : 0, opacity: mode === "high" ? 0.9 : 0 }}
          transition={{ duration: 0.8, ease: EASE }}
        />
        {/* Shortfall */}
        <motion.div
          className="absolute inset-x-2 rounded-lg border-2 border-dashed border-outflow"
          style={{ bottom: H * pricePct, height: H * (cutPct - pricePct) }}
          initial={false}
          animate={{ opacity: mode === "low" ? 1 : 0 }}
          transition={{ duration: 0.5, ease: EASE }}
        />
        <div className="absolute inset-x-0 border-t-2 border-fg" style={{ bottom: H * cutPct }} />
        <span className="caption-3 num absolute left-2 text-ink" style={{ bottom: 8 }}>
          Urals
        </span>
      </div>

      {/* Destinations */}
      <div className="relative h-full">
        <Dest
          icon={<Vault className="h-5 w-5" />}
          title="ФНБ"
          sub={mode === "high" ? "покупка валюты и золота" : "продажа валюты"}
          tone={mode === "high" ? "inflow" : "outflow"}
          style={{ top: 0 }}
        />
        <Dest icon={<Bank className="h-5 w-5" />} title="Бюджет" sub="плановые нефтегазовые доходы" tone="neutral" style={{ bottom: 0 }} />

        {/* Particles */}
        {!reduce && (
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              className="pointer-events-none absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              {mode === "high" ? (
                <>
                  <ParticleRow top={36} color="bg-inflow" dist={dist} />
                  <ParticleRow top={H - 52} color="bg-oil" dist={dist} slow />
                </>
              ) : (
                <ParticleVertical color="bg-outflow" height={H - 120} />
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      <div className="pointer-events-none absolute left-0 flex w-24 justify-center" style={{ bottom: H * cutPct + 6 }}>
        <span className="caption-3 num rounded-md bg-fg px-2 text-ink">59 $</span>
      </div>
    </div>
  );
}

function Dest({
  icon,
  title,
  sub,
  tone,
  style,
}: {
  icon: React.ReactNode;
  title: string;
  sub: string;
  tone: "inflow" | "outflow" | "neutral";
  style: React.CSSProperties;
}) {
  const ring = tone === "inflow" ? "border-inflow/50 text-inflow" : tone === "outflow" ? "border-outflow/50 text-outflow" : "border-line-strong text-fg";
  return (
    <div className="absolute right-0 z-10 w-40 rounded-2xl border border-line bg-surface-2 p-3 sm:w-48" style={style}>
      <div className="flex items-center gap-2">
        <span className={`grid h-8 w-8 place-items-center rounded-lg border transition-colors duration-500 ease-soft ${ring}`}>{icon}</span>
        <span className="title-3 text-fg">{title}</span>
      </div>
      <AnimatePresence mode="wait">
        <motion.p
          key={sub}
          className="caption-5 mt-2 text-muted"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.3, ease: EASE }}
        >
          {sub}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

function ParticleRow({ top, color, dist, slow }: { top: number; color: string; dist: number; slow?: boolean }) {
  return (
    <div className="absolute left-0" style={{ top }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={`absolute h-2 w-2 rounded-full ${color}`}
          style={
            {
              "--flow-dist": `${dist}px`,
              animation: `flow-x ${slow ? 3.2 : 2.4}s cubic-bezier(0.22,1,0.36,1) ${i * (slow ? 0.64 : 0.48)}s infinite`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

function ParticleVertical({ color, height }: { color: string; height: number }) {
  return (
    <div className="absolute right-20 top-16 sm:right-24">
      {Array.from({ length: 4 }).map((_, i) => (
        <span
          key={i}
          className={`absolute h-2 w-2 rounded-full ${color}`}
          style={
            {
              animation: `flow-y 2.4s cubic-bezier(0.22,1,0.36,1) ${i * 0.6}s infinite`,
              "--flow-dist": `${height}px`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
