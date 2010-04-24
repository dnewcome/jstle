var namespaces = [];

function outerparse( expr ) {
	for( var i=0; i < expr.length; i++ ) {
		if( expr[i][0] == "@prefix" ) {
			namespaces.push( { prefix: expr[i][1], uri: expr[i][2] } );
		}
		else {
			parse( expr[i] );
		}
	}
}

function parse( expr, level ) {
	// we start with level 3 since we are trying to end up
	// with three-element triples
	level = level || 3;

	var ret = [];
	var temp = [];

	// iterate over the input elements
	for( var i=0; i < expr.length; i++ ) {
		if( typeOf( expr[i] ) == 'array' ) {
			// TODO: this way of tracking the number
			// of elements to caputure is kind of goofy
			var effectivelevel;
			if( level == 2 ) {
				effectivelevel = 1;
			}
			else if( level == 3 ) {
				effectivelevel = 3 - temp.length;
			}
			else {
				throw "parse error - invalid nested array";
			}
			
			// this is the meat of it, we want to pare things
			// down as much as we can and still keep this
			ret = concat( 
				ret, 
				product( 
					[ temp ], 
					parse( 
						expr[i], 
						effectivelevel
					)
				) 
			);
		}
		else {
			// push non-array elements onto the temp array
			// temp array gets pushed to output array once we
			// have created a full triple. Partial triples on 
			// the temp array get joined with array coming back
			// from recursion to form triples
			temp.push( expr[i] );
			if( temp.length == level ) {
				ret.push( temp );
				temp = [];
			}
		}
	}
	return ret;
}

// return cartesian join of two arrays
function product( x, y ) {
	var ret = [];
	for( var i=0; i < x.length; i++ ) {
		for( var j=0; j < y.length; j++ ) {
			ret.push( x[i].concat( y[j] ) );
		}
	}
	return ret;
}
			
// concatenate arrays
function concat( x, y ) {
	return x.concat( y )
}

/**
* typeOf function published by Douglas Crockford in ECMAScript recommendations
* http://www.crockford.com/javascript/recommend.html
*/
function typeOf(value) {
	var s = typeof value;
	if (s === 'object') {
		if (value) {
			if (typeof value.length === 'number' &&
					!(value.propertyIsEnumerable('length')) &&
					typeof value.splice === 'function') {
				s = 'array';
			}
		} else {
			s = 'null';
		}
	}
	return s;
}

