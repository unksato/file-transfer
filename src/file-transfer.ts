/// <reference path="./util/peer_connector.ts" />

namespace FileTransfer {

    interface ISendFile {
        name: string;
        value: string;
    }

    export class Transfer {
        private peerjs: PeerConnector = null;

        constructor(private callback: { (file: Blob, filename: string): void }) {
            this.peerjs = PeerConnector.getPeer();
            this.peerjs.setReciveCallback('onFile', this.onFile);
        }

        open(peerId?: string): MyQ.Promise<string> {
            return this.peerjs.open(peerId);
        }

        connect(peerId: string): MyQ.Promise<{}> {
            return this.peerjs.connect(peerId);
        }

        sendFile(file: File) {
            let fileReader = new FileReader();
            fileReader.onload = (event) => {
                let data: ISendFile = { name: file.name, value: fileReader.result };
                this.peerjs.send('onFile', data);
            }
            fileReader.readAsDataURL(file);
        }

        onFile = (f: ISendFile) => {
            this.callback(this.dataURItoBlob(f.value), f.name);
        }

        private dataURItoBlob(dataURI: string): Blob {
            let byteString = atob(dataURI.split(',')[1]);
            let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
            let ab = new ArrayBuffer(byteString.length);
            let ia = new Uint8Array(ab);
            for (let i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            return new Blob([ab], { type: mimeString });
        }

    }
}