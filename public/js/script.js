const myWs = new WebSocket('wss://crashserver.onrender.com');
myWs.onopen = function () {
  console.log('dude');
};


var dataPoints = [];
      
var chart = new CanvasJS.Chart("chartContainer", {
  theme: "light2",
  title: {
    text: "Hooked"
  },
  backgroundColor: "rgba(255, 255, 255, .0)",
  data: [{
    type: "line",
    dataPoints: dataPoints
  }]
});
updateData();

// Initial Values
var xValue = 0;
var yValue = 1;
var newDataCount = 3;

function addData(data) {
  if(newDataCount != 1) {
    $.each(data, function(key, value) {
      dataPoints.push({x: value[0], y: parseInt(value[1])});
      xValue++;
      yValue = parseInt(value[1]);
    });
  } else {
    //dataPoints.shift();
    dataPoints.push({x: data[0][0], y: parseInt(data[0][1])});
    xValue++;
    yValue = parseInt(data[0][1]);
  }
  
  newDataCount = 1;
  chart.render();
  setTimeout(updateData, 1500);
}

function updateData() {
  $.getJSON("https://canvasjs.com/services/data/datapoints.php?xstart="+xValue+"&ystart="+yValue+"&length="+newDataCount+"type=json", addData);
}


function getCurrentTimestamp() {
  return Date.now(); // Returns the current timestamp in milliseconds
}
myWs.onmessage = function (message) {
    try {
        const jsonMessage = JSON.parse(message.data);
        switch (jsonMessage.action) {
          case "SECOND_BEFORE_START":
            multiplyStr.textContent = jsonMessage.data;
            break;
          case "CNT_MULTIPLY":
            multiplyStr.textContent = jsonMessage.data;
            console.log(getCurrentTimestamp());
            break;
          case "CNT_BALANCE":
            balanceStr.textContent = '$' 
                                   +  (Math.trunc(jsonMessage.balance)== jsonMessage.balance ? Math.trunc(jsonMessage.balance) : parseFloat(jsonMessage.balance).toFixed(3));
            break;
          case "BETTED":
            btnBet.style.opacity = "0.4";
            btnBet.disabled = true;
            break;
          case "ROUND_PREPARING":
            formBet.value = 0;
            chartContainer.style.opacity = "0.0";
            formBet.style.opacity = "1.0";
            formBet.disabled = false;

            btnBet.style.opacity = "1.0";
            btnBet.textContent = "PLACE A BET";
            btnBet.disabled = false;

            multiplyLbl.style.color = "rgba(0, 0, 0, 0.4)";
            multiplyLbl.style.textAlign = "center"
            multiplyLbl.innerHTML = "<br /><br />BE READY FOR A ROUND:";

            multiplyStr.style.color = "rgba(0, 0, 0, 0.4)";
            multiplyStr.style.fontSize = "32px";
            multiplyStr.style.textAlign = "centre"
            multiplyStr.style.left = "-25%";
            multiplyStr.style.position = "relative";
            break;
          case "ROUND_STARTED":
            formBet.style.opacity = "0.4";
            formBet.disabled = true;
            
            if(jsonMessage.isBetted){
                btnBet.style.opacity = "1.0";
                btnBet.disabled = false;
            }else{
                btnBet.style.opacity = "0.4";
                btnBet.disabled = true; 
            }

            btnBet.style.background = "#882424";
            btnBet.textContent = "Â Â Â Â Â TAKE";

            multiplyLbl.textContent = "";

            multiplyStr.style.left = "10%";
            multiplyStr.style.fontSize = "44px";
            multiplyStr.style.color ="#C27500";
            break;
          case "ROUND_ENDS":
            multiplyStr.style.position = "absolute";
            multiplyStr.textContent =  'x' 
                                    +  parseFloat(jsonMessage.totalMult).toFixed(3) 
                                    + " - Crashed!";
            btnBet.style.background = "#292C33";
            btnBet.disabled = true;

            multiplyStr.style.fontSize = "32px";
            multiplyStr.style.left = "0%";
            break;
          case "ROUND_ENDED":
            multiplyStr.textContent = "";
            break;

           case "WON":
            btnBet.style.opacity = "0.4";
            btnBet.disabled = true;
            multiplyStr.style.left = "-30%";
            multiplyLbl.style.color = "#00C208";
            multiplyLbl.textContent = "YOU ARE WON: " 
                                    + (Math.trunc(jsonMessage.bet) == jsonMessage.bet ? Math.trunc(jsonMessage.bet) : parseFloat(jsonMessage.bet).toFixed(3))   
                                    + " x " 
                                    + parseFloat(jsonMessage.mult).toFixed(3);
            break;

          case "LOST":
            multiplyStr.style.position = "absolute";
            multiplyStr.style.left = "-180px";
            multiplyStr.style.top = "50px";
            multiplyLbl.style.color = "#C20000";
            multiplyLbl.textContent = "CRASHED ! YOU ARE LOST: " 
                                    + (Math.trunc(jsonMessage.bet) == jsonMessage.bet ? Math.trunc(jsonMessage.bet) : parseFloat(jsonMessage.bet).toFixed(3)) 
                                    + "$";
            break;
            
          default:
            console.log('ÐÐµÐ¸Ð·Ð²ÐµÑÑ‚Ð½Ð°Ñ ÐºÐ¾Ð¼Ð°Ð½Ð´Ð°');
            break;
        }
      } catch (error) {
        console.log('ÐžÑˆÐ¸Ð±ÐºÐ°', error);
      }

};

function wsSendEcho(value) {
  myWs.send(JSON.stringify({action: 'ECHO', data: value.toString()}));
}

function wsSendPing() {
  myWs.send(JSON.stringify({action: 'PING'}));
}

function wsSendBtnBetClicked(bet) {
    myWs.send(JSON.stringify({action: 'BTN_BET_CLICKED', bet: bet}));
  }


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

async function printNumsWithDelay(textContainer, preText, afterText,startNumber, finalNumber, delta, isSigned, delay) 
{
    for(let i =  startNumber;  (isSigned ? finalNumber : i ) > ( isSigned ? i : finalNumber); i -=  (isSigned ? -delta : delta) ) 
        await sleep(delay).then(() => {textContainer.textContent =   preText +
                                   ( cntMult = (Math.trunc(i) == i ? Math.trunc(i) : i.toFixed(3))) + 
                                    afterText;});
}

function onBtnBetClick(){
    wsSendBtnBetClicked(formBet.value); 
}
 
const balanceLbl = document.getElementById("balanceLabel"); 
const balanceStr = document.getElementById("balanceCounter");
const multiplyLbl = document.getElementById("multLbl");
const multiplyStr = document.getElementById("multCounter");
const btnBet = document.getElementById("btnBet");
const formBet = document.getElementById("inputBet");
const chartContainer = document.getElementById('chartContainer');
btnBet.onclick = onBtnBetClick;

