import { firebaseConfig } from "./firebase-config.js";

// ---------- Plan de estudios ----------
// código: [nombre, año, cuatrimestre del plan, cuatrimestres en que se dicta, correlativas]
const PLAN = {
  "1602": ["Laboratorio de Diseño I", 1, 1, [1], []],
  "1603": ["Forma e Imagen", 1, 1, [1, 2], []],
  "1403": ["Arte y Cultura de la Modernidad", 1, 1, [1, 2], []],
  "1207": ["Matemática", 1, 1, [1, 2], []],
  "1604": ["Laboratorio de Diseño II", 1, 2, [2], ["1602"]],
  "1605": ["Teorías de la Comunicación", 1, 2, [2], []],
  "2604": ["Historia del Diseño Moderno", 1, 2, [2], []],
  "1501": ["Instituciones Políticas y de Gobierno", 1, 2, [1, 2], []],
  "9003": ["Comprensión de Textos y Escritura", 1, 2, [1, 2], []],
  "2601": ["Laboratorio de Diseño III", 2, 1, [1], ["1602", "1604"]],
  "2602": ["Objeto y Materialidad", 2, 1, [1], []],
  "2603": ["Introducción a los Estudios Visuales", 2, 1, [1], []],
  "2608": ["Economía", 2, 1, [1, 2], []],
  "2605": ["Laboratorio de Diseño IV", 2, 2, [2], ["1602", "1604"]],
  "2606": ["Teoría y Metodología del Diseño", 2, 2, [2], []],
  "2607": ["Ingeniería de Materiales", 2, 2, [2], []],
  "3003": ["Sociología", 2, 2, [2], []],
  "3620": ["Laboratorio de Diseño V", 3, 1, [1], ["2601", "2605"]],
  "3621": ["Visualización de la Información", 3, 1, [1, 2], []],
  "3622": ["Programación Orientada al Diseño", 3, 1, [1, 2], []],
  "3623": ["Historia del Diseño Latinoamericano", 3, 1, [1], []],
  "3624": ["Laboratorio de Diseño VI", 3, 2, [2], ["2605", "3620"]],
  "3625": ["Diseño de Interactividad", 3, 2, [2], []],
  "4327": ["Marketing", 3, 2, [1, 2], ["2608"]],
  "9004": ["Expresión Oral y Escrita", 3, 2, [1, 2], []],
  "4630": ["Laboratorio de Diseño VII", 4, 1, [1], ["3620"]],
  "4631": ["Diseño y Gestión Cultural", 4, 1, [1], []],
  "4632": ["Gestión Estratégica del Diseño", 4, 1, [1], []],
  "4633": ["Laboratorio de Diseño VIII", 4, 2, [2], ["3624", "4630"]],
  "4634": ["Narrativas y Medios", 4, 2, [2], []],
  "4635": ["Diseño Sustentable", 4, 2, [2], []]
};
const CM_TOTAL = 3;
const planIdx = code => (PLAN[code][1] - 1) * 2 + PLAN[code][2]; // 1 = 1º año 1C ... 8 = 4º año 2C

const COLS = [
  { id: "c1", label: "1C 2027", sub: "mar–jul 2027", term: 1, ord: 1 },
  { id: "c2", label: "2C 2027", sub: "ago–dic 2027", term: 2, ord: 2 },
  { id: "c3", label: "1C 2028", sub: "mar–jul 2028", term: 1, ord: 3 },
  { id: "c4", label: "2C 2028", sub: "ago–dic 2028", term: 2, ord: 4 }
];
const COLMAP = Object.fromEntries(COLS.map(c => [c.id, c]));
const firstColFor = code => (PLAN[code] && !PLAN[code][3].includes(1)) ? "c2" : "c1";

// colores por persona, elegidos por el id
const HUES = [
  ["#2f8f3a", "#e4f1e5", "#5cc068", "#1d2e20"], ["#2c5fb8", "#e3ebf8", "#6f9bea", "#1b2436"],
  ["#c2551c", "#f8e8de", "#ec8a55", "#33231a"], ["#8a3fb0", "#f1e5f7", "#c08ae0", "#2b1d33"],
  ["#0f8389", "#dcf1f2", "#4cc3c9", "#15302f"], ["#b0306a", "#f8e1ec", "#e57aa8", "#331a26"],
  ["#7a6a12", "#f3eed4", "#cdb84a", "#2e2a14"], ["#4b5bd1", "#e5e8fa", "#8d99f0", "#1e2238"]
];
const dark = window.matchMedia("(prefers-color-scheme: dark)");
function colorsFor(id) {
  let h = 0;
  for (const ch of id) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const c = HUES[h % HUES.length];
  return dark.matches ? [c[2], c[3]] : [c[0], c[1]];
}

// ---------- Filas nuevas ----------
// year: año que cursa ahora (estamos en el 2do cuatrimestre). Lo que le queda del plan se ubica en orden.
function planBlocks(year) {
  const cur = (year - 1) * 2 + 2;
  const out = [];
  for (const code of Object.keys(PLAN)) {
    const i = planIdx(code);
    if (i <= cur) continue;
    const col = COLS[Math.min(i - cur, COLS.length) - 1].id;
    out.push({ code, col });
  }
  return out;
}
function optBlocks(names, cmDone) {
  const spots = ["c4", "c3", "c2", "c1"];
  return names.slice(0, 8).map((name, i) => ({ code: "X", name, opt: true, col: spots[Math.min(i, spots.length - 1)] }));
}
function placeholderOpts(cmDone) {
  return Array.from({ length: Math.max(0, CM_TOTAL - cmDone) }, () => "Optativa a definir");
}

