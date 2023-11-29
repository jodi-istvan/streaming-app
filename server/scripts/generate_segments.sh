if [[ $# -ne 3 ]]; then
  echo "usage: $0 in_video out_video_dir video_id"
  exit 1
fi

# TODO: Check bitrate and resolution of video with ffprobe to decide which formats to generate

readonly VIDEO_INPUT_FILE=$1
readonly VIDEO_OUTPUT_DIR=$2
readonly VIDEO_ID=$3

mkdir "tmp_$VIDEO_ID"

ffmpeg -hide_banner -i "$VIDEO_INPUT_FILE" -c:v libx264 -s 426x240 -crf 30 -keyint_min 150 -g 150 -an -f mp4 -dash 1 "tmp_$VIDEO_ID/video_426x240.mp4"
ffmpeg -hide_banner -i "$VIDEO_INPUT_FILE" -c:v libx264 -s 640x360 -crf 30 -keyint_min 150 -g 150 -an -f mp4 -dash 1 "tmp_$VIDEO_ID/video_640x360.mp4"
ffmpeg -hide_banner -i "$VIDEO_INPUT_FILE" -c:v libx264 -s 854x480 -crf 30 -keyint_min 150 -g 150 -an -f mp4 -dash 1 "tmp_$VIDEO_ID/video_854x480.mp4"
#ffmpeg -hide_banner -i "$VIDEO_INPUT_FILE" -c:v libx264 -s 1280x720 -crf 30 -keyint_min 150 -g 150 -an -f mp4 -dash 1 "tmp_$VIDEO_ID/video_1280x720.mp4"
#ffmpeg -hide_banner -i "$VIDEO_INPUT_FILE" -c:v libx264 -s 1920x1080 -crf 30 -keyint_min 150 -g 150 -an -f mp4 -dash 1 "tmp_$VIDEO_ID/video_1920x1080.mp4"
#ffmpeg -hide_banner -i "$VIDEO_INPUT_FILE" -c:v libx264 -s 2560x1440 -crf 30 -keyint_min 150 -g 150 -an -f mp4 -dash 1 "tmp_$VIDEO_ID/video_2560x1440.mp4"
#ffmpeg -hide_banner -i "$VIDEO_INPUT_FILE" -c:v libx264 -s 3840x2160 -crf 30 -keyint_min 150 -g 150 -an -f mp4 -dash 1 "tmp_$VIDEO_ID/video_3840x2160.mp4"
ffmpeg -hide_banner -i "$VIDEO_INPUT_FILE" -c:a aac -b:a 128k -vn -dash 1 "tmp_$VIDEO_ID/audio_128k.m4a"

mkdir -p "$VIDEO_OUTPUT_DIR/$VIDEO_ID"

shaka-packager \
in="tmp_$VIDEO_ID/video_426x240.mp4",stream=video,init_segment="$VIDEO_OUTPUT_DIR/$VIDEO_ID/video_426x240_init.mp4",segment_template="$VIDEO_OUTPUT_DIR/$VIDEO_ID/video_426x240_\$Number%03d$.m4s" \
in="tmp_$VIDEO_ID/video_640x360.mp4",stream=video,init_segment="$VIDEO_OUTPUT_DIR/$VIDEO_ID/video_640x360_init.mp4",segment_template="$VIDEO_OUTPUT_DIR/$VIDEO_ID/video_640x360_\$Number%03d$.m4s" \
in="tmp_$VIDEO_ID/video_854x480.mp4",stream=video,init_segment="$VIDEO_OUTPUT_DIR/$VIDEO_ID/video_854x480_init.mp4",segment_template="$VIDEO_OUTPUT_DIR/$VIDEO_ID/video_854x480_\$Number%03d$.m4s" \
in="tmp_$VIDEO_ID/audio_128k.m4a",stream=audio,init_segment="$VIDEO_OUTPUT_DIR/$VIDEO_ID/audio_128k_init.m4a",segment_template="$VIDEO_OUTPUT_DIR/$VIDEO_ID/audio_128k_\$Number%03d$.m4s" \
--segment_duration 10 \
--generate_static_live_mpd \
--mpd_output "$VIDEO_OUTPUT_DIR/$VIDEO_ID/manifest.mpd"
#in="tmp_$VIDEO_ID/video_1280x720.mp4",stream=video,init_segment="$VIDEO_OUTPUT_DIR/$VIDEO_ID/video_1280x720_init.mp4",segment_template="$VIDEO_OUTPUT_DIR/$VIDEO_ID/video_1280x720_\$Number%03d$.m4s" \
#in="tmp_$VIDEO_ID/video_1920x1080.mp4",stream=video,init_segment="$VIDEO_OUTPUT_DIR/$VIDEO_ID/video_1920x1080_init.mp4",segment_template="$VIDEO_OUTPUT_DIR/$VIDEO_ID/video_1920x1080_\$Number%03d$.m4s" \
#in="tmp_$VIDEO_ID/video_2560x1440.mp4",stream=video,init_segment="$VIDEO_OUTPUT_DIR/$VIDEO_ID/video_2560x1440_init.mp4",segment_template="$VIDEO_OUTPUT_DIR/$VIDEO_ID/video_2560x1440_\$Number%03d$.m4s" \
#in="tmp_$VIDEO_ID/video_3840x2160.mp4",stream=video,init_segment="$VIDEO_OUTPUT_DIR/$VIDEO_ID/video_3840x2160_init.mp4",segment_template="$VIDEO_OUTPUT_DIR/$VIDEO_ID/video_3840x2160_\$Number%03d$.m4s" \

rm -r "tmp_$VIDEO_ID"

