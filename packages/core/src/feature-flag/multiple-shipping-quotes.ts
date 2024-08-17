import { Column } from 'typeorm';

import { EntityMetadataModifier, RuntimeVendureConfig } from '../config';
import { ShippingLine } from '../entity';

import { FeatureFlag } from '.';

export class MultipleShippingQuotesFeatureFlag extends FeatureFlag {
    name: 'Multiple shipping quotes';
    static code: 'multipleShippingQuotes';

    constructor(config: RuntimeVendureConfig) {
        super(config);

        if (this._isEnabled) this.addShippingMethodCode(config);
    }

    determineEnabledStatus(config: RuntimeVendureConfig): boolean {
        return config.shippingOptions.multipleQuotesPerShippingMethod === true;
    }

    addShippingMethodCode(config: RuntimeVendureConfig) {
        if (!config.entityOptions.metadataModifiers) {
            config.entityOptions.metadataModifiers = [];
        }

        const addShippingMethodCode: EntityMetadataModifier = metadata => {
            const instance = new ShippingLine();
            Column({ type: 'text', nullable: true })(instance, 'code');
        };
        config.entityOptions.metadataModifiers.push(addShippingMethodCode);
    }
}
