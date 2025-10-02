import YouTube from 'react-youtube';

const YouTubePlayer = ({ videoUrl }: { videoUrl: string }) => {
  const extractVideoId = (url: string): string | null => {
    const match = url.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^?&]+)/,
    );
    return match ? match[1] : null;
  };

  const videoId = extractVideoId(videoUrl);

  if (!videoId) {
    return <div className="text-red-500">⚠️ Invalid YouTube URL</div>;
  }

  return (
    <div className="w-full aspect-video">
      <YouTube
        videoId={videoId}
        opts={{
          width: '100%',
          height: '100%',
          playerVars: {
            autoplay: 1,
            controls: 1,
          },
        }}
        onReady={() => console.log('✅ Video loaded successfully')}
        onError={(e) => console.error('❌ Error loading video:', e)}
        className="w-full h-full"
      />
    </div>
  );
};

export default YouTubePlayer;
