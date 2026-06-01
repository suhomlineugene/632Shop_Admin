import { FormsModule } from '@angular/forms';
import { AbpModalHeaderComponent } from '@shared/components/modal/abp-modal-header.component';
import { AbpValidationSummaryComponent } from '@shared/components/validation/abp-validation.summary.component';
import { LocalizePipe } from '@shared/pipes/localize.pipe';
import { AppComponentBase } from '@shared/app-component-base';
import { ChangeDetectorRef, Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { CreateEditProductDto, DropdownDto, ProductsServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppProductType } from '@shared/AppProductType';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AbpModalFooterComponent } from '@shared/components/modal/abp-modal-footer.component';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';

@Component({
    templateUrl: './create-edit-product-dialog.component.html',
    standalone: true,
    imports: [
        FormsModule,
        CommonModule,
        AbpModalHeaderComponent,
        AbpValidationSummaryComponent,
        LocalizePipe,
        AbpModalFooterComponent,
        DropdownModule,
    ],
})
export class CreateEditProductDialogComponent extends AppComponentBase implements OnInit {
    @Output() onSave = new EventEmitter<any>();

    saving = false;
    product = new CreateEditProductDto();
    id?: number;
    productTypes: DropdownDto[] = [];

    // Expose enum mapper to the template
    readonly ProductType = AppProductType;

    constructor(
        injector: Injector,
        public _productService: ProductsServiceProxy,
        public bsModalRef: BsModalRef,
        private cd: ChangeDetectorRef,
    ) {
        super(injector);
    }

    public ngOnInit(): void {
        this.getProductTypes();

        if (this.id) {
            this.getProduct(this.id);
        }
    }

    public save(): void {
        this.saving = true;

        this._productService.createOrEditProduct(this.product).subscribe({
            next: () => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.bsModalRef.hide();
                this.onSave.emit();
                this.saving = false;
            },
            error: () => {
                this.saving = false;
            },
        });
    }

    private getProductTypes(): void {
        this._productService.getProductTypeDropdown().subscribe({
            next: (result: DropdownDto[]) => {
                this.productTypes = result;
                this.cd.markForCheck();
            },
            error: () => {
                this.notify.error(this.l('ErrorWhileLoadingProductTypes'));
            },
        });
    }

    private getProduct(id: number): void {
        this._productService.getProductById(id).subscribe({
            next: (result) => {
                this.product = Object.assign(new CreateEditProductDto(), result);
                this.cd.markForCheck();
            },
            error: () => {
                this.notify.error(this.l('ErrorWhileLoadingProduct'));
            },
        });
    }
}

