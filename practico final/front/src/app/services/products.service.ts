import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import {
  CreateProductDto,
  UpdateProductDto,
  Product,
  QueryProductsDto,
  PaginatedProducts,
} from '../models/product';
import { environment } from '../../environments/environment';

interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private readonly api = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  findAll(query?: QueryProductsDto): Observable<PaginatedProducts> {
    let params = new HttpParams();
    if (query) {
      if (query.name) params = params.set('name', query.name);
      if (query.sortBy) params = params.set('sortBy', query.sortBy);
      if (query.order) params = params.set('order', query.order);
      if (query.page) params = params.set('page', query.page);
      if (query.limit) params = params.set('limit', query.limit);
    }
    return this.http.get<PaginatedResponse<Product>>(this.api, { params }).pipe(
      map((res) => ({
        items: res.items,
        total: res.total,
        page: res.page,
        limit: res.limit,
      })),
    );
  }

  findOne(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.api}/${id}`);
  }

  create(dto: CreateProductDto): Observable<Product> {
    return this.http.post<Product>(this.api, dto);
  }

  update(id: number, dto: UpdateProductDto): Observable<Product> {
    return this.http.put<Product>(`${this.api}/${id}`, dto);
  }

  remove(id: number): Observable<Product> {
    return this.http.delete<Product>(`${this.api}/${id}`);
  }
}
