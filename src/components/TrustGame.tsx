import { ArrowCounterClockwise, Coins, Lock, PencilSimpleLine, Prohibit, RocketLaunch, ShieldCheck, SunHorizon, TrendDown, TrendUp, type Icon } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { EASE } from "../lib/hooks";
import { Cite, Reveal, SectionHeader } from "./ui";

type Kind = "down" | "up" | "pressure" | "boom" | "calm";
type Choice = "hold" | "rewrite" | "escape";

const ROUNDS: { title: string; text: string; kind: Kind; icon: Icon }[] = [
  { title: "Нефть подешевела до 45 $", text: "Доходы ниже плана, бюджету не хватает денег.", kind: "down", icon: TrendDown },
  { title: "Нефть вернулась к 65 $", text: "Цена немного выше отсечки, есть что отложить.", kind: "up", icon: TrendUp },
  { title: "Нужны новые расходы", text: "Шока нет, но есть соблазн потратить резервы.", kind: "pressure", icon: Coins },
  { title: "Нефть взлетела до 100 $", text: "Сверхдоходы большие. Отложить или потратить?", kind: "boom", icon: RocketLaunch },
  { title: "Санкции сократили экспорт", text: "Сильный внешний шок, доходы резко упали.", kind: "down", icon: Prohibit },
  { title: "Спокойный год", text: "Цена около отсечки, давления нет.", kind: "calm", icon: SunHorizon },
];

const BUFFER: Record<Choice, Record<Kind, number>> = {
  hold: { down: -14, up: 6, pressure: 0, boom: 16, calm: 2 },
  rewrite: { down: -4, up: 0, pressure: -10, boom: 2, calm: 0 },
  escape: { down: -8, up: 0, pressure: -10, boom: 2, calm: 0 },
};

function outcome(choice: Choice, kind: Kind) {
  if (choice === "hold") {
    const msg = {
      down: "Правило выдержало: недобор покрыли из резервов. Рынок видит, что обещание держат.",
      up: "Сверхдоходы отложены, подушка растёт.",
      boom: "Большие сверхдоходы ушли в резервы, а не в расходы.",
      pressure: "Соблазн отклонён. Для доверия это самый ценный ход.",
      calm: "Ничего не происходит, и это хорошо.",
    }[kind];
    return { dTrust: 6, msg };
  }
  if (choice === "escape") {
    if (kind === "down") return { dTrust: -2, msg: "Оговорка сработала по заранее известному условию. Отступление временное и предсказуемое." };
    return { dTrust: -12, msg: "Условие выхода не наступило. Для рынка это обычная поправка." };
  }
  return { dTrust: -14, msg: "Параметры переписаны. Рынок запоминает, что правило меняют, когда неудобно." };
}

const clamp = (v: number) => Math.max(0, Math.min(100, v));
const spread = (trust: number) => 3 + (100 - trust) * 0.15;

