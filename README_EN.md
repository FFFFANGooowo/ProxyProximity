# ProxyProximity - A Highly Compatible Serverless API Proxy

Welcome to ProxyProximity! This is a tool designed for Deno Deploy to help you easily proxy various API services (such as OpenAI, Google AI, etc.) without complex configurations. Whether you're a beginner or an experienced developer, I hope this project can be of help to you! 😊

---

## Key Features ✨

- **Dynamic Routing**: Automatically forwards requests to the target API based on the URL, e.g., `https://your-deno-domain/api.openai.com/...` will be forwarded to `https://api.openai.com/...`.
- **Smart Authentication**: Automatically identifies the API type (e.g., Google or OpenAI) and sets the correct authentication method.
- **CORS Support**: Resolves browser CORS restrictions, allowing your frontend applications to directly call APIs.

---

## Easy Deployment on Deno Deploy 🚀

Deno Deploy is a simple and user-friendly platform that offers free hosting for your code. Below are detailed deployment steps that you can easily follow, even if it's your first time! We will deploy by forking this project and configuring it on Deno Deploy.

### Step 1: Fork This Project 🍴

1. Log in to your GitHub account (if you don't have one, please register at [github.com](https://github.com)).
2. Visit the project repository page: [https://github.com/FFFFANGooowo/ProxyProximity](https://github.com/FFFFANGooowo/ProxyProximity).
3. In the top-right corner of the page, click the **Fork** button to copy this project to your GitHub account. This creates a personal copy for you to manage and deploy.

### Step 2: Access Deno Deploy and Log In 🌐

1. Open your browser and go to [dash.deno.com](https://dash.deno.com).
2. Click **Sign in with GitHub** to authorize Deno Deploy to access your GitHub account.
3. After logging in, you will be directed to the Deno Deploy dashboard.

### Step 3: Create a New Project 🆕

1. In the Deno Deploy dashboard, click the **New Project** button.
2. You will be prompted to choose a source; select **Deploy from GitHub**.

### Step 4: Select Your Forked Repository 📂

1. In the pop-up list of GitHub repositories, find the project you just forked (e.g., `your-username/ProxyProximity`).
2. Click on the repository to select it as the deployment source.

### Step 5: Name Your Project 🎨

1. On the project setup page, enter a name for your project, such as `my-api-proxy`. This name will determine your proxy domain, e.g., `my-api-proxy.deno.dev`.
2. Make sure the name is concise and memorable, as it will be the domain you use in your applications.

### Step 6: Choose the Entry Point File 📄

1. On the same page, locate the **Entry Point** or **Main File** option.
2. Set it to `proxy.ts`. This is the entry file for our proxy application, and Deno Deploy will start the service with this file.

### Step 7: Deploy the Project 🚀

1. After confirming all settings, click the **Deploy** button.
2. Deno Deploy will start building and deploying your project. Within a few seconds, you will see a success message, and your proxy service will be available at a domain like `https://my-api-proxy.deno.dev`.
3. Note down this domain; it will be your API proxy address.

### Step 8: Replace the Target Service Domain 🔄

1. Suppose you want to proxy OpenAI's API, with the original URL being `https://api.openai.com/v1/chat/completions`.
2. Replace the domain part of the URL with your Deno Deploy domain, resulting in `https://my-api-proxy.deno.dev/api.openai.com/v1/chat/completions`.
3. Use this new URL in your application to send requests. The proxy will automatically forward the request to OpenAI and return the result.

**Tip**: You can proxy any API service by embedding the target domain (e.g., `api.openai.com` or `generativelanguage.googleapis.com`) after your Deno domain.

---

## Local Testing (Optional) 🖥️

If you want to test the proxy service locally, follow these steps:

1. **Install Deno**:
   - Visit [deno.land](https://deno.land/) and follow the instructions to download and install the Deno runtime environment.
2. **Run the Proxy**:
   - Open a command line, navigate to the project directory, and run the following command:
     ```
     deno run --allow-net --allow-env --allow-read proxy.ts
     ```
   - The proxy service will start on `http://localhost:8000`.
3. **Use the Test UI**:
   - Open your browser and go to `http://localhost:8000`. You will see a test Web UI page.
   - Enter your API key and target API base URL (e.g., `api.openai.com`), select or input a model ID, and start a chat test.
   - This page supports streaming (SSE) and context management, and it displays detailed error messages to help you diagnose issues.
4. **Send Direct Requests**:
   - Alternatively, you can send API requests directly to `http://localhost:8000/api.openai.com/v1/chat/completions` to confirm the proxy functionality.

---

## Usage Examples and Test UI 📋

**The URL provided by Deno is the address of the test Web UI** (e.g., https://your-project-name.deno.dev)
In addition to using the proxy URL directly in your code, you can also use the provided test UI page to quickly validate the proxy functionality. Below are some common API proxy methods for your reference:

- **Proxying OpenAI API**:
  - Original URL: `https://api.openai.com/v1/chat/completions`
  - Proxy URL: `https://your-project-name.deno.dev/api.openai.com/v1/chat/completions`
  - Authentication: Use `Authorization: Bearer your-api-key`
  - Testing Method: Enter your API key and `api.openai.com` in the test UI, select a model, and send a message.

- **Proxying Google AI API**:
  - Original URL: `https://generativelanguage.googleapis.com/v1/models`
  - Proxy URL: `https://your-project-name.deno.dev/generativelanguage.googleapis.com/v1/models`
  - Authentication: Use `X-Goog-Api-Key: your-api-key`
  - Testing Method: Enter your API key and `generativelanguage.googleapis.com` in the test UI, fetch the model list, and select a model.
  - **Note**: If you are using an AI terminal that does not support Google format (e.g., Cherry Studio), ensure you switch to the correct API format or use a client specifically designed for Google API to avoid compatibility issues.

- **Proxying Anthropic API**:
  - Original URL: `https://api.anthropic.com/v1/complete`
  - Proxy URL: `https://your-project-name.deno.dev/api.anthropic.com/v1/complete`
  - Authentication: Use `Authorization: Bearer your-api-key`
  - Testing Method: Enter your API key and `api.anthropic.com` in the test UI, select a model, and send a message.
  - **Note**: If you are using an AI terminal that does not support Anthropic format (e.g., Cherry Studio), ensure you switch to the correct API format or use a client specifically designed for Anthropic API to avoid compatibility issues.

**How to Pass API Keys**:
- You can pass the key in the request headers (e.g., `Authorization` or `x-api-key`), or add a query parameter `key=your-api-key` to the URL.

---

## Web UI Features in Detail 🖼️

ProxyProximity provides an intuitive and powerful Web UI for users to test and debug API calls. Below are the main features of the Web UI:
- **Configuration Input**: Users can input their API key and the full API base URL (e.g., `api.openai.com/v1` or `ark.cn-beijing.volces.com/api/v3`). The Web UI constructs the correct proxy URL based on the input and displays it for easy copying.
- **Model Selection and Customization**: Users can select a model from the fetched list or input a custom model ID in the text field. The custom input takes precedence over the selected model, ensuring flexibility and accuracy.
- **Chat Testing**: Users can type messages in the chat interface and send requests. The Web UI supports streaming (SSE) responses, displaying AI replies in real-time. It also supports Markdown formatting for better readability and aesthetics.
- **System Prompt Setting**: Users can set a system-level prompt (e.g., "Please respond in Chinese"), which is included in the request and influences the AI's response style. The prompt control is collapsible to save space.
- **Error Notification and Debugging**: If an error occurs during a request, the Web UI displays detailed error information, including HTTP status codes and specific error messages, helping users quickly diagnose issues.
- **Responsive Layout**: The Web UI uses a left-right layout, with configuration and model selection on the left and the chat interface on the right. On smaller screens, the layout automatically adjusts to a top-bottom arrangement for a better user experience.

---

## Project Advantages 🌟

ProxyProximity is a powerful and flexible tool suitable for various AI service integration scenarios. Below are the main advantages of this project:

- **Strong Compatibility**: Supports multiple AI service providers (e.g., OpenAI, Google AI, X.AI) through dynamic routing and smart authentication mechanisms, capable of proxying almost any HTTP API service and adapting to different API formats and authentication methods.
- **High Extensibility**: Designed with flexibility in mind, it is easy to extend functionality. Users can customize proxy logic or add new features based on their needs, adapting to evolving API service requirements.
- **Data Transparency**: The proxy process minimally alters original request and response data, ensuring data integrity and consistency. Developers can use it with confidence, without worrying about data tampering.
- **Deno Deploy Advantage**: Deploying via Deno Deploy allows for quick setup, and the service is accessible directly from mainland China without additional network configurations, solving access restriction issues faced by many other proxy tools.
- **CORS Solution**: Effectively bypasses CORS (Cross-Origin Resource Sharing) restrictions, allowing frontend applications to call APIs directly without backend intermediaries, simplifying the development process.
- **Ease of Use and Customizability**: Provides an intuitive Web UI for testing and debugging, while also supporting local operation and custom configurations, catering to the needs of both beginners and advanced developers.

---

## Frequently Asked Questions (FAQ) ❓

- **Q: What should I do if I encounter an error when accessing the proxy domain after deployment?**
  - A: Please check if your API key is passed correctly and ensure the URL format is correct. If the issue persists, check the logs in the Deno Deploy dashboard for detailed error information.
- **Q: Why does my IDE show TypeScript errors?**
  - A: This is because Deno uses a specific runtime environment, and your IDE may not recognize Deno's APIs. These errors do not affect the actual deployment and can be ignored.
- **Q: Which API services can be proxied?**
  - A: In theory, any HTTP API service can be proxied by embedding the target domain into your proxy URL.

---

## License 📜

MIT

---

**Enjoy using ProxyProximity! If you find this project helpful, please consider giving it a Star for support! ⭐**