// las tres que empezaron el tablero (filas sin dueño hasta que cada una las reclama)
const SEED = [
  { id: "bale", name: "Bale", cuatri: 3, cmDone: 2, afuera: "",
    situacion: "Debe Economía, Visualización de la Información, Historia del Diseño Latinoamericano y Marketing.",
    blocks: [...planBlocks(3), ...optBlocks(placeholderOpts(2), 2),
      { code: "3623", col: "c1", debe: true }, { code: "2608", col: "c2", debe: true },
      { code: "4327", col: "c3", debe: true }, { code: "3621", col: "c3", debe: true }] },
  { id: "dino", name: "Dino", cuatri: 3, cmDone: 1, afuera: "",
    situacion: "Al día. En el 1C 2027 cursa las de 4º año sin optativa.",
    blocks: [...planBlocks(3), ...optBlocks(placeholderOpts(1), 1)] },
  { id: "sofi", name: "Sofi", cuatri: 3, cmDone: 2, afuera: "c1",
    situacion: "Al día. El 1C 2027 lo cursa de intercambio en otra universidad.",
    blocks: [{ code: "4631", col: "c1" }, { code: "4632", col: "c1" }, { code: "4634", col: "c1" },
      { code: "4633", col: "c2" }, { code: "4635", col: "c2" }, { code: "4630", col: "c3" },
      ...optBlocks(placeholderOpts(2), 2)] }
];

// ---------- Almacenamiento ----------
function hasConfig() { return !!(firebaseConfig && firebaseConfig.apiKey && firebaseConfig.projectId); }
const clean = o => Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined));

async function firebaseStore() {
  const V = "10.12.2";
  const app = await import(`https://www.gstatic.com/firebasejs/${V}/firebase-app.js`);
  const fs = await import(`https://www.gstatic.com/firebasejs/${V}/firebase-firestore.js`);
  const au = await import(`https://www.gstatic.com/firebasejs/${V}/firebase-auth.js`);
  const fb = app.initializeApp(firebaseConfig);
  const auth = au.getAuth(fb);
  const cred = await au.signInAnonymously(auth);
  const db = fs.getFirestore(fb);
  const people = fs.collection(db, "people"), blocks = fs.collection(db, "blocks");
  return {
    shared: true,
    uid: cred.user.uid,
    newId: () => fs.doc(people).id,
    subscribe(cb, onErr) {
      let P = null, B = null, pFresh = false, bFresh = false;
      const emit = () => { if (P && B) cb(P, B, pFresh && bFresh); };
      const u1 = fs.onSnapshot(people, { includeMetadataChanges: true }, s => {
        P = s.docs.map(d => ({ id: d.id, ...d.data() })); pFresh = !s.metadata.fromCache; emit();
      }, onErr);
      const u2 = fs.onSnapshot(blocks, { includeMetadataChanges: true }, s => {
        B = s.docs.map(d => ({ id: d.id, ...d.data() })); bFresh = !s.metadata.fromCache; emit();
      }, onErr);
      return () => { u1(); u2(); };
    },
    async seedOnce(seed) {
      const flag = fs.doc(db, "meta", "seed");
      if ((await fs.getDoc(flag)).exists()) return;
      const batch = fs.writeBatch(db);
      for (const p of seed) {
        batch.set(fs.doc(people, p.id), { name: p.name, cuatri: p.cuatri, cmDone: p.cmDone, situacion: p.situacion, afuera: p.afuera, createdAt: Date.now() });
        p.blocks.forEach((b, i) => batch.set(fs.doc(blocks, `${p.id}-${i}`), clean({ personId: p.id, ...b })));
      }
      batch.set(flag, { seeded: true });
      await batch.commit();
    },
    async addPerson(id, person, list) {
      const batch = fs.writeBatch(db);
      batch.set(fs.doc(people, id), person);
      list.forEach(b => batch.set(fs.doc(blocks), clean({ personId: id, ...b })));
      await batch.commit();
    },
    updatePerson: (id, patch) => fs.updateDoc(fs.doc(people, id), patch),
    async deletePerson(id, blockIds) {
      const batch = fs.writeBatch(db);
      blockIds.forEach(b => batch.delete(fs.doc(blocks, b)));
      batch.delete(fs.doc(people, id));
      await batch.commit();
    },
    addBlock: b => fs.setDoc(fs.doc(blocks), clean(b)),
    updateBlock: (id, patch) => fs.updateDoc(fs.doc(blocks, id), Object.fromEntries(
      Object.entries(patch).map(([k, v]) => [k, v === undefined ? fs.deleteField() : v]))),
    deleteBlock: id => fs.deleteDoc(fs.doc(blocks, id))
  };
}

