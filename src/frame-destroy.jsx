
import React, { Component } from 'react';

import {diag, diagsFlush, diagsPrint} 	from './diags';

class FrameDestroy extends Component {
	constructor ( props ) {
		let sW = props.frameId + ' FrameDestroy constructor()';
		diag ( [4], sW );
		super ( props );
		this.eleId 		= 'frame-destroy-' + props.frameId;
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
		console.log ( sW );
		ev.stopPropagation();
	}	//	mouseDown()

	mouseUp ( ev ) {
		let sW = 'mouseUp()';
		console.log ( sW );
		ev.stopPropagation();
	}	//	mouseUp()

	mouseMove ( ev ) {
		let sW = 'mouseMove()';
		console.log ( sW );
		ev.stopPropagation();
	}	//	mouseMove()

	click ( ev ) {
		let sW = 'click()';
		console.log ( sW );
		ev.stopPropagation();
	}	//	click()

	render() {
		let sW = this.props.frameId + ' FrameDestroy render()';
		diag ( [4], sW );
		let cn = this.props.class ? this.props.class : "frame-destroy";
		return (
			<img id			= { this.eleId }
				 className	= { cn }
				 src		= "/images/gimp_e.png" 
				 onMouseDown 	= { this.mouseDown }
				 onMouseUp		= { this.mouseUp }
				 onMouseMove	= { this.mouseMove }
				 onClick		= { this.click } />
		);
	}   //  render()

	componentDidMount() {
		let sW = this.props.frameId + ' FrameDestroy componentDidMount()';
		diag ( [4], sW );
	//	this.frameFnc ( { do: 		    	'frame-destroy-call-down',
	//					  frameDestroyFnc:	this.doAll } );
	}	//	componentDidMount()

	componentWillUnmount() {
		let sW = this.props.frameId + ' FrameDestroy componentWillUnmount()';
		diag ( [4], sW );

	}	//	componentWillUnmount()

}   //  class FrameDestroy

export default FrameDestroy;
