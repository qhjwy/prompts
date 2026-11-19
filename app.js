const MANIFEST_URL = 'prompts.json';
const PROMPT_DIR = 'prompts/';

const sectionsEl = document.getElementById('sections');
const dialog = document.getElementById('dialog');
const dialogTitle = document.getElementById('dialog-title');
const dialogBody = document.getElementById('dialog-body');

let sections = [];
let flatPrompts = [];
let currentIndex = 0;

init();

async function init() {
  try {
    const files = await fetchJSON(MANIFEST_URL);
    if (!Array.isArray(files)) throw new Error('prompts.json must be an array of filenames or objects');

    sections = (
      await Promise.all(
        files.map(async (item) => {
          // Support both old string format and new object format
          const file = typeof item === 'string' ? item : item.file;
          const tagColor = typeof item === 'string' ? null : item.tagColor;

          if (!file) return null;

          const md = await fetchText(PROMPT_DIR + file);
          const fallback = file.replace(/\.md$/i, '');
          return parseSection(md, fallback, { tagColor });
        })
      )
    ).filter((s) => s && s.prompts.length > 0);

    render();
  } catch (err) {
    showError(err);
  }
}

function parseSection(md, fallbackTitle, colors = {}) {
  const lines = md.replace(/\r\n/g, '\n').split('\n');
  let title = fallbackTitle;
  const prompts = [];
  let current = null;
  let inCodeBlock = false;

  for (const line of lines) {
    if (line.trim().startsWith('```')) {
      inCodeBlock = !inCodeBlock;
    }

    if (!inCodeBlock) {
      const h1 = line.match(/^#\s+(.*)$/);
      if (h1) { title = h1[1].trim() || title; continue; }

      const h2 = line.match(/^##\s+(.*)$/);
      if (h2) {
        if (current) prompts.push(current);
        let rawTitle = h2[1].trim();
        const isStarred = rawTitle.includes('⭐') || rawTitle.toLowerCase().includes('[star]');
        const cleanTitle = rawTitle.replace('⭐', '').replace(/\[star\]/ig, '').trim();
        current = { title: cleanTitle, isStarred, lines: [] };
        continue;
      }
    }

    if (current) current.lines.push(line);
  }
  if (current) prompts.push(current);

  return {
    title,
    tagColor: colors.tagColor,
    prompts: prompts.map((p) => {
      let text = p.lines.join('\n').trim();
      if (text.startsWith('```') && text.endsWith('```')) {
        const tLines = text.split('\n');
        if (tLines.length >= 2) {
          tLines.shift();
          tLines.pop();
          text = tLines.join('\n').trim();
        }
      }
      return { title: p.title, text, isStarred: p.isStarred };
    }).filter((p) => p.title && p.text)
  };
}

async function fetchJSON(url) {
  const res = await fetch(url, { cache: 'no-cache' });
  if (!res.ok) throw new Error(`Could not load ${url}`);
  return res.json();
}

async function fetchText(url) {
  const res = await fetch(url, { cache: 'no-cache' });
  if (!res.ok) throw new Error(`Could not load ${url}`);
  return res.text();
}

function render() {
  sectionsEl.replaceChildren();
  flatPrompts = [];
  const frag = document.createDocumentFragment();

  for (const section of sections) {
    section.prompts.forEach((prompt, i) => {
      const index = flatPrompts.length;
      // Pass the color to buildCard for the first prompt of the section
      frag.append(buildCard(prompt, index, i === 0 ? section.title : '', section.tagColor));
      flatPrompts.push(prompt);
    });
  }

  sectionsEl.append(frag);
}

function buildCard(prompt, index, sectionTitle = '', tagColor = null) {
  const card = document.createElement('li');
  card.className = 'card';
  card.dataset.index = String(index);
  card.tabIndex = 0;
  card.setAttribute('role', 'button');
  card.setAttribute('aria-label', `Copy prompt: ${prompt.title}`);

  if (sectionTitle) {
    card.classList.add('card-section-start');
    card.dataset.sectionTitle = sectionTitle;
    // Apply the custom color via a CSS variable
    if (tagColor) card.style.setProperty('--tag-color', tagColor);
  }

  // Top Row (Title + Copy Hint)
  const topRow = document.createElement('div');
  topRow.className = 'card-top';

  const title = document.createElement('span');
  title.className = 'card-title';
  title.textContent = prompt.title;

  const copyHint = document.createElement('span');
  copyHint.className = 'card-copy-hint';
  copyHint.innerHTML = `
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
    </svg>
    Copy
  `;

  topRow.append(title, copyHint);

  // Bottom Row (Eye Icon + Star Icon)
  const bottomRow = document.createElement('div');
  bottomRow.className = 'card-bottom';

  const preview = document.createElement('button');
  preview.type = 'button';
  preview.className = 'card-preview';
  preview.setAttribute('aria-label', `See prompt: ${prompt.title}`);
  preview.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>
  `;

  const star = document.createElement('div');
  star.className = 'card-star' + (prompt.isStarred ? ' is-starred' : '');
  star.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
    </svg>
  `;

  bottomRow.append(preview, star);
  card.append(topRow, bottomRow);
  return card;
}

function showError(err) {
  sectionsEl.replaceChildren();
  const li = document.createElement('li');
  li.className = 'prompts-error';
  li.textContent = `${err.message}. If you opened this file directly, serve it over HTTP instead (e.g. python3 -m http.server).`;
  sectionsEl.append(li);
}

async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {}
  }
  const area = document.createElement('textarea');
  area.value = text;
  area.setAttribute('readonly', '');
  area.style.position = 'fixed';
  area.style.opacity = '0';
  document.body.append(area);
  area.select();
  let ok = false;
  try { ok = document.execCommand('copy'); } catch {}
  area.remove();
  return ok;
}

function openDialog(index) {
  currentIndex = index;
  dialogTitle.textContent = flatPrompts[index].title;
  dialogBody.textContent = flatPrompts[index].text;
  dialogBody.scrollTop = 0;
  if (!dialog.open) dialog.showModal();
}

async function handleCopy(card, index) {
  const ok = await copyText(flatPrompts[index].text);
  if (!ok) { openDialog(index); return; }

  const hint = card.querySelector('.card-copy-hint');
  const originalHTML = hint.innerHTML;
  card.classList.add('is-copied');
  hint.innerHTML = `
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1a7f37" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
    <span style="color: #1a7f37;">Copied</span>
  `;
  clearTimeout(card._reset);
  card._reset = setTimeout(() => {
    hint.innerHTML = originalHTML;
    card.classList.remove('is-copied');
  }, 1400);
}

sectionsEl.addEventListener('click', (event) => {
  const card = event.target.closest('.card');
  if (!card) return;
  const index = Number(card.dataset.index);

  if (event.target.closest('.card-preview')) {
    openDialog(index);
    return;
  }

  handleCopy(card, index);
});

sectionsEl.addEventListener('keydown', (event) => {
  if (event.key !== 'Enter' && event.key !== ' ') return;
  const card = event.target.closest('.card');
  if (!card) return;
  if (event.target.closest('.card-preview')) return;

  event.preventDefault();
  handleCopy(card, Number(card.dataset.index));
});

dialog.addEventListener('click', (event) => {
  if (event.target === dialog) dialog.close();
});
