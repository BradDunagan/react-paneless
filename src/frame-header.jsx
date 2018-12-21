/*
		 1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890

*/

import React        		from 'react';
import FrameBurgerMenu      from './frame-burger-menu';
import FrameTitle			from './frame-title';
import FrameIconize			from './frame-iconize';
import FrameDestroy			from './frame-destroy';


class FrameHeader extends React.Component {
	
	constructor ( props ) {
		super ( props );
		this.state = {
			frameName:	props.frameName,
			class:		"rr-frame-title-bar",
			style:		null
		};

		this.mouseEnter		= this.mouseEnter.bind ( this );
		this.mouseLeave		= this.mouseLeave.bind ( this );
		this.mouseDown		= this.mouseDown.bind ( this );
		this.doAll			= this.doAll.bind ( this );
	}	//	constructor()

	mouseEnter ( ev ) {
		let sW = 'FrameHeader mouseEnter()';
	//	console.log ( sW );
	}	//	mouseEnter()
	
	mouseLeave ( ev ) {
		let sW = 'FrameHeader mouseLeave()';
	//	console.log ( sW );
	}	//	mouseLeave()
	
	mouseDown ( ev ) {
		let sW = 'mouseDown()';
	//	console.log ( sW );
		this.props.frameFnc ( { do: 	'move-start',
								ev: 	ev } );
	}	//	mouseDown()

	doAll ( o ) {
		if ( o.do === 'is-visible' ) {
			if ( (! this.state.style) || (! this.state.style.display) ) {
				return true; }
			return this.state.style.display !== 'none'; }
		if ( o.do === 'show' ) {
		//	this.setState ( { style: null } );
			this.setState ( { class:	'rr-frame-title-bar' } );
			return;	}
		if ( o.do === 'hide' ) {
		//	this.setState ( { style:	{ display: 'none' } } );
			this.setState ( { class:	'rr-frame-transient-title-bar' } );
			return;	}
		if ( o.do === 'set-frame-name' ) {
			this.setState ( { frameName: o.name } );
			return; }
	}	//	doAll()

	render() {
		return (
			<div className		= { this.state.class }
				 style			= { this.state.style } 
				 onMouseEnter	= { this.mouseEnter }
				 onMouseLeave	= { this.mouseLeave }
				 onMouseDown	= { this.mouseDown } >
				<FrameBurgerMenu class		= "frame-title-bar-burger-menu"
								 frameId	= { this.props.frameId }
								 frameFnc 	= { this.props.frameFnc } />
				<FrameTitle frameId		= { this.props.frameId }
							titleText	= { this.state.frameName }
							frameFnc	= { this.props.frameFnc } />
				<FrameIconize class 	= "frame-title-bar-iconize"
							  frameId	= { this.props.frameId }
							  frameFnc 	= { this.props.frameFnc } />
				<FrameDestroy class 	= "frame-title-bar-destroy"
							  frameId	= { this.props.frameId }
							  frameFnc 	= { this.props.frameFnc } />
			</div>
		);
	}	//  render()

	componentDidMount() {
		this.props.frameFnc ( { do: 	'set-call-down',
								to:		'frame-header',
								fnc:	this.doAll } );
	}	//	componentDidMount()

	componentWillUnmount() {
		this.props.frameFnc ( { do: 	'set-call-down',
								to:		'frame-header',
								fnc:	null } );
	}	//	componentWillUnmount()

}   //  class FrameHeader

export { FrameHeader as default };
