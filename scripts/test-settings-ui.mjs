import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFile } from 'node:fs/promises';

const source = await readFile(new URL('../web/app.js', import.meta.url), 'utf8');
const html = await readFile(new URL('../web/index.html', import.meta.url), 'utf8');
const css = await readFile(new URL('../web/styles.css', import.meta.url), 'utf8');
const elements = new Map();
const backendInputs = ['drm', 'auto', 'wayland'].map(value => ({ value, checked: value === 'drm' }));
const requests = [];
const plain = value => JSON.parse(JSON.stringify(value));

function element(id = '') {
  return {
    id,
    value: '',
    checked: false,
    hidden: false,
    open: false,
    tabIndex: 0,
    dataset: {},
    style: {},
    textContent: '',
    children: [],
    classList: { add() {}, remove() {}, toggle() {} },
    setAttribute() {},
    addEventListener() {},
    focus() {},
    close() { this.open = false; },
    showModal() { this.open = true; },
    replaceChildren(...children) { this.children = children; }
  };
}

const document = {
  documentElement: { lang: 'zh-CN' },
  activeElement: null,
  addEventListener() {},
  createElement: tag => element(tag),
  createTextNode: value => ({ textContent: value }),
  getElementById(id) {
    if (id === 'dshInstallButton') return null;
    if (!elements.has(id)) elements.set(id, element(id));
    return elements.get(id);
  },
  querySelectorAll(selector) {
    if (selector === 'input[name="rendererBackend"]') return backendInputs;
    return [];
  }
};

const context = vm.createContext({
  console,
  document,
  navigator: { language: 'zh-CN', languages: ['zh-CN'] },
  localStorage: { getItem() { return null; }, setItem() {} },
  fetch: async (url, options = {}) => {
    requests.push({ url, options });
    if (url.endsWith('/config')) return { ok: true, json: async () => JSON.parse(options.body) };
    return { ok: true, json: async () => ({ ok: true }) };
  },
  setTimeout() { return 1; },
  clearTimeout() {},
  setInterval() { return 1; },
  requestAnimationFrame(callback) { callback(); },
  FormData: class {}
});

vm.runInContext(source, context);
vm.runInContext(`
  renderStatus = () => {};
  loadDSHIntegration = async () => {};
  refreshStatus = async () => {};
  loadMedia = async () => {};
`, context);

const config = {
  default_mode: 'dashboard',
  auto_start_display: true,
  volume: 70,
  media_roots: ['/DATA'],
  media: { single_video_end: 'repeat', collection_end: 'repeat', slideshow_interval_seconds: 8 },
  renderer: { backend: 'drm', resolution: 'auto', audio_device: 'auto' },
  dashboard: { title: 'Zima Display', language: 'zh-CN', layout: 'auto', font_scale: 1, refresh_interval_ms: 1000 },
  canvas: { background_type: 'solid', background_color: '#000000', secondary_color: '#000000', widgets: [] },
  automation: { enabled: true }
};

Object.assign(document.getElementById('defaultModeInput'), { value: 'clock' });
Object.assign(document.getElementById('resolutionInput'), { value: '1920x1080' });
Object.assign(document.getElementById('audioDeviceInput'), { value: ' auto ' });
Object.assign(document.getElementById('dashboardLanguageInput'), { value: 'en-US' });
Object.assign(document.getElementById('dashboardTitleInput'), { value: ' Operations ' });
Object.assign(document.getElementById('dashboardLayoutInput'), { value: 'large' });
Object.assign(document.getElementById('fontScaleInput'), { value: '135' });
Object.assign(document.getElementById('mediaRootsInput'), { value: '/DATA/Media\n/mnt/archive\n' });
Object.assign(document.getElementById('singleVideoEndInput'), { value: 'stop' });
Object.assign(document.getElementById('collectionEndInput'), { value: 'stop' });
Object.assign(document.getElementById('slideshowIntervalInput'), { value: '15' });
Object.assign(document.getElementById('autoStartInput'), { checked: false });
Object.assign(document.getElementById('volumeRange'), { value: '55' });
Object.assign(document.getElementById('settingsDialog'), { open: true });

