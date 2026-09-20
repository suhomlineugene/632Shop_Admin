import { ChangeDetectorRef, Component, Injector, ViewChild, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { ViscositiesServiceProxy, TransmissionOilViscosityDto } from '@shared/service-proxies/service-proxies';
import { FormsModule } from '@angular/forms';
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { Paginator, PaginatorModule } from 'primeng/paginator';
import { LocalizePipe } from '@shared/pipes/localize.pipe';
import { AppComponentBase } from '@shared/app-component-base';
import { finalize } from 'rxjs/operators';
import { BusyIfDirective } from '@shared/utils/busy-if.derictive';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CreateEditTransmissionViscosityDialogComponent } from '@app/transmission-viscosities/create-edit-transmission-viscosities/create-edit-transmission-viscosities-dialog.component';

@Component({
    templateUrl: './transmission-viscosities.component.html',
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
export class TransmissionViscositiesComponent extends AppComponentBase implements OnInit {
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;

    private readonly _viscositiesService = inject(ViscositiesServiceProxy);
    private readonly _modalService = inject(BsModalService);
    private readonly cd = inject(ChangeDetectorRef);

    constructor(injector: Injector) {
        super(injector);
    }

    public ngOnInit(): void {
        this.getTransmissionViscosities();
    }

    public getTransmissionViscosities(event?: TableLazyLoadEvent): void {
        if (event && this.primengTableHelper.shouldResetPaging(event)) {
            if (this.paginator) {
                this.paginator.changePage(0);
            }

            if (this.primengTableHelper.records && this.primengTableHelper.records.length > 0) {
                return;
            }
        }

        this.primengTableHelper.showLoadingIndicator();

        this._viscositiesService.getTransmissionViscositiesList()
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

    public deleteTransmissionViscosity(item: TransmissionOilViscosityDto): void {
        this.message.confirm(
            this.l('ViscosityDeleteWarningMessage', item['name'] || ''),
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this._viscositiesService.deleteTransmissionViscosity(item.id).subscribe(() => {
                        this.reloadPage(this.paginator, () => this.getTransmissionViscosities());
                        this.notify.success(this.l('SuccessfullyDeleted'));
                    });
                }
            },
        );
    }

    public createOrEditTransmissionViscosity(item?: TransmissionOilViscosityDto): void {
        const dialog: BsModalRef = this._modalService.show(CreateEditTransmissionViscosityDialogComponent, {
            class: 'modal-lg',
            initialState: {
                id: item?.id,
            },
        });

        if (dialog.content && dialog.content.onSave) {
            dialog.content.onSave.subscribe(() => {
                this.reloadPage(this.paginator, () => this.getTransmissionViscosities());
            });
        }
    }

    private _allRecords: TransmissionOilViscosityDto[] = [];

    private applyPaging(event?: TableLazyLoadEvent): void {
        this.primengTableHelper.totalRecordsCount = this._allRecords.length;

        const first = event?.first ?? 0;
        const rows = event?.rows ?? this.primengTableHelper.defaultRecordsCountPerPage;
        this.primengTableHelper.records = this._allRecords.slice(first, first + rows);
        this.cd.markForCheck();
    }
}
