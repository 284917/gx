/** Status of the rule in a given year */
export type RuleStatus = "active" | "paused" | "revenue" | "proposed";

export type YearPoint = {
  year: number;
  /** Cut-off (base) oil price, $ per barrel. null when the rule used a different anchor. */
  cutoff: number | null;
  /** How the cut-off figure was obtained */
  cutoffNote?: string;
  status: RuleStatus;
  /** Average Urals price, $ per barrel. null when no annual figure is available in the sources used. */
  urals: number | null;
  sources: number[];
};

/**
 * Cut-off: 40 $ in 2017 prices with 2 % yearly indexation [1, 2]; 42.45 $ in 2020 [2];
 * about 44 $ for 2022 [23]; 8 trillion rubles of base oil and gas revenue for 2023 [3];
 * 60 $ for 2024 and 2025 [2, 3]; 59 $ for 2026 [6]; 50 $ proposed for 2027 [11, 12].
 * Urals annual averages: [17] [18] [19] [20] [21] [22].
 */
export const years: YearPoint[] = [
  { year: 2017, cutoff: 40, status: "active", urals: 53.03, sources: [1, 17] },
  { year: 2018, cutoff: 40.8, cutoffNote: "40 $ с индексацией 2 %", status: "active", urals: 70.01, sources: [1, 18] },
  { year: 2019, cutoff: 41.6, cutoffNote: "40 $ с индексацией 2 %", status: "active", urals: 63.59, sources: [1, 18] },
  { year: 2020, cutoff: 42.45, status: "active", urals: 41.73, sources: [2, 19] },
  { year: 2021, cutoff: 43.3, cutoffNote: "40 $ с индексацией 2 %", status: "active", urals: 69.0, sources: [1, 20] },
  { year: 2022, cutoff: 44.2, cutoffNote: "формальный уровень, операции на паузе", status: "paused", urals: 76.09, sources: [4, 21, 23] },
  { year: 2023, cutoff: null, cutoffNote: "вместо цены 8 трлн ₽ базовых доходов", status: "revenue", urals: 62.99, sources: [3, 21] },
  { year: 2024, cutoff: 60, status: "active", urals: null, sources: [2, 3] },
  { year: 2025, cutoff: 60, status: "active", urals: 55.6, sources: [2, 22] },
  { year: 2026, cutoff: 59, status: "active", urals: null, sources: [5, 6] },
  { year: 2027, cutoff: 50, cutoffNote: "проект бюджета", status: "proposed", urals: null, sources: [11, 12] },
];

export const statusLabel: Record<RuleStatus, string> = {
  active: "Правило действует",
  paused: "Операции на паузе",
  revenue: "Другая формула",
  proposed: "Проект",
};

export type RuleEvent = {
  id: string;
  when: string;
  year: number;
  title: string;
  text: string;
  param: string;
  paramLabel: string;
  status: RuleStatus;
  sources: number[];
};

export const events: RuleEvent[] = [
  {
    id: "e2017",
    when: "Июль 2017",
    year: 2017,
    title: "Новая конструкция правила",
    text: "Базовая цена нефти закреплена на уровне 40 $ за баррель Urals в ценах 2017 года с индексацией на 2 % в год. Налоги с цены выше этого уровня откладываются в резервы.",
    param: "40 $",
    paramLabel: "цена отсечения",
    status: "active",
    sources: [1, 2],
  },
  {
    id: "e2020",
    when: "2020",
    year: 2020,
    title: "Правило работает в обратную сторону",
    text: "Urals в среднем стоит 41,73 $ при цене отсечения 42,45 $. Бюджет недополучает нефтегазовые доходы, и разницу покрывают из резервов. Так правило и задумано.",
    param: "42,45 $",
    paramLabel: "цена отсечения",
    status: "active",
    sources: [2, 19],
  },
  {
    id: "e2022a",
    when: "Весна 2022",
    year: 2022,
    title: "Первая пауза",
    text: "Покупки валюты прекращены, все нефтегазовые доходы идут на расходы. Urals в среднем за год стоит 76,09 $, хотя формальная цена отсечения около 44 $.",
    param: "пауза",
    paramLabel: "режим",
    status: "paused",
    sources: [4, 21, 23],
  },
  {
    id: "e2022b",
    when: "Ноябрь 2022",
    year: 2023,
    title: "Другая формула",
    text: "Вместо цены нефти закреплён объём базовых нефтегазовых доходов: 8 трлн ₽ в год на 2023, 2024 и 2025 годы. Всё, что сверх, должно идти в резервы.",
    param: "8 трлн ₽",
    paramLabel: "базовые доходы",
    status: "revenue",
    sources: [2, 3],
  },
  {
    id: "e2023",
    when: "Октябрь 2023",
    year: 2024,
    title: "Возврат к цене отсечения",
    text: "С 2024 года правило снова опирается на цену нефти: 60 $ за баррель, индексация на 2 % начиная с 2027 года. Формула 8 трлн ₽ проработала один год.",
    param: "60 $",
    paramLabel: "цена отсечения",
    status: "active",
    sources: [3, 4],
  },
  {
    id: "e2025",
    when: "Ноябрь 2025",
    year: 2026,
    title: "Лесенка вниз",
    text: "Индексацию заменили снижением на 1 $ в год, до 55 $ к 2030 году. В 2026 году цена отсечения составляет 59 $.",
    param: "59 $",
    paramLabel: "цена отсечения",
    status: "active",
    sources: [5, 6],
  },
  {
    id: "e2026a",
    when: "Март 2026",
    year: 2026,
    title: "Вторая пауза",
    text: "Минфин приостановил покупки и продажи валюты и золота в связи с планируемым изменением базовой цены. В мае операции возобновили и добавили отложенный объём.",
    param: "пауза",
    paramLabel: "режим",
    status: "paused",
    sources: [5, 8],
  },
  {
    id: "e2026b",
    when: "Октябрь 2026",
    year: 2027,
    title: "Новая цена отсечения",
    text: "Минфин предлагает 50 $ с 2027 года и индексацию на 2 % только с 2031 года. 29 октября Госдума приняла проект бюджета в первом чтении.",
    param: "50 $",
    paramLabel: "проект на 2027 год",
    status: "proposed",
    sources: [11, 12],
  },
];

