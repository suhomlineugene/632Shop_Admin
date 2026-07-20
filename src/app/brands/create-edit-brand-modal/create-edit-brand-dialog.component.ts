import { FormsModule } from '@angular/forms';
import { AbpModalHeaderComponent } from '@shared/components/modal/abp-modal-header.component';
import { AbpValidationSummaryComponent } from '@shared/components/validation/abp-validation.summary.component';
import { LocalizePipe } from '@shared/pipes/localize.pipe';
import { AppComponentBase } from '@shared/app-component-base';
import { ChangeDetectorRef, Component, EventEmitter, inject, Injector, OnInit, Output } from '@angular/core';
import { BrandDto, BrandsServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AbpModalFooterComponent } from '@shared/components/modal/abp-modal-footer.component';
import { CommonModule } from '@angular/common';

@Component({
    templateUrl: './create-edit-brand-dialog.component.html',
    standalone: true,
    imports: [
        FormsModule,
        CommonModule,
        AbpModalHeaderComponent,
        AbpValidationSummaryComponent,
        LocalizePipe,
        AbpModalFooterComponent,
    ],
})
export class CreateEditBrandDialogComponent extends AppComponentBase implements OnInit {
    @Output() onSave = new EventEmitter<any>();

    saving = false;
    brand = new BrandDto();
    id?: number;

    private readonly cd = inject(ChangeDetectorRef);

    constructor(
        injector: Injector,
        public _brandService: BrandsServiceProxy,
        public bsModalRef: BsModalRef,
    ) {
        super(injector);
    }

    public ngOnInit(): void {
        if (this.id) {
            this.getBrand(this.id);
        }
    }

    public save(): void {
        this.saving = true;

        this._brandService.createEditBrand(this.brand).subscribe({
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

    private getBrand(id: number): void {
        this._brandService.getById(id).subscribe({
            next: (result) => {
                this.brand = Object.assign(new BrandDto(), result);
                this.cd.markForCheck();
            },
            error: () => {
                this.notify.error(this.l('ErrorWhileLoadingBrand'));
                this.cd.markForCheck();
            },
        });
    }
}

