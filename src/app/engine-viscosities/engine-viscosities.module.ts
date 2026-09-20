import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { EngineViscositiesRoutingModule } from './engine-viscosities-routing.module';
import { CommonModule } from '@angular/common';
import { EngineViscositiesComponent } from './engine-viscosities.component';
import { CreateEditEngineViscosityDialogComponent } from '@app/engine-viscosities/create-edit-engine-viscosities/create-edit-engine-viscosities-dialog.component';

@NgModule({
    imports: [
        SharedModule,
        EngineViscositiesRoutingModule,
        CommonModule,
        EngineViscositiesComponent,
        CreateEditEngineViscosityDialogComponent,
    ],
})
export class EngineViscositiesModule {
}
