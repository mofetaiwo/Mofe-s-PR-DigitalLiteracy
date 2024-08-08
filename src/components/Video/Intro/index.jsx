import React from 'react';
import PropTypes from 'prop-types';

export default function Intro({ introText }) {
	return (
		<div className="font-inriaSans text-primaryColor font-bold text-center text-3xl md:text-5xl mb-16">{introText}</div>
	);
}

Intro.propTypes = {
	introText: PropTypes.string.isRequired,
};
