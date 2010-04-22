// functions

// return the cross product of two arrays
function product( x, y ) {
	var ret = [];
	for( var i=0; i < x.length; i++ ) {
		for( var j=0; j < y.length; j++ ) {
			ret.push( x[i].concat( y[j] ) );
		}
	}
	return ret;
}
			
function concat( x, y ) {
	return x.concat( y )
}