/*
		 1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890

*/

import React		from 'react';

import NoContent	from './no-content';
import Tabs			from './tabs';

import {diag, diagsFlush, diagsPrint} 	from './diags';

class PaneContent extends React.Component {
	constructor ( props ) {
		super ( props );
		const sW = 'PaneContent ' + this.props.paneId + ' constructor()';
		diag ( [1, 2], sW );

		this.state = {
			style:			null,
			typeName:		'NoContent',
			content:		( <NoContent /> ),
		};

		this.doAll			= this.doAll.bind ( this );

	//	this.props.paneFnc ( { do: 		'set-call-down',
	//						   to:		'pane-content',
	//						   fnc:		this.doAll } );
	}	//  constructor()

	doAll ( o ) {
		const sW = 'PaneContent ' + this.props.paneId + ' doAll()';
		if ( o.do === 'install-client-content' ) {
			diag ( [1, 2], sW + ' install-client-content' );
			this.setState ( {
				style:		o.parentStyle,
				typeName:	o.contentTypeName,
				content:	o.content		   } );
			if ( this.props.paneFnc && o.initialTabText ) {
				this.props.paneFnc ( { do: 				'set-initial-tab-text',
									   initialTabText: 	o.initialTabText } ); }
			return;
		}
	}	//	doAll()

	render() {
		const sW = 'PaneContent ' + this.props.paneId + ' render()';
		diag ( [1, 2], sW );
		if ( this.props.tabs ) {
			return (
				<div id 		= { this.props.eleId }
					 className 	= 'pane-content' >
					<Tabs eleId 		= { this.props.eleId + '-tabs' } 
						  atFrameTop	= { this.props.atFrameTop }
						  frameId 		= { this.props.frameId }
					   	  paneId		= { this.props.paneId }
						  paneFnc		= { this.props.paneFnc }
						  frameFnc		= { this.props.frameFnc }
						  clientFnc		= { this.props.clientFnc } />
				</div>
			);
		}
		return (
			<div id 		= { this.props.eleId }
				 className 	= 'pane-content'

			//	 style		= { this.props.style } >
			//	{ this.props.content }

				 style 		= { this.state.style } >
				{ this.state.content }
			</div>
		);
	}   //  render()

	componentDidMount() {
		const sW = 'PaneContent ' + this.props.paneId + ' componentDidMount()';
		diag ( [1, 2, 3], sW );

		//	Do this here (after mounting) because the client might command
		//	'install-client-content' which will setState().
		this.props.clientFnc ( { do: 			'set-call-down',
								 to:			'pane-content',
								 paneId:		this.props.paneId,
								 paneFnc:		this.props.paneFnc,
								 contentFnc:	this.doAll,
								 tabs:			this.props.tabs } );

		this.props.paneFnc ( { do: 		'set-call-down-correct',
							   to:		'pane-content',
							   fnc:		this.doAll } );
	}	//	componentDidMount()

	componentDidUpdate() {
		const sW = 'PaneContent ' + this.props.paneId + ' componentDidUpdate()';
		diag ( [1, 2], sW );
		this.props.clientFnc ( { do: 		'pane-content-update',
								 paneId:	this.props.paneId,
								 tabs:		this.props.tabs,
								 typeName:	this.state.typeName } );
	}	//	componentDidUpdate()

	componentWillUnmount() {
		const sW = 'PaneContent ' + this.props.paneId + ' componentWillUnmount()';
		diag ( [1, 2, 3], sW );
	}	//	componentWillUnmount()

}   //  class PaneContent

export { PaneContent as default };
