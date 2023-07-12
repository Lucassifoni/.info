#!/bin/bash
ffmpeg -an -i ovo_playground_1.mkv -y -strict -2 -vcodec libx264 -map_chapters -1 -pix_fmt yuv420p -profile:v baseline -level 3 -flags +global_header ovo_playground_1_c.mp4
ffmpeg -i ovo_playground_1.mkv -y -strict -2 -vcodec libvpx-vp9 -b:v 1M -acodec libvorbis ovo_playground_1_c.webm
ffmpeg -y -i ovo_playground_1_c.webm -c:v libx264 -c:a aac -movflags faststart ovo_playground_1_co.mp4 
ffmpeg -ss 00:00:02 -y -i ovo_playground_1.mkv -vframes 1 -q:v 2 ovo_playground_1_c.jpg  

ffmpeg -an -i ovo_playground_2.mkv -y -strict -2 -vcodec libx264 -map_chapters -1 -pix_fmt yuv420p -profile:v baseline -level 3 -flags +global_header ovo_playground_2_c.mp4
ffmpeg -i ovo_playground_2.mkv -y -strict -2 -vcodec libvpx-vp9 -b:v 1M -acodec libvorbis ovo_playground_2_c.webm
ffmpeg -y -i ovo_playground_2_c.webm -c:v libx264 -c:a aac -movflags faststart ovo_playground_2_co.mp4 
ffmpeg -ss 00:00:02 -y -i ovo_playground_2.mkv -vframes 1 -q:v 2 ovo_playground_2_c.jpg  

ffmpeg -an -i ovo_playground_3.mkv -y -strict -2 -vcodec libx264 -map_chapters -1 -pix_fmt yuv420p -profile:v baseline -level 3 -flags +global_header ovo_playground_3_c.mp4
ffmpeg -i ovo_playground_3.mkv -y -strict -2 -vcodec libvpx-vp9 -b:v 1M -acodec libvorbis ovo_playground_3_c.webm
ffmpeg -y -i ovo_playground_3_c.webm -c:v libx264 -c:a aac -movflags faststart ovo_playground_3_co.mp4 
ffmpeg -ss 00:00:02 -y -i ovo_playground_3.mkv -vframes 1 -q:v 2 ovo_playground_3_c.jpg  

ffmpeg -an -i ovo_playground_4.mkv -y -strict -2 -vcodec libx264 -map_chapters -1 -pix_fmt yuv420p -profile:v baseline -level 3 -flags +global_header ovo_playground_4_c.mp4
ffmpeg -i ovo_playground_4.mkv -y -strict -2 -vcodec libvpx-vp9 -b:v 1M -acodec libvorbis ovo_playground_4_c.webm
ffmpeg -y -i ovo_playground_4_c.webm -c:v libx264 -c:a aac -movflags faststart ovo_playground_4_co.mp4 
ffmpeg -ss 00:00:02 -y -i ovo_playground_4.mkv -vframes 1 -q:v 2 ovo_playground_4_c.jpg  

ffmpeg -an -i ovo_playground_5.mkv -y -strict -2 -vcodec libx264 -map_chapters -1 -pix_fmt yuv420p -profile:v baseline -level 3 -flags +global_header ovo_playground_5_c.mp4
ffmpeg -i ovo_playground_5.mkv -y -strict -2 -vcodec libvpx-vp9 -b:v 1M -acodec libvorbis ovo_playground_5_c.webm
ffmpeg -y -i ovo_playground_5_c.webm -c:v libx264 -c:a aac -movflags faststart ovo_playground_5_co.mp4 
ffmpeg -ss 00:00:02 -y -i ovo_playground_5.mkv -vframes 1 -q:v 2 ovo_playground_5_c.jpg  

ffmpeg -an -i ovo_playground_6.mkv -y -strict -2 -vcodec libx264 -map_chapters -1 -pix_fmt yuv420p -profile:v baseline -level 3 -flags +global_header ovo_playground_6_c.mp4
ffmpeg -i ovo_playground_6.mkv -y -strict -2 -vcodec libvpx-vp9 -b:v 1M -acodec libvorbis ovo_playground_6_c.webm
ffmpeg -y -i ovo_playground_6_c.webm -c:v libx264 -c:a aac -movflags faststart ovo_playground_6_co.mp4 
ffmpeg -ss 00:00:02 -y -i ovo_playground_6.mkv -vframes 1 -q:v 2 ovo_playground_6_c.jpg  