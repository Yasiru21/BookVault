# 📚 BookVault

A full-stack book management system built as a software engineering intern assignment.

**Stack:**
- **Backend:** C# .NET 8 Web API + Entity Framework Core + SQLite + JWT Auth
- **Frontend:** React 18 + TypeScript + Vite + React Query + React Router v6

---

## ✨ Features

### Core Book CRUD
| Operation | Endpoint | Frontend Route |
|-----------|----------|----------------|
| View all books | `GET /api/books` | `/` |
| View single book | `GET /api/books/:id` | `/books/:id` |
| Create book | `POST /api/books` | `/books/new` |
| Update book | `PUT /api/books/:id` | `/books/:id/edit` |
| Delete book | `DELETE /api/books/:id` | (modal on list page) |

### Additional Features
- 🔍 **Real-time search** by title or author (debounced)
- 🏷️ **Genre filtering** with quick-filter pill buttons
- 📄 **Pagination** — 9 books per page
- 🔐 **JWT Authentication** — Register & Login with secure password hashing
- 👤 **User Profile Page** — personal profile card with username, email and role
- 🛡️ **Protected Routes** — Create, Edit & Delete require authentication; guests are redirected to Sign In
- 📖 **Book Detail View** with full metadata, reading time estimate and book age
- ✅ **Form Validation** — both frontend (React Hook Form + Zod) and backend (DataAnnotations)
- 🌙 **Dark glassmorphism UI** — premium, animated design with light mode toggle
- 📱 **Fully responsive** — works on mobile, tablet, and desktop
- 📋 **Swagger API Docs** — auto-generated at `/swagger`
- 🌱 **Seeded data** — 16 sample books across 8 genres on first run
- 🎨 **Features, About, & Contact pages** — dedicated informational pages with scroll animations and FAQs
- 📊 **Dynamic Stats** — Live dashboard stats powered by React Query pulling directly from backend API.

---

## 🛠️ Prerequisites

Make sure you have the following installed:

| Tool | Version | Download |
|------|---------|----------|
| .NET SDK | 8.0+ | https://dotnet.microsoft.com/download |
| Node.js | 18+ | https://nodejs.org/ |
| Git | any | https://git-scm.com/ |

Verify installations:
```bash
dotnet --version   # should print 8.x.x
node --version     # should print 18.x or 20.x
npm --version      # should print 9.x or 10.x
```

---

## 🚀 Getting Started

### Step 1 — Clone the repository
```bash
git clone https://github.com/Yasiru21/BookVault.git
cd BookVault
```

### Step 2 — Run the Backend API

```bash
cd backend/LibraryAPI

# Restore NuGet packages
dotnet restore

# Start the development server (port 5000)
dotnet run
```

> The API will start at **http://localhost:5000**
> Swagger UI will be available at **http://localhost:5000/swagger**
> The SQLite database (`library.db`) is created automatically on first run with seed data.

### Step 3 — Run the Frontend

Open a **second terminal** window:

```bash
cd frontend

# Install npm packages
npm install

# Start the Vite dev server (port 5173)
npm run dev
```

> The React app will open at **http://localhost:5173**
> API calls are proxied through Vite to `http://localhost:5000/api`

---

## 🗂️ Project Structure

```
BookVault/
│
├── backend/
│   └── LibraryAPI/
│       ├── Controllers/
│       │   ├── BooksController.cs      # CRUD endpoints
│       │   └── AuthController.cs       # Register/Login endpoints
│       ├── Data/
│       │   └── LibraryDbContext.cs     # EF Core DbContext + seed data
│       ├── DTOs/
│       │   ├── BookDtos.cs             # Create/Update/Response DTOs
│       │   └── AuthDtos.cs             # Register/Login DTOs
│       ├── Migrations/                 # EF Core migration files
│       ├── Models/
│       │   ├── Book.cs                 # Book entity
│       │   └── User.cs                 # User entity
│       ├── Services/
│       │   ├── IBookService.cs         # Book service interface
│       │   ├── BookService.cs          # Book CRUD business logic
│       │   ├── IAuthService.cs         # Auth service interface
│       │   └── AuthService.cs          # JWT + BCrypt auth logic
│       ├── Program.cs                  # DI, middleware, CORS, Swagger config
│       ├── appsettings.json            # Connection string + JWT config
│       └── LibraryAPI.csproj           # NuGet packages
│
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── Navbar.tsx              # Top navigation bar with theme toggle
│       │   ├── Footer.tsx              # Application footer
│       │   ├── BookCard.tsx            # Book grid card
│       │   ├── BookForm.tsx            # Shared create/edit form
│       │   ├── ConfirmModal.tsx        # Delete confirmation dialog
│       │   └── Loader.tsx              # Spinner + skeleton cards
│       ├── context/
│       │   └── AuthContext.tsx         # Global auth state (React Context)
│       ├── pages/
│       │   ├── BookListPage.tsx        # Home — book grid with search/filter
│       │   ├── BookDetailPage.tsx      # Single book detail view
│       │   ├── AddBookPage.tsx         # Create book form page (Protected)
│       │   ├── EditBookPage.tsx        # Edit book form page (Protected)
│       │   ├── LoginPage.tsx           # Login form page
│       │   ├── RegisterPage.tsx        # Registration form page
│       │   ├── ProfilePage.tsx         # User profile page (Protected)
│       │   ├── ContactPage.tsx         # Contact info & FAQs
│       │   ├── FeaturesPage.tsx        # Feature showcase
│       │   ├── AboutPage.tsx           # About the project
│       │   └── NotFoundPage.tsx        # 404 Error page
│       ├── services/
│       │   ├── api.ts                  # Axios instance with interceptors
│       │   ├── bookService.ts          # Book API functions
│       │   └── authService.ts          # Auth API functions
│       ├── types/
│       │   └── index.ts                # TypeScript interfaces (mirrors C# DTOs)
│       ├── App.tsx                     # React Router setup + providers
│       ├── main.tsx                    # React entry point
│       └── index.css                   # Global design system (CSS variables)
│
├── .gitignore
└── README.md
```

