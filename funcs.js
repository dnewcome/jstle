var namespaces = {};

// TODO: return value is global as a hack to avoid passing 
// too much data around int the case of parsing blank nodes,
// which need to return full triples outside of the normal scheme
// of parsing triples expressions. It isn't easy to do the blank
// nodes in a separate step since once we are out of scope where 
// blank node was assigned ID, we don't have ready access to match
// up the nodeIDs later
var res = [];

function outerparse( expr ) {
	res = [];
	for( var i=0; i < expr.length; i++ ) {
		// evaluate a directive statement
		if( expr[i][0] == "@prefix" ) {
			namespaces[ expr[i][1] ] = expr[i][2];
		}
		else if( typeOf( expr[i] ) == 'object' ) {
			var blankNodeID = '_:' + Math.floor( Math.random() * 1001 );
			parseBlankNode( blankNodeID, expr[i] );
		}
		else {
			res = concat( res, parse( expr[i] ) );
		}
	}
	resolvePrefixes( res );
	return res;
}

function resolvePrefixes( expr ) {
	for( var i=0; i < expr.length; i++ ) {
		for( var j=0; j < expr[i].length; j++ ) {	
			var prefix = expr[i][j].split(':')[0];
			var suffix = expr[i][j].split(':')[1];
			expr[i][j] = '<' + namespaces[ prefix ] + suffix + '>';
		}
	}
}

// evaluate a triples statement
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
		else if( typeOf( expr[i] ) == 'object' ) {
			var blankNodeID = '_:' + Math.floor( Math.random() * 1001 );
			temp.push( blankNodeID );
			if( temp.length == level ) {
				ret.push( temp );
				temp = [];
			}
			parseBlankNode( blankNodeID, expr[i] );
			
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

// called after adding nodeid to current triple, 
// so any assertions in the blank node are made w/
// same blank nodeid given as parameter 
// note that results are directly added to response global
function parseBlankNode( nodeID, expr ) {
	var tmp = [ nodeID ];
	for( pred in expr ) {
		tmp.push( pred );
		// continue parsing if we don't have another nested blank
		if( typeOf( expr[pred] ) != 'object' ) {
			// object could possibly be a list, so parse
			// TODO: change api of product and parse to take single element
			// expressions without enclosing array - syntax here is awkward
			var parsearg = typeOf( expr[pred] ) == 'array' ? expr[pred] : [ expr[pred] ];
			res = concat( res, product( [ tmp ] , parse( parsearg, 1 ) ) );
		}
		else {
			// we have a nested blank
			var blankNodeID = '_:' + Math.floor( Math.random() * 1001 );
			tmp.push( blankNodeID );
			res.push( concat( res, tmp ) );
			parseBlankNode( blankNodeID, expr[pred] );
		}	
		tmp = [ nodeID ];
	}
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

