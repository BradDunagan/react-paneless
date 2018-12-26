/*
		 1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890

*/

import React, { Component } from 'react';
import MenuItem				from './menu-item'

import {diag, diagsFlush, diagsPrint} 	from './diags';


class MenuItemsSeparator extends Component {
	constructor ( props ) {
		super ( props );

	}	//	constructor

	doAll ( o ) {
	}	//	doAll()

	render() {
		return (
			<div className	= 'rr-menu-items-separator' >
			</div>
		);
	}   //  render()

	componentDidMount() {
	}	//	componentDidMount()

}	//	class	MenuItemsSeparator

class BurgerMenu extends Component {
	constructor ( props ) {
		super ( props );

		this.setGlobalActiveMenuFnc 
			= this.setGlobalActiveMenuFnc.bind ( this );
		this.selectItem	= this.selectItem.bind ( this );
		this.setCurItem	= this.setCurItem.bind ( this );
		this.keyDown	= this.keyDown.bind ( this );
		this.mouseEnter	= this.mouseEnter.bind ( this );
		this.mouseLeave	= this.mouseLeave.bind ( this );
		this.click		= this.click.bind ( this );
		this.doAll 		= this.doAll.bind ( this );

		this.state = {
			listItems:  []
		};

		this.curItem = null;

		this.itemEleIdPrefix = 'rr-menu-item-'

	}	//	constructor

	setGlobalActiveMenuFnc ( fnc ) {
		this.props.appFrameFnc ( { do:	'set-call-down',
								   to:	'active-menu',
								   fnc:	fnc } );
	}	//	setGlobalActiveMenuFnc()

	selectItem ( i ) {
		this.props.screenFnc ( { do: 'menu-dismiss' } );
		this.setGlobalActiveMenuFnc ( null );
		let item = this.props.items[i];
		if ( item.fnc ) {
			item.fnc ( null ); 
			return; }
		this.props.upFnc ( { do: 			this.props.ctx.after,
							 menuItemText:	item.text } );
	}	//	selectItem()

	setCurItem ( i, ele ) {
		if ( this.curItem && this.curItem.ele ) {
			this.curItem.ele.style.backgroundColor = 'white'; }
		if ( ! ele ) {
			ele = document.getElementById ( this.itemEleIdPrefix + i ); }
		if ( ! ele ) {
			return; }
		ele.style.backgroundColor = 'lightgray';
		this.curItem = {
			idx:	i,
			ele:	ele };
	}	//	setCurItem()

	keyDown ( ev ) {
		let sW = 'BurgerMenu keyDown()';
	//	console.log ( sW + '  ' + ev.key );
		if ( ev.key === 'Enter' ) {
			if ( this.curItem ) {
				this.selectItem ( this.curItem.idx );
				return true; }
			return false; }
		let i, j;
		let items  = this.props.items;
		let nItems = items.length;
		if ( ev.key === 'ArrowDown' ) {
			i = this.curItem ? this.curItem.idx + 1 : 0;
			if ( i >= nItems ) {
				i = 0; }
			j = i;
			while ( items[i].type !== 'item' ) {
				i += 1;
				if ( i >= nItems ) {
					i = 0; }
				if ( j === i ) {
					return true; } }
			this.setCurItem ( i );
			return true;	}
		if ( ev.key === 'ArrowUp' ) {
			i = this.curItem ? this.curItem.idx - 1 : nItems - 1;
			if ( i < 0 ) {
				i = nItems - 1; }
			j = i;
			while ( items[i].type !== 'item' ) {
				i -= 1;
				if ( i < 0 ) {
					i = nItems - 1; }
				if ( j === i ) {
					return true; } }
			this.setCurItem ( i );
			return true; }
		for ( i = 0; i < nItems; i++ ) {
			let item = items[i];
			if ( ! item.hotkey ) {
				continue; }
			if ( item.hotkey === ev.key ) {
				this.selectItem ( i );
				return true; }
		}	//	for
		return false;
	}	//	keyDown()

	mouseEnter ( i, ev ) {
		let sW = 'BurgerMenu mouseEnter()';
	//	console.log ( sW + '  ' + ev.target.innerText );
		this.setCurItem ( i );
	}	//	mouseEnter()

	mouseLeave ( i, ev ) {
		let sW = 'BurgerMenu mouseLeave()';
	//	console.log ( sW + '  ' + ev.target.innerText );
	//	ev.target.style.backgroundColor = 'white';
		let ele = document.getElementById ( this.itemEleIdPrefix + i );
		ele.style.backgroundColor = 'white';
		this.curItem = null;
	}	//	mouseLeave()
	
	click ( i, ev ) {
		let sW = 'BurgerMenu click()';
	//	console.log ( sW + '  ' + ev.target.innerText );
		ev.stopPropagation();
		this.selectItem ( i );
	}	//	click()

	doAll ( o ) {
		if ( o.do === 'is-app-title-menu' ) {
			let ctx = this.props.ctx;
			if ( (! ctx) || (typeof ctx.what !== 'string') ) {
				return false; }
			return ctx.what === 'app title';
		}
		if ( o.do === 'keyboard-escape' ) {
			this.props.screenFnc ( { do: 'menu-dismiss' } );
			this.setGlobalActiveMenuFnc ( null );
			return;
		}
		if ( o.do === 'keyboard-key-down' ) {
			return this.keyDown ( o.ev );
		}
	}	//	doAll()

	render() {
		return (
			<div id			= { this.props.eleId }
				 style		= { this.props.style }
				 className	= 'rr-burger-menu' >
				<ul>
					{this.state.listItems}
				</ul>
			</div>
		);
	}   //  render()

	componentDidMount() {
		this.setGlobalActiveMenuFnc ( this.doAll );
		let menuItems = this.props.items;
		let listItems = [];
		let i = 0;
		for ( ; i < menuItems.length; i++ ) {
			let mi = menuItems[i];
			if ( mi.type === 'separator' ) {
				listItems.push ( 
					<li key		= { i }
						idx		= { i } >
						<MenuItemsSeparator />
					</li> );
				continue; }

			listItems.push ( 
				<li key		= { i }
					idx		= { i }
					id		= { this.itemEleIdPrefix + i }
					onMouseEnter	= { this.mouseEnter.bind ( this, i ) }
					onMouseLeave	= { this.mouseLeave.bind ( this, i ) }
					onClick			= { this.click.bind ( this, i ) } >
			{ /*	{ mi.text }		*/ }
					<MenuItem text 		= { mi.text }
							  hotkey	= { mi.hotkey } />
				</li> );
		}
		this.setState ( { listItems: listItems }, () => {
			this.setCurItem ( 0 )
		} );
	}	//	componentDidMount()


}   //  class BurgerMenu

export default BurgerMenu;
