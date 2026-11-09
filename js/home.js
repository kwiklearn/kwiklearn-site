/*
 * KwikLearn homepage behaviour
 * ----------------------------------------------------------------------------
 * 1) Centralised beta-access call to action
 * 2) User-controlled hero carousel (no autoplay)
 *
 * No framework. Works with the existing Bootstrap / jQuery page.
 */
(function () {
  'use strict';

  /* ==========================================================================
   * 1) CENTRALISED CTA
   * --------------------------------------------------------------------------
   * Every element marked data-cta="beta" takes its destination and wording from
   * this one object. To move from the waiting list to an official Google Play
   * listing later, change ONLY this object, e.g.
   *
   *   label:    'Get it on Google Play',
   *   href:     'https://play.google.com/store/apps/details?id=<package-id>',
   *   external: true
   *
   * Do not point this at Google Play until the app is publicly available.
   * The HTML keeps the same waiting-list link as a no-JavaScript fallback.
   * ========================================================================== */
  var KWIKLEARN_CTA = {
    label: 'Request Android Beta Access',
    href: 'https://forms.gle/cU6HZAS9DRoSg6kbA',
    external: true
  };
  window.KWIKLEARN_CTA = KWIKLEARN_CTA;

  function applyCta() {
    var links = document.querySelectorAll('[data-cta="beta"]');
    for (var i = 0; i < links.length; i++) {
      var a = links[i];
      a.setAttribute('href', KWIKLEARN_CTA.href);
      if (KWIKLEARN_CTA.external) {
        a.setAttribute('target', '_blank');
        a.setAttribute('rel', 'noopener noreferrer');
      } else {
        a.removeAttribute('target');
        a.removeAttribute('rel');
      }
      var label = a.querySelector('[data-cta-label]');
      if (label) { label.textContent = KWIKLEARN_CTA.label; }
    }
  }

  /* ==========================================================================
   * 2) HERO CAROUSEL
   * --------------------------------------------------------------------------
   * - Slide 1 is in the HTML with a real src (priority image).
   * - Slides 2-4 carry data-src / data-srcset and are only fetched when the
   *   visitor first interacts with the carousel (saves mobile data).
   * - Scroll-snap track: native touch swipe. Buttons, dots and arrow keys
   *   scroll the track. No auto-rotation.
   * ========================================================================== */
  function initCarousel() {
    var root = document.getElementById('heroCarousel');
    if (!root) { return; }
    var track = root.querySelector('.hc-track');
    var slides = Array.prototype.slice.call(root.querySelectorAll('.hc-slide'));
    var dots = Array.prototype.slice.call(root.querySelectorAll('.hc-dot'));
    var prev = root.querySelector('.hc-prev');
    var next = root.querySelector('.hc-next');
    var status = root.querySelector('.hc-status');
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var current = 0;
    var loaded = false;

    function loadRest() {
      if (loaded) { return; }
      loaded = true;
      var pics = root.querySelectorAll('[data-srcset],[data-src]');
      for (var i = 0; i < pics.length; i++) {
        var el = pics[i];
        if (el.getAttribute('data-srcset')) {
          el.setAttribute('srcset', el.getAttribute('data-srcset'));
          el.removeAttribute('data-srcset');
        }
        if (el.getAttribute('data-src')) {
          el.setAttribute('src', el.getAttribute('data-src'));
          el.removeAttribute('data-src');
        }
      }
    }

    function setActive(i) {
      current = Math.max(0, Math.min(slides.length - 1, i));
      for (var s = 0; s < slides.length; s++) {
        var on = s === current;
        slides[s].setAttribute('aria-hidden', on ? 'false' : 'true');
        if (dots[s]) {
          if (on) { dots[s].setAttribute('aria-current', 'true'); } else { dots[s].removeAttribute('aria-current'); }
        }
      }
      if (prev) { prev.disabled = current === 0; }
      if (next) { next.disabled = current === slides.length - 1; }
      if (status) { status.textContent = 'Slide ' + (current + 1) + ' of ' + slides.length; }
    }

    function goTo(i) {
      loadRest();
      i = Math.max(0, Math.min(slides.length - 1, i));
      track.scrollTo({ left: slides[i].offsetLeft - track.offsetLeft, behavior: reduce ? 'auto' : 'smooth' });
      setActive(i);
    }

    var ticking = false;
    track.addEventListener('scroll', function () {
      loadRest();
      if (ticking) { return; }
      ticking = true;
      window.requestAnimationFrame(function () {
        ticking = false;
        var w = track.clientWidth || 1;
        var idx = Math.round(track.scrollLeft / w);
        if (idx !== current) { setActive(idx); }
      });
    }, { passive: true });

    if (prev) { prev.addEventListener('click', function () { goTo(current - 1); }); }
    if (next) { next.addEventListener('click', function () { goTo(current + 1); }); }
    dots.forEach(function (d, i) { d.addEventListener('click', function () { goTo(i); }); });

    track.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); goTo(current + 1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(current - 1); }
      else if (e.key === 'Home') { e.preventDefault(); goTo(0); }
      else if (e.key === 'End') { e.preventDefault(); goTo(slides.length - 1); }
    });

    ['pointerdown', 'touchstart', 'mouseenter', 'focusin', 'keydown'].forEach(function (ev) {
      root.addEventListener(ev, loadRest, { once: true, passive: true });
    });

    window.addEventListener('resize', function () {
      track.scrollTo({ left: slides[current].offsetLeft - track.offsetLeft, behavior: 'auto' });
    });

    setActive(0);
    root.classList.add('hc-ready');
  }

  /* ==========================================================================
   * 3) APP SCREENSHOT SLOTS
   * --------------------------------------------------------------------------
   * The three pictures marked data-app-slot="dashboard|quiz|progress" currently show
   * ILLUSTRATIVE mock-ups (not real captures). To switch to genuine Mathematics-beta
   * captures:
   *   1. Replace the image files (same names): images/home/app-student-dashboard-560.webp,
   *      app-practice-quiz-560.webp, app-progress-report-560.webp, and the PNG fallbacks
   *      student-dashboard.png, practice-quiz-screen.png, progress-report-screen.png.
   *   2. Set genuine: true below (the note under the Features heading then states the
   *      screens are genuine captures from a test account).
   *   3. Set --app-shot-ratio / --app-shot-max-width in the page CSS to match the captures.
   * Never set genuine: true while any mock-up is still in place.
   * ========================================================================== */
  var KWIKLEARN_APP_SCREENS = {
    genuine: false,
    illustrativeNote: 'Illustrative app screens with sample data. They are not real learner statistics, and they do not show every subject that is available today.',
    genuineNote: 'Screens from the current Android beta, captured on a test account with sample data. They are not real learner statistics.'
  };
  window.KWIKLEARN_APP_SCREENS = KWIKLEARN_APP_SCREENS;

  function applyAppScreens() {
    var note = document.getElementById('appScreensNote');
    if (note) { note.textContent = KWIKLEARN_APP_SCREENS.genuine ? KWIKLEARN_APP_SCREENS.genuineNote : KWIKLEARN_APP_SCREENS.illustrativeNote; }
  }

  function ready() { applyCta(); applyAppScreens(); initCarousel(); }
  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', ready); } else { ready(); }
}());
