import { Injector, Pipe, PipeTransform } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';

@Pipe({
    name: 'localize',
    standalone: true,
})
export class LocalizePipe extends AppComponentBase implements PipeTransform {
    constructor(injector: Injector) {
        super(injector);
    }

    transform(key: string, ...args: any[]): string {
        const localized = this.l(key, ...args);

        // ABP returns the raw key when no translation is found in the source.
        // If localized text equals the original key, split PascalCase/camelCase
        // into readable words as a graceful fallback.
        if (localized === key) {
            return this.splitCamelCase(key);
        }

        return localized;
    }

    private splitCamelCase(value: string): string {
        return value
            .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
            .replace(/([a-z\d])([A-Z])/g, '$1 $2')
            .replace(/^./, (str) => str.toUpperCase())
            .trim();
    }
}
