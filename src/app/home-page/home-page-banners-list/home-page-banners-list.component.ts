import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocalizationService, MessageService, NotifyService } from 'abp-ng2-module';
import { appModuleAnimation } from '../../../shared/animations/routerTransition';
import { AppConsts } from '../../../shared/AppConsts';
import { PrimengTableHelper } from '../../../shared/helpers/PrimengTableHelper';
import { LocalizePipe } from '../../../shared/pipes/localize.pipe';
import { BusyIfDirective } from '../../../shared/utils/busy-if.derictive';
import { finalize } from 'rxjs/operators';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Paginator, PaginatorModule } from 'primeng/paginator';
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { HomePageServiceProxy, MainBannerDto } from '../../../shared/service-proxies/service-proxies';
import { CreateEditHomePageBannerComponent } from '../create-edit-home-page-banner/create-edit-home-page-banner.component';

@Component({
    templateUrl: './home-page-banners-list.component.html',
    styleUrls: ['./home-page-banners-list.component.scss'],
    animations: [appModuleAnimation()],
    standalone: true,
    imports: [CommonModule, TableModule, PaginatorModule, LocalizePipe, BusyIfDirective],
})
export class HomePageBannersListComponent implements OnInit {
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;

    public banners: MainBannerDto[] = [];
    public primengTableHelper = new PrimengTableHelper();

    private readonly localizationSourceName = AppConsts.localization.defaultLocalizationSourceName;

    constructor(
        private readonly _homePageService: HomePageServiceProxy,
        private readonly _modalService: BsModalService,
        private readonly localization: LocalizationService,
        private readonly notify: NotifyService,
        private readonly message: MessageService,
        private readonly cd: ChangeDetectorRef,
    ) {}

    public ngOnInit(): void {
        this.getBanners();
    }

    public getBanners(event?: TableLazyLoadEvent): void {
        if (event && this.primengTableHelper.shouldResetPaging(event)) {
            if (this.paginator) {
                this.paginator.changePage(0);
            }

            if (this.primengTableHelper.records && this.primengTableHelper.records.length > 0) {
                return;
            }
        }

        this.primengTableHelper.showLoadingIndicator();

        this._homePageService.getMainBanner()
            .pipe(finalize(() => {
                Promise.resolve().then(() => {
                    this.primengTableHelper.hideLoadingIndicator();
                    this.cd.markForCheck();
                });
            }))
            .subscribe({
                next: (result) => {
                    this.banners = result;
                    this.primengTableHelper.totalRecordsCount = this.banners.length;

                    const first = event?.first ?? 0;
                    const rows = event?.rows ?? this.primengTableHelper.defaultRecordsCountPerPage;
                    this.primengTableHelper.records = this.banners.slice(first, first + rows);
                    this.cd.markForCheck();
                },
                error: () => {
                    this.banners = [];
                    this.primengTableHelper.totalRecordsCount = 0;
                    this.primengTableHelper.records = [];
                    this.notify.error(this.l('Error while loading home page banner'));
                    this.cd.markForCheck();
                },
            });
    }

    public createOrEditBanner(banner?: MainBannerDto): void {
        const createOrEditBannerDialog: BsModalRef = this._modalService.show(CreateEditHomePageBannerComponent, {
            class: 'modal-lg',
            initialState: {
                mainBanner: banner ? Object.assign(new MainBannerDto(), banner) : undefined,
            },
        });

        if (createOrEditBannerDialog.content?.onSave) {
            createOrEditBannerDialog.content.onSave.subscribe(() => {
                this.getBanners();
            });
        }
    }

    public deleteBanner(banner: MainBannerDto): void {
        this.message.confirm(
            this.l('Delete this home page banner?'),
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this._homePageService.deleteMainBanner(
                        banner.badgeText,
                        banner.isBadgeVisible,
                        banner.title,
                        banner.description,
                        banner.imageUrl,
                        banner.isActive,
                        banner.id,
                    ).subscribe(() => {
                        this.getBanners();
                        this.notify.success(this.l('SuccessfullyDeleted'));
                        this.cd.markForCheck();
                    });
                }
            },
        );
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

