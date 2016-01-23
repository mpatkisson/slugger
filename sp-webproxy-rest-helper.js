var wes = wes || {};

(function (wes) {
	'use strict';
	
	var http = {};
	
	// Fired when an ajax request was successfully recieved from the server.
	function onAjaxSuccess(response, sender, args, callback) {
		var data = response.get_body(),
			errorMsg = '';
		if (response.get_statusCode() === 200) {
			if (data) {
				data = JSON.parse(response.get_body());
			}
			if (callback) {
				callback(data, sender, args);
			}
        }
        else {
			if (callback) {
				errorMsg = response.get_body();
				callback(errorMsg, sender, args);
			}
        }
	}
	
	// Fired when an ajax request was not recieved successfully from the server.
	function onAjaxFailure(sender, args, callback) {
		var errorMsg = args.get_message();
		if (callback) {
			callback(errorMsg, sender, args);
		}
	}
	
	// Performs an asynchronous HTTP request using the SharePoint web proxy.
	http.ajax = function (options) {
		var opts = options || {},
			context = SP.ClientContext.get_current(),
		    request = new SP.WebRequestInfo(),
			response = null,
			method = opts.method || 'POST',
			headers = opts.headers || { 'Content-Type': 'application/json' };
			
		request.set_url(opts.url);
	    request.set_method(method);
		request.set_headers(headers);
		if (opts.data) {
			request.set_body(JSON.stringify(opts.data));			
		}
	    response = SP.WebProxy.invoke(context, request);
		context.executeQueryAsync(function success(sender, args) {
			onAjaxSuccess(response, sender, args, opts.success);
		}, function error(sender, args) {
			onAjaxFailure(sender, args, opts.failure);
		});
	};
	
	// Performs an asynchronous HTTP POST using the SharePoint web proxy.
	http.post = function (url, data, options) {
		options = options || {};
		options.url = url;
		options.data = data;
		http.ajax(options);
	};
	
	// Performs an asynchronous HTTP GET using the SharePoint web proxy.
	http.get = function (url, options) {
		options = options || {};
		options.url = url;
		options.method = 'GET';
		http.ajax(options);
	};
	
	// Performs an asynchronous HTTP PUT using the SharePoint web proxy.
	http.put = function (url, data, options) {
		options = options || {};
		options.url = url;
		options.data = data;
		options.method = 'PUT';
		http.ajax(options);
	};
	
	// Performs an asynchronous HTTP DELETE using the SharePoint web proxy.
	http.del = function (url, data, options) {
		options = options || {};
		options.url = url;
		options.data = data;
		options.method = 'DELETE';
		http.ajax(options);
	};
	
	wes.http = http;
	
})(wes);