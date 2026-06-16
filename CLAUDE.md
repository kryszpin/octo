# CLAUDE.md — OCTO Fabrics

Notatki dla Claude'a do pracy nad tym projektem. To jest **handoff / punkt wejścia** — czytaj najpierw to, potem [notes.md](notes.md) (historia decyzji).

---

## 1. Czym jest projekt

Statyczna strona-wizytówka (landing page) dla **OCTO Fabrics** — dostawcy tkanin obiciowych z Hajnówki. Jedna strona, przewijana w pionie, sekcje w kolejności:

**hero → „Uważne spojrzenie" (about) → „Celność wyboru" (services) → „Proste sploty" (values) → „Trzy pary rąk" (team) → „Poznajmy się bliżej" (contact)**

Język strony: **polski**. Właściciel/klient: Andrzej (pracuje dla kolegi). Projekt zaczęty z Gemini, potem przejęty — kod miejscami „na pałę", systematycznie czyszczony.

## 2. Stos technologiczny

- **Czysty HTML + CSS + Vanilla JS** — bez frameworków, bez buildu, bez npm. Nic do kompilowania.
- Font: **Quicksand** (Google Fonts, wagi 500/700) — ładowany przez `<link>` w `<head>` (NIE przez `@import`).
- Animacje wejścia przy scrollu: `IntersectionObserver` w [script.js](script.js) dodaje klasę `.visible` elementom `.animate-on-scroll` i kartom `.hero-card`. Reszta animacji to czysty CSS (`@keyframes`).
- **Fallback bez JS:** `<html class="no-js">` + inline-skrypt w `<head>` zamienia na `js`. CSS pokazuje treść, gdy `.no-js` (więc bez JS / dla botów treść jest widoczna). `script.js` ma też fallback, gdy brak `IntersectionObserver`.

## 3. Struktura plików

| Plik / folder | Rola |
|---|---|
| [index.html](index.html) | **Właściwa strona produkcyjna** serwowana przez GitHub Pages. Cała treść tu (jeden plik, brak routingu). |
| [styles.css](styles.css) | Wszystkie style. Responsywność opisana niżej. |
| [script.js](script.js) | Animacje scroll-triggered + fallbacki. |
| [assets/](assets/) | Grafiki używane na stronie (logo.svg, mirek.jpg, img-1/2/3.jpg, hero-deco-1/2.png, contact-deco.png). **Publikowane.** |
| [resources/](resources/) | Grafiki inspiracyjne/robocze (Gemini, Unsplash, screeny). **NIE publikowane** — w `.gitignore`. |
| [push.sh](push.sh) | Skrypt deployu: `git add . && commit (z datą) && push`. |
| [notes.md](notes.md) | Szczegółowe notatki, historia, sekcja „Do zrobienia później". |
| `.gitignore` | Ignoruje `resources/`, `.DS_Store`, `.claude/`. |

## 4. Publikacja (GitHub Pages) i git

- Repo: **`kryszpin/octo`** → URL: **https://kryszpin.github.io/octo/**
- Deploy: `./push.sh` (albo zwykły `git push`). Pages buduje się ~1 min.
- **Auth:** remote to czysty HTTPS (`https://github.com/kryszpin/octo.git`, **bez tokena w URL**). Poświadczenia trzyma **macOS Keychain** (`credential.helper = osxkeychain`). Przy pierwszym pushu git pyta o login (`kryszpin`) + hasło (= **Personal Access Token classic**, scope `repo`). Keychain zapamiętuje.
  - ⚠️ Jeśli push zwróci `Invalid username or token` → token wygasł/unieważniony. Trzeba wygenerować nowy PAT na GitHubie i wpisać przy `./push.sh` (w terminalu, nie w czacie!). Stary helper czyści się: `printf "protocol=https\nhost=github.com\n\n" | git credential-osxkeychain erase`.
- **Historia tokenów:** pierwotnie token był wklejony jawnie w `.git/config` (wyciek, naprawione — usunięty z configu). Potem była rotacja, bo stary token został unieważniony.

## 5. Responsywność — AKTUALNA architektura (ważne!)

Po przebudowie są **dwa progi** (stare 1024/768 już NIE istnieją):

