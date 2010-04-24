# About

Jstle (pronounced `jostle') is a terse, Javascript-native literal serialization
language for RDF graphs. The semantic rules loosely follow those of the text-based 
[Turtle](http://www.w3.org/TeamSubmission/turtle/) RDF
serialization language by Dave Beckett and Tim Berners-Lee.

# Motivation

Javascript is a powerful language for data manipulation, owing to a flexible 
object literal notation built into the language. However, standard Javascript RDF representations
such as [RDF JSON](http://n2.talis.com/wiki/RDF_JSON_Specification) are relatively verbose, allowing
only minimal levels of expressiveness and limited ability to avoid repetition.
Languages such as Turtle are terse and easily written, but must be parsed as text
and cannot be manipulated easily in its source representation. Jstle was born of a desire
to have a Turtle-like language that was able to be programmatically processed directly using 
Javascript.

# Synopsis

Given the following RDF graph in Turtle expression notation
	
	:a :b :c ; :d :e , :f

We can write the following JSON literal to represent the same graph
	
	[ ':a', [ ':b', ':c', ':d', [ ':e', ':f' ] ] ]

	
Jstle also supports blank nodes, denoted by inline object literals
Given the following Turtle, using bracket blank node notation

	:a :b :c ; :d :e , [ :f [ :g :h ] ] .
	
We arrive at the following Jstle representation

	[
		[ '@prefix', 'pfx', 'http://www.example.com/' ],
		[ 'pfx:a', [ 'pfx:b',   'pfx:c', 
					 'pfx:d', [ 'pfx:e', 
								{ 'pfx:f': { 'pfx:g': 'pfx:h' } } ] ] ]
	];

As apparent from the preceding example, Jstle is able to parse @prefix directives
similarly to Turtle. The equivalent unabbreviated N-Triples notation would be

	[
		["<http://www.example.com/a>", "<http://www.example.com/b>", "<http://www.example.com/c>"], 
		["<http://www.example.com/a>", "<http://www.example.com/d>", "<http://www.example.com/e>"], 
		["<http://www.example.com/a>", "<http://www.example.com/d>", "<undefined58>"], 
		["<undefined58>", "<http://www.example.com/f>", "<undefined815>"], 
		["<undefined815>", "<http://www.example.com/g>", "<http://www.example.com/h>"]
	]

# Example
<TODO:>

# Status
This software is a proof of concept. There are probably cases that it cannot handle,
and should not be used in production.

# Limitations
- No support for RDF collections notation
- @base directive not supported
- no datatype support
- `a' shorthand for `is-a' not supported

# License
Jstle is provided under the MIT free software license. See the file LICENSE for 
the full text.