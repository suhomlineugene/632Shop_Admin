import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ProductFileDto } from '../../service-proxies/service-proxies';

@Component({
    selector: 'app-file-upload',
    templateUrl: './file-upload.component.html',
    styleUrls: ['./file-upload.component.scss'],
    standalone: true,
    imports: [CommonModule, ButtonModule],
})
export class FileUploadComponent {
    @Input() multiple = false;
    @Input() label = 'Choose File';
    @Input() accept = 'image/*';
    @Input() icon = 'pi pi-upload';

    @Output() fileChange = new EventEmitter<ProductFileDto>();
    @Output() filesChange = new EventEmitter<ProductFileDto[]>();

    @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

    selectedFiles: { dto: ProductFileDto; size: number }[] = [];

    get selectedFileNames(): string[] {
        return this.selectedFiles.map((f) => f.dto.fileName ?? '');
    }

    chooseFile(): void {
        this.fileInput.nativeElement.click();
    }

    formatSize(bytes: number): string {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }

    onFilesSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        const files: File[] = Array.from(input.files ?? []);
        if (!files.length) {
            return;
        }

        const toBase64 = (file: File): Promise<ProductFileDto> =>
            new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => {
                    const dto = new ProductFileDto();
                    dto.fileBase64 = (reader.result as string).split(',')[1];
                    dto.fileName = file.name;
                    resolve(dto);
                };
                reader.onerror = reject;
            });

        Promise.all(files.map(toBase64)).then((dtos) => {
            const withSize = dtos.map((dto, i) => ({ dto, size: files[i].size }));

            if (this.multiple) {
                this.selectedFiles = [...this.selectedFiles, ...withSize];
                this.filesChange.emit(this.selectedFiles.map((f) => f.dto));
            } else {
                this.selectedFiles = withSize.slice(0, 1);
                this.fileChange.emit(this.selectedFiles[0]?.dto);
            }
        });
    }

    removeFile(index: number): void {
        this.selectedFiles.splice(index, 1);
        this.fileInput.nativeElement.value = '';
        if (this.multiple) {
            this.filesChange.emit(this.selectedFiles.map((f) => f.dto));
        } else {
            this.fileChange.emit(undefined);
        }
    }

    clearSelection(): void {
        this.selectedFiles = [];
        this.fileInput.nativeElement.value = '';
        if (this.multiple) {
            this.filesChange.emit([]);
        } else {
            this.fileChange.emit(undefined);
        }
    }
}
