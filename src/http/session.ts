import fetch from 'node-fetch';
import { APIError, APIResponse, Auth, Method } from '../common';
import { formatThrow } from './rest';
import { version } from '../../package.json';

export namespace HttpSession {
    export async function getXsrfToken(domain: string) {
        const res = await fetch(domain + '/');
        if (!res.ok) throw new Error(
            `Pterodactyl returned an unexpected response (status: ${res.status})`
        );
        if (!res.headers.get('set-cookie'))
            throw new Error('Pterodactyl did not send a cookie');

        let token: string, expires: string;
        for (let cookie of res.headers.get('set-cookie').split(';')) {
            if (cookie.startsWith('XSRF-TOKEN')) token = cookie.split('=')[1];
            if (cookie.startsWith('expires')) expires = cookie.split('=')[1];
        }
        return {
            token: decodeURIComponent(token),
            expires: Date.parse(expires)
        }
    }

    function getHeaders(token: string): { [key: string]: string } {
        return {
            'User-Agent': `PteroJSLite ${version}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json,text/html',
            'X-XSRF-TOKEN': token
        }
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
            if (res.headers.get('content-type') === 'application/json')
                formatThrow(data as APIError);

            throw new Error(`Pterodactyl request failed (status: ${res.status})`);
        }

        throw new Error(
            `Pterodactyl API returned an invalid or malformed payload (code: ${res.status})`
        );
    }

    export async function get<T>(path: string, auth: Auth) {
        return await _fetch<T>('GET', path, auth) as APIResponse<T>;
    }

    export async function post<T>(path: string, auth: Auth, params: object = null) {
        return await _fetch('POST', path, auth, params) as APIResponse<T> | undefined;
    }

    export async function patch<T>(path: string, auth: Auth, params: object = null) {
        return await _fetch('PATCH', path, auth, params) as APIResponse<T> | undefined;
    }

    export async function put<T>(path: string, auth: Auth, params: object = null) {
        return await _fetch('PUT', path, auth, params) as APIResponse<T> | undefined;
    }

    export async function _delete(path: string, auth: Auth, params: object = null) {
        return await _fetch('DELETE', path, auth, params) as void;
    }
}
