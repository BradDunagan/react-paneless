/*
		 1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890

*/

import React, { Component } from 'react';

import Pane                 from './pane';


class TabPages extends Component {
	constructor ( props ) {
		super ( props );

	//	this.getHeight 	= this.getHeight.bind ( this );
		this.doAll 		= this.doAll.bind ( this );

		this.state = {
		//	pages: [],
		};
		
	//	this.pageFncs = {};
	//	this.pages = {};
	//	this.selectedPageEleId = null;

	//	props.paneFnc ( { do:			'set-call-down',
	//					  to:			'tab-pages',
	//					  tabPagesFnc:  this.doAll } );

	//	this.h0 = 0;
	}	//	constructor

//	getHeight() {
//		let e = document.getElementById ( this.props.eleId );
//		return e.offsetHeight;
//	}

	doAll ( o ) {
//		if ( o.do == 'size-start' ) {
//			this.h0 = this.getHeight();
//			this.propagateDown_SizeOp ( o );
//			return;
//		}
//		if ( o.do === 'size' ) {
//			let cs = this.state.containerStyle;
//			if ( cs ) {
//				this.setState ( { containerStyle: { 
//					width: '100%', 
//					height: (this.containerH0 + o.dY) + 'px' } } ); }
//		//	this.width += o.dX;
//			this.propagateDown_SizeOp ( o );
//			return;
//		}
	}

	render() {
	//	return (
	//		<div id			= { this.props.eleId }
	//			 className	= 'rr-tab-pages' >
	//			{this.state.pages}
	//		</div>
	//	);
		return (
			<div id			= { this.props.eleId }
				 className	= 'rr-tab-pages' >
				{this.props.page}
			</div>
		);
	}   //  render()

	componentDidMount() {
	//	this.paneStyle = {
	//	//	position:	'absolute',
	//		width:		'100%',
	//	//	height:		(this.getHeight() - 1) + 'px'
	//	}

	//	let tabId = this.props.eleId + '-page-' + 1;
	//	let page1 = <Pane key 		= { tabId }
	//					  tabId 	= { tabId }
	//				  	  peId 		= { this.props.peId }
	//				  	  frameFnc	= { this.props.frameFnc } 
	//				  	  parentFnc = { this.props.paneFnc }
	//					  style 	= { null }
	//				  	  tabs      = { false } />
	//	this.pages[tabId] = { page: 	page1,
	//						  paneFnc:	null };
	//						   
	//	this.setState ( { pages: [ page1 ] }, () => {
	//	} );

	}	//	componentDidMount()


}   //  class TabPages

export default TabPages;
