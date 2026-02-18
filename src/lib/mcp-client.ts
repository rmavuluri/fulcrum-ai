// Note: MCP stdio transport requires Node.js environment
// For browser usage, consider using SSE or WebSocket transport via a backend proxy
// import { Client } from "@modelcontextprotocol/sdk/client/index.js";
// import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

import { getAuthHeaders } from "@/lib/api";

export interface MCPTool {
  name: string;
  description?: string;
  inputSchema: Record<string, unknown>;
}

export interface MCPResource {
  uri: string;
  name: string;
  description?: string;
  mimeType?: string;
}

export interface MCPPrompt {
  name: string;
  description?: string;
  arguments?: Array<{
    name: string;
    description?: string;
    required?: boolean;
  }>;
}

class MCPClientManager {
  // For browser environments, MCP client should connect via API proxy
  // This is a placeholder implementation
  private isConnected = false;
  private apiUrl: string;

  constructor() {
    this.apiUrl = import.meta.env.VITE_API_URL || "/api";
  }

  async connect(command?: string, args?: string[]): Promise<void> {
    if (this.isConnected) {
      return;
    }

    try {
      // In browser, connect via API endpoint instead of stdio
      // The backend should handle the actual MCP server connection
      const response = await fetch(`${this.apiUrl}/mcp/connect`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ command, args }),
      });

      if (response.ok) {
        this.isConnected = true;
      } else {
        throw new Error("Failed to connect to MCP server via API");
      }
    } catch (error) {
      console.error("Failed to connect to MCP server:", error);
      // Allow app to continue without MCP connection
      this.isConnected = false;
    }
  }

  async disconnect(): Promise<void> {
    if (this.isConnected) {
      try {
        await fetch(`${this.apiUrl}/mcp/disconnect`, {
          method: "POST",
          headers: getAuthHeaders(),
        });
      } catch (error) {
        console.error("Error disconnecting MCP:", error);
      }
      this.isConnected = false;
    }
  }

  async listTools(): Promise<MCPTool[]> {
    if (!this.isConnected) {
      throw new Error("MCP client not connected");
    }

    const response = await fetch(`${this.apiUrl}/mcp/tools`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error("Failed to list tools");
    }
    const data = await response.json();
    return data.tools || [];
  }

  async callTool(name: string, arguments_: Record<string, unknown>): Promise<unknown> {
    if (!this.isConnected) {
      throw new Error("MCP client not connected");
    }

    const response = await fetch(`${this.apiUrl}/mcp/tools/${name}`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ arguments: arguments_ }),
    });

    if (!response.ok) {
      throw new Error("Failed to call tool");
    }
    const data = await response.json();
    return data.result;
  }

  async listResources(): Promise<MCPResource[]> {
    if (!this.isConnected) {
      throw new Error("MCP client not connected");
    }

    const response = await fetch(`${this.apiUrl}/mcp/resources`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error("Failed to list resources");
    }
    const data = await response.json();
    return data.resources || [];
  }

  async readResource(uri: string): Promise<string> {
    if (!this.isConnected) {
      throw new Error("MCP client not connected");
    }

    const response = await fetch(`${this.apiUrl}/mcp/resources/${encodeURIComponent(uri)}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error("Failed to read resource");
    }
    const data = await response.json();
    return data.content || "";
  }

  async listPrompts(): Promise<MCPPrompt[]> {
    if (!this.isConnected) {
      throw new Error("MCP client not connected");
    }

    const response = await fetch(`${this.apiUrl}/mcp/prompts`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error("Failed to list prompts");
    }
    const data = await response.json();
    return data.prompts || [];
  }

  async getPrompt(
    name: string,
    arguments_?: Record<string, string>
  ): Promise<string> {
    if (!this.isConnected) {
      throw new Error("MCP client not connected");
    }

    const response = await fetch(`${this.apiUrl}/mcp/prompts/${name}`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ arguments: arguments_ }),
    });

    if (!response.ok) {
      throw new Error("Failed to get prompt");
    }
    const data = await response.json();
    return data.content || "";
  }

  getConnectionStatus(): boolean {
    return this.isConnected;
  }
}

export const mcpClient = new MCPClientManager();
