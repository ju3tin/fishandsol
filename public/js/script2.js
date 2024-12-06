var ctx = document.getElementById('tempChart').getContext('2d');
ctx.canvas.width = 820;
ctx.canvas.height = 240;


const myWs = new WebSocket('wss://crashserver.onrender.com');
myWs.onopen = function () {
  console.log('dude');
};  
  

function getCurrentTimestamp() {
  return Date.now(); // Returns the current timestamp in milliseconds
}
function resetDataPoints(chart,dataPoints,chartContainer) {
  dataPoints = []; // Reset the dataPoints array to an empty array

  console.log("Data points have been reset."+dataPoints);
 
 
 //chart.render(); // Optionally, re-render the chart to reflect the changes
}
myWs.onmessage = function (message,chartContainer, testdata, testdata2) {
    try {

   
      
      var chart = new Chart(ctx, {
        type: 'line',
        data: {
         //   labels: [],
            legend: {
               display: false
            },
            datasets: [{
                fill: false,
                data: getColdTempData(),
              // label: 'Hot Temperature',
              //  backgroundColor: "#FF2D00",
                borderColor: "#FF2D00",
                type: 'line',
                pointRadius: 1,
                lineTension: 2,
                borderWidth: 2
            }]
        },
        options: {
          legend: {
            display: false
          },
          tooltips: {
            callbacks: {
              label: function(tooltipItem) {
              console.log(tooltipItem)
                return tooltipItem.yLabel;
              }
            }
          },
          animation: false,
          responsive: true,
          scales: {
            xAxes: [{
                scaleLabel: {
                  display: false,
                  labelString: 'Time ( UTC )'
                },
                type: 'linear',
                time: {
                  tooltipFormat: "hh:mm:ss",
                  displayFormats: {
                    hour: 'MMM D, hh:mm:ss'
                  }
                },
                ticks: {
                          maxRotation: 90,
                          minRotation: 90
                }
            }],
            yAxes: [{
              scaleLabel: {
                display: false,
                labelString: 'Temperature ( Celcius )'
              },
            }]
          }
        }
      });
      
      function getColdTempData(red) {
        return red
      }
          


        const jsonMessage = JSON.parse(message.data);
        switch (jsonMessage.action) {
          case "SECOND_BEFORE_START":
            multiplyStr.textContent = jsonMessage.data;
            break;
          case "CNT_MULTIPLY":
            var red =  [
              { x: 344423, y: 456456546456},
              { x: 23, y: 34},
              { x: 56, y: Math.random() * 0.5 + 23.5 },
              { x: 200, y: Math.random() * 0.5 + 23.5 },
              { x: 2450, y: Math.random() * 0.5 + 23.5 },
              { x: new Date(2019, 0, 1, 14, 1, 23, 0), y: Math.random() * 0.5 + 23.5 },
              { x: new Date(2019, 0, 1, 14, 1, 24, 0), y: Math.random() * 0.5 + 23.5 },
              { x: new Date(2019, 0, 1, 14, 1, 25, 0), y: Math.random() * 0.5 + 23.5 },
            ];
            getColdTempData(red);
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
            formBet.style.opacity = "1.0";
            formBet.disabled = false;
         //   chartContainer.style.opacity = "0.0";

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
          //  chartContainer.style.opacity = "1.0";
            formBet.disabled = true;
            
            if(jsonMessage.isBetted){
                btnBet.style.opacity = "1.0";
                btnBet.disabled = false;
            }else{
                btnBet.style.opacity = "0.4";
                btnBet.disabled = true; 
            }

            btnBet.style.background = "#882424";
            btnBet.textContent = "     TAKE";

            multiplyLbl.textContent = "";

            multiplyStr.style.left = "10%";
            multiplyStr.style.fontSize = "44px";
            multiplyStr.style.color ="#C27500";
            break;
          case "ROUND_ENDS":
            var testdata = [[23,23],[34,34]];
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
            console.log(JSON.stringify(dataPoints));
          resetDataPoints()
       
//chart.style.opacity = "0";   // Clear existing data
            //  chartContainer.data.datasets[0].data = newData; // Assuming newData is an array of new values
            //  chartContainer.update(); // Refresh the chart
          
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
            console.log('Неизвестная команда');
            break;
        }
      } catch (error) {
        console.log('Ошибка', error);
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


