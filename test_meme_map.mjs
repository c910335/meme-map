import { chromium } from 'playwright';

async function runTest() {
  console.log('🚀 Starting Playwright E2E verification on http://127.0.0.1:5173/ ...');

  const errors = [];
  const warnings = [];

  const browser = await chromium.launch({
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    permissions: ['clipboard-read', 'clipboard-write'],
  });

  const page = await context.newPage();

  // Listen for uncaught exceptions
  page.on('pageerror', (err) => {
    console.error('❌ [Page Error]:', err.message);
    errors.push(err.message);
  });

  // Listen for console errors
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      console.error('❌ [Console Error]:', msg.text());
      errors.push(msg.text());
    } else if (msg.type() === 'warn') {
      warnings.push(msg.text());
    }
  });

  try {
    // 1. Navigate to the map
    await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle' });
    console.log('✅ Page loaded successfully');

    // 2. Check for Leaflet map container
    await page.waitForSelector('.leaflet-container', { timeout: 5000 });
    console.log('✅ Leaflet map container detected');

    // 3. Wait for tiles to load
    await page.waitForSelector('.leaflet-tile', { timeout: 10000 });
    console.log('✅ Leaflet tiles loaded');

    // 4. Verify markers are rendered
    const markers = await page.$$('.meme-marker');
    console.log(`✅ Meme markers rendered: ${markers.length} markers`);
    if (markers.length === 0) {
      throw new Error('No meme markers found on the map!');
    }

    // 5. Test clicking a meme card in the sidebar
    console.log('👉 Testing meme card interaction...');
    const firstCard = await page.waitForSelector('aside div.cursor-pointer');
    await firstCard.click();
    await page.waitForTimeout(1000);

    // 6. Test opening the Encyclopedia modal
    console.log('👉 Testing Encyclopedia modal...');
    const detailBtn = await page.waitForSelector('button:has-text("百科詳情")');
    await detailBtn.click();
    await page.waitForSelector('h2', { timeout: 5000 });
    const modalTitle = await page.textContent('h2');
    console.log(`✅ Modal opened successfully with title: "${modalTitle}"`);

    // Close modal
    const closeBtn = await page.waitForSelector('button:has-text("關閉")');
    await closeBtn.click();
    await page.waitForTimeout(500);

    // 7. Test Random Teleport button
    console.log('👉 Testing "隨機傳送門" (Random Teleport)...');
    const randomBtn = await page.waitForSelector('button:has-text("隨機傳送門")');
    await randomBtn.click();
    await page.waitForTimeout(1500);
    console.log('✅ Random Teleport triggered smoothly');

    // 8. Test Layer Toggle (Dark -> Light -> Satellite -> Dark)
    console.log('👉 Testing Tile theme toggle...');
    const layerBtn = await page.waitForSelector('header button:has-text("暗色"), header button:has-text("亮色"), header button:has-text("明亮")');
    await layerBtn.click();
    await page.waitForTimeout(800);
    console.log('✅ Switched to Light layer');

    await layerBtn.click();
    await page.waitForTimeout(800);
    console.log('✅ Switched to Satellite layer');

    await layerBtn.click();
    await page.waitForTimeout(800);
    console.log('✅ Switched back to Dark layer');

    // 9. Test Popup opening and verify links & close button layout
    console.log('👉 Testing Popup display, links, and close button layout...');
    const cardToSelect = await page.waitForSelector('aside div.cursor-pointer');
    await cardToSelect.click();
    await page.waitForSelector('.leaflet-popup', { timeout: 5000 });
    console.log('✅ Popup opened successfully');

    // Verify "地標" and "導航" buttons in popup
    const popupPlaceLink = await page.locator('.leaflet-popup a:has-text("地標")').getAttribute('href');
    const popupDirLink = await page.locator('.leaflet-popup a:has-text("導航")').getAttribute('href');
    console.log(`Popup Place URL: ${popupPlaceLink}`);
    console.log(`Popup Dir URL: ${popupDirLink}`);
    if (!popupPlaceLink || !popupPlaceLink.includes('/maps/search/?api=1&query=')) {
      throw new Error(`Invalid popup place link: ${popupPlaceLink}`);
    }
    if (!popupDirLink || !popupDirLink.includes('/maps/dir/?api=1&destination=')) {
      throw new Error(`Invalid popup dir link: ${popupDirLink}`);
    }
    console.log('✅ Both Place and Navigation links verified in Leaflet popup');

    // 10. Verify "全島視角" is removed from header
    console.log('👉 Verifying "全島視角" is removed from header...');
    const allIslandBtns = await page.$$('header button:has-text("全島視角")');
    if (allIslandBtns.length !== 0) {
      throw new Error('"全島視角" should be removed from header!');
    }
    console.log('✅ "全島視角" successfully removed from header');

    // 11. Test "提供地標" Modal (GitHub Issues & Threads & Copy template)
    console.log('👉 Testing "提供地標" Modal with GitHub & Threads channels...');
    const submitBtn = await page.waitForSelector('header button:has-text("提供地標")');
    await submitBtn.click();
    await page.waitForSelector('h2:has-text("推薦新的迷因地標")', { timeout: 5000 });
    const ghIssueLink = await page.locator('a[href*="github.com/c910335/meme-map/issues"]').getAttribute('href');
    const threadsLink = await page.locator('a[href*="threads.com/@c910335"]').getAttribute('href');
    console.log(`Submit Modal GitHub Link: ${ghIssueLink}`);
    console.log(`Submit Modal Threads Link: ${threadsLink}`);
    if (!ghIssueLink || !threadsLink) {
      throw new Error('Submit modal missing GitHub or Threads link!');
    }
    // Test Copy Template button
    const copyTemplateBtn = await page.waitForSelector('button:has-text("複製範本")');
    await copyTemplateBtn.click();
    console.log('✅ "複製範本" clicked in Submit modal');
    const closeSubmitBtn = await page.waitForSelector('button:has-text("關閉視窗")');
    await closeSubmitBtn.click();
    await page.waitForTimeout(500);

    // 12. Test "關於" Modal (GitHub Repo & Threads info & Disclaimers)
    console.log('👉 Testing "關於" Modal with GitHub & Threads links and Disclaimers...');
    const aboutBtn = await page.waitForSelector('header button[title*="關於"]');
    await aboutBtn.click();
    await page.waitForSelector('h2:has-text("關於「台灣迷因地圖」")', { timeout: 5000 });
    const aboutGhLink = await page.locator('a[href="https://github.com/c910335/meme-map"]').getAttribute('href');
    const aboutThreadsLink = await page.locator('a[href="https://www.threads.com/@c910335"]').first().getAttribute('href');
    console.log(`About Modal GitHub Link: ${aboutGhLink}`);
    console.log(`About Modal Threads Link: ${aboutThreadsLink}`);
    if (!aboutGhLink || !aboutThreadsLink) {
      throw new Error('About modal missing GitHub or Threads link!');
    }

    // Verify Disclaimers
    const aboutText = await page.textContent('.fixed.inset-0.z-50');
    if (!aboutText.includes('Antigravity & Gemini 3.8 Flash High')) {
      throw new Error('About modal missing "Antigravity & Gemini 3.8 Flash High" disclaimer!');
    }
    if (!aboutText.includes('下架')) {
      throw new Error('About modal missing takedown (下架) policy disclaimer!');
    }
    console.log('✅ AI attribution and takedown disclaimers verified in About Modal');

    const closeAboutBtn = await page.waitForSelector('button:has-text("瞭解並返回")');
    await closeAboutBtn.click();
    await page.waitForTimeout(500);

    // Reopen detail modal to verify Modal buttons
    const secondCard = await page.waitForSelector('aside div.cursor-pointer');
    await secondCard.click();
    await page.waitForTimeout(500);
    const detailBtn2 = await page.waitForSelector('button:has-text("百科詳情")');
    await detailBtn2.click();
    await page.waitForSelector('h2', { timeout: 5000 });
    const modalPlaceLink = await page.locator('a:has-text("開啟地標")').getAttribute('href');
    const modalDirLink = await page.locator('a:has-text("路線導航")').getAttribute('href');
    console.log(`Modal Place URL: ${modalPlaceLink}`);
    console.log(`Modal Dir URL: ${modalDirLink}`);
    if (!modalPlaceLink || !modalPlaceLink.includes('/maps/search/?api=1&query=')) {
      throw new Error(`Invalid modal place link: ${modalPlaceLink}`);
    }
    if (!modalDirLink || !modalDirLink.includes('/maps/dir/?api=1&destination=')) {
      throw new Error(`Invalid modal dir link: ${modalDirLink}`);
    }
    console.log('✅ Both Place and Navigation buttons verified in Detail Modal');
    const closeBtn2 = await page.waitForSelector('button:has-text("關閉")');
    await closeBtn2.click();
    await page.waitForTimeout(500);

    // Check positions of close button and year element
    const testCard = await page.waitForSelector('aside div.cursor-pointer');
    await testCard.click();
    await page.waitForSelector('.leaflet-popup', { timeout: 5000 });
    console.log('✅ Popup opened successfully');

    // Check positions of close button and year element
    const closeBtnBox = await page.locator('.leaflet-popup-close-button').boundingBox();
    const yearBox = await page.locator('.leaflet-popup span:has-text("年")').first().boundingBox();
    console.log('Close button box:', closeBtnBox);
    console.log('Year element box:', yearBox);

    if (closeBtnBox && yearBox) {
      // Check for horizontal overlap
      const overlapX = !(closeBtnBox.x + closeBtnBox.width <= yearBox.x || yearBox.x + yearBox.width <= closeBtnBox.x);
      // Check for vertical overlap
      const overlapY = !(closeBtnBox.y + closeBtnBox.height <= yearBox.y || yearBox.y + yearBox.height <= closeBtnBox.y);
      if (overlapX && overlapY) {
        throw new Error('Close button and Year element are STILL overlapping!');
      }
      console.log('✅ Close button and Year element DO NOT overlap! Clean separation verified.');
    }

    // 12. Test GPS Nearest Meme Radar feature
    console.log('👉 Testing GPS Nearest Meme Radar...');
    await page.context().grantPermissions(['geolocation']);
    await page.context().setGeolocation({ latitude: 25.0477, longitude: 121.5170 }); // Taipei Main Station
    const radarBtn = await page.waitForSelector('header button:has-text("離我最近")');
    await radarBtn.click();
    await page.waitForTimeout(1000);
    const notice = await page.waitForSelector('[data-testid="location-notice"]');
    const noticeText = await notice.innerText();
    console.log(`✅ GPS Radar locked! Notice: ${noticeText}`);
    const userMarker = await page.waitForSelector('.user-location-custom-icon');
    console.log('✅ User pulsing location marker rendered on map');
    const gpsBanner = await page.waitForSelector('text=GPS 雷達已鎖定');
    console.log('✅ GPS sorting banner active in sidebar');

    // Take screenshot with popup open
    const screenshotPath = '/home/tatsujin/Workspace/web/meme_map/verification_screenshot.png';
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`📸 Screenshot saved to: ${screenshotPath}`);

  } catch (err) {
    console.error('❌ Test failed with exception:', err);
    errors.push(err.message);
  } finally {
    await browser.close();
  }

  console.log('\n--- Test Summary ---');
  console.log(`Total Errors: ${errors.length}`);
  console.log(`Total Warnings: ${warnings.length}`);

  if (errors.length > 0) {
    console.error('Errors encountered:', errors);
    process.exit(1);
  } else {
    console.log('🎉 ALL PLAYWRIGHT TESTS PASSED! ZERO ERRORS!');
    process.exit(0);
  }
}

runTest();
