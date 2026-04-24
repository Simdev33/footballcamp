import { Mail, Phone, MapPin } from "lucide-react"

export function PrivacyContentHU() {
  return (
    <>
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-[#d4a017]/10 flex items-center justify-center shrink-0">
          <PrivacyIcon />
        </div>
        <p className="text-muted-foreground">
          A jelen dokumentum a <strong>kickoffcamps.hu</strong> weboldal működésével kapcsolatban
          minden releváns adatkezelési információt tartalmaz az Európai Unió 2016/679 számú
          Általános Adatvédelmi Rendelete (GDPR) és a 2011. évi CXII. tv. (Infotv.) alapján.
        </p>
      </div>

      <Section title="Adatkezelő adatai">
        <dl className="grid sm:grid-cols-[180px_1fr] gap-x-6 gap-y-2 text-sm">
          <Term>Név</Term><Def>TIREKSZ NONPROFIT KFT.</Def>
          <Term>Székhely</Term><Def>6728 Szeged, Felsőnyomás út 47.</Def>
          <Term>Levelezési cím</Term><Def>6728 Szeged, Felsőnyomás út 47.</Def>
          <Term>Cégjegyzékszám</Term><Def>06-09-028994</Def>
          <Term>Adószám</Term><Def>32342651-1-06</Def>
          <Term>Képviselő</Term><Def>Rozinka Arnold, ügyvezető</Def>
          <Term>Telefonszám</Term><Def><Tel href="tel:+36307551110">+36 30 755 1110</Tel></Def>
          <Term>E-mail</Term><Def><Tel href="mailto:rozinka.arnold@tireksz.hu">rozinka.arnold@tireksz.hu</Tel></Def>
          <Term>Honlap</Term><Def><Tel href="https://kickoffcamps.hu">https://kickoffcamps.hu</Tel></Def>
        </dl>
      </Section>

      <Section title="Az adatkezelési tájékoztató célja">
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
      </Section>

      <Section title="Az adatkezelési tájékoztató személyi, tárgyi és időbeli hatálya">
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
      </Section>

      <Section title="Fontosabb fogalmak">
        <dl className="space-y-3">
          <Definition term="Személyes adat" def="azonosított vagy azonosítható természetes személyre vonatkozó bármely információ." />
          <Definition term="Adatkezelő" def="az a természetes vagy jogi személy, közhatalmi szerv, ügynökség vagy bármely egyéb szerv, amely a személyes adatok kezelésének céljait és eszközeit önállóan vagy másokkal együtt meghatározza." />
          <Definition term="Adatkezelés" def="a személyes adatokon vagy adatállományokon automatizált vagy nem automatizált módon végzett bármely művelet vagy műveletek összessége, így a gyűjtés, rögzítés, rendszerezés, tagolás, tárolás, átalakítás vagy megváltoztatás, lekérdezés, betekintés, felhasználás, közlés, továbbítás, terjesztés vagy egyéb módon történő hozzáférhetővé tétel útján, összehangolás vagy összekapcsolás, korlátozás, illetve megsemmisítés." />
          <Definition term="Adatfeldolgozó" def="az a természetes személy vagy jogi személy, közhatalmi szerv, ügynökség, vagy bármely egyéb szerv, amely az adatkezelő nevében személyes adatokat kezel." />
          <Definition term="Adatvédelmi incidens" def="a biztonság olyan sérülése, amely a továbbított, tárolt vagy más módon kezelt személyes adatok véletlen vagy jogellenes megsemmisítését, elvesztését, megváltoztatását, jogosulatlan közlését vagy az azokhoz való jogosulatlan hozzáférést eredményezi." />
          <Definition term="Érintett" def="bármely meghatározott, személyes adat alapján azonosított vagy – közvetlenül vagy közvetve – azonosítható természetes személy, pl. munkatárs, állásajánlatra jelentkező természetes személy, az Adatkezelő szolgáltatásait igénybe vevő természetes személy." />
          <Definition term="Harmadik fél" def="az a természetes vagy jogi személy, közhatalmi szerv, ügynökség vagy bármely egyéb szerv, amely nem azonos az érintettel, az adatkezelővel, az adatfeldolgozóval, vagy azokkal a személyekkel, akik az adatkezelő vagy adatfeldolgozó közvetlen irányítása alatt a személyes adatok kezelésére felhatalmazást kaptak." />
          <Definition term="Hozzájárulás" def="az érintett akaratának önkéntes és határozott kinyilvánítása, amely megfelelő tájékoztatáson alapul, és amellyel félreérthetetlen beleegyezését adja a rá vonatkozó személyes adatok – teljes körű vagy egyes műveletekre kiterjedő – kezeléséhez." />
          <Definition term="Weboldal (Honlap)" def="a portál és minden aloldala, amelynek üzemeltetője az Adatkezelő." />
        </dl>
      </Section>

      <Section title="Cookie-k (sütik) használatával kapcsolatos tájékoztatás">
        <p className="font-semibold">A honlap által használt cookie-k főbb típusai:</p>
        <SubSection title="A működéshez szigorúan szükséges cookie-k">
          Ezek a cookie-k a weboldal használatához nélkülözhetetlenek, és lehetővé teszik a
          weboldal alapvető funkcióinak használatát. Ezek hiányában az oldal több funkciója nem
          lesz elérhető az Ön számára. Ezen típusú cookie-k élettartama kizárólag a munkamenet
          idejére korlátozódik.
        </SubSection>
        <SubSection title="A felhasználói élmény javítását szolgáló cookie-k">
          Ezek a cookie-k információkat gyűjtenek a felhasználó weboldal használati szokásairól,
          például, hogy mely oldalakat látogatja leggyakrabban, vagy milyen hibaüzeneteket kap a
          weboldalról. Ezek a cookie-k nem gyűjtenek a látogatót azonosító információkat, vagyis
          teljesen általános, névtelen információkkal dolgoznak. Az ezekből nyert adatokat a
          weboldal teljesítményének javítására használjuk. Ezen típusú cookie-k élettartama
          kizárólag a munkamenet idejére korlátozódik.
        </SubSection>
        <p>
          Weboldalunk a helyes működéshez cookie-k használatát igényelheti. Amennyiben a
          böngészőben a cookie-k engedélyezve vannak, akkor és csakis akkor a cookie-k használata
          automatikus. A cookie-k használata egy lehetőség a webhely kényelmesebb böngészéséhez és
          a bejelentkezés használatához. A cookie-k használatát bármikor le lehet tiltani a saját
          böngészőben. Előfordulhat viszont, hogy a letiltott cookie-k mellett nem fog megfelelően
          működni a weboldalunk.
        </p>
      </Section>

      <Section title="Társaságunknál történő személyes adatok kezelése">
        <p>Társaságunknál a személyes adatok kezelésére kizárólag az alábbi esetekben kerül sor:</p>
        <Ul>
          <li>ha az érintett hozzájárulását adta személyes adatainak egy vagy több konkrét célból történő kezeléséhez,</li>
          <li>az adatkezelés olyan szerződés teljesítéséhez szükséges, amelyben az érintett az egyik fél,</li>
          <li>az adatkezelés az adatkezelőre vonatkozó jogi kötelezettség teljesítéséhez szükséges,</li>
          <li>az adatkezelés az érintett vagy egy másik természetes személy létfontosságú érdekeinek védelme miatt szükséges,</li>
          <li>az adatkezelés az adatkezelő vagy egy harmadik fél jogos érdekeinek érvényesítéséhez szükséges.</li>
        </Ul>
        <p>
          Társaságunknál, a kickoffcamps.hu weboldal üzemeltetése során, az alábbi adatkezelések
          valósulhatnak meg:
        </p>

        <SubSection title="1. Honlap kezelése (www.kickoffcamps.hu)">
          <p>
            A Weboldal tartalma eltérő megjelölés hiányában az Adatkezelő tulajdona, szerzői jogi
            védelem alatt álló szellemi alkotása. Az Adatkezelő ezzel kapcsolatosan minden jogot
            fenntart. Az ügyfél a weboldalt ingyen, személyes adatok megadása nélkül látogathatja.
            A Társaság által szervezett eseményeken történő részvétel azonban regisztrációhoz kötött,
            amely során az ügyfél személyes adatnak minősülő információkat ad meg.
          </p>
          <p>
            Az ügyfél az adatok átadásával és elküldésével, valamint a honlap látogatásával
            hozzájárul ahhoz, hogy az átadott adatait az adatkezelő a jogszabályokban, valamint a
            jelen tájékoztatóban foglaltak szerint kezelje. A regisztráció során az adatkezelő
            tudomására jutott személyes adatait semmilyen körülmények között nem teszi – az érintett
            kifejezett beleegyező hozzájárulása nélkül – más számára hozzáférhetővé, kivéve a
            jogszabályi kötelezés, illetve a hatósági eljárás eseteit, valamint az adatfeldolgozókat.
          </p>
          <p>
            A weboldalon az adatkezelő reklámokat jeleníthet meg. A weboldal letöltéséből vagy
            elérhetetlenségéből eredő bármilyen kár megtérítését az Adatkezelő szintén kizárja. A
            weboldalon található külső hivatkozások követésével letöltött tartalom nem áll az
            Adatkezelő befolyása alatt. Az Adatkezelő fenntartja a jogot felhasználók kitiltására,
            a regisztráció előzetes értesítés és indokolás nélküli megszüntetésére.
          </p>
        </SubSection>

        <SubSection title="2. Kapcsolatfelvétel">
          <p>
            Az Érintett (ügyfél) pl. e-mailben, telefonon kérdéssel fordul hozzánk. Ezek elsősorban
            a sporttevékenységünkkel, táboroztatással kapcsolatos kérdések lehetnek. Az adatkezelés
            célja az érintett számára megfelelő információ nyújtása és a kapcsolattartás.
          </p>
          <p>
            Kezelt adatok ebben az esetben az Ön által a kapcsolatfelvétel során megadott adatok.
            Az adatkezelés időtartama csak a kapcsolatfelvétel lezárultáig terjed. Az adatkezelés
            jogalapja a Vevő (ügyfél) önkéntes hozzájárulása, amit a kapcsolatfelvétellel ad meg
            Társaságunk számára.
          </p>
        </SubSection>

        <SubSection title="3. Hírlevél, hírlevélre történő feliratkozás">
          <p>A hírlevélre történő feliratkozás önkéntes hozzájáruláson alapul.</p>
          <p><strong>Az érintettek köre:</strong> Minden természetes személy, aki az Adatkezelő híreiről rendszeresen értesülni kíván, ezért személyes adatainak megadásával a hírlevél szolgáltatásra feliratkozik.</p>
          <p><strong>A kezelt adatok köre és célja:</strong></p>
          <Ul>
            <li><strong>Név</strong> – azonosítás céljából</li>
            <li><strong>E-mail cím</strong> – a hírlevél kiküldése céljából</li>
          </Ul>
          <p>
            A hírlevélküldéssel kapcsolatos adatkezelés célja a címzett teljes körű általános vagy
            személyre szabott tájékoztatása az Adatkezelő legújabb eseményeiről, híreiről. Hírlevél
            kiküldése kizárólag az érintett előzetes hozzájárulásával történik. Az Adatkezelő
            kizárólag addig kezeli az ebből a célból felvett személyes adatokat, amíg az érintett le
            nem iratkozik a hírlevél listáról, vagy megerősítést nem ad.
          </p>
          <p>
            Az érintett a hírlevélről bármikor leiratkozhat az elektronikus levelek alján, valamint
            az „Adatkezelő adatai" pontban megadott e-mail címre küldött lemondási kérelem útján.
            Postai úton a Társaság székhelyére küldött levéllel lehet leiratkozni.
          </p>
        </SubSection>

        <SubSection title="4. Közösségi portálok (pl. Facebook, Instagram)">
          <p>
            A Társaság által kínált jegyekhez és szolgáltatásokhoz tartozó rendezvények /
            programok / események elérhetőek a Facebook és Instagram közösségi portálon. Az
            üzenőfalon közzétett hírfolyamra a Facebook-felhasználó az adott oldalon található
            linkre („like"/„tetszik"; „follow"/„követem") kattintva iratkozhat fel, és az ugyanitt
            található („dislike"/„nem tetszik") linkre kattintva iratkozhat le, illetve az
            üzenőfal beállításai segítségével törölheti a nem kívánt, üzenőfalon megjelenő híreket.
          </p>
          <p>
            A Társaság a „követők" profiljához hozzáfér, de azt nem rögzíti, vagy kezeli saját
            belső rendszerében. Az adatkezelés célja a Társaság által kínált jegyekhez és
            szolgáltatásokhoz tartozó rendezvények/programok/eseményekhez tartozó tartalmak
            megosztása, egyéb hírek közlése, kapcsolattartás. A Facebook-oldalak segítségével az
            Érintett tájékozódhat a legújabb programajánlatokról. Az adatkezelés jogalapja az
            Érintett önkéntes hozzájárulása, melyet leiratkozással bármikor visszavonhat.
          </p>
          <p>
            A Facebook és Instagram az Adatkezelőtől független, külön adatkezelő. Társaságunknak
            nincs befolyása ezeknek az adatoknak a fajtájára, terjedelmére és feldolgozására.
            Társaságunk nem kap személyes adatokat a Facebook üzemeltetőjétől. Az Érintett az oldal
            adatkezeléséről tájékoztatást a következő linkeken kaphat:
          </p>
          <Ul>
            <li><Tel href="https://www.facebook.com/policies/cookies/" external>facebook.com/policies/cookies</Tel></li>
            <li><Tel href="https://www.facebook.com/about/privacy/update" external>facebook.com/about/privacy/update</Tel></li>
            <li><Tel href="https://help.instagram.com" external>help.instagram.com</Tel></li>
          </Ul>
        </SubSection>

        <SubSection title="5. Társaságunk tevékenységével kapcsolatos panaszkezelés">
          <p>
            Az adatkezelés célja ebben az esetben a panasz közlésének lehetővé tétele, az érintett
            és panasza azonosítása, valamint a törvény szerint kötelezően rögzítendő adatok felvétele,
            illetve a panasz kivizsgálása, annak rendezésével összefüggő kapcsolattartás.
          </p>
          <p>
            A panasz megtétele önkéntes hozzájáruláson alapul, de megtett panasz esetén az
            ügyintézés, és így a személyes adatok kezelése – a fogyasztóvédelemről szóló 1997. évi
            CLV. törvény alapján – kötelező. Társaságunk a panaszról felvett jegyzőkönyvet és a
            válasz másolati példányát 5 évig megőrzi, ennek alapján a személyes adatokat is ezen
            időtartam alatt kezeli.
          </p>
        </SubSection>
      </Section>

      <Section title="A Társasággal kapcsolatban álló adatfeldolgozók">
        <SubSection title="1. A társaság által alkalmazott könyvelő cég">
          <dl className="grid sm:grid-cols-[120px_1fr] gap-x-6 gap-y-1 text-sm mt-2 text-muted-foreground">
            <dt>Név</dt><dd>R&amp;R Services and More Kft.</dd>
            <dt>Székhely</dt><dd>6793 Forráskút, Átokháza dűlő 277.</dd>
            <dt>Telefon</dt><dd>+36 20 436 7582</dd>
            <dt>E-mail</dt><dd>radoczi.zsolt@rzs-konyveles.hu</dd>
            <dt>Adószám</dt><dd>32037797-2-06</dd>
          </dl>
        </SubSection>
        <SubSection title="2. Az online fizetéssel kapcsolatos adatfeldolgozás">
          <p className="text-sm text-muted-foreground">Az adatfeldolgozó adatai későbbi időpontban kerülnek meghatározásra.</p>
        </SubSection>
      </Section>

      <Section title="A vevők részére kiállított számlák és az azokon szereplő személyes adatok kezelése">
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
      </Section>

      <Section title="Gyermekek adatai, a személyes adatok különleges kategóriáinak kezelése">
        <p>
          16 éven aluli személy a Társaság weboldalán nem vásárolhat, nem regisztrálhat, nem
          iratkozhat fel hírlevélre és az ügyfélkapcsolati adatlapján nem veheti fel a kapcsolatot
          a Társasággal, tekintettel arra, hogy a GDPR 8. cikk (1) bekezdése alapján az
          adatkezeléshez történő hozzájárulását tartalmazó jognyilatkozatának érvényességéhez
          törvényes képviselőjének engedélye szükséges. Társaságunknak nem áll módjában a
          hozzájáruló személy életkorát és jogosultságát ellenőrizni, így az érintett szavatol
          azért, hogy a megadott adatai valósak.
        </p>
      </Section>

      <Section title="Adatbiztonsági intézkedések">
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
      </Section>

      <Section title="Az adatkezelés során Önt megillető jogok">
        <p>Az adatkezelés időtartamán belül Önt a Rendelet előírásai szerint az alábbi jogok illetik meg:</p>
        <Ul>
          <li>a hozzájárulás visszavonásának joga,</li>
          <li>hozzáférési jog,</li>
          <li>helyesbítéshez való jog,</li>
          <li>adatkezelés korlátozásához való jog,</li>
          <li>törléshez való jog,</li>
          <li>tiltakozáshoz való jog,</li>
          <li>adathordozhatósághoz való jog.</li>
        </Ul>
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

        <SubSection title="A hozzájárulás visszavonásának joga">
          <p>
            Ön bármikor jogosult az adatkezeléshez adott hozzájárulást visszavonni, ilyen esetben
            a megadott adatokat rendszereinkből töröljük. Kérjük, azonban vegye figyelembe, hogy a
            még nem teljesített megrendelés esetén a visszavonás azzal a következménnyel járhat,
            hogy nem tudjuk Ön felé teljesíteni a kiszállítást. Amennyiben a vásárlás már
            megvalósult, a számviteli előírások alapján a számlázással kapcsolatos adatokat nem
            törölhetjük rendszereinkből. Ha Önnek tartozása áll fenn felénk, akkor a követelés
            behajtásával kapcsolatos jogos érdek alapján, adatait a hozzájárulás visszavonása
            esetén is kezelhetjük.
          </p>
        </SubSection>

        <SubSection title="Hozzáférési jog">
          <p>
            Ön jogosult arra, hogy az adatkezelőtől visszajelzést kapjon arra vonatkozóan, hogy
            személyes adatainak kezelése folyamatban van-e, és ha ilyen adatkezelés folyamatban
            van, jogosult arra, hogy a személyes adatokhoz és a következő információkhoz
            hozzáférést kapjon:
          </p>
          <Ul>
            <li>az adatkezelés célja,</li>
            <li>az érintett személyes adatok kategóriái,</li>
            <li>azon címzettek, akikkel a személyes adatokat közölték,</li>
            <li>a személyes adatok tárolásának tervezett időtartama,</li>
            <li>ha az adatokat nem Öntől gyűjtötték be, a forrásukra vonatkozó minden elérhető információ.</li>
          </Ul>
        </SubSection>

        <SubSection title="Helyesbítéshez való jog">
          <p>Ön jogosult arra, hogy kérésére Társaságunk késedelem nélkül helyesbítse az Önre vonatkozó pontatlan személyes adatokat.</p>
        </SubSection>

        <SubSection title="Adatkezelés korlátozásához való jog">
          <p>Ön jogosult kérni, hogy Társaságunk korlátozza az adatkezelést, elsősorban akkor, ha:</p>
          <Ul>
            <li>vitatja az adatok pontosságát,</li>
            <li>jogellenesnek tartja az adatkezelést, de valamilyen okból mégsem kéri az adatok törlését,</li>
            <li>Társaságunknak már nincs szüksége a személyes adatokra a megjelölt adatkezelés céljából, de Ön igényli azokat jogi igények előterjesztéséhez, érvényesítéséhez vagy védelméhez,</li>
            <li>Ön tiltakozott az adatkezelés ellen, de Társaságunk jogos érdeke is megalapozhatja az adatkezelést.</li>
          </Ul>
        </SubSection>

        <SubSection title="Törléshez való jog">
          <p>
            Ön jogosult arra, hogy kérésére az adatkezelő törölje a rá vonatkozó személyes
            adatokat. Társaságunk – ezen kérelem alapján – köteles törölni a személyes adatokat, ha
            az alábbi indokok valamelyike fennáll:
          </p>
          <Ul>
            <li>a személyes adatokra már nincs szükség abból a célból, amelyből azokat gyűjtöttük,</li>
            <li>az érintett visszavonja korábban adott hozzájárulását és az adatkezelésnek nincs más jogalapja,</li>
            <li>az érintett tiltakozik az adatkezelés ellen és nincs elsőbbséget élvező jogszerű ok az adatkezelésre,</li>
            <li>a személyes adatokat jogellenesen kezeltük,</li>
            <li>uniós vagy tagállami jogban előírt jogi kötelezettség teljesítéséhez szükséges törölni az adatokat.</li>
          </Ul>
        </SubSection>

        <SubSection title="Tiltakozáshoz való jog">
          <p>
            Ön jogosult arra, hogy a saját helyzetével kapcsolatos okokból bármikor tiltakozzon
            személyes adatainak jogos érdeken alapuló kezelése ellen. Ebben az esetben az
            Adatkezelő a személyes adatokat nem kezelheti tovább, kivéve, ha az bizonyítja, hogy az
            adatkezelést olyan kényszerítő erejű jogos okok indokolják, amelyek elsőbbséget
            élveznek az Ön érdekeivel, jogaival és szabadságaival szemben, vagy amelyek jogi
            igények előterjesztéséhez, érvényesítéséhez vagy védelméhez kapcsolódnak.
          </p>
          <p>
            Ha a személyes adatok kezelése közvetlen üzletszerzés érdekében történik, Ön jogosult
            arra, hogy bármikor tiltakozzon az Önre vonatkozó személyes adatok e célból történő
            kezelése ellen, ideértve a profilalkotást is, amennyiben az a közvetlen üzletszerzéshez
            kapcsolódik. Ha Ön tiltakozik, a személyes adatok a továbbiakban e célból nem
            kezelhetők.
          </p>
        </SubSection>

        <SubSection title="Adathordozhatósághoz való jog">
          <p>
            Ön jogosult arra, hogy az Önre vonatkozó, Ön által Társaságunknak megadott személyes
            adatokat tagolt, széles körben használt, géppel olvasható formátumban megkapja.
            Továbbá jogosult arra is, hogy ezeket az adatokat egy másik adatkezelőnek továbbítsa.
          </p>
        </SubSection>
      </Section>

      <Section title="Automatizált döntéshozatal">
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
        <Ul>
          <li>Ön és Társaságunk közötti szerződés megkötése vagy teljesítése érdekében szükséges,</li>
          <li>meghozatalát az Adatkezelőre alkalmazandó olyan uniós vagy tagállami jog teszi lehetővé, amely megfelelő intézkedéseket is megállapít,</li>
          <li>az Ön kifejezett hozzájárulásán alapul.</li>
        </Ul>
      </Section>

      <Section title="Vonatkozó jogszabályok">
        <Ul>
          <li>2011. évi CXII. törvény – az információs önrendelkezési jogról és az információszabadságról (Info. tv.)</li>
          <li>Az Európai Parlament és a Tanács (EU) 2016/679 rendelete (2016. április 27.) – GDPR</li>
          <li>2013. évi V. törvény – a Polgári Törvénykönyvről (Ptk.)</li>
          <li>2000. évi C. törvény – a számvitelről (Számviteli tv.)</li>
        </Ul>
      </Section>

      <Section title="Jogorvoslati lehetőségek">
        <p>
          Amennyiben Ön szerint Társaságunk megsértette valamely, az adatkezelésre vonatkozó
          törvényi rendelkezést, vagy nem teljesítette valamely kérelmét, akkor a vélelmezett
          jogellenes adatkezelés megszüntetése érdekében az alábbi jogorvoslati lehetőségek állnak
          rendelkezésére:
        </p>
        <SubSection title="Bírósághoz fordulás">
          <p className="text-muted-foreground">
            Társaságunkkal szemben polgári pert indíthat bíróság előtt, a bíróság az ügyben soron
            kívül jár el.
          </p>
        </SubSection>
        <SubSection title="Adatvédelmi Hatósági eljárás">
          <p>Panasszal a Nemzeti Adatvédelmi és Információszabadság Hatóságnál lehet élni:</p>
          <dl className="grid sm:grid-cols-[140px_1fr] gap-x-6 gap-y-1 text-sm mt-2 text-muted-foreground">
            <dt>Név</dt><dd>Nemzeti Adatvédelmi és Információszabadság Hatóság</dd>
            <dt className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> Székhely</dt>
            <dd>1125 Budapest, Szilágyi Erzsébet fasor 22/C.</dd>
            <dt>Levelezési cím</dt><dd>1530 Budapest, Pf.: 5.</dd>
            <dt className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> Telefon</dt>
            <dd>+36 1 391 1400</dd>
            <dt>Fax</dt><dd>+36 1 391 1410</dd>
            <dt className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> E-mail</dt>
            <dd><Tel href="mailto:ugyfelszolgalat@naih.hu">ugyfelszolgalat@naih.hu</Tel></dd>
            <dt>Honlap</dt><dd><Tel href="http://www.naih.hu" external>www.naih.hu</Tel></dd>
          </dl>
        </SubSection>
      </Section>

      <Section title="Egyéb rendelkezések">
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
      </Section>
    </>
  )
}

export function PrivacyContentEN() {
  return (
    <>
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-[#d4a017]/10 flex items-center justify-center shrink-0">
          <PrivacyIcon />
        </div>
        <p className="text-muted-foreground">
          This document contains all relevant information on the processing of personal data in
          connection with the operation of the <strong>kickoffcamps.hu</strong> website, based on
          Regulation (EU) 2016/679 of the European Union (GDPR) and Hungarian Act CXII of 2011 (Info
          Act).
        </p>
      </div>

      <Section title="Data controller">
        <dl className="grid sm:grid-cols-[180px_1fr] gap-x-6 gap-y-2 text-sm">
          <Term>Name</Term><Def>TIREKSZ NONPROFIT KFT.</Def>
          <Term>Registered seat</Term><Def>6728 Szeged, Felsőnyomás út 47., Hungary</Def>
          <Term>Mailing address</Term><Def>6728 Szeged, Felsőnyomás út 47., Hungary</Def>
          <Term>Company reg. no.</Term><Def>06-09-028994</Def>
          <Term>Tax number</Term><Def>32342651-1-06</Def>
          <Term>Representative</Term><Def>Arnold Rozinka, managing director</Def>
          <Term>Phone</Term><Def><Tel href="tel:+36307551110">+36 30 755 1110</Tel></Def>
          <Term>Email</Term><Def><Tel href="mailto:rozinka.arnold@tireksz.hu">rozinka.arnold@tireksz.hu</Tel></Def>
          <Term>Website</Term><Def><Tel href="https://kickoffcamps.hu">https://kickoffcamps.hu</Tel></Def>
        </dl>
      </Section>

      <Section title="Purpose of this privacy notice">
        <p>
          TIREKSZ NONPROFIT Kft. (hereinafter: the Company), as data controller, acknowledges the
          contents of this legal notice as binding upon itself. The purpose of this Privacy Notice
          is to inform our customers, partners and buyers about how we process their personal data.
        </p>
        <p>
          The data protection guidelines relating to the Company's data processing are continuously
          available at its premises and on its website. The Company reserves the right to amend
          this notice at any time. Any changes will be communicated to visitors and customers in
          due time, and the notice will be updated on the website.
        </p>
        <p>
          The Company treats personal data as confidential and implements all security, technical
          and organisational measures that guarantee data security. It is committed to protecting
          the personal data of its customers and partners and considers the right to informational
          self-determination especially important.
        </p>
      </Section>

      <Section title="Personal, material and temporal scope">
        <p>
          This Privacy Notice applies to the Company, to the natural persons whose data are
          processed under this Notice, and to persons whose rights or legitimate interests are
          affected by the processing.
        </p>
        <p>
          The material scope covers all data processing on the kickoffcamps.hu website and in the
          Company's activities beyond the website. This Notice enters into force on the date of its
          approval and remains in force indefinitely until further notice.
        </p>
      </Section>

      <Section title="Key definitions">
        <dl className="space-y-3">
          <Definition term="Personal data" def="any information relating to an identified or identifiable natural person." />
          <Definition term="Controller" def="the natural or legal person, public authority, agency or other body which, alone or jointly with others, determines the purposes and means of the processing of personal data." />
          <Definition term="Processing" def="any operation or set of operations performed on personal data or on sets of personal data, whether or not by automated means, such as collection, recording, organisation, structuring, storage, adaptation or alteration, retrieval, consultation, use, disclosure, transmission, dissemination, alignment, restriction, erasure or destruction." />
          <Definition term="Processor" def="a natural or legal person, public authority, agency or other body which processes personal data on behalf of the controller." />
          <Definition term="Personal data breach" def="a breach of security leading to the accidental or unlawful destruction, loss, alteration, unauthorised disclosure of, or access to, personal data transmitted, stored or otherwise processed." />
          <Definition term="Data subject" def="any identified or identifiable natural person, e.g. an employee, a job applicant, or a natural person using the Controller's services." />
          <Definition term="Third party" def="a natural or legal person, public authority, agency or body other than the data subject, controller, processor and persons who, under the direct authority of the controller or processor, are authorised to process personal data." />
          <Definition term="Consent" def="any freely given, specific, informed and unambiguous indication of the data subject's wishes by which they signify agreement to the processing of personal data relating to them." />
          <Definition term="Website" def="the portal and all of its subpages operated by the Controller." />
        </dl>
      </Section>

      <Section title="Information about the use of cookies">
        <p className="font-semibold">The main types of cookies used on the website:</p>
        <SubSection title="Strictly necessary cookies">
          These cookies are essential for using the website and enable basic functions. Without
          them, several features of the site will not be available to you. The lifetime of these
          cookies is limited to the current session.
        </SubSection>
        <SubSection title="Cookies improving user experience">
          These cookies collect information about how the user uses the website — e.g. which pages
          are visited most often or what error messages are received. They do not collect
          information that identifies the visitor; the data is completely generic and anonymous.
          We use this data to improve the performance of the website. The lifetime of these cookies
          is limited to the current session.
        </SubSection>
        <p>
          Our website may require cookies to function properly. If cookies are enabled in your
          browser, their use is automatic. The use of cookies is an option for more convenient
          browsing and for using login features. You can disable cookies in your browser at any
          time; however, disabled cookies may prevent the website from working correctly.
        </p>
      </Section>

      <Section title="Processing of personal data at our Company">
        <p>At our Company, personal data are processed only in the following cases:</p>
        <Ul>
          <li>the data subject has given consent to the processing of their personal data for one or more specific purposes,</li>
          <li>processing is necessary for the performance of a contract to which the data subject is a party,</li>
          <li>processing is necessary for compliance with a legal obligation to which the controller is subject,</li>
          <li>processing is necessary to protect the vital interests of the data subject or of another natural person,</li>
          <li>processing is necessary for the purposes of legitimate interests pursued by the controller or by a third party.</li>
        </Ul>
        <p>The following data processing activities may take place while operating the kickoffcamps.hu website:</p>

        <SubSection title="1. Website operation (www.kickoffcamps.hu)">
          <p>
            Unless otherwise indicated, the content of the Website is the property of the
            Controller and is protected by copyright. The Controller reserves all rights. Users
            may visit the website free of charge without providing personal data. However,
            participation in events organised by the Company is subject to registration, during
            which the user provides information qualifying as personal data.
          </p>
          <p>
            By providing and submitting data and by visiting the website, the user consents to the
            Controller processing their data in accordance with applicable legislation and this
            notice. Personal data learned during registration will not be made available to others
            — without the data subject's express consent — except in cases of legal obligation or
            official procedure, and to processors.
          </p>
          <p>
            The Controller may display advertisements on the website. The Controller excludes
            liability for any damages arising from downloading the website or from its
            unavailability. Content downloaded by following external links on the website is not
            under the Controller's influence. The Controller reserves the right to ban users and to
            terminate registrations without prior notice or justification.
          </p>
        </SubSection>

        <SubSection title="2. Contact requests">
          <p>
            The data subject (customer) contacts us e.g. by email or phone with a question —
            primarily about our sports activities or camps. The purpose of processing is to provide
            appropriate information to the data subject and to maintain contact.
          </p>
          <p>
            In this case, the processed data are those provided during the contact. The processing
            lasts only until the contact is closed. The legal basis is the voluntary consent of the
            customer, given through the act of contacting us.
          </p>
        </SubSection>

        <SubSection title="3. Newsletter subscription">
          <p>Newsletter subscription is based on voluntary consent.</p>
          <p><strong>Data subjects:</strong> any natural person who wishes to receive regular updates about the Controller's news and therefore subscribes to the newsletter by providing their personal data.</p>
          <p><strong>Data processed and purpose:</strong></p>
          <Ul>
            <li><strong>Name</strong> — for identification</li>
            <li><strong>Email address</strong> — for sending the newsletter</li>
          </Ul>
          <p>
            The purpose of this processing is to provide the recipient with comprehensive general
            or personalised information about the Controller's latest events and news. Newsletters
            are sent only with the data subject's prior consent. The Controller processes the data
            collected for this purpose only until the subscriber unsubscribes from the list or
            confirms unsubscription.
          </p>
          <p>
            The data subject may unsubscribe at any time via the link at the bottom of the email,
            or by sending an unsubscribe request to the email address listed under &quot;Data
            controller&quot;. Unsubscription by postal mail is also possible via a letter sent to
            the Company's seat.
          </p>
        </SubSection>

        <SubSection title="4. Social media pages (e.g. Facebook, Instagram)">
          <p>
            Events/programmes/activities related to the tickets and services offered by the
            Company are available on Facebook and Instagram. A Facebook user can subscribe to the
            feed published on the page by clicking &quot;like&quot;/&quot;follow&quot;, and can
            unsubscribe by clicking &quot;unlike&quot; or remove unwanted posts from their feed
            using the wall's settings.
          </p>
          <p>
            The Company can access the profiles of its &quot;followers&quot; but does not record or
            manage them in its internal systems. The purpose of processing is to share content
            about the Company's events/programmes/activities, to share other news and to maintain
            contact. Through the Facebook pages the data subject can learn about the latest
            offers. The legal basis of processing is the data subject's voluntary consent, which
            can be withdrawn at any time by unsubscribing.
          </p>
          <p>
            Facebook and Instagram are independent controllers, separate from us. Our Company has
            no influence over the type, scope or processing of the data they collect, and does not
            receive personal data from Facebook's operator. Information about the data processing
            of these pages can be found at the following links:
          </p>
          <Ul>
            <li><Tel href="https://www.facebook.com/policies/cookies/" external>facebook.com/policies/cookies</Tel></li>
            <li><Tel href="https://www.facebook.com/about/privacy/update" external>facebook.com/about/privacy/update</Tel></li>
            <li><Tel href="https://help.instagram.com" external>help.instagram.com</Tel></li>
          </Ul>
        </SubSection>

        <SubSection title="5. Handling complaints related to our activities">
          <p>
            The purpose of processing is to enable the submission of a complaint, to identify the
            data subject and the complaint, to record the data that must be registered by law, and
            to investigate and maintain contact in relation to the complaint's resolution.
          </p>
          <p>
            Submitting a complaint is based on voluntary consent, but once a complaint is made the
            processing of personal data — based on Act CLV of 1997 on consumer protection — is
            mandatory. We retain the complaint record and a copy of the response for 5 years, and
            process personal data for this same period.
          </p>
        </SubSection>
      </Section>

      <Section title="Data processors engaged by the Company">
        <SubSection title="1. Accounting firm used by the Company">
          <dl className="grid sm:grid-cols-[120px_1fr] gap-x-6 gap-y-1 text-sm mt-2 text-muted-foreground">
            <dt>Name</dt><dd>R&amp;R Services and More Kft.</dd>
            <dt>Seat</dt><dd>6793 Forráskút, Átokháza dűlő 277., Hungary</dd>
            <dt>Phone</dt><dd>+36 20 436 7582</dd>
            <dt>Email</dt><dd>radoczi.zsolt@rzs-konyveles.hu</dd>
            <dt>Tax no.</dt><dd>32037797-2-06</dd>
          </dl>
        </SubSection>
        <SubSection title="2. Online payment processing">
          <p className="text-sm text-muted-foreground">The processor's details will be specified at a later date.</p>
        </SubSection>
      </Section>

      <Section title="Invoices issued to customers and the personal data on them">
        <p>
          For products or services purchased via the website, the Company issues an invoice to the
          buyer. The invoice contains the buyer's name, address and tax number. The personal data
          on the invoice are processed for the purpose of performing the order (contractual
          obligation) and, thereafter, pursuant to Section 169 of Act C of 2000 on Accounting, are
          retained for <strong>8 years</strong>.
        </p>
        <p>
          The Company uses an invoicing software (számlázz.hu) for billing. The personal data on
          the invoice are recorded in this software and retained for the same period as required by
          law for invoices.
        </p>
      </Section>

      <Section title="Children's data and special categories of personal data">
        <p>
          Persons under 16 years of age may not purchase, register, subscribe to the newsletter,
          or contact the Company via the contact form on the Company's website, as under Article
          8(1) of the GDPR the validity of a declaration containing their consent requires the
          authorisation of their legal representative. Our Company is unable to verify the age and
          legal capacity of the consenting person, therefore the data subject warrants that the
          data provided are accurate.
        </p>
      </Section>

      <Section title="Data security measures">
        <p>
          Within the limits of organisational and technical possibilities, our Company does
          everything to ensure that its processors also implement appropriate data security
          measures when handling your personal data.
        </p>
        <p>
          We declare that we have taken appropriate security measures to protect personal data
          against unauthorised access, alteration, transmission, disclosure, deletion or
          destruction, as well as against accidental destruction and damage, and against
          inaccessibility caused by changes in the applied technology.
        </p>
      </Section>

      <Section title="Your rights during the processing">
        <p>During the processing period, you have the following rights under the Regulation:</p>
        <Ul>
          <li>right to withdraw consent,</li>
          <li>right of access,</li>
          <li>right to rectification,</li>
          <li>right to restriction of processing,</li>
          <li>right to erasure,</li>
          <li>right to object,</li>
          <li>right to data portability.</li>
        </Ul>
        <p>
          If you wish to exercise any of these rights, please note that this entails your
          identification and requires communication between you and our Company. Therefore we will
          need you to provide personal data for identification purposes (identification may only be
          based on data we already process about you). If you have been our customer and you want
          to identify yourself for the purpose of a complaint or warranty claim, please also
          provide your order ID. Our Company will respond to complaints regarding data processing
          within <strong>30 days</strong>.
        </p>

        <SubSection title="Right to withdraw consent">
          <p>
            You may withdraw consent to the processing at any time; in this case we will erase the
            data from our systems. Please note, however, that in case of an uncompleted order,
            withdrawal may result in us being unable to fulfil delivery. If the purchase has
            already taken place, we may not erase invoicing-related data from our systems based on
            accounting regulations. If you owe us money, we may continue to process your data on
            the basis of our legitimate interest in collecting the claim, even after withdrawal of
            consent.
          </p>
        </SubSection>

        <SubSection title="Right of access">
          <p>
            You have the right to obtain from the controller confirmation as to whether your
            personal data are being processed, and if so, access to the personal data and the
            following information:
          </p>
          <Ul>
            <li>the purpose of processing,</li>
            <li>the categories of personal data concerned,</li>
            <li>the recipients to whom the data have been disclosed,</li>
            <li>the envisaged storage period of the personal data,</li>
            <li>where the data were not collected from you, all available information as to their source.</li>
          </Ul>
        </SubSection>

        <SubSection title="Right to rectification">
          <p>You have the right to have inaccurate personal data about you corrected without undue delay upon request.</p>
        </SubSection>

        <SubSection title="Right to restriction of processing">
          <p>You may request that the Company restrict processing, in particular where:</p>
          <Ul>
            <li>you contest the accuracy of the data,</li>
            <li>you consider the processing unlawful but for some reason do not request erasure,</li>
            <li>we no longer need the personal data for the stated purpose but you require them for the establishment, exercise or defence of legal claims,</li>
            <li>you have objected to the processing, but our legitimate interests may also justify the processing.</li>
          </Ul>
        </SubSection>

        <SubSection title="Right to erasure">
          <p>
            You have the right to have the controller erase your personal data upon request. Based
            on such a request the Company is obliged to erase personal data if any of the
            following grounds applies:
          </p>
          <Ul>
            <li>the personal data are no longer necessary for the purpose for which they were collected,</li>
            <li>the data subject withdraws the consent on which the processing was based and there is no other legal ground for processing,</li>
            <li>the data subject objects to the processing and there are no overriding legitimate grounds,</li>
            <li>the personal data have been processed unlawfully,</li>
            <li>erasure is required for compliance with a legal obligation in EU or Member State law.</li>
          </Ul>
        </SubSection>

        <SubSection title="Right to object">
          <p>
            You have the right to object, on grounds relating to your particular situation, at any
            time to processing of your personal data based on legitimate interests. In such a case
            the Controller may no longer process the personal data unless it demonstrates
            compelling legitimate grounds which override your interests, rights and freedoms, or
            for the establishment, exercise or defence of legal claims.
          </p>
          <p>
            Where personal data are processed for direct marketing purposes, you have the right to
            object at any time to the processing of personal data concerning you for such
            marketing, including profiling to the extent that it is related to such direct
            marketing. If you object, the personal data may no longer be processed for such
            purposes.
          </p>
        </SubSection>

        <SubSection title="Right to data portability">
          <p>
            You have the right to receive the personal data concerning you, which you have
            provided to us, in a structured, commonly used and machine-readable format. You also
            have the right to transmit those data to another controller.
          </p>
        </SubSection>
      </Section>

      <Section title="Automated decision-making">
        <p>
          You have the right not to be subject to a decision based solely on automated processing
          (including profiling) which produces legal effects concerning you or similarly
          significantly affects you. In such cases, our Company is obliged to take appropriate
          measures to safeguard your rights, freedoms and legitimate interests, including at least
          the right to obtain human intervention on the part of the controller, to express your
          point of view and to contest the decision.
        </p>
        <p>The above do not apply where the decision:</p>
        <Ul>
          <li>is necessary for entering into or performing a contract between you and the Company,</li>
          <li>is authorised by EU or Member State law applicable to the Controller and which also lays down suitable measures,</li>
          <li>is based on your explicit consent.</li>
        </Ul>
      </Section>

      <Section title="Applicable legislation">
        <Ul>
          <li>Act CXII of 2011 on the right to informational self-determination and freedom of information (Info Act)</li>
          <li>Regulation (EU) 2016/679 of the European Parliament and of the Council of 27 April 2016 (GDPR)</li>
          <li>Act V of 2013 on the Civil Code (Ptk.)</li>
          <li>Act C of 2000 on Accounting</li>
        </Ul>
      </Section>

      <Section title="Remedies">
        <p>
          If you believe that our Company has violated a statutory provision on data processing or
          has failed to fulfil any of your requests, you have the following remedies available to
          put an end to the alleged unlawful processing:
        </p>
        <SubSection title="Recourse to court">
          <p className="text-muted-foreground">
            You may file a civil lawsuit against our Company before a court; the court handles the
            case on a priority basis.
          </p>
        </SubSection>
        <SubSection title="Data protection authority procedure">
          <p>You may file a complaint with the Hungarian National Authority for Data Protection and Freedom of Information:</p>
          <dl className="grid sm:grid-cols-[140px_1fr] gap-x-6 gap-y-1 text-sm mt-2 text-muted-foreground">
            <dt>Name</dt><dd>Nemzeti Adatvédelmi és Információszabadság Hatóság</dd>
            <dt className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> Seat</dt>
            <dd>1125 Budapest, Szilágyi Erzsébet fasor 22/C., Hungary</dd>
            <dt>Mailing address</dt><dd>1530 Budapest, Pf.: 5., Hungary</dd>
            <dt className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> Phone</dt>
            <dd>+36 1 391 1400</dd>
            <dt>Fax</dt><dd>+36 1 391 1410</dd>
            <dt className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> Email</dt>
            <dd><Tel href="mailto:ugyfelszolgalat@naih.hu">ugyfelszolgalat@naih.hu</Tel></dd>
            <dt>Website</dt><dd><Tel href="http://www.naih.hu" external>www.naih.hu</Tel></dd>
          </dl>
        </SubSection>
      </Section>

      <Section title="Other provisions">
        <p>
          For data processing not listed in this Privacy Notice, information will be provided at
          the time of data collection. In such cases the provisions of applicable legislation
          shall be considered authoritative.
        </p>
        <p>
          Please note that courts, prosecutors, investigating authorities, minor offence
          authorities, administrative authorities, the Hungarian National Authority for Data
          Protection and Freedom of Information, the Hungarian National Bank and other bodies
          authorised by law may contact our Company to request information, disclose or transfer
          data, or make documents available. To the extent that such authorities indicate the
          exact purpose and scope of the data requested, our Company discloses only as much
          personal data as is strictly necessary to fulfil the purpose of the request.
        </p>
      </Section>
    </>
  )
}

// ————————————————————————————— helpers —————————————————————————————

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="font-serif text-2xl font-bold text-foreground border-b border-border/60 pb-2">
        {title}
      </h2>
      {children}
    </section>
  )
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="pt-2 space-y-2">
      <h3 className="font-semibold text-foreground">{title}</h3>
      {children}
    </div>
  )
}

function Ul({ children }: { children: React.ReactNode }) {
  return <ul className="list-disc pl-6 space-y-1 text-muted-foreground">{children}</ul>
}

function Term({ children }: { children: React.ReactNode }) {
  return <dt className="text-muted-foreground">{children}</dt>
}

function Def({ children }: { children: React.ReactNode }) {
  return <dd>{children}</dd>
}

function Definition({ term, def }: { term: string; def: string }) {
  return (
    <div>
      <dt className="font-semibold">{term}</dt>
      <dd className="text-muted-foreground">{def}</dd>
    </div>
  )
}

function Tel({ href, children, external }: { href: string; children: React.ReactNode; external?: boolean }) {
  const isExternal = external || href.startsWith("http")
  return (
    <a
      href={href}
      className="text-[#d4a017] hover:underline"
      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </a>
  )
}

function PrivacyIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#d4a017]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
    </svg>
  )
}
