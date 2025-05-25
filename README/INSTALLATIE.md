# Groepstherapie Festival Website - Installatie Instructies

## Overzicht
Deze website is gemaakt voor het Groepstherapie Festival (Pinksteren 2025) en bevat een interactief programma met de mogelijkheid voor deelnemers om zich in te schrijven voor activiteiten en likes te geven.

## Technische Details
- Frontend: HTML, CSS, JavaScript
- Backend: Firebase Realtime Database
- Stijl: Retro-modern festival design met pastel neon kleuren

## Installatie via GitHub/Render

### GitHub Installatie
1. Maak een nieuwe repository aan op GitHub
2. Upload alle bestanden uit deze zip naar je repository
3. Ga naar repository settings > Pages
4. Selecteer de main branch als source en klik op Save
5. Je website is nu beschikbaar op `https://[jouw-gebruikersnaam].github.io/[repository-naam]/`

### Render Installatie
1. Maak een account aan op [Render](https://render.com/) als je die nog niet hebt
2. Klik op "New" en selecteer "Static Site"
3. Connect je GitHub repository of upload de bestanden direct
4. Geef je site een naam
5. Stel de build command in als leeg (niet nodig voor deze statische site)
6. Stel de publish directory in als "." (root directory)
7. Klik op "Create Static Site"
8. Je website is nu beschikbaar op de door Render gegenereerde URL

## Firebase Setup
De website gebruikt Firebase voor het opslaan van deelnemers en likes. Je moet je eigen Firebase project configureren:

1. Ga naar [Firebase Console](https://console.firebase.google.com/)
2. Maak een nieuw project aan
3. Voeg een web-app toe aan je project
4. Kopieer de Firebase configuratie (apiKey, authDomain, etc.)
5. Vervang de configuratie in `js/firebase-config.js` met jouw eigen configuratie
6. Ga naar Database in de Firebase Console en maak een Realtime Database aan
7. Stel de security rules in op:
```
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```
(Let op: Deze regels zijn alleen geschikt voor ontwikkeling. Voor productie moet je strengere regels instellen.)

## Aanpassingen
Je kunt de volgende bestanden aanpassen om de website te personaliseren:
- `index.html`: Programma en activiteiten
- `css/styles.css`: Kleuren en stijlen
- `js/script.js`: Interactieve functionaliteit

## Contact
Voor vragen of ondersteuning, neem contact op met de ontwikkelaar.

Veel plezier met je festival website!
