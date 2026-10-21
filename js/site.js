/* ASTYG Engineering Services — site scripts */
(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var fmt = function (n, d) { return Number(n).toLocaleString('en-PH', { maximumFractionDigits: d || 0, minimumFractionDigits: d || 0 }); };
  var num = function (el) { var v = parseFloat(el && el.value); return isNaN(v) ? 0 : v; };

  /* mobile menu */
  var burger = $('.burger'), menu = $('.menu');
  if (burger && menu) burger.addEventListener('click', function () {
    var open = menu.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
  });

  /* keep the active service visible in the strip on phones */
  var act = $('.service-strip a.active');
  if (act && act.scrollIntoView) act.scrollIntoView({ inline: 'center', block: 'nearest' });

  /* ---------------- Tool 1: aircon size ---------------- */
  var ac = $('#ac-form');
  if (ac) {
    // W per m2 of floor for walls, glass, lights and equipment; W per person (sensible + latent)
    var ROOM = {
      bedroom:    { wm2: 120, wp: 115, name: 'Bedroom' },
      living:     { wm2: 140, wp: 130, name: 'Living / dining room' },
      office:     { wm2: 160, wp: 130, name: 'Office' },
      retail:     { wm2: 190, wp: 140, name: 'Store / retail' },
      classroom:  { wm2: 140, wp: 120, name: 'Classroom / conference' },
      restaurant: { wm2: 200, wp: 160, name: 'Restaurant / eatery' }
    };
    var SIZES = [0.5, 0.75, 1, 1.5, 2, 2.5, 3];
    var calcAC = function () {
      var r = ROOM[$('#ac-type').value];
      var L = num($('#ac-l')), W = num($('#ac-w')), H = num($('#ac-h')) || 2.7, P = num($('#ac-p'));
      var area = L * W;
      var hFactor = Math.max(1, H / 2.7);
      var roof = $('#ac-roof').checked ? 1.15 : 1;
      var sun = $('#ac-sun').checked ? 1.10 : 1;
      var room = area * r.wm2 * hFactor * roof * sun;
      var people = P * r.wp;
      var watts = room + people;
      var btu = watts * 3.412;
      var tr = btu / 12000;
      var hp = btu / 9000;
      var pick = SIZES.filter(function (s) { return s >= hp - 0.05; })[0];
      $('#ac-out').innerHTML =
        '<div class="mid">Estimated cooling needed</div>' +
        '<div class="big">' + fmt(btu) + ' BTU/h</div>' +
        '<div class="mid">' + (pick ? 'Suggested: about ' + pick + ' HP aircon' : 'Above 3 HP: use 2 or more units, or a ducted / VRF system') + '</div>' +
        '<table>' +
        '<tr><td>Floor area (' + fmt(L, 1) + ' × ' + fmt(W, 1) + ' m)</td><td>' + fmt(area, 1) + ' m²</td></tr>' +
        '<tr><td>Room load (' + r.wm2 + ' W/m²' + (hFactor > 1 ? ' × ' + fmt(hFactor, 2) + ' height' : '') + (roof > 1 ? ' × 1.15 roof' : '') + (sun > 1 ? ' × 1.10 sun' : '') + ')</td><td>' + fmt(room) + ' W</td></tr>' +
        '<tr><td>People (' + P + ' × ' + r.wp + ' W)</td><td>' + fmt(people) + ' W</td></tr>' +
        '<tr><td>Total (W × 3.412 = BTU/h)</td><td>' + fmt(watts) + ' W</td></tr>' +
        '<tr><td>Tons of refrigeration (÷ 12,000)</td><td>' + fmt(tr, 2) + ' TR</td></tr>' +
        '<tr><td>Aircon HP (÷ 9,000 BTU/h per HP)</td><td>' + fmt(hp, 2) + ' HP</td></tr>' +
        '</table>' +
        '<p class="note">Rough estimate for one room. Kitchens, server rooms, clinics and rooms with lots of glass need a proper calculation.</p>';
    };
    ac.addEventListener('input', calcAC); ac.addEventListener('change', calcAC); calcAC();
  }

  /* ---------------- Tool 2: water tank ---------------- */
  var wt = $('#wt-form');
  if (wt) {
    var LPD = { house: 150, office: 50, school: 40, hotel: 250, clinic: 300 };
    var wtType = $('#wt-type'), wtL = $('#wt-lpd');
    wtType.addEventListener('change', function () { wtL.value = LPD[wtType.value]; calcWT(); });
    var TANKS = [500, 1000, 1500, 2000, 3000, 5000, 10000];
    var calcWT = function () {
      var P = num($('#wt-p')), lpd = num(wtL), d = num($('#wt-d'));
      var daily = P * lpd, total = daily * d;
      var plan;
      if (total <= 0) plan = '—';
      else if (total <= 10000) { var t = TANKS.filter(function (s) { return s >= total; })[0]; plan = '1 × ' + fmt(t) + ' L tank'; }
      else { var n = Math.ceil(total / 10000); plan = n + ' × 10,000 L tanks, or a concrete cistern'; }
      $('#wt-out').innerHTML =
        '<div class="mid">Water storage needed</div>' +
        '<div class="big">' + fmt(total) + ' liters</div>' +
        '<div class="mid">Suggested: ' + plan + '</div>' +
        '<table>' +
        '<tr><td>Daily use (' + fmt(P) + ' × ' + fmt(lpd) + ' L)</td><td>' + fmt(daily) + ' L/day</td></tr>' +
        '<tr><td>Storage (daily × ' + d + ' day' + (d === 1 ? '' : 's') + ')</td><td>' + fmt(total) + ' L</td></tr>' +
        '<tr><td>In cubic meters (÷ 1,000)</td><td>' + fmt(total / 1000, 1) + ' m³</td></tr>' +
        '</table>' +
        '<p class="note">Fire protection water (sprinklers and hose) is a separate reserve sized under the Fire Code.</p>';
    };
    wt.addEventListener('input', calcWT); calcWT();
  }

  /* ---------------- Tool 3: genset size ---------------- */
  var gs = $('#gs-form');
  if (gs) {
    var GEN = [10, 15, 20, 25, 30, 40, 50, 60, 80, 100, 125, 150, 200, 250, 300, 400, 500, 625, 750, 1000];
    var calcGS = function () {
      var acHP = num($('#gs-ac')), lights = num($('#gs-lights')), mot = num($('#gs-motor')), other = num($('#gs-other'));
      var acKW = acHP * 0.9;              // running kW per aircon HP (inverter/non-inverter average)
      var run = acKW + lights + mot + other;
      var startExtra = mot * 2;           // largest motor starting surge (about 3x running, extra 2x)
      var kva = (run + startExtra) / 0.8 * 1.1;  // pf 0.8, 10% margin
      var pick = GEN.filter(function (s) { return s >= kva; })[0];
      $('#gs-out').innerHTML =
        '<div class="mid">Generator size needed</div>' +
        '<div class="big">' + fmt(Math.ceil(kva)) + ' kVA</div>' +
        '<div class="mid">' + (pick ? 'Suggested: ' + pick + ' kVA standby genset' : 'Above 1,000 kVA: needs a proper load study') + '</div>' +
        '<table>' +
        '<tr><td>Aircon (' + fmt(acHP, 1) + ' HP × 0.9 kW)</td><td>' + fmt(acKW, 1) + ' kW</td></tr>' +
        '<tr><td>Lights and outlets</td><td>' + fmt(lights, 1) + ' kW</td></tr>' +
        '<tr><td>Biggest motor / pump</td><td>' + fmt(mot, 1) + ' kW</td></tr>' +
        '<tr><td>Other equipment</td><td>' + fmt(other, 1) + ' kW</td></tr>' +
        '<tr><td>Running total</td><td>' + fmt(run, 1) + ' kW</td></tr>' +
        '<tr><td>Motor starting surge (motor × 2)</td><td>' + fmt(startExtra, 1) + ' kW</td></tr>' +
        '<tr><td>kVA = (running + surge) ÷ 0.8 pf × 1.10</td><td>' + fmt(kva, 1) + ' kVA</td></tr>' +
        '</table>' +
        '<p class="note">Rough estimate. Hospitals, cold storage, elevators and large motors need a proper load study and ATS design.</p>';
    };
    gs.addEventListener('input', calcGS); calcGS();
  }

  /* ---------------- contact form ---------------- */
  var cf = $('#contact-form');
  if (cf) {
    var qs = new URLSearchParams(location.search);
    var type = qs.get('type'), svc = qs.get('service');
    if (type) { var rt = $('#f-request'); $$('option', rt).forEach(function (o) { if (o.value.toLowerCase() === type.toLowerCase()) rt.value = o.value; }); }
    if (svc) { var box = $('input[name="services"][value="' + svc + '"]'); if (box) box.checked = true; }

    cf.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!cf.reportValidity()) return;
      var fd = new FormData(cf), lines = [];
      var label = { name: 'Name', company: 'Company', email: 'Email', mobile: 'Mobile/Viber', role: 'I am the', reach: 'Best way to reach me',
        request: 'Request type', building: 'Building type', location: 'Project location', area: 'Floor area (sq.m)', floors: 'Floors',
        stage: 'Project stage', needed: 'Needed by', budget: 'Budget', link: 'Plans / photos link', message: 'Description' };
      var services = fd.getAll('services');
      Object.keys(label).forEach(function (k) {
        var v = fd.get(k); if (v) lines.push(label[k] + ': ' + v);
        if (k === 'building' && services.length) lines.push('Services: ' + services.map(function (s) { return $('input[name="services"][value="' + s + '"]').parentNode.textContent.trim(); }).join(', '));
      });
      var subject = 'Quote request: ' + (fd.get('request') || 'Project') + ' - ' + (fd.get('name') || '');
      var body = lines.join('\n');
      var action = cf.getAttribute('data-endpoint');
      var done = function () { $('#form-ok').style.display = 'block'; $('#form-ok').scrollIntoView({ block: 'center' }); };
      if (action) {
        fetch(action, { method: 'POST', body: fd, headers: { Accept: 'application/json' } })
          .then(function (r) { if (r.ok) { cf.reset(); done(); } else throw 0; })
          .catch(function () { location.href = 'mailto:info@astyg.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body); done(); });
      } else {
        location.href = 'mailto:info@astyg.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
        done();
      }
    });
  }
})();
