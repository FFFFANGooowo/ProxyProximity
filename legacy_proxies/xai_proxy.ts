// X.AI API proxy for Deno Deploy
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

function getApiKey(req: Request): string | null {
  const url = new URL(req.url);
  const authHeader = req.headers.get("Authorization");
  const apiKeyFromAuth = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;

  // OpenAI/X.AI 风格通常只用 Authorization: Bearer 或 key query
  let envKey: string | null = null;
  try {
    // 兼容 Deno deploy 和本地类型检查
    envKey = typeof Deno !== "undefined" && Deno.env?.get
      ? Deno.env.get("XAI_API_KEY") ?? null
      : null;
  } catch {
    envKey = null;
  }
  return url.searchParams.get("key") ||
    apiKeyFromAuth ||
    req.headers.get("x-api-key") ||
    envKey ||
    null;
}

const XAI_API_BASE = "https://api.x.ai/v1";

async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);

  // Handle root path
  if (url.pathname === '/') {
    return new Response('X.AI API Proxy is Running', {
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
        "Access-Control-Allow-Headers": "Authorization, x-api-key, Content-Type"
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

    // 修正路径拼接，避免重复 /v1 前缀
    let apiPath = url.pathname;
    if (apiPath.startsWith("/v1/")) {
      apiPath = apiPath.substring(3); // 去掉第一个 /v1
    }
    const targetUrl = new URL(`${XAI_API_BASE}${apiPath}${url.search}`);

    // Prepare headers to forward
    const forwardHeaders = new Headers(req.headers);
    forwardHeaders.delete('Host');
    // Remove all possible client key headers
    forwardHeaders.delete('Authorization');
    forwardHeaders.delete('x-api-key');
    // Set the correct API key header for OpenAI/X.AI
    forwardHeaders.set('Authorization', `Bearer ${apiKey}`);

    console.log('Forwarding Headers to X.AI:', [...forwardHeaders.entries()]);

    // Forward request
    const apiResponse = await fetch(targetUrl.toString(), {
      method: req.method,
      headers: forwardHeaders,
      body: req.body,
    });

    // Log basic response info
    const xaiContentType = apiResponse.headers.get('Content-Type');
    const xaiStatus = apiResponse.status;
    console.log(`X.AI Response Status: ${xaiStatus}`);
    console.log(`X.AI Response Content-Type: ${xaiContentType}`);

    // Handle JSON responses specially for error debugging
    if (xaiContentType?.includes('application/json')) {
      try {
        const responseBodyText = await apiResponse.text();
        console.error(`Received JSON body from X.AI (Status ${xaiStatus}):`, responseBodyText);

        const responseHeaders = new Headers(apiResponse.headers);
        responseHeaders.delete('Content-Encoding');
        responseHeaders.delete('Transfer-Encoding');
        responseHeaders.set('Access-Control-Allow-Origin', '*');
        responseHeaders.set('Content-Type', 'application/json; charset=UTF-8');

        return new Response(responseBodyText, {
          status: xaiStatus,
          headers: responseHeaders
        });
      } catch (e) {
        console.error("Error processing JSON response:", e);
        return new Response(JSON.stringify({
          error: "Failed to process X.AI response",
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
    else if (xaiContentType?.includes('text/event-stream')) {
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
      console.warn(`Unexpected Content-Type from X.AI: ${xaiContentType}`);
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
