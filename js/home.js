/*
 * KwikLearn homepage behaviour
 * ----------------------------------------------------------------------------
 * 1) Launch-state configuration: ONE place that controls the primary call to
 *    action, the status label and every launch-dependent line of homepage copy
 * 2) User-controlled hero carousel (no autoplay)
 * 3) App screenshot slots
 *
 * No framework. Works with the existing Bootstrap / jQuery page.
 */
(function () {
  'use strict';

  /* ==========================================================================
   * 1) LAUNCH STATE  (the single place to change the call to action)
   * --------------------------------------------------------------------------
   * THE ONLY SWITCH IS  state  BELOW.
   *
   *   'prelaunch' (default)  Status label "Coming soon to Google Play". The primary
   *                          button is "Explore KwikLearn" and scrolls to the
   *                          Features section. There is NO link to Google Play and
   *                          no claim that the app can be downloaded.
   *   'public'               The primary button is “Get KwikLearn on Google Play” and
   *                          links to the public Google Play listing.
   *
   * TO GO PUBLIC (only after the owner confirms the app is publicly available):
   *   1. Open the live Google Play listing in a browser and copy its URL, in the form
   *        https://play.google.com/store/apps/details?id=<application id>
   *      Paste it into  public.button.href  below. Do not guess it.
   *   2. Review the  public  wording below (owner approval).
   *   3. Set  state: 'public'.
   *
   * SAFETY: if state is 'public' but public.button.href is empty or is not a Google
   * Play listing URL, the page stays in 'prelaunch' and writes a console warning,
   * so a broken or invented link can never go live.
   *
   * The HTML itself contains the pre-launch wording as the no-JavaScript fallback.
   * ========================================================================== */
  var KWIKLEARN_LAUNCH = {
    state: 'prelaunch',   // <<< THE ONLY SWITCH: 'prelaunch' or 'public'

    prelaunch: {
      statusLabel: 'Coming soon to Google Play',
      button: { label: 'Explore KwikLearn', href: '#features', external: false },
      announcement: 'KwikLearn is coming soon to Google Play, starting with Mathematics.',
      heroNote: 'KwikLearn is not available to download yet. We will add a Google Play download button here when it launches.',
      finalHeading: 'KwikLearn is coming soon to Google Play.',
      faqQuestion: 'When can I download KwikLearn?',
      faqAnswer: 'KwikLearn is coming soon to Google Play for Android and is not available to download yet. When it launches, this page will show a “Get KwikLearn on Google Play” button.'
    },

    // Prepared but INACTIVE. Owner to approve the wording and supply the verified listing URL.
    public: {
      statusLabel: 'Available on Google Play',
      button: {
        label: 'Get KwikLearn on Google Play',
        href: '',          // <<< OWNER: paste the VERIFIED public Google Play listing URL here (do not guess)
        external: true
      },
      announcement: 'KwikLearn is now on Google Play, starting with Mathematics.',
      heroNote: 'Available for Android on Google Play in Ghana.',
      finalHeading: 'Get KwikLearn on Google Play.',
      faqQuestion: 'How can I download KwikLearn?',
      faqAnswer: 'KwikLearn is available on Google Play for Android. Use the “Get KwikLearn on Google Play” button on this page.'
    }
  };
  window.KWIKLEARN_LAUNCH = KWIKLEARN_LAUNCH;

  var PLAY_LISTING = /^https:\/\/play\.google\.com\/store\/apps\/details\?id=[A-Za-z][A-Za-z0-9_]*(\.[A-Za-z][A-Za-z0-9_]*)+(&[A-Za-z0-9_=%.\-]*)*$/;

  function activeState() {
    if (KWIKLEARN_LAUNCH.state === 'public') {
      var url = KWIKLEARN_LAUNCH['public'].button.href;
      if (PLAY_LISTING.test(url)) { return 'public'; }
      if (window.console && console.warn) {
        console.warn('KwikLearn: launch state is "public" but no valid Google Play listing URL is set; staying in "prelaunch".');
      }
    }
    return 'prelaunch';
  }

  function applyLaunch() {
    var name = activeState();
    var s = KWIKLEARN_LAUNCH[name];
    document.documentElement.setAttribute('data-launch-state', name);

    // Text slots: <el data-launch="statusLabel|announcement|heroNote|finalHeading|faqQuestion|faqAnswer">
    var keys = ['statusLabel', 'announcement', 'heroNote', 'finalHeading', 'faqQuestion', 'faqAnswer'];
    for (var k = 0; k < keys.length; k++) {
      var els = document.querySelectorAll('[data-launch="' + keys[k] + '"]');
      for (var e = 0; e < els.length; e++) { els[e].textContent = s[keys[k]]; }
    }

    // Primary call to action: <a data-cta="primary"> with an optional <span data-cta-label>
    var links = document.querySelectorAll('[data-cta="primary"]');
    for (var i = 0; i < links.length; i++) {
      var a = links[i];
      a.setAttribute('href', s.button.href);
      if (s.button.external) {
        a.setAttribute('target', '_blank');
        a.setAttribute('rel', 'noopener noreferrer');
      } else {
        a.removeAttribute('target');
        a.removeAttribute('rel');
      }
      var label = a.querySelector('[data-cta-label]');
      if (label) { label.textContent = s.button.label; }
    }

    // Elements that exist in one state only: <el data-show-in="public">
    var only = document.querySelectorAll('[data-show-in]');
    for (var o = 0; o < only.length; o++) { only[o].hidden = only[o].getAttribute('data-show-in') !== name; }
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

  function ready() { applyLaunch(); applyAppScreens(); initCarousel(); }
  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', ready); } else { ready(); }
}());
