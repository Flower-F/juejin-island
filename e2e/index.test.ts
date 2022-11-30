import { test, expect } from '@playwright/test';

test('Verify that the page renders properly', async ({ page }) => {
  await page.goto('http://localhost:5173');

  const res = await page.evaluate(async () => {
    const pageCount = document.body.innerText;
    return pageCount.includes('Layout');
  });

  expect(res).toBe(true);
});
