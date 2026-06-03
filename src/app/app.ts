import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService, Task } from './services/task';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit{

  private taskService = inject(TaskService);
  protected readonly title = signal('todo-list');
  tasks = signal<Task[]>([]);

  // Campos do formulário
  newTitle = '';
  newDescription = '';
  newDueDate = '';

  ngOnInit() {
    this.carregarTarefas();
  }

  carregarTarefas(): void {
    this.taskService.findAll().subscribe({
      next: (dados) => this.tasks.set(dados),
      error: (erro) => console.error('Erro ao buscar tarefas:', erro)
    });
  }

  adicionarTarefa(): void {
    if (!this.newTitle.trim()) return;

    const novaTarefa: Task = {
      title: this.newTitle,
      description: this.newDescription,
      dueDate: this.newDueDate ? this.newDueDate : undefined,
      completed: false
    };

    this.taskService.insert(novaTarefa).subscribe({
      next: () => {
        this.newTitle = '';
        this.newDescription = '';
        this.newDueDate = '';
        this.carregarTarefas(); // Atualiza a lista
      }
    });
  }

  alternarStatus(id: number | undefined): void {
    if (!id) return;
    this.taskService.toggleStatus(id).subscribe({
      next: () => this.carregarTarefas()
    });
  }

  excluirTarefa(id: number | undefined): void {
    if (!id) return;
    this.taskService.delete(id).subscribe({
      next: () => this.carregarTarefas()
    });
  }

}
