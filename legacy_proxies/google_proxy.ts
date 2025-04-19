// Google AI API proxy for Deno
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

function getApiKey(req: Request): string | null {
  const url = new URL(req.url);
  const authHeader = req.headers.get("Authorization");
  const apiKeyFromAuth = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;

  return url.searchParams.get("key") ||
    apiKeyFromAuth ||
    req.headers.get("x-api-key") ||
    req.headers.get("x-goog-api-key") || 
    Deno.env.get("GOOGLE_API_KEY") ||
    null;
}

const GOOGLE_API_BASE = "https://generativelanguage.googleapis.com";

async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  
  // Handle root path
  if (url.pathname === '/') {
    return new Response('Google AI API Proxy is Running', {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': '*'
      }
    });
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

    // Construct target URL without API key parameter
    const targetUrl = new URL(`${GOOGLE_API_BASE}${url.pathname}${url.search}`);

    // Prepare headers to forward
    const forwardHeaders = new Headers(req.headers);
    forwardHeaders.delete('Host');
    // Remove all possible client key headers
    forwardHeaders.delete('Authorization');
    forwardHeaders.delete('x-api-key');
    forwardHeaders.delete('x-goog-api-key');
    // Set the correct API key header
    forwardHeaders.set('X-Goog-Api-Key', apiKey);

    console.log('Forwarding Headers to Google:', [...forwardHeaders.entries()]);

    // Forward request
    const apiResponse = await fetch(targetUrl.toString(), {
      method: req.method,
      headers: forwardHeaders,
      body: req.body,
    });

    // Log basic response info
    const googleContentType = apiResponse.headers.get('Content-Type');
    const googleStatus = apiResponse.status;
    console.log(`Google Response Status: ${googleStatus}`);
    console.log(`Google Response Content-Type: ${googleContentType}`);

    // Handle JSON responses specially for error debugging
    if (googleContentType?.includes('application/json')) {
      try {
        const responseBodyText = await apiResponse.text();
        console.error(`Received JSON body from Google (Status ${googleStatus}):`, responseBodyText);
        
        const responseHeaders = new Headers(apiResponse.headers);
        responseHeaders.delete('Content-Encoding');
        responseHeaders.delete('Transfer-Encoding');
        responseHeaders.set('Access-Control-Allow-Origin', '*');
        responseHeaders.set('Content-Type', 'application/json; charset=UTF-8');

        return new Response(responseBodyText, {
          status: googleStatus,
          headers: responseHeaders
        });
      } catch (e) {
        console.error("Error processing JSON response:", e);
        return new Response(JSON.stringify({ 
          error: "Failed to process Google response",
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
    else if (googleContentType?.includes('text/event-stream')) {
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
      console.warn(`Unexpected Content-Type from Google: ${googleContentType}`);
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
console.log("Proxy server running on http://localhost:8000");
serve(handler, { port: 8000 });
