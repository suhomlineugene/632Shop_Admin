import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OilApprovalsComponent } from './oil-approvals.component';

const routes: Routes = [
    {
        path: '',
        component: OilApprovalsComponent,
        pathMatch: 'full',
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OilApprovalsRoutingModule { }