// modo prueba: todo queda en este navegador
function localStore() {
  const KEY = "cursada-ditella-v2";
  let data = { people: {}, blocks: {} };
  try { const s = localStorage.getItem(KEY); if (s) data = JSON.parse(s); } catch (e) { /* sin almacenamiento */ }
  let uid = null;
  try { uid = localStorage.getItem("cursada-device"); } catch (e) { /* sin almacenamiento */ }
  if (!uid) { uid = "dev-" + Math.random().toString(36).slice(2, 12); try { localStorage.setItem("cursada-device", uid); } catch (e) { /* nada */ } }
  let listener = null;
  const id = () => Math.random().toString(36).slice(2, 12);
  const save = () => {
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) { /* sin almacenamiento */ }
    if (listener) listener(Object.values(data.people), Object.values(data.blocks), true);
  };
  return {
    shared: false,
    uid,
    newId: id,
    subscribe(cb) { listener = cb; setTimeout(save, 0); return () => { listener = null; }; },
    async seedOnce(seed) {
      if (Object.keys(data.people).length) return;
      for (const p of seed) {
        data.people[p.id] = { id: p.id, name: p.name, cuatri: p.cuatri, cmDone: p.cmDone, situacion: p.situacion, afuera: p.afuera, createdAt: Date.now() };
        p.blocks.forEach((b, i) => { const bid = `${p.id}-${i}`; data.blocks[bid] = { id: bid, personId: p.id, ...b }; });
      }
      save();
    },
    async addPerson(pid, person, list) {
      data.people[pid] = { id: pid, ...person };
      list.forEach(b => { const bid = id(); data.blocks[bid] = clean({ id: bid, personId: pid, ...b }); });
      save();
    },
    async updatePerson(pid, patch) { Object.assign(data.people[pid], patch); save(); },
    async deletePerson(pid, ids) { delete data.people[pid]; ids.forEach(b => delete data.blocks[b]); save(); },
    async addBlock(b) { const bid = id(); data.blocks[bid] = clean({ id: bid, ...b }); save(); },
    async updateBlock(bid, patch) {
      const b = data.blocks[bid]; if (!b) return;
      for (const [k, v] of Object.entries(patch)) { if (v === undefined) delete b[k]; else b[k] = v; }
      save();
    },
    async deleteBlock(bid) { delete data.blocks[bid]; save(); }
  };
}

// ---------- Estado ----------
let store = null;
let people = [], blocks = [], loaded = false;
let pendingRemote = null;
let selected = null, dragging = null, editing = null, editKind = "note", editDraft = "";
let search = "";
let meId = null;
try { meId = localStorage.getItem("cursada-me"); } catch (e) { /* sin almacenamiento */ }
let askedWho = false;

const $ = id => document.getElementById(id);
const boardEl = $("board"), statusEl = $("status");

function setStatus(kind, text) {
  statusEl.className = "status " + (kind || "");
  statusEl.querySelector("span").textContent = text;
}
function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
}
const nameOf = b => b.name || (PLAN[b.code] ? PLAN[b.code][0] : b.code);
const isOpt = b => typeof b.opt === "boolean" ? b.opt : (b.code === "X" || b.code === "CM");
const keyOf = b => b.code === "X" ? "x:" + (b.name || "").trim().toLowerCase() : b.code;
const personOf = id => people.find(p => p.id === id);
const owns = p => !!p && !!store && p.ownerUid === store.uid;
const me = () => { const p = personOf(meId); return owns(p) ? p : null; };
const canEdit = pid => { const m = me(); return !!m && m.id === pid; };

function setMe(id) {
  meId = id;
  try { if (id) localStorage.setItem("cursada-me", id); else localStorage.removeItem("cursada-me"); } catch (e) { /* nada */ }
  render();
}

function fail(e) {
  console.error(e);
  setStatus("warn", "No se pudo guardar el cambio. Revisá la conexión y probá de nuevo.");
}

function warningsFor(b, mine, person) {
  const w = [];
  const col = COLMAP[b.col];
  const info = PLAN[b.code];
  if (!col || !info) return w;
  if (info[3].length === 1 && info[3][0] !== col.term && person.afuera !== b.col) w.push(`Se dicta solo en el ${info[3][0]}C`);
  for (const req of info[4]) {
    const r = mine.find(x => x.code === req);
    if (!r) continue; // si no está en el tablero, se asume aprobada
    const rc = COLMAP[r.col];
    if (rc && rc.ord >= col.ord) w.push(`Necesita ${PLAN[req][0]} aprobada antes`);
  }
  return w;
}

