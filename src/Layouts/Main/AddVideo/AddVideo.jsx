import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { addVideoData, updateData } from '../../../firebase/firebaseReadWrite';
import './styles.css';
import Popup from './Components/Popups';

import MessageInputSection from './Layouts/MessageInputSection';
import SubmitButton from './Components/SubmitButton';
import VideoSection from './Layouts/VideoSection';
import VideoInputSection from './Layouts/VideoInputSection';

function AddVideo({ videoData }) {
	// Database Values
	const [url, setUrl] = useState(videoData?.url || '');
	const [tags, setTags] = useState(videoData?.tags || []);
	const [operatingSystem, setOs] = useState(videoData?.operating_system || '');

	const [category, setCategory] = useState(videoData?.category || '');
	const [subtopic, setSubtopic] = useState(videoData?.subtopic || '');

	const [messages, setMessage] = useState(videoData?.messages || ['']);
	const [stopTimes, setStopTimes] = useState(videoData?.stopTimes || ['']);

	// React-Player
	const playerRef = useRef();

	// Video Chapter Segmentation
	const [isChapterSegAvailable, setIsChapterSegAvailable] = useState(false);
	const [isChapterSegChecked, setIsChapterSegChecked] = useState(false);
	const handleChaperCheckboxChange = () => {
		setIsChapterSegChecked(!isChapterSegChecked);
	};

	// This a temp array for the users input stop times
	const [userInputStopTimes, setUserInputStopTimes] = useState(['']);

	// It's simpler to fetch all the chapters when we check if they are available
	const [chapterMessages, setChapterMessage] = useState([
		{
			messages: '',
		},
	]);
	const [chapterStopTimes, setChapterStopTimes] = useState([
		{
			stopTimes: '',
		},
	]);

	// popup message
	const [popup, setPopup] = useState(null);

	// transcript data
	const [transcriptData, setTranscriptData] = useState([]);
	const [title, setTitle] = useState([]);
	const [channelTitle, setChannelTitle] = useState([]);

	/*
	const youtube = google.youtube('v3');

	async function getTranscript(videoId) {
		try {
			const res = await youtube.captions.list({
				part: 'snippet',
				videoId,
				key: process.env.REACT_APP_YOUTUBE_API_KEY,
			});

			// Find the English caption track (or your preferred language)
			const englishCaption = res.data.items.find((caption) => caption.snippet.language === 'en');

			if (!englishCaption) {
				throw new Error('English captions not found');
			}

			// Fetch the actual transcript content
			const transcriptRes = await youtube.captions.download(
				{
					id: englishCaption.id,
					tfmt: 'srt', // Choose your preferred format (srt, vtt, etc.)
					key: process.env.REACT_APP_YOUTUBE_API_KEY,
				},
				{ responseType: 'text' },
			);

			// Process the transcriptRes (e.g., parse SRT format)
			console.log(transcriptRes);
		} catch (error) {
			console.error('Error fetching transcript:', error);
		}
	}
	*/

	// whenever there is a new URL, fetch the chapters if it's a valid URL
	useEffect(() => {
		const fetchChapters = async () => {
			try {
				// check if the url is a valid youtube video and get the video id for the api
				const videoIdRegex =
					/(?:(?:https?:\/\/)?(?:www\.)?)?youtu(?:\.be\/|be.com\/(?:watch\?(?:.*&)?v=|(?:embed|v)\/))([\w'-]+)/i;
				const match = url.match(videoIdRegex);
				if (!match || !match[1]) {
					setUrl('');
					setIsChapterSegAvailable(false);
					setPopup({
						text: 'Please enter a valid YouTube video URL.',
						visible: true,
						title: 'Oops...',
						icon: 'error',
					});
					console.log('Invalid URL', url);
					return;
				}

				// fetch the data from the youtube api
				const response = await fetch(
					`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${match[1]}&key=${process.env.REACT_APP_YOUTUBE_API_KEY}`,
				);

				// parse the data for the chapters
				const data = await response.json();
				const video = data.items[0];

				const desc = video.snippet.description;
				const lines = desc.split('\n');
				const filteredLines = lines.filter((line) => /^\s*\d+:\d+/.test(line));

				// if there are chapter then setIsChapterSegAvailable true which will unhide the checkbox
				if (filteredLines.length > 0) {
					setIsChapterSegAvailable(true);

					console.log('filteredLines', filteredLines);
					const updatedStopTimes = filteredLines.map((line) => convertToSeconds(line.split(' ')[0]));

					// removes the first index of the array
					updatedStopTimes.shift();
					const updatedMessages = Array.from(
						{ length: updatedStopTimes.length },
						() => 'Are you following along so far?',
					);

					setChapterStopTimes(updatedStopTimes);
					setChapterMessage(updatedMessages);
					setChannelTitle(video.channelTitle);
					setTitle(video.title);
				} else {
					setIsChapterSegAvailable(false);
				}

				// getTranscript(match[1]);
			} catch (error) {
				console.log(error);
				alert(error);
			}
		};
		console.log('new', url);
		if (url) {
			setIsChapterSegChecked(false);
			fetchChapters();
		}
	}, [url]);

	const handleSubmit = async (e) => {
		e.preventDefault();

		// Form validation check
		const isValid = validateInputFields();

		if (!isValid) {
			return;
		}

		if (isChapterSegChecked) {
			e.preventDefault();
			try {
				await addVideoData('youtube-videos', {
					url,
					tags,
					operating_system: operatingSystem,
					category,
					subtopic,
					stopTimes: chapterStopTimes,
					messages: chapterMessages,
				});

				setUrl('');
				setTags([]);
				setOs('');
				setCategory('');
				setSubtopic('');
				setStopTimes(['']);
				setMessage(['']);
				setUserInputStopTimes(['']);
				// set checked to false
				setIsChapterSegChecked(false);
				setIsChapterSegAvailable(false);

				setPopup({
					text: 'Video added successfully!',
					visible: true,
					icon: 'success',
				});
			} catch (error) {
				console.log('Error adding video:', error);
				alert(error);
			}
		} else {
			const isValid2 = validateInputFields2();

			if (!isValid2) {
				return;
			}

			sortStopTimes();

			e.preventDefault();

			// eslint-disable-next-line
			const urlRegex = /^(https?:\/\/)/i;

			try {
				// if videoData is not null then I want to change the button to update
				if (videoData) {
					await updateData('youtube-videos', {
						url,
						tags,
						operating_system: operatingSystem,
						category,
						subtopic,
						stopTimes: stopTimes.map((stopTime) => stopTime.stopTimes),
						messages,
						key: videoData.key,
					});
				} else {
					await addVideoData('youtube-videos', {
						url,
						tags,
						operating_system: operatingSystem,
						category,
						subtopic,
						stopTimes: stopTimes.map((stopTime) => stopTime.stopTimes),
						messages,
					});
				}

				setUrl('');
				setTags([]);
				setOs('');
				setCategory('');
				setSubtopic('');
				setStopTimes(['']);
				setMessage(['']);
				setUserInputStopTimes(['']);

				setIsChapterSegChecked(false);
				setIsChapterSegAvailable(false);

				const textField = document.getElementById(`stopTimeTextField_0`);
				if (textField) {
					textField.value = '';
				}
				const textField2 = document.getElementById(`confirmationTextField_0`);
				if (textField2) {
					textField2.value = '';
				}

				setPopup({
					text: 'Video added successfully!',
					visible: true,
					icon: 'success',
				});
			} catch (error) {
				console.log('Error adding video:', error);
			}
		}
	};

	const sortStopTimes = () => {
		// console.log("before stopTimes: " + stopTimes + "\nmessages: " + messages);
		for (let i = 0; i < messages.length - 1; i++) {
			for (let j = i + 1; j < messages.length; j++) {
				if (stopTimes[i] > stopTimes[j]) {
					// Swap elements if they are in the wrong order
					const temp = stopTimes[i];
					stopTimes[i] = stopTimes[j];
					stopTimes[j] = temp;
					const temp2 = messages[i];
					messages[i] = messages[j];
					messages[j] = temp2;
				}
			}
		}
		setStopTimes(stopTimes);
		setMessage(messages);
		// console.log("after stopTimes: " + stopTimes + "\nmessages: " + messages);
	};

	// added for tags validation
	const [tagInputValue, setTagInputValue] = useState('');
	const handleTagsKeyPress = (e) => {
		if (e.key !== 'Enter') {
			setTagInputValue(e.target.value);
		}
	};

	// Validate the necessary input fields.
	const validateInputFields = () => {
		// check youtube url field
		if (url === '') {
			setPopup({
				text: 'Please enter a Youtube video URL.',
				title: 'Oops...',
				visible: true,
				icon: 'error',
			});
			return false;
		}

		// check tags field
		const lastTag = tags[tags.length - 1];
		if (!(tags.length === 0 && tagInputValue === '')) {
			if ((!(tagInputValue === lastTag) && tagInputValue !== '') || tags.length === 0) {
				setPopup({
					text: 'Please press enter or delete your current tag.',
					title: 'Oops...',
					visible: true,
					icon: 'error',
				});
				return false;
			}
		}

		// check operating system
		if (operatingSystem === '') {
			setPopup({
				text: 'Please select an Operating System.',
				title: 'Oops...',
				visible: true,
				icon: 'error',
			});
			return false;
		}

		// check category
		if (category === '') {
			setPopup({
				text: 'Please select a video category.',
				title: 'Oops...',
				visible: true,
				icon: 'error',
			});
			return false;
		}
		if (subtopic === '') {
			setPopup({
				text: 'Please select a subtopic.',
				title: 'Oops...',
				visible: true,
				icon: 'error',
			});
			return false;
		}

		return true;
	};

	const validateInputFields2 = () => {
		// Checks if a string is empty or contains only whitespace
		const isEmptyOrSpaces = (str) => {
			if (typeof str !== 'string') return true;
			return !str || str.trim() === '';
		};

		// Check if any confirmation message is empty or only contains whitespace

		const hasEmptyMessage = messages.some((msg) => isEmptyOrSpaces(msg));

		// console.log('messages size: ' + messages.length);
		// console.log('first message' + messages[0]);
		// console.log('has empty message?' + messages.some((msg) => isEmptyOrSpaces(msg)));

		if (hasEmptyMessage) {
			setPopup({
				text: 'Please ensure all confirmation messages are filled out.',
				title: 'Oops...',
				visible: true,
				icon: 'error',
			});
			return false;
		}

		for (let i = 0; i < messages.length; i++) {
			const textField = document.getElementById(`stopTimeTextField_${i}`);
			if (textField) {
				const regex = /^[0-5]?[0-9]:[0-5][0-9]$/; // validate MM:SS or M:SSformat
				const temp = regex.test(textField.value);

				if (!temp) {
					setPopup({
						text: 'Please ensure all stop times are in a valid MM:SS format.',
						visible: true,
						title: 'Oops...',
						icon: 'error',
					});
					return false;
				}
				// check that the min and seconds inputted are less than the max
				// console.log('stopTimes[' + i + ']: ' + stopTimes[i] + '\nduration: ' + duration);
				if (stopTimes[i] > playerRef.current.getDuration()) {
					setPopup({
						text: 'Please ensure all stop times are below the video length.',
						title: 'Oops...',
						visible: true,
						icon: 'error',
					});
					return false;
				}
			}
		}
		return true;
	};

	const handleClickTime = (index) => {
		if (playerRef.current) {
			const currentTime = playerRef.current.getDuration();
			const formattedTime = `${Math.floor(currentTime / 60)}:${String(Math.floor(currentTime % 60)).padStart(2, '0')}`;
			const reverseIndex = messages.length - index - 1;
			stopTimes[reverseIndex] = convertToSeconds(formattedTime);

			const textField = document.getElementById(`stopTimeTextField_${reverseIndex}`);
			if (textField) {
				textField.value = formattedTime;
			}
		}
	};

	const onAddBtnClick = () => {
		const newField = {
			messages: '',
			stopTimes: '',
		};
		// You have to be specific of which field of newField to solve the previous commenting messages issue.
		setMessage([...messages, newField.messages]);
		setStopTimes([...stopTimes, newField.stopTimes]);
	};

	const remove = (index) => {
		const messagedata = [...messages];
		messagedata.splice(index, 1);
		setMessage(messagedata);
		const stopdata = [...stopTimes];
		stopdata.splice(index, 1);
		setStopTimes(stopdata);

		for (let i = 0; i < messagedata.length; i++) {
			let textField = document.getElementById(`stopTimeTextField_${i}`);
			if (textField) {
				textField.value = `${Math.floor(stopdata[i] / 60)}:${String(stopdata[i] % 60).padStart(2, '0')}`;
			}
			textField = document.getElementById(`confirmationTextField_${i}`);
			if (textField) {
				textField.value = messagedata[i];
			}
		}
	};

	const convertToSeconds = (time) => {
		const [minutes, seconds] = time.split(':').map((num) => parseInt(num));
		return minutes * 60 + seconds;
	};

	const handleChange = (index, event) => {
		// console.log('index: ', index);
		// console.log('event: ', event.target.value);
		const stopTime = [...stopTimes];
		const message = [...messages];
		if (event.target.name === 'stopTimes') {
			stopTime[index] = convertToSeconds(event.target.value);
			// ("stopTime is: " + stopTime + "\nIndex is: " + index);
		} else if (event.target.name === 'messages') {
			message[index] = event.target.value;
			// alert("message is: " + message + "\nIndex is: " + index);
		}
		// console.log('stopTime: ', stopTime);
		// console.log('message: ', message);
		setStopTimes(stopTime);
		setMessage(message);
		console.log('TEST: ', stopTime);
	};

	return (
		<div className="lg:grid lg:grid-cols-5">
			<section className="mb-8 lg:mb-0 lg:col-span-2 lg:order-2">
				<VideoSection playerRef={playerRef} url={url} />
			</section>
			<section className="col-span-3 mb-8 flex flex-col gap-4 px-4">
				<VideoInputSection
					url={url}
					setUrl={setUrl}
					handleTagsKeyPress={handleTagsKeyPress}
					tags={tags}
					setTags={setTags}
					operatingSystem={operatingSystem}
					setOs={setOs}
					category={category}
					setCategory={setCategory}
					subtopic={subtopic}
					setSubtopic={setSubtopic}
				/>

				<MessageInputSection
					url={url}
					onAddBtnClick={onAddBtnClick}
					isChapterSegAvailable={isChapterSegAvailable}
					isChapterSegChecked={isChapterSegChecked}
					messages={messages}
					stopTimes={stopTimes}
					handleChange={handleChange}
					handleClickTime={handleClickTime}
					remove={remove}
					handleChaperCheckboxChange={handleChaperCheckboxChange}
					userInputStopTimes={userInputStopTimes}
					setUserInputStopTimes={setUserInputStopTimes}
				/>

				{videoData ? (
					<SubmitButton handleSubmit={handleSubmit} submitText="Update" />
				) : (
					<SubmitButton handleSubmit={handleSubmit} submitText="Submit" />
				)}
			</section>
			{popup && popup.visible && (
				<Popup title={popup.title} icon={popup.icon} handleClose={() => setPopup(null)} text={popup.text} />
			)}
		</div>
	);
}

export default AddVideo;

AddVideo.propTypes = {
	videoData: PropTypes.shape({
		url: PropTypes.string,
		tags: PropTypes.arrayOf(PropTypes.string),
		operating_system: PropTypes.string,
		category: PropTypes.string,
		subtopic: PropTypes.string,
		messages: PropTypes.arrayOf(PropTypes.string),
		stopTimes: PropTypes.arrayOf(PropTypes.number),
	}),
};

AddVideo.defaultProps = {
	videoData: null,
};
