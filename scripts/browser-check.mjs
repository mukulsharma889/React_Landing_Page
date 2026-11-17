import { spawn } from 'node:child_process';
import { writeFile } from 'node:fs/promises';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const port = 9223;
const baseUrl = `http://127.0.0.1:${port}`;
const profilePath = 'C:\\Users\\smuku\\OneDrive\\Desktop\\React_Landing_Page\\.chrome-cdp';
const chrome = spawn(chromePath, [
  '--headless=new',
  '--disable-gpu',
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${profilePath}`,
  'about:blank',
], { stdio: 'ignore', windowsHide: true });

async function waitForDebugger() {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    try {
      const response = await fetch(`${baseUrl}/json/version`);
      if (response.ok) return;
    } catch {
      // Chrome is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error('Chrome debugging endpoint did not start.');
}

class CdpClient {
  constructor(socketUrl) {
    this.socket = new WebSocket(socketUrl);
    this.nextId = 1;
    this.pending = new Map();
    this.socket.onmessage = ({ data }) => {
      const message = JSON.parse(data);
      if (!message.id || !this.pending.has(message.id)) return;
      const { resolve, reject } = this.pending.get(message.id);
      this.pending.delete(message.id);
      if (message.error) reject(new Error(message.error.message));
      else resolve(message.result);
    };
  }

  async open() {
    await new Promise((resolve, reject) => {
      this.socket.onopen = resolve;
      this.socket.onerror = reject;
    });
  }

  send(method, params = {}) {
    const id = this.nextId;
    this.nextId += 1;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.socket.send(JSON.stringify({ id, method, params }));
    });
  }

  close() {
    this.socket.close();
  }
}

async function evaluate(client, expression) {
  const result = await client.send('Runtime.evaluate', {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });
  return result.result.value;
}

async function waitForPage(client) {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    const ready = await evaluate(client, 'document.readyState');
    if (ready === 'complete') return;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
}

async function capture(client, width, height, outputPath) {
  await client.send('Emulation.setDeviceMetricsOverride', {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: width < 600,
  });
  await client.send('Page.navigate', { url: 'http://127.0.0.1:4173/' });
  await waitForPage(client);
  await evaluate(client, 'window.scrollTo(0, 0)');
  const metrics = await evaluate(client, `({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
    scrollHeight: document.documentElement.scrollHeight,
  })`);
  const screenshot = await client.send('Page.captureScreenshot', {
    format: 'png',
    fromSurface: true,
    captureBeyondViewport: false,
  });
  await writeFile(outputPath, Buffer.from(screenshot.data, 'base64'));
  return metrics;
}

async function runInteractionCheck(client) {
  const invalid = await evaluate(client, `(async () => {
    const setValue = (id, value) => {
      const input = document.getElementById(id);
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
      setter.call(input, value);
      input.dispatchEvent(new Event('input', { bubbles: true }));
    };
    setValue('full-name', ' ');
    setValue('email', 'invalid');
    document.querySelector('button[type="submit"]').click();
    await new Promise((resolve) => setTimeout(resolve, 100));
    document.querySelector('form').requestSubmit();
    await new Promise((resolve) => setTimeout(resolve, 100));
    return {
      focus: document.activeElement.id,
      nameInvalid: document.getElementById('full-name').getAttribute('aria-invalid'),
      emailInvalid: document.getElementById('email').getAttribute('aria-invalid'),
    };
  })()`);

  const corrected = await evaluate(client, `(async () => {
    const setValue = (id, value) => {
      const input = document.getElementById(id);
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
      setter.call(input, value);
      input.dispatchEvent(new Event('input', { bubbles: true }));
    };
    setValue('full-name', '  Asha   Rao  ');
    setValue('email', ' ASHA@EXAMPLE.COM ');
    await new Promise((resolve) => setTimeout(resolve, 100));
    const errorsCleared = !document.querySelector('[id$="-error"]');
    document.querySelector('button[type="submit"]').click();
    await new Promise((resolve) => setTimeout(resolve, 100));
    return {
      errorsCleared,
      name: document.getElementById('full-name').value,
      email: document.getElementById('email').value,
      status: document.querySelector('[role="status"]').textContent,
      statusRegions: document.querySelectorAll('[role="status"]').length,
      localStorageEntries: localStorage.length,
      sessionStorageEntries: sessionStorage.length,
    };
  })()`);

  return { invalid, corrected };
}

try {
  await waitForDebugger();
  const targets = await (await fetch(`${baseUrl}/json/list`)).json();
  const pageTarget = targets.find((target) => target.type === 'page');
  const client = new CdpClient(pageTarget.webSocketDebuggerUrl);
  await client.open();
  await client.send('Page.enable');
  await client.send('Runtime.enable');
  const version = await client.send('Browser.getVersion');
  const desktop = await capture(client, 1440, 2077, 'desktop-finished.png');
  const mobile = await capture(client, 375, 2788, 'mobile-finished.png');
  const interaction = await runInteractionCheck(client);
  const tablet = await capture(client, 768, 1800, 'tablet-finished.png');
  const narrow = await capture(client, 320, 1000, 'narrow-finished.png');
  console.log(JSON.stringify({ browser: version.product, desktop, tablet, mobile, narrow, interaction }, null, 2));
  client.close();
} finally {
  chrome.kill();
}
