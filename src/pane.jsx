/*
		 1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890

*/

import React			from 'react';

import PaneContent		from './pane-content';
import PaneButtonBar 	from './pane-button-bar';
import Split 			from 'split.js'
import clone 			from 'clone';

import {diag, diagsFlush, diagsPrint} 	from './diags';


let lastPaneId = 0;

function getPaneId() {
	return ++lastPaneId;
}

function getLastPaneId() {
	return lastPaneId;
}

function setLastPaneId ( paneId ) {
	lastPaneId = paneId;
}

// Helper function determines which prefixes of CSS calc we need.
// We only need to do this once on startup, when this anonymous function is called.
//
// Tests -webkit, -moz and -o prefixes. Modified from StackOverflow:
// http://stackoverflow.com/questions/16625140/js-feature-detection-to-detect-the-usage-of-webkit-calc-over-calc/16625167#16625167
const calc = `${['', '-webkit-', '-moz-', '-o-']
	.filter(prefix => {
		const el = document.createElement('div')
		el.style.cssText = `width:${prefix}calc(9px)`
		return !!el.style.length
	})
	.shift()}calc`
	

class Pane extends React.Component {
	constructor ( props ) {
		super ( props );
		const sW = 'Pane ' + this.props.paneId + ' constructor()';
		diag ( [1, 2], sW );
		if ( props.eleId ) {
			this.eleId = props.eleId;
		} else
		if ( props.tabId ) {
			this.eleId = 'pe-tab-' + props.tabId + '-pane';
		} else {
			this.eleId = 'pe-frame-' + props.peId + '-pane';
		}
		if ( props.class ) {
			this.class = props.class;
		} else {
			this.class = 'pane';
		}
		
		this.contentEleId		= this.eleId + '-content';

		this.burgerClick			= this.burgerClick.bind ( this );
		this.myElementStyleFnc		= this.myElementStyleFnc.bind ( this );
		this.splitDrag				= this.splitDrag.bind ( this );
		this.splitPrep				= this.splitPrep.bind ( this );
		this.splitHorz				= this.splitHorz.bind ( this );
		this.splitVert				= this.splitVert.bind ( this );
		this.hsplitterPointerDown	= this.hsplitterPointerDown.bind ( this );
		this.hsplitterPointerUp		= this.hsplitterPointerUp.bind ( this );
		this.hsplitterSlide			= this.hsplitterSlide.bind ( this );
		this.vsplitterPointerDown	= this.vsplitterPointerDown.bind ( this );
		this.vsplitterPointerUp		= this.vsplitterPointerUp.bind ( this );
		this.vsplitterSlide			= this.vsplitterSlide.bind ( this );
	//	this.sizeStartByTabPage		= this.sizeStartByTabPage.bind ( this );
	//	this.sizeByTabPage			= this.sizeByTabPage.bind ( this );
		this.propagateDown_SizeOp 	= this.propagateDown_SizeOp.bind ( this );
		this.enumPanes 				= this.enumPanes.bind ( this );
		this.keyBurgerMenu			= this.keyBurgerMenu.bind ( this );
		this.doGetState				= this.doGetState.bind ( this );
		this.doSetState				= this.doSetState.bind ( this );
		this.doAll 					= this.doAll.bind ( this );


		this.state = {
			style: props.tabId ? props.style : {
			//	flexDirection: 		'row'
			},

			contentStyle:	props.contentStyle,
			clientContent:	props.clientContent,

			containerStyle:	null,
			containerH0: 	0,
		//	conatinerEle:	null,
			splitHorz: 		null,
			shLftStyle:		null,
			shRgtStyle:		null,
			splitVert:		null,
			svTopStyle:		null,
			svBotStyle:		null,

			tabs:			props.tabs ? true : false,

			hasFocus:			false,
			focusClass:			null,
		};

		this.mounted 		= false;

		this.tabsFnc 		= null;
		this.tabPagePanes	= {};		//	keyed by tab ID
	//	this.h0				= 0;		//	used when this is on a tab page

		this.paneContentFnc 		= null;
		this.correctPaneContentFnc	= null;

		this.ccFnc		= null;
		this.ccState	= null;

		this.bbFnc		= null;

		this.isShowingBurgerMenu = false;

		this.focusTimeoutId = 0;

		if ( ! this.props.parentFnc ) {
		//	this.props.frameFnc ( { do:		'set-call-down',
		//							to:		'root-pane',
		//							fnc:	this.doAll } );
		} else {
			this.props.parentFnc ( { do:  			'set-call-down',
									 to: 			'child-pane',
									 childPaneId:	this.props.paneId,
									 fnc: 			this.doAll } );
			if ( this.props.tabId ) {
				this.props.parentFnc ( { do:			'set-call-down',
										 to:			'tab-page-pane',
										 tabId:			this.props.tabId,
										 tabPaneFnc:	this.doAll } ); 
				this.props.tabsFnc ( { do:			'set-call-down',
									   to:			'tab-page-pane',
									   tabId:		this.props.tabId,
									   tabPaneFnc:	this.doAll } ); }
		}

		this.w0		= 0;
		this.lftW0	= 0;
		this.h0		= 0;
		this.topH0	= 0;

	}	//  constructor()

	//	Data associated with any element.  Keys are the elements' id.
	eleData = {};

	burgerClick() {
		let sW = 'Pane burgerClick()';
		console.log ( sW );
		let menuItems = [];

		if ( ! this.ccFnc ) {
			menuItems.push ( { type: 'item',	text: 'Tabs' } ); }

		if ( this.props.tabId ) {
			menuItems.push ( { type: 'item',	text: 'Tab Name ...' } ); }

		if ( ! this.ccFnc ) {
			if ( menuItems.length > 0 ) {
				menuItems.push ( {type: 'separator', 	text: '' } ); }
			this.props.frameFnc ( {
				do:			'append-menu-items',
				to:			'pane-burger',
				menuItems:	menuItems
			} ); }
		else {
			let ccMenuItems = [];
			this.ccFnc ( {
				do:			'append-menu-items',
				to:			'pane-burger',
				menuItems:	ccMenuItems
			} );
			if ( ccMenuItems.length > 0 ) {
				if ( menuItems.length > 0 ) {
					menuItems.push ( {type: 'separator', 	text: '' } ); }
				menuItems = menuItems.concat ( ccMenuItems );
			} }

		let pe = document.getElementById ( this.eleId );
		let r  = pe.getBoundingClientRect();
		this.props.frameFnc ( { 
            do: 		'show-menu',
            menuEleId:	this.eleId + '-burger-menu',
            menuX:		r.x - 1,
            menuY:		r.y - 1,
            menuItems:	menuItems,
            upFnc:		this.doAll,
            ctx:		{ what:		'pane burger',
						  dismiss:	'burger-menu-dismissed',
						  after:	'menu-item', }
		} );

		this.isShowingBurgerMenu = true;
	}	//	burgerClick()

