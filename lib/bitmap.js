'use strict';

const fs = require('fs');

class BMT {
    constructor(){
        this.buf = null; // buffer
        this.fileHeaderBuf = null; //Raw header
        this.infoHeaderBuf = null;
        this.fileHeader = null;
        this.infoHeader = null;
    }
    open(file, callback){
        fs.readFile(file, (err, data) => {
            if (err) callback(err, null);
            this.buf = data;

            _parseBitmapBuffer(this);
            
            callback(null, this);
        });
    }
}

let _parseBitmapBuffer = function(self){
    self.fileHeaderBuf = self.buf.slice(0, 14);
    self.fileHeader = {
        fileType: self.fileHeaderBuf.toString('ascii', 0, 2),
        fileSize: self.fileHeaderBuf.readUInt32LE(2),
        reserved: self.fileHeaderBuf.readUInt32LE(6),
        dataOffset: self.fileHeaderBuf.readUInt32LE(10)
    }

    self.infoHeaderBuf = self.buf.slice(14, 54);
    self.infoHeader = {
        infoHeaderSize: self.infoHeaderBuf.readUInt32LE(0),
        pixelWidth: self.infoHeaderBuf.readUInt32LE(4),
        pixelHeight: self.infoHeaderBuf.readUInt32LE(8),
        planes: self.infoHeaderBuf.readUInt16LE(12),
        bitsPerPixel: self.infoHeaderBuf.readUInt16LE(14),
        compressionMethod: self.infoHeaderBuf.readUInt32LE(16),
        imageSize: self.infoHeaderBuf.readUInt32LE(20),
        horizontalResolution: self.infoHeaderBuf.readUInt32LE(24),
        verticalResolution: self.infoHeaderBuf.readUInt32LE(28),
        numOfColors: self.infoHeaderBuf.readUInt32LE(32),
        importantColors: self.infoHeaderBuf.readUInt32LE(36)
    }
}

module.exports = exports = BMT;