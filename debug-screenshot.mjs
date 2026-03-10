import { chromium } from '@playwright/test';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 600, height: 500 } });
await page.goto('http://localhost:5173/?debug=1');
await page.waitForLoadState('networkidle');
await page.waitForTimeout(3000);

const scrollContainer = await page.$('section:nth-of-type(2) .overflow-x-auto');
for (let i = 0; i < 8; i++) {
  await scrollContainer.evaluate(el => el.scrollLeft = el.scrollWidth);
  await page.waitForTimeout(800);
}

// 末尾から700pxのところにスクロール
await scrollContainer.evaluate(el => el.scrollLeft = el.scrollWidth - 700);
await page.waitForTimeout(500);

const scrollBox = await scrollContainer.boundingBox();
await page.screenshot({
  path: '/tmp/debug_last_cards.png',
  clip: { x: scrollBox.x, y: scrollBox.y, width: 600, height: scrollBox.height }
});

// 末尾5枚のimg情報
const lastCards = await page.$$eval('section:nth-of-type(2) .overflow-x-auto img', imgs =>
  imgs.slice(-5).map(img => ({
    src: img.src.split('/').pop(),
    naturalWidth: img.naturalWidth,
    naturalHeight: img.naturalHeight,
    isLandscape: img.naturalWidth > img.naturalHeight,
  }))
);
console.log('last 5 cards:', JSON.stringify(lastCards, null, 2));

await browser.close();
