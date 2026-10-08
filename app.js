/* =========================================================================
   가정의 벗 아카이브 — 화면 동작
   -------------------------------------------------------------------------
   빌드 도구 없이 브라우저에서 바로 실행되는 단일 스크립트입니다.
   불러오는 순서: data.js → translations.js → app.js (index.html 참고)

   목차
     1. 설정        CONFIG — 필터 목록, 정책 시기, 광고 분류 체계
     2. 도구        짧은 공용 함수 ($, esc, t, label …)
     3. 상태 · 주소  화면 상태(state)와 URL(#ad?lang=ko&year=1976) 동기화
     4. 데이터 조회  필터 · 검색 · 정렬
     5. 화면 그리기  GNB, 랜딩, 필터 바, 그리드
     6. 드롭다운     필터 드롭다운 열기/닫기/키보드
     7. 알림창       "대분류를 먼저 선택해 주세요"
     8. 상세 모달    이미지 · 연도 · 설명 · 라벨 태그
     9. 이벤트 연결  클릭 · 키보드 · 입력 · 주소 변경
    10. 시작
   ========================================================================= */


/* 1. 설정 ---------------------------------------------------------------- */
const CONFIG = {
  // 표지 필터 바에 보이는 필터 (순서 = 화면 순서)
  coverFilters: ['phase', 'figure', 'age', 'mode', 'setting'],

  // 표지 상세 모달에 태그로 보이는 항목 (순서 = 화면 순서)
  coverFields: ['phase', 'figure', 'age', 'mode', 'composition', 'size', 'setting', 'gaze'],

  // 광고 필터 바
  adFilters: ['year', 'main', 'sub'],
  adFields: ['main', 'sub', 'keyword'],

  // 정책 시기 코드 → 기간
  phases: {
    P2: '1968–1971', P3: '1972–1976', P4: '1977–1981', P5: '1982–1990',
    P6: '1991–1995', P7: '1996–2000', P8: '2001–2005',
  },

  // 광고 대분류 → 중분류 (순서 = 드롭다운 순서)
  categories: {
    '국가:기관정책': ['가족계획', '공모전', '공익광고:캠페인', '보건 행정', '성교육:상담'],
    '피임:부부생활': ['남성 피임', '부부보건:위생', '여성 피임', '피임 홍보'],
    '모자보건': ['수유:이유식', '유아용품', '정책:지원'],
    '여성보건': ['여성위생', '여성질환'],
    '국민건강:보건': ['영양:보충제', '특수:일반질환'],
    '가정:생활': ['기타', '생활 용품', '식음료', '주방 용품'],
    '주요행사홍보': [],
    'Other': [],
  },

  // 데이터 연결 링크 (소개문 안 {link} 자리)
   //26100853https://hh-archive-rawdata.com 수정
  dataLink: 'https://hh-archive-rawdata.com',
};

const RECORDS = window.ARCHIVE_RECORDS;   // data.js
const I18N = window.ARCHIVE_I18N;         // translations.js — 화면 문구
const LABELS = window.ARCHIVE_LABELS;     // translations.js — 라벨 표시 이름


/* 2. 도구 ---------------------------------------------------------------- */
const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];

// HTML 안에 넣을 글자를 안전하게 바꿈 (<, > 등이 태그로 해석되지 않도록)
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => (
  { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
));

// 화면 문구: t('reset') → '초기화' / 'Reset'
const t = key => I18N[state.lang][key] || key;

// 라벨 표시 이름: label('Woman') → '여성' / 'Woman', '국민건강:보건' → '국민건강 : 보건'
const label = value => {
  const name = LABELS[value]?.[state.lang === 'ko' ? 0 : 1] || value;
  return String(name).replace(/\s*:\s*/g, ' : ');
};

// 값 하나 또는 여러 개를 항상 배열로 (연도 없는 자료 → 빈 배열)
const toList = value => {
  if (Array.isArray(value)) return value;
  if (value == null || value === '') return [];
  return [String(value)];
};

// 날짜 표시: 1968.09 / 1971.2·3 / 연도 미상
const formatDate = record => {
  if (!record.year) return state.lang === 'ko' ? '연도 미상' : 'Year unknown';
  const month = record.month ? '.' + String(record.month).padStart(2, '0') : '';
  return record.year + month;
};

