import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { ApprovalStandardsRoutingModule } from './approval-standards-routing.module';
import { CommonModule } from '@angular/common';
import { ApprovalStandardsComponent } from './approval-standards.component';
import {
    CreateEditApprovalStandardDialogComponent,
} from '@app/approval-standards/create-edit-approval-standard-modal/create-edit-approval-standard-dialog.component';

@NgModule({
    imports: [SharedModule, ApprovalStandardsRoutingModule, CommonModule, ApprovalStandardsComponent, CreateEditApprovalStandardDialogComponent],

})
export class ApprovalStandardsModule {
}

