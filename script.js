const state = {
  points: 0,
  basePerClick: 1,
  baseAutoRate: 0,
  manualMultiplier: 1,
  autoMultiplier: 1,
  selectedImageId: 'i0',
};

const manualUpgrades = [
  { id: 'm1', icon: '👆', name: 'Soft Tap', cost: 8, add: 1, purchased: 0 },
  { id: 'm2', icon: '✋', name: 'Steel Finger', cost: 24, add: 2, purchased: 0 },
  { id: 'm3', icon: '🤚', name: 'Double Palm', cost: 55, add: 4, purchased: 0 },
  { id: 'm4', icon: '⚡', name: 'Turbo Wrist', cost: 120, add: 7, purchased: 0 },
  { id: 'm5', icon: '🔥', name: 'Magma Knuckle', cost: 300, add: 15, purchased: 0 },
  { id: 'm6', icon: '🦾', name: 'Titan Press', cost: 700, add: 32, purchased: 0 },
  { id: 'm7', icon: '🌟', name: 'Star Punch', cost: 1600, add: 70, purchased: 0 },
  { id: 'm8', icon: '♾️', name: 'Infinity Tap', cost: 3600, add: 150, purchased: 0 },
];

const autoUpgrades = [
  { id: 'a1', icon: '🤖', name: 'Crumb Bot', cost: 15, add: 1, purchased: 0 },
  { id: 'a2', icon: '🛸', name: 'Baker Drone', cost: 45, add: 2, purchased: 0 },
  { id: 'a3', icon: '🦾', name: 'Conveyor Arm', cost: 110, add: 5, purchased: 0 },
  { id: 'a4', icon: '🏭', name: 'Cookie Lab', cost: 280, add: 11, purchased: 0 },
  { id: 'a5', icon: '🍪', name: 'Robotic Oven', cost: 680, add: 24, purchased: 0 },
  { id: 'a6', icon: '🏗️', name: 'Factory Floor', cost: 1500, add: 52, purchased: 0 },
  { id: 'a7', icon: '🌙', name: 'Moon Mine', cost: 3200, add: 110, purchased: 0 },
  { id: 'a8', icon: '🌌', name: 'Galaxy Foundry', cost: 7000, add: 240, purchased: 0 },
];

const multiplierUpgrades = [
  { id: 'x1', icon: '🖱️', name: 'Heavy Cursor', target: 'manual', cost: 400, mult: 2, purchased: false },
  { id: 'x2', icon: '🥇', name: 'Golden Gloves', target: 'manual', cost: 2200, mult: 3, purchased: false },
  { id: 'x3', icon: '⚛️', name: 'Quantum Tap', target: 'manual', cost: 12000, mult: 5, purchased: false },
  { id: 'x4', icon: '🧠', name: 'Overclock Core', target: 'auto', cost: 550, mult: 2, purchased: false },
  { id: 'x5', icon: '📈', name: 'AI Foreman', target: 'auto', cost: 3000, mult: 3, purchased: false },
  { id: 'x6', icon: '🕳️', name: 'Singularity Reactor', target: 'auto', cost: 15500, mult: 5, purchased: false },
];

const imageCatalog = [
  {
    id: 'i0',
    icon: '🌇',
    name: 'Sunset Orb',
    cost: 0,
    purchased: true,
    src: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 'i1',
    icon: '🪐',
    name: 'Neon Planet',
    cost: 80,
    purchased: false,
    src: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 'i2',
    icon: '💎',
    name: 'Crystal Bloom',
    cost: 260,
    purchased: false,
    src: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 'i3',
    icon: '🍩',
    name: 'Cyber Donut',
    cost: 780,
    purchased: false,
    src: 'https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 'i4',
    icon: '🌈',
    name: 'Candy Nebula',
    cost: 2100,
    purchased: false,
    src: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 'i5',
    icon: '👑',
    name: 'Sugar Crown',
    cost: 5600,
    purchased: false,
    src: 'https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 'i6',
    icon: '❄️',
    name: 'Frozen Star',
    cost: 14500,
    purchased: false,
    src: 'https://images.unsplash.com/photo-1511300636408-a63a89df3482?auto=format&fit=crop&w=500&q=80',
  },
];

const pointsEl = document.getElementById('points');
const perClickEl = document.getElementById('per-click');
const autoRateEl = document.getElementById('auto-rate');
const manualMultEl = document.getElementById('manual-mult');
const autoMultEl = document.getElementById('auto-mult');
const centerImageEl = document.getElementById('center-image');
const manualRoot = document.getElementById('manual-upgrades');
const autoRoot = document.getElementById('auto-upgrades');
const multiplierRoot = document.getElementById('multiplier-upgrades');
const imageShopRoot = document.getElementById('image-shop');
const ownedImagesRoot = document.getElementById('owned-images');

function effectivePerClick() {
  return state.basePerClick * state.manualMultiplier;
}

function effectiveAutoRate() {
  return state.baseAutoRate * state.autoMultiplier;
}

document.getElementById('click-target').addEventListener('click', () => {
  state.points += effectivePerClick();
  render();
});

function canAfford(cost) {
  return state.points >= cost;
}

