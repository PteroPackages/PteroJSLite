import fetch from 'node-fetch';
import { version } from '../../package.json';

export interface APIError {
    errors:{
        code:       string;
        status:     string;
        message:    string;
    }[];
}

export interface APIResponse<T> {
    object:         string;
    data?:          T[];
    attributes?:    T;
}

export type Method =
    | 'GET'
    | 'POST'
    | 'PATCH'
    | 'PUT'
    | 'DELETE';

function getHeaders(auth: string): { [key: string]: string } {
    return {
        'User-Agent': `PteroJSLite ${version}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth}`
    };
}

export function formatThrow({ errors }: APIError): never {
    const fmt = errors
        .map(e => `- ${e.code}: ${e.message || 'No details provided'}`)
        .join('\n');

    throw new Error(fmt);
}

export async function _fetch<T>(
    method: Method,
    path: string,
    auth: string,
    params: object = null
): Promise<APIResponse<T> | void> {
    const body = params ? JSON.stringify(params) : undefined;
    const res = await fetch(path, {
        method,
        headers: getHeaders(auth),
        body
    });

    if (res.status === 204) return;
    const data = await res.json().catch(()=>{});
    if (data) {
        if (res.ok) return data as APIResponse<T>;
        formatThrow(data as APIError);
    }

    throw new Error(
        `Pterodactyl API returned an invalid or malformed payload (code: ${res.status})`
    );
}

async function get<T>(path: string, auth: string) {
    return await _fetch<T>('GET', path, auth) as APIResponse<T>;
}

async function post(path: string, auth: string, params: object = null) {
    return await _fetch('POST', path, auth, params);
}

async function patch(path: string, auth: string, params: object = null) {
    return await _fetch('PATCH', path, auth, params);
}

async function put(path: string, auth: string, params: object = null) {
    return await _fetch('PUT', path, auth, params);
}

async function _delete(path: string, auth: string) {
    return await _fetch('DELETE', path, auth) as void;
}

export default {
    get,
    post,
    patch,
    put,
    delete: _delete
}
