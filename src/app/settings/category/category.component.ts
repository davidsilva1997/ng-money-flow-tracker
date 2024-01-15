import { Component, ElementRef, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { Category } from './category.model';
import { BehaviorSubject, Subscription } from 'rxjs';
import { CategoryService } from './category.service';
import { ToastService } from '../../shared/toast/toast.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent implements OnInit, OnDestroy {
  categoriesSubject: BehaviorSubject<Category[]>;
  private categoriesChanged: Subscription;

  categoryToUpdate: Category;
  modalId: string = 'modalCategoryId';

  constructor(private categoryService: CategoryService, private toastService: ToastService , private renderer: Renderer2, private elementRef: ElementRef) { }

  ngOnInit(): void {
    this.categoriesSubject = new BehaviorSubject<Category[]>([]);

    this.categoryToUpdate = null;

    this.categoryService.fetch().subscribe(categories => {
      this.categoriesSubject.next(categories);
    });

    this.categoriesChanged = this.categoryService.categoriesChangedSubject.subscribe(() => {
      this._refreshCategories();
    });
  }

  ngOnDestroy(): void {
    if (this.categoriesSubject) {
      this.categoriesChanged.unsubscribe();
    }
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
    this.categoryService.delete(id).subscribe({
      next: () => {
        this.toastService.createSuccess('Category', 'Category deleted successfully.')
        this._refreshCategories();
      },
      error: (error) => {
        this.toastService.createError('Category', 'Error deleting category.');
      }
    });
  }

  private _openModal() {
    const modalElement = this.elementRef.nativeElement.querySelector('#' + this.modalId);

    if (!modalElement) {
      return;
    }

    this.renderer.setStyle(modalElement, 'display', 'block');
  }

  private _refreshCategories() {
    this.categoryService.fetch().subscribe(categories => {
      this.categoriesSubject.next(categories);
    });
  }
}
