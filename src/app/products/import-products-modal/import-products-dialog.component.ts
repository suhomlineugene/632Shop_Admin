import { Component, EventEmitter, Injector, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppComponentBase } from '../../../shared/app-component-base';
import { ProductsServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AbpModalHeaderComponent } from '@shared/components/modal/abp-modal-header.component';
import { AbpModalFooterComponent } from '@shared/components/modal/abp-modal-footer.component';
import { LocalizePipe } from '@shared/pipes/localize.pipe';
import { FileUploadModule, FileUploadHandlerEvent } from 'primeng/fileupload';

@Component({
    templateUrl: './import-products-dialog.component.html',
    standalone: true,
    imports: [
        CommonModule,
        AbpModalHeaderComponent,
        AbpModalFooterComponent,
        LocalizePipe,
        FileUploadModule,
    ],
})
export class ImportProductsDialogComponent extends AppComponentBase {
    @Output() onSave = new EventEmitter<number>();

    saving = false;

    private _productService = inject(ProductsServiceProxy);

    constructor(
        injector: Injector,
        public bsModalRef: BsModalRef,
    ) {
        super(injector);
    }

    public onUpload(event: FileUploadHandlerEvent): void {
        const file: File = event.files[0];
        if (!file) {
            return;
        }

        this.saving = true;

        this._productService.importProductsFromFile(file.name, file).subscribe({
            next: (importedCount: number) => {
                this.notify.success(this.l('ProductsImportedSuccessfully'));
                this.bsModalRef.hide();
                this.onSave.emit(importedCount);
                this.saving = false;
            },
            error: () => {
                this.notify.error(this.l('ErrorWhileImportingProducts'));
                this.saving = false;
            },
        });
    }
}

