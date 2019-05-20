/*
		 1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890

Consider "React Class Component Syntax" in -
	
	https://www.robinwieruch.de/javascript-fundamentals-react-requirements/

	Savs a lot of text, apparently. 
->	Leaving the constructor out only works when there are no props.

Also see "Map, Reduce and Filter in React" in that same article.  Good
arrow function examples/explanations in JSX.

Also -

	How to fetch data in React
	https://www.robinwieruch.de/react-fetching-data/
	
*/

import React				from 'react';
import clone 				from 'clone';

import FrameHeader			from './frame-header';
import FrameTransientHeader	from './frame-transient-header';
import Pane					from './pane';
import FrameFooter			from './frame-footer';
/*
import TitleBar 			from './title-bar'
*/
import Sizer 				from './sizer'

import {diag, diagsFlush, diagsPrint} 	from './diags';


class Frame extends React.Component {
	constructor ( props ) {
		super ( props );
		const sW = props.frameId + ' Frame constructor()';
		diag ( [1], sW );
		this.eleId 		= 'rr-frame-' + props.frameId;
		this.peId 		= props.frameId;
		this.appFnc 	= props.appFrameFnc;
		this.headerFnc	= null;
		this.footerFnc	= null;
		this.rootPaneFnc	= null;

		this.keyDown			= this.keyDown.bind ( this );
		this.zTop				= this.zTop.bind ( this );
		this.mouseDown			= this.mouseDown.bind ( this );
		this.isHeaderVisible	= this.isHeaderVisible.bind ( this );
		this.isTransientHeaderVisible = 
			this.isTransientHeaderVisible.bind ( this );
		this.getTransientHeaderStatus =
			this.getTransientHeaderStatus.bind ( this );
		this.isFooterVisible	= this.isFooterVisible.bind ( this );
		this.burgerClick		= this.burgerClick.bind ( this );
		this.iconize2			= this.iconize2.bind ( this );
		this.iconize 			= this.iconize.bind ( this );
		this.destroy			= this.destroy.bind ( this );
		this.transitionEnd		= this.transitionEnd.bind ( this );
		this.clickIcon			= this.clickIcon.bind ( this );
		this.nameFrame			= this.nameFrame.bind ( this );
		this.nameFrameName		= this.nameFrameName.bind ( this );
		this.setBorderColor		= this.setBorderColor.bind ( this );
		this.startPaneFocusTimer =
			this.startPaneFocusTimer.bind ( this );
		this.cyclePaneFocus		= this.cyclePaneFocus.bind ( this );
		this.refocusPane		= this.refocusPane.bind ( this );
		this.unfocusPane		= this.unfocusPane.bind ( this );
		this.keyBurgerMenu		= this.keyBurgerMenu.bind ( this );
		this.doAll 				= this.doAll.bind ( this );

		/*	From persistence - as an icon -
		*/
		if ( props.iconized ) {
			let icon = props.iconized;
			this.state = {
				frameName:	  props.frameName 
							? props.frameName
							: 'Paneless Frame - ' + props.frameId,
			//	titleBar:	null,
				iconized: {
					hdrVisible:		icon.hdrVisible,
					ftrVisible:		icon.ftrVisible,
					style: {
						left:	icon.style.left,
						top: 	icon.style.top,
						width:	icon.style.width,
						height:	icon.style.height,
						borderColor:	'black',
					 },
					iconName: { visibility: 'visible' } }, 
				style: {
					left:   props.left,
					top:    props.top,
					width:  props.width,
					height:	props.height,
					borderColor:	'black',
				},
				contentRestoreIncomplete:	false
			};
			if ( icon.hdrVisible ) {
				this.state.normalHeader = ( 
					<FrameHeader frameId 	= { this.props.frameId }
							 	 frameName	= { this.state.frameName }
								 frameFnc	= { this.doAll } /> );
				this.state.transientHeader = null;
			}
			else {
				this.state.normalHeader = null;
				this.state.transientHeader = (
					<FrameTransientHeader frameId 	= { this.props.frameId }
							 	 		  frameName	= { this.state.frameName }
								 		  frameFnc	= { this.doAll } /> );
			}
		} else {
			this.state = {
				frameName:	  props.frameName 
							? props.frameName
							: 'Paneless Frame - ' + props.frameId,
				iconized:	null,
				style: {
					left:	props.left,
					top:	props.top,
					width:	props.width,
					height:	props.height,
					borderColor:	'black',
				},
				ftrVisible:		props.ftrVisible,
				contentRestoreIncomplete:	false
			};
			if ( props.hdrVisible ) {
				this.state.normalHeader = ( 
					<FrameHeader frameId 	= { this.props.frameId }
							 	 frameName	= { this.state.frameName }
								 frameFnc	= { this.doAll } /> );
				this.state.transientHeader = null;
			}
			else {
				this.state.normalHeader = null;
				this.state.transientHeader = (
					<FrameTransientHeader frameId 	= { this.props.frameId }
							 	 		  frameName	= { this.state.frameName }
								 		  frameFnc	= { this.doAll } /> );
			}
		}



		this.iconSlot					= null;
		this.contentState 				= null;

		this.mouseInTopPaneButtonBar 	= false;

		this.focusedPaneId				= 0;
		this.paneFocusTimeoutId 		= 0;

		this.isShowingBurgerMenu 		= false;

		this.beingDestroyed				= false;
		
	}	//	constructor()