	myElementStyleFnc ( dim, size, gutSize ) {
		const sW = 'myElementStyleFnc()';
	//	console.log ( sW + '  dim: ' + dim + '  size: ' + size );
		// Helper function checks if its argument is a string-like type
		function isString ( v ) {
			return (typeof v === 'string') || (v instanceof String);
		} 

		const style = {};
		if ( ! isString ( size ) ) {
				style[dim] = `${calc}(${size}% - ${gutSize}px)`;
		} else {
			style[dim] = size;
		}
		return style;
	}	//	myElementStyleFnc()

	splitDrag() {
		const sW = 'Pane ' + this.props.paneId + ' splitDrag()';
	//	console.log ( sW );
		let cmd = { do: 'splitter-dragged' };
		let sh = this.state.splitHorz;
		if ( sh ) {
			if ( sh.left.paneFnc ) {
				sh.left.paneFnc ( cmd ); }
			if ( sh.right.paneFnc ) {
				sh.right.paneFnc ( cmd ); }
			return;
		}
		let sv = this.state.splitVert;
		if ( sv ) {
			if ( sv.top.paneFnc ) {
				sv.top.paneFnc ( cmd ); }
			if ( sv.bottom.paneFnc ) {
				sv.bottom.paneFnc ( cmd ); }
			return;
		}
	}	//	splitDrag()

	splitPrep ( o ) {
		let sp = {};

		//  Get the content element
		sp.pe = document.getElementById ( this.contentEleId );

		//  Copy the current contents.
	//	sp.pet = sp.pe.textContent.trim()
	//	sp.pec = Array.from ( sp.pe.children );

		//  Delete the current contents.
		sp.pe.textContent = '';

		return sp;
	}	//	splitPrep()

	splitHorz ( o ) {
		let sW = 'Pane ' + this.props.paneId + ' splitHorz()';
		diagsFlush();
		diagsPrint ( sW, [2, 3], 2000 );
		diag ( 2, sW );

		this.props.frameFnc ( { do: 'hide-transient-header' } );

		this.doAll ( { do: 'get-state' } );

		let sp = this.splitPrep ( o );
		
		let lftPaneId = getPaneId();
		let rgtPaneId = getPaneId();
		this.props.clientFnc ( {
			do:			'fix-pane-id',
			curPaneId:	this.props.paneId,
			newPaneId:	lftPaneId,
			reason:		'split',
			frameId:	this.props.frameId
		} );
		this.props.clientFnc ( {
			do:			'define-pane-content',
			frameId:	this.props.frameId,
			paneId:		rgtPaneId
		} );

		let e  = document.getElementById ( this.eleId );
		let w2 = e.clientWidth / 2;

		this.setState ( { 
			style: Object.assign ( { 
				backgroundColor:	'lightgray' },
				this.state.style ), 
			containerStyle: {
				flex:			'1 1 auto',
				overflowX:		'hidden',
				overflowY:		'hidden',
				display:		'flex',
				flexDirection:	'row' },
			splitHorz: { 
				left: {
					eleId: 			this.eleId + '-lft-' + lftPaneId,
					class: 			'pane',
					paneId:			lftPaneId,
					paneFnc: 		null,
					contentState: 	null
				},
				right: {
					eleId: 			this.eleId + '-rgt-' + rgtPaneId,
					class: 			'pane',	
					paneId:			rgtPaneId,
					paneFnc: 		null,
				},
				incomplete: 	true },
			shLftStyle: { minWidth:			w2 + 'px',
						  maxWidth:			w2 + 'px',		//	for now
						  flex:				'0 1 0',
						  display:			'flex',
						  flexDirection:	'row',
						  userSelect:		'unset', },
			shRgtStyle: { minWidth:			'2px',
						  flex:				'1 0 0',
						  userSelect:		'unset', 
						  overflow:			'hidden', },

		} );
		return { lftPaneId: lftPaneId,
				 rgtPaneId: rgtPaneId };
	}	//	splitHorz()

	splitVert ( o ) {
		let sW = 'Pane ' + this.props.paneId + '  splitVert()';
		diagsFlush();
		diagsPrint ( sW, [2, 3], 2000 );
		diag ( 2, sW );

		this.props.frameFnc ( { do: 'hide-transient-header' } );

		this.doAll ( { do: 'get-state' } );

		let sp = this.splitPrep ( o );
		
		let topPaneId = getPaneId();
		let botPaneId = getPaneId();
		this.props.clientFnc ( {
			do:			'fix-pane-id',
			curPaneId:	this.props.paneId,
			newPaneId:	topPaneId,
			reason:		'split',
			frameId:	this.props.frameId
		} );
		this.props.clientFnc ( {
			do:			'define-pane-content',
			frameId:	this.props.frameId,
			paneId:		botPaneId
		} );

		let e  = document.getElementById ( this.eleId );
		let h2 = e.clientHeight / 2;

		this.setState ( { 
			style: Object.assign ( { 
				backgroundColor:	'lightgray' }, 
				this.state.style ),
			containerStyle: {
				flex:			'1 1 auto',
				overflowX:		'hidden',
				overflowY:		'hidden',
				display:		'flex',
				flexDirection:	'column' },
			splitVert: { 
				top: {
					eleId: 			this.eleId + '-top-' + topPaneId,
					class: 			'pane',
					paneId:			topPaneId,
					paneFnc: 		null,
					contentState: 	null
				},
				bottom: {
					eleId: 			this.eleId + '-bot-' + botPaneId,
					class: 			'pane',	
					paneId:			botPaneId,
					paneFnc: 		null,
				},
				incomplete: 	true, },
			svTopStyle: { minHeight:		h2 + 'px',
						  maxHeight:		h2 + 'px',		//	for now
						  flex:				'0 1 0',
						  display:			'flex',
						  flexDirection:	'column',
						  userSelect:		'unset', },
			svBotStyle: { minHeight:	'2px',
						  flex:			'1 0 0',
						  userSelect:	'unset',
						  overflow:		'hidden', },
		} );
		return { topPaneId: topPaneId,
				 botPaneId: botPaneId };
	}	//	splitVert()

