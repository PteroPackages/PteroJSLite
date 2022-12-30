export interface APIError {
    errors: {
        code: string;
        status: string;
        detail: string;
    }[];
}

export interface Auth {
    url: string;
    key: string;
}

export type Filter<T> = T & { filter?: [string, string] };

export interface FractalData<T> {
    object: string;
    data: FractalItem<T>[];
}

export interface FractalItem<T> {
    object: string;
    attributes: T;
}

export interface FeatureLimits {
    allocations: number;
    backups: number;
    databases: number;
}

export interface FetchOptions {
    page?: number;
    perPage?: number;
}

export type Include<T> = T & { include?: string[] };

export interface Limits {
    memory: number;
    swap: number;
    disk: number;
    io: number;
    threads: string | null;
    cpu: number;
}

export type Method = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
