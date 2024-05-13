import { Component, Input, ChangeDetectionStrategy  } from '@angular/core';
import { DomSanitizer} from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  standalone: true,
  styleUrls: ['./display.component.scss'],
  imports: [IonicModule, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DisplayComponent {
  @Input()
  isYoutubeVideo!: boolean;

  @Input()
  source!: string;

  constructor(private domSanitizer: DomSanitizer) {

  }

  embedYoutubeVideo(name: string) {
    return this.domSanitizer.bypassSecurityTrustResourceUrl(name.replace("/watch?v=", "/embed/"))
  }

}
