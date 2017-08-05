/// <reference path="./util/peer_connector.ts" />

namespace FileTransfer {

    interface ISendFile {
        name: string;
        value: string;
    }

    export class Transfer {
        private peerjs: PeerConnector = null;
        private connected = MyQ.Deferred.defer<void>();
        private _isHost = false;

        constructor(private callback: { (file: Blob, filename: string): void }) {
            this.connected = MyQ.Deferred.defer<void>();

            this.peerjs = PeerConnector.getPeer();
            this.peerjs.setReciveCallback('onFile', this.onFile);
            this.peerjs.setReciveCallback('onHandshake', this.onHandshake);
        }

        open(peerId?: string): MyQ.Promise<void> {
            //TODO: 本当は下記のように書きたい(がまだまだMyQがイケてないので)
            // return this.peerjs.open(peerId).then(() => {
            //      return this.connected.promise;
            // });
            this._isHost = true;

            this.peerjs.open(peerId).then(() => {
            });
            return this.connected.promise;
        }

        connect(peerId: string): MyQ.Promise<void> {
            this.peerjs.connect(peerId).then(() => {
                this.sendHello();
            });

            return this.connected.promise;
        }

        sendHello() {
            this.peerjs.send('onHandshake');
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

        onHandshake = () => {
            this.connected.resolve();
            if (this._isHost) {
                this.sendHello();
            }
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