import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'primeng/api';
import { BrandsRoutingModule } from '@app/brands/brands-routing.module';
import { BrandsComponent } from '@app/brands/brands.component';

@NgModule({
    imports: [SharedModule, CommonModule, BrandsRoutingModule, BrandsComponent]
})
export class BrandsModule {}
