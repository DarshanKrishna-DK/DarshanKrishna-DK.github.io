/*----------------Scroll Section Active Link Updation----------------*/

let sections = document.querySelectorAll('section');
let navLinks = document.querySelectorAll('header nav ul li a');

window.onscroll = () =>{
    sections.forEach(sec =>{
        let top = window.scrollY;
        let offset = sec.offsetTop-150;
        let height = sec.offsetHeight;
        let id = sec.getAttribute('id');

        if(top >= offset && top < offset+height){
            navLinks.forEach(links => {
                links.classList.remove('active');
                document.querySelector('header nav ul li a[href*=' + id + ']').classList.add('active');
            })
        }
    })
}

/*---------------- Countdown Timer ----------------*/


document.addEventListener('DOMContentLoaded', () => {
  // Set target date to March 7, 2025, at 9:00 AM
  var targetDate = new Date('2025-03-21T09:00:00').getTime() / 1000;
  
  // Initialize the countdown to the target date
  var flipdown = new FlipDown(targetDate)
  .start()
  .ifEnded(() => {
      console.log('The countdown has ended!');
  });
});


"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var FlipDown = function () {
  function FlipDown(uts) {
    var el = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "flipdown";
    var opt = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    _classCallCheck(this, FlipDown);

    if (typeof uts !== "number") {
      throw new Error("FlipDown: Constructor expected unix timestamp, got ".concat(_typeof(uts), " instead."));
    }

    if (_typeof(el) === "object") {
      opt = el;
      el = "flipdown";
    }

    this.version = "0.3.2";
    this.initialised = false;
    this.now = this._getTime();
    this.epoch = uts;
    this.countdownEnded = false;
    this.hasEndedCallback = null;
    this.element = document.getElementById(el);
    this.rotors = [];
    this.rotorLeafFront = [];
    this.rotorLeafRear = [];
    this.rotorTops = [];
    this.rotorBottoms = [];
    this.countdown = null;
    this.daysRemaining = 0;
    this.clockValues = {};
    this.clockStrings = {};
    this.clockValuesAsString = [];
    this.prevClockValuesAsString = [];
    this.opts = this._parseOptions(opt);

    this._setOptions();

    console.log("FlipDown ".concat(this.version, " (Theme: ").concat(this.opts.theme, ")"));
  }

  _createClass(FlipDown, [{
    key: "start",
    value: function start() {
      if (!this.initialised) this._init();
      this.countdown = setInterval(this._tick.bind(this), 1000);
      return this;
    }
  }, {
    key: "ifEnded",
    value: function ifEnded(cb) {
      this.hasEndedCallback = function () {
        cb();
        this.hasEndedCallback = null;
      };

      return this;
    }
  }, {
    key: "_getTime",
    value: function _getTime() {
      return new Date().getTime() / 1000;
    }
  }, {
    key: "_hasCountdownEnded",
    value: function _hasCountdownEnded() {
      if (this.epoch - this.now < 0) {
        this.countdownEnded = true;

        if (this.hasEndedCallback != null) {
          this.hasEndedCallback();
          this.hasEndedCallback = null;
        }

        return true;
      } else {
        this.countdownEnded = false;
        return false;
      }
    }
  }, {
    key: "_parseOptions",
    value: function _parseOptions(opt) {
      var headings = ["Days", "Hours", "Minutes", "Seconds"];

      if (opt.headings && opt.headings.length === 4) {
        headings = opt.headings;
      }

      return {
        theme: opt.hasOwnProperty("theme") ? opt.theme : "dark",
        headings: headings
      };
    }
  }, {
    key: "_setOptions",
    value: function _setOptions() {
      this.element.classList.add("flipdown__theme-".concat(this.opts.theme));
    }
  }, {
    key: "_init",
    value: function _init() {
      this.initialised = true;

      if (this._hasCountdownEnded()) {
        this.daysremaining = 0;
      } else {
        this.daysremaining = Math.floor((this.epoch - this.now) / 86400).toString().length;
      }

      var dayRotorCount = this.daysremaining <= 2 ? 2 : this.daysremaining;

      for (var i = 0; i < dayRotorCount + 6; i++) {
        this.rotors.push(this._createRotor(0));
      }

      var dayRotors = [];

      for (var i = 0; i < dayRotorCount; i++) {
        dayRotors.push(this.rotors[i]);
      }

      this.element.appendChild(this._createRotorGroup(dayRotors, 0));
      var count = dayRotorCount;

      for (var i = 0; i < 3; i++) {
        var otherRotors = [];

        for (var j = 0; j < 2; j++) {
          otherRotors.push(this.rotors[count]);
          count++;
        }

        this.element.appendChild(this._createRotorGroup(otherRotors, i + 1));
      }

      this.rotorLeafFront = Array.prototype.slice.call(this.element.getElementsByClassName("rotor-leaf-front"));
      this.rotorLeafRear = Array.prototype.slice.call(this.element.getElementsByClassName("rotor-leaf-rear"));
      this.rotorTop = Array.prototype.slice.call(this.element.getElementsByClassName("rotor-top"));
      this.rotorBottom = Array.prototype.slice.call(this.element.getElementsByClassName("rotor-bottom"));

      this._tick();

      this._updateClockValues(true);

      return this;
    }
  }, {
    key: "_createRotorGroup",
    value: function _createRotorGroup(rotors, rotorIndex) {
      var rotorGroup = document.createElement("div");
      rotorGroup.className = "rotor-group";
      var dayRotorGroupHeading = document.createElement("div");
      dayRotorGroupHeading.className = "rotor-group-heading";
      dayRotorGroupHeading.setAttribute("data-before", this.opts.headings[rotorIndex]);
      rotorGroup.appendChild(dayRotorGroupHeading);
      appendChildren(rotorGroup, rotors);
      return rotorGroup;
    }
  }, {
    key: "_createRotor",
    value: function _createRotor() {
      var v = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var rotor = document.createElement("div");
      var rotorLeaf = document.createElement("div");
      var rotorLeafRear = document.createElement("figure");
      var rotorLeafFront = document.createElement("figure");
      var rotorTop = document.createElement("div");
      var rotorBottom = document.createElement("div");
      rotor.className = "rotor";
      rotorLeaf.className = "rotor-leaf";
      rotorLeafRear.className = "rotor-leaf-rear";
      rotorLeafFront.className = "rotor-leaf-front";
      rotorTop.className = "rotor-top";
      rotorBottom.className = "rotor-bottom";
      rotorLeafRear.textContent = v;
      rotorTop.textContent = v;
      rotorBottom.textContent = v;
      appendChildren(rotor, [rotorLeaf, rotorTop, rotorBottom]);
      appendChildren(rotorLeaf, [rotorLeafRear, rotorLeafFront]);
      return rotor;
    }
  }, {
    key: "_tick",
    value: function _tick() {
      this.now = this._getTime();
      var diff = this.epoch - this.now <= 0 ? 0 : this.epoch - this.now;
      this.clockValues.d = Math.floor(diff / 86400);
      diff -= this.clockValues.d * 86400;
      this.clockValues.h = Math.floor(diff / 3600);
      diff -= this.clockValues.h * 3600;
      this.clockValues.m = Math.floor(diff / 60);
      diff -= this.clockValues.m * 60;
      this.clockValues.s = Math.floor(diff);

      this._updateClockValues();

      this._hasCountdownEnded();
    }
  }, {
    key: "_updateClockValues",
    value: function _updateClockValues() {
      var _this = this;

      var init = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      this.clockStrings.d = pad(this.clockValues.d, 2);
      this.clockStrings.h = pad(this.clockValues.h, 2);
      this.clockStrings.m = pad(this.clockValues.m, 2);
      this.clockStrings.s = pad(this.clockValues.s, 2);
      this.clockValuesAsString = (this.clockStrings.d + this.clockStrings.h + this.clockStrings.m + this.clockStrings.s).split("");
      this.rotorLeafFront.forEach(function (el, i) {
        el.textContent = _this.prevClockValuesAsString[i];
      });
      this.rotorBottom.forEach(function (el, i) {
        el.textContent = _this.prevClockValuesAsString[i];
      });

      function rotorTopFlip() {
        var _this2 = this;

        this.rotorTop.forEach(function (el, i) {
          if (el.textContent != _this2.clockValuesAsString[i]) {
            el.textContent = _this2.clockValuesAsString[i];
          }
        });
      }

      function rotorLeafRearFlip() {
        var _this3 = this;

        this.rotorLeafRear.forEach(function (el, i) {
          if (el.textContent != _this3.clockValuesAsString[i]) {
            el.textContent = _this3.clockValuesAsString[i];
            el.parentElement.classList.add("flipped");
            var flip = setInterval(function () {
              el.parentElement.classList.remove("flipped");
              clearInterval(flip);
            }.bind(_this3), 500);
          }
        });
      }

      if (!init) {
        setTimeout(rotorTopFlip.bind(this), 500);
        setTimeout(rotorLeafRearFlip.bind(this), 500);
      } else {
        rotorTopFlip.call(this);
        rotorLeafRearFlip.call(this);
      }

      this.prevClockValuesAsString = this.clockValuesAsString;
    }
  }]);

  return FlipDown;
}();

