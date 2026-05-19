// prototype — multi-page clickable HTML mockup.
// Bending surfaces: pages.json (nav structure), copy/<slug>.md (page content),
// theme.css (--accent). Routing is hash-based, single-page-app style — no
// build step, no router library, no server.

(async function () {
  const config = await fetch('pages.json').then((r) => r.json());

  document.title = config.title || 'Prototype';
  document.getElementById('brand').textContent = config.title || 'Prototype';

  const nav = document.getElementById('nav');
  for (const page of config.pages || []) {
    const a = document.createElement('a');
    a.href = '#' + page.slug;
    a.textContent = page.label;
    nav.appendChild(a);
  }

  window.addEventListener('hashchange', renderPage);
  renderPage();

  async function renderPage() {
    const first = (config.pages || [])[0];
    if (!first) return;

    const slug = (location.hash || '#' + first.slug).slice(1);
    nav.querySelectorAll('a').forEach((a) => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + slug);
    });

    const found = (config.pages || []).find((p) => p.slug === slug);
    const content = document.getElementById('page-content');
    if (!found) {
      content.innerHTML = '<p class="empty">Page not found.</p>';
      return;
    }

    try {
      const md = await fetch(`copy/${slug}.md`).then((r) => {
        if (!r.ok) throw new Error('not found');
        return r.text();
      });
      content.innerHTML = renderMarkdown(md);
      window.scrollTo({ top: 0, behavior: 'instant' });
    } catch (_) {
      content.innerHTML = `<p class="empty">Could not load copy/${slug}.md</p>`;
    }
  }

  // Tiny markdown renderer — paragraphs, # / ## headings, - bullets,
  // **bold**, *italic*, `code`. Author-controlled content; no untrusted input.
  function renderMarkdown(text) {
    const blocks = text.trim().split(/\n\s*\n/);
    return blocks
      .map((block) => {
        const s = block.trim();
        if (s.startsWith('## ')) return `<h3>${inline(s.slice(3))}</h3>`;
        if (s.startsWith('# ')) return `<h2>${inline(s.slice(2))}</h2>`;
        if (/^[-*]\s/.test(s)) {
          const items = s
            .split('\n')
            .map((line) => line.replace(/^[-*]\s+/, '').trim())
            .filter(Boolean);
          return '<ul>' + items.map((i) => `<li>${inline(i)}</li>`).join('') + '</ul>';
        }
        return `<p>${inline(s.replace(/\n/g, '<br>'))}</p>`;
      })
      .join('');
  }
  function inline(s) {
    return s
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code>$1</code>');
  }
})();
