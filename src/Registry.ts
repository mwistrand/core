import { Handle } from './interfaces';

/**
 * An entry in a Registry. Each Entry contains a test to determine whether the Entry is applicable, and a value for the
 * entry.
 */
interface Entry<T> {
	test: Test;
	value: T;
}

/**
 * A registry of values tagged with matchers.
 */
export default class Registry<T> {
	/**
	 * Construct a new Registry, optionally containing a given default value.
	 */
	constructor(defaultValue?: T) {
		this.defaultValue = defaultValue;
		this.entries = [];
	}

	private entries: Entry<T>[];
	private defaultValue: T;

	/**
	 * Return the first entry in this registry that matches the given arguments. If no entry matches and the registry
	 * was created with a default value, that value will be returned. Otherwise, an exception is thrown.
	 *
	 * @param ...args Arguments that will be used to select a matching value.
	 * @returns the matching value, or a default value if one exists.
	 */
	match<U>(...args: U[]): T {
		let entries = this.entries.slice(0);
		let entry: Entry<T>;

		for (let i = 0; (entry = entries[i]); ++i) {
			if (entry.test.apply(null, args)) {
				return entry.value;
			}
		}

		if (this.defaultValue !== undefined) {
			return this.defaultValue;
		}

		throw new Error('No match found');
	}

	/**
	 * Register a test + value pair with this registry.
	 *
	 * @param test The test that will be used to determine if the registered value matches a set of arguments.
	 * @param value A value being registered.
	 * @param first If true, the newly registered test and value will be the first entry in the registry.
	 */
	register(test: string | RegExp | Test, value: T, first?: boolean): Handle {
		let entries = this.entries;
		let entryTest: Test;

		if (typeof test === 'string') {
			entryTest = (...args: any[]): boolean => {
				return test === args[0];
			}
		}
		else if (test instanceof RegExp) {
			entryTest = (...args: any[]): boolean => {
				return test.test.apply(test, args);
			}
		}
		else {
			entryTest = <Test> test;
		}

		let entry: Entry<T> = {
			test: entryTest,
			value: value
		};

		(<any> entries)[(first ? 'unshift' : 'push')](entry);

		return {
			destroy: function () {
				this.destroy = function ():void {};
				let i = 0;
				while ((i = entries.indexOf(entry, i)) > -1) {
					entries.splice(i, 1);
				}
				test = value = entries = entry = null;
			}
		};
	}
}

/**
 * The interface that a test function must implement.
 */
export interface Test {
	(...args: any[]): boolean;
}
