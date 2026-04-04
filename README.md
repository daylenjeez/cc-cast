# ccm - Claude Code Model Switcher

[中文文档](./README.zh-CN.md)

Tired of manually editing `~/.claude/settings.json` every time you switch API providers? **ccm** lets you manage and switch Claude Code custom model configurations from the terminal in seconds.

## Highlights

- **cc-switch Integration** - Already using [cc-switch](https://github.com/nicepkg/cc-switch)? ccm reads its database directly — zero migration, your existing configs just work
- **Interactive Setup** - Add new providers step by step with `ccm add`, or write JSON directly — your choice
- **One-command Switching** - `ccm use OpenRouter` or just `ccm ls` and pick with arrow keys
- **Typo-tolerant** - Mistype a name? ccm suggests the closest match
- **Safe** - Preserves your `language`, `permissions` and other personal settings when switching
- **i18n** - English and Chinese interface (`ccm locale set en/zh`)

## Install

```bash
npm install -g ccm-cli
```

Or build from source:

```bash
git clone git@github.com:daylenjeez/ccm.git
cd ccm && npm install && npm run build && npm link
```

## Quick Start

```bash
# Initialize — auto-detects cc-switch and imports your configs
ccm init

# Browse and switch with arrow keys
ccm ls

# Or switch directly by name
ccm use OpenRouter
```

## Adding Configurations

### Interactive (recommended)

```bash
ccm add
```

ccm walks you through each field step by step:

```
Provider name (e.g. OpenRouter): OpenRouter
ANTHROPIC_BASE_URL: https://openrouter.ai/api/v1
ANTHROPIC_AUTH_TOKEN: sk-or-xxx
ANTHROPIC_MODEL: anthropic/claude-opus-4.6
ANTHROPIC_DEFAULT_OPUS_MODEL (press Enter to skip):
ANTHROPIC_DEFAULT_SONNET_MODEL (press Enter to skip):
ANTHROPIC_DEFAULT_HAIKU_MODEL (press Enter to skip):

Configuration preview:
{ ... }

Edit configuration in editor? (y/N)
✓ Saved configuration "OpenRouter"
Switch to this configuration now? (Y/n)
```

Type `<` at any step to go back. Choose "Write JSON directly" mode if you prefer editing raw JSON in your `$EDITOR`.

### From current settings

Already have Claude Code configured the way you want? Save it:

```bash
ccm save my-config
```

### Edit config file

In standalone mode, you can also edit `~/.ccm/config.json` directly:

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

## cc-switch Integration

If you already use [cc-switch](https://github.com/nicepkg/cc-switch) (the GUI-based switcher), ccm can read its database directly:

```bash
$ ccm init
cc-switch detected. Import configurations from it? (Y/n)
✓ Initialized in cc-switch mode
✓ Imported 4 configurations
Active: OpenRouter
```

All your cc-switch configs are instantly available. Changes sync both ways — add a config in ccm, see it in cc-switch UI, and vice versa.

## Commands

| Command | Description |
| --- | --- |
| `ccm init` | Initialize, auto-detect cc-switch |
| `ccm ls` | Interactive list & switch |
| `ccm use <name>` | Switch by name (supports fuzzy matching) |
| `ccm add` / `new` | Interactive add wizard |
| `ccm save <name>` | Save current settings as a profile |
| `ccm show [name]` | View config details |
| `ccm rm [name]` | Interactive or named delete |
| `ccm current` | Show active configuration |
| `ccm config` | Switch storage mode |
| `ccm alias set <short> <name>` | Create alias |
| `ccm alias rm <short>` | Remove alias |
| `ccm alias ls` | List aliases |
| `ccm locale ls` | List & switch language |
| `ccm locale set <lang>` | Set language (zh/en) |

## Fuzzy Matching

```
$ ccm use openroter
Configuration "openroter" not found
Did you mean: OpenRouter?
```

Matching: case-insensitive exact -> substring -> Levenshtein distance (threshold: 3).

## Aliases

```bash
ccm alias set or OpenRouter
ccm use or  # same as: ccm use OpenRouter
```

## How It Works

Claude Code reads environment variables from `~/.claude/settings.json` on startup:

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

The `ANTHROPIC_DEFAULT_*_MODEL` variables control which model is used when you switch between Opus/Sonnet/Haiku inside Claude Code via `/model`.

`ccm use` writes the selected profile into this file while preserving your personal settings (`language`, `permissions`, etc.). Restart Claude Code to apply.

## License

MIT
