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
	CHILDDATAACCESS.getChildAsync = function(childId) {
		var that = this;
		var deferredList = new jQuery.Deferred();
			$.ajax({
				type: "GET",
				url: backpack.baseUrl + '/backpack/api/child/' + childId,
				success: function(fetchResult) {
					that.lastRequest = backpack.baseUrl + '/backpack/api/child/' + childId;
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
	return CHILDDATAACCESS;
}(childDataAccess || {}));