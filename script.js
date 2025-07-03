let worldEconomyIndex = 0; // 初期値を設定してグローバルスコープで宣言
let nations = JSON.parse(localStorage.getItem('nations')) || []; // nations をグローバルに設定
let isManualSetting = false; // 手動設定フラグをグローバルに定義
let lastWarSummary = null;
function alreadyActedToday(nation) {
  if (!nation.lastActionDate) return false;
  const lastDate = new Date(nation.lastActionDate);
  const today = new Date();
  return (
    lastDate.getFullYear() === today.getFullYear() &&
    lastDate.getMonth() === today.getMonth() &&
    lastDate.getDate() === today.getDate()
  );
}

const offensiveStrategies = ["電撃", "攻勢", "上陸"];
const defensiveStrategies = ["機動防衛", "遅延"];

// このeventを編集してね
const events = [
  {
    name: "交易協定締結",
    ecoAdd: 5,    // 経済に固定追加
    ecoBuff: 1.2, // 経済倍率バフ
    milAdd: 0,
    milBuff: 1.0,
    devAdd: 0,
    devBuff: 1.0,
    colAdd: 0,
    powBuff: 1.0, // 戦力バフ
    days: 3       // 継続日数
  },
  {
    name: "内戦勃発",
    ecoAdd: -3,
    ecoBuff: 0.8,
    milAdd: -2,
    milBuff: 0.9,
    devAdd: 0,
    devBuff: 1.0,
    colAdd: 0,
    powBuff: 0.9,
    days: 5
  },
  {
  name: "海外資本誘致",
  ecoAdd: 8,
  ecoBuff: 1.1,
  milAdd: 0,
  milBuff: 1.0,
  devAdd: 2,
  devBuff: 1.0,
  colAdd: 0,
  days: 4
},
{
  name: "国内市場活性化政策",
  ecoAdd: 4,
  ecoBuff: 1.3,
  milAdd: 0,
  milBuff: 1.0,
  devAdd: 1,
  devBuff: 1.0,
  colAdd: 0,
  days: 3
},
{
  name: "技術輸出開始",
  ecoAdd: 6,
  ecoBuff: 1.15,
  milAdd: 0,
  milBuff: 1.0,
  devAdd: 3,
  devBuff: 1.0,
  colAdd: 0,
  days: 3
},
{
  name: "金融緩和",
  ecoAdd: 5,
  ecoBuff: 1.25,
  milAdd: 0,
  milBuff: 0.9,
  devAdd: 0,
  devBuff: 1.0,
  colAdd: 0,
  days: 2
},
{
  name: "徴兵強化令",
  ecoAdd: -2,
  ecoBuff: 1.0,
  milAdd: 6,
  milBuff: 1.3,
  devAdd: 0,
  devBuff: 1.0,
  colAdd: 0,
  days: 3
},
{
  name: "軍産複合体育成",
  ecoAdd: 2,
  ecoBuff: 1.0,
  milAdd: 4,
  milBuff: 1.2,
  devAdd: 1,
  devBuff: 1.0,
  colAdd: 0,
  days: 5
},
{
  name: "戦争準備演習",
  ecoAdd: 0,
  ecoBuff: 0.95,
  milAdd: 8,
  milBuff: 1.4,
  devAdd: 0,
  devBuff: 1.0,
  colAdd: 0,
  days: 2
},
{
  name: "傭兵契約",
  ecoAdd: -3,
  ecoBuff: 1.0,
  milAdd: 10,
  milBuff: 1.0,
  devAdd: 0,
  devBuff: 1.0,
  colAdd: 0,
  days: 1
},
{
  name: "国家インフラ計画",
  ecoAdd: 0,
  ecoBuff: 1.0,
  milAdd: 0,
  milBuff: 1.0,
  devAdd: 10,
  devBuff: 1.2,
  colAdd: 0,
  days: 5
},
{
  name: "研究投資拡大",
  ecoAdd: -2,
  ecoBuff: 1.0,
  milAdd: 0,
  milBuff: 1.0,
  devAdd: 6,
  devBuff: 1.3,
  colAdd: 0,
  days: 3
},
{
  name: "地方開発助成金",
  ecoAdd: 1,
  ecoBuff: 1.0,
  milAdd: 0,
  milBuff: 1.0,
  devAdd: 5,
  devBuff: 1.1,
  colAdd: 0,
  days: 3
},
{
  name: "教育改革",
  ecoAdd: 0,
  ecoBuff: 1.0,
  milAdd: 0,
  milBuff: 0.95,
  devAdd: 7,
  devBuff: 1.25,
  colAdd: 0,
  days: 4
},
{
  name: "未開地探索",
  ecoAdd: 0,
  ecoBuff: 1.0,
  milAdd: 1,
  milBuff: 1.0,
  devAdd: 0,
  devBuff: 1.0,
  colAdd: 1,
  days: 2
},
{
  name: "入植者募集運動",
  ecoAdd: -1,
  ecoBuff: 1.0,
  milAdd: 0,
  milBuff: 1.0,
  devAdd: 1,
  devBuff: 1.0,
  colAdd: 2,
  days: 3
},
{
  name: "植民地支援策",
  ecoAdd: -3,
  ecoBuff: 1.0,
  milAdd: 0,
  milBuff: 1.0,
  devAdd: 2,
  devBuff: 1.0,
  colAdd: 3,
  days: 4
},
{
  name: "辺境警備強化",
  ecoAdd: 0,
  ecoBuff: 1.0,
  milAdd: 2,
  milBuff: 1.1,
  devAdd: 0,
  devBuff: 1.0,
  colAdd: 1,
  days: 2
},
{
  name: "政権交代",
  ecoAdd: 0,
  ecoBuff: 0.9,
  milAdd: -2,
  milBuff: 0.95,
  devAdd: 0,
  devBuff: 0.9,
  colAdd: 0,
  days: 2
},
{
  name: "天災",
  ecoAdd: -5,
  ecoBuff: 0.8,
  milAdd: -3,
  milBuff: 0.9,
  devAdd: -4,
  devBuff: 0.85,
  colAdd: -1,
  days: 3
},
{
  name: "国民祭典",
  ecoAdd: 3,
  ecoBuff: 1.1,
  milAdd: 0,
  milBuff: 0.95,
  devAdd: 0,
  devBuff: 1.0,
  colAdd: 0,
  days: 1
},
{
  name: "外交トラブル",
  ecoAdd: -2,
  ecoBuff: 0.95,
  milAdd: 0,
  milBuff: 0.9,
  devAdd: 0,
  devBuff: 1.0,
  colAdd: 0,
  days: 2
},
{
  name: "政争激化",
  ecoAdd: -3,
  ecoBuff: 0.9,
  milAdd: -2,
  milBuff: 0.95,
  devAdd: -1,
  devBuff: 1.0,
  colAdd: 0,
  days: 4
},
{
  name: "反乱勃発",
  ecoAdd: -4,
  ecoBuff: 0.85,
  milAdd: -6,
  milBuff: 0.8,
  devAdd: -2,
  devBuff: 0.9,
  colAdd: -1,
  days: 3
},
{
  name: "汚職発覚",
  ecoAdd: -2,
  ecoBuff: 0.9,
  milAdd: 0,
  milBuff: 0.95,
  devAdd: -3,
  devBuff: 0.95,
  colAdd: 0,
  days: 2
},
{
  name: "財政破綻の危機",
  ecoAdd: -8,
  ecoBuff: 0.8,
  milAdd: -2,
  milBuff: 0.95,
  devAdd: 0,
  devBuff: 1.0,
  colAdd: 0,
  days: 2
},
{
  name: "新エネルギー技術導入",
  ecoAdd: 3,
  ecoBuff: 1.1,
  milAdd: 0,
  milBuff: 1.0,
  devAdd: 6,
  devBuff: 1.3,
  colAdd: 0,
  days: 4
},
{
  name: "軍事技術の進歩",
  ecoAdd: 0,
  ecoBuff: 1.0,
  milAdd: 5,
  milBuff: 1.3,
  devAdd: 1,
  devBuff: 1.0,
  colAdd: 0,
  days: 3
},
{
  name: "大学改革",
  ecoAdd: 0,
  ecoBuff: 1.0,
  milAdd: 0,
  milBuff: 0.95,
  devAdd: 7,
  devBuff: 1.2,
  colAdd: 0,
  days: 5
},
{
  name: "産業オートメーション",
  ecoAdd: 6,
  ecoBuff: 1.2,
  milAdd: 0,
  milBuff: 1.0,
  devAdd: 4,
  devBuff: 1.1,
  colAdd: 0,
  days: 3
},
{
  name: "国家宗教祭典",
  ecoAdd: 2,
  ecoBuff: 1.1,
  milAdd: 0,
  milBuff: 1.0,
  devAdd: 0,
  devBuff: 1.0,
  colAdd: 0,
  days: 2
},
{
  name: "文化遺産の発見",
  ecoAdd: 1,
  ecoBuff: 1.0,
  milAdd: 0,
  milBuff: 1.0,
  devAdd: 3,
  devBuff: 1.1,
  colAdd: 0,
  days: 3
},
{
  name: "宗教対立の激化",
  ecoAdd: -2,
  ecoBuff: 0.9,
  milAdd: -1,
  milBuff: 0.95,
  devAdd: -1,
  devBuff: 1.0,
  colAdd: 0,
  days: 3
},
{
  name: "移民文化交流",
  ecoAdd: 2,
  ecoBuff: 1.1,
  milAdd: 0,
  milBuff: 1.0,
  devAdd: 2,
  devBuff: 1.0,
  colAdd: 1,
  days: 3
},
{
  name: "軍事同盟締結",
  ecoAdd: 0,
  ecoBuff: 1.0,
  milAdd: 4,
  milBuff: 1.2,
  devAdd: 0,
  devBuff: 1.0,
  colAdd: 0,
  days: 3
},
{
  name: "国際見本市開催",
  ecoAdd: 7,
  ecoBuff: 1.15,
  milAdd: 0,
  milBuff: 1.0,
  devAdd: 2,
  devBuff: 1.0,
  colAdd: 0,
  days: 2
},
{
  name: "貿易摩擦",
  ecoAdd: -3,
  ecoBuff: 0.9,
  milAdd: 0,
  milBuff: 1.0,
  devAdd: 0,
  devBuff: 1.0,
  colAdd: 0,
  days: 2
},
{
  name: "国際制裁",
  ecoAdd: -5,
  ecoBuff: 0.8,
  milAdd: -2,
  milBuff: 0.9,
  devAdd: 0,
  devBuff: 0.95,
  colAdd: 0,
  days: 3
},
{
  name: "大地震",
  ecoAdd: -6,
  ecoBuff: 0.7,
  milAdd: -3,
  milBuff: 0.9,
  devAdd: -5,
  devBuff: 0.8,
  colAdd: -1,
  days: 3
},
{
  name: "パンデミック発生",
  ecoAdd: -4,
  ecoBuff: 0.85,
  milAdd: -2,
  milBuff: 0.9,
  devAdd: -3,
  devBuff: 0.85,
  colAdd: 0,
  days: 4
},
{
  name: "火山噴火",
  ecoAdd: -3,
  ecoBuff: 0.9,
  milAdd: 0,
  milBuff: 1.0,
  devAdd: -4,
  devBuff: 0.8,
  colAdd: -1,
  days: 2
},
{
  name: "バイオテロ",
  ecoAdd: -5,
  ecoBuff: 0.75,
  milAdd: -3,
  milBuff: 0.85,
  devAdd: 0,
  devBuff: 1.0,
  colAdd: 0,
  days: 2
},
];

