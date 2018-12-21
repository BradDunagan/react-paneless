
let diags = [];

/*
let curTag	= 0;
*/
let curTags	= [];

let diagEnabled = false;
let tagsEnabled = [1, 2, 3];

function diag ( ta, s ) {
	if ( ! diagEnabled ) {
		return; }
	if ( ta.length > 0 ) {
	//	if ( ta.indexOf ( curTag ) < 0 ) {
    //	return; }
		let current = false;
		ta.forEach ( i => {
			if ( curTags.indexOf ( i ) >= 0 ) {
				current = true; }
		} );
		if ( ! current ) {
			return; }
	}
//	diags.push ( s );
	console.log ( s );
}

function diagsFlush() {
	diags = [];
}

function diagsPrint ( tagString, tags, delay ) {
	if ( Array.isArray ( tags ) ) {
		let ok = true;
		tags.forEach ( i => {
			if ( ! Number.isSafeInteger ( i ) ) {
				ok = false;	}
			if ( i <= 0 ) {
				ok = false; }
		} );
		if ( ! ok ) {
			return; }
		curTags = tags; }
	else {
		if ( ! Number.isSafeInteger ( tags ) ) {
			return;	}
		if ( tags <= 0 ) {
			return; }
		if ( tagsEnabled.indexOf ( tags ) < 0 ) {
			return;	}
		curTags.push ( tags ); }

	diagEnabled = true;

	console.groupCollapsed ( '[' + curTags + ']  ' + tagString );
	window.setTimeout ( () => {
		const len = diags.length;
		let i;
		for ( i = 0; i < len; i++ ) {
			console.log ( diags[i] ); }
		console.groupEnd();
		curTags = [];
		diagEnabled = false;
	}, delay );
}   //  diagsPrint()

export { diag, diagsFlush, diagsPrint };
