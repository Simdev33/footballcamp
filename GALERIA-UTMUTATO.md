# Galéria mappák (albumok) – útmutató

A Galéria fül mappákba (albumokba) rendezi a képeket:

- `/galeria` – a mappák listája (borítókép, dátum, helyszín, képszám)
- `/galeria/benfica-algyo-2026` – a mappa tartalma: videó + képrács + nagyítható lightbox

Az albumok a **`lib/gallery-albums.ts`** fájlban vannak felsorolva. A képek az
adatbázisban lévő `GalleryImage.category` mezővel kapcsolódnak az albumhoz
(a `category` értéke = az album `slug`-ja). **Nem kellett adatbázis-migráció.**

---

## 1. Hol vannak a Benfica – Algyő 2026 fájljai

A 42 kép a Bunny Storage **`gallery/`** mappájában van, `benfica-algyo-2026-01.jpg`
… `benfica-algyo-2026-42.jpg` néven. Az album ezért így van beállítva:

```ts
storageFolder: "gallery",
filePrefix: "benfica-algyo-2026-",
```

Vagyis: közös mappa, és a fájlnév előtagja dönti el, melyik albumhoz tartozik egy kép.
Új albumnál ez elhagyható – akkor az alapértelmezés `gallery/<slug>` külön mappa.

A web-re optimalizált képek helyben itt vannak (630 MB → 23 MB, max. 1920 px):

```
C:\Users\Garda\Downloads\footballcamp kepekvideok\web-optimalizalt\feltoltesre
```

---

## 2. Képek bevitele a galériába

A Bunny-ra feltöltés önmagában nem elég: minden képhez adatbázis-sor is kell.
Három út, mind az `/admin/galeria` oldalon:

**A) „Már feltöltött képek behúzása”** – ha a képeket közvetlenül a Bunny
felületén töltötted fel. Kiválasztod a mappát, megnyomod a gombot, és beolvassa
a `gallery/` mappát, majd felveszi a képeket. Kétszer megnyomva sem duplikál.

**B) „Több kép feltöltése egy mappába”** – ha a képek még csak a gépeden vannak.
Kijelölöd egyszerre az összeset; feltölti a Bunny-ra **és** felveszi őket a
galériába. A nagy képeket a böngésző feltöltés előtt lekicsinyíti.

**C) „Egy kép hozzáadása”** – egyesével, a régi módon.

Parancssorból is megy (fejlesztői út, `.env` szükséges hozzá):

```bash
npm run gallery:upload -- benfica-algyo-2026 "C:/.../feltoltesre" --folder=gallery
```

---

## 3. Videók

A videók **Bunny Streamből** jönnek, beágyazva. A Stream felületén a videónál
`Share / Embed` → a `src="..."` értékét kell bemásolni a
`lib/gallery-albums.ts` `videos` tömbjébe:

```ts
videos: [
  {
    kind: "embed",
    url: "https://iframe.mediadelivery.net/embed/<library-id>/<video-id>",
    title: { hu: "Tábor összefoglaló", en: "Camp highlights" },
  },
  {
    kind: "embed",
    url: "https://iframe.mediadelivery.net/embed/<library-id>/<video-id>",
    aspect: "9/16",                       // álló (Insta/TikTok) videóhoz
    title: { hu: "Pillanatok a táborból", en: "Camp moments" },
  },
],
```

Az `aspect` alapértelmezése `"16/9"` (fekvő). Az **álló videókhoz kötelező a
`"9/16"`**, különben fekete sávok lesznek mellette.

Közvetlen MP4 is használható Stream helyett (`kind: "file"` + `url` + `poster`),
de csak kis fájlnál érdemes – a látogatónak az egészet le kell töltenie.

---

## 4. Új album (pl. jövő évi tábor) létrehozása

1. Új elem a `GALLERY_ALBUMS` tömbbe a `lib/gallery-albums.ts`-ben
   (slug, cím HU/EN, helyszín, dátum, `sortOrder` – a nagyobb kerül előre).
2. Képek feltöltése a 2. pont szerint, az új mappát választva.
3. Ha a főoldalon is látszódjon: `showOnHome: true` + `highlights` (5-6 kép URL),
   és a `campRecap` szövegek frissítése a `lib/i18n.ts`-ben. Egyszerre egy album
   jelenik meg a főoldalon (a legnagyobb `sortOrder`).

---

## 5. Mi került még be

- **Főoldal**: „Így telt – Benfica tábor Algyő 2026” szekció a Helyszínek után,
  6 kiemelt képpel (`components/camp-recap.tsx`).
- **Admin**: mappa szerinti szűrés, tömeges feltöltés, behúzás a Bunny-ról,
  „Mappa megtekintése az oldalon” gomb.
- **Megosztás**: az album oldalnak saját `<title>` és OG-képe van, tehát
  Facebookon/WhatsAppon megosztva a borítóképpel jelenik meg.
