const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const subjects=[
{id:"math",name:"Mathematics",cat:"STEM",icon:"∑",desc:"Build logical thinking through algebra, geometry, numbers and problem solving.",skills:["Algebra","Geometry","Reasoning"]},
{id:"physics",name:"Physics",cat:"STEM",icon:"⚛",desc:"Explore motion, energy, forces and the principles behind the physical world.",skills:["Mechanics","Energy","Experiments"]},
{id:"chem",name:"Chemistry",cat:"STEM",icon:"◈",desc:"Understand matter, reactions, structures and the language of chemistry.",skills:["Atoms","Reactions","Lab Work"]},
{id:"cs",name:"Computer Science",cat:"Computing",icon:"⌘",desc:"Learn programming, algorithms, data structures and computational thinking.",skills:["Logic","Programming","Algorithms"]},
{id:"web",name:"Web Development",cat:"Computing",icon:"</>",desc:"Create responsive and interactive websites with modern front-end skills.",skills:["HTML","CSS","JavaScript"]},
{id:"english",name:"English",cat:"Language",icon:"A",desc:"Strengthen reading, writing, communication and presentation skills.",skills:["Writing","Grammar","Speaking"]},
{id:"commerce",name:"Commerce",cat:"Commerce",icon:"₹",desc:"Explore business concepts, finance, accounting and entrepreneurial thinking.",skills:["Finance","Business","Accounting"]}
];
const questions=[
["Which task sounds most satisfying?",["Building a webpage","Solving a numerical problem","Explaining a science concept","Writing a clear article"],["web","math","physics","english"]],
["What do you prefer?",["Logic and code","Numbers and patterns","Experiments and observation","Communication and ideas"],["cs","math","chem","english"]],
["Which project would you choose?",["A study website","A data problem set","A science model","A presentation"],["web","math","physics","english"]],
["What skill would you improve?",["Programming","Problem solving","Research","Writing"],["cs","math","chem","english"]],
["How do you like to learn?",["By building things","By practising problems","By observing and testing","By reading and discussing"],["web","math","physics","english"]]
];
const key="studysphere";
let state=JSON.parse(localStorage.getItem(key)||'{"saved":[],"tasks":[],"goals":[],"quiz":[],"theme":"light"}');
const save=()=>localStorage.setItem(key,JSON.stringify(state));
function toast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2200)}
function renderSubjects(){
 const q=$("#subjectSearch").value.toLowerCase(), c=$("#subjectCategory").value;
 const list=subjects.filter(s=>(c==="all"||s.cat===c)&&(`${s.name} ${s.desc} ${s.skills.join(" ")}`.toLowerCase().includes(q)));
 $("#subjectGrid").innerHTML=list.map(s=>`<article class="card reveal"><div class="card-top"><div class="icon-box">${s.icon}</div><button class="favorite ${state.saved.includes(s.id)?"saved":""}" data-save="${s.id}" aria-label="Save ${s.name}">${state.saved.includes(s.id)?"★":"☆"}</button></div><span class="tag">${s.cat}</span><h3>${s.name}</h3><p>${s.desc}</p><div class="chips">${s.skills.map(x=>`<span>${x}</span>`).join("")}</div><div class="card-actions"><button class="small-btn primary-small" data-details="${s.id}">View pathway</button></div></article>`).join("")||'<div class="empty">No subjects found.</div>';
 $$("#subjectGrid .reveal").forEach(x=>setTimeout(()=>x.classList.add("visible"),20));
}
function populateSelect(){ $("#taskSubject").innerHTML=subjects.map(s=>`<option>${s.name}</option>`).join("") }
function renderTasks(){
 const q=$("#taskSearch").value.toLowerCase(), f=$("#taskFilter").value;
 const list=state.tasks.filter(t=>(f==="all"||(f==="Completed"?t.done:!t.done))&&`${t.name} ${t.subject}`.toLowerCase().includes(q));
 $("#taskList").innerHTML=list.length?list.map(t=>`<div class="task-item ${t.done?"done":""}"><div><h4>${t.name}</h4><div class="task-meta">${t.subject} · ${t.priority} priority ${t.date?"· "+t.date:""}</div></div><div class="task-actions"><button class="small-btn" data-done="${t.id}">${t.done?"Undo":"Done"}</button><button class="small-btn" data-edit="${t.id}">Edit</button><button class="small-btn" data-delete="${t.id}">×</button></div></div>`).join(""):'<div class="empty">No tasks found. Add your first study task.</div>';
 updateDashboard();
}
function updateDashboard(){
 const completed=state.tasks.filter(t=>t.done).length,total=state.tasks.length,pct=total?Math.round(completed/total*100):0;
 $("#completedCount").textContent=completed;$("#savedCount").textContent=state.saved.length;$("#quizCount").textContent=state.quiz.length;
 $("#heroProgress").textContent=pct+"%";$("#bigPercent").textContent=pct+"%";$("#metricCompleted").textContent=completed;$("#metricSaved").textContent=state.saved.length;$("#metricGoals").textContent=state.goals.filter(g=>g.p>=100).length;
 const best=state.quiz.length?Math.max(...state.quiz.map(x=>x.score)):0;$("#metricQuiz").textContent=best+"%";
 $("#progressMessage").textContent=total?(pct>=80?"Excellent momentum. Keep the streak alive.":pct>=50?"You're building a strong study rhythm.":"Every completed task moves the dashboard forward."):"Add and complete tasks to build your progress.";
}
function renderQuiz(){
 $("#quizForm").innerHTML=questions.map((q,i)=>`<div class="question"><p>${i+1}. ${q[0]}</p>${q[1].map((o,j)=>`<label class="option"><input required type="radio" name="q${i}" value="${q[2][j]}"> ${o}</label>`).join("")}</div>`).join("")+`<button class="btn primary" type="submit">Calculate my result</button> <button class="btn ghost" type="button" id="clearQuiz">Clear answers</button>`;
}
function renderGoals(){
 $("#goalList").innerHTML=state.goals.length?state.goals.map(g=>`<div class="goal"><div><strong>${g.name}</strong><progress value="${g.p}" max="100"></progress><small>${g.p}% complete</small></div><div class="task-actions"><button class="small-btn" data-minus="${g.id}">−10</button><button class="small-btn" data-plus="${g.id}">+10</button><button class="small-btn" data-goaldelete="${g.id}">×</button></div></div>`).join(""):'<div class="empty">No goals yet. Add one above.</div>';
 updateDashboard(); renderAchievements();
}
function renderAchievements(){
 const completed=state.tasks.filter(t=>t.done).length,best=state.quiz.length?Math.max(...state.quiz.map(x=>x.score)):0;
 const a=[["✓","First Task",completed>=1],["★","Task Master",completed>=5],["✦","Quiz Starter",state.quiz.length>=1],["◆","Quiz Master",best>=80],["◉","Goal Crusher",state.goals.some(g=>g.p>=100)],["⚡","High Momentum",completed>=10]];
 $("#achievementGrid").innerHTML=a.map(x=>`<div class="achievement ${x[2]?"":"locked"}"><div class="badge">${x[0]}</div><h3>${x[1]}</h3><p>${x[2]?"Unlocked":"Keep learning to unlock"}</p></div>`).join("");
}
function openModal(id){
 const s=subjects.find(x=>x.id===id); if(!s)return;
 $("#modalContent").innerHTML=`<span class="eyebrow">${s.cat}</span><h2>${s.name}</h2><p>${s.desc}</p><h3 style="margin-top:18px">Suggested pathway</h3><ul style="margin:10px 0 18px;padding-left:20px"><li>Learn the foundations of ${s.name.toLowerCase()}.</li><li>Practise ${s.skills[0].toLowerCase()} through small exercises.</li><li>Build a mini project to demonstrate your understanding.</li><li>Review your mistakes and repeat the difficult topics.</li></ul><div class="chips">${s.skills.map(x=>`<span>${x}</span>`).join("")}</div>`;
 $("#detailModal").showModal();
}
let timer=1500,interval=null;
function timerRender(){const m=String(Math.floor(timer/60)).padStart(2,"0"),s=String(timer%60).padStart(2,"0");$("#timerDisplay").textContent=`${m}:${s}`}
$("#themeToggle").onclick=()=>{state.theme=state.theme==="dark"?"light":"dark";document.body.dataset.theme=state.theme;$("#themeToggle").textContent=state.theme==="dark"?"☀":"☾";save()};
$("#navToggle").onclick=()=>{$("#mainNav").classList.toggle("open");$("#navToggle").setAttribute("aria-expanded",$("#mainNav").classList.contains("open"))};
$$('#mainNav a').forEach(a=>a.onclick=()=>$("#mainNav").classList.remove("open"));
$("#subjectSearch").oninput=renderSubjects;$("#subjectCategory").onchange=renderSubjects;
$("#subjectGrid").onclick=e=>{const fav=e.target.closest("[data-save]"),det=e.target.closest("[data-details]");if(fav){const id=fav.dataset.save;state.saved=state.saved.includes(id)?state.saved.filter(x=>x!==id):[...state.saved,id];save();renderSubjects();toast(state.saved.includes(id)?"Subject saved":"Subject removed")}if(det)openModal(det.dataset.details)};
$("#modalClose").onclick=()=>$("#detailModal").close();
$("#quizForm").onsubmit=e=>{e.preventDefault();const data=new FormData(e.target),answers=questions.map((_,i)=>data.get("q"+i));let counts={web:0,math:0,physics:0,english:0,cs:0,chem:0};answers.forEach(a=>counts[a]++);const top=Object.entries(counts).sort((a,b)=>b[1]-a[1])[0][0];const score=Math.round((answers.filter(Boolean).length/5)*100);state.quiz.push({score,date:new Date().toISOString()});save();$("#quizResult").innerHTML=`<span class="result-icon">✦</span><div class="result-score">${score}%</div><h3>Your strongest direction: ${top==="web"?"Web Development":top==="math"?"Mathematics":top==="physics"?"Physics":top==="english"?"English":top==="cs"?"Computer Science":"Chemistry"}</h3><p>You completed all five questions. Use this result as a practice signal, not a fixed judgement.</p>`;updateDashboard();renderAchievements();toast("Quiz result saved locally")};
$("#quizForm").onclick=e=>{if(e.target.id==="clearQuiz"){e.preventDefault();renderQuiz();toast("Quiz cleared")}};
$("#taskForm").onsubmit=e=>{e.preventDefault();const id=$("#editId").value;const obj={id:id||Date.now().toString(),name:$("#taskName").value,subject:$("#taskSubject").value,priority:$("#taskPriority").value,date:$("#taskDate").value,done:false};if(id){const old=state.tasks.find(t=>t.id===id);obj.done=old.done;state.tasks=state.tasks.map(t=>t.id===id?obj:t)}else state.tasks.push(obj);save();e.target.reset();$("#editId").value="";$("#cancelEdit").classList.add("hidden");$("#taskSubmit").textContent="Add task";renderTasks();toast(id?"Task updated":"Task added")};
$("#taskList").onclick=e=>{const d=e.target.closest("[data-done]"),ed=e.target.closest("[data-edit]"),del=e.target.closest("[data-delete]");if(d){state.tasks=state.tasks.map(t=>t.id===d.dataset.done?{...t,done:!t.done}:t);save();renderTasks()}if(ed){const t=state.tasks.find(t=>t.id===ed.dataset.edit);$("#editId").value=t.id;$("#taskName").value=t.name;$("#taskSubject").value=t.subject;$("#taskPriority").value=t.priority;$("#taskDate").value=t.date;$("#taskSubmit").textContent="Update task";$("#cancelEdit").classList.remove("hidden");scrollTo({top:$("#planner").offsetTop-70,behavior:"smooth"})}if(del){state.tasks=state.tasks.filter(t=>t.id!==del.dataset.delete);save();renderTasks();toast("Task removed")}};
$("#cancelEdit").onclick=()=>{$("#taskForm").reset();$("#editId").value="";$("#cancelEdit").classList.add("hidden");$("#taskSubmit").textContent="Add task"};
$("#taskSearch").oninput=renderTasks;$("#taskFilter").onchange=renderTasks;
$("#goalForm").onsubmit=e=>{e.preventDefault();state.goals.push({id:Date.now().toString(),name:$("#goalName").value,p:0});save();e.target.reset();renderGoals();toast("Goal added")};
$("#goalList").onclick=e=>{const p=e.target.closest("[data-plus]"),m=e.target.closest("[data-minus]"),d=e.target.closest("[data-goaldelete]");if(p)state.goals=state.goals.map(g=>g.id===p.dataset.plus?{...g,p:Math.min(100,g.p+10)}:g);if(m)state.goals=state.goals.map(g=>g.id===m.dataset.minus?{...g,p:Math.max(0,g.p-10)}:g);if(d)state.goals=state.goals.filter(g=>g.id!==d.dataset.goaldelete);save();renderGoals()};
$$(".technique-btn").forEach(b=>b.onclick=()=>{$("#modalContent").innerHTML=`<span class="eyebrow">STUDY TECHNIQUE</span><h2>${b.dataset.tech}</h2><p style="margin-top:12px">Use this method deliberately: choose a small learning target, work without distractions, then review what you retained. Adapt the timing to your own workload rather than treating the method as a rigid rule.</p>`;$("#detailModal").showModal()});
$("#timerStart").onclick=()=>{if(interval){clearInterval(interval);interval=null;$("#timerStart").textContent="Start";$("#timerLabel").textContent="Paused";return}$("#timerLabel").textContent="Focus session running";$("#timerStart").textContent="Pause";interval=setInterval(()=>{timer--;timerRender();if(timer<=0){clearInterval(interval);interval=null;toast("Focus session complete!");$("#timerStart").textContent="Start";$("#timerLabel").textContent="Session complete";}},1000)};
$("#timerReset").onclick=()=>{clearInterval(interval);interval=null;timer=1500;timerRender();$("#timerStart").textContent="Start";$("#timerLabel").textContent="Ready for a focused session?"};
$("#contactForm").onsubmit=e=>{e.preventDefault();const n=$("#contactName").value.trim(),em=$("#contactEmail").value.trim(),msg=$("#contactMessage").value.trim();if(!n||!em||!msg)return;$("#contactNote").textContent="Your email application will open with the message prepared. Replace the placeholder developer email in script.js if needed.";location.href=`mailto:navdeep.kaur@example.com?subject=${encodeURIComponent("StudySphere enquiry from "+n)}&body=${encodeURIComponent(msg+"\n\nFrom: "+n+" ("+em+")")}`};
window.addEventListener("scroll",()=>{const h=document.documentElement.scrollHeight-innerHeight;$("#scrollProgress").style.width=(scrollY/h*100)+"%";$("#backTop").classList.toggle("show",scrollY>500)});
$("#backTop").onclick=()=>scrollTo({top:0,behavior:"smooth"});
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add("visible")}),{threshold:.08});
document.querySelectorAll(".section").forEach(s=>{s.classList.add("reveal");io.observe(s)});
document.querySelectorAll(".section[id]").forEach(sec=>{new IntersectionObserver(es=>{if(es[0].isIntersecting){const a=$(`#mainNav a[href="#${sec.id}"]`);$$("#mainNav a").forEach(x=>x.classList.remove("active"));if(a)a.classList.add("active")}}, {rootMargin:"-35% 0px -55% 0px"}).observe(sec)});
document.addEventListener("DOMContentLoaded",()=>{document.body.dataset.theme=state.theme||"light";$("#themeToggle").textContent=state.theme==="dark"?"☀":"☾";renderSubjects();populateSelect();renderQuiz();renderTasks();renderGoals();timerRender();});
