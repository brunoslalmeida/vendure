import { RuntimeVendureConfig, Logger } from '../config';

export abstract class FeatureFlag {
    name: string;
    code: string;

    abstract determineEnabledStatus(config: RuntimeVendureConfig): boolean;

    protected _isEnabled: boolean;

    get isEnabled() {
        return this._isEnabled;
    }

    constructor(config: RuntimeVendureConfig) {
        this._isEnabled = this.determineEnabledStatus(config);
        if (this._isEnabled) {
            Logger.info(`Feature Flag ${this.name} is enabled`);
        }
    }
}

export const FEATURE_FLAG = {} as { [key: string]: FeatureFlag };

export function IS_FEATURE_ENABLED(code: string) {
    if (FEATURE_FLAG[code] && FEATURE_FLAG[code].isEnabled) return true;
    return false;
}