function populateEventNationDropdown() {
  const select = document.getElementById("event-nation-select");
  // まずデフォルト（すべての国）だけにリセット
  select.innerHTML = '<option value="">（すべての国）</option>';
  // 各国を追加
  nations.forEach((nation, idx) => {
    const option = document.createElement("option");
    option.value = idx;
    option.textContent = nation.name;
    select.appendChild(option);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // DOM要素の取得
  const nationList = document.getElementById('nation-list');
  const createNationForm = document.getElementById('create-nation-form');
  const worldEconomyForm = document.getElementById('world-economy-form');
  const worldEconomyInput = document.getElementById('world-economy-input');
  const rouletteBtn = document.getElementById("world-economy-roulette");
  const nationSelectA = document.getElementById("nation-a");
  const nationSelectB = document.getElementById("nation-b");
  const battleCountInput = document.getElementById("battle-count");
  const setupStrategiesBtn = document.getElementById("setup-strategies");
  const strategySelectionArea = document.getElementById("strategy-selection-area");
  const startWarBtn = document.getElementById("start-war");
  const warResultDiv = document.getElementById("war-result");

  const triggerBtn = document.getElementById("trigger-event-btn");
  triggerBtn.addEventListener("click", triggerSelectedEvent);

if (!startWarBtn) {
  console.error('start-war ボタンが見つかりません！');
  return;
}

  const compareSection = document.getElementById("compare-section");

  // worldEconomyIndex の初期化
  if (worldEconomyInput) {
    worldEconomyIndex = parseFloat(worldEconomyInput.value) || 0;
  }

  const savedEconomy = localStorage.getItem("worldEconomyIndex");
if (savedEconomy !== null) {
  worldEconomyIndex = parseFloat(savedEconomy);
  worldEconomyInput.value = worldEconomyIndex;
  updateWorldEconomyDisplay();
}


  // 初期データの表示
  updateWorldEconomyDisplay();
  updateNationList();
  populateTransferDropdowns();
  renderComparison();
  populateNationDropdowns();
  populateEventNationDropdown();
  // ルーレットボタンのイベント設定
  rouletteBtn.addEventListener("click", () => {
    if (isManualSetting) {
      alert("手動設定が優先されています。ルーレットの値を変更したい場合は手動設定を解除してください。");
      return;
    }

    // 現在の位置に応じた変動幅と方向
    const normalized = worldEconomyIndex / 10.0; // 0.0〜1.0
    const maxUp = (1.0 - normalized) * 5.0;   // 上がりやすさ（最大+5.0）
    const maxDown = normalized * 5.0;         // 下がりやすさ（最大-5.0）

    // 上昇と下降のどちらかをランダムに選び、その範囲で乱数を出す
    const change = (Math.random() < 0.5)
      ? Math.random() * maxUp
      : -Math.random() * maxDown;

    let newIndex = worldEconomyIndex + change;
    newIndex = Math.min(10.0, Math.max(0.0, newIndex)); // 範囲制限
    worldEconomyIndex = parseFloat(newIndex.toFixed(2));
    newIndex = applyWorldEconomyBuff(newIndex);

    worldEconomyInput.value = worldEconomyIndex;
    updateWorldEconomyDisplay();
    alert(`世界経済指数が ${worldEconomyIndex} に変動しました！`);
    updateNationList();
    populateTransferDropdowns();
    renderComparison();
    saveWorldEconomy();
  });

  worldEconomyForm.addEventListener('submit', (e) => {
    e.preventDefault();
    worldEconomyIndex = parseFloat(worldEconomyInput.value);
    isManualSetting = true; // 手動設定フラグを有効化
    updateWorldEconomyDisplay();
    alert(`世界経済指数を ${worldEconomyIndex} に設定しました。`);
    updateNationList();
    populateTransferDropdowns();
    renderComparison();
    saveWorldEconomy();
  });

  document.getElementById("reset-world-economy").addEventListener("click", () => {
    isManualSetting = false;
    alert("手動設定が解除されました。ルーレットを回せます。");
  });

function updateWorldEconomyDisplay() {
  const worldEconomyDisplay = document.getElementById("world-economy-display");
  worldEconomyDisplay.textContent = `世界経済指数: ${parseFloat(worldEconomyIndex).toFixed(2)}`;
  saveWorldEconomy();
}

function saveWorldEconomy() {
  localStorage.setItem("worldEconomyIndex", worldEconomyIndex.toString());
}

function applyWorldEconomyBuff(value) {
  const buff = parseFloat(document.getElementById("world-economy-buff").value) || 1.0;
  return parseFloat((value * buff).toFixed(2));
}


createNationForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const nationName = document.getElementById('nation-name').value.trim();
  const foundingType = document.getElementById('founding-type').value;
  const initialStates = parseInt(document.getElementById('initial-states').value);

  if (nationName === '') return alert('国名を入力してください');
  if (isNaN(initialStates) || initialStates < 1 || initialStates > 60) {
    return alert('ステート数は1〜60の間で入力してください');
  }

  const avgEco = nations.length ? Math.round(nations.reduce((sum, n) => sum + n.economicPower, 0) / nations.length) : 40;
  const avgMil = nations.length ? Math.round(nations.reduce((sum, n) => sum + n.militaryPower, 0) / nations.length) : 20;
  const avgDev = nations.length ? Math.round(nations.reduce((sum, n) => sum + n.developmentPoints, 0) / nations.length) : 360;

  let eco = 40, mil = 20, dev = 360;

  const maxDevByState = initialStates * 360;
  const devCap = 360;

  if (foundingType === "partial") {
    eco = Math.round(avgEco * 0.6);
    mil = Math.round(avgMil * 0.6);
    dev = Math.min(maxDevByState, Math.round(avgDev * 0.6), devCap);
  } else if (foundingType === "rebuild") {
    eco = Math.round(avgEco * 0.3);
    mil = Math.round(avgMil * 0.3);
    dev = Math.min(maxDevByState, Math.round(avgDev * 0.3), devCap);
  } else {
    // 通常建国
    dev = Math.min(maxDevByState, devCap);
  }

  nations.push({
    name: nationName,
    economicPower: eco,
    militaryPower: mil,
    developmentPoints: dev,
    states: initialStates,
    lastActionDate: null,
    isEditing: false,
    ecoRate: 1.0,
    milRate: 1.0,
    devRate: 1.0
  });

  saveNations();
  updateNationList();
  populateTransferDropdowns();
  populateNationDropdowns();
  renderComparison();
  populateEventNationDropdown();
  createNationForm.reset();
});


  function updateNationList() {
    nationList.innerHTML = '';
    nations.forEach((nation, i) => {
      const div = document.createElement('div');
      div.className = 'nation';

      function populateTransferDropdowns() {
  const fromSelect = document.getElementById("from-nation");
  const toSelect = document.getElementById("to-nation");
  fromSelect.innerHTML = "";
  toSelect.innerHTML = "";

  nations.forEach((nation, i) => {
    const optionFrom = new Option(nation.name, i);
    const optionTo = new Option(nation.name, i);
    fromSelect.appendChild(optionFrom);
    toSelect.appendChild(optionTo);
  });
}

      // 各成長量を計算し、一時保存（倍率込み）
      nation.growthEco = Math.round(calculateEconomicGrowth(nation.economicPower, nation.militaryPower, nation.developmentPoints) * (nation.ecoRate || 1));
      nation.growthMil = Math.round(calculateMilitaryGrowth(nation.economicPower, nation.developmentPoints) * (nation.milRate || 1));
      nation.growthDev = Math.round(calculateDevelopmentGrowth(nation.economicPower, nation.militaryPower) * (nation.devRate || 1));

      if (nation.isEditing) {
        div.innerHTML = `
          <h3>${nation.name} (編集中)</h3>
          <label>経済:</label><input type="number" id="economic-${i}" value="${nation.economicPower}">
          <label>軍事:</label><input type="number" id="military-${i}" value="${nation.militaryPower}">
          <label>開発:</label><input type="number" id="dev-${i}" value="${nation.developmentPoints}">
          <label>ステート:</label><input type="number" id="states-${i}" value="${nation.states}">
          <label>経済倍率:</label><input type="number" step="0.1" id="ecoRate-${i}" value="${nation.ecoRate || 1.0}">
          <label>軍事倍率:</label><input type="number" step="0.1" id="milRate-${i}" value="${nation.milRate || 1.0}">
          <label>開発倍率:</label><input type="number" step="0.1" id="devRate-${i}" value="${nation.devRate || 1.0}">
          <button onclick="saveEdit(${i})">保存</button>
          <button onclick="cancelEdit(${i})">キャンセル</button>
        `;
      } else {
        div.innerHTML = `
          <h3>${nation.name}</h3>
          <p>経済: ${nation.economicPower} 軍事: ${nation.militaryPower} 開発: ${nation.developmentPoints} ステート数: ${nation.states}</p>
          <p>次の発展 → 経済:${nation.growthEco} 軍事:${nation.growthMil} 開発:${nation.growthDev}</p>
          <p>発展倍率 → 経済: ${nation.ecoRate || 1} / 軍事: ${nation.milRate || 1} / 開発: ${nation.devRate || 1}</p>
          <button onclick="developEconomy(${i})">経済発展</button>
          <button onclick="developMilitary(${i})">軍事発展</button>
          <button onclick="developDevelopment(${i})">開発発展</button>
          <button onclick="editNation(${i})">編集</button>
          <button onclick="colonize(${i})">植民</button>
          <button onclick="deleteNation(${i})">削除</button>
        `;
      }
      nationList.appendChild(div);
    });
  }

  window.editNation = (i) => {
    nations[i].isEditing = true;
    updateNationList();
    populateTransferDropdowns();
  };

  window.cancelEdit = (i) => {
    nations[i].isEditing = false;
    updateNationList();
    populateTransferDropdowns();
  };

  window.saveEdit = (i) => {
    nations[i].economicPower = Math.round(parseFloat(document.getElementById(`economic-${i}`).value));
    nations[i].militaryPower = Math.round(parseFloat(document.getElementById(`military-${i}`).value));
    nations[i].developmentPoints = Math.round(parseFloat(document.getElementById(`dev-${i}`).value));
    nations[i].states = Math.round(parseFloat(document.getElementById(`states-${i}`).value));
    nations[i].ecoRate = parseFloat(document.getElementById(`ecoRate-${i}`).value);
    nations[i].milRate = parseFloat(document.getElementById(`milRate-${i}`).value);
    nations[i].devRate = parseFloat(document.getElementById(`devRate-${i}`).value);
    nations[i].isEditing = false;
    saveNations();
    updateNationList();
    populateTransferDropdowns();
    renderComparison();
  };

  window.colonize = (i) => {
    const nation = nations[i];
    if (alreadyActedToday(nation)) {
      const proceed = confirm(`${nation.name} は本日すでに発展済みです。それでも実行しますか？`);
      if (!proceed) return;
    }

    const count = parseInt(prompt("追加するステート数（1〜5）を入力してください:"));
    if (!isNaN(count) && count >= 1 && count <= 5) {
      nation.states += count;
      updateActionDate(nation); // ← 植民もアクション扱いとして記録
      saveNations();
      updateNationList();
      populateTransferDropdowns();
      renderComparison();
    } else {
      alert("1〜5の数値を入力してください。");
    }
  };

  function populateNationDropdowns() {
    nationSelectA.innerHTML = '';
    nationSelectB.innerHTML = '';
    nations.forEach((n, i) => {
      nationSelectA.add(new Option(n.name, i));
      nationSelectB.add(new Option(n.name, i));
    });
  }

  function populateTransferDropdowns() {
  const fromSelect = document.getElementById("from-nation");
  const toSelect = document.getElementById("to-nation");
  fromSelect.innerHTML = "";
  toSelect.innerHTML = "";

  nations.forEach((nation, i) => {
    const optionFrom = new Option(nation.name, i);
    const optionTo = new Option(nation.name, i);
    fromSelect.appendChild(optionFrom);
    toSelect.appendChild(optionTo);
  });
}

  document.getElementById("transfer-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const fromIndex = parseInt(document.getElementById("from-nation").value);
  const toIndex = parseInt(document.getElementById("to-nation").value);
  const type = document.getElementById("transfer-type").value;
  const amount = parseInt(document.getElementById("transfer-amount").value);

  if (isNaN(fromIndex) || isNaN(toIndex) || fromIndex === toIndex) {
    alert("譲渡元と譲渡先を正しく選んでください。");
    return;
  }

  if (isNaN(amount) || amount <= 0) {
    alert("譲渡数は1以上を入力してください。");
    return;
  }

  const fromNation = nations[fromIndex];
  const toNation = nations[toIndex];

  if (fromNation[type] < amount) {
    alert(`${fromNation.name} の${type === "economicPower" ? "経済力" : "ステート"}が不足しています。`);
    return;
  }

  fromNation[type] -= amount;
  toNation[type] += amount;

  alert(`${fromNation.name} から ${toNation.name} に ${amount} の ${type === "economicPower" ? "経済力" : "ステート"} を譲渡しました。`);
  saveNations();
  updateNationList();
  populateTransferDropdowns();
  renderComparison();
});

  window.resetWorld = () => {
    if (confirm("本当に全ての国データを完全に削除しますか？この操作は元に戻せません。")) {
      localStorage.removeItem('nations');
      location.reload();
    }
  };

  window.deleteNation = (i) => {
    if (confirm(`「${nations[i].name}」を削除してもよろしいですか？`)) {
      nations.splice(i, 1);
      saveNations();
      updateNationList();
      populateTransferDropdowns();
      populateNationDropdowns();
      renderComparison();
    }
  };

  window.developEconomy = (i) => {
    const nation = nations[i];
    if (alreadyActedToday(nation)) {
      const proceed = confirm(`${nation.name} は本日すでに発展済みです。それでも実行しますか？`);
      if (!proceed) return;
    }

    nation.economicPower += nation.growthEco || 0;
    updateActionDate(nation);
    saveNations();
    updateNationList();
    populateTransferDropdowns();
    renderComparison();
  };

  window.developMilitary = (i) => {
    const nation = nations[i];
    if (alreadyActedToday(nation)) {
      const proceed = confirm(`${nation.name} は本日すでに発展済みです。それでも実行しますか？`);
      if (!proceed) return;
    }

    const growth = nation.growthMil || 1;
    nation.militaryPower += growth;

    updateActionDate(nation);
    saveNations();
    updateNationList();
    populateTransferDropdowns();
    renderComparison();
    populateNationDropdowns();
  };

  window.developDevelopment = (i) => {
    const nation = nations[i];
    if (alreadyActedToday(nation)) {
      const proceed = confirm(`${nation.name} は本日すでに発展済みです。それでも実行しますか？`);
      if (!proceed) return;
    }

    nation.developmentPoints += nation.growthDev || 1;
    updateActionDate(nation);
    saveNations();
    updateNationList();
    populateTransferDropdowns();
    renderComparison();
  };

  function updateActionDate(nation) {
    const now = new Date();
    nation.lastActionDate = now.toLocaleDateString() + ' ' + now.toLocaleTimeString();
  }

  function calculateEconomicGrowth(e, m, d) {
      const alpha = 5.0, beta = 0.05, gamma = 0.1;
      const growth = ((alpha * e * Math.exp(-beta * e) * (1 / (1 + gamma * m)))/2) * (worldEconomyIndex / 10) + (d / 100);
      return Math.min(growth, 20); // 経済成長が15を超えないように制限
  }

  function calculateMilitaryGrowth(economicPower, d) {
    return Math.round(economicPower / 7.5) + (d / 200);
  }

  function calculateDevelopmentGrowth(e, m) {
    const baseRate = 3 * 0.2;      // 元の係数
    const adjustedRate = baseRate; // 緩和係数をかけない
    return adjustedRate * (e * 1.5 + m);
  }

  function saveNations() {
    localStorage.setItem('nations', JSON.stringify(nations));
  }

  function alreadyActedToday(nation) {
  if (!nation.lastActionDate) return false;
  const lastDate = new Date(nation.lastActionDate);
  const today = new Date();
  return (
    lastDate.getFullYear() === today.getFullYear() &&
    lastDate.getMonth() === today.getMonth() &&
    lastDate.getDate() === today.getDate()
  );
}

