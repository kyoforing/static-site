# 需求文件

## 簡介

本功能是一個互動式網站，呈現《Vibe Coding》一書第七章「需要學習的技能」的內容。網站以視覺化、互動式的方式展示章節的四大主題與小結，並在最後提供 5 題選擇題測驗，滿分 100 分（每題 20 分），讓使用者測試對章節內容的理解程度，最終顯示得分結果。

## 詞彙表

- **互動網站 (Interactive_Website)**：本功能的主要系統，負責呈現章節內容與測驗功能的單頁式網頁應用程式
- **章節內容區 (Chapter_Content_Section)**：網站中展示第七章各小節內容的區域
- **測驗模組 (Quiz_Module)**：網站中負責出題、收集答案、計算分數的功能模組
- **題目 (Question)**：測驗模組中的單一選擇題，包含題幹與選項
- **得分結果頁 (Score_Result_View)**：顯示使用者測驗成績與回饋的畫面
- **導覽列 (Navigation_Bar)**：網站頂部或側邊的導覽元件，用於在各小節之間切換
- **使用者 (User)**：瀏覽網站並參與測驗的訪客

## 需求

### 需求 1：章節內容展示

**使用者故事：** 身為一位使用者，我想要在網站上閱讀《Vibe Coding》第七章的完整內容，以便我能理解在 AI 時代需要學習的技能。

#### 驗收條件

1. THE Interactive_Website SHALL 展示第七章的五個小節內容：7-1 建立快速、頻繁的回饋迴路、7-2 建立模組化系統、7-3（重新）擁抱學習、7-4 精進技術、7-5 小結
2. WHEN User 進入網站時，THE Interactive_Website SHALL 顯示章節標題「第七章：需要學習的技能」與簡要介紹
3. THE Chapter_Content_Section SHALL 為每個小節呈現該節的重點摘要與關鍵概念
4. THE Chapter_Content_Section SHALL 以視覺化卡片或區塊的方式呈現 Isabella 主廚與 Vincent 主廚的對比故事
5. THE Interactive_Website SHALL 使用繁體中文顯示所有介面文字與內容

### 需求 2：網站導覽功能

**使用者故事：** 身為一位使用者，我想要能夠在各小節之間自由切換，以便我能快速找到感興趣的內容。

#### 驗收條件

1. THE Navigation_Bar SHALL 提供五個小節的導覽連結，讓 User 可以點擊跳轉至對應小節
2. WHEN User 點擊導覽連結時，THE Interactive_Website SHALL 平滑捲動至對應的章節內容區
3. WHILE User 捲動頁面時，THE Navigation_Bar SHALL 標示目前所在的小節位置

### 需求 3：選擇題測驗功能

**使用者故事：** 身為一位使用者，我想要在閱讀完章節內容後進行選擇題測驗，以便我能檢驗自己對內容的理解程度。

#### 驗收條件

1. THE Quiz_Module SHALL 在章節內容之後提供 5 道選擇題，每道題目包含 4 個選項
2. THE Quiz_Module SHALL 涵蓋第七章各小節的核心概念，確保題目分布均勻
3. WHEN User 選擇一個選項時，THE Quiz_Module SHALL 記錄 User 的選擇並以視覺方式標示已選取的選項
4. THE Quiz_Module SHALL 提供一個「提交答案」按鈕，讓 User 在完成所有題目後提交
5. IF User 未回答所有 5 道題目就點擊提交按鈕，THEN THE Quiz_Module SHALL 顯示提示訊息，告知 User 尚有未作答的題目


### 需求 4：計分與結果顯示

**使用者故事：** 身為一位使用者，我想要在提交答案後看到我的得分結果，以便我能了解自己對章節內容的掌握程度。

#### 驗收條件

1. THE Quiz_Module SHALL 以每題 20 分、滿分 100 分的方式計算 User 的總分
2. WHEN User 提交答案後，THE Score_Result_View SHALL 顯示 User 的總得分
3. THE Score_Result_View SHALL 針對每道題目顯示 User 的作答是否正確，並標示正確答案
4. THE Score_Result_View SHALL 根據得分範圍顯示對應的回饋訊息（例如：100 分顯示「完美」、60 分以上顯示「不錯」、60 分以下顯示「再加油」）
5. THE Score_Result_View SHALL 提供「重新測驗」按鈕，讓 User 可以重新作答

### 需求 5：響應式設計與使用者體驗

**使用者故事：** 身為一位使用者，我想要在不同裝置上都能順暢地瀏覽網站與進行測驗，以便我能隨時隨地學習。

#### 驗收條件

1. THE Interactive_Website SHALL 支援桌面瀏覽器與行動裝置的響應式版面配置
2. THE Interactive_Website SHALL 使用清晰易讀的字體與適當的間距來呈現內容
3. THE Interactive_Website SHALL 使用一致的配色方案與視覺風格，營造專業且友善的閱讀體驗
4. WHEN User 與互動元素互動時，THE Interactive_Website SHALL 提供適當的視覺回饋（例如：按鈕 hover 效果、選項選取狀態）

### 需求 6：單頁式應用程式架構

**使用者故事：** 身為一位開發者，我想要網站以單一 HTML 檔案實作，以便部署與維護簡單方便。

#### 驗收條件

1. THE Interactive_Website SHALL 以單一 HTML 檔案實作，內嵌 CSS 樣式與 JavaScript 邏輯
2. THE Interactive_Website SHALL 無需後端伺服器即可運作，所有邏輯在瀏覽器端執行
3. THE Interactive_Website SHALL 無需安裝任何套件或建置工具即可直接在瀏覽器中開啟使用
