# Business Idea Generator - A Full-Stack AI SaaS

This project is a complete full-stack application that serves as an AI-powered **Business Idea Generator**. It was built following the principles of modern web development, leveraging the Next.js App Router for both the frontend and backend, creating a unified and powerful full-stack TypeScript experience.

This version adapts the concepts from a tutorial that originally used a Python/FastAPI backend, but instead implements the entire stack within Next.js.

## What It Does

-   **Modern React Frontend:** Built with the Next.js 15 App Router.
-   **Integrated Next.js Backend:** API routes handle all server-side logic, eliminating the need for a separate backend service.
-   **AI-Powered:** Connects to the OpenAI API using the `@openai/agents` SDK to generate creative business ideas.
-   **Real-Time Streaming:** Streams AI responses directly to the client in real-time using Server-Sent Events (SSE).
-   **Beautiful Markdown Rendering:** Correctly renders formatted markdown from the AI, including headings and lists.
-   **Production Ready:** Deploys seamlessly to production on Vercel.

## Tech Stack

-   **Framework:** [Next.js](https://nextjs.org/) (App Router)
-   **Language:** [TypeScript](https://www.typescriptlang.org/)
-   **AI:** [OpenAI Agents SDK](https://www.npmjs.com/package/@openai/agents)
-   **Streaming Helper:** [Hono](https://hono.dev/) (for its `streamSSE` utility)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
-   **Markdown:** [React Markdown](https://github.com/remarkjs/react-markdown)
-   **Deployment:** [Vercel](https://vercel.com/)

## Key Architectural Decisions

-   **Unified Next.js Backend:** Instead of using a separate Python/FastAPI backend, this project uses a Next.js API Route (`src/app/api/route.ts`). This simplifies the architecture, streamlines deployment, and allows for a single language (TypeScript) across the entire stack.
-   **Hono for SSE Streaming:** To handle the complexities of streaming from the `@openai/agents` SDK, the API route uses Hono's `streamSSE` helper. This provides a clean, "no-adapter" solution for managing the SSE connection and formatting, avoiding the need for manual stream transformation code.
-   **Client-Side Rendering:** The main page (`src/app/page.tsx`) is a Client Component (`"use client"`) that uses the browser's native `EventSource` API to connect to the streaming backend.

## Getting Started

### Prerequisites

-   Node.js (v18 or later)
-   Vercel CLI
-   An OpenAI API key

### Installation

1.  Clone the repository:
    ```bash
    git clone <your-repo-url>
    ```
2.  Navigate to the project directory and install dependencies:
    ```bash
    cd saas
    npm install
    ```
3.  Create a local environment file:
    ```bash
    cp .env.example .env.local
    ```
4.  Add your OpenAI API key to `.env.local`:
    ```
    OPENAI_API_KEY=sk-...
    ```

### Running in Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Deployment

This application is optimized for deployment on [Vercel](https://vercel.com/).

1.  **Link the project:**
    ```bash
    vercel link
    ```
2.  **Add your OpenAI API key to Vercel:**
    ```bash
    vercel env add OPENAI_API_KEY
    ```
3.  **Deploy to production:**
    ```bash
    vercel --prod
    ```
