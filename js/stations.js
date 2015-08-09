/**
 *
 */
var childList;
$(document).ready(
    function() {
        childList = backpack.createChildList("childList", "childListTable",
            "childDetailDiv", thisStation);
        $("#registrationDiv").attr("style", "display:none");
        $("#addressDiv").attr("style", "display:none");
        $("#backpackDiv").attr("style", "display:none");
        $("#haircutDiv").attr("style", "display:none");
        $("#healthcheckDiv").attr("style", "display:none");
        childList.initialize();
        // bindButtonEvents();
    });

/**
 * usage - var childList1 = backpack.createChildList("childList1");
 * childList1.initialize();
 */
var backpack = (function(BACKPACK) {
    BACKPACK.childList = {
        name : "",
        childListTableId : "",
        childDetailDivId : "",
        station : "",
        initialize : function() {
            this.addHeader(this.childListTableId);
            //this.refreshChildListTable(this.childListTableId);
        },
        addHeader : function(tableId) {
            $("#" + tableId)
                .html(
                "<thead style='border-style: solid;'>" +
                    "<tr>" +
                        "<th width='50px;' style='font-size: 14px;'>ID</th>" +
                        // because we are not using punch card id
                        // "<th width='75px;' style='font-size: 14px;'>Punch Card</th>" +
                        "<th width='120px;' style='font-size: 14px;'>First Name</th>" +
                        "<th width='200px' style='font-size: 14px;'>Last Name</th>" +
                    "</tr>" +
                "</thead>" +
                "<tbody></tbody>");
        },
        getChildrenByName : function(childId, firstName, lastName) {
            var that = this;
            var tableId = this.childListTableId;
            $("#" + tableId + " tbody tr").remove();
            backpack.childDataAccess.getChildrenByNameAsync(childId, firstName, lastName).done(function(list) {
                $.each(list, function(key, val) {
                    that.addChildRow(tableId, val);
                });
            });
            $('#childListDiv').attr("style", "display:block");
        },
        refreshChildListTable : function(tableId) {
            var that = this;
            $("#" + tableId + " tbody tr").remove();
            backpack.childDataAccess.getChildListAsync().done(function(list) {
                $.each(list, function(key, val) {
                    that.addChildRow(tableId, val);
                });
            });
            $('#childListDiv').attr("style", "display:block");
        },
        addChildRow : function(tableId, child) {
            var clickText = "onclick=\"" + this.name + ".getChild(" + child.childId + ", " + child.punchCardId
                + ", '" + this.station + "')\"";
            $("#" + tableId + " tbody")
                .append(
                "<tr><td style='font-size: 14px;'>"
                + child.childId
                    // because we are not using punch card id
                // + "</td><td style='font-size: 14px;'>"
                // + child.punchCardId
                + "</td><td style='font-size: 14px;'>"
                + child.firstName
                + "</td><td style='font-size: 14px;'>"
                + child.lastName
                + "</td><td><input type=\"button\" value=\"Select\" style=\"font-size: 14px;\" "
                + clickText
                + " /></td></tr>");

        },
        getChild : function(childId, punchCardId, whichStation) {
            var that = this;
            var theIdToUse = 0;
            if (punchCardId > 0) {
                theIdToUse = punchCardId;
            } else {
                if (childId > 0) {
                    theIdToUse = childId;
                } else {
                    return;
                }
            }
            backpack.childDataAccess.getChildAsync(theIdToUse).done(
                function(data) {
                    var index= data.length - 1;
                    that.setChildDetails(data.childId, data.punchCardId, data.firstName, data.lastName, data.address);
                    switch (whichStation) {
                        case 'haircut':
                            if (data.haircut == 1 && data.healthCheck == 1) {
                                $('#statusButton').attr('style', 'background-color:green');
                                $('#statusButton').val('All good to go!');
                                $('#healthcheck').val('DONE');
                                $('#updateButton').attr('style', 'display:none;')
                            }
                            else if(data.healthCheck != 1){
                                    $('#statusButton').attr('style', 'background-color:yellow');
                                    $('#statusButton').val('Not all completed');
                                    $('#updateButton').attr('style', 'display:block;')
                                    $('#updateButton').attr('style', 'font-size:16px;');
                                    $('#healthcheck').val('Not Done');
                            }
                                else {
                                    //healthcheck is done; display DONE on screen
                                    $('#healthcheck').val('DONE');
                                    $('#statusButton').attr('style', 'background-color:yellow');
                                    $('#statusButton').val('Not all completed');
                                    $('#updateButton').attr('style', 'display:block;')
                                    $('#updateButton').attr('style', 'font-size:16px;');
                                }
                            if (data.haircut == 1) {
                                $('#statusButton').attr('style', 'background-color:green');
                                $('#statusButton').val('All good to go!');
                                $('#healthcheck').val('DONE');
                                $('#updateButton').attr('style', 'display:none;')
                            }
                            break;
                        case 'healthCheck':
                         //   $('#updateButton').prop('disabled', false);
                            if (data.healthCheck == 1) {
                                $('#statusButton').attr('style', 'background-color:green');
                                $('#statusButton').val('All good to go!');
                                $('#updateButton').attr('style', 'display:none;')
                            }
                            else {
                                $('#statusButton').attr('style', 'background-color:yellow');
                                $('#statusButton').val('Not all completed');
                                $('#updateButton').attr('style', 'display:block;')
                                $('#updateButton').attr('style', 'font-size:16px;');
                            }
                            break;
                        case 'backpack':
                            if ( data.backpack == 1) {
                                $('#statusButton').attr('style', 'background-color:green');
                                $('#statusButton').val('All good to go!');
                                $('#updateButton').attr('style', 'display:none;')
                            }
                            else {
                                $('#statusButton').attr('style', 'background-color:yellow');
                                $('#statusButton').val('Not all completed;');
                                $('#updateButton').attr('style', 'display:block;')
                                $('#updateButton').attr('style', 'font-size:16px;');
                            }
                            // change in requirement. Allow update even if the other stations are not completed
                            //if (data.healthCheck == 1 && data.haircut == 1) {
                            //    $('#updateButton').prop('disabled', false);
                            //}
                            //else {
                            //    $('#updateButton').prop('disabled', true);
                            //}
                            break;
                    }
                });
        },
        setChildDetails : function(childId, punchCardId, firstName, lastName, address) {
            $("#childId").val(childId);
            // $("#punchCardId").val(punchCardId);
            // $("#firstName").val(firstName);
            $("#fullName").val(firstName + ' ' + lastName);
            $("#address").val(address.substring(0, 5) + '...');
        },
        clearTable : function() {
            $("#" + this.childListTableId + " tbody tr").remove();
        }
    };
    BACKPACK.createChildList = function(name, childListTableId,
                                        childDetailDivId, station) {
        var newChildList = Object.create(BACKPACK.childList);
        newChildList.name = name;
        newChildList.childListTableId = childListTableId;
        newChildList.childDetailDivId = childDetailDivId;
        if (typeof (station) !== "undefined") {
            newChildList.station = station;
        }
        return newChildList;
    };
    return BACKPACK;
}(backpack || {}));

