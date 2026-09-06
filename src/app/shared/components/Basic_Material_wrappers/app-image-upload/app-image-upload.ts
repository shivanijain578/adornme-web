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
  selector: 'app-image-upload',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './app-image-upload.html',
  styleUrl: './app-image-upload.scss'
})
export class AppImageUpload
{

  @Input() multiple = true;

  @Input() maxFiles = 5;

  @Input() accept = 'image/png,image/jpeg,image/webp';

  @Output()
  imagesSelected =
    new EventEmitter<File[]>();

  previews: {
    file: File;
    url: string;
  }[] = [];

  onFilesSelected(event: Event): void
  {

    const input =
      event.target as HTMLInputElement;

    if (!input.files)
    {
      return;
    }

    const files =
      Array.from(input.files)
        .slice(0, this.maxFiles);

    this.previews.forEach(x =>
      URL.revokeObjectURL(x.url)
    );

    this.previews = files.map(file => ({
      file,
      url: URL.createObjectURL(file)
    }));

    this.imagesSelected.emit(files);
  }

  remove(index: number): void
  {

    const item =
      this.previews[index];

    URL.revokeObjectURL(item.url);

    this.previews.splice(index, 1);

    this.imagesSelected.emit(
      this.previews.map(x => x.file)
    );
  }
}