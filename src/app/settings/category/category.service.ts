import { Injectable } from "@angular/core";
import { BehaviorSubject, catchError, map, tap, throwError } from "rxjs";
import { HttpClient } from "@angular/common/http";

import { environment } from "../../../environments/environment.development";
import { Category } from "./category.model";
import { ToastService } from "../../shared/toast/toast.service";

@Injectable({ providedIn: 'root' })
export class CategoryService {
    private categories: Category[] = [];
    categoriesChanged = new BehaviorSubject<Category[]>(this.categories);

    constructor(private http: HttpClient, private toastService: ToastService) { }

    fetch() {
        this._fetch();

        return this.categories.slice();
    }

    post(category: Category) {
        const exists = this.categories.find(find => (find.description.toUpperCase() === category.description.toUpperCase()));

        if (exists) {
            this.toastService.createWarning('Category', 'Category already exists!');

            return;
        }

        this._post(category);
    }

    delete(id: string) {
        const exists = this.categories.find(find => (find.id === id));

        if (!exists) {
            this.toastService.createError('Category', 'Error deleting category.');

            return;
        }

        this._delete(id);
    }

    put(category: Category) {
        this._put(category);
    }

    private _fetch() {
        this.http
            .get<Category[]>(
                `${environment.firebaseAPI}${environment.firebaseCategories}.json`
            )
            .pipe(
                catchError(error => {
                    this.toastService.createError('Category', 'Error fetching categories.');

                    return throwError(() => {
                        new Error(error);
                    })
                }),
                map(response => {
                    return Object.keys(response).map(key => {
                        return { id: key, ...response[key] };
                    });
                }),
                tap(categories => {
                    this.categories = categories || [];
                    this.categoriesChanged.next(this.categories.slice());
                })
            )
            .subscribe();
    }

    private _post(category: Category) {
        this.http
            .post<Category>(
                `${environment.firebaseAPI}${environment.firebaseCategories}.json`,
                category
            )
            .pipe(
                catchError(error => {
                    this.toastService.createError('Category', 'Error adding new category.')

                    return throwError(() => {
                        new Error(error);
                    });
                })
            )
            .subscribe(response => {
                this._fetch();
                this.toastService.createSuccess('Category', 'Category created.');
            });
    }

    private _delete(id: string) {
        this.http
            .delete<Category>(
                `${environment.firebaseAPI}${environment.firebaseCategories}/${id}.json`
            )
            .pipe(
                catchError(error => {
                    this.toastService.createError('Category', 'Error deleting category.');

                    return throwError(() => {
                        new Error(error);
                    });
                })
            )
            .subscribe(() => {
                this._fetch();
                this.toastService.createSuccess('Category', 'Category deleted.');
            });
    }

    private _put(category: Category) {
        this.http
            .put<Category>(
                `${environment.firebaseAPI}${environment.firebaseCategories}/${category.id}.json`,
                category
            )
            .pipe(
                catchError(error => {
                    this.toastService.createError('Category', 'Error updating category.');

                    return throwError(() => {
                        new Error(error);
                    });
                })
            )
            .subscribe(() => {
                this._fetch();
                this.toastService.createSuccess('Category', 'Category updated.');
            });
    }
}