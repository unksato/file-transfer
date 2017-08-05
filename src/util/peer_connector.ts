
namespace FileTransfer {

    interface IPeerEvent {
        eventName: string;
        data: any;
    }

    export class PeerConnector {
        private static API_KEY = '609n5y06beu0izfr';
        private _peer: PeerJs.Peer = null;
        private _connection: PeerJs.DataConnection = null;
        private _peerId = null;
        private _isOpened = false;
        private _isConnected = false;
        private _peerEvent = {};
        private _peerInitialized = false;

        private static staticPeer: PeerConnector = null;

        static getPeer(apiKey?: string): PeerConnector {
            if (!PeerConnector.staticPeer) {
                PeerConnector.staticPeer = new PeerConnector(apiKey);
            }
            return PeerConnector.staticPeer;

        }

        private constructor(private apiKey: string = PeerConnector.API_KEY) {
        }

        getPeerId() {
            return this._peerId;
        }

        open(peerId?: string): MyQ.Promise<string> {
            let d = MyQ.Deferred.defer<string>();
            if (!this._isOpened && !this._isConnected) {
                if (peerId) {
                    this._peer = new Peer(peerId, { key: this.apiKey });
                } else {
                    this._peer = new Peer({ key: this.apiKey });
                }
                this._peer.on('open', (id) => {
                    this._peerId = id;
                    this._peer.on('connection', (con) => {
                        this._connection = con;
                        this._connection.on('data', (data) => {
                            this.onRecive(data);
                        })
                    })
                    d.resolve(id);
                });
                this._isOpened = true;
            } else {
                d.reject('peer already opened.');
            }
            return d.promise;
        }

        connect(peerId: string): MyQ.Promise<{}> {
            let d = MyQ.Deferred.defer();

            if (!this._isOpened && !this._isConnected) {
                this._peer = new Peer({ key: this.apiKey });
                this._peerId = peerId;
                this._connection = this._peer.connect(peerId);
                this._connection.on('open', () => {
                    this._connection.on('data', (data) => {
                        this.onRecive(data);
                    });
                    d.resolve({});
                });

            } else {
                d.reject('peer already opened.');
            }

            return d.promise;
        }

        send(eventName: string, data: any) {
            if (this._connection) {
                this._connection.send(JSON.stringify({ eventName, data }));
            }
        }

        setReciveCallback(eventName: string, func: Function) {
            this._peerEvent[eventName] = func;
        }

        onRecive(data: string) {
            let func = null;
            let event: IPeerEvent = JSON.parse(data)
            func = this._peerEvent[event.eventName];
            if (func) func(event.data);
        }
    }

}