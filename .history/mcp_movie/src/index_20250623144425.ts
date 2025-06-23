import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const TMDB_API = "https://api.themoviedb.org/3";

(async () => {
  const mcp = new McpServer({
    name: "Movie MCP",
    version: "1.0.0",
  });

  // 🟢 1. search_movies
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

  // 🟡 2. get_movie_by_id
  mcp.registerTool(
    "get_movie_by_id",
    {
      title: "Get movie details by ID",
      description: "Fetch detailed info about a movie using TMDB ID",
      inputSchema: {
        movieId: z.string().describe("TMDB movie ID"),
      },
    },
    async ({ movieId }) => {
      const res = await axios.get(`${TMDB_API}/movie/${movieId}`, {
        params: { api_key: process.env.TMDB_API_KEY },
      });

      const m = res.data;
      return {
        content: [
          {
            type: "text",
            text:
              `Title: ${m.title}\n` +
              `Release Date: ${m.release_date}\n` +
              `Runtime: ${m.runtime} min\n` +
              `Genres: ${m.genres.map((g: any) => g.name).join(", ")}\n` +
              `Language: ${m.original_language}\n` +
              `Rating: ${m.vote_average}\n` +
              `Overview: ${m.overview}`,
          },
        ],
      };
    }
  );

  // 🔵 3. search_actor
  mcp.registerTool(
    "search_actor",
    {
      title: "Search for actors by name",
      description: "Find actors based on full or partial name",
      inputSchema: {
        query: z.string().describe("Full or partial name of actor"),
      },
    },
    async ({ query }) => {
      const res = await axios.get(`${TMDB_API}/search/person`, {
        params: {
          query,
          api_key: process.env.TMDB_API_KEY,
        },
      });

      return {
        content: res.data.results.map((person: any) => ({
          id: person.id,
          name: person.name,
          known_for: person.known_for_department,
          popularity: person.popularity,
        })),
      };
    }
  );

  // 🟣 4. get_movies_by_actor
  mcp.registerTool(
    "get_movies_by_actor",
    {
      title: "Get movies by actor ID",
      description: "Fetch all movies associated with an actor",
      inputSchema: {
        actorId: z.string().describe("TMDB person ID of the actor"),
      },
    },
    async ({ actorId }) => {
      const res = await axios.get(
        `${TMDB_API}/person/${actorId}/movie_credits`,
        {
          params: { api_key: process.env.TMDB_API_KEY },
        }
      );

      return {
        content: res.data.cast.map((movie: any) => ({
          id: movie.id,
          title: movie.title,
          character: movie.character,
          release_date: movie.release_date,
        })),
      };
    }
  );

  // 🔴 5. top_rated_movies
  mcp.registerTool(
    "top_rated_movies",
    {
      title: "Get top-rated movies",
      description: "Fetch top-rated movies (optionally by genre)",
      inputSchema: {
        genreId: z.string().optional().describe("TMDB genre ID (optional)"),
      },
    },
    async ({ genreId }) => {
      const res = await axios.get(`${TMDB_API}/movie/top_rated`, {
        params: {
          api_key: process.env.TMDB_API_KEY,
        },
      });

      let movies = res.data.results;
      if (genreId) {
        movies = movies.filter((movie: any) =>
          movie.genre_ids.includes(parseInt(genreId))
        );
      }

      return {
        content: movies.map((movie: any) => ({
          id: movie.id,
          title: movie.title,
          rating: movie.vote_average,
          release_date: movie.release_date,
        })),
      };
    }
  );

  // 🚀 Start server
  const transport = new StdioServerTransport();
  await mcp.connect(transport);
})();
