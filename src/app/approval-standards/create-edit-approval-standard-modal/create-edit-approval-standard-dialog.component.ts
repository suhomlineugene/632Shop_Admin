import { FormsModule } from '@angular/forms';
import { AbpModalHeaderComponent } from '../../../shared/components/modal/abp-modal-header.component';
import { AbpValidationSummaryComponent } from '../../../shared/components/validation/abp-validation.summary.component';
import { LocalizePipe } from '../../../shared/pipes/localize.pipe';
import { AppComponentBase } from '../../../shared/app-component-base';
import { ChangeDetectorRef, Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import {
    ApprovalStandardDto,
    OilSpecServiceProxy,
} from '../../../shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AbpModalFooterComponent } from '@shared/components/modal/abp-modal-footer.component';

@Component({
    templateUrl: './create-edit-approval-standard-dialog.component.html',
    standalone: true,
    imports: [
        FormsModule,
        AbpModalHeaderComponent,
        AbpValidationSummaryComponent,
        LocalizePipe,
        AbpModalFooterComponent,
    ],
})
export class CreateEditApprovalStandardDialogComponent extends AppComponentBase implements OnInit {
    @Output() onSave = new EventEmitter<any>();

    saving = false;
    approvalStandard = new ApprovalStandardDto();
    id?: number;

    constructor(
        injector: Injector,
        public _approvalStandardService: OilSpecServiceProxy,
        public bsModalRef: BsModalRef,
        private cd: ChangeDetectorRef,
    ) {
        super(injector);
    }

    public ngOnInit(): void {
        if (this.id) {
            this._approvalStandardService.getApprovalStandard(this.id).subscribe((result) => {
                this.approvalStandard = result;
                this.cd.detectChanges();
            });
        }
    }

    public save(): void {
        this.saving = true;

        this._approvalStandardService.createEditApprovalStandard(this.approvalStandard).subscribe({
            next: () => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.bsModalRef.hide();
                this.onSave.emit();
                this.saving = false;
            },
            error: () => {
            },
        });
    }
}

