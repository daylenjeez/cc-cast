# ccm - Claude Code Model Switcher

[English](./README.md)

还在每次手动编辑 `~/.claude/settings.json` 来切换 API 供应商吗？**ccm** 让你在终端几秒内完成 Claude Code 自定义模型配置的管理和切换。

## 亮点

- **cc-switch 无缝对接** - 已经在用 [cc-switch](https://github.com/nicepkg/cc-switch)？ccm 直接读取它的数据库，无需迁移，已有配置立即可用
- **交互式添加** - `ccm add` 逐步引导填写，也可以选择直接编写 JSON
- **一键切换** - `ccm use OpenRouter` 或者 `ccm ls` 用方向键选择
- **输错也没关系** - 模糊匹配自动纠错，提示最接近的配置名
- **安全切换** - 切换时自动保留 `language`、`permissions` 等个人设置
- **中英双语** - `ccm locale set zh/en` 切换界面语言

## 安装

```bash
npm install -g ccm-cli
```

或从源码构建：

```bash
git clone git@github.com:daylenjeez/ccm.git
cd ccm && npm install && npm run build && npm link
```

## 快速开始

```bash
# 初始化 — 自动检测 cc-switch 并导入配置
ccm init

# 方向键浏览并切换
ccm ls

# 或直接按名称切换
ccm use OpenRouter
```

## 添加配置

### 交互式添加（推荐）

```bash
ccm add
```

ccm 会逐步引导你填写每个字段：

```
供应商名称 (如 OpenRouter): OpenRouter
ANTHROPIC_BASE_URL: https://openrouter.ai/api/v1
ANTHROPIC_AUTH_TOKEN: sk-or-xxx
ANTHROPIC_MODEL: anthropic/claude-opus-4.6
ANTHROPIC_DEFAULT_OPUS_MODEL (回车跳过):
ANTHROPIC_DEFAULT_SONNET_MODEL (回车跳过):
ANTHROPIC_DEFAULT_HAIKU_MODEL (回车跳过):

配置预览:
{ ... }

是否在编辑器中编辑配置？(y/N)
✓ 已保存配置 "OpenRouter"
是否立即切换到此配置？(Y/n)
```

任何步骤输入 `<` 可返回上一步。也可以选择"直接编写 JSON"模式，在 `$EDITOR` 中编辑。

### 从当前设置保存

已经配好了 Claude Code？直接保存：

```bash
ccm save my-config
```

### 直接编辑配置文件

独立模式下也可以直接编辑 `~/.ccm/config.json`：

```json
{
  "profiles": {
    "OpenRouter": {
      "env": {
        "ANTHROPIC_BASE_URL": "https://openrouter.ai/api/v1",
        "ANTHROPIC_AUTH_TOKEN": "sk-or-...",
        "ANTHROPIC_MODEL": "anthropic/claude-opus-4.6",
        "ANTHROPIC_DEFAULT_OPUS_MODEL": "Claude Opus 4.6",
        "ANTHROPIC_DEFAULT_SONNET_MODEL": "Claude Sonnet 4.6",
        "ANTHROPIC_DEFAULT_HAIKU_MODEL": "Claude Haiku 4.5"
      }
    },
    "Kimi": {
      "env": {
        "ANTHROPIC_BASE_URL": "https://api.moonshot.cn/anthropic",
        "ANTHROPIC_AUTH_TOKEN": "sk-...",
        "ANTHROPIC_MODEL": "kimi-k2.5"
      }
    }
  }
}
```

## cc-switch 集成

如果你已经在使用 [cc-switch](https://github.com/nicepkg/cc-switch)（GUI 切换工具），ccm 可以直接读取它的数据库：

```bash
$ ccm init
检测到 cc-switch 已安装，是否从中导入配置？(Y/n)
✓ 已初始化为 cc-switch 模式
✓ 已导入 4 个配置
当前激活: OpenRouter
```

所有 cc-switch 配置立即可用。双向同步 — 在 ccm 中添加的配置在 cc-switch UI 中也能看到，反之亦然。

## 命令一览

| 命令 | 说明 |
| --- | --- |
| `ccm init` | 初始化，自动检测 cc-switch |
| `ccm ls` | 交互式列表 & 切换 |
| `ccm use <name>` | 按名称切换（支持模糊匹配） |
| `ccm add` / `new` | 交互式添加向导 |
| `ccm save <name>` | 将当前设置保存为方案 |
| `ccm show [name]` | 查看配置详情 |
| `ccm rm [name]` | 交互式或指定名称删除 |
| `ccm current` | 显示当前激活的配置 |
| `ccm config` | 切换存储模式 |
| `ccm alias set <short> <name>` | 创建别名 |
| `ccm alias rm <short>` | 删除别名 |
| `ccm alias ls` | 列出所有别名 |
| `ccm locale ls` | 列出并切换语言 |
| `ccm locale set <lang>` | 设置语言 (zh/en) |

## 模糊匹配

```
$ ccm use openroter
配置 "openroter" 不存在
你是不是想说: OpenRouter?
```

匹配策略：大小写不敏感精确匹配 -> 子串匹配 -> Levenshtein 编辑距离（阈值: 3）。

## 别名

```bash
ccm alias set or OpenRouter
ccm use or  # 等同于: ccm use OpenRouter
```

## 工作原理

Claude Code 启动时读取 `~/.claude/settings.json` 中的环境变量：

```json
{
  "env": {
    "ANTHROPIC_BASE_URL": "https://openrouter.ai/api/v1",
    "ANTHROPIC_AUTH_TOKEN": "sk-or-...",
    "ANTHROPIC_MODEL": "anthropic/claude-opus-4.6",
    "ANTHROPIC_DEFAULT_OPUS_MODEL": "Claude Opus 4.6",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "Claude Sonnet 4.6",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "Claude Haiku 4.5"
  }
}
```

`ANTHROPIC_DEFAULT_*_MODEL` 变量控制你在 Claude Code 中通过 `/model` 切换 Opus/Sonnet/Haiku 时实际使用的模型。

`ccm use` 将选中配置写入该文件，同时保留 `language`、`permissions` 等个人设置。重启 Claude Code 后生效。

## License

MIT
