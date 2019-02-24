import React, { Component } from 'react';

import BtnBurger 			from './btn-burger';
import BtnSplitHorz 		from './btn-split-horz';
import BtnSplitVert 		from './btn-split-vert';

import {diag, diagsFlush, diagsPrint} 	from './diags';

//	Each pane has a button bar.
//
//	Button bar is normally hidden but should appear when the mouse is over 
//	its area.
//
//	If the pane borders the top of the frame and the frame's title bar is
//	hidden then the frame's title bar should also appear and the button bar
//	should be below the title bar.


class PaneButtonBar extends Component {
	constructor ( props ) {
		const sW = 'PaneButtonBar constructor()';
		diag ( [4], sW );
		super ( props );
		this.eleId = 'rr-pane-button-bar-' + this.props.bbId;
	//	let isHdrVisible = props.frameFnc ( { do: 'is-header-visible' } );
		//	The frame may not be able to answer this question yet.
		//	Assume, for now, true.
		let isHdrVisible = true;
		this.state = {
			style: {
			//	top:				'18px',
				height:				'20px',
				backgroundColor:	'transparent',
				borderBottomColor:	'transparent',
				opacity:			'0.0',
			},
		};

		let isFrameHeaderTransient =
			props.frameFnc ( { do: 'is-header-transient' } );

		if ( props.atFrameTop && isFrameHeaderTransient ) {
			this.state.style.top = '18px'; }

		this.show			= this.show.bind ( this );
		this.mouseEnter		= this.mouseEnter.bind ( this );
		this.mouseLeave		= this.mouseLeave.bind ( this );
		this.doAll 			= this.doAll.bind ( this );

		this.bshFnc 	= null;
		this.bsvFnc		= null;

		this.frameHdrWasHidden = true;
	}	//	constructor
	
	show() {
		let style = {
			height:					'20px',
			backgroundColor:        'white',
			borderBottomColor:	    'gainsboro',
			opacity:                '0.9' };
		this.props.frameFnc ( { do: 'mouse-entered-top-pane-button-bar' } );
		let isFrameHeaderTransient =
			this.props.frameFnc ( { do: 'is-header-transient' } );
		if ( this.props.atFrameTop && isFrameHeaderTransient ) {
			style.top = '18px'; }
		if ( this.props.atFrameTop ) {
			this.props.frameFnc ( { do: 'show-header' } ); } 
		this.setState ( { style: style } );
	}	//	show()

	mouseEnter ( ev ) {
		let sW = 'PaneButtonBar mouseEnter()';
	//	console.log ( sW );
		this.show();
	}	//	mouseEnter()
	
	mouseLeave ( ev ) {
		let sW = 'PaneButtonBar mouseLeave()';
	//	console.log ( sW );
		
		this.props.frameFnc ( { do: 'mouse-exited-top-pane-button-bar' } );

		let self = this;

		function hide() {
			let style = {
				height:				'20px',
				backgroundColor:	'transparent',
				borderBottomColor:	'transparent',
				opacity:			'0.0',
			};
			let isFrameHeaderTransient =
				self.props.frameFnc ( { do: 'is-header-transient' } );
			if ( isFrameHeaderTransient ) {
				style.top = '18px'; }
			self.setState ( { style: style } );
		}	//	hide()

	//	if ( ! this.props.atFrameTop ) {
	//		hide();
	//		return; }
	//	Regardless, see below.

		window.setTimeout ( () => {
			//	If the mouse didn't move into the header ...
			let s = this.props.frameFnc ( { 
				do: 'get-transient-header-status' } );
			if ( ! s ) {
				return; }
			if ( (! s.visible) || (! s.mouseIn ) ) {
			//	hide();
			//	Regardless, see below.
				let msInAnyBB = this.props.frameFnc ( { 
					do: 'is-mouse-in-any-top-pane-button-bar' } );
				if ( s.visible && ! msInAnyBB ) {
					this.props.frameFnc ( { do: 'hide-transient-header' } ); }
			}
		}, 100 );
		
		//	Regardless, when the mouse leaves the button bar, hide the
		//	button bar.
		hide();

	}	//	mouseLeave()
	
