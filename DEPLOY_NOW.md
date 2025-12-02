# 🚀 QUICK START - DEPLOY NOW

## ⚡ FASTEST PATH TO PRODUCTION (30 MIN)

### **1. Deploy Frontend (5 min)**

```bash
cd client
vercel --prod
```

When prompted:
- Set up and deploy? **Y**
- Which scope? **Your account**
- Link to existing project? **N**
- Project name? **petmatch-fun**
- Directory? **./client** or **./**
- Override settings? **N**

After deployment:
1. Go to Vercel Dashboard → Project Settings → Environment Variables
2. Add these variables:
```
NEXT_PUBLIC_API_URL=https://petmatch-backend.onrender.com
NEXT_PUBLIC_STRIPE_KEY=pk_test_xxx
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
```

### **2. Deploy Backend (10 min)**

1. Go to https://render.com/dashboard
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name:** petmatch-backend
   - **Environment:** Node
   - **Build Command:** `cd server && npm install`
   - **Start Command:** `cd server && npm start`
   - **Plan:** Free

5. Add Environment Variables (click "Environment" tab):
```
MONGO_URI=mongodb+srv://your-connection-string
GOOGLE_AI_API_KEY=your-key
JWT_SECRET=your-secret-key-here
CLIENT_URL=https://www.petmatch.fun
PORT=5000
```

### **3. Configure Domain (5 min)**

**In Cloudflare:**
1. Go to DNS settings
2. Add CNAME record:
   - Type: CNAME
   - Name: www
   - Content: cname.vercel-dns.com
   - Proxy: ON

**In Vercel:**
1. Go to Project Settings → Domains
2. Add: `www.petmatch.fun`
3. Add: `petmatch.fun` (auto-redirects to www)

### **4. Test Everything (10 min)**

Visit: https://www.petmatch.fun

Test:
- [ ] Homepage loads
- [ ] Can create account
- [ ] Can generate photo (free tier)
- [ ] Affiliate dashboard works
- [ ] QR code generator works
- [ ] Payment flow works

---

## 🎯 **LAUNCH CHECKLIST**

### **Before Going Live:**
- [ ] All environment variables set
- [ ] Domain pointing correctly
- [ ] SSL certificate active (auto by Vercel)
- [ ] Backend health check passing
- [ ] Test payment with Stripe test mode
- [ ] Verify email notifications work

### **After Going Live:**
- [ ] Post on Reddit (5 subreddits)
- [ ] Post on TikTok (3 videos)
- [ ] Submit to Product Hunt
- [ ] Share in Facebook groups (10 groups)
- [ ] Post on Instagram

---

## 💰 **FIRST WEEK GOALS**

- **Users:** 1,000
- **Conversions:** 50 (5%)
- **Revenue:** $500 - $2,000
- **Affiliates:** 10

---

## 🆘 **TROUBLESHOOTING**

### **Frontend not loading?**
- Check Vercel deployment logs
- Verify environment variables
- Check DNS propagation (can take up to 48h)

### **Backend errors?**
- Check Render logs
- Verify MongoDB connection string
- Ensure all env vars are set

### **Payments not working?**
- Verify Stripe keys (test vs live)
- Check webhook configuration
- Review Stripe dashboard logs

---

## 📞 **SUPPORT**

If you need help:
1. Check deployment logs first
2. Review error messages
3. Test with curl/Postman
4. Check browser console

---

**LET'S GO! 🚀**