function spend(cost) {
  state.points -= cost;
}

function inflation(baseCost, purchased) {
  return Math.floor(baseCost * Math.pow(1.33, purchased));
}

function createUpgradeCard({
  icon = '⭐',
  title,
  detail,
  costLabel,
  onClick,
  disabled,
  buttonLabel = 'Buy',
  selected = false,
}) {
  const wrapper = document.createElement('div');
  wrapper.className = 'upgrade-item';

  const heading = document.createElement('div');
  heading.className = 'upgrade-heading';

  const iconEl = document.createElement('span');
  iconEl.className = 'upgrade-icon';
  iconEl.textContent = icon;

  const name = document.createElement('strong');
  name.textContent = title;
  heading.append(iconEl, name);

  const info = document.createElement('div');
  info.className = 'small';
  info.textContent = detail;

  const button = document.createElement('button');
  button.textContent = `${buttonLabel}${costLabel ? ` (${costLabel})` : ''}`;
  button.disabled = disabled;
  if (selected) button.classList.add('selected');
  button.addEventListener('click', onClick);

  wrapper.append(heading, info, button);
  return wrapper;
}

function renderManual() {
  manualRoot.innerHTML = '';
  manualUpgrades.forEach((upgrade) => {
    const cost = inflation(upgrade.cost, upgrade.purchased);
    const card = createUpgradeCard({
      title: upgrade.name,
      icon: upgrade.icon,
      detail: `+${upgrade.add} base click power · Owned ${upgrade.purchased}`,
      costLabel: cost,
      disabled: !canAfford(cost),
      onClick: () => {
        if (!canAfford(cost)) return;
        spend(cost);
        state.basePerClick += upgrade.add;
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
      icon: upgrade.icon,
      detail: `+${upgrade.add} base auto / sec · Owned ${upgrade.purchased}`,
      costLabel: cost,
      disabled: !canAfford(cost),
      onClick: () => {
        if (!canAfford(cost)) return;
        spend(cost);
        state.baseAutoRate += upgrade.add;
        upgrade.purchased += 1;
        render();
      },
    });
    autoRoot.appendChild(card);
  });
}

function renderMultipliers() {
  multiplierRoot.innerHTML = '';
  multiplierUpgrades.forEach((upgrade) => {
    const targetName = upgrade.target === 'manual' ? 'manual click power' : 'auto production';
    const card = createUpgradeCard({
      title: upgrade.name,
      icon: upgrade.icon,
      detail: `One-time: x${upgrade.mult} ${targetName}`,
      costLabel: upgrade.purchased ? 'Owned' : upgrade.cost,
      disabled: upgrade.purchased || !canAfford(upgrade.cost),
      onClick: () => {
        if (upgrade.purchased || !canAfford(upgrade.cost)) return;
        spend(upgrade.cost);
        upgrade.purchased = true;
        if (upgrade.target === 'manual') {
          state.manualMultiplier *= upgrade.mult;
        } else {
          state.autoMultiplier *= upgrade.mult;
        }
        render();
      },
    });
    multiplierRoot.appendChild(card);
  });
}

function renderImageShop() {
  imageShopRoot.innerHTML = '';
  imageCatalog.forEach((image) => {
    if (image.purchased) return;
    const card = createUpgradeCard({
      title: image.name,
      icon: image.icon,
      detail: 'Unlock this skin for your click target.',
      costLabel: image.cost,
      disabled: !canAfford(image.cost),
      onClick: () => {
        if (!canAfford(image.cost) || image.purchased) return;
        spend(image.cost);
        image.purchased = true;
        state.selectedImageId = image.id;
        render();
      },
    });
    imageShopRoot.appendChild(card);
  });

  if (!imageShopRoot.children.length) {
    const complete = document.createElement('p');
    complete.className = 'small';
    complete.textContent = 'All images unlocked. Nice grind!';
    imageShopRoot.appendChild(complete);
  }
}

function renderOwnedImages() {
  ownedImagesRoot.innerHTML = '';
  imageCatalog.forEach((image) => {
    if (!image.purchased) return;
    const card = createUpgradeCard({
      title: image.name,
      icon: image.icon,
      detail: 'Swap to this image at any time.',
      costLabel: '',
      buttonLabel: 'Use',
      selected: image.id === state.selectedImageId,
      disabled: false,
      onClick: () => {
        state.selectedImageId = image.id;
        render();
      },
    });
    ownedImagesRoot.appendChild(card);
  });
}

function render() {
  const activeImage = imageCatalog.find((image) => image.id === state.selectedImageId) || imageCatalog[0];
  centerImageEl.src = activeImage.src;

  pointsEl.textContent = Math.floor(state.points);
  perClickEl.textContent = effectivePerClick();
  autoRateEl.textContent = effectiveAutoRate();
  manualMultEl.textContent = `${state.manualMultiplier}x`;
  autoMultEl.textContent = `${state.autoMultiplier}x`;

  renderManual();
  renderAuto();
  renderMultipliers();
  renderImageShop();
  renderOwnedImages();
}

setInterval(() => {
  state.points += effectiveAutoRate();
  render();
}, 1000);

render();