// ---------- Dibujo ----------
function render() {
  const m = me();
  $("meLabel").textContent = m ? "Sos " + m.name : "Estás mirando";
  $("whoBtn").textContent = m ? "Cambiar de persona" : "¿Quién sos?";

  const visible = people
    .filter(p => !search || p.name.toLowerCase().includes(search))
    .sort((a, b) => (m && a.id === m.id ? -1 : m && b.id === m.id ? 1 : a.name.localeCompare(b.name, "es")));

  const share = {};
  for (const b of blocks) {
    const p = personOf(b.personId); if (!p || !COLMAP[b.col]) continue;
    if (b.code === "X" && /a definir/i.test(b.name || "")) continue;
    const k = b.col + "|" + keyOf(b);
    (share[k] = share[k] || { ps: [] }).ps.push(p.name);
  }

  boardEl.textContent = "";
  const corner = el("div", "hd");
  corner.appendChild(el("b", null, "Quién"));
  corner.appendChild(el("span", null, people.length + (people.length === 1 ? " persona" : " personas")));
  boardEl.appendChild(corner);
  for (const c of COLS) {
    const h = el("div", "hd" + (c.ord <= 2 ? " y1" : " y2"));
    h.appendChild(el("b", null, c.label));
    h.appendChild(el("span", null, c.sub));
    boardEl.appendChild(h);
  }

  if (!visible.length) {
    boardEl.appendChild(el("div", "empty", !loaded ? "Cargando…" : people.length ? "Nadie coincide con la búsqueda." : "Todavía no hay nadie anotado."));
  }

  for (const p of visible) {
    const [pc, ps] = colorsFor(p.id);
    const mine = blocks.filter(b => b.personId === p.id);
    const edit = canEdit(p.id);

    const who = el("div", "who" + (edit ? " mine" : ""));
    who.style.setProperty("--pc", pc);
    const top = el("div", "top");
    top.appendChild(el("span", "tag", p.name.trim().charAt(0).toUpperCase() || "?"));
    top.appendChild(el("span", "nm", p.name));
    who.appendChild(top);
    if (edit) who.appendChild(el("span", "you", "Tu fila"));
    const cmPlaced = mine.filter(b => isOpt(b) && COLMAP[b.col]).length;
    who.appendChild(el("span", "cm", `Optativas: ${p.cmDone || 0} hechas · ${cmPlaced} ubicadas`));
    if (p.afuera) who.appendChild(el("span", "away-tag", "Intercambio " + COLMAP[p.afuera].label));
    if (p.situacion) who.appendChild(el("span", "sit", p.situacion));
    if (edit) {
      const acts = el("div", "acts");
      for (const [act, txt] of [["subj", "+ materia"], ["edit", "Mis datos"], ["del", "Borrar"]]) {
        const b = el("button", null, txt); b.type = "button"; b.dataset.pact = act;
        acts.appendChild(b);
      }
      who.appendChild(acts);
    }
    boardEl.appendChild(who);

    for (const c of COLS) {
      const away = p.afuera === c.id;
      const cell = el("div", "cell" + (away ? " away" : "") + (edit ? "" : " ro"));
      cell.dataset.p = p.id; cell.dataset.col = c.id;
      const selB = selected && blocks.find(b => b.id === selected);
      if (edit && selB && selB.personId === p.id && selB.col !== c.id) {
        cell.classList.add("target");
        cell.setAttribute("role", "button");
        cell.setAttribute("aria-label", "Mover acá: " + c.label);
      }
      if (away) cell.appendChild(el("div", "away-note", "De intercambio"));
      const items = mine.filter(b => b.col === c.id).sort((a, b) => nameOf(a).localeCompare(nameOf(b), "es"));

      if (c.id === "c4") {
        const oblig = items.filter(b => !isOpt(b));
        const optHere = items.filter(isOpt).length;
        const optBefore = (p.cmDone || 0) + cmPlaced - optHere;
        const optLeft = Math.max(0, CM_TOTAL - (p.cmDone || 0) - cmPlaced);
        const okOpt = optHere > 0 && optBefore >= CM_TOTAL - 1;
        cell.appendChild(el("div", "grad " + (oblig.length || okOpt ? "ok" : "no"),
          oblig.length ? `Se recibe a fin de 2028: queda ${nameOf(oblig[0])}${oblig.length > 1 ? ` y ${oblig.length - 1} más` : ""}`
          : okOpt ? "Se recibe a fin de 2028: queda su última optativa"
          : optHere ? "Esta no sería su última optativa: ubicá antes la que falta"
          : "Para recibirse a fin de 2028 tiene que quedar acá una obligatoria o su última optativa"));
        if (optLeft) cell.appendChild(el("div", "grad no",
          `${optLeft === 1 ? "Falta ubicar 1 optativa" : `Faltan ubicar ${optLeft} optativas`} (hizo ${p.cmDone || 0} de ${CM_TOTAL})`));
      }

      for (const b of items) cell.appendChild(blockEl(b, p, mine, edit, pc, ps, share, c));
      cell.appendChild(el("div", "n", items.length + (items.length === 1 ? " materia" : " materias")));
      boardEl.appendChild(cell);
    }
  }
}

