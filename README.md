# Baclogged: Game Review & Collection Platform

Baclogged is a full-stack game review and collection platform where users can discover games, maintain personal collections, rate and review titles, and interact with community content.

The platform focuses on game discovery, user-generated content, data integrity, secure payment processing, and content moderation.

**Live Demo:** https://baclogged.in  
**GitHub Repository:** https://github.com/himanshugour23-dev/Review-Project

---

## ✨ Features

### 🎮 Game Discovery & Collection

- Browse and discover games.
- Search for games and explore detailed game information.
- View game summaries, storylines, genres, platforms, themes, game modes, player perspectives, keywords, franchises, release information, ratings, screenshots, videos, and similar games.
- Explore developer and publisher information and game artworks through the Premium tier.
- Maintain personal game collections and track games based on their status.
- Persist game records in MongoDB.

### 🔄 RAWG-to-IGDB Migration

- Migrated the platform's game data source from RAWG to IGDB.
- Introduced a dedicated IGDB game model and collection (`igdb_games`).
- Updated game data handling to use IGDB identifiers, slugs, cover image references, ratings, platforms, genres, and additional metadata.
- Migrated existing review references from legacy RAWG game records to their corresponding IGDB game records.
- Used slug-based mapping between legacy and replacement game records.
- Preserved existing review documents and user-generated content while updating their associated game IDs.
- Created a backup of original review-to-game references before migration.

### ⚡ API Integration & MongoDB Caching

**Original RAWG caching implementation:**

- Designed and implemented a MongoDB-backed caching layer around the RAWG API.
- Checked MongoDB for existing game data before making external API requests.
- Fetched data from RAWG when the required information was not already available locally.
- Persisted fetched game information in MongoDB to reduce redundant external requests.
- Used the growing local game database to support richer Browse and Discover experiences.
- Reported a 50% reduction in redundant API calls and approximately 200 ms improvement in repeat-search latency.

**IGDB integration:**

- Replaced RAWG with IGDB as the primary game data provider.
- Integrated Twitch OAuth 2.0 authentication for IGDB API access.
- Introduced a dedicated IGDB schema with support for expanded game metadata.
- Persisted IGDB game records in MongoDB.

### 🔐 Authentication & Role-Based Access Control

- Implemented authentication using NextAuth.js.
- Supports Google and GitHub OAuth.
- Implemented role-based access control for standard users and administrators.
- Added administrative capabilities for managing community content.

### 💳 Secure Payment Integration

- Integrated the Razorpay payment gateway.
- Implemented HMAC-SHA256 signature verification.
- Added server-side price validation to prevent client-side price manipulation.
- Implemented idempotent payment callback handling to prevent duplicate access grants.

### ⭐ Premium Features

Premium access unlocks additional game information, including:

- Developer information.
- Publisher information.
- Game artworks.

Core game discovery and information remain available without Premium, including screenshots, videos, websites and store links, DLC, similar games, ratings, genres, platforms, themes, game modes, keywords, franchises, summaries, and storylines.

### 🛡️ Review & Moderation System

- Users can create ratings and reviews for games.
- Enforced a one-review-per-user-per-game constraint at the database level.
- Implemented atomic database operations for review-related workflows.
- Prevented duplicate review submissions and rating inflation.
- Added review reporting functionality.
- Implemented per-user daily rate limits for reporting actions.
- Prevented duplicate reports using a unique compound database index.
- Built an administrative review queue for reviewing reported content.

### 🤖 AI-Powered Avatar Moderation

Implemented a two-stage avatar moderation pipeline.

**Stage 1 – Pre-upload screening**
- Uses the Gemini API to screen images before upload.

**Stage 2 – Asynchronous moderation**
- Uses Cloudinary Rekognition to moderate uploaded images asynchronously.
- Uses webhook-triggered automatic deletion of flagged images.

### 📱 Progressive Web App

- Installable as a Progressive Web App (PWA).
- Background sync and deeper offline support are planned improvements.

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
- Google OAuth
- GitHub OAuth
- Twitch OAuth 2.0 for IGDB API authentication
- Role-Based Access Control (RBAC)

### Database
- MongoDB
- Mongoose

### External Services
- IGDB API
- Twitch OAuth 2.0
- Razorpay Payment Gateway
- Gemini API
- Cloudinary Rekognition

### Developer Tools
- Git
- GitHub
- Postman
- Vercel

---

## 🏗️ Architecture & Database Design

Baclogged uses MongoDB to persist user information, game records, reviews, reports, payments, and user-specific game data.

### Main Application Components

- **Game Discovery:** Browse, Discover, Search, Home, and Game Details.
- **Community:** Reviews, ratings, reactions, reporting, and moderation.
- **Identity:** Authentication, user profiles, and personal collections.
- **Payments:** Checkout, Razorpay order creation, payment verification, and Premium access.
- **Game Data:** IGDB API integration and persistent game records.

### Database Collections

The application uses dedicated models for its main entities:

- Users
- IGDB Games (`igdb_games`)
- Reviews
- Review Reactions
- Reports
- Payments

### Game Data Model

The IGDB game model supports:

- IGDB game ID
- Game name and slug
- Cover image
- Summary and storyline
- Genres and platforms
- Themes and game modes
- Player perspectives
- Keywords and franchises
- Release date and category
- IGDB ratings and rating counts
- Aggregated ratings and rating counts
- Screenshots, artworks, and videos
- Similar games and related game information
- Last-fetched timestamp

### Review Data Migration

The migration from RAWG to IGDB involved:

1. Reading existing game and review references.
2. Mapping legacy RAWG game slugs to corresponding IGDB game records.
3. Resolving the destination IGDB game document for each review.
4. Updating review `gameId` references to the new IGDB document IDs.
5. Preserving existing review documents and user-generated content.
6. Creating a backup of original review-to-game references.

### Database Integrity

- One review per user per game.
- Unique compound index for duplicate report prevention.
- Atomic database operations for critical review workflows.
- Database-level constraints to protect rating consistency.

---

## 🔒 Security & Reliability

- OAuth-based authentication.
- Role-based authorization.
- Server-side payment validation.
- HMAC-SHA256 payment signature verification.
- Idempotent payment callback handling.
- Database-level uniqueness constraints.
- Rate-limited review reporting.
- Automated avatar moderation and flagged-image deletion.

---

## 🚀 Project Highlights

- Built a full-stack game review and collection platform used by 50+ users.
- Implemented MongoDB-backed caching for the RAWG API, reporting 50% fewer redundant API calls and approximately 200 ms lower repeat-search latency.
- Migrated the game data infrastructure from RAWG to IGDB while preserving existing user reviews.
- Integrated secure Razorpay payment processing.
- Developed database-level integrity mechanisms for reviews and ratings.
- Built a two-stage AI-powered avatar moderation pipeline.
- Developed an administrative reporting and moderation workflow.

---

## 👨‍💻 Author

**Himanshu Gour**

GitHub: https://github.com/himanshugour23-dev

**Live Project:** https://baclogged.in