function pad(n, len) {
  n = n.toString();
  return n.length < len ? pad("0" + n, len) : n;
}

function appendChildren(parent, children) {
  children.forEach(function (el) {
    parent.appendChild(el);
  });
}


/*---------------- About section info box turn animation ----------------*/

const infoboxes = document.querySelectorAll('.infobox');

infoboxes.forEach(infobox => {
  infobox.addEventListener('mousemove', (event) => {
    const rect = infobox.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const angleX = (x - rect.width / 2) / 15;
    const angleY = (y - rect.height / 2) / 15;

    infobox.style.transform = `perspective(500px) rotateX(${angleY}deg) rotateY(${angleX}deg)`;
  });

  infobox.addEventListener('mouseleave', () => {
    infobox.style.transform = 'perspective(500px) rotateX(0deg) rotateY(0deg)';
  });
});


/*---------------- FAQs ----------------*/
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

/*----------------Responsive Navbar----------------*/

const Hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");
const navItems = document.querySelectorAll(".nav-item");

Hamburger.addEventListener("click", () => {
  Hamburger.classList.toggle("active");
  navMenu.classList.toggle("active");
});

navItems.forEach(link => {
  link.addEventListener("click", () => {
    Hamburger.classList.remove("active");
    navMenu.classList.remove("active");
  });
});

