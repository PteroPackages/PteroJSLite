import axios, { AxiosError } from 'axios';
import { APIError, Auth, FetchOptions, Filter, Include, Method } from './common';
import { version } from '.';

function getHeaders(
    key: string | undefined,
    text: boolean
): Record<string, string> {
    let h: Record<string, string> = {
        'User-Agent': `PteroJSLite ${version}`,
        'Content-Type': text ? 'text/plain' : 'application/json',
        Accept: 'application/json',
    };
    if (key) h['Authorization'] = `Bearer ${key}`;

    return h;
}

async function _fetch<R>(
    method: Method,
    url: string,
    key: string | undefined,
    body: any,
    text: boolean
): Promise<R> {
    if (!text) body &&= JSON.stringify(body);
    return axios
        .request<R>({
            method,
            url,
            headers: getHeaders(key, text),
            data: body,
        })
        .then(res => res.data)
        .catch((err: AxiosError<APIError>) => {
            if (!err.status && !err.response) throw err;
            let fmt =
                '\n' +
                err
                    .response!.data.errors.map(
                        e =>
                            `- ${e.code} (${e.status}): ${
                                e.detail || 'No details provided'
                            }`
                    )
                    .join('\n');

            throw new Error(fmt);
        });
}

function resolve(opts: Filter<Include<FetchOptions>>): string {
    let params = new URLSearchParams();

    if (opts.filter) params.append(`filter[${opts.filter[0]}]`, opts.filter[1]);
    if (opts.include) params.append('include', opts.include.join());
    if (opts.page) params.append('page', opts.page.toString());
    if (opts.perPage) params.append('per_page', opts.perPage.toString());

    return '?' + params.toString();
}

function _get<R>(
    path: string,
    auth: Auth,
    body: any = undefined,
    text: boolean = false
): Promise<R> {
    return _fetch('GET', auth.url + path, auth.key, body, text);
}

function _post<R>(
    path: string,
    auth: Auth,
    body: any = undefined,
    text: boolean = false
): Promise<R> {
    return _fetch('POST', auth.url + path, auth.key, body, text);
}

function _patch<R>(
    path: string,
    auth: Auth,
    body: any = undefined
): Promise<R> {
    return _fetch('PATCH', auth.url + path, auth.key, body, false);
}

function _put<R>(path: string, auth: Auth, body: any = undefined): Promise<R> {
    return _fetch('PUT', auth.url + path, auth.key, body, false);
}

function _delete(
    path: string,
    auth: Auth,
    body: any = undefined
): Promise<void> {
    return _fetch('DELETE', auth.url + path, auth.key, body, false);
}

export default {
    _fetch,
    resolve,
    get: _get,
    post: _post,
    patch: _patch,
    put: _put,
    delete: _delete,
};
