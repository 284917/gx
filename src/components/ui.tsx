import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { EASE } from "../lib/hooks";

/** Section entering the viewport: rises 32px and fades in once (B7) */
export function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li" | "article" | "figure";
}) {
  const reduce = useReducedMotion();
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.7, ease: EASE, delay }}
    >
      {children}
    </Comp>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  lead,
  id,
}: {
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  id?: string;
}) {
  return (
    <Reveal className="max-w-[680px]">
      <p className="caption-3 num uppercase tracking-widest text-oil">{eyebrow}</p>
      <h2 id={id} className="heading-4 md:heading-3 mt-3 text-fg">
        {title}
      </h2>
      {lead && <p className="body-3 mt-4 text-muted">{lead}</p>}
    </Reveal>
  );
}

export function Chip({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "oil" | "inflow" | "outflow" | "pause" }) {
  const map = {
    neutral: "border-line-strong text-fg",
    oil: "border-oil/40 text-oil",
    inflow: "border-inflow/40 text-inflow",
    outflow: "border-outflow/40 text-outflow",
    pause: "border-pause/50 text-pause",
  } as const;
  return (
    <span className={`caption-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 ${map[tone]}`}>
      {children}
    </span>
  );
}

export function PrimaryButton({ href, children, onClick }: { href: string; children: ReactNode; onClick?: () => void }) {
  return (
    <a
      href={href}
      onClick={onClick}
      className="button-md group inline-flex items-center gap-2 rounded-xl bg-fg px-3 py-2 text-ink transition-[transform,opacity] duration-300 ease-soft hover:-translate-y-0.5 hover:opacity-90 active:translate-y-px active:scale-[0.98]"
    >
      {children}
    </a>
  );
}
