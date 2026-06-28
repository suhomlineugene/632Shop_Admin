import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManufacturerApprovalsComponent } from './manufacturer-approvals.component';

const routes: Routes = [
    {
        path: '',
        component: ManufacturerApprovalsComponent,
        pathMatch: 'full',
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ManufacturerApprovalsRoutingModule { }

