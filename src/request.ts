import Task from './async/Task';
import has from './has';
import { Handle } from './interfaces';
import Promise from './Promise';
import Registry, { Test } from './Registry';
import { ParamList } from './UrlSearchParams';

declare var require: Function;
declare var define: { amd: any };

export class FilterRegistry extends Registry<RequestFilter> {
	register(test: string | RegExp | RequestFilterTest, value: RequestFilter, first?: boolean): Handle {
		let entryTest: Test;

		if (typeof test === 'string') {
			entryTest = (response, url, options) => {
				return test === url;
			};
		}
		else if (test instanceof RegExp) {
			entryTest = (response, url, options) => {
				return test.test(url);
			};
		}
		else {
			entryTest = <RequestFilterTest> test;
		}

		return super.register(entryTest, value, first);
	}
}

let defaultProvider: string = './request/xhr';
if (has('host-node')) {
	defaultProvider = './request/node';
}

export class ProviderRegistry extends Registry<RequestProvider> {
	private _providerPromise: Promise<RequestProvider>;

	constructor() {
		super();

		const deferRequest = (url: string, options?: RequestOptions): ResponsePromise<any> => {
			let canceled = false;
			let actualResponse: ResponsePromise<any>;
			return new Task<Response<any>>((resolve, reject) => {
				this._providerPromise.then(function (provider) {
					if (canceled) {
						return;
					}
					actualResponse = provider(url, options);
					actualResponse.then(resolve, reject);
				});
			}, function () {
				if (!canceled) {
					canceled = true;
				}
				if (actualResponse) {
					actualResponse.cancel();
				}
			});
		};

		// The first request to hit the default value will kick off the import of the default
		// provider. While that import is in-flight, subsequent requests will queue up while
		// waiting for the provider to be fulfilled.
		this._defaultValue = (url: string, options?: RequestOptions): ResponsePromise<any> => {
			this._providerPromise = new Promise((resolve, reject) => {
				if (typeof define === 'function' && define.amd) {
					require([ defaultProvider ], (provider: { default: RequestProvider; }) => {
						this._defaultValue = provider.default;
						resolve(provider.default);
					});
				}
				else if (has('host-node')) {
					const provider: { default: RequestProvider; } = require(defaultProvider);
					this._defaultValue = provider.default;
					resolve(provider.default);
				}
				else {
					reject(new Error('Unknown environment or loader'));
				}
			});
			this._defaultValue = deferRequest;
			return deferRequest(url, options);
		};
	}

	register(test: string | RegExp | RequestProviderTest, value: RequestProvider, first?: boolean): Handle {
		let entryTest: Test;

		if (typeof test === 'string') {
			entryTest = (url, options) => {
				return test === url;
			};
		}
		else if (test instanceof RegExp) {
			entryTest = (url, options) => {
				return test.test(url);
			};
		}
		else {
			entryTest = <RequestProviderTest> test;
		}

		return super.register(entryTest, value, first);
	}
}

/**
 * Request filters, which filter or modify responses. The default filter simply passes a response through unchanged.
 */
export const filterRegistry = new FilterRegistry(function (response: Response<any>): Response<any> {
	return response;
});

/**
 * Request providers, which fulfill requests.
 */
export const providerRegistry = new ProviderRegistry();

export interface RequestError<T> extends Error {
	response: Response<T>;
}

export interface RequestFilter {
	<T>(response: Response<T>, url: string, options?: RequestOptions): T;
}

export interface RequestFilterTest extends Test {
	<T>(response: Response<any>, url: string, options?: RequestOptions): boolean;
}

export interface RequestOptions {
	auth?: string;
	cacheBust?: any;
	data?: any;
	headers?: { [name: string]: string; };
	method?: string;
	password?: string;
	query?: string | ParamList;
	responseType?: string;
	timeout?: number;
	user?: string;
}

export interface RequestProvider {
	<T>(url: string, options?: RequestOptions): ResponsePromise<T>;
}

export interface RequestProviderTest extends Test {
	(url: string, options?: RequestOptions): boolean;
}

export interface Response<T> {
	data: T;
	nativeResponse?: any;
	requestOptions: RequestOptions;
	statusCode: number;
	statusText?: string;
	url: string;

	getHeader(name: string): string;
}

/**
 * The task returned by a request, which will resolve to a Response
 */
export interface ResponsePromise<T> extends Task<Response<T>> {}

/**
 * Make a request, returning a Promise that will resolve or reject when the request completes.
 */
const request: {
	<T>(url: string, options?: RequestOptions): ResponsePromise<T>;
	delete<T>(url: string, options?: RequestOptions): ResponsePromise<T>;
	get<T>(url: string, options?: RequestOptions): ResponsePromise<T>;
	post<T>(url: string, options?: RequestOptions): ResponsePromise<T>;
	put<T>(url: string, options?: RequestOptions): ResponsePromise<T>;
} = <any> function request<T>(url: string, options: RequestOptions = {}): ResponsePromise<T> {
	const promise = providerRegistry.match(url, options)(url, options)
		.then(function (response: Response<T>) {
			return Task.resolve(filterRegistry.match(response, url, options)(response, url, options))
				.then(function (filterResponse: any) {
					response.data = filterResponse.data;
					return response;
				});
		});

	return promise;
};

[ 'DELETE', 'GET', 'POST', 'PUT' ].forEach(function (method) {
	(<any> request)[method.toLowerCase()] = function <T>(url: string, options: RequestOptions = {}): ResponsePromise<T> {
		options = Object.create(options);
		options.method = method;
		return request(url, options);
	};
});

export default request;

/**
 * Add a filter that automatically parses incoming JSON responses.
 */
filterRegistry.register(
	function (response: Response<any>, url: string, options: RequestOptions) {
		return typeof response.data === 'string' && options.responseType === 'json';
	},
	function (response: Response<any>, url: string, options: RequestOptions): Object {
		return {
			data: JSON.parse(response.data)
		};
	}
);
