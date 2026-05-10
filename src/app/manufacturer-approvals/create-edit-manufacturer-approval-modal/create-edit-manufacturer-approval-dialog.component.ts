import { FormsModule } from '@angular/forms';
import { AbpModalHeaderComponent } from '../../../shared/components/modal/abp-modal-header.component';
import { AbpValidationSummaryComponent } from '../../../shared/components/validation/abp-validation.summary.component';
import { LocalizePipe } from '../../../shared/pipes/localize.pipe';
import { AppComponentBase } from '../../../shared/app-component-base';
import { ChangeDetectorRef, Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import {
    ManufacturerApprovalDto,
    OilSpecServiceProxy,
} from '../../../shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AbpModalFooterComponent } from '@shared/components/modal/abp-modal-footer.component';

@Component({
    templateUrl: './create-edit-manufacturer-approval-dialog.component.html',
    standalone: true,
    imports: [
        FormsModule,
        AbpModalHeaderComponent,
        AbpValidationSummaryComponent,
        LocalizePipe,
        AbpModalFooterComponent,
    ],
})
export class CreateEditManufacturerApprovalDialogComponent extends AppComponentBase implements OnInit {
    @Output() onSave = new EventEmitter<any>();

    saving = false;
    manufacturerApproval = new ManufacturerApprovalDto();
    id?: number;

    constructor(
        injector: Injector,
        public _manufacturerApprovalService: OilSpecServiceProxy,
        public bsModalRef: BsModalRef,
        private cd: ChangeDetectorRef,
    ) {
        super(injector);
    }

    public ngOnInit(): void {
        if (this.id) {
            this._manufacturerApprovalService.getManufacturerApproval(this.id).subscribe((result) => {
                this.manufacturerApproval = result;
                this.cd.detectChanges();
            });
        }
    }

    public save(): void {
        this.saving = true;

        this._manufacturerApprovalService.createEditManufacturerApproval(this.manufacturerApproval).subscribe({
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

