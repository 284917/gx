import { Handshake, Scales, SlidersHorizontal } from "@phosphor-icons/react";
import { Reveal, SectionHeader } from "./ui";

const ideas = [
  {
    icon: Handshake,
    who: "Норт и Вайнгаст, 1989",
    title: "Достоверное обязательство",
    text: "Обещанию верят, когда нарушить его дороже, чем выполнить. После 1688 года английская корона стала занимать дешевле, потому что парламент ограничил её право менять правила в одностороннем порядке.",
    cite: [26, 28],
  },
  {
    icon: Scales,
    who: "Кидланд и Прескотт, 1977",
    title: "Правило против усмотрения",
    text: "Даже разумное правительство склонно отступить от плана, когда приходит время его исполнять. Участники рынка это понимают и заранее закладывают отступление в свои ожидания.",
    cite: [27],
  },
  {
    icon: SlidersHorizontal,
    who: "Гурвич и Соколов, 2016",
    title: "Гибкость внутри правила",
    text: "Для российского правила авторы предлагали разрешать временное увеличение структурного дефицита при особо сильных шоках, но в заданных пределах и на заданный срок.",
    cite: [25],
  },
];

export function Theory() {
  return (
    <section id="theory" aria-labelledby="theory-title" className="px-4 py-24 md:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          id="theory-title"
          eyebrow="07 · Теория"
          title="Почему доверие важнее формулы"
          lead="Институциональная экономика смотрит на бюджетное правило не как на техническую настройку, а как на обещание государства. У такого обещания есть цена."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {ideas.map((d, i) => (
            <Reveal key={d.title} delay={i * 0.08} className="h-full">
              <article className="group h-full rounded-2xl border border-line bg-surface-1 p-6 transition-[transform,background-color,border-color] duration-500 ease-soft hover:-translate-y-1 hover:border-line-strong hover:bg-surface-2">
                <span className="grid h-12 w-12 place-items-center rounded-xl border border-line-strong text-oil transition-transform duration-500 ease-soft group-hover:scale-105">
                  <d.icon className="h-6 w-6" />
                </span>
                <p className="caption-4 num mt-6 text-faint">{d.who}</p>
                <h3 className="heading-6 mt-1 text-fg">{d.title}</h3>
                <p className="body-6 mt-3 text-muted">
                  {d.text}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
