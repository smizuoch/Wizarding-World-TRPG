const STORAGE_KEY = 'wwtrpg.characters.v1';
const CURRENT_KEY = 'wwtrpg.currentId.v1';

const form = document.getElementById('character-form');
const saveButton = document.getElementById('save-local');
const exportButton = document.getElementById('export-json');
const clearButton = document.getElementById('clear-form');
const viewerToggle = document.getElementById('viewer-toggle');
const editToggle = document.getElementById('edit-toggle');
const importFile = document.getElementById('import-file');
const savedList = document.getElementById('saved-list');
const copyCcfButton = document.getElementById('copy-ccfolia');
const catchphraseField = document.getElementById('catchphrase');
const ccfoliaOutput = document.getElementById('ccfolia-output');
const calcDerivedButton = document.getElementById('calc-derived');
const rollStatsButton = document.getElementById('roll-stats');
const addCustomSkillButton = document.getElementById('add-custom-skill');
const skillRowTemplate = document.getElementById('skill-row-template');
const occupationPointsField = document.getElementById('occupation-points');
const interestPointsField = document.getElementById('interest-points');

let currentId = null;

const statLabels = {
  str: 'STR',
  con: 'CON',
  siz: 'SIZ',
  dex: 'DEX',
  app: 'APP',
  int: 'INT',
  pow: 'POW',
  edu: 'EDU',
};

const createSkill = (name, base, options = {}) => ({
  name,
  base,
  baseMode: options.baseMode || 'fixed',
  locked: options.locked !== undefined ? options.locked : true,
  group: options.group,
});

const SKILL_GROUPS = [
  {
    id: 'general',
    label: '一般技能',
    skills: [
      createSkill('回避', null, { baseMode: 'dexHalf' }),
      createSkill('キック', 25),
      createSkill('組み付き', 25),
      createSkill('こぶし（パンチ）', 25),
      createSkill('頭突き', 10),
      createSkill('投擲', 20),
      createSkill('マーシャルアーツ', 1),
      createSkill('拳銃', 20),
      createSkill('サブマシンガン', 15),
      createSkill('ショットガン', 25),
      createSkill('マシンガン', 10),
      createSkill('ライフル', 25),
      createSkill('応急手当', 30),
      createSkill('鍵開け', 1),
      createSkill('隠す', 15),
      createSkill('隠れる', 20),
      createSkill('聞き耳', 20),
      createSkill('忍び歩き', 20),
      createSkill('写真術', 10),
      createSkill('精神分析', 1),
      createSkill('追跡', 10),
      createSkill('登攀', 20),
      createSkill('図書館', 20),
      createSkill('目星', 25),
      createSkill('運転（自由記入）', 20, { locked: false }),
      createSkill('機械修理', 10),
      createSkill('重機械操作', 1),
      createSkill('乗馬', 5),
      createSkill('水泳', 20),
      createSkill('製作（自由記入）', 5, { locked: false }),
      createSkill('操縦（自由記入）', 1, { locked: false }),
      createSkill('跳躍', 20),
      createSkill('電気修理', 10),
      createSkill('ナビゲート', 10),
      createSkill('変装', 5),
      createSkill('言いくるめ', 5),
      createSkill('信用', 0),
      createSkill('説得', 10),
      createSkill('値切り', 5),
      createSkill('魅惑', 15),
      createSkill('威圧', 15),
      createSkill('母国語（自由記入）', null, { baseMode: 'edu', locked: false }),
      createSkill('ほかの言語（自由記入）', 1, { locked: false }),
      createSkill('医学', 1),
      createSkill('オカルト', 5),
      createSkill('化学', 1),
      createSkill('クトゥルフ神話', 0),
      createSkill('芸術（自由記入）', 5, { locked: false }),
      createSkill('経理', 5),
      createSkill('考古学', 1),
      createSkill('コンピューター', 5),
      createSkill('心理学', 10),
      createSkill('人類学', 1),
      createSkill('生物学', 1),
      createSkill('地質学', 1),
      createSkill('電子工学', 1),
      createSkill('天文学', 1),
      createSkill('博物学', 10),
      createSkill('物理学', 1),
      createSkill('法律', 5),
      createSkill('薬学', 1),
      createSkill('歴史', 5),
    ],
  },
  {
    id: 'magic',
    label: '魔法技能',
    skills: [
      createSkill('撃て（フリペンド）', 1),
      createSkill('目くらまし術', 1),
      createSkill('開け（アロホモラ）', 1),
      createSkill('閉まれ（コロポータス）', 1),
      createSkill('来い（アクシオ）', 1),
      createSkill('燃えよ（インセンディオ）', 1),
      createSkill('水よ（アグアメンティ）', 1),
      createSkill('現れよ（アパレシウム）', 1),
      createSkill('忘れよ（オブリビエイト）', 1),
      createSkill('浮遊せよ（ウィンガーディアム・レヴィオーサ）', 1),
      createSkill('動くな（イモビラス）', 1),
      createSkill('癒えよ（エピスキー）', 1),
      createSkill('直れ（レパロ）', 1),
      createSkill('開心（レジリメンス）', 1),
      createSkill('暴け（レベリオ）', 1),
      createSkill('弾け（インパービアス）', 1),
      createSkill('守護霊よ来たれ', 1),
      createSkill('武器よ去れ（エクスペリアームス）', 1),
      createSkill('麻痺せよ（ステューピファイ）', 1),
      createSkill('活きよ（エネルベート）', 1),
      createSkill('爆発せよ（コンフリンゴ）', 1),
      createSkill('凍れ（グレイシアス）', 1),
      createSkill('呪文よ終われ（フィニート・インカンターテム）', 1),
      createSkill('護れ（プロテゴ）', 1),
      createSkill('石になれ（ペトリフィカス・トタルス）', 1),
      createSkill('服従せよ（インペリオ）', 1),
      createSkill('苦しめ（クルーシオ）', 1),
      createSkill('息絶えよ（アバダ・ケダブラ）', 1),
    ],
  },
];

