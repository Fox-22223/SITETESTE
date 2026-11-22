'use strict';

// NOVA — aplicação sem dependências, pronta para hospedar no GitHub Pages.
const PLANETS = [
  {
    id: 'terra', name: 'Terra', category: 'rochoso', type: 'Planeta rochoso',
    subtitle: 'Nosso ponto de partida.', tagline: 'O PÁLIDO PONTO AZUL',
    description: 'O nosso lar é o único mundo conhecido que abriga vida. Oceanos, continentes e uma atmosfera protetora fazem da Terra um lugar extraordinário no cosmos.',
    distance: '1,00 UA', temperature: '15 °C', year: '365 dias',
    curiosity: 'Vista do espaço, a Terra revela um mosaico de oceanos, nuvens e continentes. Mais de 70% da sua superfície é coberta por água.'
  },
  {
    id: 'marte', name: 'Marte', category: 'rochoso', type: 'Planeta rochoso',
    subtitle: 'A próxima grande fronteira.', tagline: 'O PLANETA VERMELHO',
    description: 'Marte é um mundo de desertos avermelhados, vulcões gigantescos e antigos vestígios de água. Sua superfície inspira uma das maiores perguntas da astronomia: já existiu vida por lá?',
    distance: '1,52 UA', temperature: '−65 °C', year: '687 dias',
    curiosity: 'Olympus Mons, em Marte, é o maior vulcão conhecido do Sistema Solar e alcança mais de 20 quilômetros de altura.'
  },
  {
    id: 'venus', name: 'Vênus', category: 'rochoso', type: 'Planeta rochoso',
    subtitle: 'Um mundo de extremos.', tagline: 'O IRMÃO DA TERRA',
    description: 'Sob suas espessas nuvens, Vênus guarda uma superfície extremamente quente e uma atmosfera densa. É um lembrete impressionante de como dois planetas semelhantes podem seguir caminhos diferentes.',
    distance: '0,72 UA', temperature: '465 °C', year: '225 dias',
    curiosity: 'Vênus gira tão lentamente que uma rotação completa em torno de si leva mais tempo do que sua volta ao redor do Sol.'
  },
  {
    id: 'jupiter', name: 'Júpiter', category: 'gigante', type: 'Gigante gasoso',
    subtitle: 'O gigante das tempestades.', tagline: 'REI DOS PLANETAS',
    description: 'O maior planeta do Sistema Solar tem nuvens em faixas, uma tempestade colossal conhecida como Grande Mancha Vermelha e uma fascinante família de luas.',
    distance: '5,20 UA', temperature: '−110 °C', year: '11,9 anos',
    curiosity: 'A Grande Mancha Vermelha é uma tempestade observada há séculos. Júpiter não possui uma superfície sólida como a da Terra.'
  },
  {
    id: 'saturno', name: 'Saturno', category: 'gigante', type: 'Gigante gasoso',
    subtitle: 'Beleza em escala cósmica.', tagline: 'O SENHOR DOS ANÉIS',
    description: 'Saturno é reconhecido pelos anéis de gelo, poeira e rocha que o envolvem. Suas luas, especialmente Titã e Encélado, despertam enorme interesse científico.',
    distance: '9,58 UA', temperature: '−140 °C', year: '29,4 anos',
    curiosity: 'Os anéis de Saturno são extensos, mas surpreendentemente finos em comparação ao seu diâmetro.'
  },
  {
    id: 'netuno', name: 'Netuno', category: 'gigante', type: 'Gigante de gelo',
    subtitle: 'Nas profundezas do azul.', tagline: 'ALÉM DO CONHECIDO',
    description: 'Distante, frio e varrido por ventos intensos, Netuno é o planeta mais afastado do Sol. Seu azul profundo guarda fenômenos atmosféricos fascinantes.',
    distance: '30,1 UA', temperature: '−200 °C', year: '164,8 anos',
    curiosity: 'A sonda Voyager 2 é a única nave espacial que visitou Netuno de perto, em 1989.'
  }
];

