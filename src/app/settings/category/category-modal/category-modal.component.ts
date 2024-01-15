import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, Renderer2, SimpleChanges } from '@angular/core';

import { Category } from '../category.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { CategoryService } from '../category.service';
import { ToastService } from '../../../shared/toast/toast.service';

@Component({
  selector: 'app-category-modal',
  templateUrl: './category-modal.component.html',
  styleUrl: './category-modal.component.css'
})
export class CategoryModalComponent implements OnInit, OnChanges {
  @Input('modalId') modalId: string;
  @Input('category') category: Category;
  modalTitle: string;
  categoryForm: FormGroup;
  categoriesDescriptionSubject: BehaviorSubject<string[]>;

  constructor(private categoryService: CategoryService, private toastService: ToastService, private renderer: Renderer2, private elementRef: ElementRef) { }

  ngOnInit(): void {
    this.modalTitle = (this.category) ? 'Update Category' : 'New Category';
    this.categoryForm = new FormGroup({
      'description': new FormControl('', [Validators.required, this.validateCategories.bind(this)])
    });

    this.categoriesDescriptionSubject = new BehaviorSubject<string[]>([]);

    this.categoryService.categoriesChangedSubject.subscribe(() => {
      this.categoryService.fetch().subscribe(categories => {
        this.categoriesDescriptionSubject.next(categories.map(map => map.description.toUpperCase()));
      });
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.category) {
      if (changes.category.currentValue) {
        this.modalTitle = 'Update Category';
        this.categoryForm.patchValue({
          'description': changes.category.currentValue.description
        });
      }
      else {
        this.modalTitle = 'New Category';
        if (this.categoryForm) {
          this.categoryForm.reset();
        }
      }
    }
  }

  onSubmit() {
    if (!this.categoryForm.valid) {
      return;
    }

    const description = this.categoryForm.value['description'];

    if (this.category) {
      this.category.description = description;
      this.categoryService.put(this.category).subscribe({
        next: () => {
          this.toastService.createSuccess('Category', 'Category updated successfully.');
          this.categoryService.categoriesChangedSubject.next();
        },
        error: (error) => {
          this.toastService.createError('Category', 'Error updating category.');
        }
      });
    }
    else {
      const newCategory = new Category(null, description);

      this.categoryService.post(newCategory).subscribe({
        next: () => {
          this.toastService.createSuccess('Category', 'New category created successfully.');
          this.categoryService.categoriesChangedSubject.next();
        },
        error: (error) => {
          this.toastService.createError('Category', 'Error creating the new category.');
        }
      });
    }

    this.categoryForm.reset();
    this.onCloseModal();
  }

  onCloseModal() {
    const modalElement = this.elementRef.nativeElement.querySelector('#' + this.modalId);

    if (!modalElement) {
      return;
    }

    this.renderer.setStyle(modalElement, 'display', 'none');
    this.categoryForm.reset();
  }

  validateCategories(control: FormControl): { [s: string]: boolean } {
    const description = control.value ? control.value.toUpperCase() : control.value;

    if (this.categoriesDescriptionSubject && (this.categoriesDescriptionSubject.value.indexOf(description) !== -1)) {
      return { 'categoryAlreadyExists': true }
    }

    return null;
  }
}