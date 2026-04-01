<div align="center">

# 🛠️ ShotlinAdmin

**A modern, open-source React admin dashboard for managing your Shotlin business operations.**

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4-38BDF8?logo=tailwindcss)](https://tailwindcss.com)

[Live Demo](#) · [Report Bug](https://github.com/sayanm085/ShotlinAdmin/issues) · [Request Feature](https://github.com/sayanm085/ShotlinAdmin/issues)

</div>

---

## 📋 Table of Contents

- [About the Project](#-about-the-project)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running Locally](#running-locally)
- [Deployment](#-deployment)
  - [Build for Production](#build-for-production)
  - [Deploy to Vercel](#deploy-to-vercel)
  - [Deploy to Netlify](#deploy-to-netlify)
  - [Self-Hosted / VPS](#self-hosted--vps)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)
- [Contact](#-contact)
- [License](#-license)

---

## 🚀 About the Project

**ShotlinAdmin** is a fully featured, open-source admin dashboard built with React 19 and Vite. It provides a clean, responsive interface to manage customers, services, invoices, meetings, contact requests, web content, and financial operations — all from one place.

---

## ✨ Features

| Module | Description |
|---|---|
| 📊 **Overview Dashboard** | Key metrics and business analytics with charts |
| 📅 **Meetings** | Schedule and manage client meetings |
| 👥 **Customers** | Full customer list with search and management |
| 🧰 **Services** | Add, edit, and upload services with a rate card |
| 📬 **Contact Requests** | Review and respond to incoming contact requests |
| 🌐 **Web Content Editor** | Edit website content directly from the dashboard |
| 🧾 **Invoice System** | Create, view, and export invoices as PDF |
| 🧮 **Financial Calculator** | Built-in financial tools for quick calculations |
| 🔐 **Authentication** | Secure login page with protected routes |

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [React 19](https://react.dev) |
| **Build Tool** | [Vite 6](https://vitejs.dev) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com) |
| **Routing** | [React Router v7](https://reactrouter.com) |
| **Data Fetching** | [TanStack Query v5](https://tanstack.com/query) + [Axios](https://axios-http.com) |
| **UI Components** | [Radix UI](https://www.radix-ui.com) (via [shadcn/ui](https://ui.shadcn.com)) |
| **Forms** | [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev) |
| **Charts** | [Recharts](https://recharts.org) |
| **PDF Generation** | [@react-pdf/renderer](https://react-pdf.org), [jsPDF](https://parall.ax/products/jspdf) |
| **Animations** | [Motion](https://motion.dev) |
| **Notifications** | [React Hot Toast](https://react-hot-toast.com) |

---

## 🏁 Getting Started

### Prerequisites

Make sure the following tools are installed on your machine:

- **Node.js** ≥ 18.x — [Download](https://nodejs.org)
- **npm** ≥ 9.x (comes with Node.js) or **yarn** / **pnpm**
- A running **backend API** that this dashboard connects to

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/sayanm085/ShotlinAdmin.git
   cd ShotlinAdmin
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

### Environment Variables

Copy the example environment file and fill in your values:

```bash
cp .env.example .env
```

Open `.env` and set the following variables:

| Variable | Description | Example |
|---|---|---|
| `VITE_API_URL` | Full base URL of your API (with trailing `/`) | `https://api.yourdomain.com/api/` |
| `VITE_API_BASE_URL` | Base URL without path (used by the Axios instance) | `https://api.yourdomain.com` |

> ⚠️ **Never commit your `.env` file.** It is already listed in `.gitignore`.

### Running Locally

Start the development server with Hot Module Replacement (HMR):

```bash
npm run dev
```

The app will be available at **http://localhost:5173** by default.

Other useful commands:

```bash
npm run build    # Create an optimized production build
npm run preview  # Preview the production build locally
npm run lint     # Run ESLint across the codebase
```

---

## 🚢 Deployment

### Build for Production

```bash
npm run build
```

This generates a `dist/` folder containing the fully optimized static assets ready for any static hosting provider.

---

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/sayanm085/ShotlinAdmin)

1. Push the repository to GitHub (already done).
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import the **ShotlinAdmin** GitHub repository.
4. In the **Environment Variables** section, add `VITE_API_URL` and `VITE_API_BASE_URL`.
5. Leave the build settings as auto-detected (Vite) or set manually:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Click **Deploy**.

> Vercel will automatically redeploy on every push to `main`.

---

### Deploy to Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/sayanm085/ShotlinAdmin)

1. Go to [netlify.com](https://netlify.com) and click **"Add new site → Import an existing project"**.
2. Connect your GitHub account and select **ShotlinAdmin**.
3. Configure build settings:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
4. Under **"Site settings → Environment variables"**, add `VITE_API_URL` and `VITE_API_BASE_URL`.
5. Click **Deploy site**.

> Because this is a single-page application (SPA) with client-side routing, create a `public/_redirects` file with:
> ```
> /*  /index.html  200
> ```

---

### Self-Hosted / VPS

1. **Build the project** on your local machine or CI server:

   ```bash
   npm run build
   ```

2. **Upload the `dist/` folder** to your server using `scp`, `rsync`, or your CI/CD pipeline:

   ```bash
   rsync -avz dist/ user@your-server:/var/www/shotlinadmin/
   ```

3. **Configure Nginx** to serve the static files and redirect all routes to `index.html`:

   ```nginx
   server {
       listen 80;
       server_name admin.yourdomain.com;
       root /var/www/shotlinadmin;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```

4. **(Optional) Enable HTTPS** with Let's Encrypt:

   ```bash
   sudo certbot --nginx -d admin.yourdomain.com
   ```

---

## 📁 Project Structure

```
ShotlinAdmin/
├── public/                 # Static assets (served as-is)
├── src/
│   ├── Api/                # API helper functions & Axios config
│   ├── assets/             # Images, icons, and other static assets
│   ├── components/         # Shared/reusable UI components (shadcn/ui)
│   ├── Hooks/              # Custom React hooks
│   ├── Layout/             # Page-level layout components (one per route)
│   ├── lib/                # Utility functions and Axios instance
│   ├── page/               # Top-level page components (Dashboard, Login)
│   ├── App.jsx             # Root component with Toaster and Outlet
│   ├── main.jsx            # App entry point — router, QueryClient setup
│   └── index.css           # Global styles & Tailwind directives
├── .env.example            # Example environment variables
├── .gitignore
├── components.json         # shadcn/ui configuration
├── eslint.config.js        # ESLint configuration
├── jsconfig.json           # JS/path alias configuration
├── vite.config.js          # Vite configuration
└── package.json
```

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. **Fork** the repository
2. **Create** your feature branch:
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit** your changes:
   ```bash
   git commit -m "feat: add amazing feature"
   ```
4. **Push** to the branch:
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request** against the `main` branch

### Reporting Bugs / Requesting Features

Please use [GitHub Issues](https://github.com/sayanm085/ShotlinAdmin/issues) to report bugs or request new features. Be as descriptive as possible and include steps to reproduce.

---

## 📬 Contact

**Sayan Mondal** — Project Maintainer

- 🐙 GitHub: [@sayanm085](https://github.com/sayanm085)
- 📧 Email: [sayanmondal085@gmail.com](mailto:sayanmondal085@gmail.com)
- 💼 Project Link: [https://github.com/sayanm085/ShotlinAdmin](https://github.com/sayanm085/ShotlinAdmin)

Feel free to open an issue or send an email for any questions, feedback, or collaboration opportunities.

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for more information.

---

<div align="center">
Made with ❤️ by <a href="https://github.com/sayanm085">Sayan Mondal</a>
</div>
