import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OilSpecsComponent } from './oil-specs.component';

const routes: Routes = [
    {
        path: '',
        component: OilSpecsComponent,
        pathMatch: 'full',
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class OilSpecsRoutingModule {
}