backpack.baseUrl = $(location).attr('protocol') + '//'
    + $(location).attr('host');
backpack.childDataAccess = childDataAccess;

function lookupChildrenByName() {
    var childId = $("#lookupId").val();
    var firstName = $("#firstNameLookup").val();
    var lastName = $("#lastNameLookup").val();
    clearDetails();
    clearChildListTable();
    childList.getChildrenByName(childId, firstName, lastName);
    $("#childListDiv").attr("style", "display:block");
}


function registration() {
   // $("#registrationDiv").attr("style", "display:block");
    $("#childDetailDiv").attr("style", "display:block");
    $("#addressDiv").attr("style", "display:block");
    $("#backpackDiv").attr("style", "display:none");
    $("#haircutDiv").attr("style", "display:none");
    $("#healthcheckDiv").attr("style", "display:none");
    $("#childListDiv").attr("style", "display:none");
    clearDetails();
}

function checkBackpack() {
   // $("#registrationDiv").attr("style", "display:none");
    $("#addressDiv").attr("style", "display:none");
    $("#backpackDiv").attr("style", "display:block");
    $("#haircutDiv").attr("style", "display:none");
    $("#healthcheckDiv").attr("style", "display:none");
    $("#childListDiv").attr("style", "display:none");
    clearDetails();
}