---

## 📡 API Reference

### Books

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| `GET` | `/api/books` | List books (search, genre, page, pageSize) | — |
| `GET` | `/api/books/{id}` | Get single book | — |
| `GET` | `/api/books/genres` | List all genres | — |
| `POST` | `/api/books` | Create new book | `CreateBookDto` |
| `PUT` | `/api/books/{id}` | Update book | `UpdateBookDto` |
| `DELETE` | `/api/books/{id}` | Delete book | — |

**Query params for GET /api/books:**
- `search` — filter by title or author substring
- `genre` — exact genre match
- `page` — page number (default: 1)
- `pageSize` — items per page (default: 10, max: 100)

### Authentication (Optional)

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| `POST` | `/api/auth/register` | Create account | `RegisterDto` |
| `POST` | `/api/auth/login` | Login + get JWT | `LoginDto` |

### Example: Create Book (cURL)
```bash
curl -X POST http://localhost:5000/api/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Clean Code",
    "author": "Robert C. Martin",
    "description": "A handbook of agile software craftsmanship.",
    "genre": "Technology",
    "publishedYear": 2008,
    "isbn": "978-0132350884"
  }'
```

---

## 🔒 Authentication Flow

1. User registers at `/auth/register` → receives JWT token (24h expiry)
2. Token stored in `localStorage`
3. All API requests include `Authorization: Bearer <token>` header (via Axios interceptor)
4. On `401 Unauthorized` → token cleared, user redirected to login

**Password security:** BCrypt with work factor 12 (never stored in plain text)

---

## ⚙️ Configuration

### Backend (`backend/LibraryAPI/appsettings.json`)

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=library.db"
  },
  "Jwt": {
    "Key": "YourSecretKeyHere",
    "Issuer": "LibraryAPI",
    "Audience": "LibraryClient"
  }
}
```

> **Security note:** Change the JWT key before deploying to production.

### Frontend (`frontend/vite.config.ts`)
The Vite dev server proxies `/api/*` to `http://localhost:5000`. No `.env` file needed for local development.

---

## 🧪 Running Tests

### Manual API Testing via Swagger
Navigate to **http://localhost:5000/swagger** to interact with all endpoints directly in your browser.

### Manual UI Testing Checklist
- [ ] Can create a new book with all fields
- [ ] Can view the book list with seed data
- [ ] Can click a book to view its detail page
- [ ] Can edit a book and save changes
- [ ] Can delete a book (with confirmation dialog)
- [ ] Search bar filters results in real-time
- [ ] Genre dropdown filters results
- [ ] Pagination works (add 10+ books to test)
- [ ] Empty required fields show validation errors
- [ ] Register a new user account
- [ ] Login with registered credentials
- [ ] Logout clears the session

---

## 🏗️ Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| **Layered architecture** (Controller → Service → DB) | Separation of concerns; services are easily testable in isolation |
| **DTOs separate from entities** | API contract is decoupled from database schema; easier to evolve independently |
| **`IBookService` interface** | Enables dependency injection and mocking in unit tests |
| **Async/await throughout** | Non-blocking I/O — handles concurrent requests without blocking the thread pool |
| **React Query** | Eliminates manual loading/error state management; provides caching, background refetch, and optimistic updates |
| **React Hook Form** | Uncontrolled form inputs for better performance; built-in validation |
| **CSS Modules** | Scoped styles prevent class name collisions across components |
| **Vite proxy** | Avoids CORS configuration during development by proxying API calls |

---

## 📄 Technologies Used

### Backend
- **C# 12 / .NET 8** — latest LTS version
- **ASP.NET Core Web API** — RESTful API framework
- **Entity Framework Core 8** — ORM for database abstraction
- **SQLite** — lightweight file-based database (no server needed)
- **Swashbuckle / Swagger** — API documentation
- **BCrypt.Net** — password hashing
- **System.IdentityModel.Tokens.Jwt** — JWT token generation

### Frontend
- **React 18** — UI library with concurrent features
- **TypeScript** — static type safety
- **Vite** — fast build tool and dev server
- **React Router v6** — client-side routing
- **TanStack Query (React Query)** — server state management
- **Axios** — HTTP client with interceptors
- **React Hook Form** — form state and validation
- **Lucide React** — icon library
- **React Hot Toast** — toast notifications

---

## 🤝 Contributing / Submission

This project was submitted as part of a software engineering internship assessment.

Repository submitted to: **people@veyrion.com**
