import { FastMCP } from "@mcp-sdk/server";

export const mcp = new FastMCP("Movie MCP");
import { mcp } from "./mcpInstance";
import "./resources/searchMovies";
import "./resources/getMovieById";

mcp.start();