	hsplitterPointerDown ( evt ) {
		const sW = 'Pane hsplitterPointerDown()';
	//	console.log ( sW );
		let e = document.getElementById ( this.eleId + '-hsplitter' );
		let lft = this.state.shLftStyle;
		let rgt = this.state.shRgtStyle;
		let lftMaxWidth =   e.parentElement.clientWidth 
						  - e.offsetWidth 
						  - Number.parseInt ( rgt.minWidth );
		this.setState ( { shLftStyle: { 
			minWidth: 		lft.minWidth,
			maxWidth: 		lftMaxWidth + 'px',
			flex:			lft.flex,
		    display:		lft.display,
		    flexDirection:	lft.flexDirection,
		    userSelect:		'none' } } );
		this.setState ( { shRgtStyle: { 
			minWidth: 		rgt.minWidth,
		    flex:			rgt.flex,
		    padding:		rgt.padding,
		    userSelect:		'none',
			overflow:		rgt.overflow } } );
		e.onpointermove = this.hsplitterSlide;
		e.setPointerCapture ( evt.pointerId );
	}	//	hsplitterPointerDown()

	vsplitterPointerDown ( evt ) {
		const sW = 'Pane vsplitterPointerDown()';
	//	console.log ( sW );
		let e = document.getElementById ( this.eleId + '-vsplitter' );
		let top = this.state.svTopStyle;
		let bot = this.state.svBotStyle;
		let topMaxHeight =   e.parentElement.clientHeight 
						   - e.offsetHeight 
						   - Number.parseInt ( bot.minHeight );
		this.setState ( { svTopStyle: { 
			minHeight: 		top.minHeight,
			maxHeight: 		topMaxHeight + 'px',
			flex:			top.flex,
		    display:		top.display,
		    flexDirection:	top.flexDirection,
		    userSelect:		'none' } } );
		this.setState ( { svBotStyle: { 
			minHeight: 		bot.minHeight,
		    flex:			bot.flex,
		    padding:		bot.padding,
		    userSelect:		'none',
			overflow:		bot.overflow } } );
		e.onpointermove = this.vsplitterSlide;
		e.setPointerCapture ( evt.pointerId );
	}	//	vsplitterPointerDown()

	hsplitterPointerUp ( evt ) {
		const sW = 'Pane hsplitterPointerUp()';
	//	console.log ( sW );
		let e = document.getElementById ( this.eleId + '-hsplitter' );
		let lft = this.state.shLftStyle;
		let rgt = this.state.shRgtStyle;
		let { minWidth, maxWidth } = lft;
		this.setState ( { shLftStyle: { 
			minWidth: 		minWidth,
		    maxWidth: 		maxWidth,
			flex:			lft.flex,
		    display:		lft.display,
		    flexDirection:	lft.flexDirection,
		    userSelect:		'unset' } } );
		this.setState ( { shRgtStyle: { 
			minWidth: 		rgt.minWidth,
		    flex:			rgt.flex,
		    padding:		rgt.padding,
		    userSelect:		'unset',
			overflow:		rgt.overflow } } );
		e.onpointermove = null;
		e.releasePointerCapture ( evt.pointerId );
	}	//	hsplitterPointerUp()

	vsplitterPointerUp ( evt ) {
		const sW = 'Pane vsplitterPointerUp()';
	//	console.log ( sW );
		let e = document.getElementById ( this.eleId + '-vsplitter' );
		let top = this.state.svTopStyle;
		let bot = this.state.svBotStyle;
		this.topH0 = Number.parseInt ( top.minHeight ); 
		let { minHeight, maxHeight } = top;
		this.setState ( { svTopStyle: { 
			minHeight: 		minHeight,
		    maxHeight: 		maxHeight,
			flex:			top.flex,
		    display:		top.display,
		    flexDirection:	top.flexDirection,
		    userSelect:		'unset' } } );
		this.setState ( { svBotStyle: { 
			minHeight: 		bot.minHeight,
		    flex:			bot.flex,
		    padding:		bot.padding,
		    userSelect:		'unset',
			overflow:		bot.overflow } } );
		e.onpointermove = null;
		e.releasePointerCapture ( evt.pointerId );
	}	//	vsplitterPointerUp()

	hsplitterSlide ( e ) {
		const sW = 'Pane hsplitterSlide()';
	//	console.log ( sW + ':  movementX ' + e.movementX );
		let lft = this.state.shLftStyle;
		let { minWidth, maxWidth } = lft;
		let maxW =  Number.parseInt ( maxWidth );
		let lftW =  Number.parseInt ( minWidth );
			lftW += e.movementX / 2;
		if ( lftW > maxW ) {
			lftW = maxW; };
		this.setState ( { shLftStyle: { 
			minWidth: 		lftW + 'px',
		    maxWidth: 		maxWidth,	
			flex:			lft.flex,
		    display:		lft.display,
			flexDirection:	lft.flexDirection,
			userSelect:		'none' } }, () => {
			this.splitDrag() } );
	}	//	hsplitterSlide()

	vsplitterSlide ( e ) {
		const sW = 'Pane vsplitterSlide()';
	//	console.log ( sW + ':  movementY ' + e.movementY );
		let top = this.state.svTopStyle;
		let { minHeight, maxHeight } = top;
		let maxH =  Number.parseInt ( maxHeight );
		let topH =  Number.parseInt ( minHeight );
			topH += e.movementY / 2;
		if ( topH > maxH ) {
			topH = maxH; };
		this.setState ( { svTopStyle: { 
			minHeight: 		topH + 'px',
		    maxHeight: 		maxHeight,	
			flex:			top.flex,
		    display:		top.display,
			flexDirection:	top.flexDirection,
			userSelect:		'none' } }, () => {
			this.splitDrag() } );
	}	//	vsplitterSlide()

