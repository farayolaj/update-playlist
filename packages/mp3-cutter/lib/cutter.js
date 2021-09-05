const fs = require('fs');
const Duration = require('./duration.js');

class MP3Cutter {
    /**
     * Cuts mp3 files and creates a new file with it.
     * 
     * @param {{src:String, target:String, start:Number, end:Number}} o 
     * @returns {Buffer} cutBuffer
     */
    static cut(o = {}) {
        var src = o.src,
            size = fs.statSync(src).size,
            { duration, offset } = Duration.getDuration(src),
            startTime = o.start || 0,
            endTime = o.end || duration,
            valuePerSecond = (size - offset) / duration,
            start = startTime * valuePerSecond,
            end = endTime * valuePerSecond;

        var fd = fs.openSync(src, 'r');
        try {
            var offsetBuffer = Buffer.alloc(offset);
            fs.readSync(fd, offsetBuffer, 0, offsetBuffer.length, offset);

            var audioBuffer = Buffer.alloc(end - start);
            fs.readSync(fd, audioBuffer, 0, audioBuffer.length, parseInt(start + offset));

            var targetBuffer = Buffer.concat([offsetBuffer, audioBuffer]);
            if (o.target)
                fs.writeFileSync(o.target, targetBuffer);
            else return targetBuffer;
        } catch (e) {
            console.error(e);
        } finally {
            fs.closeSync(fd);
        }
    }
}

module.exports = MP3Cutter;