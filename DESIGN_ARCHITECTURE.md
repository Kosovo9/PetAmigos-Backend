# PetMatch Global - Design & Architecture Document

## 1. Visual Design System

### Color Palette (Modern & Pet-Friendly)

The platform adopts a **vibrant yet professional** color scheme that reflects the joy of pet ownership while maintaining enterprise-grade credibility.

| Element | Color | Hex | Usage |
|---------|-------|-----|-------|
| **Primary Brand** | Warm Orange | `#FF6B35` | CTAs, highlights, pet-related actions |
| **Secondary** | Soft Purple | `#8B5CF6` | Complementary actions, premium features |
| **Accent** | Teal/Cyan | `#06B6D4` | Real-time indicators, live features |
| **Success** | Emerald Green | `#10B981` | Verification badges, health status |
| **Background** | Off-White | `#F9FAFB` | Main canvas |
| **Dark Text** | Charcoal | `#1F2937` | Primary text |
| **Light Text** | Gray | `#6B7280` | Secondary text |
| **Border** | Light Gray | `#E5E7EB` | Dividers, subtle separation |

### Typography

- **Headlines**: Inter Bold (24-32px) - Modern, clean, energetic
- **Body**: Inter Regular (14-16px) - Readable, professional
- **Accent**: Poppins SemiBold (12-14px) - Pet names, achievements
- **Mono**: JetBrains Mono (12px) - Technical elements, codes

### Design Tokens

```css
@theme {
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.15);
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
}
```

### Layout Philosophy

**For Public-Facing Pages (Discovery, Marketplace):**
- Asymmetric hero sections with pet imagery
- Card-based grid layouts for pet profiles
- Sticky map sidebar for geolocation features
- Contextual CTAs aligned with user journey

**For Social Features (Feed, Messaging):**
- Vertical feed layout (TikTok/Instagram-inspired)
- Floating action buttons for quick interactions
- Bottom navigation for mobile (pet discovery, messages, profile)
- Smooth transitions between states

**For Dashboard/Admin:**
- Sidebar navigation (persistent)
- Top breadcrumb trail
- Widget-based analytics
- Quick-action toolbar

---

## 2. Database Architecture (Pet-ID 2.0)

### Core Entities

```sql
-- Users (Pet Owners)
users {
  id: int (PK)
  openId: varchar (OAuth identifier)
  email: varchar
  name: varchar
  bio: text
  location: point (geospatial)
  avatar_url: varchar (S3)
  role: enum (user, admin)
  preferences: json (language, notifications, etc)
  created_at: timestamp
  updated_at: timestamp
}

-- Pets (Pet-ID 2.0)
pets {
  id: int (PK)
  owner_id: int (FK)
  name: varchar
  species: enum (dog, cat, bird, reptile, exotic)
  breed: varchar
  temperament: json (playful, calm, aggressive, friendly, etc)
  date_of_birth: date
  gender: enum (male, female)
  location: point (geospatial)
  bio: text
  photos: json (array of S3 URLs)
  pedigree_data: json (lineage, certifications)
  health_status: json (vaccinated, microchipped, etc)
  avatar_url: varchar (AI-generated or uploaded)
  personality_vector: vector (for AI matching)
  created_at: timestamp
  updated_at: timestamp
}

-- Health Records (Verification)
health_records {
  id: int (PK)
  pet_id: int (FK)
  record_type: enum (vaccine, microchip, surgery, checkup)
  provider: varchar (veterinary clinic)
  certificate_url: varchar (S3)
  certificate_hash: varchar (for verification)
  verified_by_ai: boolean
  verified_at: timestamp
  expiry_date: date
  created_at: timestamp
}

-- Matches (Pet-to-Pet Compatibility)
matches {
  id: int (PK)
  pet_a_id: int (FK)
  pet_b_id: int (FK)
  compatibility_score: float (0-100)
  match_reason: json (breed, location, temperament)
  interaction_count: int
  last_interaction: timestamp
  created_at: timestamp
}

-- Connections (Owner-to-Owner)
connections {
  id: int (PK)
  user_a_id: int (FK)
  user_b_id: int (FK)
  connection_type: enum (following, friend, blocked)
  mutual: boolean
  created_at: timestamp
}

-- Love Stories (Adoption Stories)
love_stories {
  id: int (PK)
  pet_id: int (FK)
  owner_id: int (FK)
  title: varchar
  description: text
  photos: json (array of S3 URLs)
  likes: int
  comments_count: int
  verified: boolean
  created_at: timestamp
}

-- Playdates (Events)
playdates {
  id: int (PK)
  organizer_id: int (FK)
  pet_ids: json (array of pet IDs)
  location: point (geospatial)
  scheduled_at: timestamp
  duration_minutes: int
  status: enum (pending, confirmed, completed, cancelled)
  created_at: timestamp
}

-- Marketplace Listings
marketplace_listings {
  id: int (PK)
  seller_id: int (FK)
  product_name: varchar
  category: enum (food, toys, accessories, services)
  price: decimal
  affiliate_source: enum (amazon, mercado_libre, temu)
  affiliate_link: varchar
  commission_rate: float
  created_at: timestamp
}

-- Subscriptions (Monetization)
subscriptions {
  id: int (PK)
  user_id: int (FK)
  tier: enum (free, basic, premium, enterprise)
  stripe_subscription_id: varchar
  status: enum (active, cancelled, expired)
  renews_at: timestamp
  created_at: timestamp
}
```

### Geospatial Indexing

All location-based queries use MySQL's spatial indexes for O(log n) performance:

```sql
CREATE SPATIAL INDEX idx_pet_location ON pets(location);
CREATE SPATIAL INDEX idx_user_location ON users(location);
```

### Vector Search for AI Matching