const recordsOf = type => RECORDS.filter(record => record.type === type);
const hasActiveFilter = () => Object.values(state.filters).some(Boolean) || Boolean(state.q);


/* 3. 상태 · 주소 ----------------------------------------------------------- */
// 화면의 모든 상태는 여기 하나에 모입니다. URL 에도 같은 내용이 기록됩니다.
const state = {
  view: 'home',      // 'home' | 'cover' | 'ad'
  lang: 'ko',        // 'ko' | 'en'
  filters: {},       // { phase: 'P2', year: '1976', main: '…', sub: '…' }
  q: '',             // 검색어
  item: null,        // 열려 있는 상세 모달의 자료 ID
};

const URL_FILTER_KEYS = ['year', ...CONFIG.coverFields, 'main', 'sub', 'keyword'];

// URL → state   예) #ad?lang=ko&main=모자보건
function readURL() {
  const [view, query = ''] = location.hash.slice(1).split('?');
  const params = new URLSearchParams(query);

  state.view = ['cover', 'ad'].includes(view) ? view : 'home';
  state.filters = {};
  URL_FILTER_KEYS.forEach(key => { if (params.has(key)) state.filters[key] = params.get(key); });
  state.q = params.get('q') || '';
  state.item = params.get('item');
  if (['ko', 'en'].includes(params.get('lang'))) state.lang = params.get('lang');
}

// state → URL (뒤로가기 기록은 남기지 않음)
function writeURL() {
  const params = new URLSearchParams();
  params.set('lang', state.lang);
  Object.entries(state.filters).forEach(([key, value]) => { if (value) params.set(key, value); });
  if (state.q) params.set('q', state.q);
  if (state.item) params.set('item', state.item);
  history.replaceState(null, '', `#${state.view}?${params}`);
}

// 상태를 바꾼 뒤 URL 과 화면을 함께 갱신
function update(changes = {}) {
  Object.assign(state, changes);
  writeURL();
  render();
}


/* 4. 데이터 조회 ----------------------------------------------------------- */
// 드롭다운에 들어갈 선택지
function optionsFor(key) {
  if (key === 'phase') return Object.keys(CONFIG.phases);
  if (key === 'main') return Object.keys(CONFIG.categories);
  if (key === 'sub') return CONFIG.categories[state.filters.main] || [];

  const all = recordsOf(state.view).flatMap(record => toList(record[key])).filter(Boolean);
  return [...new Set(all)].sort((a, b) => a.localeCompare(b, 'ko', { numeric: true }));
}

// 검색 대상 문자열: 라벨 원래 값 + 한글/영어 표시 이름
function searchText(record) {
  const fields = record.type === 'cover'
    ? ['year', ...CONFIG.coverFields]
    : ['year', ...CONFIG.adFields];
  return fields
    .flatMap(key => toList(record[key]))
    .flatMap(value => [value, ...(LABELS[value] || [])])
    .join(' ')
    .normalize('NFKC')
    .toLowerCase();
}

/* 정렬
   - 기본: 시간순 (연도 → 월 → 시트 순서)
   - 광고에서 연도를 골랐을 때만: 구글 시트 Ad_Category_Archive 순서 (분류별) */
const monthValue = record => {
  if (typeof record.month === 'number') return record.month;
  return record.month ? parseFloat(record.month) + 0.5 : 0;   // '2·3' 합병호 → 2.5
};
const sheetOrder = record => record.order ?? Infinity;
const byTime = (a, b) =>
  (a.year ?? 9999) - (b.year ?? 9999) ||
  monthValue(a) - monthValue(b) ||
  sheetOrder(a) - sheetOrder(b) ||
  a.id.localeCompare(b.id);
const bySheet = (a, b) => sheetOrder(a) - sheetOrder(b) || byTime(a, b);

function sortRecords(list) {
  const useSheetOrder = state.view === 'ad' && Boolean(state.filters.year);
  return list.sort(useSheetOrder ? bySheet : byTime);
}

// 현재 필터 · 검색어에 맞는 자료 목록
function matchingRecords() {
  const words = state.q.trim().normalize('NFKC').toLowerCase().split(/\s+/).filter(Boolean);
  const passesFilters = record => Object.entries(state.filters)
    .every(([key, value]) => !value || toList(record[key]).includes(value));
  const passesSearch = record => words.every(word => searchText(record).includes(word));

  return sortRecords(recordsOf(state.view).filter(record => passesFilters(record) && passesSearch(record)));
}


