# AXIOM

**Transform simple project descriptions into professional proposals and invoices — ready to share, track, and get approved.**

Axiom is an AI-powered proposal and invoice generation platform designed for freelancers and small businesses. Create professional documents in seconds, track client engagement, and close deals faster.

---

## ✨ Features

### 🤖 AI-Powered Proposal Generation
- Transform rough project ideas into polished proposals
- Simply describe your project in natural language
- AI generates comprehensive proposals with scope, timeline, and pricing
- Multi-currency support (USD, EUR, GBP, INR, AUD, CAD, SGD, JPY, AED)

### 📄 One-Click Invoice Generation
- Generate matching invoices from approved proposals instantly
- Export professional PDFs ready for email or printing
- Flexible line items, tax rates, and terms
- Automatic calculation of subtotals, taxes, and totals

### 🔗 Secure Link Sharing
- Share proposals and invoices via secure access links
- No account required for clients to view and sign
- Professional email delivery with PDF attachments
- Track every interaction with your documents

### ✍️ Digital Signatures
- Capture legally-binding signatures directly on proposals
- Dual signature workflow (freelancer + client)
- Real-time signature status tracking
- Complete audit trail with timestamps

### 📊 Activity Timeline
- Track every proposal event in real-time
- Know exactly when clients view your proposals
- Complete history: created, shared, viewed, signed, invoiced
- View aggregation for analytics without clutter

### 💾 PDF Export
- Download publication-ready PDFs
- Perfect for email attachments, printing, or archiving
- Professional formatting with your branding
- Font-safe currency codes for universal compatibility

### 🎯 Dashboard Management
- Overview of all proposals and invoices
- Bulk operations for power users
- Quick actions and statistics
- Real-time status updates

---

## 🚀 Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** NextAuth.js (GitHub & Google OAuth)
- **AI:** Groq API for proposal generation
- **State Management:** React Query (@tanstack/react-query)
- **Styling:** Tailwind CSS
- **PDF Generation:** jsPDF
- **Hosting:** Vercel

---

## 📦 Installation

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database
- Groq API key
- GitHub OAuth app (for authentication)
- Google OAuth app (optional)

### Clone & Install
```bash
git clone https://github.com/yourusername/axiom.git
cd axiom
npm install
```

### Environment Variables
Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/axiom"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret"

# OAuth Providers
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Groq AI
GROQ_API_KEY="your-groq-api-key"
```

### Database Setup
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# (Optional) Seed database
npx prisma db seed
```

### Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🏗️ Project Structure

```
axiom/
├── prisma/
│   └── schema.prisma          # Database schema
├── public/
│   └── images/                # Static assets
├── src/
│   ├── app/
│   │   ├── api/               # API routes
│   │   │   ├── proposals/     # Proposal CRUD & operations
│   │   │   ├── invoices/      # Invoice CRUD
│   │   │   └── auth/          # NextAuth configuration
│   │   ├── dashboard/         # Main dashboard
│   │   ├── proposals/         # Proposal pages
│   │   ├── invoices/          # Invoice pages
│   │   ├── create-proposal/   # Proposal creation flow
│   │   ├── share/             # Shared proposal/invoice pages
│   │   └── page.tsx           # Landing page
│   ├── components/
│   │   ├── Layout.tsx         # Main layout with navigation
│   │   ├── CosmicBackground.tsx
│   │   └── ShareModal.tsx     # Share functionality
│   └── lib/
│       ├── prisma.ts          # Prisma client
│       └── utils.ts           # Utility functions
└── package.json
```

---

## 🎯 Core Workflows

### 1. Creating a Proposal
1. Sign in via GitHub or Google
2. Click "Create Proposal" on dashboard
3. Describe your project in simple terms
4. AI generates complete proposal with:
   - Project scope
   - Timeline
   - Pricing breakdown
   - Terms and conditions
5. Review and edit as needed
6. Save as draft or proceed to send

