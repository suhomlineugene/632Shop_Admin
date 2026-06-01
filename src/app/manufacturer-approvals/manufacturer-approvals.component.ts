import { ChangeDetectorRef, Component, Injector, ViewChild, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { ApprovalsServiceProxy, ManufacturerApprovalDto } from '@shared/service-proxies/service-proxies';
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
    imports: [
        CommonModule,
        FormsModule,
        TableModule,
        PaginatorModule,
        LocalizePipe,
        BusyIfDirective,
        BsDropdownModule,
    ],
})
export class ManufacturerApprovalsComponent extends AppComponentBase implements OnInit {
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;

    private readonly _approvalsService = inject(ApprovalsServiceProxy);
    private readonly _modalService = inject(BsModalService);
    private readonly cd = inject(ChangeDetectorRef);

    constructor(injector: Injector) {
        super(injector);
    }

    public ngOnInit(): void {
        this.getManufacturerApprovals();
    }

    public getManufacturerApprovals(event?: TableLazyLoadEvent): void {
        if (event && this.primengTableHelper.shouldResetPaging(event)) {
            if (this.paginator) {
                this.paginator.changePage(0);
            }

            if (this.primengTableHelper.records && this.primengTableHelper.records.length > 0) {
                return;
            }
        }

        this.primengTableHelper.showLoadingIndicator();

        this._approvalsService.getAllManufacturerApprovals()
            .pipe(finalize(() => {
                Promise.resolve().then(() => {
                    this.primengTableHelper.hideLoadingIndicator();
                    this.applyPaging(event);
                });
            }))
            .subscribe(res => {
                this._allRecords = res || [];
            });
    }

    public deleteManufacturerApproval(approval: ManufacturerApprovalDto): void {
        this.message.confirm(
            this.l('ManufacturerApprovalDeleteWarningMessage', approval.name),
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this._approvalsService.deleteManufacturerApproval(approval.id)
                        .subscribe(() => {
                            this.reloadPage();
                            this.notify.success(this.l('SuccessfullyDeleted'));
                        });
                }
            },
        );
    }

    public createOrEditManufacturerApproval(approval?: ManufacturerApprovalDto): void {
        const dialog: BsModalRef = this._modalService.show(CreateEditManufacturerApprovalDialogComponent, {
            class: 'modal-lg',
            initialState: {
                id: approval?.id,
            },
        });

        if (dialog.content && dialog.content.onSave) {
            dialog.content.onSave.subscribe(() => {
                this.reloadPage();
            });
        }
    }

    private _allRecords: ManufacturerApprovalDto[] = [];

    private applyPaging(event?: TableLazyLoadEvent): void {
        this.primengTableHelper.totalRecordsCount = this._allRecords.length;

        const first = event?.first ?? 0;
        const rows = event?.rows ?? this.primengTableHelper.defaultRecordsCountPerPage;
        this.primengTableHelper.records = this._allRecords.slice(first, first + rows);
        this.cd.markForCheck();
    }

    private reloadPage(): void {
        if (this.paginator) {
            this.paginator.changePage(this.paginator.getPage());
        } else {
            this.getManufacturerApprovals();
        }
    }
}

