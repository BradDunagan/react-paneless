import React, { Component } from 'react';

import {diag, diagsFlush, diagsPrint} 	from './diags';

class Sizer extends Component {
	constructor ( props ) {
		let sW = props.frameId + ' Sizer constructor()';
		diag ( [4], sW );
		super ( props );
		this.id 		= 'sizer-' + props.frameEleId;
		this.appFnc 	= props.appFnc;
		this.frameFnc 	= props.frameFnc;
		this.state = {
			style: {
				left:	'0px',
				top:	'0px',
				width:	'0px',
				height:	'0px'
			}
		};
		this.doAll 		= this.doAll.bind ( this );
		this.mouseDown	= this.mouseDown.bind ( this );
		this.mouseUp	= this.mouseUp.bind ( this );

		this.sizeX0 = 0;
		this.sizeY0 = 0;
	}	//	constructor
	
	doAll ( o ) {
		let sW = this.props.frameId + ' Sizer doAll() ' + o.do;
		diag ( [4], sW );
		if ( o.do === 'size' ) {
			this.setState ( {
				style: {
					left:	(this.sizeX0 + o.dX) + 'px',
					top:	(this.sizeY0 + o.dY) + 'px',
					width:	this.state.style.width,
					height:	this.state.style.height
				}
			} );
			return;
		}
	}

	mouseDown ( ev ) {
		let sW = 'mouseDown()';
	//	console.log ( sW );
		this.sizeX0 = Number.parseInt ( this.state.style.left );
		this.sizeY0 = Number.parseInt ( this.state.style.top );
		this.frameFnc ( { do: 	'size-start',
						  ev: 	ev } );
	}	//	mouseDown()

	mouseUp ( ev ) {
		let sW = 'mouseUp()';
	//	console.log ( sW );
	}	//	mouseUp()
	
	render() {
		let sW = this.props.frameId + ' Sizer render()';
		diag ( [4], sW );
		return (
			<div id				= { this.id }
				 className		= 'rr-sizer'
				 style			= { this.state.style }
				 onMouseDown	= { this.mouseDown }
				 onMouseUp		= { this.mouseUp } >
			</div>
		);
	}   //  render()

	componentDidMount() {
		let sW = this.props.frameId + ' Sizer componentDidMount()';
		diag ( [4], sW );

		this.frameFnc ( { do: 		'set-call-down',
						  to:		'sizer',
						  sizerFnc: this.doAll } );

		let e = document.getElementById ( this.id );
		let p = e.parentElement;
		this.setState ( { 
			style: {
				left:	(p.clientWidth  - 19) + 'px',
				top:	(p.clientHeight - 19) + 'px',
				width: 	'18px',
				height:	'18px'
			}
		} );
	}	//	componentDidMount()

	componentWillUnmount() {
		let sW = this.props.frameId + ' Sizer componentWillUnmount()';
		diag ( [4], sW );
	}	//	componentWillUnmount()

}   //  class Sizer

export default Sizer;
