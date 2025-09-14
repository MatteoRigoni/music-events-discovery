# 🎵 Music Events Discovery

> **⚠️ DISCLAIMER:** Questa applicazione è **solo una dimostrazione** di utilizzo di **vibe coding** con **Bolt**. È stata sviluppata come esempio pratico di sviluppo iterativo e rapido, non come prodotto commerciale.

Una moderna applicazione web per scoprire e gestire eventi musicali, costruita seguendo un approccio di sviluppo iterativo e guidato dall'intuizione.

![App Screenshot](docs/screenshot%20app.png)

## 🚀 Sequenza Operativa di Sviluppo

### 1. 🎨 Design e Prototipazione

**Figma Design:** [Visualizza il design originale](https://www.figma.com/design/o30zAO58vSMHHRorlaWAdO/Music-Events-Discovery?node-id=0-1&t=UDpzCvbXn3FB4lEY-1)

**UI Designer** per generare immagine di riferimento e prompt dettagliato:
- Header con titolo, ricerca e filtri categorie
- Griglia eventi con immagine, titolo, descrizione, disponibilità, location e data
- Color Scheme: Grigio scuro, nero e viola
- Style: Moderno e attraente per pubblico giovane

![Reference UI](docs/reference_ui_image_by_UI-Designer.png)

### 2. 🔥 Sviluppo Frontend con Bolt

**Materiale trasferito su Bolt:**
- Design Figma + immagine UI Designer
- Prompt dettagliato delle specifiche

**Iterazioni di sviluppo:**
- Homepage con griglia eventi
- Pagina dettaglio eventi
- Sistema filtri per categorie musicali
- Ricerca in tempo reale
- Componenti React + TypeScript + Tailwind CSS

### 3. 🗄️ Setup Database Supabase

**Configurazione:**
- Creazione account Supabase
- Setup progetto e configurazione URL/keys
- Creazione tabella `events` con schema completo
- Configurazione storage bucket per immagini

**Integrazione:**
- Connessione frontend con Supabase client
- Implementazione CRUD operations
- Gestione upload immagini

### 4. 👥 Sistema Autenticazione

**Implementazione:**
- UI per registrazione e login
- Integrazione Supabase Auth
- Protezione routes e funzionalità
- Gestione stati utente e permessi

## 🛠️ Stack Tecnologico

- **Frontend:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **Autenticazione:** Supabase Auth
- **Storage:** Supabase Storage (per immagini eventi)
- **Icons:** Lucide React
- **Deployment:** Vite build system


## 🗃️ Database Schema

**Tabella `events`** con campi per titolo, data, venue, prezzo, categoria, immagini e user_id
**Storage bucket** per immagini eventi con policies di sicurezza

## 🚀 Setup Rapido

```bash
# Clone e installazione
git clone <repository-url>
cd music-events-discovery/src
npm install

# Configurazione Supabase
# Crea .env con VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY

# Avvio
npm run dev
```

## 🎯 Metodologia di Sviluppo con AI

**Sequenza operativa utilizzata:**

1. **🎨 Design → AI:** Figma + UI Designer per prototipo e prompt
2. **⚡ Code → AI:** Bolt per sviluppo frontend iterativo  
3. **🗄️ Database → AI:** Supabase setup e integrazione guidata
4. **👤 Auth → AI:** Implementazione autenticazione step-by-step

**Risultato:** App completa sviluppata in modo iterativo con AI, senza pianificazione rigida



## 📄 Licenza

MIT License - Progetto dimostrativo

---

*Dimostrazione di sviluppo iterativo con AI: Figma → UI Designer → Bolt → Supabase*
