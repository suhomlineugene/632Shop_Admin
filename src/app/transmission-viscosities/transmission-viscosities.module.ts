import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { TransmissionViscositiesRoutingModule } from './transmission-viscosities-routing.module';
import { CommonModule } from '@angular/common';
import { TransmissionViscositiesComponent } from './transmission-viscosities.component';
import { CreateEditTransmissionViscosityDialogComponent } from '@app/transmission-viscosities/create-edit-transmission-viscosities/create-edit-transmission-viscosities-dialog.component';

@NgModule({
    imports: [
        SharedModule,
        TransmissionViscositiesRoutingModule,
        CommonModule,
        TransmissionViscositiesComponent,
        CreateEditTransmissionViscosityDialogComponent,
    ],
})
export class TransmissionViscositiesModule {
}
