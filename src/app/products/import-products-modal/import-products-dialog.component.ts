import { Component, EventEmitter, Injector, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppComponentBase } from '@shared/app-component-base';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AbpModalHeaderComponent } from '@shared/components/modal/abp-modal-header.component';
import { LocalizePipe } from '@shared/pipes/localize.pipe';
import { FileUploadModule, FileUploadHandlerEvent } from 'primeng/fileupload';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { AppConsts } from '@shared/AppConsts';

@Component({
    templateUrl: './import-products-dialog.component.html',
    standalone: true,
    imports: [
        CommonModule,
        AbpModalHeaderComponent,
        LocalizePipe,
        FileUploadModule,
    ],
})
export class ImportProductsDialogComponent extends AppComponentBase {
    @Output() onSave = new EventEmitter<number>();

    saving = false;

    private _http = inject(HttpClient);

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

        const reader = new FileReader();

        reader.onload = () => {
            const base64 = btoa(reader.result as string);

            const url = `${AppConsts.remoteServiceBaseUrl}/api/services/app/Products/ImportProductsFromFile`;
            const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

            this._http.post<number>(url, { fileBase64: base64, fileName: file.name }, { headers }).subscribe({
                next: (importedCount: number) => {
                    this.notify.success(this.l('ProductsImportedSuccessfully'));
                    this.bsModalRef.hide();
                    this.onSave.emit(importedCount);
                    this.saving = false;
                },
                error: (err: HttpErrorResponse) => {
                    const abpMessage: string =
                        err?.error?.error?.message ||
                        err?.error?.message ||
                        err?.message ||
                        this.l('ErrorWhileImportingProducts');
                    console.error('Import error', err);
                    this.notify.error(abpMessage);
                    this.saving = false;
                },
            });
        };

        reader.onerror = () => {
            console.error('FileReader error', reader.error);
            this.notify.error(this.l('ErrorWhileImportingProducts'));
            this.saving = false;
        };

        reader.readAsBinaryString(file);
    }
}

