console.clear();
AOS.init();

// ========== DOM 요소 선택 ==========
const html = document.querySelector("html");
const wrap = document.querySelector(".wrap");

// 모바일 메뉴 관련
const mobileMenuBtn = document.getElementById("mobile-menu-btn");
const mobileSideMenu = document.getElementById("mobile-side-menu");
const mobileCloseBtn = document.getElementById("mobile-close-btn");
const moListNav = document.querySelector(".mo-list-nav");

// 메가메뉴 관련
const menuItems = document.querySelectorAll(".menu-box .menu-item");

// 스와이퍼 제어 버튼
const stopBtn = document.getElementById("stop-btn");
const playBtn = document.getElementById("play-btn");

// 슬라이드 진행 표시 (PC)
const currentSlideText = document.getElementById("current-slide");
const totalSlidesText = document.getElementById("total-slides");
const progress = document.querySelector(".progress");

// 슬라이드 진행 표시 (모바일)
const moCurrentSlideText = document.querySelector(".mo-current-slide");
const moTotalSlideText = document.querySelector(".mo-total-slide");

// 드롭다운 관련
const button = document.getElementById("dropdownButton");
const dropdownCon = document.querySelector(".dropdown-container");
const dropdownMenuWrap = document.querySelector(".dropdown-wrapper");

// ========== 전역 변수 ==========
const totalSlides = 4;
let isHoveringMenu = false;
let currentIndex = 0;
let pcSwiper = null;
let mobileSwiper = null;

// ==================== 메가메뉴 기능 ====================

// 모든 서브메뉴 표시
function showAllSubMenus() {
  menuItems.forEach((menu) => {
    const subMenu = menu.querySelector(".list-nav-sub");
    if (subMenu) subMenu.classList.add("active");
  });
  wrap.classList.add("active");
}

// 모든 서브메뉴 숨김
function hideAllSubMenus() {
  menuItems.forEach((item) => {
    const subMenu = item.querySelector(".list-nav-sub");
    if (subMenu) subMenu.classList.remove("active");
  });
  wrap.classList.remove("active");
}

// 메가메뉴 이벤트 리스너 등록
menuItems.forEach((item) => {
  item.addEventListener("mouseenter", () => {
    isHoveringMenu = true;
    showAllSubMenus();
  });

  item.addEventListener("mouseleave", () => {
    isHoveringMenu = false;
    if (!wrap.matches(":hover")) hideAllSubMenus();
  });
});

wrap.addEventListener("mouseenter", () => {
  if (isHoveringMenu) showAllSubMenus();
});

wrap.addEventListener("mouseleave", hideAllSubMenus);

// ==================== 모바일 사이드 메뉴 ====================

// 모바일 사이드 메뉴 표시
function mobileSideMenuShow() {
  html.classList.add("overflow-hidden");
  mobileSideMenu.classList.add("active");
  mobileMenuBtn.classList.add("hidden");
}

// 모바일 사이드 메뉴 숨김
function mobileSideMenuHide() {
  html.classList.remove("overflow-hidden");
  mobileSideMenu.classList.remove("active");
  mobileMenuBtn.classList.remove("hidden");
}

// 모바일 사이드 메뉴 초기화
function mobileSideMenuInit() {
  if (!mobileMenuBtn || !mobileCloseBtn) return;

  mobileMenuBtn.addEventListener("click", mobileSideMenuShow);
  mobileCloseBtn.addEventListener("click", mobileSideMenuHide);
}

mobileSideMenuInit();

// ==================== 스크롤 이벤트 ====================

$(window).scroll(function () {
  const $scrollTop = $(this).scrollTop();
  const $topBar = $(".top-bar");

  // 상단 바 활성화/비활성화
  if ($scrollTop > 0) {
    $topBar.addClass("active");
  } else {
    $topBar.removeClass("active");
  }

  // 드롭다운 위치 업데이트
  if (dropdownCon && dropdownCon.classList.contains("active")) {
    updateDropdownPosition();
  }
});

// ==================== 프로그레스 바 업데이트 ====================

function updateProgressBar() {
  //페이지 숫자에 따른 너비 계산
  const widthPercentage = ((currentIndex + 1) / totalSlides) * 100;
  progress.style.width = `${widthPercentage}%`;
  currentSlideText.textContent = currentIndex + 1;
}

// ==================== 재생/정지 버튼 ====================

// 버튼 토글
function toggleButtons() {
  if (!stopBtn || !playBtn) return;
  stopBtn.classList.toggle("hidden");
  playBtn.classList.toggle("active");
}

