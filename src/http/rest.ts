import fetch from 'node-fetch';
import { version } from '../../package.json';

export interface APIError {
    errors:{
        code:       string;
        status:     string;
        detail:     string;
        // meta?:      { [key: string]: string };
    }[];
}

export interface APIResponse<T> {
    object:         string;
    data?:          T[];
    attributes?:    T;
}

export interface Auth {
    domain: string;
    key:    string;
}

export type Method =
    | 'GET'
    | 'POST'
    | 'PATCH'
    | 'PUT'
    | 'DELETE';

function getHeaders(key: string): { [key: string]: string } {
    return {
        'User-Agent': `PteroJSLite ${version}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${key}`
    };
}

export function formatThrow({ errors }: APIError): never {
    const fmt = '\n'+ errors
        .map(e => `- ${e.code}: ${e.detail || 'No details provided'}`)
        .join('\n');

    throw new Error(fmt);
}

export async function _fetch<T>(
    method: Method,
    path: string,
    auth: Auth,
    params: object = null
): Promise<APIResponse<T> | void> {
    const body = params ? JSON.stringify(params) : undefined;
    const res = await fetch(auth.domain + path, {
        method,
        headers: getHeaders(auth.key),
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

async function get<T>(path: string, auth: Auth) {
    return await _fetch<T>('GET', path, auth) as APIResponse<T>;
}

async function post<T>(path: string, auth: Auth, params: object = null) {
    return await _fetch('POST', path, auth, params) as APIResponse<T> | undefined;
}

async function patch<T>(path: string, auth: Auth, params: object = null) {
    return await _fetch('PATCH', path, auth, params) as APIResponse<T> | undefined;
}

async function put<T>(path: string, auth: Auth, params: object = null) {
    return await _fetch('PUT', path, auth, params) as APIResponse<T> | undefined;
}

async function _delete(path: string, auth: Auth) {
    return await _fetch('DELETE', path, auth) as void;
}

export default {
    get,
    post,
    patch,
    put,
    delete: _delete
}
