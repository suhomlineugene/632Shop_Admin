import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApprovalStandardsComponent } from './approval-standards.component';

const routes: Routes = [
    {
        path: '',
        component: ApprovalStandardsComponent,
        pathMatch: 'full',
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ApprovalStandardsRoutingModule {
}