	propagateDown_SizeOp ( o ) {
		const sW = 'Pane propagateDown_SizeOp() ' + o.do;
	//	console.log ( sW );
		if ( ! this.mounted ) {
			console.log ( sW + ' Error: not mounted' );
			return; }
		let e    = document.getElementById ( this.eleId );
		if ( ! e ) {
			console.log ( sW + ' Error: no element' );
			return; }
		let sh = this.state.splitHorz;
		if ( sh ) {
			while ( o.do === 'size-start' ) {
				let lft  = this.state.shLftStyle;
				this.w0  = e.clientWidth;
				this.h0  = e.clientHeight;
				this.lftW0 = Number.parseInt ( lft.minWidth); 
				break; }
			while ( o.do === 'size' ) {
				let w    = e.clientWidth;
				let lft  = this.state.shLftStyle;
				let wp   = this.lftW0 / this.w0;
				let lftW = Math.round ( w * wp );
			//	console.log ( sW + ': w ' + w 
			//					 + '  wp ' + wp 
			//					 + '  lftW ' + lftW );
				if ( ! Number.isSafeInteger ( lftW ) ) {
					break; }
				this.setState ( { shLftStyle: {
					minWidth: 		lftW + 'px',
					maxWidth: 		lft.maxWidth,	
					flex:			lft.flex,
					display:		lft.display,
					flexDirection:	lft.flexDirection,
					userSelect:		'unset', } } ); 
				break; }
			sh.left.paneFnc ( o );
			sh.right.paneFnc ( o );	}
		let sv = this.state.splitVert;
		if ( sv ) {
			while ( o.do === 'size-start' ) {
				let top  = this.state.svTopStyle;
				this.w0  = e.clientWidth;
				this.h0  = e.clientHeight;
				this.topH0 = Number.parseInt ( top.minHeight ); 
				break; }
			while ( o.do === 'size' ) {
				let h    = e.clientHeight;
				let top  = this.state.svTopStyle;
				let hp   = this.topH0 / this.h0;
				let topH = Math.round ( h * hp );
			//	console.log ( sW + ': h ' + h 
			//					 + '  hp ' + hp 
			//					 + '  topH ' + topH );
				if ( ! Number.isSafeInteger ( topH ) ) {
					break; }
				this.setState ( { svTopStyle: {
					minHeight: 		topH + 'px',
					maxHeight: 		top.maxHeight,	
					flex:			top.flex,
					display:		top.display,
					flexDirection:	top.flexDirection,
					userSelect:		'unset', } } ); 
				break; }
			sv.top.paneFnc ( o );
			sv.bottom.paneFnc ( o ); }
	//	if ( this.tabPagesFnc ) {
	//		this.tabPagesFnc ( o ); }
		for ( var tabId in this.tabPagePanes ) {
			let pagePane = this.tabPagePanes[tabId];
			//	One tab pane active at a time, so, all but one page's pane 
			//	fnc will (might?) be null.
			if ( pagePane.paneFnc ) {
				pagePane.paneFnc ( o );	}

		}
		if ( this.ccFnc ) {
			o.paneW = e.clientWidth;
			o.paneH = e.clientHeight;
			this.ccFnc ( o ); }
	}	//	propagateDown_SizeOp()

	enumPanes ( o ) {
		let sh = this.state.splitHorz;
		if ( sh ) {
			sh.left.paneFnc ( o );
			sh.right.paneFnc ( o );	
			return; }
		let sv = this.state.splitVert;
		if ( sv ) {
			sv.top.paneFnc ( o );
			sv.bottom.paneFnc ( o ); 
			return; }
		o.panes[this.props.paneId] = this.doAll; 
	}	//	enumPanes()

	keyBurgerMenu ( o ) {
	//	if ( this.bbFnc ) {
	//		this.bbFnc ( { do: 'key-show' } ); 	}
		if ( this.tabsFnc ) {
			this.tabsFnc ( o );
			return; }
		if ( this.isShowingBurgerMenu ) {
			this.props.frameFnc ( { do: 'menu-dismiss' } );
			this.props.frameFnc ( { do: 'show-burger-menu' } );
			return;
		}
		this.burgerClick();
	}	//	keyBurgerMenu()

	focus ( o ) {
		if ( this.focusTimeoutId ) {
			window.clearTimeout ( this.focusTimeoutId );
			this.focusTimeoutId = 0; }
		this.setState ( { hasFocus: 	true,
						  focusClass:	'rr-pane-focused-rect' } );
		this.focusTimeoutId = window.setTimeout ( () => {
			this.setState ( { hasFocus:   true,
							  focusClass: 'rr-pane-focused-rect-transition' } );
		}, 1000 );
	}	//	focus()

	focusNot ( o ) {
		if ( this.focusTimeoutId ) {
			window.clearTimeout ( this.focusTimeoutId );
			this.focusTimeoutId = 0; }
		this.setState ( { hasFocus: false } );
	}	//	focusNot()

//	sizeStartByTabPage() {
//		let e = document.getElementById ( this.eleId );
//		this.h0 = Number.parseInt ( e.style.height );
//	}	//	sizeStartByTabPage()

//	sizeByTabPage ( o ) {
//		let e = document.getElementById ( this.eleId );
//		let s = {
//			position:	'absolute',
//			width:		'100%',
//			height:		(this.h0 + o.dY) + 'px' };
//		if ( this.state.style.flexDirection ) {
//			s.flexDirection = this.state.style.flexDirection; }
//		if ( this.state.style.backgroundColor ) {
//			s.backgroundColor = this.state.style.backgroundColor; }
//		this.setState ( { style: s } );
//	}	//	sizeByTabPage()

