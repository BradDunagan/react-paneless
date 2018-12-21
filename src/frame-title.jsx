
import React, { Component } from 'react';

import {diag, diagsFlush, diagsPrint} 	from './diags';

class FrameTitle extends Component {
	constructor ( props ) {
		let sW = props.frameId + ' FrameTitle constructor()';
		diag ( [4], sW );
		super ( props );
		this.eleId 		= 'rr-frame-title-' + props.frameId;
		this.frameFnc 	= props.frameFnc;

		this.state = {
		};

		this.doAll 		= this.doAll.bind ( this );
	}	//	constructor
	
	doAll ( o ) {
	}


	render() {
		let sW = this.props.frameId + ' FrameTitle render()';
		diag ( [4], sW );
		return (
			<div id			= { this.eleId }
				 className	= "rr-frame-title" >
				{ this.props.titleText }
			</div>
		);
	}   //  render()

	componentDidMount() {
		let sW = this.props.frameId + ' FrameTitle componentDidMount()';
		diag ( [4], sW );
	}	//	componentDidMount()

	componentWillUnmount() {
		let sW = this.props.frameId + ' FrameTitle componentWillUnmount()';
		diag ( [4], sW );

	}	//	componentWillUnmount()

}   //  class FrameTitle

export default FrameTitle;