vm.runInContext(`state.status = { config: ${JSON.stringify(config)}, metrics: { display: { connected: true, connector: 'card0-HDMI-A-1', modes: ['1920x1080', '1280x720', '1920x1080'] } }, player: { mode: 'dashboard', renderer_ready: true } };`, context);
vm.runInContext(`state.settingsInitialSnapshot = settingsFingerprint(state.status.config); updateSettingsDirty();`, context);
assert.equal(document.getElementById('applySettingsButton').disabled, false, 'save must enable when settings differ from the stored config');

const draft = vm.runInContext('settingsConfigDraft()', context);
assert.equal(draft.default_mode, 'clock');
assert.equal(draft.auto_start_display, false);
assert.deepEqual(plain(draft.renderer), { backend: 'drm', resolution: '1920x1080', audio_device: 'auto' });
assert.deepEqual(plain(draft.media_roots), ['/DATA/Media', '/mnt/archive']);
assert.deepEqual(plain(draft.media), { single_video_end: 'stop', collection_end: 'stop', slideshow_interval_seconds: 15 });
assert.deepEqual(plain(draft.dashboard), config.dashboard, 'startup settings must not own dashboard appearance');

document.getElementById('settingsDialog').open = false;
vm.runInContext('populateResolutionOptions()', context);
assert.deepEqual(document.getElementById('resolutionInput').children.map(option => option.value), ['auto', '1920x1080', '1280x720']);

document.getElementById('settingsDialog').open = true;
document.getElementById('resolutionInput').value = '1920x1080';
await vm.runInContext(`saveSettings({ preventDefault() {} })`, context);
const actionBodies = requests.filter(request => request.url.endsWith('/action')).map(request => JSON.parse(request.options.body));
assert.deepEqual(actionBodies, [], 'saving settings must not switch or restart the current display');

await vm.runInContext(`state.dashboardDraft = cloneDashboard(state.status.config.dashboard); readDashboardControls(); saveDashboard(false);`, context);
const dashboardSave = requests.filter(request => request.url.endsWith('/config')).at(-1);
assert.deepEqual(JSON.parse(dashboardSave.options.body).dashboard, { title: 'Operations', language: 'en-US', layout: 'large', font_scale: 1.35, refresh_interval_ms: 1000 });
await vm.runInContext(`saveDashboard(true);`, context);
assert.deepEqual(JSON.parse(requests.filter(request => request.url.endsWith('/action')).at(-1).options.body), { action: 'mode', mode: 'dashboard' });

for (const required of [
  'class="settings-flow"',
  'class="settings-disclosure"',
  'name="rendererBackend" value="drm"',
  'id="resolutionInput"',
  'id="remoteSourcesList"',
  'id="singleVideoEndInput"',
  'id="collectionEndInput"',
  'id="slideshowIntervalInput"',
  'id="addRemoteSourceButton"',
  'data-i18n="settings.maintenanceHeading"',
  'data-i18n="settings.applyDisplay"'
]) {
  assert.ok(html.includes(required), `settings markup is missing ${required}`);
}
assert.ok(!html.includes('data-settings-pane='), 'settings must not require category tabs');
assert.ok(!html.includes('id="settingsDashboardPanel"'), 'dashboard appearance must not live inside settings');
assert.ok(html.includes('data-i18n="settings.troubleshootingHeading">显示输出'), 'display settings must use a clear noun label instead of a support question');
assert.ok(!html.includes('data-apply-display='), 'settings save must not imply immediate display switching');
assert.equal((html.match(/type="submit"/g) || []).length, 1, 'settings must have one primary submit action');
assert.ok(css.includes('@media (max-width: 720px)'), 'settings UI must define a mobile layout');

console.log('Verified startup-only settings, non-disruptive save, clear display-output labeling, and remote-source/maintenance placement.');
