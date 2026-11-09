import { motion, useInView, useReducedMotion } from "framer-motion";
import { scaleLinear, scalePoint } from "d3-scale";
import { area, curveMonotoneX, line } from "d3-shape";
import { useRef } from "react";
import { reserves } from "../data/rule";
import { EASE, fmt, useMeasure } from "../lib/hooks";
import { Reveal, SectionHeader } from "./ui";

export function Reserves() {
  const [wrap, { width }] = useMeasure<HTMLDivElement>();
  const svg = useRef<SVGSVGElement | null>(null);
  const inView = useInView(svg, { once: true, margin: "0px 0px -15% 0px" });
  const reduce = useReducedMotion();

  const W = Math.max(width, 300);
  const H = W < 640 ? 260 : 320;
  const m = { t: 40, r: 24, b: 40, l: 24 };
  const x = scalePoint<string>().domain(reserves.map((d) => d.label)).range([m.l, W - m.r]).padding(0.3);
  const y = scaleLinear().domain([0, 8]).range([H - m.b, m.t]);

  const ln = line<(typeof reserves)[number]>()
    .x((d) => x(d.label)!)
    .y((d) => y(d.pct))
    .curve(curveMonotoneX);
  const ar = area<(typeof reserves)[number]>()
    .x((d) => x(d.label)!)
    .y0(H - m.b)
    .y1((d) => y(d.pct))
    .curve(curveMonotoneX);

  const first = reserves[0];
  const last = reserves[reserves.length - 1];

  return (
    <section id="reserves" aria-labelledby="reserves-title" className="px-4 py-24 md:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          id="reserves-title"
          eyebrow="05 · Запас прочности"
          title="Подушка стала тоньше в четыре с половиной раза"
          lead="Ликвидная часть ФНБ, то есть деньги, которые можно быстро потратить, с начала 2022 года сократилась с 7,3 до 1,6 % ВВП. Главная причина в финансировании дефицита, а не в самих поправках. Но чем тоньше подушка, тем дороже обходится каждое отступление от правила."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-[2fr_1fr]">
          <Reveal>
            <figure className="rounded-3xl border border-line bg-surface-1 p-4 md:p-8">
              <figcaption className="mb-4">
                <p className="title-3 text-fg">Ликвидная часть ФНБ</p>
                <p className="caption-2 text-muted">процент ВВП на дату</p>
              </figcaption>
              <div ref={wrap}>
                <svg ref={svg} width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="block w-full overflow-visible" role="img" aria-label="Ликвидная часть ФНБ сократилась с 7,3 % ВВП в январе 2022 года до 1,6 % ВВП в октябре 2026 года">
                  {[0, 2, 4, 6, 8].map((t) => (
                    <line key={t} x1={m.l} x2={W - m.r} y1={y(t)} y2={y(t)} stroke="rgb(245 241 232 / 0.07)" />
                  ))}
                  <motion.path
                    d={ar(reserves) ?? ""}
                    fill="rgb(124 196 164 / 0.12)"
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.8, ease: EASE, delay: reduce ? 0 : 0.9 }}
                  />
                  <motion.path
                    d={ln(reserves) ?? ""}
                    fill="none"
                    stroke="#7CC4A4"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    initial={{ pathLength: reduce ? 1 : 0 }}
                    animate={inView ? { pathLength: 1 } : {}}
                    transition={{ duration: reduce ? 0 : 1.4, ease: EASE }}
                  />
                  {reserves.map((d, i) => (
                    <motion.g
                      key={d.label}
                      initial={{ opacity: 0, y: reduce ? 0 : 8 }}
                      animate={inView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.5, ease: EASE, delay: reduce ? 0 : 0.3 + i * 0.18 }}
                    >
                      <circle cx={x(d.label)} cy={y(d.pct)} r={5} fill="#7CC4A4" stroke="#181818" strokeWidth={3} />
                      <text x={x(d.label)} y={y(d.pct) - 14} textAnchor="middle" className="num" fontSize={W < 520 ? 11 : 13} fill="#F5F1E8">
                        {fmt(d.pct, 1)}
                      </text>
                      <text x={x(d.label)} y={H - m.b + 24} textAnchor="middle" className="num" fontSize={W < 520 ? 10 : 12} fill="#6B6760">
                        {W < 520 ? d.short : d.label}
                      </text>
                    </motion.g>
                  ))}
                </svg>
              </div>
              <p className="caption-5 mt-4 text-faint">
                По данным Минфина
              </p>
            </figure>
          </Reveal>

          <div className="grid gap-6">
            <Reveal delay={0.05}>
              <div className="h-full rounded-2xl border border-line bg-surface-1 p-6">
                <p className="caption-4 text-faint">{first.label}</p>
                <p className="heading-3 num mt-2 text-fg">{fmt(first.trln!, 2)} трлн ₽</p>
                <p className="caption-2 mt-1 text-muted">{fmt(first.pct, 1)} % ВВП</p>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="h-full rounded-2xl border border-line bg-surface-1 p-6">
                <p className="caption-4 text-faint">{last.label}</p>
                <p className="heading-3 num mt-2 text-inflow">{fmt(last.trln!, 2)} трлн ₽</p>
                <p className="caption-2 mt-1 text-muted">{fmt(last.pct, 1)} % ВВП</p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
