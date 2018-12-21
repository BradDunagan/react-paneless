/*
		 1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890

*/

import React        		from 'react';
import FrameBurgerMenu      from './frame-burger-menu';
import FrameTitle			from './frame-title';
import FrameIconize			from './frame-iconize';
import FrameDestroy			from './frame-destroy';


class FrameTransientHeader extends React.Component {
	
	constructor ( props ) {
		super ( props );
		this.state = {
			frameName:	props.frameName,
			class:	    "rr-frame-transient-title-bar",
			isVisible:  false,
			style:	    {
				backgroundColor:	'transparent',
				borderBottom:	    'solid 1px transparent',
				opacity:			'0.0',
			}
		};

		this.show           = this.show.bind ( this );
		this.hide           = this.hide.bind ( this );
		this.mouseEnter		= this.mouseEnter.bind ( this );
		this.mouseLeave		= this.mouseLeave.bind ( this );
		this.mouseDown		= this.mouseDown.bind ( this );
		this.doAll			= this.doAll.bind ( this );

		this.mouseIn = false;
	}	//	constructor()

	show() {
		this.setState ( { isVisible:    true,
						  style: {
			backgroundColor:	'white',
			borderBottom:	    'solid 1px gray',
			opacity:			'1.0',
		} } );
	}   //  show()

	hide() {
		if ( ! this.state.isVisible ) {
			return; }
		this.setState ( { isVisible:    false,
						  style: {
			backgroundColor:	'transparent',
			borderBottom:	    'solid 1px transparent',
			opacity:			'0.0',
		} } );
	}   //  hide()

	mouseEnter ( ev ) {
		let sW = 'FrameTransientHeader mouseEnter()';
	//	console.log ( sW );
		this.mouseIn = true;
		if ( this.state.isVisible ) {
			return; }
		this.show();
	}	//	mouseEnter()
	
	mouseLeave ( ev ) {
		let sW = 'FrameTransientHeader mouseLeave()';
	//	console.log ( sW );

		this.mouseIn = false;

		window.setTimeout ( () => {
			let msInAnyBB = this.props.frameFnc ( { 
				do: 'is-mouse-in-any-top-pane-button-bar' } );
			if ( msInAnyBB ) {
				return;	}
			this.hide();
		}, 100 );
	}	//	mouseLeave()
	
	mouseDown ( ev ) {
		let sW = 'mouseDown()';
	//	console.log ( sW );
		this.props.frameFnc ( { do: 	'move-start',
								ev: 	ev } );
	}	//	mouseDown()

	doAll ( o ) {
		let sW = 'FrameTransientHeader doAll()';
		if ( o.do === 'is-visible' ) {
		//	console.log ( sW + ' do is-visible: ' + this.state.isVisible );
			return this.state.isVisible; }
		if ( o.do === 'show' ) {
			if ( this.state.isVisible ) {
				return; }
			this.show();
			return;	}
		if ( o.do === 'hide' ) {
		//	console.log ( sW + ' do hide' );
			this.hide();
			return;	}
		if ( o.do === 'get-status' ) {
			return { visible: this.state.isVisible,
					 mouseIn: this.mouseIn };
		}
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

}   //  class FrameTransientHeader

export { FrameTransientHeader as default };
