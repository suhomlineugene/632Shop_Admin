import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { ProductsRoutingModule } from './products-routing.module';
import { CommonModule } from '@angular/common';
import { ProductsComponent } from './products.component';
import {
    CreateEditProductDialogComponent,
} from '@app/products/create-edit-product-modal/create-edit-product-dialog.component';

@NgModule({
    imports: [SharedModule, ProductsRoutingModule, CommonModule, ProductsComponent, CreateEditProductDialogComponent],

})
export class ProductsModule {
}

