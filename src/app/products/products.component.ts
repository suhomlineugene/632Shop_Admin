import { Component, OnInit, ViewChild, ViewChildren, Injector } from '@angular/core';
import { appModuleAnimation } from '../../shared/animations/routerTransition';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Table, TableModule } from 'primeng/table';
import { Paginator, PaginatorModule } from 'primeng/paginator';
import { AppComponentBase } from '@shared/app-component-base';

@Component({
    selector: 'app-products',
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.scss'],
    animations: [appModuleAnimation()],
    standalone: true,
    imports: [CommonModule, FormsModule, TableModule, PaginatorModule]
})
export class ProductsComponent extends AppComponentBase implements OnInit {
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;

    constructor(injector: Injector) {
        super(injector);
    }

    ngOnInit(): void {
        throw new Error('Method not implemented.');
    }
}
