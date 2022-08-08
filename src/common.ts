export interface APIError {
    errors:{
        code:       string;
        status:     string;
        detail:     string;
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
