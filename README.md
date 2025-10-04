# AmplifyAI

AmplifyAI is a sophisticated, minimalist SaaS tool designed to empower content creators and small brands. It serves as an AI-powered co-pilot for social media strategy, streamlining the creative process from ideation to execution. The application is built as a sleek, single-page application with three core, tab-based modules: Idea Generator, Caption Optimizer, and Content Repurposer. Users first provide their niche, target platforms, and brand tone, which personalizes all AI outputs. The Idea Generator provides viral-worthy content prompts. The Caption Optimizer refines user-written text and suggests high-reach hashtags. The Repurposer masterfully transforms a single piece of content (like a blog post) into multiple formats suitable for different platforms (e.g., TikTok scripts, Instagram carseousels, Twitter threads). The entire experience is designed to be intuitive, real-time, and visually stunning, helping creators amplify their message with less effort.

[cloudflarebutton]

## ✨ Key Features

-   **🧠 Idea Generator**: Get viral-worthy content ideas and prompts based on your niche, target platforms, and brand tone.
-   **✍️ Caption Optimizer**: Refine your draft captions and get relevant, high-reach hashtag suggestions to maximize engagement.
-   **🔄 Content Repurposer**: Effortlessly transform one piece of content (like a blog post or video transcript) into multiple formats like TikTok scripts, Instagram carousels, and Twitter threads.
-   **🎨 Personalized Experience**: All AI outputs are tailored to your specific niche, platforms, and tone of voice.
-   ** minimalist UI**: A clean, beautiful, and intuitive interface that makes content creation a joy.

## 🛠️ Technology Stack

-   **Frontend**: React, Vite, TypeScript, Tailwind CSS
-   **UI Components**: shadcn/ui, Lucide React, Framer Motion
-   **State Management**: Zustand
-   **Backend**: Cloudflare Workers, Hono
-   **AI Integration**: Cloudflare AI Gateway, OpenAI SDK

## 🚀 Getting Started

Follow these instructions to get a local copy up and running for development and testing purposes.

### Prerequisites

-   [Bun](https://bun.sh/) installed on your machine.
-   A [Cloudflare account](https://dash.cloudflare.com/sign-up).

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/amplify-ai.git
    cd amplify-ai
    ```

2.  **Install dependencies:**
    ```bash
    bun install
    ```

3.  **Set up Environment Variables:**
    Create a `.dev.vars` file in the root of the project. You will need to get your AI Gateway URL and an API Key from your Cloudflare Dashboard.

    ```ini
    # .dev.vars

    # 1. Go to Cloudflare Dashboard > AI > AI Gateway
    # 2. Create a new Gateway or use an existing one.
    # 3. Copy the OpenAI compatibility endpoint.
    CF_AI_BASE_URL="https://gateway.ai.cloudflare.com/v1/YOUR_ACCOUNT_ID/YOUR_GATEWAY_NAME/openai"

    # 4. Go to API Tokens and create a new token with "AI Gateway" permissions.
    CF_AI_API_KEY="YOUR_CLOUDFLARE_API_KEY"
    ```

    > **⚠️ Important Security Note:** The AI features will not work in the deployed version unless you configure your own API keys. This is for security reasons. The provided deploy button will set up the project, but you must add your `CF_AI_API_KEY` as a secret in the Worker settings.

## 💻 Development

To start the local development server, which includes both the Vite frontend and the Cloudflare Worker backend:

```bash
bun dev
```

-   The frontend will be available at `http://localhost:3000`.
-   The worker's API endpoints will be available under `/api`.

The development server supports hot-reloading for a seamless development experience.

## 🚀 Deployment

This project is designed for easy deployment to Cloudflare Pages.

1.  **One-Click Deploy:**
    You can deploy this project to your Cloudflare account with a single click.

    [cloudflarebutton]

2.  **Manual Deployment via CLI:**
    If you prefer to deploy from your local machine, run the following command:

    ```bash
    bun deploy
    ```

    This command will build the Vite application and deploy it along with the worker to Cloudflare.

3.  **Configure Secrets:**
    After deploying, you must add your Cloudflare AI API Key as a secret to your deployed worker to enable the AI functionalities.

    -   Go to your Cloudflare Dashboard.
    -   Navigate to `Workers & Pages` and select your `amplify-ai` project.
    -   Go to `Settings` > `Variables`.
    -   Under `Environment Variable Secrets`, add a new secret:
        -   **Variable name**: `CF_AI_API_KEY`
        -   **Value**: Your Cloudflare API key.
    -   Encrypt and save the secret. The changes will apply on the next deployment.

## 🗺️ Roadmap

-   **Phase 1: Visual Foundation & Core Idea Generator**
    -   Establish the stunning, minimalist visual identity and layout.
    -   Build the main UI shell with header, footer, and tab navigation.
    -   Implement the complete end-to-end functionality for the 'Idea Generator' tool.

-   **Phase 2: Feature Expansion & Interactivity**
    -   Implement the 'Caption Optimizer' and 'Content Repurposer' tools.
    -   Add robust copy-to-clipboard and download functionality.
    -   Refine interactive states and animations.

-   **Phase 3: Monetization & Polish**
    -   Introduce a client-side credit system to simulate free/premium tiers.
    -   Add UI elements for credit tracking and upgrade prompts.
    -   Conduct a full design polish, ensuring all loading, error, and empty states are beautifully handled.

## 🤝 Contributing

Contributions are welcome! Please feel free to open an issue or submit a pull request.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details.