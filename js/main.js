// GSAP 라이브러리 플러그인 등록
gsap.registerPlugin(ScrollTrigger);
// gsap.registerPlugin(ScrollToPlugin);
gsap.registerPlugin(TextPlugin);

document.addEventListener('DOMContentLoaded', () => {
  cursorFunc();
  animateScrollText();
  animateIndexElement();
  initGallery();
  handleScroll();
  pinSections();
  animateBg();
  MarqueeLoopContainer();
});

window.onload = function () {

    // rolling text style 
    const items = document.querySelectorAll(".section1 .rolling-text .rotate li.slide-in-out");
  
    items.forEach((item, index) => {
      const delay = 1 + index * 0.5; // 1초부터 시작, 0.5초씩 증가
      item.style.animation = `slide-in-out-bottom 1s linear both ${delay}s`;
    });

    const menuBtn = document.querySelector('.menu-btn');
    const hamBg = document.querySelector('.ham-bg');
    const gnb = document.querySelector('.gnb');

    menuBtn.addEventListener('click', (e) => {
        const $this = e.target;
        $this.classList.toggle('act');

        if ($this.classList.contains('act')) {
            hamBg.classList.add('act');
            gnb.classList.add('act');
        } else {
            hamBg.classList.remove('act');
            gnb.classList.remove('act');
        }
    })
  
  const topBtn = document.querySelector('.top-btn');

  // topBtn.addEventListener('click', () => { 
  //     gsap.to(window, {
  //       duration: 1, 
  //       scrollTo: { y: 0 }, // 최상단 이동
  //       ease: "power2.out" // 부드러운 가속 효과
  //   });
  // })
    
}
// cursor event 
function cursorFunc() {
    const cursorBall = document.querySelector('.cursor-ball');
    const cursorBallSvg = document.querySelector('.cursor-ball svg');
    const cursorBallSvgCircle = document.querySelector('.cursor-ball svg circle');
    const cursorAble = document.querySelectorAll('.cursor-able');

    let pos = { 
        x: window.innerWidth / 2, 
        y: window.innerHeight / 2 
    };
    let mouse = { 
        x: pos.x, 
        y: pos.y 
    };
    const speed = 0.35;

    // 초기 커서 위치 설정
    gsap.set(cursorBall, {
        xPercent: -50, 
        yPercent: -50
    });
    
    const xSet = gsap.quickSetter(cursorBall, "x", "px");
    const ySet = gsap.quickSetter(cursorBall, "y", "px");
    
    // 마우스 이동 이벤트
    window.addEventListener("mousemove", (e) => {    
        mouse.x = e.pageX;
        mouse.y = e.pageY;
    });
    
    // ticker로 부드러운 이동 처리
    gsap.ticker.add(() => {
    const dt = 1.0 - Math.pow(1.0 - speed, gsap.ticker.deltaRatio()); 
      pos.x += (mouse.x - pos.x) * dt;
      pos.y += (mouse.y - pos.y) * dt;
      xSet(pos.x);
      ySet(pos.y);
    });
    
    // 특정 요소에 마우스 호버 효과 추가
    cursorAble.forEach((el)  => {
        // const cursorTxt = el.attr('data-cursor');

        el.addEventListener('mouseenter', () => {
            // if (cursorTxt !== null) {
            //     const textElement = document.createElement('div');
            //     textElement.className = 'text';
            //     textElement.innerText = cursorTxt;
            //     cursorBall.appendChild(textElement);

            //     cursorBall.computedStyleMap.mixBlendMode = 'unset';
            //     cursorBallSvgCircle.style.fill = '#121212';
            // }

            gsap.to(cursorBallSvg, {
                duration: 0.3,
                scale: 4
            });
        });

        el.addEventListener('mouseleave', () => {
            gsap.to(cursorBallSvg, {
                duration: 0.3,
                scale: 0.8,
            })

            const textElement = cursorBall.querySelector('.text');
            if (textElement) {
                cursorBall.removeChild(cursorBall.querySelector('.text'));
            }

            cursorBall.style.mixBlendMode = 'difference';
            cursorBall.style.fill = '#fff';

        })
      
    });   
}


 
// Scroll animation .scroll-text element [TextPlugin]
function animateScrollText() {
	const scrollText = document.querySelector(".scroll-text");

	gsap.to(scrollText, {
		duration: 1,
		repeat: -1,
		yoyo: true,
		repeatDelay: 2,
		text: {
			value: "Down",
			newClass: "rose-text"
		}
	});
}


// ScrollTrigger for .layout-main class element
function animateIndexElement() {
    const visualT = document.querySelector('.visual-text');
    const scrollT = document.querySelector('.scroll-text');
    const main = document.querySelector('.main');

	gsap.to(main, {
		scrollTrigger: {
			trigger: ".section3",
			start: "top center", 
			endTrigger: ".section4", 
			end: "bottom top",
			scrub: 2,
			toggleActions: "play none reverse none",
            onEnter: () => main.classList.add("white"),
			onLeaveBack: () => main.classList.remove("white"),
			//markers:true
		},
	});
	gsap.to(visualT , {
		y: "-=400", 
		scrollTrigger: {
			trigger: ".section1",
			start:"top top", 
			scrub: 2,
			toggleActions: "play none reverse none", //스크롤 이벤트에 따라 애니메이션 동작을 설정
			onEnter: () => scrollT.classList.add("hide"), 
           onLeaveBack: () => scrollT.classList.remove("hide"),
            // markers: true,
		},
	}); 
} 