export function TrustGame() {
  const [round, setRound] = useState(0);
  const [trust, setTrust] = useState(70);
  const [buffer, setBuffer] = useState(50);
  const [history, setHistory] = useState<number[]>([70]);
  const [last, setLast] = useState<{ msg: string; dTrust: number } | null>(null);

  const done = round >= ROUNDS.length;
  const sc = ROUNDS[Math.min(round, ROUNDS.length - 1)];

  const play = (c: Choice) => {
    if (done) return;
    const o = outcome(c, sc.kind);
    const t = clamp(trust + o.dTrust);
    setTrust(t);
    setBuffer((b) => clamp(b + BUFFER[c][sc.kind]));
    setHistory((h) => [...h, t]);
    setLast(o);
    setRound((r) => r + 1);
  };

  const restart = () => {
    setRound(0);
    setTrust(70);
    setBuffer(50);
    setHistory([70]);
    setLast(null);
  };

  const verdict =
    trust >= 80
      ? "Правилу верят. Ожидания спокойные, и даже шоки не раскачивают курс."
      : trust >= 55
        ? "Доверие держится, но рынок уже закладывает возможность новых поправок."
        : "Правилу почти не верят. Участники рынка прогнозируют не цену нефти, а следующую поправку.";

  return (
    <section id="trust" aria-labelledby="trust-title" className="px-4 py-24 md:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          id="trust-title"
          eyebrow="07 · Игра в доверие"
          title="Шесть лет за пультом Минфина"
          lead="Каждый год приходит новая ситуация. Можно держать правило, переписать параметры или включить оговорку о выходе, если её условие заранее известно. Следите, что происходит с доверием."
        />

        <Reveal className="mt-12">
          <div className="grid gap-6 rounded-3xl border border-line bg-surface-1 p-4 md:p-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
            {/* Scenario */}
            <div className="flex min-h-80 flex-col">
              <div className="flex items-center justify-between">
                <span className="caption-3 num uppercase tracking-wider text-oil">
                  {done ? "Итог" : `Год ${round + 1} из ${ROUNDS.length}`}
                </span>
                <div className="flex gap-1" aria-hidden>
                  {ROUNDS.map((_, i) => (
                    <span
                      key={i}
                      className={`h-1 w-6 rounded-full transition-colors duration-500 ease-soft ${i < round ? "bg-oil" : i === round ? "bg-fg" : "bg-surface-4"}`}
                    />
                  ))}
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={done ? "done" : round}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -24 }}
                  transition={{ duration: 0.5, ease: EASE }}
                  className="mt-6 flex flex-1 flex-col"
                >
                  {done ? (
                    <>
                      <h3 className="heading-5 text-fg">Доверие: {trust} из 100</h3>
                      <p className="body-3 mt-3 text-muted">{verdict}</p>
                      <div className="mt-auto pt-6">
                        <button
                          onClick={restart}
                          className="button-md inline-flex items-center gap-2 rounded-xl bg-fg px-3 py-2 text-ink transition-[transform,opacity] duration-300 ease-soft hover:opacity-90 active:scale-[0.98]"
                        >
                          <ArrowCounterClockwise className="h-4 w-4" />
                          Сыграть ещё раз
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <span
                        className={`grid h-16 w-16 place-items-center rounded-2xl border ${
                          sc.kind === "down" ? "border-outflow/40 text-outflow" : sc.kind === "up" || sc.kind === "boom" ? "border-inflow/40 text-inflow" : "border-line-strong text-oil"
                        }`}
                      >
                        <sc.icon className="h-8 w-8" />
                      </span>
                      <h3 className="heading-5 mt-6 text-fg">{sc.title}</h3>
                      <p className="body-3 mt-2 text-muted">{sc.text}</p>
                      <div className="mt-auto grid gap-3 pt-6 sm:grid-cols-3">
                        <ChoiceBtn icon={<Lock className="h-5 w-5" />} label="Держать правило" onClick={() => play("hold")} />
                        <ChoiceBtn icon={<PencilSimpleLine className="h-5 w-5" />} label="Переписать параметры" onClick={() => play("rewrite")} />
                        <ChoiceBtn icon={<ShieldCheck className="h-5 w-5" />} label="Включить оговорку" onClick={() => play("escape")} />
                      </div>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>

              <div className="mt-6 min-h-12" aria-live="polite">
                <AnimatePresence mode="wait">
                  {last && (
                    <motion.p
                      key={history.length}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4, ease: EASE }}
                      className="body-6 rounded-xl border border-line bg-surface-2 p-3 text-muted"
                    >
                      <span className={`num body-4 ${last.dTrust >= 0 ? "text-inflow" : "text-outflow"}`}>
                        {last.dTrust >= 0 ? "+" : "−"}
                        {Math.abs(last.dTrust)}
                      </span>{" "}
                      {last.msg}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Meters */}
            <div className="flex flex-col gap-4">
              <Meter label="Доверие к правилу" value={trust} color="bg-oil" />
              <div className="rounded-2xl border border-line bg-surface-2 p-4">
                <div className="flex items-baseline justify-between">
                  <span className="caption-4 text-faint">Разброс ожиданий курса</span>
                  <span className="body-4 num text-fg">±{spread(trust).toFixed(1).replace(".", ",")} %</span>
                </div>
                <div className="relative mt-4 h-8 rounded-lg bg-surface-3">
                  <motion.div
                    className="absolute inset-y-1 left-1/2 w-full rounded-md bg-oil/25"
                    style={{ x: "-50%" }}
                    animate={{ scaleX: spread(trust) / 20 }}
                    transition={{ duration: 0.6, ease: EASE }}
                  />
                  <span className="absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2 bg-fg" />
                </div>
                <p className="caption-5 mt-2 text-faint">Чем ниже доверие, тем шире коридор, в котором рынок ждёт курс</p>
              </div>
              <Meter label="Резервы, условные единицы" value={buffer} color="bg-inflow" />
              <Spark data={history} />
            </div>
          </div>
        </Reveal>

        <p className="caption-5 mt-4 max-w-[680px] text-faint">
          Учебная модель. Коэффициенты условные: она показывает логику достоверного обязательства из работ Кидланда и Прескотта и Норта и Вайнгаста, а не прогнозирует курс. <Cite ids={[26, 27]} />
        </p>
      </div>
    </section>
  );
}

function ChoiceBtn({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="button-sm group flex items-center gap-2 rounded-xl border border-line-strong bg-surface-2 px-3 py-3 text-left text-fg transition-[transform,background-color,border-color] duration-300 ease-soft hover:-translate-y-0.5 hover:border-oil/60 hover:bg-surface-3 active:translate-y-px active:scale-[0.98] sm:flex-col sm:items-start"
    >
      <span className="text-oil transition-transform duration-300 ease-soft group-hover:scale-110">{icon}</span>
      {label}
    </button>
  );
}

function Meter({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="rounded-2xl border border-line bg-surface-2 p-4">
      <div className="flex items-baseline justify-between">
        <span className="caption-4 text-faint">{label}</span>
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={value}
            className="heading-6 num text-fg"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            {value}
          </motion.span>
        </AnimatePresence>
      </div>
      <div className="relative mt-3 h-2 overflow-hidden rounded-full bg-surface-4">
        <motion.div
          className={`absolute inset-0 origin-left rounded-full ${color}`}
          animate={{ scaleX: value / 100 }}
          transition={{ duration: 0.6, ease: EASE }}
        />
      </div>
    </div>
  );
}

function Spark({ data }: { data: number[] }) {
  const W = 300;
  const H = 64;
  const n = 7;
  const pts = data.map((v, i) => [(i / (n - 1)) * (W - 8) + 4, H - 4 - (v / 100) * (H - 8)] as const);
  const d = pts.map((p, i) => `${i ? "L" : "M"}${p[0]},${p[1]}`).join("");
  return (
    <div className="rounded-2xl border border-line bg-surface-2 p-4">
      <span className="caption-4 text-faint">Доверие по годам</span>
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-2 block h-16 w-full" preserveAspectRatio="none" aria-hidden>
        <line x1="4" x2={W - 4} y1={H - 4 - 0.7 * (H - 8)} y2={H - 4 - 0.7 * (H - 8)} stroke="rgb(245 241 232 / 0.12)" strokeDasharray="3 4" />
        <path d={d} fill="none" stroke="#F2A93B" strokeWidth={2} strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        {pts.map((p, i) => (
          <circle key={i} cx={p[0]} cy={p[1]} r={3} fill={i === pts.length - 1 ? "#F5F1E8" : "#F2A93B"} />
        ))}
      </svg>
    </div>
  );
}
