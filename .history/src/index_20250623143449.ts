import { FastMCP } from "@mcp-sdk/server";

export const mcp = new FastMCP("Movie MCP");
import { mcp } from "./mcpInstance";
import "./resources/searchMovies";
import "./resources/getMovieById";

mcp.start();
TMDB_API_KEY = your_tmdb_api_key_here;
import axios from "axios";
import { z } from "zod";
import { mcp } from "../mcpInstance";
import dotenv from "dotenv";
dotenv.config();

const TMDB_API = "https://api.themoviedb.org/3";

mcp.tool("search_movies", {
  description: "Search for movies by title",
  args: z.object({
    query: z.string().describe("Title or part of title to search for"),
  }),
  handler: async ({ query }) => {
    const res = await axios.get(`${TMDB_API}/search/movie`, {
      params: {
        query,
        api_key: process.env.TMDB_API_KEY,
      },
    });

    return res.data.results.map((movie: any) => ({
      id: movie.id,
      title: movie.title,
      release_date: movie.release_date,
      overview: movie.overview,
      rating: movie.vote_average,
    }));
  },
});