	doAll ( o ) {
		let sW = 'PaneButtonBar doAll() ' + o.do;
		if ( o.to ) {
			sW += ' to ' + o.to; }
		diag ( [4], sW );
		if ( o.do === 'set-call-down' ) {
			if ( o.to === 'btn-split-horz' ) {
				this.bshFnc = o.bshFnc; 
			}
			if ( o.to === 'btn-split-vert' ) {
				this.bsvFnc = o.bsvFnc;
			}
			return;
		}
		if ( (o.do === 'split-horz') || (o.do === 'split-vert') ) {
			if ( this.props.containerFnc ) {
				o.bbEleId = this.eleId;
				o.paneFnc = this.props.paneFnc;
				this.props.containerFnc ( o );
			} else {
			//	paneFnc ( o );	}
				this.props.paneFnc ( o );	}
			return;
		}
		if ( o.do === 'set-left-and-width' ) {
			//	This command implies this button bar is part of the
			//	transient title bar at the top of the frame.  I.e., the top 
			//	of the pane borders the top of the frame.
			this.setState ( { style: {
				left:				o.left  + 'px',
				width:				o.width + 'px',
				opacity:			'1.0',
				transitionProperty:	'none'
			} } );
			return;
		}
		if ( o.do === 'get-left-and-width' ) {
			let style = this.state.style;
			if ( style && style.left && style.width ) {
				return { left: 	Number.parseInt ( style.left ),
						 width:	Number.parseInt ( style.width ) }; }
			return null;
		}
		if ( o.do === 'key-show' ) {
			this.show();
			return;
		}
	}	//	doAll()

	render() {
		const sW = 'PaneButtonBar render()';
		diag ( [4], sW );
		let ctnrFnc = this.props.containerFnc ? this.props.containerFnc : null;
		return (
			<div id				= { this.eleId }
				 className		= 'rr-pane-button-bar' 
				 style 			= { this.state.style } 
				 onMouseEnter	= { this.mouseEnter }
				 onMouseLeave	= { this.mouseLeave }>
				<BtnBurger eleId		= { 'rr-bgr-' + this.props.bbId }
						   style		= { { position: 'absolute',
						   					  left:		'0px' } }
						   containerFnc	= { ctnrFnc }
						   bbFnc		= { this.doAll }
						   paneFnc		= { this.props.paneFnc } />
				<BtnSplitHorz eleId			= { 'rr-sh-' + this.props.bbId }
							  containerFnc	= { ctnrFnc }
							  bbFnc			= { this.doAll }
							  paneFnc		= { this.props.paneFnc } 
							  style 		= { null } 
							  contentId		= { 0 } />
				<BtnSplitVert eleId			= { 'rr-sv-' + this.props.bbId }
							  containerFnc	= { ctnrFnc }
							  bbFnc			= { this.doAll }
							  paneFnc		= { this.props.paneFnc } 
							  style 		= { null } 
							  contentId		= { 0 } />
			</div>
		);
		
	}   //  render()
	
	componentDidMount() {
		const sW = 'PaneButtonBar componentDidMount()';
		diag ( [4], sW );
		let e  = document.getElementById ( this.eleId );
		if ( this.props.containerFnc ) {
			this.props.containerFnc ( { do: 			'set-call-down',
										to:				'button-bar',
										bbEleId:		this.eleId,
										bbFnc:			this.doAll  } ); }

		this.props.paneFnc ( { do: 		'set-call-down',
							   to:		'button-bar',
							   bbEleId:	this.eleId,
							   bbFnc:	this.doAll } );	
	}	//	componentDidMount()
	
	componentWillUnmount() {
		const sW = 'PaneButtonBar componentWillUnmount()';
		diag ( [4], sW );
		let e  = document.getElementById ( this.eleId );
	}

	componentDidUpdate() {
		const sW = 'PaneButtonBar componentDidUpdate()';
		diag ( [4], sW );
	}	//	componentDidMount()

}   //  class PaneButtonBar

export default PaneButtonBar;
