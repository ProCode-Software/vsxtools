import { Worker as WorkerThread } from 'worker_threads'

export class Worker<T> {
    #url: URL
    public name: string

    constructor(name: string, file: string) {
        this.name = name
        this.#url = new URL(`./workers/${file}.js`, import.meta.url)
    }

    run(workerData: T): WorkerThread {
        return new WorkerThread(this.#url, { name: this.name, workerData })
    }
}
