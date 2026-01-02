# Ecommerce App

A full-stack ecommerce platform with admin dashboard, REST API, and mobile application. Built for modern online retail operations with product management, order processing, user authentication, and real-time analytics.

## 🚀 Features

### Admin Dashboard
- **Product Management**: Create, read, update, delete products with image uploads
- **Order Management**: View and update order statuses (pending, shipped, delivered)
- **Customer Management**: View customer information and order history
- **Analytics Dashboard**: Real-time statistics for revenue, orders, customers, and products
- **Stock Management**: Track inventory levels with visual status indicators

### API Features
- **RESTful API**: Complete backend API for all ecommerce operations
- **Authentication**: Secure user authentication with Clerk
- **Image Handling**: Cloudinary integration for image storage and optimization
- **Database Integration**: MongoDB with Mongoose ODM
- **Background Jobs**: Inngest integration for webhook handling

### Mobile Application
- **Cross-platform**: Built with Expo and React Native
- **Shopping Experience**: Browse products, manage cart, and place orders
- **User Authentication**: Seamless login/signup experience

## 🛠 Tech Stack

### Frontend (Admin)
- **React 19** - Modern React with latest features
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **DaisyUI** - Component library for Tailwind
- **TanStack Query** - Powerful data fetching and caching
- **React Router** - Client-side routing

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Cloudinary** - Image hosting and optimization
- **Clerk** - Authentication and user management
- **Inngest** - Background job processing
- **Bun** - Fast JavaScript runtime

### Mobile
- **Expo** - React Native framework
- **React Native** - Mobile app development
- **TypeScript** - Type-safe JavaScript

## 📁 Project Structure

```
ecommerce-app/
├── admin/                 # Admin dashboard (React)
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── lib/          # Utilities and API clients
│   │   ├── pages/        # Page components
│   │   └── layouts/      # Layout components
│   ├── package.json
│   └── vite.config.js
├── backend/               # REST API server (Node.js)
│   ├── src/
│   │   ├── config/       # Configuration files
│   │   ├── controllers/  # Route handlers
│   │   ├── middleware/   # Express middleware
│   │   ├── models/       # MongoDB schemas
│   │   ├── routes/       # API routes
│   │   └── seeds/        # Database seeding
│   ├── package.json
│   └── tsconfig.json
└── mobile/                # Mobile app (React Native)
    ├── app/              # Expo Router pages
    ├── components/       # Shared components
    ├── constants/        # App constants
    └── assets/           # Images and fonts
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher)
- **Bun** (for backend development)
- **MongoDB** (local or cloud instance)
- **Cloudinary** account for image storage
- **Clerk** account for authentication

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ecommerce-app
   ```

2. **Backend Setup**
   ```bash
   cd backend
   bun install
   cp .env.example .env  # Configure environment variables
   bun run dev
   ```

3. **Admin Dashboard Setup**
   ```bash
   cd ../admin
   npm install
   cp .env.example .env  # Configure environment variables
   npm run dev
   ```

4. **Mobile App Setup**
   ```bash
   cd ../mobile
   npm install
   npx expo start
   ```

### Environment Variables

#### Backend (.env)
```env
NODE_ENV=development
PORT=3000
DB_URL=mongodb://localhost:27017/ecommerce
CLIENT_URL=http://localhost:5173

# Clerk Authentication
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Inngest
INNGEST_SIGNING_KEY=your_inngest_key
INNGEST_ENVIRONMENT=dev
```

#### Admin (.env)
```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_API_BASE_URL=http://localhost:3000/api
```

## 📚 API Documentation

### Authentication
All admin routes require authentication via Clerk middleware.

### Products API

#### Get All Products
```http
GET /api/admin/products
```

#### Create Product
```http
POST /api/admin/products
Content-Type: multipart/form-data

{
  "name": "Product Name",
  "description": "Product description",
  "price": "29.99",
  "stock": "100",
  "category": "Electronics",
  "images": [file1, file2, file3]
}
```

#### Update Product
```http
PUT /api/admin/products/:id
Content-Type: multipart/form-data
```

#### Delete Product
```http
DELETE /api/admin/products/:id
```

### Orders API

#### Get All Orders
```http
GET /api/admin/orders
```

#### Update Order Status
```http
PATCH /api/admin/orders/:orderId/status
{
  "status": "shipped"
}
```

### Analytics API

#### Get Dashboard Stats
```http
GET /api/admin/stats
```

Response:
```json
{
  "totalRevenue": 12500.50,
  "totalOrders": 150,
  "totalCustomers": 89,
  "totalProducts": 45
}
```

## 🏗 Architecture

### Backend Architecture
- **MVC Pattern**: Models, Views (JSON responses), Controllers
- **Middleware**: Authentication, file upload, CORS, error handling
- **Database**: MongoDB with Mongoose schemas
- **File Storage**: Cloudinary for image optimization and CDN
- **Authentication**: Clerk for user management and JWT tokens

### Frontend Architecture
- **Component-Based**: Reusable React components
- **State Management**: TanStack Query for server state
- **Routing**: React Router for navigation
- **Styling**: Tailwind CSS with DaisyUI components
- **API Integration**: Axios for HTTP requests

### Data Flow
1. User interacts with React components
2. Components trigger API calls via TanStack Query
3. Backend validates requests and processes data
4. Database operations via Mongoose
5. Responses sent back through the API layer
6. UI updates with fresh data

## 🔧 Development

### Available Scripts

#### Backend
```bash
bun run dev      # Development server with hot reload
bun run start    # Production server
bun run seed     # Seed database with sample data
```

#### Admin
```bash
npm run dev      # Development server
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

#### Mobile
```bash
npx expo start    # Start Expo development server
npx expo build    # Build for production
```

### Database Seeding
```bash
cd backend
bun run seed
```

This creates sample products, users, and orders for development.

## 🧪 Testing

### Backend Testing
```bash
cd backend
bun test  # Run test suite
```

### Frontend Testing
```bash
cd admin
npm run test  # Run Jest tests
```

## 🚀 Deployment

### Backend Deployment
1. Set production environment variables
2. Build the application: `bun run build`
3. Start production server: `bun run start`

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy `dist/` folder to your hosting provider
3. Configure environment variables for production

### Mobile Deployment
1. Configure app.json for production
2. Build with EAS: `npx eas build --platform ios/android`
3. Submit to app stores

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Follow ESLint configuration
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Use TypeScript for type safety (mobile app)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - UI library
- [Express.js](https://expressjs.com/) - Web framework
- [MongoDB](https://www.mongodb.com/) - Database
- [Cloudinary](https://cloudinary.com/) - Image management
- [Clerk](https://clerk.com/) - Authentication
- [Bun](https://bun.sh/) - JavaScript runtime

## 📞 Support

For support, email support@ecommerceapp.com or join our Discord community.

---

Built with ❤️ for modern ecommerce experiences</content>
<parameter name="filePath">c:\Users\emmanuel\Desktop\ecommerce-app\README.md