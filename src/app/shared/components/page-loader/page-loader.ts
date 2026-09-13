import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LoadingService } from '../../../core/services/Loader/loading';

@Component({
  selector: 'app-page-loader',
  templateUrl: './page-loader.html',
  styleUrl: './page-loader.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageLoader
{
  protected readonly loadingService = inject(LoadingService);
}