/* 5. 화면 그리기 ----------------------------------------------------------- */
function render() {
  openDropdown = null;
  document.documentElement.lang = state.lang;
  document.body.dataset.view = state.view;

  $('#header').innerHTML = state.view === 'home' ? '' : headerHTML();
  $('#content').innerHTML = state.view === 'home' ? landingHTML() : archiveHTML();
  if (state.view !== 'home') renderResults();

  syncDetail();
}

// GNB: [Cover] [Advertisement] ………… [처음으로 돌아갑니다...]
function headerHTML() {
  const tab = (view, text) =>
    `<a href="#${view}" class="${state.view === view ? 'selected' : ''}">[${esc(text)}]</a>`;
  return `
    <nav class="nav" aria-label="${state.lang === 'ko' ? '주 메뉴' : 'Main navigation'}">
      <div class="tabs">${tab('cover', t('cover'))}${tab('ad', t('ad'))}</div>
      <a class="home-link" href="#home" aria-label="${esc(t('homeLink'))}">
        <span class="label-long">[${esc(t('homeLink'))}]</span><span class="label-short" aria-hidden="true">[${esc(t('homeShort'))}]</span>
      </a>
    </nav>`;
}

// 랜딩 페이지 (인트로)
function landingHTML() {
  const link = (view, text) => `<a href="#${view}">${text}</a>`;
  const title = state.lang === 'ko'
    ? `『${esc(t('title'))}』`                                   // 한글: 『 』로 감쌈
    : `<em class="home-title-name">${esc(t('title'))}</em>`;   // 261008 영문: Happy Home 이탤릭
  const intro = esc(t('intro'))
    .replace(/\n/g, '<br>')
    .replace('{link}', `<a class="intro-link" href="${CONFIG.dataLink}" target="_blank" rel="noopener">hh-archive-rawdata.com</a>`); //261008 hh-archive-rawdata.com로 수정
  const langButton = (lang, text) =>
    `<button class="text ${state.lang === lang ? 'selected' : ''}" data-lang="${lang}" aria-pressed="${state.lang === lang}">[${text}]</button>`;

  return `
    <section class="home">
      <h1 class="home-title">1968—2005<br>${title}</h1>
      <div class="home-links">${link('cover', `${recordsOf('cover').length} Covers`)}${link('ad', `${recordsOf('ad').length} Advertisements`)}</div>
      <div class="home-bottom">
        <p class="intro">${intro}</p>
        <div class="home-language">${langButton('ko', 'Kor')}-${langButton('en', 'Eng')}</div>
      </div>
      <footer class="home-footer">
        ${link('home', '[Logo]')}
        <div>${link('cover', '[Cover Archive]')}-${link('ad', '[Advertisement Archive]')}</div>
      </footer>
    </section>`;
}

// 표지 / 광고 목록 화면: 여백 · 필터 바 · 결과 영역
function archiveHTML() {
  const filters = state.view === 'cover' ? CONFIG.coverFilters : CONFIG.adFilters;
  return `
    <section aria-label="${esc(t(state.view + 'Archive'))}">
      <div class="archive-space">${state.view === 'ad' ? '<span>[Filter]</span>' : ''}</div>
      <div class="filters">
        ${filters.map(dropdownHTML).join('')}
        <label class="search"><input type="search" aria-label="${esc(t('search'))}" placeholder="${esc(t('search'))}" value="${esc(state.q)}"></label>
        <button class="reset ${hasActiveFilter() ? '' : 'idle'}" data-reset>${esc(t('reset'))}</button>
      </div>
      <span id="count" class="sr-only" aria-live="polite"></span>
      <div id="results"></div>
    </section>`;
}

// 결과 그리드만 다시 그림 (검색어 입력 때는 필터 바를 다시 그리지 않음)
function renderResults() {
  const list = matchingRecords();
  $('.reset')?.classList.toggle('idle', !hasActiveFilter());
  $('#count').textContent = `${list.length} / ${recordsOf(state.view).length} ${t('count')}`;
  $('#results').innerHTML = list.length
    ? `<div class="gallery">${list.map(tileHTML).join('')}</div>`
    : `<div class="empty"><p>${esc(t('empty'))}</p><button class="text" data-reset>${esc(t('reset'))}</button></div>`;
}

