const STORAGE_KEY = 'tasks-organizer-v1';
let tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};

const monthLabel = document.getElementById('monthLabel');
const grid = document.getElementById('calendarGrid');
const panelTitle = document.getElementById('panelTitle');
const tasksList = document.getElementById('tasksList');
const taskForm = document.getElementById('taskForm');
const taskText = document.getElementById('taskText');
const taskNotes = document.getElementById('taskNotes');
const clearDayBtn = document.getElementById('clearDayBtn');
const clearAllBtn = document.getElementById('clearAllBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

let firstDate = new Date();
let selectedDate = null;

function ymd(d) {
  const date = d instanceof Date ? d : new Date(d);
  const Y = date.getFullYear();
  const M = String(date.getMonth()+1).padStart(2,'0');
  const D = String(date.getDate()).padStart(2,'0');
  return `${Y}-${M}-${D}`;
}

function el(tag, props={}, ...children) {
  const node = document.createElement(tag);

  for (const k in props) {
    if(k==='class') node.className = props[k];
    else node.setAttribute(k, props[k]);
  }

  children.forEach(ch => {
    if(ch!=null) 
      node.append(typeof ch==='string'? document.createTextNode(ch): ch);
  });
  return node;
}

function save() { 
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)); 
}

function firstDay(d){ 
  return new Date(d.getFullYear(),d.getMonth(),1); 
}
function daysInMonth(d){ 
  return new Date(d.getFullYear(),d.getMonth()+1,0).getDate(); 
}
function weekdayIndex(d){ 
  return (d.getDay()+6)%7; 
}

function renderHeader(d) {
  const months=['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];
  monthLabel.textContent = `${months[d.getMonth()]} ${d.getFullYear()}`;
}

function renderCalendar(d) {
  grid.innerHTML = '';
  renderHeader(d);
  const first = firstDay(d);
  const offset = weekdayIndex(first);
  const total = daysInMonth(d);
  const prevLast = new Date(d.getFullYear(),d.getMonth(),0).getDate();
  const cells=6*7;
  let day=1, next=1;
  const today=ymd(new Date());

  for(let i=0;i<cells;i++){
    let dateObj, num, inactive=false;
    if(i<offset){
      num=prevLast-(offset-1)+i;
      dateObj=new Date(d.getFullYear(),d.getMonth()-1,num);
      inactive=true;
    } else if(day<=total){
      num=day;
      dateObj=new Date(d.getFullYear(),d.getMonth(),day++);
    } else {
      num=next;
      dateObj=new Date(d.getFullYear(),d.getMonth()+1,next++);
      inactive=true;
    }

    const key=ymd(dateObj);
    const cell=el('div',
        {class:'cell'+(inactive?' inactive':''),
          dataset:{date:key}
        },
        el('div',{class:'num'},String(num))
      );
    if(key===today) cell.classList.add('today');
    if(tasks[key]?.length) {
      cell.classList.add('has-tasks');
      cell.appendChild(el('div',{class:'count'},`${tasks[key].length}*`));
    }
    cell.addEventListener('click',()=>selectDate(key,cell));
    grid.appendChild(cell);
  }
}

function clearSelected(){
  const prev=grid.querySelector('.cell.selected');
  if(prev) 
    prev.classList.remove('selected');
}

function selectDate(key,cell){
  clearSelected();
  cell.classList.add('selected');
  selectedDate=key;
  renderTasks(key);
}

function renderTasks(key){
  if (!key) {
    panelTitle.textContent = 'Выберите дату';
    tasksList.innerHTML = '<div class="no-tasks">Планов нет</div>';
    return;
  }
  selectedDate = key;
  panelTitle.textContent=`Дела на ${new Date(key).toLocaleDateString()}`;
  tasksList.innerHTML='';
  const list=tasks[key]||[];
  if(!list.length){
    tasksList.appendChild(el('div',{class:'no-tasks'},'Планов нет'));
    return;
  }
  
  list.forEach((t,idx)=>{
    const item=el('div',{class:'task'},
      el('div',{},t.text)
    );

    if(t.notes) 
      item.appendChild(
        el('div',
          {style:'font-size:13px; color:var(--muted); margin-top:6px'},
          t.notes)
      );

    const del=el('button',{class:'btn secondary',type:'button'},'Удалить');

    del.addEventListener('click',()=>{
      tasks[key].splice(idx,1);
      if(!tasks[key].length) delete tasks[key];
      save();
      renderCalendar(firstDate);
      renderTasks(selectedDate);
    });
    item.appendChild(del);
    tasksList.appendChild(item);
  });
}

prevBtn.addEventListener('click',()=>{ 
  firstDate=new Date(firstDate.getFullYear(),firstDate.getMonth()-1,1); renderCalendar(firstDate); 
});

nextBtn.addEventListener('click',()=>{ 
  firstDate=new Date(firstDate.getFullYear(),firstDate.getMonth()+1,1); renderCalendar(firstDate); 
});

taskForm.addEventListener('submit',e=>{
  e.preventDefault();
  if(!selectedDate) return alert('Выберите дату');
  const text=taskText.value.trim();
  if(!text) return;
  const notes=taskNotes.value.trim();
  tasks[selectedDate]=tasks[selectedDate]||[];
  tasks[selectedDate].push({text,notes});
  save();
  renderCalendar(firstDate);
  renderTasks(selectedDate);
  taskText.value='';
  taskNotes.value='';
});

clearDayBtn.addEventListener('click',()=>{
  if(!selectedDate) return alert('Выберите дату');
  if(!tasks[selectedDate]?.length) return alert('Нет задач на этот день');
  if(!confirm('Удалить все дела на выбранную дату?')) return;
  delete tasks[selectedDate];
  save();
  renderCalendar(firstDate);
  renderTasks(selectedDate);
});

clearAllBtn.addEventListener('click',()=>{
  if(!confirm('Удалить все задачи?')) return;
  tasks={};
  save();
  renderCalendar(firstDate);
  renderTasks(selectedDate);
});

document.addEventListener('click',e=>{
  if(!e.target.closest('#calendarGrid') && !e.target.closest('#taskPanel')){
    clearSelected();
    selectedDate=null;
    renderTasks(selectedDate);
  }
});

renderCalendar(firstDate);