/** Three different cut-off prices announced for the same year, 2027 */
export const promises2027 = [
  {
    when: "Октябрь 2023",
    value: 61.2,
    label: "60 $ с индексацией 2 % с 2027 года",
    sources: [3],
  },
  {
    when: "Ноябрь 2025",
    value: 58,
    label: "лесенка: минус 1 $ в год до 55 $ к 2030 году",
    sources: [5],
  },
  {
    when: "Октябрь 2026",
    value: 50,
    label: "проект бюджета на 2027 и следующие два года",
    sources: [11, 12],
  },
];

/** Liquid part of the National Wealth Fund, % of GDP */
export const reserves = [
  { label: "1 янв 2022", short: "2022", pct: 7.3, trln: 8.43, sources: [15] },
  { label: "1 янв 2023", short: "2023", pct: 4.6, trln: null, sources: [16] },
  { label: "1 янв 2024", short: "2024", pct: 3.3, trln: 5.01, sources: [16] },
  { label: "1 янв 2025", short: "2025", pct: 2.0, trln: 3.81, sources: [15] },
  { label: "1 янв 2026", short: "2026", pct: 1.9, trln: 4.08, sources: [14] },
  { label: "1 окт 2026", short: "окт 26", pct: 1.6, trln: 3.8, sources: [13] },
];

export type Moment = {
  when: string;
  title: string;
  text: string;
  /** Urals price relative to the 59 $ cut-off, when a figure exists */
  urals?: number;
  uralsNote?: string;
  tone: "neutral" | "outflow" | "inflow" | "pause";
  sources: number[];
};

export const year2026: Moment[] = [
  {
    when: "Лето 2025 · февраль 2026",
    title: "Минфин продаёт валюту",
    text: "Нефть дешевле цены отсечения, и недостающие доходы бюджет получает из ФНБ.",
    tone: "outflow",
    sources: [8],
  },
  {
    when: "Февраль",
    title: "Urals на 14 $ ниже плана",
    text: "Средняя цена для расчёта налогов 44,59 $ за баррель при цене отсечения 59 $. Ликвидная часть ФНБ 4,23 трлн ₽.",
    urals: 44.59,
    tone: "outflow",
    sources: [10, 6],
  },
  {
    when: "25 февраля",
    title: "Правило решают ужесточить",
    text: "Министр финансов говорит, что правительство готовится снова ужесточить правило, чтобы не исчерпать ФНБ.",
    tone: "neutral",
    sources: [6],
  },
  {
    when: "Март",
    title: "Операции остановлены",
    text: "Покупки и продажи валюты и золота приостановлены в связи с планируемым изменением базовой цены нефти.",
    tone: "pause",
    sources: [5, 8],
  },
  {
    when: "24 марта",
    title: "Решение откладывают",
    text: "В 2026 году цена отсечения остаётся 59 $, новые параметры обсуждают уже для бюджета на 2027 год.",
    tone: "neutral",
    sources: [5, 7],
  },
  {
    when: "Апрель",
    title: "Нефть дороже 100 $",
    text: "В первые 13 дней апреля Urals в среднем стоит 106,30 $ на фоне перебоев с поставками через Ормузский пролив. Покупки по правилу всё ещё на паузе.",
    urals: 106.3,
    tone: "pause",
    sources: [9, 8],
  },
  {
    when: "Май",
    title: "Покупки возобновлены",
    text: "На покупку валюты и золота направляют 110,3 млрд ₽ с учётом отложенных за март и апрель, по 5,8 млрд ₽ в день.",
    tone: "inflow",
    sources: [8],
  },
  {
    when: "Октябрь",
    title: "Новая цена отсечения",
    text: "Минфин предлагает 50 $ с 2027 года. Ликвидная часть ФНБ на 1 октября 3,80 трлн ₽, это 1,6 % ВВП.",
    tone: "neutral",
    sources: [11, 13],
  },
];

/** Analysts' estimate: each 1 $ of cut-off price moves the ruble by 0.4 to 0.6 % [7] */
export const RUBLE_PER_DOLLAR_MIN = 0.4;
export const RUBLE_PER_DOLLAR_MAX = 0.6;
export const CURRENT_CUTOFF = 59;
