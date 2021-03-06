import  './App.css';

import React, { Component }	from 'react'
import PropTypes 			from 'prop-types'

import AppFrame     		from './app-frame';

import { getFrameId }		from './app-content';
import { getPaneId }		from './pane';

import { diag, 
		 diagsFlush, 
		 diagsPrint}		from './diags';

import styles 				from './styles.css'


export default class ExampleComponent extends Component {
	static propTypes = {
		text: PropTypes.string
	}

	render() {
		const {
			text
		} = this.props

		return (
			<div className={styles.test}>
				Example Comp: { text }
			</div>
		)
	}
}

export { AppFrame };

export { getFrameId };

export { getPaneId };

export { diag, diagsFlush, diagsPrint };

export * from './App.css';