function tileHTML(record) {
  const name = formatDate(record) + ' ' + t(record.type);
  const keyword = record.keyword || '';
  return `
    <button class="tile" data-item="${record.id}" aria-label="${esc(name + (keyword ? ' ' + keyword : ''))}">
      <img src="${esc(record.thumb || record.image)}" alt="${esc(name + (keyword ? ' — ' + keyword : ''))}" loading="lazy" decoding="async" width="520" height="712">
    </button>`;
}


/* 6. 드롭다운 -------------------------------------------------------------- */
// 구조: <div.dropdown> <button.dropdown-toggle> + <ul.dropdown-list role=listbox> </div>
let openDropdown = null;   // 지금 열려 있는 드롭다운 (없으면 null)

function optionLabelHTML(key, value) {
  if (value === '') return esc(t('all'));
  if (key === 'phase') {
    return `<span class="option-code">[${esc(value)}]</span><span>${esc(CONFIG.phases[value].replace('–', ' - '))}</span>`;
  }
  return esc(label(value));
}

function dropdownHTML(key) {
  const current = state.filters[key] || '';
  const showsAll = key === 'sub' && Boolean(state.filters.main);   // 대분류를 고르면 중분류는 'All' 표시
  const chosen = Boolean(current) || showsAll;
  const options = (key === 'sub' ? [''] : []).concat(optionsFor(key).map(String));
  const toggleText = chosen ? optionLabelHTML(key, current) : `[${esc(t(key))}]`;
  const ariaLabel = esc(t(key)) + (chosen ? ': ' + esc(current ? label(current) : t('all')) : '');

  return `
    <div class="filter dropdown" data-dropdown="${key}">
      <button type="button" class="dropdown-toggle ${chosen ? 'active' : ''}" data-filter="${key}"
        aria-haspopup="listbox" aria-expanded="false" aria-controls="list-${key}" aria-label="${ariaLabel}">
        <span class="dropdown-value">${toggleText}</span><span class="dropdown-icon" aria-hidden="true">+</span>
      </button>
      <ul class="dropdown-list" id="list-${key}" role="listbox" aria-label="${esc(t(key))}" tabindex="-1" hidden>
        ${options.map((value, i) => `<li role="option" id="opt-${key}-${i}" data-value="${esc(value)}" aria-selected="${value === current}">${optionLabelHTML(key, value)}</li>`).join('')}
      </ul>
    </div>`;
}

function openDropdownPanel(dropdown) {
  // 중분류는 대분류를 고른 뒤에만 열림
  if (dropdown.dataset.dropdown === 'sub' && !state.filters.main) {
    closeDropdown();
    showNotice(t('mainFirst'), $('.dropdown-toggle[data-filter="main"]'));
    return;
  }
  if (openDropdown && openDropdown !== dropdown) closeDropdown();

  openDropdown = dropdown;
  dropdown.classList.add('open');
  dropdown.querySelector('.dropdown-toggle').setAttribute('aria-expanded', 'true');
  const list = dropdown.querySelector('.dropdown-list');
  list.hidden = false;
  highlightOption(dropdown, list.querySelector('[aria-selected=true]') || list.querySelector('[role=option]'));
  list.focus();
}

function closeDropdown(returnFocus = false) {
  if (!openDropdown) return;
  const dropdown = openDropdown;
  openDropdown = null;
  dropdown.classList.remove('open');
  dropdown.querySelector('.dropdown-list').hidden = true;
  const toggle = dropdown.querySelector('.dropdown-toggle');
  toggle.setAttribute('aria-expanded', 'false');
  if (returnFocus) toggle.focus();
}

// 마우스/키보드로 가리킨 줄 표시 (하늘색 배경)
function highlightOption(dropdown, option) {
  dropdown.querySelectorAll('[role=option]').forEach(o => o.classList.toggle('is-active', o === option));
  if (!option) return;
  dropdown.querySelector('.dropdown-list').setAttribute('aria-activedescendant', option.id);
  option.scrollIntoView({ block: 'nearest' });
}

function chooseOption(dropdown, option) {
  const key = dropdown.dataset.dropdown;
  closeDropdown();
  state.filters[key] = option.dataset.value;
  if (key === 'main') delete state.filters.sub;   // 대분류가 바뀌면 중분류 초기화
  update();
  $(`.dropdown-toggle[data-filter="${key}"]`)?.focus();
}

