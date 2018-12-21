
import React, { Component } from 'react';

class BtnBurger extends Component {
	constructor ( props ) {
		super ( props );
	//	this.appFnc 	= props.appFnc;
	//	this.frameFnc 	= props.frameFnc;
		this.doAll 		= this.doAll.bind ( this );
		this.mouseDown	= this.mouseDown.bind ( this );
		this.mouseUp	= this.mouseUp.bind ( this );
		this.mouseMove	= this.mouseMove.bind ( this );
		this.click		= this.click.bind ( this );

	//	if ( this.frameFnc ) {
    //      this.frameFnc ( { do: 		    	'frame-btn-split-horz-call-down',
	//                        BtnSplitHorzFnc:  this.doAll } ); }
	
	//	if ( this.props.paneFnc ) {
	//		this.paneFnc = this.props.paneFnc; }
	//	this.paneFnc = null;
	}	//	constructor
	
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
		this.props.paneFnc ( { do: 'pane-burger-click' } );
	}	//	click()

	doAll ( o ) {
	//	if ( o.do === 'set-pane-fnc' ) {
	//		this.paneFnc = o.paneFnc;
	//		return;
	//	}
	}	//	doAll()

	render() {
		return (
			<img id			= { this.props.eleId }
				 className	= "rr-btn-burger"
				 style		= { this.props.style }
				 src		= "/images/gimp_c.png"
				 onMouseDown 	= { this.mouseDown }
				 onMouseUp		= { this.mouseUp }
				 onMouseMove	= { this.mouseMove }
				 onClick		= { this.click } />
		);
	}   //  render()

	componentDidMount() {
	//	this.props.bbFnc ( { do: 		'set-call-down',
	//						 to:		'btn-burger',
	//						 bshFnc:	this.doAll } );
	}	//	componentDidMount()

}   //  class BtnBurger

export default BtnBurger;
