import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { CategoriesService } from '../../services/categories.service';
import { AuthService } from '../../services/auth.service';
import { BottomSheet } from '../../shared/bottom-sheet/bottom-sheet';
import { Category } from '../../models/category';
import { ToastService } from '../../shared/toast/toast.service';

@Component({
  selector: 'app-categories',
  imports: [FormsModule, BottomSheet],
  templateUrl: './categories.html',
  styleUrl: './categories.css',
})
export class CategoriesPage implements OnInit {
  private service = inject(CategoriesService);
  auth = inject(AuthService);
  private toast = inject(ToastService);

  categories = signal<Category[]>([]);
  editingCat = signal<Category | null>(null);
  newName = '';
  editName = '';
  loading = signal(false);

  async ngOnInit(): Promise<void> {
    await this.load();
  }

  async load(): Promise<void> {
    this.loading.set(true);
    try {
      const cats = await firstValueFrom(this.service.findAll());
      this.categories.set(cats);
    } catch {
      this.toast.error('Error al cargar categorías');
    } finally {
      this.loading.set(false);
    }
  }

  async create(): Promise<void> {
    if (!this.newName.trim()) return;
    try {
      await firstValueFrom(this.service.create({ name: this.newName }));
      this.newName = '';
      await this.load();
      this.toast.success('Categoría creada');
    } catch (err: any) {
      this.toast.error(err.error?.message || 'Error al crear');
    }
  }

  openEdit(cat: Category): void {
    this.editingCat.set(cat);
    this.editName = cat.name;
  }

  cancelEdit(): void {
    this.editingCat.set(null);
    this.editName = '';
  }

  async saveEdit(): Promise<void> {
    const cat = this.editingCat();
    if (!cat || !this.editName.trim()) return;
    try {
      await firstValueFrom(this.service.update(cat.id, { name: this.editName }));
      this.cancelEdit();
      await this.load();
      this.toast.success('Categoría actualizada');
    } catch (err: any) {
      this.toast.error(err.error?.message || 'Error al actualizar');
    }
  }

  async deleteCategory(id: number): Promise<void> {
    if (!confirm('¿Eliminar categoría?')) return;
    try {
      await firstValueFrom(this.service.remove(id));
      await this.load();
      this.toast.success('Categoría eliminada');
    } catch (err: any) {
      this.toast.error(err.error?.message || 'Error al eliminar');
    }
  }
}
