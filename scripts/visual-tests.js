import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { runVisualTests } from './visual-test.js';
import { runFormattingToolbarTests } from './formatting-toolbar-test.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SCREENSHOTS_DIR = 'screenshots';
const REPORT_FILE = 'visual-test-report.html';

async function ensureDirectoryExists(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function runAllVisualTests() {
  console.log('🚀 Starting comprehensive visual tests for ContextPad...');
  console.log('   Running: Core functionality + Formatting toolbar tests');
  console.log('');
  
  // Ensure screenshots directory exists
  await ensureDirectoryExists(SCREENSHOTS_DIR);
  
  let allScreenshots = [];
  
  try {
    // Run core functionality tests
    console.log('📋 Running core functionality tests...');
    const coreScreenshots = await runVisualTests();
    allScreenshots = allScreenshots.concat(coreScreenshots);
    
    console.log('');
    
    // Run formatting toolbar tests
    console.log('🎨 Running formatting toolbar tests...');
    const toolbarScreenshots = await runFormattingToolbarTests();
    allScreenshots = allScreenshots.concat(toolbarScreenshots);
    
  } catch (error) {
    console.error('❌ Error during visual testing:', error);
    throw error;
  }
  
  // Generate combined HTML report
  console.log('');
  console.log('📊 Generating comprehensive HTML report...');
  await generateCombinedHtmlReport(allScreenshots);
  
  console.log('✅ All visual tests completed successfully!');
  console.log(`📸 Total screenshots captured: ${allScreenshots.length}`);
  console.log(`📁 Screenshots saved to: ${SCREENSHOTS_DIR}/`);
  console.log(`📄 Report saved to: ${REPORT_FILE}`);
  
  return allScreenshots;
}

async function generateCombinedHtmlReport(screenshots) {
  // Group screenshots by test type
  const coreScreenshots = screenshots.filter(s => !s.filename.includes('formatting-'));
  const toolbarScreenshots = screenshots.filter(s => s.filename.includes('formatting-'));
  
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ContextPad Comprehensive Visual Test Report</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 1400px;
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
        h2 {
            color: #1e293b;
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 10px;
            margin-top: 40px;
        }
        .summary {
            background: #f8fafc;
            padding: 20px;
            border-radius: 6px;
            margin-bottom: 30px;
            border-left: 4px solid #2563eb;
        }
        .test-section {
            margin-bottom: 40px;
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
        .test-type-badge {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 500;
            margin-left: 8px;
        }
        .core-badge {
            background: #dcfce7;
            color: #166534;
        }
        .toolbar-badge {
            background: #fef3c7;
            color: #92400e;
        }
        .timestamp {
            color: #94a3b8;
            font-size: 12px;
        }
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-bottom: 20px;
        }
        .stat-item {
            background: #f1f5f9;
            padding: 15px;
            border-radius: 6px;
            text-align: center;
        }
        .stat-number {
            font-size: 24px;
            font-weight: bold;
            color: #2563eb;
        }
        .stat-label {
            font-size: 14px;
            color: #64748b;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎨 ContextPad Comprehensive Visual Test Report</h1>
        
        <div class="summary">
            <h3>Test Summary</h3>
            <div class="stats">
                <div class="stat-item">
                    <div class="stat-number">${screenshots.length}</div>
                    <div class="stat-label">Total Screenshots</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">${coreScreenshots.length}</div>
                    <div class="stat-label">Core Functionality</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">${toolbarScreenshots.length}</div>
                    <div class="stat-label">Formatting Toolbar</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">${new Date().toLocaleDateString()}</div>
                    <div class="stat-label">Test Date</div>
                </div>
            </div>
            <p><strong>Viewports tested:</strong> Desktop (1280x720)</p>
            <p><strong>Test coverage:</strong> Core app functionality, formatting toolbar buttons, keyboard shortcuts, complex formatting scenarios</p>
        </div>

        <div class="test-section">
            <h2>📋 Core Functionality Tests <span class="test-type-badge core-badge">Core</span></h2>
            <p>Basic application functionality including mode switching, content editing, and UI interactions.</p>
            <div class="screenshot-grid">
                ${coreScreenshots.map(screenshot => `
                    <div class="screenshot-card">
                        <div class="screenshot-title">${screenshot.description}</div>
                        <img src="${screenshot.filepath}" alt="${screenshot.description}" />
                        <div class="screenshot-meta">
                            <div><span class="viewport-badge">${screenshot.viewport}</span><span class="test-type-badge core-badge">Core</span></div>
                            <div class="timestamp">${new Date(screenshot.timestamp).toLocaleString()}</div>
                            <div>Size: ${(screenshot.size / 1024).toFixed(1)} KB</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>

        <div class="test-section">
            <h2>🎨 Formatting Toolbar Tests <span class="test-type-badge toolbar-badge">Toolbar</span></h2>
            <p>Comprehensive testing of all formatting buttons, keyboard shortcuts, and text manipulation features.</p>
            <div class="screenshot-grid">
                ${toolbarScreenshots.map(screenshot => `
                    <div class="screenshot-card">
                        <div class="screenshot-title">${screenshot.description}</div>
                        <img src="${screenshot.filepath}" alt="${screenshot.description}" />
                        <div class="screenshot-meta">
                            <div><span class="viewport-badge">${screenshot.viewport}</span><span class="test-type-badge toolbar-badge">Toolbar</span></div>
                            <div class="timestamp">${new Date(screenshot.timestamp).toLocaleString()}</div>
                            <div>Size: ${(screenshot.size / 1024).toFixed(1)} KB</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    </div>
</body>
</html>`;

  fs.writeFileSync(REPORT_FILE, html);
}

// Main execution
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllVisualTests().catch(error => {
    console.error('❌ Comprehensive visual testing failed:', error);
    process.exit(1);
  });
}

export { runAllVisualTests };