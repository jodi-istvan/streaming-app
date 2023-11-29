if [[ $# -ne 2 ]]; then
  echo "usage: $0 in_video out_ss"
  exit 1
fi

readonly VIDEO_PATH=$1
readonly SS_OUTPUT=$2

ffmpeg -i "$VIDEO_PATH" -ss 00:00:05 -frames:v 1 -update 1 "$SS_OUTPUT"

echo 'Screenshot successfully saved'
