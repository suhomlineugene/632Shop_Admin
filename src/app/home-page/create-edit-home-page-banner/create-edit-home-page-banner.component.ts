import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LocalizationService, NotifyService } from 'abp-ng2-module';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AppConsts } from '../../../shared/AppConsts';
import { AbpModalFooterComponent } from '../../../shared/components/modal/abp-modal-footer.component';
import { AbpModalHeaderComponent } from '../../../shared/components/modal/abp-modal-header.component';
import { FileUploadComponent } from '../../../shared/components/file-upload/file-upload.component';
import { AbpValidationSummaryComponent } from '../../../shared/components/validation/abp-validation.summary.component';
import { LocalizePipe } from '../../../shared/pipes/localize.pipe';
import {
    CreateEditMainBanner,
    HomePageServiceProxy,
    MainBannerDto,
    ProductFileDto,
} from '../../../shared/service-proxies/service-proxies';

@Component({
    templateUrl: './create-edit-home-page-banner.component.html',
    standalone: true,
    imports: [
        FormsModule,
        CommonModule,
        AbpModalHeaderComponent,
        AbpValidationSummaryComponent,
        LocalizePipe,
        AbpModalFooterComponent,
        FileUploadComponent,
    ],
})
export class CreateEditHomePageBannerComponent implements OnInit {
    @Output() onSave = new EventEmitter<void>();

    public saving = false;
    public banner = new CreateEditMainBanner();
    public mainBanner?: MainBannerDto;
    public currentImageUrl?: string;

    private readonly localizationSourceName = AppConsts.localization.defaultLocalizationSourceName;

    constructor(
        public bsModalRef: BsModalRef,
        private readonly _homePageService: HomePageServiceProxy,
        private readonly localization: LocalizationService,
        private readonly notify: NotifyService,
        private readonly cd: ChangeDetectorRef,
    ) {
        this.banner.id = 0;
        this.banner.isBadgeVisible = false;
        this.banner.isActive = true;
    }

    public ngOnInit(): void {
        if (!this.mainBanner) {
            this.cd.markForCheck();
            return;
        }

        this.banner.id = this.mainBanner.id;
        this.banner.badgeText = this.mainBanner.badgeText;
        this.banner.isBadgeVisible = this.mainBanner.isBadgeVisible;
        this.banner.title = this.mainBanner.title;
        this.banner.description = this.mainBanner.description;
        this.banner.isActive = this.mainBanner.isActive;
        this.currentImageUrl = this.mainBanner.imageUrl;
        this.cd.markForCheck();
    }

    public get isImageRequired(): boolean {
        return !this.currentImageUrl && !this.banner.image;
    }

    public onBannerImageChange(file?: ProductFileDto): void {
        this.banner.image = file as ProductFileDto;

        if (file) {
            this.currentImageUrl = undefined;
        } else {
            this.currentImageUrl = this.mainBanner?.imageUrl;
        }

        this.cd.markForCheck();
    }

    public save(): void {
        if (this.isImageRequired) {
            this.notify.warn(this.l('Banner image is required'));
            return;
        }

        this.saving = true;

        this._homePageService.createEditMainBanner(this.banner).subscribe({
            next: () => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.bsModalRef.hide();
                this.onSave.emit();
                this.saving = false;
                this.cd.markForCheck();
            },
            error: () => {
                this.saving = false;
                this.cd.markForCheck();
            },
        });
    }

    private l(key: string, ...args: any[]): string {
        let localizedText = this.localization.localize(key, this.localizationSourceName);

        if (!localizedText) {
            localizedText = key;
        }

        if (!args.length) {
            return localizedText;
        }

        args.unshift(localizedText);
        return abp.utils.formatString.apply(this, args);
    }
}

