var escapeRegExpPattern = /[[\]{}()|\\^$.*+?]/g;
var escapeXmlPattern = /[&<]/g;
var escapeXmlForPattern = /[&<>'"]/g;
var escapeXmlMap: { [key: string]: string } = {
	'&': '&amp;',
	'<': '&lt;',
	'>': '&gt;',
	'"': '&quot;',
	'\'': '&#39;'
};

function getPadding(text: string, size: number, character: string = '0'): string {
	var length: number = size - text.length;
	var padding: string = '';

	if (length < 1) {
		return padding;
	}

	// Efficiently repeat the passed-in character.
	while (true) {
		if ((length & 1) === 1) {
			padding += character;
		}

		length >>= 1;

		if (length === 0) {
			break;
		}

		character += character;
	}

	return padding;
}

function validateSubstringComparisonArguments(value: any, search: any): void {
	if (value == null) {
		throw new TypeError();
	}

	if (Object.prototype.toString.call(search) === '[object RegExp]') {
		throw new TypeError();
	}
}

function substringCompare(value: string, search: string, start: number, length: number): boolean {
	for (let i = start; i < length; i++) {
		if (value[i] !== search[i - start]) {
			return false
		}
	}
	return true;
}

export function escapeRegExp(text: string): string {
	return !text ? text : text.replace(escapeRegExpPattern, '\\$&');
}

export function escapeXml(xml: string, forAttribute: boolean = true): string {
	if (!xml) {
		return xml;
	}

	var pattern = forAttribute ? escapeXmlForPattern : escapeXmlPattern;

	return xml.replace(pattern, function (character: string): string {
		return escapeXmlMap[character];
	});
}

export function padStart(text: string, size: number, character: string = '0'): string {
	if (character.length !== 1) {
		throw new TypeError('string.padStart requires a valid padding character.');
	}

	if (size < 0 || size === Infinity) {
		throw new RangeError('string.padStart requires a valid size.');
	}

	return getPadding(text, size, character) + text;
}

export function padEnd(text: string, size: number, character: string = '0'): string {
	if (character.length !== 1) {
		throw new TypeError('string.padEnd requires a valid padding character.');
	}

	if (size < 0 || size === Infinity) {
		throw new RangeError('string.padEnd requires a valid size.');
	}

	return text + getPadding(text, size, character);
}

/**
 * Repeats the string coerced value n times.
 * @return The repeated string coerced value
 */
export function repeat(value: any, times: number): string {
	times = Math.floor(+times);
	if (times != times || times === 0) {
		return '';
	}

	// check for range errors
	if (times < 0 || times >= Infinity) {
		throw new RangeError('repeat times value must be within the following boundaries (0, Infinity]');
	}

	// http://jsperf.com/string-repeat2/12
	value = String(value);
	let accumulator = value;
	let remainderAccumulator = '';
	let remainderAccumulatorCount = 0;

	let base2Exp = Math.log(times) / Math.log(2);
	let base2ExpInt = Math.floor(base2Exp);
	let remainder = times - Math.pow(2, base2ExpInt);

	for (let i = 0; i < base2ExpInt; i++) {
		accumulator += accumulator;

		if (remainder > 0) {
			remainderAccumulatorCount += remainderAccumulatorCount === 0 ? 1 : remainderAccumulatorCount;
			if (remainderAccumulatorCount > remainder || i + 1 === base2ExpInt) {
				for (let j = 0; j < remainder; j++) {
					remainderAccumulator += value;
				}
				remainder = 0;
			}
			else {
				remainderAccumulator += remainderAccumulator ? remainderAccumulator : value;
				remainder -= remainderAccumulatorCount === 1 ? 1 : (remainderAccumulatorCount / 2);
			}
		}
	}

	return accumulator + remainderAccumulator;
};

/**
 * Determines whether a string begins with the characters and another string
 * @return a boolean indicating the truth of the comparison
 */
export function startsWith(value: any, search: any, position: number = 0): boolean {
	validateSubstringComparisonArguments(value, search);

	value = String(value);
	search = String(search);
	position = Math.floor(+position);

	if (position != position) {
		position = 0;
	}

	let valueLength = value.length;
	let searchLength = search.length;
	let start = Math.min(Math.max(position, 0), valueLength);

	if (searchLength + position > valueLength) {
		return false;
	}

	return substringCompare(value, search, start, searchLength + position);
};

/**
 * Determines whether a string includes the characters and another string
 * @return a boolean indicating the truth of the comparison
 */
export function includes(value: any, search: string, position: number = 0): boolean {
	validateSubstringComparisonArguments(value, search);

	value = String(value);
	search = String(search);

	position = Math.floor(+position);

	if (position != position) {
		position = 0;
	}

	let valueLength = value.length;
	let searchLength = search.length;
	let start = Math.min(Math.max(position, 0), valueLength);

	if (searchLength + position > valueLength) {
		return false;
	}

	return value.indexOf(search, position) !== -1;
}

/**
 * Determines whether a string ends with the characters and another string
 * @return a boolean indicating the truth of the comparison
 */
export function endsWith(value: any, search: string, position?: number): boolean {
	validateSubstringComparisonArguments(value, search);

	value = String(value);
	search = String(search);

	let valueLength = value.length;
	let searchLength = search.length;

	if (position == null || position >= Infinity) {
		position = valueLength;
	}

	position = Math.floor(+position);

	if (position != position) {
		position = valueLength;
	}

	let end = Math.min(Math.max(position, 0), valueLength);
	let start = end - searchLength;

	if (start < 0) {
		return false;
	}

	return substringCompare(value, search, start, position);
}