let header = document.querySelector('header');
header.classList.toggle('sticky', window.scrollY > 100);


/*----------------Scroll Reveal----------------*/

ScrollReveal({ reset: true });

ScrollReveal({
  reset: true,
  distance: '80px',
  duration: 1800,
  delay: 200
})

ScrollReveal().reveal('.section-title', { origin: 'top'});
ScrollReveal().reveal('.countdown', { origin: 'bottom'});
ScrollReveal().reveal('.track-box:nth-child(1), .track-box:nth-child(2)', { origin: 'left'});
ScrollReveal().reveal('.socials, .track-box:nth-child(3), .track-box:nth-child(4)', { origin: 'right'});


/*----------------Registration Form Validation - Team Lead Details----------------*/
const nextButton = document.getElementById('next-button');
const leaderSection = document.getElementById('leader-section');
const teamMemberSection = document.getElementById('team-members-section');

nextButton.addEventListener('click', () => {
const leaderName = document.querySelector('[name="leadname"]').value;
const leaderMobile = document.querySelector('[name="mobilenumber"]').value;
const leaderEmail = document.querySelector('[name="leademailid"]').value;
const leaderGithub = document.querySelector('[name="leadgithublink"]').value;
const leaderUniversity = document.querySelector('[name="leaduniversity"]').value;
const leaderGender = document.querySelector('[name="leadgender"]').value;
const participationMode = document.querySelector('[name="mode"]').value;
const teamName = document.querySelector('[name="teamname"]').value;

if (!leaderName || !leaderMobile || !leaderEmail || !leaderGithub || !leaderUniversity || !teamName) {
  alert('Please fill in all required fields for the Team Leader.');
  return false;
}

// Mobile number, email, and GitHub link validation
const mobileRegex = /^\d{10}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const githubRegex = /^https?:\/\/github\.com\/[^\s\/]+$/;

if (!mobileRegex.test(leaderMobile)) {
  alert('Please enter a valid 10-digit mobile number.');
  return false;
}

if (!emailRegex.test(leaderEmail)) {
  alert('Please enter a valid email address.');
  return false;
}

if (!githubRegex.test(leaderGithub)) {
  alert('Please enter a valid GitHub link.');
  return false;
}

// If all validations pass, proceed to the next section
leaderSection.style.display = 'none';
teamMemberSection.style.display = 'block';
});


/*---------------- Add Members ----------------*/

const addMemberButtons = document.querySelectorAll('.add-member');
const teamMember1 = document.querySelector('.team-member-1');
const teamMember2 = document.querySelector('.team-member-2');

addMemberButtons.forEach(button => {
    button.addEventListener('click', () => {
        const memberNumber = button.dataset.member;

        if (memberNumber === '1') {
            teamMember1.style.display = 'block';
            teamMember2.style.display = 'none';
        } else if (memberNumber === '2') {
            teamMember1.style.display = 'block';
            teamMember2.style.display = 'block';
        }
    });
});


/*---------------- Github link validation for Team Members ----------------*/

function validateGithubLink(link) {
  const githubRegex = /^https?:\/\/github\.com\/[^\s\/]+$/;
  return githubRegex.test(link);
}

function validateForm() {
  const Mem1_githubLink = document.querySelector('[name="team_member_1_githublink"]').value;
  const Mem2_githubLink = document.querySelector('[name="team_member_2_githublink"]').value;

  if (!validateGithubLink(Mem1_githubLink)) {
    alert("Team Member 1's GitHub link is invalid.");
    return false;
  }

  if (!validateGithubLink(Mem2_githubLink)) {
    alert("Team Member 2's GitHub link is invalid.");
    return false;
  }

  // If both github link inputs are valid, allow form submission
  return true;
}
