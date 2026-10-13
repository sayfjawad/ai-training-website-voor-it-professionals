// Self-contained admin page ("who registered / who paid"). Served at /admin.
// Prompts for the ADMIN_TOKEN (kept in localStorage) and calls the protected
// /api/admin/registrations endpoint. No build step / framework needed.

export function adminPageHtml(): string {
  return `<!doctype html>
<html lang="nl">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<meta name="robots" content="noindex"/>
<title>AI Governance — Aanmeldingen</title>
<style>
  :root { color-scheme: light dark; }
  body { font-family: system-ui, -apple-system, Arial, sans-serif; margin: 0; background: #f8fafc; color: #1e293b; }
  header { background: #059669; color: #fff; padding: 16px 24px; }
  header h1 { margin: 0; font-size: 18px; }
  main { padding: 24px; max-width: 1100px; margin: 0 auto; }
  .bar { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; margin-bottom: 20px; }
  input { padding: 8px 10px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; min-width: 240px; }
  button { padding: 8px 16px; border: 0; border-radius: 8px; background: #10b981; color: #fff; font-weight: 600; cursor: pointer; }
  button.secondary { background: #e2e8f0; color: #1e293b; }
  .cards { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 20px; }
  .card { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px 18px; min-width: 130px; }
  .card .n { font-size: 26px; font-weight: 800; }
  .card .l { font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: .05em; }
  table { width: 100%; border-collapse: collapse; background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; font-size: 14px; }
  th, td { text-align: left; padding: 10px 12px; border-bottom: 1px solid #eef2f6; }
  th { background: #f1f5f9; font-size: 12px; text-transform: uppercase; color: #475569; }
  .badge { padding: 2px 10px; border-radius: 999px; font-size: 12px; font-weight: 700; }
  .paid { background: #dcfce7; color: #166534; }
  .pending { background: #fef9c3; color: #854d0e; }
  .expired { background: #fee2e2; color: #991b1b; }
  .error { background: #fee2e2; color: #991b1b; }
  .muted { color: #94a3b8; }
  .err { color: #dc2626; font-weight: 600; }
  @media (prefers-color-scheme: dark) {
    body { background: #0f172a; color: #e2e8f0; }
    .card, table { background: #1e293b; border-color: #334155; }
    th { background: #0f172a; color: #94a3b8; }
    td { border-color: #334155; }
    input { background: #0f172a; color: #e2e8f0; border-color: #334155; }
  }
</style>
</head>
<body>
<header><h1>AI Governance — Aanmeldingen & Betalingen</h1></header>
<main>
  <div class="bar">
    <input id="token" type="password" placeholder="Admin token"/>
    <button onclick="load()">Laden</button>
    <button class="secondary" onclick="recheck()">Hercontroleer betalingen</button>
    <span id="msg" class="muted"></span>
  </div>
  <div id="cards" class="cards"></div>
  <table id="tbl" style="display:none">
    <thead><tr>
      <th>Datum</th><th>Naam</th><th>E-mail</th><th>Organisatie</th>
      <th>Status</th><th>Betaald op</th><th>Ref</th>
    </tr></thead>
    <tbody id="rows"></tbody>
  </table>
</main>
<script>
  const tokenEl = document.getElementById('token');
  tokenEl.value = localStorage.getItem('adminToken') || '';
  const msg = document.getElementById('msg');
  const fmtDate = s => s ? new Date(s).toLocaleString('nl-NL') : '—';
  const euro = c => '€' + Math.round((c||0)/100);

  async function api(path, method='GET') {
    const token = tokenEl.value.trim();
    localStorage.setItem('adminToken', token);
    const r = await fetch(path, { method, headers: { 'Authorization': 'Bearer ' + token } });
    if (!r.ok) throw new Error((await r.json().catch(()=>({}))).error || ('HTTP ' + r.status));
    return r.json();
  }

  async function load() {
    msg.textContent = 'Laden...'; msg.className = 'muted';
    try {
      const data = await api('/api/admin/registrations');
      render(data);
      msg.textContent = '';
    } catch (e) { msg.textContent = e.message; msg.className = 'err'; }
  }

  async function recheck() {
    msg.textContent = 'Hercontroleren bij Tikkie...'; msg.className = 'muted';
    try { await api('/api/admin/recheck', 'POST'); await load(); }
    catch (e) { msg.textContent = e.message; msg.className = 'err'; }
  }

  function render(data) {
    const s = data.summary;
    document.getElementById('cards').innerHTML =
      card(s.total, 'Aanmeldingen') + card(s.paid, 'Betaald') +
      card(s.pending, 'Openstaand') + card(euro(s.totalPaidInCents), 'Ontvangen');
    const rows = data.registrations.map(r => {
      const cls = r.paymentStatus;
      const label = { paid:'Betaald', pending:'Openstaand', expired:'Verlopen', error:'Fout' }[cls] || cls;
      const fb = r.usedFallbackLink ? ' <span class="muted" title="Gedeelde link — niet automatisch te koppelen">(gedeeld)</span>' : '';
      return '<tr><td>' + fmtDate(r.createdAt) + '</td><td>' + esc(r.firstName+' '+r.lastName) +
        '</td><td>' + esc(r.email) + '</td><td>' + esc(r.organization||'—') +
        '</td><td><span class="badge ' + cls + '">' + label + '</span>' + fb +
        '</td><td>' + fmtDate(r.paidAt) + '</td><td style="font-family:monospace">' + esc(r.id) + '</td></tr>';
    }).join('');
    document.getElementById('rows').innerHTML = rows;
    document.getElementById('tbl').style.display = data.registrations.length ? 'table' : 'none';
  }
  const card = (n,l) => '<div class="card"><div class="n">' + n + '</div><div class="l">' + l + '</div></div>';
  const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

  if (tokenEl.value) load();
</script>
</body>
</html>`;
}
