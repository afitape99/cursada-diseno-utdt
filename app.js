import { firebaseConfig } from "./firebase-config.js";

// ---------- Plan de estudios ----------
// código: [nombre, año, cuatrimestres en que se dicta, correlativas]
const PLAN = {
  "1602": ["Laboratorio de Diseño I", 1, [1], []],
  "1603": ["Forma e Imagen", 1, [1, 2], []],
  "1403": ["Arte y Cultura de la Modernidad", 1, [1, 2], []],
  "1207": ["Matemática", 1, [1, 2], []],
  "1604": ["Laboratorio de Diseño II", 1, [2], ["1602"]],
  "1605": ["Teorías de la Comunicación", 1, [2], []],
  "2604": ["Historia del Diseño Moderno", 1, [2], []],
  "1501": ["Instituciones Políticas y de Gobierno", 1, [1, 2], []],
  "9003": ["Comprensión de Textos y Escritura", 1, [1, 2], []],
  "2601": ["Laboratorio de Diseño III", 2, [1], ["1602", "1604"]],
  "2602": ["Objeto y Materialidad", 2, [1], []],
  "2603": ["Introducción a los Estudios Visuales", 2, [1], []],
  "2608": ["Economía", 2, [1, 2], []],
  "2605": ["Laboratorio de Diseño IV", 2, [2], ["1602", "1604"]],
  "2606": ["Teoría y Metodología del Diseño", 2, [2], []],
  "2607": ["Ingeniería de Materiales", 2, [2], []],
  "3003": ["Sociología", 2, [2], []],
  "3620": ["Laboratorio de Diseño V", 3, [1], ["2601", "2605"]],
  "3621": ["Visualización de la Información", 3, [1, 2], []],
  "3622": ["Programación Orientada al Diseño", 3, [1, 2], []],
  "3623": ["Historia del Diseño Latinoamericano", 3, [1], []],
  "3624": ["Laboratorio de Diseño VI", 3, [2], ["2605", "3620"]],
  "3625": ["Diseño de Interactividad", 3, [2], []],
  "4327": ["Marketing", 3, [1, 2], ["2608"]],
  "9004": ["Expresión Oral y Escrita", 3, [1, 2], []],
  "4630": ["Laboratorio de Diseño VII", 4, [1], ["3620", "3624"]],
  "4631": ["Diseño y Gestión Cultural", 4, [1], []],
  "4632": ["Gestión Estratégica del Diseño", 4, [1], []],
  "4633": ["Laboratorio de Diseño VIII", 4, [2], ["3624"]],
  "4634": ["Narrativas y Medios", 4, [2], []],
  "4635": ["Diseño Sustentable", 4, [2], []]
};
const CM_TOTAL = 3;

const COLS = [
  { id: "c1", label: "1C 2027", sub: "4º año · mar–jul", term: 1, ord: 1, year: 4 },
  { id: "c2", label: "2C 2027", sub: "4º año · ago–dic", term: 2, ord: 2, year: 4 },
  { id: "c3", label: "1C 2028", sub: "5º año · mar–jul", term: 1, ord: 3, year: 5 },
  { id: "c4", label: "2C 2028", sub: "5º año · ago–dic", term: 2, ord: 4, year: 5 }
];
const COLMAP = Object.fromEntries(COLS.map(c => [c.id, c]));

// colores por persona, elegidos por el nombre
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
function standardBlocks(cmDone) {
  const out = [
    { code: "4630", col: "c1" }, { code: "4631", col: "c1" }, { code: "4632", col: "c1" },
    { code: "4633", col: "c2" }, { code: "4634", col: "c2" }, { code: "4635", col: "c2" }
  ];
  // los Campos Menores que faltan van al final: el último en el 2C 2028
  const spots = ["c4", "c3", "c2"];
  for (let i = 0; i < CM_TOTAL - cmDone; i++) out.push({ code: "CM", col: spots[i] });
  return out;
}