	zTop() {
		this.props.appContentFnc ( { do: 		'ensure-frame-z-is-top',
									 frameId:	this.props.frameId } );
	}	//	zTop()

	keyDown ( o ) {
		let sW = 'Frame keyDown()';
	//	console.log ( sW + '  ' + o.ev.key );
		if ( this.state.iconized ) {
			if ( o.ev.key === 'Enter' ) {
				this.clickIcon ( null ); 		//	Un-iconize.
				return true; }
			return false; }
		if ( o.ev.shiftKey && (o.ev.key === ' ') ) {
			this.doAll ( { do: 'frame-burger-click' } );
			return true; }
		return false;
	}	//	keyDown()

	mouseDown ( ev ) {
		let sW = 'Frame mouseDown()';
	//	console.log ( sW );
		this.props.appContentFnc ( { do:		'set-frame-focus',
									frameId:	this.props.frameId } );
	}	//	mouseDown()

	isHeaderVisible() {
	//	let isHdrVisible = false;
	//	if ( this.headerFnc ) {
	//		isHdrVisible = this.headerFnc ( { do: 'is-visible' } ); }
	//	return isHdrVisible;
		return !! this.state.normalHeader;
	}	//	isHeaderVisible()

	isTransientHeaderVisible() {
		if ( this.isHeaderVisible() ) {
			return false; }
		let isHdrVisible = false;
		if ( this.headerFnc ) {
			isHdrVisible = this.headerFnc ( { do: 'is-visible' } ); }
		return isHdrVisible;
	}	//	isTransientHeaderVisible()

	getTransientHeaderStatus() {
		if ( this.isHeaderVisible() ) {
			return null; }
		if ( this.headerFnc ) {
			return this.headerFnc ( { do: 'get-status' } ); }
		return null;
	}	//	getTransientHeaderStatus()

	isFooterVisible() {
		let isFtrVisible = false;
		if ( this.state.iconized ) {
			isFtrVisible = this.state.iconized.ftrVisible; }
		else {
			if ( this.footerFnc ) {
				isFtrVisible = this.footerFnc ( { do: 'is-visible' } ); } }
		return isFtrVisible;
	}	//	isFooterVisible()