	doGetState ( o ) {
		let pe = document.getElementById ( this.eleId );
		let state = clone ( this.state );
		let sh = state.splitHorz;
		let sv = state.splitVert;
		if ( o.do === 'get-state-2' ) {
			o = clone ( o );
			o.do = 'get-state'; }
		if ( sh ) {
			sh.left.contentState = sh.left.paneFnc ( o );
			sh.left.paneFnc = null;
			sh.right.contentState = sh.right.paneFnc ( o );
			sh.right.paneFnc = null; }
		//	sh.opts.elementStyle = null;
		//	sh.opts.onDrag = null; }
		if ( sv ) {
			sv.top.contentState = sv.top.paneFnc ( o );
			sv.top.paneFnc = null;
			sv.bottom.contentState = sv.bottom.paneFnc ( o );
			sv.bottom.paneFnc = null; }
		//	sv.opts.elementStyle = null;
		//	sv.opts.onDrag = null; }
		if ( (! sh) && (! sv) && this.ccFnc ) {
			state.ccState = this.ccFnc ( o );
		} else {
			state.ccState = null; }
		if ( this.state.tabs ) {
			state.tabsState = this.tabsFnc ( o );
			console.log ( 'got tabsState' );
		} else {
			state.tabsState = false; }

		return state;
	}	//	doGetState()

	doSetState ( state ) {
		const sW = 'Pane doSetState()';
		let sh = state.splitHorz;
		let sv = state.splitVert;
		if ( (! this.props.parentFnc) && (sh || sv) ) {
			this.props.frameFnc ( { do: 'clear-pane-btn-bars' } ); }
		if ( sh ) {
			sh.incomplete			= true; }
		if ( sv ) {
			sv.incomplete			= true; }
		if ( (! sh) && (! sv) ) {
			if ( this.ccFnc ) {
			//	console.log ( sW + ' set-state: this.ccFnc is set' );
				diag ( [3], sW + ': this.ccFnc is set' );
				this.ccFnc ( { do: 		'set-state',
							   state:	state.ccState } );
			} else {
			//	diag ( [], sW + ' set-state ERROR: this.ccFnc is not set' );
				//	Set client content state when we get the ccFnc.
				diag ( [3], sW + ': this.ccState' );
				this.ccState = state.ccState;
			}
			delete state.ccState;
		}
			
		let tabsState = state.tabsState;
		delete state.tabsState;
		let self = this;
		this.setState ( state, () => {
			if ( ! tabsState ) {
				return; }
			self.tabsFnc ( { do: 	'set-state',
							 state:	tabsState } );
		} );
		return (!!sh) || (!!sv);
	}	//	doSetState()

