# Implementation Plan: Vibe Coding 第七章互動式網站

## Overview

以單一 `index.html` 檔案實作《Vibe Coding》第七章互動式網站，包含章節內容展示、sticky 導覽列、5 題選擇題測驗模組、計分與結果顯示，以及響應式設計。所有 CSS 與 JavaScript 內嵌於 HTML 中，使用純原生 HTML5、CSS3、ES6+，不依賴外部框架。測試使用 Vitest + fast-check。

## Tasks

- [x] 1. 建立 HTML 骨架與 CSS 基礎樣式
  - [x] 1.1 建立 `index.html` 檔案，包含完整 HTML5 結構、meta 標籤（charset utf-8、viewport）、頁面標題
    - 建立 `<style>` 區塊，定義 CSS custom properties 配色方案（主色、輔色、背景色、文字色等）
    - 建立 body 基礎樣式、字體設定、reset 樣式
    - _Requirements: 5.2, 5.3, 6.1, 6.2, 6.3_
  - [x] 1.2 建立 Navigation_Bar 導覽列 HTML 結構與 CSS 樣式
    - 建立 `<nav>` 元素，包含 5 個導覽連結（7-1 至 7-5）
    - 設定 `position: sticky` 固定於頂部
    - 設定 active class 樣式、hover 效果
    - 響應式設計：行動裝置時水平捲動或折疊
    - _Requirements: 2.1, 5.1, 5.4_
  - [x] 1.3 建立 Hero Section 標題區
    - 顯示章節標題「第七章：需要學習的技能」與簡要介紹文字
    - 所有文字使用繁體中文
    - _Requirements: 1.2, 1.5_

- [x] 2. 實作五個章節內容區
  - [x] 2.1 建立 5 個 `<section>` 元素（id 對應 7-1 至 7-5），每個包含標題與重點摘要
    - 7-1：建立快速、頻繁的回饋迴路 — Isabella vs Vincent 主廚對比卡片、CI/CD 回饋迴路概念、State of DevOps Reports 引用
    - 7-2：建立模組化系統 — 模組化廚房比喻、Dan Sturtevant 研究（9 倍離職率）、Alexander Embiricos / ChatGPT Codex 故事
    - 7-3：（重新）擁抱學習 — 學習如何學習、Gene & Steve FFmpeg 故事、Anders Ericsson 四大支柱
    - 7-4：精進技術 — Isabella 熱愛烹飪 vs Vincent 為生活而煮、熱情驅動技能發展
    - 7-5：小結 — Erik Meijer 名言、Vibe Coding 五大價值觀
    - _Requirements: 1.1, 1.3, 1.5_
  - [x] 2.2 實作 Isabella vs Vincent 主廚對比卡片的雙欄佈局
    - 使用 CSS Grid 或 Flexbox 實作雙欄卡片
    - 行動裝置時堆疊為單欄
    - 為相關小節（7-1、7-4）加入對比卡片
    - _Requirements: 1.4, 5.1_
  - [x] 2.3 為章節內容區加入 CSS 樣式
    - 卡片樣式、區塊間距、關鍵概念高亮
    - 引用文字樣式（blockquote）
    - 響應式字體大小與間距
    - _Requirements: 5.2, 5.3, 5.4_

- [x] 3. Checkpoint — 確認頁面結構與樣式
  - Ensure all tests pass, ask the user if questions arise.

- [x] 4. 實作導覽功能 JavaScript 邏輯
  - [x] 4.1 實作導覽列點擊平滑捲動功能
    - 為每個導覽連結綁定 click 事件
    - 使用 `scrollIntoView({ behavior: 'smooth' })` 平滑捲動至對應 section
    - 導覽目標不存在時不執行捲動（錯誤處理）
    - _Requirements: 2.2_
  - [x] 4.2 實作 Intersection Observer 偵測目前可見章節
    - 建立 Intersection Observer 監聽 5 個 section 元素
    - 當 section 進入視窗時更新導覽列 active class
    - Intersection Observer 不支援時降級處理（導覽連結仍可點擊）
    - _Requirements: 2.3_

