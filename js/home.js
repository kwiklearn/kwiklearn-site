/*
 * KwikLearn homepage behaviour
 * ----------------------------------------------------------------------------
 * 1) Site facts (official Play Store URL, current subjects) and the launch-state
 *    configuration: ONE place each; the launch state controls the primary call to
 *    action and the few lines of copy that differ before and after launch
 * 2) User-controlled hero carousel (no autoplay)
 * 3) App screenshot slots
 *
 * No framework. Works with the existing Bootstrap / jQuery page.
 */
(function () {
  'use strict';

  /* ==========================================================================
   * 1a) SITE FACTS  (the single place for facts that appear in several spots)
   * --------------------------------------------------------------------------
   * playStoreUrl   The OFFICIAL public Google Play listing URL. Empty until the
   *                owner confirms the app is publicly available. Paste the
   *                address copied from the live listing, in the form
   *                  https://play.google.com/store/apps/details?id=<application id>
   *                Do not guess it. It is used by the public-launch button and the
   *                official Google Play badge, and by nothing else.
   * subjects       Subjects the app covers today. Edit when a subject launches.
   *   available        shown in the hero label, description, trust point and the
   *                    "choose your subject" card (homepage text slots data-site=...).
   *   shownInScreens   what the three app screenshots actually show. Update it only
   *                    when the screenshots are replaced.
   *
   * NOT controlled from here (static HTML, read by search engines and by visitors
   * without JavaScript, so review them by hand when this changes): meta description,
   * keywords, og:/twitter: descriptions, structured data, the About page, FAQ answers,
   * and the wording of the hero description fallback.
   * ========================================================================== */
  var KWIKLEARN_SITE = {
    playStoreUrl: '',   // <<< OWNER: the VERIFIED public Google Play listing URL (do not guess)
    subjects: {
      available: ['Mathematics'],
      shownInScreens: ['Mathematics']
    }
  };
  window.KWIKLEARN_SITE = KWIKLEARN_SITE;

  function joinList(items) {
    if (items.length <= 1) { return items.join(''); }
    return items.slice(0, -1).join(', ') + ' and ' + items[items.length - 1];
  }

  /* ==========================================================================
   * 1b) LAUNCH STATE  (the single place to change the call to action)
   * --------------------------------------------------------------------------
   * THE ONLY SWITCH IS  state  BELOW.
   *
   *   'prelaunch' (default)  The primary button is "Explore KwikLearn" and scrolls to
   *                          the Features section. There is NO link to Google Play and
   *                          no claim that the app can be downloaded.
   *   'public'               The hero shows the official "Get it on Google Play" badge
   *                          and the navbar button reads "Get KwikLearn on Google Play";
   *                          both link to KWIKLEARN_SITE.playStoreUrl.
   *
   * TO GO PUBLIC (only after the owner confirms the app is publicly available):
   *   1. Set KWIKLEARN_SITE.playStoreUrl (above) to the verified listing URL.
   *   2. Review the  public  wording below (owner approval).
   *   3. Set  state: 'public'.
   *   4. Review the static SEO fields listed in the review notes (12-launch-state-guide).
   *
   * SAFETY: if state is 'public' but playStoreUrl is empty or is not a Google Play
   * listing URL, the page stays in 'prelaunch' and writes a console warning, so a
   * broken or invented link can never go live.
   *
   * Only wording that must differ between the two states lives here. Everything else
   * on the page is permanent (evergreen) copy. The HTML contains the pre-launch wording
   * as the no-JavaScript fallback.
   * ========================================================================== */
  var KWIKLEARN_LAUNCH = {
    state: 'prelaunch',   // <<< THE ONLY SWITCH: 'prelaunch' or 'public'

    prelaunch: {
      button: { label: 'Explore KwikLearn', href: '#features', external: false },
      heroNote: 'KwikLearn is not available to download yet.',
      faqAnswer: 'KwikLearn is built for Android and is not available to download yet. This page will link to the official Google Play listing when it is available.'
    },

    // Prepared but INACTIVE. Owner to approve the wording and supply the verified listing URL.
    public: {
      button: { label: 'Get KwikLearn on Google Play', href: KWIKLEARN_SITE.playStoreUrl, external: true },
      heroNote: '',
      faqAnswer: 'KwikLearn is available for Android on Google Play. Use the Google Play badge on this page to get the app.'
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

  function applySite() {
    var list = joinList(KWIKLEARN_SITE.subjects.available);
    var shown = joinList(KWIKLEARN_SITE.subjects.shownInScreens);
    var text = {
      subjects: list,
      subjectsStart: 'Starting with ' + list,
      subjectsFocus: KWIKLEARN_SITE.subjects.available.length === 1 ? list + '-focused practice' : list + ' practice'
    };
    var els = document.querySelectorAll('[data-site]');
    for (var i = 0; i < els.length; i++) {
      var key = els[i].getAttribute('data-site');
      if (Object.prototype.hasOwnProperty.call(text, key)) { els[i].textContent = text[key]; }
    }
    KWIKLEARN_APP_SCREENS.shownSubjects = shown;
  }

  function applyLaunch() {
    var name = activeState();
    var s = KWIKLEARN_LAUNCH[name];
    document.documentElement.setAttribute('data-launch-state', name);

    // Text slots: <el data-launch="heroNote|faqAnswer">  (an empty string hides the element)
    var keys = ['heroNote', 'faqAnswer'];
    for (var k = 0; k < keys.length; k++) {
      var els = document.querySelectorAll('[data-launch="' + keys[k] + '"]');
      for (var e = 0; e < els.length; e++) { els[e].textContent = s[keys[k]]; els[e].hidden = !s[keys[k]]; }
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

    // Official Google Play badge links (only ever visible in the public state)
    var badges = document.querySelectorAll('[data-play-link]');
    for (var b = 0; b < badges.length; b++) {
      if (name === 'public') {
        badges[b].setAttribute('href', KWIKLEARN_SITE.playStoreUrl);
        badges[b].setAttribute('target', '_blank');
        badges[b].setAttribute('rel', 'noopener noreferrer');
      } else {
        badges[b].removeAttribute('href');
        badges[b].removeAttribute('target');
        badges[b].removeAttribute('rel');
      }
    }

    // Elements that exist in one state only: <el data-show-in="public"> or "prelaunch"
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
   * The three pictures marked data-app-slot="dashboard|quiz|progress" show GENUINE Android
   * captures (Subjects, Quizzes, Progress; Mathematics only), cropped to remove the status bar:
   * images/home/app-subjects-560, app-quizzes-560, app-progress-560 (.webp with .jpg fallback).
   * If a capture is ever replaced by anything that is not a genuine screen, set genuine: false
   * (the note under the Features heading then says the screens are illustrative).
   * Geometry: --app-shot-ratio / --app-shot-max-width in the page CSS.
   * ========================================================================== */
  var KWIKLEARN_APP_SCREENS = {
    genuine: true,
    illustrativeNote: 'Illustrative app screens with sample data. They are not real learner statistics, and they do not show every subject that is available today.',
    genuineNote: 'Screens captured on an Android test device with sample data. They are not real learner statistics.',
    shownSubjects: 'Mathematics'
  };
  window.KWIKLEARN_APP_SCREENS = KWIKLEARN_APP_SCREENS;

  function applyAppScreens() {
    var note = document.getElementById('appScreensNote');
    if (note) {
      note.textContent = KWIKLEARN_APP_SCREENS.genuine
        ? KWIKLEARN_APP_SCREENS.genuineNote + ' The screens show ' + KWIKLEARN_APP_SCREENS.shownSubjects + ' only.'
        : KWIKLEARN_APP_SCREENS.illustrativeNote;
    }
  }

  function ready() { applySite(); applyLaunch(); applyAppScreens(); initCarousel(); }
  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', ready); } else { ready(); }
}());
