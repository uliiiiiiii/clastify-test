## clastify-test

Minimal full‑stack todo app with multiple lists, dark/light theme, and a Dockerized backend + MongoDB.

---

## English

### 1. Project structure

- **`frontend/`**  
  - Next.js app (App Router) with the UI.  
  - Key files:
    - `app/page.tsx` – main page, fetches lists/todos from the backend.
    - `app/components/` – `AppHeader`, `TodoMain`, `ListsPanel` split out for readability.
    - `app/page.module.css` – main styling (themes, layout).
  - Talks to the backend using `NEXT_PUBLIC_API_URL` (set in `docker-compose.yml` to `http://backend:5000`).

- **`backend/`**  
  - Express + Mongoose API.
  - Key files:
    - `src/app.ts` – creates the Express app, registers routes under `/api/todos` and `/api/lists`.
    - `src/index.ts` – loads envs, connects to MongoDB, starts the HTTP server.
    - `src/db.ts` – MongoDB connection helper with caching (used by routes).
    - `src/models/todo.ts` – `Todo` schema (title, completed, list ref).
    - `src/models/list.ts` – `List` schema (name).
    - `src/routes/todoRoutes.ts` – CRUD for todos; each request connects to Mongo via `dbConnect`.
    - `src/routes/listRoutes.ts` – CRUD for lists (including deleting related todos).

- **`docker-compose.yml`**  
  - Orchestrates three services:
    - `mongo` – MongoDB database.
    - `backend` – Node/Express API container.
    - `client` – Next.js frontend container.
  - Sets environment variables so everything can talk to each other:
    - Backend: `MONGODB_URI=mongodb://mongo:27017/todoapp`, `PORT=5000`.
    - Frontend: `NEXT_PUBLIC_API_URL=http://backend:5000`.

### 2. How the pieces communicate

- **Frontend → Backend**
  - The frontend uses `NEXT_PUBLIC_API_URL` and calls:
    - `GET /api/lists` – load all lists.
    - `POST /api/lists` – create a list.
    - `DELETE /api/lists/:id` – delete a list (and its todos).
    - `GET /api/todos?listId=...` – load todos for a list.
    - `POST /api/todos` – create a todo for a list.
    - `PATCH /api/todos/:id` – toggle completed state.
    - `DELETE /api/todos/:id` – delete a todo.

- **Backend → MongoDB**
  - The backend reads `MONGODB_URI` from the environment.
  - `dbConnect()` (in `src/db.ts`) is called inside each route handler and reuses a cached Mongoose connection when possible.

### 3. Running with Docker Compose

#### Prerequisites

- Docker and Docker Compose installed.

#### Steps

1. Clone the repository and go into it:

   ```bash
   git clone <your-fork-or-repo-url>
   cd clastify-test
   ```

2. Copy `.env.example` in backend/frontend folders and paste your envs (for the local development `localhost` will do instead of public IP).
  
  
3. Start all services:

   ```bash
   docker compose up --build
   ```

   This will:
   - Build and start MongoDB on `mongo:27017` (exposed on host `localhost:27017`).
   - Build and start the backend on container name `backend`, port `5000` (exposed as `localhost:5000`).
   - Build and start the frontend on container name `client`, port `3000` (exposed as `localhost:3000`).

6. Open the app in your browser:

   ```text
   http://localhost:3000
   ```

7. Basic health checks (optional):

   - Backend health:

     ```bash
     curl http://localhost:5000/api/health
     ```

   - Lists endpoint:

     ```bash
     curl http://localhost:5000/api/lists
     ```

#### Stopping containers

```bash
docker compose down
```

This stops and removes containers, but keeps the named Mongo volume (`mongo-data`) so your data is preserved.

---

## Polski

### 1. Struktura projektu

