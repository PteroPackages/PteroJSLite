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
    const fmt = '\n'+ errors
        .map(e => `- ${e.code}: ${e.detail || 'No details provided'}`)
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

async function get<T>(path: string, domain: string, auth: string) {
    return await _fetch<T>('GET', domain + path, auth) as APIResponse<T>;
}

async function post<T>(path: string, domain: string, auth: string, params: object = null) {
    return await _fetch('POST', domain + path, auth, params) as APIResponse<T> | undefined;
}

async function patch<T>(path: string, domain: string, auth: string, params: object = null) {
    return await _fetch('PATCH', domain + path, auth, params) as APIResponse<T> | undefined;
}

async function put<T>(path: string, domain: string, auth: string, params: object = null) {
    return await _fetch('PUT', domain + path, auth, params) as APIResponse<T> | undefined;
}

async function _delete(path: string, domain: string, auth: string) {
    return await _fetch('DELETE', domain + path, auth) as void;
}

export default {
    get,
    post,
    patch,
    put,
    delete: _delete
}
