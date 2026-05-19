// internal-tool — config-driven CRUD over localStorage.
// Bending surfaces: fields.json (schema), copy.json (UI strings), theme.css (--accent).
// Storage is browser-local: nothing leaves the user's machine.

(async function () {
  const STORAGE_KEY = 'first-build:entries';

  const [fields, copy] = await Promise.all([
    fetch('fields.json').then((r) => r.json()),
    fetch('copy.json').then((r) => r.json()),
  ]);

  document.title = copy.title;
  document.getElementById('page-title').textContent = copy.title;
  document.getElementById('page-tagline').textContent = copy.tagline || '';
  document.getElementById('empty-state').textContent =
    copy.emptyState || 'No entries yet.';

  renderForm();
  renderTable();

  function renderForm() {
    const form = document.getElementById('entry-form');
    form.innerHTML = '';

    for (const field of fields) {
      const wrap = document.createElement('div');
      wrap.className = 'field';

      const label = document.createElement('label');
      label.htmlFor = `field-${field.name}`;
      label.textContent = field.label + (field.required ? ' *' : '');
      wrap.appendChild(label);

      let input;
      if (field.type === 'textarea') {
        input = document.createElement('textarea');
      } else if (field.type === 'select') {
        input = document.createElement('select');
        for (const opt of field.options || []) {
          const o = document.createElement('option');
          o.value = opt;
          o.textContent = opt;
          input.appendChild(o);
        }
      } else {
        input = document.createElement('input');
        input.type = field.type || 'text';
      }
      input.id = `field-${field.name}`;
      input.name = field.name;
      if (field.required) input.required = true;
      wrap.appendChild(input);
      form.appendChild(wrap);
    }

    const submit = document.createElement('button');
    submit.type = 'submit';
    submit.textContent = copy.addButton || 'Add';
    form.appendChild(submit);

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;

      const data = new FormData(form);
      const entry = { id: Date.now() };
      for (const field of fields) {
        entry[field.name] = data.get(field.name);
      }
      const all = load();
      all.push(entry);
      save(all);
      form.reset();
      renderTable();
    });
  }

  function renderTable() {
    const entries = load();
    const table = document.getElementById('entries-table');
    const thead = table.querySelector('thead');
    const tbody = table.querySelector('tbody');
    const empty = document.getElementById('empty-state');

    thead.innerHTML = '';
    tbody.innerHTML = '';

    if (entries.length === 0) {
      table.style.display = 'none';
      empty.style.display = 'block';
      return;
    }
    table.style.display = 'table';
    empty.style.display = 'none';

    const trh = document.createElement('tr');
    for (const field of fields) {
      const th = document.createElement('th');
      th.textContent = field.label;
      trh.appendChild(th);
    }
    trh.appendChild(document.createElement('th'));
    thead.appendChild(trh);

    for (const entry of entries) {
      const tr = document.createElement('tr');
      for (const field of fields) {
        const td = document.createElement('td');
        td.textContent = entry[field.name] || '';
        tr.appendChild(td);
      }
      const tdDel = document.createElement('td');
      tdDel.className = 'actions';
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'delete-btn';
      btn.textContent = copy.deleteButton || 'Delete';
      btn.addEventListener('click', () => {
        if (confirm(copy.deleteConfirm || 'Delete this entry?')) {
          save(load().filter((e) => e.id !== entry.id));
          renderTable();
        }
      });
      tdDel.appendChild(btn);
      tr.appendChild(tdDel);
      tbody.appendChild(tr);
    }
  }

  function load() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch (_) {
      return [];
    }
  }

  function save(entries) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }
})();
