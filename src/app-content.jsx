/*
		 1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/
import React, { Component } from 'react';
import clone 				from 'clone';

import Frame				from './frame';
import { getPaneId, getLastPaneId, setLastPaneId }	from './pane';

import {diag, diagsFlush, diagsPrint} 	from './diags';


let lastFrameId = 0;


function getFrameId() {
	return ++lastFrameId;
}

function getLastFrameId() {
	return lastFrameId;
}

function setLastFrameId ( frameId ) {
	lastFrameId = frameId;
}

class AppContent extends React.Component {
	constructor ( props ) {
		super ( props );

		this.state = {
			frames: [],             //  PEs, VPs (what else?) to render
		};

		this.eleId = 'rr-app-content';

		this.e2eCmdInputEleId	= "rr-0-e2et-cmd-input-input";
		this.e2eCmdOutputEleId	= "rr-0-e2et-cmd-output-input";
		this.e2eCmdCnt			= 0;
		
		this.frames = {};			//	PEs, VPs (what else?) code/interfaces.

		this.e2eCmdChange		= this.e2eCmdChange.bind ( this );
//		this.e2eCmdInput		= this.e2eCmdInput.bind ( this );
		this.e2eSetOutput		= this.e2eSetOutput.bind ( this );
		this.e2eClearOutput		= this.e2eClearOutput.bind ( this );
		this.keyDown			= this.keyDown.bind ( this );
		this.setFrameFocus2		= this.setFrameFocus2.bind ( this );
		this.setFrameFocus		= this.setFrameFocus.bind ( this );
		this.cycleFrameFocus	= this.cycleFrameFocus.bind ( this );
		this.addFrame 		= this.addFrame.bind ( this );
		this.addFrames		= this.addFrames.bind ( this );
		this.destroyFrame	= this.destroyFrame.bind ( this );
		this.doAll 			= this.doAll.bind ( this );

		this.focusedFrameId = null;

	}   //  constructor()

	e2eCmdChange ( ev ) {
		let sW = 'AppContent e2eCmdChange()';
		let e = document.getElementById ( this.e2eCmdInputEleId );
		let s = e.value;
		console.log ( sW + ' s: ' + s );
		let len = s.length;
		if ( len < 4 ) {
			return; }
		if ( s.slice ( -4 ) !== '}eoc' ) {
			return; }
		
		this.e2eCmdCnt += 1;
	//	this.e2eSetOutput ( { result: {
	//						  text: 	'whoa',
	//						  cmdCnt:	this.e2eCmdCnt } } );
		console.log ( sW + ' s: ' + s + '  len: ' + len );
		let cmd = s.slice ( 0, len - 3 );
		console.log ( sW + ' cmd: ' + cmd )
		this.props.clientFnc ( { do: 	'e2e-test',
								 cmd:	cmd } );
	}	//	e2eCmdChange()

//	e2eCmdInput ( ev ) {
//		let sW = 'AppContent e2eCmdInput()';
//		console.log ( sW );
//	}	//	e2eCmdInput()

	e2eClearOutput ( o ) {
		let sW = 'AppContent e2eClearOutput()';
		let e = document.getElementById ( this.e2eCmdOutputEleId );
		e.value = '';
	}	//	e2eClearOutput()

	e2eSetOutput ( o ) {
		let sW = 'AppContent e2eSetOutput()';
		let e = document.getElementById ( this.e2eCmdOutputEleId );
		e.value = JSON.stringify ( o.result );
	}	//	e2eSetOutput()

	keyDown ( o ) {
		let sW = 'AppContent keyDown()';
	//	console.log ( sW + '  ' + o.ev.key );
		let frameId = this.focusedFrameId;
		if ( ! frameId ) {
			return; }
		let frame = this.frames[frameId];
		if ( ! frame ) {
			return; }
		frame.frameFnc ( o );
	}	//	keyDown()

	setFrameFocus2 ( frameId ) {
		let frame = this.frames[frameId];
		if ( ! frame ) {
			return null; }
		this.focusedFrameId = frameId;
		frame.frameFnc ( { do: 'z-top' } );
		let paneFnc = frame.frameFnc ( { do: 'focus' } );
		return { frameFnc: 	frame.frameFnc,
				 paneFnc:	paneFnc };
	}	//	setFrameFocus2()

	setFrameFocus ( frameId ) {
		let sW = 'AppContent setFrameFocus()';
		if ( this.focusedFrameId === frameId ) {
			return null; }
		if ( typeof this.focusedFrameId === 'number' ) {	
			if ( this.focusedFrameId === 0 ) {
				this.props.appFrameFnc ( { 
					do: 'not-focus-app-title' } ); }
			else {
				this.frames[this.focusedFrameId].frameFnc ( { 
					do: 'not-focus' } ); }
		}
		if ( frameId === null ) {
			this.focusedFrameId = null;
			return null; }
		return this.setFrameFocus2 ( frameId );
	}	//	setFrameFocus()

	cycleFrameFocus() {
		let sW = 'AppContent cycleFrameFocus()';
		let frame, frameId, frameIds = Object.keys ( this.frames );
		frameIds.forEach ( ( x, i ) => { 
			frameIds[i] = Number.parseInt ( x ) } );
		frameIds.sort();
		if ( typeof this.focusedFrameId === 'number' ) {
			if ( this.focusedFrameId === 0 ) {
				this.props.appFrameFnc ( { do: 'not-focus-app-title' } );
				if ( ! frameIds[0] ) {
					return null; }
				frameId = this.focusedFrameId = frameIds[0]
				frame = this.frames[frameId];
				let paneFnc = frame.frameFnc ( { do: 'focus' } );
				frame.frameFnc ( { do: 'z-top' } );
				return { frameFnc: 	frame.frameFnc,
						 paneFnc:	paneFnc };
			}
			frameId = this.focusedFrameId;
			let i = frameIds.indexOf ( frameId );
			if ( i >= 0 ) {
				this.frames[frameId].frameFnc ( { do: 'not-focus' } ); 
				i++; }
			else {
				i = 0; }
			if ( frameIds[i] ) {
				frameId = this.focusedFrameId = frameIds[i]
				frame = this.frames[frameId];
				let paneFnc = frame.frameFnc ( { do: 'focus' } );
				frame.frameFnc ( { do: 'z-top' } );
				return { frameFnc: 	frame.frameFnc,
						 paneFnc:	paneFnc };
			}
		}
		//	First focus on app title display its menu.
		this.props.appFrameFnc ( { do: 'focus-app-title' } );
		this.focusedFrameId = 0;	//	Indicates app title menu.
		return null;
	}	//	cycleFrameFocus()

	addFrame ( o ) {
		const sW = 'AppContent addFrame()';
		let frame = null, fa = [];

		this.frames[o.frameId] = { frame: 		frame,
								   type:		o.frameType,
							//	   ccEleId:		o.ccEleId,
								   frameFnc:	null,
								   iconSlot:	null };

		if ( o.frameType === 'dialog' ) {
			//	Frame is rendered by AppDialog.
			diag ( [1, 2], sW + ': dialog' );
			return; }

		frame = <Frame key 				= { o.frameId }
					   hdrVisible		= { o.hdrVisible }
					   ftrVisible		= { o.ftrVisible }
					   frameName		= { o.frameName }
					   frameType		= { o.frameType }
					   frameId 			= { o.frameId }
					   paneId			= { o.paneId }
					   appFrameFnc 		= { this.props.appFrameFnc } 
					   appContentFnc	= { this.doAll }
					   left 			= { o.style.left }
					   top				= { o.style.top }
					   width 			= { o.style.width }
					   height			= { o.style.height }
					   iconized			= { o.iconized }
					   clientFnc		= { this.props.clientFnc } />;

		this.frames[o.frameId].frame = frame;

		for ( var id in this.frames ) {
			fa.push ( this.frames[id].frame ); }

		this.setState ( { frames: fa }, () => {
			let focus = this.setFrameFocus ( o.frameId );
			this.props.appFrameFnc ( { do:		'set-focused-frame-fnc',
									   focus:	focus } ); } );

		return o.frameId;
	}	//	addFrame()

	addFrames ( a ) {
		let frame = null, fa = [];
		for ( let i = 0; i < a.length; i++ ) {
			let o = a[i];
			frame = <Frame key 				= { o.frameId }
						   hdrVisible		= { o.hdrVisible }
						   ftrVisible		= { o.ftrVisible }
						   frameName		= { o.frameName }
						   frameId 			= { o.frameId }
						   frameType		= { o.frameType }
						   paneId			= { o.paneId }
						   appFrameFnc 		= { this.props.appFrameFnc } 
						   appContentFnc	= { this.doAll }
						   left 			= { o.style.left }
						   top				= { o.style.top }
						   width 			= { o.style.width }
						   height			= { o.style.height }
						   iconized			= { o.iconized }
						   clientFnc		= { this.props.clientFnc } />;
			this.frames[o.frameId] = { frame: 		frame,
								//	   ccEleId:		o.ccEleId,
									   frameFnc:	null,
									   iconSlot:	null };
			fa.push ( frame );
		}	//	for ( ... )

		this.setState ( { frames: fa } );
	}	//	addFrames()

	destroyFrame ( o ) {
		const sW = 'AppContent destroyFrame()  frameId: ' + o.frameId;
		console.log ( sW );
		if ( o.frameId === this.focusedFrameId ) {
			this.focusedFrameId = null; }
		let frm  = this.frames[o.frameId];
		if ( frm.type === 'dialog' ) {
			delete this.frames[o.frameId];
			//	Frame is (was) rendered by AppDialog.
			this.props.appFrameFnc ( { do: 	'close-dlg' } );
			return; }
		let self = this;
		let keys = Object.keys ( this.frames );
		let fa = [];
		keys.forEach ( frameId => {
			if ( Number.parseInt ( frameId ) === o.frameId ) {
				return; }
			fa.push ( self.frames[frameId].frame ); } );

		console.log ( sW + ' fa[] length: ' + fa.length );

		this.setState ( { frames: fa }, () => {
			console.log ( sW + ' deleting self.frames[' + o.frameId + '] ...' );
			delete self.frames[o.frameId] } );
	}	//	destroyFrame()

	doAll ( o ) {
		let sW = 'AppContent doAll() ' + o.do;
		if ( o.to ) {
			sW += ' to ' + o.to; }
	//	diag ( [1, 2], sW  );
		console.log ( sW );
		if ( o.do === 'e2e-clear-output' ) {
			this.e2eClearOutput ( o );
			return;
		}
		if ( o.do === 'e2e-set-output' ) {
			this.e2eSetOutput ( o );
			return;
		}
		if ( o.do === 'set-call-down' ) {
			if ( o.to === 'frame' ) {
				let frame = this.frames[o.frameId];
				if ( ! frame ) {
					console.log ( sW + ' frame of frameId ' + o.frameId 
									 + ' not found' );
					return; }
				frame.frameFnc = o.frameFnc;
				return;
			}
			if ( o.to === 'client-content' ) {
				let frame = this.frames[o.frameId];
				frame.frameFnc ( o )
				return;
			}
			console.log ( sW + 'ERROR set-call-down: unrecognized frame' )
			return;
		}
		if ( o.do === 'keyboard-key-down' ) {
			this.keyDown ( o );
			return;
		}
		if ( o.do === 'cycle-frame-focus' ) {
			return this.cycleFrameFocus();
		}
		if ( o.do === 'set-frame-focus' ) {
			let focus = this.setFrameFocus ( o.frameId );
			this.props.appFrameFnc ( { do:		'set-focused-frame-fnc',
									   focus:	focus } );
			return;
		}
		if ( o.do === 'menu-dismiss' ) {
			if ( this.focusedFrameId === 0 ) {		// App title menu?
				this.focusedFrameId = null; }
			return;
		}
		if ( o.do === 'get-new-frame-id' ) {
			return { frameId:	getFrameId(),
					 paneId:	getPaneId() };
		}
		if ( o.do === 'add-frame' ) {
			return this.addFrame ( o );
		}
		if ( o.do === 'add-frames' ) {
			this.addFrames ( o.frames );
		}
		if ( o.do === 'destroy-frame' ) {
			this.destroyFrame ( o );
			return;
		}
		if ( o.do === 'get-state' ) {
			let state = { lastFrameId: 	getLastFrameId(),
						  lastPaneId:	getLastPaneId(),
						  frames:		{} };
			for ( let frameId in this.frames ) {
				let frm = this.frames[frameId];
				state.frames[frameId] = {
					frame:		frm.frameFnc ( o ),
					iconSlot:	clone ( frm.iconSlot ) } }
			return state;
		}
		if ( o.do === 'set-state' ) {
			setLastFrameId ( o.state.lastFrameId );
			setLastPaneId ( o.state.lastPaneId );
			//	The rest is done by the app.
			return;
		}
		if ( o.do === 'clear' ) {
			this.frames = {};
			this.focusedFrameId = null;
			this.setState ( { frames: [] } );
		}
		if ( o.do === 'ensure-frame-z-is-top' ) {
			//	Put frame o.frameId last to be rendered.
			let i, j, fa = this.state.frames;

			for ( i = 0; i < fa.length; i++ ) {
				if ( fa[i].props.frameId === o.frameId ) {
					break; } }
			if ( i >= fa.length ) {
				return; }
		//	console.log ( sW + ' ensure-frame-z-is-top i: ' + i );
			if ( i === fa.length - 1 ) {
				return;	}

			fa = [];

			for ( j = 0; j < this.state.frames.length; j++ ) {
				if ( j === i ) {
					continue; }
				fa.push ( this.state.frames[j] ); }
			fa.push ( this.state.frames[i] )

			this.setState ( { frames: fa } );
			return;
		}
		if ( o.do === 'get-icon-slot' ) {
			let x = 20;
			let y = 20;
			let lookAgain = true;
			while ( lookAgain ) {
				lookAgain = false;
				for ( var id in this.frames ) {
					let frm = this.frames[id];
					if ( Number.parseInt ( id ) === o.frameId ) {
						if ( frm.iconSlot ) {
							return frm.iconSlot; 
						} 
					}
					if ( frm.iconSlot && (frm.iconSlot.y === y) ) {
						y += 95;	lookAgain = true;
						break; 
					}
				}	//	for ( ...
			}	//	while ( ...
			let iconSlot = {
				x: 		x,
				y:		y 
			};
			this.frames[o.frameId].iconSlot = iconSlot;
			return iconSlot;
		}
		if ( o.do === 'append-menu-items' ) {
			this.props.clientFnc ( o );
			return;
		}
		if ( o.do === 'menu-item' ) {
			this.props.clientFnc ( o );
			return;
		}
	}   //  doAll()

	render() {
		const sW = 'AppContent render()';
		diag ( [1], sW );
		let profound1 = this.props.profound1 ? this.props.profound1 : '';
		let profound2 = this.props.profound2 ? this.props.profound2 : '';
		return (
			<div id 		= { this.eleId }
				 className 	= "rr-app-content">
		{ /*	<div className = "rr-e2e-test-cmd-container">
					<input id 			= { this.e2eCmdInputEleId }
						   type			= "text"
						   autoCorrect	= "off"
						   spellCheck	= "false"
						   className 	= "rr-input-test"
						   defaultValue	= "e2e test command" 
						   onChange 	= { this.e2eCmdChange } />
					<input id 			= { this.e2eCmdOutputEleId }
						   type			= "text"
						   autoCorrect	= "off"
						   spellCheck	= "false"
						   className 	= "rr-input-test"
						   style		= { { borderTop: 'none' } }
						   defaultValue	= "e2e test result" />
				</div>											*/ }
				<div className = "rr-mird-container">
					<span className = "rr-mird-span">
						<p> { profound1 } </p>
						<p> { profound2 } </p>
					</span>
				</div>
				{this.state.frames}
			</div>
		);
	}   //  render()

	componentDidMount() {
		const sW = 'AppContent componentDidMount()';
		diag ( [1], sW );

		this.props.appFrameFnc ( { do: 'set-call-down',
								   to:	'app-content',
								   fnc:	this.doAll } );
		this.props.clientFnc ( { do: 	'set-call-down',
								 to: 	'app-frame',
								 fnc:	this.props.appFrameFnc } );
		this.props.clientFnc ( { do: 	'set-call-down',
								 to: 	'app-content',
								 eleId:	this.eleId,
								 fnc:	this.doAll } );
	}	//	componentDidMount()

	componentDidUpdate() {
		const sW = 'AppContent componentDidUpdate()';
		diag ( [1], sW );

	}	//	componentDidUpdate()

}   //  AppContent()



export { AppContent as default, getFrameId };
