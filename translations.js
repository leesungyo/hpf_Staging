/* =========================================================================
   화면 문구 · 라벨 표시 이름
   -------------------------------------------------------------------------
   글자만 바꿀 때는 이 파일만 수정하면 됩니다. (코드 수정 불필요)

   ARCHIVE_I18N   화면 문구     t('reset') → ko '초기화' / en 'Reset'
   ARCHIVE_LABELS 라벨 표시 이름 data.js 의 값 → [한글, 영어]
                  예) 'Woman' → ['여성', 'Woman']
   ========================================================================= */

window.ARCHIVE_I18N = {
  ko: {
    // 사이트 · GNB
    title: '가정의 벗',
    cover: '표지',
    ad: '광고',
    coverArchive: '표지 아카이브',
    adArchive: '광고 아카이브',
    homeLink: '처음으로 돌아갑니다...',
    homeShort: '처음으로',
    // 필터 이름
    phase: '정책 시기',
    figure: '인물 유형',
    age: '연령',
    mode: '표현 방식',
    composition: '구도',
    size: '인물 크기',
    setting: '배경',
    gaze: '시선과 방향',
    year: '연도',
    main: '대분류',
    sub: '중분류',
    keyword: '소분류 / 키워드',
    // 필터 바 · 목록
    search: '분류·키워드 검색…',
    reset: '초기화',
    all: '전체',
    count: '건',
    empty: '해당하는 자료가 없습니다.',
    mainFirst: '중분류를 선택하기 전에 대분류를 먼저 선택해 주세요.',
    ok: '확인',
    // 상세 모달
    back: '돌아가기',
    yearLink: '{y}년 자료 모두 보기',
    imageError: '이미지를 불러오지 못했습니다.',
    // 랜딩 소개문 (\n = 줄바꿈, {link} = hh-archive.com 링크)
    intro: '이 아카이브는 백민지의 석사학위 청구전시와 논문 연구 과정에서 만들어졌다. 1968년부터 2005년까지 발행된 잡지 『가정의 벗』 총 442호 중 확인이 어려운 6호를 제외한 436호의 표지 436건과 광고·홍보 지면 658건을 수집했다.\n표지는 인물 유형, 연령, 표현 방식, 구도, 인물 크기, 배경, 시선과 방향을 기준으로 기록하고 비교했다. 광고와 홍보물은 주제와 메시지에 따라 분류하고, 피임과 출산에 관한 메시지가 누구를 향해 어떤 방식으로 제시되었는지 분석했다. 이미지와 분석 결과, 분류의 바탕이 된 전체 로우데이터는 {link}에서 확인할 수 있다.',
  },
  en: {
    // 사이트 · GNB
    title: 'Happy Home',
    cover: 'Cover',
    ad: 'Advertisement',
    coverArchive: 'Cover Archive',
    adArchive: 'Advertisement Archive',
    homeLink: 'Back to the Forward...',
    homeShort: 'Forward',
    // 필터 이름
    phase: 'Phase',
    figure: 'Figure Type',
    age: 'Age Focus',
    mode: 'Graphic Mode',
    composition: 'Composition',
    size: 'Figure Size',
    setting: 'Setting',
    gaze: 'Gaze & Direction',
    year: 'Year',
    main: 'Main Filter',
    sub: 'Sub Filter',
    keyword: 'Keyword',
    // 필터 바 · 목록
    search: 'Search labels…',
    reset: 'Reset',
    all: 'All',
    count: 'items',
    empty: 'No matching items.',
    mainFirst: 'Please choose a main filter before selecting a sub-filter.',
    ok: 'OK',
    // 상세 모달
    back: 'Back',
    yearLink: 'Show all items from {y}',
    imageError: 'Image could not be loaded.',
    // 랜딩 소개문 (\n = 줄바꿈, {link} = hh-archive.com 링크)
    intro: 'This archive was developed as part of Minji Baek’s master’s degree exhibition and thesis research. It brings together 436 covers and 658 advertising and promotional pages collected from 436 of the 442 issues of the magazine Gajeong-ui Beot published between 1968 and 2005, excluding six unavailable issues. The covers were documented and compared according to figure type, age, mode of representation, composition, figure size, setting, gaze, and direction. Advertisements and promotional materials were classified by subject and message, examining whom messages about contraception and childbirth addressed and how they were presented. Images, findings, and the complete raw dataset underlying the classification are available at {link}.',
  },
};

