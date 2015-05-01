import registerSuite = require('intern!object');
import assert = require('intern/chai!assert');
import { escapeRegExp, escapeXml, padStart, padEnd, repeat } from 'src/string';

registerSuite({
	name: 'string functions',

	'.escapeRegExp()': function () {
		assert.equal(escapeRegExp('[]{}()|\\^$.*+?'), '\\[\\]\\{\\}\\(\\)\\|\\\\\\^\\$\\.\\*\\+\\?');
	},

	'.escapeXml()': function () {
		var html: string = '<p class="text">Fox & Hound\'s</p>';

		assert.equal(escapeXml(html, false), '&lt;p class="text">Fox &amp; Hound\'s&lt;/p>');
		assert.equal(escapeXml(html), '&lt;p class=&quot;text&quot;&gt;Fox &amp; Hound&#39;s&lt;/p&gt;');
	},

	'.padStart()': function () {
		assert.equal(padStart('Lorem', 10), '00000Lorem');
		assert.equal(padStart('Lorem', 10, ' '), '     Lorem');
		assert.equal(padStart('Lorem', 5), 'Lorem');
		assert.equal(padStart('Lorem', 1), 'Lorem');
		assert.throw(function () {
			padStart('Lorem', 10, '');
		}, TypeError);
		assert.throw(function () {
			padStart('Lorem', -5);
		}, RangeError);
		assert.throw(function () {
			padStart('Lorem', Infinity);
		}, RangeError);
	},

	'.padEnd()': function () {
		assert.equal(padEnd('Lorem', 10), 'Lorem00000');
		assert.equal(padEnd('Lorem', 10, ' '), 'Lorem     ');
		assert.equal(padEnd('Lorem', 5), 'Lorem');
		assert.equal(padEnd('Lorem', 1), 'Lorem');
		assert.throw(function () {
			padEnd('Lorem', 10, '');
		}, TypeError);
		assert.throw(function () {
			padEnd('Lorem', -5);
		}, RangeError);
		assert.throw(function () {
			padEnd('Lorem', Infinity);
		}, RangeError);
	},

	'.repeat()': {
		'throws on negative count'() {
			assert.throws(function () {
				repeat('abc', -1);
			});
		},

		'throws on Infinity count'() {
			assert.throws(function () {
				repeat('abc', Infinity);
			});
		},

		'repeats the expected number of times'() {
			assert.strictEqual(repeat('abc', 3), 'abcabcabc');
		},

		'coerces count to integer'() {
			assert.strictEqual(repeat('abc', 7.8), 'abcabcabcabcabcabcabc');
		},

		'repeats 0 times when passed a count that coerces to 0 or NaN'() {
			var counts = [ NaN, undefined, null, 0, false, 'abc' ];
			for (var i = counts.length; i--;) {
				assert.strictEqual(repeat('abc', counts[i]), '');
			}
		},

		'coerces target to string'() {
			assert.strictEqual(repeat(undefined, 4), 'undefinedundefinedundefinedundefined');
			assert.strictEqual(repeat(false, 3), 'falsefalsefalse');
			assert.strictEqual(repeat(1, 3), '111');
		}
	}
});
