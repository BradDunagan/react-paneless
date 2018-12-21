/*
         1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/
import React, { Component } from 'react'

import ExampleComponent from 'paneless'

import { AppFrame }		from 'paneless';


export default class App extends Component {

	constructor ( props ) {
		super ( props );

		this.doAll			= this.doAll.bind ( this );
	}

	doAll ( o ) {

	}	//	doAll()

	render () {
	//	return (
	//		<div>
	//			<ExampleComponent text = 'Yep 1 2 3' />
	//		</div>
	//	);
		return (
			<AppFrame appTitle		= 'App Title'
					  clientFnc 	= { this.doAll } />
		);
	}
}
