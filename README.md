# 🎵 Music Events Discovery

Una moderna applicazione web per scoprire e gestire eventi musicali, costruita interamente con **vibe coding** - un approccio di sviluppo guidato dall'intuizione e dall'iterazione rapida.

![App Screenshot](docs/screenshot%20app.png)

## 🎯 Cos'è Vibe Coding?

Il **vibe coding** è un approccio di sviluppo che privilegia l'intuizione, l'iterazione rapida e la sperimentazione creativa rispetto alla pianificazione rigida. In questo progetto, ho seguito il flusso creativo, partendo da un'idea e sviluppandola step-by-step attraverso feedback immediato e miglioramenti continui.

## 🚀 La Storia del Progetto

### 1. 🎨 Inizio con il Design (Figma + UI Designer)

Il viaggio è iniziato con la creazione di un design in **Figma** per definire la struttura e l'estetica dell'applicazione.

**Figma Design:** [Visualizza il design originale](https://www.figma.com/design/o30zAO58vSMHHRorlaWAdO/Music-Events-Discovery?node-id=0-1&t=UDpzCvbXn3FB4lEY-1)

Ho poi utilizzato **UI Designer** per generare un'immagine di riferimento e un prompt descrittivo dettagliato:

```
Platform: Mobile and Web
Layout:
- Header bar con titolo "Music Events Discovery", barra di ricerca e filtro categorie
- Griglia di eventi con: immagine, titolo, descrizione, disponibilità biglietti, location e data
- Color Scheme: Grigio scuro, nero e viola
- Style: Ricco e moderno, attraente per un pubblico giovane
```

![Reference UI](docs/reference_ui_image_by_UI-Designer.png)

### 2. 🔥 Sviluppo Iterativo con Bolt

Ho incollato tutto il materiale su **Bolt** e iniziato le iterazioni per creare:
- **Homepage** con griglia di eventi
- **Pagina dettaglio** per ogni evento
- **Sistema di filtri** per categorie musicali
- **Ricerca** in tempo reale

Ogni iterazione è stata guidata dal "vibe" - aggiungendo funzionalità che sentivo fossero necessarie in quel momento, senza una pianificazione rigida.

### 3. 🗄️ Integrazione Database con Supabase

Dopo aver creato l'account Supabase, ho integrato il database:

- **Creazione tabelle** tramite l'integrazione di Bolt
- **Aggiunta iterativa** delle funzionalità CRUD
- **Miglioramenti step-by-step** basati sul feedback immediato

### 4. 👥 Sistema di Autenticazione

Ho aggiunto progressivamente:
- **UI per sign in e registrazione**
- **Integrazione completa** con Supabase Auth
- **Gestione stati utente** e permessi

## 🛠️ Stack Tecnologico

- **Frontend:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **Autenticazione:** Supabase Auth
- **Storage:** Supabase Storage (per immagini eventi)
- **Icons:** Lucide React
- **Deployment:** Vite build system

## 🎨 Caratteristiche Principali

### 🏠 Homepage
- **Griglia responsive** di eventi musicali
- **Filtri per categoria** (Rock, Jazz, Indie, Pop, Electronic, Country)
- **Ricerca in tempo reale** per titolo e venue
- **Design moderno** con tema scuro e accenti viola

### 📱 Eventi
- **Visualizzazione dettagliata** con immagini, descrizioni, date
- **Sistema di biglietti** con stati (Disponibili, Esauriti, Limitati)
- **Informazioni complete:** venue, prezzo, capacità, organizzatore
- **Rating** e sistema di valutazione

### 👤 Autenticazione
- **Registrazione** con username, email e password
- **Login** sicuro con gestione errori
- **Protezione** delle funzionalità di creazione/modifica eventi
- **Gestione sessioni** utente

### ✨ Funzionalità Avanzate
- **Creazione eventi** con upload immagini
- **Modifica/eliminazione** eventi (solo per i proprietari)
- **Filtro "I miei eventi"** per utenti autenticati
- **Upload immagini** con preview
- **Responsive design** per mobile e desktop

## 🗃️ Struttura Database

### Tabella `events`
```sql
- id (primary key)
- title (text) - Titolo evento
- date (date) - Data evento
- time (time) - Orario inizio
- duration (text) - Durata evento
- venue (text) - Nome venue
- price_range (text) - Fascia di prezzo
- capacity (integer) - Capacità massima
- organizer (text) - Organizzatore
- description (text) - Descrizione
- rating (decimal) - Valutazione (0-5)
- available (boolean) - Disponibilità biglietti
- category (text) - Categoria musicale
- image (text) - URL immagine
- user_id (uuid) - ID creatore evento
```

### Storage
- **Bucket `event-images`** per le immagini degli eventi
- **Policies di sicurezza** per upload/download

## 🚀 Come Avviare il Progetto

### Prerequisiti
- Node.js 18+
- Account Supabase
- Git

### Installazione

1. **Clona il repository**
```bash
git clone <repository-url>
cd music-events-discovery
```

2. **Installa le dipendenze**
```bash
cd src
npm install
```

3. **Configura Supabase**
```bash
# Crea un file .env nella cartella src
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Esegui le migrazioni**
```bash
# Applica le migrazioni nel tuo progetto Supabase
# File: supabase/migrations/
```

5. **Avvia il server di sviluppo**
```bash
npm run dev
```

## 🎯 Filosofia Vibe Coding

Questo progetto è un esempio perfetto di **vibe coding**:

1. **🎨 Inizio creativo:** Design in Figma + UI Designer
2. **⚡ Iterazione rapida:** Sviluppo con Bolt, aggiungendo funzionalità al volo
3. **🔄 Feedback immediato:** Ogni modifica testata istantaneamente
4. **🚀 Evoluzione organica:** L'app è cresciuta naturalmente, senza over-engineering
5. **💡 Intuizione guidata:** Decisioni prese in base al "feeling" del momento

### Vantaggi del Vibe Coding:
- **Velocità di sviluppo** incredibile
- **Creatività libera** senza vincoli di pianificazione
- **Risultati sorprendenti** che emergono naturalmente
- **Divertimento** nel processo di sviluppo
- **Apprendimento continuo** attraverso l'esperimentazione

## 📸 Screenshots

![App Screenshot](docs/screenshot%20app.png)

## 🔮 Prossimi Passi

Il progetto è pronto per essere esteso con:
- **Sistema di prenotazioni** biglietti
- **Notifiche** per nuovi eventi
- **Sistema di recensioni** utenti
- **Integrazione** con mappe per location
- **Chat** tra organizzatori e partecipanti

## 🤝 Contribuire

Questo progetto è stato costruito con vibe coding - sentiti libero di:
- **Sperimentare** con nuove funzionalità
- **Iterare** rapidamente
- **Seguire l'intuizione** per miglioramenti
- **Divertirti** nel processo!

## 📄 Licenza

Questo progetto è open source e disponibile sotto licenza MIT.

---

*Costruito con ❤️ e vibe coding - dove l'intuizione incontra l'innovazione!*
