export interface FeatureLimits {
    allocations:    number;
    backups:        number;
    databases:      number;
}

export interface Limits {
    memory:     number;
    swap:       number;
    disk:       number;
    io:         number;
    threads:    string | null;
    cpu:        number;
}