function blockEl(b, p, mine, edit, pc, ps, share, c) {
  const blk = el("div", "blk" + (b.debe ? " debe" : "") + (edit ? " can" : ""));
  blk.style.setProperty("--pc", pc); blk.style.setProperty("--ps", ps);
  blk.dataset.id = b.id;
  if (edit) {
    blk.tabIndex = 0;
    blk.setAttribute("role", "button");
    blk.setAttribute("aria-label", `${nameOf(b)}, ${c.label}. Flechas para mover.`);
  }
  if (selected === b.id) blk.classList.add("sel");
  if (edit && editing === b.id && editKind === "name") {
    const ne = el("div", "noteedit note-ui");
    const inp = el("input"); inp.id = "name-" + b.id; inp.maxLength = 60; inp.value = editDraft;
    inp.setAttribute("aria-label", "Nombre de la optativa");
    const row = el("div");
    const ok = el("button", "primary", "Guardar"); ok.type = "button"; ok.dataset.act = "save";
    const no = el("button", null, "Cancelar"); no.type = "button"; no.dataset.act = "cancel";
    row.append(ok, no); ne.append(inp, row); blk.appendChild(ne);
  } else if (edit && b.code === "X") {
    const bn = el("button", "bn rename note-ui", nameOf(b)); bn.type = "button"; bn.dataset.act = "rename";
    bn.title = "Cambiar el nombre"; bn.setAttribute("aria-label", "Cambiar el nombre de " + nameOf(b));
    blk.appendChild(bn);
  } else blk.appendChild(el("div", "bn", nameOf(b)));

  if (edit && editing === b.id && editKind === "note") {
    const ne = el("div", "noteedit note-ui");
    const ta = el("textarea"); ta.id = "note-" + b.id; ta.maxLength = 300;
    ta.placeholder = "Horario, profe, comisión, lo que sea"; ta.value = editDraft;
    ta.setAttribute("aria-label", "Nota de " + nameOf(b));
    const row = el("div");
    const ok = el("button", "primary", "Guardar"); ok.type = "button"; ok.dataset.act = "save";
    const no = el("button", null, "Cancelar"); no.type = "button"; no.dataset.act = "cancel";
    row.append(ok, no); ne.append(ta, row); blk.appendChild(ne);
  } else if (b.note) {
    const nt = el("div", "note note-ui", b.note);
    if (edit) { nt.dataset.act = "edit"; nt.title = "Editar nota"; }
    blk.appendChild(nt);
  } else if (edit) {
    const an = el("button", "addnote note-ui", "Agregar nota"); an.type = "button"; an.dataset.act = "edit";
    blk.appendChild(an);
  }

  const meta = el("div", "meta");
  const info = PLAN[b.code];
  if (info) meta.appendChild(el("span", "pill", b.code));
  if (info && info[3].length === 1) meta.appendChild(el("span", "pill", `solo ${info[3][0]}C`));
  const sh = share[b.col + "|" + keyOf(b)];
  if (sh && sh.ps.length > 1) {
    const others = sh.ps.filter(n => n !== p.name);
    if (others.length) meta.appendChild(el("span", "pill junt", others.join(" - ")));
  }
  blk.appendChild(meta);

  const ctl = el("div", "ctl");
  for (const [field, label, on] of [["opt", "Optativa", isOpt(b)], ["debe", "La debe", !!b.debe]]) {
    const sw = el(edit ? "button" : "span", "sw", label);
    sw.setAttribute("role", "switch"); sw.setAttribute("aria-checked", String(on));
    if (edit) { sw.type = "button"; sw.dataset.tog = field; sw.setAttribute("aria-label", `${label}: ${nameOf(b)}`); }
    else sw.setAttribute("aria-disabled", "true");
    ctl.appendChild(sw);
  }
  blk.appendChild(ctl);
  for (const t of warningsFor(b, mine, p)) { blk.classList.add("has-warn"); blk.appendChild(el("div", "warnmsg", t)); }
  if (edit) {
    const x = el("button", "x", "×"); x.type = "button"; x.dataset.del = b.id;
    x.setAttribute("aria-label", "Borrar " + nameOf(b));
    blk.appendChild(x);
  }
  return blk;
}

// ---------- Acciones sobre tu fila ----------
function myBlock(id) {
  const b = blocks.find(x => x.id === id);
  return b && canEdit(b.personId) ? b : null;
}

function moveTo(id, col) {
  const b = myBlock(id);
  if (!b || b.col === col) return;
  b.col = col; selected = null; render();
  store.updateBlock(id, { col }).catch(fail);
}

function closeNote(save) {
  const id = editing; if (!id) return;
  editing = null;
  const b = myBlock(id);
  const kind = editKind;
  const t = editDraft.trim().slice(0, kind === "name" ? 60 : 300);
  editDraft = ""; editKind = "note";
  if (save && b && kind === "name") {
    if (t && t !== b.name) { b.name = t; store.updateBlock(id, { name: t }).catch(fail); }
  } else if (save && b) {
    if (t) b.note = t; else delete b.note;
    store.updateBlock(id, { note: t || undefined }).catch(fail);
  }
  flushRemote();
}

function flushRemote() {
  if (pendingRemote && !dragging && !editing) {
    [people, blocks] = pendingRemote; pendingRemote = null;
    if (selected && !blocks.find(b => b.id === selected)) selected = null;
  }
  render();
}

