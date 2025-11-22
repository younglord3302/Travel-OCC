# 🛒 Travel-OCC E-commerce Application

A modern, full-stack e-commerce application built with Next.js 16, featuring product catalog, shopping cart, user authentication, and payment processing. Designed for travel and lifestyle products with a responsive design and dark mode support.

## 🌟 Features

### 🎨 User Experience
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Dark/Light Mode** - Theme switching with next-themes
- **Modern UI** - Built with Radix UI components and Lucide icons
- **Accessibility** - WCAG compliant components and navigation

### 🛍️ E-commerce Features
- **Product Catalog** - Browse products by categories
- **Shopping Cart** - Add, update, remove items with persistent state
- **Search & Filters** - Find products quickly with search functionality
- **Wishlists** - Save favorite products
- **Order Management** - Track orders and order history

### 🔐 Security & Authentication
- **NextAuth Integration** - Multiple authentication providers
- **Secure Sessions** - Protected routes and API endpoints
- **Input Validation** - Zod schemas for data validation

### 💳 Payments (Optional)
- **Stripe Integration** - Ready for payment processing
- **Cart Checkout** - Complete order flow

### 🧪 Development Tools
- **TypeScript** - Full type safety
- **Jest Testing** - Comprehensive test suites
- **ESLint** - Code quality enforcement
- **Prisma ORM** - Type-safe database integration

## 🚀 Tech Stack

### Frontend
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **UI Components:** Radix UI
- **Icons:** Lucide React
- **Theme:** next-themes

### Backend
- **Runtime:** Next.js API Routes
- **Database:** Prisma with SQLite/PostgreSQL
- **Authentication:** NextAuth.js
- **Payments:** Stripe
- **Validation:** Zod

### Development & Testing
- **Testing:** Jest + React Testing Library
- **Linting:** ESLint
- **Styling:** PostCSS
- **Type Checking:** TypeScript

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js** 18+ installed
- **npm**, **yarn**, or **pnpm** package manager
- **Git** for version control

## 🛠️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/younglord3302/Travel-OCC.git
   cd ecommerce-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:

   ```env
   # Database
   DATABASE_URL="file:./dev.db"

   # NextAuth.js
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key"

   # Stripe (optional)
   STRIPE_PUBLIC_KEY="pk_test_..."
   STRIPE_SECRET_KEY="sk_test_..."
   STRIPE_WEBHOOK_SECRET="whsec_..."

   # Optional: Other providers
   GITHUB_CLIENT_ID=""
   GITHUB_CLIENT_SECRET=""
   GOOGLE_CLIENT_ID=""
   GOOGLE_CLIENT_SECRET=""
   ```

4. **Database Setup**
   ```bash
   # Generate Prisma Client
   npx prisma generate

   # Run migrations
   npx prisma migrate dev

   # Seed the database
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

6. **Access the application**
   Open [http://localhost:3000](http://localhost:3000) in your browser

## 🧪 Testing

Run the test suite:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage
```

## 📁 Project Structure

```
ecommerce-app/
├── prisma/                 # Database schema and migrations
├── public/                 # Static assets
├── scripts/                # Database seeding scripts
├── src/
│   ├── app/               # Next.js app router pages
│   │   ├── api/          # API routes
│   │   ├── auth/         # Authentication pages
│   │   ├── cart/         # Shopping cart page
│   │   ├── checkout/     # Checkout page
│   │   ├── products/     # Product pages
│   │   └── orders/       # Order management
│   ├── components/       # Reusable React components
│   │   ├── layout/      # Layout components (Header, etc.)
│   │   ├── theme/       # Theme provider and toggle
│   │   └── ui/          # shadcn/ui components
│   ├── lib/             # Utilities and configurations
│   │   ├── auth.ts      # NextAuth configuration
│   │   ├── prisma.ts    # Database client
│   │   └── utils.ts     # Helper functions
│   └── types/           # TypeScript type definitions
├── __tests__/            # Test files
└── tailwind.config.js    # Tailwind configuration
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run Jest tests
- `npm run db:seed` - Seed the database

## 🚢 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on git push

### Other Platforms
This app can be deployed to any platform supporting Node.js:
- AWS, Azure, Google Cloud
- DigitalOcean, Railway
- Netlify (with some modifications)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Code Quality

- **TypeScript:** Strict TypeScript configuration
- **Linting:** ESLint with Next.js rules
- **Testing:** Jest with React Testing Library
- **Formatting:** Prettier (via Tailwind CSS class sorting)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

If you have any questions or need help:
- Create an [issue](https://github.com/younglord3302/Travel-OCC/issues)
- Contact the maintainer via email

---

**Happy Shopping! 🛍️**
