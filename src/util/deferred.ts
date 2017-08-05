namespace MyQ {
    export class Deferred<RESULT> {
        private constructor() { }

        public static defer<T>(): Deferred<T> {
            return new Deferred<T>();
        }

        public promise: Promise<RESULT> = new Promise<RESULT>();

        public resolve(arg?: RESULT) {
            setTimeout(() => {
                this.promise.resolve(arg);
            }, 0)
        }

        public reject(e) {
            setTimeout(() => {
                this.promise.reject(e);
            }, 0);
        }
    }
}