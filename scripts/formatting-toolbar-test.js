import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SCREENSHOTS_DIR = 'screenshots';
const BASE_URL = 'http://localhost:5173';

// Test configurations - desktop focused for toolbar testing
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
  const filename = `formatting-${name}-${viewport.width}x${viewport.height}-${timestamp}.png`;
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

export async function runFormattingToolbarTests() {
  console.log('🎨 Starting formatting toolbar visual tests...');
  
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
      
      // Ensure we're in edit mode
      const editButton = page.locator('button:has-text("Edit")');
      await editButton.click();
      await page.waitForTimeout(500);
      
      // Test 1: Initial toolbar state
      console.log('  📸 Capturing initial toolbar state...');
      const initialToolbar = await takeScreenshot(
        page, 
        'toolbar-initial', 
        'Formatting toolbar initial state'
      );
      screenshots.push(initialToolbar);
      
      // Test 2: Focus editor and test text formatting buttons
      console.log('  ⌨️  Testing text formatting buttons...');
      const editor = page.locator('.cm-editor .cm-content');
      await editor.click();
      
      // Clear existing content and add test text
      await page.keyboard.press('Control+a');
      await page.keyboard.type('This is test content for formatting');
      await page.waitForTimeout(300);
      
      // Select some text
      await page.keyboard.press('Control+a');
      await page.waitForTimeout(300);
      
      // Test Bold button
      const boldButton = page.locator('button[title*="Bold"]');
      await boldButton.click();
      await page.waitForTimeout(500);
      
      const boldFormatted = await takeScreenshot(
        page, 
        'bold-applied', 
        'Text formatted with bold using toolbar button'
      );
      screenshots.push(boldFormatted);
      
      // Test 3: Test Italic button
      console.log('  💫 Testing italic formatting...');
      await page.keyboard.press('Control+a');
      const italicButton = page.locator('button[title*="Italic"]');
      await italicButton.click();
      await page.waitForTimeout(500);
      
      const italicFormatted = await takeScreenshot(
        page, 
        'italic-applied', 
        'Text formatted with italic using toolbar button'
      );
      screenshots.push(italicFormatted);
      
      // Test 4: Test Code button
      console.log('  💻 Testing code formatting...');
      await page.keyboard.press('Control+a');
      const codeButton = page.locator('button[title*="Code"]');
      await codeButton.click();
      await page.waitForTimeout(500);
      
      const codeFormatted = await takeScreenshot(
        page, 
        'code-applied', 
        'Text formatted with code using toolbar button'
      );
      screenshots.push(codeFormatted);
      
      // Test 5: Test Heading buttons
      console.log('  📝 Testing heading formatting...');
      
      // Clear and set cursor at beginning of line
      await page.keyboard.press('Control+a');
      await page.keyboard.press('Delete');
      await page.keyboard.type('Sample heading text');
      await page.keyboard.press('Home');
      
      // Test H1 button
      const h1Button = page.locator('button[title*="Heading 1"]');
      await h1Button.click();
      await page.waitForTimeout(500);
      
      const h1Formatted = await takeScreenshot(
        page, 
        'h1-applied', 
        'Heading 1 formatted using toolbar button'
      );
      screenshots.push(h1Formatted);
      
      // Test H2 button
      const h2Button = page.locator('button[title*="Heading 2"]');
      await h2Button.click();
      await page.waitForTimeout(500);
      
      const h2Formatted = await takeScreenshot(
        page, 
        'h2-applied', 
        'Heading 2 formatted using toolbar button'
      );
      screenshots.push(h2Formatted);
      
      // Test 6: Test List formatting
      console.log('  📋 Testing list formatting...');
      
      // Move to new line
      await page.keyboard.press('End');
      await page.keyboard.press('Enter');
      await page.keyboard.type('List item text');
      await page.keyboard.press('Home');
      
      // Test bullet list button
      const bulletListButton = page.locator('button[title*="Bullet List"]');
      await bulletListButton.click();
      await page.waitForTimeout(500);
      
      const bulletListFormatted = await takeScreenshot(
        page, 
        'bullet-list-applied', 
        'Bullet list formatted using toolbar button'
      );
      screenshots.push(bulletListFormatted);
      
      // Test numbered list button
      const numberedListButton = page.locator('button[title*="Numbered List"]');
      await numberedListButton.click();
      await page.waitForTimeout(500);
      
      const numberedListFormatted = await takeScreenshot(
        page, 
        'numbered-list-applied', 
        'Numbered list formatted using toolbar button'
      );
      screenshots.push(numberedListFormatted);
      
      // Test 7: Test keyboard shortcuts
      console.log('  ⌨️  Testing keyboard shortcuts...');
      
      // Clear content and test Ctrl+B
      await page.keyboard.press('Control+a');
      await page.keyboard.press('Delete');
      await page.keyboard.type('Keyboard shortcut test');
      await page.keyboard.press('Control+a');
      await page.keyboard.press('Control+b');
      await page.waitForTimeout(500);
      
      const keyboardBold = await takeScreenshot(
        page, 
        'keyboard-bold', 
        'Bold applied using Ctrl+B keyboard shortcut'
      );
      screenshots.push(keyboardBold);
      
      // Test Ctrl+I
      await page.keyboard.press('Control+a');
      await page.keyboard.press('Control+i');
      await page.waitForTimeout(500);
      
      const keyboardItalic = await takeScreenshot(
        page, 
        'keyboard-italic', 
        'Italic applied using Ctrl+I keyboard shortcut'
      );
      screenshots.push(keyboardItalic);
      
      // Test 8: Test complex formatting combination
      console.log('  🎯 Testing complex formatting...');
      
      await page.keyboard.press('Control+a');
      await page.keyboard.press('Delete');
      
      const complexText = `# Main Heading

## Subheading

Here is some **bold text** and *italic text* and \`inline code\`.

- First bullet point
- Second bullet point

1. First numbered item
2. Second numbered item

> This is a blockquote

---

Final paragraph with mixed formatting.`;
      
      await page.keyboard.type(complexText);
      await page.waitForTimeout(1000);
      
      const complexFormatting = await takeScreenshot(
        page, 
        'complex-formatting', 
        'Complex markdown formatting showcase'
      );
      screenshots.push(complexFormatting);
      
      // Test 9: Test blockquote and horizontal rule buttons
      console.log('  📄 Testing blockquote and horizontal rule...');
      
      await page.keyboard.press('End');
      await page.keyboard.press('Enter');
      await page.keyboard.type('Quote text example');
      await page.keyboard.press('Home');
      
      // Test blockquote button
      const blockquoteButton = page.locator('button[title*="Blockquote"]');
      await blockquoteButton.click();
      await page.waitForTimeout(500);
      
      const blockquoteFormatted = await takeScreenshot(
        page, 
        'blockquote-applied', 
        'Blockquote formatted using toolbar button'
      );
      screenshots.push(blockquoteFormatted);
      
      // Test horizontal rule button
      await page.keyboard.press('End');
      await page.keyboard.press('Enter');
      
      const hrButton = page.locator('button[title*="Horizontal Rule"]');
      await hrButton.click();
      await page.waitForTimeout(500);
      
      const hrFormatted = await takeScreenshot(
        page, 
        'horizontal-rule-applied', 
        'Horizontal rule inserted using toolbar button'
      );
      screenshots.push(hrFormatted);

      // Test 10: Toggle functionality with selections
      console.log('  🔄 Testing toggle functionality...');
      
      // Clear and add test text
      await page.keyboard.press('Control+a');
      await page.keyboard.press('Delete');
      await page.keyboard.type('Toggle test text');
      
      // Select text and apply bold
      await page.keyboard.press('Control+a');
      await boldButton.click();
      await page.waitForTimeout(500);
      
      const toggleApplied = await takeScreenshot(
        page, 
        'toggle-bold-applied', 
        'Bold formatting applied for toggle test'
      );
      screenshots.push(toggleApplied);
      
      // Click bold again to remove formatting (toggle off)
      await boldButton.click();
      await page.waitForTimeout(500);
      
      const toggleRemoved = await takeScreenshot(
        page, 
        'toggle-bold-removed', 
        'Bold formatting removed via toggle functionality'
      );
      screenshots.push(toggleRemoved);

      // Test 11: Empty selection behavior
      console.log('  ✨ Testing empty selection behavior...');
      
      // Clear content and position cursor
      await page.keyboard.press('Control+a');
      await page.keyboard.press('Delete');
      
      // Click bold button with no selection
      await boldButton.click();
      await page.waitForTimeout(500);
      
      // Type text to see cursor positioning
      await page.keyboard.type('immediate typing');
      await page.waitForTimeout(500);
      
      const emptySelectionBold = await takeScreenshot(
        page, 
        'empty-selection-bold', 
        'Bold markers inserted with cursor positioning for immediate typing'
      );
      screenshots.push(emptySelectionBold);
      
      // Test with italic on new line
      await page.keyboard.press('Enter');
      await italicButton.click();
      await page.keyboard.type('italic typing');
      await page.waitForTimeout(500);
      
      const emptySelectionItalic = await takeScreenshot(
        page, 
        'empty-selection-italic', 
        'Italic markers inserted with cursor positioning'
      );
      screenshots.push(emptySelectionItalic);

      // Test 12: Active state detection
      console.log('  🎯 Testing active state detection...');
      
      // Clear and create formatted text
      await page.keyboard.press('Control+a');
      await page.keyboard.press('Delete');
      await page.keyboard.type('Here is **bold text** and *italic text* for testing active states');
      await page.waitForTimeout(500);
      
      // Position cursor inside bold text
      await page.keyboard.press('Home');
      await page.keyboard.press('ArrowRight');
      await page.keyboard.press('ArrowRight');
      await page.keyboard.press('ArrowRight');
      await page.keyboard.press('ArrowRight');
      await page.keyboard.press('ArrowRight');
      await page.keyboard.press('ArrowRight');
      await page.keyboard.press('ArrowRight');
      await page.keyboard.press('ArrowRight');
      await page.keyboard.press('ArrowRight');
      await page.keyboard.press('ArrowRight'); // Position inside "bold"
      await page.waitForTimeout(500);
      
      const activeStateBold = await takeScreenshot(
        page, 
        'active-state-bold', 
        'Cursor in bold text - button should show active state'
      );
      screenshots.push(activeStateBold);
      
      // Position cursor inside italic text
      for (let i = 0; i < 15; i++) {
        await page.keyboard.press('ArrowRight');
      }
      await page.waitForTimeout(500);
      
      const activeStateItalic = await takeScreenshot(
        page, 
        'active-state-italic', 
        'Cursor in italic text - button should show active state'
      );
      screenshots.push(activeStateItalic);

      // Test 13: Line format toggles
      console.log('  📝 Testing line format toggles...');
      
      // Clear and test heading toggle
      await page.keyboard.press('Control+a');
      await page.keyboard.press('Delete');
      await page.keyboard.type('Heading toggle test');
      await page.keyboard.press('Home');
      
      // Apply H1
      await h1Button.click();
      await page.waitForTimeout(500);
      
      const headingApplied = await takeScreenshot(
        page, 
        'heading-toggle-applied', 
        'H1 heading applied for toggle test'
      );
      screenshots.push(headingApplied);
      
      // Click H1 again to remove
      await h1Button.click();
      await page.waitForTimeout(500);
      
      const headingRemoved = await takeScreenshot(
        page, 
        'heading-toggle-removed', 
        'H1 heading removed via toggle functionality'
      );
      screenshots.push(headingRemoved);

      // Test 14: Keyboard shortcut toggles
      console.log('  ⌨️  Testing keyboard shortcut toggles...');
      
      await page.keyboard.press('Control+a');
      await page.keyboard.type('Keyboard toggle test');
      await page.keyboard.press('Control+a');
      
      // Apply bold via keyboard
      await page.keyboard.press('Control+b');
      await page.waitForTimeout(500);
      
      const keyboardToggleApplied = await takeScreenshot(
        page, 
        'keyboard-toggle-applied', 
        'Bold applied via Ctrl+B for toggle test'
      );
      screenshots.push(keyboardToggleApplied);
      
      // Remove bold via keyboard (toggle off)
      await page.keyboard.press('Control+b');
      await page.waitForTimeout(500);
      
      const keyboardToggleRemoved = await takeScreenshot(
        page, 
        'keyboard-toggle-removed', 
        'Bold removed via Ctrl+B toggle functionality'
      );
      screenshots.push(keyboardToggleRemoved);

      // Test 15: Panel switch active state persistence
      console.log('  🔄 Testing panel switch active state persistence...');
      
      // Clear and create formatted content
      await page.keyboard.press('Control+a');
      await page.keyboard.press('Delete');
      await page.keyboard.type('Panel switch test with **bold** and *italic* text');
      await page.waitForTimeout(500);
      
      // Position cursor in bold text
      await page.keyboard.press('Home');
      for (let i = 0; i < 26; i++) { // Position cursor in "bold"
        await page.keyboard.press('ArrowRight');
      }
      await page.waitForTimeout(500);
      
      const beforePanelSwitch = await takeScreenshot(
        page, 
        'before-panel-switch', 
        'Active states before panel switch - cursor in bold text'
      );
      screenshots.push(beforePanelSwitch);
      
      // Switch to Preview mode
      const previewButton = page.locator('button:has-text("Preview")');
      await previewButton.click();
      await page.waitForTimeout(1000);
      
      const inPreviewMode = await takeScreenshot(
        page, 
        'in-preview-mode', 
        'In preview mode - formatting toolbar should be hidden'
      );
      screenshots.push(inPreviewMode);
      
      // Switch back to Edit mode
      await editButton.click();
      await page.waitForTimeout(1000);
      
      // Click in the editor to ensure it's focused and position cursor in bold text again
      await editor.click();
      await page.keyboard.press('Home');
      for (let i = 0; i < 26; i++) { // Position cursor in "bold" again
        await page.keyboard.press('ArrowRight');
      }
      await page.waitForTimeout(500);
      
      const afterPanelSwitch = await takeScreenshot(
        page, 
        'after-panel-switch', 
        'Active states after panel switch - should show bold as active again'
      );
      screenshots.push(afterPanelSwitch);

      // Test 16: Multiple panel switches with different cursor positions
      console.log('  ↩️  Testing multiple panel switches...');
      
      // Move cursor to italic text
      for (let i = 0; i < 10; i++) {
        await page.keyboard.press('ArrowRight');
      }
      await page.waitForTimeout(500);
      
      // Switch to preview and back multiple times
      await previewButton.click();
      await page.waitForTimeout(500);
      await editButton.click();
      await page.waitForTimeout(500);
      
      // Ensure editor is focused and cursor position is maintained
      await editor.click();
      await page.waitForTimeout(500);
      
      const multipleSwitchResult = await takeScreenshot(
        page, 
        'multiple-switch-result', 
        'After multiple panel switches - active states should be correct'
      );
      screenshots.push(multipleSwitchResult);
      
      await context.close();
    }
    
  } catch (error) {
    console.error('❌ Error during formatting toolbar testing:', error);
    throw error;
  } finally {
    await browser.close();
  }
  
  console.log('✅ Formatting toolbar visual testing completed!');
  console.log(`📸 ${screenshots.length} screenshots captured`);
  
  return screenshots;
}

// Main execution
if (import.meta.url === `file://${process.argv[1]}`) {
  runFormattingToolbarTests().catch(error => {
    console.error('❌ Formatting toolbar testing failed:', error);
    process.exit(1);
  });
}