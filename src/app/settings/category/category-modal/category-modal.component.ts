import { Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, Renderer2, SimpleChanges } from '@angular/core';

import { Category } from '../category.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CategoryService } from '../category.service';

@Component({
  selector: 'app-category-modal',
  templateUrl: './category-modal.component.html',
  styleUrl: './category-modal.component.css'
})
export class CategoryModalComponent implements OnInit, OnDestroy, OnChanges {
  @Input('modalId') modalId: string;
  @Input('category') category: Category;
  modalTitle: string = 'New Category';
  categoryForm: FormGroup;
  existingCategoriesDescriptions: string[];
  private categoriesSubscription: Subscription;

  constructor(private categoryService: CategoryService, private renderer: Renderer2, private elementRef: ElementRef) { }

  ngOnInit(): void {
    this.existingCategoriesDescriptions = this.categoryService.fetch().map(map => map.description.toUpperCase());

    this.categoriesSubscription = this.categoryService.categoriesChanged.subscribe((categories: Category[]) => {
      this.existingCategoriesDescriptions = categories.map(map => map.description.toUpperCase());
    });

    this.modalTitle = (this.category) ? 'Update Category' : 'New Category';

    this.categoryForm = new FormGroup({
      'description': new FormControl('', [Validators.required, this.validateCategories.bind(this)])
    });
  }

  ngOnDestroy(): void {
    this.categoriesSubscription.unsubscribe();
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
          this.categoryForm.patchValue({
            'description': changes.category.currentValue.description
          });
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
      this.categoryService.put(this.category);
    }
    else {
      const newPaymentMethod = new Category(null, description);

      this.categoryService.post(newPaymentMethod);
    }

    this.categoryForm.reset();
    this.onCloseModal();
  }

  validateCategories(control: FormControl): { [s: string]: boolean } {
    const description = control.value ? control.value.toUpperCase() : control.value;

    if (this.existingCategoriesDescriptions.indexOf(description) !== -1) {
      return { 'categoryAlreadyExists': true }
    }

    return null;
  }

  onCloseModal() {
    const modalElement = this.elementRef.nativeElement.querySelector('#' + this.modalId);

    if (!modalElement) {
      return;
    }

    this.renderer.setStyle(modalElement, 'display', 'none');
    this.categoryForm.reset();
  }
}
