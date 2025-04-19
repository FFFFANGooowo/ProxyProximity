# Universal API Proxy

This project provides a universal API proxy for Deno Deploy that can route requests to various API endpoints based on the URL structure. It supports different API authentication styles based on the target domain.

## Features

- **Dynamic Routing**: Routes requests to the target API based on the URL format `https://[your-deno-domain]/[target-api-domain]/...`
- **API Style Detection**: Automatically detects the API style (e.g., Google or OpenAI/X.AI) and sets the appropriate authentication headers.
- **CORS Support**: Handles CORS preflight requests to allow cross-origin requests.

## Deployment on Deno Deploy

1. **Create a Deno Deploy Project**:
   - Sign up or log in to [Deno Deploy](https://deno.com/deploy).
   - Create a new project.

2. **Deploy the Proxy**:
   - Use the following command to deploy directly from this repository if it's hosted on GitHub, or upload the `proxy.ts` file manually:
     ```
     deno deploy --project=your-project-name ./proxy.ts
     ```
   - Alternatively, link your GitHub repository to Deno Deploy for automatic deployments on push.

3. **Set Environment Variables** (Optional):
   - If you want to set a default API key, add `UNIVERSAL_API_KEY` in the Deno Deploy project settings under Environment Variables.

4. **Access Your Proxy**:
   - Once deployed, your proxy will be accessible at `https://your-project-name.deno.dev`.
   - Use it by prefixing your API URLs with your Deno domain, e.g., `https://your-project-name.deno.dev/api.openai.com/v1/chat/completions` to proxy requests to OpenAI.

## Local Development

1. **Install Deno**:
   - If not already installed, download and install Deno from [deno.land](https://deno.land/).

2. **Run the Proxy Locally**:
   - Navigate to the project directory and run:
     ```
     deno run --allow-net --allow-env proxy.ts
     ```
   - The server will start on `http://localhost:8000`.

3. **Test the Proxy**:
   - Send requests to `http://localhost:8000/[target-api-domain]/...` to test the proxy functionality.

## Usage Examples

- **Proxying OpenAI API**:
  - Original URL: `https://api.openai.com/v1/chat/completions`
  - Proxied URL: `https://your-project-name.deno.dev/api.openai.com/v1/chat/completions`
  - Authentication: Uses `Authorization: Bearer [your-api-key]`

- **Proxying Google AI API**:
  - Original URL: `https://generativelanguage.googleapis.com/v1/models`
  - Proxied URL: `https://your-project-name.deno.dev/generativelanguage.googleapis.com/v1/models`
  - Authentication: Uses `X-Goog-Api-Key: [your-api-key]`

## Troubleshooting

- **TypeScript Errors**: If you see errors in your IDE about missing Deno types, they can be ignored as Deno doesn't require TypeScript configuration for runtime. These errors won't affect deployment on Deno Deploy.
- **API Key Issues**: Ensure you're passing the API key correctly via headers (`Authorization`, `x-api-key`, `x-goog-api-key`) or as a query parameter (`key`).

## License

MIT
