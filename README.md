# 通用API代理 - 新手友好指南 🌟

欢迎使用通用API代理！这是一个为Deno Deploy设计的工具，可以帮助你轻松代理各种API服务（如OpenAI、Google AI等），无需复杂配置。无论你是新手还是有经验的开发者，这个项目都能帮到你！😊

本指南将手把手教你如何部署和使用这个代理工具，即使你从未接触过Deno Deploy，也能轻松上手。让我们开始吧！

---

## 什么是通用API代理？🤔

通用API代理是一个中间服务，它可以将你的请求转发到不同的API服务商（如OpenAI、Google AI等）。通过这个代理，你只需修改API的URL前缀，就能访问各种API服务，而无需更改代码或担心跨域问题。

**简单来说**：它就像一个“翻译官”，帮你把请求送到正确的API服务商，并把结果返回给你。

---

## 功能亮点 ✨

- **动态路由**：根据URL自动将请求转发到目标API，例如 `https://你的Deno域名/api.openai.com/...` 会转发到 `https://api.openai.com/...`。
- **智能认证**：自动识别API类型（例如Google或OpenAI），并设置正确的认证方式。
- **跨域支持**：解决浏览器跨域限制，让你的前端应用也能直接调用API。

---

## 如何在Deno Deploy上部署 🚀

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
     deno run --allow-net --allow-env proxy.ts
     ```
   - 代理服务将在 `http://localhost:8000` 上启动。
3. **测试请求**：
   - 向 `http://localhost:8000/api.openai.com/v1/chat/completions` 发送请求，确认代理功能正常。

---

## 使用示例 📋

以下是一些常见API的代理方式，供你参考：

- **代理OpenAI API**：
  - 原始URL：`https://api.openai.com/v1/chat/completions`
  - 代理URL：`https://你的项目名称.deno.dev/api.openai.com/v1/chat/completions`
  - 认证方式：使用 `Authorization: Bearer 你的API密钥`

- **代理Google AI API**：
  - 原始URL：`https://generativelanguage.googleapis.com/v1/models`
  - 代理URL：`https://你的项目名称.deno.dev/generativelanguage.googleapis.com/v1/models`
  - 认证方式：使用 `X-Goog-Api-Key: 你的API密钥`

**如何传递API密钥**：
- 你可以在请求头中传递密钥（如 `Authorization` 或 `x-api-key`），或者在URL中添加查询参数 `key=你的API密钥`。

---

## 常见问题解答（FAQ）❓

- **Q：部署后访问代理域名时出现错误怎么办？**
  - A：请检查你的API密钥是否正确传递，确保URL格式正确。如果仍有问题，可以在Deno Deploy控制面板查看日志，了解错误详情。
- **Q：为什么我的IDE显示TypeScript错误？**
  - A：这是因为Deno使用特定的运行环境，IDE可能不认识Deno的API。这些错误不会影响实际部署，可以忽略。
- **Q：可以代理哪些API服务？**
  - A：理论上可以代理任何HTTP API服务，只需将目标域名嵌入到你的代理URL中即可。

---

## 获取帮助 🆘

如果你在部署或使用过程中遇到问题，欢迎在GitHub上提交Issue，或者联系项目维护者。我们会尽力帮助你！

---

## 许可证 📜

MIT

---

**祝你使用愉快！如果觉得这个项目有用，记得给个Star支持一下哦！⭐**
