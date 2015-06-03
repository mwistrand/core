import registerSuite = require('intern!object');
import assert = require('intern/chai!assert');
import Registry from 'src/Registry';

function stringTest(value: string) {
	return (...args: any[]): boolean => {
		return value === args[0];
	};
}

registerSuite({
	name: 'Registry',

	'#match'() {
		const registry = new Registry<any>();
		const handler = () => {};
		registry.register((name: string) => {
			return name === 'foo';
		}, handler);
		assert.strictEqual(registry.match('foo'), handler);
		assert.throws(() => registry.match('bar'));
	},

	'#register': {
		multiple() {
			const registry = new Registry<any>();
			const handler = () => {};
			registry.register(stringTest('foo'), handler);
			registry.register(stringTest('foo'), () => {});
			assert.strictEqual(registry.match('foo'), handler);
		},

		first() {
			const registry = new Registry<number>();
			registry.register(stringTest('foo'), 1);
			registry.register(stringTest('foo'), 2, true);
			assert.strictEqual(registry.match('foo'), 2);
			registry.register(stringTest('foo'), 3, true);
			assert.notEqual(registry.match('foo'), 2);
		},

		destroy() {
			const registry = new Registry<number>(2);
			const handle = registry.register(stringTest('foo'), 1);
			assert.equal(registry.match('foo'), 1);
			handle.destroy();
			assert.equal(registry.match('foo'), 2);

			// check that destroying a second time doesn't throw
			handle.destroy();
		}
	},

	'default value'() {
		const registry = new Registry<any>('foo');
		assert.strictEqual(registry.match('bar'), 'foo');
	}
});
