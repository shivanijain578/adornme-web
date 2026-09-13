import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './shared/components/navbar/navbar';
import { Footer } from './shared/components/footer/footer';
import { PageLoader } from './shared/components/page-loader/page-loader';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    Navbar,
    Footer,
    PageLoader
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App
{
  protected readonly title = signal('adornme-web');
}