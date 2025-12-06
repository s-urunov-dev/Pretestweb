import { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'motion/react';
import { Play, Pause, VolumeX, Volume2, Star } from 'lucide-react';

interface VideoTestimonialCardProps {
  videoUrl?: string;
  thumbnail: string;
  studentName: string;
  score: number;
  description: string;
  country?: string;
  isCurrent: boolean;
  isMuted: boolean;
  onMuteToggle: () => void;
  gradient: string;
  totalCount: number;
  currentIndex: number;
  onVideoPlayingChange?: (isPlaying: boolean) => void;
}

export function VideoTestimonialCard({
  videoUrl,
  thumbnail,
  studentName,
  score,
  description,
  country,
  isCurrent,
  isMuted,
  onMuteToggle,
  gradient,
  totalCount,
  currentIndex,
  onVideoPlayingChange,
}: VideoTestimonialCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);

  // Sync mute state with video element
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // Handle video loading
  const handleVideoLoad = useCallback(() => {
    setIsBuffering(false);
  }, []);

  // Handle video error
  const handleVideoError = useCallback((e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    setVideoError(true);
    setShowVideo(false);
    setIsBuffering(false);
  }, []);

  // Handle buffering states
  const handleWaiting = useCallback(() => {
    setIsBuffering(true);
  }, []);

  const handleCanPlay = useCallback(() => {
    setIsBuffering(false);
  }, []);

  // Handle play/pause
  const togglePlayPause = useCallback(async () => {
    if (!videoUrl || !videoRef.current) {
      return;
    }

    try {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
        onVideoPlayingChange?.(false);
      } else {
        setShowVideo(true);
        setVideoError(false);
        
        try {
          await videoRef.current.play();
          setIsPlaying(true);
          onVideoPlayingChange?.(true);
        } catch (playError: any) {
          // Try with muted if autoplay was blocked
          if (playError.name === 'NotAllowedError') {
            videoRef.current.muted = true;
            await videoRef.current.play();
            setIsPlaying(true);
            onVideoPlayingChange?.(true);
          } else {
            throw playError;
          }
        }
      }
    } catch (error: any) {
      setIsPlaying(false);
      onVideoPlayingChange?.(false);
      setVideoError(true);
    }
  }, [videoUrl, isPlaying, onVideoPlayingChange]);

  // Reset when card changes
  useEffect(() => {
    if (!isCurrent) {
      setIsPlaying(false);
      setShowVideo(false);
      setVideoError(false);
      onVideoPlayingChange?.(false);
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  }, [isCurrent]);

  return (
    <div className="relative w-full h-full">
      {/* Progress Lines */}
      <div className="absolute top-2 left-2 right-2 flex justify-center gap-1 z-30">
        {Array.from({ length: totalCount }).map((_, index) => (
          <div
            key={index}
            style={{
              height: '3px',
              minHeight: '3px',
              maxHeight: '3px',
              flex: 1,
              backgroundColor: index <= currentIndex ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.3)',
              borderRadius: '9999px',
              opacity: index <= currentIndex ? 1 : 0.6,
              transition: 'all 0.3s'
            }}
          />
        ))}
      </div>

      {/* Thumbnail Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} transition-opacity duration-300 ${showVideo && !videoError ? 'opacity-0' : 'opacity-100'}`}>
        <img
          src={thumbnail}
          alt={studentName}
          className="w-full h-full object-cover"
          loading="lazy"
          decoding="async"
        />
      </div>

      {/* Video Element - Always rendered */}
      {videoUrl && (
        <video
          ref={videoRef}
          src={videoUrl}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
            showVideo && !videoError ? 'opacity-100' : 'opacity-0'
          }`}
          loop
          playsInline
          muted={isMuted}
          poster={thumbnail}
          preload="metadata"
          onLoadedData={handleVideoLoad}
          onError={handleVideoError}
          onWaiting={handleWaiting}
          onCanPlay={handleCanPlay}
          onEnded={() => {
            setIsPlaying(false);
            onVideoPlayingChange?.(false);
          }}
          onPlay={() => {
            setIsPlaying(true);
            onVideoPlayingChange?.(true);
          }}
          onPause={() => {
            setIsPlaying(false);
            onVideoPlayingChange?.(false);
          }}
        />
      )}

      {/* Buffering Indicator */}
      {isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-15">
          <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      )}

      {/* Video Error Message */}
      {videoError && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-red-500/80 text-white px-4 py-2 rounded-lg text-xs z-20">
          Video yuklanmadi
        </div>
      )}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

      {/* Center Play/Pause Button */}
      <button
        onClick={togglePlayPause}
        className="absolute inset-0 flex items-center justify-center group z-10"
      >
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className={`w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center transition-opacity ${
            isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'
          }`}
        >
          {isPlaying ? (
            <Pause className="h-8 w-8 text-white" />
          ) : (
            <Play className="h-8 w-8 text-white ml-1" />
          )}
        </motion.div>
      </button>

      {/* Controls Overlay */}
      <div className="absolute inset-0 flex flex-col justify-between p-4 sm:p-6 text-white pointer-events-none z-20">
        {/* Top Controls */}
        <div className="flex justify-end mt-4 sm:mt-6">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMuteToggle();
            }}
            className="p-2 rounded-full bg-black/40 hover:bg-black/60 transition-colors cursor-pointer pointer-events-auto relative z-30"
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
        </div>

        {/* Spacer for center play button */}
        <div />

        {/* Bottom Info */}
        <div className="space-y-2 sm:space-y-3 pointer-events-none">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center overflow-hidden flex-shrink-0">
              <img 
                src={thumbnail} 
                alt={studentName}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <div className="text-xs sm:text-sm truncate">{studentName}</div>
              {country && <div className="text-xs text-white/80 truncate">{country}</div>}
            </div>
          </div>
          
          <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5 sm:px-4 sm:py-2 inline-flex items-center gap-1.5 sm:gap-2">
            <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400 flex-shrink-0" />
            <span className="text-xs whitespace-nowrap">Band Score:</span>
            <span className="text-xs sm:text-sm font-medium">{typeof score === 'number' && !isNaN(score) && isFinite(score) ? score.toFixed(1) : '0.0'}</span>
          </div>

          <p className="text-xs sm:text-sm leading-relaxed line-clamp-3 sm:line-clamp-4">
            "{description}"
          </p>
        </div>
      </div>
    </div>
  );
}