// arrastre con puntero (mouse y touch)
let press = null, ghost = null, overCell = null;
boardEl.addEventListener("pointerdown", ev => {
  const blk = ev.target.closest(".blk.can");
  if (!blk || ev.target.closest(".x, .note-ui, .ctl") || ev.button > 0) return;
  press = { id: blk.dataset.id, x: ev.clientX, y: ev.clientY, el: blk, moved: false };
});
window.addEventListener("pointermove", ev => {
  if (!press) return;
  if (!press.moved) {
    if (Math.abs(ev.clientX - press.x) + Math.abs(ev.clientY - press.y) < 6) return;
    press.moved = true; dragging = press.id;
    ghost = press.el.cloneNode(true); ghost.classList.add("ghost"); ghost.classList.remove("sel");
    document.body.appendChild(ghost);
    press.el.classList.add("lifted");
  }
  ev.preventDefault();
  ghost.style.left = (ev.clientX - 90) + "px";
  ghost.style.top = (ev.clientY - 20) + "px";
  const under = document.elementFromPoint(ev.clientX, ev.clientY);
  let cell = under && under.closest ? under.closest(".cell") : null;
  const b = blocks.find(x => x.id === press.id);
  if (cell && (!b || cell.dataset.p !== b.personId)) cell = null;
  if (overCell && overCell !== cell) overCell.classList.remove("over");
  if (cell) cell.classList.add("over");
  overCell = cell;
}, { passive: false });
window.addEventListener("pointerup", () => {
  if (!press) return;
  const p = press; press = null;
  if (p.moved) {
    if (ghost) ghost.remove(); ghost = null;
    dragging = null;
    const target = overCell; overCell = null;
    if (pendingRemote) flushRemote();
    if (target) moveTo(p.id, target.dataset.col); else render();
  } else {
    selected = selected === p.id ? null : p.id;
    render();
    const again = boardEl.querySelector(`.blk[data-id="${p.id}"]`);
    if (again) again.focus();
  }
});
window.addEventListener("pointercancel", () => {
  if (ghost) ghost.remove(); ghost = null; press = null; dragging = null;
  if (overCell) overCell.classList.remove("over"); overCell = null;
  flushRemote();
});

boardEl.addEventListener("input", ev => { if (ev.target.closest(".noteedit")) editDraft = ev.target.value; });

boardEl.addEventListener("click", ev => {
  const pact = ev.target.closest("[data-pact]");
  if (pact && me()) {
    if (pact.dataset.pact === "subj") openSubj();
    else if (pact.dataset.pact === "edit") openPerson();
    else $("delDlg").showModal();
    return;
  }
  const tog = ev.target.closest("[data-tog]");
  if (tog) {
    const b = myBlock(tog.closest(".blk").dataset.id); if (!b) return;
    const field = tog.dataset.tog;
    const value = field === "opt" ? !isOpt(b) : !b.debe;
    b[field] = value; render();
    store.updateBlock(b.id, { [field]: value }).catch(fail);
    const again = boardEl.querySelector(`.blk[data-id="${b.id}"] [data-tog="${field}"]`);
    if (again) again.focus();
    return;
  }
  const act = ev.target.closest("[data-act]");
  if (act) {
    const bid = act.closest(".blk").dataset.id;
    if (act.dataset.act === "edit" || act.dataset.act === "rename") {
      const b = myBlock(bid); if (!b) return;
      if (editing) closeNote(true);
      const kind = act.dataset.act === "rename" ? "name" : "note";
      editing = bid; editKind = kind; editDraft = (kind === "name" ? b.name : b.note) || ""; selected = null; render();
      const f = $((kind === "name" ? "name-" : "note-") + bid);
      if (f) { f.focus(); f.setSelectionRange(f.value.length, f.value.length); }
    } else closeNote(act.dataset.act === "save");
    return;
  }
  const del = ev.target.closest(".x");
  if (del) {
    const b = myBlock(del.dataset.del); if (!b) return;
    blocks = blocks.filter(x => x.id !== b.id); selected = null; render();
    store.deleteBlock(b.id).catch(fail);
    return;
  }
  const cell = ev.target.closest(".cell.target");
  if (cell && selected && !ev.target.closest(".blk")) moveTo(selected, cell.dataset.col);
});

boardEl.addEventListener("keydown", ev => {
  if (ev.target.closest(".noteedit") && ev.target.tagName !== "BUTTON") {
    if (ev.key === "Escape") { ev.preventDefault(); closeNote(false); }
    else if (ev.key === "Enter" && (ev.ctrlKey || ev.metaKey || ev.target.tagName === "INPUT")) { ev.preventDefault(); closeNote(true); }
    return;
  }
  const blk = ev.target.closest && ev.target.closest(".blk.can");
  if (!blk || ev.target.tagName === "BUTTON") return;
  const b = myBlock(blk.dataset.id); if (!b) return;
  const i = COLS.findIndex(c => c.id === b.col);
  const ni = ev.key === "ArrowRight" ? i + 1 : ev.key === "ArrowLeft" ? i - 1 : null;
  if (ni === null || ni < 0 || ni >= COLS.length) return;
  ev.preventDefault();
  moveTo(b.id, COLS[ni].id);
  const again = boardEl.querySelector(`.blk[data-id="${b.id}"]`);
  if (again) again.focus();
});

$("search").addEventListener("input", ev => { search = ev.target.value.trim().toLowerCase(); render(); });