### 2. Sharing with Clients
1. Open proposal from dashboard
2. Click "Share with Client"
3. Enter client email address
4. System generates secure access link
5. Email sent automatically with link and PDF attachment

### 3. Client Interaction
- Client views proposal via secure link
- View is logged in activity timeline
- Client can review all details
- Client signs digitally
- Freelancer notified of signature

### 4. Generating Invoices
1. Open signed proposal
2. Click "Generate Invoice"
3. System creates invoice with:
   - All line items from proposal
   - Tax calculations
   - Payment terms
   - Currency preserved from proposal
4. Share with client via secure link
5. Export as PDF for records

### 5. Tracking Activity
- View activity timeline on any proposal
- See complete history:
  - When proposal was created
  - When it was shared
  - How many times it was viewed
  - When it was signed
  - When invoice was generated

---

## 🔐 Authentication

Axiom uses NextAuth.js for secure authentication:

- **GitHub OAuth** - Sign in with GitHub account
- **Google OAuth** - Sign in with Google account
- **Session Management** - Secure session handling
- **Protected Routes** - Dashboard and proposal pages require auth

---

## 📊 Database Schema

### Core Models
- **User** - User accounts and profiles
- **Proposal** - Proposal documents with AI content
- **Invoice** - Generated invoices linked to proposals
- **ProposalView** - Individual proposal views (analytics)
- **Activity** - Activity timeline events

### Key Relationships
- Proposals → Invoices (One-to-Many)
- Proposals → ProposalViews (One-to-Many)
- Proposals → Activities (One-to-Many)
- User → Proposals (One-to-Many)

---

## 🎨 Design Philosophy

- **Minimal & Clean** - Focus on content, not chrome
- **Consistent Theming** - Monochromatic with subtle accents
- **Responsive Design** - Mobile-first approach
- **Smooth Animations** - Micro-interactions for polish
- **Accessibility** - WCAG compliant color contrasts
- **Performance** - Optimized images, lazy loading, caching

---

## 🔧 Configuration

### Groq AI Integration
```typescript
// Uses Groq API for proposal generation
// Model: Llama 3.3 70B
// Features: Fast inference, structured output
```

### Email Configuration
```typescript
// Uses Resend for email delivery
// Automatic email triggers:
// - Proposal shared
// - Proposal viewed
// - Proposal signed
// - Invoice generated
```

---

## 📝 API Endpoints

### Proposals
- `GET /api/proposals/generate` - List user proposals
- `POST /api/proposals/generate` - Create AI proposal
- `GET /api/proposals/[id]` - Get proposal details
- `PUT /api/proposals/[id]` - Update proposal
- `DELETE /api/proposals/[id]` - Delete proposal
- `POST /api/proposals/[id]/send` - Share with client
- `POST /api/proposals/[id]/sign` - Sign proposal
- `POST /api/proposals/[id]/view` - Log proposal view
- `GET /api/proposals/[id]/timeline` - Get activity timeline

### Invoices
- `GET /api/invoices` - List user invoices
- `GET /api/invoices/[id]` - Get invoice details
- `POST /api/proposals/[id]/generate-invoice` - Generate invoice

### Auth
- `GET /api/auth/session` - Get current session
- `POST /api/auth/signout` - Sign out

---

## 🚢 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Environment Variables on Vercel
Set all environment variables in Vercel dashboard:
- `DATABASE_URL` - Production PostgreSQL connection
- `NEXTAUTH_URL` - Your domain
- `NEXTAUTH_SECRET` - Generate with `openssl rand -base64 32`
- OAuth credentials
- `GROQ_API_KEY`

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👥 Authors

- **Priyansh Jha** - *Initial work* - [GitHub](https://github.com/yourusername)

---

## 🙏 Acknowledgments

- Groq AI for fast, intelligent proposal generation
- Next.js team for the amazing framework
- Prisma team for the excellent ORM
- Vercel for hosting and deployment tools

---

## 📞 Support

For support, email hello@axiom.app or open an issue on GitHub.

---

**Built with ❤️ for freelancers and small businesses**