document.getElementById("import-world-economy").addEventListener("click", () => {
  const text = document.getElementById("world-economy-import-text").value.trim();
  const lines = text.split(/\r?\n/);

  lines.forEach(line => {
    const [nationName, action] = line.trim().split(/\s+/);
    const nation = nations.find(n => n.name === nationName);
    if (!nation) {
      console.warn(`国名が見つかりません: ${nationName}`);
      return;
    }

    switch (action) {
      case "経済":
        developEconomyByForce(nation);
        break;
      case "軍事":
        developMilitaryByForce(nation);
        break;
      case "開発":
        developDevelopmentByForce(nation);
        break;
      case "植民":
        colonizeByForce(nation);
        break;
      default:
        console.warn(`不明なアクション: ${action}`);
    }
  });

  saveNations();
  updateNationList();
  populateTransferDropdowns();
  renderComparison();
});

function developEconomyByForce(nation) {
  if (alreadyActedToday(nation)) {
    const proceed = confirm(`${nation.name} は本日すでに発展済みです。それでも実行しますか？`);
    if (!proceed) return;
  }
  nation.economicPower += nation.growthEco || 0;
  updateActionDate(nation); // 発展記録もする
}

function developMilitaryByForce(nation) {
  if (alreadyActedToday(nation)) {
    const proceed = confirm(`${nation.name} は本日すでに発展済みです。それでも実行しますか？`);
    if (!proceed) return;
  }
  nation.militaryPower += nation.growthMil || 1;;
  updateActionDate(nation);
}

