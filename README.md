# 通用API代理

本项目为Deno Deploy提供了一个通用API代理，可以根据URL结构将请求路由到各种API端点。它根据目标域名支持不同的API认证样式。

## 功能

- **动态路由**：根据URL格式 `https://[你的Deno域名]/[目标API域名]/...` 将请求路由到目标API。
- **API样式检测**：自动检测API样式（例如Google或OpenAI/X.AI），并设置相应的认证头。
- **CORS支持**：处理CORS预检请求，允许跨域请求。

## 在Deno Deploy上部署

1. **创建Deno Deploy项目**：
   - 注册或登录 [Deno Deploy](https://deno.com/deploy)。
   - 创建一个新项目。

2. **部署代理**：
   - 如果本仓库托管在GitHub上，可以使用以下命令直接部署，或者手动上传 `proxy.ts` 文件：
     ```
     deno deploy --project=你的项目名称 ./proxy.ts
     ```
   - 或者，将你的GitHub仓库链接到Deno Deploy，实现推送时自动部署。

3. **设置环境变量**（可选）：
   - 如果你想设置默认API密钥，可以在Deno Deploy项目设置中的环境变量下添加 `UNIVERSAL_API_KEY`。

4. **访问你的代理**：
   - 部署后，你的代理将在 `https://你的项目名称.deno.dev` 上可用。
   - 使用时，将你的API URL前缀加上你的Deno域名，例如 `https://你的项目名称.deno.dev/api.openai.com/v1/chat/completions` 以代理到OpenAI的请求。

## 本地开发

1. **安装Deno**：
   - 如果尚未安装，请从 [deno.land](https://deno.land/) 下载并安装Deno。

2. **本地运行代理**：
   - 导航到项目目录并运行：
     ```
     deno run --allow-net --allow-env proxy.ts
     ```
   - 服务器将在 `http://localhost:8000` 上启动。

3. **测试代理**：
   - 向 `http://localhost:8000/[目标API域名]/...` 发送请求以测试代理功能。

## 使用示例

- **代理OpenAI API**：
  - 原始URL：`https://api.openai.com/v1/chat/completions`
  - 代理URL：`https://你的项目名称.deno.dev/api.openai.com/v1/chat/completions`
  - 认证：使用 `Authorization: Bearer [你的API密钥]`

- **代理Google AI API**：
  - 原始URL：`https://generativelanguage.googleapis.com/v1/models`
  - 代理URL：`https://你的项目名称.deno.dev/generativelanguage.googleapis.com/v1/models`
  - 认证：使用 `X-Goog-Api-Key: [你的API密钥]`

## 故障排除

- **TypeScript错误**：如果你在IDE中看到关于缺少Deno类型的错误，可以忽略它们，因为Deno运行时不需要TypeScript配置。这些错误不会影响在Deno Deploy上的部署。
- **API密钥问题**：确保你通过头信息（`Authorization`、`x-api-key`、`x-goog-api-key`）或查询参数（`key`）正确传递API密钥。

## 许可证

MIT
