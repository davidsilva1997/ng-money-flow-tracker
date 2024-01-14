import { Component, ElementRef, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { Category } from './category.model';
import { Subscription } from 'rxjs';
import { CategoryService } from './category.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent implements OnInit, OnDestroy {
  categories: Category[];
  categoryToUpdate: Category;
  modalId: string = 'modalCategoryId';
  private categoriesSubscription: Subscription;

  constructor(private categoryService: CategoryService, private renderer: Renderer2, private elementRef: ElementRef) { }


  ngOnInit(): void {
    this.categoryToUpdate = null;
    this.categories = this.categoryService.fetch();

    this.categoriesSubscription = this.categoryService.categoriesChanged.subscribe((categories: Category[]) => {
      this.categories = categories;
    });
  }

  ngOnDestroy(): void {
    this.categoriesSubscription.unsubscribe();
  }

  onAdd() {
    this.categoryToUpdate = null;

    this._openModal();
  }

  onUpdate(category: Category) {
    this.categoryToUpdate = category;

    this._openModal();
  }

  onDelete(id: string) {
    this.categoryService.delete(id);
  }

  private _openModal() {
    const modalElement = this.elementRef.nativeElement.querySelector('#' + this.modalId);

    if (!modalElement) {
      return;
    }

    this.renderer.setStyle(modalElement, 'display', 'block');
  }
}
