# TutorHub Institute - React Frontend

A modern, responsive React.js frontend for the TutorHub Institute tutoring platform built with Tailwind CSS.

## 🚀 Features

- **Modern UI/UX** with Tailwind CSS
- **Responsive Design** - Works on all devices
- **Student & Tutor Registration** with form validation
- **User Authentication** (Login/Logout)
- **Course Browsing** with filters and search
- **Resource Access** (Free & Premium)
- **Interactive Dashboard** for students and tutors
- **React Icons** for beautiful iconography
- **Smooth Animations** and transitions

## 🛠️ Tech Stack

- **React 18** - Latest React features
- **React Router DOM v6** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API calls
- **React Icons** - Icon library

## 📦 Installation

1. **Install dependencies:**

```bash
npm install
```

2. **Start the development server:**

```bash
npm start
```

The app will run on `http://localhost:3000`

## 🎨 Tailwind CSS Setup

Tailwind CSS is already configured with:

- Custom color palette (primary & secondary gradients)
- Custom components (buttons, inputs, cards, badges)
- Responsive breakpoints
- Custom fonts (Inter)

### Custom Classes

```css
.btn
  -
  Base
  button
  styles
  .btn-primary
  -
  Primary
  gradient
  button
  .btn-secondary
  -
  Secondary
  button
  .btn-outline
  -
  Outlined
  button
  .input
  -
  Form
  input
  styles
  .card
  -
  Card
  component
  .badge
  -
  Badge
  component;
```

## 📁 Project Structure

```
client/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Navbar.jsx       # Navigation bar
│   │   └── Footer.jsx       # Footer component
│   ├── pages/
│   │   ├── Home.jsx         # Landing page
│   │   ├── StudentRegistration.jsx
│   │   ├── TutorRegistration.jsx
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Courses.jsx
│   │   ├── Resources.jsx
│   │   └── About.jsx
│   ├── App.js               # Main app component
│   ├── index.js             # Entry point
│   └── index.css            # Tailwind imports
├── tailwind.config.js       # Tailwind configuration
├── postcss.config.js        # PostCSS configuration
└── package.json
```

## 🎯 Available Scripts

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Eject from Create React App (not recommended)
npm run eject
```

## 🔌 API Integration

The frontend connects to the backend API at `http://localhost:5000/api`

### API Endpoints Used:

- `POST /api/students/register` - Student registration
- `POST /api/tutors/register` - Tutor registration
- `POST /api/students/login` - Student login
- `POST /api/tutors/login` - Tutor login
- `GET /api/courses` - Get all courses
- `GET /api/resources` - Get resources

Make sure the backend server is running before starting the frontend.

## 🎨 Color Palette

```javascript
Primary: #667eea (Purple-Blue)
Secondary: #764ba2 (Purple)
Success: Green shades
Warning: Yellow shades
Error: Red shades
```

## 📱 Pages

### 1. Home Page

- Hero section with CTA buttons
- Feature cards
- Statistics section
- Call-to-action section

### 2. Student Registration

- Multi-field form with validation
- Grade level selection
- Password confirmation
- Icon-enhanced inputs

### 3. Tutor Registration

- Professional profile setup
- Qualifications and subjects
- Availability scheduling
- Admin verification notice

### 4. Login

- User type selection (Student/Tutor)
- Email and password authentication
- Remember me option
- Forgot password link

### 5. Courses

- Course grid with filters
- Search functionality
- Subject filtering
- Course details with pricing

### 6. Resources

- Free and Premium tabs
- Resource cards with download counts
- AASTU papers section
- Subscription CTA

### 7. Dashboard

- User statistics
- Quick action cards
- Recent activity feed
- Logout functionality

### 8. About

- Mission and vision
- Core values
- What we offer
- CTA section

## 🔐 Authentication

The app uses JWT tokens stored in localStorage:

```javascript
localStorage.setItem("token", token);
localStorage.setItem("userType", "student" | "tutor");
```

Protected routes check for token presence and redirect to login if not found.

## 🎭 Icons

Using React Icons library with icons from:

- Font Awesome (Fa\*)
- Material Design (Md\*)
- And more...

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📝 Environment Variables

Create a `.env` file in the client directory:

```env
REACT_APP_API_URL=http://localhost:5000
```

## 🚀 Deployment

### Build for production:

```bash
npm run build
```

This creates an optimized production build in the `build/` folder.

### Deploy to Vercel:

```bash
npm install -g vercel
vercel
```

### Deploy to Netlify:

```bash
npm install -g netlify-cli
netlify deploy --prod
```

## 🐛 Troubleshooting

### Tailwind styles not working:

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### React Icons not showing:

```bash
npm install react-icons
```

### API connection issues:

- Check if backend server is running on port 5000
- Verify CORS is enabled on backend
- Check network tab in browser DevTools

## 📚 Learn More

- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [React Router Documentation](https://reactrouter.com)
- [React Icons](https://react-icons.github.io/react-icons/)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

MIT License - feel free to use this project for learning and development.

## 👨‍💻 Author

TutorHub Institute Development Team

---

**Happy Coding! 🎉**
