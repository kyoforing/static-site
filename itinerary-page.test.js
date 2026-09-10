import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const html = readFileSync(join(__dirname, 'index.html'), 'utf8');
const text = html.replace(/\s+/g, ' ');

describe('九份金瓜石行程頁', () => {
  it('使用繁中語系、手機友善設定與正確頁面標題', () => {
    expect(html).toContain('<html lang="zh-TW">');
    expect(html).toContain('name="viewport"');
    expect(html).toContain('九份金瓜石兩天一夜行程');
    expect(html).not.toContain('Vibe Coding');
  });

  it('呈現 2026/9/12 的火車與九份到金瓜石安排', () => {
    expect(text).toContain('2026/9/12');
    expect(text).toContain('板橋 08:47');
    expect(text).toContain('南港 09:10');
    expect(text).toContain('瑞芳 09:52');
    expect(text).toContain('九份老街');
    expect(text).toContain('豎崎路');
    expect(text).toContain('昇平戲院');
    expect(text).toContain('15:00');
    expect(text).toContain('緩慢金瓜石');
  });

  it('呈現 2026/9/13 上午報時山與茶壺山健行安排', () => {
    expect(text).toContain('2026/9/13');
    expect(text).toContain('上午走');
    expect(text).toContain('報時山');
    expect(text).toContain('茶壺山');
    expect(text).toContain('回住宿');
    expect(text).toContain('13:30');
    expect(text).toContain('迷迷路食堂');
    expect(text).toContain('下山回台北市');
  });

  it('保留可變資訊的提醒與查證日期', () => {
    expect(text).toContain('瑞芳');
    expect(text).toContain('陣雨');
    expect(text).toContain('32°C');
    expect(text).toContain('9/15');
    expect(text).toContain('10/15');
    expect(text).toContain('封閉施工');
    expect(text).toContain('出發前');
    expect(text).toContain('查證日');
  });

  it('正確區分 2024 山陀兒災後平台管制與 2026 步道施工封閉', () => {
    expect(text).toContain('2024 年山陀兒颱風');
    expect(text).toContain('茶壺山登山口旁觀景平台目前暫停開放');
    expect(text).toContain('9/13 在全面施工封閉前');
    expect(html).toContain('https://newtaipei.travel/zh-tw/news/detail/1480');
    expect(html).not.toContain('https://newtaipei.travel/zh-tw/news/detail/2820');
    expect(text).not.toContain('2026/9/10 更新的瑞芳區茶壺山步道即日起緊急封閉步道');
  });

  it('提供時間軸、行程卡片、登山段落、交通資訊與景點圖片來源', () => {
    expect(html).toContain('id="timeline"');
    expect(html).toContain('id="cards"');
    expect(html).toContain('id="hike"');
    expect(html).toContain('id="transport"');
    expect(html).toContain('id="weather"');
    expect(html).toContain('<img');
    expect(html).toMatch(/alt="[^"]+"/);
    expect(html).toContain('Wikimedia Commons');
  });
});
