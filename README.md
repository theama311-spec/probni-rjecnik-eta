# Probni rječnik 02

Radna statična web-aplikacija za pregled sređenih natuknica iz dostavljenog dokumenta `Senc ETA courier.docx`.

## Postavljanje na GitHub
1. Raspakirajte ZIP.
2. U repozitoriju odaberite **Add file → Upload files**.
3. Učitajte sadržaj ove mape (ne ZIP datoteku).
4. Kliknite **Commit changes**.
5. Otvorite **Settings → Pages**.
6. Pod **Build and deployment** odaberite **Deploy from a branch**, branch `main`, folder `/(root)`, pa **Save**.

## Sadržaj
- `index.html`, `style.css`, `app.js`: aplikacija
- `data/entries.json`: natuknice izdvojene iz odlomaka DOCX-a
- `data/source.txt`: tekst odlomaka iz izvornog dokumenta

## Napomena
Svaki neprazan odlomak dokumenta tretira se kao zapis; naslovi slova grčkog alfabeta prikazuju se kao razdjelnici. Naslov zapisa automatski je uzet iz početnog dijela odlomka, pa ga treba pregledati i po potrebi urediti. Izmjene u aplikaciji ostaju u lokalnom pregledniku; koristite **Izvoz JSON** za sigurnosnu kopiju. Aplikacija je statična i ne zapisuje izmjene natrag u GitHub.
