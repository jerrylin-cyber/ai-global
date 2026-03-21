# ai-global 優化修改清單

> 建立日期：2026-03-21

## 高優先（正確性 / 安全性）

### 1. `unlink_one_tool` 回傳值誤用

- **位置**：`unlink_one_tool()` 函式（約第 284–316 行）
- **問題**：使用 `return $unlinked_count` 搭配 `$?` 取得計數。Bash 中 `return` 語意為退出碼（0=成功），與數量計數衝突；當 count > 255 時會溢位截斷。
- **方案**：改用 `echo` 輸出計數，呼叫端以 `$()` 接收。

```bash
# 修改前
return $unlinked_count

# 修改後
echo "$unlinked_count"
```

呼叫端對應修改：

```bash
# 修改前
unlink_one_tool "$base_dir" ...
total_unlinked=$((total_unlinked + $?))

# 修改後
local count
count=$(unlink_one_tool "$base_dir" ...)
total_unlinked=$((total_unlinked + count))
```

**驗證測試清單：**

```bash
# 前置準備
mkdir -p tests/project-1/.cursor/rules tests/project-1/.claude/commands
```

- [ ] 於 `tests/project-1/` 建立測試目錄，含 `.cursor/` 與 `.claude/`，在該目錄下執行 `ai-global` 建立 symlink
- [ ] 執行 `ai-global unlink cursor`，確認輸出的 unlinked 數量正確（非 0）
- [ ] 執行 `ai-global unlink all`，確認 `total_unlinked` 數量與實際 symlink 數一致
- [ ] 確認 `unlink_one_tool` 內的 `log_ok` 訊息仍正常顯示（因改用 `echo` 回傳值，需確認 log 輸出導向 stderr 或分離處理）
- [ ] 測試完成後清理：`rm -rf tests/project-1/`

---

### 2. `show_status` 中的 `eval` 拼接

- **位置**：`add_status_output()` 函式（約第 215–230 行）
- **問題**：`eval "$out_var+=\"...\""` 動態拼接字串，搭配 ANSI 跳脫序列容易出錯且難維護。
- **方案**：改用 associative array（`declare -A`）以 key 索引儲存各類輸出，移除 eval。

```bash
# 修改前
eval "$out_var+=\"  ${color}${beautified}${NC}\n\""

# 修改後
declare -A status_outputs
# ...
status_outputs[$out_var]+="  ${color}${beautified}${NC}\n"
```

**驗證測試清單：**

```bash
# 前置準備
mkdir -p tests/project-2/.cursor/rules tests/project-2/.claude/commands tests/project-2/.copilot/skills
```

- [ ] 於 `tests/project-2/` 建立測試目錄，含至少 3 個工具目錄，在該目錄下執行 `ai-global` 建立 symlink
- [ ] 執行 `ai-global status`，確認各分類（AGENTS.md、rules、skills 等）仍正確顯示
- [ ] 確認 ANSI 顏色碼正確渲染，無亂碼或跳脫字元外洩
- [ ] 於 `tests/project-empty/`（無工具目錄）執行 `ai-global status`，確認輸出「未找到任何 symlink」
- [ ] 測試完成後清理：`rm -rf tests/project-2/ tests/project-empty/`

---

### 3. `upgrade` 函式缺乏完整性驗證

- **位置**：`upgrade()` 函式（約第 557–587 行）
- **問題**：從 GitHub 下載後直接 `mv` 覆蓋自身，未做校驗。若下載中斷或回傳非腳本內容（如 HTML 錯誤頁），會導致腳本損壞。
- **方案**：下載後檢查檔案開頭為 `#!/bin/bash` 且大小合理，再執行覆蓋。

```bash
# 在 mv 之前加入驗證
if ! head -1 "$exec_temp" | grep -q '^#!/bin/bash'; then
  rm -f "$exec_temp"
  log_error "下載的檔案不是有效的腳本"
  return 1
fi
```

**驗證測試清單：**

```bash
# 前置準備：複製腳本至 tests/ 做隔離測試
mkdir -p tests/upgrade-test
cp ai-global tests/upgrade-test/ai-global
chmod +x tests/upgrade-test/ai-global
```

- [ ] 正常情況：於 `tests/upgrade-test/` 執行 `./ai-global upgrade`，在有新版時確認升級成功且腳本可正常執行
- [ ] 模擬異常：暫時修改 `tests/upgrade-test/ai-global` 中下載 URL 為不存在的路徑，確認顯示「下載更新失敗」
- [ ] 模擬損壞：於 `tests/upgrade-test/` 手動建立 `echo '<html>' > /tmp/fake-script`，模擬校驗流程，確認顯示「不是有效的腳本」並中止覆蓋
- [ ] 升級後執行 `./ai-global version`，確認版本號已更新
- [ ] 測試完成後清理：`rm -rf tests/upgrade-test/`

---

## 中優先（可維護性 / 效能）

### 4. 重複的 pattern 解析邏輯

