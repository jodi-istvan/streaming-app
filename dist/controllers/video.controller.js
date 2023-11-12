import { Video } from '../schemas/video.schema.js';
import * as fs from 'fs';
export default class VideoController {
    model = Video;
    stream = async (req, res) => {
        const videoId = req.query.id;
        const videoDoc = await this.model.findById(videoId);
        if (!videoDoc) {
            return res.status(404).json({ message: 'Video not found' });
        }
        try {
            const filePath = `${process.cwd()}/server/media/videos/${videoDoc.filePath}`;
            const videoStats = fs.statSync(filePath);
            const fileSize = videoStats.size;
            const { range } = req.headers;
            if (range) {
                const part = range.split('bytes=')[1].split(', ')[0].split('-');
                const start = parseInt(part[0], 10);
                const end = part[1] ? parseInt(part[1], 10) : fileSize - 1;
                const chunkSize = end - start + 1;
                const file = fs.createReadStream(filePath, { start, end });
                const header = {
                    'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                    'Accept-Ranges': 'bytes',
                    'Content-Length': chunkSize,
                    'Content-Type': 'video/mp4'
                };
                res.writeHead(206, header);
                file.pipe(res);
            }
            else {
                const header = {
                    'Content-Length': fileSize,
                    'Content-Type': 'video/mp4'
                };
                res.writeHead(200, header);
                fs.createReadStream(filePath).pipe(res);
            }
        }
        catch (err) {
            console.error(err);
            return res.sendStatus(500);
        }
    };
}
//# sourceMappingURL=video.controller.js.map