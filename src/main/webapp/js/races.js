/**
 * @fileoverview
 * Drivers management
 *
 * @author edumarcu
 */

/**
* Global variables
*/
var drivers;

/**
* Initialize the API.
*/
function afterInit() {
    console.log("OK!");

    // attach handlers
    document.getElementById("circuit").addEventListener("change", handleSelectCircuit);
    document.getElementById("save-race").addEventListener("click", handleSaveRace);

    // get the drivers from DB and show the first row of the race drivers table
    getDrivers(addRaceDriverRow);

}

function getDrivers(functionAfter) {
    gapi.client.driver.driver.listDrivers().execute(
        function(resp) {
            //console.log(resp);
            if (!resp.code) {
                if (resp.items) {
                    //console.log(resp.items);
                    drivers = resp.items;
                    if (functionAfter) {
                        functionAfter(resp.items);
                    }
                }
            } else {
                window.alert(resp.message);
            }
        }
    );
}

function handleSelectCircuit(e) {
    //console.log(document.getElementById("circuit").selectedIndex);
    //console.log(e.target.value);
    //console.log(e.target.options[e.target.selectedIndex].innerHTML);

}

function addRaceDriverRow() {
    // create the row
    var driverRowElement = document.createElement("tr");

    // select the driver for the race
    var driverDataElement = document.createElement("td");
    driverRowElement.appendChild(driverDataElement);

    var driverSelectElement = document.createElement("select");
    driverSelectElement.id = "race-driver";
    driverSelectElement.classList.add("form-control");
    driverSelectElement.addEventListener("change", handleSelectRaceDriver);
    driverSelectElement.drivers = drivers;
    driverDataElement.appendChild(driverSelectElement);

    var driverOptionElement;
    for (var i = 0, len = drivers.length; i < len; i++) {
        driverOptionElement = document.createElement("option");
        driverOptionElement.value = drivers[i].id;
        var initials = drivers[i].name[0].toUpperCase();
        surnameParts = drivers[i].surname.split(' ');
        for (var j = 0, l = surnameParts.length; j < l; j++) {
            initials += surnameParts[j][0];
        }
        driverOptionElement.text = initials;

        driverSelectElement.appendChild(driverOptionElement);
        console.log(drivers[i]);
    }

    // add to the table
    document.querySelector("#race-drivers tbody").appendChild(driverRowElement);
}

function handleSelectRaceDriver(e) {
    console.log(e.target.options[e.target.selectedIndex].value);
    //console.log(e.target.parentElement.parentElement);
    //console.log(e.target.parentElement.parentElement.nextSibling);


    // if is the last, add a new row
    var raceDriverRowElement = e.target.parentElement.parentElement;
    if (raceDriverRowElement.nextSibling == null) {
        addRaceDriverRow();
    }
}

function handleSaveRace(e) {
    console.log(document.getElementById("gp").value);
    console.log(document.getElementById("circuit").value);
    console.log(document.getElementById("date").value);
    //console.log(e.target.value);
    //console.log(e.target.options[e.target.selectedIndex].innerHTML);

}

function handleAddDriversToRace(e) {
    //console.log(e.target.value);
    gapi.client.driver.driver.listDrivers().execute(
        function(resp) {
            //console.log(resp);
            if (!resp.code) {
                if (resp.items) {
                    //console.log(resp.items);
                    createModalDriversToRace(resp.items);
                    // show modal
                    $("#modal-add-drivers-race").modal();
                }
            } else {
                window.alert(resp.message);
            }
        }
    );
}

function createModalDriversToRace(drivers) {
    // create modal
    var modalElement = document.createElement("div");
    modalElement.id = "modal-add-drivers-race";
    modalElement.classList.add("modal");
    modalElement.classList.add("fade");
    modalElement.role = "dialog";
    document.querySelector(".container").appendChild(modalElement);

    var modalDialogElement = document.createElement("div");
    modalDialogElement.classList.add("modal-dialog");
    modalElement.appendChild(modalDialogElement);

    var modalContentElement = document.createElement("div");
    modalContentElement.classList.add("modal-content");
    modalDialogElement.appendChild(modalContentElement);

    // modal header
    var modalHeaderElement = document.createElement("div");
    modalHeaderElement.classList.add("modal-header");
    modalContentElement.appendChild(modalHeaderElement);

    var modalTitleElement = document.createElement("h4");
    modalTitleElement.innerHTML = "Añadir los pilotos";
    modalTitleElement.classList.add("modal-title");
    modalHeaderElement.appendChild(modalTitleElement);

    // modal body
    var modalBodyElement = document.createElement("div");
    modalBodyElement.classList.add("modal-body");
    modalContentElement.appendChild(modalBodyElement);

    var modalDriverElement = document.createElement("div");
    modalDriverElement.classList.add("form-group");
    modalBodyElement.appendChild(modalDriverElement);

    var modalDriverLabelElement = document.createElement("label");
    modalDriverLabelElement.innerHTML = "Piloto";
    //modalDriverLabelElement.for = "modal-driver";
    modalDriverElement.appendChild(modalDriverLabelElement);

    var modalDriverSelectElement = document.createElement("select");
    modalDriverSelectElement.id="modal-driver";
    //modalDriverSelectElement.classList.add("form-control");
    modalDriverElement.appendChild(modalDriverSelectElement);

    //populate select
    var modalDriverOptionElement;
    for (var i = 0, len = drivers.length; i < len; i++) {
        modalDriverOptionElement = document.createElement("option");
        modalDriverOptionElement.value = drivers[i].id;
        modalDriverOptionElement.text = drivers[i].surname + ", " + drivers[i].name;
        modalDriverSelectElement.appendChild(modalDriverOptionElement);
        //console.log(drivers[i]);
    }

    // modal footer
    var modalFooterElement = document.createElement("div");
    modalFooterElement.classList.add("modal-footer");
    modalContentElement.appendChild(modalFooterElement);

    var modalCancelElement = document.createElement("button");
    modalCancelElement.innerHTML = "Cancel";
    modalCancelElement.classList.add("btn");
    modalCancelElement.classList.add("btn-default");
    modalCancelElement.dataset.dismiss = "modal";
    modalFooterElement.appendChild(modalCancelElement);

    var modalOkElement = document.createElement("button");
    modalOkElement.innerHTML = "OK";
    modalOkElement.classList.add("btn");
    modalOkElement.classList.add("btn-default");
    modalOkElement.dataset.dismiss = "modal";
    modalOkElement.onclick = handleModalDriverToRaceButtonOk;
    modalFooterElement.appendChild(modalOkElement);
}

function handleModalDriverToRaceButtonOk(e) {
    var driverId = document.getElementById("modal-driver").value;
    gapi.client.driver.getDriverById({"id": driverId}).execute(
        function(resp) {
        //console.log(resp);
            if (!resp.code) {
                 //console.log(resp);
                 // add row
                 var rowElement;
                 rowElement = document.createElement("tr");
                 document.querySelector("#race-drivers > tbody").appendChild(rowElement);

                 // Name
                 var dataElement;
                 dataElement = document.createElement("td");
                 dataElement.innerHTML = resp.surname + ", " + resp.name;
                 rowElement.appendChild(dataElement);

            } else {
                window.alert(resp.message);
            }
        }
    );
}