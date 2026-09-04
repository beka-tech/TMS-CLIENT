import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { CourseDraft } from '../../models/tms.model';
import { TmsDataService } from '../../services/tms-data.service';

@Component({
  selector: 'tms-courses',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './courses.html',
  styleUrl: './courses.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoursesComponent {
  private readonly document = inject(DOCUMENT);
  private readonly formBuilder = inject(FormBuilder);

  protected readonly data = inject(TmsDataService);
  protected readonly searchQuery = signal('');
  protected readonly addDialogOpen = signal(false);
  protected readonly dialogError = signal('');
  protected readonly feedback = signal('');

  protected readonly courseRows = computed(() => {
    const query = this.searchQuery().trim().toLocaleLowerCase();

    return this.data
      .courses()
      .filter((course) => {
        if (!query) {
          return true;
        }

        return [course.code, course.title, course.instructor, course.description]
          .join(' ')
          .toLocaleLowerCase()
          .includes(query);
      })
      .map((course) => ({
        course,
        students: this.data.enrollmentCount(course.id),
      }));
  });

  protected readonly courseForm = this.formBuilder.nonNullable.group({
    code: [
      '',
      [
        Validators.required,
        Validators.maxLength(16),
        Validators.pattern(/^[A-Za-z]{2,8}-[A-Za-z0-9]{2,8}$/),
      ],
    ],
    title: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    instructor: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(80)]],
    capacity: [25, [Validators.required, Validators.min(1), Validators.max(500)]],
    description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(240)]],
  });

  private readonly dialogPanel = viewChild<ElementRef<HTMLElement>>('dialogPanel');
  private readonly modalFocusTarget = viewChild<ElementRef<HTMLInputElement>>('modalFocusTarget');
  private readonly searchInput = viewChild<ElementRef<HTMLInputElement>>('searchInput');
  private previouslyFocusedElement: HTMLElement | null = null;

  constructor() {
    effect(() => {
      const focusTarget = this.modalFocusTarget()?.nativeElement;
      if (focusTarget) {
        queueMicrotask(() => focusTarget.focus());
      }
    });
  }

  protected updateSearch(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
  }

  protected clearSearch(): void {
    this.searchQuery.set('');
    this.searchInput()?.nativeElement.focus();
  }

  protected openAddDialog(): void {
    const activeElement = this.document.activeElement;
    this.previouslyFocusedElement = activeElement instanceof HTMLElement ? activeElement : null;
    this.dialogError.set('');
    this.courseForm.reset({
      code: '',
      title: '',
      instructor: '',
      capacity: 25,
      description: '',
    });
    this.addDialogOpen.set(true);
  }

  protected closeAddDialog(): void {
    if (!this.addDialogOpen()) {
      return;
    }

    this.addDialogOpen.set(false);
    this.dialogError.set('');
    const focusTarget =
      this.previouslyFocusedElement?.isConnected === true
        ? this.previouslyFocusedElement
        : this.searchInput()?.nativeElement;
    this.previouslyFocusedElement = null;
    queueMicrotask(() => focusTarget?.focus());
  }

  protected addCourse(): void {
    this.dialogError.set('');

    if (this.courseForm.invalid) {
      this.courseForm.markAllAsTouched();
      this.dialogError.set('Check the highlighted fields and try again.');
      return;
    }

    const value = this.courseForm.getRawValue();
    const draft: CourseDraft = {
      code: value.code.trim().toUpperCase(),
      title: value.title.trim(),
      instructor: value.instructor.trim(),
      capacity: Number(value.capacity),
      description: value.description.trim(),
    };

    const duplicate = this.data
      .courses()
      .some((course) => course.code.toLocaleLowerCase() === draft.code.toLocaleLowerCase());
    if (duplicate) {
      this.dialogError.set('A course with that code already exists.');
      return;
    }

    const created = this.data.addCourse(draft);
    this.feedback.set(`${created.code} · ${created.title} was added.`);
    this.closeAddDialog();
  }

  protected capacityPercent(students: number, capacity: number): number {
    return capacity > 0 ? Math.min(100, Math.round((students / capacity) * 100)) : 0;
  }

  protected onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closeAddDialog();
    }
  }

  protected onModalKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.closeAddDialog();
      return;
    }

    if (event.key !== 'Tab') {
      return;
    }

    const panel = this.dialogPanel()?.nativeElement;
    if (!panel) {
      return;
    }

    const focusableElements = Array.from(
      panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    );
    if (focusableElements.length === 0) {
      event.preventDefault();
      panel.focus();
      return;
    }

    const first = focusableElements[0];
    const last = focusableElements[focusableElements.length - 1];
    const activeElement = this.document.activeElement;
    if (event.shiftKey && (activeElement === first || !panel.contains(activeElement))) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (activeElement === last || !panel.contains(activeElement))) {
      event.preventDefault();
      first.focus();
    }
  }
}
