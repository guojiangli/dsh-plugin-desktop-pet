const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160">
  <rect x="29" y="39" width="102" height="92" rx="32" fill="#fff" stroke="#25272a" stroke-width="7"/>
  <path d="M43 47 33 22l31 19M117 47l10-25-31 19" fill="#79d6c4" stroke="#25272a" stroke-width="7" stroke-linejoin="round"/>
  <circle cx="62" cy="78" r="8" fill="#25272a"/><circle cx="99" cy="78" r="8" fill="#25272a"/>
  <path d="M70 99c6 7 14 7 21 0" fill="none" stroke="#25272a" stroke-width="6" stroke-linecap="round"/>
  <path d="M45 113c-12 4-18 12-17 23M115 113c12 4 18 12 17 23" fill="none" stroke="#25272a" stroke-width="7" stroke-linecap="round"/>
  <circle cx="128" cy="58" r="13" fill="#f7c85e" stroke="#25272a" stroke-width="6"/>
</svg>`

export const DEFAULT_IMAGE = `data:image/svg+xml,${encodeURIComponent(svg)}`
