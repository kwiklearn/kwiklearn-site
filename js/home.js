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
   * playStoreUrl   The OFFICIAL public Google Play listing URL, verified on 10 Nov 2026
   *                (KwikLearn Technologies Ltd). It is used by the navbar button and the
   *                official Google Play badge, and by nothing else. Because the listing
   *                address does not change when the app is updated, publishing a new app
   *                version needs NO edit here. Change it only if the application id changes.
   * subjects       Subjects the app covers today. Edit when a subject launches.
   *   available        shown only in the caption under the Subjects screenshot (homepage text
   *                    slot data-site="subjects"). Permanent copy elsewhere is subject-neutral
   *                    and points visitors to the Subjects section of the app.
   *   shownInScreens   what the three app screenshots actually show. Update it only
   *                    when the screenshots are replaced.
   *
   * NOT controlled from here (static HTML, read by search engines and by visitors
   * without JavaScript, so review them by hand when this changes): meta description,
   * keywords, og:/twitter: descriptions, structured data, the About page, FAQ answers,
   * and the no-JavaScript fallback in index.html, which carries the SAME listing URL
   * as playStoreUrl (keep the two identical).
   * ========================================================================== */
  var KWIKLEARN_SITE = {
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.kwiklearn.app',   // official public listing (verified)
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
   * 1b) DOWNLOAD STATE
   * --------------------------------------------------------------------------
   *   'public' (LIVE)   The hero shows the official "Get it on Google Play" badge and the
   *                     navbar button reads "Get KwikLearn on Google Play"; both open
   *                     KWIKLEARN_SITE.playStoreUrl in a new tab.
   *   'prelaunch'       Safety fallback only. The page uses it automatically if the
   *                     listing URL is ever empty or malformed: the primary button reads
   *                     "Explore KwikLearn" and scrolls to Features, and there is no link
   *                     to Google Play. Nothing in this state claims the app is unavailable.
   *
   * SAFETY: if state is 'public' but playStoreUrl is empty or is not a Google Play
   * listing URL, the page falls back to 'prelaunch' and writes a console warning, so a
   * broken link can never go live.
   *
   * Only wording that must differ between the two states lives here. Everything else
   * on the page is permanent (evergreen) copy. index.html carries the 'public' wording
   * and link as the no-JavaScript fallback.
   * ========================================================================== */
  var KWIKLEARN_LAUNCH = {
    state: 'public',   // 'public' (live) or 'prelaunch' (fallback behaviour)

    prelaunch: {
      button: { label: 'Explore KwikLearn', href: '#features', external: false },
      heroNote: '',
      faqAnswer: 'KwikLearn is an Android app available on Google Play. Search for KwikLearn on Google Play to get it.'
    },

    public: {
      button: { label: 'Get KwikLearn on Google Play', href: KWIKLEARN_SITE.playStoreUrl, external: true },
      heroNote: '',
      faqAnswer: 'KwikLearn is available for Android on Google Play. Use the Google Play badge at the top of this page to get the app.'
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
      subjects: list
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
      if (s.button.external) { a.setAttribute('aria-label', s.button.label + ' (opens in a new tab)'); } else { a.removeAttribute('aria-label'); }
    }

    // Official Google Play badge links (only ever visible in the public state)
    var badges = document.querySelectorAll('[data-play-link]');
    for (var b = 0; b < badges.length; b++) {
      if (name === 'public') {
        badges[b].setAttribute('href', KWIKLEARN_SITE.playStoreUrl);
        badges[b].setAttribute('target', '_blank');
        badges[b].setAttribute('rel', 'noopener noreferrer');
        badges[b].setAttribute('aria-label', 'Get KwikLearn on Google Play (opens in a new tab)');
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
   *   scroll the track. Automatic rotation every AUTOPLAY_MS, with a Pause button;
   *   see the notes above initCarousel for what pauses or stops it.
   * ========================================================================== */
  /* Automatic rotation: every AUTOPLAY_MS the carousel moves to the next slide (and wraps to the first).
   * It never runs for visitors who ask for reduced motion or Data Saver, and it stops or pauses when:
   *   - the pointer is over the carousel, or keyboard focus is inside it (pauses while that is true, read from
   *     the live state, so pressing Play does not override it; resumes when both have left)
   *   - the visitor uses it: arrows, dots, keys, or a swipe or drag (stops until they press Play)
   *   - they press the Pause button (stops until they press Play)
   *   - the tab is hidden or the carousel is scrolled out of view (pauses)
   * Images: slide 1 is the only eager image. Nothing else is downloaded because of hover or focus. The automatic
   * rotation fetches the next slide one step ahead, after the page has loaded. Manual navigation fetches only the
   * slides it needs (the range being scrolled across, or the neighbours at the start of a swipe).
   * Reduced motion and Data Saver therefore download nothing extra until the visitor navigates. */
  var AUTOPLAY_MS = 5500;

  function initCarousel() {
    var root = document.getElementById('heroCarousel');
    if (!root) { return; }
    var track = root.querySelector('.hc-track');
    var slides = Array.prototype.slice.call(root.querySelectorAll('.hc-slide'));
    var dots = Array.prototype.slice.call(root.querySelectorAll('.hc-dot'));
    var prev = root.querySelector('.hc-prev');
    var next = root.querySelector('.hc-next');
    var status = root.querySelector('.hc-status');
    var playBtn = root.querySelector('.hc-playpause');
    var mq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
    var reduce = !!(mq && mq.matches);
    var saveData = !!(navigator.connection && navigator.connection.saveData);
    var current = 0;
    var loadedSlides = {};

    // autoplay state
    var autoAllowed = !reduce && !saveData && slides.length > 1;
    var userStopped = false, inView = true, pageLoaded = false;
    var timer = null;
    var progUntil = 0;   // scrolls caused by the script itself (not by the visitor) happen before this time
    function markProg(ms) { progUntil = Date.now() + ms; }

    function loadSlide(i) {
      if (loadedSlides[i] || !slides[i]) { return; }
      loadedSlides[i] = true;
      var pics = slides[i].querySelectorAll('[data-srcset],[data-src]');
      for (var p = 0; p < pics.length; p++) {
        var el = pics[p];
        if (el.getAttribute('data-srcset')) { el.setAttribute('srcset', el.getAttribute('data-srcset')); el.removeAttribute('data-srcset'); }
        if (el.getAttribute('data-src')) { el.setAttribute('src', el.getAttribute('data-src')); el.removeAttribute('data-src'); }
      }
    }

    // fetch only the slides from a to b (inclusive): the ones a navigation will scroll across
    function loadRange(a, b) {
      var lo = Math.max(0, Math.min(a, b)), hi = Math.min(slides.length - 1, Math.max(a, b));
      for (var i = lo; i <= hi; i++) { loadSlide(i); }
    }
    // before a swipe or drag the destination is unknown, so fetch the two neighbours
    function loadNeighbours() { loadRange(current - 1, current + 1); }

    function slideReady(i) {
      var img = slides[i] && slides[i].querySelector('img');
      // unloaded slides hold a 1x1 placeholder, so a real photo must have been requested and be wider than 1px
      return !!img && !!loadedSlides[i] && !img.getAttribute('data-src') && img.complete && img.naturalWidth > 1;
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

    function goTo(i, instant) {
      i = Math.max(0, Math.min(slides.length - 1, i));
      loadRange(current, i);
      markProg(1200);
      track.scrollTo({ left: slides[i].offsetLeft - track.offsetLeft, behavior: (reduce || instant) ? 'auto' : 'smooth' });
      setActive(i);
    }

    /* ---- automatic rotation ---- */
    // true while the pointer is over the carousel or focus is inside it, read live so it can never go stale
    function held() { return root.matches(':hover') || root.contains(document.activeElement); }
    function running() { return autoAllowed && !userStopped && !held() && inView && pageLoaded && !document.hidden; }

    function syncUi() {
      var auto = autoAllowed && !userStopped;
      if (playBtn) {
        playBtn.hidden = !autoAllowed;
        playBtn.setAttribute('aria-label', auto ? 'Pause automatic slide show' : 'Start automatic slide show');
        var icon = playBtn.querySelector('i');
        if (icon) { icon.className = 'bi ' + (auto ? 'bi-pause-fill' : 'bi-play-fill'); }
      }
      // Announce slide changes politely only when the visitor is moving slides; stay quiet while rotating on its own
      if (status) { status.setAttribute('aria-live', auto ? 'off' : 'polite'); }
      root.classList.toggle('hc-auto', auto);
    }

    function clearTimer() { if (timer) { window.clearTimeout(timer); timer = null; } }

    function schedule(delay) {
      clearTimer();
      if (running()) { timer = window.setTimeout(tick, delay || AUTOPLAY_MS); }
    }

    function tick() {
      timer = null;
      if (!running()) { return; }
      var target = current + 1 >= slides.length ? 0 : current + 1;
      loadSlide(target);
      if (!slideReady(target)) { schedule(700); return; }   // never show a blank slide on a slow connection
      goTo(target, target === 0);
      loadSlide((target + 1) % slides.length);               // fetch the slide after, ready for next time
      schedule();
    }

    function stopByUser() {
      if (!autoAllowed || userStopped) { return; }
      userStopped = true; clearTimer(); syncUi();
    }

    if (playBtn) {
      playBtn.addEventListener('click', function () {
        if (userStopped) { userStopped = false; syncUi(); loadSlide((current + 1) % slides.length); schedule(); }
        else { stopByUser(); }
      });
    }

    var ticking = false;
    track.addEventListener('scroll', function () {
      // a scroll the script did not cause (trackpad, drag, native swipe) is the visitor using the carousel
      if (Date.now() > progUntil) { loadNeighbours(); stopByUser(); }
      if (ticking) { return; }
      ticking = true;
      window.requestAnimationFrame(function () {
        ticking = false;
        var w = track.clientWidth || 1;
        var idx = Math.round(track.scrollLeft / w);
        if (idx !== current) { setActive(idx); }
      });
    }, { passive: true });

    // manual controls load every slide and stop the automatic rotation
    if (prev) { prev.addEventListener('click', function () { stopByUser(); goTo(current - 1); }); }
    if (next) { next.addEventListener('click', function () { stopByUser(); goTo(current + 1); }); }
    dots.forEach(function (d, i) { d.addEventListener('click', function () { stopByUser(); goTo(i); }); });

    track.addEventListener('keydown', function (e) {
      var k = e.key, handled = true;
      if (k === 'ArrowRight') { stopByUser(); goTo(current + 1); }
      else if (k === 'ArrowLeft') { stopByUser(); goTo(current - 1); }
      else if (k === 'Home') { stopByUser(); goTo(0); }
      else if (k === 'End') { stopByUser(); goTo(slides.length - 1); }
      else { handled = false; }
      if (handled) { e.preventDefault(); }
    });

    // swipe or drag: touch and pen start a stop; a mouse press on the track too
    track.addEventListener('touchstart', function () { loadNeighbours(); stopByUser(); }, { passive: true });
    track.addEventListener('pointerdown', function () { loadNeighbours(); stopByUser(); }, { passive: true });

    // hover and focus pause (and resume when the visitor leaves)
    root.addEventListener('mouseenter', clearTimer);
    root.addEventListener('mouseleave', function () { schedule(); });
    root.addEventListener('focusin', clearTimer);
    root.addEventListener('focusout', function (e) {
      if (e.relatedTarget && root.contains(e.relatedTarget)) { return; }
      schedule();
    });

    document.addEventListener('visibilitychange', function () { if (document.hidden) { clearTimer(); } else { schedule(); } });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        inView = entries[0].isIntersecting;
        if (inView) { schedule(); } else { clearTimer(); }
      }, { threshold: 0.25 }).observe(root);
    }
    if (mq && mq.addEventListener) {
      mq.addEventListener('change', function () {
        reduce = mq.matches;
        autoAllowed = !reduce && !saveData && slides.length > 1;
        if (!autoAllowed) { clearTimer(); }
        syncUi(); schedule();
      });
    }

    window.addEventListener('resize', function () {
      markProg(400);
      track.scrollTo({ left: slides[current].offsetLeft - track.offsetLeft, behavior: 'auto' });
    });

    setActive(0);
    root.classList.add('hc-ready');
    syncUi();

    // start after the page has fully loaded, so the first screen and the load are never delayed
    function afterLoad() {
      pageLoaded = true;
      if (autoAllowed) { loadSlide(1); schedule(); }
    }
    if (document.readyState === 'complete') { window.setTimeout(afterLoad, 300); }
    else { window.addEventListener('load', function () { window.setTimeout(afterLoad, 300); }, { once: true }); }
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
