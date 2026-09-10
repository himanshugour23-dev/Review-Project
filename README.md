# Baclogged: Game Review & Collection Platform

Baclogged is a full-stack game review and collection platform where users can discover games, maintain their personal collections, rate and review games, and interact with community content.

The platform integrates the RAWG Video Games Database API with a MongoDB-backed caching layer to reduce redundant external API requests. It also includes role-based authentication, moderation workflows, secure payment processing, database-level constraints, rate limiting, and duplicate-prevention mechanisms.

## 🚀 Live Demo & Repository

- **Live Demo:** [baclogged.in](https://www.baclogged.in/)
- **GitHub Repository:** [github.com/himanshugour23-dev/Review-Project](https://github.com/himanshugour23-dev/Review-Project)

---

## ✨ Features

### 🎮 Game Discovery & Collection

- Browse and discover games using the RAWG Video Games Database API.
- View detailed game information including metadata, genres, ratings, release information, and artwork.
- Maintain personal game collections and track games based on their status.
- Game data is progressively persisted into the local database as users interact with the platform.

### ⚡ API Caching Layer

- Implemented a MongoDB-backed caching layer around the RAWG API.
- Previously fetched game data is served from the database instead of repeatedly requesting the external API.
- Reduces redundant third-party API calls and improves response time for repeated searches.
- Cached records include game metadata and freshness information to control when data should be refreshed.

### 🔐 Authentication & Role-Based Access Control

- Implemented authentication using NextAuth.js.
- Supports OAuth-based authentication.
- Added role-based access control for standard users and administrators.
- Administrators have dedicated moderation capabilities for managing community content.

### 💳 Secure Payment Integration

- Integrated the Razorpay payment gateway.
- Implemented HMAC-SHA256 signature verification for payment authenticity.
- Added server-side price validation to prevent client-side price manipulation.
- Implemented idempotent payment callback handling to prevent duplicate access grants.

### 🛡️ Review & Moderation System

- Users can create ratings and reviews for games.
- Enforced a one-review-per-user-per-game constraint at the database level.
- Added review reporting functionality.
- Implemented an administrative review queue for reported content.
- Added per-user daily rate limits for reporting actions.
- Prevented duplicate reports using a unique compound database index.
- Added moderation controls for administrators to maintain content quality.

### 🗄️ Database-Level Integrity

- Used atomic database operations for critical review-related workflows.
- Enforced uniqueness constraints to prevent duplicate submissions.
- Database-level restrictions prevent rating inflation caused by multiple reviews from the same user.
- Compound indexes are used for efficient queries and duplicate prevention.

---

## 🛠️ Tech Stack

### Frontend

- React.js
- Next.js
- Next.js App Router
- Tailwind CSS
- Progressive Web App (PWA)

### Backend

- Node.js
- Next.js API Routes
- Next.js Server Actions
- REST APIs

### Authentication

- NextAuth.js
- OAuth
- Role-Based Access Control (RBAC)

### Database

- MongoDB
- Mongoose

### External Services

- RAWG Video Games Database API
- Razorpay Payment Gateway

### Developer Tools

- Git
- GitHub
- Postman
- Vercel

---

## 🏗️ Architecture & Database Design

Baclogged uses a MongoDB-based architecture with separate collections for users, games, reviews, reports, and user-specific game data.

### 👤 Users & Profiles

Stores user identity, authentication provider information, profile details, roles, and user-specific game preferences.

### 🎮 Game Cache

Stores game information retrieved from the RAWG API.

The cached data contains information such as:

- RAWG Game ID
- Game name
- Slug
- Cover image
- Genres
- Release date
- Average rating
- Review count
- Last fetched timestamp

This allows frequently requested games to be served from MongoDB instead of repeatedly querying the RAWG API.

### ⭐ Reviews & Ratings

Reviews are associated with both users and games.

A unique database constraint ensures:

```text
One user → One review → One game