	doAll ( o ) {
		let sW = 'Pane ' + this.props.paneId + ' doAll() ' + o.do;
		if ( o.to ) {
			sW += ' to ' + o.to; }
		diag ( [1, 2, 3], sW );
		if ( o.do === 'set-call-down' ) {
			if ( o.to === 'pane-content' ) {
				this.paneContentFnc = o.fnc;
				return;
			}
			if ( o.to === 'child-pane' ) {
				let sh = this.state.splitHorz;
				if ( sh ) {
					if ( sh.left.paneId === o.childPaneId ) {
						diag ( [2], sW + ' left.paneFnc' );
						sh.left.paneFnc = o.fnc; 
					//	sh.left.paneFnc ( { do:	'set-at-frame-top',
					//					    is:	this.isAtFrameTop } ); 
					}
					if ( sh.right.paneId === o.childPaneId ) {
						diag ( [2], sW + ' right.paneFnc' );
						sh.right.paneFnc = o.fnc; 
					//	sh.right.paneFnc ( { do: 'set-at-frame-top',
					//					     is: this.isAtFrameTop } ); 
					} 
				}
				let sv = this.state.splitVert;
				if ( sv ) {
					if ( sv.top.paneId === o.childPaneId ) {
						diag ( [2], sW + ' top.paneFnc' );
						sv.top.paneFnc = o.fnc; 
					//	sv.top.paneFnc ( { do: 'set-at-frame-top',
					//					   is:  this.isAtFrameTop } ); 
					}
					if ( sv.bottom.paneId === o.childPaneId ) {
						diag ( [2], sW + ' bottom.paneFnc' );
						sv.bottom.paneFnc = o.fnc; } }
			}
			if ( o.to === 'tabs' ) {
				this.tabsFnc = o.tabsFnc;
			}
		//	if ( o.to === 'tab-pages' ) {
		//		this.tabPagesFnc = o.tabPagesFnc;
		//	}
			if ( o.to === 'tab-page-pane' ) {
				this.tabPagePanes[o.tabId] = { paneFnc:	o.tabPaneFnc };
			}
			if ( o.to === 'client-content' ) {
				if ( o.paneId === this.props.paneId ) {
					this.ccFnc = o.fnc; 		//	Client Content
					this.props.clientFnc ( o );	//	Give the app o.fnc.
					//	If we have already gotten the client content state ...
					if ( this.ccState ) {
						this.ccFnc ( { do: 		'set-state',
									   state:	this.ccState } );
						this.ccState = null; }
					else {
						let state = this.props.clientFnc ( { 
										do: 	'load-pane-state',
										paneId:	this.props.paneId } );
						if ( state && state.ccState ) {
							this.ccFnc ( { do: 		'set-state',
										   state:	state.ccState } ); }
					}
				}
				else {
					let sh = this.state.splitHorz;
					if ( sh ) {
						if ( sh.left.paneFnc ) {
							sh.left.paneFnc ( o ); }
						if ( sh.right.paneFnc ) {
							sh.right.paneFnc ( o ); }
						return;
					}
					let sv = this.state.splitVert;
					if ( sv ) {
						if ( sv.top.paneFnc ) {
							sv.top.paneFnc ( o ); }
						if ( sv.bottom.paneFnc ) {
							sv.bottom.paneFnc ( o ); }
						return;
					}
					for ( let tabId in this.tabPagePanes ) {
						let pagePane = this.tabPagePanes[tabId];
						//	One tab pane active at a time, so, all but one
						//	page's pane fnc will (might?) be null.
						if ( pagePane.paneFnc ) {
							pagePane.paneFnc ( o );	}
					}
				}
				return;
			}
			if ( o.to === 'button-bar' ) {
				this.bbFnc = o.bbFnc;
				return;
			}
			return;
		}	//	if ( o.do === 'set-call-down' ) 
		if ( o.do === 'set-call-down-correct' ) {
			if ( o.to === 'pane-content' ) {
				//	Getting the doAll() of the content - But - should not
				//	call until  * this *  component is mounted.  Got that?
				//	I.e., we know now that PaneContent is mounted. But we
				//	know nothing about its client content - so we can not
				//	set its state, for example.
				//	So what?  When can the content's state be set?
				//	The client content will command this 'client-content'.
				this.correctPaneContentFnc = o.fnc;
				return;
			}
		}	//	if ( o.do === 'set-call-down-correct' ) 
		if ( o.do === 'pane-burger-click' ) {
			this.burgerClick();
			return;
		}
		if ( o.do === 'split-horz' ) {
			return this.splitHorz ( o );
		}
		if ( o.do === 'split-vert' ) {
			if ( o.paneId ) {
				//	How to find the pane to split?

				return;
			}
			return this.splitVert ( o );
		}
		if ( o.do == 'size-start' ) {
			if ( ! o.visitedPanes[this.props.paneId] ) {
				let cs = this.state.containerStyle;
				if ( cs ) {
					this.containerH0 = Number.parseInt ( cs.height ); }
				o.visitedPanes[this.props.paneId] = true; }
		//	if ( this.props.tabId ) {
		//		this.sizeStartByTabPage(); }
			this.propagateDown_SizeOp ( o );
			return;
		}
		if ( o.do === 'size' ) {
			if ( ! o.visitedPanes[this.props.paneId] ) {

			//	let cs = this.state.containerStyle;
			//	if ( cs ) {
			//	//	this.sized = true;
			//		this.setState ( { containerStyle: { 
			//			width: '100%', 
			//			height: (this.containerH0 + o.dY) + 'px' } } ); }

			//	//	o.dY is the change of height of the frame. If this pane
			//	//	is nested in splits then this pane's height will have only
			//	//	changed by approx (o.dY / (2 ** numVertNestings)).
			//	//	Just to simplify (for now) ...
			//	let e  = document.getElementById ( this.eleId );
			//	let pe = e.parentElement;
			//	this.setState ( { containerStyle: { 
			//		width: '100%', 
			//		height: pe.offsetHeight + 'px' } } ); }
				o.visitedPanes[this.props.paneId] = true; }

		//	this.width += o.dX;
			this.propagateDown_SizeOp ( o );
			return;
		}
		if ( o.do === 'splitter-dragged' ) {
			this.propagateDown_SizeOp ( o );
			return;
		}
		if ( o.do === 'enum-panes' ) {
			this.enumPanes ( o );
			return;
		}
		if ( o.do === 'focus' ) {
			if ( this.tabsFnc ) {
				return this.tabsFnc ( o ); }
			this.focus ( o );
			return;
		}
		if ( o.do === 'not-focus' ) {
			if ( this.tabsFnc ) {
				return this.tabsFnc ( o ); }
			this.focusNot ( o );
			return;
		}
		if ( o.do === 'key-burger-menu' ) {
			this.keyBurgerMenu ( o );
			return;
		}
		if ( o.do === 'cycle-tab-focus' ) {
			if ( this.tabsFnc ) {			//	this pane holds the tabs ...
				return this.tabsFnc ( o ); }
			if ( this.props.tabsFnc ) {		//	this pane is that of a tab ...
				return this.props.tabsFnc ( o ); }
			return this.doAll;
		}
		if ( o.do === 'keyboard-key-down' ) {
			if ( this.ccFnc ) {
				return this.ccFnc ( o ); }
			return false;
		}
		if ( o.do === 'get-state' ) {
			let state = this.doGetState ( o );
			this.props.clientFnc ( { do: 		'store-pane-state',
									 paneId: 	this.props.paneId,
									 state:		state } );
			if ( state.tabsState ) {
				return state; }
			return null;
		}
		if ( o.do === 'set-state' ) {
			console.log ( sW );
			let state = this.props.clientFnc ( { 
							do: 	'load-pane-state',
							paneId:	this.props.paneId } );
			if ( ! state ) {
				return; }
			return this.doSetState ( state );
		}
		if ( o.do === 'get-state-2' ) {
			return this.doGetState ( o );
		}
		if ( o.do === 'set-state-2' ) {
			console.log ( sW );
			return this.doSetState ( o.state );
		}
		if ( o.do === 'burger-menu-dismissed' ) {
			this.isShowingBurgerMenu = false;
			return;
		}

		if ( o.do === 'menu-item' ) {
			if ( this.ccFnc && this.ccFnc ( o ) ) {
				return; }
			if ( o.menuItemText === 'Tabs' ) {
				diagsFlush();
				diagsPrint ( sW, 2, 2000 );
				diag ( [2], sW + ' menu-item Tabs' );
				this.setState ( { tabs: true } );
				return;	}
			if ( this.props.tabId && (o.menuItemText === 'Tab Name ...' ) ) {
				this.props.tabsFnc ( { do: 		'name-tab',
									   tabId:	this.props.tabId } );
				return; }
			o.paneId		 = this.props.paneId;
			o.paneFnc 		 = this.doAll;
		//	o.paneContentFnc = this.paneContentFnc;
			o.paneContentFnc = this.correctPaneContentFnc;
			this.props.frameFnc ( o );
			return;
		}

		if ( o.do === 'add-tab' ) {
			if ( ! this.tabsFnc ) {
				console.log ( sW + ' ERROR: ! this.tabsFnc' );
				return; }
			return this.tabsFnc ( o );
		}

		if ( o.do === 'set-initial-tab-text' ) {
			if ( (! this.props.tabId) || (! this.props.tabsFnc) ) {
				return; }
			this.props.tabsFnc ( { do:		'name-tab-name',
								   initialTabName:	true,
								   ctx:		{ tabId: this.props.tabId },
								   name: 	o.initialTabText } );
			return;
		}
	//	if ( o.do === 'install-content' ) {
	//		this.ccEleId = o.ccEleId;
	//		this.setState ( { 
	//			contentStyle:	o.parentStyle,
	//			clientContent:	o.content
	//		} );
	//		return;
	//	}

	//	if ( o.do === 'is-at-frame-top-border' ) {
	//		if ( ! this.parentFnc ) {
	//
	//		}
	//		let sv = o.state.splitVert;
	//		if ( sv ) {
	//		}
	//		let sh = o.state.splitHorz;
	//		if ( sh ) {
	//		}
	//		return false;
	//	}

	//	if ( o.do === 'set-at-frame-top' ) {
	//		this.isAtFrameTop = o.is;
	//		if ( this.isAtFrameTop ) {
	//			//	The button bar for this pane should up in the frame's
	//			//	transient title bar thing.
	//			//	So the button bar element is not a child element of this
	//			//	pane.
	//		}
	//		return;
	//	}
		if ( this.ccFnc ) {
			return this.ccFnc ( o ); }
	}   //  doAll()

