# 📚 Narrative Wiki

> A full-stack web application for writers to organize characters, places, and plot points in their stories.

![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-6.0-green?style=flat-square&logo=mongodb)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=flat-square&logo=tailwind-css)

**[Live Demo](https://wonderland-navy.vercel.app)** | **[Video Walkthrough](#)** _(add your video link)_

---

## 🎯 Overview

Narrative Wiki is a comprehensive tool designed for writers, storytellers, and worldbuilders to manage the complex elements of their narratives. Keep track of characters, locations, plot points, and their relationships all in one organized space.

### Key Features

- 🔐 **Secure Authentication** - Google OAuth integration via NextAuth
- 👥 **Character Management** - Create detailed character profiles with images
- 🗺️ **Location Tracking** - Document places with atmosphere, history, and significance
- 📖 **Plot Organization** - Outline story arcs, events, and narrative structure
- 🔍 **Global Search** - Quickly find any element across your entire narrative
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- 🖼️ **Image Uploads** - Add visual references via Cloudinary integration
- 📊 **Dashboard Analytics** - Track your worldbuilding progress at a glance

---

## 🚀 Demo

### Screenshots

**Dashboard**
_Screenshot of main dashboard here_

**Character Management**
_Screenshot of character page here_

**Search & Organization**
_Screenshot of search functionality here_

---

## 🛠️ Tech Stack

### Frontend

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **UI Components:** Lucide React Icons
- **State Management:** React Hooks

### Backend

- **Runtime:** Node.js
- **API:** Next.js API Routes
- **Database:** MongoDB with Mongoose
- **Authentication:** NextAuth.js (Google OAuth)
- **File Storage:** Cloudinary

### DevOps

- **Deployment:** Vercel
- **Version Control:** Git/GitHub
- **Environment Management:** Vercel Environment Variables

---

## 📋 Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- MongoDB Atlas account (or local MongoDB)
- Google Cloud Console project for OAuth
- Cloudinary account for image uploads

---

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/narrative-wiki.git
cd narrative-wiki
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env` file in the root directory:

```env
# MongoDB
MONGODB_URI=your_mongodb_connection_string

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_generated_secret

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Cloudinary (Optional)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### 4. Generate NextAuth Secret

```bash
openssl rand -base64 32
```

### 5. Configure Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://your-domain.vercel.app/api/auth/callback/google`

### 6. Set Up Cloudinary

1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Create an upload preset named `narrative-wiki`
3. Set it to "unsigned" mode
4. Copy your cloud name to the environment variables

### 7. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
narrative-wiki/
├── src/
│   ├── app/
│   │   ├── api/              # API routes
│   │   │   ├── auth/         # NextAuth configuration
│   │   │   ├── characters/   # Character CRUD endpoints
│   │   │   ├── places/       # Places CRUD endpoints
│   │   │   └── plots/        # Plot CRUD endpoints
│   │   ├── auth/             # Authentication pages
│   │   ├── templates/        # Main app pages
│   │   │   ├── characters/
│   │   │   ├── places/
│   │   │   └── plot/
│   │   ├── lib/              # Utility functions
│   │   ├── models/           # MongoDB schemas
│   │   ├── types/            # TypeScript definitions
│   │   └── page.tsx          # Dashboard
│   └── middleware.ts         # Auth middleware
├── public/                    # Static assets
├── .env                       # Environment variables
└── package.json
```

---

## 🔑 Key Features Explained

### Authentication Flow

- Users sign in with Google OAuth
- NextAuth handles session management
- Middleware protects all routes except sign-in
- User-specific data isolation ensures privacy

### Data Models

**Character Schema:**

- Basic info (name, age, role)
- Detailed descriptions (personality, background, appearance)
- Relationships and motivations
- Image support

**Place Schema:**

- Name, type, and location
- Atmosphere and significance
- History and inhabitants
- Notable features

**Plot Schema:**

- Title, chapter, and type
- Timeline and location
- Character involvement
- Conflicts and resolution

### Search Implementation

- Real-time search across all content types
- Regex-based matching on multiple fields
- Results grouped by type
- Click to navigate to full content

---

## 🚢 Deployment

### Deploy to Vercel

1. Push your code to GitHub

2. Import project in Vercel

3. Add environment variables in Vercel dashboard

4. Update `NEXTAUTH_URL` to your Vercel domain

5. Update Google OAuth redirect URIs with Vercel domain

6. Deploy!

```bash
npm run build  # Test production build locally
```

---

## 🎨 Design Decisions

### Why Next.js?

- Server-side rendering for better SEO
- API routes eliminate need for separate backend
- App Router for improved performance
- Built-in image optimization

### Why MongoDB?

- Flexible schema for varied content types
- Easy to scale
- Strong Node.js integration
- NoSQL fits narrative data structure

### Why NextAuth?

- Industry-standard authentication
- Easy OAuth provider integration
- Secure session management
- Minimal configuration

---

## 🐛 Challenges & Solutions

### Challenge 1: OAuth Redirect Mismatch

**Problem:** Google OAuth returned 400 error due to redirect URI mismatch.

**Solution:** Configured exact callback URLs in Google Console matching NextAuth's expected format: `/api/auth/callback/google`

### Challenge 2: User Data Isolation

**Problem:** Needed to ensure users only see their own content.

**Solution:** Implemented `userId` field in all schemas and filtered all queries by authenticated user's ID using NextAuth session.

### Challenge 3: Image Upload Management

**Problem:** Need reliable, scalable image hosting.

**Solution:** Integrated Cloudinary CDN with unsigned upload preset for secure, optimized image delivery.

---

## 🔮 Future Enhancements

- [ ] Character relationship graph visualization
- [ ] Timeline view for chronological events
- [ ] Export to PDF/Markdown
- [ ] Collaborative sharing features
- [ ] Tags and advanced filtering
- [ ] Dark mode toggle
- [ ] Mobile app (React Native)
- [ ] AI-powered suggestions
- [ ] Version history/revision tracking
- [ ] Template system for common archetypes

---

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Run tests in watch mode
npm test -- --watch

# Generate coverage report
npm test -- --coverage
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Your Name**

- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your Name](https://linkedin.com/in/yourprofile)
- Portfolio: [yourwebsite.com](https://yourwebsite.com)
- Email: your.email@example.com

---

## 🙏 Acknowledgments

- [Next.js Documentation](https://nextjs.org/docs)
- [NextAuth.js](https://next-auth.js.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Cloudinary](https://cloudinary.com/)
- [Lucide Icons](https://lucide.dev/)

---

## 📊 Project Stats

![GitHub repo size](https://img.shields.io/github/repo-size/yourusername/narrative-wiki)
![GitHub stars](https://img.shields.io/github/stars/yourusername/narrative-wiki?style=social)
![GitHub forks](https://img.shields.io/github/forks/yourusername/narrative-wiki?style=social)

---

<div align="center">

**⭐ Star this repository if you find it helpful!**

Made with ❤️ by [Your Name]

</div>
