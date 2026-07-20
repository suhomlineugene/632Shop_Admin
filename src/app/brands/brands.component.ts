import { LocalizePipe } from '@shared/pipes/localize.pipe';
import { Paginator, PaginatorModule } from 'primeng/paginator';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { ChangeDetectorRef, Component, inject, Injector, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { BusyIfDirective } from '@shared/utils/busy-if.derictive';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { DropdownModule } from 'primeng/dropdown';
import { AppComponentBase } from '@shared/app-component-base';
import { BrandDto, BrandsServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import {
    CreateEditBrandDialogComponent,
} from '@app/brands/create-edit-brand-modal/create-edit-brand-dialog.component';

@Component({
    templateUrl: './brands.component.html',
    styleUrls: ['./brands.component.scss'],
    animations: [appModuleAnimation()],
    standalone: true,
    imports: [CommonModule, FormsModule, TableModule, PaginatorModule, LocalizePipe, BusyIfDirective, BsDropdownModule, DropdownModule],
})
export class BrandsComponent extends AppComponentBase implements OnInit {
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;

    public brands: BrandDto[] = [];

    private readonly _brandService = inject(BrandsServiceProxy);
    private readonly _modalService = inject(BsModalService);
    private readonly cd = inject(ChangeDetectorRef);

    constructor(injector: Injector) {
        super(injector);
    }

    public ngOnInit(): void {
        this.getBrands();
    }

    public getBrands(event?: TableLazyLoadEvent) {
        if (event && this.primengTableHelper.shouldResetPaging(event)) {
            if (this.paginator) {
                this.paginator.changePage(0);
            }

            if (this.primengTableHelper.records && this.primengTableHelper.records.length > 0) {
                return;
            }
        }

        this.primengTableHelper.showLoadingIndicator();

        this._brandService.getAll()
            .pipe(finalize(() => {
                Promise.resolve().then(() => {
                    this.primengTableHelper.hideLoadingIndicator();
                    this.cd.markForCheck();
                });
            }))
            .subscribe(res => {
                this.brands = res || [];
                this.primengTableHelper.totalRecordsCount = this.brands.length;
                this.primengTableHelper.records = this.brands;
                this.cd.markForCheck();
            });

    }

    public deleteBrand(brand: BrandDto): void {
        this.message.confirm(
            this.l('BrandDeleteWarningMessage', brand.name),
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this._brandService.deleteBrand(brand.id)
                        .subscribe(() => {
                            this.reloadPage(this.paginator, () => this.getBrands());
                            this.notify.success(this.l('SuccessfullyDeleted'));
                            this.cd.markForCheck();
                        });
                }
            },
        );
    }

    public createOrEditBrand(brand?: BrandDto) {
        let createOrEditBrandDialog: BsModalRef;
        createOrEditBrandDialog =  this._modalService.show(CreateEditBrandDialogComponent, {
            class: 'modal-lg',
            initialState: {
                id: brand?.id,
            },
        });

        if (createOrEditBrandDialog.content && createOrEditBrandDialog.content.onSave) {
            createOrEditBrandDialog.content.onSave.subscribe(() => {
                this.reloadPage(this.paginator, () => this.getBrands());
            });
        }
    }
}