function checkHaircut() {
    $("#registrationDiv").attr("style", "display:none");
    $("#addressDiv").attr("style", "display:none");
    $("#backpackDiv").attr("style", "display:none");
    $("#haircutDiv").attr("style", "display:block");
    $("#healthcheckDiv").attr("style", "display:none");
    $("#childListDiv").attr("style", "display:none");
    clearDetails();
}

function checkHealthcare() {
    $("#registrationDiv").attr("style", "display:none");
    $("#addressDiv").attr("style", "display:none");
    $("#backpackDiv").attr("style", "display:none");
    $("#haircutDiv").attr("style", "display:none");
    $("#healthcheckDiv").attr("style", "display:block");
    $("#childListDiv").attr("style", "display:none");
    clearDetails();
}

function listAll() {
    $("#childDetailDiv").attr("style", "display:none");
    $("#registrationDiv").attr("style", "display:none");
    $("#addressDiv").attr("style", "display:none");
    $("#backpackDiv").attr("style", "display:none");
    $("#haircutDiv").attr("style", "display:none");
    $("#healthcheckDiv").attr("style", "display:none");
    $("#childListDiv").attr("style", "display:block");
}

function clearDetails() {
    $("#childId").val("");
    // $("#punchCardId").val("");
    $("#firstName").val("");
    $("#statusButton").val('status unknown')
                      .attr("style", 'background-color:yellow; font-size:16px;');
}
function clearChildListTable() {
    childList.clearTable();
}

function lookupChild(whichStation) {
    // var punchCardId = $("#punchCardId").val();
    punchCardId = '0';
    var childId = $("#childId").val();
    clearDetails();
    childList.getChild(childId, punchCardId, whichStation);
}

function setHaircutCompleted() {
    setStationCompleted("haircut");
}
function setHealthCheckCompleted() {
    setStationCompleted("healthCheck");
}
function setBackpackCompleted() {
    setStationCompleted("backpack");
}

function setStationCompleted(whichStation) {
    var theIdToUse = 0;
    var punchCardIdEntered = 0;
    if ($("#punchCardId").val() != '' && $("#punchCardId").val() > 0) {
        theIdToUse = $("#punchCardId").val();
        punchCardIdEntered = $("#punchCardId").val();
    } else {
        theIdToUse = $("#childId").val();
    }
    var child = {};
    child.childId = theIdToUse;
    child.haircut = 1;
    child.healthCheck = 1;
    child.backpack = 1;
    clearDetails(whichStation);
    backpack.childDataAccess
        .getChildAsync(theIdToUse)
        .done(
        function(existingChild) {
            if (typeof (existingChild) !== "undefined"
                && existingChild.childId > 0) {
                child.childId = existingChild.childId;
                backpack.childDataAccess
                    .updateOnlyAsync(child, whichStation)
                    .done(
                    function(updatedChild) {
                        if (typeof (updatedChild) !== "undefined"
                            && updatedChild.childId > 0) {
                            childList
                                .getChild(updatedChild.childId, updatedChild.punchCardId, whichStation);
                        }
                    });
            } else {
                child.punchCardId = punchCardIdEntered;
                backpack.childDataAccess
                    .insertOnlyAsync(child, whichStation)
                    .done(
                    function(updatedChild) {
                        if (typeof (updatedChild) !== "undefined"
                            && updatedChild.childId > 0) {
                            childList
                                .getChild(updatedChild.childId, updatedChild.punchCardId, whichStation);
                        }
                    });
            }
        })
        .fail(
        function() {
            // Add a error message box to our pages
        });
}