// las tres que empezaron el tablero
const SEED = [
  { id: "bale", name: "Bale", cmDone: 2, afuera: "",
    situacion: "Debe Economía, Visualización de la Información, Historia del Diseño Latinoamericano y Marketing.",
    blocks: [...standardBlocks(2),
      { code: "3623", col: "c1", debe: true }, { code: "2608", col: "c2", debe: true },
      { code: "4327", col: "c3", debe: true }, { code: "3621", col: "c3", debe: true }] },
  { id: "dino", name: "Dino", cmDone: 1, afuera: "", situacion: "Al día. En el 1C 2027 cursa las de 4º año sin Campo Menor.",
    blocks: standardBlocks(1) },
  { id: "sofi", name: "Sofi", cmDone: 2, afuera: "c1", situacion: "Al día. El 1C 2027 lo cursa en otra universidad.",
    blocks: [{ code: "4631", col: "c1" }, { code: "4632", col: "c1" }, { code: "4634", col: "c1" },
      { code: "4633", col: "c2" }, { code: "4635", col: "c2" }, { code: "4630", col: "c3" }, { code: "CM", col: "c4" }] }
];

// ---------- Almacenamiento ----------
function hasConfig() { return !!(firebaseConfig && firebaseConfig.apiKey && firebaseConfig.projectId); }

async function firebaseStore() {
  const V = "10.12.2";
  const app = await import(`https://www.gstatic.com/firebasejs/${V}/firebase-app.js`);
  const fs = await import(`https://www.gstatic.com/firebasejs/${V}/firebase-firestore.js`);
  const db = fs.getFirestore(app.initializeApp(firebaseConfig));
  const people = fs.collection(db, "people"), blocks = fs.collection(db, "blocks");
  const clean = o => Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined));
  return {
    shared: true,
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
      const got = await fs.getDoc(flag);
      if (got.exists()) return;
      const batch = fs.writeBatch(db);
      for (const p of seed) {
        batch.set(fs.doc(people, p.id), { name: p.name, cmDone: p.cmDone, situacion: p.situacion, afuera: p.afuera, createdAt: Date.now() });
        p.blocks.forEach((b, i) => batch.set(fs.doc(blocks, `${p.id}-${b.code}-${i}`), clean({ personId: p.id, ...b })));
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
      batch.delete(fs.doc(people, id));
      blockIds.forEach(b => batch.delete(fs.doc(blocks, b)));
      await batch.commit();
    },
    addBlock: b => fs.setDoc(fs.doc(blocks), clean(b)),
    updateBlock: (id, patch) => fs.updateDoc(fs.doc(blocks, id), Object.fromEntries(
      Object.entries(patch).map(([k, v]) => [k, v === undefined ? fs.deleteField() : v]))),
    deleteBlock: id => fs.deleteDoc(fs.doc(blocks, id))
  };
}

function localStore() {
  const KEY = "cursada-ditella-v1";
  let data = { people: {}, blocks: {} };
  try { const s = localStorage.getItem(KEY); if (s) data = JSON.parse(s); } catch (e) { /* sin almacenamiento */ }
  let listener = null;
  const id = () => Math.random().toString(36).slice(2, 12);
  const save = () => {
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) { /* sin almacenamiento */ }
    if (listener) listener(Object.values(data.people), Object.values(data.blocks), true);
  };
  return {
    shared: false,
    newId: id,
    subscribe(cb) { listener = cb; setTimeout(save, 0); return () => { listener = null; }; },
    async seedOnce(seed) {
      if (Object.keys(data.people).length) return;
      for (const p of seed) {
        data.people[p.id] = { id: p.id, name: p.name, cmDone: p.cmDone, situacion: p.situacion, afuera: p.afuera, createdAt: Date.now() };
        p.blocks.forEach((b, i) => { const bid = `${p.id}-${b.code}-${i}`; data.blocks[bid] = { id: bid, personId: p.id, ...b }; });
      }
      save();
    },
    async addPerson(pid, person, list) {
      data.people[pid] = { id: pid, ...person };
      list.forEach(b => { const bid = id(); data.blocks[bid] = { id: bid, personId: pid, ...b }; });
      save();
    },
    async updatePerson(pid, patch) { Object.assign(data.people[pid], patch); save(); },
    async deletePerson(pid, ids) { delete data.people[pid]; ids.forEach(b => delete data.blocks[b]); save(); },
    async addBlock(b) { const bid = id(); data.blocks[bid] = { id: bid, ...b }; save(); },
    async updateBlock(bid, patch) {
      const b = data.blocks[bid]; if (!b) return;
      for (const [k, v] of Object.entries(patch)) { if (v === undefined) delete b[k]; else b[k] = v; }
      save();
    },
    async deleteBlock(bid) { delete data.blocks[bid]; save(); }
  };
}

