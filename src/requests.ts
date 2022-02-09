import fetch from 'node-fetch';
import { version } from '../package.json';

const HEADERS: { [key: string]: string } = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'User-Agent': `Application PteroJSLite ${version}`
}

export type RequestMethod =
    | 'GET'
    | 'POST'
    | 'PATCH'
    | 'PUT'
    | 'DELETE';

export interface APIResponse {
    object: string;
    data:   any;
    meta?:  unknown;
}

export interface APIError {
    code:    string;
    status:  string;
    message: string;
}

export async function _fetch(
    method: RequestMethod,
    path: string,
    auth: string,
    data?: object
): Promise<APIResponse | APIError> {
    const body = data ? JSON.stringify(data) : undefined;
    HEADERS['Authorization'] = `Bearer ${auth}`;
    const res = await fetch(path, {
        method,
        headers: HEADERS,
        body
    });

    if (res.status === 201) return Promise.resolve({} as APIResponse);
    if ([200, 204].includes(res.status)) return await res.json() as APIResponse;
    if (res.status < 500) throwError(await res.json() as APIError);
    throw new Error(
        `Pterodactyl API returned an invalid or malformed payload (code: ${res.status})`
    );
}

export function throwError(err: APIError): void {
    throw new Error(`${err.code}: ${err.status}\n${err.message}`);
}

export async function get(path: string, auth: string) {
    return _fetch('GET', path, auth);
}

export async function post(path: string, auth: string, data: object) {
    return _fetch('POST', path, auth, data);
}

export async function patch(path: string, auth: string, data: object) {
    return _fetch('PATCH', path, auth, data);
}

export async function put(path: string, auth: string, data: object) {
    return _fetch('PUT', path, auth, data);
}

export async function _delete(path: string, auth: string) {
    return _fetch('DELETE', path, auth);
}

export default {
    get,
    post,
    patch,
    put,
    delete: _delete
}