const MISSIONS = {
  aurora: {
    name: 'Aurora I', code: 'NX–001', status: 'Simulação',
    destination: 'Órbita de Marte', type: 'Exploração orbital',
    description: 'Aurora I é um conceito fictício de nave de exploração projetado para estudar Marte a partir de sua órbita, registrar formações geológicas e imaginar como seria uma jornada humana ao planeta vermelho.',
    objective: 'Criar um mapa orbital e simular a transmissão de dados da superfície.',
    detail: 'O lançamento disponível nesta página é apenas uma animação educativa criada para a experiência NOVA.'
  },
  titan: {
    name: 'Titan Deep', code: 'NX–002', status: 'Conceito',
    destination: 'Titã, lua de Saturno', type: 'Estudo de superfície',
    description: 'Uma missão imaginária dedicada a explorar os mares de hidrocarbonetos, a atmosfera densa e as paisagens misteriosas de Titã, a maior lua de Saturno.',
    objective: 'Imaginar uma sonda capaz de analisar a superfície e transmitir registros científicos.',
    detail: 'Titã é real, mas a missão Titan Deep e seus objetivos aqui descritos são fictícios.'
  },
  blue: {
    name: 'Blue Horizon', code: 'NX–003', status: 'Ideação',
    destination: 'Netuno', type: 'Sonda de longo alcance',
    description: 'Blue Horizon é uma sonda conceitual pensada para uma viagem aos limites do sistema planetário, onde temperaturas extremas e ventos poderosos desafiam nossa imaginação.',
    objective: 'Simular observações atmosféricas e uma passagem próxima ao planeta.',
    detail: 'Esta missão é um exercício criativo da NOVA, sem lançamento ou cronograma real.'
  }
};

const KEY_FAVORITES = 'nova:favorites:v1';
const KEY_THEME = 'nova:theme:v1';
const VIEWS = ['inicio', 'explorar', 'missoes', 'colecao'];
const storedFavorites = readJSON(KEY_FAVORITES, []);
const favorites = new Set(Array.isArray(storedFavorites) ? storedFavorites.filter(id => PLANETS.some(p => p.id === id)) : []);
let currentFilter = 'todos';
let launchTimer = null;
let toastTimer = null;

const infoDialog = document.getElementById('info-dialog');
const launchDialog = document.getElementById('launch-dialog');
const themeButton = document.getElementById('theme-toggle');
const searchInput = document.getElementById('planet-search');

function readJSON(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value === null ? fallback : JSON.parse(value);
  } catch (_) {
    return fallback;
  }
}
function storeJSON(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (_) { /* Armazenamento indisponível: mantém estado nesta sessão. */ }
}
function toast(message) {
  const el = document.getElementById('toast');
  el.textContent = message;
  el.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('visible'), 2900);
}
function normalize(value) {
  return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}
