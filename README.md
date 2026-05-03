# LocalVoice

LocalVoice is a civic engagement platform that enables community members—especially those in remote or underserved areas—to report infrastructure, health, and environmental issues by uploading photos/videos and submitting details. These reports can then be reviewed by stakeholders (e.g., government bodies, NGOs, and other interested individuals).

This repository contains:
- A **Node.js/Express backend** with JWT-based authentication and MySQL persistence.
- A **static web UI** served from the backend (`backend/public`).
- Two additional static dashboard prototypes (`dashboard2/`, `dashboard3/`).
- A database schema draft in `WorkHouse/dbcreation.txt`.

---

## Key Features (Implemented)

### Community member accounts
- Register a community member (name, email, password)
- Login and receive a JWT token
- Fetch the currently authenticated user profile (“me”)

### Media uploads
- Upload a **profile picture** (stored on disk under `backend/public/uploads`)
- Submit a **community problem report** with up to **5 attachments** (images/videos), stored under `backend/public/CommunityProblems`

### Report submission (community problems)
A report stores:
- Title
- Category
- Description
- Location
- Urgency (`low`, `medium`, `high`, `critical`)
- Optional image URL
- Optional video URL
- Status (`draft`, `submitted`, `resolved`) with default `submitted` (per schema)

---

## Tech Stack

### Backend
- Node.js + Express
- MySQL (via `mysql2/promise`)
- JWT authentication (`jsonwebtoken`)
- Password hashing (`bcryptjs`)
- File uploads (`multer`)
- CORS enabled (`cors`)
- Env config (`dotenv`)

### Frontend (static)
- HTML / CSS / JavaScript served from `backend/public`

---

## Repository Structure

- `backend/` — Express API + static site
  - `server.js` — Express app entry point
  - `config/db.js` — MySQL connection pool setup
  - `controllers/` — request handlers (auth, profile, report submission)
  - `routes/` — API route definitions
  - `middleware/` — auth + upload middleware
  - `public/` — static frontend pages and assets (served by Express)
- `dashboard2/` — standalone dashboard prototype (static HTML/CSS/JS)
- `dashboard3/` — standalone dashboard prototype (static HTML/CSS/JS)
- `WorkHouse/`
  - `dbcreation.txt` — SQL schema draft for MySQL tables
  - `Screenshot (193).png` — design/reference image

---

## API Overview

Base URL (local): `http://localhost:5000`

### Auth / community members

#### Register
`POST /api/community-members/register`

Body (JSON):
```json
{
  "firstName": "Jane",
  "lastName": "Doe",
  "email": "jane@example.com",
  "password": "your-password"
}
```

#### Login
`POST /api/community-members/login`

Body (JSON):
```json
{
  "email": "jane@example.com",
  "password": "your-password"
}
```

Response includes a JWT token:
```json
{ "message": "Login successful", "token": "..." }
```

#### Get current user
`GET /api/community-members/me`

Header:
`Authorization: Bearer <token>`

---

## Media Uploads

### Upload profile picture
`POST /api/community-members/upload-profile-pic`

- Auth required: `Authorization: Bearer <token>`
- Content-Type: `multipart/form-data`
- Field name: `profilePic` (single file)

The stored path is saved to `community_members.profile_pic` in the database and is served from:
- `GET /uploads/<filename>`

### Submit a community problem report (with images/videos)
`POST /api/community-members/community-problems`

- Auth required: `Authorization: Bearer <token>`
- Content-Type: `multipart/form-data`
- Field name for attachments: `files` (array, up to 5 files)
- Allowed file types: images (`jpeg/jpg/png/gif`) and videos (`mp4/mov/avi/wmv/mkv`)
- Max size: 10MB per file

Form fields:
- `title`
- `category`
- `description`
- `location`
- `urgency`

Uploaded media is stored on disk and served from:
- `GET /CommunityProblems/<filename>`

---

## Database

LocalVoice uses MySQL. A draft schema is provided in:

- `WorkHouse/dbcreation.txt`

It defines two main tables:
- `community_members`
- `community_problems` (linked to `community_members` via `user_id`)

---

## Environment Variables

The backend expects a `.env` file under `backend/.env`.

Example (current repo content):
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_PORT=3306
DB_NAME=localvoice
JWT_SECRET=super_secret_key
JWT_EXPIRATION=1h
```

### Security note
Do **not** commit real secrets. Rotate `JWT_SECRET` for any deployed environment.

---

## Running Locally

### Prerequisites
- Node.js (recommended: LTS)
- MySQL server running locally
- A MySQL database created (e.g., `localvoice`) and tables created using the SQL in `WorkHouse/dbcreation.txt`

### Setup & start
1. Clone the repo
2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```
3. Create/update `backend/.env` to match your MySQL credentials
4. Start the server:
   ```bash
   node server.js
   ```
   The backend runs on:
   - `http://localhost:5000`

### Static UI
The backend serves static pages from `backend/public`. Once the server is running, visit:
- `http://localhost:5000/`

---

## Notes on Dashboards

This repo also includes:
- `dashboard2/`
- `dashboard3/`

These appear to be standalone static dashboard prototypes (not automatically wired into the Express server). You can open their `index.html` files directly in a browser, or integrate them into `backend/public/` if you want them served by the backend.

---

## Known Gaps / Areas to Improve

- No automated tests configured (`npm test` placeholder).
- No start/dev scripts configured in `backend/package.json` (you can add scripts like `dev: nodemon server.js`).
- Upload storage is local disk (consider S3/GCS for production).
- No role-based access control implemented yet for NGOs/government reviewers (current API focuses on community member flows).

---

## License

No license file is currently defined in this repository. If you intend others to use/modify the project, add a `LICENSE` file (e.g., MIT, Apache-2.0, GPL).

---

## Contributing

Contributions are welcome:
1. Fork the repo
2. Create a feature branch
3. Open a pull request with a clear description and screenshots (if UI changes)

---

## Quick Troubleshooting

- **DB connection fails:** verify MySQL is running and `.env` credentials match.
- **Unauthorized responses:** ensure you’re sending `Authorization: Bearer <token>`.
- **Uploads not showing:** uploaded files are served from `backend/public/uploads` and `backend/public/CommunityProblems` via `/uploads` and `/CommunityProblems`.
