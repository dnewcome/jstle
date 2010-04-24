function testFullParser() 
{
	// :a :b :c ; :d :e , :f .
	var expression1 = [
		[ '@prefix', 'pfx', 'http://www.example.com/' ],
		[ 'pfx:a', [ 'pfx:b',   'pfx:c', 
					 'pfx:d', [ 'pfx:e', 
								'pfx:f' ] ] ]
	];
				
	var result1 = outerparse( expression1 );
	console.log( result1 );
	equal( "fulltest1", JSON.stringify( result1 ), "");
}

function testParseBlankNode() {
	
	var expression1 = [ { ':a': ':b' } ];
	var result1 = outerparse( expression1 );
	console.log( result1 );
	
	var expression2 = [ { ':a': [':b',':c'] } ];
	var result2 = outerparse( expression2 );
	console.log( result2 );
	
	var expression3 = [ 
		[ '@prefix', '', 'http://www.example.com/' ],
		[ '@prefix', '_', '_:' ],
		{ ':a': {':b': ':c'} } 
	];
	var result3 = outerparse( expression3 );
	console.log( result3 );
	

}

function testTripleParser() 
{
	var expression1 = [ ':a', [ ':b', ':c', ':d', [ ':e', ':f' ] ] ];
	var result1 = JSON.stringify( parse( expression1 ) );
	equal( "test1", result1, '[[":a",":b",":c"],[":a",":d",":e"],[":a",":d",":f"]]' );
	
	var expression2 = [ ':a', ':b', [ ':c', ':d', ':e', ':f' ] ];		
	var result2 = JSON.stringify( parse( expression2 ) );
	equal( "test2", result2, '[[":a",":b",":c"],[":a",":b",":d"],[":a",":b",":e"],[":a",":b",":f"]]' );
	
	// not valid turtle expression, but parses anyway,
	var expression3 = [ ':a', [ ':b', [ ':c', ':d', ':e', ':f' ] ] ];		
	var result3 = JSON.stringify( parse( expression3 ) );
	equal( "test3", result3, '[[":a",":b",":c"],[":a",":b",":d"],[":a",":b",":e"],[":a",":b",":f"]]' );
	
	// throws exception 'too many levels'
	var expression4 = [ ':a', [ ':b', [ ':c', [ ':d', ':e', ':f' ] ] ] ];		
	var result4;
	try {
		result4 = parse( expression4 );
	}
	catch( e ) {
		result4 = e;
	}
	equal( "test4", result4, 'parse error - invalid nested array' );
	
	var expression5 = [ ':a', [ ':b', [ ':c', ':d' ] ], ':e', [ ':f', ':g' ] ]; // :a :b :c , :d ; :e :f , :g .
	var result5 = JSON.stringify( parse( expression5 ) );
	equal( "test5", result5, '[[":a",":b",":c"],[":a",":b",":d"],[":a",":e",":f"],[":a",":e",":g"]]' );
	
	// not a valid turtle expression
	/*
	var expression6 = [ [ ':a', ':b' ], [ ':c', ':d' ], ':e', ':f', ':g' ];
	var result6 = parse( expression6 );
	console.log( JSON.stringify( result6 ) );
	*/
	
	console.log( "finished" );
}
