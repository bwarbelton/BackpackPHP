/**
 * 
 */
var childDataAccess = (function(CHILDDATAACCESS) {
	CHILDDATAACCESS.insertChildAsync = function(child) {
		var deferredList = new jQuery.Deferred();
			$.ajax({
				type: "POST",
				url: backpack.baseUrl + '/backpack/api/child/',
				data: JSON.stringify(child),
				contentType: 'application/json',
				dataType: 'json',
				headers: { "x-content-type-options": "nosniff" },
				success: function(fetchResult) {
					if (typeof(fetchResult) !== "undefined") {
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
		var deferredList = new jQuery.Deferred();
		$.ajax({
			type: "POST",
			url: backpack.baseUrl + '/backpack/api/child/' + child.childId + '?insertOnly=' + whichField,
			data: JSON.stringify(child),
			contentType: 'application/json',
			dataType: 'json',
			headers: { "x-content-type-options": "nosniff" },
			success: function(fetchResult) {
				if (typeof(fetchResult) !== "undefined") {
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
		var deferredList = new jQuery.Deferred();
			$.ajax({
				type: "PUT",
				url: backpack.baseUrl + '/backpack/api/child/',
				data: JSON.stringify(child),
				contentType: 'application/json',
				dataType: 'json',
				headers: { "x-content-type-options": "nosniff" },
				success: function(fetchResult) {
					if (typeof(fetchResult) !== "undefined") {
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
		var deferredList = new jQuery.Deferred();
			$.ajax({
				type: "GET",
				url: backpack.baseUrl + '/backpack/api/child/' + childId,
				success: function(fetchResult) {
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
		var deferredList = new jQuery.Deferred();
			$.ajax({
				type: "GET",
				url: backpack.baseUrl + '/backpack/api/children',
				success: function(fetchResult) {
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