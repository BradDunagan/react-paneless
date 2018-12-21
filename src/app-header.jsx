import React, { Component } from 'react';

/*
class AppHeader extends React.Component {
	constructor ( props ) {
		super ( props );
	}

	render() {
		return ( 
			<div className = "rr-app-header">
                header
			</div>
		);
	}
}   //  AppHeader()
*/
class AppHeaderTitle extends React.Component {
	constructor ( props ) {
		super ( props );

		this.doAll			= this.doAll.bind ( this );
	}

	doAll ( o ) {
	//	if ( o.do === 'menu-item' ) {
	//		if ( o.menuItemText === 'New Frame' ) {
	//			this.nameFrame();
	//			return; }
	//		return;
	//	}
	}	//	doAll()

	render() {
		return (
			<div className	= "rr-app-header-title"
				 onClick	= { this.props.appTitleClick } >
				{ this.props.appTitle }
			</div>
		)
	}
}

class AppHeaderPID extends React.Component {
	constructor ( props ) {
		super ( props );
	}

	render() {
		return (
			<div id = "rr-app-pid"
				className = "rr-app-header-pid">
			</div>
		)
	}

	componentDidMount() {
		if ( ! window.process )
			return;
		console.log ( 'process.pid: ' + window.process.pid );
		let ele = document.getElementById ( 'rr-app-pid' );
		if ( ele )
			ele.innerText = 'PID: ' + window.process.pid;
	}
}	//	class AppHeaderPID


class AppHeaderMenuBarItem extends React.Component {
	constructor ( props ) {
		super ( props );

		this.click = this.click.bind ( this );
	}

	click ( ev ) {
		this.props.clientFnc ( { do: 		'app-frame-menu-bar-item-click',
								 itemText:	this.props.text } );
	}

	render() {
		return (
			<span id 		= { this.props.eleId }
				  className = "rr-app-header-menu-bar-item" 
				  onClick	= { this.click } >
				{ this.props.text }
			</span>
		)
	}	//	render()
}	//	class AppHeaderMenuBarItem


class AppHeaderMenuBar extends React.Component {
	constructor ( props ) {
		super ( props );
	}

	render() {
		return (
			<div id 		= "rr-app-header-menu-bar"
				 className 	= "rr-app-header-menu-bar" >
				<AppHeaderMenuBarItem eleId		  = { 'rr-ahmbi-1' }
									  text 		  =	{ 'New Frame' } 
									  clientFnc   = { this.props.clientFnc } />
		{ /* 		<AppHeaderMenuBarItem eleId		  = { 'rr-ahmbi-2' }
									  text 		  =	{ 'New Viewport' } 
									  clientFnc   = { this.props.clientFnc } />
		 */ }
				<AppHeaderMenuBarItem eleId		  = { 'rr-ahmbi-3' }
									  text 		  =	{ 'Save Layout' } 
									  clientFnc   = { this.props.clientFnc } />
				<AppHeaderMenuBarItem eleId		  = { 'rr-ahmbi-4' }
									  text 		  =	{ 'Load Layout' } 
									  clientFnc   = { this.props.clientFnc } />
			</div>
		)
	}	//	render()

	componentDidMount() {
	}	//	componentDidMount()
}	//	class AppHeaderMenuBar


class AppHeaderUser extends React.Component {
	constructor ( props ) {
		super ( props );
		this.clickDisplayName = this.clickDisplayName.bind ( this );
	}

	clickDisplayName ( e ) {
		console.log ( 'AppHeaderUser clickDisplayName()' );
	}   //  clickDisplayName()

	render() {
		return (
			<div 
				className = "rr-app-header-user"
				onClick = {this.clickDisplayName}>
				{this.props.usr.displayName}
			</div>
		)
	}
}   //  class   AppHeaderUser

class AppHeaderSignIn extends React.Component {
	constructor ( props ) {
		super ( props );
		this.state = {
			usr:        null,       //  Until sign in.
		}
		this.clickSignIn = this.clickSignIn.bind ( this );
		this.doAll = this.doAll.bind ( this );
		props.appFrameFnc ( { do: 'set-call-down', 
							  to: 'AppHeaderSignIn',
							  fnc: this.doAll } );
	}

	doAll ( o ) {
		if ( o.do === 'display-user' ) {
			this.setState ( { usr: o.usr } );
		}
	}   //  doAll()

	clickSignIn ( e ) {
		console.log ( 'AppHeaderSignIn clickSignIn()' );
		this.props.appFrameFnc ( { do: 'show-sign-in-dlg' } );
	}   //  clickSignIn()

	render() {
		const isSignedIn = (this.state.usr !== null);
		return (
			<div>
				{isSignedIn ? (
					<AppHeaderUser usr = {this.state.usr} />
				) : (
					<div 
						className = "rr-app-header-sign-in"
						onClick = {this.clickSignIn}>
						Sign In
					</div>
				)}
			</div>
		)
	}
}   //  class   AppHeaderSignIn

class AppHeader extends React.Component {
	constructor ( props ) {
		super ( props );
	}

	render() {
		return ( 
			<div className = "rr-app-header">
				<AppHeaderTitle appTitle 	  = { this.props.appTitle }
								appTitleClick = { this.props.appTitleClick } />
				<AppHeaderMenuBar clientFnc   = { this.props.clientFnc }
								  appFrameFnc = { this.props.appFrameFnc } />
				<AppHeaderPID />
				<AppHeaderSignIn appFrameFnc = { this.props.appFrameFnc } />
			</div>
		);
	}
}   //  AppHeader()


export default AppHeader;
