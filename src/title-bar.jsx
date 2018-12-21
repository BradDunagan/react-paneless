/*
		 1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890

*/

import React, { Component } from 'react';

import FrameBurgerMenu      from './frame-burger-menu';
import FrameIconize			from './frame-iconize';
import FrameDestroy			from './frame-destroy';
import BtnSplitHorz 		from './btn-split-horz';
import BtnSplitVert 		from './btn-split-vert';

class TitleBar extends Component {
	constructor ( props ) {
		super ( props );
		this.eleId 		= 'title-bar-' + props.frameId;
		this.appFnc 	= props.appFnc;
		this.frameFnc 	= props.frameFnc;
		this.state = {
			style: {
				left:	'0px',
				top:	'0px',
				width:	'0px',
				height:	'18px'
			},
	//		splitHorz:	false,
	//		styleSplitHorz: {
	//			left: 	'200px'
	//		},
	//		styleSplitVert: {
	//			left: 	'218px'
	//		},
	//		styleSplitHorz2: {
	//			left: 	'0px'
	//		},
	//		styleSplitVert2: {
	//			left: 	'0px'
	//		},
		};
	//	this.contentSplit 	= this.contentSplit.bind ( this );
		this.doAll 			= this.doAll.bind ( this );
		this.mouseDown		= this.mouseDown.bind ( this );
		this.mouseUp		= this.mouseUp.bind ( this );

		this.sizeW0 = 0;

		this.frameFnc ( { do: 		    'title-bar-call-down',
						  titleBarFnc:  this.doAll } );
	}	//	constructor
	
	/*
	contentSplit ( o ) {
		//	The frame's top content pane has been split and the two
		//	sides' width/height has changed. The size of each is
		//	specified as a percentage of the total width of the parent
		//	content (or the width of this title bar (in the case of 
		//	a horz split)).
		let wt 	 = Number.parseInt ( this.state.style.width );
		let wlft = (wt * o.sizes[0]) / 100;
		let clft = wlft / 2;
		let wrgt = (wt * o.sizes[1]) / 100;
		let crgt = wlft + (wrgt / 2);
		this.setState ( {
			splitHorz: 		true,
			contentIds:		o.sides ? o.sides : null,
			styleSplitHorz: {
				left: 		(clft - 20) + 'px'
			},
			styleSplitVert: {
				left: 		(clft + 2) + 'px'
			},
			styleSplitHorz2: {
				left: 		(crgt - 20) + 'px'
			},
			styleSplitVert2: {
				left: 		(crgt + 2) + 'px'
			}
		} );
	}	//	contentSplit()
	*/

	doAll ( o ) {
		if ( o.do === 'size-start' ) {
			this.sizeW0 = Number.parseInt ( this.state.style.width );
			return;
		}
		if ( o.do === 'size' ) {
			this.setState ( {
				style: {
					left:	this.state.style.left,
					top:	this.state.style.top,
					width:	(this.sizeW0 + o.dX) + 'px',
					height:	this.state.style.height
				},
				styleSplitHorz: {
					left: 	(((this.sizeW0 + o.dX) / 2) - 20) + 'px'
				},
				styleSplitVert: {
					left: 	(((this.sizeW0 + o.dX) / 2) + 2) + 'px'
				}
			} );
			return;
		}
	}

	mouseDown ( ev ) {
		let sW = 'mouseDown()';
		console.log ( sW );
		this.sizeX0 = Number.parseInt ( this.state.style.left );
		this.sizeY0 = Number.parseInt ( this.state.style.top );
		this.frameFnc ( { do: 	'move-start',
						  ev: 	ev } );
	}	//	mouseDown()

	mouseUp ( ev ) {
		let sW = 'mouseUp()';
		console.log ( sW );
	}	//	mouseUp()
	
	render() {
		/*
		if ( this.state.splitHorz ) {
			let contentIds = this.state.contentIds;
			return (
				<div id			= { this.eleId }
					className	= 'rr-title-bar'
					style		= { this.state.style }
					onMouseDown	= { this.mouseDown }
					onMouseUp	= { this.mouseUp } >
					<FrameBurgerMenu frameFnc 	= { this.frameFnc } />
					<FrameDestroy frameFnc 		= { this.frameFnc } />
					<FrameIconize frameFnc 		= { this.frameFnc } />
					<BtnSplitHorz frameFnc 		= { this.frameFnc } 
								  style 		= { this.state.styleSplitHorz } 
								  contentId		= { contentIds ? contentIds[0] : 0 } />
					<BtnSplitVert frameFnc 		= { this.frameFnc } 
								  style 		= { this.state.styleSplitVert }
								  contentId		= { contentIds ? contentIds[0] : 0 } />
					<BtnSplitHorz frameFnc		= { this.frameFnc } 
								  style 		= { this.state.styleSplitHorz2 }
								  contentId		= { contentIds ? contentIds[1] : 0 } />
					<BtnSplitVert frameFnc		= { this.frameFnc } 
								  style 		= { this.state.styleSplitVert2 }
								  contentId		= { contentIds ? contentIds[1] : 0 } />
				</div>
			);
		}
		return (
			<div id				= { this.eleId }
				 className		= 'rr-title-bar'
				 style			= { this.state.style }
				 onMouseDown	= { this.mouseDown }
				 onMouseUp		= { this.mouseUp } >
				<FrameBurgerMenu frameFnc 	= { this.frameFnc } />
				<FrameDestroy frameFnc 		= { this.frameFnc } />
				<FrameIconize frameFnc 		= { this.frameFnc } />
				<BtnSplitHorz frameFnc 		= { this.frameFnc } 
							  style 		= { this.state.styleSplitHorz } 
							  contentId		= { 0 } />
				<BtnSplitVert frameFnc 		= { this.frameFnc } 
							  style 		= { this.state.styleSplitVert } 
							  contentId		= { 0 } />
			</div>
		);
		*/
		return (
			<div id				= { this.eleId }
				 className		= 'rr-title-bar'
				 style			= { this.state.style }
				 onMouseDown	= { this.mouseDown }
				 onMouseUp		= { this.mouseUp } >
				<FrameBurgerMenu frameFnc 	= { this.frameFnc } />
				<FrameDestroy frameFnc 		= { this.frameFnc } />
				<FrameIconize frameFnc 		= { this.frameFnc } />
			</div>
		);
	}   //  render()

	componentDidMount() {
		let e = document.getElementById ( this.eleId );
		let p = e.parentElement;
		this.setState ( { 
			style: {
				left:	this.state.style.left,
				top:	this.state.style.top,
				width: 	(p.clientWidth - 0) + 'px',
				height:	this.state.style.height
			}
		} );
	}	//	componentDidMount()

}   //  class TitleBar

export default TitleBar;