window.ARCHIVE_LABELS = {
  // 표지 — 인물 유형 (Figure Type)
  'Woman':        ['여성', 'Woman'],
  'Man':          ['남성', 'Man'],
  'Boy':          ['남아', 'Boy'],
  'Girl':         ['여아', 'Girl'],
  'Baby':         ['아기', 'Baby'],
  'Couple':       ['커플', 'Couple'],
  'People group': ['인물 집단', 'People group'],
  'Other':        ['기타', 'Other'],
  'No person':    ['인물 없음', 'No person'],
  // 표지 — 연령 (Age Focus)
  'Child': ['아동', 'Child'],
  'Adult': ['성인', 'Adult'],
  'Youth': ['청소년·청년층', 'Youth'],
  'Elder': ['노년층', 'Elder'],
  'none':  ['해당 없음', 'None'],
  'N/A':   ['해당 없음', 'N/A'],
  // 표지 — 표현 방식 (Graphic Mode)
  'Photo':        ['사진', 'Photo'],
  'Painting':     ['회화', 'Painting'],
  'Illustration': ['일러스트', 'Illustration'],
  '3D/Vector':    ['3D·벡터', '3D/Vector'],
  // 표지 — 구도 (Composition)
  'Figure-centric':    ['인물 중심', 'Figure-centric'],
  'Group-centric':     ['집단 중심', 'Group-centric'],
  'Portrait close-up': ['인물 클로즈업', 'Portrait close-up'],
  'Landscape':         ['풍경·배경 중심', 'Landscape'],
  // 표지 — 인물 크기 (Figure Size)
  'Small':  ['작음', 'Small'],
  'Medium': ['중간', 'Medium'],
  'Large':  ['큼', 'Large'],
  'Full':   ['전신', 'Full'],
  // 표지 — 배경 (Setting)
  'Rural field':       ['농촌·들판', 'Rural field'],
  'Home interior':     ['가정 내부', 'Home interior'],
  'Outdoor seasonal':  ['계절적 야외', 'Outdoor seasonal'],
  'Symbolic backdrop': ['상징적 배경', 'Symbolic backdrop'],
  'Undefined':         ['특정되지 않음', 'Undefined'],
  // 표지 — 시선과 방향 (Gaze & Direction)
  'Upward':             ['상향', 'Upward'],
  'Downward':           ['하향', 'Downward'],
  'Off camera':         ['카메라 밖 응시', 'Off camera'],
  'Interaction':        ['상호작용', 'Interaction'],
  'Direct eye contact': ['정면 응시', 'Direct eye contact'],
  // 광고 — 대분류
  '국가:기관정책': ['국가:기관정책', 'National / Institutional Policy'],
  '피임:부부생활': ['피임:부부생활', 'Contraception / Marital Life'],
  '모자보건':    ['모자보건', 'Maternal & Child Health'],
  '여성보건':    ['여성보건', 'Women’s Health'],
  '국민건강:보건': ['국민건강:보건', 'Public Health'],
  '가정:생활':   ['가정:생활', 'Home / Daily Life'],
  '주요행사홍보':  ['주요행사홍보', 'Major Event Promotions'],
  // 광고 — 중분류
  '가족계획':     ['가족계획', 'Family Planning'],
  '공모전':      ['공모전', 'Competitions'],
  '공익광고:캠페인': ['공익광고:캠페인', 'Public Campaigns'],
  '보건 행정':    ['보건 행정', 'Health Administration'],
  '성교육:상담':   ['성교육:상담', 'Sex Education / Counseling'],
  '남성 피임':    ['남성 피임', 'Male Contraception'],
  '여성 피임':    ['여성 피임', 'Female Contraception'],
  '부부보건:위생':  ['부부보건:위생', 'Couple Health / Hygiene'],
  '피임 홍보':    ['피임 홍보', 'Contraception Promotion'],
  '수유:이유식':   ['수유:이유식', 'Feeding / Weaning'],
  '유아용품':     ['유아용품', 'Baby Products'],
  '정책:지원':    ['정책:지원', 'Policy / Support'],
  '여성위생':     ['여성위생', 'Feminine Hygiene'],
  '여성질환':     ['여성질환', 'Women’s Health Conditions'],
  '영양:보충제':   ['영양:보충제', 'Nutrition / Supplements'],
  '특수:일반질환':  ['특수:일반질환', 'General / Specific Conditions'],
  '기타':       ['기타', 'Miscellaneous'],
  '생활 용품':    ['생활 용품', 'Household Goods'],
  '식음료':      ['식음료', 'Food / Beverages'],
  '주방 용품':    ['주방 용품', 'Kitchenware'],
};
