# Movie MCP

A Node.js/TypeScript server that exposes movie and actor search tools using the Model Context Protocol (MCP) and The Movie Database (TMDB) API.

## Features

- Search for movies by title
- Get detailed movie info by TMDB ID
- Search for actors by name
- Get movies by actor ID
- List available genres
- Fetch top-rated movies (optionally by genre)

## Requirements

- Node.js >= 16
- TMDB API Key ([get one here](https://www.themoviedb.org/settings/api))

## Setup

1. Clone the repository and install dependencies:
   ```sh
   cd mcp_movie
   npm install
   ```
2. Create a `.env` file in the `mcp_movie` directory with your TMDB API key:
   ```env
   TMDB_API_KEY=your_tmdb_api_key_here
   ```

## Usage

Start the MCP server:

```sh
npm start
```

The server will expose several tools for searching movies, actors, genres, and ratings via the MCP protocol.

## Scripts

- `npm start` — Start the MCP server
- `npm test` — Placeholder for tests

## Dependencies

- [@modelcontextprotocol/sdk](https://www.npmjs.com/package/@modelcontextprotocol/sdk)
- [axios](https://www.npmjs.com/package/axios)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [zod](https://www.npmjs.com/package/zod)

## License

ISC
