/*
		 1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890

*/

import React, { Component } from 'react';

import TabPages 			from './tab-pages';
import TabPageNames			from './tab-page-names';
import Pane, { getPaneId }	from './pane';
import TabName				from './tab-name';
import { getNextTabId }		from './tab-next-id';

import {diag, diagsFlush, diagsPrint} 	from './diags';

class Tabs extends Component {
	constructor ( props ) {
		const sW = 'Tabs constructor()';
		diag ( [1,2,3], sW );
		super ( props );

		this.state = {
			page:	null,
			names:  [],
		};

		this.stateStack = [];
		
		this.tabPagesEleId		= props.eleId + '-pages';
		this.tabPageNamesEleId 	= props.eleId + '-names';

		this.addTabPageName		= this.addTabPageName.bind ( this );
		this.showPage			= this.showPage.bind ( this );
		this.setPageNamesState	= this.setPageNamesState.bind ( this );
		this.selectTab			= this.selectTab.bind ( this );
		this.addTab				= this.addTab.bind ( this );
		this.nameTab			= this.nameTab.bind ( this );
		this.nameTabName		= this.nameTabName.bind ( this );
		this.oSetState2			= this.oSetState2.bind ( this );
		this.oSetState			= this.oSetState.bind ( this );
		this.pushState			= this.pushState.bind ( this );
		this.submitState		= this.submitState.bind ( this );

		this.doAll = this.doAll.bind ( this );

		this.isMountified 	= false;
		this.oState 		= null;

	//	this.pageFncs = {};
		this.pages = {};

		this.nameFncs = {};
		this.names = {};
		this.selectedNameEleId = null;

		props.paneFnc ( { do:		'set-call-down',
						  to:		'tabs',
						  tabsFnc:  this.doAll } );
	}	//	constructor
	

	addTabPageName ( paneId, text, cbPageName ) {

		let tabId  = getNextTabId();
		if ( paneId === 0 ) {
			paneId = getPaneId(); }

		this.props.clientFnc ( {
			do:			'define-pane-content',
			frameId:	this.props.frameId,
			paneId:		paneId
		} );

		this.pages[tabId] = { 
			page: (
				<Pane key 			= { tabId }
					  frameId 		= { this.props.frameId }
					  atFrameTop	= { this.props.atFrameTop }
					  paneId 		= { paneId }
					  tabId			= { tabId }
					  tabsFnc		= { this.doAll }
					  peId			= { this.props.peId }
					  frameFnc		= { this.props.frameFnc } 
					  parentFnc		= { this.props.paneFnc }
					  style 		= { null }
					  clientFnc		= { this.props.clientFnc }
					  tabs			= { false } /> ),
			paneId: 	paneId,
			paneFnc:	null,
		//	state:		null 
		};

		let eleId = 'rr-tab-name-' + tabId;
		this.names[eleId] = { tabId:	tabId,
							  text:		text ? text : null };
		this.setPageNamesState ( cbPageName, eleId );

	}	//	addTabPageName()

	showPage ( tabId ) {
	//	this.setState ( { page:  this.pages[tabId].page }, () => {
		let self = this;
		this.pushState ( null,
						 { page:  this.pages[tabId].page }, 
						 () => {
			let page = self.pages[tabId];
		//	if ( page.state ) {
		//		page.paneFnc ( { do: 		'set-state',
		//						state:		page.state } ); }
			if ( page.paneFnc ) {
				//	paneFnc() will load state from client app.
				page.paneFnc ( { do: 'set-state' } ); }
		} );
	}	//	showPage()

	setPageNamesState ( cbPageName, prmPageName ) {
		const sW = 'TabPageNames setPageNamesState()';
		let tna = [];		//	Tab Name Array
		let key = 0;
		for ( var eleId in this.names ) {
			tna.push ( ' ' + eleId ); }
		console.log ( sW + ' PN eleIds: ' + tna );
		tna = [];
		for ( var eleId in this.names ) {
			let d = this.names[eleId];
			d.name = <TabName key 		= { ++key }
							  tabId		= { d.tabId }
							  eleId		= { eleId }
							  text		= { d.text }
						//	  namesFnc	= { this.doAll }
							  tabsFnc 	= { this.doAll } />;
			tna.push ( d.name );
		}
	//	this.setState ( { names: tna }, () => {
		this.pushState ( null, { names: tna }, () => {
			if ( cbPageName ) {
				cbPageName ( prmPageName ); }
		} );
	}	//	setPageNamesState()