- **位置**：`update_links`、`show_status`、`list_tools`、`unlink_all_tools`、`unlink_tool` 等 5 個函式
- **問題**：以下兩行在 5 處完全重複：
  ```bash
  IFS='|' read -r nodes key name agents_md rules commands skills subagents color <<< "$pattern"
  IFS=', ' read -ra node_array <<< "$nodes"
  ```
- **方案**：提取 `parse_pattern()` 輔助函式，統一解析邏輯。注意：因 Bash 函式內 `local` 無法直接傳出多個變數，可搭配全域變數前綴（如 `_P_key` 等）或改用 `for_each_tool` callback 模式。

```bash
# 範例：全域變數模式
parse_pattern() {
  IFS='|' read -r _P_nodes _P_key _P_name _P_agents_md _P_rules _P_commands _P_skills _P_subagents _P_color <<< "$1"
  IFS=', ' read -ra _P_node_array <<< "$_P_nodes"
}
```

**驗證測試清單：**

```bash
# 前置準備
mkdir -p tests/project-3/.cursor/rules tests/project-3/.claude/commands tests/project-3/.copilot/skills
```

- [ ] 搜尋確認全檔已無重複的 `IFS='|' read -r nodes key name ...` 行（僅存在於 `parse_pattern` 內）
- [ ] 於 `tests/project-3/` 執行 `ai-global`（update），確認所有工具仍正常偵測與 symlink
- [ ] 於 `tests/project-3/` 執行 `ai-global status`，確認輸出格式不變
- [ ] 於 `tests/project-3/` 執行 `ai-global list`，確認所有工具列表正確
- [ ] 於 `tests/project-3/` 執行 `ai-global unlink all`，確認取消連結正常
- [ ] 測試完成後清理：`rm -rf tests/project-3/`

---

### 5. `list_tools` 手動字串對齊改用 `printf`

- **位置**：`list_tools()` 函式（約第 261–279 行）
- **問題**：手動計算空格數量的程式碼佔約 20 行，可讀性低。
- **方案**：改用 `printf "%-17s %-13s %-31s"` 格式化欄位對齊。

```bash
# 修改前（約 20 行手動計算）
local name_spaces=$((17 - ${#name}))
...

# 修改後
printf "  ${row_color}%-17s %-13s %-31s %s        %s      %s       %s      %s    %s${NC}\n" \
  "$name" "$key" "$nodes" \
  "$([[ "$agents_md" == "." ]] && echo "." || echo "○")" \
  ...
```

**驗證測試清單：**

```bash
# 前置準備
mkdir -p tests/project-4/.cursor tests/project-4/.claude tests/project-4/.amp
```

- [ ] 於 `tests/project-4/` 執行 `ai-global list`，比對修改前後輸出，確認欄位對齊一致
- [ ] 確認長名稱工具（如 `Blackbox AI`、`Factory Droid`）與短名稱工具（如 `TRAE`、`Amp`）皆對齊正確
- [ ] 確認「已安裝」與「未找到」狀態標示位置一致
- [ ] 終端機寬度 80 欄與 120 欄下皆無明顯斷行
- [ ] 測試完成後清理：`rm -rf tests/project-4/`

---

### 6. `local var=$(command)` 遮蔽錯誤碼

- **位置**：多處，例如 `upgrade()` 的 `local remote_version=$(curl ...)`
- **問題**：`local` 指令本身永遠回傳 0，會遮蔽 `$()` 中命令的退出碼。
- **方案**：拆成兩行。

```bash
# 修改前
local remote_version=$(curl ... | grep ...)

# 修改後
local remote_version
remote_version=$(curl ... | grep ...)
```

**驗證測試清單：**

```bash
# 前置準備：複製腳本至 tests/ 做隔離測試
mkdir -p tests/local-var-test
cp ai-global tests/local-var-test/ai-global
chmod +x tests/local-var-test/ai-global
```

- [ ] 搜尋全檔確認無 `local var=$(...)` 單行合併寫法（排除無需檢查退出碼的情境）
- [ ] 於 `tests/local-var-test/` 模擬網路斷線執行 `./ai-global upgrade`，確認 curl 失敗時正確顯示錯誤訊息
- [ ] 於 `tests/local-var-test/` 執行 `./ai-global add fake-user/nonexistent-repo`，確認 `git clone` 失敗時回傳正確退出碼
- [ ] 測試完成後清理：`rm -rf tests/local-var-test/`

---

### 7. `types` 陣列使用冒號分隔路徑字串

- **位置**：`update_links()` 第 120 行附近
- **問題**：`"file:$agents_md:$agents_md_dir"` 格式以冒號為分隔符，若路徑含冒號（理論上 macOS/Linux 允許）會解析錯誤。
- **方案**：改用不可能出現在路徑中的分隔符（如 `|`），或改用平行陣列。

```bash
# 修改後：平行陣列
local type_keys=("file" "dir" "dir" "dir" "dir")
local type_nodes=("$agents_md" "$rules" "$commands" "$skills" "$subagents")
local type_targets=("$agents_md_dir" "$rules_dir" "$commands_dir" "$skills_dir" "$subagents_dir")

for i in "${!type_keys[@]}"; do
  local type_key="${type_keys[$i]}"
  local type_node="${type_nodes[$i]}"
  local target_dir="${type_targets[$i]}"
  # ...
done
```

