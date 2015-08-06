/**
 * 
 */
var childDataAccess = (function(CHILDDATAACCESS) {
	CHILDDATAACCESS.lastRequest = "";
	CHILDDATAACCESS.insertChildAsync = function(child) {
		var that = this;
		var deferredList = new jQuery.Deferred();
			$.ajax({
				type: "POST",
				url: backpack.baseUrl + '/backpack/api/child',
				data: JSON.stringify(child),
				contentType: 'application/json',
				dataType: 'json',
				headers: { "x-content-type-options": "nosniff" },
				success: function(fetchResult) {
					if (typeof(fetchResult) !== "undefined") {
						that.lastRequest = backpack.baseUrl + '/backpack/api/child';
						deferredList.resolve(fetchResult);
					} else {
						var childNotFound = {};
						childNotFound.childId = -1;
						deferredList.resolve(childNotFound);
					}
				},
				error: function() {
					deferredList.reject([]);
				},
				dataType: "json"
			});			
		return deferredList.promise();
	};
	CHILDDATAACCESS.insertOnlyAsync = function(child, whichField) {
		var that = this;
		var deferredList = new jQuery.Deferred();
		$.ajax({
			type: "POST",
			url: backpack.baseUrl + '/backpack/api/child?insertOnly=' + whichField,
			data: JSON.stringify(child),
			contentType: 'application/json',
			dataType: 'json',
			headers: { "x-content-type-options": "nosniff" },
			success: function(fetchResult) {
				if (typeof(fetchResult) !== "undefined") {
					that.lastRequest = backpack.baseUrl + '/backpack/api/child?insertOnly=' + whichField;
					deferredList.resolve(fetchResult);
				} else {
					var childNotFound = {};
					childNotFound.childId = -1;
					deferredList.resolve(childNotFound);
				}
			},
			error: function() {
				deferredList.reject([]);
			},
			dataType: "json"
		});
		return deferredList.promise();
	};
	CHILDDATAACCESS.updateChildAsync = function(child) {
		var that = this;
		var deferredList = new jQuery.Deferred();
			$.ajax({
				type: "PUT",
				url: backpack.baseUrl + '/backpack/api/child/' + child.childId,
				data: JSON.stringify(child),
				contentType: 'application/json',
				dataType: 'json',
				headers: { "x-content-type-options": "nosniff" },
				success: function(fetchResult) {
					if (typeof(fetchResult) !== "undefined") {
						that.lastRequest = backpack.baseUrl + '/backpack/api/child/' + child.childId;
						deferredList.resolve(fetchResult);
					} else {
						var childNotFound = {};
						childNotFound.childId = -1;
						deferredList.resolve(childNotFound);
					}
				},
				error: function() {
					deferredList.reject([]);
				},
				dataType: "json"
			});			
		return deferredList.promise();
	};
	CHILDDATAACCESS.updateOnlyAsync = function(child, whichField) {
		var that = this;
		var deferredList = new jQuery.Deferred();
		$.ajax({
			type: "PUT",
			url: backpack.baseUrl + '/backpack/api/child/' + child.childId + '?updateOnly=' + whichField,
			data: JSON.stringify(child),
			contentType: 'application/json',
			dataType: 'json',
			headers: { "x-content-type-options": "nosniff" },
			success: function(fetchResult) {
				if (typeof(fetchResult) !== "undefined") {
					that.lastRequest = backpack.baseUrl + '/backpack/api/child/' + child.childId + '?updateOnly=' + whichField;
					deferredList.resolve(fetchResult);
				} else {
					var childNotFound = {};
					childNotFound.childId = -1;
					deferredList.resolve(childNotFound);
				}
			},
			error: function() {
				deferredList.reject([]);
			},
			dataType: "json"
		});
		return deferredList.promise();
	};
	CHILDDATAACCESS.getChildAsync = function(punchCardId) {
		var that = this;
		var deferredList = new jQuery.Deferred();
			$.ajax({
				type: "GET",
				url: backpack.baseUrl + '/backpack/api/child/' + punchCardId,
				success: function(fetchResult) {
					that.lastRequest = backpack.baseUrl + '/backpack/api/child/' + punchCardId;
					deferredList.resolve(fetchResult);
				},
				error: function() {
					deferredList.reject([]);
				},
				dataType: "json"
			});		
		return deferredList.promise();
	};
	CHILDDATAACCESS.getChildListAsync = function() {
		var that = this;
		var deferredList = new jQuery.Deferred();
			$.ajax({
				type: "GET",
				url: backpack.baseUrl + '/backpack/api/children',
				success: function(fetchResult) {
					that.lastRequest = backpack.baseUrl + '/backpack/api/children';
					deferredList.resolve(fetchResult);
				},
				error: function() {
					deferredList.reject([]);
				},
				dataType: "json"
			});		
		return deferredList.promise();
	};
	CHILDDATAACCESS.getChildrenByNameAsync = function(childId, firstName, lastName) {
		var that = this;
		var queryString = 'firstName=first name not found';
		if (firstName != null && firstName.trim() != '') {
			queryString = 'firstName=' + firstName;
			if (lastName != null && lastName.trim() != '') {
				queryString += '&lastName=' + lastName;
			}
		} else if (lastName != null && lastName.trim() != '') {
			queryString = 'lastName=' + lastName;
		}
		var deferredList = new jQuery.Deferred();
		$.ajax({
			type: "GET",
			url: backpack.baseUrl + '/backpack/api/children?' + queryString,
			success: function(fetchResult) {
				that.lastRequest = backpack.baseUrl + '/backpack/api/children?'+ queryString;
				deferredList.resolve(fetchResult);
			},
			error: function() {
				deferredList.reject([]);
			},
			dataType: "json"
		});
		return deferredList.promise();
	};
	return CHILDDATAACCESS;
}(childDataAccess || {}));