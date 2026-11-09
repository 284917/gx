import { ArrowCounterClockwise, Bank, Vault } from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useId, useState } from "react";
import { CURRENT_CUTOFF, RUBLE_PER_DOLLAR_MAX, RUBLE_PER_DOLLAR_MIN } from "../data/rule";
import { EASE, fmt, useMeasure } from "../lib/hooks";
import { Reveal, SectionHeader } from "./ui";

type Preset = {
  label: string;
  urals?: number;
  cutoff: number;
  paused?: boolean;
  note: string;
  cite: number[];
};

const PRESETS: Preset[] = [
  { label: "2020", urals: 41.73, cutoff: 42.45, note: "Нефть чуть дешевле отсечки. Правило сработало как задумано: недобор покрыли из резервов.", cite: [2, 19] },
  { label: "2022", urals: 76.09, cutoff: 44.2, paused: true, note: "Разница огромная, но правило стояло на паузе. Эти доходы не откладывались, а ушли на расходы.", cite: [4, 21, 23] },
  { label: "2025", urals: 55.6, cutoff: 60, note: "Нефть дешевле отсечки. С лета 2025 года Минфин продаёт валюту из ФНБ.", cite: [8, 22] },
  { label: "Февраль 2026", urals: 44.59, cutoff: 59, note: "Разрыв больше 14 $. Именно тогда правительство заговорило об ужесточении правила.", cite: [6, 10] },
  { label: "Апрель 2026", urals: 106.3, cutoff: 59, paused: true, note: "Нефть дороже 100 $, но операции на паузе до мая. Отложенный объём докупили позже.", cite: [8, 9] },
  { label: "Проект 2027", cutoff: 50, note: "Отсечка из проекта бюджета. Цену нефти выберите сами.", cite: [11, 12] },
];

const P_MAX = 120;