	selectTab ( eleId ) {
		if ( this.selectedNameEleId ) {
			let page = this.pages[this.names[this.selectedNameEleId].tabId];
		//	page.state = page.paneFnc ( { do: 'get-state' } );
			//	Have the pane get its state and store it in the client app.
			page.paneFnc ( { do: 'get-state' } );
			this.nameFncs[this.selectedNameEleId] ( { do: 		'select',
													  selected:	false } ); 
		}
		this.nameFncs[eleId] ( { do: 		'select',
								 selected:	true } );
		this.selectedNameEleId = eleId;
		this.showPage ( this.names[eleId].tabId );
	}	//	selectTab()

	addTab ( cb ) {
		let self = this;
		this.addTabPageName ( 0, 'Tab Name', ( eleId ) => {
			self.nameFncs[eleId] ( { do: 		'select',
									 selected:	true } );
			self.selectTab ( eleId );
			if ( cb ) {
				cb ( eleId ); }
		} );
	}	//	addTab()

	nameTab ( o ) {
		let curName = '';
		for ( var eleId in this.names ) {
			let d = this.names[eleId];
			if ( d.tabId !== o.tabId ) {
				continue; }
			curName = d.text;
			break; }
		this.props.frameFnc ( { do: 	'show-name-dlg',
								upFnc: 	this.doAll,
								ctx: 	{ title:	'Tab Name',
										  curName:	curName,
										  after: 	'name-tab-name',
										  tabId:	o.tabId } } );
	}	//	nameTab()

	nameTabName ( o ) {
		for ( var eleId in this.names ) {
			let d = this.names[eleId];
			if ( d.tabId !== o.ctx.tabId ) {
				continue; }
			d.text = o.name;
			this.setPageNamesState ( null);
			break; }
	}	//	nameTabName()
	
	oSetState2 ( o ) {
		let self = this;
		let selectedEleId = null;
		let names = Object.entries ( o.state.names );
		let i = 0, len = names.length;
		function eachName() {
			if ( i >= len ) {
				if ( (len === 0) || ! selectedEleId ) {
					return;	}
				self.nameFncs[selectedEleId] ( { do: 		'select',
												 selected:	true } );
				self.selectTab ( selectedEleId );
				return; }
			let name = names[i++]
			let page = o.state.pages[name[1].tabId];
			self.addTabPageName ( page.paneId, name[1].text, ( eleId ) => {
				if ( name[0] === o.state.selectedNameEleId ) {
					selectedEleId = eleId; }
				eachName();
			} );
		}	//	eachName()
		eachName();
	}	//	oSetState2();

	oSetState ( o ) {
		let self = this;
		//	First, clear - no tabs.
	//	this.setState ( { page: 	null,
	//					  names:	[] }, () => {
		this.pushState ( () => {
			self.pages 		= {};			//	after all pending states are
			self.nameFncs 	= {};			//	set, before the next state
			self.names 		= {};
		},
		{ page: 	null,					//	the next state
		  names:	[] }, 
		() => {
			//	Now restore tabs (add).		//	after the next state
			self.oSetState2 ( o );
		} );
	}	//	oSetState()

	pushState ( cbBfor, s, cbAftr ) {
		if ( (! this.isMountified) || (this.stateStack.length > 0) ) {
			this.stateStack.push ( { state: s, bfor: cbBfor, aftr: cbAftr } );
			return; }
		if ( cbBfor ) {
			cbBfor(); }
		this.setState ( s, cbAftr );
	}	//	pushState()

