import { FormsModule } from '@angular/forms';
import { AbpModalHeaderComponent } from '@shared/components/modal/abp-modal-header.component';
import { AbpValidationSummaryComponent } from '@shared/components/validation/abp-validation.summary.component';
import { LocalizePipe } from '@shared/pipes/localize.pipe';
import { AppComponentBase } from '@shared/app-component-base';
import { ChangeDetectorRef, Component, EventEmitter, inject, Injector, OnInit, Output } from '@angular/core';
import { ViscositiesServiceProxy, CreateEditEngineOilViscosityDto } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AbpModalFooterComponent } from '@shared/components/modal/abp-modal-footer.component';
import { CommonModule } from '@angular/common';

@Component({
    templateUrl: './create-edit-engine-viscosities-dialog.component.html',
    standalone: true,
    imports: [
        FormsModule,
        CommonModule,
        AbpModalHeaderComponent,
        AbpValidationSummaryComponent,
        LocalizePipe,
        AbpModalFooterComponent,
    ],
})
export class CreateEditEngineViscosityDialogComponent extends AppComponentBase implements OnInit {
    @Output() onSave = new EventEmitter<any>();

    public _viscositiesService = inject(ViscositiesServiceProxy);
    public bsModalRef = inject(BsModalRef);
    private cd = inject(ChangeDetectorRef);

    saving = false;
    viscosity = new CreateEditEngineOilViscosityDto();
    id?: number;

    constructor(injector: Injector) {
        super(injector);
    }

    public ngOnInit(): void {
       if(this.id){
           this.getViscosity(this.id);
       }
    }

    public save(): void {
        this.saving = true;

        this._viscositiesService.createEditEngineViscosity(this.viscosity).subscribe({
            next: () => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.bsModalRef.hide();
                this.onSave.emit();
                this.saving = false;
            },
            error: () => {
                this.saving = false;
            },
        });
    }

    public getViscosity(id: number): void {
        this._viscositiesService.getEngineViscosityById(id).subscribe({
            next: (result) => {
                this.viscosity = result;
                this.cd.markForCheck();
            },
            error: () => {
                this.notify.error(this.l('ErrorOccuredWhileLoadingViscosity'));
            },
        });
    }
}
