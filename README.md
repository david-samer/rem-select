# Skip Hire UI Redesign

🔗 [**Live Demo**](https://rem-select.vercel.app/) &nbsp;|&nbsp; 🧪 [**Open in CodeSandbox**](https://codesandbox.io/p/github/david-samer/rem-select/main)


This project is a complete redesign of the original skip hire page. The goal was to **revamp the interface** while **retaining all existing functionality**, improve **UI/UX**, and ensure full **responsiveness** across devices.

---

## 🚀 Tech Stack

- **Next.js** (React-based framework)  
  - Chosen for its **server-side rendering (SSR)** and **built-in routing**.  
  - Note: Next.js is built on **React**, and demonstrates React skills with added features like SSR and file-based routing.
- **Tailwind CSS** – Utility-first styling framework.
- **shadcn/ui** – For accessible and modern UI components.
- **bun** – Used as the package manager and dev server runner.

---

## 🧠 Approach & Key Features

### 🗂 Data Integration
- The app fetches live skip data using **Next.js server-side rendering (SSR)** for performance and SEO.
- The API endpoint is managed via environment variables for security and flexibility.

> 🔐 **Setup Note**: To run the app, you need to create a `.env.local` file at the root of the project with the following variable:
> ```env
> SKIP_API_ENDPOINT=https://your-api-url-here
> ```

### 📊 Extra Skip Info & Comparison Feature
- Researched skip dimensions and usage from [REM](https://www.renewableenergymarketing.net/skip-hire/).
- Extended the data with:
  - **Skip dimensions** (metric and imperial).
  - **Bin bag capacity**.
  - **Usage guidelines**.
  - **Skip type** (Standard or Roll-on Roll-off).

- 🔍 **Comparison Feature**:
  - Allows users to compare skip sizes visually.
  - Vector illustrations show **relative scale** (with human figure reference).
  - Side-by-side differences in **capacity, size, and purpose**.

### 🎨 UI/UX & Design Decisions
- **Color Palette** matches REM brand colors and complements yellow skip bins.
- Background-removed skip images.
- Used icons (e.g. hard hat for restrictions) and a **drawer UI** to display extra info cleanly.

---

## 📱 Responsiveness

- Mobile-first responsive layout with Tailwind CSS.
- Fully optimized for both touch and desktop interaction.

---

## ⚙️ How to Run

1. Install [Bun](https://bun.sh/)
2. Create a `.env.local` file in the root with:
   ```env
   SKIP_API_ENDPOINT=https://your-api-url-here
   ```
3. Run the following commands:
   ```bash
   bun install
   bun run dev
   ```
