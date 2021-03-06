/*
		 1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/
import React            from 'react';
/*
import AppSignInDialog  from './sign-in';
*/
import DlgName			from './dlg-name';
import BurgerMenu       from './burger-menu';
import Frame			from './frame';

class AppDialog extends React.Component {
	constructor ( props ) {
		super ( props );

		this.click	= this.click.bind ( this );
		this.doAll	= this.doAll.bind ( this );

		let menus = [];
		if ( props.mnu ) {
			menus.push (
				<BurgerMenu key 		= { props.mnu.menuEleId }
							eleId 		= { props.mnu.menuEleId }
							style 		= {{ left:	props.mnu.menuX + 'px',
											 top: 	props.mnu.menuY + 'px' }}
							items		= { props.mnu.menuItems }
							appFrameFnc	= { props.appFrameFnc }
							screenFnc 	= { this.doAll }
							upFnc		= { props.mnu.upFnc }
							ctx			= { props.mnu.ctx } /> ); }
		this.state = {
			menus:		menus
		};
	}

	click ( ev ) {
		this.props.appFrameFnc ( { do: 'menu-dismiss' } );
	}	//	click()

	doAll ( o ) {
		if ( o.do === 'menu-dismiss' ) {
			this.props.appFrameFnc ( o );
			return;	}
		if ( o.do === 'push-sub-menu' ) {
			let m = this.state.menus;
			m.push ( 
				<BurgerMenu key 		= { o.menuEleId }
							eleId 		= { o.menuEleId }
							style 		= {{ left:	o.menuX + 'px',
											 top: 	o.menuY + 'px' }}
							items		= { o.menuItems }
							appFrameFnc	= { this.props.appFrameFnc }
							screenFnc 	= { this.doAll }
							upFnc		= { o.upFnc }
							ctx			= { o.ctx }
							isSubMenu	= { true } /> );
			this.setState ( { menus: m } );
			return; }
		if ( o.do === 'pop-sub-menu' ) {
			let m = this.state.menus;
			m.pop();
			this.setState ( { menus: m } );
			return; }
	}	//	doAll()

	render() {
		if ( this.props.frame ) {
			let o = this.props.frame;
			return (
				<div className	= "rr-app-screen-dialog" >
					<Frame hdrVisible		= { o.hdrVisible }
				   		   ftrVisible		= { o.ftrVisible }
				   		   frameName		= { o.frameName }
				   		   frameType		= { o.frameType }
						   frameAs			=  'dialog'
				   		   frameId 			= { o.frameId }
				   		   paneId			= { o.paneId }
				   		   appFrameFnc 		= { this.props.appFrameFnc } 
				   		   appContentFnc	= { this.props.appContentFnc }
				   		   left 			= { null }
				   		   top				= { null }
				   		   width 			= { o.style.width }
				   		   height			= { o.style.height }
				   		   iconized			= { null }
				   		   clientFnc		= { this.props.clientFnc } />;
				</div>
			);
		}
		if ( this.props.comp ) {
			return (
				<div className	= "rr-app-screen-dialog" >
					{ this.props.comp }
				</div>
			);
		}
		switch ( this.props.dlg ) {
//			case 'sign-in': 
//				return (
//					<div className = "rr-app-screen-dialog">
//						<AppSignInDialog frameFnc = {this.props.upFnc}/>
//					</div>
//				);
			case 'dlg-name':
				return (
					<div className	= "rr-app-screen-dialog" >
						<DlgName appFrameFnc =	{ this.props.appFrameFnc }
								 upFnc = 		{ this.props.upFnc }
								 ctx = 			{ this.props.ctx }/>
					</div>
				);
			case 'menu':
			//	let mnu = this.props.mnu;
				return (
					<div className 	= "rr-app-screen-dialog"
						 onClick	= { this.click } >
				{ /*	<BurgerMenu eleId 		= { mnu.menuEleId }
									style 		= {{ left:	mnu.menuX + 'px',
													 top: 	mnu.menuY + 'px' }}
									items		= { mnu.menuItems }
									appFrameFnc	= { this.props.appFrameFnc }
									screenFnc 	= { this.doAll }
									upFnc		= { mnu.upFnc }
									ctx			= { mnu.ctx } />	*/}
						{ this.state.menus }
					</div>
				);
			default:
				return null;
		}
	}
}   //  AppDialog()

export { AppDialog as default };
