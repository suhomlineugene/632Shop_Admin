import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { OilApprovalsRoutingModule } from './oil-approvals-routing.module';
import { CommonModule } from '@angular/common';
import { OilApprovalsComponent } from './oil-approvals.component';
import {
    CreateEditOilApprovalDialogComponent,
} from '@app/oil-approvals/create-edit-oil-approval-modal/create-edit-oil-approval-dialog.component';

@NgModule({
    imports: [
        SharedModule,
        OilApprovalsRoutingModule,
        CommonModule,
        OilApprovalsComponent,
        CreateEditOilApprovalDialogComponent,
    ],
})
export class OilApprovalsModule {
}