// 열린 목록 안에서의 키보드: ↑ ↓ Home End Enter Space Esc Tab
function onListKeydown(event, dropdown) {
  const options = [...dropdown.querySelectorAll('[role=option]')];
  const index = options.findIndex(o => o.classList.contains('is-active'));
  const moveTo = i => {
    event.preventDefault();
    highlightOption(dropdown, options[Math.max(0, Math.min(options.length - 1, i))]);
  };

  switch (event.key) {
    case 'ArrowDown': moveTo(index + 1); break;
    case 'ArrowUp': moveTo(index - 1); break;
    case 'Home': moveTo(0); break;
    case 'End': moveTo(options.length - 1); break;
    case 'Enter':
    case ' ':
      event.preventDefault();
      if (options[index]) chooseOption(dropdown, options[index]);
      break;
    case 'Escape':
      event.preventDefault();
      event.stopPropagation();
      closeDropdown(true);
      break;
    case 'Tab': closeDropdown(); break;
  }
}


/* 7. 알림창 ---------------------------------------------------------------- */
function showNotice(message, returnFocusTo) {
  const notice = $('#notice');
  const ok = notice.querySelector('[data-notice-ok]');
  $('#notice-message').textContent = message;
  ok.textContent = `[${t('ok')}]`;
  notice.returnFocusTo = returnFocusTo || null;
  if (!notice.open) notice.showModal();
  ok.focus();
}

function closeNotice() {
  const notice = $('#notice');
  if (!notice.open) return;
  notice.close();
  notice.returnFocusTo?.focus();   // 닫으면 대분류 필터로 포커스 이동
}


/* 8. 상세 모달 ------------------------------------------------------------- */
// state.item 에 맞춰 모달을 열거나 닫음
function syncDetail() {
  const dialog = $('#detail');
  if (!state.item) {
    if (dialog.open) dialog.close();
    return;
  }
  const record = RECORDS.find(r => r.id === state.item && r.type === state.view);
  if (record) openDetail(record, false);
  else { state.item = null; writeURL(); }
}

function openDetail(record, saveToURL = true) {
  state.item = record.id;
  if (saveToURL) writeURL();

  const description = record.description?.[state.lang] || record.description?.ko || '';   // 영문이 없으면 한글
  $('#detail-content').innerHTML = `
    <div class="dialog-bar"><button class="text" data-close>[${esc(t('back'))}]</button></div>
    <article class="detail-layout" data-type="${record.type}">
      <div class="detail-image"><img src="${esc(record.image)}" alt="${esc(formatDate(record) + ' ' + t(record.type))}"></div>
      <div class="detail-info">
        <h2 id="detail-title">${yearHTML(record)}</h2>
        <p class="description">${esc(description)}</p>
        <div class="label-links">${tagsHTML(record)}</div>
      </div>
    </article>`;

  const dialog = $('#detail');
  if (!dialog.open) {
    dialog.showModal();
    dialog.focus();   // [돌아가기] 에 포커스 테두리가 생기지 않도록
  }
}

function closeDetail() {
  state.item = null;
  writeURL();
  $('#detail').close();
}

// 연도: 누르면 그 해 자료 목록으로 이동
function yearHTML(record) {
  if (!record.year) return esc(formatDate(record));
  const ariaLabel = t('yearLink').replace('{y}', record.year);
  return `<button class="year-link" data-year-link="${record.year}" aria-label="${esc(ariaLabel)}">${esc(formatDate(record))}</button>`;
}

// 라벨 태그: 누르면 그 라벨로 필터링된 목록으로 이동
//   표지: [P2] - [Woman] - [Adult] …
//   광고: [대분류]-[가정 : 생활] - [중분류]-[식음료] - [소분류 / 키워드]-[오리온 쬬코렡]
function tagsHTML(record) {
  const tag = (key, value) =>
    `<button data-label-key="${key}" data-label-value="${esc(value)}" aria-label="${esc(t(key) + ': ' + label(value))}">[${esc(label(value))}]</button>`;

  if (record.type === 'cover') {
    return CONFIG.coverFields
      .flatMap(key => toList(record[key]).filter(Boolean).map(value => tag(key, value)))
      .join(' - ');
  }
  return CONFIG.adFields
    .filter(key => record[key])
    .map(key => `<span class="label-name">[${esc(t(key))}]</span>-${tag(key, record[key])}`)
    .join(' - ');
}

