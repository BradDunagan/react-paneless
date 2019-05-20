import React, { Component } from 'react';

import AppHeader 			from './app-header';
import AppContent 			from './app-content';
import AppFooter 			from './app-footer';

import AppDialog			from './app-dialog';

class AppFrame extends Component {
	constructor ( props ) {
		super ( props );

		this.state = {
			appDialog:  [],
		};

		this.dlgList = [];

		this.appContentFnc		= null;
		this.activeMenuFnc		= null;
		this.activeDialogFnc	= null;
		this.focusedFrameFnc	= null;
		this.focusedPaneFnc		= null;

		this.keyDown		= this.keyDown.bind ( this );
		this.mouseMove 		= this.mouseMove.bind ( this );
		this.mouseUp 		= this.mouseUp.bind ( this );
		this.doAll 			= this.doAll.bind ( this );
	
	
		this.frameMoving = {
			moverMouseDown: 	false,
			frameFnc:			null,
			startX: 			0,
			startY: 			0
		};
		this.frameSizing = {
			sizerMouseDown: 	false,
			frameFnc:			null,
			startX: 			0,
			startY: 			0
		};
	}	//	constructor()

	keyDown ( ev ) {
		let sW = 'AppFrame keyDown()';

		if ( 	this.activeMenuFnc 
			 && this.activeMenuFnc ( { do: 'keyboard-key-down', ev: ev } ) ) {
			return; }

		if ( 	this.activeDialogFnc 
			 && this.activeDialogFnc ( { do: 'keyboard-key-down', ev: ev } ) ) {
			return; }

		if (    this.focusedPaneFnc 
			 && this.focusedPaneFnc ( { do: 'keyboard-key-down', ev: ev } ) ) {
			console.log ( sW + ': pane got it' );
			ev.preventDefault();
			return; }

		if ( this.appContentFnc ( { do: 'keyboard-key-down', ev: ev } ) ) {
			return; }

	//	if ( ev.ctrlKey ) {
	//		console.log ( sW + ' ctrl ' + ev.key ); }

	//	if ( ev.altKey ) {
	//		console.log ( sW + ' alt ' + ev.key ); }

	//	//	Shift-Tab to cycle focus on not-iconized frames.
	//	if ( ev.shiftKey ) {
		//	Alt-F 	cycle focus on frames and the app title menu.
		//	Alt-P 	cycle focus on panes within a frame.
		//	Alt-B 	show burger menu. First focused pane's then a second
		//			alt-B to show the focused frame's.
		//	Alt-T 	cycle tabs (if the focused pane is that of a tab). 
		if ( ev.altKey ) {
	//		console.log ( sW + ' shift ' + ev.key ); 
	//		console.log ( sW + ' alt ' + ev.key ); 
	//		if ( ev.key === 'Tab' ) {
			let key = ev.key.toUpperCase();
			if ( key === 'F' ) {
				ev.preventDefault();
				//	If menu and not app title menu then close it.
				if ( 	this.activeMenuFnc 
					 && ! this.activeMenuFnc ( { do: 'is-app-title-menu' } ) ) {
					this.activeMenuFnc ( { do: 'keyboard-escape' } ); }
				//	Focus on next frame. Or show the app title menu.
				let focus = this.appContentFnc ( { do: 'cycle-frame-focus' } );
				if ( focus ) {
					this.focusedFrameFnc = focus.frameFnc;
					this.focusedPaneFnc  = focus.paneFnc; }
				else {
					this.focusedFrameFnc = null;
					this.focusedPaneFnc  = null; }
				return; } 
			if ( key === 'P' ) {
				if ( typeof this.focusedFrameFnc === 'function' ) {
					this.focusedPaneFnc = this.focusedFrameFnc ( 
						{ do: 'cycle-pane-focus' } ); }
				return; }
			if ( key === 'B' ) {
				if ( typeof this.focusedFrameFnc === 'function' ) {
					this.focusedFrameFnc ( { do: 'key-burger-menu' } ); }
				return; }
			if ( key === 'T' ) {
				if ( typeof this.focusedPaneFnc === 'function' ) {
					let x = this.focusedPaneFnc ( { do: 'cycle-tab-focus' } ); 
					if ( ! x ) {
						this.focusedPaneFnc = null; 
						return; }
					if ( typeof x === 'function' ) {
						this.focusedPaneFnc = x;
						return; }
					//	assume its a promise
					this.focusedPaneFnc = null;
					x.then ( fnc => {
						this.focusedPaneFnc = fnc;
					} )
					.catch ( err => { 
						console.log ( sW + ' error: ' + err );
					} ); 
				return; } }
		}

		if ( ev.key === 'Escape' ) {
			if ( this.activeMenuFnc ) {
				this.activeMenuFnc ( { do: 'keyboard-escape' } );
				return;
			}
		}
	}	//	keyDown()

	mouseMove ( ev ) {
		let sW = 'mouseMove()';
	//	console.log ( sW );
		if ( this.frameMoving.moverMouseDown ) {
			this.frameMoving.frameFnc ( { do: 	'move',
										  dX:	ev.pageX - this.frameMoving.startX,
										  dY:	ev.pageY - this.frameMoving.startY } );
			ev.preventDefault();
			return;	}
		if ( this.frameSizing.sizerMouseDown ) {
			this.frameSizing.frameFnc ( { do: 	'size',
										  dX:	ev.pageX - this.frameSizing.startX,
										  dY:	ev.pageY - this.frameSizing.startY,
										  visitedPanes:	{} } );
			ev.preventDefault();
			return;	}
	}	//	mouseMove()

