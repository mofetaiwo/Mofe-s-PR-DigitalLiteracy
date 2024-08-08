import React from 'react';
import { Button } from '@mui/material';
import PropTypes from 'prop-types';
import { Colors } from '../../../../constants/Colors';

export default function SubmitButton({ handleSubmit, submitText }) {
	return (
		<div>
			<Button variant="contained" onClick={handleSubmit} sx={{ bgcolor: Colors.primaryColor }}>
				{submitText}
			</Button>
		</div>
	);
}

SubmitButton.propTypes = {
	handleSubmit: PropTypes.func.isRequired,
	submitText: PropTypes.string.isRequired,
};
