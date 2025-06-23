import { FastMCP } from "@mcp-sdk/server";

export const mcp = new FastMCP("Movie MCP");
import { mcp } from "./mcpInstance";
import "./resources/searchMovies";
import "./resources/getMovieById";

mcp.start();
TMDB_API_KEY = your_tmdb_api_key_here;