**驗證測試清單：**

```bash
# 前置準備
mkdir -p tests/project-5/.cursor/rules tests/project-5/.claude/commands
echo '# test rule' > tests/project-5/.cursor/rules/test.md
```

- [ ] 於 `tests/project-5/` 執行 `ai-global`（update），確認所有 symlink 建立行為與修改前一致
- [ ] 確認 AGENTS.md 合併（file 類型）正常運作
- [ ] 確認 rules / commands / skills / agents（dir 類型）的檔案複製正常
- [ ] 於 `tests/colon:test/` 目錄下建立工具目錄並執行 `ai-global`，確認含冒號路徑不會解析錯誤：
  ```bash
  mkdir -p "tests/colon:test/.cursor/rules"
  cd "tests/colon:test" && ai-global && cd -
  ```
- [ ] 測試完成後清理：`rm -rf tests/project-5/ "tests/colon:test/"`

---

## 低優先（防禦性 / 風格）

### 8. `rm` / `cp` / `mv` 缺少 `--` 防護

- **位置**：全檔多處
- **問題**：若路徑以 `-` 開頭會被誤判為選項旗標。
- **方案**：所有 `rm`、`cp`、`mv`、`ln` 指令加上 `--`。

```bash
rm -- "$type_dir"
cp -r -- "$type_dir" "$backup_file"
```

**驗證測試清單：**

```bash
# 前置準備
mkdir -p tests/project-6/.cursor/rules tests/project-6/.claude/commands
```

- [ ] 搜尋全檔確認所有 `rm`、`cp`、`mv`、`ln` 指令皆已加上 `--`
- [ ] 於 `tests/project-6/` 執行 `ai-global` update / unlink 各指令，確認功能不受影響
- [ ] （選測）於 `tests/` 建立以 `-` 開頭的目錄並操作，確認不會報錯：
  ```bash
  mkdir -p "tests/-dash-test/.cursor/rules"
  cd "tests/-dash-test" && ai-global && ai-global unlink cursor && cd -
  ```
- [ ] 測試完成後清理：`rm -rf tests/project-6/ "tests/-dash-test/"`

---

### 9. `uninstall` 中不必要的子 shell

- **位置**：`uninstall()` 第 629 行
- **問題**：`(cd "$project_dir" && unlink_all_tools "$project_dir")` 開了子 shell，但 `unlink_all_tools` 已接受 `base_dir` 參數，不依賴 `pwd`。
- **方案**：直接呼叫即可。

```bash
# 修改前
(cd "$project_dir" && unlink_all_tools "$project_dir" 2> /dev/null || true)

# 修改後
unlink_all_tools "$project_dir" 2> /dev/null || true
```

**驗證測試清單：**

```bash
# 前置準備
mkdir -p tests/project-7/.cursor/rules tests/project-7/.claude/commands
cd tests/project-7 && ai-global && cd -
```

- [ ] 於 `tests/project-7/` 執行 `ai-global` 建立 symlink，再執行 `ai-global uninstall`
- [ ] 確認 `tests/project-7/` 的 symlink 被正確取消連結
- [ ] 確認 `tests/project-7/.agents_ai-global` 備份目錄已建立且內容完整
- [ ] 確認 `$HOME/.ai-global` 已被移除
- [ ] 測試完成後清理：`rm -rf tests/project-7/`

---

### 10. `download_from_github` 子路徑錯誤提示不夠明確

- **位置**：`download_from_github()` 第 432–435 行
- **問題**：使用者若傳入 `user/repo/sub/path` 只會看到「無效的 GitHub 參照」，不清楚原因。
- **方案**：加上明確提示。

```bash
if [[ -n "$path" ]]; then
  log_error "不支援子路徑，僅接受 user/repo 格式：$input"
  return 1
fi
```

**驗證測試清單：**

```bash
# 前置準備
mkdir -p tests/project-8/.cursor
cd tests/project-8 && ai-global && cd -
```

- [ ] 於 `tests/project-8/` 執行 `ai-global add lazyjerry/ai-global-skills`（或其他有效倉庫），確認正常下載 skill 至 `tests/project-8/.ai-global/skills/`
- [ ] 於 `tests/project-8/` 執行 `ai-global add user/repo/sub/path`，確認顯示「不支援子路徑」錯誤
- [ ] 於 `tests/project-8/` 執行 `ai-global add https://github.com/user/repo`，確認 URL 格式正常處理
- [ ] 於 `tests/project-8/` 執行 `ai-global add invalid-input`，確認顯示「輸入無效」錯誤
- [ ] 測試完成後清理：`rm -rf tests/project-8/`

---

## 修改順序建議

1. 先處理高優先 #1、#3（正確性與安全性）
2. 再處理 #2（移除 eval）
3. 接著處理中優先 #4–#7（可維護性）
4. 最後處理低優先 #8–#10（防禦性改善）

每次修改後手動驗證 `ai-global`、`ai-global status`、`ai-global list` 行為是否正確。
