# Notatki Projektowe — OCTO Fabrics

Plik ten służy do zapisywania najważniejszych informacji dotyczących wdrożenia na GitHub Pages, konfiguracji oraz kontekstu projektu OCTO Fabrics.

---

## 🚀 Publikacja i Wdrożenie (GitHub Pages)

* **Repozytorium:** `kryszpin/octo`
* **Adres URL Strony:** [https://kryszpin.github.io/octo/](https://kryszpin.github.io/octo/)
* **Skrypt do automatycznego wdrożenia:** [push.sh](file:///Users/kryszpin/Library/Mobile%20Documents/com~apple~CloudDocs/Andrzej/Antigravity/Octo/push.sh)

### Procedura Publikacji Zmian:
Uruchomienie skryptu `./push.sh` w terminalu projektu Octo automatycznie dodaje wszystkie pliki, tworzy commit z aktualnym znacznikiem czasu i wypycha zmiany do repozytorium na GitHub.

### Jak śledzić status wdrożenia (GitHub Pages deployment):
1. **Krok 1 (Zakładka Actions):** Po wypchnięciu zmian wejdź w zakładkę **Actions** w swoim repozytorium `kryszpin/octo` na GitHubie. Zobaczysz tam uruchomiony przepływ (workflow) budowania strony oznaczony żółtą/pomarańczową kręcącą się ikoną (w toku).
2. **Krok 2 (Oczekiwanie):** Poczekaj około minuty, aż ikona zmieni kolor na **zielony** (sukces).
3. **Krok 3 (Uruchomienie strony):** Przejdź do zakładki **Settings -> Pages**. Pojawi się tam zielony baner z potwierdzeniem:
   > Your site is live at https://kryszpin.github.io/octo/

---

## 🛠️ Kontekst Projektu & Zrealizowane Zadania

Witryna internetowa dla **OCTO Fabrics** (dostawca tkanin obiciowych). Strona opiera się w całości na czystym HTML, Vanilla CSS oraz lekkim JavaScript do obsługi animacji przewijania.

### Kluczowe funkcje i decyzje techniczne:

1. **Wymiary Elementów Deco (Optymalizacja Retina):**
   * Wymiary ozdobnych assetów zostały na sztywno określone w CSS (`hero-deco-1: 486px`, `hero-deco-2: 950px`, `contact-deco: 860px`) z ustawieniem `height: auto`. Zapobiega to ich rozciąganiu w przypadku podmienienia plików na większe o wyższej rozdzielczości (np. wersje @2x, @3x dla ekranów Retina).

2. **Zaawansowane Animacje Wejścia:**
   * **Hero**: Logo i tagline pojawiają się z eleganckim fade-inem (z lekkim przesunięciem czasowym). Elementy dekoracyjne wjeżdżają dynamicznie (lewa kula z lewego górnego rogu, prawy sześcian z prawego dolnego rogu) z elastycznym efektem "odbicia" (`cubic-bezier(0.34, 1.56, 0.64, 1)`).
   * **Mirek (Sekcja Team)**: Subtelna animacja rozjaśniania (`opacity`) połączona z delikatnym pomniejszeniem skali (`scale(1.1) -> scale(1.0)`), co daje wrażenie "osiadania" w ramie.
   * **Sekcje Treści**: Zdjęcia wyłaniają się z delikatnym bouncem przy scrollowaniu.

3. **Aktualizacja Danych Kontaktowych:**
   * Usunięto adresy mailowe: `sales@octofabrics.com`, `invoices@octofabrics.com` oraz `l.bieruta@octofabrics.com`.
   * Główny adres `office@octofabrics.com` został pogrubiony.
   * Imiona w sekcji zespołu (**Mirek**, **Maryla**, **Łukasz**) zostały połączone z linkami `mailto:`, ze spójnym stylem najechania cursor-hover (`opacity: 0.7`).

4. **Pełna Responsywność (Laptop, Tablet, Mobile):**
   * **Ekrany laptopów (1025px - 1440px)**: Sztywne dwukolumnowe siatki zostały zmienione na elastyczne kolumny (`minmax(0, 550px)`) z płynnym odstępem `gap: clamp(40px, 8vw, 160px);`, co zapobiega poziomemu przewijaniu.
   * **Tablety (max-width: 1024px)**: Przebudowa na układy jednokolumnowe. Portret zespołu został zmieniony z absolutnego tła na relatywną kartę portretową nad tekstem. Stopka unika sztywnego `100vh`, aby dopasować się do zawartości bez obcinania danych kontaktowych.
   * **Telefony komórkowe (max-width: 768px)**: Zredukowanie marginesów kart do `16px`, przeskalowanie dekoracji w Hero (kula `160px`, sześcian `320px`), optymalizacja fontów (`h2` skalowane elastycznie za pomocą `clamp`) oraz zmniejszenie ozdoby stopki do `220px`.

> ⚠️ **Uwaga:** powyższy opis responsywności (pkt 4) jest historyczny. Breakpointy zostały później przebudowane — patrz sekcja niżej i komentarze w `styles.css`.

---

## 🔭 Aktualny stan responsywności (po przebudowie)

- **> 1180px** — pełny desktop (2 kolumny).
- **800–1180px** — ten sam układ co desktop, tylko mniejsze fonty (blok `@media (max-width: 1180px)` steruje wyłącznie typografią).
- **≤ 800px** — telefon: jedna kolumna, tryb mobilny (blok `@media (max-width: 800px)` — jedyny próg układu).
- **Dekoracje hero/stopki** skalują się płynnie przez `clamp()` (telefon@800px → desktop@1180px), bez skoków.
- **Telefon — rytm pionowy:** wszystkie odstępy między blokami treści = **48px** (padding sekcji 24/24 → 48 między sekcjami; `content-wrapper gap: 48`; `#about padding-top: 32` bo hero nie ma dolnego paddingu, tylko 16px marginesu karty).

---

## 📋 Do zrobienia później

### 1. Kompresja / optymalizacja grafik — ✅ ZROBIONE (2026-07-03)
Wszystkie grafiki przekonwertowane do **WebP** (`cwebp 1.5.0`): assets 5,9 MB → ~0,9 MB (−86%).
- Foty: `cwebp -q 80 -m 6`; PNG z alfą (deco): `cwebp -q 82 -alpha_q 90 -m 6`.
- `loading="lazy"` (poniżej foldu) + `width`/`height` (CLS) dodane w HTML.
- `img-1.jpg` celowo zostaje — to `og:image` + JSON-LD `image` (scrapery social bywają bez WebP).
- `cwebp` nie jest zainstalowany w systemie — binarki z webmproject (Google) pobierane ad hoc.
- Nadal aktualne przy okazji: przycięcie `mirek` u źródła (mniej białego tła).

### 2. Grafiki hero i stopki (W TOKU — po stronie właściciela)
Andrzej dopracowuje grafiki dekoracyjne w hero i footer (dochodzą dodatkowe informacje). Po dostarczeniu — kontynuujemy dopasowanie ich zachowania/pozycji.

### 3. Podpięcie domeny octofabrics.com (checklist na moment przełączenia)
`robots.txt` i `sitemap.xml` już są w repo (wskazują na https://octofabrics.com/ — zaczną działać z chwilą podpięcia domeny; w podścieżce github.io są ignorowane).
1. **DNS u rejestratora:** apex `octofabrics.com` → 4 rekordy A: `185.199.108.153`, `.109.153`, `.110.153`, `.111.153` (+ opcjonalnie `www` CNAME → `kryszpin.github.io`).
2. **GitHub:** Settings → Pages → Custom domain: `octofabrics.com` (utworzy plik `CNAME` w repo) → po weryfikacji zaznaczyć **Enforce HTTPS**. NIE dodawać pliku CNAME przed ustawieniem DNS (strona by padła).
3. **W index.html podmienić URL-e** z `https://kryszpin.github.io/octo/` na `https://octofabrics.com/`: canonical, og:url, og:image, JSON-LD (url, logo, image).
4. **Google Search Console:** dodać usługę (domena), zgłosić `sitemap.xml`, poprosić o indeksację.
5. Opcjonalnie: Profil Firmy w Google (Maps) z linkiem do strony.

### 4. Token GitHub `neat-proto-deploy` (opcjonalnie)
Wciąż aktywny, współdzielony z innym projektem. Do ewentualnej rotacji „na spokojnie" (nie pilne — wyciek był tylko lokalny, nigdy nie trafił do repo).
