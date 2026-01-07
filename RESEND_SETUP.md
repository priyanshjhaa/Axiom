# 📧 Email Feature Setup Guide - Resend

## ✅ What's Been Implemented

1. ✅ Installed Resend SDK
2. ✅ Created email API route (`/api/proposals/[id]/send-email`)
3. ✅ Professional email template with AXIOM branding
4. ✅ PDF generation and attachment
5. ✅ Updated frontend to send emails

## 🔧 Setup Steps

### Step 1: Get Your Resend API Key

1. Go to [resend.com](https://resend.com)
2. Sign up for a free account (3,000 emails/month)
3. Go to **API Keys** section
4. Click **Create API Key**
5. Copy your API key

### Step 2: Update .env File

Replace the placeholder in your `.env` file:

```env
RESEND_API_KEY=re_xxxxxxxxxxxxx
```

**Example:**
```env
RESEND_API_KEY=re_9jK3nN2mP8qR5tW7yV1bC3dF6gH0jK2m
```

### Step 3: Restart Your Dev Server

**IMPORTANT:** Environment variables are only loaded when the server starts!

1. Stop your dev server (Ctrl+C)
2. Run `npm run dev` again

### Step 4: Test the Email Feature

1. Go to any proposal page
2. Click **"Send to Client"** button
3. Check the client's email inbox
4. You should see a professional email with:
   - AXIOM branding
   - Proposal details
   - PDF attachment

## 📧 What the Email Looks Like

**Subject:** Project Proposal: [Project Name]

**Includes:**
- ✅ Professional greeting
- ✅ Project highlights box
- ✅ Proposal summary
- ✅ PDF attachment
- ✅ AXIOM branding

## 🎨 Customize Your Email

### Change Sender Email

Edit `/api/proposals/[id]/send-email/route.ts` line 220:

```typescript
from: 'Your Name <you@yourdomain.com>', // Replace this
```

**Note:** To use your own domain, you'll need to:
1. Add your domain in Resend dashboard
2. Verify your DNS records
3. Then use your domain in the `from` field

### Customize Email Template

Edit the `emailHtml` variable in the same file to change:
- Colors
- Text
- Layout
- Add your logo

## 🔍 Troubleshooting

### "Failed to send email" Error

**Check 1:** Is RESEND_API_KEY set correctly?
```bash
# Run this to check
cat .env | grep RESEND_API_KEY
```

**Check 2:** Did you restart the dev server?
Environment variables only load on startup!

**Check 3:** Is the API key valid?
- Go to Resend dashboard
- Check your API key is active

### Email Not Received

**Check 1:** Check spam folder
- The email might be in spam/promotions

**Check 2:** Verify client email
- Make sure the client's email address is correct

**Check 3:** Check Resend dashboard
- Go to Logs section
- See if the email was sent
- Check for any errors

## 📊 Usage Limits

**Free Tier:**
- 3,000 emails/month
- 1 email/second
- Perfect for starting out

**When you need more:**
- Pro: $20/month (50,000 emails)
- Business: $80/month (300,000 emails)

## 🚀 Next Steps

Once you're ready to go to production:

1. Add your custom domain
2. Verify DNS records
3. Update sender email
4. Test with real client emails

## 💡 Tips

- Always test with your own email first
- Check Resend dashboard for email logs
- Monitor open/click rates
- Keep email template professional
- PDF is automatically generated and attached

---

**Need Help?**
- Resend Docs: https://resend.com/docs
- Support: support@resend.com
