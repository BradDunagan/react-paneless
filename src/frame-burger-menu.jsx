/*
		 1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890

*/

import React, { Component } from 'react';

import {diag, diagsFlush, diagsPrint} 	from './diags';

class FrameBurgerMenu extends Component {
	constructor ( props ) {
		let sW = props.frameId + ' FrameBurgerMenu constructor()';
		diag ( [4], sW );
		super ( props );
		this.eleId 		= 'frame-burger-menu-' + props.frameId;
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
		this.frameFnc ( { do: 'frame-burger-click' } );
		ev.stopPropagation();
	}	//	click()

	render() {
		let sW = this.props.frameId + ' FrameBurgerMenu render()';
		diag ( [4], sW );
		let cn = this.props.class ? this.props.class : "frame-burger-menu";
		return (
			<img id			= { this.eleId }
				 className	= { cn }
				 src		= "/images/gimp_c.png"
				 onMouseDown 	= { this.mouseDown }
				 onMouseUp		= { this.mouseUp }
				 onMouseMove	= { this.mouseMove }
				 onClick		= { this.click } />
		);
	}   //  render()

	componentDidMount() {
		let sW = this.props.frameId + ' FrameBurgerMenu componentDidMount()';
		diag ( [4], sW );
	//	this.frameFnc ( { do: 		    		'frame-burger-menu-call-down',
	//					  frameBurgerMenuFnc:  	this.doAll } );
	}	//	componentDidMount()

	componentWillUnmount() {
		let sW = this.props.frameId + ' FrameBurgerMenu componentWillUnmount()';
		diag ( [4], sW );

	}	//	componentWillUnmount()

}   //  class FrameBurgerMenu

export default FrameBurgerMenu;