Pet personality vectors (768-dimensional embeddings) enable semantic similarity search:

```sql
CREATE INDEX idx_pet_personality ON pets USING HNSW (personality_vector);
```

---

## 3. API Architecture (tRPC Procedures)

### Authentication Layer

```typescript
publicProcedure        // No auth required
protectedProcedure     // User must be authenticated
adminProcedure         // Admin-only access
```

### Feature Routers

| Router | Procedures | Purpose |
|--------|-----------|---------|
| **auth** | me, logout | OAuth flow, session management |
| **users** | getProfile, updateProfile, search | User management |
| **pets** | create, getById, list, update, delete | Pet profile CRUD |
| **health** | uploadCertificate, verify, getHistory | Health verification |
| **matches** | getSuggestions, getCompatibility, record | Matching engine |
| **social** | getFeed, like, comment, follow | Social interactions |
| **playdates** | create, list, join, cancel | Event management |
| **chat** | sendMessage, getHistory, getConversations | Real-time messaging |
| **marketplace** | list, search, purchase, trackAffiliate | Commerce |
| **subscriptions** | getCurrentTier, upgrade, cancel | Monetization |

---

## 4. Real-Time Architecture (Socket.io)

### Events

**Client → Server:**
- `chat:message` - Send message
- `location:update` - Update user location
- `match:interact` - Record interaction with match
- `playdate:join` - Join event

**Server → Client:**
- `chat:new_message` - Incoming message
- `match:nearby_pets` - New pets nearby
- `playdate:updated` - Event status change
- `notification:alert` - System notifications

---

## 5. AI Integration Points

### LLM Usage

1. **Pet Personality Assessment** - Analyze user inputs to create personality vectors
2. **Compatibility Analysis** - Compare two pets and explain match reasoning
3. **Health Certificate Validation** - OCR + validation of veterinary documents
4. **Breeding Recommendations** - Responsible breeding compatibility
5. **Content Moderation** - Review love stories and comments

### Vector Embeddings

- Pet personality profiles stored as 768-dimensional vectors
- Similarity search for "find similar pets" feature
- Clustering for community discovery

---

## 6. Monetization Flows

### Revenue Streams

| Stream | Implementation | Target |
|--------|----------------|--------|
| **Premium Subscriptions** | Stripe recurring | $9.99-$49.99/month |
| **GeoAds** | Regional targeting dashboard | $500-$5000/month per country |
| **Affiliate Commissions** | Amazon/Mercado Libre/Temu links | 5-20% per sale |
| **Microinfluencer Program** | 20% commission on referrals | Scalable |
| **Course Sales** | Stripe one-time payments | $29-$999 per course |
| **Premium Listings** | Featured placement in marketplace | $49-$199/month |

### Stripe Integration

- Subscription management via Stripe webhooks
- Automated payout to microinfluencers
- Invoice generation and tracking

---

## 7. Security & Verification

### Identity Verification

1. **Pet Ownership** - Email verification + photo of pet with owner
2. **Health Certificates** - AI-powered OCR validation + veterinary database cross-reference
3. **Microchip Verification** - Integration with pet registry databases
4. **User KYC** - For marketplace sellers and microinfluencers

### Data Protection

- All PII encrypted at rest (AES-256)
- HTTPS/TLS for all communications
- JWT tokens for API authentication
- Rate limiting on sensitive endpoints

---

## 8. Performance & Scalability

### Caching Strategy

- **Redis** for session management and real-time data
- **ISR (Incremental Static Regeneration)** for SEO pages
- **CDN** for static assets and images

### Database Optimization

- Connection pooling (MySQL2 with 10 connections)
- Query result caching (1-hour TTL for non-critical data)
- Batch operations for bulk inserts
- Lazy loading for nested relationships

### Frontend Performance

- Code splitting by route
- Image optimization (WebP, AVIF formats)
- Lazy loading below-the-fold content
- Service Worker for offline support

---

## 9. Multi-Language & Geolocation

### Supported Languages (20)

Spanish (MX, ES, AR, CO, CL), English (US, GB, CA, AU), Portuguese (BR, PT), French (FR, CA), German, Italian, Japanese, Korean, Chinese (Simplified), Russian, Arabic.

### Automatic Routing

Middleware detects user country via Cloudflare/Vercel headers and routes to appropriate locale with localized currency, content, and ads.

---

## 10. Deployment Architecture

### Stack

- **Frontend**: Next.js 15 (App Router), React 19, Tailwind CSS 4
- **Backend**: Express 4, tRPC 11, Node.js 20+
- **Database**: MySQL 8 (Manus-managed)
- **Storage**: S3 (Manus-managed)
- **Real-Time**: Socket.io
- **Payments**: Stripe
- **Maps**: Google Maps API (Manus proxy)
- **LLM**: Manus built-in LLM service
- **Hosting**: Manus platform (auto-scaling)

### Environment Variables

```
DATABASE_URL=mysql://...
JWT_SECRET=...
STRIPE_SECRET_KEY=...
STRIPE_WEBHOOK_SECRET=...
BUILT_IN_FORGE_API_KEY=...
VITE_FRONTEND_FORGE_API_KEY=...
```

---

## 11. Development Workflow

1. **Schema First** - Update `drizzle/schema.ts`, run `pnpm db:push`
2. **API Layer** - Add procedures in `server/routers.ts`
3. **Frontend** - Build UI in `client/src/pages/`
4. **Testing** - Write Vitest specs in `server/*.test.ts`
5. **Deployment** - Create checkpoint, publish via Manus UI

---

## 12. Success Metrics

- **Engagement**: DAU > 10K within 6 months
- **Retention**: 30-day retention > 40%
- **Monetization**: ARPU > $5/month
- **Performance**: Lighthouse score > 90
- **Availability**: 99.9% uptime
