import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { CommonModule } from '@angular/common';
import { HomePageRoutingModule } from './home-page-routing.module';
import { HomePageBannersListComponent } from './home-page-banners-list/home-page-banners-list.component';
import { CreateEditHomePageBannerComponent } from './create-edit-home-page-banner/create-edit-home-page-banner.component';

@NgModule({
    imports: [
        SharedModule,
        CommonModule,
        HomePageRoutingModule,
        HomePageBannersListComponent,
        CreateEditHomePageBannerComponent,
    ],
})
export class HomePageModule {}

