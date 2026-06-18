import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './shared/navbar/navbar';
import { BottomNav } from './shared/bottom-nav/bottom-nav';
import { Footer } from './shared/footer/footer';
import { ToastContainer } from './shared/toast/toast-container';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, BottomNav, Footer, ToastContainer],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
