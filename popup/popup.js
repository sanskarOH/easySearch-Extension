// popup/popup.js

// ----- DOM elements -----
const qEl = document.getElementById('query');
const ftEl = document.getElementById('filetype');
const exactEl = document.getElementById('exact');
const previewEl = document.getElementById('preview');
const searchBtn = document.getElementById('searchBtn');
const clearBtn = document.getElementById('clearBtn');

const MAX_PREVIEW_LEN = 300;

// ----- Utility -----
function sanitizeInput(str) {
  if (!str) return '';
  return String(str)
    .replace(/[\r\n]+/g, ' ')
    .replace(/[<>]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, MAX_PREVIEW_LEN);
}

// ----- Update preview text -----
function updatePreview() {
  const query = sanitizeInput(qEl.value);
  const filetype = ftEl.value;
  const exact = exactEl.checked;

  if (!query) {
    previewEl.textContent = 'Preview: —';
    searchBtn.disabled = true;
    return;
  }

  const qPart = exact && /\s/.test(query) ? `"${query}"` : query;
  const ftPart = filetype ? ` filetype:${filetype}` : '';
  previewEl.textContent = `Preview: ${qPart}${ftPart}`;
  searchBtn.disabled = false;
}

// ----- Collect options for background -----
function collectOptions() {
  return {
    query: qEl.value || '',
    filetype: ftEl.value || '',
    exact: exactEl.checked
    // site/inTitle/inUrl/exclude can be added here later
  };
}

// ----- Search button click -----
searchBtn.addEventListener('click', (e) => {
  e.preventDefault();
  const options = collectOptions();
  searchBtn.disabled = true;

  chrome.runtime.sendMessage({ action: 'generateAndOpen', options }, (resp) => {
    searchBtn.disabled = false;
    if (!resp) {
      alert('No response from background.');
      return;
    }

    if (resp.ok) {
      // Tab opened successfully, close popup
      window.close();
    } else {
      alert('Blocked: ' + (resp.reason || 'unknown'));
    }
  });
});

// ----- Clear button -----
clearBtn.addEventListener('click', (e) => {
  e.preventDefault();
  qEl.value = '';
  ftEl.value = '';
  exactEl.checked = false;
  updatePreview();
});

// ----- Input events -----
qEl.addEventListener('input', updatePreview);
ftEl.addEventListener('change', updatePreview);
exactEl.addEventListener('change', updatePreview);

// ----- Initialize: load last query from storage -----
chrome.storage.local.get(['recent'], (res) => {
  const recent = (res.recent && res.recent[0] && res.recent[0].q) || '';
  if (recent) {
    qEl.value = recent.slice(0, 200); // limit length
  }
  updatePreview();
});
