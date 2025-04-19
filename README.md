# ProxyProximity

ProxyProximity 是一个通用的API代理工具，旨在帮助用户通过Deno Deploy轻松代理各种API服务，特别适用于需要绕过地域限制或进行API测试的场景。

## 概述

ProxyProximity 提供了一个灵活的代理服务器，可以将请求转发到用户指定的API基础地址，支持多种API格式（如OpenAI、Google AI等）。通过在Deno Deploy上部署，用户可以快速获得一个可访问的代理服务，即使在中国大陆也能直接使用。

## 功能特性

- **通用代理**：支持代理任意API基础地址，自动识别并适配不同的API格式。
- **多API密钥支持**：支持通过URL参数、请求头或环境变量提供API密钥，灵活适应不同场景。
- **CORS支持**：内置CORS头，允许Web应用直接访问代理服务。
- **Web UI测试工具**：提供一个直观的Web界面，方便用户配置和测试API代理。

## Web UI功能详解

ProxyProximity 提供了一个强大的Web UI测试工具，方便用户快速配置和测试API代理。以下是Web UI的主要功能：

- **API配置**：用户可以输入完整的API基础地址（如 `api.openai.com/v1` 或 `ark.cn-beijing.volces.com/api/v3`），并复制生成的代理URL用于其他应用。
- **模型选择与自定义**：用户可以从获取的模型列表中选择模型，也可以通过输入框自定义模型ID，自定义ID优先级高于列表选择，确保灵活性。
- **系统提示词设置**：支持设置系统级提示词，可通过可折叠控件在聊天页面中配置，适用于定制AI行为（如指定语言或角色）。
- **聊天测试**：提供聊天界面，用户可以直接发送消息并查看AI响应，支持Markdown格式渲染，方便测试API的对话功能。
- **响应解析适配**：自动适配不同API的响应格式（如OpenAI的 `choices` 或Google的 `candidates`），确保响应内容正确显示。
- **错误提示与调试**：在发生错误时显示详细的错误信息，帮助用户快速定位问题。

## 项目优势

ProxyProximity 是一个功能强大且易于使用的代理工具，其主要优势包括：

- **强大的兼容性**：支持多种API服务商（如OpenAI、Google AI、Volcengine等），通过用户输入的完整地址构建请求URL，不添加额外路径，确保与各种API格式兼容。
- **几乎不修改原数据**：代理过程中尽量保持原始请求和响应数据不变，确保API调用的透明性和准确性。
- **Deno Deploy部署便利**：通过Deno Deploy部署，项目可以快速上线，且在中国大陆也能直接访问，无需额外配置或VPN，解决了地域限制问题。
- **轻量级与高效**：基于Deno构建，代理服务器轻量高效，响应速度快，适合快速测试和生产环境使用。
- **开源与可定制**：项目完全开源，用户可以根据需求修改代码，添加特定功能或适配新的API服务。

## 安装与部署

1. **本地运行**：
   ```bash
   deno run --allow-net --allow-read proxy.ts
   ```
   然后访问 `http://localhost:8000` 使用Web UI进行测试。

2. **部署到Deno Deploy**：
   - 在Deno Deploy平台上创建一个新项目。
   - 将代码仓库连接到Deno Deploy。
   - 设置环境变量（如 `UNIVERSAL_API_KEY`）以提供默认API密钥（可选）。
   - 部署后即可通过分配的域名访问代理服务和Web UI。

## 使用方法

- **通过Web UI**：访问部署后的域名或本地服务器地址，输入API完整地址和密钥，选择或输入模型ID，设置系统提示词（可选），然后通过聊天界面测试API。
- **直接API调用**：将API基础地址附加到代理URL后（如 `https://your-proxy.deno.dev/api.openai.com/v1`），并通过请求头或URL参数提供API密钥。

## 贡献

欢迎提交问题和拉取请求，帮助改进ProxyProximity。无论是功能建议、bug修复还是代码优化，您的贡献都对项目有很大帮助。

## 许可证

本项目采用MIT许可证，详情请参见 [LICENSE](LICENSE) 文件。
