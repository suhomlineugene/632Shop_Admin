import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { CategoriesRoutingModule } from './categories-routing.module';
import { CommonModule } from '@angular/common';
import { CategoriesComponent } from './categories.component';
import {
    CreateEditCategoryDialogComponent,
} from '@app/categories/create-edit-category-modal/create-edit-category-dialog.component';

@NgModule({
    imports: [SharedModule, CategoriesRoutingModule, CommonModule, CategoriesComponent, CreateEditCategoryDialogComponent],

})
export class CategoriesModule {
}
