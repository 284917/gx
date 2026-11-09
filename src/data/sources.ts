export type Source = {
  id: number;
  text: string;
  url?: string;
};

/**
 * Every figure on the site points to one of these entries.
 * Accessed on 9 November 2026.
 */
export const sources: Source[] = [
  {
    id: 1,
    text: "Кудрин А. Л., Соколов И. А. Бюджетные правила как инструмент сбалансированной бюджетной политики // Вопросы экономики. 2017. № 11. С. 5–32.",
    url: "https://doi.org/10.32609/0042-8736-2017-11-5-32",
  },
  {
    id: 2,
    text: "Бюджетное правило // Neftegaz.RU. Техническая библиотека.",
    url: "https://neftegaz.ru/tech-library/economy/148137-byudzhetnoe-pravilo/",
  },
  {
    id: 3,
    text: "Законопроект о новом бюджетном правиле принят в I чтении // Интерфакс. 11.10.2023.",
    url: "https://www.interfax.ru/russia/925321",
  },
  {
    id: 4,
    text: "[Новая правка бюджетного правила: возврат к цене отсечения 60 долларов] // The Moscow Times (Reuters). 25.09.2023.",
    url: "https://ru.themoscowtimes.com/2023/09/25/novaya-pravka-byudzhetnogo-pravila-prineset-rf-v-24g-17-trln-r-dopdokhodov-materialy-byudzheta-a107884",
  },
  {
    id: 5,
    text: "Минфин допустил пересмотр бюджетного правила с 2027 года // Эксперт. 24.03.2026.",
    url: "https://expert.ru/news/minfin-dopustil-peresmotr-byudzhetnogo-pravila-s-2027-goda",
  },
  {
    id: 6,
    text: "Силуанов допустил корректировку бюджета 2026, анонсировал новое ужесточение бюджетного правила для сохранения ФНБ // The Moscow Times (Reuters). 25.02.2026.",
    url: "https://ru.themoscowtimes.com/2026/02/25/siluanov-dopustil-korrektirovku-byudzheta-2026-anonsiroval-novoe-uzhestochenie-byudzhetnogo-pravila-dlya-sokhraneniya-fnb-if-a188087",
  },
  {
    id: 7,
    text: "Полевой Д. Что значит для курса рубля решение Минфина не менять бюджетное правило // Эксперт. 2026.",
    url: "https://expert.ru/analitika/finansovyi-rynok/chto-znachit-dlya-kursa-rublya-reshenie-minfina-ne-menyat-byudzhetnoe-pravilo",
  },
  {
    id: 8,
    text: "Минфин после паузы вернётся к покупкам валюты и золота: сколько направят на рынок и что это значит для рубля // Myfin.by. 14.05.2026.",
    url: "https://ru.myfin.by/article/minfin-posle-pauzy-vernetsa-k-pokupkam-valuty-i-zolota-skolko-napravat-na-rynok-i-cto-eto-znacit-dla-rubla",
  },
  {
    id: 9,
    text: "Стоимость российской нефти Urals в апреле выросла до $106 за баррель // Важные истории. 14.04.2026.",
    url: "https://istories.media/news/2026/04/14/stoimost-rossiiskoi-nefti-urals-v-aprele-virosla-do-106-za-barrel/",
  },
  {
    id: 10,
    text: "[Средняя цена Urals для расчёта НДПИ за февраль 2026 года] // Финмаркет. 05.03.2026.",
    url: "https://www.finmarket.ru/news/6573709",
  },
  {
    id: 11,
    text: "Основные направления бюджетной, налоговой и таможенно-тарифной политики на 2027 год и на плановый период 2028 и 2029 годов (разработаны Минфином России) // КонсультантПлюс. 02.10.2026.",
    url: "https://www.consultant.ru/law/hotdocs/95850.html",
  },
  {
    id: 12,
    text: "Госдума приняла в первом чтении проект трехлетнего бюджета // Эксперт. 29.10.2026.",
    url: "https://expert.ru/news/gosduma-odobrila-proekt-trekhletnego-byudzheta",
  },
  {
    id: 13,
    text: "ФНБ в сентябре сократился на 210 млрд руб., ликвидная часть составила 1,6 % ВВП // Интерфакс. 07.10.2026.",
    url: "https://interfax.ru/business/1120885",
  },
  {
    id: 14,
    text: "[Ликвидные резервы РФ на 1 января 2026 года: 4,1 трлн рублей] // The Moscow Times (Reuters). 20.01.2026.",
    url: "https://ru.themoscowtimes.com/2026/01/20/likvidnye-rezervy-rf-na-1-yanv-41-trln-r-a184957",
  },
  {
    id: 15,
    text: "[Ликвидная часть ФНБ в 2024 году сократилась ещё на треть] // The Moscow Times (Reuters). 16.01.2025.",
    url: "https://ru.themoscowtimes.com/2025/01/16/update-1-likvidnaya-chast-fnb-rf-v-24g-sokratilas-esche-na-tret-za-tri-goda-umenshilas-v-tri-raza-a152501",
  },
  {
    id: 16,
    text: "[Ликвидная часть ФНБ сократилась в декабре 2023 года на четверть] // The Moscow Times (Reuters). 17.01.2024.",
    url: "https://ru.themoscowtimes.com/2024/01/17/update-1-likvidnaya-chast-fnb-rf-sokratilas-v-dekabre-na-chetvert-do-559-mlrd-ili-33-vvp-a118720",
  },
  {
    id: 17,
    text: "Russian oil variety Urals increased by 26.6% in 2017 // Neftegaz.RU. 11.01.2018.",
    url: "https://neftegazru.com/news/economy/407994-russian-oil-variety-urals-increased-by-266-in-2017/",
  },
  {
    id: 18,
    text: "The average price of Urals oil decreased to $63,59 per barrel // Министерство финансов Республики Татарстан. 09.01.2020.",
    url: "https://minfin.tatarstan.ru/eng/index.htm/news/1652295.htm",
  },
  {
    id: 19,
    text: "Average Urals price down 34.4% to $41.73/bbl over 2020 // ТАСС.",
    url: "https://tass.com/economy/1242269",
  },
  {
    id: 20,
    text: "Urals oil price reached $69 per barrel in 2021 // Report.az.",
    url: "https://report.az/en/energy/urals-oil-price-reached-69-per-barrel-in-2021",
  },
  {
    id: 21,
    text: "Average Urals price was $62.99 per barrel in 2023, which is 1.2 times lower than in 2022 // ТАСС.",
    url: "https://tass.com/economy/1730001",
  },
  {
    id: 22,
    text: "[Средняя цена Urals в 2025 году: 55,6 доллара за баррель] // Финмаркет. 12.05.2026.",
    url: "https://www.finmarket.ru/news/6619301",
  },
  {
    id: 23,
    text: "[Интервью А. Силуанова о цене отсечения в бюджетном правиле] // ПРАЙМ. 06.05.2020.",
    url: "https://1prime.ru/state_regulation/20200506/831390371.html",
  },
  {
    id: 24,
    text: "Нефть по $50 и доллар по 87 рублей: как новое бюджетное правило повлияет на курс? // Выберу.ру. 22.09.2026.",
    url: "https://www.vbr.ru/novosti/kursy-valyut/2026/09/22/kak-novoe-budjetnoe-pravilo-povliyaet-na-kyrs/",
  },
  {
    id: 25,
    text: "Гурвич Е. Т., Соколов И. А. Бюджетные правила: избыточное ограничение или неотъемлемый инструмент бюджетной устойчивости? // Вопросы экономики. 2016. № 4. С. 5–29.",
    url: "https://doi.org/10.32609/0042-8736-2016-4-5-29",
  },
  {
    id: 26,
    text: "North D. C., Weingast B. R. Constitutions and Commitment: The Evolution of Institutions Governing Public Choice in Seventeenth Century England // The Journal of Economic History. 1989. Vol. 49, No. 4. P. 803–832.",
  },
  {
    id: 27,
    text: "Kydland F. E., Prescott E. C. Rules Rather than Discretion: The Inconsistency of Optimal Plans // Journal of Political Economy. 1977. Vol. 85, No. 3. P. 473–491.",
  },
  {
    id: 28,
    text: "Норт Д. Институты, институциональные изменения и функционирование экономики. М.: Фонд экономической книги «Начала», 1997. 180 с.",
  },
];
