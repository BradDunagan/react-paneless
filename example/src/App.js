/*
         1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/
import React, { Component } from 'react'

import ContentExample1		from './content-example-1';

import { AppFrame }		from 'paneless';
import { diag, 
		 diagsFlush, 
		 diagsPrint } 	from 'paneless';



let lastCCId = 0;		//	Client Content Id

class App extends Component {
	constructor ( props ) {
		super ( props );

		this.definePaneContent	= this.definePaneContent.bind ( this );
		this.defineInstall		= this.defineInstall.bind ( this );
		this.addFrame			= this.addFrame.bind ( this );
		this.restoreFrames		= this.restoreFrames.bind ( this );
		this.setCallDown		= this.setCallDown.bind ( this );
		this.fixPaneId			= this.fixPaneId.bind ( this );
		this.menuItem			= this.menuItem.bind ( this );
		this.storeState			= this.storeState.bind ( this );
		this.loadState			= this.loadState.bind ( this );
	//	this.saveApp			= this.saveApp.bind ( this );
	//	this.loadApp			= this.loadApp.bind ( this );
		this.newFrame			= this.newFrame.bind ( this );
		this.clearLayout		= this.clearLayout.bind ( this );
		this.showAppTitleMenu	= this.showAppTitleMenu.bind ( this );
		this.clickAppTitle		= this.clickAppTitle.bind ( this );
		this.doAll 				= this.doAll.bind ( this );

		this.appContentFnc   = null;
		this.appContentEleId = '';

	//	this.newEleIds = [];		//	For initializing new content.
		this.frames = {};		//	Frames' functions. Key is freameId.
		this.content = {};		//	Content in pane. Key is paneId. This
								//	key must be "fixed" when, for example,
								//	a pane is split because the content 
								//	will be moved to a new pane (with a
								//	different ID).

	}	//	constructor()

//	definePaneContent ( o, initialized ) {
//	definePaneContent ( o, paneId ) {
	definePaneContent ( o, paneId, initialized ) {
		if ( ! paneId ) {
			paneId = o.paneId; }
		const sW = 'App definePaneContent()  paneId ' + paneId;
		diag ( [1, 2, 3], sW );
		if ( this.content[paneId] ) {
			diag ( [], sW + ' ERROR: content is already defined' );
			return; }
		let ccEleId = 'rr-cc-' + ++lastCCId;
		this.content[paneId] = { 
			frameId:		o.frameId,
			ccEleId:		ccEleId,
			paneContentFnc:	o.paneContentFnc ? o.paneContentFnc : null,
		//	initialized:	false,
			initialized:	initialized ? initialized : false,
			install:		null,
			contentFnc:		null,
			state:			null };
		return this.content[paneId];
	}	//	definePaneContent()

	defineInstall ( typeName, frameId, paneId, ccEleId, initialTabText ) {
		const sW = 'App defineInstall()  frameId ' + frameId
									+ '  paneId ' + paneId;
		diag ( [1, 2, 3], sW );
	//	if ( ! typeName ) {
	//		typeName = 'ContentExample1'; }
	//	switch ( typeName ) {
	//		case 'ContentExample1':
	//		case 'Process':
	//		case 'Viewport':
	//		case 'BPW':
	//		default:
	//	}
		return {
			parentStyle:	{ 
				position:	'relative',
				overflowY:	'auto' },
			contentTypeName:	'ContentExample1',
			initialTabText:		initialTabText ? initialTabText : null,
			content: 		(
				<ContentExample1 
					frameId			= { frameId }
					paneId			= { paneId }
					eleId			= { ccEleId }
					clientAppFnc 	= { this.doAll }
					appFrameFnc 	= { this.appFrameFnc }
					appContentFnc	= { this.appContentFnc } /> ) };
	}	//	defineInstall()
	
	addFrame ( o ) {
		const sW = 'App addFrame()';
		diagsFlush();
		diagsPrint ( sW, 1, 2000 );
		diag ( [1], sW );
		//	New frame. The frame initially has one pane for its entire
		//	content.
		let ids = 	  (o && o.frameId && o.paneId) 
					? { frameId: 	o.frameId,
						paneId:		o.paneId }
					: this.appContentFnc ( { do: 'get-new-frame-id' } );

		this.frames[ids.frameId] = {};

		this.definePaneContent ( { frameId: ids.frameId,
								   paneId:	ids.paneId }, 0, false );

		//	We don't define the install of the pane's content here.

		this.appContentFnc ( {
			do:				'add-frame',
			hdrVisible:		(o && o.hdrVisible) ? o.hdrVisible : true,
			ftrVisible:		(o && o.ftrVisible) ? o.ftrVisible : true,
			frameName:		(o && o.frameName) ? o.frameName : null,
			frameId:		ids.frameId,
			paneId:			ids.paneId,
			left:			(o && o.left)   ? o.left   : '40px',
			top:			(o && o.top)    ? o.top    : '20px',
			width:			(o && o.width)  ? o.width  : '400px',
			height:			(o && o.height) ? o.height : '400px',
			iconized:		(o && o.iconized) ? o.iconized : null,
		} );

	}	//	addFrame()

	restoreFrames ( pf, pc ) { 	//	Persistent-Frames, Persistent-Content
		const sW = 'App restoreFrames()';
		diag ( [1], sW );
		this.frames = {};
		let frames = [];
		for ( let i = 0; i < pf.length; i++ ) {
			let o = pf[i];
			this.frames[o.frameId] = {};
			let pcPane = pc[o.paneId];
			let c  = this.definePaneContent ( o, 0, pcPane.initialized );
			let tn = pcPane.typeName;
			if ( tn ) {
				c.install = this.defineInstall ( tn, o.frameId, 
													 o.paneId, c.ccEleId ); }
			c.state = pcPane.state;
			frames.push ( o );

			//	Define the content of frame's main pane's subpanes (of splits).
			for ( let id in pc ) {
				let paneId = Number.parseInt ( id );
				if ( paneId === o.paneId ) {
					continue; }
				pcPane = pc[paneId];
				if ( pcPane.frameId !== o.frameId ) {
					continue; }
				c  = this.definePaneContent ( o, paneId, pcPane.initialized );
				tn = pcPane.typeName;
				if ( tn ) {
					c.install = this.defineInstall ( tn, 
													 o.frameId, 
													 paneId, c.ccEleId ); }
				c.state = pcPane.state;
			}	//	for ( paneId ... )
		}	//	for ( ... )

		this.appContentFnc ( { do:		'add-frames',
							   frames:	frames } );

	}	//	restoreFrames()

	setCallDown ( o ) {
		let sW = 'App setCallDown() ' + o.to;
		if ( o.to === 'app-frame' ) {
			this.appFrameFnc = o.fnc;
			return; }
		if ( o.to === 'app-content' ) {
			this.appContentFnc	 = o.fnc;
			this.appContentEleId = o.eleId;
			let self = this;
			//	Default, first frame.
			window.setTimeout ( () => {
				self.addFrame();
			}, 500 );
			return;
		}
		if ( o.to === 'pane-content' ) {
			//	A pane has just been mounted. 
			//	Getting the pane's content function and installing the client 
			//	specific content (if it has been defined).
			let content = this.content[o.paneId];
			if ( ! content ) {
				diag ( [], sW + ' set-call-down to pane-content'
							  + ' ERROR(?): unrecognized paneId'
							  + ' (' + o.paneId + ')' );
				return; }
			content.paneContentFnc = o.contentFnc;
			if ( content.install ) {			//	Client content defined?
				content.paneContentFnc ( Object.assign ( 
					{ do: 'install-client-content' }, content.install ) );
				return; }
			return;
		}
		if ( o.to === 'client-content' ) {
		//	let content = this.content[o.ccEleId];
			let content = this.content[o.paneId];
			if ( ! content ) {
				diag ( [], sW + ' set-call-down to client-content'
							  + ' ERROR: unrecognized paneId' 
							  + ' (' + o.paneId + ')' );
				return; }
			content.contentFnc = o.fnc;
			if ( content.state && content.state.ccState ) {
				content.contentFnc ( { do: 		'set-state',
									   state:	content.state.ccState } );
				return;	}
			if ( ! content.initialized ) {
				content.contentFnc ( { do: 'init-new' } );
				content.initialized = true;
			}
			return;
		}
		if ( o.to === 'frame' ) {
			let f = this.frames[o.frameId];
			if ( ! f ) {
				f = this.frames[o.frameId] = {}; }
			f.frameFnc = o.frameFnc;
			if ( o.iconized ) {
				return; }
			let c = this.content[o.paneId];
			if ( c.state && (c.state.splitHorz || c.state.splitVert) ) {
				f.frameFnc ( { do: 'set-state' } ); }
			return; }
	}	//	setCallDown()

	fixPaneId ( o ) {
		let sW = 'App fixPaneId()';
		diag ( [1, 2, 3], sW + ' ' + o.curPaneId + ' -> ' + o.newPaneId );
		let content = this.content[o.curPaneId];
		if ( ! content ) {
			diag ( [], sW + ' fix-pane-id ERROR: unrecognized paneId' );
			return; }
		delete this.content[o.curPaneId];
		this.content[o.newPaneId] = content;

		if ( content.install ) {
			let c = content.install.content;
			//	Note that the component name is in c.type.name which in this
			//	case is (for now) assumed to be ContentExample1.
			content.install.contentTypeName = 'ContentExample1';
			content.install.content = ( 
				<ContentExample1 
					frameId			= { c.props.frameId }
					paneId			= { o.newPaneId }
					eleId			= { content.ccEleId }
					clientAppFnc 	= { this.doAll }
					appFrameFnc 	= { this.appFrameFnc }
					appContentFnc	= { this.appContentFnc } /> ) }

		if ( o.reason === 'split' ) {
			//	The current pane is now split.  We need to maintain a content
			//	object for that pane - even though it no longer has "content"
			//	it will still have state. The state will be set later.
			this.content[o.curPaneId] = { frameId:	o.frameId,
										  state: 	null }; }
	}	//	fixPaneId()

	menuItem ( o ) {
		let sW = 'App menuItem() ' + o.menuItemText;
		diag ( [1, 2, 3], sW );

		//	Probably a menu item to set a Process or Viewport (something client
		//	specific) in a new pane.

		//	Install (uninitialized) client content in a vacant pane.
		//
		let content = this.content[o.paneId];
		if ( ! content ) {
			content = this.definePaneContent ( o, 0, false ); }
		content.install = this.defineInstall ( null, o.frameId, 
													 o.paneId, 
													 content.ccEleId,
													 'example' );

		content.paneContentFnc ( Object.assign ( 
			{ do: 'install-client-content' }, content.install ) );
	}	//	menuItem()

	storeState ( o ) {
		const sW = 'App storeState()  paneId ' + o.paneId;
		diag ( [1, 2, 3], sW );
		//	This "state" being stored is that of the pane and its content.
		//	If the pane is split then the state includes the split position
		//	and there is no content because the content of each of the child
		//	panes is stored for those panes separately.
		let content = this.content[o.paneId];
		if ( ! content ) {
			diag ( [], sW + ' ERROR: content not found'
						  + ' (paneId ' + o.paneId + ')' );
			return; }
		content.state = o.state;
	}	//	storeState();

	loadState ( o ) {
		const sW = 'App loadState()  paneId ' + o.paneId;
		diag ( [1, 2, 3], sW );
		let content = this.content[o.paneId];
		if ( ! content ) {
			diag ( [], sW + ' ERROR: content not found'
						  + ' (paneId ' + o.paneId + ')' );
			return; }
		return content.state;
	}	//	loadState():

/*
	saveApp ( o ) {
		const sW = 'App saveApp()';
		diagsFlush();
		diagsPrint ( sW, 1, 2000 );
		diag ( [1], sW );
		let state = this.appContentFnc ( { do: 'get-state' } );
		let c = state.content = clone ( this.content );
		for ( let paneId in c ) {
			let pc = c[paneId];
			if ( pc.install ) {
				pc.typeName = pc.install.content.type.name; }
			else {
				pc.typeName = null; }
			
			delete pc.install;
		}
		try {
			db.updateLayout ( { SystemID: 	0,
								UserID:		0,
								LayoutName:	'test',
								json:		JSON.stringify ( state ) } );
		}
		catch ( e ) {
			console.log ( sW + ' ERROR: ' + e );
		}
	}	//	saveApp():
*/
/*
	async loadApp ( o ) {
		const sW = 'App loadApp()';
		diagsFlush();
		diagsPrint ( sW, 1, 2000 );
		diag ( [1], sW );
		this.appContentFnc ( { do: 'clear' } );
		let record = await db.loadLayout ( [0, 0, 'test'] );
		let state = JSON.parse ( record.json );
		this.appContentFnc ( { 
			do: 	'set-state',	//	This 'set-state' command only restores 
			state:	state } );		//	frameId and paneId counters.
		//	Here we restore the frames and panes.
		this.content = {};
		let frames = [];
		for ( let frameId in state.frames ) {
			if ( frameId === 'content' ) {
				continue; }
			let frm = state.frames[frameId].frame;
			frames.push ( {
				hdrVisible:	frm.hdrVisible,
				ftrVisible:	frm.ftrVisible,
				frameName:	frm.frameName,
				frameId:	frm.frameId,
				paneId:		frm.paneId,
				left:		frm.style.left,
				top:		frm.style.top,
				width:		frm.style.width,
				height:		frm.style.height,
				iconized:	frm.iconized ? frm.iconized : null,
			} ); }
		this.restoreFrames ( frames, state.content );
	}	//	loadApp():
*/

	newFrame ( ev ) {
		const sW = 'App newFrame()';
		console.log ( sW );
		this.addFrame();
	}	//	newFrame()

	clearLayout ( ev ) {
		const sW = 'App clearLayout()';
		console.log ( sW );
		this.frames = {};
		this.content = {};
		this.appContentFnc ( { do: 'clear' } );
	}	//	clearLayout()

	showAppTitleMenu() {
		const sW = 'App showAppTitleMenu()';
		diag ( [1, 2, 3], sW );

		let ce = document.getElementById ( this.appContentEleId );
		let r  = ce.getBoundingClientRect();

		this.appFrameFnc ( { 
			do: 		'show-menu',
			menuEleId:	'app-title-menu',
			menuX:		r.x + 10,
			menuY:		r.y + 10,
			menuItems:	[ 
				{ type: 'item', 
				  text: 'New Frame',		fnc: this.newFrame },
				{ type: 'item',	
				  text: 'Clear Layout',		fnc: this.clearLayout },
				{ type: 'item',	
				  text: 'Save Layout ...',	fnc: this.saveLayout },
				{ type: 'item', 
				  text: 'Load Layout ...',	fnc: this.loadLayout } ],
			upFnc:		this.doAll,
			ctx:		{ what:		'app title',
						  after:	'menu-item' }
		} );
	}	//	showAppTitleMenu()

	clickAppTitle ( ev ) {
		const sW = 'App clickAppTitle()';
		diag ( [1, 2, 3], sW );
		this.showAppTitleMenu();
	}	//	clickAppTitle()


	doAll ( o ) {
		let sW = 'App doAll() ' + o.do;
		if ( o.to ) {
			sW += ' to ' + o.to; }
		diag ( [1, 2, 3], sW );
		switch ( o.do ) {
			case 'set-call-down':
				this.setCallDown ( o );
				break;
			case 'focus-app-title':
				this.showAppTitleMenu();
				break;
			case 'fix-pane-id':
				this.fixPaneId ( o );
				break;
			case 'app-frame-menu-bar-item-click':
				//	These are the menu items on the app header (to the right of
				//	Robot Records).
				if ( o.itemText === 'New Frame' ) {
					this.addFrame();
					return;	}
				if ( o.itemText === 'Save Layout' ) {
				//	this.saveApp ( o );
					return;	}
				if ( o.itemText === 'Load Layout' ) {
				//	this.loadApp ( o );
					return;	}
				break;
			case 'append-menu-items':
				if ( o.to === 'pane-burger' ) {
					o.menuItems.push ( { type: 'item', text: 'Process' } );
					o.menuItems.push ( { type: 'item', text: 'Viewport' } ); }
				break;
			case 'menu-item':
				this.menuItem ( o );
				break;
			case 'store-state':
				this.storeState ( o );
				break;
			case 'load-state':
				return this.loadState ( o );
			case 'define-pane-content':
				this.definePaneContent ( o, 0, false );
				break;
			default:
				diag ( [], sW + ' ERROR: unrecognized command ' + o.do );
		}
	}	//	doAll()

	render() {
		return (
			<AppFrame appTitle		= 'Robot Records'
					  appTitleClick	= { this.clickAppTitle }
					  clientFnc		= { this.doAll } />
		);
	}	//	render()
} //  class App

export default App;
