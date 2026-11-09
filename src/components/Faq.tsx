import {
  ArrowLeft,
  ArrowRight,
  Bank,
  ChartLineDown,
  Coins,
  Database,
  Flask,
  Gauge,
  Scales,
  ShieldCheck,
  SlidersHorizontal,
  type Icon,
} from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion, type PanInfo } from "framer-motion";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { EASE } from "../lib/hooks";
import { Reveal, SectionHeader } from "./ui";

type Item = {
  q: string;
  short: string;
  a: string;
  icon: Icon;
  fact: { value: string; label: string };
};

export const FAQ: Item[] = [
  {
    q: "Что такое бюджетное правило?",
    short: "Само правило",
    a: "Нормы Бюджетного кодекса, которые ограничивают, какую часть нефтегазовых доходов бюджет может потратить. Всё, что сверх базового уровня, откладывается в Фонд национального благосостояния.",
    icon: Bank,
    fact: { value: "40 $", label: "первая цена отсечения в нынешней конструкции, 2017 год" },
  },
  {
    q: "Что такое цена отсечения?",
    short: "Цена отсечения",
    a: "Цена барреля Urals, от которой считают базовые нефтегазовые доходы. Бюджет планирует расходы так, будто нефть стоит ровно столько.",
    icon: Gauge,
    fact: { value: "59 → 50 $", label: "в 2026 году и в проекте бюджета на 2027 год" },
  },
  {
    q: "Куда идут сверхдоходы?",
    short: "Сверхдоходы",
    a: "Минфин покупает на них валюту и золото на внутреннем рынке и зачисляет в ФНБ. Если нефть дешевле отсечки, Минфин наоборот продаёт валюту из фонда.",
    icon: Coins,
    fact: { value: "110,3 млрд ₽", label: "покупки в мае 2026 года с учётом отложенных за март и апрель" },
  },
  {
    q: "Почему правило так часто меняют?",
    short: "Почему меняют",
    a: "Причины разные: санкции и заморозка части активов в 2022 году, падение цен на нефть, рост расходов. Каждое решение по отдельности объяснимо, проблема в их частоте.",
    icon: SlidersHorizontal,
    fact: { value: "4", label: "пересмотра параметров правила с 2022 года" },
  },
  {
    q: "Чем плохи частые изменения?",
    short: "Цена поправок",
    a: "Правило работает через ожидания. Если его регулярно переписывают, бизнес и банки начинают ждать следующую поправку, и стабилизирующий эффект слабеет, хотя и не исчезает полностью.",
    icon: ChartLineDown,
    fact: { value: "0,4…0,6 %", label: "курса рубля на каждый доллар цены отсечения, по оценке аналитиков" },
  },
  {
    q: "Почему просто не сделать правило жёстче?",
    short: "Жёстче или гибче",
    a: "Слишком строгое правило труднее соблюдать при сильном шоке, и соблазн отступить растёт. Поэтому важнее предсказуемая процедура изменения, чем жёсткость параметров.",
    icon: Scales,
    fact: { value: "2", label: "паузы в покупках и продажах валюты: 2022 и 2026 годы" },
  },
  {
    q: "Что такое оговорка о выходе?",
    short: "Оговорка о выходе",
    a: "Заранее прописанное в законе условие, при котором правило можно временно приостановить. Вместе с ней задаётся срок, после которого правило возвращается само.",
    icon: ShieldCheck,
    fact: { value: "3 шага", label: "условие из закона, срок возврата, независимая оценка" },
  },
  {
    q: "Симулятор прогнозирует курс или доходы бюджета?",
    short: "Про симулятор",
    a: "Нет. Он показывает механику правила на одном барреле и использует опубликованную оценку связи цены отсечения и курса. Объёмы экспорта и налоговые формулы в нём не считаются.",
    icon: Flask,
    fact: { value: "1 баррель", label: "масштаб учебной модели" },
  },
  {
    q: "Откуда данные?",
    short: "Данные",
    a: "Данные Минфина и Минэкономразвития в публикациях Интерфакса, ТАСС, The Moscow Times, «Эксперта», Финмаркета и КонсультантПлюс, а также научные статьи в «Вопросах экономики».",
    icon: Database,
    fact: { value: "9.11.2026", label: "дата последней проверки цифр" },
  },
];

