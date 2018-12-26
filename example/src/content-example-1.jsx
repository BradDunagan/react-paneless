
import React, { Component } from 'react';

import { diag, 
		 diagsFlush, 
		 diagsPrint } 	from 'paneless';

let example1Count = 0;

class ContentExample1 extends Component {
	constructor ( props ) {
		super ( props );
		const sW = 'ContentExample1 constructor()'
		diag ( [1, 2, 3], sW );
		this.click          = this.click.bind ( this );
		this.burgerClick    = this.burgerClick.bind ( this );
		this.doAll          = this.doAll.bind ( this );

		this.isMountified = false;

		this.state = {
			style:	{
				visibility:	'hidden',		//	Until 'init-new' or possibly
			},								//	'set-state'.
			text:		'',
			nClicks:    '',
		};

	//	this.data = {
	//		nClicks:    0,
	//	};

	//	this.props.appContentFnc ( { do:        'set-call-down',
	//								 to:        'client-content',
	//								 frameId:   this.props.frameId,
	//								 paneId:	this.props.paneId,
	//								 fnc:       this.doAll } );
	}	//	constructor()

	click ( ev ) {
		const sW = 'ContentExample1 click()';
	//	this.data.nClicks += 1;
	//	console.log ( sW + ': nClicks ' + this.data.nClicks );
		let nClicks = this.state.nClicks;
		this.setState ( { nClicks: ++nClicks } );
	//	console.log ( sW + ': nClicks ' + nClicks );
	}   //  click()

	burgerClick ( o ) {
		let sW = 'ContentExample1 burgerClick()';
	//	console.log ( sW );
		let pe = document.getElementById ( o.paneEleId );
		let r  = pe.getBoundingClientRect();
		this.props.appFrameFnc ( { 
			do: 		'show-menu',
			menuEleId:	this.props.eleId + '-burger-menu',
			menuX:		r.x - 1,
			menuY:		r.y - 1,
			menuItems:	[ { type: 'item', text: 'Client' },
						  { type: 'item', text: 'Content' },
						  { type: 'item', text: 'Burger' },
						  { type: 'item', text: 'Menu' },
						  { type: 'item', text: 'Items' } ],
			upFnc:		this.doAll,
			ctx:		{ what:		'content example-1 burger',
						  after:	'menu-item' }
		} );
	}	//	burgerClick()

	doAll ( o ) {
		let sW = 'ContentExample1 doAll() ' + o.do;
		if ( o.to ) {
			sW += ' to ' + o.to; }
		diag ( [1, 2, 3], sW );
		//	'init-new' is commanded  * one *  time in the entire life time
		//	of the data of this component - that includes multiple lifes of 
		//	this component as an element in the DOM because of things like 
		//	pane splits, persisting, etc.  In other words, talking about the 
		//	life time of the data not just life in the DOM.
		if ( o.do === 'init-new' ) {
			this.setState ( {
				style: {
					visibility:	'visible',
				},
				text:		'ContentExample1-' + ++example1Count,
				nClicks:    0,
			} );
			return;
		}
		if ( o.do === 'get-state' ) {
			return { state: Object.assign ( {}, this.state ) };
		}
		if ( o.do === 'set-state' ) {
		//	this.setState ( o.state.state );
			if ( ! this.isMountified ) {
				this.state = o.state.state; }
			else {
				this.setState ( o.state.state ); }
			return;
		}
	//	if ( o.do === 'pane-burger-click' ) {
	//		this.burgerClick ( o );
	//		return;
	//	}
		if ( o.do === 'append-menu-items' ) {
			let a = o.menuItems;
			a.push ( { type: 'item', text: 'Client' } );
			a.push ( { type: 'item', text: 'Content' } );
			a.push ( { type: 'item', text: 'Burger' } );
			a.push ( { type: 'item', text: 'Menu' } );
			a.push ( { type: 'item', text: 'Items' } );
			return;
		}
		if ( o.do === 'menu-item' ) {
			//	Return true if the menu item is handled here.
			return false;
		}
	}	//	doAll()

	render() {
		const sW = 'ContentExample1 render()'
		diag ( [1, 2, 3], sW );
		return (
			<div id         = { this.props.eleId }
				 className  = 'rr-app-content-exampe-1'
				 style		= { this.state.style }
				 onClick    = { this.click } >
				<p>{ this.state.text }</p>
				<p>nClicks: { this.state.nClicks }</p>
			</div>
		);
	}	//	render()

	componentDidMount() {
		const sW = 'ContentExample1 componentDidMount()'
		diag ( [1, 2, 3], sW );
		this.isMountified = true;

		this.props.appContentFnc ( { do:        'set-call-down',
									 to:        'client-content',
									 frameId:   this.props.frameId,
									 paneId:	this.props.paneId,
									 fnc:       this.doAll } );

		//	This must be done here (after mounting) because it results 
		//	in this being commanded 'init-new' which sets state.
		//	However, with the check of this.isMountified in that command
		//	handler (see o.do === 'set-state' above), this may not matter.
		this.props.clientAppFnc ( { do: 		'set-call-down',
									to:			'client-content',
									paneId:		this.props.paneId,
									fnc:		this.doAll } );
	}	//	componentDidMount()

	componentDidUpdate() {
		const sW = 'ContentExample1 componentDidUpdate()';
		diag ( [1, 2, 3], sW );
	}	//	componentDidUpdate()

	componentWillUnmount() {
		const sW = 'ContentExample1 componentWillUnmount()';
		diag ( [1, 2, 3], sW );
	}	//	componentWillUnmount()

} //  class ContentExample1

export default ContentExample1;