	render() {
		const sW = 'Pane ' + this.props.paneId + ' render()';
		//	When split horizontally - For example -
		if ( this.state.splitHorz ) {
		//	console.log ( 'Pane render() this.state.splitHorz )' );
			let style = null;
			if ( this.props.parentFnc ) {
				style = this.props.style; }
			else {
				style = this.state.style; }
			let lft = this.state.splitHorz.left;
			let rgt = this.state.splitHorz.right;
			return (
				<div id 		= { this.eleId }
					 className 	= { this.class }
					 style 		= { style } >
					<div style = { this.state.containerStyle } >
						<Pane frameId 		= { this.props.frameId }
						   	  paneId		= { lft.paneId }
							  eleId 		= { lft.eleId }
							  style			= { this.state.shLftStyle }
							  class 		= { lft.class }
							  peId 			= { this.props.peId }
							  frameFnc		= { this.props.frameFnc } 
							  parentFnc 	= { this.doAll } 
							  atFrameTop	= { this.props.atFrameTop }
							  clientFnc		= { this.props.clientFnc } />
						<div id				= { this.eleId + '-hsplitter' }
							 className		= 'pane-hsplitter' 
					 		 onPointerDown	= { this.hsplitterPointerDown }
							 onPointerUp	= { this.hsplitterPointerUp } />
						<Pane frameId 		= { this.props.frameId }
						   	  paneId		= { rgt.paneId }
							  eleId 		= { rgt.eleId } 
							  style			= { this.state.shRgtStyle }
							  class 		= { rgt.class }
							  peId 			= { this.props.peId }
							  frameFnc		= { this.props.frameFnc } 
							  parentFnc 	= { this.doAll } 
							  atFrameTop	= { this.props.atFrameTop } 
							  clientFnc		= { this.props.clientFnc } />
					</div>
				</div>
			); }

		if ( this.state.splitVert ) {
			diag ( [2], sW + ' splitVert' );
			let style = null;
			if ( this.props.parentFnc ) {
				style = this.props.style; }
			else {
				style = this.state.style; }
			let sv = this.state.splitVert;
			let top = sv.top;
			let bot = sv.bottom;
			return (
				<div id 		= { this.eleId }
					 className 	= { this.class }
					 style 		= { style } >
					<div style = { this.state.containerStyle } >
						<Pane frameId 		= { this.props.frameId }
					   	  	  paneId		= { top.paneId }
							  eleId 		= { top.eleId }
							  style			= { this.state.svTopStyle }
							  class 		= { top.class }
							  peId 			= { this.props.peId }
							  frameFnc		= { this.props.frameFnc } 
							  parentFnc 	= { this.doAll } 
							  atFrameTop	= { this.props.atFrameTop }
							  clientFnc		= { this.props.clientFnc } />
						<div id				= { this.eleId + '-vsplitter' }
							 className		= 'pane-vsplitter' 
					 		 onPointerDown	= { this.vsplitterPointerDown }
							 onPointerUp	= { this.vsplitterPointerUp } />
						<Pane frameId 		= { this.props.frameId }
					   	  	  paneId		= { bot.paneId }
							  eleId 		= { bot.eleId } 
							  style			= { this.state.svBotStyle }
							  class 		= { bot.class }
							  peId 			= { this.props.peId }
							  frameFnc		= { this.props.frameFnc } 
							  parentFnc 	= { this.doAll } 
							  atFrameTop	= { false } 
							  clientFnc		= { this.props.clientFnc } />
					</div>
				</div>
			); }

		if ( this.props.parentFnc ) {
			if ( this.props.atFrameTop ) {
				if ( this.state.tabs ) {
					diag ( [2], sW + ' got parent, at top, tabs' );
					return (
						<div id 		= { this.eleId }
							className 	= { this.class }
							style 		= { this.props.style } >
							<PaneContent eleId 		= { this.contentEleId } 
										 peId		= { this.props.peId }
										 frameId 	= { this.props.frameId }
					   	  	  			 paneId		= { this.props.paneId }
										 paneFnc	= { this.doAll }
										 frameFnc 	= { this.props.frameFnc }
										 clientFnc	= { this.props.clientFnc } 
										 tabs 		= { true } />
							{ this.state.hasFocus && 
								<div className = { this.state.focusClass }/> }
						</div>
					);
				}
				diag ( [2], sW + ' got parent, at top' );
				return (
					<div id 		= { this.eleId }
						 className 	= { this.class }
						 style 		= { this.props.style } >
						<PaneContent eleId 		= { this.contentEleId }
									 peId		= { this.props.peId }
									 frameId 	= { this.props.frameId }
					   	  	  		 paneId		= { this.props.paneId }
					  				 paneFnc	= { this.doAll }
									 frameFnc 	= { this.props.frameFnc } 
								//	 style	 = { this.state.contentStyle }
								//	 content = { this.state.clientContent } 
									 clientFnc	= { this.props.clientFnc } />
						<PaneButtonBar atFrameTop	= { this.props.atFrameTop } 
									   bbId			= { this.props.paneId }
									   paneFnc		= { this.doAll } 
									   frameFnc 	= { this.props.frameFnc } />
						{ this.state.hasFocus && 
							<div className = { this.state.focusClass }/> }
					</div>
				); 
			} else {
				if ( this.state.tabs ) {
					diag ( [2], sW + ' got parent, not at top, tabs' );
					return (
						<div id 		= { this.eleId }
							className 	= { this.class }
							style 		= { this.props.style } >
							<PaneContent eleId 		= { this.contentEleId } 
										 peId		= { this.props.peId }
										 frameId 	= { this.props.frameId }
					   	  	  			 paneId		= { this.props.paneId }
										 paneFnc	= { this.doAll }
										 frameFnc 	= { this.props.frameFnc }
										 clientFnc	= { this.props.clientFnc } 
										 tabs 		= { true } />
							{ this.state.hasFocus && 
								<div className = { this.state.focusClass }/> }
						</div>
					);
				}
				diag ( [2], sW + ' got parent, not at top' );
				return (
					<div id 		= { this.eleId }
						 className 	= { this.class }
						 style 		= { this.props.style } >
						<PaneContent eleId 		= { this.contentEleId }
									 peId		= { this.props.peId }
									 frameId 	= { this.props.frameId }
					   	  	  		 paneId		= { this.props.paneId }
					  				 paneFnc	= { this.doAll }
									 frameFnc 	= { this.props.frameFnc } 
									 clientFnc	= { this.props.clientFnc } />
						<PaneButtonBar atFrameTop	= { this.props.atFrameTop } 
									   bbId			= { this.props.paneId }
									   paneFnc		= { this.doAll } 
									   frameFnc 	= { this.props.frameFnc } />
						{ this.state.hasFocus && 
							<div className = { this.state.focusClass }/> }
					</div>
				); 
			}
		}	//	if ( this.props.parentFnc )
		
		if ( this.state.tabs ) {
			diag ( [1, 2], sW + ' no split, no parent, tabs');
			return (
				<div id 		= { this.eleId }
					className 	= { this.class }
					style 		= { this.state.style } >
					<PaneContent eleId 		= { this.contentEleId } 
								 atFrameTop	= { this.props.atFrameTop }
								 peId		= { this.props.peId }
								 frameId 	= { this.props.frameId }
					   	  	  	 paneId		= { this.props.paneId }
								 paneFnc	= { this.doAll }
								 frameFnc 	= { this.props.frameFnc }
								 clientFnc	= { this.props.clientFnc } 
								 tabs 		= { true } />
				</div>
			);
		}
		diag ( [1, 2], sW + ' no split, no parent');
		return (
			<div id 		= { this.eleId }
				 className 	= { this.class }
				 style 		= { this.state.style } >
				<PaneContent eleId 		= { this.contentEleId } 
							 peId		= { this.props.peId }
							 frameId 	= { this.props.frameId }
					   	  	 paneId		= { this.props.paneId }
							 paneFnc	= { this.doAll }
							 frameFnc 	= { this.props.frameFnc } 
							 clientFnc	= { this.props.clientFnc } />
				<PaneButtonBar atFrameTop	= { this.props.atFrameTop } 
							   bbId			= { this.props.paneId }
							   paneFnc		= { this.doAll } 
							   frameFnc 	= { this.props.frameFnc } />
				{ this.state.hasFocus && 
					<div className = { this.state.focusClass }/> }
			</div>
		);
	}   //  render()

