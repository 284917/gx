import { motion, AnimatePresence, useReducedMotion, useInView } from "framer-motion";
import { scaleLinear, scalePoint } from "d3-scale";
import { useMemo, useRef, useState } from "react";
import { years, statusLabel, type YearPoint } from "../data/rule";
import { EASE, fmt, useMeasure } from "../lib/hooks";
import { Chip } from "./ui";

const Y_MIN = 30;
const Y_MAX = 80;

/**
 * Cut-off price as a step line against the annual Urals average.
 * Bars between the two show where money went into reserves and where it came out.
 */
export function RuleChart() {
  const [wrapRef, { width }] = useMeasure<HTMLDivElement>();
  const svgRef = useRef<SVGSVGElement | null>(null);
  const inView = useInView(svgRef, { once: true, margin: "0px 0px -15% 0px" });
  const reduce = useReducedMotion();
  const [hover, setHover] = useState<number | null>(null);

  const W = Math.max(width, 320);
  const H = W < 640 ? 300 : 400;
  const m = { t: 24, r: 16, b: 40, l: 44 };

  const x = useMemo(
    () => scalePoint<number>().domain(years.map((d) => d.year)).range([m.l, W - m.r]).padding(0.5),
    [W],
  );
  const y = useMemo(() => scaleLinear().domain([Y_MIN, Y_MAX]).range([H - m.b, m.t]), [H]);
  const step = x.step();

  const segs = years
    .filter((d) => d.cutoff !== null)
    .map((d) => {
      const cx = x(d.year)!;
      return { d, x1: cx - step / 2, x2: cx + step / 2, yv: y(d.cutoff!) };
    });

  // Vertical connectors between consecutive years that both have a cut-off
  const connectors: { x: number; y1: number; y2: number; key: string; dashed: boolean }[] = [];
  for (let i = 1; i < segs.length; i++) {
    const a = segs[i - 1];
    const b = segs[i];
    if (b.d.year - a.d.year === 1) {
      connectors.push({
        x: b.x1,
        y1: a.yv,
        y2: b.yv,
        key: `c${b.d.year}`,
        dashed: a.d.status !== "active" || b.d.status !== "active",
      });
    }
  }

  const urals = years.filter((d) => d.urals !== null);
  const ticks = [30, 40, 50, 60, 70, 80];
  const active = years.find((d) => d.year === hover) ?? null;

  const draw = (delay: number) => ({
    initial: { pathLength: reduce ? 1 : 0, opacity: reduce ? 0 : 1 },
    animate: inView ? { pathLength: 1, opacity: 1 } : {},
    transition: { duration: reduce ? 0.3 : 0.6, ease: EASE, delay: reduce ? 0 : delay },
  });

  return (
    <figure className="relative">
      <div ref={wrapRef} className="relative w-full">
        <svg
          ref={svgRef}
          width={W}
          height={H}
          viewBox={`0 0 ${W} ${H}`}
          className="block w-full overflow-visible"
          role="img"
          aria-label="График: цена отсечения бюджетного правила и средняя цена нефти Urals с 2017 по 2027 год"
          onMouseLeave={() => setHover(null)}
        >
          <defs>
            <pattern id="hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <rect width="6" height="6" fill="rgb(143 138 128 / 0.12)" />
              <line x1="0" y1="0" x2="0" y2="6" stroke="#8F8A80" strokeWidth="2" opacity="0.6" />
            </pattern>
          </defs>

          {/* Grid */}
          {ticks.map((t, i) => (
            <motion.g
              key={t}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, ease: EASE, delay: i * 0.04 }}
            >
              <line x1={m.l} x2={W - m.r} y1={y(t)} y2={y(t)} stroke="rgb(245 241 232 / 0.07)" />
              <text x={m.l - 10} y={y(t)} dy="0.32em" textAnchor="end" className="num" fontSize="12" fill="#6B6760">
                {t} $
              </text>
            </motion.g>
          ))}

          {/* Hover column highlight */}
          {active && (
            <rect
              x={x(active.year)! - step / 2}
              y={m.t}
              width={step}
              height={H - m.t - m.b}
              fill="rgb(245 241 232 / 0.04)"
              rx={6}
            />
          )}

          {/* Gap bars: Urals vs cut-off */}
          {years.map((d, i) => {
            if (d.cutoff === null || d.urals === null) return null;
            const up = d.urals > d.cutoff;
            const top = y(Math.max(d.urals, d.cutoff));
            const bot = y(Math.min(d.urals, d.cutoff));
            const bw = Math.min(step * 0.42, 28);
            const fill = d.status === "paused" ? "url(#hatch)" : up ? "rgb(124 196 164 / 0.28)" : "rgb(229 103 90 / 0.32)";
            const stroke = d.status === "paused" ? "#8F8A80" : up ? "#7CC4A4" : "#E5675A";
            return (
              <motion.rect
                key={`bar${d.year}`}
                x={x(d.year)! - bw / 2}
                y={top}
                width={bw}
                height={Math.max(bot - top, 1)}
                rx={4}
                fill={fill}
                stroke={stroke}
                strokeOpacity={0.6}
                style={{ originY: up ? 1 : 0, transformBox: "fill-box" }}
                initial={{ scaleY: reduce ? 1 : 0, opacity: reduce ? 0 : 1 }}
                animate={inView ? { scaleY: 1, opacity: 1 } : {}}
                transition={{ duration: 0.7, ease: EASE, delay: reduce ? 0 : 1.1 + i * 0.07 }}
              />
            );
          })}

          {/* Cut-off step line */}
          {segs.map((s, i) => {
            const dashed = s.d.status !== "active";
            const color = s.d.status === "paused" ? "#8F8A80" : s.d.status === "proposed" ? "#F2A93B" : "#F5F1E8";
            return (
              <motion.path
                key={`seg${s.d.year}`}
                d={`M${s.x1},${s.yv}H${s.x2}`}
                stroke={color}
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeDasharray={dashed ? "5 6" : undefined}
                fill="none"
                {...draw(0.15 + i * 0.09)}
              />
            );
          })}
          {connectors.map((c, i) => (
            <motion.path
              key={c.key}
              d={`M${c.x},${c.y1}V${c.y2}`}
              stroke={c.dashed ? "#8F8A80" : "#F5F1E8"}
              strokeWidth={1.5}
              strokeDasharray={c.dashed ? "3 5" : undefined}
              fill="none"
              opacity={0.7}
              {...draw(0.2 + i * 0.09)}
            />
          ))}

          {/* 2023: anchor was revenue, not price */}
          {(() => {
            const d = years.find((p) => p.status === "revenue");
            if (!d) return null;
            const cx = x(d.year)!;
            const bw = Math.min(step - 8, 64);
            return (
              <motion.g
                initial={{ opacity: 0, y: reduce ? 0 : 8 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, ease: EASE, delay: 0.9 }}
              >
                <rect x={cx - bw / 2} y={y(76)} width={bw} height={y(30) - y(76) - 4} rx={8} fill="url(#hatch)" opacity={0.6} />
                <text x={cx} y={y(78)} textAnchor="middle" className="num" fontSize="11" fill="#9B9B9B">
                  8 трлн ₽
                </text>
              </motion.g>
            );
          })()}

          {/* Urals line and dots */}
          {urals.map((d, i) => {
            const next = urals[i + 1];
            if (!next) return null;
            const gap = next.year - d.year > 1;
            return (
              <motion.path
                key={`ul${d.year}`}
                d={`M${x(d.year)},${y(d.urals!)}L${x(next.year)},${y(next.urals!)}`}
                stroke="#F2A93B"
                strokeWidth={gap ? 1 : 1.5}
                strokeDasharray={gap ? "2 5" : undefined}
                opacity={gap ? 0.45 : 0.8}
                fill="none"
                {...draw(1.4 + i * 0.08)}
              />
            );
          })}
          {urals.map((d, i) => (
            <motion.circle
              key={`ud${d.year}`}
              cx={x(d.year)}
              cy={y(d.urals!)}
              r={hover === d.year ? 7 : 5}
              fill="#F2A93B"
              stroke="#131209"
              strokeWidth={2.5}
              initial={{ scale: reduce ? 1 : 0, opacity: reduce ? 0 : 1 }}
              animate={inView ? { scale: 1, opacity: 1 } : {}}
              style={{ transformBox: "fill-box", originX: 0.5, originY: 0.5 }}
              transition={{ duration: 0.5, ease: EASE, delay: reduce ? 0 : 1.5 + i * 0.08 }}
            />
          ))}

          {/* Proposed 2027 pulse */}
          {(() => {
            const d = years.find((p) => p.status === "proposed")!;
            const cx = x(d.year)!;
            const cy = y(d.cutoff!);
            return (
              <g>
                {!reduce && <circle cx={cx} cy={cy} r={6} fill="#F2A93B" className="pulse-ring" opacity={0.5} />}
                <motion.circle
                  cx={cx}
                  cy={cy}
                  r={4.5}
                  fill="#F2A93B"
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : {}}
                  transition={{ duration: 0.4, ease: EASE, delay: 1.2 }}
                />
              </g>
            );
          })()}

          {/* Year labels */}
          {years.map((d) => (
            <text
              key={`yl${d.year}`}
              x={x(d.year)}
              y={H - m.b + 24}
              textAnchor="middle"
              className="num"
              fontSize={W < 520 ? 10 : 12}
              fill={hover === d.year ? "#F5F1E8" : "#6B6760"}
            >
              {W < 520 ? `’${String(d.year).slice(2)}` : d.year}
            </text>
          ))}

          {/* Hit areas */}
          {years.map((d) => (
            <rect
              key={`hit${d.year}`}
              x={x(d.year)! - step / 2}
              y={m.t}
              width={step}
              height={H - m.t - m.b + 32}
              fill="transparent"
              onMouseEnter={() => setHover(d.year)}
              onClick={() => setHover((h) => (h === d.year ? null : d.year))}
              style={{ cursor: "pointer" }}
            />
          ))}
        </svg>

        <AnimatePresence>
          {active && (
            <Tooltip key={active.year} d={active} left={x(active.year)!} width={W} />
          )}
        </AnimatePresence>
      </div>

      <figcaption className="mt-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <ul className="flex flex-wrap gap-x-4 gap-y-2">
          <Legend swatch={<span className="h-0.5 w-6 rounded-full bg-cut" />} label="Цена отсечения" />
          <Legend swatch={<span className="h-3 w-3 rounded-full border-2 border-ink bg-oil" />} label="Urals, среднее за год" />
          <Legend swatch={<span className="h-3 w-2 rounded-sm bg-inflow/50" />} label="Налоги со сверхцены в резервы" />
          <Legend swatch={<span className="h-3 w-2 rounded-sm bg-outflow/60" />} label="Недобор покрывают из ФНБ" />
          <Legend swatch={<span className="h-3 w-2 rounded-sm border border-pause bg-pause/30" />} label="Пауза или другая формула" />
        </ul>
        <p className="caption-5 max-w-sm text-faint md:text-right">
          Нажмите или наведите на год. Для 2024 года сводной средней цены Urals нет.
        </p>
      </figcaption>
    </figure>
  );
}

