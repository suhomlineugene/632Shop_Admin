import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { OilSpecsRoutingModule } from './oil-specs-routing.module';
import { CommonModule } from '@angular/common';
import { OilSpecsComponent } from './oil-specs.component';
import {
    CreateEditOilSpecDialogComponent,
} from '@app/oil-specs/create-edit-oil-spec-modal/create-edit-oil-spec-dialog.component';

@NgModule({
    imports: [SharedModule, OilSpecsRoutingModule, CommonModule, OilSpecsComponent, CreateEditOilSpecDialogComponent],

})
export class OilSpecsModule {
}

