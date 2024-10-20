// <!-- Nav -->
const Hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");

Hamburger.addEventListener("click", () => {
  Hamburger.classList.toggle("active");
  navMenu.classList.toggle("active");
});

document.querySelectorAll(".nav-link").forEach((n) =>
  n.addEventListener("click", () => {
    Hamburger.classList.remove("active");
    navMenu.classList.remove("active");
  })
);

// <!-- Landing -->

// <!-- Countdown -->

const bars = [
  ["end", "top"],
  ["side", "top", "left"],
  ["side", "top", "right"],
  ["middle"],
  ["side", "bottom", "left"],
  ["side", "bottom", "right"],
  ["end", "bottom"],
];

const $main = document.querySelector("main");

const addDigits = (number) => {
  const initGroup = (number, padding = 2) => {
    const $group = document.createElement("div");
    $group.classList.add("group");

    const digits = [...`${number}`.padStart(padding, 0)].map((digit) => {
      const $digit = document.createElement("figure");
      $digit.classList.add("digit");
      $digit.setAttribute("data-digit", digit);
      bars.forEach((classes) => {
        const $span = document.createElement("span");
        $span.classList.add(...classes);
        $digit.append($span);
      });
      return $digit;
    });

    $group.append(...digits);

    return {
      element: $group,
      set number(val) {
        number = val;
        [
          ...`${number}`.padStart(padding, 0).substring(`${number}`.length - 2),
        ].forEach((digit, i) => {
          digits[i].setAttribute("data-digit", digit);
        });
      },

      get number() {
        return number;
      },
    };
  };

  const $digits = document.createElement("div");
  $digits.classList.add("digits");
  const group = initGroup(number);
  $digits.append(group.element);
  $main.append($digits);

  return {
    set number(val) {
      number = val;
      group.number = val;
      // groupShadow1.number = val;
      // groupShadow2.number = val;
    },
    get number() {
      return number;
    },
  };
};

const addColon = () => {
  const $colonGroup = document.createElement("div");
  $colonGroup.classList.add("colon-group");
  const $colon = document.createElement("figure");
  $colon.append(document.createElement("span"));
  // const $colonShadow1 = document.createElement('figure');
  // $colonShadow1.append(document.createElement('span'));
  // const $colonShadow2 = document.createElement('figure');
  // $colonShadow2.append(document.createElement('span'));
  $colon.classList.add("colon");
  // $colonShadow1.classList.add('colon', 'shadow', 'shadow1');
  // $colonShadow2.classList.add('colon', 'shadow', 'shadow2');
  $colonGroup.append($colon);
  // $colonGroup.append($colonShadow1);
  // $colonGroup.append($colonShadow2);
  $main.append($colonGroup);
};

const init = () => {
  // **** Set your target date and time here **** //
  const targetDate = new Date("2025-03-08T00:00:00");

  let numberDay = addDigits(0, 3); // Add a new digit group for days
  addColon();
  let numberHour = addDigits(0);
  addColon();
  let numberMinute = addDigits(0);
  addColon();
  let numberSecond = addDigits(0);

  const updateClock = () => {
    let now = new Date();
    let timeDifference = targetDate - now;

    if (timeDifference <= 0) {
      clearInterval(intervalId);
      timeDifference = 0;
    }

    let seconds = Math.floor(timeDifference / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
    let days = Math.floor(hours / 24);

    seconds %= 60;
    minutes %= 60;
    hours %= 24;

    numberDay.number = days;
    numberHour.number = hours;
    numberMinute.number = minutes;
    numberSecond.number = seconds;

    // console.log(`Time left:${numberDay.number} days ${numberHour.number}:${numberMinute.number}:${numberSecond.number}`);
  };
  intervalId = setInterval(updateClock, 1000);
};

if (
  /^(?:(?!chrome|android)[\s\S])*(?:safari|iPad|iPhone|iPod)/i.test(
    navigator.userAgent
  )
) {
  document.body.classList.add("safari");
}

init();

// <!-- Themes -->

// <!-- Prizes -->
document.getElementById("main-prize-container").onmousemove = (e) => {
  for (const card of document.getElementsByClassName("main-prize-card")) {
    const rect = card.getBoundingClientRect(),
      x = e.clientX - rect.left,
      y = e.clientY - rect.top;

    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
  }
};

document.getElementById("track-prize-cards-container").onmousemove = (e) => {
  for (const card of document.getElementsByClassName("track-prize-card ")) {
    const rect = card.getBoundingClientRect(),
      x = e.clientX - rect.left,
      y = e.clientY - rect.top;

    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
  }
};
// <!-- Speakers -->
document.addEventListener('DOMContentLoaded', function() {
  var swiperSpeakers = new Swiper('.mySwiperSpeakers', {
    slidesPerView: 3,
    spaceBetween: 10,
    pagination: {
      el: '.speakers-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.speakers-button-next',
      prevEl: '.speakers-button-prev',
    },
    breakpoints: {
      320: {
        slidesPerView: 1,
      },
      768: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      992: {
        slidesPerView: 3,
        spaceBetween: 20,
      },
    },
  });

  var swiperJudges = new Swiper('.mySwiperJudges', {
    slidesPerView: 3,
    spaceBetween: 10,
    pagination: {
      el: '.judges-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.judges-button-next',
      prevEl: '.judges-button-prev',
    },
    breakpoints: {
      320: {
        slidesPerView: 1,
      },
      768: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      992: {
        slidesPerView: 3,
        spaceBetween: 20,
      },
    },
  });
});




// <!-- Sponsors & Partners -->

// <!-- FAQ -->
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll(".accordion-header").forEach((button) => {
    button.addEventListener("click", () => {
      const accordionContent = button.nextElementSibling;

      button.classList.toggle("active");

      if (button.classList.contains("active")) {
        accordionContent.style.maxHeight = accordionContent.scrollHeight + "px";
      } else {
        accordionContent.style.maxHeight = 0;
      }

      // Close other open accordion items
      document.querySelectorAll(".accordion-header").forEach((otherButton) => {
        if (otherButton !== button) {
          otherButton.classList.remove("active");
          otherButton.nextElementSibling.style.maxHeight = 0;
        }
      });
    });
  });
});
//<!-- Schedule -->

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("reveal");
      return;
    }

    entry.target.classList.remove("reveal");
  });
});
const squares = document.querySelectorAll(".reveal");
squares.forEach((element) => observer.observe(element));
// <!-- Organising Team -->

// <!--Contact Us -->

// <!--Footer -->

const handleRegister = () => {
  window.location.href = "https://hack2skill.com/hack/shecodes";
};
