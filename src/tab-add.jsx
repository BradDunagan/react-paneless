/*
		 1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890

*/

import React, { Component } from 'react';

class TabAdd extends Component {
	constructor ( props ) {
		super ( props );

		this.click = this.click.bind ( this );
		this.doAll = this.doAll.bind ( this );

		this.state = {
		};
		
	}	//	constructor
	

	click ( ev ) {
		this.props.tabsFnc ( { do: 		'add-tab' } );
	}	//	click()

	doAll ( o ) {
	}	//	doAll()

	render() {
		return (
			<div id			= { this.props.eleId }
				 className	= 'rr-tab-page-name'
				 onClick	= { this.click } >
				+
			</div>
		);
	}   //  render()

	componentDidMount() {
	}	//	componentDidMount()

}   //  class TabAdd

export default TabAdd;