	burgerClick() {
		let sW = 'Frame burgerClick()';
	//	console.log ( sW );
		let fe = document.getElementById ( this.eleId );
		let r  = fe.getBoundingClientRect();
		let itemTextHdr = this.isHeaderVisible() ? 'Hide Header' 
												 : 'Show Header';
		let itemTextFtr = this.isFooterVisible() ? 'Hide Footer' 
												 : 'Show Footer';
		let menuItems = [ 
			{ type: 'item', 		text: 'Frame Name ...' },
			{ type: 'item', 		text: itemTextHdr },
			{ type: 'item', 		text: itemTextFtr } ];

		let clientItems = [];
		this.props.clientFnc( {
			do:			'append-menu-items',
			to:			'frame-burger',
			frameId:	this.props.frameId,
			menuItems:	clientItems } );
		if ( clientItems.length > 0 ) {
			if ( menuItems.length > 0 ) {
				menuItems.push ( {type: 'separator', 	text: '' } ); }
			menuItems = menuItems.concat ( clientItems ); }

		this.appFnc ( { 
			do: 		'show-menu',
			menuEleId:	this.eleId + '-burger-menu',
			menuX:		r.x,
			menuY:		r.y,
			menuItems:	menuItems,
			upFnc:		this.doAll,
			ctx:		{ what:		'frame burger',
						  dismiss:	'burger-menu-dismissed',
						  after:	'menu-item' }
		} );
		this.isShowingBurgerMenu = true;
	}	//	burgerClick()

	iconize2() {
		let self = this;
		window.setTimeout ( () => {
			let hdrVisible  = self.state.iconized.hdrVisible;
			let ftrVisible  = self.state.iconized.ftrVisible;
			let borderColor = self.state.iconized.style.borderColor;
			self.setState ( { iconized: { 
				hdrVisible:	hdrVisible,
				ftrVisible:	ftrVisible,
				style: {
				//	left:		'20px',
				//	top: 		'20px',
					left:		self.iconSlot.x + 'px',
					top: 		self.iconSlot.y + 'px',
					width:		'50px',
					height:		'60px',
					borderColor:	borderColor,
					transitionProperty: 	'left, top, width, height',
					transitionDuration:		'200ms' },
				iconName: {
					visibility: 	'hidden' },
				titleBar: null,
			} } );
			self.iconSlot = null;
			self.rootPaneFnc = null;
		}, 50 );
	}	//	iconize2()

	iconize ( o ) {
		let sW = this.props.frameId + ' Frame iconize()';
		diagsFlush();
		diagsPrint ( sW, 2, 2000 );
		diag ( [2], sW );
		this.contentState = this.rootPaneFnc ( { do: 'get-state' } );
		this.setState ( { titleBar: null,
						  iconized: { 
			hdrVisible:		this.isHeaderVisible(),
			ftrVisible:		this.isFooterVisible(),
			style: {
				left:		this.state.style.left,
				top: 		this.state.style.top,
				width:		this.state.style.width,
				height:		this.state.style.height,
				borderColor:	this.state.style.borderColor,
				transitionProperty: 	'left, top, width, height',
				transitionDuration:		'200ms' },
			iconName: {
				visibility: 	'hidden',
			}
		} } );
		if ( ! this.iconSlot ) {
			this.iconSlot = this.props.appContentFnc ( { 
				do: 		'get-icon-slot',
				frameId: 	this.props.frameId } ); 
		}
		this.iconize2();
	}	//	iconize()

	destroy ( o ) {
		const sW = this.props.frameId + ' Frame destroy()';
		console.log ( sW );
		this.beingDestroyed = true;
		this.props.appContentFnc( { do:			'destroy-frame',
								 	frameId:	this.props.frameId } );
	}	//	destroy();

	transitionEnd ( ev ) {
		let sW = 'transitionEnd()';
	//	console.log ( sW );
		//	This fires for each of the left, top, width, height transition
		//	properties. That is, four times.  Simply set the icon's name 
		//	visiblity on the event that indicates one of the transitions 
		//	to icon is ended.
		if ( this.state.iconized.iconName.visibility !== 'visible' ) {
			let icon = this.state.iconized;
			this.setState ( { iconized: {
				hdrVisible:		icon.hdrVisible,
				ftrVisible:		icon.ftrVisible,
				style: {
					left:		icon.style.left,
					top: 		icon.style.top,
					width:		icon.style.width,
					height:		icon.style.height,
					borderColor:	icon.style.borderColor,
					transitionProperty: 	'left, top, width, height',
					transitionDuration:		'200ms' },
				iconName: { visibility: 'visible' } } 
			} );
		}
	}	//	transitionEnd()

