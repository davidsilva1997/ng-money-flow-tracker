import { Injectable } from "@angular/core";
import { Subject, catchError, map, throwError } from "rxjs";
import { HttpClient } from "@angular/common/http";

import { environment } from "../../../environments/environment.development";
import { Category } from "./category.model";

@Injectable({ providedIn: 'root' })
export class CategoryService {
    categoriesChangedSubject = new Subject<void>();

    constructor(private http: HttpClient) { }

    fetch() {
        return this.http
            .get<Category[]>(
                `${environment.firebaseAPI}${environment.firebaseCategories}.json`
            )
            .pipe(
                catchError(error => {
                    return throwError(() => {
                        new Error(error);
                    });
                }),
                map(response => {
                    if (!response) {
                        return [];
                    }

                    return Object.keys(response).map(key => {
                        return { id: key, ...response[key] };
                    });
                })
            );
    }

    post(category: Category) {
        return this.http
            .post<Category>(
                `${environment.firebaseAPI}${environment.firebaseCategories}.json`,
                category
            )
            .pipe(
                catchError(error => {
                    return throwError(() => {
                        new Error(error);
                    });
                })
            )
    }

    put(category: Category) {
        return this.http
            .put<Category>(
                `${environment.firebaseAPI}${environment.firebaseCategories}/${category.id}.json`,
                category
            )
            .pipe(
                catchError(error => {
                    return throwError(() => {
                        new Error(error);
                    });
                })
            )
    }

    delete(id: string) {
        return this.http
            .delete<Category>(
                `${environment.firebaseAPI}${environment.firebaseCategories}/${id}.json`
            )
            .pipe(
                catchError(error => {
                    return throwError(() => {
                        new Error(error);
                    });
                })
            )
    }
}