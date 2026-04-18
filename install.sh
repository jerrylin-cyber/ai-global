#!/bin/bash

# AI Global Installation Script
# Usage: curl -fsSL https://raw.githubusercontent.com/lazyjerry/ai-global/main/install.sh | bash

set -e

main() {
  REPO="lazyjerry/ai-global"
  CONFIG_DIR="$HOME/.ai-global"

  BLUE='\033[0;34m'
  GREEN='\033[0;32m'
  GRAY='\033[0;90m'
  NC='\033[0m'

  echo "正在安裝 AI Global..."

  # 取得最新 release tag
  LATEST_TAG=$(curl -fsSL "https://api.github.com/repos/$REPO/releases/latest" | grep '"tag_name"' | sed 's/.*"tag_name": "\(.*\)".*/\1/')
  if [[ -z "$LATEST_TAG" ]]; then
    echo "無法取得最新版本，改用 main 分支"
    LATEST_TAG="main"
  fi

  # 建立設定目錄
  mkdir -p "$CONFIG_DIR"

  # 從 release tag 下載主程式
  curl -fsSL "https://raw.githubusercontent.com/$REPO/$LATEST_TAG/ai-global" -o "$CONFIG_DIR/ai-global"
  chmod +x "$CONFIG_DIR/ai-global"

  # 從下載的腳本取得版本號
  VERSION=$(grep '^VERSION=' "$CONFIG_DIR/ai-global" | head -1 | sed 's/VERSION="//' | sed 's/"//')

  # 加入 PATH
  mkdir -p "$HOME/.local/bin"
  ln -sf "$CONFIG_DIR/ai-global" "$HOME/.local/bin/ai-global"

  # 檢查 ~/.local/bin 是否已在 PATH 中
  if [[ ":$PATH:" != *":$HOME/.local/bin:"* ]]; then
    echo ""
    echo "請將 ~/.local/bin 加入您的 PATH："
    echo "  export PATH=\"\$HOME/.local/bin:\$PATH\""
  fi

  echo ""
  echo -e "${GREEN}[OK]${NC} AI Global v$VERSION 安裝完成！"
  echo ""
  echo -e "在 ~ ${GRAY}（或專案目錄）${NC}中執行 ${BLUE}ai-global${NC} 即可開始使用。"
  echo ""
}

main "$@"
