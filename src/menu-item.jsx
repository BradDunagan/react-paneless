/*
		 1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890

*/

import React, { Component } from 'react';

import {diag, diagsFlush, diagsPrint} 	from './diags';


class BurgerMenu extends Component {
	constructor ( props ) {
		super ( props );

		this.doAll 		= this.doAll.bind ( this );

		this.state = {
		};

	}	//	constructor


	doAll ( o ) {
	}	//	doAll()

	render() {
		return (
			<div className	= 'rr-menu-item' >
                 <div className = 'rr-menu-item-text'>
                     { this.props.text }
                 </div>
                 <div className = 'rr-menu-item-hotkey'>
                     { this.props.hotkey }
                 </div>
			</div>
		);
	}   //  render()

	componentDidMount() {
	}	//	componentDidMount()


}   //  class BurgerMenu

export default BurgerMenu;
