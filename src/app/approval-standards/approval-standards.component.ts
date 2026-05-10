import { ChangeDetectorRef, Component, Injector, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import {
    ApprovalStandardDto,
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
    CreateEditApprovalStandardDialogComponent,
} from '@app/approval-standards/create-edit-approval-standard-modal/create-edit-approval-standard-dialog.component';

@Component({
    templateUrl: './approval-standards.component.html',
    styleUrls: ['./approval-standards.component.scss'],
    animations: [appModuleAnimation()],
    standalone: true,
    imports: [CommonModule, FormsModule, TableModule, PaginatorModule, LocalizePipe, BusyIfDirective, BsDropdownModule],
})
export class ApprovalStandardsComponent extends AppComponentBase implements OnInit {
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;

    allApprovalStandards: ApprovalStandardDto[] = [];

    constructor(
        injector: Injector,
        private _approvalStandardService: OilSpecServiceProxy,
        private _modalService: BsModalService,
        private cd: ChangeDetectorRef,
    ) {
        super(injector);
    }

    public ngOnInit(): void {
        this.getApprovalStandards();
    }

    public getApprovalStandards(event?: TableLazyLoadEvent) {
        if (event && this.primengTableHelper.shouldResetPaging(event)) {
            if (this.paginator) {
                this.paginator.changePage(0);
            }

            if (this.primengTableHelper.records && this.primengTableHelper.records.length > 0) {
                return;
            }
        }

        this.primengTableHelper.showLoadingIndicator();

        this._approvalStandardService.getAllApprovalStandards()
            .pipe(finalize(() => {
                Promise.resolve().then(() => {
                    this.primengTableHelper.hideLoadingIndicator();
                    this.cd.markForCheck();
                });
            }))
            .subscribe(res => {
                this.allApprovalStandards = res;
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

    public deleteApprovalStandard(approvalStandard: ApprovalStandardDto): void {
        this.message.confirm(
            this.l('ApprovalStandardDeleteWarningMessage', approvalStandard.code),
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this._approvalStandardService.deleteApprovalStandard(approvalStandard.id)
                        .subscribe(() => {
                            this.reloadPage();
                            this.notify.success(this.l('SuccessfullyDeleted'));
                        });
                }
            },
        );
    }

    public createOrEditApprovalStandard(approvalStandard?: ApprovalStandardDto) {
        let createOrEditDialog: BsModalRef;
        createOrEditDialog = this._modalService.show(CreateEditApprovalStandardDialogComponent, {
            class: 'modal-lg',
            initialState: {
                id: approvalStandard?.id,
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
            this.getApprovalStandards();
        }
    }
}

