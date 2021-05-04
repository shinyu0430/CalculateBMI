let dataAry = JSON.parse(localStorage.getItem('bmiList')) || [];

const height=document.querySelector('#height');
const weight=document.querySelector('#weight');
const submit=document.querySelector('.submit');

const warnHeight=document.querySelector('.warn_height');
const warnWeight=document.querySelector('.warn_weight');

const lastResult=document.querySelector('.lastResult');
const lastBMI=document.querySelector('.lastResult_BMI');
const lastCondition=document.querySelector('.lastResult_condition');

const recordList=document.querySelector('.record_list');
const clearAll=document.querySelector('.fa-trash-alt');

submit.addEventListener('click',checkInputValue,false);
clearAll.addEventListener('click',clearStorage,false);
recordList.addEventListener('click',clearSingleResult,false);

renderRecordList();

//檢查使用者是否填寫身高、體重
function checkInputValue(){
    if(height.value===''){
      warnHeight.classList.remove('v-hidden');
    }
    else{
      warnHeight.classList.add('v-hidden');
    }
  
    if(weight.value===''){
      warnWeight.classList.remove('v-hidden');
    }
    else{
      warnWeight.classList.add('v-hidden');
    }
    if(height.value!=''&&weight.value!=''){
      calculateBMI();
    }
  
}

//計算BMI
function calculateBMI(){
  let kg=weight.value;
  let cm=height.value;
  let BMI=(kg/((cm/100)**2)).toFixed(2);
  let date=new Date().toLocaleDateString();
  let [condition,color]=checkCondition(BMI);
  
  let result={
    BMI:BMI,
    height:cm,
    weight:kg,
    date:date,
    condition:condition,
    color:color
  };
  sendToStorage(result);
  renderLastResult(result);
};

//檢查BMI範圍
function checkCondition(BMI){
  let condition,color;
  if (16 <= BMI && BMI < 18.5) {
        condition = '過輕';
        color = '#31BAF9';
    } else if (18.5 <= BMI && BMI < 25) {
        condition = '理想';
        color = '#86D73F';
    } else if (25 <= BMI && BMI < 30) {
        condition = '過重';
        color = '#FF982D';
    } else if (30 <= BMI && BMI < 35) {
        condition = '輕度肥胖';
        color = '#FF6C03';
    } else if (35 <= BMI && BMI < 40) {
        condition = '中度肥胖';
        color = '#FF6C03';
    } else if (BMI >= 40) {
        condition = '重度肥胖';
        color = '#FF1200';
    } else {
        condition = '嚴重過輕';
        color = 'yellow';
    };
  return [condition,color];
};
function sendToStorage(result){
  dataAry.push(result);
  localStorage.setItem("bmiList",JSON.stringify(dataAry));
  renderRecordList();
};



//渲染測量記錄畫面
function renderRecordList(){
  let listStr='';
  let result=dataAry;

  for(let i=result.length-1;i>-1;i--){
      let {BMI,height,weight,date,condition,color}=result[i];
      listStr+=`
      <li style="border-color:${color}">
        <h3 >${condition}</h3>
        <div><small>BMI</small><span>${BMI}</span></div>
        <div><small>Height</small><span>${height}cm</span></div>
        <div><small>Weight</small><span>${weight}kg</span></div>
        <div><small>${date}</small></div>
        <i class="far fa-minus-square" data-num=${i}></i>
      </li>
    `;
  };

  recordList.innerHTML=listStr;
}

//渲染當次測量畫面
function renderLastResult(result){
  let {BMI,condition,color}=result;
  height.readOnly = true;
  weight.readOnly = true;
  lastBMI.innerHTML=`<span>${BMI}<small>BMI</small></span>
  <i class="fas fa-sync fa-xs" style="background-color:${color}"></i>`;
  lastCondition.innerHTML=`<span>${condition}</span>`;
  lastBMI.style.color=`${color}`;
  lastCondition.style.color=`${color}`;
  
  lastResult.classList.remove('d-none')
  submit.classList.add('d-none')
  
  const lastRefresh=document.querySelector('.fa-sync');
  lastRefresh.addEventListener('click',clearLastResult,false);
}

//清除當次測量畫面
function clearLastResult(){
  height.readOnly = false;
  weight.readOnly = false;
  height.value='';
  weight.value='';
  submit.classList.remove('d-none')
  lastResult.classList.add('d-none')
}

//清除所有測量紀錄
function clearStorage(){
  localStorage.clear();
  dataAry=[];
  renderRecordList()
};

//清除選定測量紀錄
function clearSingleResult(event){
  if(event.target.nodeName!='I'){
    return;
  }
  dataAry.splice(event.target.dataset.num,1);
  localStorage.setItem("bmiList",JSON.stringify(dataAry));
  renderRecordList();
}