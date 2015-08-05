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
									+ "<input type=\"button\" value=\"Select\" onclick=\""
									+ this.name + ".getChild(" + child.childId+ ")\" /></td></tr>");

		},
		getChild : function(childId) {
			var that = this;
			backpack.childDataAccess.getChildAsync(childId).done(
				function(data) {
					//var index= data.length - 1;
					that.setChildDetails(data.punchCardId, data.firstName,
						data.lastName, data.address, data.city, data.state, data.zip, data.backpack, data.healthCheck, data.haircut);
				});
		},
		setChildDetails : function(punchCardId, firstName, lastName, address, city, state, zip, backpack, healthCheck, haircut) {
			$("#childId").val(punchCardId);
			$("#firstName").val(firstName);
			$("#lastName").val(lastName);
			$("#address").val(address);
			$("#city").val(city);
			$("#state").val(state);
			$("#zip").val(zip);
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
			}		}
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
	$("#firstName").val("");
	$("#lastName").val("");
	$('#backpackCheckbox').prop('checked', false);
	$('#healthCheckCheckbox').prop('checked', false);
	$('#haircutCheckbox').prop('checked', false);
}

function lookupChild() {
	var childId = $("#childId").val();
	clearDetails();
	childList.getChild(childId);
}

function saveChild() {
	var child = {};
	child.punchCardId = $("#childId").val();
	child.firstName = $("#firstName").val();
	child.lastName = $("#lastName").val();
	child.backpack = $("#backpackCheckbox").prop("checked") ? 1 : 0;
	child.healthCheck = $("#healthCheckCheckbox").prop("checked") ? 1 : 0;
	child.haircut = $("#haircutCheckbox").prop("checked") ? 1 : 0;
	clearDetails();
	backpack.childDataAccess
			.getChildAsync(child.punchCardId)
			.done(
					function(existingChild) {
						if (typeof (existingChild) !== "undefined"
								&& existingChild.punchCardId > 0) {
							backpack.childDataAccess
									.updateChildAsync(child)
									.done(
											function(updatedChild) {
												if (typeof (updatedChild) !== "undefined"
														&& updatedChild.punchCardId > 0) {
													childList
															.getChild(updatedChild.punchCardId);
													childList
															.refreshChildListTable(childList.childListTableId);
												}
											});
						}
					})
			.fail(
					function() {
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
					});
}