- **> 1180px** — pełny desktop, układ 2-kolumnowy (`.content-wrapper` grid `minmax(0,550px) minmax(0,550px)`).
- **`@media (max-width: 1180px)`** — steruje **wyłącznie typografią** (fonty schodzą do rozmiarów „telefonowych": `h2` → `clamp(32px,10vw,56px)`, tytuły → `clamp(36px,10vw,56px)`, akapity 18px, lista zespołu 26px). Układ NIE zmienia się tutaj.
- **`@media (max-width: 800px)`** — **jedyny próg układu**: przejście na 1 kolumnę, tryb mobilny (page-padding 20px, card-margin 16px, portret zespołu jako karta nad tekstem, stopka/hero wypełniają ekran).
- **Dekoracje hero/stopki skalują się PŁYNNIE przez `clamp()`** (rozmiar telefonowy przy ≤800px → pełny desktop przy ≥1180px), bez skoków. Magiczne liczby w `clamp()` (np. `clamp(320px, 165.79vw - 1006.3px, 950px)`) są policzone tak, żeby trafić w te dwa punkty — NIE „poprawiaj" ich na oko; jak trzeba zmienić rozmiar, przelicz formułę liniową (telefon@800 → desktop@1180).

### Rytm pionowy na telefonie (≤800px) — wszystkie odstępy = 48px
Kluczowa zasada uzgodniona z właścicielem: **każdy odstęp między blokami treści = 48px**.
- Padding sekcji treści: `.section { padding: 24px 0 }` → między sekcjami 24+24 = **48**.
- `.content-wrapper { gap: 48px }` → tekst ↔ zdjęcie w sekcji = **48**.
- `#about { padding-top: 32px }` → hero nie ma dolnego paddingu, ma tylko 16px marginesu karty; 32 + 16 = **48** (inaczej pierwsza sekcja liczyłaby się inaczej!).
- `.section-team { padding: 24px 0 }` → `proste foto → team` = 48.
- `.team-bg-image { margin-bottom: 0 }` → portret Mirka ma już białe studyjne tło na dole, dodatkowy margines był zbędny.

## 6. Konwencje / na co uważać (gotchas)

- **`<h1>` jest wizualnie ukryty** w hero (`.visually-hidden`, „OCTO Fabrics — tkaniny obiciowe") — dla SEO/dostępności. Sekcje używają `<h2>`.
- **Nagłówki h2 łamane twardym `<br>`** (Uważne<br>spojrzenie, Celność<br>wyboru, Proste<br>sploty, Trzy<br>pary rąk, Poznajmy się<br>bliżej) — celowo, spójnie na każdej szerokości.
- **Portret Mirka (mobile):** zdjęcie jest prawie kwadratowe (2240×2160). Kadr pionowy + `object-fit: cover` przycina tylko boki (pełna wysokość z białym tłem widoczna). Próby zoomu (`scale`) ucinały głowę — odrzucone. Docelowo lepiej przyciąć samo `mirek.jpg` u źródła.
- **Mierzenie odstępów:** `IntersectionObserver` animuje wejście (`translateY`), więc `getBoundingClientRect` świeżo po dodaniu `.visible` daje MYLĄCE wyniki (elementy w ruchu). Do pomiarów wymuś stan końcowy: wstrzyknij `*{transition:none!important;animation:none!important;transform:none!important;}` przed pomiarem.
- **SEO/meta już jest:** Open Graph, twitter:card, canonical, favicon (logo.svg), JSON-LD `LocalBusiness` (NIP 5431947971, REGON, adres, telefon). Dane firmy w stopce + JSON-LD muszą być spójne.
- **Weryfikacja zmian:** używaj preview (lokalny serwer `python3 -m http.server` przez `.claude/launch.json` „octo-static", port 8123) + zrzuty przy 402×874 (telefon), 900/1180 (tablet), 1280 (desktop).

## 7. Stan i co dalej (TODO)

1. **Grafiki hero/footer** — właściciel (Andrzej) dopracowuje grafiki dekoracyjne; po dostarczeniu dopasować zachowanie/pozycje. (W TOKU po jego stronie.)
2. **Kompresja obrazków** (ODŁOŻONE na koniec) — `assets/*.jpg` ~1,5 MB każdy. Plan: WebP + `srcset`, `loading="lazy"` (poza hero), `width`/`height` (CLS). Narzędzia: `cwebp`/`sips`. Szczegóły w [notes.md](notes.md).
3. **Token GitHub** — działa (w Keychain). Ewentualna rotacja „na spokojnie".

> Styl pracy uzgodniony z właścicielem: po każdej zaakceptowanej zmianie **commit + push od razu** (chyba że powie „nie pushuj"). Commity opisowe po polsku. Właściciel ma dobre oko do detali (odstępy, marginesy) — warto weryfikować pomiarem w kodzie, nie „na oko".
