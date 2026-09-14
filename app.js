const defaultSeats = {
  A1:'Cecilia', A2:'Summer', A3:'', A4:'Will', A5:'考赛尔', A6:'Lu Qian',
  B1:'Rhea', B2:'Nicole', B3:'Tycho', B4:'Ruby', B5:'Saga', B6:'Leo', B7:'Frank', B8:'',
  C1:'Leeo', C2:'Qinrui Liu', C3:'Clarie', C4:'Sylvia', C5:'Kaisen', C6:'Tycho', C7:'Eva', C8:'Bubble',
  D1:'Weijie Liu', D2:'空位', D3:'Sophie', D4:'空位', D5:'Wendy', D6:'空位', D7:'Fiona', D8:'空位',
  R1:'Cathy', R2:'Tracy'
};
const groupSeats = {
  A:['A4','A1','A2','A5','A6'],
  B:['B1','B2','B3','B4','B5','B6','B7','B8'],
  C:['C1','C2','C3','C4','C5','C6','C7','C8'],
  D:['D1','D2','D3','D4','D5','D6','D7','D8']
};
let seats = {...defaultSeats, ...JSON.parse(localStorage.getItem('officeSeats') || '{}')};
let selectedSeat = null;
let editing = false;
const floor = document.querySelector('#floor');
const search = document.querySelector('#search');
const infoName = document.querySelector('#personName');
const infoMeta = document.querySelector('#seatMeta');
const clearBtn = document.querySelector('#clearBtn');
const dialog = document.querySelector('#editDialog');
const editName = document.querySelector('#editName');
const editSeatLabel = document.querySelector('#editSeatLabel');
let editingId = null;

function renderGroups(){
  document.querySelectorAll('.desk-group').forEach(group => {
    group.innerHTML = groupSeats[group.dataset.group].map(id => seatButton(id)).join('');
  });
  document.querySelectorAll('.seat.mini').forEach(button => fillButton(button, button.dataset.seat));
  bindSeats();
}
function seatButton(id){
  const name = seats[id] || '';
  const open = !name || name === '空位';
  return `<button class="seat ${open?'vacant':'occupied'}" data-seat="${id}" title="${name || '空位'} · ${id}">${name || '空位'}</button>`;
}
function fillButton(button,id){
  const name = seats[id] || '空位';
  button.textContent = name;
  button.title = `${name} · ${id}`;
  button.classList.toggle('occupied', name !== '空位');
  button.classList.toggle('vacant', name === '空位');
}
function bindSeats(){
  document.querySelectorAll('.seat').forEach(button => button.addEventListener('click', () => {
    const id = button.dataset.seat;
    if(editing) return openEditor(id);
    selectSeat(id);
  }));
}
function selectSeat(id){
  selectedSeat = id;
  document.querySelectorAll('.seat').forEach(el => el.classList.toggle('active', el.dataset.seat === id));
  infoName.textContent = seats[id] || '空位';
  infoMeta.textContent = `${id} 工位 · ${id.startsWith('R') ? '独立办公室' : id[0] + ' 区'}`;
  clearBtn.disabled = false;
}
function clearSelection(){
  selectedSeat = null;
  document.querySelectorAll('.seat').forEach(el => el.classList.remove('active','search-hit'));
  infoName.textContent = '选择一个工位';
  infoMeta.textContent = '搜索姓名，或直接点击地图上的工位。';
  clearBtn.disabled = true;
}
function openEditor(id){
  editingId = id;
  editSeatLabel.textContent = `${id} 工位`;
  editName.value = seats[id] === '空位' ? '' : seats[id] || '';
  dialog.showModal();
  setTimeout(() => editName.focus(), 50);
}
search.addEventListener('input', () => {
  const term = search.value.trim().toLowerCase();
  document.querySelectorAll('.seat').forEach(el => el.classList.remove('search-hit'));
  if(!term) return clearSelection();
  const matches = Object.entries(seats).filter(([,name]) => name && name.toLowerCase().includes(term));
  matches.forEach(([id]) => document.querySelector(`[data-seat="${id}"]`)?.classList.add('search-hit'));
  if(matches.length === 1){
    selectSeat(matches[0][0]);
    document.querySelector(`[data-seat="${matches[0][0]}"]`)?.scrollIntoView({behavior:'smooth',block:'center',inline:'center'});
  } else {
    infoName.textContent = matches.length ? `找到 ${matches.length} 个工位` : '未找到';
    infoMeta.textContent = matches.length ? matches.map(([id,name])=>`${name}（${id}）`).join('、') : '请尝试其他姓名。';
  }
});
document.querySelector('#editToggle').addEventListener('click', e => {
  editing = !editing;
  floor.classList.toggle('editing', editing);
  e.currentTarget.textContent = editing ? '完成编辑' : '编辑工位';
  e.currentTarget.classList.toggle('ghost', editing);
});
document.querySelector('#editForm').addEventListener('submit', e => {
  if(e.submitter?.value === 'cancel') return;
  e.preventDefault();
  seats[editingId] = editName.value.trim() || '空位';
  localStorage.setItem('officeSeats', JSON.stringify(seats));
  dialog.close();
  renderGroups();
  selectSeat(editingId);
});
document.querySelector('#exportBtn').addEventListener('click', () => {
  const data = new Blob([JSON.stringify(seats,null,2)],{type:'application/json'});
  const url = URL.createObjectURL(data);
  const a = document.createElement('a'); a.href=url; a.download='seats.json'; a.click();
  URL.revokeObjectURL(url);
});
clearBtn.addEventListener('click', clearSelection);
renderGroups();
