import { FormsModule } from '@angular/forms';
import { AbpModalHeaderComponent } from '@shared/components/modal/abp-modal-header.component';
import { AbpValidationSummaryComponent } from '@shared/components/validation/abp-validation.summary.component';
import { LocalizePipe } from '@shared/pipes/localize.pipe';
import { AppComponentBase } from '@shared/app-component-base';
import { ChangeDetectorRef, Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import {
    ApprovalsServiceProxy,
    CreateEditManufacturerApprovalDto,
} from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AbpModalFooterComponent } from '@shared/components/modal/abp-modal-footer.component';
import { CommonModule } from '@angular/common';

@Component({
    templateUrl: './create-edit-manufacturer-approval-dialog.component.html',
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
export class CreateEditManufacturerApprovalDialogComponent extends AppComponentBase implements OnInit {
    @Output() onSave = new EventEmitter<any>();

    saving = false;
    approval = new CreateEditManufacturerApprovalDto();
    id?: number;

    constructor(
        injector: Injector,
        public _approvalsService: ApprovalsServiceProxy,
        public bsModalRef: BsModalRef,
        private cd: ChangeDetectorRef,
    ) {
        super(injector);
    }

    public ngOnInit(): void {
        if (this.id) {
            this.getManufacturerApproval(this.id);
        }
    }

    public save(): void {
        this.saving = true;

        this._approvalsService.createOrEditManufacturerApproval(this.approval).subscribe({
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

    private getManufacturerApproval(id: number): void {
        this._approvalsService.getManufacturerApprovalById(id).subscribe({
            next: (result) => {
                this.approval = Object.assign(new CreateEditManufacturerApprovalDto(), result);
                this.cd.markForCheck();
            },
            error: () => {
                this.notify.error(this.l('ErrorWhileLoadingManufacturerApproval'));
            },
        });
    }
}

