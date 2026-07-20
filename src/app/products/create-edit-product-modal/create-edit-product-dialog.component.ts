import { FormsModule } from '@angular/forms';
import { AbpModalHeaderComponent } from '@shared/components/modal/abp-modal-header.component';
import { AbpValidationSummaryComponent } from '@shared/components/validation/abp-validation.summary.component';
import { LocalizePipe } from '@shared/pipes/localize.pipe';
import { AppComponentBase } from '@shared/app-component-base';
import { ChangeDetectorRef, Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import {
    BrandDto,
    BrandsServiceProxy,
    CreateEditProductDto,
    DropdownDto,
    ProductsServiceProxy,
} from '@shared/service-proxies/service-proxies';
import { AppProductType } from '@shared/AppProductType';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AbpModalFooterComponent } from '@shared/components/modal/abp-modal-footer.component';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadComponent } from '@shared/components/file-upload/file-upload.component';

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
        FileUploadComponent,
    ],
})
export class CreateEditProductDialogComponent extends AppComponentBase implements OnInit {
    @Output() onSave = new EventEmitter<any>();

    saving = false;
    product = new CreateEditProductDto();
    id?: number;
    productTypes: DropdownDto[] = [];
    brands: BrandDto[] = [];

    // Expose enum mapper to the template
    readonly ProductType = AppProductType;

    constructor(
        injector: Injector,
        public _productService: ProductsServiceProxy,
        public _brandService: BrandsServiceProxy,
        public bsModalRef: BsModalRef,
        private cd: ChangeDetectorRef,
    ) {
        super(injector);
    }

    public ngOnInit(): void {
        this.getProductTypes();
        this.getBrands();

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

    public onBrandChange(brandId: number | undefined): void {
        const selectedBrand = this.brands.find(b => b.id === brandId);
        if (selectedBrand) {
            this.product.name = selectedBrand.name;
            this.product.brandId = selectedBrand.id;
            this.cd.markForCheck();
        }
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

    private getBrands(): void {
        this._brandService.getAll().subscribe({
            next: (result: BrandDto[]) => {
                this.brands = result || [];
                this.cd.markForCheck();
            },
            error: () => {
                this.notify.error(this.l('ErrorWhileLoadingBrands'));
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
