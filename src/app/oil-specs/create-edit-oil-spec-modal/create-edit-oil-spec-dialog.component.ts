import { FormsModule } from '@angular/forms';
import { AbpModalHeaderComponent } from '../../../shared/components/modal/abp-modal-header.component';
import { AbpValidationSummaryComponent } from '../../../shared/components/validation/abp-validation.summary.component';
import { LocalizePipe } from '../../../shared/pipes/localize.pipe';
import { AppComponentBase } from '../../../shared/app-component-base';
import { ChangeDetectorRef, Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { OilSpecServiceProxy, OilSpecDto, CarSelectorServiceProxy, CarBrandDto, CarModelDto, VehicleVariantDto } from '../../../shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AbpModalFooterComponent } from '@shared/components/modal/abp-modal-footer.component';
import { CommonModule } from '@angular/common';

@Component({
    templateUrl: './create-edit-oil-spec-dialog.component.html',
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
export class CreateEditOilSpecDialogComponent extends AppComponentBase implements OnInit {
    @Output() onSave = new EventEmitter<any>();

    saving = false;
    oilSpec = new OilSpecDto();
    id?: number;

    // Vehicle Selector Properties
    years: number[] = [];
    vehicleMakes: CarBrandDto[] = [];
    vehicleModels: CarModelDto[] = [];
    vehicleVariants: VehicleVariantDto[] = [];

    selectedYear?: number;
    selectedMakeId?: number;
    selectedModelId?: number;
    selectedVariantId?: number;

    isMakesDisabled = true;
    isModelsDisabled = true;
    isVariantsDisabled = true;

    constructor(
        injector: Injector,
        public _oilSpecService: OilSpecServiceProxy,
        public _carSelectorService: CarSelectorServiceProxy,
        public bsModalRef: BsModalRef,
        private cd: ChangeDetectorRef,
    ) {
        super(injector);
    }

    public ngOnInit(): void {
        this.loadYears();

        if (this.id) {
            this._oilSpecService.getOilSpec(this.id).subscribe((result) => {
                this.oilSpec = result;
                this.cd.detectChanges();
                // Populate vehicle selectors if this is an edit
                this.populateVehicleSelectors();
            });
        }
    }

    public loadYears(): void {
        this._carSelectorService.getYears().subscribe({
            next: (years) => {
                this.years = years.sort((a, b) => b - a); // Sort descending
                this.cd.detectChanges();
            },
            error: () => {
                this.notify.error(this.l('FailedToLoadYears'));
            }
        });
    }

    private populateVehicleSelectors(): void {
        if (!this.oilSpec.year || !this.oilSpec.makeId || !this.oilSpec.modelId || !this.oilSpec.vehicleVariantId) {
            return;
        }

        // Set selected year
        this.selectedYear = this.oilSpec.year;
        this.isMakesDisabled = false;

        // Load makes for the year
        this._carSelectorService.getBrands(this.selectedYear).subscribe({
            next: (makes) => {
                this.vehicleMakes = makes;
                this.selectedMakeId = this.oilSpec.makeId;
                this.isModelsDisabled = false;
                this.cd.detectChanges();

                // Load models for the make
                this._carSelectorService.getModelsByBrandId(this.selectedMakeId, this.selectedYear).subscribe({
                    next: (models) => {
                        this.vehicleModels = models;
                        this.selectedModelId = this.oilSpec.modelId;
                        this.isVariantsDisabled = false;
                        this.cd.detectChanges();

                        // Load variants for the model
                        this._carSelectorService.getVariantsByModelId(this.selectedModelId, this.selectedYear).subscribe({
                            next: (variants) => {
                                this.vehicleVariants = variants;
                                this.selectedVariantId = this.oilSpec.vehicleVariantId;
                                this.cd.detectChanges();
                            },
                            error: () => {
                                this.notify.error(this.l('FailedToLoadVehicleVariants'));
                            }
                        });
                    },
                    error: () => {
                        this.notify.error(this.l('FailedToLoadVehicleModels'));
                    }
                });
            },
            error: () => {
                this.notify.error(this.l('FailedToLoadVehicleMakes'));
                this.isMakesDisabled = true;
            }
        });
    }

    public onYearSelected(): void {
        if (!this.selectedYear) {
            this.vehicleMakes = [];
            this.vehicleModels = [];
            this.vehicleVariants = [];
            this.selectedMakeId = undefined;
            this.selectedModelId = undefined;
            this.selectedVariantId = undefined;
            this.isMakesDisabled = true;
            this.isModelsDisabled = true;
            this.isVariantsDisabled = true;
            this.oilSpec.year = 0;
            return;
        }

        this.oilSpec.year = this.selectedYear;
        this.isMakesDisabled = false;
        this.vehicleMakes = [];
        this.vehicleModels = [];
        this.vehicleVariants = [];
        this.selectedMakeId = undefined;
        this.selectedModelId = undefined;
        this.selectedVariantId = undefined;
        this.isModelsDisabled = true;
        this.isVariantsDisabled = true;

        this._carSelectorService.getBrands(this.selectedYear).subscribe({
            next: (makes) => {
                this.vehicleMakes = makes;
                this.cd.detectChanges();
            },
            error: () => {
                this.notify.error(this.l('FailedToLoadVehicleMakes'));
                this.isMakesDisabled = true;
            }
        });
    }

    public onMakeSelected(): void {
        if (!this.selectedMakeId) {
            this.vehicleModels = [];
            this.vehicleVariants = [];
            this.selectedModelId = undefined;
            this.selectedVariantId = undefined;
            this.isModelsDisabled = true;
            this.isVariantsDisabled = true;
            this.oilSpec.makeId = 0;
            return;
        }

        this.oilSpec.makeId = this.selectedMakeId;
        this.isModelsDisabled = false;
        this.vehicleModels = [];
        this.vehicleVariants = [];
        this.selectedModelId = undefined;
        this.selectedVariantId = undefined;
        this.isVariantsDisabled = true;

        this._carSelectorService.getModelsByBrandId(this.selectedMakeId, this.selectedYear).subscribe({
            next: (models) => {
                this.vehicleModels = models;
                this.cd.detectChanges();
            },
            error: () => {
                this.notify.error(this.l('FailedToLoadVehicleModels'));
                this.isModelsDisabled = true;
            }
        });
    }

    public onModelSelected(): void {
        if (!this.selectedModelId) {
            this.vehicleVariants = [];
            this.selectedVariantId = undefined;
            this.isVariantsDisabled = true;
            this.oilSpec.modelId = 0;
            return;
        }

        this.oilSpec.modelId = this.selectedModelId;
        this.isVariantsDisabled = false;
        this.vehicleVariants = [];
        this.selectedVariantId = undefined;

        this._carSelectorService.getVariantsByModelId(this.selectedModelId, this.selectedYear).subscribe({
            next: (variants) => {
                this.vehicleVariants = variants;
                this.cd.detectChanges();
            },
            error: () => {
                this.notify.error(this.l('FailedToLoadVehicleVariants'));
                this.isVariantsDisabled = true;
            }
        });
    }

    public onVariantSelected(): void {
        if (this.selectedVariantId) {
            this.oilSpec.vehicleVariantId = this.selectedVariantId;
        } else {
            this.oilSpec.vehicleVariantId = 0;
        }
    }

    public save(): void {
        this.saving = true;

        this._oilSpecService.createEditOilSpec(this.oilSpec).subscribe({
            next: () => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.bsModalRef.hide();
                this.onSave.emit();
                this.saving = false;
            },
            error: () => {
            },
        });
    }
}