	mouseUp ( ev ) {
		let sW = 'mouseUp()';
	//	console.log ( sW );
		if ( this.frameMoving.moverMouseDown ) {
			this.frameMoving.moverMouseDown	= false;
			this.frameMoving.frameFnc		= null;
			return;	}
		if ( this.frameSizing.sizerMouseDown ) {
			this.frameSizing.sizerMouseDown	= false;
			this.frameSizing.frameFnc		= null;
			return;	}
	}	//	mouseUp()

	updateDialogState() {
		this.setState ( {  
			appDialog: this.dlgList.map ( ( r, i ) => {
				if ( r.dlg === 'app-dialog-frame' ) {
					return ( <AppDialog key 		  = { i }
										appFrameFnc   = { this.doAll }
										appContentFnc = { this.appContentFnc }
										clientFnc	  = { this.props.clientFnc }
										frame 		  = { r.frame } /> );
				}
				if ( r.dlg === 'app-dialog' ) {
					return ( <AppDialog key 		= { i }
										appFrameFnc = { this.doAll }
										comp 		= { r.comp } /> );
				}
				if ( ! r.mnu ) {
					return ( <AppDialog key = {i}
										appFrameFnc = {this.doAll}
										upFnc = {r.upFnc}
										ctx = {r.ctx}
										dlg = {r.dlg}
										mnu = {r.mnu} /> );
				} else {
					return ( <AppDialog key = {i}
										appFrameFnc = {this.doAll}
										dlg = {r.dlg}
										mnu = {r.mnu} /> );
				}
			} )
		} );
	}	//	updateDialogState()

	doAll ( o ) {
		if ( o.do === 'set-call-down' ) {
			if ( o.to === 'app-content' ) {
				this.appContentFnc = o.fnc; 
				return; }
			if ( o.to === 'active-menu' ) {
				let prevGAMF = this.activeMenuFnc;	//	Global Active Menu Function
				this.activeMenuFnc = o.fnc;
				return prevGAMF; }
			if ( o.to === 'active-dialog' ) {
				this.activeDialogFnc = o.fnc;
				return; }
			return;
		}
		if ( o.do === 'focus-app-title' ) {
			this.props.clientFnc ( o );
			return;
		}
		if ( o.do === 'not-focus-app-title' ) {
			if ( this.activeMenuFnc ) {
				this.activeMenuFnc ( { do: 'keyboard-escape' } ); }
			return;
		}
		if ( o.do === 'move-frame' ) {
			this.frameMoving.moverMouseDown	= true;
			this.frameMoving.frameFnc 		= o.frameFnc;
			this.frameMoving.startX			= o.ev.pageX;
			this.frameMoving.startY			= o.ev.pageY;
			return;
		}
		if ( o.do === 'size-frame' ) {
			this.frameSizing.sizerMouseDown	= true;
			this.frameSizing.frameFnc 		= o.frameFnc;
			this.frameSizing.startX			= o.ev.pageX;
			this.frameSizing.startY 		= o.ev.pageY;
			return;
		}
		if ( o.do === 'show-sign-in-dlg' ) {
			this.dlgList.push ( { dlg: 		'sign-in',
								  upFnc: 	this.doAll,
								  ctx: 		null } );
			this.updateDialogState();
			return;
		}
		if ( o.do === 'show-name-dlg' ) {
			this.dlgList.push ( { dlg: 		'dlg-name',
								  upFnc: 	o.upFnc,
								  ctx: 		o.ctx } );
			this.updateDialogState();
			return;
		}
		if ( o.do === 'app-dialog' ) {
			this.dlgList.push ( { dlg: 		'app-dialog',
								  comp:		o.dlgComp } );
			this.updateDialogState();
			return;
		}
		if ( o.do === 'app-dialog-frame' ) {
			this.dlgList.push ( { dlg:		'app-dialog-frame',
								  frame:	o.frame } );
			this.updateDialogState();
			return;
		}
		if ( o.do === 'show-menu' ) {
			this.dlgList.push ( { dlg: 		'menu',
								  mnu:		o } );
			this.updateDialogState();
			return;
		}
		if ( o.do === 'menu-dismiss' ) {
			if ( this.activeMenuFnc ) {
				this.activeMenuFnc ( { do: 'being-dismissed' } ); }
			this.dlgList.pop();
			this.updateDialogState();
			this.activeMenuFnc = null;
			this.appContentFnc ( o );
			return;
		}
		if ( o.do === 'close-dlg' ) {
			this.dlgList.pop();
			this.updateDialogState();
			this.activeDialogFnc = null;
			return;
		}
		if ( o.do === 'set-focused-frame-fnc' ) {
			if ( o.focus ) {
				this.focusedFrameFnc = o.focus.frameFnc;
				this.focusedPaneFnc  = o.focus.paneFnc; }
			else {
				this.focusedFrameFnc = null;
				this.focusedPaneFnc  = null; }
			return;			
		}
	}	//	doAll()

	render() {
		return (
			<div className		= 'rr-app-frame'
				 onMouseMove	= { this.mouseMove } 
				 onMouseUp		= { this.mouseUp } >
				<AppHeader appTitle			= { this.props.appTitle }
						   appTitleClick	= { this.props.appTitleClick }
						   clientFnc   		= { this.props.clientFnc }
						   appFrameFnc 		= { this.doAll } />
				<AppContent clientFnc 	= { this.props.clientFnc }
							appFrameFnc = { this.doAll } 
							profound1	= { this.props.profound1 }
							profound2	= { this.props.profound2 } />
				<AppFooter />
				{ this.state.appDialog }
			</div>
		);
	}	//	render()

	componentDidMount() {
		document.addEventListener ( 'keydown', this.keyDown );
	}	//	componentDidMount()

} //  class AppFrame

export default AppFrame;
