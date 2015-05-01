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
 * Repeats the string-coerced value n times.
 * @return The repeated string
 */
export function repeat(value: any, times: number): string {
	times = Math.floor(+times);
	if (times !== times || times === 0) {
		return '';
	}

	if (times < 0 || times >= Infinity) {
		throw new RangeError('string.repeat requires a positive finite count.');
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
}
