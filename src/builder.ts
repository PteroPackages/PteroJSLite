import { AppController } from './application';

export function createApp(domain: string, auth: string) {
    return new AppController(domain, auth);
}
