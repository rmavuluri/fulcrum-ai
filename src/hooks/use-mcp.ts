import { useState } from "react";
import { mcpClient, type MCPTool, type MCPResource, type MCPPrompt } from "@/lib/mcp-client";

export function useMCP() {
  const [tools, setTools] = useState<MCPTool[]>([]);
  const [resources, setResources] = useState<MCPResource[]>([]);
  const [prompts, setPrompts] = useState<MCPPrompt[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // MCP auto-connect disabled until backend exposes /api/mcp/* routes.
  // To enable later: uncomment the useEffect and implement MCP proxy in fulcrum-ai-backend.
  // useEffect(() => {
  //   const initMCP = async () => { ... };
  //   initMCP();
  //   return () => mcpClient.disconnect();
  // }, []);

  const callTool = async (name: string, args: Record<string, unknown>) => {
    if (!isConnected) {
      throw new Error("MCP client not connected");
    }
    return mcpClient.callTool(name, args);
  };

  const readResource = async (uri: string) => {
    if (!isConnected) {
      throw new Error("MCP client not connected");
    }
    return mcpClient.readResource(uri);
  };

  const getPrompt = async (name: string, args?: Record<string, string>) => {
    if (!isConnected) {
      throw new Error("MCP client not connected");
    }
    return mcpClient.getPrompt(name, args);
  };

  return {
    tools,
    resources,
    prompts,
    isConnected,
    error,
    callTool,
    readResource,
    getPrompt,
  };
}
