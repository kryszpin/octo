# CLAUDE.md — OCTO Fabrics

Notatki dla Claude'a do pracy nad tym projektem. (Bardziej szczegółowy kontekst i historia zmian: [notes.md](notes.md).)

## Czym jest projekt

Statyczna strona-wizytówka (landing page) dla **OCTO Fabrics** — dostawcy tkanin obiciowych z Hajnówki. Jedna strona, przewijana w pionie, podzielona na sekcje (hero → o nas → wybór → wartości → zespół → kontakt). Język strony: polski.

## Stos technologiczny

- **Czysty HTML + CSS + Vanilla JS** — bez frameworków, bez buildu, bez zależności npm.
- Font: **Quicksand** (Google Fonts).
- Animacje wejścia przy scrollu: `IntersectionObserver` w [script.js](script.js) dodaje klasę `.visible` elementom z klasą `.animate-on-scroll` oraz kartom `.hero-card`. Reszta animacji to czysty CSS.

## Struktura plików

| Plik / folder | Rola |
|---|---|
| [index.html](index.html) | **Właściwa strona.** To jest plik produkcyjny serwowany przez GitHub Pages. |
| [styles.css](styles.css) | Wszystkie style (responsywność: breakpointy 1024px i 768px). |
| [script.js](script.js) | Animacje scroll-triggered. |
| [assets/](assets/) | Grafiki używane na stronie (logo, zdjęcia, dekoracje). **Publikowane.** |
| [resources/](resources/) | Grafiki inspiracyjne/robocze (Gemini, Unsplash, screenshoty). **NIE publikowane** — wykluczone w `.gitignore`. |
| [push.sh](push.sh) | Skrypt deployu: `git add . && commit && push`. |
| `octo.html` / `octo.jpg` | Stara, pojedyncza grafika-placeholder. Pozostałość, nie część właściwej strony. |
| [notes.md](notes.md) | Szczegółowe notatki projektowe i dziennik decyzji. |

## Publikacja (GitHub Pages)

- Repo: `kryszpin/octo` → URL: https://kryszpin.github.io/octo/
- Deploy: uruchom `./push.sh`. Commituje wszystko (oprócz tego, co w `.gitignore`) i wypycha na `main`. Pages buduje się ~1 min.
- **`resources/` jest w `.gitignore`** — folder zostaje lokalnie, nigdy nie trafia na Pages.

## Konwencje / na co uważać

- **Wymiary dekoracji są na sztywno w CSS** (`hero-deco-1: 486px`, `hero-deco-2: 950px`, `contact-deco: 860px`) z `height: auto` — celowo, żeby podmiana assetów na wersje @2x/@3x nie rozjechała layoutu.
- Grafiki w `assets/` są **duże** (kilka MB każda, `mirek.jpg` ~1.3 MB, `octo.jpg` ~15 MB). Przy okazji warto rozważyć kompresję — wpływa na czas ładowania.
- Strona jest jednoplikowa — wszystkie sekcje w `index.html`, nie ma routingu.

## ⚠️ Bezpieczeństwo — do pilnego załatwienia

W `git remote` (`.git/config`) jest wklejony **token GitHub (`ghp_...`)** w URL-u origin. To wyciek poświadczeń. Należy: unieważnić token na GitHubie i ustawić remote bez tokena (np. przez SSH lub credential helper). Szczegóły niżej w sesji.
