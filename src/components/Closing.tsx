import { ArrowRight, ArrowUp } from "@phosphor-icons/react";
import { site } from "../content/site";
import { Logo } from "./Logo";
import { Reveal } from "./ui";

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
          {byline && <p className="caption-2 mt-2 text-fg">{byline}</p>}
          <p className="caption-5 mt-3 text-faint">Данные актуальны на {site.dataDate}. Это учебный проект, а не инвестиционная рекомендация.</p>
        </div>
        <nav aria-label="Ссылки в подвале">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
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
