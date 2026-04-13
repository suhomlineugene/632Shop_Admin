import { FormsModule } from '@angular/forms';
import { AbpModalHeaderComponent } from '../../../shared/components/modal/abp-modal-header.component';
import { AbpValidationSummaryComponent } from '../../../shared/components/validation/abp-validation.summary.component';
import { LocalizePipe } from '../../../shared/pipes/localize.pipe';
import { AppComponentBase } from '../../../shared/app-component-base';
import { ChangeDetectorRef, Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { CategoriesServiceProxy, CategoryDto, UserServiceProxy } from '../../../shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AbpModalFooterComponent } from '@shared/components/modal/abp-modal-footer.component';

@Component({
    templateUrl: './create-edit-category-dialog.component.html',
    standalone: true,
    imports: [
        FormsModule,
        AbpModalHeaderComponent,
        AbpValidationSummaryComponent,
        LocalizePipe,
        AbpModalFooterComponent,
    ],
})
export class CreateEditCategoryDialogComponent extends AppComponentBase implements OnInit {
    @Output() onSave = new EventEmitter<any>();

    saving = false;
    category = new CategoryDto();
    id?: number;

    constructor(
        injector: Injector,
        public _categoryService: CategoriesServiceProxy,
        public bsModalRef: BsModalRef,
        private cd: ChangeDetectorRef,
    ) {
        super(injector);
    }

    public ngOnInit(): void {
        if (this.id) {
            this._categoryService.getCategoryForEdit(this.id).subscribe((result) => {
                this.category = result;
                this.cd.detectChanges();
            });
        }
    }

    public save(): void {
        this.saving = true;

        this._categoryService.createEditCategory(this.category).subscribe({
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
