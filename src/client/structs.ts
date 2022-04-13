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
    sftpDetails:{
        ip:         string;
        port:       number;
    };
    status:         string | undefined;
    invocation:     string;
    dockerImage:    string;
    isSuspended:    boolean;
    isInstalling:   boolean;
    isTransferring: boolean;
    // TODO: relationships
}

// Option interfaces/types