	clickIcon ( ev ) {
		let sW = this.props.frameId + ' Frame clickIcon()';
		diagsFlush();
		diagsPrint ( sW, 2, 2000 );
		diag ( [2], sW );
		let iconized = null;
		if ( this.state.iconized ) {
			iconized = clone ( this.state.iconized ); }
		//	First, transition to the frame's position and size.
		let style 		= this.state.style;
		let borderColor = this.state.iconized.style.borderColor;
		this.setState ( { 
			iconized: { 
				style: {
					left:		style.left,
					top: 		style.top,
					width:		style.width,
					height:		style.height,
					borderColor:	borderColor,
					transitionProperty: 	'left, top, width, height',
					transitionDuration:		'200ms' },
				iconName: {
					visibility:		'hidden'
				} },
			style: {
				left:		style.left,
				top: 		style.top,
				width:		style.width,
				height:		style.height,
				borderColor:	borderColor,
			}
		} );
		//	Now, after a delay, restore the frame.
		let self = this;
		window.setTimeout ( () => {
			self.setState ( { iconized: 				null,
							  contentRestoreIncomplete:	true }, () => {
				if ( iconized ) {
					if ( self.headerFnc ) {
						self.headerFnc ( { 
							do: iconized.hdrVisible ? 'show' : 'hide' } ); }
					if ( self.footerFnc ) {
						self.footerFnc ( { 
							do: iconized.ftrVisible ? 'show' : 'hide' } ); }
				}
			} );
			this.props.appContentFnc ( { do:		'set-frame-focus',
										 frameId:	this.props.frameId } );
		}, 200 );
	}	//	clickIcon()

	nameFrame ( o ) {
		this.appFnc ( { do: 	'show-name-dlg',
						upFnc: 	this.doAll,
						ctx: 	{ title:	'Frame Name',
								  curName:	this.state.frameName,
								  after: 	'name-frame-name' } } );
	}	//	nameFrame()

	nameFrameName ( o ) {
		this.setState ( { frameName: o.name } );
		if ( this.headerFnc ) {
			this.headerFnc ( { do: 		'set-frame-name',
							   name:	o.name} ); }
	}	//	nameFrameName()

	setBorderColor ( color ) {
		if ( this.state.iconized ) {
			let iconized   = clone ( this.state.iconized );
			iconized.style = clone ( this.state.iconized.style );
			iconized.style.borderColor = color;
			this.setState ( { iconized: iconized } );	}
		else {
			let style = clone ( this.state.style );
			style.borderColor = color;
			this.setState ( { style: style } );	}
	}	//	setBorderColor()

	startPaneFocusTimer() {
		if ( this.paneFocusTimeoutId ) {
			window.clearTimeout ( this.paneFocusTimeoutId ); }
		this.paneFocusTimeoutId = window.setTimeout ( () => {
			this.paneFocusTimeoutId = 0;
		}, 4000 );
	}	//	startPaneFocusTimer()

	cyclePaneFocus ( o ) {
		let panes = {};
		if ( typeof this.rootPaneFnc === 'function' ) {
			this.rootPaneFnc ( { do: 	'enum-panes',
								 panes:	panes } ); }
		else {
			return null; }

		let paneFnc, paneId, paneIds = Object.keys ( panes );
		paneIds.forEach ( ( x, i ) => { 
			paneIds[i] = Number.parseInt ( x ) } );
		paneIds.sort();

		let self = this;

		function focus( i ) {
			paneId  = self.focusedPaneId = paneIds[i]
			paneFnc = panes[paneId];
			paneFnc ( { do: 'focus' } );
			self.startPaneFocusTimer();
			return paneFnc;
		}

		if ( this.focusedPaneId === 0 ) {
			if ( ! paneIds[0] ) {
				return null; }
			return focus ( 0 );
		}
		paneId = this.focusedPaneId;
		let i = paneIds.indexOf ( paneId );
		if ( i >= 0 ) {
			//	If the timeout has elapsed then show again which pane has 
			//	the focus, do not cycle. The user must repeat hitting the 
			//	keyboard key faster in order to cycle.
			if ( this.paneFocusTimeoutId === 0 ) {
				return focus ( i ); }
			panes[paneId] ( { do: 'not-focus' } ); 
			i++; 
			if ( i >= paneIds.length ) {
				i = 0; } }
		else {
			i = 0; }
		if ( paneIds[i] ) {
			return focus ( i );
		}
		return null;
	}	//	cyclePaneFocus()

