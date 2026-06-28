import { FormsModule } from '@angular/forms';
import { AbpModalHeaderComponent } from '@shared/components/modal/abp-modal-header.component';
import { AbpValidationSummaryComponent } from '@shared/components/validation/abp-validation.summary.component';
import { LocalizePipe } from '@shared/pipes/localize.pipe';
import { AppComponentBase } from '@shared/app-component-base';
import { ChangeDetectorRef, Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import {
    ApprovalsServiceProxy,
    CreateEditOilApprovalDto,
    StandardTypeDropdownDto,
} from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AbpModalFooterComponent } from '@shared/components/modal/abp-modal-footer.component';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';

@Component({
    templateUrl: './create-edit-oil-approval-dialog.component.html',
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
export class CreateEditOilApprovalDialogComponent extends AppComponentBase implements OnInit {
    @Output() onSave = new EventEmitter<any>();

    saving = false;
    approval = new CreateEditOilApprovalDto();
    id?: number;
    standardTypes: StandardTypeDropdownDto[] = [];

    constructor(
        injector: Injector,
        public _approvalsService: ApprovalsServiceProxy,
        public bsModalRef: BsModalRef,
        private cd: ChangeDetectorRef,
    ) {
        super(injector);
    }

    public ngOnInit(): void {
        this.getStandardTypes();

        if (this.id) {
            this.getOilApproval(this.id);
        }
    }

    public save(): void {
        this.saving = true;

        this._approvalsService.createOrEditOilApproval(this.approval).subscribe({
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

    private getStandardTypes(): void {
        this._approvalsService.getStandardTypeDropdown().subscribe({
            next: (result: StandardTypeDropdownDto[]) => {
                this.standardTypes = result;
                this.cd.markForCheck();
            },
            error: () => {
                this.notify.error(this.l('ErrorWhileLoadingStandardTypes'));
            },
        });
    }

    private getOilApproval(id: number): void {
        this._approvalsService.getOilApprovalById(id).subscribe({
            next: (result) => {
                this.approval = Object.assign(new CreateEditOilApprovalDto(), result);
                this.cd.markForCheck();
            },
            error: () => {
                this.notify.error(this.l('ErrorWhileLoadingOilApproval'));
            },
        });
    }
}

