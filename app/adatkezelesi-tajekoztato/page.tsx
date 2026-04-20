import { SubpageHero } from "@/components/subpage-hero"
import { Shield, ArrowRight, Mail, Phone, MapPin, Download } from "lucide-react"
import Link from "next/link"

export default function AdatkezelesiTajekoztatoPage() {
  return (
    <main>
      <SubpageHero
        title="Adatkezelési tájékoztató"
        subtitle="Hatályos: 2026. április 01-től visszavonásig"
      />

      <section className="py-16 md:py-20 bg-background">
        <div className="max-w-3xl mx-auto px-6">
          <article className="bg-white border border-border/50 shadow-sm p-6 md:p-10 space-y-10 text-[15px] leading-relaxed text-foreground">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#d4a017]/10 flex items-center justify-center shrink-0">
                <Shield className="w-6 h-6 text-[#d4a017]" />
              </div>
              <p className="text-muted-foreground">
                A jelen dokumentum a <strong>kickoffcamps.hu</strong> weboldal működésével kapcsolatban
                minden releváns adatkezelési információt tartalmaz az Európai Unió 2016/679 számú
                Általános Adatvédelmi Rendelete (GDPR) és a 2011. évi CXII. tv. (Infotv.) alapján.
              </p>
            </div>

            {/* Adatkezelő adatai */}
            <section className="space-y-3">
              <h2 className="font-serif text-2xl font-bold text-foreground border-b border-border/60 pb-2">
                Adatkezelő adatai
              </h2>
              <dl className="grid sm:grid-cols-[180px_1fr] gap-x-6 gap-y-2 text-sm">
                <dt className="text-muted-foreground">Név</dt>
                <dd>TIREKSZ NONPROFIT KFT.</dd>
                <dt className="text-muted-foreground">Székhely</dt>
                <dd>6728 Szeged, Felsőnyomás út 47.</dd>
                <dt className="text-muted-foreground">Levelezési cím</dt>
                <dd>6728 Szeged, Felsőnyomás út 47.</dd>
                <dt className="text-muted-foreground">Cégjegyzékszám</dt>
                <dd>06-09-028994</dd>
                <dt className="text-muted-foreground">Adószám</dt>
                <dd>32342651-1-06</dd>
                <dt className="text-muted-foreground">Képviselő</dt>
                <dd>Rozinka Arnold, ügyvezető</dd>
                <dt className="text-muted-foreground">Telefonszám</dt>
                <dd>
                  <a href="tel:+36307551110" className="text-[#d4a017] hover:underline">
                    +36 30 755 1110
                  </a>
                </dd>
                <dt className="text-muted-foreground">E-mail</dt>
                <dd>
                  <a href="mailto:rozinka.arnold@tireksz.hu" className="text-[#d4a017] hover:underline">
                    rozinka.arnold@tireksz.hu
                  </a>
                </dd>
                <dt className="text-muted-foreground">Honlap</dt>
                <dd>
                  <a href="https://kickoffcamps.hu" className="text-[#d4a017] hover:underline">
                    https://kickoffcamps.hu
                  </a>
                </dd>
              </dl>
            </section>

            {/* Célja */}
            <section className="space-y-3">
              <h2 className="font-serif text-2xl font-bold text-foreground border-b border-border/60 pb-2">
                Az adatkezelési tájékoztató célja
              </h2>
              <p>
                A TIREKSZ NONPROFIT Kft. (a továbbiakban: Társaság), mint adatkezelő, magára nézve
                kötelezőnek ismeri el jelen jogi közlemény tartalmát. Jelen Adatkezelési Tájékoztató
                célja ügyfeleink, partnereink, vásárlóink tájékoztatása személyes adataik kezelését
                illetően.
              </p>
              <p>
                A Társaság adatkezeléseivel kapcsolatosan felmerülő adatvédelmi irányelvek folyamatosan
                elérhetők a telephelyén és a weboldalán. A Társaság fenntartja magának a jogot arra,
                hogy jelen tájékoztatót bármikor megváltoztassa. Az esetleges változásokról kellő időben
                értesíti weboldalainak látogatóit, ügyfeleit, a weboldalon azt aktualizálja.
              </p>
              <p>
                A Társaság a személyes adatokat bizalmasan kezeli, és megtesz minden olyan biztonsági,
                technikai és szervezési intézkedést, mely az adatok biztonságát garantálja. Egyúttal
                elkötelezett ügyfelei és partnerei személyes adatainak védelmében, kiemelten fontosnak
                tartja ügyfelei információs önrendelkezési jogának tiszteletben tartását.
              </p>
            </section>

            {/* Hatály */}
            <section className="space-y-3">
              <h2 className="font-serif text-2xl font-bold text-foreground border-b border-border/60 pb-2">
                Az adatkezelési tájékoztató személyi, tárgyi és időbeli hatálya
              </h2>
              <p>
                A jelen Adatkezelési Tájékoztató személyi hatálya kiterjed a Társaságra, azon természetes
                személyekre, akik adatait a jelen Tájékoztató hatálya alá tartozó adatkezelések
                tartalmazzák, továbbá azon személyekre, akik jogait vagy jogos érdekeit az adatkezelés
                érinti.
              </p>
              <p>
                A Tájékoztató tárgyi hatálya kiterjed a Társaság kickoffcamps.hu weboldalán, valamint a
                weboldalon kívül folytatott tevékenysége során felmerülő összes adatkezelésre. Jelen
                Tájékoztató a jóváhagyás napján lép érvénybe, további rendelkezésig, határozatlan ideig
                hatályos.
              </p>
            </section>

            {/* Fogalmak */}
            <section className="space-y-3">
              <h2 className="font-serif text-2xl font-bold text-foreground border-b border-border/60 pb-2">
                Fontosabb fogalmak
              </h2>
              <dl className="space-y-3">
                <div>
                  <dt className="font-semibold">Személyes adat</dt>
                  <dd className="text-muted-foreground">
                    azonosított vagy azonosítható természetes személyre vonatkozó bármely információ.
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold">Adatkezelő</dt>
                  <dd className="text-muted-foreground">
                    az a természetes vagy jogi személy, közhatalmi szerv, ügynökség vagy bármely egyéb
                    szerv, amely a személyes adatok kezelésének céljait és eszközeit önállóan vagy
                    másokkal együtt meghatározza.
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold">Adatkezelés</dt>
                  <dd className="text-muted-foreground">
                    a személyes adatokon vagy adatállományokon automatizált vagy nem automatizált módon
                    végzett bármely művelet vagy műveletek összessége, így a gyűjtés, rögzítés,
                    rendszerezés, tagolás, tárolás, átalakítás vagy megváltoztatás, lekérdezés, betekintés,
                    felhasználás, közlés, továbbítás, terjesztés vagy egyéb módon történő hozzáférhetővé
                    tétel útján, összehangolás vagy összekapcsolás, korlátozás, illetve megsemmisítés.
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold">Adatfeldolgozó</dt>
                  <dd className="text-muted-foreground">
                    az a természetes személy vagy jogi személy, közhatalmi szerv, ügynökség, vagy bármely
                    egyéb szerv, amely az adatkezelő nevében személyes adatokat kezel.
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold">Adatvédelmi incidens</dt>
                  <dd className="text-muted-foreground">
                    a biztonság olyan sérülése, amely a továbbított, tárolt vagy más módon kezelt
                    személyes adatok véletlen vagy jogellenes megsemmisítését, elvesztését,
                    megváltoztatását, jogosulatlan közlését vagy az azokhoz való jogosulatlan hozzáférést
                    eredményezi.
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold">Érintett</dt>
                  <dd className="text-muted-foreground">
                    bármely meghatározott, személyes adat alapján azonosított vagy – közvetlenül vagy
                    közvetve – azonosítható természetes személy, pl. munkatárs, állásajánlatra
                    jelentkező természetes személy, az Adatkezelő szolgáltatásait igénybe vevő
                    természetes személy.
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold">Harmadik fél</dt>
                  <dd className="text-muted-foreground">
                    az a természetes vagy jogi személy, közhatalmi szerv, ügynökség vagy bármely egyéb
                    szerv, amely nem azonos az érintettel, az adatkezelővel, az adatfeldolgozóval, vagy
                    azokkal a személyekkel, akik az adatkezelő vagy adatfeldolgozó közvetlen irányítása
                    alatt a személyes adatok kezelésére felhatalmazást kaptak.
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold">Hozzájárulás</dt>
                  <dd className="text-muted-foreground">
                    az érintett akaratának önkéntes és határozott kinyilvánítása, amely megfelelő
                    tájékoztatáson alapul, és amellyel félreérthetetlen beleegyezését adja a rá vonatkozó
                    személyes adatok – teljes körű vagy egyes műveletekre kiterjedő – kezeléséhez.
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold">Weboldal (Honlap)</dt>
                  <dd className="text-muted-foreground">
                    a portál és minden aloldala, amelynek üzemeltetője az Adatkezelő.
                  </dd>
                </div>
              </dl>
            </section>

            {/* Cookie-k */}
            <section className="space-y-3">
              <h2 className="font-serif text-2xl font-bold text-foreground border-b border-border/60 pb-2">
                Cookie-k (sütik) használatával kapcsolatos tájékoztatás
              </h2>
              <p className="font-semibold">A honlap által használt cookie-k főbb típusai:</p>
              <div>
                <h3 className="font-semibold text-foreground">A működéshez szigorúan szükséges cookie-k</h3>
                <p className="text-muted-foreground">
                  Ezek a cookie-k a weboldal használatához nélkülözhetetlenek, és lehetővé teszik a
                  weboldal alapvető funkcióinak használatát. Ezek hiányában az oldal több funkciója nem
                  lesz elérhető az Ön számára. Ezen típusú cookie-k élettartama kizárólag a munkamenet
                  idejére korlátozódik.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">A felhasználói élmény javítását szolgáló cookie-k</h3>
                <p className="text-muted-foreground">
                  Ezek a cookie-k információkat gyűjtenek a felhasználó weboldal használati szokásairól,
                  például, hogy mely oldalakat látogatja leggyakrabban, vagy milyen hibaüzeneteket kap a
                  weboldalról. Ezek a cookie-k nem gyűjtenek a látogatót azonosító információkat, vagyis
                  teljesen általános, névtelen információkkal dolgoznak. Az ezekből nyert adatokat a
                  weboldal teljesítményének javítására használjuk. Ezen típusú cookie-k élettartama
                  kizárólag a munkamenet idejére korlátozódik.
                </p>
              </div>
              <p>
                Weboldalunk a helyes működéshez cookie-k használatát igényelheti. Amennyiben a
                böngészőben a cookie-k engedélyezve vannak, akkor és csakis akkor a cookie-k használata
                automatikus. A cookie-k használata egy lehetőség a webhely kényelmesebb böngészéséhez és
                a bejelentkezés használatához. A cookie-k használatát bármikor le lehet tiltani a saját
                böngészőben. Előfordulhat viszont, hogy a letiltott cookie-k mellett nem fog megfelelően
                működni a weboldalunk.
              </p>
            </section>

            {/* Adatkezelések */}
            <section className="space-y-4">
              <h2 className="font-serif text-2xl font-bold text-foreground border-b border-border/60 pb-2">
                Társaságunknál történő személyes adatok kezelése
              </h2>
              <p>Társaságunknál a személyes adatok kezelésére kizárólag az alábbi esetekben kerül sor:</p>
              <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                <li>ha az érintett hozzájárulását adta személyes adatainak egy vagy több konkrét célból történő kezeléséhez,</li>
                <li>az adatkezelés olyan szerződés teljesítéséhez szükséges, amelyben az érintett az egyik fél,</li>
                <li>az adatkezelés az adatkezelőre vonatkozó jogi kötelezettség teljesítéséhez szükséges,</li>
                <li>az adatkezelés az érintett vagy egy másik természetes személy létfontosságú érdekeinek védelme miatt szükséges,</li>
                <li>az adatkezelés az adatkezelő vagy egy harmadik fél jogos érdekeinek érvényesítéséhez szükséges.</li>
              </ul>
              <p>
                Társaságunknál, a kickoffcamps.hu weboldal üzemeltetése során, az alábbi adatkezelések
                valósulhatnak meg:
              </p>

              <div className="pt-2">
                <h3 className="font-semibold text-foreground">1. Honlap kezelése (www.kickoffcamps.hu)</h3>
                <p className="mt-1">
                  A Weboldal tartalma eltérő megjelölés hiányában az Adatkezelő tulajdona, szerzői jogi
                  védelem alatt álló szellemi alkotása. Az Adatkezelő ezzel kapcsolatosan minden jogot
                  fenntart. Az ügyfél a weboldalt ingyen, személyes adatok megadása nélkül látogathatja.
                  A Társaság által szervezett eseményeken történő részvétel azonban regisztrációhoz kötött,
                  amely során az ügyfél személyes adatnak minősülő információkat ad meg.
                </p>
                <p className="mt-2">
                  Az ügyfél az adatok átadásával és elküldésével, valamint a honlap látogatásával
                  hozzájárul ahhoz, hogy az átadott adatait az adatkezelő a jogszabályokban, valamint a
                  jelen tájékoztatóban foglaltak szerint kezelje. A regisztráció során az adatkezelő
                  tudomására jutott személyes adatait semmilyen körülmények között nem teszi – az érintett
                  kifejezett beleegyező hozzájárulása nélkül – más számára hozzáférhetővé, kivéve a
                  jogszabályi kötelezés, illetve a hatósági eljárás eseteit, valamint az adatfeldolgozókat.
                </p>
                <p className="mt-2">
                  A weboldalon az adatkezelő reklámokat jeleníthet meg. A weboldal letöltéséből vagy
                  elérhetetlenségéből eredő bármilyen kár megtérítését az Adatkezelő szintén kizárja. A
                  weboldalon található külső hivatkozások követésével letöltött tartalom nem áll az
                  Adatkezelő befolyása alatt. Az Adatkezelő fenntartja a jogot felhasználók kitiltására,
                  a regisztráció előzetes értesítés és indokolás nélküli megszüntetésére.
                </p>
              </div>

              <div className="pt-2">
                <h3 className="font-semibold text-foreground">2. Kapcsolatfelvétel</h3>
                <p className="mt-1">
                  Az Érintett (ügyfél) pl. e-mailben, telefonon kérdéssel fordul hozzánk. Ezek elsősorban
                  a sporttevékenységünkkel, táboroztatással kapcsolatos kérdések lehetnek. Az adatkezelés
                  célja az érintett számára megfelelő információ nyújtása és a kapcsolattartás.
                </p>
                <p className="mt-2">
                  Kezelt adatok ebben az esetben az Ön által a kapcsolatfelvétel során megadott adatok.
                  Az adatkezelés időtartama csak a kapcsolatfelvétel lezárultáig terjed. Az adatkezelés
                  jogalapja a Vevő (ügyfél) önkéntes hozzájárulása, amit a kapcsolatfelvétellel ad meg
                  Társaságunk számára.
                </p>
              </div>

              <div className="pt-2">
                <h3 className="font-semibold text-foreground">3. Hírlevél, hírlevélre történő feliratkozás</h3>
                <p className="mt-1">A hírlevélre történő feliratkozás önkéntes hozzájáruláson alapul.</p>
                <p className="mt-2">
                  <strong>Az érintettek köre:</strong> Minden természetes személy, aki az Adatkezelő
                  híreiről rendszeresen értesülni kíván, ezért személyes adatainak megadásával a hírlevél
                  szolgáltatásra feliratkozik.
                </p>
                <p className="mt-2">
                  <strong>A kezelt adatok köre és célja:</strong>
                </p>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                  <li><strong>Név</strong> – azonosítás céljából</li>
                  <li><strong>E-mail cím</strong> – a hírlevél kiküldése céljából</li>
                </ul>
                <p className="mt-2">
                  A hírlevélküldéssel kapcsolatos adatkezelés célja a címzett teljes körű általános vagy
                  személyre szabott tájékoztatása az Adatkezelő legújabb eseményeiről, híreiről. Hírlevél
                  kiküldése kizárólag az érintett előzetes hozzájárulásával történik. Az Adatkezelő
                  kizárólag addig kezeli az ebből a célból felvett személyes adatokat, amíg az érintett le
                  nem iratkozik a hírlevél listáról, vagy megerősítést nem ad.
                </p>
                <p className="mt-2">
                  Az érintett a hírlevélről bármikor leiratkozhat az elektronikus levelek alján, valamint
                  az „Adatkezelő adatai" pontban megadott e-mail címre küldött lemondási kérelem útján.
                  Postai úton a Társaság székhelyére küldött levéllel lehet leiratkozni.
                </p>
              </div>

              <div className="pt-2">
                <h3 className="font-semibold text-foreground">4. Közösségi portálok (pl. Facebook, Instagram)</h3>
                <p className="mt-1">
                  A Társaság által kínált jegyekhez és szolgáltatásokhoz tartozó rendezvények /
                  programok / események elérhetőek a Facebook és Instagram közösségi portálon. Az
                  üzenőfalon közzétett hírfolyamra a Facebook-felhasználó az adott oldalon található
                  linkre („like"/„tetszik"; „follow"/„követem") kattintva iratkozhat fel, és az ugyanitt
                  található („dislike"/„nem tetszik") linkre kattintva iratkozhat le, illetve az
                  üzenőfal beállításai segítségével törölheti a nem kívánt, üzenőfalon megjelenő híreket.
                </p>
                <p className="mt-2">
                  A Társaság a „követők" profiljához hozzáfér, de azt nem rögzíti, vagy kezeli saját
                  belső rendszerében. Az adatkezelés célja a Társaság által kínált jegyekhez és
                  szolgáltatásokhoz tartozó rendezvények/programok/eseményekhez tartozó tartalmak
                  megosztása, egyéb hírek közlése, kapcsolattartás. A Facebook-oldalak segítségével az
                  Érintett tájékozódhat a legújabb programajánlatokról. Az adatkezelés jogalapja az
                  Érintett önkéntes hozzájárulása, melyet leiratkozással bármikor visszavonhat.
                </p>
                <p className="mt-2">
                  A Facebook és Instagram az Adatkezelőtől független, külön adatkezelő. Társaságunknak
                  nincs befolyása ezeknek az adatoknak a fajtájára, terjedelmére és feldolgozására.
                  Társaságunk nem kap személyes adatokat a Facebook üzemeltetőjétől. Az Érintett az oldal
                  adatkezeléséről tájékoztatást a következő linkeken kaphat:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                  <li>
                    <a href="https://www.facebook.com/policies/cookies/" className="text-[#d4a017] hover:underline" target="_blank" rel="noopener noreferrer">
                      facebook.com/policies/cookies
                    </a>
                  </li>
                  <li>
                    <a href="https://www.facebook.com/about/privacy/update" className="text-[#d4a017] hover:underline" target="_blank" rel="noopener noreferrer">
                      facebook.com/about/privacy/update
                    </a>
                  </li>
                  <li>
                    <a href="https://help.instagram.com" className="text-[#d4a017] hover:underline" target="_blank" rel="noopener noreferrer">
                      help.instagram.com
                    </a>
                  </li>
                </ul>
              </div>

              <div className="pt-2">
                <h3 className="font-semibold text-foreground">5. Társaságunk tevékenységével kapcsolatos panaszkezelés</h3>
                <p className="mt-1">
                  Az adatkezelés célja ebben az esetben a panasz közlésének lehetővé tétele, az érintett
                  és panasza azonosítása, valamint a törvény szerint kötelezően rögzítendő adatok felvétele,
                  illetve a panasz kivizsgálása, annak rendezésével összefüggő kapcsolattartás.
                </p>
                <p className="mt-2">
                  A panasz megtétele önkéntes hozzájáruláson alapul, de megtett panasz esetén az
                  ügyintézés, és így a személyes adatok kezelése – a fogyasztóvédelemről szóló 1997. évi
                  CLV. törvény alapján – kötelező. Társaságunk a panaszról felvett jegyzőkönyvet és a
                  válasz másolati példányát 5 évig megőrzi, ennek alapján a személyes adatokat is ezen
                  időtartam alatt kezeli.
                </p>
              </div>
            </section>

            {/* Adatfeldolgozók */}
            <section className="space-y-3">
              <h2 className="font-serif text-2xl font-bold text-foreground border-b border-border/60 pb-2">
                A Társasággal kapcsolatban álló adatfeldolgozók
              </h2>
              <div>
                <h3 className="font-semibold">1. A társaság által alkalmazott könyvelő cég</h3>
                <dl className="grid sm:grid-cols-[120px_1fr] gap-x-6 gap-y-1 text-sm mt-2 text-muted-foreground">
                  <dt>Név</dt><dd>R&amp;R Services and More Kft.</dd>
                  <dt>Székhely</dt><dd>6793 Forráskút, Átokháza dűlő 277.</dd>
                  <dt>Telefon</dt><dd>+36 20 436 7582</dd>
                  <dt>E-mail</dt><dd>radoczi.zsolt@rzs-konyveles.hu</dd>
                  <dt>Adószám</dt><dd>32037797-2-06</dd>
                </dl>
              </div>
              <div>
                <h3 className="font-semibold">2. Az online fizetéssel kapcsolatos adatfeldolgozás</h3>
                <p className="text-sm text-muted-foreground mt-1">Az adatfeldolgozó adatai későbbi időpontban kerülnek meghatározásra.</p>
              </div>
            </section>

            {/* Számlázás */}
            <section className="space-y-3">
              <h2 className="font-serif text-2xl font-bold text-foreground border-b border-border/60 pb-2">
                A vevők részére kiállított számlák és az azokon szereplő személyes adatok kezelése
              </h2>
              <p>
                A weboldalon megvásárolt termékről, szolgáltatásról a Társaság számlát állít ki a Vevő
                részére. A számla a Vevő nevét, címét, adószámát tartalmazza. A számlán szereplő
                személyes adatok kezelésére a megrendelés (szerződésben vállalt kötelezettség)
                teljesítése érdekében, majd azt követően a számvitelről szóló 2000. évi C. törvény 169.
                §-ában írt rendelkezések értelmében, az ott írt megőrzési idő figyelembevételével,{" "}
                <strong>8 évig</strong> tároljuk.
              </p>
              <p>
                A Társaság a számlázás során számlázó szoftvert használ (számlázz.hu). A szoftver
                alkalmazása során rögzítésre kerülnek a számlán szereplő személyes adatok. A szoftverben
                rögzítésre kerülő adatokat szintén a számlára vonatkozó, jogszabályban előírt megőrzési
                idő figyelembevételével tároljuk.
              </p>
            </section>

            {/* Gyermekek adatai */}
            <section className="space-y-3">
              <h2 className="font-serif text-2xl font-bold text-foreground border-b border-border/60 pb-2">
                Gyermekek adatai, a személyes adatok különleges kategóriáinak kezelése
              </h2>
              <p>
                16 éven aluli személy a Társaság weboldalán nem vásárolhat, nem regisztrálhat, nem
                iratkozhat fel hírlevélre és az ügyfélkapcsolati adatlapján nem veheti fel a kapcsolatot
                a Társasággal, tekintettel arra, hogy a GDPR 8. cikk (1) bekezdése alapján az
                adatkezeléshez történő hozzájárulását tartalmazó jognyilatkozatának érvényességéhez
                törvényes képviselőjének engedélye szükséges. Társaságunknak nem áll módjában a
                hozzájáruló személy életkorát és jogosultságát ellenőrizni, így az érintett szavatol
                azért, hogy a megadott adatai valósak.
              </p>
            </section>

            {/* Adatbiztonság */}
            <section className="space-y-3">
              <h2 className="font-serif text-2xl font-bold text-foreground border-b border-border/60 pb-2">
                Adatbiztonsági intézkedések
              </h2>
              <p>
                Társaságunk a szervezeti és technikai lehetőségekhez képest mindent megtesz annak
                érdekében, hogy az Adatfeldolgozói is megfelelő adatbiztonsági intézkedéseket tegyenek,
                amikor az Ön személyes adataival dolgoznak.
              </p>
              <p>
                Kijelentjük, hogy megfelelő biztonsági intézkedéseket hoztunk annak érdekében, hogy a
                személyes adatokat védjük a jogosulatlan hozzáférés, megváltoztatás, továbbítás,
                nyilvánosságra hozatal, törlés vagy megsemmisítés, valamint a véletlen megsemmisülés és
                sérülés, továbbá az alkalmazott technika megváltozásából fakadó hozzáférhetetlenné válás
                ellen.
              </p>
            </section>

            {/* Jogok */}
            <section className="space-y-3">
              <h2 className="font-serif text-2xl font-bold text-foreground border-b border-border/60 pb-2">
                Az adatkezelés során Önt megillető jogok
              </h2>
              <p>Az adatkezelés időtartamán belül Önt a Rendelet előírásai szerint az alábbi jogok illetik meg:</p>
              <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                <li>a hozzájárulás visszavonásának joga,</li>
                <li>hozzáférési jog,</li>
                <li>helyesbítéshez való jog,</li>
                <li>adatkezelés korlátozásához való jog,</li>
                <li>törléshez való jog,</li>
                <li>tiltakozáshoz való jog,</li>
                <li>adathordozhatósághoz való jog.</li>
              </ul>
              <p>
                Amennyiben Ön fenti jogai valamelyikével élni kíván, kérjük vegye figyelembe, hogy az az
                Ön azonosításával jár együtt, valamint Társaságunknak szükségszerűen kommunikálnia kell
                Önnel. Ezért az azonosítás érdekében személyes adatok megadására lesz szükség (az
                azonosítás csak olyan adatokon alapulhat, amelyet Társaságunk egyébként is kezel Önről).
                Amennyiben Ön vásárlónk volt és panaszügyintézés, vagy garanciális ügyintézés érdekében
                szeretné magát azonosítani, az azonosításhoz kérjük adja meg rendelési azonosítóját is.
                Társaságunk az adatkezeléssel kapcsolatos panaszokat legkésőbb <strong>30 napon belül</strong>{" "}
                megválaszolja.
              </p>

              <div className="pt-2">
                <h3 className="font-semibold text-foreground">A hozzájárulás visszavonásának joga</h3>
                <p className="mt-1">
                  Ön bármikor jogosult az adatkezeléshez adott hozzájárulást visszavonni, ilyen esetben
                  a megadott adatokat rendszereinkből töröljük. Kérjük, azonban vegye figyelembe, hogy a
                  még nem teljesített megrendelés esetén a visszavonás azzal a következménnyel járhat,
                  hogy nem tudjuk Ön felé teljesíteni a kiszállítást. Amennyiben a vásárlás már
                  megvalósult, a számviteli előírások alapján a számlázással kapcsolatos adatokat nem
                  törölhetjük rendszereinkből. Ha Önnek tartozása áll fenn felénk, akkor a követelés
                  behajtásával kapcsolatos jogos érdek alapján, adatait a hozzájárulás visszavonása
                  esetén is kezelhetjük.
                </p>
              </div>

              <div className="pt-2">
                <h3 className="font-semibold text-foreground">Hozzáférési jog</h3>
                <p className="mt-1">
                  Ön jogosult arra, hogy az adatkezelőtől visszajelzést kapjon arra vonatkozóan, hogy
                  személyes adatainak kezelése folyamatban van-e, és ha ilyen adatkezelés folyamatban
                  van, jogosult arra, hogy a személyes adatokhoz és a következő információkhoz
                  hozzáférést kapjon:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground mt-2">
                  <li>az adatkezelés célja,</li>
                  <li>az érintett személyes adatok kategóriái,</li>
                  <li>azon címzettek, akikkel a személyes adatokat közölték,</li>
                  <li>a személyes adatok tárolásának tervezett időtartama,</li>
                  <li>ha az adatokat nem Öntől gyűjtötték be, a forrásukra vonatkozó minden elérhető információ.</li>
                </ul>
              </div>

              <div className="pt-2">
                <h3 className="font-semibold text-foreground">Helyesbítéshez való jog</h3>
                <p className="mt-1">
                  Ön jogosult arra, hogy kérésére Társaságunk késedelem nélkül helyesbítse az Önre
                  vonatkozó pontatlan személyes adatokat.
                </p>
              </div>

              <div className="pt-2">
                <h3 className="font-semibold text-foreground">Adatkezelés korlátozásához való jog</h3>
                <p className="mt-1">Ön jogosult kérni, hogy Társaságunk korlátozza az adatkezelést, elsősorban akkor, ha:</p>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground mt-2">
                  <li>vitatja az adatok pontosságát,</li>
                  <li>jogellenesnek tartja az adatkezelést, de valamilyen okból mégsem kéri az adatok törlését,</li>
                  <li>Társaságunknak már nincs szüksége a személyes adatokra a megjelölt adatkezelés céljából, de Ön igényli azokat jogi igények előterjesztéséhez, érvényesítéséhez vagy védelméhez,</li>
                  <li>Ön tiltakozott az adatkezelés ellen, de Társaságunk jogos érdeke is megalapozhatja az adatkezelést.</li>
                </ul>
              </div>

              <div className="pt-2">
                <h3 className="font-semibold text-foreground">Törléshez való jog</h3>
                <p className="mt-1">
                  Ön jogosult arra, hogy kérésére az adatkezelő törölje a rá vonatkozó személyes
                  adatokat. Társaságunk – ezen kérelem alapján – köteles törölni a személyes adatokat, ha
                  az alábbi indokok valamelyike fennáll:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground mt-2">
                  <li>a személyes adatokra már nincs szükség abból a célból, amelyből azokat gyűjtöttük,</li>
                  <li>az érintett visszavonja korábban adott hozzájárulását és az adatkezelésnek nincs más jogalapja,</li>
                  <li>az érintett tiltakozik az adatkezelés ellen és nincs elsőbbséget élvező jogszerű ok az adatkezelésre,</li>
                  <li>a személyes adatokat jogellenesen kezeltük,</li>
                  <li>uniós vagy tagállami jogban előírt jogi kötelezettség teljesítéséhez szükséges törölni az adatokat.</li>
                </ul>
              </div>

              <div className="pt-2">
                <h3 className="font-semibold text-foreground">Tiltakozáshoz való jog</h3>
                <p className="mt-1">
                  Ön jogosult arra, hogy a saját helyzetével kapcsolatos okokból bármikor tiltakozzon
                  személyes adatainak jogos érdeken alapuló kezelése ellen. Ebben az esetben az
                  Adatkezelő a személyes adatokat nem kezelheti tovább, kivéve, ha az bizonyítja, hogy az
                  adatkezelést olyan kényszerítő erejű jogos okok indokolják, amelyek elsőbbséget
                  élveznek az Ön érdekeivel, jogaival és szabadságaival szemben, vagy amelyek jogi
                  igények előterjesztéséhez, érvényesítéséhez vagy védelméhez kapcsolódnak.
                </p>
                <p className="mt-2">
                  Ha a személyes adatok kezelése közvetlen üzletszerzés érdekében történik, Ön jogosult
                  arra, hogy bármikor tiltakozzon az Önre vonatkozó személyes adatok e célból történő
                  kezelése ellen, ideértve a profilalkotást is, amennyiben az a közvetlen üzletszerzéshez
                  kapcsolódik. Ha Ön tiltakozik, a személyes adatok a továbbiakban e célból nem
                  kezelhetők.
                </p>
              </div>

              <div className="pt-2">
                <h3 className="font-semibold text-foreground">Adathordozhatósághoz való jog</h3>
                <p className="mt-1">
                  Ön jogosult arra, hogy az Önre vonatkozó, Ön által Társaságunknak megadott személyes
                  adatokat tagolt, széles körben használt, géppel olvasható formátumban megkapja.
                  Továbbá jogosult arra is, hogy ezeket az adatokat egy másik adatkezelőnek továbbítsa.
                </p>
              </div>
            </section>

            {/* Automatizált döntéshozatal */}
            <section className="space-y-3">
              <h2 className="font-serif text-2xl font-bold text-foreground border-b border-border/60 pb-2">
                Automatizált döntéshozatal
              </h2>
              <p>
                Ön jogosult arra, hogy ne terjedjen ki Önre az olyan, kizárólag automatizált
                adatkezelésen alapuló döntés hatálya (ideértve a profilalkotást is), amely Önre nézve
                joghatással járna, vagy Önt hasonlóképpen jelentős mértékben érintené. Ezekben az
                esetekben Társaságunk köteles megfelelő intézkedéseket tenni az érintett jogainak,
                szabadságainak és jogos érdekeinek védelme érdekében, ideértve az érintettnek legalább
                azt a jogát, hogy az adatkezelő részéről emberi beavatkozást kérjen, álláspontját
                kifejezze, és a döntéssel szemben kifogást nyújtson be.
              </p>
              <p>A fentiek nem alkalmazandóak abban az esetben, ha a döntés:</p>
              <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                <li>Ön és Társaságunk közötti szerződés megkötése vagy teljesítése érdekében szükséges,</li>
                <li>meghozatalát az Adatkezelőre alkalmazandó olyan uniós vagy tagállami jog teszi lehetővé, amely megfelelő intézkedéseket is megállapít,</li>
                <li>az Ön kifejezett hozzájárulásán alapul.</li>
              </ul>
            </section>

            {/* Jogszabályok */}
            <section className="space-y-3">
              <h2 className="font-serif text-2xl font-bold text-foreground border-b border-border/60 pb-2">
                Vonatkozó jogszabályok
              </h2>
              <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                <li>2011. évi CXII. törvény – az információs önrendelkezési jogról és az információszabadságról (Info. tv.)</li>
                <li>Az Európai Parlament és a Tanács (EU) 2016/679 rendelete (2016. április 27.) – GDPR</li>
                <li>2013. évi V. törvény – a Polgári Törvénykönyvről (Ptk.)</li>
                <li>2000. évi C. törvény – a számvitelről (Számviteli tv.)</li>
              </ul>
            </section>

            {/* Jogorvoslat */}
            <section className="space-y-3">
              <h2 className="font-serif text-2xl font-bold text-foreground border-b border-border/60 pb-2">
                Jogorvoslati lehetőségek
              </h2>
              <p>
                Amennyiben Ön szerint Társaságunk megsértette valamely, az adatkezelésre vonatkozó
                törvényi rendelkezést, vagy nem teljesítette valamely kérelmét, akkor a vélelmezett
                jogellenes adatkezelés megszüntetése érdekében az alábbi jogorvoslati lehetőségek állnak
                rendelkezésére:
              </p>

              <div>
                <h3 className="font-semibold text-foreground">Bírósághoz fordulás</h3>
                <p className="text-muted-foreground mt-1">
                  Társaságunkkal szemben polgári pert indíthat bíróság előtt, a bíróság az ügyben soron
                  kívül jár el.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground">Adatvédelmi Hatósági eljárás</h3>
                <p className="mt-1">Panasszal a Nemzeti Adatvédelmi és Információszabadság Hatóságnál lehet élni:</p>
                <dl className="grid sm:grid-cols-[140px_1fr] gap-x-6 gap-y-1 text-sm mt-2 text-muted-foreground">
                  <dt>Név</dt><dd>Nemzeti Adatvédelmi és Információszabadság Hatóság</dd>
                  <dt className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> Székhely</dt>
                  <dd>1125 Budapest, Szilágyi Erzsébet fasor 22/C.</dd>
                  <dt>Levelezési cím</dt><dd>1530 Budapest, Pf.: 5.</dd>
                  <dt className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> Telefon</dt>
                  <dd>+36 1 391 1400</dd>
                  <dt>Fax</dt><dd>+36 1 391 1410</dd>
                  <dt className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> E-mail</dt>
                  <dd>
                    <a href="mailto:ugyfelszolgalat@naih.hu" className="text-[#d4a017] hover:underline">
                      ugyfelszolgalat@naih.hu
                    </a>
                  </dd>
                  <dt>Honlap</dt>
                  <dd>
                    <a href="http://www.naih.hu" className="text-[#d4a017] hover:underline" target="_blank" rel="noopener noreferrer">
                      www.naih.hu
                    </a>
                  </dd>
                </dl>
              </div>
            </section>

            {/* Egyéb */}
            <section className="space-y-3">
              <h2 className="font-serif text-2xl font-bold text-foreground border-b border-border/60 pb-2">
                Egyéb rendelkezések
              </h2>
              <p>
                Jelen Adatvédelmi tájékoztatóban fel nem sorolt adatkezelésekről az adat felvételekor
                adunk tájékoztatást. Ilyen esetekben a hatályos jogszabályok rendelkezéseit tekintjük
                irányadónak.
              </p>
              <p>
                Tájékoztatjuk ügyfeleinket, hogy a bíróság, az ügyész, a nyomozó hatóság, a
                szabálysértési hatóság, a közigazgatási hatóság, a Nemzeti Adatvédelmi és
                Információszabadság Hatóság, a Magyar Nemzeti Bank, illetőleg jogszabály felhatalmazása
                alapján más szervek tájékoztatás adása, adatok közlése, átadása, illetőleg iratok
                rendelkezésre bocsátása végett megkereshetik Társaságunkat. Társaságunk a hatóságok
                részére – amennyiben az a pontos célt és az adatok körét megjelölte – személyes adatot
                csak annyit és olyan mértékben ad ki, amely a megkeresés céljának kielégítéséhez
                elengedhetetlenül szükséges.
              </p>
            </section>

            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <a
                href="/adatkezelesi-tajekoztato.pdf"
                download
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#0a1f0a] text-[#d4a017] font-semibold hover:bg-[#d4a017] hover:text-[#0a1f0a] transition-colors"
              >
                <Download className="w-5 h-5" />
                Letöltés PDF-ben
              </a>
              <Link
                href="/jelentkezes"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#d4a017] text-[#0a1f0a] font-semibold hover:shadow-[0_10px_30px_#d4a0174d] transition-all"
              >
                Tovább a jelentkezésre
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </article>
        </div>
      </section>
    </main>
  )
}