// section2 gallery .card scroll Parallax
const gallery = document.querySelector('.gallery');
const track = document.querySelector('.gallery-track');
const cards = document.querySelectorAll('.card');
const easing = 0.05;
let scrollY = 0;
let targetY = 0;

// 선형 보간 함수, 두 값을 부르덥게 연결한다. 
const lerp = (start, end, t) => start * (1 - t) + end * t;

function updateScroll() {
    scrollY = lerp(scrollY, targetY, easing);
    track.style.transform = `translateY(-${scrollY}px)`;

    activateParallax();

    if (Math.abs(scrollY - targetY) > 0.1) {
        //스크롤 애니메이션을 지속적으로 업데이트
        requestAnimationFrame(updateScroll);
    }
}

// 스크롤에 따라 카드 이미지가 위아래로 자연스럽게 움직이는 효과
function activateParallax() {
    cards.forEach((card) => {
        const wrapper = card.querySelector('.card-image-wrap');
        const diff = card.offsetHeight - wrapper.offsetHeight; // card와 wrapper의 높이 차
        const progress = card.getBoundingClientRect().top / window.innerHeight; // getBoundingClientRect().top : 화면에서의 위치
        wrapper.style.transform = `translateY(${diff * progress}px)`;
    })
}

function initGallery() {
    gallery.style.height = `${track.clientHeight}px`;
    targetY = window.scrollY;
    updateScroll();
}

window.addEventListener('scroll', () => {
    targetY = window.scrollY;
    updateScroll();
  });
  
// .text-wrap scroll opacity 
function handleScroll() {
    const txtWrap = document.querySelectorAll(".text-wrap");
    
    gsap.utils.toArray(".text-wrap").forEach((txtWrap) => {
        const text = txtWrap.querySelector(".text");
        const numWords = text.children.length;

        gsap.to(text.children, {
          opacity: 1,
          stagger: {
            amount: 1, // 전체 애니메이션이 진행되는 시간
          },
          scrollTrigger: {
            trigger: txtWrap,
            start: "top 80%",
            end: "bottom 20%",
            scrub: .5,
            // markers: true, 
            },

        });
      });
 }


 // ScrollTrigger to pin sections with .js-pin class
function pinSections() {
	const sections = gsap.utils.toArray(".js-pin");

	sections.forEach(section => {
		ScrollTrigger.create({
			trigger: section,
			start: "bottom bottom",
			pin: section, // 현재 섹션을 고정한다.
			pinSpacing: false, // true로 설정하면 고정된 요소의 공간이 유지
			onEnter: () => section.classList.add('hide'),
			onLeave: () => section.classList.remove('hide'),
			onEnterBack: () => section.classList.add('hide'),
			onLeaveBack: () => section.classList.remove('hide'),
			//markers:true,
		});
	});
}


// section4  ScrollTrigger for .background class element
function animateBg() {
	gsap.to(".section4  .bg img", {
		y: "-=10%", 
		scrollTrigger: {
			trigger: ".section4",
			start: "top center",  
			scrub: 1,
			toggleActions: "play none reverse none", 
		},
	}); 
} 

// section4 marquee loop
function MarqueeLoopContainer() { 
	const lerp = (current, target, factor) => current * (1 - factor) + target * factor;

	class LoopingText {
	  constructor(el) {
		this.el = el;
		this.lerp = {current: 0, target: 0}; // lerp 초기값 
		this.interpolationFactor = 0.1;
		this.speed = 0.01;
		this.direction = 1; // 스크롤방향 (1:아래로, -1: 위로) 
		this.lastScrollTop = 0;
		this.multiplier = 1; // 이동 가속도
		this.reverse = el.classList.contains('reverse');
		// Init
		this.el.style.cssText = `position: relative; display: inline-flex; white-space: nowrap`;
		this.el.children[1].style.cssText = `position: absolute; left: ${100 * -1}%`;
		this.el.children[2].style.cssText = `position: absolute; left: ${100 * 1}%`;
		this.events();
		this.render();
	  }

	  events() {
		window.addEventListener("scroll", (e) => { 
		  const scrollTop = window.scrollY || document.documentElement.scrollTop; 
		  
		  this.direction = (scrollTop > this.lastScrollTop) ? 1 : -1;
		  this.lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
		  this.multiplier = 6; // 텍스트 이동 속도
		});
	  }

	  animate() {
		let direction = this.reverse ? -this.direction : this.direction;
		if(direction == 1) {
		  this.lerp.target -= this.speed * this.multiplier;
		} else {
		  this.lerp.target += this.speed * this.multiplier;
		}
		
		this.lerp.current = lerp(this.lerp.current, this.lerp.target, this.interpolationFactor);
		
		if (this.lerp.target > 100 || this.lerp.target < -100) {
		  this.lerp.current -= this.lerp.target; // 초기화
		  this.lerp.target = 0;
		}
		
		const x = this.lerp.current;
		this.el.style.transform = `translateX(${x}%)`;
		this.multiplier = 1;
	  }

	  render() {
		this.animate();
		window.requestAnimationFrame(() => this.render()); // 반복 호출
	  }
	}

	document.querySelectorAll(".loop-container").forEach(el => new LoopingText(el)); 
}