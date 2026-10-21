import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const html = await readFile(new URL('../web/index.html', import.meta.url), 'utf8');
const source = await readFile(new URL('../web/app.js', import.meta.url), 'utf8');

const choices = Array.from(html.matchAll(/data-workspace-choice="([^"]+)"/g), match => match[1]);
assert.deepEqual(choices, ['dashboard', 'canvas', 'media'], 'home must expose exactly three mutually exclusive content paths');

for (const workspace of ['dashboard', 'canvas', 'media']) {
  assert.ok(html.includes(`data-workspace-panel="${workspace}"`), `missing ${workspace} workspace`);
}

assert.match(html, /id="canvasWorkspace"[^>]*hidden/, 'canvas tools must stay hidden until selected');
assert.match(html, /id="mediaWorkspace"[^>]*hidden/, 'media tools must stay hidden until selected');
assert.equal((html.match(/data-canvas-template=/g) || []).length, 3, 'canvas must offer three visible starting templates');
assert.ok(html.includes('<details id="currentOutputDetails"'), 'live output must be an on-demand disclosure');
const outputDetails = html.slice(html.indexOf('<details id="currentOutputDetails"'), html.indexOf('</details>', html.indexOf('<details id="currentOutputDetails"')) + 10);
assert.ok(!outputDetails.includes('class="transport"'), 'live output must not contain media playback controls');
assert.ok(!outputDetails.includes('class="metrics-grid"'), 'live output must not contain system metrics');
assert.ok(!outputDetails.includes('data-mode="black"') && !outputDetails.includes('data-mode="terminal"'), 'live output must not contain maintenance actions');
assert.ok(outputDetails.includes('id="liveMediaPreview"'), 'live output must have a current-frame target for media playback');
assert.ok(html.indexOf('data-mode="black"') > html.indexOf('id="settingsDialog"'), 'black standby must live in settings');
assert.ok(html.indexOf('data-mode="terminal"') > html.indexOf('id="settingsDialog"'), 'terminal recovery must live in settings');
assert.ok(html.indexOf('class="transport"') > html.indexOf('id="mediaWorkspace"') && html.indexOf('class="transport"') < html.indexOf('id="currentOutputDetails"'), 'playback controls must live in the media workspace');
assert.ok(html.includes('id="canvasWidgetSourceInput"'), 'metric widgets must expose a data-source selector');
assert.ok(html.includes('id="dashboardEditorPanel"'), 'dashboard appearance editor must live in the ready-made workspace');
assert.ok(html.indexOf('id="dashboardEditorPanel"') < html.indexOf('id="settingsDialog"'), 'dashboard editor must stay on the main page, not in settings');
assert.ok(html.includes('id="appVersion"'), 'settings must expose installed version information');
assert.ok(html.includes('https://github.com/LinkLeong/zima-display'), 'settings must link to the GitHub project');

for (const contract of [
  'function setWorkspace(',
  "state.workspaceSelectedManually = true",
  "$$('[data-workspace-panel]')",
  "if (!$('currentOutputDetails')?.open) return",
  "mediaPreview.src = `${API}/preview/frame?t=${Date.now()}`",
  'async function saveDashboard(apply = false)',
  "const health = await request('/health')"
]) {
  assert.ok(source.includes(contract), `home interaction contract is missing: ${contract}`);
}

console.log('Verified guided content selection, single-purpose live preview, separated media/maintenance controls, canvas sources and product info.');