	submitState() {
		if ( this.stateStack.length < 1 ) {
			return; }
		let s = this.stateStack[0];
		if ( s.bfor ) {
			s.bfor(); }
	//	this.setState ( s.state, s.aftr );
		this.setState ( s.state );		//	Execute s.aftr in 
										//	componentDidUpdate()
	}	//	submitState()

	doAll ( o ) {
		let sW = 'Tabs doAll() ' + o.do;
		if ( o.to ) {
			sW += ' to ' + o.to; }
		diag ( [1,2,3], sW );
		if ( o.do === 'set-call-down' ) {
			if ( o.to === 'tab-name' ) {
				this.nameFncs[o.nameEleId] = o.nameFnc;
				return;
			}
			if ( o.to === 'tab-page-pane' ) {
				let pg = this.pages[o.tabId];
				if ( ! pg ) {
					if ( ! o.tabPaneFnc ) {
						return; }
					diag ( [], sW + ' set-call-down to tab-page-pane'
								  + ' ERROR: page not found');
					return; }
				this.pages[o.tabId].paneFnc = o.tabPaneFnc;
				return;
			}
			return;
		}
		if ( o.do === 'name-click' ) {
			this.selectTab ( o.nameEleId );
			return;
		}
		if ( o.do === 'add-tab' ) {
			this.addTab();
			return;
		}
		if ( o.do === 'name-tab' ) {
			this.nameTab ( o );
			return;
		}
		if ( o.do === 'name-tab-name' ) {
			this.nameTabName ( o );
			return;
		}
		if ( o.do === 'get-state' ) {
			let names = {};
			let pages = {};
			for ( let eleId in this.names ) {
				let name = this.names[eleId];
				names[eleId] = { tabId: name.tabId,
								 text:	name.text };
				let page = this.pages[name.tabId];
				pages[name.tabId] = {
					paneId:		page.paneId,
				}
				if ( eleId === this.selectedNameEleId ) {
					page.paneFnc ( { do: 'get-state' } );
				}
			}
			let state = {
				selectedNameEleId:	this.selectedNameEleId,
				names:				names,
				pages:				pages
			};
			return state;
		}
		if ( o.do === 'set-state' ) {
		//	if ( ! this.isMountified ) {
		//		this.oState = o;
		//		return; }
			this.oSetState ( o );
			return;
		}
	}	//	doAll()

	render() {
		let sW = 'Tabs render()';
		diag ( [1,2,3], sW );
		return (
			<div id			= { this.props.eleId }
				 className	= 'rr-tabs' >
				<TabPages eleId		= { this.tabPagesEleId }
						  peId		= { this.props.peId }
						  frameFnc 	= { this.props.frameFnc }
						  paneFnc 	= { this.props.paneFnc }
						  page		= { this.state.page } />
				<TabPageNames eleId		= { this.tabPageNamesEleId }
							  tabsFnc	= { this.doAll } 
							  paneFnc 	= { this.props.paneFnc } 
							  names		= { this.state.names } />
			</div>
		);
	}   //  render()

	componentDidMount() {
		let sW = 'Tabs componentDidMount()';
		diag ( [1,2,3], sW );
	//	this.addTabPageName ( 0, 'Tab Name', ( eleId ) => {
	//		this.nameFncs[eleId] ( { do: 		'select',
	//								 selected:	true } );
	//		this.selectedNameEleId = eleId;
	//	} );
	
	//	this.addTab ( () => {
	//	//	if ( this.oState ) {
	//	//		this.oSetState ( this.oState );
	//	//		this.oState = null; }
	//		this.submitState()
	//	} );
	
	//	this.addTab();
	//	this.submitState();
		this.isMountified = true;
	}	//	componentDidMount()

	componentDidUpdate() {
		let sW = 'Tabs componentDidUpdate()';
		diag ( [1,2,3], sW );
		let len = this.stateStack.length;
		let s = this.stateStack.splice ( 0, 1 );
		if ( (len > 0) && s[0].aftr ) {
			s[0].aftr(); }		
		if ( len > 1 ) {
			this.submitState(); }
	}	//	componentDidUpdate()

}   //  class Tabs

export default Tabs;