function generateId() {
  if (window.crypto && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getValue(name) {
  const el = form.elements[name];
  if (!el) return '';
  if (Array.isArray(el)) return '';
  return el.value.trim();
}

function setValue(name, value) {
  const el = form.elements[name];
  if (!el) return;
  el.value = value ?? '';
}

function parseNumber(value) {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
}

function getStatsSnapshot() {
  return {
    str: parseNumber(getValue('stats.str')),
    con: parseNumber(getValue('stats.con')),
    siz: parseNumber(getValue('stats.siz')),
    dex: parseNumber(getValue('stats.dex')),
    app: parseNumber(getValue('stats.app')),
    int: parseNumber(getValue('stats.int')),
    pow: parseNumber(getValue('stats.pow')),
    edu: parseNumber(getValue('stats.edu')),
  };
}

function randomInt(max) {
  if (max <= 0) return 0;
  if (window.crypto && crypto.getRandomValues) {
    const buffer = new Uint32Array(1);
    crypto.getRandomValues(buffer);
    return buffer[0] % max;
  }
  return Math.floor(Math.random() * max);
}

function rollDice(count, sides) {
  let total = 0;
  for (let i = 0; i < count; i += 1) {
    total += randomInt(sides) + 1;
  }
  return total;
}

function computeSkillBase(skill, stats) {
  if (skill.baseMode === 'dexHalf') {
    return Math.floor(stats.dex / 2);
  }
  if (skill.baseMode === 'edu') {
    return stats.edu;
  }
  return parseNumber(skill.base);
}

function buildDefaultSkills(stats = getStatsSnapshot()) {
  const list = [];
  SKILL_GROUPS.forEach((group) => {
    group.skills.forEach((skill) => {
      const baseValue = computeSkillBase(skill, stats);
      list.push({
        name: skill.name,
        base: baseValue,
        add: 0,
        total: baseValue,
        note: '',
        growth: false,
        group: group.id,
        baseMode: skill.baseMode,
        locked: skill.locked,
      });
    });
  });
  return list;
}

function normalizeSkills(rawSkills = []) {
  const normalized = rawSkills.map((skill) => {
    if (skill && Object.prototype.hasOwnProperty.call(skill, 'value')) {
      return {
        name: skill.name || '',
        base: parseNumber(skill.value),
        add: 0,
        total: parseNumber(skill.value),
        note: skill.note || '',
        growth: false,
        group: 'custom',
        baseMode: 'fixed',
        locked: false,
      };
    }
    return {
      name: skill?.name || '',
      base: parseNumber(skill?.base),
      add: parseNumber(skill?.add),
      total: parseNumber(skill?.total),
      note: skill?.note || '',
      growth: Boolean(skill?.growth),
      group: skill?.group || 'custom',
      baseMode: skill?.baseMode || 'fixed',
      locked: Boolean(skill?.locked),
    };
  });

  const defaults = buildDefaultSkills();
  const byName = new Map(normalized.map((skill) => [skill.name, skill]));
  defaults.forEach((skill) => {
    if (!byName.has(skill.name)) {
      normalized.push(skill);
    } else {
      const existing = byName.get(skill.name);
      const defaultBaseMode = skill.baseMode || 'fixed';
      if (!existing.group || existing.group === 'custom') {
        existing.group = skill.group;
      }
      if (defaultBaseMode !== 'fixed') {
        existing.baseMode = defaultBaseMode;
      }
      existing.locked = existing.locked || skill.locked;
    }
  });

  return normalized;
}

function getSkillContainers() {
  return {
    general: document.querySelector('[data-skill-rows="general"]'),
    magic: document.querySelector('[data-skill-rows="magic"]'),
    custom: document.querySelector('[data-skill-rows="custom"]'),
  };
}

function updateSkillRowTotal(row) {
  if (!row) return;
  const baseInput = row.querySelector('[data-skill-base]');
  const addInput = row.querySelector('[data-skill-add]');
  const totalInput = row.querySelector('[data-skill-total]');
  if (!baseInput || !addInput || !totalInput) return;
  const baseValue = parseNumber(baseInput.value);
  const addValue = parseNumber(addInput.value);
  totalInput.value = baseValue + addValue;
}

function createSkillRow(skill) {
  if (!skillRowTemplate) return null;
  const fragment = skillRowTemplate.content.cloneNode(true);
  const row = fragment.querySelector('[data-skill-row]');
  if (!row) return null;

  row.dataset.group = skill.group || 'custom';
  row.dataset.baseMode = skill.baseMode || 'fixed';
  row.dataset.locked = skill.locked ? 'true' : 'false';

  const nameInput = row.querySelector('[data-skill-name]');
  const baseInput = row.querySelector('[data-skill-base]');
  const addInput = row.querySelector('[data-skill-add]');
  const totalInput = row.querySelector('[data-skill-total]');
  const noteInput = row.querySelector('[data-skill-note]');
  const growthInput = row.querySelector('[data-skill-growth]');
  const removeButton = row.querySelector('[data-action="remove-skill"]');

  if (nameInput) {
    nameInput.value = skill.name || '';
    if (skill.locked) {
      nameInput.readOnly = true;
    }
  }
  if (baseInput) {
    baseInput.value = Number.isFinite(skill.base) ? skill.base : parseNumber(skill.base);
    if (skill.locked || (skill.baseMode && skill.baseMode !== 'fixed')) {
      baseInput.readOnly = true;
    }
  }
  if (addInput) {
    addInput.value = Number.isFinite(skill.add) ? skill.add : parseNumber(skill.add);
  }
  if (totalInput) {
    const totalValue = parseNumber(baseInput?.value) + parseNumber(addInput?.value);
    totalInput.value = totalValue;
  }
  if (noteInput) {
    noteInput.value = skill.note || '';
  }
  if (growthInput) {
    growthInput.checked = Boolean(skill.growth);
  }
  if (removeButton && skill.locked) {
    removeButton.disabled = true;
  }

  return row;
}

function renderSkills(skills) {
  const containers = getSkillContainers();
  Object.values(containers).forEach((container) => {
    if (container) {
      container.innerHTML = '';
    }
  });

  skills.forEach((skill) => {
    const container = containers[skill.group] || containers.custom;
    if (!container) return;
    const row = createSkillRow(skill);
    if (row) {
      container.appendChild(row);
    }
  });

  applyDerivedSkillBases();
}

function collectSkills() {
  const rows = [...document.querySelectorAll('[data-skill-row]')];
  return rows
    .map((row) => {
      const name = row.querySelector('[data-skill-name]')?.value.trim() || '';
      const base = row.querySelector('[data-skill-base]')?.value || '';
      const add = row.querySelector('[data-skill-add]')?.value || '';
      const total = row.querySelector('[data-skill-total]')?.value || '';
      const note = row.querySelector('[data-skill-note]')?.value.trim() || '';
      const growth = Boolean(row.querySelector('[data-skill-growth]')?.checked);
      return {
        name,
        base: parseNumber(base),
        add: parseNumber(add),
        total: parseNumber(total),
        note,
        growth,
        group: row.dataset.group || 'custom',
        baseMode: row.dataset.baseMode || 'fixed',
        locked: row.dataset.locked === 'true',
      };
    })
    .filter((skill) => skill.name || skill.base || skill.add || skill.note);
}

function applyDerivedSkillBases() {
  const stats = getStatsSnapshot();
  document.querySelectorAll('[data-skill-row]').forEach((row) => {
    const mode = row.dataset.baseMode || 'fixed';
    const baseInput = row.querySelector('[data-skill-base]');
    if (!baseInput) return;
    if (mode === 'dexHalf') {
      baseInput.value = Math.floor(stats.dex / 2) || 0;
    } else if (mode === 'edu') {
      baseInput.value = stats.edu || 0;
    }
    updateSkillRowTotal(row);
  });
}

function addCustomSkillRow() {
  const containers = getSkillContainers();
  const container = containers.custom;
  if (!container) return;
  const row = createSkillRow({
    name: '',
    base: 0,
    add: 0,
    total: 0,
    note: '',
    growth: false,
    group: 'custom',
    baseMode: 'fixed',
    locked: false,
  });
  if (row) {
    container.appendChild(row);
  }
}

function resetSkillsToDefault() {
  renderSkills(buildDefaultSkills());
}

function calcDamageBuild(str, siz) {
  const total = str + siz;
  if (total <= 64) {
    return { build: -2, damageBonus: '-2' };
  }
  if (total <= 84) {
    return { build: -1, damageBonus: '-1' };
  }
  if (total <= 124) {
    return { build: 0, damageBonus: '0' };
  }
  if (total <= 164) {
    return { build: 1, damageBonus: '+1D4' };
  }
  if (total <= 204) {
    return { build: 2, damageBonus: '+1D6' };
  }
  return { build: 3, damageBonus: '+2D6' };
}

function calcDerivedStats() {
  const stats = getStatsSnapshot();
  const hp = Math.floor((stats.con + stats.siz) / 10);
  const mp = stats.pow;
  const san = stats.pow;
  const move = 8;
  const { build, damageBonus } = calcDamageBuild(stats.str, stats.siz);
  return { hp, mp, san, move, build, damageBonus };
}

function updateSkillPointTotals() {
  const stats = getStatsSnapshot();
  if (occupationPointsField) {
    occupationPointsField.value = stats.edu ? stats.edu * 4 : '';
  }
  if (interestPointsField) {
    interestPointsField.value = stats.int ? stats.int * 2 : '';
  }
}

function rollStats() {
  const rolled = {
    str: rollDice(3, 6) * 5,
    con: rollDice(3, 6) * 5,
    siz: (rollDice(2, 6) + 6) * 5,
    dex: rollDice(3, 6) * 5,
    app: rollDice(3, 6) * 5,
    int: (rollDice(2, 6) + 6) * 5,
    pow: rollDice(3, 6) * 5,
    edu: (rollDice(2, 6) + 6) * 5,
  };

  Object.entries(rolled).forEach(([key, value]) => {
    setValue(`stats.${key}`, value);
  });

  recalcStats();
  updatePreview(collectData());
}

function setupSkillTable() {
  const skillTable = document.querySelector('.skill-table');
  if (!skillTable) return;

  skillTable.addEventListener('input', (event) => {
    if (event.target.matches('[data-skill-base], [data-skill-add]')) {
      const row = event.target.closest('[data-skill-row]');
      updateSkillRowTotal(row);
    }
  });

  skillTable.addEventListener('click', (event) => {
    if (event.target.matches('[data-action="remove-skill"]')) {
      const row = event.target.closest('[data-skill-row]');
      if (row && row.dataset.locked !== 'true') {
        row.remove();
      }
    }
  });

  if (addCustomSkillButton) {
    addCustomSkillButton.addEventListener('click', () => {
      addCustomSkillRow();
    });
  }
}

function setupRepeaters() {
  document.querySelectorAll('[data-repeater]').forEach((section) => {
    const addButton = section.querySelector('[data-action="add-row"]');
    if (addButton) {
      addButton.addEventListener('click', () => addRow(section));
    }
    section.addEventListener('click', (event) => {
      if (event.target.matches('[data-action="remove-row"]')) {
        const row = event.target.closest('[data-row]');
        if (row) {
          const rows = section.querySelectorAll('[data-row]');
          if (rows.length > 1) {
            row.remove();
          } else {
            row.querySelectorAll('input').forEach((input) => {
              input.value = '';
            });
          }
          schedulePreviewUpdate();
        }
      }
    });
  });
}

function addRow(section) {
  const template = section.querySelector('template[data-template]');
  const rowsContainer = section.querySelector('[data-rows]');
  if (!template || !rowsContainer) return;
  const fragment = template.content.cloneNode(true);
  rowsContainer.appendChild(fragment);
}

function collectRepeater(name) {
  const section = document.querySelector(`[data-repeater="${name}"]`);
  if (!section) return [];
  const rows = [...section.querySelectorAll('[data-row]')];
  return rows
    .map((row) => {
      const entry = {};
      row.querySelectorAll('[data-field]').forEach((input) => {
        entry[input.dataset.field] = input.value.trim();
      });
      return entry;
    })
    .filter((entry) => Object.values(entry).some((value) => value));
}

function setRepeater(name, values = []) {
  const section = document.querySelector(`[data-repeater="${name}"]`);
  if (!section) return;
  const rowsContainer = section.querySelector('[data-rows]');
  const template = section.querySelector('template[data-template]');
  if (!rowsContainer || !template) return;

  rowsContainer.innerHTML = '';
  const list = values.length ? values : [{}];
  list.forEach((value) => {
    const fragment = template.content.cloneNode(true);
    const row = fragment.querySelector('[data-row]');
    if (row && value) {
      row.querySelectorAll('[data-field]').forEach((input) => {
        const key = input.dataset.field;
        input.value = value[key] ?? '';
      });
    }
    rowsContainer.appendChild(fragment);
  });
}

function collectData() {
  const data = {
    id: currentId ?? generateId(),
    savedAt: new Date().toISOString(),
    version: 2,
    profile: {
      name: getValue('profile.name'),
      kana: getValue('profile.kana'),
      player: getValue('profile.player'),
      house: getValue('profile.house'),
      year: getValue('profile.year'),
      blood: getValue('profile.blood'),
      job: getValue('profile.job'),
      age: getValue('profile.age'),
      gender: getValue('profile.gender'),
      height: getValue('profile.height'),
      wand: getValue('profile.wand'),
      patronus: getValue('profile.patronus'),
      familiar: getValue('profile.familiar'),
      color: getValue('profile.color'),
      imageUrl: getValue('profile.imageUrl'),
      appearance: getValue('profile.appearance'),
      concept: getValue('profile.concept'),
      catchphrase: catchphraseField ? catchphraseField.value.trim() : '',
    },
    stats: {
      str: getValue('stats.str'),
      con: getValue('stats.con'),
      siz: getValue('stats.siz'),
      dex: getValue('stats.dex'),
      app: getValue('stats.app'),
      int: getValue('stats.int'),
      pow: getValue('stats.pow'),
      edu: getValue('stats.edu'),
    },
    derived: {
      hpCurrent: getValue('derived.hpCurrent'),
      hpMax: getValue('derived.hpMax'),
      mpCurrent: getValue('derived.mpCurrent'),
      mpMax: getValue('derived.mpMax'),
      sanCurrent: getValue('derived.sanCurrent'),
      sanMax: getValue('derived.sanMax'),
      luckCurrent: getValue('derived.luckCurrent'),
      luckMax: getValue('derived.luckMax'),
      move: getValue('derived.move'),
      build: getValue('derived.build'),
      damageBonus: getValue('derived.damageBonus'),
      initiative: getValue('derived.initiative'),
      outfit: getValue('derived.outfit'),
    },
    lists: {
      skills: collectSkills(),
      spells: collectRepeater('spells'),
      items: collectRepeater('items'),
      bonds: collectRepeater('bonds'),
    },
    notes: {
      backstory: getValue('notes.backstory'),
      personality: getValue('notes.personality'),
      memo: getValue('notes.memo'),
      goal: getValue('notes.goal'),
    },
    chat: {
      palette: getValue('chat.palette'),
    },
  };

  return data;
}

function loadData(data) {
  if (!data) return;
  currentId = data.id ?? null;

  setValue('profile.name', data.profile?.name);
  setValue('profile.kana', data.profile?.kana);
  setValue('profile.player', data.profile?.player);
  setValue('profile.house', data.profile?.house);
  setValue('profile.year', data.profile?.year);
  setValue('profile.blood', data.profile?.blood);
  setValue('profile.job', data.profile?.job);
  setValue('profile.age', data.profile?.age);
  setValue('profile.gender', data.profile?.gender);
  setValue('profile.height', data.profile?.height);
  setValue('profile.wand', data.profile?.wand);
  setValue('profile.patronus', data.profile?.patronus);
  setValue('profile.familiar', data.profile?.familiar);
  setValue('profile.color', data.profile?.color || '#6a4524');
  setValue('profile.imageUrl', data.profile?.imageUrl);
  setValue('profile.appearance', data.profile?.appearance);
  setValue('profile.concept', data.profile?.concept);
  if (catchphraseField) {
    catchphraseField.value = data.profile?.catchphrase || '';
  }

  setValue('stats.str', data.stats?.str);
  setValue('stats.con', data.stats?.con);
  setValue('stats.siz', data.stats?.siz);
  setValue('stats.dex', data.stats?.dex);
  setValue('stats.app', data.stats?.app);
  setValue('stats.int', data.stats?.int);
  setValue('stats.pow', data.stats?.pow);
  setValue('stats.edu', data.stats?.edu);

  setValue('derived.hpCurrent', data.derived?.hpCurrent);
  setValue('derived.hpMax', data.derived?.hpMax);
  setValue('derived.mpCurrent', data.derived?.mpCurrent);
  setValue('derived.mpMax', data.derived?.mpMax);
  setValue('derived.sanCurrent', data.derived?.sanCurrent);
  setValue('derived.sanMax', data.derived?.sanMax);
  setValue('derived.luckCurrent', data.derived?.luckCurrent);
  setValue('derived.luckMax', data.derived?.luckMax);
  setValue('derived.move', data.derived?.move);
  setValue('derived.build', data.derived?.build);
  setValue('derived.damageBonus', data.derived?.damageBonus);
  setValue('derived.initiative', data.derived?.initiative);
  setValue('derived.outfit', data.derived?.outfit);

  const skillData = normalizeSkills(data.lists?.skills || []);
  renderSkills(skillData);
  setRepeater('spells', data.lists?.spells);
  setRepeater('items', data.lists?.items);
  setRepeater('bonds', data.lists?.bonds);

  setValue('notes.backstory', data.notes?.backstory);
  setValue('notes.personality', data.notes?.personality);
  setValue('notes.memo', data.notes?.memo);
  setValue('notes.goal', data.notes?.goal);

  setValue('chat.palette', data.chat?.palette);

  recalcStats();
  updatePreview(collectData());
}

function recalcStats() {
  document.querySelectorAll('.stat-row').forEach((row) => {
    const baseInput = row.querySelector('[data-stat-base]');
    const halfInput = row.querySelector('[data-stat-half]');
    const fifthInput = row.querySelector('[data-stat-fifth]');
    if (!baseInput || !halfInput || !fifthInput) return;

    const base = parseNumber(baseInput.value);
    if (!base) {
      halfInput.value = '';
      fifthInput.value = '';
      return;
    }
    halfInput.value = Math.floor(base / 2);
    fifthInput.value = Math.floor(base / 5);
  });

  applyDerivedSkillBases();
  updateSkillPointTotals();
}

function buildCocofolia(data) {
  const status = [
    {
      label: 'HP',
      value: parseNumber(data.derived.hpCurrent),
      max: parseNumber(data.derived.hpMax),
    },
    {
      label: 'MP',
      value: parseNumber(data.derived.mpCurrent),
      max: parseNumber(data.derived.mpMax),
    },
    {
      label: 'SAN',
      value: parseNumber(data.derived.sanCurrent),
      max: parseNumber(data.derived.sanMax),
    },
    {
      label: '幸運',
      value: parseNumber(data.derived.luckCurrent),
      max: parseNumber(data.derived.luckMax),
    },
  ].filter((item) => item.value || item.max);

  const params = [];
  Object.entries(data.stats).forEach(([key, value]) => {
    if (value) {
      params.push({ label: statLabels[key], value: value });
    }
  });

  const basicParams = [
    ['ハウス', data.profile.house],
    ['学年/所属', data.profile.year],
    ['血統', data.profile.blood],
    ['職業/役割', data.profile.job],
    ['杖', data.profile.wand],
    ['守護霊', data.profile.patronus],
    ['相棒', data.profile.familiar],
    ['移動率', data.derived.move],
    ['ビルド', data.derived.build],
    ['ダメージボーナス', data.derived.damageBonus],
  ];
  basicParams.forEach(([label, value]) => {
    if (value) {
      params.push({ label, value: String(value) });
    }
  });

  const memoBlocks = [];
  if (data.profile.appearance) memoBlocks.push(`【外見】\n${data.profile.appearance}`);
  if (data.profile.concept) memoBlocks.push(`【コンセプト】\n${data.profile.concept}`);
  if (data.notes.backstory) memoBlocks.push(`【来歴】\n${data.notes.backstory}`);
  if (data.notes.personality) memoBlocks.push(`【性格/信条】\n${data.notes.personality}`);
  if (data.notes.goal) memoBlocks.push(`【目標】\n${data.notes.goal}`);
  if (data.notes.memo) memoBlocks.push(`【メモ】\n${data.notes.memo}`);

  return {
    kind: 'character',
    data: {
      name: data.profile.name || '名無しの魔法使い',
      memo: memoBlocks.join('\n\n'),
      initiative: parseNumber(data.derived.initiative),
      externalUrl: '',
      iconUrl: '',
      status,
      params,
      commands: data.chat.palette || '',
      color: data.profile.color || '#6a4524',
    },
  };
}

function updatePreview(data) {
  document.getElementById('preview-name').textContent = data.profile.name || '名無しの魔法使い';
  const meta = [data.profile.kana, data.profile.player].filter(Boolean).join(' / ');
  document.getElementById('preview-meta').textContent = meta || '読み込み待ち';

  const tags = [
    data.profile.house,
    data.profile.year,
    data.profile.blood,
    data.profile.job,
    data.profile.wand,
    data.profile.patronus,
  ].filter(Boolean);

  const tagWrap = document.getElementById('preview-tags');
  tagWrap.innerHTML = '';
  tags.forEach((tag) => {
    const span = document.createElement('span');
    span.className = 'tag';
    span.textContent = tag;
    tagWrap.appendChild(span);
  });

  const statsList = document.getElementById('preview-stats');
  statsList.innerHTML = '';
  Object.entries(data.stats).forEach(([key, value]) => {
    if (value) {
      const li = document.createElement('li');
      li.textContent = `${statLabels[key]} ${value}`;
      statsList.appendChild(li);
    }
  });

  const skillList = document.getElementById('preview-skills');
  skillList.innerHTML = '';
  data.lists.skills.slice(0, 6).forEach((skill) => {
    const li = document.createElement('li');
    const totalValue =
      parseNumber(skill.total) ||
      parseNumber(skill.base) + parseNumber(skill.add) ||
      parseNumber(skill.value);
    li.textContent = `${skill.name || '技能'} ${totalValue || ''}`.trim();
    skillList.appendChild(li);
  });

  const spellList = document.getElementById('preview-spells');
  spellList.innerHTML = '';
  data.lists.spells.slice(0, 6).forEach((spell) => {
    const li = document.createElement('li');
    li.textContent = spell.name || '呪文';
    spellList.appendChild(li);
  });

  const itemList = document.getElementById('preview-items');
  itemList.innerHTML = '';
  data.lists.items.slice(0, 6).forEach((item) => {
    const li = document.createElement('li');
    const qty = item.qty ? ` x${item.qty}` : '';
    li.textContent = `${item.name || 'アイテム'}${qty}`;
    itemList.appendChild(li);
  });

  const notes = [data.notes.backstory, data.notes.memo].filter(Boolean).join('\n');
  document.getElementById('preview-notes').textContent = notes || 'まだメモがありません。';

  const ccf = buildCocofolia(data);
  if (ccfoliaOutput) {
    ccfoliaOutput.value = JSON.stringify(ccf, null, 2);
  }
}

function saveToLocal(data) {
  const list = loadList();
  const index = list.findIndex((item) => item.id === data.id);
  if (index >= 0) {
    list[index] = data;
  } else {
    list.unshift(data);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  localStorage.setItem(CURRENT_KEY, data.id);
  currentId = data.id;
  renderSavedList(list);
}

function loadList() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch (error) {
    return [];
  }
}

function renderSavedList(list) {
  savedList.innerHTML = '';
  if (!list.length) {
    savedList.innerHTML = '<p class="muted">まだ保存がありません。</p>';
    return;
  }

  list.forEach((item) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'saved-item';

    const label = document.createElement('span');
    label.textContent = item.profile?.name || '名無しの魔法使い';

    const actions = document.createElement('div');
    actions.className = 'saved-actions';

    const loadButton = document.createElement('button');
    loadButton.className = 'btn ghost';
    loadButton.type = 'button';
    loadButton.textContent = '読み込み';
    loadButton.addEventListener('click', () => {
      loadData(item);
      setMode('edit');
    });

    const deleteButton = document.createElement('button');
    deleteButton.className = 'btn ghost';
    deleteButton.type = 'button';
    deleteButton.textContent = '削除';
    deleteButton.addEventListener('click', () => {
      const nextList = loadList().filter((entry) => entry.id !== item.id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextList));
      if (currentId === item.id) {
        currentId = null;
        localStorage.removeItem(CURRENT_KEY);
      }
      renderSavedList(nextList);
    });

    actions.appendChild(loadButton);
    actions.appendChild(deleteButton);
    wrapper.appendChild(label);
    wrapper.appendChild(actions);
    savedList.appendChild(wrapper);
  });
}