	refocusPane() {
		let panes = {};
		if ( typeof this.rootPaneFnc === 'function' ) {
			this.rootPaneFnc ( { do: 	'enum-panes',
								panes:	panes } );
			if ( this.focusedPaneId > 0 ) {
				let paneFnc = panes[this.focusedPaneId];
				if ( paneFnc ) {
					paneFnc ( { do: 'focus' } ); 
					this.startPaneFocusTimer();
					return paneFnc; } } }

		let paneFnc, paneId, paneIds = Object.keys ( panes );
		if ( paneIds.length === 0 ) {
			return null; }
		paneIds.forEach ( ( x, i ) => { 
			paneIds[i] = Number.parseInt ( x ) } );
		paneIds.sort();
		paneId = this.focusedPaneId = paneIds[0];
		paneFnc = panes[paneId];
		paneFnc ( { do: 'focus' } ); 
		this.startPaneFocusTimer();
		return paneFnc;
	}	//	refocusPane()

	unfocusPane() {
		if ( this.focusedPaneId === 0 ) {
			return; }
		let panes = {};
		if ( typeof this.rootPaneFnc === 'function' ) {
			this.rootPaneFnc ( { do: 	'enum-panes',
								 panes:	panes } ); }
		let paneFnc = panes[this.focusedPaneId];
		if ( paneFnc ) {
			paneFnc ( { do: 'not-focus' } ); }
	}	//	unfocusPane()

	keyBurgerMenu ( o ) {
		if ( this.isShowingBurgerMenu ) {
			this.props.appFrameFnc ( { do: 'menu-dismiss' } ); }
		let paneFnc = null;
		if ( this.focusedPaneId === 0 ) {
			paneFnc = this.refocusPane(); }
		else {
			let panes = {};
			this.rootPaneFnc ( { do: 	'enum-panes',
								panes:	panes } );
			paneFnc = panes[this.focusedPaneId]; }
		if ( paneFnc ) {
			paneFnc ( o ); }
	}	//	keyBurgerMenu()