// 재생/정지 버튼 이벤트 등록
if (stopBtn && playBtn) {
  // 정지 버튼
  stopBtn.addEventListener("click", () => {
    console.log("정지 버튼 클릭");
    if (window.innerWidth >= 768 && pcSwiper) {
      pcSwiper.autoplay.stop();
    } else if (window.innerWidth < 768 && mobileSwiper) {
      mobileSwiper.autoplay.stop();
    }
    toggleButtons();
  });

  // 재생 버튼
  playBtn.addEventListener("click", () => {
    console.log("재생 버튼 클릭");
    if (window.innerWidth >= 768 && pcSwiper) {
      pcSwiper.autoplay.start();
    } else if (window.innerWidth < 768 && mobileSwiper) {
      mobileSwiper.autoplay.start();
    }
    toggleButtons();
  });
}

// ==================== PC 스와이퍼 초기화 ====================

function initPCSwiper() {
  pcSwiper = new Swiper("#swiper", {
    direction: "horizontal",
    slidesPerView: 1,
    spaceBetween: 20,
    loop: true,
    centeredSlides: true,
    autoplay: {
      delay: 8000,
      disableOnInteraction: false,
    },
    effect: "slide",
    speed: 1200,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    on: {
      init: function () {
        console.log("PC Swiper 초기화 완료");
        currentIndex = this.realIndex;

        // 프로그레스 바 초기화
        if (progress) {
          progress.style.width = "0%";
        }

        updateProgressBar();
      },
      slideChange: function () {
        console.log("PC 슬라이드 변경");
        currentIndex = this.realIndex;
        updateProgressBar();
      },
    },
  });
}

// ==================== 모바일 스와이퍼 초기화 ====================

function initMobileSwiper() {
  mobileSwiper = new Swiper(".mobile-swiper-wrap .swiper", {
    slidesPerView: 1.2,
    spaceBetween: 15,
    loop: false, //
    centeredSlides: true,
    autoplay: {
      delay: 8000,
      disableOnInteraction: false,
    },
    effect: "slide",
    speed: 1000,
    on: {
      init: function () {
        console.log("Mobile Swiper 초기화 완료");
        currentIndex = this.realIndex;
        updateProgressBar();

        // 총 슬라이드 수 표시
        if (moTotalSlideText) {
          moTotalSlideText.textContent = totalSlides;
        }

        // 현재 슬라이드 수 표시
        if (moCurrentSlideText) {
          moCurrentSlideText.textContent = currentIndex + 1;
        }
      },
      slideChange: function () {
        console.log("모바일 슬라이드 변경");
        currentIndex = this.realIndex;
        updateProgressBar();

        // 슬라이드 번호 업데이트
        if (moCurrentSlideText) {
          moCurrentSlideText.textContent = currentIndex + 1;
        }
      },
    },
  });
}

// ==================== 반응형 처리 ====================

function handleResize() {
  const width = window.innerWidth;
  console.log(`화면 크기: ${width}px`);

  if (width >= 768) {
    // PC 모드
    console.log("PC 모드 활성화");
    if (mobileSwiper) {
      mobileSwiper.destroy(true, true);
      mobileSwiper = null;
    }
    if (!pcSwiper) {
      initPCSwiper();
    }
  } else {
    // 모바일 모드
    console.log("모바일 모드 활성화");
    if (pcSwiper) {
      pcSwiper.destroy(true, true);
      pcSwiper = null;
    }
    if (!mobileSwiper) {
      initMobileSwiper();
    }
  }

  // 드롭다운 위치 업데이트
  if (dropdownCon && dropdownCon.classList.contains("active")) {
    updateDropdownPosition();
  }
}

// ==================== 초기화 ====================

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM 로드 완료");

  // PC 총 슬라이드 수 표시
  if (totalSlidesText) {
    totalSlidesText.textContent = totalSlides;
  }

  // 모바일 총 슬라이드 수 표시
  if (moTotalSlideText) {
    moTotalSlideText.textContent = totalSlides;
  }

  // 모바일 현재 슬라이드 초기값
  if (moCurrentSlideText) {
    moCurrentSlideText.textContent = 1;
  }

  // 초기 반응형 처리
  handleResize();

  // 리사이즈 이벤트 (디바운스 적용)
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(handleResize, 250);
  });

  // 드롭다운 스크롤 기능 초기화
  initDropdownScroll();
});