// 태그를 누르면: 다른 필터는 지우고 그 라벨만 걸기 (광고 중·소분류는 상위 분류도 함께)
function filterByTag(key, value) {
  const record = RECORDS.find(r => r.id === state.item);
  const filters = { [key]: value };
  if (record.type === 'ad' && (key === 'sub' || key === 'keyword')) filters.main = record.main;
  if (record.type === 'ad' && key === 'keyword') filters.sub = record.sub;
  goToList(filters);
}

// 상세 모달을 닫고 지정한 필터로 목록 맨 위부터 보여주기
function goToList(filters) {
  $('#detail').close();
  update({ filters, q: '', item: null });
  window.scrollTo({ top: 0 });
}


/* 9. 이벤트 연결 ----------------------------------------------------------- */
// 화면을 다시 그려도 유지되도록 document 한 곳에서 받아 처리합니다 (이벤트 위임).

document.addEventListener('click', event => {
  const target = event.target;

  // 드롭다운
  const toggle = target.closest('.dropdown-toggle');
  if (toggle) {
    const dropdown = toggle.closest('.dropdown');
    openDropdown === dropdown ? closeDropdown() : openDropdownPanel(dropdown);
    return;
  }
  const option = target.closest('.dropdown-list [role=option]');
  if (option) { chooseOption(option.closest('.dropdown'), option); return; }

  const button = target.closest('button');
  if (!button) return;
  const data = button.dataset;

  if ('lang' in data) update({ lang: data.lang });                           // [Kor] [Eng]
  else if ('reset' in data) update({ filters: {}, q: '' });                  // Reset
  else if ('item' in data) openDetail(RECORDS.find(r => r.id === data.item)); // 그리드 타일
  else if ('close' in data) closeDetail();                                   // [돌아가기]
  else if ('yearLink' in data) goToList({ year: data.yearLink });            // 상세의 연도
  else if ('labelKey' in data) filterByTag(data.labelKey, data.labelValue);  // 상세의 라벨 태그
  else if ('noticeOk' in data) closeNotice();                                // 알림창 [OK]
});

// 드롭다운 바깥을 누르면 닫기
document.addEventListener('pointerdown', event => {
  if (openDropdown && !openDropdown.contains(event.target)) closeDropdown();
});

// 마우스를 올린 줄 표시
document.addEventListener('mousemove', event => {
  const option = event.target.closest('.dropdown-list [role=option]');
  if (option && !option.classList.contains('is-active')) highlightOption(option.closest('.dropdown'), option);
});

// 키보드: 버튼에서 ↑↓ 로 열기, 열린 목록 안에서 이동
document.addEventListener('keydown', event => {
  const toggle = event.target.closest?.('.dropdown-toggle');
  if (toggle && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
    event.preventDefault();
    openDropdownPanel(toggle.closest('.dropdown'));
    return;
  }
  const list = event.target.closest?.('.dropdown-list');
  if (list) onListKeydown(event, list.closest('.dropdown'));
});

// 검색어 입력: 결과 그리드만 다시 그림
document.addEventListener('input', event => {
  if (!event.target.matches('.search input')) return;
  state.q = event.target.value;
  writeURL();
  renderResults();
});

// Esc 키로 모달 · 알림창 닫기
$('#detail').addEventListener('cancel', event => { event.preventDefault(); closeDetail(); });
$('#notice').addEventListener('cancel', event => { event.preventDefault(); closeNotice(); });

// 상세 모달 바깥(배경)을 누르면 닫기
$('#detail').addEventListener('click', event => {
  if (event.target !== $('#detail')) return;
  const box = event.target.getBoundingClientRect();
  const outside = event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom;
  if (outside) closeDetail();
});

// 이미지를 불러오지 못하면 흐리게 표시
document.addEventListener('error', event => {
  if (event.target.tagName !== 'IMG') return;
  event.target.alt = t('imageError');
  event.target.style.opacity = '.3';
}, true);

// 주소(#cover, #ad, #home)가 바뀌면 그 화면으로
window.addEventListener('hashchange', () => {
  if ($('#detail').open) $('#detail').close();
  readURL();
  render();
  window.scrollTo({ top: 0 });
});


/* 10. 시작 ---------------------------------------------------------------- */
readURL();
render();
