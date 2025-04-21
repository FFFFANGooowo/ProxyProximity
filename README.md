# ProxyProximity，一个兼容性强的无服务器API代理

欢迎使用ProxyProximity！这是一个为Deno Deploy设计的工具，可以帮助你轻松代理各种API服务（如OpenAI、Google AI等），无需复杂配置。无论你是新手还是有经验的开发者，我都希望这个项目都能帮到你！😊

---

## 功能亮点 ✨

- **动态路由**：根据URL自动将请求转发到目标API，例如 `https://你的Deno域名/api.openai.com/...` 会转发到 `https://api.openai.com/...`。
- **智能认证**：自动识别API类型（例如Google或OpenAI），并设置正确的认证方式。
- **跨域支持**：解决浏览器跨域限制，让你的前端应用也能直接调用API。

---

## 在Deno Deploy上轻松部署 🚀

Deno Deploy是一个简单易用的平台，可以免费托管你的代码。以下是详细的部署步骤，即使你是第一次使用，也能轻松完成！我们将通过Fork本项目并在Deno Deploy上配置来完成部署。

### 步骤1：Fork本项目 🍴

1. 登录你的GitHub账号（如果没有账号，请先注册一个，地址：[github.com](https://github.com)）。
2. 访问本项目仓库页面：[https://github.com/FFFFANGooowo/ProxyProximity](https://github.com/FFFFANGooowo/ProxyProximity)。
3. 在页面右上角，点击 **Fork** 按钮，将本项目复制到你的GitHub账号下。这会创建一个属于你的副本，方便你管理和部署。

### 步骤2：进入Deno Deploy并登录 🌐

1. 打开浏览器，访问 [dash.deno.com](https://dash.deno.com)。
2. 点击 **Sign in with GitHub**（使用GitHub登录），授权Deno Deploy访问你的GitHub账号。
3. 登录后，你会进入Deno Deploy的控制面板。

### 步骤3：新建一个Project 🆕

1. 在Deno Deploy控制面板中，点击 **New Project**（新建项目）按钮。
2. 系统会提示你选择一个来源，选择 **Deploy from GitHub**（从GitHub部署）。

### 步骤4：选择Fork后的仓库 📂

1. 在弹出的GitHub仓库列表中，找到你刚才Fork的项目（例如 `你的用户名/ProxyProximity`）。
2. 点击该仓库，将其选中作为部署来源。

### 步骤5：为Project起一个好听的名字 🎨

1. 在项目设置页面，为你的项目输入一个名字，例如 `my-api-proxy`。这个名字将决定你的代理域名，例如 `my-api-proxy.deno.dev`。
2. 确保名字简洁易记，因为这将是你在应用中使用的域名。

### 步骤6：选择接入点文件 📄

1. 在同一页面，找到 **Entry Point**（接入点）或 **Main File**（主文件）选项。
2. 将其设置为 `proxy.ts`。这是我们的代理程序入口文件，Deno Deploy会以此文件启动服务。

### 步骤7：部署项目 🚀

1. 确认所有设置无误后，点击 **Deploy**（部署）按钮。
2. Deno Deploy会开始构建和部署你的项目。几秒钟后，你会看到部署成功的提示，你的代理服务将在类似 `https://my-api-proxy.deno.dev` 的域名上可用。
3. 记下这个域名，它将是你的API代理地址。

### 步骤8：将需要代理的服务商域名替换 🔄

1. 假设你想代理OpenAI的API，原始URL是 `https://api.openai.com/v1/chat/completions`。
2. 将URL中的域名部分替换为你的Deno Deploy域名，即变成 `https://my-api-proxy.deno.dev/api.openai.com/v1/chat/completions`。
3. 在你的应用中使用这个新URL发送请求，代理会自动将请求转发到OpenAI，并返回结果。

**小贴士**：你可以代理任何API服务，只需将目标域名（如 `api.openai.com` 或 `generativelanguage.googleapis.com`）嵌入到你的Deno域名后即可。

---

## 本地测试（可选）🖥️

如果你想在本地测试代理服务，可以按照以下步骤操作：

1. **安装Deno**：
   - 访问 [deno.land](https://deno.land/)，按照说明下载并安装Deno运行环境。
2. **运行代理**：
   - 打开命令行，导航到项目目录，运行以下命令：
     ```
     deno run --allow-net --allow-env --allow-read proxy.ts
     ```
   - 代理服务将在 `http://localhost:8000` 上启动。
3. **使用测试UI**：
   - 打开浏览器，访问 `http://localhost:8000`，你将看到一个测试用的Web UI页面。
   - 在页面上输入你的API密钥和目标API基础地址（例如 `api.openai.com`），选择或输入模型ID，然后开始聊天测试。
   - 该页面支持流式传输（SSE）和上下文管理，并会显示详细的错误信息，帮助你诊断问题。
4. **直接发送请求**：
   - 或者，你可以直接向 `http://localhost:8000/api.openai.com/v1/chat/completions` 发送API请求，确认代理功能正常。

---

## 使用示例与测试UI 📋

**Deno为你提供的URL就是测试用Web UI的地址**（如https://你的项目名称.deno.dev）
除了直接在代码中使用代理URL外，你还可以使用我们提供的测试UI页面来快速验证代理功能。以下是一些常见API的代理方式，供你参考：

- **代理OpenAI API**：
  - 原始URL：`https://api.openai.com/v1/chat/completions`
  - 代理URL：`https://你的项目名称.deno.dev/api.openai.com/v1/chat/completions`
  - 认证方式：使用 `Authorization: Bearer 你的API密钥`
  - 测试方式：在测试UI中输入API密钥和 `api.openai.com`，选择模型后发送消息。

- **代理Google AI API**：
  - 原始URL：`https://generativelanguage.googleapis.com/v1/models`
  - 代理URL：`https://你的项目名称.deno.dev/generativelanguage.googleapis.com/v1/models`
  - 认证方式：使用 `X-Goog-Api-Key: 你的API密钥`
  - 测试方式：在测试UI中输入API密钥和 `generativelanguage.googleapis.com`，获取模型列表后选择模型。
  - **注意**：如果您使用的是非Google格式的AI终端（如Cherry Studio），请确保切换到正确的API格式或使用专门支持Google API的客户端，以避免兼容性问题。

- **代理Anthropic API**：
  - 原始URL：`https://api.anthropic.com/v1/complete`
  - 代理URL：`https://你的项目名称.deno.dev/api.anthropic.com/v1/complete`
  - 认证方式：使用 `Authorization: Bearer 你的API密钥`
  - 测试方式：在测试UI中输入API密钥和 `api.anthropic.com`，选择模型后发送消息。
  - **注意**：如果您使用的是非Anthropic格式的AI终端（如Cherry Studio），请确保切换到正确的API格式或使用专门支持Anthropic API的客户端，以避免兼容性问题。

**如何传递API密钥**：
- 你可以在请求头中传递密钥（如 `Authorization` 或 `x-api-key`），或者在URL中添加查询参数 `key=你的API密钥`。

---

## Web UI功能详解 🖼️

ProxyProximity提供了一个直观且功能强大的Web UI，方便用户测试和调试API调用。以下是Web UI的主要功能：
- **配置信息输入**：用户可以输入API密钥和完整的API基础地址（如 `api.openai.com/v1` 或 `ark.cn-beijing.volces.com/api/v3`），Web UI会根据输入的地址构建正确的代理URL，并显示在界面上，方便复制。
- **模型选择与自定义**：用户可以从获取的模型列表中选择一个模型，也可以在输入框中自定义模型ID。自定义输入的模型ID将优先于列表中选择的模型，确保灵活性和准确性。
- **聊天测试功能**：用户可以在聊天界面输入消息并发送请求，Web UI支持流式传输（SSE）响应，实时显示AI的回复内容。同时支持Markdown格式渲染，使响应内容更加美观和易读。
- **系统提示词设置**：用户可以设置系统级提示词（如“请使用中文回答”），该提示词会包含在请求中，影响AI的回复风格。提示词控件位于聊天页面下方，支持折叠以节省空间。
- **错误提示与调试**：如果请求过程中出现错误，Web UI会显示详细的错误信息，包括HTTP状态码和具体错误描述，帮助用户快速诊断问题。
- **响应式布局**：Web UI采用左右布局，配置和模型选择在左侧，聊天界面在右侧。在小屏幕设备上，布局会自动调整为上下排列，确保良好的用户体验。

---

## 项目优势 🌟

ProxyProximity是一个强大且灵活的工具，适用于各种AI服务集成场景。以下是这个项目的主要优势：

- **强大的兼容性**：支持多种AI服务提供商（如OpenAI、Google AI、X.AI等），通过动态路由和智能认证机制，几乎可以代理任何HTTP API服务，适应不同的API格式和认证方式。
- **强扩展性**：项目设计灵活，易于扩展功能，用户可以根据需求自定义代理逻辑或添加新特性，适应不断变化的API服务需求。
- **数据透明性**：代理过程几乎不修改原始请求和响应数据，确保数据的完整性和一致性，开发者可以放心使用，不必担心数据被篡改。
- **Deno Deploy部署优势**：通过Deno Deploy平台部署，项目可以快速上线，且在中国大陆地区也能直接访问，无需额外的网络配置，解决了许多其他代理工具的访问限制问题。
- **跨域问题解决**：有效绕过CORS（跨域资源共享）限制，使前端应用可以直接调用API，无需后端中转，简化了开发流程。
- **易用性和可定制性**：提供直观的Web UI用于测试和调试，同时支持本地运行和自定义配置，满足从新手到高级开发者的不同需求。

---

## 常见问题解答（FAQ）❓

- **Q：部署后访问代理域名时出现错误怎么办？**
  - A：请检查你的API密钥是否正确传递，确保URL格式正确。如果仍有问题，可以在Deno Deploy控制面板查看日志，了解错误详情。
- **Q：为什么我的IDE显示TypeScript错误？**
  - A：这是因为Deno使用特定的运行环境，IDE可能不认识Deno的API。这些错误不会影响实际部署，可以忽略。
- **Q：可以代理哪些API服务？**
  - A：理论上可以代理任何HTTP API服务，只需将目标域名嵌入到你的代理URL中即可。

---

## 许可证 📜

MIT

---

**祝你使用愉快！如果觉得这个项目有用，记得给个Star支持一下哦！⭐**