export function Simulator() {
  const [urals, setUrals] = useState(70);
  const [cutoff, setCutoff] = useState(CURRENT_CUTOFF);
  const [rate, setRate] = useState(85);
  const [preset, setPreset] = useState<Preset | null>(null);

  const paused = preset?.paused ?? false;
  const gap = urals - cutoff;
  const mode: "in" | "out" | "flat" = Math.abs(gap) < 0.5 ? "flat" : gap > 0 ? "in" : "out";
  const share = gap > 0 ? (gap / urals) * 100 : 0;
  const shift = CURRENT_CUTOFF - cutoff;

  const apply = (p: Preset) => {
    setPreset(p);
    if (p.urals !== undefined) setUrals(p.urals);
    setCutoff(p.cutoff);
  };
  const reset = () => {
    setPreset(null);
    setUrals(70);
    setCutoff(CURRENT_CUTOFF);
    setRate(85);
  };

  return (
    <section id="simulator" aria-labelledby="sim-title" className="px-4 py-24 md:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          id="sim-title"
          eyebrow="06 · Симулятор"
          title="Попробуйте управлять правилом сами"
          lead="Двигайте цену нефти и цену отсечки. Симулятор показывает механику правила на одном барреле: какая часть цены уходит в резервы, какая в бюджет и что происходит с курсом, если отсечку переносят."
        />

        <Reveal className="mt-12">
          <div className="grid gap-6 rounded-3xl border border-line bg-surface-1 p-4 md:p-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
            {/* Controls */}
            <div className="flex flex-col gap-6">
              <div>
                <p className="title-4 text-fg">Сценарии из реальной истории</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {PRESETS.map((p) => {
                    const on = preset?.label === p.label;
                    return (
                      <button
                        key={p.label}
                        onClick={() => apply(p)}
                        aria-pressed={on}
                        className={`button-xsm rounded-lg border px-3 py-1 transition-[background-color,border-color,color,transform] duration-300 ease-soft active:scale-[0.98] ${
                          on ? "border-oil bg-oil/15 text-oil" : "border-line text-muted hover:border-line-strong hover:text-fg"
                        }`}
                      >
                        {p.label}
                      </button>
                    );
                  })}
                  <button
                    onClick={reset}
                    className="button-xsm inline-flex items-center gap-1 rounded-lg px-2 py-1 text-faint transition-colors duration-300 ease-soft hover:text-fg active:scale-[0.98]"
                  >
                    <ArrowCounterClockwise className="h-3 w-3" />
                    Сбросить
                  </button>
                </div>
              </div>

              <Slider
                label="Цена Urals"
                unit="$ за баррель"
                value={urals}
                min={20}
                max={P_MAX}
                step={0.5}
                color="var(--color-oil)"
                onChange={(v) => {
                  setUrals(v);
                  if (preset?.urals !== undefined) setPreset(null);
                }}
                digits={urals % 1 ? 2 : 0}
              />
              <Slider
                label="Цена отсечения"
                unit="$ за баррель"
                value={cutoff}
                min={30}
                max={80}
                step={0.5}
                color="var(--color-fg)"
                onChange={(v) => {
                  setCutoff(v);
                  setPreset(null);
                }}
                digits={cutoff % 1 ? 1 : 0}
              />
              <Slider label="Курс" unit="₽ за доллар" value={rate} min={60} max={130} step={1} color="var(--color-muted)" onChange={setRate} digits={0} />

              <AnimatePresence mode="wait">
                {preset && (
                  <motion.div
                    key={preset.label}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.4, ease: EASE }}
                    className="rounded-2xl border border-line bg-surface-2 p-4"
                    role="status"
                  >
                    <p className="title-4 num text-oil">{preset.label}</p>
                    <p className="body-6 mt-1 text-muted">
                      {preset.note}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Visual + readout */}
            <div className="flex flex-col gap-6">
              <Barrel urals={urals} cutoff={cutoff} mode={mode} paused={paused} />

              <dl className="grid grid-cols-2 gap-3">
                <Readout
                  label="Разница с отсечкой"
                  value={`${gap >= 0 ? "+" : "−"}${fmt(Math.abs(gap), 1)} $`}
                  sub={`${gap >= 0 ? "+" : "−"}${fmt(Math.abs(gap) * rate, 0)} ₽ с барреля`}
                  tone={mode === "in" ? "inflow" : mode === "out" ? "outflow" : "neutral"}
                />
                <Readout
                  label="Что делает Минфин"
                  value={paused ? "Пауза" : mode === "in" ? "Покупает" : mode === "out" ? "Продаёт" : "Ничего"}
                  sub={paused ? "операции остановлены" : mode === "in" ? "валюту и золото в ФНБ" : mode === "out" ? "валюту из ФНБ" : "цена у отсечки"}
                  tone={paused ? "pause" : mode === "in" ? "inflow" : mode === "out" ? "outflow" : "neutral"}
                />
                <Readout
                  label="Доля цены выше отсечки"
                  value={`${fmt(share, 0)} %`}
                  sub="налоги с этой части идут в резервы"
                  tone="neutral"
                />
                <Readout
                  label={Math.abs(shift) < 0.25 ? `Сдвиг отсечки от ${CURRENT_CUTOFF} $` : `Отсечка ${fmt(cutoff, cutoff % 1 ? 1 : 0)} $, а не ${CURRENT_CUTOFF} $`}
                  value={
                    Math.abs(shift) < 0.25
                      ? "нет"
                      : `${fmt(Math.abs(shift) * RUBLE_PER_DOLLAR_MIN, 1)}…${fmt(Math.abs(shift) * RUBLE_PER_DOLLAR_MAX, 1)} %`
                  }
                  sub={Math.abs(shift) < 0.25 ? "курс не сдвигается" : shift > 0 ? "ослабление рубля, оценка" : "укрепление рубля, оценка"}
                  tone={Math.abs(shift) < 0.25 ? "neutral" : shift > 0 ? "outflow" : "inflow"}
                />
              </dl>
              <p className="caption-5 text-faint">
                Учебная модель на один баррель. Она не считает объёмы экспорта и налоговые формулы, поэтому показывает направление и пропорции, а не суммы в бюджете. Эффект для курса: 0,4…0,6 % на каждый доллар отсечки
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Slider({
  label,
  unit,
  value,
  min,
  max,
  step,
  color,
  onChange,
  digits,
}: {
  label: string;
  unit: string;
  value: number;
  min: number;
  max: number;
  step: number;
  color: string;
  onChange: (v: number) => void;
  digits: number;
}) {
  const id = useId();
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <label htmlFor={id} className="title-4 text-fg">
          {label}
        </label>
        <span className="body-4 num text-fg">
          {fmt(value, digits)} <span className="caption-5 text-faint">{unit}</span>
        </span>
      </div>
      <input
        id={id}
        type="range"
        className="range mt-2"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-valuetext={`${fmt(value, digits)} ${unit}`}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ "--pct": `${pct}%`, "--track-fill": color } as React.CSSProperties}
      />
      <div className="caption-5 num flex justify-between text-faint">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}

