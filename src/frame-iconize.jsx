
import React, { Component } from 'react';

import {diag, diagsFlush, diagsPrint} 	from './diags';

class FrameIconize extends Component {
	constructor ( props ) {
		let sW = props.frameId + ' FrameIconize constructor()';
		diag ( [4], sW );
		super ( props );
		this.eleId 		= 'frame-iconize-' + props.frameId;
		this.appFnc 	= props.appFnc;
		this.frameFnc 	= props.frameFnc;
		this.doAll 		= this.doAll.bind ( this );
		this.mouseDown	= this.mouseDown.bind ( this );
		this.mouseUp	= this.mouseUp.bind ( this );
		this.mouseMove	= this.mouseMove.bind ( this );
		this.click		= this.click.bind ( this );
	}	//	constructor
	
	doAll ( o ) {
	}

	mouseDown ( ev ) {
		let sW = 'mouseDown()';
	//	console.log ( sW );
		ev.stopPropagation();
	}	//	mouseDown()

	mouseUp ( ev ) {
		let sW = 'mouseUp()';
	//	console.log ( sW );
		ev.stopPropagation();
	}	//	mouseUp()

	mouseMove ( ev ) {
		let sW = 'mouseMove()';
	//	console.log ( sW );
		ev.stopPropagation();
	}	//	mouseMove()

	click ( ev ) {
		let sW = 'click()';
	//	console.log ( sW );
		ev.stopPropagation();
		this.frameFnc ( { do: 'iconize' } );
	}	//	click()

	render() {
		let sW = this.props.frameId + ' FrameIconize render()';
		diag ( [4], sW );
		let cn = this.props.class ? this.props.class : "frame-iconize";
		return (
			<img id			= { this.eleId }
				 className	= { cn }
				 src		= "/images/gimp_d.png" 
				 onMouseDown 	= { this.mouseDown }
				 onMouseUp		= { this.mouseUp }
				 onMouseMove	= { this.mouseMove }
				 onClick		= { this.click } />
		);
	}   //  render()

	componentDidMount() {
		let sW = this.props.frameId + ' FrameIconize componentDidMount()';
		diag ( [4], sW );
	//	this.frameFnc ( { do: 		    	'frame-iconize-call-down',
	//					  frameIconizeFnc:	this.doAll } );
	}	//	componentDidMount()

	componentWillUnmount() {
		let sW = this.props.frameId + ' FrameIconize componentWillUnmount()';
		diag ( [4], sW );

	}	//	componentWillUnmount()

}   //  class FrameIconize

export default FrameIconize;