function planetClass(id) { return 'planet-' + id; }
function planetMarkup(p) {
  const chosen = favorites.has(p.id);
  return [
    '<article class="planet-card">',
      '<div class="planet-card-top">',
        '<span class="card-index">', p.type.toUpperCase(), '</span>',
        '<button type="button" class="favorite-btn" data-favorite="', p.id,
          '" aria-pressed="', chosen, '" aria-label="', chosen ? 'Remover ' + p.name + ' da coleção' : 'Salvar ' + p.name + ' na coleção',
          '" title="', chosen ? 'Remover da coleção' : 'Salvar na coleção', '">', chosen ? '♥' : '♡', '</button>',
      '</div>',
      '<div class="planet-card-orb-wrap"><div class="planet-card-orb ', planetClass(p.id), '">',
         p.id === 'saturno' ? '<span class="saturn-ring"></span>' : '',
      '</div></div>',
      '<div class="planet-card-bottom"><div><span class="card-kicker">', p.tagline,
        '</span><h3>', p.name, '</h3><p>', p.subtitle, '</p></div>',
        '<button class="round-arrow" type="button" data-detail="', p.id, '" aria-label="Descobrir ', p.name, '">↗</button>',
      '</div>',
      '<div class="planet-card-footer"><span>DISTÂNCIA DO SOL</span><span>', p.distance, '</span></div>',
    '</article>'
  ].join('');
}
function renderExplorer() {
  const query = normalize(searchInput.value.trim());
  const visible = PLANETS.filter(p => (currentFilter === 'todos' || p.category === currentFilter) &&
    normalize(p.name + ' ' + p.type + ' ' + p.subtitle + ' ' + p.tagline).includes(query));
  document.getElementById('planet-grid').innerHTML = visible.map(planetMarkup).join('');
  document.getElementById('result-count').textContent = String(visible.length).padStart(2, '0') + (visible.length === 1 ? ' DESTINO ENCONTRADO' : ' DESTINOS ENCONTRADOS');
  document.getElementById('search-empty').hidden = visible.length > 0;
}
function renderFavorites() {
  const selected = PLANETS.filter(p => favorites.has(p.id));
  document.getElementById('favorites-grid').innerHTML = selected.map(planetMarkup).join('');
  document.getElementById('collection-empty').hidden = selected.length > 0;
  document.getElementById('favorite-total').textContent = String(selected.length).padStart(2, '0');
  const count = document.getElementById('nav-favorites-count');
  count.textContent = selected.length;
  count.hidden = selected.length === 0;
  document.querySelectorAll('.featured-card [data-favorite]').forEach(button => {
    const p = PLANETS.find(item => item.id === button.dataset.favorite);
    const chosen = favorites.has(p.id);
    button.setAttribute('aria-pressed', String(chosen));
    button.setAttribute('aria-label', (chosen ? 'Remover ' : 'Salvar ') + p.name + (chosen ? ' da coleção' : ' na coleção'));
    button.textContent = chosen ? '♥' : '♡';
  });
}
function toggleFavorite(id) {
  const planet = PLANETS.find(p => p.id === id);
  if (!planet) return;
  if (favorites.has(id)) {
    favorites.delete(id);
    toast(planet.name + ' removido da coleção');
  } else {
    favorites.add(id);
    toast(planet.name + ' adicionado à coleção ✦');
  }
  storeJSON(KEY_FAVORITES, [...favorites]);
  renderFavorites();
  renderExplorer();
  const modalFavorite = document.getElementById('modal-favorite');
  if (modalFavorite && modalFavorite.dataset.favorite === id) {
    modalFavorite.textContent = favorites.has(id) ? '♥ Remover da coleção' : '♡ Salvar na coleção';
    modalFavorite.setAttribute('aria-pressed', String(favorites.has(id)));
  }
}
function navigate(view, record = true) {
  if (!VIEWS.includes(view)) view = 'inicio';
  VIEWS.forEach(name => {
    const panel = document.getElementById('view-' + name);
    const active = name === view;
    panel.hidden = !active;
    panel.classList.toggle('is-active', active);
  });
  document.querySelectorAll('[data-view]').forEach(button => {
    const active = button.dataset.view === view;
    button.classList.toggle('is-active', active);
    if (active) button.setAttribute('aria-current', 'page');
    else button.removeAttribute('aria-current');
  });
  if (record && location.hash !== '#' + view) {
    history.pushState(null, '', '#' + view);
  }
  if (infoDialog.open) infoDialog.close();
  if (launchDialog.open) launchDialog.close();
  window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  document.title = (view === 'inicio' ? 'NOVA — Explore além do horizonte' :
    ({ explorar: 'Explorar', missoes: 'Missões', colecao: 'Minha coleção' }[view] + ' — NOVA'));
}
function openPlanet(id) {
  const p = PLANETS.find(item => item.id === id);
  if (!p) return;
  const saved = favorites.has(id);
  document.getElementById('dialog-content').innerHTML = [
    '<div class="detail-top"><span class="overline">NOVA / CATÁLOGO PLANETÁRIO</span>',
      '<div class="planet-card-orb ', planetClass(id), '">', id === 'saturno' ? '<span class="saturn-ring"></span>' : '', '</div></div>',
    '<div class="detail-content"><span class="card-kicker">', p.tagline, ' • ', p.type.toUpperCase(), '</span>',
      '<h2>', p.name, '</h2><p>', p.description, '</p>',
      '<div class="detail-stat-grid">',
        '<div class="detail-stat"><small>DO SOL</small><strong>', p.distance, '</strong></div>',
        '<div class="detail-stat"><small>TEMP. APROX.</small><strong>', p.temperature, '</strong></div>',
        '<div class="detail-stat"><small>ANO LOCAL</small><strong>', p.year, '</strong></div>',
      '</div>',
      '<div class="detail-fact"><strong>Você sabia?</strong> ', p.curiosity, '</div>',
      '<div class="detail-actions"><button type="button" class="btn btn-primary" id="modal-favorite" data-favorite="', id,
        '" aria-pressed="', saved, '">', saved ? '♥ Remover da coleção' : '♡ Salvar na coleção', '</button>',
      '<button type="button" class="btn btn-outline" data-close-dialog>Voltar à exploração</button></div>',
    '</div>'
  ].join('');
  infoDialog.showModal();
}
function openMission(id) {
  const m = MISSIONS[id];
  if (!m) return;
  document.getElementById('dialog-content').innerHTML = [
    '<div class="detail-mission-art" aria-hidden="true">✳</div>',
    '<div class="detail-content"><span class="card-kicker">', m.code, ' / MISSÃO FICTÍCIA / ', m.status.toUpperCase(), '</span>',
      '<h2>', m.name, '</h2><p>', m.description, '</p>',
      '<div class="detail-stat-grid">',
        '<div class="detail-stat"><small>DESTINO</small><strong>', m.destination, '</strong></div>',
        '<div class="detail-stat"><small>TIPO</small><strong>', m.type, '</strong></div>',
        '<div class="detail-stat"><small>FASE</small><strong>', m.status, '</strong></div>',
      '</div>',
      '<div class="detail-fact"><strong>Objetivo conceitual:</strong> ', m.objective, '<br>', m.detail, '</div>',
      '<div class="detail-actions"><button class="btn btn-primary" type="button" data-close-dialog>Entendi <span aria-hidden="true">↗</span></button></div>',
    '</div>'
  ].join('');
  infoDialog.showModal();
}
function setTheme(theme) {
  const selected = theme === 'light' ? 'light' : 'dark';
  document.documentElement.dataset.theme = selected;
  themeButton.setAttribute('aria-label', selected === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro');
  themeButton.title = selected === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro';
  document.querySelector('meta[name="theme-color"]').content = selected === 'dark' ? '#070b17' : '#eff5fc';
  storeJSON(KEY_THEME, selected);
}
function resetLaunch() {
  clearInterval(launchTimer);
  launchTimer = null;
  document.getElementById('launch-counter').textContent = '03';
  document.getElementById('launch-title').textContent = 'Preparar para decolagem';
  document.getElementById('launch-message').textContent = 'Iniciando contagem regressiva simulada...';
  document.getElementById('launch-progress-fill').style.width = '0%';
  document.getElementById('restart-launch').hidden = true;
}
function simulateLaunch() {
  resetLaunch();
  if (!launchDialog.open) launchDialog.showModal();
  let seconds = 3;
  launchTimer = setInterval(() => {
    seconds -= 1;
    document.getElementById('launch-counter').textContent = String(Math.max(seconds, 0)).padStart(2, '0');
    document.getElementById('launch-progress-fill').style.width = String(Math.round((3 - seconds) / 3 * 100)) + '%';
    if (seconds <= 0) {
      clearInterval(launchTimer);
      launchTimer = null;
      document.getElementById('launch-counter').textContent = '✦';
      document.getElementById('launch-title').textContent = 'Decolagem simulada!';
      document.getElementById('launch-message').textContent = 'A missão Aurora I iniciou sua jornada imaginária. Sinal recebido.';
      document.getElementById('restart-launch').hidden = false;
    }
  }, 1000);
}
function closeDialog(dialog) {
  if (dialog.open) dialog.close();
}
function addStars() {
  const field = document.getElementById('starfield');
  const frag = document.createDocumentFragment();
  for (let i = 0; i < 85; i++) {
    const star = document.createElement('i');
    star.className = 'star';
    const size = Math.random() > .92 ? 2.2 : 1;
    star.style.cssText = 'left:' + (Math.random() * 100).toFixed(2) + '%;top:' +
      (Math.random() * 100).toFixed(2) + '%;width:' + size + 'px;height:' + size +
      'px;--speed:' + (2 + Math.random() * 5).toFixed(1) + 's;--delay:-' + (Math.random() * 7).toFixed(1) + 's;';
    frag.appendChild(star);
  }
  field.appendChild(frag);
}
function setupReveals() {
  document.documentElement.classList.add('js');
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .08, rootMargin: '0px 0px -20px 0px' });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// Interação delegada mantém botões funcionando mesmo depois de renderizações.
document.addEventListener('click', event => {
  const target = event.target;
  const navigation = target.closest('[data-navigate], [data-view]');
  if (navigation) {
    event.preventDefault();
    navigate(navigation.dataset.navigate || navigation.dataset.view);
    return;
  }
  const favorite = target.closest('[data-favorite]');
  if (favorite) {
    toggleFavorite(favorite.dataset.favorite);
    return;
  }
  const detail = target.closest('[data-detail]');
  if (detail) { openPlanet(detail.dataset.detail); return; }
  const mission = target.closest('[data-mission]');
  if (mission) { openMission(mission.dataset.mission); return; }
  const filter = target.closest('[data-filter]');
  if (filter) {
    currentFilter = filter.dataset.filter;
    document.querySelectorAll('[data-filter]').forEach(button => {
      const active = button.dataset.filter === currentFilter;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    renderExplorer();
    return;
  }
  if (target.closest('[data-close-dialog]')) { closeDialog(infoDialog); return; }
  if (target.closest('[data-close-launch]')) { closeDialog(launchDialog); return; }
});

document.getElementById('clear-filters').addEventListener('click', () => {
  searchInput.value = '';
  currentFilter = 'todos';
  document.querySelectorAll('[data-filter]').forEach(button => {
    const active = button.dataset.filter === 'todos';
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  renderExplorer();
  searchInput.focus();
});
document.getElementById('launch-sim').addEventListener('click', simulateLaunch);
document.getElementById('restart-launch').addEventListener('click', simulateLaunch);
searchInput.addEventListener('input', renderExplorer);
themeButton.addEventListener('click', () => setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'));
launchDialog.addEventListener('close', () => { clearInterval(launchTimer); launchTimer = null; });
[infoDialog, launchDialog].forEach(dialog => {
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
});
window.addEventListener('popstate', () => navigate(location.hash.slice(1), false));
window.addEventListener('hashchange', () => navigate(location.hash.slice(1), false));
document.addEventListener('keydown', event => {
  if (event.key !== '/' || event.altKey || event.ctrlKey || event.metaKey || infoDialog.open || launchDialog.open) return;
  const el = document.activeElement;
  if (el && (['INPUT', 'TEXTAREA'].includes(el.tagName) || el.isContentEditable)) return;
  event.preventDefault();
  navigate('explorar');
  searchInput.focus();
});

// Inicialização
setTheme(readJSON(KEY_THEME, 'dark'));
addStars();
renderFavorites();
renderExplorer();
setupReveals();
navigate(location.hash.slice(1) || 'inicio', false);