import
{
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

import
{
  MatButtonModule
} from '@angular/material/button';

import
{
  MatIconModule
} from '@angular/material/icon';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './app-file-upload.html',
  styleUrl: './app-file-upload.scss'
})
export class AppFileUpload
{

  @Input() label = 'Choose file';

  @Input() accept = '*';

  @Input() multiple = false;

  @Input() disabled = false;

  @Output() filesSelected =
    new EventEmitter<File[]>();

  selectedFiles: File[] = [];

  onFileSelected(event: Event): void
  {

    const input = event.target as HTMLInputElement;

    if (!input.files)
    {
      return;
    }

    this.selectedFiles =
      Array.from(input.files);

    this.filesSelected.emit(
      this.selectedFiles
    );
  }
}