function Legend({ swatch, label }: { swatch: React.ReactNode; label: string }) {
  return (
    <li className="caption-4 flex items-center gap-2 text-muted">
      {swatch}
      {label}
    </li>
  );
}

function Tooltip({ d, left, width }: { d: YearPoint; left: number; width: number }) {
  const tone = d.status === "active" ? "neutral" : d.status === "proposed" ? "oil" : "pause";
  const gap = d.cutoff !== null && d.urals !== null ? d.urals - d.cutoff : null;
  const cardW = 248;
  const clamped = Math.min(Math.max(left - cardW / 2, 0), width - cardW);
  return (
    <motion.div
      role="status"
      className="pointer-events-none absolute top-0 z-10 rounded-2xl border border-line-strong bg-surface-2/95 p-4 backdrop-blur-md"
      style={{ left: clamped, width: cardW }}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 4 }}
      transition={{ duration: 0.3, ease: EASE }}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="title-2 num text-fg">{d.year}</span>
        <Chip tone={tone}>{statusLabel[d.status]}</Chip>
      </div>
      <dl className="mt-3 grid grid-cols-2 gap-2">
        <div>
          <dt className="caption-5 text-faint">Отсечка</dt>
          <dd className="body-4 num text-fg">{d.cutoff !== null ? `${fmt(d.cutoff, d.cutoff % 1 ? 1 : 0)} $` : "нет"}</dd>
        </div>
        <div>
          <dt className="caption-5 text-faint">Urals</dt>
          <dd className="body-4 num text-oil">{d.urals !== null ? `${fmt(d.urals, 2)} $` : "нет данных"}</dd>
        </div>
      </dl>
      {d.cutoffNote && <p className="caption-5 mt-2 text-muted">{d.cutoffNote}</p>}
      {gap !== null && d.status === "active" && (
        <p className={`caption-4 mt-2 ${gap >= 0 ? "text-inflow" : "text-outflow"}`}>
          {gap >= 0 ? `Выше отсечки на ${fmt(gap, 1)} $` : `Ниже отсечки на ${fmt(Math.abs(gap), 1)} $`}
        </p>
      )}
      {d.status === "paused" && gap !== null && (
        <p className="caption-4 mt-2 text-pause">Разница {fmt(gap, 1)} $ не откладывалась</p>
      )}
    </motion.div>
  );
}
