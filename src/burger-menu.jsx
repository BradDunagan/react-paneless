/*
		 1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890

*/

import React, { Component } from 'react';

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

	selectItem ( i, menuItemText ) {
		this.props.screenFnc ( { do: 'menu-dismiss' } );
		this.setGlobalActiveMenuFnc ( null );
		let item = this.props.items[i];
		if ( item.fnc ) {
			item.fnc ( null ); 
			return; }
		this.props.upFnc ( { do: 			this.props.ctx.after,
							 menuItemText:	menuItemText } );
	}	//	selectItem()

	setCurItem ( i, ele ) {
		if ( this.curItem && this.curItem.ele ) {
			this.curItem.ele.style.backgroundColor = 'white'; }
		if ( ! ele ) {
			ele = document.getElementById ( this.itemEleIdPrefix + i ); }
		ele.style.backgroundColor = 'lightgray';
		this.curItem = {
			idx:	i,
			ele:	ele };
	}	//	setCurItem()

	keyDown ( ev ) {
		let sW = 'BurgerMenu keyDown()';
		console.log ( sW + '  ' + ev.key );
		let i;
		if ( ev.key === 'Enter' ) {
			if ( this.curItem ) {
				this.selectItem ( this.curItem.idx, 
								  this.curItem.ele.innerText ); 
				return true; }
			return false; }
		if ( ev.key === 'ArrowDown' ) {
			i = this.curItem ? this.curItem.idx + 1 : 0;
			if ( i >= this.state.listItems.length ) {
				i = 0; }
			this.setCurItem ( i );
			return true;	}
		if ( ev.key === 'ArrowUp' ) {
			i = this.curItem ? this.curItem.idx - 1 
							 : this.state.listItems.length - 1;
			if ( i < 0 ) {
				i = this.state.listItems.length - 1; }
			this.setCurItem ( i );
			return true; }
		return false;
	}	//	keyDown()

	mouseEnter ( i, ev ) {
		let sW = 'BurgerMenu mouseEnter()';
		console.log ( sW + '  ' + ev.target.innerText );
		this.setCurItem ( i, ev.target );
	}	//	mouseEnter()

	mouseLeave ( i, ev ) {
		let sW = 'BurgerMenu mouseLeave()';
		console.log ( sW + '  ' + ev.target.innerText );
		ev.target.style.backgroundColor = 'white';
		this.curItem = null;
	}	//	mouseLeave()
	
	click ( i, ev ) {
		let sW = 'BurgerMenu click()';
		console.log ( sW + '  ' + ev.target.innerText );
		ev.stopPropagation();
		this.selectItem ( i, ev.target.innerText );
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
					{ mi.text }
				</li> );
		}
		this.setState ( { listItems: listItems }, () => {
			this.setCurItem ( 0 )
		} );
	}	//	componentDidMount()


}   //  class BurgerMenu

export default BurgerMenu;
