import requests from './requests'

export class PteroController {
    public readonly instanceType: 'application' | 'client';
    public readonly api: {
        [key: string]: (...params: string[]) => string
    }

    constructor(
        public domain: string,
        public auth: string,
        type: 'application' | 'client'
    ) {
        // TODO
    }
}