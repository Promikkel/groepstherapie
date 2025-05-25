# Groepstherapie Website - Deployment Instructies

## Inhoud van dit zip-bestand
- `index.html`: De hoofdpagina van de website
- `styles.css`: Alle styling voor de website
- `script.js`: JavaScript voor interactiviteit (likes, aanmeldingen, etc.)

## Deployment via GitHub en Render.com

### Stap 1: Upload naar GitHub
1. Maak een nieuw GitHub repository aan
2. Upload alle bestanden uit dit zip-bestand naar je repository
3. Commit de wijzigingen

### Stap 2: Deploy via Render.com
1. Maak een account aan op [Render.com](https://render.com/) als je die nog niet hebt
2. Klik op "New" en kies "Static Site"
3. Connect je GitHub repository
4. Configuratie:
   - Name: Kies een naam voor je site (bijv. "groepstherapie-pinksteren")
   - Build Command: Laat leeg (niet nodig voor deze statische site)
   - Publish Directory: Laat op `.` staan (root directory)
5. Klik op "Create Static Site"

Je website zal nu automatisch worden gedeployed en beschikbaar zijn op een Render.com URL. Elke keer dat je wijzigingen pusht naar je GitHub repository, zal Render.com automatisch je site updaten.

## Lokale ontwikkeling
Als je lokaal wijzigingen wilt maken en testen:
1. Open een terminal in de directory met deze bestanden
2. Start een lokale server met: `python -m http.server 8000` (of een andere server naar keuze)
3. Open je browser en ga naar `http://localhost:8000`

## Functionaliteiten
- **Like-knoppen**: Bezoekers kunnen activiteiten liken (data wordt opgeslagen in localStorage)
- **Aanmeldingen**: Bezoekers kunnen zich aanmelden voor activiteiten (data wordt opgeslagen in localStorage)
- **Responsive design**: De website werkt goed op zowel desktop als mobiele apparaten
- **Festivalstijl**: Kleurrijke, levendige layout met jaren '80 accenten

## Contact
Voor vragen of hulp bij het deployen, neem contact op.
