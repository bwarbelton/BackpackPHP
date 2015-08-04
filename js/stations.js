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
                + child.childId
                + "</td><td>"
                + child.firstName
                + "</td><td>"
                + child.lastName
                + "</td><td><input type=\"button\" value=\"Select\" onclick=\""
                + this.name + ".getChild(" + child.childId
                + ")\" /></td></tr>");

        },
        getChild : function(childId, whichStation) {
            var that = this;
            backpack.childDataAccess.getChildAsync(childId).done(
                function(data) {
                    var index= data.length - 1;
                    that.setChildDetails(data.childId, data.firstName,
                        data.lastName, data.backpack, data.healthCheck, data.haircut);
                    switch (whichStation){
                        case 'haircut':
                        case 'healthCheck':
                            $('#updateButton').prop('disabled', false);
                            break;
                        case 'backpack':
                            if (data.healthCheck == 1 && data.haircut == 1) {
                                $('#updateButton').prop('disabled', false);
                            }
                            else {
                                $('#updateButton').prop('disabled', true);
                            }
                            break;
                    }

                    if (data.healthCheck == 1 && data.haircut == 1 && data.backpack == 1) {
                        $('#statusButton').attr('style', 'background-color:green')
                        $('#statusButton').val('All good to go!')
                    }
                    else {
                        $('#statusButton').attr('style', 'background-color:yellow')
                        $('#statusButton').val('Not all completed')
                    }
                });
        },
        setChildDetails : function(childId, firstName, lastName, backpack, healthCheck, haircut) {
            $("#childId").val(childId);
            $("#firstName").val(firstName);
            $("#lastName").val(lastName);
            if (backpack > 0) {
      //          $('#backpackCheckbox').prop('checked', true);
                $('#backpack').val('done');
            } else {
     //           $('#backpackCheckbox').prop('checked', false);
                $('#backpack').val('not completed');
            }
            if (healthCheck > 0) {
     //           $('#healthCheckCheckbox').prop('checked', true);
                $('#healthcheck').val('done');
            } else {
    //            $('#healthCheckCheckbox').prop('checked', false);
                $('#healthcheck').val('not completed');
            }
            if (haircut > 0) {
     //           $('#haircutCheckbox').prop('checked', true);
                $('#haircut').val('done');
            } else {
     //           $('#haircutCheckbox').prop('checked', false);
                $('#haircut').val('not completed');
            }		}
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
    $("#firstName").val("");
    $("#lastName").val("");
    $('#backpackCheckbox').prop('checked', false);
    $('#healthCheckCheckbox').prop('checked', false);
    $('#haircutCheckbox').prop('checked', false);
}

function lookupChild(whichStation) {
    var childId = $("#childId").val();
    clearDetails();
    childList.getChild(childId, whichStation);
}

//old code
//function saveChild() {
//    var child = {};
//    child.childId = $("#childId").val();
//    child.firstName = $("#firstName").val();
//    child.lastName = $("#lastName").val();
//    child.backpack = $("#backpackCheckbox").prop("checked") ? 1 : 0;
//    child.healthCheck = $("#healthCheckCheckbox").prop("checked") ? 1 : 0;
//    child.haircut = $("#haircutCheckbox").prop("checked") ? 1 : 0;
//    clearDetails();
//    backpack.childDataAccess
//        .getChildAsync(child.childId)
//        .done(
//        function(existingChild) {
//            if (typeof (existingChild) !== "undefined"
//                && existingChild.childId > 0) {
//                backpack.childDataAccess
//                    .updateChildAsync(child)
//                    .done(
//                    function(updatedChild) {
//                        if (typeof (updatedChild) !== "undefined"
//                            && updatedChild.childId > 0) {
//                            childList
//                                .getChild(updatedChild.childId);
//                            childList
//                                .refreshChildListTable(childList.childListTableId);
//                        }
//                    });
//            } else {
//                backpack.childDataAccess
//                    .insertAsync(child)
//                    .done(
//                    function(updatedChild) {
//                        if (typeof (updatedChild) !== "undefined"
//                            && updatedChild.childId > 0) {
//                            childList
//                                .getChild(updatedChild.childId);
//                            childList
//                                .refreshChildListTable(childList.childListTableId);
//                        }
//                    });
//            }
//        })
//        .fail(
//        function() {
//            backpack.childDataAccess
//                .insertChildAsync(child)
//                .done(
//                function(insertedChild) {
//                    if (typeof (insertedChild) !== "undefined"
//                        && insertedChild.childId > 0) {
//                        childList
//                            .getChild(insertedChild.childId);
//                        childList
//                            .refreshChildListTable(childList.childListTableId);
//                    }
//                });
//        });
//}

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
    var child = {};
    child.childId = $("#childId").val();
    child.haircut = 1;
    child.healthCheck = 1;
    child.backpack = 1;
    clearDetails();
    backpack.childDataAccess
        .getChildAsync(child.childId)
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
                                .getChild(updatedChild.childId);
                            childList
                                .refreshChildListTable(childList.childListTableId);
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
                                .getChild(updatedChild.childId);
                            childList
                                .refreshChildListTable(childList.childListTableId);
                        }
                    });
            }
        })
        .fail(
        function() {
            // Add a error message box to our pages
        });
}