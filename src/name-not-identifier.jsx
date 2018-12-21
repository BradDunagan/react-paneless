/*
		 1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/
import React        from 'react';

import {diag, diagsFlush, diagsPrint} 	from './diags';


class NameNotIdentifier extends React.Component {
	constructor ( props ) {
		const sW = 'NameNotIdentifier constructor()';
		diag ( [1,2,3], sW );
		super ( props );
		this.state = {
			errorText:        '',
		};
		this.error = this.error.bind ( this );
		this.valid = this.valid.bind ( this );
		this.keypress = this.keypress.bind ( this );
		this.change = this.change.bind ( this );
		this.input = this.input.bind ( this );

		this.nameText = this.props.curText;
	}

	error ( msg ) {
		this.setState ( { errorText: msg } );
		this.props.dlg ( { do: 'invalid' } );
	}

	valid ( name ) {
		this.setState ( { errorText: '' } );
		this.props.dlg ( { do: 'valid', name: name } );
	}

	keypress ( e ) {
		console.log ( 'keypress() ' + e.key );
	}

	change ( e ) {
	//  console.log ( 'change() ' + e.target.value );
		let name 	  = e.target.value;
		this.nameText = name;
		if ( name.length === 0 ) {
			this.error ( '' );
			return;
		}

		//	This name, not being an identifier, almost anything goes.

		this.valid ( name );
	}

	input ( e ) {
	//  console.log ( 'input() ' + e.target.value );
	}

	render() {
		return (
			<div className = "rr-pe-dlg-name-container">
				<div className = "rr-app-label-input">
					<div className = "rr-pe-dlg-name-label">
						Name:
					</div>
					<input className 	= "rr-pe-dlg-name-input"
						   spellCheck	= { false }
						   value		= { this.nameText }
						   onKeyPress 	= { this.keypress }
						   onChange 	= { this.change }
						   onInput 		= { this.input } >
					</input>
				</div>
				<div className = "rr-app-input-error">
					{this.state.errorText}
				</div>
			</div>
		);
	}	//	render()

}   //  NameNotIdentifier

export { NameNotIdentifier as default };
