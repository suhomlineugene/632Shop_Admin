import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { ManufacturerApprovalsRoutingModule } from './manufacturer-approvals-routing.module';
import { CommonModule } from '@angular/common';
import { ManufacturerApprovalsComponent } from './manufacturer-approvals.component';
import {
    CreateEditManufacturerApprovalDialogComponent,
} from '@app/manufacturer-approvals/create-edit-manufacturer-approval-modal/create-edit-manufacturer-approval-dialog.component';

@NgModule({
    imports: [SharedModule, ManufacturerApprovalsRoutingModule, CommonModule, ManufacturerApprovalsComponent, CreateEditManufacturerApprovalDialogComponent],

})
export class ManufacturerApprovalsModule {
}

