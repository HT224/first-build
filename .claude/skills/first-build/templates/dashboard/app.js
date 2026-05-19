// dashboard — config-driven Chart.js visualization over a hardcoded data.json.
// Bending surfaces:
//   data.json         — one of three shapes (time-series, categorical-bar, two-column-table)
//   chart-config.json — type, title, axis labels, showTable
//   narrative.md      — markdown copy above the chart
//   theme.css         — single --accent variable
// Three example data shapes live in examples/<shape>/ for reference.

(async function () {
  const [dataRaw, chartConfigRaw, narrativeRaw] = await Promise.all([
    fetch('data.json').then((r) => r.text()),
    fetch('chart-config.json').then((r) => r.text()),
    fetch('narrative.md').then((r) => r.text()),
  ]);

  const data = JSON.parse(dataRaw);
  const chartConfig = JSON.parse(chartConfigRaw);

  document.title = chartConfig.title || 'Dashboard';
  document.getElementById('page-title').textContent = chartConfig.title || 'Dashboard';
  document.getElementById('narrative').innerHTML = renderMarkdown(narrativeRaw);

  if (data.shape === 'two-column-table') {
    hide('chart-card');
    renderTwoColumnTable(data);
  } else {
    renderChart(data, chartConfig);
    if (chartConfig.showTable === false) {
      hide('table-card');
    } else {
      renderSeriesTable(data);
    }
  }

  function hide(id) {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  }

  function getAccent() {
    return getComputedStyle(document.documentElement)
      .getPropertyValue('--accent')
      .trim() || '#2563eb';
  }

  function withAlpha(hex, alpha) {
    // hex like #2563eb → rgba(37, 99, 235, alpha)
    const h = hex.replace('#', '');
    const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
    const r = parseInt(full.slice(0, 2), 16);
    const g = parseInt(full.slice(2, 4), 16);
    const b = parseInt(full.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  function renderChart(data, cfg) {
    const accent = getAccent();
    const ctx = document.getElementById('chart').getContext('2d');
    new Chart(ctx, {
      type: cfg.type || 'line',
      data: {
        labels: data.labels,
        datasets: (data.datasets || []).map((ds, i) => ({
          ...ds,
          borderColor: accent,
          backgroundColor: cfg.type === 'line' ? withAlpha(accent, 0.18) : accent,
          borderWidth: 2,
          fill: cfg.type === 'line',
          tension: 0.3,
        })),
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: { display: false },
          legend: { display: (data.datasets || []).length > 1 },
        },
        scales: {
          x: {
            title: { display: !!cfg.xAxisLabel, text: cfg.xAxisLabel },
          },
          y: {
            beginAtZero: true,
            title: { display: !!cfg.yAxisLabel, text: cfg.yAxisLabel },
          },
        },
      },
    });
  }

  function renderSeriesTable(data) {
    const thead = document.querySelector('#data-table thead');
    const tbody = document.querySelector('#data-table tbody');
    thead.innerHTML = '';
    tbody.innerHTML = '';

    const trh = document.createElement('tr');
    const thLabel = document.createElement('th');
    thLabel.textContent = '';
    trh.appendChild(thLabel);
    for (const label of data.labels || []) {
      const th = document.createElement('th');
      th.textContent = label;
      trh.appendChild(th);
    }
    thead.appendChild(trh);

    for (const ds of data.datasets || []) {
      const tr = document.createElement('tr');
      const td = document.createElement('td');
      td.textContent = ds.label;
      tr.appendChild(td);
      for (const v of ds.data) {
        const cell = document.createElement('td');
        cell.className = 'number';
        cell.textContent = v;
        tr.appendChild(cell);
      }
      tbody.appendChild(tr);
    }
  }

  function renderTwoColumnTable(data) {
    const thead = document.querySelector('#data-table thead');
    const tbody = document.querySelector('#data-table tbody');
    thead.innerHTML = '';
    tbody.innerHTML = '';

    const trh = document.createElement('tr');
    for (const c of data.columns || []) {
      const th = document.createElement('th');
      th.textContent = c;
      trh.appendChild(th);
    }
    thead.appendChild(trh);

    for (const row of data.rows || []) {
      const tr = document.createElement('tr');
      row.forEach((v, i) => {
        const td = document.createElement('td');
        td.textContent = v;
        if (i > 0 && typeof v === 'number') td.className = 'number';
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    }
  }

  // Tiny markdown renderer — paragraphs, # / ## headings, **bold**, *italic*, `code`.
  // Author-controlled content; no untrusted input.
  function renderMarkdown(text) {
    const blocks = text.trim().split(/\n\s*\n/);
    return blocks.map((block) => {
      const s = block.trim();
      if (s.startsWith('## ')) return `<h3>${inline(s.slice(3))}</h3>`;
      if (s.startsWith('# ')) return `<h2>${inline(s.slice(2))}</h2>`;
      return `<p>${inline(s.replace(/\n/g, '<br>'))}</p>`;
    }).join('');
  }
  function inline(s) {
    return s
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code>$1</code>');
  }
})();