// 페이지 언로드 시 스와이퍼 정리
window.addEventListener("beforeunload", () => {
  if (pcSwiper) pcSwiper.destroy(true, true);
  if (mobileSwiper) mobileSwiper.destroy(true, true);
});

// ==================== 드롭다운 메뉴 ====================

// 드롭다운 위치 업데이트
function updateDropdownPosition() {
  if (!button || !dropdownCon || !dropdownMenuWrap) return;

  const buttonRect = button.getBoundingClientRect();
  const dropdownHeight = dropdownMenuWrap.offsetHeight || 250;
  const isMobile = window.innerWidth < 768;

  if (isMobile) {
    // 모바일: 버튼 아래 배치
    dropdownCon.style.left = `${buttonRect.left}px`;
    dropdownCon.style.top = `${buttonRect.bottom + 5}px`;
    dropdownCon.style.width = `${buttonRect.width}px`;
  } else {
    // 데스크톱: 버튼 위 배치
    dropdownCon.style.left = `${buttonRect.left}px`;
    dropdownCon.style.top = `${buttonRect.top - dropdownHeight - 5}px`;
    dropdownCon.style.width = `${buttonRect.width}px`;
  }
}

// 드롭다운 메뉴 표시
function familySiteMenuShow() {
  dropdownCon.classList.add("active");
  updateDropdownPosition();
  setTimeout(() => {
    if (window.updateButtonState) {
      window.updateButtonState();
    }
  }, 50);
}

// 드롭다운 메뉴 숨김
function familySiteMenuHide() {
  dropdownCon.classList.remove("active");
}

// 드롭다운 버튼 초기화
function familySiteBtn__init() {
  if (!button || !dropdownCon || !dropdownMenuWrap) {
    console.warn("드롭다운 필수 요소를 찾을 수 없습니다.");
    return;
  }

  // 드롭다운 토글
  button.addEventListener("click", (e) => {
    e.stopPropagation();
    const isActive = dropdownCon.classList.contains("active");
    if (isActive) {
      familySiteMenuHide();
    } else {
      familySiteMenuShow();
    }
  });

  // 외부 클릭 시 메뉴 닫기
  document.addEventListener("click", (e) => {
    if (!dropdownCon.contains(e.target) && !button.contains(e.target)) {
      familySiteMenuHide();
    }
  });

  // 드롭다운 내부 클릭 시 이벤트 전파 중지
  dropdownMenuWrap.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  // 초기 위치 설정
  updateDropdownPosition();
}

// 드롭다운 스크롤 기능 초기화
function initDropdownScroll() {
  const upScroll = document.getElementById("up-scroll");
  const downScroll = document.getElementById("down-scroll");
  const menu = document.querySelector(".dropdown-menu");

  if (!upScroll || !downScroll || !menu) {
    console.warn("드롭다운 스크롤 요소를 찾을 수 없습니다.");
    return;
  }

  let scrollInterval;
  const scrollSpeed = 4;
  const intervalTime = 10;

  // 스크롤 버튼 상태 업데이트
  function updateButtonState() {
    if (menu.clientHeight === 0 || !dropdownCon.classList.contains("active")) {
      upScroll.classList.add("hide");
      downScroll.classList.add("hide");
      return;
    }

    // 위로 버튼
    if (menu.scrollTop <= 0) {
      upScroll.classList.add("hide");
    } else {
      upScroll.classList.remove("hide");
    }

    // 아래로 버튼
    if (menu.scrollTop + menu.clientHeight >= menu.scrollHeight - 1) {
      downScroll.classList.add("hide");
    } else {
      downScroll.classList.remove("hide");
    }
  }

  // 스크롤 시작
  function startScrolling(amount) {
    stopScrolling();
    scrollInterval = setInterval(() => {
      menu.scrollTop += amount;
      updateButtonState();
    }, intervalTime);
  }

  // 스크롤 중지
  function stopScrolling() {
    clearInterval(scrollInterval);
  }

  // 이벤트 리스너 등록
  upScroll.addEventListener("mouseenter", () => {
    startScrolling(-scrollSpeed);
  });

  downScroll.addEventListener("mouseenter", () => {
    startScrolling(scrollSpeed);
  });

  upScroll.addEventListener("mouseleave", stopScrolling);
  downScroll.addEventListener("mouseleave", stopScrolling);
  menu.addEventListener("scroll", updateButtonState);

  // 초기 버튼 상태 체크
  updateButtonState();

  // 전역 함수로 노출
  window.updateButtonState = updateButtonState;
}

// 드롭다운 초기화 실행
familySiteBtn__init();
