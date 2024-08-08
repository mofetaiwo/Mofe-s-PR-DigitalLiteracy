import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import Breadcrumb from '../../../components/Video/Breadcrumb';
import FilterPanel from '../../../components/FilterPanel';
import SearchBar from '../../../components/Video/Searchbar';
import SubtopicSelection from '../../../components/Video/SubtopicSelection';
import VideoSection from '../../../components/Video/VideoSection';
import {
	fetchVideosFromFirebase,
	fetchTopicsAndSubtopics,
	fetchTrancriptsFromFirebase,
} from '../../../firebase/firebaseReadWrite';
import Intro from '../../../components/Video/Intro';
import { FILTERGROUPS } from './constants';

function TechVideos({ initialPageContent, introText }) {
	// FINAL values that should be refactored out at some point
	// side filter options unsorted tuple (label, database_value) array
	const [filterGroups] = useState(() => FILTERGROUPS);

	const subtopicGroups = fetchTopicsAndSubtopics();
	const [displayedSubtopics, setDisplayedSubtopics] = useState([]); // Start with empty

	useEffect(() => {
		if (!subtopicGroups) return;
		const initialSubtopics = subtopicGroups.find(([value]) => value === initialPageContent)?.[1] || [];
		setDisplayedSubtopics(initialSubtopics);
	}, [initialPageContent, subtopicGroups]); // Add initialPageContent as a dependency

	// video database values
	const videoValue = fetchVideosFromFirebase();
	const transcriptValue = fetchTrancriptsFromFirebase();
	console.log('videoValue:', videoValue);

	// video search constants
	const [subtopicValue, setsubtopicValue] = useState([]); // current subtopic selected
	const [tags, tagsFromSearchBar] = useState([]); // tags from the search bar

	// Stores database_value from filter. Content type is filtered out depending on page selected.
	// Currently intialized to all values. In the future this can be replaced to potentially store the users state returning to page
	const [appliedFilterTags, setTagsFromFilter] = useState(
		filterGroups.flatMap(({ subheading, filters }) =>
			subheading === 'Content Type'
				? filters.filter(([, value]) => value === initialPageContent).map(([, value]) => value)
				: filters.map(([, value]) => value),
		),
	);

	// set value from user clicking on subtopic
	const dataFromSubtopicSelector = (val) => {
		setsubtopicValue(val);
	};

	// reset subtopic when user clicks on breadcrumb
	const handleResetSubtopic = () => {
		setsubtopicValue([]);
	};

	// update displayed subtopics based on filter side panel
	const updateDisplayedSubtopics = (selectedFilterTags) => {
		const commonContent = selectedFilterTags.filter((tag) => subtopicGroups.some(([value]) => value.includes(tag)));
		const combinedSubtopics = commonContent.flatMap(
			(tag) => subtopicGroups.find(([value]) => value === tag)?.[1] || [],
		);

		if (!combinedSubtopics.includes(subtopicValue)) {
			handleResetSubtopic();
		}

		setDisplayedSubtopics(combinedSubtopics);
	};

	// saves selected filters in the side panel
	const onSave = (selectedFilterTags) => {
		updateDisplayedSubtopics(selectedFilterTags);
		setTagsFromFilter(selectedFilterTags);
	};

	return (
		<div className="relative md:grid md:grid-cols-[max-content_1fr] min-h-screen">
			<FilterPanel filterGroups={filterGroups} onSave={onSave} appliedFilterTags={appliedFilterTags} />

			<div className="md:mx-8 md:flex-1 md:items-center">
				<div className="pb-6">
					<Intro introText={introText} />
					<div className="mx-auto max-w-xl">
						<SearchBar tagsFromSearchBar={tagsFromSearchBar} tags={tags} />
						<Breadcrumb
							subtopicValue={subtopicValue}
							handleResetSubtopic={handleResetSubtopic}
							subtopics={displayedSubtopics}
						/>
					</div>
				</div>
				{/* if there is are no subtopics, a subtopic is selected, or someone searched a tag in the search bar display videos */}
				{displayedSubtopics.length === 0 || subtopicValue.length > 0 || tags.length > 0 ? (
					<div className="flex justify-center">
						<VideoSection
							videoValue={videoValue}
							transcriptValue={transcriptValue}
							subtopicValue={subtopicValue}
							tags={tags}
							appliedFilterTags={appliedFilterTags}
						/>
					</div>
				) : (
					<div className="flex justify-center">
						<SubtopicSelection dataFromSubtopicSelector={dataFromSubtopicSelector} subtopics={displayedSubtopics} />
					</div>
				)}
			</div>
		</div>
	);
}

TechVideos.propTypes = {
	initialPageContent: PropTypes.string.isRequired,
	introText: PropTypes.string.isRequired,
};

export default TechVideos;
