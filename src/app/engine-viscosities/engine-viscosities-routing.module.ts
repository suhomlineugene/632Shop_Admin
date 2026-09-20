import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EngineViscositiesComponent } from './engine-viscosities.component';

const routes: Routes = [
    {
        path: '',
        component: EngineViscositiesComponent,
        pathMatch: 'full',
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EngineViscositiesRoutingModule { }
