import { FeatureLimits, Limits } from '../common';

// Structures

export interface ClientServer {
    uuid:           string;
    identifier:     string;
    name:           string;
    description:    string | undefined;
    node:           string;
    serverOwner:    boolean;
    limits:         Limits;
    featureLimits:  FeatureLimits;
    state:          string | undefined;
    isSuspended:    boolean;
    isInstalling:   boolean;
}

// Option interfaces/types
