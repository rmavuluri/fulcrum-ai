# Fulcrum AI

A modern AI chatbot interface built with React, Vite, shadcn/ui, and MCP (Model Context Protocol) client integration.

## Features

- 🎨 **Modern UI**: Built with shadcn/ui components and Tailwind CSS
- 🔐 **Authentication**: Auth0 (OAuth 2.0 / OIDC) with JWT validation on backend
- 🔌 **MCP Integration**: Connect to MCP servers for tools, resources, and prompts
- 💬 **Chat Interface**: Clean, dark-themed chat UI matching the design
- ⚡ **Fast Development**: Powered by Vite for instant HMR

## Tech Stack

- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **React Router** - Routing
- **Zustand** - State management
- **MCP SDK** - Model Context Protocol client
- **Lucide React** - Icons

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:
```bash
cd fulcrum-ai
```

2. Install dependencies:
```bash
npm install
```

3. Copy environment variables:
```bash
cp .env.example .env
```

4. Configure your environment variables in `.env`:
   - **Auth0**: `VITE_AUTH0_DOMAIN`, `VITE_AUTH0_CLIENT_ID`, `VITE_AUTH0_AUDIENCE` (see [Auth0 setup](https://github.com/auth0/auth0-react#auth0provider) and backend README).
   - **Backend**: `VITE_API_URL=http://localhost:3001` (fulcrum-ai-backend).
   - MCP and other optional vars as needed.

5. Start the backend (in `fulcrum-ai-backend`): `npm run dev`.

6. Start the development server:
```bash
npm run dev
```

7. Open [http://localhost:5173](http://localhost:5173) in your browser. Use "Sign in with Auth0" to log in.

## Project Structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── auth/             # Authentication components
│   ├── app-sidebar.tsx   # Left sidebar
│   ├── chat-area.tsx     # Main chat area
│   ├── chat-header.tsx   # Top header
│   └── prompt-input.tsx  # Message input component
├── lib/
│   ├── auth.ts           # Authentication store and utilities
│   ├── mcp-client.ts     # MCP client manager
│   └── utils.ts          # Utility functions
├── hooks/
│   └── use-mcp.ts        # MCP integration hook
└── App.tsx               # Main app component
```

## MCP Integration

This application acts as an MCP client and can connect to MCP servers to:
- **Call Tools**: Execute tools provided by MCP servers
- **Access Resources**: Read resources from MCP servers
- **Use Prompts**: Get prompts from MCP servers

### Browser Limitation

The MCP SDK's stdio transport requires Node.js and cannot run directly in browsers. This application uses an API-based approach where:

1. **Backend Required**: You need a backend server that acts as an MCP proxy
2. **API Endpoints**: The frontend communicates with MCP via REST API endpoints:
   - `POST /api/mcp/connect` - Connect to MCP server
   - `GET /api/mcp/tools` - List available tools
   - `POST /api/mcp/tools/:name` - Call a tool
   - `GET /api/mcp/resources` - List resources
   - `GET /api/mcp/resources/:uri` - Read a resource
   - `GET /api/mcp/prompts` - List prompts
   - `POST /api/mcp/prompts/:name` - Get a prompt

### Setting Up Backend Proxy

Create a backend server (Node.js/Express recommended) that:
1. Uses the MCP SDK to connect to your MCP server
2. Exposes REST API endpoints matching the above
3. Forwards requests between the frontend and MCP server

### Using MCP Tools

Once connected, you can call MCP tools from the chat interface using:
```
/tool tool-name {"arg1": "value1"}
```

## Authentication

The app supports:
- **Email/Password**: Traditional login with JWT tokens
- **OAuth**: Google and GitHub OAuth integration

Authentication state is managed using Zustand and stored in localStorage.

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Customization

### Theme

The app uses a dark theme by default. You can customize colors in `src/index.css` by modifying the CSS variables.

### Models

Add or modify AI models in the `PromptInput` component's Select dropdown.

## License

MIT
