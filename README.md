# VaultGG: Game Review & Collection Platform

VaultGG is a full-stack, API-first platform built for gamers to discover, rate, review, and track their personal video game collections. Built as a Progressive Web App (PWA), the platform features robust caching mechanisms, role-based moderation, and dynamic catalogs that enrich organically over time.
## 🚀 Live Demo & Repository
- **Live Demo:** [vaultgg-b.vercel.app](https://vaultgg-b.vercel.app)
- **GitHub Repository:** [github.com/himanshugour23-dev/Review-Project](https://github.com/himanshugour23-dev/Review-Project)
## ✨ Features

- **Progressive Web App (PWA):** Fully installable on desktop and mobile devices for a native application experience.
- **Smart API Caching Layer:** Features an optimized caching framework wrapping around the external **RAWG API**. Fetched game data is persisted into MongoDB to minimize redundant third-party API limits and accelerate repeat search query performance.
- **Role-Based Access Control (RBAC):** Separate tiers for standard users and administrators. Admins have dedicated moderation tools to enforce platform content guidelines and manage community reviews.
- **Comprehensive Catalog Management:** Seamless interfaces handling user lists, detailed game metadata, custom ratings, and profile customizations.
- **Organic Catalog Building:** Designed to grow its local database richness progressively as users interact with, search for, and cache new game data over time.
## 🛠️ Tech Stack
- **Frontend:** React.js, Next.js (App Router), Tailwind CSS
- **Backend:** Node.js, Next.js API Routes / Server Actions
- **Authentication:** NextAuth.js (Role-based session management)
- **Database:** MongoDB (Mongoose ODM)
- **External API Integrations:** RAWG Video Games Database API
## 🏗️ Architecture & Database Design
VaultGG relies on an integrated relational-document hybrid structure within MongoDB to track:
- **Users & Profiles:** Handles standard credentials and NextAuth session attributes.
- **Game Cache:** Acts as a mirror for raw third-party data, containing titles, descriptions, genres, and artwork.
- **User Collections:** Tracks custom user lists (e.g., *Backlog*, *Completed*, *Playing*).
- **Reviews & Ratings:** Tracks continuous feedback loops provided by platform members.
## 🏁 Getting Started
### Prerequisites
Make sure you have the following installed on your machine:
- **Node.js** (v18.x or higher recommended)
- **npm**, **yarn**, **pnpm**, or **bun**
- A **MongoDB Atlas** URI or a local MongoDB instance
- A **RAWG API Key** (Get one for free at [rawg.io/apidocs](https://rawg.io/apidocs))

### 1. Clone the Repository
```bash
git clone [https://github.com/himanshugour23-dev/Review-Project.git](https://github.com/himanshugour23-dev/Review-Project.git)
cd Review-Project
