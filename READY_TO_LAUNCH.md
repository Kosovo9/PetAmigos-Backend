# 🚀 READY TO LAUNCH CHECKLIST

## 🛑 CRITICAL: MISSING KEYS
Your app is **technically ready**, but it needs FUEL (API Keys) to run.
Open `client/.env.local` and `server/.env` and fill these in:

### 1. CLERK AUTH (Required for Login)
- [ ] `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- [ ] `CLERK_SECRET_KEY`
Get them here: https://dashboard.clerk.com

### 2. PAYMENTS (Required for Money)
- [ ] `STRIPE_SECRET_KEY`
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- [ ] `LEMON_SQUEEZY_API_KEY` (Optional for global)

### 3. AI GENERATION (Required for Photos)
- [ ] `GOOGLE_AI_KEY` (Gemini)
- [ ] `HUGGINGFACE_KEY` (Backup)

## 🏃‍♂️ HOW TO START FOR FIELD TEST

1. **Start Backend:**
   ```bash
   cd server
   npm start
   ```

2. **Start Frontend:**
   ```bash
   cd client
   npm start
   ```

3. **Verify:**
   - Go to `http://localhost:3000`
   - Try "Sign In" (Should show Clerk)
   - Try "Generar Fotos" (Should ask for payment/credits)
