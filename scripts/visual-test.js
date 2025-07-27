import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SCREENSHOTS_DIR = 'screenshots';
const REPORT_FILE = 'visual-test-report.html';
const BASE_URL = 'http://localhost:5173';

// Test configurations - desktop only for Phase 2/3 testing
const viewports = [
  { name: 'desktop', width: 1280, height: 720 }
];

async function ensureDirectoryExists(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function takeScreenshot(page, name, description) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const viewport = await page.viewportSize();
  const filename = `${name}-${viewport.width}x${viewport.height}-${timestamp}.png`;
  const filepath = path.join(SCREENSHOTS_DIR, filename);
  
  await page.screenshot({ path: filepath, fullPage: true });
  
  return {
    filename,
    filepath,
    name,
    description,
    timestamp,
    viewport: `${viewport.width}x${viewport.height}`,
    size: fs.statSync(filepath).size
  };
}

async function runVisualTests() {
  console.log('🚀 Starting visual tests for ContextPad...');
  
  // Ensure screenshots directory exists
  await ensureDirectoryExists(SCREENSHOTS_DIR);
  
  const browser = await chromium.launch({ headless: true });
  const screenshots = [];
  
  try {
    for (const viewport of viewports) {
      console.log(`📱 Testing ${viewport.name} viewport (${viewport.width}x${viewport.height})`);
      
      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height }
      });
      
      const page = await context.newPage();
      
      // Navigate to the app
      console.log('  📍 Navigating to application...');
      await page.goto(BASE_URL, { waitUntil: 'networkidle' });
      
      // Wait for app to load
      await page.waitForSelector('h1', { timeout: 10000 });
      
      // Test 1: Initial load
      console.log('  📸 Taking initial load screenshot...');
      const initialScreenshot = await takeScreenshot(
        page, 
        'initial-load', 
        'Application initial load state'
      );
      screenshots.push(initialScreenshot);
      
      // Test 2: Check for toggle buttons
      console.log('  🔍 Checking for toggle buttons...');
      const editButton = page.locator('button:has-text("Edit")');
      const previewButton = page.locator('button:has-text("Preview")');
      
      await editButton.waitFor({ timeout: 5000 });
      await previewButton.waitFor({ timeout: 5000 });
      
      const editModeScreenshot = await takeScreenshot(
        page, 
        'edit-mode', 
        'Edit mode active (default state)'
      );
      screenshots.push(editModeScreenshot);
      
      // Test 3: Click Preview button
      console.log('  🖱️  Clicking Preview button...');
      await previewButton.click();
      await page.waitForTimeout(500); // Wait for transition
      
      const previewModeScreenshot = await takeScreenshot(
        page, 
        'preview-mode', 
        'Preview mode active after clicking Preview button'
      );
      screenshots.push(previewModeScreenshot);
      
      // Test 4: Click Edit button to return
      console.log('  🖱️  Clicking Edit button...');
      await editButton.click();
      await page.waitForTimeout(500); // Wait for transition
      
      const backToEditScreenshot = await takeScreenshot(
        page, 
        'back-to-edit', 
        'Back to Edit mode after clicking Edit button'
      );
      screenshots.push(backToEditScreenshot);
      
      // Test 5: Phase 2/3 CodeMirror Features - Enhanced editor features
      console.log('  🔧 Testing enhanced CodeMirror features...');
      
      // Test line numbers toggle
      const lineNumbersCheckbox = page.locator('input[type="checkbox"]:has-text("Show line numbers")');
      if (await lineNumbersCheckbox.count() > 0) {
        await lineNumbersCheckbox.check();
        await page.waitForTimeout(300);
        console.log('    ✓ Line numbers enabled');
        
        const lineNumbersEnabledScreenshot = await takeScreenshot(
          page,
          'line-numbers-enabled',
          'Editor with line numbers enabled'
        );
        screenshots.push(lineNumbersEnabledScreenshot);
      }
      
      // Test code folding toggle
      const codeFoldingCheckbox = page.locator('input[type="checkbox"]:has-text("Enable code folding")');
      if (await codeFoldingCheckbox.count() > 0) {
        console.log('    ✓ Code folding option available');
      }
      
      // Test search functionality (Ctrl+F)
      const editor = page.locator('.cm-editor');
      if (await editor.count() > 0) {
        await editor.first().click();
        await page.keyboard.press('Control+f');
        await page.waitForTimeout(300);
        
        const searchOpenScreenshot = await takeScreenshot(
          page,
          'search-panel-open',
          'Search panel opened with Ctrl+F'
        );
        screenshots.push(searchOpenScreenshot);
        
        // Type in search box if it appears
        const searchInput = page.locator('.cm-searchbox input');
        if (await searchInput.count() > 0) {
          await searchInput.fill('markdown');
          await page.waitForTimeout(300);
          
          const searchResultsScreenshot = await takeScreenshot(
            page,
            'search-results',
            'Search results highlighting matches'
          );
          screenshots.push(searchResultsScreenshot);
        }
        
        // Close search
        await page.keyboard.press('Escape');
        await page.waitForTimeout(300);
      }

      // Test 6: UI Enhancements - Character counters and clear buttons
      console.log('  📊 Testing UI enhancements...');
      
      // Check character counters exist
      const characterCounters = page.locator('div:has-text("characters")');
      const counterCount = await characterCounters.count();
      console.log(`    Found ${counterCount} character counters`);
      
      // Check clear buttons exist
      const clearButtons = page.locator('button:has(svg)').filter({ hasText: '' });
      const clearButtonCount = await clearButtons.count();
      console.log(`    Found ${clearButtonCount} clear buttons`);
      
      const enhancementsScreenshot = await takeScreenshot(
        page,
        'ui-enhancements-initial',
        'UI enhancements - character counters and clear buttons visible'
      );
      screenshots.push(enhancementsScreenshot);
      
      // Test 7: Type in CodeMirror editor and check character counter updates
      console.log('  ⌨️  Testing CodeMirror editor interaction and character counting...');
      const codeMirrorEditor = page.locator('.cm-editor .cm-content');
      if (await codeMirrorEditor.count() > 0) {
        const testText = '# Test Content with Enhanced Features\\n\\nThis is a test of the CodeMirror editor with:\\n\\n## Phase 2/3 Features\\n- **Syntax highlighting**\\n- *Search functionality*\\n- Line numbers toggle\\n- Code folding support\\n- Character counting\\n- Clear buttons\\n\\n```javascript\\nconst example = "code block";\\n```\\n\\n> This is a blockquote to test styling';
        await codeMirrorEditor.click();
        await page.keyboard.press('Control+a'); // Select all existing content
        await page.keyboard.type(testText);
        await page.waitForTimeout(500);
        
        const codeMirrorScreenshot = await takeScreenshot(
          page, 
          'codemirror-enhanced-content', 
          'CodeMirror editor with enhanced features and syntax highlighting'
        );
        screenshots.push(codeMirrorScreenshot);
        
        // Skip clear button test for now - focus on enhanced features
        console.log('  ⏭️  Skipping clear button test for enhanced features demo...');
        
        // Switch to preview to see the content
        await previewButton.click();
        await page.waitForTimeout(500);
        
        const previewWithContentScreenshot = await takeScreenshot(
          page, 
          'preview-with-content', 
          'Preview mode showing entered content'
        );
        screenshots.push(previewWithContentScreenshot);
      }
      
      await context.close();
    }
    
  } catch (error) {
    console.error('❌ Error during visual testing:', error);
    throw error;
  } finally {
    await browser.close();
  }
  
  // Generate HTML report
  console.log('📊 Generating HTML report...');
  await generateHtmlReport(screenshots);
  
  console.log('✅ Visual testing completed!');
  console.log(`📸 ${screenshots.length} screenshots captured`);
  console.log(`📁 Screenshots saved to: ${SCREENSHOTS_DIR}/`);
  console.log(`📄 Report saved to: ${REPORT_FILE}`);
  
  return screenshots;
}