	doAll ( o ) {
		let sW = this.props.frameId + ' Frame doAll() ' + o.do;
		if ( o.to ) {
			sW += ' to ' + o.to; }
		diag ( [1, 2, 3], sW );
		let self = this;
		function setCallDown ( o ) {
			if ( ! o.to ) {
				return; }
			if ( o.to === 'frame-header' ) {
				self.headerFnc = o.fnc;
				//	The normal frame header component comes and goes so we can
				//	use this signal to update the panes regarding the size of 
				//	their area.
				if ( self.rootPaneFnc ) {
					self.rootPaneFnc ( { do: 'size', visitedPanes: {} } ); }
				return; }
			if ( o.to === 'frame-footer' ) {
				//	The footer dis/appears.  That is, the footer component always
				//	exists.  See 'footer-updated'.
				self.footerFnc = o.fnc;
				return; }
			if ( o.to === 'root-pane' ) {
				self.rootPaneFnc = o.fnc;
				return; }
			if ( o.to === 'PECmdEditor' ) {
				self.editor = o.fnc; 
				return; }
			if ( o.to === 'client-content' ) {
				self.rootPaneFnc ( o );
				return }
			if ( o.to === 'sizer' ) {
				self.sizerFnc = o.sizerFnc;
				return; }
		}

		if ( o.do === 'set-call-down' ) {
			setCallDown ( o );
			return; 
		}
		if ( o.do === 'z-top' ) {
			this.zTop();
			return;
		}
		if ( o.do === 'focus' ) {
			this.setBorderColor ( 'blue' );
			return this.refocusPane();
		}
		if ( o.do === 'not-focus' ) {
			this.setBorderColor ( 'black' );
			this.unfocusPane();
			return;
		}
		if ( o.do === 'cycle-pane-focus' ) {
			return this.cyclePaneFocus();
		}
		if ( o.do === 'key-burger-menu' ) {
			this.keyBurgerMenu ( o );
			return;
		}
		if ( o.do === 'menu-dismiss' ) {
			this.props.appFrameFnc ( o );
			return;
		}
		if ( o.do === 'show-burger-menu' ) {
			if ( this.isShowingBurgerMenu ) {
				return; }
			this.burgerClick();
			return;
		}
		if ( o.do === 'keyboard-key-down' ) {
			return this.keyDown ( o );
		}
		if ( o.do === 'move-start' ) {
			this.moveX0 = Number.parseInt ( this.state.style.left );
			this.moveY0 = Number.parseInt ( this.state.style.top );
			this.appFnc ( { do: 		'move-frame',
							frameFnc:	this.doAll,
							ev: 		o.ev } );
			return;
		}
		if ( o.do === 'move' ) {
			this.setState ( {
				style: {
					left:	(this.moveX0 + o.dX) + 'px',
					top:	(this.moveY0 + o.dY) + 'px',
					width:	this.state.style.width,
					height:	this.state.style.height,
					borderColor:	this.state.style.borderColor,
				}
			} );
			return;
		}
		if ( o.do === 'size-start' ) {
			this.sizeW0 = Number.parseInt ( this.state.style.width );
			this.sizeH0 = Number.parseInt ( this.state.style.height );
			if ( this.rootPaneFnc ) {
				o.visitedPanes = {};
				this.rootPaneFnc ( o ); }
			this.appFnc ( { do: 		'size-frame',
							frameFnc:	this.doAll,
							ev: 		o.ev } );
			return;
		}
		if ( o.do === 'size' ) {
			this.setState ( {
				style: {
					left:	this.state.style.left,
					top:	this.state.style.top,
					width:	(this.sizeW0 + o.dX) + 'px',
					height:	(this.sizeH0 + o.dY) + 'px',
					borderColor:	this.state.style.borderColor,
				}
			} );
			if ( this.sizerFnc ) {
				this.sizerFnc ( o ); }
			if ( this.rootPaneFnc ) {
				this.rootPaneFnc ( o ); }
			return;
		}
		if ( o.do === 'frame-burger-click' ) {
			this.burgerClick();
			return;
		}
		if ( o.do === 'iconize' ) {
			this.iconize ( o );
			return;
		}
		if ( o.do === 'destroy' ) {
			this.destroy ( o );
			return;
		}

		if ( o.do === 'get-state' ) {
			if ( this.state.iconized ) {
				return {
					hdrVisible:	!! this.state.normalHeader,
					ftrVisible:	this.isFooterVisible(),
					frameName:	this.state.frameName,
					frameType:	this.props.frameType,
					frameId:	this.props.frameId,
					paneId:		this.props.paneId,
					style:		clone ( this.state.style ),
					iconized:	clone ( this.state.iconized ) }; }
			this.rootPaneFnc ( o );		//	update pane's state in app store
			return {
				hdrVisible:	!! this.state.normalHeader,
				ftrVisible:	this.isFooterVisible(),
				frameName:	this.state.frameName,
				frameType:	this.props.frameType,
				frameId:	this.props.frameId,
				paneId:		this.props.paneId,
				style:	  	clone ( this.state.style ) };
		}
		if ( o.do === 'get-state-2' ) {
			if ( this.state.iconized ) {
				console.log ( sW + ' Error: frame is iconized' );
				return null; }

			return {
				hdrVisible:	!! this.state.normalHeader,
				ftrVisible:	this.isFooterVisible(),
				frameName:	this.state.frameName,
				frameType:	this.props.frameType,
				frameId:	this.props.frameId,
				paneId:		this.props.paneId,
				style:	  	clone ( this.state.style ),
				paneState:	this.rootPaneFnc ( o ) };
		}

		if ( o.do === 'set-state' ) {
			this.rootPaneFnc ( o );		//	set state from app store
			return;
		}
		if ( o.do === 'set-state-2' ) {
			this.rootPaneFnc ( { do:	o.do,
								 state:	o.state.paneState } );
			return;
		}

		if ( o.do === 'split-horz' ) {
			if ( this.rootPaneFnc ) {
				this.rootPaneFnc ( o );	}
			return;
		}
		if ( o.do === 'split-vert' ) {
			if ( this.rootPaneFnc ) {
				this.rootPaneFnc ( o ); }
			return;
		}
		if ( o.do === 'show-menu' ) {
			this.appFnc ( o );
			return;
		}
		if ( o.do === 'show-name-dlg' ) {
			this.appFnc ( o );
			return;
		}
		if ( o.do === 'append-menu-items' ) {
			this.props.appContentFnc ( o );
			return;
		}
		if ( o.do === 'burger-menu-dismissed' ) {
			this.isShowingBurgerMenu = false;
			return;
		}
		if ( o.do === 'menu-item' ) {
			if ( o.menuItemText === 'Frame Name ...' ) {
				this.nameFrame();
				return; }
			if ( o.menuItemText === 'Show Header' ) {
			//	if ( this.headerFnc ) {
			//		this.headerFnc ( { do: 'show' } ); }
				this.setState ( {
					normalHeader: ( <FrameHeader 
						frameId 	= { this.props.frameId }
						frameName	= { this.state.frameName }
						frameFnc	= { this.doAll } /> ),
					transientHeader: null
				} );
				return; }
			if ( o.menuItemText === 'Hide Header' ) {
			//	if ( this.headerFnc ) {
			//		this.headerFnc ( { do: 'hide' } ); }
				this.setState ( {
					normalHeader: null,
					transientHeader: ( <FrameTransientHeader 
						frameId 	= { this.props.frameId }
						frameName	= { this.state.frameName }
						frameFnc	= { this.doAll } /> )
				} );
				return; }
			if ( o.menuItemText === 'Show Footer' ) {
				if ( this.footerFnc ) {
					this.footerFnc ( { do: 'show' } ); }
				return; }
			if ( o.menuItemText === 'Hide Footer' ) {
				if ( this.footerFnc ) {
					this.footerFnc ( { do: 'hide' } ); }
				return; }
			o.frameId = this.props.frameId;
			this.props.appContentFnc ( o );
			return;
		}
		if ( o.do === 'name-frame-name' ) {
			this.nameFrameName ( o );
			return; }
		if ( o.do === 'set-frame-name-part-2' ) {
			if ( this.headerFnc ) {
				this.headerFnc ( o ); }
			return; }
		if ( o.do === 'is-header-transient' ) {
			return !! this.state.transientHeader;
		}
		if ( o.do === 'is-header-visible' ) {
			return this.isHeaderVisible();
		}
		if ( o.do === 'is-transient-header-visible' ) {
			return this.isTransientHeaderVisible();
		}
		if ( o.do === 'get-transient-header-status' ) {
			return this.getTransientHeaderStatus();
		}
		if ( o.do === 'show-header' ) {
			if ( this.state.normalHeader ) {
				return true; }
			if ( ! this.headerFnc ) { 
				return false; }
			let wasVisible = this.isTransientHeaderVisible();
			if ( ! wasVisible ) {
				this.headerFnc ( { do: 'show' } ); }
			return wasVisible;
		}
		if ( o.do === 'hide-transient-header' ) {
			if ( ! this.headerFnc ) { 
				return; }
			if ( ! this.state.transientHeader ) {
				return true; }
			this.headerFnc ( { do: 'hide' } );
			return;
		}
		if ( o.do === 'mouse-entered-top-pane-button-bar' ) {
		//	console.log ( sW );
			this.mouseInTopPaneButtonBar = true;
			return;
		}
		if ( o.do === 'mouse-exited-top-pane-button-bar' ) {
		//	console.log ( sW );
			this.mouseInTopPaneButtonBar = false;
			return;
		}
		if ( o.do === 'is-mouse-in-any-top-pane-button-bar' ) {
		//	console.log ( sW );
			return this.mouseInTopPaneButtonBar;
		}
		if ( o.do === 'footer-updated' ) {
			//	Footer has dis/appeared - the size of area available for pane(s)
			//	has changed.
			if ( this.rootPaneFnc ) {
				this.rootPaneFnc ( { do: 'size', visitedPanes: {} } ); }
			return; 
		}
	}   //  doAll()