function developDevelopmentByForce(nation) {
  if (alreadyActedToday(nation)) {
    const proceed = confirm(`${nation.name} は本日すでに発展済みです。それでも実行しますか？`);
    if (!proceed) return;
  }
  nation.developmentPoints += nation.growthDev || 1;
  updateActionDate(nation);
}

function colonizeByForce(nation) {
  if (alreadyActedToday(nation)) {
    const proceed = confirm(`${nation.name} は本日すでに発展済みです。それでも実行しますか？`);
    if (!proceed) return;
  }
  nation.states += 3;
  updateActionDate(nation);
}

document.getElementById("download-status-csv").addEventListener("click", () => {
  exportWorldEconomyCSV();
});

function exportWorldEconomyCSV() {
  let csv = "国名,経済,軍事,開発,ステート数,経済発展量,軍事発展量,開発発展量\n";

  nations.forEach(n => {
    const growthEco = Math.round(calculateEconomicGrowth(n.economicPower, n.militaryPower, n.developmentPoints) * (n.ecoRate || 1));
    const growthMil = Math.round(calculateMilitaryGrowth(n.economicPower, n.developmentPoints) * (n.milRate || 1));
    const growthDev = Math.round(calculateDevelopmentGrowth(n.economicPower, n.militaryPower) * (n.devRate || 1));

    csv += `${n.name},${n.economicPower},${n.militaryPower},${n.developmentPoints},${n.states},${growthEco},${growthMil},${growthDev}\n`;
  });

  downloadCSV(csv, "world_economy.csv");
}

