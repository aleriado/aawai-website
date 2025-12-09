# AAWAI Corporation Website

A modern, responsive corporate website for AAWAI Corporation, a Japanese AI business solutions company. The website showcases AI consulting services, business automation solutions, and provides information about the company's expertise in AI implementation.

## 🌐 About AAWAI

AAWAI Corporation (AAWAI Corp) is an AI comprehensive solutions provider specializing in:
- AI business process improvement
- AI consulting and implementation
- Sales and marketing automation
- AI adoption and business integration

With over 15 years of business experience across 10+ countries, AAWAI offers practical AI solutions that are actually used in real business environments.

## ✨ Features

- **Responsive Design**: Fully responsive layout that works seamlessly on desktop, tablet, and mobile devices
- **Smooth Animations**: Custom CSS animations and transitions for an engaging user experience
- **Page Transitions**: Elegant page transitions between different sections
- **Mobile Menu**: Hamburger menu with smooth sidebar navigation for mobile devices
- **Interactive Elements**: 
  - Animated counters and statistics
  - Blog/news slider
  - Dropdown navigation menus
  - Chat button integration
- **Multi-page Structure**: 
  - Homepage with hero section and company highlights
  - Services page
  - About page (会社案内)
  - News page (AI最新情報)
  - Contact page (お問い合わせ)
  - Privacy Policy page (個人情報保護法)

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js with Express.js
- **Styling**: Custom CSS with animations
- **Server**: Express.js static file server

## 📁 Project Structure

```
Aawai-website/
├── public/
│   ├── index.html          # Homepage
│   ├── service.html        # Services page
│   ├── about.html          # About page
│   ├── news.html           # News page
│   ├── contact.html        # Contact page
│   ├── privacypolicy.html  # Privacy policy page
│   ├── css/
│   │   ├── style.css       # Main stylesheet
│   │   ├── animations.css  # Animation styles
│   │   ├── about.css       # About page styles
│   │   ├── contact.css     # Contact page styles
│   │   ├── news.css        # News page styles
│   │   ├── services.css    # Services page styles
│   │   └── privacypolicy.css # Privacy policy styles
│   ├── js/
│   │   ├── main.js         # Main JavaScript functionality
│   │   └── transitions.js  # Page transition effects
│   └── assets/
│       └── images/         # Image assets
├── server.js               # Express.js server
├── package.json            # Node.js dependencies
└── README.md               # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js v18 or higher
- npm (Node Package Manager) or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Aawai-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```
   Or:
   ```bash
   node server.js
   ```

4. **Open your browser**
   Navigate to: `http://localhost:3000`

## 📝 Available Scripts

- `npm start` - Starts the Express.js server on port 3000
- `node server.js` - Alternative way to start the server

## 🎨 Key Features Implementation

### Header Navigation
- Auto-hiding header on scroll down
- Sticky navigation bar
- Mobile hamburger menu with sidebar
- Dropdown menus for additional navigation items

### Animations
- Page preloader with smooth transitions
- Scroll-triggered animations
- Counter animations for statistics
- Smooth page transitions between routes

### Blog/News Slider
- Horizontal scrolling blog/news slider
- Navigation buttons for manual control
- Auto-advancing functionality

### Responsive Design
- Mobile-first approach
- Breakpoints for different screen sizes
- Touch-friendly interface elements

## 📧 Contact Information

- **Address**: 東京都渋谷区代々木5-15-10
- **Email**: info@aawai.ai
- **Website**: [AAWAI Corporation](https://aawai.ai)

## 🌟 Services Offered

1. **AIによる爆速業務改善** - Rapid business improvement through AI
2. **AIコンサルティング** - AI consulting services
3. **AIでの営業・マーケティング自動化** - Sales and marketing automation using AI
4. **AI活用の浸透と業務の検討** - AI adoption and business integration

## 📄 License

© 2024 AAWAI Corporation. All rights reserved.

## 👥 Development

This website is built with modern web technologies focusing on performance, user experience, and maintainability. The codebase is organized with clear separation of concerns between HTML structure, CSS styling, and JavaScript functionality.

---

**Note**: This is a corporate website for AAWAI Corporation. For business inquiries, please contact info@aawai.ai
