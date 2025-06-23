import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const TMDB_API = "https://api.themoviedb.org/3";

(async () => {
  // Create the MCP server
  const mcp = new McpServer({
    name: "Movie MCP",
    version: "1.0.0",
  });

  // Register the search_movies tool
  mcp.registerTool(
    "search_movies",
    {
      title: "Search for movies by title",
      description: "Search for movies by title",
      inputSchema: {
        query: z.string().describe("Title or part of title to search for"),
      },
    },
    async ({ query }) => {
      const res = await axios.get(`${TMDB_API}/search/movie`, {
        params: {
          query,
          api_key: process.env.TMDB_API_KEY,
        },
      });

      return {
        content: res.data.results.map((movie: any) => ({
          id: movie.id,
          title: movie.title,
          release_date: movie.release_date,
          overview: movie.overview,
          rating: movie.vote_average,
        })),
      };
    }
  );

  // Start the server (stdio transport)
  const transport = new StdioServerTransport();
  await mcp.connect(transport);
})();