	render() {
		const sW = this.props.frameId + ' Frame render()';
		diag ( [1, 2, 3], sW );
		if ( this.state.iconized ) {
			return (
				<div id					= { this.eleId }
					 className 			= 'rr-pe-frame'
					 style 				= { this.state.iconized.style }
					 onTransitionEnd	= { this.transitionEnd }
					 onClick			= { this.clickIcon } >
					<div className 	= 'rr-iconized-frame-name'
						 style 		= { this.state.iconized.iconName } >
						{ this.state.frameName }
					</div>
				</div>
			); }
		return (
			<div id				= { this.eleId }
				 className		= "rr-pe-frame"
				 style 			= { this.state.style}
				 onMouseDown	= { this.mouseDown } >
				{ this.state.normalHeader }
				<Pane frameId		= { this.props.frameId }
					  paneId		= { this.props.paneId }
					  peId			= { this.peId } 
					  frameFnc		= { this.doAll }
					  tabs			= { false } 
					  atFrameTop	= { true } 
					  clientFnc		= { this.props.clientFnc } />

				<FrameFooter visible	= { this.state.ftrVisible }
							 frameFnc 	= { this.doAll } />
				<Sizer frameId 		= { this.props.frameId }
					   frameEleId 	= { this.eleId }
					   appFnc 		= { this.appFnc }
					   frameFnc		= { this.doAll }  />
				{ this.state.transientHeader }
			</div>
		)
	}	//	render()

