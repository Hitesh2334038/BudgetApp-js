 var budgetController=(function(){

   var Expense=function(id,description,value){
     this.id=id;
     this.description=description;
     this.value=value;
     this.percentage=-1;
   };
   Expense.prototype.calcPercentage=function(totalIncome){
     if(totalIncome>0){
       this.percentage=Math.round((this.value/totalIncome)*100);

     }else{
       this.percentage=-1;
     }
   };
   Expense.prototype.getPercentage=function(){
     return this.percentage;
   };

   var Income=function(id,description,value){
     this.id=id;
     this.description=description;
     this.value=value;
   };

var calculateTotal=function(type){
  var sum=0;
  data.allItems[type].forEach(function(cur){

  sum+=cur.value;

  });
  data.totals[type]=sum;

};


var data={
  allItems:{
    exp:[],
    inc:[]
  },
  totals:{
    exp:0,
    inc:0
  },
  budget:0,
  percentage:-1
};

return{
  addItem:function(type,des,val){
var newItem,ID;

  //create new id
  if(data.allItems[type].length>0){
    ID=data.allItems[type][data.allItems[type].length-1].id+1;
  }else{
    ID=0;
  }

  //create new item
    if(type === 'exp'){
    newItem =new Expense(ID,des,val);
  }else if(type === 'inc'){
      newItem =new Expense(ID,des,val);
  }
//push into data structure and finally get element
  data.allItems[type].push(newItem);
  return newItem;
},

deleteItem :function(type,id){
var ids,index;
 ids=  data.allItems[type].map(function(current){

    return current.id;
 index=ids.indexOf(id);
  });
  if(index !==-1){
  data.allItems[type].splice(index,1);
  }
},


calculateBudget:function(){
// calculate total income and expences
calculateTotal('exp');
calculateTotal('inc');

//calculate budget : income - expense
data.budget=data.totals.inc-data.totals.exp;

//calculate the percentage income taht spent
if(data.totals.inc>0){
data.percentage=Math.round((data.totals.exp/data.totals.inc)*100);
}
else{
  data.percentage= -1;
}
},

calculatePercentages:function(){

  data.allItems.exp.forEach(function(cur){
    cur.calcPercentage(data.totals.inc);
  });


},

getPercentage:function(){
  var allPerc=data.allItems.exp.map(function(cur){
    return cur.getPercentage();
  });
  return allPerc;
},

getBudget:function(){
return{
  budget:data.budget,
  totalInc:data.totals.inc,
  totalExp:data.totals.exp,
  percentage:data.percentage
};
},

testing:function(){
  console.log(data);
}
};
 })();





 var UIController=(function(){

   var DOMstrings={
     inputType:'.add_type',
     inputDescription:'.add_description',
     inputValue:'.add_value',
     inputBtn:'.add_btn',
     incomeContainer:'.income_list',
     expensesContainer:'.expenses_list',
     budgetLabel:'.budget_value',
     incomeLabel:'.budget_income--value',
     expensesLabel:'.budget_expenses--value',
     percentageLabel:'.budget_expenses--percentage',
     container:'.container',
     expensesPerLabel:'.item_percentage',
     dateLabel:'.budget_title--month'
   };
   var formatNumber=function(num,type){
     var numSplit,int,dec;
     num=Math.abs(num);
     num=num.toFixed(2);
     numSplit=num.split('.');
    int =numSplit[0];
    if(int.length>3){
      int=int.substr(0,int.length-3)+','+int.substr(int.length-3,3);
    }

    dec=numSplit[1];


    return   (type==='exp'?'-':'+')+''+int+'.'+dec;
  };
  var nodeListForEach=function(list,callback){
     for(var i=0;i<list.length;i++){
       callback(list[i],i);
     }
  };

   return {

     getInput:function() {
       return{
          type:document.querySelector(DOMstrings.inputType).value,//will be either inc Object.create(target)
          description:document.querySelector(DOMstrings.inputDescription).value,
          value:parseFloat(document.querySelector(DOMstrings.inputValue).value)
       };


     },

     adddListItem:function(obj,type){
var html,newHtml;

       //crrate html string with placeholder text
       if(type === 'inc'){
         element=DOMstrings.incomeContainer;
  html=  '<div class="item clearfix" id="inc-%id%"><div class="item_description">%description%</div><div class="right clearfix"><div class="item_value">%value%</div><div class="item_delete"><button class="item_delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
}else if(type === 'exp'){
  element=DOMstrings.expensesContainer;
  html='<div class="item clearfix" id="exp-%id%"><div class="item_description">%description%</div><div class="right clearfix"><div class="item_value">%value%</div><div class="item_percentage">21%</div><div class="item_delete"><button class="item_delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
}

//replace placeholder text with actual data
  newHtml=html.replace('%id%',obj.id);
    newHtml=newHtml.replace('%description%',obj.description);
    newHtml=newHtml.replace('%value%',formatNumber( obj.value,type));


       //insert into htmlinto  the dom
       document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);

     },

     deleteListItem:function(selectorID){
       var el= document.getElementById(selectorID);
      el.parentNode.removeChild( el);

     },

     clearFields:function(){
       var fields,fieldArr;
      fields= document.querySelectorAll(DOMstrings.inputDescription+','+DOMstrings.inputValue);

     fieldArr=  Array.prototype.slice.call(fields);

     fieldArr.forEach(function(current,index,array){
       current.value="";
     });

     fieldArr[0].focus();

     },

     displayBudget:function(obj){
       var type;
       obj.budget>0?type='inc':type='exp';
       document.querySelector(DOMstrings.budgetLabel).textContent=formatNumber(obj.budget,type);
   document.querySelector(DOMstrings.incomeLabel).textContent=formatNumber(obj.totalInc,'inc');
      document.querySelector(DOMstrings.expensesLabel).textContent=formatNumber(obj.totalExp,'exp');

         if(obj.percentage>0){
           document.querySelector(DOMstrings.percentageLabel).textContent=obj.percentage+'%';

         }else{
           document.querySelector(DOMstrings.percentageLabel).textContent='---';

         }



     },

     displayPercentages:function(percentages){

       var fields=document.querySelectorAll(DOMstrings.expensesPerLabel);



       nodeListForEach(fields,function(current,index){

         if(percentages[index]>0){
            current.textContent=percentages[index]+'%';
         }else{
            current.textContent='---';
         }

       });


     },

     displaMonth:function(){
var year,now,month,months;
       now=new Date();

       months=['jan','feb','mar','apr','may','jun','jul','aug','sept','nov','dec'];

       month=now.getMonth();
       year=now.getFullYear();
       document.querySelector(DOMstrings.dateLabel).textContent=months[month]+ ' ' +year;
     },

     changedType:function(){
       var fields=document.querySelectorAll(
         DOMstrings.inputType+','+
         DOMstrings.inputDescription+','+
         DOMstrings.inputValue);

       nodeListForEach(fields,function(cur){
         cur.classList.toggle('red-focus');
       });
     },

     getDOMstrings:function(){
       return DOMstrings;
     }
   };
 })();





 var controller=(function(budgetController,UIController){

var setupEventListeners=function(){
  var DOM=UIController.getDOMstrings();

  document.querySelector(DOM.inputBtn).addEventListener('click',ctrlAddItem);
document.addEventListener('keypress',function(event){
  if(event.keyCode === 13 ){
    ctrlAddItem();
  }
});

document.querySelector(DOM.container).addEventListener('click',ctrlDeleteItem);

document.querySelector(DOM.inputType).addEventListener('change',UIController.changedType);
};

var updateBudget=function(){
  //calculate the budget
  budgetController.calculateBudget();


//return budget
var budget=budgetController.getBudget();

  //display budget on ui
UIController.displayBudget(budget);
};

var updatePercentages = function(){
  //calculate percentage
budgetController.calculatePercentages();
  //read from budget ctrl
var percentages=  budgetController.getPercentage();

  //update UI
  UIController.displayPercentages(percentages);
};

var ctrlAddItem = function(){
  var input,newItem;
  //1.get input data
 input=UIController.getInput();

 if(input.description !=="" && !isNaN(input.value) && input.value>0)
 {
  //add item to budeget budgetController
 newItem = budgetController.addItem(input.type,input.description,input.value);

  //add item to userinterface
UIController.adddListItem(newItem,input.type);
//clear fieldsU

UIController.clearFields();

  //calculate and update budeget
  updateBudget();

  //calculate and update the percentage
  updatePercentages();


}
};
var ctrlDeleteItem=function(event){
  var itemID,splitID;
   itemID=event.target.parentNode.parentNode.parentNode.parentNode.id;
if(itemID){
 splitID=itemID.split('-');
type=splitID[0];
ID= parseInt(splitID[1]);

//1.delete this item from data structure
budgetController.deleteItem(type,ID);

//2.from ui
UIController.deleteListItem(itemID);

//calculate again
  updateBudget();
//calculate and update the percentage
  updatePercentages();
}

};

return {
  init:function(){
    console.log('working good....');
    UIController.displaMonth();
    UIController.displayBudget({
      budget:0,
      totalInc:0,
      totalExp:0,
      percentage:-1
    });
    setupEventListeners();
  }
};

 })(budgetController,UIController);

controller.init();
