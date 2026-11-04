import { chromium } from 'playwright';
import fs from 'fs';

// Read memes.ts
const content = fs.readFileSync('./src/data/memes.ts', 'utf8');
const match = content.match(/export const MEMES_DATA: MemeItem\[\] = (\[[\s\S]*\]);/);
const memes = eval(match[1]);

async function checkQuery(browser, meme) {
  const context = await browser.newContext({
    locale: 'zh-TW',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();
  const query = meme.gmapQuery;
  const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  
  try {
    await page.goto(url, { waitUntil: 'load', timeout: 25000 });
    await page.waitForTimeout(4000);
    
    const finalUrl = page.url();
    const title = await page.title();
    
    // Check if place or feed
    const isPlaceUrl = finalUrl.includes('/place/');
    const feedLocator = page.locator('[role="feed"]');
    const hasFeed = (await feedLocator.count()) > 0;
    
    let feedItems = [];
    if (hasFeed) {
      const items = page.locator('[role="feed"] > div [role="article"], [role="feed"] > div a[href*="/place/"]');
      const count = await items.count();
      for (let i = 0; i < Math.min(count, 5); i++) {
        const text = await items.nth(i).innerText().catch(() => '');
        feedItems.push(text.split('\n')[0].trim());
      }
    }
    
    let h1Text = '';
    const h1Locator = page.locator('h1');
    if ((await h1Locator.count()) > 0) {
      h1Text = await h1Locator.first().innerText().catch(() => '');
    }
    
    const isSingleCard = isPlaceUrl || (h1Text && !hasFeed && h1Text !== '結果' && h1Text !== 'Results');
    
    return {
      id: meme.id,
      title: meme.title,
      query: query,
      isSingleCard,
      isPlaceUrl,
      h1Text,
      hasFeed,
      feedCount: feedItems.length,
      feedItems,
      finalUrl: finalUrl.substring(0, 120),
      pageTitle: title
    };
  } catch (err) {
    return {
      id: meme.id,
      title: meme.title,
      query: query,
      isSingleCard: false,
      error: err.message
    };
  } finally {
    await context.close();
  }
}

async function main() {
  console.log(`Auditing all ${memes.length} memes on Google Maps...`);
  const browser = await chromium.launch({ headless: true });
  const results = [];
  
  // Run sequentially or in chunks of 3 to avoid rate limit / CPU load
  for (let i = 0; i < memes.length; i++) {
    const meme = memes[i];
    process.stdout.write(`[${i + 1}/${memes.length}] Checking "${meme.id}" (${meme.gmapQuery})... `);
    const res = await checkQuery(browser, meme);
    results.push(res);
    if (res.isSingleCard) {
      console.log(`✅ SINGLE CARD ("${res.h1Text}")`);
    } else {
      console.log(`❌ MULTI/FEED (${res.feedCount} items: ${res.feedItems ? res.feedItems.join(', ') : res.error})`);
    }
  }
  
  await browser.close();
  fs.writeFileSync('./scratch_gmap_audit_results.json', JSON.stringify(results, null, 2));
  console.log('\nAudit complete! Results saved to ./scratch_gmap_audit_results.json');
  
  const multi = results.filter(r => !r.isSingleCard);
  console.log(`\n=== Summary ===`);
  console.log(`Total single place cards: ${results.length - multi.length} / ${results.length}`);
  console.log(`Total multi-result/feed issues: ${multi.length} / ${results.length}`);
  if (multi.length > 0) {
    console.log(`\nProblematic queries:`);
    multi.forEach(m => {
      console.log(`- [${m.id}] query: "${m.query}" | H1: "${m.h1Text}" | Feed: ${m.feedItems ? m.feedItems.join(', ') : m.error}`);
    });
  }
}

main().catch(console.error);