- **`frontend/`**  
  - Aplikacja Next.js (App Router) z interfejsem użytkownika.  
  - Najważniejsze pliki:
    - `app/page.tsx` – główna strona, pobiera listy/zadania z backendu.
    - `app/components/` – komponenty podzielone na `AppHeader`, `TodoMain`, `ListsPanel`.
    - `app/page.module.css` – główne style (motywy, układ).
  - Komunikuje się z backendem przez `NEXT_PUBLIC_API_URL` (w `docker-compose.yml` ustawione na `http://backend:5000`).

- **`backend/`**  
  - API oparte na Express + Mongoose.
  - Najważniejsze pliki:
    - `src/app.ts` – tworzy aplikację Express, rejestruje trasy `/api/todos` i `/api/lists`.
    - `src/index.ts` – wczytuje zmienne środowiskowe, łączy się z MongoDB, uruchamia serwer.
    - `src/db.ts` – helper do połączenia z MongoDB z cache’owaniem (używany w trasach).
    - `src/models/todo.ts` – schemat `Todo` (title, completed, referencja do listy).
    - `src/models/list.ts` – schemat `List` (name).
    - `src/routes/todoRoutes.ts` – operacje na zadaniach; każda obsługa wywołuje `dbConnect`.
    - `src/routes/listRoutes.ts` – operacje na listach (w tym usuwanie powiązanych zadań).

- **`docker-compose.yml`**  
  - Uruchamia trzy serwisy:
    - `mongo` – baza danych MongoDB.
    - `backend` – kontener z API (Node/Express).
    - `client` – kontener z frontendem (Next.js).
  - Konfiguruje zmienne środowiskowe:
    - Backend: `MONGODB_URI=mongodb://mongo:27017/todoapp`, `PORT=5000`.
    - Frontend: `NEXT_PUBLIC_API_URL=http://backend:5000`.

### 2. Jak komponenty się komunikują

- **Frontend → Backend**
  - Frontend korzysta z `NEXT_PUBLIC_API_URL` i wywołuje:
    - `GET /api/lists` – pobranie wszystkich list.
    - `POST /api/lists` – utworzenie listy.
    - `DELETE /api/lists/:id` – usunięcie listy (i jej zadań).
    - `GET /api/todos?listId=...` – pobranie zadań dla danej listy.
    - `POST /api/todos` – utworzenie zadania dla listy.
    - `PATCH /api/todos/:id` – przełączenie stanu „ukończone”.
    - `DELETE /api/todos/:id` – usunięcie zadania.

- **Backend → MongoDB**
  - Backend odczytuje `MONGODB_URI` ze zmiennych środowiskowych.
  - Funkcja `dbConnect()` (w `src/db.ts`) jest wywoływana w każdej trasie i korzysta z cache, aby ponownie używać istniejącego połączenia Mongoose.

### 3. Uruchomienie za pomocą Docker Compose

#### Wymagania

- Zainstalowany Docker oraz Docker Compose.

#### Kroki

1. Sklonuj repozytorium i przejdź do katalogu projektu:

   ```bash
   git clone <adres-twojego-forka-lub-repozytorium>
   cd clastify-test
   ```

2. Uruchom wszystkie serwisy:

   ```bash
   docker compose up --build
   ```

   To polecenie:
   - Zbuduje i uruchomi MongoDB na `mongo:27017` (wystawione jako `localhost:27017`).
   - Zbuduje i uruchomi backend (`backend`) na porcie `5000` (`localhost:5000`).
   - Zbuduje i uruchomi frontend (`client`) na porcie `3000` (`localhost:3000`).

3. Otwórz aplikację w przeglądarce:

   ```text
   http://localhost:3000
   ```

4. Opcjonalne sprawdzenie zdrowia:

   - Backend – endpoint zdrowia:

     ```bash
     curl http://localhost:5000/api/health
     ```

   - Endpoint list:

     ```bash
     curl http://localhost:5000/api/lists
     ```

#### Zatrzymanie kontenerów

```bash
docker compose down
```

To zatrzyma i usunie kontenery, ale pozostawi wolumen `mongo-data`, więc dane w MongoDB pozostaną.
