import { ChangeDetectorRef, Component, Injector, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { OilSpecServiceProxy, OilSpecDto } from '@shared/service-proxies/service-proxies';
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
    CreateEditOilSpecDialogComponent,
} from '@app/oil-specs/create-edit-oil-spec-modal/create-edit-oil-spec-dialog.component';

@Component({
    templateUrl: './oil-specs.component.html',
    styleUrls: ['./oil-specs.component.scss'],
    animations: [appModuleAnimation()],
    standalone: true,
    imports: [CommonModule, FormsModule, TableModule, PaginatorModule, LocalizePipe, BusyIfDirective, BsDropdownModule],
})
export class OilSpecsComponent extends AppComponentBase implements OnInit {
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;

    allOilSpecs: OilSpecDto[] = [];

    constructor(
        injector: Injector,
        private _oilSpecService: OilSpecServiceProxy,
        private _modalService: BsModalService,
        private cd: ChangeDetectorRef,
    ) {
        super(injector);
    }

    public ngOnInit(): void {
        this.getOilSpecs();
    }

    public getOilSpecs(event?: TableLazyLoadEvent) {
        if (event && this.primengTableHelper.shouldResetPaging(event)) {
            if (this.paginator) {
                this.paginator.changePage(0);
            }

            if (this.primengTableHelper.records && this.primengTableHelper.records.length > 0) {
                return;
            }
        }

        this.primengTableHelper.showLoadingIndicator();

        this._oilSpecService.getAllOilSpecs()
            .pipe(finalize(() => {
                // Defer state changes to next microtask to avoid ExpressionChangedAfterItHasBeenCheckedError
                Promise.resolve().then(() => {
                    this.primengTableHelper.hideLoadingIndicator();
                    this.cd.markForCheck();
                });
            }))
            .subscribe(res => {
                this.allOilSpecs = res;
                this.primengTableHelper.totalRecordsCount = res.length;

                // Apply client-side pagination
                if (event) {
                    const first = event.first || 0;
                    const rows = event.rows || this.primengTableHelper.defaultRecordsCountPerPage;
                    this.primengTableHelper.records = res.slice(first, first + rows);
                } else {
                    // Initial load
                    const defaultPageSize = this.primengTableHelper.defaultRecordsCountPerPage;
                    this.primengTableHelper.records = res.slice(0, defaultPageSize);
                }
            });
    }

    public deleteOilSpec(oilSpec: OilSpecDto): void {
        this.message.confirm(
            this.l('OilSpecDeleteWarningMessage', oilSpec.viscosityGrade),
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this._oilSpecService.deleteOilSpec(oilSpec.id)
                        .subscribe(() => {
                            this.reloadPage();
                            this.notify.success(this.l('SuccessfullyDeleted'));
                        });
                }
            },
        );
    }

    public createOrEditOilSpec(oilSpec?: OilSpecDto) {
        let createOrEditOilSpecDialog: BsModalRef;
        createOrEditOilSpecDialog = this._modalService.show(CreateEditOilSpecDialogComponent, {
            class: 'modal-lg',
            initialState: {
                id: oilSpec?.id, // Use optional chaining to safely access id
            },
        });

        if (createOrEditOilSpecDialog.content && createOrEditOilSpecDialog.content.onSave) {
            createOrEditOilSpecDialog.content.onSave.subscribe(() => {
                this.reloadPage();
            });
        }
    }

    private reloadPage(): void {
        if (this.paginator) {
            this.paginator.changePage(this.paginator.getPage());
        } else {
            this.getOilSpecs();
        }
    }
}

