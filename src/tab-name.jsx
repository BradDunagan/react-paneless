/*
		 1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890

*/

import React, { Component } from 'react';

class TabName extends Component {
	constructor ( props ) {
		super ( props );

		this.click = this.click.bind ( this );
		this.doAll = this.doAll.bind ( this );

		this.state = {
			style:	{},
		//	name:	'Name'
		};
		
	//	props.namesFnc ( { do:			'set-call-down',
		props.tabsFnc  ( { do:			'set-call-down',
						   to:			'tab-name',
						   nameEleId:	props.eleId,
						   nameFnc:		this.doAll } );
	}	//	constructor
	

	click ( ev ) {
	//	this.props.namesFnc ( { do: 		'name-click',
		this.props.tabsFnc  ( { do: 		'name-click',
								nameEleId: 	this.props.eleId } );
	}	//	click()

	doAll ( o ) {
		if ( o.do === 'select' ) {
			if ( o.selected ) {
				this.setState ( { 
					style: {
						borderTop:	'solid 1px white',
						paddingTop:	'2px'
					} } );
			} else {
				this.setState ( { 
					style: {} } );
			}
			return;
		}
	}	//	doAll()

	render() {
		return (
			<div id			= { this.props.eleId }
				 className	= 'rr-tab-page-name'
				 style		= { this.state.style } 
				 onClick	= { this.click } >
				{ this.props.text }
			</div>
		);
	}   //  render()

	componentDidMount() {
	}	//	componentDidMount()

}   //  class TabName

export default TabName;
