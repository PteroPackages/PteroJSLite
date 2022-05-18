import axios, { AxiosError, AxiosResponse } from 'axios';
import { Auth, APIError, APIResponse, Method } from './common';
import { version } from '../package.json';

export function formatThrow({ errors }: APIError): never {
    const fmt = '\n'+ errors
        .map(e => `- ${e.code}: ${e.detail || 'No details provided'}`)
        .join('\n');

    throw new Error(fmt);
}

export namespace Http {
    function getHeaders(key: string): Record<string, string> {
        return {
            'User-Agent': `PteroJSLite ${version}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${key}`
        };
    }

    export async function _fetch<T>(
        method: Method,
        path: string,
        auth: Auth,
        params: object = null
    ): Promise<APIResponse<T> | void> {
        const body = params ? JSON.stringify(params) : undefined;
        return await axios.request({
            url: auth.domain + path,
            method,
            headers: getHeaders(auth.key),
            data: body
        })
            .then(handleResponse)
            .catch(handleError);
    }

    function handleResponse(res: AxiosResponse): any | void {
        if ([202, 204].includes(res.status)) return;
        return res.data;
    }

    function handleError(err: AxiosError): never {
        if (!err.status && !err.response) throw new Error(err.message);
        if (err.response.status >= 500) throw new Error(
            `Pterodactyl API returned an invalid or unknown response `+
            `(code: ${err.response.status})`
        );
        formatThrow(err.response.data as APIError);
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