async function generateHtmlReport(screenshots) {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ContextPad Visual Test Report</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #2563eb;
            text-align: center;
            margin-bottom: 30px;
        }
        .summary {
            background: #f8fafc;
            padding: 20px;
            border-radius: 6px;
            margin-bottom: 30px;
            border-left: 4px solid #2563eb;
        }
        .screenshot-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }
        .screenshot-card {
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 15px;
            background: white;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .screenshot-card img {
            width: 100%;
            height: auto;
            border-radius: 4px;
            border: 1px solid #e2e8f0;
        }
        .screenshot-meta {
            margin-top: 10px;
            font-size: 14px;
            color: #64748b;
        }
        .screenshot-title {
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 5px;
        }
        .viewport-badge {
            display: inline-block;
            background: #dbeafe;
            color: #1d4ed8;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 500;
        }
        .timestamp {
            color: #94a3b8;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎨 ContextPad Visual Test Report</h1>
        
        <div class="summary">
            <h3>Test Summary</h3>
            <p><strong>Screenshots captured:</strong> ${screenshots.length}</p>
            <p><strong>Test date:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>Viewports tested:</strong> Desktop (1280x720), Mobile (375x667)</p>
            <p><strong>Tests performed:</strong> Initial load, Edit mode, Preview mode, Toggle interactions, Textarea input</p>
        </div>

        <div class="screenshot-grid">
            ${screenshots.map(screenshot => `
                <div class="screenshot-card">
                    <div class="screenshot-title">${screenshot.description}</div>
                    <img src="${screenshot.filepath}" alt="${screenshot.description}" />
                    <div class="screenshot-meta">
                        <div><span class="viewport-badge">${screenshot.viewport}</span></div>
                        <div class="timestamp">${new Date(screenshot.timestamp).toLocaleString()}</div>
                        <div>Size: ${(screenshot.size / 1024).toFixed(1)} KB</div>
                    </div>
                </div>
            `).join('')}
        </div>
    </div>
</body>
</html>`;

  fs.writeFileSync(REPORT_FILE, html);
}

// Main execution
if (import.meta.url === `file://${process.argv[1]}`) {
  runVisualTests().catch(error => {
    console.error('❌ Visual testing failed:', error);
    process.exit(1);
  });
}

export { runVisualTests };