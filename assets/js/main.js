/* ==========================================================================
   Nilbyte Studio — main.js
   --------------------------------------------------------------------------
   Vanilla ES2019+, no dependencies, loaded with `defer`.

   Everything here is an *enhancement*: with JavaScript disabled the page
   still renders, the nav links still jump (CSS scroll-behavior), and the
   contact form still submits via its mailto action.

   Modules
     1. Config
     2. Mobile navigation
     3. Theme toggle
     4. Smooth-scroll focus handling
     5. Scroll spy + sticky header state
     6. Contact form
     7. Footer year
   ========================================================================== */

(function () {
  'use strict';

  /* ========================================================================
     1. Config
     ======================================================================== */

  /**
   * TODO: paste your form endpoint here to enable AJAX submits.
   * Any service that accepts a POST and returns 2xx works — Formspree
   * ("https://formspree.io/f/xxxxxxx"), Basin, Netlify Forms, or your own
   * function. Leave it null and the form falls back to its mailto action.
   * Pick an EU-hosted provider if you want to keep the GDPR story simple.
   */
  var FORM_ENDPOINT = null;

  var THEME_KEY = 'nilbyte-theme';
  var DESKTOP_QUERY = '(min-width: 62em)';   // must match the CSS breakpoint

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /** localStorage throws in some privacy modes — never let that break the page. */
  function safeStore(key, value) {
    try {
      if (value === undefined) return localStorage.getItem(key);
      localStorage.setItem(key, value);
    } catch (err) {
      return null;
    }
  }

  /* ========================================================================
     2. Mobile navigation
     ======================================================================== */

  function initNav() {
    var toggle = document.getElementById('nav-toggle');
    var nav = document.getElementById('primary-nav');
    if (!toggle || !nav) return;

    // The button is hidden in markup so no-JS users never see a dead control.
    toggle.hidden = false;

    var desktop = window.matchMedia(DESKTOP_QUERY);

    function setOpen(open) {
      nav.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      // Stop the page behind the panel from scrolling while it is open.
      document.body.style.overflow = open ? 'hidden' : '';
    }

    function close() {
      if (nav.classList.contains('is-open')) setOpen(false);
    }

    toggle.addEventListener('click', function () {
      setOpen(!nav.classList.contains('is-open'));
    });

    // Tapping a link should navigate *and* dismiss the panel.
    nav.addEventListener('click', function (event) {
      if (event.target.closest('.nav__link')) close();
    });

    // Escape closes and returns focus to the button that opened it.
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && nav.classList.contains('is-open')) {
        close();
        toggle.focus();
      }
    });

    // Click outside the panel closes it.
    document.addEventListener('click', function (event) {
      if (!nav.classList.contains('is-open')) return;
      if (event.target.closest('#primary-nav, #nav-toggle')) return;
      close();
    });

    // Resizing up to desktop must clear the open state and the body lock,
    // otherwise the page stays unscrollable behind a nav that is now inline.
    var onChange = function (event) { if (event.matches) close(); };
    if (typeof desktop.addEventListener === 'function') {
      desktop.addEventListener('change', onChange);
    } else {
      desktop.addListener(onChange);           // Safari < 14
    }
  }

  /* ========================================================================
     3. Theme toggle
     --------------------------------------------------------------------
     Three states exist: "auto" (follow the OS), "light" and "dark". The
     toggle only ever writes light/dark — auto is the default until the
     visitor expresses a preference. The inline script in <head> applies the
     stored value before first paint to avoid a flash.
     ======================================================================== */

  function initTheme() {
    var button = document.getElementById('theme-toggle');
    if (!button) return;

    button.hidden = false;

    var systemDark = window.matchMedia('(prefers-color-scheme: dark)');

    function currentTheme() {
      var stored = safeStore(THEME_KEY);
      if (stored === 'light' || stored === 'dark') return stored;
      return systemDark.matches ? 'dark' : 'light';
    }

    /**
     * @param {'light'|'dark'} theme
     * @param {boolean} persist  Only true for an explicit click. Writing on
     *   init would pin a first-time visitor to whatever their OS said at that
     *   moment, so a later OS switch would be silently ignored.
     */
    function apply(theme, persist) {
      document.documentElement.dataset.theme = theme;
      if (persist) safeStore(THEME_KEY, theme);
      button.setAttribute('aria-pressed', String(theme === 'dark'));
      button.setAttribute(
        'aria-label',
        theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'
      );
    }

    // Sync the button's state with whatever is already showing.
    apply(currentTheme(), false);

    button.addEventListener('click', function () {
      apply(currentTheme() === 'dark' ? 'light' : 'dark', true);
    });

    // While the visitor is still on "auto", follow the OS if it changes.
    var onSystemChange = function (event) {
      var stored = safeStore(THEME_KEY);
      if (stored !== 'light' && stored !== 'dark') apply(event.matches ? 'dark' : 'light', false);
    };
    if (typeof systemDark.addEventListener === 'function') {
      systemDark.addEventListener('change', onSystemChange);
    } else {
      systemDark.addListener(onSystemChange);   // Safari < 14
    }
  }

  /* ========================================================================
     4. Smooth-scroll focus handling
     --------------------------------------------------------------------
     Scrolling itself is CSS (`scroll-behavior: smooth`). What CSS cannot do
     is move keyboard focus to the target, so a keyboard user's next Tab
     continues from the top of the page instead of the section they jumped
     to. This fixes that without hijacking the scroll.
     ======================================================================== */

  function initAnchorFocus() {
    document.addEventListener('click', function (event) {
      var link = event.target.closest('a[href^="#"]');
      if (!link) return;

      var id = link.getAttribute('href');
      if (!id || id === '#') return;

      var target = document.querySelector(id);
      if (!target) return;

      // Let the browser do the scrolling, then hand over focus.
      window.setTimeout(function () {
        // Sections are not focusable by default; -1 makes them
        // programmatically focusable without adding them to the tab order.
        if (!target.hasAttribute('tabindex')) {
          target.setAttribute('tabindex', '-1');
        }
        target.focus({ preventScroll: true });
      }, prefersReducedMotion.matches ? 0 : 420);
    });
  }

  /* ========================================================================
     5. Scroll spy + sticky header state
     --------------------------------------------------------------------
     IntersectionObserver rather than a scroll listener: no layout thrash,
     no throttling to tune.
     ======================================================================== */

  function initScrollSpy() {
    var links = Array.prototype.slice.call(document.querySelectorAll('.nav__link'));
    if (!links.length || !('IntersectionObserver' in window)) return;

    var sections = links
      .map(function (link) { return document.querySelector(link.getAttribute('href')); })
      .filter(Boolean);

    function activate(id) {
      links.forEach(function (link) {
        var isCurrent = link.getAttribute('href') === '#' + id;
        link.classList.toggle('is-active', isCurrent);
        // aria-current tells screen readers which section is in view.
        if (isCurrent) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
      });
    }

    var observer = new IntersectionObserver(function (entries) {
      // Pick the entry closest to the top of the band that is intersecting.
      var visible = entries
        .filter(function (entry) { return entry.isIntersecting; })
        .sort(function (a, b) { return a.boundingClientRect.top - b.boundingClientRect.top; });

      if (visible.length) activate(visible[0].target.id);
    }, {
      // A band across the upper-middle of the viewport: a section counts as
      // "current" once its content is where the eye actually is.
      rootMargin: '-25% 0px -60% 0px',
      threshold: 0
    });

    sections.forEach(function (section) { observer.observe(section); });
  }

  function initStickyHeader() {
    var header = document.querySelector('.site-header');
    var sentinel = document.getElementById('main');
    if (!header || !sentinel || !('IntersectionObserver' in window)) return;

    // Watch a zero-height sentinel at the top of <main> instead of listening
    // to scroll — the border/shadow flips exactly once per crossing.
    var observer = new IntersectionObserver(function (entries) {
      header.classList.toggle('is-stuck', !entries[0].isIntersecting);
    }, { rootMargin: '0px 0px -100% 0px' });

    observer.observe(sentinel);
  }

  /* ========================================================================
     6. Contact form
     --------------------------------------------------------------------
     Client-side validation is a convenience, not a guarantee — whatever
     endpoint you point FORM_ENDPOINT at must validate again server-side.
     ======================================================================== */

  function initForm() {
    var form = document.getElementById('contact-form');
    var status = document.getElementById('form-status');
    if (!form || !status) return;

    var fields = ['name', 'email', 'message'].map(function (id) {
      return form.elements[id];
    });

    function setError(field, message) {
      var errorId = field.id + '-error';
      var existing = document.getElementById(errorId);

      if (!message) {
        field.removeAttribute('aria-invalid');
        field.removeAttribute('aria-describedby');
        if (existing) existing.remove();
        return;
      }

      field.setAttribute('aria-invalid', 'true');
      field.setAttribute('aria-describedby', errorId);

      if (!existing) {
        existing = document.createElement('span');
        existing.className = 'form__error';
        existing.id = errorId;
        field.insertAdjacentElement('afterend', existing);
      }
      existing.textContent = message;
    }

    function validate() {
      var firstInvalid = null;

      fields.forEach(function (field) {
        var value = field.value.trim();
        var message = '';

        if (!value) {
          message = 'This field is required.';
        } else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
          message = 'Please enter a valid email address.';
        } else if (field.id === 'message' && value.length < 10) {
          message = 'A little more detail, please (10 characters minimum).';
        }

        setError(field, message);
        if (message && !firstInvalid) firstInvalid = field;
      });

      if (firstInvalid) firstInvalid.focus();
      return !firstInvalid;
    }

    // Clear an error as soon as the visitor starts fixing it.
    fields.forEach(function (field) {
      field.addEventListener('input', function () {
        if (field.getAttribute('aria-invalid') === 'true') setError(field, '');
      });
    });

    form.addEventListener('submit', function (event) {
      // No endpoint configured: let the browser handle the mailto action so
      // the form is never a dead end.
      if (!FORM_ENDPOINT) {
        if (!validate()) event.preventDefault();
        return;
      }

      event.preventDefault();

      // Honeypot filled in means a bot. Pretend it worked and drop it.
      if (form.elements.company && form.elements.company.value) {
        status.textContent = 'Thanks — your message is on its way.';
        status.className = 'form__status is-success';
        form.reset();
        return;
      }

      if (!validate()) return;

      var submitButton = form.querySelector('button[type="submit"]');
      submitButton.disabled = true;
      status.className = 'form__status';
      status.textContent = 'Sending…';

      fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form)
      })
        .then(function (response) {
          if (!response.ok) throw new Error('Request failed: ' + response.status);
          status.textContent = 'Thanks — your message is on its way. I reply within two working days.';
          status.className = 'form__status is-success';
          form.reset();
        })
        .catch(function () {
          status.innerHTML =
            'Something went wrong. Please email ' +
            '<a href="mailto:j.nilsson89@outlook.com">j.nilsson89@outlook.com</a> instead.';
          status.className = 'form__status is-error';
        })
        .then(function () {
          submitButton.disabled = false;
        });
    });
  }

  /* ========================================================================
     7. Footer year
     ======================================================================== */

  function initYear() {
    var year = document.getElementById('year');
    if (year) year.textContent = String(new Date().getFullYear());
  }

  /* ========================================================================
     Boot
     ======================================================================== */

  initNav();
  initTheme();
  initAnchorFocus();
  initScrollSpy();
  initStickyHeader();
  initForm();
  initYear();
})();