- [x] 5. 實作測驗模組核心邏輯
  - [x] 5.1 定義題目資料結構與 5 道題目內容
    - 建立 `questions` 陣列，包含 5 道題目（每題含 id、text、options[4]、correctIndex）
    - 題目涵蓋 7-1 至 7-5 各小節核心概念
    - 建立 `quizState` 物件管理作答狀態（userAnswers、isSubmitted、result）
    - _Requirements: 3.1, 3.2_
  - [x] 5.2 實作 `selectAnswer(questionIndex, optionIndex)` 函式
    - 更新 userAnswers 中對應題目的 selectedIndex
    - 更新 DOM 中選項的選取狀態視覺效果
    - _Requirements: 3.3, 5.4_
  - [x] 5.3 實作 `validateAllAnswered()` 函式
    - 檢查所有 5 題的 selectedIndex 是否都不為 -1
    - 回傳 boolean
    - _Requirements: 3.5_
  - [x] 5.4 實作 `submitQuiz()` 函式與提交按鈕邏輯
    - 點擊「提交答案」按鈕時呼叫 validateAllAnswered()
    - 未完成作答時顯示提示訊息「請回答所有題目後再提交」
    - 已提交狀態下忽略重複提交
    - 通過驗證後計算分數（正確數 × 20）
    - 產生 QuizResult 物件（totalScore、answers 陣列含 isCorrect、feedbackMessage）
    - _Requirements: 3.4, 3.5, 4.1_
  - [x] 5.5 撰寫屬性測試：測驗結構不變量
    - **Property 1: Quiz Structure Invariant**
    - 驗證 questions 陣列長度為 5，每題有 4 個選項，correctIndex 在 [0,3] 範圍內
    - **Validates: Requirements 3.1**
  - [x] 5.6 撰寫屬性測試：選擇答案更新狀態
    - **Property 2: Answer Selection Updates State**
    - 生成隨機 questionIndex (0-4) 與 optionIndex (0-3)，驗證 selectAnswer 正確更新 userAnswers
    - **Validates: Requirements 3.3**
  - [x] 5.7 撰寫屬性測試：未完成作答驗證
    - **Property 3: Incomplete Submission Validation**
    - 生成隨機 userAnswers（至少一個為 -1），驗證 validateAllAnswered() 回傳 false
    - **Validates: Requirements 3.5**
  - [x] 5.8 撰寫屬性測試：計分公式
    - **Property 4: Score Calculation Formula**
    - 生成隨機 5 個 boolean（正確/錯誤），驗證分數 = 正確數 × 20，值域為 {0,20,40,60,80,100}
    - **Validates: Requirements 4.1**

- [x] 6. 實作得分結果頁
  - [x] 6.1 實作 Score_Result_View 顯示邏輯
    - 顯示總分（0-100）
    - 逐題顯示使用者作答是否正確，標示正確答案
    - 根據分數範圍顯示回饋訊息（100→完美、80-99→很棒、60-79→不錯、<60→再加油）
    - _Requirements: 4.2, 4.3, 4.4_
  - [x] 6.2 實作「重新測驗」按鈕與 resetQuiz() 函式
    - 重置所有 userAnswers 的 selectedIndex 為 -1
    - 設定 isSubmitted 為 false、result 為 null
    - 清除 DOM 中的選取狀態與結果顯示
    - 捲動回測驗區頂部
    - _Requirements: 4.5_
  - [x] 6.3 撰寫屬性測試：逐題正確性標示
    - **Property 5: Per-Question Correctness Marking**
    - 生成隨機 selectedIndex 與 correctIndex 配對，驗證 isCorrect 欄位正確
    - **Validates: Requirements 4.3**
  - [x] 6.4 撰寫屬性測試：回饋訊息對應分數範圍
    - **Property 6: Feedback Message Matches Score Range**
    - 生成隨機分數 {0,20,40,60,80,100}，驗證回饋訊息符合定義的範圍
    - **Validates: Requirements 4.4**
  - [x] 6.5 撰寫屬性測試：重新測驗重置狀態
    - **Property 7: Quiz Reset Clears State**
    - 生成隨機已作答狀態，呼叫 resetQuiz() 後驗證所有欄位已清除
    - **Validates: Requirements 4.5**

- [x] 7. Checkpoint — 確認測驗功能與屬性測試
  - Ensure all tests pass, ask the user if questions arise.

- [x] 8. 響應式設計與視覺完善
  - [x] 8.1 實作響應式 CSS media queries
    - 桌面版：雙欄卡片佈局、導覽列水平排列
    - 行動裝置（≤768px）：單欄佈局、導覽列適配、字體與間距調整
    - _Requirements: 5.1_
  - [x] 8.2 加入互動視覺回饋效果
    - 按鈕 hover 與 active 效果
    - 選項選取狀態的視覺標示
    - 導覽連結 hover 效果
    - 頁面區塊之間的過渡動畫
    - _Requirements: 5.4_

- [x] 9. 整合測試與最終驗證
  - [x] 9.1 建立測試設定檔與單元測試
    - 建立 `vitest.config.js` 設定檔
    - 建立測試檔案，撰寫單元測試驗證：測驗結構（5 題 × 4 選項）、計分邊界條件（全對 100 分、全錯 0 分）、提交驗證邏輯
    - _Requirements: 3.1, 3.2, 4.1_
  - [x] 9.2 撰寫整合測試
    - 測試完整流程：選擇答案 → 提交 → 顯示結果 → 重新測驗
    - 測試未完成作答提交的提示訊息
    - _Requirements: 3.3, 3.4, 3.5, 4.2, 4.5_

- [x] 10. Final checkpoint — 確認所有功能與測試通過
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- 所有介面文字與內容使用繁體中文（Requirements 1.5）
- 測試中的 quiz 邏輯函式需從 index.html 中提取為可測試的模組，或在測試檔案中重新定義純函式進行測試
