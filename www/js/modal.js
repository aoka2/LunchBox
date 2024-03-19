const btn = document.querySelectorAll(".modal-toggle");
btn.forEach(function (btn) {
btn.onclick = function () {
const modalAttribute = btn.getAttribute('data-modal');
const modalShow = document.getElementById(modalAttribute);
modalShow.classList.add('show');
};
});
const closeBtnTop = document.querySelectorAll(".close-btn-top");
closeBtnTop.forEach(function (btn) {
btn.onclick = function () {
const modal = btn.closest('.modal-outer');
modal.classList.remove('show');
};
});
const closeBtnBottom = document.querySelectorAll(".close-btn-bottom");
closeBtnBottom.forEach(function (btn) {
btn.onclick = function () {
const modal = btn.closest('.modal-outer');
modal.classList.remove('show');
};
});
const modalOuter = document.querySelectorAll('.modal-outer');
modalOuter.forEach(function (outer) {
outer.onclick = function () {
if(event.target.closest('.modal-inner') === null) {
event.target.classList.remove('show');
}
}
});