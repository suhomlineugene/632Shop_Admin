import { Directive, ElementRef, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Directive({
    selector: '[appDropdownPosition]',
    standalone: true,
})
export class DropdownPositionDirective implements OnInit, OnDestroy {
    private positionSubject = new Subject<void>();
    private destroy$ = new Subject<void>();

    constructor(private el: ElementRef) {}

    ngOnInit(): void {
        this.positionSubject
            .pipe(debounceTime(50))
            .subscribe(() => this.positionDropdown());

        // Watch for dropdown changes
        this.observeDropdownChanges();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private observeDropdownChanges(): void {
        const observer = new MutationObserver(() => {
            this.positionSubject.next();
        });

        observer.observe(this.el.nativeElement, {
            attributes: true,
            attributeFilter: ['class'],
            subtree: true,
        });

        this.destroy$.subscribe(() => observer.disconnect());
    }

    private positionDropdown(): void {
        const dropdownMenu = this.el.nativeElement.querySelector('.dropdown-menu');
        const button = this.el.nativeElement.querySelector('[dropdownToggle]');

        if (!dropdownMenu || !button) return;

        // Only position if dropdown is visible
        if (!dropdownMenu.classList.contains('show')) return;

        const buttonRect = button.getBoundingClientRect();
        const menuHeight = dropdownMenu.offsetHeight || 100;
        const spaceBelow = window.innerHeight - buttonRect.bottom;
        const spaceAbove = buttonRect.top;

        // Position the dropdown
        if (spaceBelow < menuHeight + 10 && spaceAbove > menuHeight + 10) {
            // Show above if there's enough space
            dropdownMenu.style.top = (buttonRect.top - menuHeight - 5) + 'px';
        } else {
            // Show below (default)
            dropdownMenu.style.top = (buttonRect.bottom + 5) + 'px';
        }

        dropdownMenu.style.left = buttonRect.left + 'px';
    }

    @HostListener('window:resize')
    onResize(): void {
        this.positionSubject.next();
    }
}