	componentDidMount() {
		const sW = 'Pane ' + this.props.paneId + ' componentDidMount()';
		diag ( [1, 2, 3], sW );

		if ( ! this.props.parentFnc ) {
			this.props.frameFnc ( { do:		'set-call-down',
									to:		'root-pane',
									fnc:	this.doAll } ); }
		this.mounted = true;
	}	//	componentDidMount()

	componentDidUpdate() {
		const sW = 'Pane ' + this.props.paneId + '  componentDidUpdate()';
		diag ( [1, 2], sW );
		let sh = this.state.splitHorz;
		if ( sh && sh.incomplete ) {
		//	let pe = document.getElementById ( this.eleId );

		//	//  Put the copied contents in the left <div>.
		//	let lft = document.getElementById ( sh.left.eleId );

		//	//	Some content in the right side pane.
		//	let rgt = document.getElementById ( sh.right.eleId );

		//	//	Add the gutter <div>.
		//	let d = this.eleData[pe.id];
		//	if ( d && d.splitSizes )
		//		sh.opts.sizes = d.splitSizes;
		//	let split = Split ( ['#' + sh.left.eleId, 
		//						 '#' + sh.right.eleId], 
		//						sh.opts );

		//	//	Remember the split instance.
		//	if ( ! this.eleData[pe.id] )
		//		this.eleData[pe.id] = {};
		//	this.eleData[pe.id].split = { instance: split };

			this.propagateDown_SizeOp ( { do: 'splitter-dragged' } );

			sh.left.paneFnc ( { do: 'set-state'} )

			sh.right.paneFnc ( { do: 'set-state'} )

			sh.incomplete = false
		}
		let sv = this.state.splitVert;
		if ( sv && sv.incomplete ) {
		//	let pe = document.getElementById ( this.eleId );

		//	//  Put the copied contents in the top <div>.
		//	let top = document.getElementById ( sv.top.eleId );

		//	//	Some content in the bottom side pane.
		//	let bot = document.getElementById ( sv.bottom.eleId );

		//	//	Add the gutter <div>.
		//	let d = this.eleData[pe.id];
		//	if ( d && d.splitSizes )
		//		sv.opts.sizes = d.splitSizes;
		//	let split = Split ( ['#' + sv.top.eleId, 
		//						 '#' + sv.bottom.eleId], 
		//						sv.opts );

		//	//	Remember the split instance.
		//	if ( ! this.eleData[pe.id] )
		//		this.eleData[pe.id] = {};
		//	this.eleData[pe.id].split = { instance: split };

			this.propagateDown_SizeOp ( { do: 'splitter-dragged' } );

			sv.top.paneFnc ( { do:	'set-state'} )

			sv.bottom.paneFnc ( { do:	'set-state'} )

			sv.incomplete = false
		}
	}	//	componentDidUpdate()

	componentWillUnmount() {
		const sW = 'Pane ' + this.props.paneId + ' componentWillUnmount()';
		diag ( [1, 2, 3], sW );
		if ( this.props.tabId ) {
			this.props.parentFnc ( { do:			'set-call-down',
									 to:			'tab-page-pane',
									 tabId:			this.props.tabId,
									 tabPaneFnc:	null } ); 
			this.props.tabsFnc ( { do:			'set-call-down',
								   to:			'tab-page-pane',
								   tabId:		this.props.tabId,
								   tabPaneFnc:	null } ); 
		}
	}	//	componentWillUnmount()

}   //  class Pane

export { Pane as default, getPaneId, getLastPaneId, setLastPaneId };
