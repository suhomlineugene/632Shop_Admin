import { ChangeDetectorRef, Component, Injector, ViewChild, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { CategoriesServiceProxy, CategoryDto } from '@shared/service-proxies/service-proxies';
import { FormsModule } from '@angular/forms';
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { Paginator, PaginatorModule } from 'primeng/paginator';
import { LocalizePipe } from '@shared/pipes/localize.pipe';
import { AppComponentBase } from '@shared/app-component-base';
import { finalize } from 'rxjs/operators';
import { BusyIfDirective } from '@shared/utils/busy-if.derictive';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import {
    CreateEditCategoryDialogComponent,
} from '@app/categories/create-edit-category-modal/create-edit-category-dialog.component';

@Component({
    templateUrl: './categories.component.html',
    styleUrls: ['./categories.component.scss'],
    animations: [appModuleAnimation()],
    standalone: true,
    imports: [CommonModule, FormsModule, TableModule, PaginatorModule, LocalizePipe, BusyIfDirective, BsDropdownModule],
})
export class CategoriesComponent extends AppComponentBase implements OnInit {
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;

    categories: CategoryDto[] = [];

    constructor(
        injector: Injector,
        private _categoryService: CategoriesServiceProxy,
        private _modalService: BsModalService,
        private cd: ChangeDetectorRef,
    ) {
        super(injector);
    }

    public ngOnInit(): void {
        this.getCategories();
    }

    public getCategories(event?: TableLazyLoadEvent) {
        if (event && this.primengTableHelper.shouldResetPaging(event)) {
            if (this.paginator) {
                this.paginator.changePage(0);
            }

            if (this.primengTableHelper.records && this.primengTableHelper.records.length > 0) {
                return;
            }
        }

        this.primengTableHelper.showLoadingIndicator();

        this._categoryService.getCategoriesList()
            .pipe(finalize(() => {
                // Defer state changes to next microtask to avoid ExpressionChangedAfterItHasBeenCheckedError
                Promise.resolve().then(() => {
                    this.primengTableHelper.hideLoadingIndicator();
                    this.cd.markForCheck();
                });
            }))
            .subscribe(res => {
                this.primengTableHelper.totalRecordsCount = res.length;
                this.primengTableHelper.records = res;
            });
    }

    public deleteCategory(category: CategoryDto): void {
        this.message.confirm(
            this.l('CategoryDeleteWarningMessage', category.name),
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this._categoryService.deleteCategory(category.id)
                        .subscribe(() => {
                            this.reloadPage();
                            this.notify.success(this.l('SuccessfullyDeleted'));
                        });
                }
            },
        );
    }

    public createUserOrEditCategory(category?: CategoryDto) {
        let createOrEditCategoryDialog: BsModalRef;
        createOrEditCategoryDialog = this._modalService.show(CreateEditCategoryDialogComponent, {
            class: 'modal-lg',
            initialState: {
                id: category?.id, // Use optional chaining to safely access id
            },
        });

        if (createOrEditCategoryDialog.content && createOrEditCategoryDialog.content.onSave) {
            createOrEditCategoryDialog.content.onSave.subscribe(() => {
                this.reloadPage();
            });
        }
    }

    private reloadPage(): void {
        if (this.paginator) {
            this.paginator.changePage(this.paginator.getPage());
        } else {
            this.getCategories();
        }
    }
}