// ---------- Estado de la vista ----------
let store = null;
let people = [], blocks = [];
let pendingRemote = null;
let selected = null, dragging = null, editing = null, editDraft = "";
let search = "";
let editPersonId = null, subjPersonId = null, delPersonId = null;

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
const nameOf = b => b.name || (PLAN[b.code] ? PLAN[b.code][0] : b.code === "CM" ? "Curso de Campo Menor" : b.code);
// optativa: lo que marque la persona; si no marcó nada, Campo Menor y las agregadas a mano son optativas
const isOpt = b => typeof b.opt === "boolean" ? b.opt : (b.code === "CM" || b.code === "X");
const isCM = isOpt;
const keyOf = b => b.code === "X" ? "x:" + (b.name || "").trim().toLowerCase() : b.code;
const personOf = id => people.find(p => p.id === id);

function fail(e) {
  console.error(e);
  setStatus("warn", "No se pudo guardar el cambio. Revisá la conexión y probá de nuevo.");
}

function warningsFor(b, mine, person) {
  const w = [];
  const col = COLMAP[b.col];
  const info = PLAN[b.code];
  if (!col || !col.term) return w;
  if (info && info[2].length === 1 && info[2][0] !== col.term && person.afuera !== b.col) {
    w.push(`Se dicta solo en el ${info[2][0]}C`);
  }
  if (info) {
    for (const req of info[3]) {
      const r = mine.find(x => x.code === req);
      if (!r) continue; // si no está en el tablero, se asume aprobada
      const rc = COLMAP[r.col];
      if (!rc || !rc.term) w.push(`Ubicá antes ${PLAN[req][0]}: es correlativa`);
      else if (rc.ord >= col.ord) w.push(`Necesita ${PLAN[req][0]} aprobada antes`);
    }
  }
  return w;
}

