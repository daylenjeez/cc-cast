# ccm - Claude Code Model Switcher

[English](#english) | [中文](#中文)

---

## English

A CLI tool for quickly switching Claude Code custom model configurations from the terminal.

### Why

Claude Code reads `~/.claude/settings.json` on startup. To switch between API providers or models (e.g., ZenMux, OpenRouter, Kimi), you need to manually edit this file each time. **ccm** makes this a one-command operation.

### Features

- **One-command switching** - `ccm use <name>` to switch provider/model instantly
- **Two storage modes** - Read from [cc-switch](https://github.com/nicepkg/cc-switch) database or use standalone config
- **Fuzzy matching** - Typo-tolerant name resolution with suggestions
- **Alias support** - Create shortcuts like `z` for `zenMux-opus4.6`
- **Safe switching** - Preserves user-level settings (`language`, `permissions`) when switching profiles

### Install

```bash
npm install -g ccm-cli
```

Or from source:

```bash
git clone git@github.com:daylenjeez/ccm.git
cd ccm
npm install && npm run build
npm link
```

### Quick Start

```bash
# 1. Initialize (choose storage mode)
ccm init

# 2. List available configurations
ccm list

# 3. Switch to a configuration
ccm use zenMux-opus4.6

# 4. Check current configuration
ccm current
```

### Commands

| Command | Description |
| --- | --- |
| `ccm init` | Initialize ccm, choose data source mode |
| `ccm config` | View or switch data source mode |
| `ccm list` / `ls` | List all available configurations |
| `ccm current` | Show the currently active configuration |
| `ccm use <name>` | Switch to a specified configuration |
| `ccm save <name>` | Save current settings.json as a new configuration |
| `ccm show [name]` | View configuration details (defaults to current) |
| `ccm remove <name>` / `rm` | Delete a configuration |
| `ccm alias set <short> <name>` | Create an alias |
| `ccm alias rm <short>` | Remove an alias |
| `ccm alias list` / `ls` | List all aliases |

### Storage Modes

**cc-switch mode** - Reads directly from [cc-switch](https://github.com/nicepkg/cc-switch) SQLite database (`~/.cc-switch/cc-switch.db`). Configurations are shared with the cc-switch UI.

**Standalone mode** - Uses `~/.ccm/config.json` for independent configuration storage. No external dependencies required.

### Fuzzy Matching

If you mistype a configuration name, ccm will suggest the closest match:

```
$ ccm use zenmx
配置 "zenmx" 不存在
你是不是想说: zenMux-opus4.6?
```

Matching strategy: case-insensitive exact -> substring -> Levenshtein distance (threshold: 3).

### Aliases

```bash
ccm alias set z zenMux-opus4.6
ccm use z  # same as: ccm use zenMux-opus4.6
```

### How It Works

Claude Code uses environment variables in `~/.claude/settings.json` to determine the API provider and model:

```json
{
  "env": {
    "ANTHROPIC_BASE_URL": "https://your-provider.com/api/anthropic",
    "ANTHROPIC_AUTH_TOKEN": "sk-...",
    "ANTHROPIC_MODEL": "anthropic/claude-opus-4.6"
  }
}
```

`ccm use` writes the selected profile's config into this file, preserving user-level fields like `language` and `permissions`. Restart Claude Code to apply.

---

## 中文

一个用于在终端快速切换 Claude Code 自定义模型配置的 CLI 工具。

### 为什么需要

Claude Code 启动时读取 `~/.claude/settings.json`。要在不同 API 供应商或模型（如 ZenMux、OpenRouter、Kimi）之间切换，需要每次手动编辑配置文件。**ccm** 让这变成一条命令的事。

### 特性

- **一键切换** - `ccm use <name>` 即刻切换供应商/模型
- **双存储模式** - 读取 [cc-switch](https://github.com/nicepkg/cc-switch) 数据库或使用独立配置
- **模糊匹配** - 输错名称时自动提示最接近的配置
- **别名支持** - 创建快捷别名，如 `z` 代替 `zenMux-opus4.6`
- **安全切换** - 切换时保留用户级设置（`language`、`permissions`）

### 安装

```bash
npm install -g ccm-cli
```

或从源码安装：

```bash
git clone git@github.com:daylenjeez/ccm.git
cd ccm
npm install && npm run build
npm link
```

### 快速开始

```bash
# 1. 初始化（选择存储模式）
ccm init

# 2. 查看所有可用配置
ccm list

# 3. 切换到指定配置
ccm use zenMux-opus4.6

# 4. 查看当前配置
ccm current
```

### 命令一览

| 命令 | 说明 |
| --- | --- |
| `ccm init` | 初始化 ccm，选择数据源模式 |
| `ccm config` | 查看或切换数据源模式 |
| `ccm list` / `ls` | 列出所有可用配置 |
| `ccm current` | 显示当前生效的配置 |
| `ccm use <name>` | 切换到指定配置 |
| `ccm save <name>` | 将当前 settings.json 保存为新配置 |
| `ccm show [name]` | 查看配置详情（默认显示当前） |
| `ccm remove <name>` / `rm` | 删除配置 |
| `ccm alias set <short> <name>` | 设置别名 |
| `ccm alias rm <short>` | 删除别名 |
| `ccm alias list` / `ls` | 列出所有别名 |

### 存储模式

**cc-switch 模式** - 直接读写 [cc-switch](https://github.com/nicepkg/cc-switch) 的 SQLite 数据库（`~/.cc-switch/cc-switch.db`），配置与 cc-switch UI 共享。

**独立模式** - 使用 `~/.ccm/config.json` 独立存储配置，无需安装 cc-switch。

### 模糊匹配

输错配置名称时，ccm 会自动建议最接近的匹配：

```
$ ccm use zenmx
配置 "zenmx" 不存在
你是不是想说: zenMux-opus4.6?
```

匹配策略：大小写不敏感精确匹配 -> 子串匹配 -> Levenshtein 编辑距离（阈值: 3）。

### 别名

```bash
ccm alias set z zenMux-opus4.6
ccm use z  # 等同于: ccm use zenMux-opus4.6
```

### 工作原理

Claude Code 通过 `~/.claude/settings.json` 中的环境变量决定使用哪个 API 供应商和模型：

```json
{
  "env": {
    "ANTHROPIC_BASE_URL": "https://your-provider.com/api/anthropic",
    "ANTHROPIC_AUTH_TOKEN": "sk-...",
    "ANTHROPIC_MODEL": "anthropic/claude-opus-4.6"
  }
}
```

`ccm use` 将选中配置写入该文件，同时保留 `language`、`permissions` 等用户级字段。重启 Claude Code 后生效。

## License

MIT
