# BoolBnB – Backend API

Backend della piattaforma **BoolBnB**, un'applicazione ispirata ad Airbnb, sviluppata con **Node.js**, **Express** e **MySQL**. Espone un set di API RESTful per la gestione di annunci, recensioni e filtri di ricerca, offrendo supporto completo al frontend React.

## ⚙️ Tecnologie principali

- Node.js
- Express
- MySQL
- Multer (upload immagini)
- dotenv
- CORS
- JWT (opzionale per autenticazione)
- Middleware custom

---

## 📌 Funzionalità principali

### 🏠 Gestione annunci (`homes`)
- Ricerca annunci filtrata per:
  - città
  - prezzo massimo
  - tipo di alloggio e sistemazione
  - numero minimo di stanze, letti, bagni
  - numero ospiti
  - servizi offerti (Wi-Fi, TV, piscina, cucina, lavatrice, riscaldamento, aria condizionata, asciugacapelli, ferro da stiro)
- Paginazione dei risultati
- Media delle recensioni integrate (`AVG(vote)`)
- Like incrementabili per ogni annuncio
- Creazione di nuovi annunci da parte dell’host (upload immagini incluso)

### ⭐ Recensioni (`reviews`)
- Inserimento recensione per un annuncio con:
  - voto, testo, nome, date di soggiorno e check-in
- Restituzione formattata con date localizzate in formato italiano

---

## 🔍 Filtri dinamici e query SQL

Le query SQL sono costruite dinamicamente in base ai filtri presenti nella `query string`.