function Readout({ label, value, sub, tone }: { label: string; value: string; sub: string; tone: "inflow" | "outflow" | "neutral" | "pause" }) {
  const color = { inflow: "text-inflow", outflow: "text-outflow", neutral: "text-fg", pause: "text-pause" }[tone];
  return (
    <div className="rounded-2xl border border-line bg-surface-2 p-4">
      <dt className="caption-4 text-faint">{label}</dt>
      <dd>
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={value}
            className={`heading-6 md:heading-5 num mt-1 block ${color}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            {value}
          </motion.span>
        </AnimatePresence>
        <span className="caption-5 mt-1 block text-muted">{sub}</span>
      </dd>
    </div>
  );
}

function Barrel({ urals, cutoff, mode, paused }: { urals: number; cutoff: number; mode: "in" | "out" | "flat"; paused: boolean }) {
  const reduce = useReducedMotion();
  const [right, { width: rw }] = useMeasure<HTMLDivElement>();
  const H = 260;
  const yPct = (v: number) => Math.min(v / P_MAX, 1);
  const pricePct = yPct(urals);
  const cutPct = yPct(cutoff);
  const T = { duration: 0.6, ease: EASE };

  return (
    <div className="relative grid grid-cols-[88px_1fr] gap-4 rounded-2xl border border-line bg-surface-2 p-4" style={{ height: H + 32 }}>
      <div className="relative h-full overflow-hidden rounded-xl bg-surface-3">
        {/* Whole price; the part above the cut-off stays visible */}
        <motion.div
          className={`absolute inset-x-0 bottom-0 ${paused ? "bg-pause" : "bg-inflow"}`}
          style={{ height: H, originY: 1 }}
          animate={{ scaleY: pricePct, opacity: mode === "in" ? 1 : 0 }}
          transition={T}
        />
        {/* Base part: up to the cut-off or to the price */}
        <motion.div
          className="absolute inset-x-0 bottom-0 bg-oil"
          style={{ height: H, originY: 1 }}
          animate={{ scaleY: Math.min(pricePct, cutPct) }}
          transition={T}
        />
        {/* Shortfall outline */}
        <motion.div
          className="absolute inset-x-2 rounded-lg border-2 border-dashed border-outflow"
          style={{ bottom: H * pricePct, height: Math.max(H * (cutPct - pricePct), 0) }}
          animate={{ opacity: mode === "out" ? 1 : 0 }}
          transition={{ duration: 0.3, ease: EASE }}
        />
        {/* Cut-off line */}
        <motion.div className="absolute inset-x-0 h-0.5 bg-fg" style={{ bottom: 0 }} animate={{ y: -H * cutPct }} transition={T} />
      </div>

      <div ref={right} className="relative h-full">
        <motion.span
          className="caption-3 num absolute -left-2 rounded-md bg-fg px-2 text-ink"
          style={{ bottom: -8 }}
          animate={{ y: -H * cutPct }}
          transition={T}
        >
          отсечка {fmt(cutoff, cutoff % 1 ? 1 : 0)} $
        </motion.span>

        <Dest
          title="ФНБ"
          icon={<Vault className="h-5 w-5" />}
          sub={paused ? "операции на паузе" : mode === "in" ? "получает валюту и золото" : mode === "out" ? "отдаёт валюту бюджету" : "без изменений"}
          tone={paused ? "pause" : mode === "in" ? "inflow" : mode === "out" ? "outflow" : "neutral"}
          className="right-0 top-0"
        />
        <Dest title="Бюджет" icon={<Bank className="h-5 w-5" />} sub="получает плановую сумму" tone="neutral" className="bottom-0 right-0" />

        {!reduce && !paused && mode !== "flat" && (
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              className="pointer-events-none absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: EASE }}
            >
              {mode === "in" ? (
                <div className="absolute left-0 top-8">
                  {[0, 1, 2, 3].map((i) => (
                    <span
                      key={i}
                      className="absolute h-2 w-2 rounded-full bg-inflow"
                      style={{ "--flow-dist": `${Math.max(rw - 200, 60)}px`, animation: `flow-x 2.4s cubic-bezier(0.22,1,0.36,1) ${i * 0.6}s infinite` } as React.CSSProperties}
                    />
                  ))}
                </div>
              ) : (
                <div className="absolute right-20 top-20">
                  {[0, 1, 2, 3].map((i) => (
                    <span
                      key={i}
                      className="absolute h-2 w-2 rounded-full bg-outflow"
                      style={{ "--flow-dist": `${H - 150}px`, animation: `flow-y 2s cubic-bezier(0.22,1,0.36,1) ${i * 0.5}s infinite` } as React.CSSProperties}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

function Dest({
  title,
  icon,
  sub,
  tone,
  className,
}: {
  title: string;
  icon: React.ReactNode;
  sub: string;
  tone: "inflow" | "outflow" | "neutral" | "pause";
  className: string;
}) {
  const ring = {
    inflow: "border-inflow/50 text-inflow",
    outflow: "border-outflow/50 text-outflow",
    neutral: "border-line-strong text-fg",
    pause: "border-pause/60 text-pause",
  }[tone];
  return (
    <div className={`absolute z-10 w-44 rounded-xl border border-line bg-surface-1 p-3 sm:w-52 ${className}`}>
      <div className="flex items-center gap-2">
        <span className={`grid h-8 w-8 place-items-center rounded-lg border transition-colors duration-500 ease-soft ${ring}`}>{icon}</span>
        <span className="title-3 text-fg">{title}</span>
      </div>
      <AnimatePresence mode="wait" initial={false}>
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