// ---------- ¿Quién sos? ----------
const whoDlg = $("whoDlg");
function renderWhoList() {
  const list = $("whoList");
  list.textContent = "";
  const sorted = [...people].sort((a, b) => a.name.localeCompare(b.name, "es"));
  if (!sorted.length) list.appendChild(el("p", "hint", "Todavía no hay nadie anotado."));
  for (const p of sorted) {
    const b = el("button", "whoitem");
    b.type = "button"; b.dataset.pick = p.id;
    b.style.setProperty("--pc", colorsFor(p.id)[0]);
    b.appendChild(el("span", "tag", p.name.trim().charAt(0).toUpperCase() || "?"));
    b.appendChild(el("span", null, p.name));
    if (p.ownerUid && !owns(p)) b.appendChild(el("small", null, "tomada en otro dispositivo"));
    else if (owns(p)) b.appendChild(el("small", null, "vos"));
    list.appendChild(b);
  }
}
function openWho() {
  $("whoMsg").hidden = true;
  renderWhoList();
  if (!whoDlg.open) whoDlg.showModal();
}
$("whoBtn").addEventListener("click", openWho);
$("whoLook").addEventListener("click", () => { whoDlg.close(); setMe(null); });
$("whoNew").addEventListener("click", () => { whoDlg.close(); openJoin(); });
$("whoList").addEventListener("click", ev => {
  const b = ev.target.closest("[data-pick]"); if (!b) return;
  const p = personOf(b.dataset.pick); if (!p) return;
  if (owns(p)) { whoDlg.close(); setMe(p.id); return; }
  if (p.ownerUid) {
    const msg = $("whoMsg");
    msg.textContent = `La fila de ${p.name} ya la tomó alguien desde otro dispositivo o navegador. Podés mirarla, pero solo se edita desde ahí.`;
    msg.hidden = false;
    return;
  }
  // fila sin dueño: la reclamás
  p.ownerUid = store.uid;
  whoDlg.close(); setMe(p.id);
  store.updatePerson(p.id, { ownerUid: store.uid }).catch(fail);
});

// ---------- Anotarse ----------
const joinDlg = $("joinDlg");
let joinDebe = [], joinOpts = [];
function fillDebeSelect() {
  const year = Number($("jCuatri").value);
  const cur = (year - 1) * 2 + 2;
  const sel = $("jDebe");
  sel.textContent = "";
  sel.appendChild(new Option("Elegí una materia…", ""));
  for (let y = 1; y <= 4; y++) {
    const g = document.createElement("optgroup"); g.label = `${y}º año`;
    for (const code of Object.keys(PLAN)) {
      if (PLAN[code][1] === y && planIdx(code) <= cur && !joinDebe.includes(code)) g.appendChild(new Option(PLAN[code][0], code));
    }
    if (g.children.length) sel.appendChild(g);
  }
}
function renderChips() {
  const dc = $("jDebeChips"); dc.textContent = "";
  joinDebe.forEach((code, i) => dc.appendChild(chip(PLAN[code][0], "debe", i)));
  const oc = $("jOptChips"); oc.textContent = "";
  joinOpts.forEach((n, i) => oc.appendChild(chip(n, "opt", i)));
}
function chip(text, kind, i) {
  const c = el("span", "chip", text);
  const x = el("button", null, "×"); x.type = "button"; x.dataset.chip = kind; x.dataset.i = i;
  x.setAttribute("aria-label", "Sacar " + text);
  c.appendChild(x);
  return c;
}
function openJoin() {
  joinDebe = []; joinOpts = [];
  $("jName").value = ""; $("jCuatri").value = "3"; $("jCM").value = "0"; $("jAway").value = ""; $("jSit").value = ""; $("jOpt").value = "";
  fillDebeSelect(); renderChips();
  joinDlg.showModal();
  $("jName").focus();
}
$("jCuatri").addEventListener("change", () => {
  const cur = (Number($("jCuatri").value) - 1) * 2 + 2;
  joinDebe = joinDebe.filter(c => planIdx(c) <= cur);
  fillDebeSelect(); renderChips();
});
$("jDebeAdd").addEventListener("click", () => {
  const code = $("jDebe").value; if (!code) { $("jDebe").focus(); return; }
  joinDebe.push(code); fillDebeSelect(); renderChips();
});
$("jDebe").addEventListener("change", () => { if ($("jDebe").value) $("jDebeAdd").click(); });
function addOpt() {
  const n = $("jOpt").value.trim().slice(0, 60); if (!n) { $("jOpt").focus(); return; }
  joinOpts.push(n); $("jOpt").value = ""; renderChips(); $("jOpt").focus();
}
$("jOptAdd").addEventListener("click", addOpt);
$("jOpt").addEventListener("keydown", ev => { if (ev.key === "Enter") { ev.preventDefault(); addOpt(); } });
joinDlg.addEventListener("click", ev => {
  const x = ev.target.closest("[data-chip]"); if (!x) return;
  const i = Number(x.dataset.i);
  if (x.dataset.chip === "debe") joinDebe.splice(i, 1); else joinOpts.splice(i, 1);
  fillDebeSelect(); renderChips();
});
$("joinCancel").addEventListener("click", () => { joinDlg.close(); openWho(); });
$("joinForm").addEventListener("submit", ev => {
  ev.preventDefault();
  const name = $("jName").value.trim().slice(0, 40);
  if (!name) { $("jName").focus(); return; }
  if ($("jOpt").value.trim()) addOpt();
  const year = Number($("jCuatri").value), cmDone = Number($("jCM").value);
  const list = [
    ...planBlocks(year),
    ...joinDebe.map(code => ({ code, col: firstColFor(code), debe: true })),
    ...optBlocks(joinOpts.length ? joinOpts : placeholderOpts(cmDone), cmDone)
  ];
  const id = store.newId();
  const person = { name, cuatri: year, cmDone, afuera: $("jAway").value, situacion: $("jSit").value.trim().slice(0, 300), ownerUid: store.uid, createdAt: Date.now() };
  joinDlg.close();
  meId = id;
  try { localStorage.setItem("cursada-me", id); } catch (e) { /* nada */ }
  search = ""; $("search").value = "";
  store.addPerson(id, person, list).catch(fail);
});

