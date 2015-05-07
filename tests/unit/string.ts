import registerSuite = require('intern!object');
import assert = require('intern/chai!assert');
import {escapeRegExp, escapeXml, padStart, padEnd, repeat, startsWith, includes, endsWith} from 'src/string';

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
				assert.strictEqual(repeat('abc', <any> counts[i]), '');
			}
		},

		'coerces target to string'() {
			assert.strictEqual(repeat(undefined, 4), 'undefinedundefinedundefinedundefined');
			assert.strictEqual(repeat(false, 3), 'falsefalsefalse');
			assert.strictEqual(repeat(1, 3), '111');
		}
	},

	'.startsWith()': {
		'throws on null value or RegExp'() {
			assert.throws(function () {
				startsWith(undefined, 'abc');
			});
			assert.throws(function () {
				startsWith(null, 'abc');
			});
			assert.throws(function () {
				startsWith('abc', <any> /\s+/);
			});
		},

		'null or undefined search value'() {
			assert.isTrue(startsWith('undefined', undefined));
			assert.isFalse(startsWith('undefined', null));
			assert.isTrue(startsWith('null', null));
			assert.isFalse(startsWith('null', undefined));
		},

		'position not included or coerced to NaN'() {
			var counts = [ NaN, undefined, null, 'abc' ];
			for (var i = counts.length; i--;) {
				assert.isFalse(startsWith('abc', undefined, <any> counts[i]));
				assert.isTrue(startsWith('abc', '', <any> counts[i]));
				assert.isFalse(startsWith('abc', '\0', <any> counts[i]));
				assert.isTrue(startsWith('abc', 'a', <any> counts[i]));
				assert.isFalse(startsWith('abc', 'b', <any> counts[i]));
				assert.isTrue(startsWith('abc', 'ab', <any> counts[i]));
				assert.isTrue(startsWith('abc', 'abc', <any> counts[i]));
				assert.isFalse(startsWith('abc', 'abcd', <any> counts[i]));
			}
		},

		'position is 0'() {
			var counts = [+0, -0];
			for (var i = counts.length; i--;) {
				assert.isFalse(startsWith('abc', undefined, <any> counts[i]));
				assert.isTrue(startsWith('abc', '', <any> counts[i]));
				assert.isFalse(startsWith('abc', '\0', <any> counts[i]));
				assert.isTrue(startsWith('abc', 'a', <any> counts[i]));
				assert.isFalse(startsWith('abc', 'b', <any> counts[i]));
				assert.isTrue(startsWith('abc', 'ab', <any> counts[i]));
				assert.isTrue(startsWith('abc', 'abc', <any> counts[i]));
				assert.isFalse(startsWith('abc', 'abcd', <any> counts[i]));
			}
		},

		'position is Infinity'() {
			assert.isFalse(startsWith('abc', undefined, Infinity));
			assert.isFalse(startsWith('abc', '', Infinity));
			assert.isFalse(startsWith('abc', '\0', Infinity));
			assert.isFalse(startsWith('abc', 'a', Infinity));
			assert.isFalse(startsWith('abc', 'b', Infinity));
			assert.isFalse(startsWith('abc', 'ab', Infinity));
			assert.isFalse(startsWith('abc', 'abc', Infinity));
			assert.isFalse(startsWith('abc', 'abcd', Infinity));
		},

		'position is 1 or coerced to 1'() {
			var counts = [ 1, true ];
			for (var i = counts.length; i--;) {
				assert.isFalse(startsWith('abc', undefined, <any> counts[i]));
				assert.isTrue(startsWith('abc', '', <any> counts[i]));
				assert.isFalse(startsWith('abc', '\0', <any> counts[i]));
				assert.isFalse(startsWith('abc', 'a', <any> counts[i]));
				assert.isTrue(startsWith('abc', 'b', <any> counts[i]));
				assert.isTrue(startsWith('abc', 'bc', <any> counts[i]));
				assert.isFalse(startsWith('abc', 'abc', <any> counts[i]));
				assert.isFalse(startsWith('abc', 'abcd', <any> counts[i]));
			}
		},

		'value is string a non-string'() {
			assert.isTrue(startsWith(120, '12'));
			assert.isTrue(startsWith(true, 'tru'));
			assert.isTrue(startsWith(false, 'fa'));
			assert.isTrue(startsWith(NaN, 'N'));
			assert.isTrue(startsWith(/\s+/, '/\\s'));
		},

		'unicode support'() {
			assert.isTrue(startsWith('\xA2fa', '\xA2'));
			assert.isTrue(startsWith('\xA2fa', 'fa', 1));
			assert.isTrue(startsWith('\xA2fa\uDA04', '\xA2fa\uDA04'));
			assert.isTrue(startsWith('\xA2fa\uDA04', 'fa\uDA04', 1));
			assert.isTrue(startsWith('\xA2fa\uDA04', '\uDA04', 3));
		}
	},

	'.includes()': {
		'throws on null value or RegExp'() {
			assert.throws(function () {
				includes(undefined, 'abc');
			});
			assert.throws(function () {
				includes(null, 'abc');
			});
			assert.throws(function () {
				includes('abc', <any> /\s+/);
			});
		},

		'null or undefined search value'() {
			assert.isTrue(includes('undefined', undefined));
			assert.isFalse(includes('undefined', null));
			assert.isTrue(includes('null', null));
			assert.isFalse(includes('null', undefined));
		},

		'position not included or coerced to NaN'() {
			var counts = [ NaN, undefined, null, 'abc' ];
			for (var i = counts.length; i--;) {
				assert.isFalse(includes('abc', undefined, <any> counts[i]));
				assert.isTrue(includes('abc', '', <any> counts[i]));
				assert.isFalse(includes('abc', '\0', <any> counts[i]));
				assert.isTrue(includes('abc', 'a', <any> counts[i]));
				assert.isTrue(includes('abc', 'b', <any> counts[i]));
				assert.isTrue(includes('abc', 'ab', <any> counts[i]));
				assert.isTrue(includes('abc', 'abc', <any> counts[i]));
				assert.isFalse(includes('abc', 'abcd', <any> counts[i]));
			}
		},

		'position is 0'() {
			var counts = [+0, -0];
			for (var i = counts.length; i--;) {
				assert.isFalse(includes('abc', undefined, <any> counts[i]));
				assert.isTrue(includes('abc', '', <any> counts[i]));
				assert.isFalse(includes('abc', '\0', <any> counts[i]));
				assert.isTrue(includes('abc', 'a', <any> counts[i]));
				assert.isTrue(includes('abc', 'b', <any> counts[i]));
				assert.isTrue(includes('abc', 'ab', <any> counts[i]));
				assert.isTrue(includes('abc', 'abc', <any> counts[i]));
				assert.isFalse(includes('abc', 'abcd', <any> counts[i]));
			}
		},

		'position is Infinity'() {
			assert.isFalse(includes('abc', undefined, Infinity));
			assert.isFalse(includes('abc', '', Infinity));
			assert.isFalse(includes('abc', '\0', Infinity));
			assert.isFalse(includes('abc', 'a', Infinity));
			assert.isFalse(includes('abc', 'b', Infinity));
			assert.isFalse(includes('abc', 'ab', Infinity));
			assert.isFalse(includes('abc', 'abc', Infinity));
			assert.isFalse(includes('abc', 'abcd', Infinity));
		},

		'position is 1 or coerced to 1'() {
			var counts = [ 1, true ];
			for (var i = counts.length; i--;) {
				assert.isFalse(includes('abc', undefined, <any> counts[i]));
				assert.isTrue(includes('abc', '', <any> counts[i]));
				assert.isFalse(includes('abc', '\0', <any> counts[i]));
				assert.isFalse(includes('abc', 'a', <any> counts[i]));
				assert.isTrue(includes('abc', 'b', <any> counts[i]));
				assert.isTrue(includes('abc', 'bc', <any> counts[i]));
				assert.isFalse(includes('abc', 'abc', <any> counts[i]));
				assert.isFalse(includes('abc', 'abcd', <any> counts[i]));
			}
		},

		'value is string a non-string'() {
			assert.isTrue(includes(120, '12'));
			assert.isTrue(includes(true, 'tru'));
			assert.isTrue(includes(false, 'fa'));
			assert.isTrue(includes(NaN, 'N'));
			assert.isTrue(includes(/\s+/, '/\\s'));
		},

		'unicode support'() {
			assert.isTrue(includes('\xA2fa', '\xA2'));
			assert.isTrue(includes('\xA2fa', 'fa', 1));
			assert.isTrue(includes('\xA2fa\uDA04', '\xA2fa\uDA04'));
			assert.isTrue(includes('\xA2fa\uDA04', 'fa\uDA04', 1));
			assert.isTrue(includes('\xA2fa\uDA04', '\uDA04', 3));
		}
	},

	'.endsWith()': {
		'throws on null value or RegExp'() {
			assert.throws(function () {
				endsWith(undefined, 'abc');
			});
			assert.throws(function () {
				endsWith(null, 'abc');
			});
			assert.throws(function () {
				endsWith('abc', <any> /\s+/);
			});
		},

		'null or undefined search value'() {
			assert.isTrue(endsWith('undefined', undefined));
			assert.isFalse(endsWith('undefined', null));
			assert.isTrue(endsWith('null', null));
			assert.isFalse(endsWith('null', undefined));
		},

		'position not included or coerced to NaN'() {
			var counts = [ NaN, undefined, null, 'abc' ];
			for (var i = counts.length; i--;) {
				assert.isFalse(endsWith('abc', undefined, <any> counts[i]));
				assert.isTrue(endsWith('abc', '', <any> counts[i]));
				assert.isFalse(endsWith('abc', '\0', <any> counts[i]));
				assert.isTrue(endsWith('abc', 'c', <any> counts[i]));
				assert.isFalse(endsWith('abc', 'b', <any> counts[i]));
				assert.isTrue(endsWith('abc', 'bc', <any> counts[i]));
				assert.isTrue(endsWith('abc', 'abc', <any> counts[i]));
				assert.isFalse(endsWith('abc', 'abcd', <any> counts[i]));
			}
		},

		'position is 0'() {
			var counts = [+0, -0];
			for (var i = counts.length; i--;) {
				assert.isFalse(endsWith('abc', undefined, <any> counts[i]));
				assert.isTrue(endsWith('abc', '', <any> counts[i]));
				assert.isFalse(endsWith('abc', '\0', <any> counts[i]));
				assert.isFalse(endsWith('abc', 'a', <any> counts[i]));
				assert.isFalse(endsWith('abc', 'b', <any> counts[i]));
				assert.isFalse(endsWith('abc', 'ab', <any> counts[i]));
				assert.isFalse(endsWith('abc', 'abc', <any> counts[i]));
				assert.isFalse(endsWith('abc', 'abcd', <any> counts[i]));
			}
		},

		'position is Infinity'() {
			assert.isFalse(endsWith('abc', undefined, Infinity));
			assert.isTrue(endsWith('abc', '', Infinity));
			assert.isFalse(endsWith('abc', '\0', Infinity));
			assert.isTrue(endsWith('abc', 'c', Infinity));
			assert.isFalse(endsWith('abc', 'b', Infinity));
			assert.isTrue(endsWith('abc', 'bc', Infinity));
			assert.isTrue(endsWith('abc', 'abc', Infinity));
			assert.isFalse(endsWith('abc', 'abcd', Infinity));
		},

		'position is 1 or coerced to 1'() {
			var counts = [ 1, true ];
			for (var i = counts.length; i--;) {
				assert.isFalse(endsWith('abc', undefined, <any> counts[i]));
				assert.isTrue(endsWith('abc', '', <any> counts[i]));
				assert.isFalse(endsWith('abc', '\0', <any> counts[i]));
				assert.isTrue(endsWith('abc', 'a', <any> counts[i]));
				assert.isFalse(endsWith('abc', 'b', <any> counts[i]));
				assert.isFalse(endsWith('abc', 'bc', <any> counts[i]));
				assert.isFalse(endsWith('abc', 'abc', <any> counts[i]));
				assert.isFalse(endsWith('abc', 'abcd', <any> counts[i]));
			}
		},

		'value is string a non-string'() {
			assert.isTrue(endsWith(120, '20'));
			assert.isTrue(endsWith(true, 'rue'));
			assert.isTrue(endsWith(false, 'lse'));
			assert.isTrue(endsWith(NaN, 'N'));
			assert.isTrue(endsWith(/\s+/, '\\s+/'));
		},

		'unicode support'() {
			assert.isTrue(endsWith('\xA2fa\xA3', 'fa\xA3'));
			assert.isTrue(endsWith('\xA2fa', '\xA2', 1));
			assert.isTrue(endsWith('\xA2fa\uDA04', '\xA2fa\uDA04'));
			assert.isTrue(endsWith('\xA2fa\uDA04', 'fa', 3));
			assert.isTrue(endsWith('\xA2fa\uDA04', '\uDA04'));
		}
	}
});
