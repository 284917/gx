import { CalendarCheck, CheckCircle, Lightning, MagnifyingGlass, XCircle } from "@phosphor-icons/react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { EASE } from "../lib/hooks";
import { Reveal, SectionHeader } from "./ui";

const steps = [
  {
    icon: Lightning,
    title: "Условия приостановки заранее",
    text: "В законе прописано, какой шок даёт право отступить: например, падение цены ниже заданного уровня или резкое сокращение экспорта. Решение принимают по критерию, а не по ситуации.",
  },
  {
    icon: CalendarCheck,
    title: "Срок возврата",
    text: "Отступление длится заданное время, после чего правило возвращается автоматически. Для возврата не нужно отдельное решение.",
  },
  {
    icon: MagnifyingGlass,
    title: "Независимая оценка",
    text: "Каждую поправку оценивает внешний эксперт, например Счётная палата, и публикует заключение до голосования.",
  },
];

export function Proposal() {
  return (
    <section id="proposal" aria-labelledby="proposal-title" className="px-4 py-24 md:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          id="proposal-title"
          eyebrow="08 · Выводы"
          title="Процедура вместо поправок"
          lead="Более жёсткие параметры сами по себе не помогут: слишком строгое правило провоцирует новые отступления. Важнее понятная процедура изменения, при которой пересмотр перестаёт выглядеть как слабость обязательства."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
          <ol className="grid content-start gap-4">
            {steps.map((s, i) => (
              <Reveal as="li" key={s.title} delay={i * 0.08}>
                <div className="flex gap-4 rounded-2xl border border-line bg-surface-1 p-6">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-surface-3 text-oil">
                    <s.icon className="h-6 w-6" />
                  </span>
                  <div>
                    <p className="caption-3 num text-faint">Шаг {i + 1}</p>
                    <h3 className="heading-6 mt-1 text-fg">{s.title}</h3>
                    <p className="body-6 mt-2 text-muted">{s.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
            <p className="caption-5 text-faint">
              Идея гибкости с ограничением по величине и сроку отступления близка к предложениям Е. Т. Гурвича и И. А. Соколова.
            </p>
          </ol>

          <Reveal delay={0.1}>
            <FlowChart />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/** Escape clause logic drawn as a small flow: shock, check, temporary exit, automatic return */
function FlowChart() {
  const ref = useRef<SVGSVGElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -20% 0px" });
  const reduce = useReducedMotion();
  const line = (delay: number) => ({
    initial: { pathLength: reduce ? 1 : 0 },
    animate: inView ? { pathLength: 1 } : {},
    transition: { duration: reduce ? 0 : 0.6, ease: EASE, delay },
  });
  const node = (delay: number) => ({
    initial: { opacity: 0, y: reduce ? 0 : 8 },
    animate: inView ? { opacity: 1, y: 0 } : {},
    transition: { duration: 0.5, ease: EASE, delay: reduce ? 0 : delay },
  });

  return (
    <figure className="h-full rounded-3xl border border-line bg-surface-1 p-4 md:p-6">
      <figcaption className="title-4 text-fg">Как работает оговорка о выходе</figcaption>
      <svg ref={ref} viewBox="0 0 320 420" className="mt-4 block w-full" role="img" aria-label="Схема: шок, проверка условия, временный выход из правила и автоматический возврат">
        <g fill="none" stroke="#6B6760" strokeWidth={1.5}>
          <motion.path d="M160 64V108" {...line(0.3)} />
          <motion.path d="M160 172V196H70V228" {...line(0.7)} />
          <motion.path d="M160 172V196H250V228" {...line(0.7)} />
          <motion.path d="M70 292V316" {...line(1.1)} />
          <motion.path d="M70 380V396H160V300H250V292" stroke="#7CC4A4" strokeDasharray="4 5" {...line(1.5)} />
        </g>

        <motion.g {...node(0)}>
          <rect x="80" y="16" width="160" height="48" rx="12" fill="#272727" />
          <text x="160" y="45" textAnchor="middle" fill="#F5F1E8" fontSize="14" fontWeight="500">Внешний шок</text>
        </motion.g>
        <motion.g {...node(0.4)}>
          <rect x="60" y="108" width="200" height="64" rx="12" fill="#1F1F1F" stroke="#F2A93B" strokeOpacity="0.6" />
          <text x="160" y="136" textAnchor="middle" fill="#F5F1E8" fontSize="14" fontWeight="500">Условие из закона</text>
          <text x="160" y="155" textAnchor="middle" fill="#9B9B9B" fontSize="12">выполнено?</text>
        </motion.g>
        <motion.g {...node(0.9)}>
          <rect x="10" y="228" width="120" height="64" rx="12" fill="#1F1F1F" />
          <text x="70" y="256" textAnchor="middle" fill="#7CC4A4" fontSize="13" fontWeight="600">Да</text>
          <text x="70" y="275" textAnchor="middle" fill="#9B9B9B" fontSize="12">выход на срок</text>
        </motion.g>
        <motion.g {...node(0.9)}>
          <rect x="190" y="228" width="120" height="64" rx="12" fill="#1F1F1F" />
          <text x="250" y="256" textAnchor="middle" fill="#E5675A" fontSize="13" fontWeight="600">Нет</text>
          <text x="250" y="275" textAnchor="middle" fill="#9B9B9B" fontSize="12">правило действует</text>
        </motion.g>
        <motion.g {...node(1.3)}>
          <rect x="10" y="316" width="120" height="64" rx="12" fill="#272727" />
          <text x="70" y="344" textAnchor="middle" fill="#F5F1E8" fontSize="12" fontWeight="500">заключение</text>
          <text x="70" y="362" textAnchor="middle" fill="#F5F1E8" fontSize="12" fontWeight="500">эксперта</text>
        </motion.g>
        <motion.g {...node(1.8)}>
          <text x="196" y="352" fill="#7CC4A4" fontSize="12">автоматический</text>
          <text x="196" y="368" fill="#7CC4A4" fontSize="12">возврат</text>
        </motion.g>
      </svg>
      <div className="mt-4 flex flex-wrap gap-4">
        <span className="caption-4 flex items-center gap-2 text-muted">
          <CheckCircle className="h-4 w-4 text-inflow" />
          отступление предсказуемо
        </span>
        <span className="caption-4 flex items-center gap-2 text-muted">
          <XCircle className="h-4 w-4 text-outflow" />
          поправка «по ситуации» невозможна
        </span>
      </div>
    </figure>
  );
}
