/**
 * 
 */
var childList;
$(document).ready(
		function() {
			childList = backpack.createChildList("childList", "childListTable",
					"childDetailDiv");
            //$("#registrationDiv").attr("style", "display:none");
            //$("#addressDiv").attr("style", "display:none");
            //$("#backpackDiv").attr("style", "display:none");
            //$("#haircutDiv").attr("style", "display:none");
            //$("#healthcheckDiv").attr("style", "display:none");
			childList.initialize();
			registration();
			//// bindButtonEvents();
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
							"<thead><tr><th width='50px;'>ID</th><th width='75px;'>Punch Card ID</th><th width='150px;'>First Name</th>" +
							"<th width='200px'>Last Name</th><th width='100px'>Health Check</th><th width='100px'>Haircut</th>" +
							"<th width='100px'>Backpack</th></tr></thead><tbody></tbody>");
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
			var cHealthcheck = (child.healthCheck == 1) ? 'Done' : 'Not Completed';
			var cHaircut = (child.haircut == 1) ? 'Done' : 'Not Completed';
			var cBackpack = (child.backpack == 1) ? 'Done' : 'Not Completed';

			$("#" + tableId + " tbody")
					.append(
							"<tr><td >"
									+ child.childId
									+ "</td><td>"
									+ child.punchCardId
									+ "</td><td>"
									+ child.firstName
									+ "</td><td>"
									+ child.lastName
									+ "</td><td>"
									+ cHealthcheck
									+ "</td><td>"
									+ cHaircut
									+ "</td><td>"
									+ cBackpack
									+"</td><td>"
									+ "</tr>");

		},
		getChild : function(childId) {
			var that = this;
			backpack.childDataAccess.getChildAsync(childId).done(
				function(data) {
					//var index= data.length - 1;
					that.setChildDetails(data.childId, data.punchCardId, data.firstName,
						data.lastName, data.address, data.city, data.state, data.zip, data.race, data.backpack, data.healthCheck, data.haircut);
				});
		},
		setChildDetails : function(childId, punchCardId, firstName, lastName, address, city, state, zip, race, backpack, healthCheck, haircut) {
			$("#childId").val(childId);
			$("#punchCardId").val(punchCardId);
			$("#firstName").val(firstName);
			$("#lastName").val(lastName);
			$("#address").val(address);
			$("#city").val(city);
			$("#state").val(state);
			$("#zip").val(zip);
			$("#race").val(race);
			if (backpack > 0) {
				$('#backpackCheckbox').prop('checked', true);
			} else {
				$('#backpackCheckbox').prop('checked', false);
			}
			if (healthCheck > 0) {
				$('#healthCheckCheckbox').prop('checked', true);
			} else {
				$('#healthCheckCheckbox').prop('checked', false);
			}
			if (haircut > 0) {
				$('#haircutCheckbox').prop('checked', true);
			} else {
				$('#haircutCheckbox').prop('checked', false);
			}
		},
		clearTable : function() {
			$("#" + this.childListTableId + " tbody tr").remove();
		}
	};
	BACKPACK.createChildList = function(name, childListTableId,
			childDetailDivId) {
		var newChildList = Object.create(BACKPACK.childList);
		newChildList.name = name;
		newChildList.childListTableId = childListTableId;
		newChildList.childDetailDivId = childDetailDivId;
		return newChildList;
	};
	return BACKPACK;
}(backpack || {}));

backpack.baseUrl = $(location).attr('protocol') + '//'
		+ $(location).attr('host');
backpack.childDataAccess = childDataAccess;

function clearChildListTable() {
	childList.clearTable();
}

function listAll()
{
	clearChildListTable();
	childList.refreshChildListTable(childList.childListTableId); //fill out the div on html
}

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
	$("#childDetailDiv").attr("style", "display:block");
	$("#addressDiv").attr("style", "display:block");
	$("#backpackDiv").attr("style", "display:none");
	$("#haircutDiv").attr("style", "display:none");
	$("#healthcheckDiv").attr("style", "display:none");
	$("#childListDiv").attr("style", "display:none");
	clearDetails();
}

function checkBackpack() {
	$("#registrationDiv").attr("style", "display:none");
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
	$("#lastName").val("");
	$("#address").val("");
	$("#city").val("");
	$("#state").val("");
	$("#zip").val("");
	$("#race").val("");
	$('#backpackCheckbox').prop('checked', false);
	$('#healthCheckCheckbox').prop('checked', false);
	$('#haircutCheckbox').prop('checked', false);
}

function lookupChild() {
	var childId = $("#lookupId").val();
	clearDetails();
	clearChildListTable();
	childList.getChild(childId);
	$("#childListDiv").attr("style", "display:none");
}

function saveChild() {
	var child = getChildAsObject();
	clearMessages();
	backpack.childDataAccess
			.getChildAsync(child.punchCardId)
			.done(
					function(existingChild) {
						if (typeof (existingChild) !== "undefined"
								&& existingChild.punchCardId > 0) {
							showMessage1("This punch card id has already been entered.");
							showMessage2("Please update instead of save.");
							// doUpdate(child);
						} else {
							clearDetails();
							doInsert(child);
						}
					})
			.fail(
					function() {
						doInsert(child);
					});
}

function getChildAsObject() {
	var child = {};
	child.childId = $("#childId").val();
	child.punchCardId = $("#punchCardId").val();
	child.firstName = $("#firstName").val();
	child.lastName = $("#lastName").val();
	child.address = $("#address").val();
	child.city = $("#city").val();
	child.state = $("#state").val();
	child.zip = $("#zip").val();
	child.race = $("#race").val();
	child.backpack = $("#backpackCheckbox").prop("checked") ? 1 : 0;
	child.healthCheck = $("#healthCheckCheckbox").prop("checked") ? 1 : 0;
	child.haircut = $("#haircutCheckbox").prop("checked") ? 1 : 0;
	return child;
}

function updateChild() {
	var child = getChildAsObject();
	backpack.childDataAccess.getChildAsync(child.childId)
		.done(
		function(existingChild) {
			if (typeof (existingChild) !== "undefined") {
				clearDetails();
				doUpdate(child);
			} else {
				showMessage1("This record does not exist.");
				showMessage2("Please save instead of update.");
			}
		})
		.fail(
		function() {
			showMessage1("Unable to update");
			showMessage2("");
		});
}

function doInsert(child) {
	child.haircut = 0;
	child.healthCheck = 0;
	child.backpack = 0;
	backpack.childDataAccess
		.insertChildAsync(child)
		.done(
		function(insertedChild) {
			if (typeof (insertedChild) !== "undefined"
				&& insertedChild.punchCardId > 0) {
				childList
					.getChild(insertedChild.punchCardId);
				childList
					.refreshChildListTable(childList.childListTableId);
			}
		});
}

function doUpdate(child) {
	backpack.childDataAccess
		.updateChildAsync(child)
		.done(
		function(updatedChild) {
			if (typeof (updatedChild) !== "undefined") {
				childList
					.getChild(updatedChild.childId);
			}
		});
}

function showMessage1(message) {
	$("#message1").text(message);
}

function showMessage2(message) {
	$("#message2").text(message);
}

function clearMessages() {
	$("#message1").text('');
	$("#message2").text('');
}