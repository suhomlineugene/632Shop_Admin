import { Injector, ElementRef } from '@angular/core';
import { AppConsts } from '@shared/AppConsts';
import {
    LocalizationService,
    PermissionCheckerService,
    FeatureCheckerService,
    NotifyService,
    SettingService,
    MessageService,
    AbpMultiTenancyService,
} from 'abp-ng2-module';

import { AppSessionService } from '@shared/session/app-session.service';
import { PrimengTableHelper } from 'shared/helpers/PrimengTableHelper';
import { Paginator } from 'primeng/paginator';

export abstract class AppComponentBase {
    localizationSourceName = AppConsts.localization.defaultLocalizationSourceName;
    localization: LocalizationService;
    permission: PermissionCheckerService;
    feature: FeatureCheckerService;
    notify: NotifyService;
    setting: SettingService;
    message: MessageService;
    multiTenancy: AbpMultiTenancyService;
    appSession: AppSessionService;
    elementRef: ElementRef;
    primengTableHelper: PrimengTableHelper;

    constructor(injector: Injector) {
        this.localization = injector.get(LocalizationService);
        this.permission = injector.get(PermissionCheckerService);
        this.feature = injector.get(FeatureCheckerService);
        this.notify = injector.get(NotifyService);
        this.setting = injector.get(SettingService);
        this.message = injector.get(MessageService);
        this.multiTenancy = injector.get(AbpMultiTenancyService);
        this.appSession = injector.get(AppSessionService);
        this.elementRef = injector.get(ElementRef);
        this.primengTableHelper = new PrimengTableHelper();
    }

    l(key: string, ...args: any[]): string {
        let localizedText = this.localization.localize(key, this.localizationSourceName);

        if (!localizedText) {
            localizedText = key;
        }

        if (!args || !args.length) {
            return localizedText;
        }

        args.unshift(localizedText);
        return abp.utils.formatString.apply(this, args);
    }

    isGranted(permissionName: string): boolean {
        return this.permission.isGranted(permissionName);
    }

    /**
     * Reloads the current page of a paginated PrimeNG table.
     * If a paginator is available, it re-triggers the current page (which fires the lazy load event).
     * Otherwise, it falls back to the provided callback to reload the data manually.
     */
    protected reloadPage(paginator: Paginator | undefined, reloadCallback: () => void): void {
        if (paginator) {
            paginator.changePage(paginator.getPage());
        } else {
            reloadCallback();
        }
    }
}