// ---------- Dibujo ----------
function render() {
  const visible = people
    .filter(p => !search || p.name.toLowerCase().includes(search))
    .sort((a, b) => a.name.localeCompare(b.name, "es"));

  const share = {};
  for (const b of blocks) {
    if (!COLMAP[b.col] || !COLMAP[b.col].term || b.code === "CM") continue;
    const p = personOf(b.personId); if (!p) continue;
    const k = b.col + "|" + keyOf(b);
    (share[k] = share[k] || { name: nameOf(b), col: b.col, ps: [] }).ps.push(p.name);
  }

  boardEl.textContent = "";
  const corner = el("div", "hd");
  corner.appendChild(el("b", null, "Quién"));
  corner.appendChild(el("span", null, people.length + (people.length === 1 ? " persona" : " personas")));
  boardEl.appendChild(corner);
  for (const c of COLS) {
    const h = el("div", "hd" + (c.year === 4 ? " year4" : c.year === 5 ? " year5" : ""));
    h.appendChild(el("b", null, c.label));
    h.appendChild(el("span", null, c.sub));
    boardEl.appendChild(h);
  }

  if (!visible.length) {
    boardEl.appendChild(el("div", "empty", people.length ? "Nadie coincide con la búsqueda." : "Todavía no hay nadie. Tocá \"Sumarme\" para armar tu fila."));
  }

  for (const p of visible) {
    const [pc, ps] = colorsFor(p.id);
    const mine = blocks.filter(b => b.personId === p.id);

    const who = el("div", "who");
    who.style.setProperty("--pc", pc);
    const top = el("div", "top");
    top.appendChild(el("span", "tag", p.name.trim().charAt(0).toUpperCase() || "?"));
    top.appendChild(el("span", "nm", p.name));
    who.appendChild(top);
    const cmPlacedAll = mine.filter(b => isCM(b) && COLMAP[b.col] && COLMAP[b.col].term).length;
    who.appendChild(el("span", "cm", `Campos Menores: ${p.cmDone} hechos · ${cmPlacedAll} ubicados`));
    if (p.situacion) who.appendChild(el("span", "sit", p.situacion));
    const acts = el("div", "acts");
    for (const [act, txt] of [["subj", "+ materia"], ["edit", "Editar"], ["del", "Borrar"]]) {
      const b = el("button", null, txt); b.type = "button"; b.dataset.pact = act; b.dataset.pid = p.id;
      acts.appendChild(b);
    }
    who.appendChild(acts);
    boardEl.appendChild(who);

    for (const c of COLS) {
      const cell = el("div", "cell" + (c.id === "tray" ? " tray" : ""));
      cell.dataset.p = p.id; cell.dataset.col = c.id;
      const selB = selected && blocks.find(b => b.id === selected);
      if (selB && selB.personId === p.id && selB.col !== c.id) {
        cell.classList.add("target");
        cell.setAttribute("role", "button");
        cell.setAttribute("aria-label", "Mover acá: " + c.label);
      }
      if (p.afuera && p.afuera === c.id) cell.appendChild(el("div", "away-note", "En otra universidad"));
      const items = mine.filter(b => b.col === c.id).sort((a, b) => nameOf(a).localeCompare(nameOf(b), "es"));

      if (c.id === "c4") {
        const oblig = items.filter(b => !isOpt(b));
        const hasCM = items.some(isCM);
        const cmHere = items.filter(isCM).length;
        const cmBefore = p.cmDone + cmPlacedAll - cmHere;
        const cmLeft = Math.max(0, CM_TOTAL - p.cmDone - cmPlacedAll);
        const okCM = hasCM && cmBefore >= CM_TOTAL - 1;
        cell.appendChild(el("div", "grad " + (oblig.length || okCM ? "ok" : "no"),
          oblig.length ? `Se recibe a fin de 2028: queda ${nameOf(oblig[0])}${oblig.length > 1 ? ` y ${oblig.length - 1} más` : ""}`
          : okCM ? "Se recibe a fin de 2028: queda su último Campo Menor"
          : hasCM ? "Este no sería su último Campo Menor: ubicá antes el que falta"
          : "Para recibirse a fin de 2028 tiene que quedar acá una obligatoria o su último Campo Menor"));
        if (cmLeft) cell.appendChild(el("div", "grad no",
          `${cmLeft === 1 ? "Falta ubicar 1 Campo Menor" : `Faltan ubicar ${cmLeft} Campos Menores`} (hizo ${p.cmDone} de ${CM_TOTAL})`));
      }

      for (const b of items) {
        const blk = el("div", "blk" + (b.debe ? " debe" : ""));
        blk.style.setProperty("--pc", pc); blk.style.setProperty("--ps", ps);
        blk.dataset.id = b.id;
        blk.tabIndex = 0;
        blk.setAttribute("role", "button");
        blk.setAttribute("aria-label", `${nameOf(b)}, ${c.label}. Flechas para mover.`);
        if (selected === b.id) blk.classList.add("sel");
        blk.appendChild(el("div", "bn", nameOf(b)));

        if (editing === b.id) {
          const ne = el("div", "noteedit note-ui");
          const ta = el("textarea"); ta.id = "note-" + b.id; ta.maxLength = 300;
          ta.placeholder = "Horario, profe, comisión, lo que sea"; ta.value = editDraft;
          ta.setAttribute("aria-label", "Nota de " + nameOf(b));
          const row = el("div");
          const ok = el("button", "primary", "Guardar"); ok.type = "button"; ok.dataset.act = "save";
          const no = el("button", null, "Cancelar"); no.type = "button"; no.dataset.act = "cancel";
          row.append(ok, no); ne.append(ta, row); blk.appendChild(ne);
        } else if (b.note) {
          const nt = el("div", "note note-ui", b.note); nt.dataset.act = "edit"; nt.title = "Editar nota";
          blk.appendChild(nt);
        } else {
          const an = el("button", "addnote note-ui", "+ nota"); an.type = "button"; an.dataset.act = "edit";
          blk.appendChild(an);
        }

        const meta = el("div", "meta");
        if (PLAN[b.code]) meta.appendChild(el("span", "pill", b.code));
        const info = PLAN[b.code];
        if (info && info[2].length === 1) meta.appendChild(el("span", "pill", `solo ${info[2][0]}C`));
        const sh = share[b.col + "|" + keyOf(b)];
        if (sh && sh.ps.length > 1) {
          const others = sh.ps.filter(n => n !== p.name);
          meta.appendChild(el("span", "pill junt", others.length <= 2 ? "con " + others.join(" y ") : `con ${others.length} más`));
        }
        blk.appendChild(meta);
        const ctl = el("div", "ctl");
        for (const [field, label, on] of [["opt", "Optativa", isOpt(b)], ["debe", "La debe", !!b.debe]]) {
          const sw = el("button", "sw", label);
          sw.type = "button"; sw.dataset.tog = field;
          sw.setAttribute("role", "switch"); sw.setAttribute("aria-checked", String(on));
          sw.setAttribute("aria-label", `${label}: ${nameOf(b)}`);
          ctl.appendChild(sw);
        }
        blk.appendChild(ctl);
        for (const t of warningsFor(b, mine, p)) { blk.classList.add("has-warn"); blk.appendChild(el("div", "warnmsg", t)); }
        const x = el("button", "x", "×"); x.type = "button"; x.dataset.del = b.id;
        x.setAttribute("aria-label", "Borrar " + nameOf(b));
        blk.appendChild(x);
        cell.appendChild(blk);
      }
      if (c.term) cell.appendChild(el("div", "n", items.length + (items.length === 1 ? " materia" : " materias")));
      boardEl.appendChild(cell);
    }
  }

  const foot = el("div", "foot");
  foot.appendChild(el("div", "jl lead"));
  const tl = el("div", "jl"); tl.appendChild(el("b", null, "Cursan juntos")); foot.appendChild(tl);
  for (const c of COLS.filter(c => c.term)) {
    const box = el("div", "jl"), ul = el("ul");
    Object.values(share).filter(s => s.col === c.id && s.ps.length > 1)
      .sort((a, b) => b.ps.length - a.ps.length)
      .forEach(s => {
        const li = el("li"); li.appendChild(el("strong", null, s.name));
        li.appendChild(document.createTextNode(" · " + s.ps.join(", ")));
        ul.appendChild(li);
      });
    if (!ul.children.length) ul.appendChild(el("li", null, "Ninguna"));
    box.appendChild(ul); foot.appendChild(box);
  }
  boardEl.appendChild(foot);
}

