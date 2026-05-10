import { ChangeDetectorRef, Component, Injector, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import {
    ManufacturerApprovalDto,
    OilSpecServiceProxy,
} from '@shared/service-proxies/service-proxies';
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
    CreateEditManufacturerApprovalDialogComponent,
} from '@app/manufacturer-approvals/create-edit-manufacturer-approval-modal/create-edit-manufacturer-approval-dialog.component';

@Component({
    templateUrl: './manufacturer-approvals.component.html',
    styleUrls: ['./manufacturer-approvals.component.scss'],
    animations: [appModuleAnimation()],
    standalone: true,
    imports: [CommonModule, FormsModule, TableModule, PaginatorModule, LocalizePipe, BusyIfDirective, BsDropdownModule],
})
export class ManufacturerApprovalsComponent extends AppComponentBase implements OnInit {
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;

    allManufacturerApprovals: ManufacturerApprovalDto[] = [];

    constructor(
        injector: Injector,
        private _manufacturerApprovalService: OilSpecServiceProxy,
        private _modalService: BsModalService,
        private cd: ChangeDetectorRef,
    ) {
        super(injector);
    }

    public ngOnInit(): void {
        this.getManufacturerApprovals();
    }

    public getManufacturerApprovals(event?: TableLazyLoadEvent) {
        if (event && this.primengTableHelper.shouldResetPaging(event)) {
            if (this.paginator) {
                this.paginator.changePage(0);
            }

            if (this.primengTableHelper.records && this.primengTableHelper.records.length > 0) {
                return;
            }
        }

        this.primengTableHelper.showLoadingIndicator();

        this._manufacturerApprovalService.getAllManufacturerApprovals()
            .pipe(finalize(() => {
                Promise.resolve().then(() => {
                    this.primengTableHelper.hideLoadingIndicator();
                    this.cd.markForCheck();
                });
            }))
            .subscribe(res => {
                this.allManufacturerApprovals = res;
                this.primengTableHelper.totalRecordsCount = res.length;

                if (event) {
                    const first = event.first || 0;
                    const rows = event.rows || this.primengTableHelper.defaultRecordsCountPerPage;
                    this.primengTableHelper.records = res.slice(first, first + rows);
                } else {
                    const defaultPageSize = this.primengTableHelper.defaultRecordsCountPerPage;
                    this.primengTableHelper.records = res.slice(0, defaultPageSize);
                }
            });
    }

    public deleteManufacturerApproval(manufacturerApproval: ManufacturerApprovalDto): void {
        this.message.confirm(
            this.l('ManufacturerApprovalDeleteWarningMessage', manufacturerApproval.code),
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this._manufacturerApprovalService.deleteManufacturerApproval(manufacturerApproval.id)
                        .subscribe(() => {
                            this.reloadPage();
                            this.notify.success(this.l('SuccessfullyDeleted'));
                        });
                }
            },
        );
    }

    public createOrEditManufacturerApproval(manufacturerApproval?: ManufacturerApprovalDto) {
        let createOrEditDialog: BsModalRef;
        createOrEditDialog = this._modalService.show(CreateEditManufacturerApprovalDialogComponent, {
            class: 'modal-lg',
            initialState: {
                id: manufacturerApproval?.id,
            },
        });

        if (createOrEditDialog.content && createOrEditDialog.content.onSave) {
            createOrEditDialog.content.onSave.subscribe(() => {
                this.reloadPage();
            });
        }
    }

    private reloadPage(): void {
        if (this.paginator) {
            this.paginator.changePage(this.paginator.getPage());
        } else {
            this.getManufacturerApprovals();
        }
    }
}


