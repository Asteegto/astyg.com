// ASTYG Engineering Services: free calculators on tools.html
// These are rule-of-thumb estimates for early planning, not a design calculation.

function num(id) {
  var v = parseFloat(document.getElementById(id).value);
  return isNaN(v) || v < 0 ? 0 : v;
}
function fmt(n, d) {
  return n.toLocaleString('en-PH', { minimumFractionDigits: d || 0, maximumFractionDigits: d || 0 });
}

// ---- Aircon size ----
// Base load in BTU/h per m² by room type (already includes 2 people and normal lighting).
// Adjusted for ceiling height, extra people, roof exposure and afternoon sun.
function aircon() {
  var perM2 = num('ac-type');
  var area = num('ac-l') * num('ac-w');
  var height = num('ac-h') || 2.7;
  var people = num('ac-p');
  var out = document.getElementById('ac-out');
  if (!area) { out.innerHTML = '<p>Enter the room length and width.</p>'; return; }

  var btu = area * perM2 * Math.max(1, height / 2.7);
  btu += Math.max(0, people - 2) * 600;        // about 600 BTU/h per extra person
  if (document.getElementById('ac-roof').checked) btu *= 1.10;
  if (document.getElementById('ac-sun').checked) btu *= 1.10;

  var tons = btu / 12000;                      // 1 ton of refrigeration = 12,000 BTU/h
  var kw = btu * 0.000293071;
  var hp = Math.max(0.75, Math.ceil((btu / 9000) * 2) / 2); // ~9,000 BTU/h per "HP" for split units, rounded up to 0.5

  out.innerHTML =
    '<div class="big">' + fmt(Math.round(btu / 100) * 100) + ' <small>BTU/h</small></div>' +
    '<p>' + fmt(tons, 2) + ' TR &nbsp;·&nbsp; ' + fmt(kw, 1) + ' kW &nbsp;·&nbsp; floor area ' + fmt(area, 1) + ' m²</p>' +
    '<p>Typical split-type unit: about <b>' + fmt(hp, hp % 1 ? 1 : 0) + ' HP</b>. Check the BTU/h rating on the brochure, since HP labels vary by brand.</p>';
}

// ---- Water tank size ----
function tank() {
  var people = num('tk-n');
  var lpd = num('tk-lpd');
  var days = num('tk-days');
  var out = document.getElementById('tk-out');
  if (!people || !lpd || !days) { out.innerHTML = '<p>Enter people, liters per day and days of storage.</p>'; return; }

  var daily = people * lpd;
  var storage = daily * days;
  var tanks1000 = Math.ceil(storage / 1000);

  out.innerHTML =
    '<div class="big">' + fmt(Math.ceil(storage / 10) * 10) + ' <small>liters</small></div>' +
    '<p>' + fmt(storage / 1000, 1) + ' m³ storage &nbsp;·&nbsp; ' + fmt(daily) + ' liters per day</p>' +
    '<p>For example: <b>' + tanks1000 + ' × 1,000-liter tank' + (tanks1000 === 1 ? '' : 's') + '</b>, or one larger tank of the same total.</p>';
}

var typeSel = document.getElementById('tk-type');
typeSel.addEventListener('change', function () {
  document.getElementById('tk-lpd').value = typeSel.value;
  tank();
});

document.getElementById('ac-calc').addEventListener('input', aircon);
document.getElementById('tank-calc').addEventListener('input', tank);
aircon();
tank();
