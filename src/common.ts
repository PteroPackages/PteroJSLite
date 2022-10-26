export interface APIError {
    errors: {
        code: string;
        status: string;
        detail: string;
    }[];
}

export interface FractalData<T> {
    object: string;
    data: FractalItem<T>[];
}

export interface FractalItem<T> {
    object: string;
    attributes: T;
}

export interface Auth {
    domain: string;
    key: string;
}

export interface FeatureLimits {
    allocations: number;
    backups: number;
    databases: number;
}

export interface Limits {
    memory: number;
    swap: number;
    disk: number;
    io: number;
    threads: string | null;
    cpu: number;
}

export type Method = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
