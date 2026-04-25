---
name: ai-global-version-bump
description: '僅針對 ai-global 專案同步更新版本號。用於調整 package.json 與 ai-global 腳本中的 VERSION，並檢查兩者一致。未指定格式時預設 SemVer，執行前先確認是否允許 rc/beta。觸發詞：版本更新、bump version、同步版本、release 版號。'
argument-hint: '輸入目標版本號，例如 2.2.4'
user-invocable: true
---

# AI Global 版本同步流程

## 目標產出
- 將 package.json 的 version 更新為目標版本
- 將 ai-global 腳本的 VERSION 更新為相同版本
- 確認兩個檔案的版本值完全一致
- 回報變更檔案與驗證結果

## 使用時機
- 需要發布新版本
- 需要修正版本不一致
- 需要快速同步兩個版本欄位

## 範圍限制
- 僅適用 ai-global 專案
- 只修改下列兩個檔案的版本欄位：
	- ai-global/package.json
	- ai-global/ai-global

## 主要流程
1. 讀取參數並確認目標版本號
2. 先確認版本格式策略：僅 SemVer，或允許 rc/beta
3. 若使用者未指定格式，預設採用 SemVer
4. 定位兩個檔案中的版本欄位
5. 僅更新必要行數，不修改其他內容
6. 驗證兩處版本值相同
7. 回報完成狀態

## 決策點
- 若未提供版本號：先請使用者提供版本號
- 若未指定格式策略：預設 SemVer，並先詢問是否改為允許 rc/beta
- 若版本不符合已確認策略：停止修改並請使用者確認
- 若檔案不存在或找不到欄位：停止修改並回報缺失項目
- 若檔案有其他不相關變更：保持不動，只改版本行

## 完成條件
- package.json 的 version 等於目標版本
- ai-global 的 VERSION 等於目標版本
- 兩個檔案僅有版本行變更

## 驗證建議
- 搜尋 version 與 VERSION 並比對值
- 檢查變更清單只包含目標檔案

## 回覆格式建議
- 列出已更新檔案
- 列出最終版本號
- 列出驗證結果
