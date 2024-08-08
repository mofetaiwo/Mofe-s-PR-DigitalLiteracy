import { useEffect } from 'react';
import Swal from 'sweetalert2';

export default function ErrorSuccessPopup({ text, title, icon, handleClose }) {
	useEffect(() => {
		Swal.fire({
			width: '30rem',
			text,
			title,
			icon,
			showCloseButton: true, // Keep this for the close button (X)
		}).then((result) => {
			if (result.isConfirmed || result.dismiss === Swal.DismissReason.close) {
				handleClose();
			}
		});
	}, [text, title, icon]);

	return null; // Assuming this component does not render anything itself
}

/*
import ErrorSuccessPopup from './Popups/Popups';

	const [popup, setPopup] = useState(null);

	setPopup({
			text: 'Please enter a valid YouTube video URL.',
			visible: true,
			title: 'Oops...',
			icon: 'error',
		});

{popup && popup.visible && (
					<ErrorSuccessPopup
						text={popup.text}  
						title={popup.title}
						icon={popup.icon}
						handleClose={() => setPopup(null)}
					/>
			)}
*/

/*

export const SuccessVideoAddedPopup = () => {
	useEffect(() => {
		Swal.fire({
			width: '30rem',
			// height: '10rem',
			text: 'Video added successfully!',
			icon: 'success',
		});
	}
		, [])

	return null;
}

export const ErrorInvalidYoutubeURLPopup = () =>  {
	useEffect(() => {
		Swal.fire({
			width: '30rem',
			height: '20rem',
			icon: 'error',
			title: 'Oops...',
			text: '"Please enter a valid YouTube video URL."',
		});
	}
		, [])

	return null;
}

export const ErrorEmptyYoutubeURLPopup = () =>  {
	useEffect(() => {
		Swal.fire({
			width: '30rem',
			title: 'Oops...',
			text: 'Please enter a Youtube video URL.',
			icon: 'error',
		});
	}
		, [])

	return null;
}

export const ErrorEmptyOperatingSystemPopup = () =>  {
	useEffect(() => {
		Swal.fire({
			width: '30rem',
			title: 'Oops...',
			text: 'Please select an Operating System.',
			icon: 'error',
		});
	}
		, [])

	return null;
}

export function ErrorEmptyVideoCategoryPopup() {
	useEffect(() => {
		Swal.fire({
			width: '30rem',
			title: 'Oops...',
			text: 'Please select a video category.',
			icon: 'error',
		});
	}
		, [])

	return null;
}

export function ErrorEmptyMessagePopup() {
	useEffect(() => {
		Swal.fire({
			icon: 'error',
			title: 'Oops...',
			text: 'Please ensure all confirmation messages are filled out.',
		});
	}
		, [])

	return null;
}

export function ErrorInvalidStopTimeFormatPopup() {
	useEffect(() => {
		Swal.fire({
			icon: 'error',
			title: 'Oops...',
			text: 'Please ensure all stop times are in a valid MM:SS format.',
		});
	}
		, [])

	return null;
}

export function ErrorInvalidTagsPopup() {
	useEffect(() => {
		Swal.fire({
			width: '30rem',
			title: 'Oops...',
			text: 'Please press enter or delete your current tag.',
			icon: 'error',
		});
	}
		, [])

	return null;
}

export default SuccessVideoAddedPopup;

*/
