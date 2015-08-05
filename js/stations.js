/**
 *
 */
var childList;
$(document).ready(
    function() {
        childList = backpack.createChildList("childList", "childListTable",
            "childDetailDiv");
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
        initialize : function() {
            this.addHeader(this.childListTableId);
            this.refreshChildListTable(this.childListTableId);
        },
        addHeader : function(tableId) {
            $("#" + tableId)
                .html(
                "<thead><tr><th width='50px;'>ID</th><th width='150px;'>First Name</th><th width='200px'>Last Name</th></tr></thead><tbody></tbody>");
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
            $("#" + tableId + " tbody")
                .append(
                "<tr><td >"
                + child.punchCardId
                + "</td><td>"
                + child.firstName
                + "</td><td>"
                + child.lastName
                + "</td><td><input type=\"button\" value=\"Select\" onclick=\""
                + this.name + ".getChild(" + child.punchCardId
                + ")\" /></td></tr>");

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
                    that.setChildDetails(data.childId, data.punchCardId, data.firstName);
                    switch (whichStation) {
                        case 'haircut':
                            if (data.haircut == 1 && data.healthCheck == 1) {
                                $('#statusButton').attr('style', 'background-color:green');
                                $('#statusButton').val('All good to go!');
                            }
                            else { if(data.healthCheck != 1)
                                $('#statusButton').attr('style', 'background-color:yellow');
                                $('#statusButton').val('Not all completed');
                                $('#updateButton').prop('disabled', true);
                            }
                            break;
                        case 'healthCheck':
                         //   $('#updateButton').prop('disabled', false);
                            if (data.healthCheck == 1) {
                                $('#statusButton').attr('style', 'background-color:green');
                                $('#statusButton').val('All good to go!');
                            }
                            else {
                                $('#statusButton').attr('style', 'background-color:yellow');
                                $('#statusButton').val('Not all completed');
                            }
                            break;
                        case 'backpack':
                            if ( data.backpack == 1) {
                                $('#statusButton').attr('style', 'background-color:green');
                                $('#statusButton').val('All good to go!');
                            }
                            else {
                                $('#statusButton').attr('style', 'background-color:yellow');
                                $('#statusButton').val('Not all completed');
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
        setChildDetails : function(childId, punchCardId, firstName) {
            $("#childId").val(childId);
            $("#punchCardId").val(punchCardId);
            $("#firstName").val(firstName);
        }
    }
    BACKPACK.createChildList = function(name, childListTableId,
                                        childDetailDivId) {
        var newChildList = Object.create(BACKPACK.childList);
        newChildList.name = name;
        newChildList.childListTableId = childListTableId;
        newChildList.childDetailDivId = childDetailDivId;
        return newChildList;
    }
    return BACKPACK;
}(backpack || {}));

backpack.baseUrl = $(location).attr('protocol') + '//'
    + $(location).attr('host');
backpack.childDataAccess = childDataAccess;

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
    $("#punchCardId").val("");
    $("#firstName").val("");
    $("#statusButton").val('status unknown')
                      .attr("style", 'background-color:yellow');
}

function lookupChild(whichStation) {
    var punchCardId = $("#punchCardId").val();
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
    if ($("#punchCardId").val() != '') {
        theIdToUse = $("#punchCardId").val();
    } else {
        theIdToUse = $("#childId").val();
    }
    var child = {};
    child.punchCardId = theIdToUse;
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
                backpack.childDataAccess
                    .updateOnlyAsync(child, whichStation)
                    .done(
                    function(updatedChild) {
                        if (typeof (updatedChild) !== "undefined"
                            && updatedChild.childId > 0) {
                            childList
                                .getChild(updatedChild.punchCardId);
                        }
                    });
            } else {
                backpack.childDataAccess
                    .insertOnlyAsync(child, whichStation)
                    .done(
                    function(updatedChild) {
                        if (typeof (updatedChild) !== "undefined"
                            && updatedChild.childId > 0) {
                            childList
                                .getChild(updatedChild.punchCardId);
                        }
                    });
            }
        })
        .fail(
        function() {
            // Add a error message box to our pages
        });
}