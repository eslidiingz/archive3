
export function onlyUnique(value, index, self) {
	return self.indexOf(value) === index;
}
export function arrayUnique(arr) {
	let unique = arr.filter(onlyUnique);
	return unique;
}

export const number_comma = (x) => {
	if( !x ){ x = 0; }
	x = x.toString().replace(/,/g, '');
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
export const number_format = function (x) {
	if( x == '' ){ x = 0; }
	x = parseFloat(x);
	let result = number_comma(x.toFixed(2));
	if( result == "NaN" ){ result = 0; }
	return result;
}
export const replaceRange = function (s, start, end, substitute) {
	return s.substring(0, start) + substitute + s.substring(end);
}
