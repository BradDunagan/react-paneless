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

		this.doAll		= this.doAll.bind ( this );
	}	//	constructor()

	doAll ( o ) {
		if ( o.do === 'is-visible' ) {
			if ( ! (this.state.style && this.state.style.display) ) {
				return true; }
			return this.state.style.display !== 'none'; }
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
	
}   //  class FrameFooter

export { FrameFooter as default };
