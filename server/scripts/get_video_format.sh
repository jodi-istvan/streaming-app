if [[ $# -ne 1 ]]; then
  echo "usage: $0 in_video"
  exit 1
fi

ffprobe -v quiet -hide_banner -of default=noprint_wrappers=0 -print_format json -select_streams v:0 -show_format "$1"