// ---------- Mis datos, materias, borrar ----------
const personDlg = $("personDlg"), subjDlg = $("subjDlg"), delDlg = $("delDlg");
function openPerson() {
  const p = me(); if (!p) return;
  $("pName").value = p.name; $("pCM").value = String(p.cmDone || 0);
  $("pAway").value = p.afuera || ""; $("pSit").value = p.situacion || "";
  personDlg.showModal(); $("pName").focus();
}
$("personCancel").addEventListener("click", () => personDlg.close());
$("personForm").addEventListener("submit", ev => {
  ev.preventDefault();
  const p = me(); if (!p) return personDlg.close();
  const name = $("pName").value.trim().slice(0, 40);
  if (!name) { $("pName").focus(); return; }
  const data = { name, cmDone: Number($("pCM").value), afuera: $("pAway").value, situacion: $("pSit").value.trim().slice(0, 300) };
  personDlg.close();
  Object.assign(p, data); render();
  store.updatePerson(p.id, data).catch(fail);
});

(function buildPlanSelect() {
  const sel = $("sPlan");
  sel.appendChild(new Option("Elegí una materia…", ""));
  for (const year of [1, 2, 3, 4]) {
    const g = document.createElement("optgroup"); g.label = `${year}º año`;
    for (const [code, info] of Object.entries(PLAN)) if (info[1] === year) g.appendChild(new Option(`${info[0]} (${code})`, code));
    sel.appendChild(g);
  }
})();
function openSubj() {
  $("sPlan").value = ""; $("sFree").value = ""; $("sCol").value = "c1";
  subjDlg.showModal(); $("sPlan").focus();
}
$("sPlan").addEventListener("change", () => {
  const info = PLAN[$("sPlan").value];
  const cur = COLMAP[$("sCol").value];
  if (info && info[3].length === 1 && cur.term !== info[3][0]) $("sCol").value = firstColFor($("sPlan").value);
});
$("subjCancel").addEventListener("click", () => subjDlg.close());
$("subjForm").addEventListener("submit", ev => {
  ev.preventDefault();
  const p = me(); if (!p) return subjDlg.close();
  const code = $("sPlan").value, free = $("sFree").value.trim().slice(0, 60);
  if (!code && !free) { $("sPlan").focus(); return; }
  const b = { personId: p.id, col: $("sCol").value };
  if (free) { b.code = "X"; b.name = free; b.opt = true; }
  else {
    b.code = code; b.opt = false;
    if (planIdx(code) <= (p.cuatri || 3) * 2) b.debe = true;
  }
  subjDlg.close();
  store.addBlock(b).catch(fail);
});
$("delCancel").addEventListener("click", () => delDlg.close());
$("delForm").addEventListener("submit", ev => {
  ev.preventDefault();
  const p = me(); delDlg.close(); if (!p) return;
  const ids = blocks.filter(b => b.personId === p.id).map(b => b.id);
  people = people.filter(x => x.id !== p.id); blocks = blocks.filter(b => b.personId !== p.id);
  setMe(null);
  store.deletePerson(p.id, ids).catch(fail);
});

dark.addEventListener("change", render);

// ---------- Arranque ----------
async function start() {
  render();
  if (hasConfig()) {
    try { store = await firebaseStore(); }
    catch (e) { console.error(e); store = null; }
  }
  if (!store) {
    store = localStore();
    setStatus("warn", hasConfig() ? "No se pudo conectar con la base. Los cambios quedan solo en este navegador."
                                  : "Modo prueba: falta conectar la base, los cambios quedan solo en este navegador.");
  }
  const timer = setTimeout(() => setStatus("warn", "No se pudo conectar todavía. Lo que ves puede estar desactualizado."), 10000);
  store.subscribe((P, B, fresh) => {
    if (fresh) { clearTimeout(timer); if (store.shared) setStatus("ok", "Conectado: lo que cambies lo ven todos"); }
    if (dragging || editing) { pendingRemote = [P, B]; return; }
    people = P; blocks = B; loaded = loaded || fresh;
    if (selected && !blocks.find(b => b.id === selected)) selected = null;
    render();
    if (whoDlg.open) renderWhoList();
    if (fresh && !askedWho) {
      askedWho = true;
      if (!me()) openWho();
    }
  }, e => { clearTimeout(timer); console.error(e); setStatus("warn", "Se cortó la conexión con la base. Recargá la página."); });
  store.seedOnce(SEED).catch(e => console.error(e));
}
start();
