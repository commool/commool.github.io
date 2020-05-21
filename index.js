const placeContainer = document.querySelector('[data-place-container]');
const timeContainer = document.querySelector('[data-time-container]');
const urlContainer = document.querySelector('[data-url-container]')
const bookmarkletContainer = document.querySelector('[data-bookmarklet-container]')
const dateInput = document.querySelector('[data-date]');
const placeRadios = [...document.querySelectorAll('[data-place]')];
const generateUrl = document.querySelector('[data-generate-url]');
const generateBookmarklet = document.querySelector('[data-bookmarklet]');
let placeValue = 912;

function renderTimeCheckbox(){
  [...Array(16)].map((v,idx) => {
    const input = document.createElement('input');
    const startTime = 6+idx < 10 ? `0${6+idx}`: 6+idx;
    const endTime = 7+idx < 10 ? `0${7+idx}`: 7+idx;
    input.type = "checkbox";
    input.id = `label-${placeValue+idx}`;
    input.value = `${placeValue+idx};${idx+1}부;${startTime}00;${endTime}00;1`;
    input.dataset.order = idx;
    
    const span = document.createElement('span');
    span.appendChild(input);
    span.innerHTML += `<label for="label-${placeValue+idx}">${startTime}시</label>`;
    return span;
  }).forEach(v => timeContainer.appendChild(v));
}

function setDate(){
  const today = new Date();
  const date = new Date(today.setDate(today.getDate() + 7));
  const month = (date.getMonth()+1) < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1;
  const d2 = date.getDate()<10 ? '0'+date.getDate() : date.getDate();
  return `${date.getFullYear()}-${month}-${d2}`;
}

function placeClickHandler(e){
  const place = e.target.value;
  placeValue = parseInt(place) === 28 ? 912 : 928;
  timeContainer.innerHTML = '';
  renderTimeCheckbox();
}

function timeClickHandler(e){
  if(e.target.tagName !== 'INPUT') return;
  const checkedInput = timeContainer.querySelectorAll(':checked');
  const checkedCount = checkedInput.length;
  
  timeContainer.querySelectorAll('input').forEach(input => {
    input.disabled = true;
    switch (checkedCount) {
      case 0: input.removeAttribute('disabled');
      break;
      case 1:
        const checkedOrder = parseInt(checkedInput[0].dataset.order);
        const order = parseInt(input.dataset.order);
        const diff = Math.abs(checkedOrder - order);
        if (diff === 1 || diff === 0) {
          input.removeAttribute('disabled');
        }
      break;
      default: if(input.checked) input.removeAttribute('disabled');
    }
  });
}

function generateClickHandler(){
  const place = placeContainer.querySelector(':checked').value;
  const date = dateInput.value.split('-').join('');
  const time = [...timeContainer.querySelectorAll(':checked')].map(input => input.value).join('|');
  if (time.length === 0) return;
  const url = `https://www.gunpouc.or.kr/fmcs/157?center=GUNPO02&facilities_type=T&action=write&base_date=${date}&place=${place}&part=02&comcd=GUNPO02&part_cd=02&place_cd=${place}&time_no=${time}&rent_type=1001&rent_date=${date}`;
  urlContainer.innerHTML = `<a data-link href="${url}">1. quick link</a>`;
}

function makeBookmarklet(team, users, purpose){
  return `<a data-link href="javascript:(function()%7Bdocument.querySelector('%23team_nm').value%3D%22${encodeURIComponent(team)}%22%3Bdocument.querySelector('%23users').value%3D${encodeURIComponent(users)}%3Bdocument.querySelector('%23purpose').value%3D%22${encodeURIComponent(purpose)}%22%3Bdocument.querySelector('%23agree_use1').checked%3Dtrue%3Bdocument.querySelector('.action_write').click()%7D)()">2. Bookmarklet</a>`;
}

function makeBookmarkletHandler(){
  const team = document.querySelector('[data-team]').value;
  const users = document.querySelector('[data-users]').value;
  const purpose = document.querySelector('[data-purpose]').value;
  bookmarkletContainer.innerHTML = makeBookmarklet(team, users, purpose);
}

function addEvents(){
  placeRadios.forEach(radio => radio.addEventListener('change', placeClickHandler));
  timeContainer.addEventListener('click', timeClickHandler);
  generateUrl.addEventListener('click', generateClickHandler);
  generateBookmarklet.addEventListener('click', makeBookmarkletHandler);
}

function init(){
  dateInput.value = setDate();
  renderTimeCheckbox();
  addEvents();
}

init();