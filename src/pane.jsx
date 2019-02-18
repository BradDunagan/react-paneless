/*
		 1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890

*/

import React			from 'react';

import PaneContent		from './pane-content';
import PaneButtenBar 	from './pane-button-bar';
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
	//	this.sizeStartByTabPage		= this.sizeStartByTabPage.bind ( this );
	//	this.sizeByTabPage			= this.sizeByTabPage.bind ( this );
		this.propagateDown_SizeOp 	= this.propagateDown_SizeOp.bind ( this );
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
			splitVert:		null,

			tabs:			props.tabs ? true : false,
		};

		this.tabsFnc 		= null;
		this.tabPagePanes	= {};		//	keyed by tab ID
		this.h0				= 0;		//	used when this is on a tab page

		this.paneContentFnc 		= null;
		this.correctPaneContentFnc	= null;

		this.ccFnc		= null;
		this.ccState	= null;

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
						  after:	'menu-item' }
		} );

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
		let sizes = this.eleData[this.eleId].split.instance.getSizes();

	//	if ( ! this.props.parentFnc ) {
	//		this.props.frameFnc ( { do: 	'content-split-drag',
	//								sizes: 	sizes } );
	//	}
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

		this.setState ( { 
			style: Object.assign ( { 
				backgroundColor:	'lightgray' },
				this.state.style ), 
			splitHorz: { 
				left: {
					eleId: 			this.eleId + '-lft-' + lftPaneId,
					class: 			'split split-horizontal pane',
					paneId:			lftPaneId,
					paneFnc: 		null,
					contentState: 	null
				},
				right: {
					eleId: 			this.eleId + '-rgt-' + rgtPaneId,
					class: 			'split split-horizontal pane',	
					paneId:			rgtPaneId,
					paneFnc: 		null,
				},
				opts: {
					direction:		'horizontal',
					gutterSize: 	6,
					minSize: 		20,
					snapOffset: 	5,
					cursor: 		'col-resize',
					elementStyle:	this.myElementStyleFnc,
					onDrag:			this.splitDrag
				},
				incomplete: 	true }
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

		this.setState ( { 
			style: Object.assign ( { 
				backgroundColor:	'lightgray' }, 
				this.state.style ),
			containerStyle: {
				flex:		'1 1',
				overflowX:	'hidden' },
			splitVert: { 
				top: {
					eleId: 			this.eleId + '-top-' + topPaneId,
					class: 			'split split-vertical pane',
					paneId:			topPaneId,
					paneFnc: 		null,
					contentState: 	null
				},
				bottom: {
					eleId: 			this.eleId + '-bot-' + botPaneId,
					class: 			'split split-vertical pane',	
					paneId:			botPaneId,
					paneFnc: 		null,
				},
				opts: {
					direction:		'vertical',
					gutterSize: 	6,
					minSize: 		20,
					snapOffset: 	5,
					cursor: 		'row-resize',
					elementStyle:	this.myElementStyleFnc,
					onDrag:			this.splitDrag
				},
				incomplete: 	true, }
		} );
		return { topPaneId: topPaneId,
				 botPaneId: botPaneId };
	}	//	splitVert()

	propagateDown_SizeOp ( o ) {
		let sh = this.state.splitHorz;
		if ( sh ) {
			sh.left.paneFnc ( o );
			sh.right.paneFnc ( o );	}
		let sv = this.state.splitVert;
		if ( sv ) {
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
			let e = document.getElementById ( this.eleId );
			if ( e ) {
				o.paneW = e.clientWidth;
				o.paneH = e.clientHeight;
				this.ccFnc ( o ); } }
	}	//	propagateDown_SizeOp()

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
					//	If we have already gotten the client content state ...
					if ( this.ccState ) {
						this.ccFnc ( { do: 		'set-state',
									   state:	this.ccState } );
						this.ccState = null; }
					else {
						let state = this.props.clientFnc ( { 
										do: 	'load-state',
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
		if ( o.do === 'get-state' ) {
			let pe = document.getElementById ( this.eleId );
			let state = clone ( this.state );
			let sh = state.splitHorz;
			let sv = state.splitVert;
			if ( sh ) {
				sh.left.contentState = sh.left.paneFnc ( o );
				sh.left.paneFnc = null;
				sh.right.contentState = sh.right.paneFnc ( o );
				sh.right.paneFnc = null;
				sh.opts.elementStyle = null;
				sh.opts.onDrag = null; }
			if ( sv ) {
				sv.top.contentState = sv.top.paneFnc ( o );
				sv.top.paneFnc = null;
				sv.bottom.contentState = sv.bottom.paneFnc ( o );
				sv.bottom.paneFnc = null;
				sv.opts.elementStyle = null;
				sv.opts.onDrag = null; }
			if ( (! sh) && (! sv) && this.ccFnc ) {
				state.ccState = this.ccFnc ( o );
			} else {
				state.ccState = null; }
			if ( this.state.tabs ) {
				state.tabsState = this.tabsFnc ( o );
			} else {
				state.tabsState = false; }
			state.eleData = {};
			let d = this.eleData[pe.id];
			if ( d && d.split ) {
				state.eleData.splitSizes = d.split.instance.getSizes(); }
			else {
				state.eleData.splitSizes = null; }

			this.props.clientFnc ( { do: 		'store-state',
									 paneId: 	this.props.paneId,
									 state:		state } );
			return null;
		}
		if ( o.do === 'set-state' ) {
			let state = this.props.clientFnc ( { 
							do: 	'load-state',
							paneId:	this.props.paneId } );
			if ( ! state ) {
				return; }
			let sh = state.splitHorz;
			let sv = state.splitVert;
			if ( (! this.props.parentFnc) && (sh || sv) ) {
				this.props.frameFnc ( { do: 'clear-pane-btn-bars' } ); }
			if ( sh ) {
				sh.opts.elementStyle	= this.myElementStyleFnc;
				sh.opts.onDrag			= this.splitDrag;
				sh.incomplete			= true; }
			if ( sv ) {
				sv.opts.elementStyle	= this.myElementStyleFnc;
				sv.opts.onDrag			= this.splitDrag;
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
			
			let d = this.eleData[this.eleId] = {};
			if ( state.eleData.splitSizes ) {
				d.splitSizes = state.eleData.splitSizes; }

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
			let lft = this.state.splitHorz.left;
			let rgt = this.state.splitHorz.right;
			return (
				<div id 		= { this.eleId }
					 className 	= { this.class }
					 style 		= { this.state.style } >
					<Pane frameId 		= { this.props.frameId }
					   	  paneId		= { lft.paneId }
						  eleId 		= { lft.eleId }
						  class 		= { lft.class }
						  peId 			= { this.props.peId }
						  frameFnc		= { this.props.frameFnc } 
						  parentFnc 	= { this.doAll } 
						  atFrameTop	= { this.props.atFrameTop }
						  clientFnc		= { this.props.clientFnc } />
					<Pane frameId 		= { this.props.frameId }
					   	  paneId		= { rgt.paneId }
						  eleId 		= { rgt.eleId } 
						  class 		= { rgt.class }
						  peId 			= { this.props.peId }
						  frameFnc		= { this.props.frameFnc } 
						  parentFnc 	= { this.doAll } 
						  atFrameTop	= { this.props.atFrameTop } 
						  clientFnc		= { this.props.clientFnc } />
				</div>
			); }

		if ( this.state.splitVert ) {
			diag ( [2], sW + ' splitVert' );
			let sv = this.state.splitVert;
			let top = sv.top;
			let bot = sv.bottom;
			return (
				<div id 		= { this.eleId }
					 className 	= { this.class }
					 style 		= { this.state.style } >
					<div style = { this.state.containerStyle } >
						<Pane frameId 		= { this.props.frameId }
					   	  	  paneId		= { top.paneId }
							  eleId 		= { top.eleId }
							  class 		= { top.class }
							  peId 			= { this.props.peId }
							  frameFnc		= { this.props.frameFnc } 
							  parentFnc 	= { this.doAll } 
							  atFrameTop	= { this.props.atFrameTop }
							  clientFnc		= { this.props.clientFnc } />
						<Pane frameId 		= { this.props.frameId }
					   	  	  paneId		= { bot.paneId }
							  eleId 		= { bot.eleId } 
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
							style 		= { this.state.style } >
							<PaneContent eleId 		= { this.contentEleId } 
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
				diag ( [2], sW + ' got parent, at top' );
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
								//	 style	 = { this.state.contentStyle }
								//	 content = { this.state.clientContent } 
									 clientFnc	= { this.props.clientFnc } />
						<PaneButtenBar atFrameTop	= { this.props.atFrameTop } 
									   bbId			= { this.props.paneId }
									   paneFnc		= { this.doAll } 
									   frameFnc 	= { this.props.frameFnc } />
					</div>
				); 
			} else {
				if ( this.state.tabs ) {
					diag ( [2], sW + ' got parent, not at top, tabs' );
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
										 clientFnc	= { this.props.clientFnc } 
										 tabs 		= { true } />
						</div>
					);
				}
				diag ( [2], sW + ' got parent, not at top' );
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
						<PaneButtenBar atFrameTop	= { this.props.atFrameTop } 
									   bbId			= { this.props.paneId }
									   paneFnc		= { this.doAll } 
									   frameFnc 	= { this.props.frameFnc } />
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
				<PaneButtenBar atFrameTop	= { this.props.atFrameTop } 
							   bbId			= { this.props.paneId }
							   paneFnc		= { this.doAll } 
							   frameFnc 	= { this.props.frameFnc } />
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
	}	//	componentDidMount()

	componentDidUpdate() {
		const sW = 'Pane ' + this.props.paneId + '  componentDidUpdate()';
		diag ( [1, 2], sW );
		let sh = this.state.splitHorz;
		if ( sh && sh.incomplete ) {
			let pe = document.getElementById ( this.eleId );

			//  Put the copied contents in the left <div>.
			let lft = document.getElementById ( sh.left.eleId );

			//	Some content in the right side pane.
			let rgt = document.getElementById ( sh.right.eleId );

			//	Add the gutter <div>.
			let d = this.eleData[pe.id];
			if ( d && d.splitSizes )
				sh.opts.sizes = d.splitSizes;
			let split = Split ( ['#' + sh.left.eleId, 
								 '#' + sh.right.eleId], 
								sh.opts );

			//	Remember the split instance.
			if ( ! this.eleData[pe.id] )
				this.eleData[pe.id] = {};
			this.eleData[pe.id].split = { instance: split };

			this.propagateDown_SizeOp ( { do: 'splitter-dragged' } );

			sh.left.paneFnc ( { do:	'set-state'} )

			sh.right.paneFnc ( { do:	'set-state'} )

		//	if ( this.props.atFrameTop ) {
		//		this.props.frameFnc ( { do: 		'add-pane-btn-bar',
		//							  	paneEleId:	sh.left.eleId,
		//								paneFnc:	sh.left.paneFnc,
		//								paneLeft:	lft.offsetLeft,
		//								paneWidth:	lft.offsetWidth } );
		//		this.props.frameFnc ( { do: 		'add-pane-btn-bar',
		//							  	paneEleId:	sh.right.eleId,
		//								paneFnc:	sh.right.paneFnc,
		//								paneLeft:	rgt.offsetLeft,
		//								paneWidth:	rgt.offsetWidth } );
		//	}
			sh.incomplete = false
		}
		let sv = this.state.splitVert;
		if ( sv && sv.incomplete ) {
			let pe = document.getElementById ( this.eleId );

			//  Put the copied contents in the top <div>.
			let top = document.getElementById ( sv.top.eleId );

			//	Some content in the bottom side pane.
			let bot = document.getElementById ( sv.bottom.eleId );

			//	Add the gutter <div>.
			let d = this.eleData[pe.id];
			if ( d && d.splitSizes )
				sv.opts.sizes = d.splitSizes;
			let split = Split ( ['#' + sv.top.eleId, 
								 '#' + sv.bottom.eleId], 
								sv.opts );

			//	Remember the split instance.
			if ( ! this.eleData[pe.id] )
				this.eleData[pe.id] = {};
			this.eleData[pe.id].split = { instance: split };

			this.propagateDown_SizeOp ( { do: 'splitter-dragged' } );
			let topSplit = sv.top.paneFnc ( { do:	'set-state'} )

			sv.bottom.paneFnc ( { do:	'set-state'} )

		//	if ( this.props.atFrameTop && ! topSplit ) {
		//		this.props.frameFnc ( { do: 		'add-pane-btn-bar',
		//							  	paneEleId:	sv.top.eleId,
		//								paneFnc:	sv.top.paneFnc,
		//								paneLeft:	top.offsetLeft,
		//								paneWidth:	top.offsetWidth } );
		//	}

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
