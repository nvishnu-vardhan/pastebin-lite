# Pastebin Lite

A modern Pastebin-like web application built with **Next.js**, **TypeScript**, and **PostgreSQL**. Users can create text pastes with optional expiry by time-to-live (TTL) or maximum view count.

## 🚀 Features

- **Create Pastes**: Submit text content to create a new paste
- **Generate Shareable Links**: Each paste gets a unique ID for easy sharing
- **TTL Expiry**: Pastes can expire after a specified time (in seconds)
- **View Count Limit**: Optionally limit the number of times a paste can be viewed
- **Safe HTML Rendering**: Pastes are safely rendered as HTML
- **Test Mode Support**: Built-in TEST_MODE with x-test-now-ms header for time-based testing
- **RESTful API**: Well-designed API endpoints for all operations
- **Health Check**: /api/healthz endpoint for monitoring

## 🛠️ Tech Stack

- **Framework**: Next.js 15+ with App Router
- **Language**: TypeScript
- **Database**: PostgreSQL (via Neon)
- **Hosting**: Vercel (recommended)
- **Libraries**: React 19, @vercel/postgres

## 📋 API Endpoints

### 1. Health Check
```
GET /api/healthz
```
Returns 200 OK with status.

### 2. Create Paste
```
POST /api/pastes
Content-Type: application/json

{
  "content": "Your text here",
  "expiresIn": 3600,        // optional, TTL in seconds
  "maxViews": 5             // optional, max view count
}
```

**Response** (201 Created):
```json
{
  "id": "abc123def",
  "url": "/p/abc123def",
  "created_at": "2025-01-01T12:00:00Z",
  "expires_at": "2025-01-01T13:00:00Z",     // null if no TTL
  "remaining_views": 5                        // null if unlimited
}
```

### 3. Get Paste (JSON)
```
GET /api/pastes/:id
```

**Response** (200 OK):
```json
{
  "id": "abc123def",
  "content": "Your text here",
  "expires_at": "2025-01-01T13:00:00Z",
  "remaining_views": 4
}
```

**Error Responses**:
- 404: Paste not found, expired, or view limit reached
- 400: Invalid paste ID

### 4. View Paste (HTML)
```
GET /p/:id
```

Returns HTML page displaying the paste content.

## 🔧 Environment Variables

Create a `.env.local` file in the root directory:

```
DATABASE_URL=postgresql://user:password@host/database
TEST_MODE=0  # Set to 1 to enable TEST_MODE
```

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+
- PostgreSQL database (or Neon PostgreSQL)
- Git

### Local Development

1. **Clone the repository**
```bash
git clone https://github.com/nvishnu-vardhan/pastebin-lite
cd pastebin-lite
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up the database**

Create a PostgreSQL database and run the schema:

```sql
CREATE TABLE pastes (
  id VARCHAR(20) PRIMARY KEY,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP,
  max_views INTEGER,
  view_count INTEGER DEFAULT 0
);

CREATE INDEX idx_created_at ON pastes(created_at);
```

4. **Configure environment variables**

Create `.env.local`:
```
DATABASE_URL=your_database_url_here
```

5. **Run development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the repository on [Vercel](https://vercel.com)
3. Add `DATABASE_URL` environment variable in project settings
4. Deploy!

## 📋 Design Decisions

### 1. **ID Generation**
Unique 16-character alphanumeric IDs generated using `crypto.randomBytes()` for collision resistance.

### 2. **Expiry Logic**
- **TTL-based**: Checked server-side using current time vs. `expires_at` timestamp
- **View-based**: Incremented on each successful fetch; paste becomes unavailable after reaching `max_views`

### 3. **Test Mode Implementation**
- When `TEST_MODE=1`, the application uses `x-test-now-ms` header (milliseconds since epoch) for "current time"
- Falls back to actual server time if header is missing
- Allows predictable testing of expiry logic without waiting for real time

### 4. **Database Choice**
- PostgreSQL for reliability and ACID compliance
- Neon for free, serverless PostgreSQL on Vercel
- Simple schema with minimal overhead

### 5. **Error Handling**
- Returns 404 for expired, exhausted, or non-existent pastes
- Returns 400 for malformed requests
- Returns 201 for successful paste creation
- Returns 200 for successful retrieval

## 🔐 Security Considerations

1. **Content Sanitization**: Raw text is displayed; HTML is not executed
2. **ID Uniqueness**: Cryptographically random IDs prevent enumeration attacks
3. **Rate Limiting**: Should be added in production via middleware
4. **No Authentication**: Anyone can view public pastes; implement authentication if needed

## 🧪 Testing

### Example API Calls

**Create a paste:**
```bash
curl -X POST http://localhost:3000/api/pastes \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Hello, World!",
    "expiresIn": 3600,
    "maxViews": 5
  }'
```

**Retrieve a paste:**
```bash
curl http://localhost:3000/api/pastes/YOUR_PASTE_ID
```

**View paste in browser:**
```
http://localhost:3000/p/YOUR_PASTE_ID
```

### Test Mode

To test expiry with specific timestamps:

```bash
# Set TEST_MODE=1 in .env.local
curl -X GET http://localhost:3000/api/pastes/YOUR_PASTE_ID \
  -H "x-test-now-ms: 1704110400000"
```

## 📁 Project Structure

```
pastebin-lite/
├── app/
│   ├── layout.tsx              # Root layout component
│   ├── page.tsx                # Home page
│   ├── globals.css             # Global styles
│   ├── api/
│   │   ├── healthz/
│   │   │   └── route.ts        # Health check endpoint
│   │   ├── pastes/
│   │   │   └── route.ts        # Create & retrieve pastes
│   │   └── pastes/[id]/
│   │       └── route.ts        # Get specific paste
│   └── p/[id]/
│       └── page.tsx            # Public paste view page
├── lib/
│   ├── db.ts                   # Database utilities
│   ├── utils.ts                # Helper functions
│   └── types.ts                # TypeScript types
├── package.json                # Dependencies
├── tsconfig.json               # TypeScript config
├── next.config.js              # Next.js config
└── README.md                   # This file
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

## 📧 Contact

For questions or issues, please open a GitHub issue or contact the maintainer.

---

**Note**: This project was built as a take-home exercise for Aganitha Cognitive Solutions. It demonstrates full-stack development skills with Next.js, TypeScript, and PostgreSQL.
