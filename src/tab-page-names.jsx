/*
		 1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890

*/

import React, { Component } from 'react';

import TabName				from './tab-name';
import TabAdd				from './tab-add';
import { getNextTabId }	from './tab-next-id';

/*
let lastTabNameId = 0;
*/

//	chris
//		think of no-sql?
//
//	(me)
//
//	william
//
//	tony vinson
//		mlgw - retired
//
//	michael
//		works for an engineering firm
//
//	tim
//		a couple of personal projects
//
//	atichin (?)
//		fastcoach.net
//		magicstat.co
//		will help people get python work
//
//	stewart
//		
//	kenneth wright
//		data analyst at FedEx


class TabPageNames extends Component {
	constructor ( props ) {
		super ( props );

//		this.addTabPageName		= this.addTabPageName.bind ( this );
//		this.setPageNamesState	= this.setPageNamesState.bind ( this );
		this.doAll 				= this.doAll.bind ( this );

		this.state = {
			names: [],
		};
		
		this.addEleId = 'rr-tab-add-' + getNextTabId();
//		this.nameFncs = {};
//		this.names = {};
//		this.selectedNameEleId = null;

		props.tabsFnc ( { do:		'set-call-down',
						  to:		'tab-page-names',
						  namesFnc:	this.doAll } );
	}	//	constructor
	

//	addTabPageName ( text, fnc ) {
//		let nameId = getNextTabId();
//		let eleId  = 'rr-tab-name-' + nameId;
//
//		this.names[eleId] = { tnId:		nameId,
//							  text:		text ? text : null,
//							  name:		null };
//		this.setPageNamesState ( fnc, eleId );
//
//	}	//	addTabPageName()

//	setPageNamesState ( fnc, prm ) {
//		const sW = 'TabPageNames setPageNamesState()';
//		let tna = [];		//	Tab Name Array
//		let key = 0;
//		for ( var eleId in this.names ) {
//			tna.push ( ' ' + eleId ); }
//		console.log ( sW + ' PN eleIds: ' + tna );
//		tna = [];
//		for ( var eleId in this.names ) {
//			let d = this.names[eleId];
//			d.name = <TabName key 		= { ++key }
//							  tnId 		= { d.tnId }
//							  eleId		= { eleId }
//							  text		= { d.text }
//							  namesFnc	= { this.doAll }
//							  tabsFnc 	= { this.props.tabsFnc } />;
//			tna.push ( d.name );
//		}
//		this.setState ( { names: tna }, () => {
//			if ( fnc ) {
//				fnc ( prm ); }
//		} );
//	}	//	setPageNamesState()

	doAll ( o ) {
	//	if ( o.do === 'set-call-down' ) {
	//		if ( o.to === 'tab-name' ) {
	//			this.nameFncs[o.nameEleId] = o.nameFnc;
	//		}
	//		return;
	//	}
	//	if ( o.do === 'name-click' ) {
	//		if ( this.selectedNameEleId ) {
	//			this.nameFncs[this.selectedNameEleId] ( 
	//				{ do: 		'select',
	//				  selected:	false } ); }
	//		this.nameFncs[o.nameEleId] ( 
	//			{ do: 		'select',
	//			  selected:	true } );
	//		this.selectedNameEleId = o.nameEleId;
	//		return;
	//	}
	}

	render() {
	//	return (
	//		<div id			= { this.props.eleId }
	//			 className	= 'rr-tab-page-names' >
	//			{this.state.names}
	//			<TabAdd eleId 	= { this.addEleId }
	//					tabsFnc = { this.props.tabsFnc }/>
	//		</div>
	//	);
		return (
			<div id			= { this.props.eleId }
				 className	= 'rr-tab-page-names' >
				{this.props.names}
				<TabAdd eleId 	= { this.addEleId }
						tabsFnc = { this.props.tabsFnc }/>
			</div>
		);
	}   //  render()

	componentDidMount() {
	//	this.addTabPageName ( 'Name One', ( eleId ) => {
	//		this.nameFncs[eleId] ( { do: 		'select',
	//								 selected:	true } );
	//		this.selectedNameEleId = eleId;
	//	} );
	}	//	componentDidMount()

}	//  class TabPageNames

export default TabPageNames;
