var PRODUCTS = [
  {name:"نعيمي", sku:"sKZGilNR3m", price:1100, qty:999},
  {name:"نجدي", sku:"UgNmfDzNBQ", price:1100, qty:999},
  {name:"نجدي جذع", sku:"wE4mpjQVF0", price:1100, qty:999},
  {name:"حري", sku:"wud8e8ANS6", price:1100, qty:100},
  {name:"تيس", sku:"BXZx3hUFld", price:1100, qty:100},
  {name:"نجدي", sku:"qfuqOPV8Si", price:1100, qty:10},
  {name:"نعيمي", sku:"1795", price:1100, qty:22},
  {name:"حري", sku:"6xwcOiYo8H", price:1100, qty:5}
];
var nf = new Intl.NumberFormat("ar-EG");
function n(x){ return nf.format(x); }
function money(x){ return n(x) + " ر.س"; }
var cart = {}, filter = "الكل";
var $ = function(id){ return document.getElementById(id); };

function breeds(){
  var map = {}; PRODUCTS.forEach(function(p){ var k = p.name.split(" ")[0]; map[k] = (map[k]||0) + 1; });
  return map;
}
function renderChips(){
  var map = breeds(), html = '<button class="chip" type="button" aria-pressed="' + (filter==="الكل") + '" data-f="الكل">الكل<i>' + n(PRODUCTS.length) + '</i></button>';
  Object.keys(map).forEach(function(k){ html += '<button class="chip" type="button" aria-pressed="' + (filter===k) + '" data-f="' + k + '">' + k + '<i>' + n(map[k]) + '</i></button>'; });
  $("chips").innerHTML = html;
}
function stockHtml(p){
  if (p.qty <= 10) return '<span class="stock low">بقي ' + n(p.qty) + ' فقط</span>';
  return '<span class="stock">متوفر</span>';
}
function actionHtml(p){
  var q = cart[p.sku] || 0;
  if (!q) return '<button class="add" type="button" data-add="' + p.sku + '">أضف إلى الطلب</button>';
  return '<div class="step"><button type="button" data-dec="' + p.sku + '" aria-label="إنقاص">−</button><output>' + n(q) + '</output><button type="button" data-inc="' + p.sku + '" aria-label="زيادة"' + (q >= p.qty ? " disabled" : "") + '>+</button></div>';
}
function renderGrid(){
  var list = PRODUCTS.filter(function(p){ return filter==="الكل" || p.name.split(" ")[0]===filter; });
  $("grid").innerHTML = list.map(function(p){
    return '<article class="tag"><div class="tag-head"><h3>' + p.name + '</h3></div><div class="tag-body">' +
      '<div class="price">' + n(p.price) + ' <span>ر.س للرأس</span></div>' +
      '<div class="meta">' + stockHtml(p) + '<span class="sku">' + p.sku + '</span></div>' +
      actionHtml(p) + '</div></article>';
  }).join("");
}
function totals(){
  var c = 0, t = 0;
  PRODUCTS.forEach(function(p){ var q = cart[p.sku]||0; c += q; t += q*p.price; });
  return {c:c, t:t};
}
function renderCart(){
  var s = totals();
  $("cartCount").textContent = n(s.c);
  $("bar").hidden = s.c === 0;
  $("barCount").textContent = n(s.c) + (s.c === 1 ? " رأس" : " رؤوس") + " ·";
  $("barTotal").textContent = money(s.t);
  $("sheetTotal").textContent = money(s.t);
  var html = "";
  PRODUCTS.forEach(function(p){
    var q = cart[p.sku]||0; if (!q) return;
    html += '<div class="line"><div><div class="nm">' + p.name + '</div><div class="sku">' + p.sku + '</div></div><div class="lt">' + money(q*p.price) + '</div>' +
      '<div class="step"><button type="button" data-dec="' + p.sku + '" aria-label="إنقاص">−</button><output>' + n(q) + '</output><button type="button" data-inc="' + p.sku + '" aria-label="زيادة"' + (q >= p.qty ? " disabled" : "") + '>+</button></div></div>';
  });
  $("lines").innerHTML = html || '<div class="empty">لم تضف أي رأس بعد. اختر نوعًا من القائمة وأضفه إلى الطلب.</div>';
  $("pay").disabled = s.c === 0;
  $("pay").style.opacity = s.c === 0 ? ".4" : "1";
}
function refresh(){ renderGrid(); renderCart(); }
function change(sku, d){
  var p = PRODUCTS.filter(function(x){ return x.sku===sku; })[0]; if (!p) return;
  var q = Math.max(0, Math.min(p.qty, (cart[sku]||0) + d));
  if (q) cart[sku] = q; else delete cart[sku];
  refresh();
}
document.addEventListener("click", function(e){
  var t = e.target.closest("button"); if (!t) return;
  if (t.dataset.f){ filter = t.dataset.f; renderChips(); renderGrid(); }
  else if (t.dataset.add) change(t.dataset.add, 1);
  else if (t.dataset.inc) change(t.dataset.inc, 1);
  else if (t.dataset.dec) change(t.dataset.dec, -1);
});
function openSheet(){ $("note").textContent = ""; $("sheet").hidden = false; $("closeSheet").focus(); }
function closeSheet(){ $("sheet").hidden = true; }
$("openCart").onclick = openSheet; $("barOpen").onclick = openSheet; $("closeSheet").onclick = closeSheet;
$("sheet").addEventListener("click", function(e){ if (e.target === $("sheet")) closeSheet(); });
document.addEventListener("keydown", function(e){ if (e.key === "Escape") closeSheet(); });
$("pay").onclick = function(){ if (totals().c) $("note").textContent = "الدفع غير مربوط في هذا التصميم. يُربط من إعدادات المتجر."; };
renderChips(); refresh();