// ---------- Acciones ----------
function moveTo(id, col) {
  const b = blocks.find(x => x.id === id);
  if (!b || b.col === col) return;
  b.col = col; selected = null; render();
  store.updateBlock(id, { col }).catch(fail);
}

function closeNote(save) {
  const id = editing; if (!id) return;
  editing = null;
  const b = blocks.find(x => x.id === id);
  const t = editDraft.trim().slice(0, 300);
  editDraft = "";
  if (save && b) {
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

// arrastre con puntero
let press = null, ghost = null, overCell = null;
boardEl.addEventListener("pointerdown", ev => {
  const blk = ev.target.closest(".blk");
  if (!blk || ev.target.closest(".x") || ev.target.closest(".note-ui") || ev.target.closest(".ctl") || ev.button > 0) return;
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
    if (target) { if (pendingRemote) flushRemote(); moveTo(p.id, target.dataset.col); }
    else flushRemote();
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

boardEl.addEventListener("input", ev => { if (ev.target.tagName === "TEXTAREA") editDraft = ev.target.value; });

boardEl.addEventListener("click", ev => {
  const pact = ev.target.closest("[data-pact]");
  if (pact) {
    const pid = pact.dataset.pid;
    if (pact.dataset.pact === "subj") openSubj(pid);
    else if (pact.dataset.pact === "edit") openPerson(pid);
    else openDelete(pid);
    return;
  }
  const tog = ev.target.closest("[data-tog]");
  if (tog) {
    const b = blocks.find(x => x.id === tog.closest(".blk").dataset.id); if (!b) return;
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
    if (act.dataset.act === "edit") {
      if (editing && editing !== bid) closeNote(true);
      const b = blocks.find(x => x.id === bid);
      editing = bid; editDraft = (b && b.note) || ""; selected = null; render();
      const ta = $("note-" + bid);
      if (ta) { ta.focus(); ta.setSelectionRange(ta.value.length, ta.value.length); }
    } else closeNote(act.dataset.act === "save");
    return;
  }
  const del = ev.target.closest(".x");
  if (del) {
    const id = del.dataset.del;
    blocks = blocks.filter(b => b.id !== id); selected = null; render();
    store.deleteBlock(id).catch(fail);
    return;
  }
  const cell = ev.target.closest(".cell.target");
  if (cell && selected && !ev.target.closest(".blk")) moveTo(selected, cell.dataset.col);
});

boardEl.addEventListener("keydown", ev => {
  if (ev.target.tagName === "TEXTAREA") {
    if (ev.key === "Escape") { ev.preventDefault(); closeNote(false); }
    else if (ev.key === "Enter" && (ev.ctrlKey || ev.metaKey)) { ev.preventDefault(); closeNote(true); }
    return;
  }
  const blk = ev.target.closest && ev.target.closest(".blk");
  if (!blk || ev.target.tagName === "BUTTON") return;
  const b = blocks.find(x => x.id === blk.dataset.id); if (!b) return;
  const i = COLS.findIndex(c => c.id === b.col);
  const ni = ev.key === "ArrowRight" ? i + 1 : ev.key === "ArrowLeft" ? i - 1 : null;
  if (ni === null || ni < 0 || ni >= COLS.length) return;
  ev.preventDefault();
  moveTo(b.id, COLS[ni].id);
  const again = boardEl.querySelector(`.blk[data-id="${b.id}"]`);
  if (again) again.focus();
});

$("search").addEventListener("input", ev => { search = ev.target.value.trim().toLowerCase(); render(); });

// ---------- Diálogos ----------
const personDlg = $("personDlg"), subjDlg = $("subjDlg"), delDlg = $("delDlg");

function openPerson(pid) {
  editPersonId = pid || null;
  const p = pid ? personOf(pid) : null;
  $("personTitle").textContent = p ? "Editar a " + p.name : "Sumarme";
  $("personOk").textContent = p ? "Guardar" : "Sumarme";
  $("personHint").hidden = !!p;
  $("pName").value = p ? p.name : "";
  $("pCM").value = String(p ? p.cmDone : 0);
  $("pAway").value = p ? (p.afuera || "") : "";
  $("pSit").value = p ? (p.situacion || "") : "";
  personDlg.showModal();
  $("pName").focus();
}
$("joinBtn").addEventListener("click", () => openPerson(null));
$("personCancel").addEventListener("click", () => personDlg.close());
$("personForm").addEventListener("submit", ev => {
  ev.preventDefault();
  const name = $("pName").value.trim().slice(0, 40);
  if (!name) { $("pName").focus(); return; }
  const data = { name, cmDone: Number($("pCM").value), afuera: $("pAway").value, situacion: $("pSit").value.trim().slice(0, 300) };
  personDlg.close();
  if (editPersonId) {
    const p = personOf(editPersonId); if (p) Object.assign(p, data);
    render();
    store.updatePerson(editPersonId, data).catch(fail);
  } else {
    const id = store.newId();
    store.addPerson(id, { ...data, createdAt: Date.now() }, standardBlocks(data.cmDone)).catch(fail);
    search = ""; $("search").value = "";
  }
});

function buildPlanSelect() {
  const sel = $("sPlan");
  sel.appendChild(new Option("Elegí una materia…", ""));
  for (const year of [1, 2, 3, 4]) {
    const g = document.createElement("optgroup"); g.label = `${year}º año`;
    for (const [code, info] of Object.entries(PLAN)) if (info[1] === year) g.appendChild(new Option(`${info[0]} (${code})`, code));
    sel.appendChild(g);
  }
  sel.appendChild(new Option("Curso de Campo Menor (genérico)", "CM"));
}
buildPlanSelect();

function openSubj(pid) {
  subjPersonId = pid;
  $("subjWho").textContent = personOf(pid) ? personOf(pid).name : "";
  $("sPlan").value = ""; $("sFree").value = ""; $("sCol").value = "c1";
  subjDlg.showModal();
  $("sPlan").focus();
}
// al elegir una materia que se dicta en un solo cuatrimestre, proponer el primero en que se puede
$("sPlan").addEventListener("change", () => {
  const info = PLAN[$("sPlan").value];
  const cur = COLMAP[$("sCol").value];
  if (info && info[2].length === 1 && cur.term !== info[2][0]) $("sCol").value = info[2][0] === 1 ? "c1" : "c2";
});
$("subjCancel").addEventListener("click", () => subjDlg.close());
$("subjForm").addEventListener("submit", ev => {
  ev.preventDefault();
  const code = $("sPlan").value, free = $("sFree").value.trim().slice(0, 60);
  if (!code && !free) { $("sPlan").focus(); return; }
  const b = { personId: subjPersonId, col: $("sCol").value };
  if (free) { b.code = "X"; b.name = free; b.opt = true; }
  else { b.code = code; b.opt = code === "CM"; if (PLAN[code] && PLAN[code][1] < 4) b.debe = true; }
  subjDlg.close();
  store.addBlock(b).catch(fail);
});

function openDelete(pid) {
  delPersonId = pid;
  $("delWho").textContent = personOf(pid) ? personOf(pid).name : "";
  delDlg.showModal();
}
$("delCancel").addEventListener("click", () => delDlg.close());
$("delForm").addEventListener("submit", ev => {
  ev.preventDefault();
  const pid = delPersonId; delDlg.close();
  const ids = blocks.filter(b => b.personId === pid).map(b => b.id);
  people = people.filter(p => p.id !== pid); blocks = blocks.filter(b => b.personId !== pid);
  render();
  store.deletePerson(pid, ids).catch(fail);
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
    if (fresh) { clearTimeout(timer); if (store.shared) setStatus("ok", "Conectado: los cambios se guardan para todos"); }
    if (dragging || editing) { pendingRemote = [P, B]; return; }
    people = P; blocks = B;
    if (selected && !blocks.find(b => b.id === selected)) selected = null;
    render();
  }, e => { clearTimeout(timer); console.error(e); setStatus("warn", "Se cortó la conexión con la base. Recargá la página."); });
  store.seedOnce(SEED).catch(e => console.error(e));
}
start();
