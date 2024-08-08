import { useEffect } from 'react';
import AddVideo from '../AddVideo/AddVideo';
import { fetchVideoFromFirebase } from '../../../firebase/firebaseReadWrite';

export default function UpdateVideoLayout(videoId) {
	const { video, loading, error } = fetchVideoFromFirebase(videoId);

	if (loading) {
		return <div>Loading...</div>;
	}

	if (error) {
		return <div>Error: {error}</div>;
	}

	return <div>{video && <AddVideo videoData={video} type="update" />}</div>;
}
