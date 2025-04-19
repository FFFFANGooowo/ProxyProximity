// Universal API Proxy for Deno Deploy
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

function getApiKey(req: Request): string | null {
  const url = new URL(req.url);
  const authHeader = req.headers.get("Authorization");
  const apiKeyFromAuth = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;

  // Support multiple API key retrieval methods
  let envKey: string | null = null;
  try {
    envKey = typeof Deno !== "undefined" && Deno.env?.get
      ? Deno.env.get("UNIVERSAL_API_KEY") ?? null
      : null;
  } catch {
    envKey = null;
  }
  return url.searchParams.get("key") ||
    apiKeyFromAuth ||
    req.headers.get("x-api-key") ||
    req.headers.get("x-goog-api-key") ||
    envKey ||
    null;
}

async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);

  // Handle root path and static files
  if (url.pathname === '/' || url.pathname === '/index.html') {
    try {
      // Read the index.html file
      const fileContent = await Deno.readTextFile('./index.html');
      return new Response(fileContent, {
        status: 200,
        headers: {
          'Content-Type': 'text/html; charset=UTF-8',
          'Access-Control-Allow-Origin': '*'
        }
      });
    } catch (error) {
      console.error("Error serving index.html:", error);
      return new Response('Error loading test UI', {
        status: 500,
        headers: {
          'Content-Type': 'text/plain',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
  }

  // Handle OPTIONS for CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Authorization, x-api-key, x-goog-api-key, Content-Type"
      }
    });
  }

  try {
    const apiKey = getApiKey(req);
    if (!apiKey) {
      return new Response(JSON.stringify({
        error: "API key required via Authorization header, x-api-key header or key query parameter"
      }), {
        status: 401,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }

    // Extract the target API domain from the URL path
    const pathSegments = url.pathname.split('/').filter(segment => segment.length > 0);
    if (pathSegments.length < 1) {
      return new Response(JSON.stringify({
        error: "Invalid URL format. Expected format: /[target-domain]/..."
      }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }

    const targetDomain = pathSegments[0];
    const remainingPath = pathSegments.slice(1).join('/');
    const targetBaseUrl = `https://${targetDomain}`;
    const targetUrl = new URL(`${targetBaseUrl}/${remainingPath}${url.search}`);

    // Prepare headers to forward
    const forwardHeaders = new Headers(req.headers);
    forwardHeaders.delete('Host');
    // Remove all possible client key headers
    forwardHeaders.delete('Authorization');
    forwardHeaders.delete('x-api-key');
    forwardHeaders.delete('x-goog-api-key');

    // Determine the API style based on the target domain and set the appropriate header
    const isGoogleStyle = targetDomain.includes('generativelanguage.googleapis.com');
    if (isGoogleStyle) {
      forwardHeaders.set('X-Goog-Api-Key', apiKey);
    } else {
      forwardHeaders.set('Authorization', `Bearer ${apiKey}`);
    }

    console.log(`Forwarding Headers to ${targetDomain}:`, [...forwardHeaders.entries()]);

    // Forward request
    const apiResponse = await fetch(targetUrl.toString(), {
      method: req.method,
      headers: forwardHeaders,
      body: req.body,
    });

    // Log basic response info
    const contentType = apiResponse.headers.get('Content-Type');
    const status = apiResponse.status;
    console.log(`Response Status from ${targetDomain}: ${status}`);
    console.log(`Response Content-Type from ${targetDomain}: ${contentType}`);

    // Handle JSON responses specially for error debugging
    if (contentType?.includes('application/json')) {
      try {
        const responseBodyText = await apiResponse.text();
        console.error(`Received JSON body from ${targetDomain} (Status ${status}):`, responseBodyText);

        const responseHeaders = new Headers(apiResponse.headers);
        responseHeaders.delete('Content-Encoding');
        responseHeaders.delete('Transfer-Encoding');
        responseHeaders.set('Access-Control-Allow-Origin', '*');
        responseHeaders.set('Content-Type', 'application/json; charset=UTF-8');

        return new Response(responseBodyText, {
          status: status,
          headers: responseHeaders
        });
      } catch (e) {
        console.error("Error processing JSON response:", e);
        return new Response(JSON.stringify({
          error: `Failed to process response from ${targetDomain}`,
          details: e instanceof Error ? e.message : String(e)
        }), {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        });
      }
    }
    // Handle SSE streams normally
    else if (contentType?.includes('text/event-stream')) {
      const responseHeaders = new Headers(apiResponse.headers);
      responseHeaders.delete('Content-Encoding');
      responseHeaders.delete('Transfer-Encoding');
      responseHeaders.set('Access-Control-Allow-Origin', '*');

      console.log('Forwarding SSE stream response');
      return new Response(apiResponse.body, {
        status: apiResponse.status,
        headers: responseHeaders
      });
    }
    // Handle other response types
    else {
      console.warn(`Unexpected Content-Type from ${targetDomain}: ${contentType}`);
      const responseHeaders = new Headers(apiResponse.headers);
      responseHeaders.set('Access-Control-Allow-Origin', '*');

      return new Response(apiResponse.body, {
        status: apiResponse.status,
        headers: responseHeaders
      });
    }

  } catch (error) {
    console.error("Proxy error:", error);
    return new Response(JSON.stringify({
      error: "Internal Server Error",
      details: error instanceof Error ? error.message : String(error)
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
}

// Start the server
console.log("Universal Proxy server running on http://localhost:8000");
serve(handler, { port: 8000 });
