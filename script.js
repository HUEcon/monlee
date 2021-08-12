console.log("Website loaded")
let isLoading = false;

var spreadsheetUrl = 'https://docs.google.com/spreadsheets/d/1_s9Na_MSCP0uxol-skw4BBsQQ0h-VOBCl852m8ribTw/export?format=csv';


function callArray(participantID) {

     var r = new XMLHttpRequest();
    r.open("GET", spreadsheetUrl, true);
    document.getElementById("resultsContainer").innerHTML = "";
    r.onreadystatechange = function () {
        if (r.readyState != 4) {
            return;
        };

        if (r.status != 200) {
            displayError();
            setButtonActive("submitID");
        }

        var result = r.responseText;
        result = result.split("\n").slice(1)
        var resultDict = {}
        result.forEach(x => {
            var r = x.split(",")
            resultDict[r[0]] = {
                "other_transfer": r[1],
                "final_payoff": r[2],
                "status": r[3],
            }
        })
        var participantData = resultDict[participantID];
        if (participantData.status == "todo\r") {
            displayNotYet();
            setButtonActive("submitID");
            return;
        }

        if (participantData.status !== "todo") {
            displayOtherTransfer(resultDict[participantID]);
            displayFinalPayoff(resultDict[participantID]);
            setButtonActive("submitID");
            return;
        }

    };

    r.send();
}
/////////////////////////////////////////////////////////////////////////////////////////

document.getElementById("submitID").addEventListener("click", function (event) {
    event.preventDefault()
    setButtonInactive("submitID")

    let participantID = document.getElementById("participantID").value.trim();
    console.log(participantID);

    if (participantID.length !== 8) {
        displayError();
        setButtonActive("submitID")

        return;
    }

    callArray(participantID);
});

//function callLambda(participantID) {
//    var r = new XMLHttpRequest();
//    r.open("GET", "https://i4yrsyy66h.execute-api.eu-west-1.amazonaws.com/dev/" + participantID, true);
//    document.getElementById("resultsContainer").innerHTML = "";
//    r.onreadystatechange = function () {
//        if (r.readyState != 4) {
//            return;
//        };
//
//        if (r.status != 200) {
//            displayError();
//            setButtonActive("submitID");
//        }
//
//        result = JSON.parse(r.responseText);
//
//        if (result.status == "todo") {
//            displayNotYet();
//            setButtonActive("submitID");
//            return;
//        }
//
//        console.log(result);
//        displayDonation(result);
//        setButtonActive("submitID")
//
//        if (result.status !== "ready") {
//            displayOtherTransfer(result);
//            displayFinalPayoff(result);
//        }
//    };
//    r.send();
//}



function addRow(contentString) {
    let doc = document.getElementById("resultsContainer");
    let row = document.createElement('div');
    row.classList.add("row");

    let column = document.createElement("div");
    column.classList.add("one-full");
    column.classList.add("column");

    column.innerHTML = contentString.trim();
    row.appendChild(column);
    doc.appendChild(row);
}

function displayOtherTransfer(result) {
    let resultContent = `    
        <b>The group you were matched with tranferred: </b> ${result.other_transfer}% <br>
    `
    addRow(resultContent);
}

function displayFinalPayoff(result) {
    let resultContent = `      
        <b>Your final payoff:</b> ${result.final_payoff} AUD<br>
        Please allow a couple of working days for the transfer to be made via PayID <br>
    `
    addRow(resultContent);
}

function displayError(result) {
    let resultContent = `      
        There was an error retrieving your results. Please make sure you have entered the correct code.<br>
    `
    addRow(resultContent);  
}

function displayNotYet(result) {
    let resultContent = `      
        Your results are not yet available, please try again in a couple of days.<br>
    `
    addRow(resultContent);  
}

function setButtonActive(buttonID) {
    document.getElementById(buttonID).className = "button-primary";
    document.getElementById(buttonID).value = "Get results";
    document.getElementById(buttonID).disabled = false;
    isLoading = false;
    return;
}

function setButtonInactive(buttonID) {
    document.getElementById(buttonID).className = "button";
    document.getElementById(buttonID).value = "Loading...";
    document.getElementById(buttonID).disabled = true;
    isLoading = true; 
    return;
}
