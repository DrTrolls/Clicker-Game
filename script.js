const state = {
  points: 0,
  perClick: 1,
  autoRate: 0,
};

const manualUpgrades = [
  { id: 'm1', name: 'Stronger Tap', cost: 10, add: 1, purchased: 0 },
  { id: 'm2', name: 'Power Finger', cost: 40, add: 3, purchased: 0 },
  { id: 'm3', name: 'Mega Hand', cost: 120, add: 8, purchased: 0 },
];

const autoUpgrades = [
  { id: 'a1', name: 'Tiny Bot', cost: 25, add: 1, purchased: 0 },
  { id: 'a2', name: 'Worker Bot', cost: 90, add: 3, purchased: 0 },
  { id: 'a3', name: 'Factory Bot', cost: 250, add: 8, purchased: 0 },
];

const imageUpgrades = [
  {
    id: 'i1',
    name: 'Sunset Orb',
    cost: 30,
    src: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'i2',
    name: 'Neon Planet',
    cost: 110,
    src: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'i3',
    name: 'Crystal Bloom',
    cost: 280,
    src: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=400&q=80',
  },
];

const pointsEl = document.getElementById('points');
const perClickEl = document.getElementById('per-click');
const autoRateEl = document.getElementById('auto-rate');
const centerImageEl = document.getElementById('center-image');
const manualRoot = document.getElementById('manual-upgrades');
const autoRoot = document.getElementById('auto-upgrades');
const imageRoot = document.getElementById('image-upgrades');

document.getElementById('click-target').addEventListener('click', () => {
  state.points += state.perClick;
  render();
});

function canAfford(cost) {
  return state.points >= cost;
}

function spend(cost) {
  state.points -= cost;
}

function inflation(baseCost, purchased) {
  return Math.floor(baseCost * Math.pow(1.35, purchased));
}

function createUpgradeCard({ title, detail, cost, onBuy, disabled }) {
  const wrapper = document.createElement('div');
  wrapper.className = 'upgrade-item';

  const name = document.createElement('strong');
  name.textContent = title;

  const info = document.createElement('div');
  info.className = 'small';
  info.textContent = detail;

  const button = document.createElement('button');
  button.textContent = `Buy (${cost})`;
  button.disabled = disabled;
  button.addEventListener('click', onBuy);

  wrapper.append(name, info, button);
  return wrapper;
}

function renderManual() {
  manualRoot.innerHTML = '';
  manualUpgrades.forEach((upgrade) => {
    const cost = inflation(upgrade.cost, upgrade.purchased);
    const card = createUpgradeCard({
      title: upgrade.name,
      detail: `+${upgrade.add} points per click · Owned ${upgrade.purchased}`,
      cost,
      disabled: !canAfford(cost),
      onBuy: () => {
        if (!canAfford(cost)) return;
        spend(cost);
        state.perClick += upgrade.add;
        upgrade.purchased += 1;
        render();
      },
    });
    manualRoot.appendChild(card);
  });
}

function renderAuto() {
  autoRoot.innerHTML = '';
  autoUpgrades.forEach((upgrade) => {
    const cost = inflation(upgrade.cost, upgrade.purchased);
    const card = createUpgradeCard({
      title: upgrade.name,
      detail: `+${upgrade.add} points each second · Owned ${upgrade.purchased}`,
      cost,
      disabled: !canAfford(cost),
      onBuy: () => {
        if (!canAfford(cost)) return;
        spend(cost);
        state.autoRate += upgrade.add;
        upgrade.purchased += 1;
        render();
      },
    });
    autoRoot.appendChild(card);
  });
}

function renderImages() {
  imageRoot.innerHTML = '';
  imageUpgrades.forEach((upgrade) => {
    const card = createUpgradeCard({
      title: upgrade.name,
      detail: 'Changes the center image',
      cost: upgrade.cost,
      disabled: !canAfford(upgrade.cost),
      onBuy: () => {
        if (!canAfford(upgrade.cost)) return;
        spend(upgrade.cost);
        centerImageEl.src = upgrade.src;
        render();
      },
    });
    imageRoot.appendChild(card);
  });
}

function render() {
  pointsEl.textContent = Math.floor(state.points);
  perClickEl.textContent = state.perClick;
  autoRateEl.textContent = state.autoRate;
  renderManual();
  renderAuto();
  renderImages();
}

setInterval(() => {
  state.points += state.autoRate;
  render();
}, 1000);

render();