function exportJson(data) {
  const filenameBase = data.profile.name ? data.profile.name.replace(/\s+/g, '_') : 'character';
  const filename = `${filenameBase}_wwtrpg.json`;
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function setMode(mode) {
  document.body.dataset.mode = mode;
  const disabled = mode === 'view';
  form.querySelectorAll('input, select, textarea').forEach((field) => {
    field.disabled = disabled;
  });
  document
    .querySelectorAll(
      '[data-action="remove-row"], [data-action="add-row"], [data-action="remove-skill"], #add-custom-skill, #calc-derived'
    )
    .forEach((button) => {
      button.disabled = disabled;
    });
  if (catchphraseField) {
    catchphraseField.disabled = disabled;
  }
  if (importFile) {
    importFile.disabled = false;
  }
}

let previewTimer;
function schedulePreviewUpdate() {
  window.clearTimeout(previewTimer);
  previewTimer = window.setTimeout(() => {
    recalcStats();
    updatePreview(collectData());
  }, 120);
}

if (calcDerivedButton) {
  calcDerivedButton.addEventListener('click', () => {
    const derived = calcDerivedStats();
    if (derived.hp) {
      setValue('derived.hpMax', derived.hp);
      if (!getValue('derived.hpCurrent')) {
        setValue('derived.hpCurrent', derived.hp);
      }
    }
    if (derived.mp) {
      setValue('derived.mpMax', derived.mp);
      if (!getValue('derived.mpCurrent')) {
        setValue('derived.mpCurrent', derived.mp);
      }
    }
    if (derived.san) {
      setValue('derived.sanMax', derived.san);
      if (!getValue('derived.sanCurrent')) {
        setValue('derived.sanCurrent', derived.san);
      }
    }
    setValue('derived.move', derived.move);
    setValue('derived.build', derived.build);
    setValue('derived.damageBonus', derived.damageBonus);
    updatePreview(collectData());
  });
}

if (rollStatsButton) {
  rollStatsButton.addEventListener('click', () => {
    rollStats();
  });
}

form.addEventListener('input', schedulePreviewUpdate);
form.addEventListener('submit', (event) => event.preventDefault());

saveButton.addEventListener('click', () => {
  const data = collectData();
  saveToLocal(data);
  updatePreview(data);
});

exportButton.addEventListener('click', () => {
  const data = collectData();
  exportJson(data);
});

clearButton.addEventListener('click', () => {
  currentId = null;
  form.reset();
  resetSkillsToDefault();
  setRepeater('spells', []);
  setRepeater('items', []);
  setRepeater('bonds', []);
  if (catchphraseField) {
    catchphraseField.value = '';
  }
  recalcStats();
  updatePreview(collectData());
  setMode('edit');
});

viewerToggle.addEventListener('click', () => {
  setMode('view');
  document.getElementById('viewer').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

editToggle.addEventListener('click', () => {
  setMode('edit');
});

if (importFile) {
  importFile.addEventListener('change', (event) => {
    const [file] = event.target.files;
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        loadData(data);
        setMode('view');
      } catch (error) {
        alert('読み込みに失敗しました。JSONファイルを確認してください。');
      }
    };
    reader.readAsText(file);
  });
}

copyCcfButton.addEventListener('click', async () => {
  if (!ccfoliaOutput) return;
  try {
    await navigator.clipboard.writeText(ccfoliaOutput.value);
  } catch (error) {
    ccfoliaOutput.select();
    document.execCommand('copy');
  }
});

form.addEventListener('input', (event) => {
  if (event.target.matches('[data-stat-base]')) {
    recalcStats();
  }
});

setupRepeaters();
setupSkillTable();

const initialList = loadList();
renderSavedList(initialList);

const initialId = localStorage.getItem(CURRENT_KEY);
const initialData = initialList.find((item) => item.id === initialId);
if (initialData) {
  loadData(initialData);
} else {
  recalcStats();
  resetSkillsToDefault();
  updatePreview(collectData());
}
