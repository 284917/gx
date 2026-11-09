import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Footer } from "../components/Closing";
import { Nav } from "../components/Nav";
import "../styles.css";

function Privacy() {
  return (
    <>
      <Nav home={false} />
      <main id="main" className="px-4 pb-24 pt-24 md:px-8">
        <article className="mx-auto max-w-[680px]">
          <p className="caption-3 num uppercase tracking-widest text-oil">Конфиденциальность</p>
          <h1 className="heading-4 md:heading-3 mt-3 text-fg">Сайт ничего о вас не собирает</h1>
          <div className="body-3 mt-6 flex flex-col gap-4 text-muted">
            <p>Здесь нет форм, регистрации, аналитики и рекламных счётчиков. Сайт не использует cookie.</p>
            <p>Шрифты и все файлы загружаются с того же домена, что и сама страница. Сторонние сервисы при просмотре не подключаются.</p>
            <p>Хостинг может вести стандартные технические журналы запросов, например сетевой адрес и время обращения. Они нужны для работы и защиты сервера и не используются для отслеживания посетителей.</p>
            <p>Материалы сайта можно цитировать в учебных и научных целях со ссылкой на страницу и первоисточники данных.</p>
          </div>
          <a href="/" className="button-md mt-8 inline-flex rounded-xl bg-fg px-3 py-2 text-ink transition-[transform,opacity] duration-300 ease-soft hover:opacity-90 active:scale-[0.98]">
            Вернуться на главную
          </a>
        </article>
      </main>
      <Footer home={false} />
    </>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Privacy />
  </StrictMode>,
);
