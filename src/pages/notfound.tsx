import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Footer } from "../components/Closing";
import { Nav } from "../components/Nav";
import "../styles.css";

function NotFound() {
  return (
    <>
      <Nav home={false} />
      <main id="main" className="flex min-h-[80vh] items-center px-4 pt-24 md:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <p className="heading-1 num text-oil">404</p>
          <h1 className="heading-4 md:heading-3 mt-6 max-w-[680px] text-fg">Этой страницы нет. В отличие от правила, её никто не переписывал</h1>
          <p className="body-3 mt-4 max-w-[680px] text-muted">Возможно, ссылка устарела или в адресе опечатка.</p>
          <a href="/" className="button-md mt-8 inline-flex rounded-xl bg-fg px-3 py-2 text-ink transition-[transform,opacity] duration-300 ease-soft hover:opacity-90 active:scale-[0.98]">
            На главную
          </a>
        </div>
      </main>
      <Footer home={false} />
    </>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <NotFound />
  </StrictMode>,
);
