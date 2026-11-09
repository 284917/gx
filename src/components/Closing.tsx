import { ArrowRight, ArrowUp, Plus } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { site } from "../content/site";
import { sources } from "../data/sources";
import { EASE } from "../lib/hooks";
import { Logo } from "./Logo";
import { Cite, Reveal, SectionHeader } from "./ui";

export const FAQ: { q: string; a: string; cite?: number[] }[] = [
  {
    q: "Что такое бюджетное правило?",
    a: "Нормы Бюджетного кодекса, которые ограничивают, какую часть нефтегазовых доходов бюджет может потратить. Доходы сверх базового уровня откладываются в Фонд национального благосостояния.",
    cite: [1, 2],
  },
  {
    q: "Что такое цена отсечения?",
    a: "Цена барреля Urals, от которой считают базовые нефтегазовые доходы. В 2026 году это 59 $, в проекте бюджета на 2027 год 50 $.",
    cite: [6, 11, 12],
  },
  {
    q: "Куда идут сверхдоходы?",
    a: "Минфин покупает на них валюту и золото на внутреннем рынке и зачисляет в ФНБ. Если нефть дешевле отсечки, Минфин наоборот продаёт валюту из фонда.",
    cite: [2, 8],
  },
  {
    q: "Почему правило так часто меняют?",
    a: "Причины разные: санкции и заморозка части активов в 2022 году, падение цен на нефть, рост расходов. Каждое решение по отдельности объяснимо, проблема в их частоте.",
    cite: [2, 4, 6],
  },
  {
    q: "Чем плохи частые изменения?",
    a: "Правило работает через ожидания. Если его регулярно переписывают, бизнес и банки начинают ждать следующую поправку, и стабилизирующий эффект слабеет, хотя и не исчезает полностью.",
  },
  {
    q: "Почему просто не сделать правило жёстче?",
    a: "Слишком строгое правило труднее соблюдать при сильном шоке, и соблазн отступить растёт. Поэтому важнее предсказуемая процедура изменения, чем жёсткость параметров.",
    cite: [25],
  },
  {
    q: "Что такое оговорка о выходе?",
    a: "Заранее прописанное в законе условие, при котором правило можно временно приостановить. Вместе с ней задаётся срок, после которого правило возвращается само.",
    cite: [25],
  },
  {
    q: "Симулятор прогнозирует курс или доходы бюджета?",
    a: "Нет. Он показывает механику на одном барреле и использует опубликованную оценку связи цены отсечения и курса: от 0,4 до 0,6 % на каждый доллар. Игра в доверие построена на условных коэффициентах.",
    cite: [7],
  },
  {
    q: "Откуда данные?",
    a: "Данные Минфина и Минэкономразвития в публикациях Интерфакса, ТАСС, The Moscow Times (Reuters), «Эксперта», Финмаркета и КонсультантПлюс, а также научные статьи. Полный список ниже.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" aria-labelledby="faq-title" className="px-4 py-24 md:px-8">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]">
        <SectionHeader id="faq-title" eyebrow="10 · Вопросы" title="Коротко о главном" lead="Ответы на вопросы, которые чаще всего задают после доклада." />
        <Reveal>
          <ul className="flex flex-col gap-2">
            {FAQ.map((f, i) => {
              const on = open === i;
              return (
                <li key={f.q} className={`rounded-2xl border transition-colors duration-300 ease-soft ${on ? "border-line-strong bg-surface-2" : "border-line bg-surface-1"}`}>
                  <h3>
                    <button
                      onClick={() => setOpen(on ? null : i)}
                      aria-expanded={on}
                      aria-controls={`faq-${i}`}
                      className="title-2 flex w-full items-center justify-between gap-4 rounded-2xl p-4 text-left text-fg md:p-6"
                    >
                      {f.q}
                      <motion.span animate={{ rotate: on ? 45 : 0 }} transition={{ duration: 0.5, ease: EASE }} className="shrink-0 text-muted">
                        <Plus className="h-5 w-5" />
                      </motion.span>
                    </button>
                  </h3>
                  <AnimatePresence initial={false}>
                    {on && (
                      <motion.div
                        id={`faq-${i}`}
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4, ease: EASE }}
                      >
                        <p className="body-6 px-4 pb-4 text-muted md:px-6 md:pb-6">
                          {f.a} {f.cite && <Cite ids={f.cite} />}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

export function FinalCta() {
  return (
    <section aria-labelledby="cta-title" className="px-4 py-24 md:px-8">
      <Reveal className="mx-auto max-w-6xl">
        <div className="flex flex-col items-start gap-6 rounded-3xl border border-line bg-surface-2 p-8 md:flex-row md:items-center md:justify-between md:p-12">
          <div className="max-w-[680px]">
            <h2 id="cta-title" className="heading-4 md:heading-3 text-fg">
              Проверьте сами, как правило переживает шоки
            </h2>
            <p className="body-3 mt-3 text-muted">Шесть сценариев из реальной истории и любая цена нефти от 20 до 120 долларов.</p>
          </div>
          <a
            href="#simulator"
            className="button-md group inline-flex shrink-0 items-center gap-2 rounded-xl bg-fg px-3 py-2 text-ink transition-[transform,opacity] duration-300 ease-soft hover:-translate-y-0.5 hover:opacity-90 active:translate-y-px active:scale-[0.98]"
          >
            Открыть симулятор
            <ArrowRight weight="bold" className="h-4 w-4 transition-transform duration-300 ease-soft group-hover:translate-x-0.5" />
          </a>
        </div>
      </Reveal>
    </section>
  );
}

export function Sources() {
  return (
    <section id="sources" aria-labelledby="sources-title" className="px-4 py-24 md:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeader id="sources-title" eyebrow="Источники" title="Откуда цифры" lead={`Каждая цифра на странице ведёт сюда. Ссылки проверены ${site.dataDate}.`} />
        <ol className="mt-12 grid gap-x-12 gap-y-3 md:grid-cols-2">
          {sources.map((s) => (
            <li key={s.id} id={`source-${s.id}`} className="caption-2 flex scroll-mt-24 gap-3 rounded-lg text-muted target:text-fg">
              <span className="num w-6 shrink-0 text-right text-faint">{s.id}.</span>
              <span className="min-w-0 break-words">
                {s.text}{" "}
                {s.url && (
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="break-all text-oil/80 underline decoration-oil/30 underline-offset-2 transition-colors duration-300 ease-soft hover:text-oil">
                    {s.url.replace(/^https?:\/\//, "").slice(0, 48)}
                    {s.url.replace(/^https?:\/\//, "").length > 48 ? "…" : ""}
                  </a>
                )}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Footer({ home = true }: { home?: boolean }) {
  const byline = [site.author, site.affiliation, site.advisor].filter(Boolean).join(" · ");
  return (
    <footer className="border-t border-line px-4 py-12 md:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 md:flex-row md:items-start md:justify-between">
        <div className="max-w-md">
          <a href={home ? "#top" : "/"} className="flex items-center gap-2">
            <Logo className="h-6 w-6" />
            <span className="title-4 text-fg">Отсечка</span>
          </a>
          <p className="caption-2 mt-3 text-muted">
            Материал к докладу «Бюджетное правило в России как институт» на VIII Горчаковских чтениях, РАНХиГС, Санкт-Петербург, ноябрь 2026 года.
          </p>
          {byline && <p className="caption-2 mt-2 text-fg">{byline}</p>}
          <p className="caption-5 mt-3 text-faint">Данные актуальны на {site.dataDate}. Это учебный проект, а не инвестиционная рекомендация.</p>
        </div>
        <nav aria-label="Ссылки в подвале">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            <li>
              <a href={home ? "#sources" : "/#sources"} className="caption-1 text-muted transition-colors duration-300 ease-soft hover:text-fg">
                Источники
              </a>
            </li>
            <li>
              <a href="/privacy" className="caption-1 text-muted transition-colors duration-300 ease-soft hover:text-fg">
                Конфиденциальность
              </a>
            </li>
            <li>
              <a href={home ? "#top" : "/"} className="caption-1 inline-flex items-center gap-1 text-muted transition-colors duration-300 ease-soft hover:text-fg">
                <ArrowUp className="h-4 w-4" />
                {home ? "Наверх" : "На главную"}
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
