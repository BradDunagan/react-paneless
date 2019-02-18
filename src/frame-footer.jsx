/*
		 1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890

*/

import React        from 'react';


class FrameFooter extends React.Component {
	constructor ( props ) {
		super ( props );
		this.state = {
			style:	props.visible ? null : { display: 'none' }
		};

		this.isVisible	= this.isVisible.bind ( this );
		this.doAll		= this.doAll.bind ( this );
	}	//	constructor()

	isVisible() {
		if ( ! (this.state.style && this.state.style.display) ) {
			return true; }
		return this.state.style.display !== 'none'; 
	}	//	isVisible()

	doAll ( o ) {
		if ( o.do === 'is-visible' ) {
			return this.isVisible(); }
		if ( o.do === 'show' ) {
			this.setState ( { style: null } );
			return;	}
		if ( o.do === 'hide' ) {
			this.setState ( { style: { display: 'none' } } );
			return;	}
	}	//	doAll()

	render() {
		return (
			<div className	= "rr-pe-frame-status-bar"
				 style		= { this.state.style } >
			</div>
		)
	}	//	render()

	componentDidMount() {
		this.props.frameFnc ( { do: 	'set-call-down',
								to:		'frame-footer',
								fnc:	this.doAll } );
	}	//	componentDidMount()

	componentWillUnmount() {
		this.props.frameFnc ( { do: 	'set-call-down',
								to:		'frame-footer',
								fnc:	null } );
	}	//	componentWillUnmount()

	componentDidUpdate() {
		this.props.frameFnc ( { do: 		'footer-updated',
								isVisible:	this.isVisible() } )
	}
	
}   //  class FrameFooter

export { FrameFooter as default };