	componentDidMount() {
		const sW = this.props.frameId + ' Frame componentDidMount()';
		diag ( [1, 2], sW );

		this.props.clientFnc ( { do: 		'set-call-down',
								 to:		'frame',
								 frameId:	this.props.frameId,
								 paneId:	this.props.paneId,
								 frameFnc:	this.doAll,
								 iconized:	!! this.state.iconized } );

		this.props.appContentFnc ( { do: 		'set-call-down',
									 to:		'frame',
									 frameId:	this.props.frameId,
									 frameFnc:	this.doAll } );
	}	//	componentDidMount()

	componentDidUpdate() {
		const sW = this.props.frameId + ' Frame componentDidUpdate()';
		diag ( [1, 2, 3], sW );

	//	if ( this.state.contentRestoreIncomplete && this.state.titleBar ) {
	//		this.rootPaneFnc ( { do: 	'set-state',
	//							 state:	this.contentState } );
	//		this.contentState = null;
	//		this.state.contentRestoreIncomplete = false;
	//	}
	//
	//	Title bar must be set up before the pane's state (with possible
	//	child panes) is set because of button bar issues in the title
	//	bar (the button bar container function must be set in the title
	//	bar). So the pane's state is set in the 'title-bar-call-down'
	//	command in doAll().

		if ( this.state.contentRestoreIncomplete ) {
			this.rootPaneFnc ( { do: 	'set-state' } );
			this.state.contentRestoreIncomplete = false; }

	}	//	componentDidUpdate()

	componentWillUnmount() {
		const sW = this.props.frameId + ' Frame componentWillUnmount()';
		console.log ( sW );
		if ( this.beingDestroyed ) {
			this.props.clientFnc ( { do:		'destroy-frame',
									 frameId:	this.props.frameId } ); }
	}	//	componentWillUnmount()

}	//	class Frame

export { Frame as default };
