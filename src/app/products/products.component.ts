import { ChangeDetectorRef, Component, Injector, ViewChild, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { DropdownDto, ProductsServiceProxy, ProductDto } from '@shared/service-proxies/service-proxies';
import { FormsModule } from '@angular/forms';
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { Paginator, PaginatorModule } from 'primeng/paginator';
import { LocalizePipe } from '@shared/pipes/localize.pipe';
import { AppComponentBase } from '@shared/app-component-base';
import { finalize } from 'rxjs/operators';
import { BusyIfDirective } from '@shared/utils/busy-if.derictive';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { DropdownModule } from 'primeng/dropdown';
import {
    CreateEditProductDialogComponent,
} from '@app/products/create-edit-product-modal/create-edit-product-dialog.component';
import {
    ImportProductsDialogComponent,
} from '@app/products/import-products-modal/import-products-dialog.component';

@Component({
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.scss'],
    animations: [appModuleAnimation()],
    standalone: true,
    imports: [CommonModule, FormsModule, TableModule, PaginatorModule, LocalizePipe, BusyIfDirective, BsDropdownModule, DropdownModule],
})
export class ProductsComponent extends AppComponentBase implements OnInit {
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;

    public allProducts: ProductDto[] = [];
    public productTypes: DropdownDto[] = [];
    public selectedProductType: DropdownDto | null = null;

    private readonly _productService = inject(ProductsServiceProxy);
    private readonly _modalService = inject(BsModalService);
    private readonly cd = inject(ChangeDetectorRef);

    constructor(injector: Injector) {
        super(injector);
    }

    public ngOnInit(): void {
        this.getProductTypes();
        this.getProducts();
    }

    public onProductTypeChange(): void {
        this.applyFilters();
    }

    public clearFilter(): void {
        this.selectedProductType = null;
        this.applyFilters();
    }

    public getProducts(event?: TableLazyLoadEvent) {
        if (event && this.primengTableHelper.shouldResetPaging(event)) {
            if (this.paginator) {
                this.paginator.changePage(0);
            }

            if (this.primengTableHelper.records && this.primengTableHelper.records.length > 0) {
                return;
            }
        }

        this.primengTableHelper.showLoadingIndicator();

        this._productService.getAllProducts()
            .pipe(finalize(() => {
                Promise.resolve().then(() => {
                    this.primengTableHelper.hideLoadingIndicator();
                    this.applyFilters(event);
                });
            }))
            .subscribe(res => {
                this.allProducts = res || [];
            });
    }

    public deleteProduct(product: ProductDto): void {
        this.message.confirm(
            this.l('ProductDeleteWarningMessage', product.name),
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this._productService.deleteProduct(product.id)
                        .subscribe(() => {
                            this.reloadPage();
                            this.notify.success(this.l('SuccessfullyDeleted'));
                        });
                }
            },
        );
    }

    public importProducts(): void {
        const importDialog: BsModalRef = this._modalService.show(ImportProductsDialogComponent, {
            class: 'modal-lg',
        });

        if (importDialog.content && importDialog.content.onSave) {
            importDialog.content.onSave.subscribe(() => {
                this.getProducts();
            });
        }
    }

    public createOrEditProduct(product?: ProductDto) {
        let createOrEditProductDialog: BsModalRef;
        createOrEditProductDialog = this._modalService.show(CreateEditProductDialogComponent, {
            class: 'modal-lg',
            initialState: {
                id: product?.id, // Use optional chaining to safely access id
            },
        });

        if (createOrEditProductDialog.content && createOrEditProductDialog.content.onSave) {
            createOrEditProductDialog.content.onSave.subscribe(() => {
                this.reloadPage();
            });
        }
    }

    private getProductTypes(): void {
        this._productService.getProductTypeDropdown().subscribe({
            next: (result: DropdownDto[]) => {
                this.productTypes = result;
                this.cd.markForCheck();
            },
        });
    }

    private applyFilters(event?: TableLazyLoadEvent): void {
        const filtered = this.selectedProductType
            ? this.allProducts.filter(p => p.productType === (this.selectedProductType as DropdownDto).id)
            : this.allProducts;

        this.primengTableHelper.totalRecordsCount = filtered.length;

        const first = (event?.first) ?? 0;
        const rows = (event?.rows) ?? this.primengTableHelper.defaultRecordsCountPerPage;
        this.primengTableHelper.records = filtered.slice(first, first + rows);
        this.cd.markForCheck();
    }

    private reloadPage(): void {
        if (this.paginator) {
            this.paginator.changePage(this.paginator.getPage());
        } else {
            this.getProducts();
        }
    }
}