const pad = (n: number) => String(n).padStart(2, "0");

export function Faq() {
  const [[idx, dir], setState] = useState<[number, number]>([0, 0]);
  const reduce = useReducedMotion();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const rail = useRef<HTMLDivElement | null>(null);
  const n = FAQ.length;

  // On phones the list is a horizontal rail: keep the active question in view
  useEffect(() => {
    const r = rail.current;
    const t = tabs.current[idx];
    if (!r || !t || r.scrollWidth <= r.clientWidth) return;
    r.scrollTo({ left: t.offsetLeft - 16, behavior: reduce ? "auto" : "smooth" });
  }, [idx, reduce]);

  const go = (next: number, focus = false) => {
    const target = (next + n) % n;
    setState([target, target > idx || (idx === n - 1 && target === 0) ? 1 : -1]);
    if (focus) tabs.current[target]?.focus();
  };

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      e.preventDefault();
      go(idx + 1, true);
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      e.preventDefault();
      go(idx - 1, true);
    } else if (e.key === "Home") {
      e.preventDefault();
      go(0, true);
    } else if (e.key === "End") {
      e.preventDefault();
      go(n - 1, true);
    }
  };

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -60) go(idx + 1);
    else if (info.offset.x > 60) go(idx - 1);
  };

  const item = FAQ[idx];
  const shift = reduce ? 0 : 48;

  return (
    <section id="faq" aria-labelledby="faq-title" className="px-4 py-24 md:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          id="faq-title"
          eyebrow="08 · Вопросы"
          title="Коротко о главном"
          lead="Девять коротких ответов о том, как устроено правило и почему его поправки так важны."
        />

        <Reveal className="mt-12">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
            {/* Question list: vertical on desktop, swipeable rail on phones */}
            <div
              ref={rail}
              role="tablist"
              aria-label="Вопросы"
              aria-orientation="vertical"
              onKeyDown={onKey}
              className="no-scrollbar -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-2 overflow-x-auto px-4 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0"
            >
              {FAQ.map((f, i) => {
                const on = i === idx;
                return (
                  <button
                    key={f.q}
                    ref={(el) => (tabs.current[i] = el)}
                    role="tab"
                    id={`faq-tab-${i}`}
                    aria-selected={on}
                    aria-controls="faq-panel"
                    tabIndex={on ? 0 : -1}
                    onClick={() => go(i)}
                    className="group relative flex shrink-0 snap-start items-center gap-4 rounded-2xl px-4 py-3 text-left transition-colors duration-300 ease-soft lg:w-full"
                  >
                    {on && (
                      <motion.span
                        layoutId="faq-active"
                        className="absolute inset-0 rounded-2xl border border-line-strong bg-surface-2"
                        transition={{ duration: reduce ? 0 : 0.5, ease: EASE }}
                      />
                    )}
                    <span
                      className={`caption-3 num relative transition-colors duration-300 ease-soft ${on ? "text-oil" : "text-faint group-hover:text-muted"}`}
                    >
                      {pad(i + 1)}
                    </span>
                    <span
                      className={`title-3 relative whitespace-nowrap transition-colors duration-300 ease-soft lg:whitespace-normal ${
                        on ? "text-fg" : "text-muted group-hover:text-fg"
                      }`}
                    >
                      <span className="lg:hidden">{f.short}</span>
                      <span className="hidden lg:inline">{f.q}</span>
                    </span>
                    <ArrowRight
                      className={`relative ml-auto hidden h-4 w-4 shrink-0 transition-[transform,opacity] duration-300 ease-soft lg:block ${
                        on ? "translate-x-0 text-oil opacity-100" : "-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-60"
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            {/* Answer stage */}
            <div
              id="faq-panel"
              role="tabpanel"
              aria-labelledby={`faq-tab-${idx}`}
              className="relative overflow-hidden rounded-3xl border border-line bg-surface-1"
            >
              {/* progress */}
              <div className="flex gap-1 p-6 pb-0 md:p-8 md:pb-0" aria-hidden>
                {FAQ.map((_, i) => (
                  <span key={i} className="relative h-1 flex-1 overflow-hidden rounded-full bg-surface-4">
                    <motion.span
                      className="absolute inset-0 origin-left rounded-full bg-oil"
                      initial={false}
                      animate={{ scaleX: i <= idx ? 1 : 0, opacity: i === idx ? 1 : 0.45 }}
                      transition={{ duration: 0.5, ease: EASE }}
                    />
                  </span>
                ))}
              </div>

              <AnimatePresence mode="wait" initial={false} custom={dir}>
                <motion.article
                  key={idx}
                  custom={dir}
                  variants={{
                    enter: (d: number) => ({ opacity: 0, x: d * shift }),
                    center: { opacity: 1, x: 0 },
                    exit: (d: number) => ({ opacity: 0, x: d * -shift }),
                  }}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.5, ease: EASE }}
                  drag={reduce ? false : "x"}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.18}
                  onDragEnd={onDragEnd}
                  className="relative flex min-h-96 cursor-grab flex-col p-6 active:cursor-grabbing md:p-8"
                >
                  {/* oversized number in the corner */}
                  <span aria-hidden className="heading-1 num pointer-events-none absolute right-6 top-4 select-none text-fg/5 md:right-8">
                    {pad(idx + 1)}
                  </span>

                  <motion.span
                    initial={{ scale: reduce ? 1 : 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, ease: EASE, delay: 0.1 }}
                    className="grid h-12 w-12 place-items-center rounded-xl border border-oil/40 text-oil"
                  >
                    <item.icon className="h-6 w-6" />
                  </motion.span>

                  <h3 className="heading-5 md:heading-4 mt-6 max-w-[520px] text-fg">{item.q}</h3>
                  <p className="body-3 mt-4 max-w-[560px] text-muted">{item.a}</p>

                  <motion.div
                    initial={{ opacity: 0, y: reduce ? 0 : 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: EASE, delay: 0.18 }}
                    className="mt-auto pt-8"
                  >
                    <div className="flex flex-col gap-2 rounded-2xl border border-line bg-surface-2 p-4 sm:flex-row sm:items-center sm:gap-6 md:p-6">
                      <span className="heading-4 num shrink-0 whitespace-nowrap text-oil">{item.fact.value}</span>
                      <span className="caption-2 text-muted">{item.fact.label}</span>
                    </div>
                  </motion.div>
                </motion.article>
              </AnimatePresence>

              {/* controls */}
              <div className="flex items-center justify-between gap-4 border-t border-line px-6 py-4 md:px-8">
                <span className="caption-4 num text-faint">
                  {pad(idx + 1)} / {pad(n)}
                  <span className="hidden sm:inline"> · листайте стрелками или свайпом</span>
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => go(idx - 1)}
                    aria-label="Предыдущий вопрос"
                    className="grid h-10 w-10 place-items-center rounded-xl border border-line text-muted transition-[transform,background-color,color,border-color] duration-300 ease-soft hover:border-line-strong hover:bg-surface-3 hover:text-fg active:scale-[0.98]"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => go(idx + 1)}
                    aria-label="Следующий вопрос"
                    className="grid h-10 w-10 place-items-center rounded-xl bg-fg text-ink transition-[transform,opacity] duration-300 ease-soft hover:opacity-90 active:scale-[0.98]"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
