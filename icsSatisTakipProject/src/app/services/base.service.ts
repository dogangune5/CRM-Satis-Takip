import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map, timeout } from 'rxjs/operators';
import { environment } from '@app/environments/environment';
import {
  ApiResponse,
  PaginatedResponse,
  ErrorResponse,
} from '../interfaces/api-response.interface';

@Injectable({
  providedIn: 'root',
})
export abstract class BaseService<T> {
  protected abstract endpoint: string;
  protected baseUrl = environment.apiUrl;

  constructor(protected http: HttpClient) {}

  protected handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage: string;

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = environment.errorMessages.network;
    } else {
      // Server-side error
      const serverError = error.error as ErrorResponse;

      switch (error.status) {
        case 401:
          errorMessage = environment.errorMessages.unauthorized;
          break;
        case 404:
          errorMessage = environment.errorMessages.notFound;
          break;
        case 422:
          errorMessage = environment.errorMessages.validation;
          break;
        default:
          errorMessage =
            serverError?.message || environment.errorMessages.default;
      }
    }

    return throwError(() => errorMessage);
  }

  getAll(params?: HttpParams): Observable<T[]> {
    return this.http
      .get<ApiResponse<T[]>>(`${this.baseUrl}/${this.endpoint}`, { params })
      .pipe(
        timeout(environment.apiTimeout),
        map((response) => response.data),
        catchError(this.handleError)
      );
  }

  getAllPaginated(
    page: number = 1,
    pageSize: number = 10,
    params?: HttpParams
  ): Observable<PaginatedResponse<T[]>> {
    const queryParams: Record<string, string> = {
      page: page.toString(),
      pageSize: pageSize.toString(),
    };

    if (params) {
      params.keys().forEach((key) => {
        queryParams[key] = params.get(key) || '';
      });
    }

    const paginationParams = new HttpParams({ fromObject: queryParams });

    return this.http
      .get<PaginatedResponse<T[]>>(`${this.baseUrl}/${this.endpoint}`, {
        params: paginationParams,
      })
      .pipe(timeout(environment.apiTimeout), catchError(this.handleError));
  }

  getById(id: number): Observable<T> {
    return this.http
      .get<ApiResponse<T>>(`${this.baseUrl}/${this.endpoint}/${id}`)
      .pipe(
        timeout(environment.apiTimeout),
        map((response) => response.data),
        catchError(this.handleError)
      );
  }

  create(item: T): Observable<T> {
    return this.http
      .post<ApiResponse<T>>(`${this.baseUrl}/${this.endpoint}`, item)
      .pipe(
        timeout(environment.apiTimeout),
        map((response) => response.data),
        catchError(this.handleError)
      );
  }

  update(id: number, item: T): Observable<T> {
    return this.http
      .put<ApiResponse<T>>(`${this.baseUrl}/${this.endpoint}/${id}`, item)
      .pipe(
        timeout(environment.apiTimeout),
        map((response) => response.data),
        catchError(this.handleError)
      );
  }

  delete(id: number): Observable<void> {
    return this.http
      .delete<ApiResponse<void>>(`${this.baseUrl}/${this.endpoint}/${id}`)
      .pipe(
        timeout(environment.apiTimeout),
        map((response) => response.data),
        catchError(this.handleError)
      );
  }

  protected createQueryParams(params: Record<string, any>): HttpParams {
    let httpParams = new HttpParams();

    Object.keys(params).forEach((key) => {
      if (params[key] !== null && params[key] !== undefined) {
        httpParams = httpParams.set(key, params[key]);
      }
    });

    return httpParams;
  }
}