document.getElementById("apply-bulk-nation-status").addEventListener("click", () => {
  const text = document.getElementById("bulk-nation-status").value.trim();
  if (!text) {
    alert("ステータスデータを入力してください。");
    return;
  }

  const lines = text.split(/\r?\n/);
  const newNations = [];

  lines.forEach(line => {
    const [name, eco, mil, dev, states = 1] = line.trim().split(/\s+/);
    if (!name || isNaN(eco) || isNaN(mil) || isNaN(dev)) {
      console.warn(`無効な行: ${line}`);
      return;
    }

    newNations.push({
      name,
      economicPower: parseInt(eco),
      militaryPower: parseInt(mil),
      developmentPoints: parseInt(dev),
      states: parseInt(states),
      lastActionDate: null,
      isEditing: false,
      ecoRate: 1.0,
      milRate: 1.0,
      devRate: 1.0
    });
  });

  nations = newNations;
  saveNations();
  updateNationList();
  populateTransferDropdowns();
  populateNationDropdowns();
  renderComparison();
  alert("ステータス一覧を上書きしました！");
});

  document.getElementById("apply-bulk-transfer").addEventListener("click", () => {
    const text = document.getElementById("bulk-transfer-text").value.trim();
    if (!text) {
      alert("譲渡データを入力してください");
      return;
    }

    const lines = text.split(/\r?\n/);

    lines.forEach(line => {
      const [fromName, toName, rawAmount, type] = line.trim().split(/\s+/);
      const amount = parseInt(rawAmount);

      if (!fromName || !toName || isNaN(amount) || amount <= 0 || !["経済", "ステート"].includes(type)) {
        console.warn(`無効な行: ${line}`);
        return;
      }

      const from = nations.find(n => n.name === fromName);
      const to = nations.find(n => n.name === toName);

      if (!from || !to) {
        console.warn(`国が見つかりません: ${line}`);
        return;
      }

      const key = type === "経済" ? "economicPower" : "states";

      if (from[key] < amount) {
        alert(`${from.name} の ${type} が不足しています（${from[key]} < ${amount}）`);
        return;
      }

      from[key] -= amount;
      to[key] += amount;
    });

    saveNations();
    updateNationList();
    renderComparison();
    alert("譲渡を適用しました！");
  });

  // ===== 戦争シミュレーション =====
  function renderComparison() {
      compareSection.innerHTML = '<h2>国ステータス比較</h2>';
      let tableHTML = '<table border="1"><tr><th>国名</th><th>経済</th><th>軍事</th><th>開発</th><th>ステート数</th></tr>';
      nations.forEach(n => {
        tableHTML += `<tr><td>${n.name}</td><td>${n.economicPower}</td><td>${n.militaryPower}</td><td>${n.developmentPoints}</td><td>${n.states}</td></tr>`;
      });
      tableHTML += '</table>';
      compareSection.innerHTML += tableHTML;
    }

    document.getElementById("import-war-data").addEventListener("click", () => {
      const text = document.getElementById("war-import-text").value.trim();

      // 戦争データ[...] から nationA, nationB, 戦線情報を取り出す
      const match = text.match(/戦争データ\[(.+?)_(.+?)((\{.*?\})+)\]/);
      if (!match) {
        alert("フォーマットが正しくありません。");
        return;
      }

      const nationAName = match[1];
      const nationBName = match[2];
      const warDataBlocks = [...text.matchAll(/\{.*?\}/g)].map(m => m[0]);

      const aIndex = nations.findIndex(n => n.name === nationAName);
      const bIndex = nations.findIndex(n => n.name === nationBName);

      if (aIndex === -1 || bIndex === -1) {
        alert("指定された国が見つかりません。");
        return;
      }

      nationSelectA.value = aIndex;
      nationSelectB.value = bIndex;
      battleCountInput.value = warDataBlocks.length;

      setupStrategiesUI(warDataBlocks.length);

      setTimeout(() => {
        const devsA = document.querySelectorAll(".dev-a");
        const devsB = document.querySelectorAll(".dev-b");
        const strategiesA = document.querySelectorAll(".strategy-a");
        const strategiesB = document.querySelectorAll(".strategy-b");
        const powersA = document.querySelectorAll(".power-a");
        const powersB = document.querySelectorAll(".power-b");
        const buffsA = document.querySelectorAll(".power-buff-a");
        const buffsB = document.querySelectorAll(".power-buff-b");

        warDataBlocks.forEach((block, i) => {
          const matches = [...block.matchAll(/\((.+?),(\d+),(.+?),(\d+),([\d.]+)\)/g)];
          if (matches.length === 2) {
            const [stateA, devA, stratA, powA, buffA] = matches[0].slice(1);
            const [stateB, devB, stratB, powB, buffB] = matches[1].slice(1);

            devsA[i].value = devA;
            strategiesA[i].value = stratA;
            powersA[i].value = powA;
            buffsA[i].value = buffA;

            devsB[i].value = devB;
            strategiesB[i].value = stratB;
            powersB[i].value = powB;
            buffsB[i].value = buffB;
          }
        });
      }, 100);
    });

    function populateNationDropdowns() {
      nationSelectA.innerHTML = '';
      nationSelectB.innerHTML = '';
      nations.forEach((n, i) => {
        const last = n.lastActionDate
          ? `（最終: ${new Date(n.lastActionDate).toLocaleString()})`
          : '（未行動）';
        nationSelectA.add(new Option(`${n.name} ${last}`, i));
        nationSelectB.add(new Option(`${n.name} ${last}`, i));
      });
    }

    setupStrategiesBtn.addEventListener("click", () => {
      const count = parseInt(battleCountInput.value);

      if (isNaN(count) || count <= 0) {
        alert("戦線数を正しく入力してください");
        return;
      }

      setupStrategiesUI(count);
      startWarBtn.style.display = "block";
      // 全体バフ入力時に、各戦線に反映
document.getElementById("global-power-buff-a").addEventListener("input", (e) => {
  const value = parseFloat(e.target.value) || 1.0;
  document.querySelectorAll(".power-buff-a").forEach(input => input.value = value);
});

document.getElementById("global-power-buff-b").addEventListener("input", (e) => {
  const value = parseFloat(e.target.value) || 1.0;
  document.querySelectorAll(".power-buff-b").forEach(input => input.value = value);
});
    });

    function setupStrategiesUI(count) {
      strategySelectionArea.innerHTML = '';

      const a = nations[parseInt(nationSelectA.value)];
      const b = nations[parseInt(nationSelectB.value)];

      // 全体戦術＋全体バフ設定
      strategySelectionArea.innerHTML += `
        <label>総軍事力（A側）:</label>
        <input type="number" id="total-military-a" value="${a.militaryPower}" max="${a.militaryPower}" min="1">
        <label>総軍事力（B側）:</label>
        <input type="number" id="total-military-b" value="${b.militaryPower}" max="${b.militaryPower}" min="1">

        <label>全体戦術（A側）:</label>
        <select id="global-strategy-a">
          <option value="">（未設定）</option>
          <option value="電撃">電撃</option>
          <option value="攻勢">攻勢</option>
          <option value="機動防衛">機動防衛</option>
          <option value="遅延">遅延</option>
          <option value="上陸">上陸</option>
        </select>

        <label>全体戦術（B側）:</label>
        <select id="global-strategy-b">
          <option value="">（未設定）</option>
          <option value="電撃">電撃</option>
          <option value="攻勢">攻勢</option>
          <option value="機動防衛">機動防衛</option>
          <option value="遅延">遅延</option>
          <option value="上陸">上陸</option>
        </select>

        <label>全体バフ（A側）:</label>
        <input type="number" step="0.1" id="global-power-buff-a" value="1.0" min="0.1">
        <label>全体バフ（B側）:</label>
        <input type="number" step="0.1" id="global-power-buff-b" value="1.0" min="0.1">
        <hr>
      `;

      for (let i = 0; i < count; i++) {
        const div = document.createElement("div");
        div.className = "battle-line";
        div.innerHTML = `
          <h4>戦線${i + 1}</h4>

          <label>A側の戦術:</label>
          <select class="strategy-a">
            <option value="">（全体設定を使用）</option>
            <option value="電撃">電撃</option>
            <option value="攻勢">攻勢</option>
            <option value="機動防衛">機動防衛</option>
            <option value="遅延">遅延</option>
            <option value="上陸">上陸</option>
          </select>
          <label>開発度（A）:</label>
          <input type="number" class="dev-a" value="5" min="1" max="10">
          <label>軍事力（A）:</label>
          <input type="number" class="power-a" value="1" min="1">
          <label>バフ（A）:</label>
          <input type="number" class="power-buff-a" value="1.0" step="0.1" min="0.1">

          <br>

          <label>B側の戦術:</label>
          <select class="strategy-b">
            <option value="">（全体設定を使用）</option>
            <option value="電撃">電撃</option>
            <option value="攻勢">攻勢</option>
            <option value="機動防衛">機動防衛</option>
            <option value="遅延">遅延</option>
            <option value="上陸">上陸</option>
          </select>
          <label>開発度（B）:</label>
          <input type="number" class="dev-b" value="5" min="1" max="10">
          <label>軍事力（B）:</label>
          <input type="number" class="power-b" value="1" min="1">
          <label>バフ（B）:</label>
          <input type="number" class="power-buff-b" value="1.0" step="0.1" min="0.1">

          <hr>
        `;
        strategySelectionArea.appendChild(div);
      }

      setupGlobalStrategyListeners();
    }

    function setupGlobalStrategyListeners() {
      const globalASelect = document.getElementById("global-strategy-a");
      const globalBSelect = document.getElementById("global-strategy-b");

      globalASelect.addEventListener("change", () => {
        const value = globalASelect.value;
        document.querySelectorAll(".strategy-a").forEach(sel => {
          sel.value = value;
        });
      });

      globalBSelect.addEventListener("change", () => {
        const value = globalBSelect.value;
        document.querySelectorAll(".strategy-b").forEach(sel => {
          sel.value = value;
        });
      });
    }

    function simulateBattle(aS, bS, powerA, powerB, devA, devB, ecoA, ecoB, totalA, totalB, buffA = 1.0, buffB = 1.0) {
      const defensiveStrategies = ["機動防衛", "遅延"];

      // 両者が防御戦術 → 戦闘回避
      if (defensiveStrategies.includes(aS) && defensiveStrategies.includes(bS)) {
        return {
          winner: "なし（戦闘回避）",
          aMil: 0, bMil: 0,
          aEco: 0, bEco: 0,
          valA: 0, valB: 0,
          winRateA: 50,
          baseA: 0, baseB: 0,
          modA: 1.0, modB: 1.0
        };
      }

          // ダメージテーブル（戦術ごとの軍事被害倍率）
          const damageTable = {
            "遅延": [2, 4],
            "機動防衛": [1, 3],
            "攻勢": [4, 5],
            "電撃": [3, 4],
            "上陸": [3, 5]
          };

          // 戦術相性補正表（攻撃補正倍率）
          const strategyMatrix = {
            "遅延": { "電撃": 1.25, "攻勢": 1.05, "機動防衛": 1.0, "遅延": 1.0, "上陸": 1.0 },
            "機動防衛": { "攻勢": 1.15, "電撃": 0.95, "遅延": 1.0, "機動防衛": 1.0, "上陸": 1.0 },
            "電撃": { "機動防衛": 1.1, "攻勢": 1.0, "遅延": 0.9, "電撃": 1.0, "上陸": 1.0 },
            "攻勢": { "遅延": 1.15, "機動防衛": 0.95, "電撃": 1.1, "攻勢": 1.0, "上陸": 1.0 },
            "上陸": { "遅延": 0.9, "機動防衛": 0.9, "電撃": 0.9, "攻勢": 0.9, "上陸": 1.0 }
          };

      // 戦術補正倍率
      const modA = strategyMatrix[aS]?.[bS] || 1.0;
      const modB = strategyMatrix[bS]?.[aS] || 1.0;

      // 開発ポイントバフ
      const devFactorA = 1;
      const devFactorB = 1;

      // 経済を含む基礎戦力
      const baseA = (powerA * 2) + ecoA * 0.2;
      const baseB = (powerB * 2) + ecoB * 0.2;

      // 補正後の実際の戦力
      const valA = baseA * modA * buffA;
      const valB = baseB * modB * buffB * 1.02;

      // 勝率等の計算
      const total = valA + valB;
      const winRateA = total > 0 ? Math.round((valA / total) * 100) : 50;
      const aWin = Math.random() * 100 < winRateA;

      // 軍事・経済被害の計算
      const aFactor = valB / 100;
      const bFactor = valA / 100;

      const [aMilWin, aMilLose] = damageTable[aS] || [3, 4];
      const [bMilWin, bMilLose] = damageTable[bS] || [3, 4];

      const aMil = Math.ceil((aWin ? aMilWin : aMilLose) * aFactor);
      const bMil = Math.ceil((aWin ? bMilLose : bMilWin) * bFactor);
      const aEcoPerBattle = Math.max(1, Math.round(powerA / 10));
      const bEcoPerBattle = Math.max(1, Math.round(powerB / 10));

      return {
        winner: aWin ? "A側" : "B側",
        aMil,
        bMil,
        aEco: aEcoPerBattle,
        bEco: bEcoPerBattle,
        valA,
        valB,
        winRateA,
        modA,
        modB,
        baseA: baseA.toFixed(1),
        baseB: baseB.toFixed(1),
        devA,
        devB
      };
    }

      startWarBtn.addEventListener("click", () => {
        console.log("戦争が開始されました！"); // デバッグ用

        // nations 配列から国オブジェクトの取得
        const a = nations[parseInt(nationSelectA.value)];
        const b = nations[parseInt(nationSelectB.value)];
        const count = parseInt(battleCountInput.value);

        if (isNaN(count) || count <= 0) {
          alert("戦線数を正しく入力してください");
          return;
        }

        // 軍事力入力値の処理
        const totalA = Math.min(
          Math.round(parseFloat(document.getElementById("total-military-a").value)),
          a.militaryPower
        );
        const totalB = Math.min(
          Math.round(parseFloat(document.getElementById("total-military-b").value)),
          b.militaryPower
        );

        // 各戦線でのパワーやバフなどの取得
        const powersA = document.querySelectorAll(".power-a");
        const powersB = document.querySelectorAll(".power-b");

        let sumPowerA = 0, sumPowerB = 0;

        lastWarSummary = {
          sideA: a.name,
          sideB: b.name,
          totalMilitary: { A: totalA, B: totalB },
          totalLoss: { military: { A:0, B:0 }, economic: { A:0, B:0 } },
          lines: []
        };

        for (let i = 0; i < count; i++) {
          sumPowerA += parseInt(powersA[i]?.value) || 0;
          sumPowerB += parseInt(powersB[i]?.value) || 0;
        }

        if (sumPowerA > totalA || sumPowerB > totalB) {
          alert("戦線ごとの軍事力の合計が総軍事力を超えています！");
          return;
        }

        // その他の入力値・設定値の取得
        const buffsA = document.querySelectorAll(".power-buff-a");
        const buffsB = document.querySelectorAll(".power-buff-b");
        const globalBuffA = parseFloat(document.getElementById("global-power-buff-a").value) || 1.0;
        const globalBuffB = parseFloat(document.getElementById("global-power-buff-b").value) || 1.0;
        const globalA = document.getElementById("global-strategy-a").value;
        const globalB = document.getElementById("global-strategy-b").value;
        const strategiesA = document.querySelectorAll(".strategy-a");
        const strategiesB = document.querySelectorAll(".strategy-b");
        const devsA = document.querySelectorAll(".dev-a");
        const devsB = document.querySelectorAll(".dev-b");

        let totalAMil = 0, totalAEco = 0, totalBMil = 0, totalBEco = 0;
        let totalADevLoss = 0, totalBDevLoss = 0;
        let html = '<h3>戦争結果</h3>';

        for (let i = 0; i < count; i++) {
          const strategyAVal = strategiesA[i]?.value;
          const strategyBVal = strategiesB[i]?.value;
          const aS = strategyAVal !== "" ? strategyAVal : globalA;
          const bS = strategyBVal !== "" ? strategyBVal : globalB;

          const devA = parseInt(devsA[i]?.value) || 5;
          const devB = parseInt(devsB[i]?.value) || 5;
          const buffA = parseFloat(buffsA[i]?.value) || globalBuffA;
          const buffB = parseFloat(buffsB[i]?.value) || globalBuffB;

          const powerA = parseInt(powersA[i]?.value) || 1;
          const powerB = parseInt(powersB[i]?.value) || 1;

          const ecoA = a.economicPower;
          const ecoB = b.economicPower;

          let devLossA = 0;
          let devLossB = 0;

          const result = simulateBattle(aS, bS, powerA, powerB, devA, devB, ecoA, ecoB, totalA, totalB, buffA, buffB);

          // それぞれ相手の base に応じて減少
          devLossA = Math.round(powerB * 0.25);
          devLossB = Math.round(powerA * 0.25);

          // 限界を考慮して減算
          a.developmentPoints = Math.max(0, a.developmentPoints - devLossA);
          b.developmentPoints = Math.max(0, b.developmentPoints - devLossB);

          // 集計に追加
          totalADevLoss += devLossA;
          totalBDevLoss += devLossB;

          // ステート変動処理（戦術と勝敗によって変化）
const winner = result.winner;
const aUsed = aS;
const bUsed = bS;

// 勝者が存在し、攻撃系戦術を使っていた場合のみステート移動
if (winner === "A側" && offensiveStrategies.includes(aUsed)) {
  a.states += 1;
  b.states = Math.max(0, b.states - 1);
} else if (winner === "B側" && offensiveStrategies.includes(bUsed)) {
  b.states += 1;
  a.states = Math.max(0, a.states - 1);
}
// 防衛系 or 引き分けなら変動なし

          html += `
              <div><h4>戦線${i + 1}</h4>
              <p>戦術：${a.name} = ${aS} / ${b.name} = ${bS}</p>
              <p>${a.name} 戦力詳細 → ${result.baseA} × 戦術補正:${result.modA} × バフ:${buffA} = <strong>${result.valA}</strong></p>
              <p>${b.name} 戦力詳細 → ${result.baseB} × 戦術補正:${result.modB} × バフ:${buffB} = <strong>${result.valB}</strong></p>
              <p>勝率：${a.name} ${result.winRateA}% / ${b.name} ${100 - result.winRateA}%</p>
              <p>勝者：<strong>${result.winner}</strong></p>
              <p>${a.name} 被害 → 軍事: -${result.aMil}, 経済: -${result.aEco}</p>
              <p>${b.name} 被害 → 軍事: -${result.bMil}, 経済: -${result.bEco}</p>
              <p>開発度被害：${a.name} -${devLossA}</p>
              <p>開発度被害：${b.name} -${devLossB}</p>
          `;

          totalAMil += result.aMil;
          totalAEco += result.aEco;
          totalBMil += result.bMil;
          totalBEco += result.bEco;

          lastWarSummary.lines.push({
    line: i + 1,
    tactics: { A: aS, B: bS },
    power:   { A: powerA, B: powerB },
    dev:     { A: devA,    B: devB    },
    buff:    { A: buffA,   B: buffB   },
    devLoss: { A: devLossA, B: devLossB },
    winner:  result.winner
  });
        }

        a.militaryPower = Math.max(0, a.militaryPower - totalAMil);
        a.economicPower = Math.max(0, a.economicPower - totalAEco);
        b.militaryPower = Math.max(0, b.militaryPower - totalBMil);
        b.economicPower = Math.max(0, b.economicPower - totalBEco);

        lastWarSummary.totalLoss = {
  military: { A: totalAMil, B: totalBMil },
  economic:  { A: totalAEco, B: totalBEco },
  development: { A: totalADevLoss, B: totalBDevLoss }
};

html += `<h4>合計被害</h4>
         <p>${a.name} → 軍事: -${totalAMil}, 経済: -${totalAEco}, 開発度: -${totalADevLoss}</p>
         <p>${b.name} → 軍事: -${totalBMil}, 経済: -${totalBEco}, 開発度: -${totalBDevLoss}</p>`;
        warResultDiv.innerHTML = html;
        alert("戦争が完了しました！");

        // 修正ポイント：a, b を nations に明示的に上書き

        nations[parseInt(nationSelectA.value)] = a;
        nations[parseInt(nationSelectB.value)] = b;
        saveNations();
        updateNationList();
        populateTransferDropdowns();
        renderComparison();

});
document.getElementById('download-war-csv').addEventListener('click', () => {
  if (!lastWarSummary) {
    return alert('まずは戦争を実行してください。');
  }

  const header = [
    '国', '総軍事力', '総軍事被害', '総経済被害',
    '戦線番号', '戦術', '軍事力', '開発度', '戦争バフ', '開発度被害', '勝敗', '戦線結果'
  ];

  const rows = [header.join(',')];

  lastWarSummary.lines.forEach(line => {
    const tacticsA = line.tactics.A;
    const tacticsB = line.tactics.B;
    const winner = line.winner;

    const isAttackA = ['電撃', '攻勢', '上陸'].includes(tacticsA);
    const isDefenseA = ['機動防衛', '遅延'].includes(tacticsA);
    const isAttackB = ['電撃', '攻勢', '上陸'].includes(tacticsB);
    const isDefenseB = ['機動防衛', '遅延'].includes(tacticsB);

    let resultA = '移動なし';
    let resultB = '移動なし';

    if (winner === 'A側' && isAttackA) {
      resultA = '相手ステート占領';
      resultB = '撤退';
    } else if (winner === 'B側' && isAttackB) {
      resultA = '撤退';
      resultB = '相手ステート占領';
    } else if (isDefenseA && isDefenseB) {
      resultA = '移動なし';
      resultB = '移動なし';
    } else if ((winner === 'A側' && isDefenseA) || (winner === 'B側' && isDefenseB)) {
      resultA = '移動なし';
      resultB = '移動なし';
    }

    rows.push([
      lastWarSummary.sideA,
      lastWarSummary.totalMilitary.A,
      lastWarSummary.totalLoss.military.A,
      lastWarSummary.totalLoss.economic.A,
      line.line,
      tacticsA,
      line.power.A,
      line.dev.A,
      line.buff.A,
      line.devLoss.A,
      winner === 'A側' ? '勝利' : (winner === 'B側' ? '敗北' : winner),
      resultA
    ].join(','));

    rows.push([
      lastWarSummary.sideB,
      lastWarSummary.totalMilitary.B,
      lastWarSummary.totalLoss.military.B,
      lastWarSummary.totalLoss.economic.B,
      line.line,
      tacticsB,
      line.power.B,
      line.dev.B,
      line.buff.B,
      line.devLoss.B,
      winner === 'B側' ? '勝利' : (winner === 'A側' ? '敗北' : winner),
      resultB
    ].join(','));
  });

  const csvContent = '\uFEFF' + rows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `戦争結果_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
});

let activeEvents = [];


function showEventMessage(ev, nationNames) {
  const el = document.getElementById("current-event");
  el.innerHTML = `<strong>【${ev.name}】</strong><br>
    対象: ${nationNames.join("、")}<br>
    経済: ${ev.ecoAdd >= 0 ? "+" : ""}${ev.ecoAdd} (×${ev.ecoBuff})<br>
    軍事: ${ev.milAdd >= 0 ? "+" : ""}${ev.milAdd} (×${ev.milBuff})<br>
    開発: ${ev.devAdd >= 0 ? "+" : ""}${ev.devAdd} (×${ev.devBuff})<br>
    植民: ${ev.colAdd >= 0 ? "+" : ""}${ev.colAdd}<br>
    戦力バフ: ×${ev.powBuff}<br>
    継続日数: ${ev.days}日`;
}


function triggerSelectedEvent() {
  const ev = events[Math.floor(Math.random() * events.length)];
  const sel = document.getElementById("event-nation-select").value;
  const targets = sel === ""
    ? nations.map((_, idx) => idx)
    : [ parseInt(sel, 10) ];

  targets.forEach(idx => {
    const nation = nations[idx];
    if (!nation) return;

    // ① 固定増減
    nation.economicPower     = Math.max(0, nation.economicPower     + ev.ecoAdd);
    nation.militaryPower     = Math.max(0, nation.militaryPower     + ev.milAdd);
    nation.developmentPoints = Math.max(0, nation.developmentPoints + ev.devAdd);
    nation.states            = Math.max(0, nation.states            + ev.colAdd);

    // ② ここでバフを即時反映
    nation.ecoRate *= ev.ecoBuff;
    nation.milRate *= ev.milBuff;
    nation.devRate *= ev.devBuff;

    // ③ （もし継続キューが必要なら）キュー登録
    activeEvents.push({
      nation,
      ecoBuff: ev.ecoBuff,
      milBuff: ev.milBuff,
      devBuff: ev.devBuff,
      powBuff: ev.powBuff,
      remainingDays: ev.days
    });
  });

  updateNationList();
  populateTransferDropdowns();
  renderComparison();
  populateEventNationDropdown();
  showEventMessage(ev, targets.map(i => nations[i].name));
}

});

function downloadCSV(csvText, fileName) {
  // UTF-8 BOM を先頭に追加する
  const bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
  const blob = new Blob([bom, csvText], { type: "text/csv;charset=utf-8;" });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
