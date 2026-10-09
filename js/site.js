// ASTYG Engineering Services: shared script for every page

// Footer year
var yr = document.getElementById('yr');
if (yr) yr.textContent = new Date().getFullYear();

// Phone menu button
var toggle = document.querySelector('.menu-toggle');
var menu = document.querySelector('nav.menu');
if (toggle && menu) {
  toggle.addEventListener('click', function () {
    var open = menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
}

// Quote form (only on contact.html)
var form = document.getElementById('quote-form');
if (form) {
  // contact.html?type=Training pre-selects the request type
  var type = new URLSearchParams(location.search).get('type');
  var select = document.getElementById('request_type');
  if (type && select) {
    for (var i = 0; i < select.options.length; i++) {
      if (select.options[i].text.toLowerCase() === type.toLowerCase()) select.selectedIndex = i;
    }
  }

  var statusEl = document.getElementById('form-status');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (form.access_key.value === 'YOUR_ACCESS_KEY_HERE') {
      statusEl.textContent = 'The form isn\'t connected yet. Please message us on Viber at +63 926 988 8890.';
      return;
    }
    var btn = form.querySelector('button');
    btn.disabled = true;
    statusEl.textContent = 'Sending…';
    fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
      .then(function (r) { return r.json(); })
      .then(function (d) {
        if (d.success) { form.reset(); statusEl.textContent = 'Thank you. We received your request and will contact you soon.'; }
        else { statusEl.textContent = 'Something went wrong. Please try again or message us on Viber.'; }
      })
      .catch(function () { statusEl.textContent = 'Network error. Please try again or message us on Viber.'; })
      .finally(function () { btn.disabled = false; });
  });
}
