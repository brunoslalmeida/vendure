import { LanguageCode, RequestContext, ShippingCalculator } from '@vendure/core';

export enum TaxSetting {
    include = 'include',
    exclude = 'exclude',
    auto = 'auto',
}

export const defaultShippingCalculator = new ShippingCalculator({
    code: 'default-shipping-calculator-2',
    description: [{ languageCode: LanguageCode.en, value: 'Default Flat-Rate Shipping Calculator 2' }],
    args: {
        rate: {
            type: 'int',
            defaultValue: 0,
            ui: { component: 'currency-form-input' },
            label: [{ languageCode: LanguageCode.en, value: 'Shipping price' }],
        },
        includesTax: {
            type: 'string',
            defaultValue: TaxSetting.auto,
            ui: {
                component: 'select-form-input',
                options: [
                    {
                        label: [{ languageCode: LanguageCode.en, value: 'Includes tax' }],
                        value: TaxSetting.include,
                    },
                    {
                        label: [{ languageCode: LanguageCode.en, value: 'Excludes tax' }],
                        value: TaxSetting.exclude,
                    },
                    {
                        label: [{ languageCode: LanguageCode.en, value: 'Auto (based on Channel)' }],
                        value: TaxSetting.auto,
                    },
                ],
            },
            label: [{ languageCode: LanguageCode.en, value: 'Price includes tax' }],
        },
        taxRate: {
            type: 'int',
            defaultValue: 0,
            ui: { component: 'number-form-input', suffix: '%' },
            label: [{ languageCode: LanguageCode.en, value: 'Tax rate' }],
        },
    },
    calculate: (ctx, order, args) => {
        return [
            {
                price: args.rate,
                taxRate: args.taxRate,
                priceIncludesTax: getPriceIncludesTax(ctx, args.includesTax as any),
            },
            {
                price: args.rate + 10,
                taxRate: args.taxRate,
                priceIncludesTax: getPriceIncludesTax(ctx, args.includesTax as any),
            },
            {
                price: args.rate + 20,
                taxRate: args.taxRate,
                priceIncludesTax: getPriceIncludesTax(ctx, args.includesTax as any),
            },
        ];
    },
});

function getPriceIncludesTax(ctx: RequestContext, setting: TaxSetting): boolean {
    switch (setting) {
        case TaxSetting.auto:
            return ctx.channel.pricesIncludeTax;
        case TaxSetting.exclude:
            return false;
        case TaxSetting.include:
            return true;
    }
}
