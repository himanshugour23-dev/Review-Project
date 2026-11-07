# Baclogged: Game Review & Collection Platform

Baclogged is a full-stack game review and collection platform where users can discover games, maintain personal collections, rate and review titles, and interact with community content.

The platform uses the IGDB API as its game data source, backed by MongoDB persistence and caching. It also includes OAuth authentication, role-based access control, review moderation, AI-assisted avatar moderation, secure payment processing, and database-level integrity constraints.

## 🚀 Live Demo & Repository

- **Live Demo:** [baclogged.in](https://www.baclogged.in/)
- **GitHub Repository:** [github.com/himanshugour23-dev/Review-Project](https://github.com/himanshugour23-dev/Review-Project)

---

## ✨ Features

### 🎮 Game Discovery & Collection

- Browse and discover games using the IGDB API.
- View detailed game information, including summaries, storylines, genres, platforms, themes, game modes, player perspectives, keywords, franchises, release information, ratings, screenshots, videos, and similar games.
- Explore developer and publisher information, plus game artworks through the Premium tier.
- Maintain personal game collections and track games based on their status.
- Persist game records in MongoDB so frequently requested information can be served locally.

### 🔄 RAWG-to-IGDB Data Migration

- Migrated the platform's game data source from RAWG to IGDB.
- Introduced a dedicated IGDB game model and collection (`igdb_games`) with IGDB-specific identifiers and metadata.
- Updated game data handling to use IGDB IDs, slugs, cover image references, ratings, platforms, genres, and expanded metadata.
- Migrated existing review references from the legacy RAWG game records to their corresponding IGDB game records.
- Used slug-based mapping between legacy and replacement game records to resolve the new game references.
- Kept review documents and their user-generated content intact while updating their associated game IDs.
- Created a backup of review-to-game references before applying the migration, allowing the previous references to be recovered if needed.

### ⚡ IGDB Integration & Database Caching

- Integrated the IGDB API as the primary source for game metadata.
- Implemented the IGDB authentication flow using Twitch credentials and OAuth access tokens.
- Store game information in MongoDB to reduce repeated external API requests.
- Serve previously fetched game records from the database and refresh records according to their freshness timestamp.
- Store expanded IGDB metadata, including ratings, screenshots, artworks, videos, platforms, genres, themes, game modes, player perspectives, keywords, franchises, and related games.

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

### ⭐ Premium Features

- Premium access unlocks additional game information, including developers, publishers, and artworks.
- Core discovery and game information remain available without Premium, including screenshots, videos, websites and store links, DLC, similar games, ratings, genres, platforms, themes, game modes, keywords, franchises, summaries, and storylines.

### 🛡️ Review & Moderation System

- Users can create ratings and reviews for games.
- Enforced a one-review-per-user-per-game constraint at the database level.
- Added review reporting functionality.
- Implemented an administrative review queue for reported content.
- Added per-user daily rate limits for reporting actions.
- Prevented duplicate reports using a unique compound database index.
- Added moderation controls for administrators to maintain content quality.

### 🤖 AI-Powered Avatar Moderation

- Built a two-stage avatar moderation system to keep inappropriate images off the platform.
- **Stage 1 (pre-upload screening):** images are screened with the Gemini API before they are uploaded.
- **Stage 2 (asynchronous moderation):** uploaded images are moderated asynchronously using Cloudinary Rekognition.
- Webhook-triggered automatic deletion of flagged images, with no manual admin intervention required.

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
- Twitch OAuth 2.0 (IGDB API authentication)
- Role-Based Access Control (RBAC)

### Database

- MongoDB
- Mongoose

### External Services

- IGDB API (game metadata and discovery)
- Twitch OAuth 2.0 (IGDB access tokens)
- Razorpay Payment Gateway
- Gemini API (pre-upload avatar screening)
- Cloudinary (image hosting and Rekognition-based moderation)

### Developer Tools

- Git
- GitHub
- Postman
- Vercel

---

## 🏗️ Architecture & Database Design

Baclogged uses a MongoDB-based architecture with separate collections for users, IGDB games, reviews, reports, payments, and user-specific game data.

### 🗺️ System Architecture Diagram

```mermaid
flowchart TD

subgraph group_discovery["Game discovery"]
  node_browse["Browse games<br/>[page.tsx]"]
  node_discover["Discover picks<br/>[DiscoverClient.tsx]"]
  node_discoverapi["Discovery API<br/>[route.ts]"]
  node_gameview["Game details<br/>[page.tsx]"]
  node_gameapi["Game detail API<br/>[route.ts]"]
  node_gamebrowseapi["Browse API<br/>[route.ts]"]
  node_gamesearchapi["Search API<br/>[route.ts]"]
  node_creators["Creator details<br/>[page.tsx]"]
  node_home["Home experience<br/>[HomePage.tsx]"]
end

subgraph group_community["Community and moderation"]
  node_reviewapi["Review API<br/>[route.ts]"]
  node_reviews[("Reviews<br/>[review.ts]")]
  node_reactionapi["Reaction API<br/>[route.ts]"]
  node_reactions[("Review reactions<br/>[reviewReaction.ts]")]
  node_reportapi["Report API<br/>[route.ts]"]
  node_reports[("Reports<br/>[report.ts]")]
  node_adminqueue["Admin moderation<br/>[page.tsx]"]
  node_adminreports["Admin report API<br/>[route.ts]"]
end

subgraph group_identity["Identity and collections"]
  node_auth["Authentication<br/>[auth.ts]"]
  node_authroute["Auth endpoint<br/>[route.ts]"]
  node_profiles["Profiles and collection<br/>[page.tsx]"]
  node_userapi["User APIs<br/>[route.ts]"]
  node_users[("Users<br/>[User.ts]")]
  node_avatar["Avatar moderation<br/>[avatarModration.ts]"]
  node_avatarapi["Avatar endpoint<br/>[route.ts]"]
  node_webhook["Moderation webhook<br/>[route.ts]"]
end

subgraph group_commerce["Premium and payments"]
  node_checkout["Checkout details<br/>[page.tsx]"]
  node_checkoutapi["Checkout API<br/>[route.ts]"]
  node_orderapi["Order API<br/>[route.ts]"]
  node_callback["Payment callback<br/>[route.ts]"]
  node_payments[("Payments<br/>[payment.ts]")]
  node_razorpaybutton["Razorpay checkout"]
end

subgraph group_platform["Data and integrations"]
  node_igdbclient["IGDB client<br/>[igdb.ts]"]
  node_igdbgames[("IGDB game records<br/>[igdbGames.ts]")]
end

node_player(("Player"))

node_player -->|"browses"| node_browse
node_player -->|"discovers"| node_discover
node_player -->|"opens title"| node_gameview
node_discover -->|"fetches picks"| node_discoverapi
node_browse -.->|"requests games"| node_gamebrowseapi
node_gameview -.->|"loads details"| node_gameapi
node_gameapi -->|"reads and refreshes"| node_igdbgames
node_gameapi -->|"fetches metadata"| node_igdbclient
node_gameapi -->|"loads reviews"| node_reviews
node_gameapi -->|"populates authors"| node_users
node_gameapi -->|"loads reactions"| node_reactions
node_player -->|"submits reviews"| node_reviewapi
node_reviewapi -->|"creates or updates"| node_reviews
node_reviewapi -->|"updates ratings"| node_igdbgames
node_player -->|"reacts"| node_reactionapi
node_reactionapi -->|"creates or updates"| node_reactions
node_player -->|"reports content"| node_reportapi
node_reportapi -->|"checks target"| node_reviews
node_reportapi -->|"records report"| node_reports
node_adminqueue -.->|"manages queue"| node_adminreports
node_adminreports -.->|"reads reports"| node_reports
node_player -->|"signs in"| node_authroute
node_authroute -.->|"uses configuration"| node_auth
node_auth -->|"resolves identity"| node_users
node_player -->|"manages collection"| node_profiles
node_profiles -.->|"uses profile APIs"| node_userapi
node_userapi -.->|"reads and updates"| node_users
node_player -->|"updates avatar"| node_avatarapi
node_avatarapi -.->|"screens upload"| node_avatar
node_avatarapi -.->|"triggers moderation"| node_webhook
node_webhook -->|"clears flagged avatar"| node_users
node_player -->|"purchases premium"| node_checkout
node_checkout -->|"starts payment"| node_razorpaybutton
node_razorpaybutton -.->|"creates order"| node_orderapi
node_orderapi -.->|"records payment"| node_payments
node_callback -->|"verifies payment"| node_payments
node_callback -->|"grants premium"| node_users
node_igdbclient -.->|"caches metadata"| node_igdbgames

click node_browse "https://github.com/himanshugour23-dev/review-project/blob/main/app/browse/page.tsx"
click node_discover "https://github.com/himanshugour23-dev/review-project/blob/main/app/discover/DiscoverClient.tsx"
click node_discoverapi "https://github.com/himanshugour23-dev/review-project/blob/main/app/api/games/discover/route.ts"
click node_gameview "https://github.com/himanshugour23-dev/review-project/blob/main/app/game/%5Bslug%5D/page.tsx"
click node_gameapi "https://github.com/himanshugour23-dev/review-project/blob/main/app/api/games/%5Bslug%5D/route.ts"
click node_gamebrowseapi "https://github.com/himanshugour23-dev/review-project/blob/main/app/api/games/browse/route.ts"
click node_gamesearchapi "https://github.com/himanshugour23-dev/review-project/blob/main/app/api/games/search/route.ts"
click node_creators "https://github.com/himanshugour23-dev/review-project/blob/main/app/game/%5Bslug%5D/creators/page.tsx"
click node_home "https://github.com/himanshugour23-dev/review-project/blob/main/homeComponents/HomePage.tsx"
click node_reviewapi "https://github.com/himanshugour23-dev/review-project/blob/main/app/api/reviews/route.ts"
click node_reviews "https://github.com/himanshugour23-dev/review-project/blob/main/models/review.ts"
click node_reactionapi "https://github.com/himanshugour23-dev/review-project/blob/main/app/api/reactions/route.ts"
click node_reactions "https://github.com/himanshugour23-dev/review-project/blob/main/models/reviewReaction.ts"
click node_reportapi "https://github.com/himanshugour23-dev/review-project/blob/main/app/api/reports/route.ts"
click node_reports "https://github.com/himanshugour23-dev/review-project/blob/main/models/report.ts"
click node_adminqueue "https://github.com/himanshugour23-dev/review-project/blob/main/app/admin/reports/page.tsx"
click node_adminreports "https://github.com/himanshugour23-dev/review-project/blob/main/app/api/admin/reports/route.ts"
click node_auth "https://github.com/himanshugour23-dev/review-project/blob/main/lib/auth.ts"
click node_authroute "https://github.com/himanshugour23-dev/review-project/blob/main/app/api/auth/%5B...nextauth%5D/route.ts"
click node_profiles "https://github.com/himanshugour23-dev/review-project/blob/main/app/user/me/page.tsx"
click node_userapi "https://github.com/himanshugour23-dev/review-project/blob/main/app/api/user/me/route.ts"
click node_users "https://github.com/himanshugour23-dev/review-project/blob/main/models/User.ts"
click node_avatar "https://github.com/himanshugour23-dev/review-project/blob/main/lib/avatarModration.ts"
click node_avatarapi "https://github.com/himanshugour23-dev/review-project/blob/main/app/api/user/me/avatar/route.ts"
click node_webhook "https://github.com/himanshugour23-dev/review-project/blob/main/app/api/cloudinary-webhook/route.ts"
click node_checkout "https://github.com/himanshugour23-dev/review-project/blob/main/app/checkoutPageDetails/page.tsx"
click node_checkoutapi "https://github.com/himanshugour23-dev/review-project/blob/main/app/api/checkout/route.ts"
click node_orderapi "https://github.com/himanshugour23-dev/review-project/blob/main/app/api/payment/create-order/route.ts"
click node_callback "https://github.com/himanshugour23-dev/review-project/blob/main/app/api/payment/callback/route.ts"
click node_payments "https://github.com/himanshugour23-dev/review-project/blob/main/models/payment.ts"
click node_razorpaybutton "https://github.com/himanshugour23-dev/review-project/blob/main/components/RazorpayCheckoutButton.tsx"
click node_igdbclient "https://github.com/himanshugour23-dev/review-project/blob/main/lib/igdb.ts"
click node_igdbgames "https://github.com/himanshugour23-dev/review-project/blob/main/models/igdbGames.ts"

classDef toneNeutral fill:#f8fafc,stroke:#334155,stroke-width:1.5px,color:#0f172a
classDef toneBlue fill:#dbeafe,stroke:#2563eb,stroke-width:1.5px,color:#172554
classDef toneAmber fill:#fef3c7,stroke:#d97706,stroke-width:1.5px,color:#78350f
classDef toneMint fill:#dcfce7,stroke:#16a34a,stroke-width:1.5px,color:#14532d
classDef toneRose fill:#ffe4e6,stroke:#e11d48,stroke-width:1.5px,color:#881337
classDef toneIndigo fill:#e0e7ff,stroke:#4f46e5,stroke-width:1.5px,color:#312e81
classDef toneTeal fill:#ccfbf1,stroke:#0f766e,stroke-width:1.5px,color:#134e4a
class node_browse,node_discover,node_discoverapi,node_gameview,node_gameapi,node_gamebrowseapi,node_gamesearchapi,node_creators,node_home toneBlue
class node_reviewapi,node_reviews,node_reactionapi,node_reactions,node_reportapi,node_reports,node_adminqueue,node_adminreports toneAmber
class node_auth,node_authroute,node_profiles,node_userapi,node_users,node_avatar,node_avatarapi,node_webhook toneMint
class node_checkout,node_checkoutapi,node_orderapi,node_callback,node_payments,node_razorpaybutton toneRose
class node_igdbclient,node_igdbgames,node_player toneIndigo
```

### 👤 Users & Profiles

Stores user identity, authentication provider information, profile details, roles, and user-specific game preferences.

### 🎮 IGDB Game Records

Stores game information retrieved from IGDB in the dedicated `igdb_games` collection.

The stored game data includes:

- IGDB game ID
- Game name and slug
- Cover image
- Summary and storyline
- Genres, platforms, themes, game modes, and player perspectives
- Keywords and franchises
- Release date and category
- IGDB rating and rating counts
- Aggregated rating and rating counts
- Screenshots, artworks, and videos
- Similar games and related game information
- Last-fetched timestamp

This allows frequently requested game information to be served from MongoDB instead of repeatedly querying IGDB.

### 🔄 Game and Review Migration

The migration moved the application from the legacy RAWG game collection to the new IGDB game collection.

At a high level, the migration process:

1. Reads existing game and review references from the legacy data.
2. Builds a mapping between legacy RAWG game slugs and their corresponding IGDB game records.
3. Resolves the destination IGDB game document for each existing review.
4. Updates the review's `gameId` reference to the new IGDB document ID.
5. Keeps the existing review documents and user-generated review content rather than recreating reviews.
6. Uses a backup of the original review-to-game references as a recovery point.

The dedicated IGDB model and collection keep the new game schema separate from the legacy RAWG schema.

### ⭐ Reviews & Ratings

Reviews are associated with both users and IGDB game records.

A unique database constraint ensures:

```text
One user → One review → One game
```

### 🚩 Reports & Moderation Queue

Reports are linked to reviews and the reporting user. A unique compound index prevents duplicate reports, and per-user daily rate limits prevent report spam. Reported content is surfaced to administrators through a dedicated review queue.

### 🖼️ Avatar Moderation Pipeline

```text
User selects avatar
        ↓
Stage 1: Gemini API screening (pre-upload)
        ↓ (passes)
Upload to Cloudinary
        ↓
Stage 2: Cloudinary Rekognition (asynchronous moderation)
        ↓ (flagged)
Webhook triggers automatic deletion of the image
```
