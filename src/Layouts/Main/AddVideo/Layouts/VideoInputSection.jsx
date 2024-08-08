import React, { useEffect, useState } from 'react';
import { MenuItem, Divider } from '@mui/material';
import PropTypes from 'prop-types';
import { set } from 'lodash';
import InputField, { TagsInputField, DropdownInputField } from '../Components/InputFields';
import { fetchTopicsAndSubtopics } from '../../../../firebase/firebaseReadWrite';

export default function VideoInputSection({
	url,
	setUrl,
	tags,
	setTags,
	handleTagsKeyPress,
	operatingSystem,
	setOs,
	category,
	setCategory,
	subtopic,
	setSubtopic,
}) {
	const subtopics = fetchTopicsAndSubtopics();
	const [displaySubtopics, setDisplayedSubtopics] = useState([]);

	console.log('category:', category);
	useEffect(() => {
		if (category && subtopics) {
			// Check if subtopics is not null
			const relevantSubtopics = subtopics.find((item) => item[0]?.toLowerCase() === category.toLowerCase())?.[1] ?? []; // Use optional chaining and nullish coalescing

			setDisplayedSubtopics(relevantSubtopics);

			// Reset subtopic only if it's not in the new list of relevantSubtopics
			if (!relevantSubtopics.includes(subtopic)) {
				setSubtopic('');
			}
		}
	}, [category, subtopics]);

	return (
		<div className="bg-backgroundColor shadow-md rounded-xl py-12 px-12">
			<div className="flex flex-col gap-6">
				<InputField
					headerText="Youtube Link:"
					placeHolder="Input Youtube Video Url"
					value={url}
					onChangeFunction={setUrl}
					eventName="youtubeLink"
				/>

				<TagsInputField
					headerText="Tags:"
					placeHolder="To add tags, input the desired word and press Enter"
					value={tags}
					onChangeFunction={setTags}
					onKeyUpFunction={handleTagsKeyPress}
					eventName="tags"
				/>

				<DropdownInputField
					headerText="Operating System:"
					inputLabel="What kind of device is this for?"
					value={operatingSystem}
					onChangeFunction={setOs}
					MenuItems={[
						<MenuItem key="Mobile Devices" disabled>
							Mobile Devices
						</MenuItem>,
						<MenuItem key="iOS" value="iOS">
							iOS
						</MenuItem>,
						<MenuItem key="Android" value="Android">
							Android
						</MenuItem>,
						<Divider key="divider" />,
						<MenuItem key="PC" disabled>
							PC
						</MenuItem>,
						<MenuItem key="Windows" value="Windows">
							Windows
						</MenuItem>,
						<MenuItem key="Mac" value="Mac">
							Mac
						</MenuItem>,
						<MenuItem key="Linux" value="Linux">
							Linux
						</MenuItem>,
						<Divider key="divider" />,
						<MenuItem key="All" value="All">
							All
						</MenuItem>,
					]}
				/>

				<DropdownInputField
					headerText="Video Category:"
					inputLabel="What category is this video for?"
					value={category}
					onChangeFunction={setCategory}
					MenuItems={[
						<MenuItem key="daily_life" value="daily_life">
							Technology Use in Daily Life
						</MenuItem>,
						<MenuItem key="safety_privacy" value="safety_privacy">
							Technology Safety and Privacy
						</MenuItem>,
						<MenuItem key="class_word" value="class_word">
							Technology use for Class and Work
						</MenuItem>,
						<MenuItem key="finance" value="finance">
							Financial Well Being and Management
						</MenuItem>,
					]}
				/>

				{category &&
					subtopics?.length > 0 && ( // Check if subtopics is not null
						<DropdownInputField
							headerText="Subtopic:"
							inputLabel="Select a subtopic"
							value={subtopic}
							onChangeFunction={setSubtopic}
							MenuItems={[
								displaySubtopics.map((subtopicVal, index) => (
									<MenuItem key={index} value={subtopicVal}>
										{subtopicVal}
									</MenuItem>
								)),
							]}
						/>
					)}
			</div>
		</div>
	);
}

VideoInputSection.propTypes = {
	url: PropTypes.string.isRequired,
	setUrl: PropTypes.func.isRequired,
	tags: PropTypes.arrayOf(PropTypes.string).isRequired,
	setTags: PropTypes.func.isRequired,
	handleTagsKeyPress: PropTypes.func.isRequired,
	operatingSystem: PropTypes.string.isRequired,
	setOs: PropTypes.func.isRequired,
	category: PropTypes.string.isRequired,
	setCategory: PropTypes.func.isRequired,
	subtopic: PropTypes.string.isRequired,
	setSubtopic: PropTypes.func.isRequired,
};
