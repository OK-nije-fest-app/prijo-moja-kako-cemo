# KOORDINATOR — Funkcionalna specifikacija aplikacije

*Sistem za upravljanje ljudima, logistikom i terenom u izbornoj kampanji*

**Verzija 3 • Jul 2026**
**Online verzija:** https://tanjamik.github.io/prijo-moja-kako-cemo/

---

## Sadržaj

1. [O aplikaciji](#1-o-aplikaciji)
2. [Režimi pristupa i privilegije](#2-režimi-pristupa-i-privilegije)
3. [Podaci koje aplikacija vodi](#3-podaci-koje-aplikacija-vodi)
4. [Struktura aplikacije i navigacija](#4-struktura-aplikacije-i-navigacija)
5. [Kartica „Spisak ljudi" (Baza)](#5-kartica-spisak-ljudi-baza)
6. [Kontrolna tabla (Dashboard)](#6-kontrolna-tabla-dashboard)
7. [Kalendar i Taskovi](#7-kalendar-i-taskovi)
8. [Nove prijave (onlajn regrutacija)](#8-nove-prijave-onlajn-regrutacija)
9. [Biračka mesta (BM)](#9-biračka-mesta-bm)
10. [Mobilni timovi (MT)](#10-mobilni-timovi-mt)
11. [Raspoređivanje na dužnosti](#11-raspoređivanje-na-dužnosti)
12. [Obuke](#12-obuke)
13. [Komunikacija (istorija kontakata)](#13-komunikacija-istorija-kontakata)
14. [Finansije i donacije](#14-finansije-i-donacije)
15. [Teren (eCanvasser)](#15-teren-ecanvasser)
16. [Poslovna pravila i automatika](#16-poslovna-pravila-i-automatika)
17. [Čuvanje podataka](#17-čuvanje-podataka)
18. [Početni (demo) podaci](#18-početni-demo-podaci)

---

## 1. O aplikaciji

Koordinator je interaktivna veb aplikacija za koordinaciju volontera, kontrolora i logistike tokom izborne kampanje na nivou opštine. Aplikacija pokriva ceo proces: od prijave novih volontera, preko kontaktiranja, obuka i raspoređivanja na biračka mesta i u mobilne timove, do praćenja terena, finansija i komunikacije.

### 1.1. Tehničke karakteristike

- **Jedan HTML fajl:** cela aplikacija (kod, dizajn, ikonice) je upakovana u jedan samostalan fajl — `koordinator.html`. Radi bez servera i bez interneta.
- **Onlajn verzija:** aplikacija je objavljena na GitHub Pages adresi [tanjamik.github.io/prijo-moja-kako-cemo](https://tanjamik.github.io/prijo-moja-kako-cemo/) i dostupna je sa bilo kog uređaja (računar, telefon, tablet).
- **Tehnologija:** React 19 + TypeScript + Tailwind CSS, biblioteka XLSX za rad sa Excel fajlovima, Lucide ikonice. Tamna (dark) tema.
- **Čuvanje podataka:** svi podaci se čuvaju lokalno u pregledaču korisnika (localStorage). Nema centralne baze — svaki uređaj ima svoje podatke. Razmena podataka se radi preko Excel izvoza/uvoza.
- **Responsivan dizajn:** prilagođava se ekranu — na telefonu se bočni meni skriva iza „hamburger" dugmeta, tabele se skroluju horizontalno.

### 1.2. Prijava (zaključavanje šifrom)

Pre ulaska u aplikaciju prikazuje se ekran za prijavu sa poljem za šifru. Šifra se u kodu ne čuva kao čist tekst nego kao heš vrednost, tako da se ne može pročitati iz izvornog koda. Kada se jednom unese tačna šifra, pregledač je pamti (localStorage) i sledeći put ulazi direktno. Pogrešna šifra prikazuje poruku „Pogrešna šifra, probaj ponovo."

> **Napomena:** ovo je zaštita od slučajnih posetilaca, ne puna bezbednosna zaštita, jer je aplikacija čisto klijentska.

## 2. Režimi pristupa i privilegije

Aplikacija ima dva režima rada koji se biraju u bočnom meniju („Režim pristupa"):

| Režim | Oznaka | Prava |
|---|---|---|
| **Regionalni koordinator** | Plava značka „KOORDINATOR" | Pun pristup: dodavanje, izmena i brisanje osoba; raspoređivanje; upravljanje biračkim mestima, timovima, obukama, finansijama; uvoz/izvoz Excel-a; prilagođena polja; odobravanje prijava; reset baze; izbor opštine. |
| **Član opštinskog tima** | Žuta značka „ČLAN" | Samo čitanje: vidi sve kartice i podatke, ali su sva dugmad za izmenu, brisanje, dodavanje i uvoz sakrivena/onemogućena. |

### 2.1. Više opština

Koordinator može da bira opštinu sa kojom radi. Svaka opština ima sopstvenu, potpuno odvojenu bazu podataka (ljudi, biračka mesta, timovi, finansije...). Podržane opštine i njihovi rejoni:

| Opština | Rejoni |
|---|---|
| Vračar | Crveni krst, Neimar, Kalenić, Čubura, Vračarski plato |
| Stari grad | Dorćol, Terazije, Kosančićev venac, Skadarlija, Kopitareva gradina |
| Savski venac | Senjak, Dedinje, Topčider, Zeleni venac, Savamala |
| Novi Beograd | Fontana, Bežanijska kosa, Ušće, Ledine, Paviljoni |
| Zvezdara | Mirijevo, Lion, Bulbulder, Mali mokri lug, Konjarnik |
| Palilula | Borča, Karaburma, Kotež, Višnjica, Profesorska kolonija |
| Voždovac | Autokomanda, Dušanovac, Banjica, Braće Jerković, Kumodraž |

## 3. Podaci koje aplikacija vodi

### 3.1. Osoba (glavni zapis u bazi)

Svaka osoba u bazi ima sledeća polja:

| Polje | Opis |
|---|---|
| Ime i prezime | Obavezno polje. |
| Uloga | Jedna ili više uloga: šef BM, kontrolor, VDV volonter, šef MT, član MT, CC operater. Može i „bez uloge" (samo kontakt). |
| Status | potvrđen / kontaktiran / potencijalni / odustao. |
| Faza | Kontaktiran → Potvrdio učešće → Prošao osnovnu obuku → Prošao naprednu obuku → Raspoređen → Potvrđen (ili „—" / Odustao). |
| Rejon | Deo opštine kojem osoba pripada. |
| Biračko mesto (BM) | Broj biračkog mesta gde osoba glasa / gde je raspoređena. |
| Telefon, Email, Telegram | Kontakt podaci. |
| Automobil | Da/Ne — da li poseduje vozilo. |
| Iskustvo | Da/Ne — da li je već radila na izborima. |
| Osnovna / Napredna obuka | Da/Ne — završene obuke. |
| Raspoređen/a | Da/Ne — da li je dodeljena na dužnost. |
| Preporuka | Da/Ne — da li je došla preko preporuke. |
| Poreklo | Kako je regrutovana: Prijava preko forme / Akcija / Štand / Preporuka / Drugo. |
| Od poverenja | Da/Ne — posebna oznaka poverenja (★). |
| Napomene | Slobodan tekst — interne beleške. |
| Prilagođena polja | Neograničen broj dodatnih kolona koje korisnik sam definiše (videti 5.6). |

### 3.2. Ostali entiteti

| Entitet | Šta sadrži |
|---|---|
| Prijava na čekanju | Ime, prezime, telefon, email, Telegram, rejon, BM gde glasa, željena uloga, auto, iskustvo, napomene. Čeka odobrenje ili odbijanje. |
| Biračko mesto (BM) | Broj, naziv lokacije, adresa, rejon, oznaka „deljeno BM", lista šefova BM i lista kontrolora. |
| Mobilni tim (MT) | Oznaka tima, rejon, lista biračkih mesta koja pokriva, broj vozila, šefovi tima, članovi. |
| Obuka | Naziv (za kontrolore / za VDV / za call centar), tip (uživo ili onlajn), datum, lista učesnika sa statusom prisustva i komentarom. |
| Kontakt (razgovor) | Osoba, datum, ko je zvao, rezultat/beleška razgovora. |
| Finansijska stavka | Datum, tip (donacija ili rashod), opis, iznos u dinarima. |
| Događaj u kalendaru | Datum, opis, kategorija, ko je dodao. |
| Zadatak (task) | Tekst, prioritet (visok/srednji/nizak), status urađeno/neurađeno, datum dodavanja. |
| Prilagođeno polje | Naziv, tip (tekst / broj / kvačica Da-Ne / izbor opcija) i lista opcija za tip „izbor". |

## 4. Struktura aplikacije i navigacija

Aplikacija se sastoji od bočnog menija (levo) i glavne radne površine. Bočni meni sadrži logo, izbor režima pristupa, izbor opštine (samo za koordinatora), navigaciju kroz kartice grupisanu u četiri sekcije i dugme „Digitalni vodič". Gornja traka prikazuje naslov aktivne kartice i značku trenutnog režima.

| Sekcija | Kartice |
|---|---|
| Pregled i analitika | Kontrolna tabla • Kalendar i Taskovi |
| Regrutacija i ljudi | Spisak ljudi (Baza) • Nove prijave (sa brojačem) • Biračka mesta (BM) • Mobilni timovi (MT) |
| Operacije i rad | Raspoređivanje • Obuke • Komunikacija |
| Logistika i teren | Finansije i Donacije • Teren (eCanvasser) |

### 4.1. Digitalni vodič (onboarding)

Pri prvom otvaranju aplikacija automatski pokreće interaktivni vodič od 13 koraka koji objašnjava svaku sekciju sistema: dobrodošlicu, režime pristupa, kontrolnu tablu, kalendar, bazu ljudi, nove prijave, biračka mesta, mobilne timove, raspoređivanje, obuke, komunikaciju, finansije i teren. Tokom vodiča aktivni element je istaknut plavim okvirom, a ostatak ekrana je zamućen. Vodič se može preskočiti („Isključi vodič") i ponovo pokrenuti iz bočnog menija u svakom trenutku.

## 5. Kartica „Spisak ljudi" (Baza)

Centralna kartica aplikacije — tabela svih ljudi sa alatima za pretragu, filtriranje i masovne operacije.

### 5.1. Pretraga i sortiranje

- Pretraga u realnom vremenu po imenu, telefonu, email-u, biračkom mestu i ulozi (ne razlikuje velika/mala slova).
- Sortiranje klikom na zaglavlje bilo koje kolone (rastuće → opadajuće → bez sortiranja), sa strelicom kao indikatorom.

### 5.2. Napredni filteri

Panel „Napredni filteri" omogućava kombinovano filtriranje po: ulozi, statusu, fazi, posedovanju automobila, iskustvu na izborima, osnovnoj obuci, naprednoj obuci, poreklu i oznaci „od poverenja". Dugme „Resetuj filtere" vraća sve na početno stanje.

### 5.3. Prikaz kolona

Korisnik bira koje kolone su vidljive u tabeli (uključujući prilagođena polja). Izbor se pamti između sesija.

### 5.4. Dodavanje i izmena osobe (prozor sa detaljima)

Klik na osobu otvara prozor sa dva režima:

- **Pregled:** lični podaci, organizacija (uloge, status, auto, iskustvo), vizuelni prikaz faze kroz 6 koraka (završeni koraci zeleno, trenutni plavo), statusi sve tri obuke, kompletna istorija kontakata i napomene.
- **Izmena:** sva polja osobe uključujući prilagođena polja, sa čekiranjem više uloga odjednom. Obavezno je samo ime i prezime. Odavde se osoba može i obrisati (uz potvrdu).

### 5.5. Izbor više stavki i masovno brisanje

Režim „Izaberi više" prikazuje kolonu sa kvačicama i opciju „izaberi sve", pa se više osoba može obrisati odjednom (uz potvrdu sa brojem izabranih).

### 5.6. Prilagođena polja (custom kolone)

Korisnik može da definiše sopstvene kolone (npr. „Veličina majice", „Dodatni kontakt"). Tipovi: tekst, broj, kvačica (Da/Ne) i izbor opcija (padajući meni sa vrednostima odvojenim zarezom). Polja se pojavljuju u tabeli, u prozoru za izmenu osobe i u Excel izvozu/uvozu. Mogu se i obrisati (uz potvrdu).

### 5.7. Excel uvoz i izvoz

- **Izvoz:** dugme „Izvezi u Excel" pravi .xlsx fajl sa svim osobama i svim kolonama (uključujući prilagođene); Da/Ne polja se ispisuju kao „Da"/„Ne". Ime fajla: `struktura_ljudi_izvoz_[datum].xlsx`.
- **Uvoz:** dugme „Uvezi Excel" prvo prikazuje uputstvo sa obaveznim kolonama (Ime i prezime, Telefon, Email), zatim prozor za pregled: broj uspešno očitanih redova, lista grešaka (preskočeni redovi sa razlogom), pregled prvih 5 redova i izbor režima — „Dodaj u postojeću bazu" ili „Zameni kompletnu bazu" (briše sve postojeće).
- Redovi bez obaveznih polja se preskaču uz jasnu poruku o kom redu se radi. Uvezene osobe dobijaju status „kontaktiran", fazu „Kontaktiran" i napomenu „Uvezeno iz Excela".

### 5.8. Statistika u podnožju

Ispod tabele stoji traka: „Prikazano X od Y ljudi" plus brojači — koliko osoba ima automobil, iskustvo, i koliko je prošlo svaku od tri obuke.

## 6. Kontrolna tabla (Dashboard)

Analitički pregled stanja u realnom vremenu, izračunat iz podataka:

- **Metrike (kartice):** ukupno ljudi u bazi, broj biračkih mesta, šefovi BM (ukupno / raspoređeno), kontrolori (ukupno / raspoređeno), mobilni timovi, obučeni volonteri, obučeni kontrolori (kompletno + onlajn), plus dinamičke kartice za svaku dodatnu ulogu (član MT, šef MT, VDV, CC operater...).
- **Levak regrutacije:** 4 koraka sa brojevima i trakama napretka — 1. Nove prijave (onlajn forme), 2. Kontaktirani kandidati, 3. Potvrđeni kontrolori, 4. Aktivno raspoređeni na BM/MT. Svaki korak ima opis šta znači.
- **Pokrivenost biračkih mesta:** tri kružna indikatora — procenat raspoređenih šefova BM, procenat popunjenih kontrolorskih mesta (norma: 2 kontrolora po BM) i procenat popunjenih mobilnih timova — plus ukupna traka pokrivenosti resursa (potrebno: 3 osobe po BM — 1 šef + 2 kontrolora).

## 7. Kalendar i Taskovi

### 7.1. Kalendar akcija

- Mesečni interaktivni kalendar sa navigacijom napred/nazad i oznakom današnjeg dana.
- 7 kategorija događaja sa bojama: VDV akcija, Sastanak, Štand/Promo, Prikupljanje potpisa, Obuka kontrolora, Obuka VDV volontera, Drugo.
- Na svakom danu se vide do 2 događaja + oznaka „+N još"; klik na dan otvara prozor sa svim aktivnostima tog dana.
- U prozoru dana: dodavanje nove akcije (opis + kategorija), izmena i brisanje postojećih.

### 7.2. Zadaci (taskovi)

- Lista zadataka u „Notion stilu" sa prioritetima (visok — crveno, srednji — žuto, nizak — plavo).
- Traka napretka: koliko je zadataka urađeno od ukupnog broja (u procentima).
- Dodavanje zadatka (tekst + prioritet), štrikliranje kao urađeno, brisanje uz potvrdu.
- Kalendar i zadaci se trajno čuvaju u pregledaču.

## 8. Nove prijave (onlajn regrutacija)

- Panel sa javnim linkom prijavne forme i dugmetom „Kopiraj" — za deljenje na društvenim mrežama i u Viber/Telegram grupama.
- Tabela prijava na čekanju: ime i rejon, željena uloga, BM gde glasa, kontakt podaci (telefon, email, Telegram), oznake „Auto" i „Iskustan", napomene.
- **Odobri:** prijava se pretvara u osobu u glavnoj bazi (status „potvrđen", faza „Potvrđen"). Sistem pre toga proverava duplikate po telefonu/email-u i pita za potvrdu ako osoba već postoji.
- **Odbij:** prijava se uklanja.
- Dugme „Generiši novu prijavu" pravi test-prijavu sa nasumičnim podacima (za demonstraciju).
- Broj prijava na čekanju se prikazuje kao značka na kartici u bočnom meniju.

## 9. Biračka mesta (BM)

- Mrežni prikaz kartica — po jedna za svako biračko mesto, sa pretragom po broju i nazivu.
- Na kartici: broj BM, naziv i adresa, oznaka „Deljeno biračko mesto", raspoređeni šef(ovi) i kontrolori (norma 2 po BM).
- **Statusna signalizacija:** „Nema šefa" (crveno), „Fali kontrolor (N/2)" (žuto), „Popunjeno" (zeleno).
- Dodavanje novog BM: broj (mora biti jedinstven), naziv lokacije, adresa, oznaka deljenog mesta.
- Brisanje BM uz potvrdu — osobama koje su bile na njemu se skida raspored.

## 10. Mobilni timovi (MT)

- Kartice timova: oznaka tima, biračka mesta koja pokriva, broj dostupnih vozila, šef tima (upozorenje ako nije raspoređen) i članovi.
- Kreiranje tima: pretraga ljudi iz baze i dodavanje kao „Šef MT" ili „Član MT", unos broja vozila (0–10), izbor više biračkih mesta koja tim pokriva (obavezno bar jedno).
- Brisanje tima uz potvrdu.

## 11. Raspoređivanje na dužnosti

Panel za dodelu konkretnih zadataka ljudima iz baze:

- **Izbor osobe:** pretraživi padajući meni, grupisan na „Slobodne volontere" i „Već raspoređene" (oznaka [R]).
- **Tip angažmana:** 4 opcije — Kontrola izbora, VDV, Call centar, Logistika.
- Za „Kontrolu izbora" se dodatno bira biračko mesto i uloga na terenu (Kontrolor / Mobilni tim / Šef biračkog mesta); za VDV se beleži da li je osoba student.
- Tabela „Pregled svih raspoređenih" sa pretragom: ime, zvanična uloga, dodeljeni zadatak, lokacija/tim, i dugme „Ukloni" (uz potvrdu).
- Raspoređivanjem se osobi automatski postavlja oznaka „raspoređen", faza „Raspoređen" i biračko mesto.

## 12. Obuke

Dva pogleda (pod-kartice):

### 12.1. Tabela polaznika i obuka

- Tabela svih ljudi sa po jednom kolonom za svaku od tri obuke: za kontrolore, za VDV, za call centar.
- Status se menja direktno u tabeli: — Nije upisan / 🟡 Pozvan / 🟢 Prisustvovao / 🔴 Nije bio; ispod statusa se vidi datum i tip obuke.
- Pretraga polaznika po imenu, ulozi ili rejonu.

### 12.2. Organizacija i evidencija obuka

- Lista svih zakazanih obuka: naziv, tip (uživo/onlajn), datum, broj pozvanih i broj prisutnih; brisanje uz potvrdu.
- Detalj obuke: prozivnik sa imenom, telefonom, statusom prisustva (tri dugmeta) i poljem za komentar za svakog učesnika.
- Zakazivanje nove obuke: tema (jedna od tri), datum, tip predavanja, i pozivanje učesnika pretragom baze (sa brojačem izabranih).
- **Automatika:** kada se učesniku evidentira „prisustvovao", osobi se automatski ažurira oznaka obuke i faza („Prošao osnovnu/naprednu obuku").

## 13. Komunikacija (istorija kontakata)

- Tabela svih zabeleženih razgovora: datum, sagovornik (volonter), ko je zabeležio, rezultat/napomena i zvanični status osobe (obojena značka).
- Pretraga po imenu volontera, operateru i sadržaju beleške.
- Beleženje novog kontakta: izbor volontera iz baze, datum, ko je zvao, beleška razgovora, i opcionalno trenutna promena zvaničnog statusa osobe (Potvrđen / Kontaktiran / Potencijalni / Odustao).

## 14. Finansije i donacije

- Kartica prikazuje centralni finansijski portal (ugrađen u aplikaciju) sa oznakom „Sinhronizovano" i dugmetom „Otvori u novom tabu" ako pregledač blokira ugrađeni prikaz.
- Vode se stavke tipa donacija i rashod (datum, opis, iznos) sa automatskim obračunom ukupnih donacija, rashoda i salda.

## 15. Teren (eCanvasser)

- Praćenje „od vrata do vrata" kampanje po biračkim mestima: broj pokucanih vrata, podrška, protiv, neodlučni.
- **Metrike:** ukupno pokucanih vrata sa ciljem od 2.500 i trakom ispunjenja, procenat podrške u razgovorima, broj neodlučnih birača (ciljna grupa za sledeći krug).
- Tabela po biračkom mestu sa grafičkim prikazom odnosa podrška/protiv/neodlučni (segmentirana traka sa procentima).
- Dugme „Simuliraj rad na terenu" dodaje realistične nasumične rezultate (za demonstraciju), a Reset vraća podatke na početne (uz potvrdu). Podaci se čuvaju po opštini.

## 16. Poslovna pravila i automatika

- **Tok regrutacije:** prijava → odobrenje (status „potvrđen") → kontakt/obuka (faza se pomera) → raspoređivanje (faza „Raspoređen"). Faza osobe se automatski izvodi iz akcija — ne mora ručno da se pomera.
- **Provera duplikata:** pri odobravanju prijave sistem upozorava ako osoba sa istim telefonom ili email-om već postoji u bazi.
- **Čišćenje referenci:** brisanjem osobe ona se automatski uklanja sa svih biračkih mesta, iz mobilnih timova, sa obuka i iz istorije kontakata; brisanjem BM svim osobama sa tog mesta se skida raspored.
- **Potvrde:** svaka destruktivna akcija (brisanje, zamena baze, reset) traži izričitu potvrdu.
- **Reset baze:** koordinator može resetovati kompletnu bazu opštine ili samo pojedine delove (ljude, rasporede, finansije).
- **Notifikacije:** svaka uspešna akcija prikazuje kratku poruku (toast) u donjem desnom uglu koja nestaje posle 3 sekunde.

## 17. Čuvanje podataka

Svi podaci se čuvaju u localStorage pregledača, odvojeno po opštini. To znači:

- Podaci ostaju sačuvani između otvaranja aplikacije na istom uređaju i u istom pregledaču.
- Podaci se **ne** dele automatski između uređaja ili korisnika — svako vidi svoju lokalnu bazu.
- Brisanje istorije/podataka pregledača briše i podatke aplikacije — preporučuje se redovan Excel izvoz kao rezervna kopija.
- Za razmenu podataka između članova tima koristi se Excel izvoz i uvoz.

## 18. Početni (demo) podaci

Aplikacija dolazi sa demonstracionim podacima za opštinu Vračar, kako bi se odmah videlo kako sistem izgleda u upotrebi:

- 10 osoba sa različitim ulogama, statusima i fazama (šefovi BM, kontrolori, VDV volonteri, članovi MT, CC operater...).
- 2 prijave na čekanju.
- 6 biračkih mesta sa nazivima i adresama (delimično popunjena, da se vidi signalizacija stanja tima).
- 3 mobilna tima sa različitim stepenom popunjenosti.
- 3 obuke (za kontrolore — uživo, za VDV — onlajn, za call centar — onlajn) sa evidencijom prisustva.
- 4 zabeležena kontakta/razgovora.
- 5 finansijskih stavki (2 donacije, 3 rashoda).
- Podaci terena po biračkim mestima i primeri događaja u kalendaru i zadataka.

Svi demo podaci se mogu obrisati (reset baze) ili zameniti pravim podacima kroz Excel uvoz.
