# Giorgio Di Cristofalo — Personal Portfolio

Welcome to the source code of my personal portfolio and technical laboratory.

This repository is built using **Astro 5** (pure static generation, zero JS framework runtime) and **Tailwind CSS v4**.

## 🚀 Quick Start

To run this project locally:

1. **Clone the repository**
   ```sh
   git clone https://github.com/Horghe20/portfolio.git
   cd portfolio
   ```

2. **Install dependencies**
   ```sh
   npm install
   ```

3. **Configure Environment Variables**
   Copy the example file and add your Resend API key to enable the contact form.
   ```sh
   cp .env.example .env
   ```

4. **Start the Development Server**
   ```sh
   npm run dev
   ```
   The site will be available at `http://localhost:4321`.

## 🛠️ Architecture & Tech Stack

- **Framework**: [Astro](https://astro.build/) (Static Site Generation)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Astro Icon](https://github.com/natemoo-re/astro-icon) (with Tabler icons)
- **Deployment**: [Vercel](https://vercel.com/)

All previously React-based components have been fully migrated to use pure HTML/CSS and Vanilla JS for intersection observers, DOM manipulation, and API fetching to ensure maximum performance and minimal client-side payload.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
