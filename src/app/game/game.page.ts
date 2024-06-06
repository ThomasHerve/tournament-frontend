import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DisplayComponent } from './display/display.component';
import { DomSanitizer } from '@angular/platform-browser';
import { EntryDTO } from '../shared/DTO/entryDTO';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from "../shared/header/header.component";
import { IonicModule } from '@ionic/angular';
import { LobbyPage } from '../lobby/lobby.page';
import { LobbyService } from '../services/lobby.service';
import { PlayersCardComponent } from '../shared/players-card/players-card.component';
import { UserComponent } from '../shared/user/user.component';

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, UserComponent, HeaderComponent, PlayersCardComponent, DisplayComponent]
})
export class GamePage implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('resultModal') resultModal: HTMLIonModalElement | undefined;

  get tournamentPicked() { return LobbyPage.tournamentPicked! }
  get isOwner() { return PlayersCardComponent.isOwner }

  private destroy$ = new Subject<void>();

  entryLeft: EntryDTO = new EntryDTO()
  entryRight: EntryDTO = new EntryDTO()


  messageResult: string | null = null
  imageResult: string | null = null

  hasVotedLeft: boolean | null = null
  ended = false;

  currentElement: EntryDTO | null = null

  canvasWidth: number = 0
  canvasHeight: number = 0

  currentRound: number = 0

  constructor(private route: ActivatedRoute, private lobbyService: LobbyService, private domSanitizer: DomSanitizer) {
    const gameId = this.route.snapshot.paramMap.get('id');

  }

  ngOnInit() {
    this.canvasWidth = 0
    this.canvasHeight = 0
  }

  ngAfterViewInit() {
    this.lobbyService.observeRound().pipe(takeUntil(this.destroy$)).subscribe(this.onRoundListener)
    this.lobbyService.observeVote().pipe(takeUntil(this.destroy$)).subscribe(this.onVoteListener)
    this.lobbyService.observeEnd().pipe(takeUntil(this.destroy$)).subscribe(this.onEndListener)

  }

  ngOnDestroy() {
    this.lobbyService.leave()
    this.destroy$.next();
    this.destroy$.complete();
  }

  onHasVotedListener = (confirmation: any) => {
    if (this.currentElement === this.entryLeft) {
      this.hasVotedLeft = confirmation.left
    }
  }

  onVoteListener = (votes: any) => {
    if (votes.result === 'left') {
      this.messageResult = this.entryLeft.name + " has win the match with " + votes.left + " votes (vs. " + votes.right + ")"
      this.imageResult = this.entryLeft.link
    }
    else {
      this.messageResult = this.entryRight.name + " has win the match with " + votes.right + " votes (vs. " + votes.left + ")"
      this.imageResult = this.entryRight.link
    }

    this.resultModal?.present()

  }

  onRoundListener = (value: any) => {
    console.log(value)
    console.log(value.random)
    this.entryLeft = value.left
    this.entryRight = value.right
    this.hasVotedLeft = null
    this.currentRound = value.round
    PlayersCardComponent.clearVotes()
  }

  onEndListener = (value: any) => {
    this.ended = true;
    this.entryLeft = value
    this.entryRight = value.right
    this.messageResult = value.name + " has win the game !"
    this.imageResult = value.link
    this.resultModal?.present()
    this.canvasWidth = window.innerWidth
    this.canvasHeight = 800
    this.end(value)
  }

  vote(left: boolean) {
    if (this.ended) {
      this.resultModal?.present()
      return
    }

    this.currentElement = this.entryLeft
    this.lobbyService.vote(left, this.onHasVotedListener)
  }

  skip() {
    if (this.ended) {
      this.resultModal?.present()
      return
    }

    if (!this.isOwner)
      return;

    this.lobbyService.skip()
  }



  closeModal() {
    this.resultModal?.dismiss()
  }

  isYoutubeVideo(name: string) {
    return name.startsWith("https://www.youtube.com/watch?")
  }

  embedYoutubeVideo(name: string) {
    return this.domSanitizer.bypassSecurityTrustResourceUrl(name.replace("/watch?v=", "/embed/"))
  }

  end(treeData: any) {
    // Variables pour gérer le déplacement et le zoom
    let initialX = this.canvasWidth / 2; // Position de départ en X
    let initialY = 50; // Position de départ en Y
    let scale = 1; // Facteur de zoom

    // Variables pour le déplacement de l'arbre
    let isDragging = false;
    let startX = 0, startY = 0;

    // Fonction pour obtenir l'URL de la miniature YouTube à partir de l'URL de la vidéo
    function getYouTubeThumbnailURL(url: any) {
      // Extraire l'ID de la vidéo de l'URL YouTube
      const videoIdMatch = url.match(/(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)|youtu\.be\/([^?&]+)|youtube\.com\/embed\/([^?&]+)/);
      if (videoIdMatch) {
        const videoId = videoIdMatch[1] || videoIdMatch[2] || videoIdMatch[3];
        // Retourner l'URL de la miniature de la vidéo
        return `https://img.youtube.com/vi/${videoId}/default.jpg`;
      }
      // Retourner null si ce n'est pas une URL YouTube valide
      return null;
    }

    // Fonction pour dessiner l'arbre sur le canevas
    function drawTree(ctx: any, tree: any, x: any, y: any, xOffset: any, yOffset: any, level: any) {
      if (!tree) return;

      // Définir les dimensions de la vignette
      const rectWidth = 80 * scale;
      const rectHeight = 120 * scale;
      // Dessiner la vignette
      ctx.beginPath();
      ctx.rect(x - rectWidth / 2, y, rectWidth, rectHeight);
      ctx.strokeStyle = "#000";
      ctx.stroke();

      // Afficher le nom du nœud
      ctx.fillStyle = "#FFF";
      ctx.fillRect(x - rectWidth / 2, y, rectWidth, 30);
      ctx.fillStyle = "#000";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(tree.name, x, y + 15);

      // Charger et afficher la miniature de la vidéo ou l'image associée au lien
      const image = new Image();
      const thumbnailURL = getYouTubeThumbnailURL(tree.link);

      if (thumbnailURL) {
        // Si l'URL est une vidéo YouTube, utiliser l'URL de la miniature
        image.src = thumbnailURL;
      } else {
        // Sinon, utiliser l'URL de l'image dans `tree.link`
        image.src = tree.link;
      }

      image.onload = function () {
        // Afficher l'image (miniature de la vidéo ou image associée au lien) sous le nom
        ctx.drawImage(image, x - rectWidth / 2, y + 30, rectWidth, rectHeight - 30);
      };

      // Fonction pour dessiner un lien entre les nœuds parents et enfants
      function drawLink(x1: any, y1: any, x2: any, y2: any, child: any) {
        // Définir la couleur du lien
        if (tree.name === child.name && tree.link === child.link) {
          ctx.strokeStyle = "red"; // Lien rouge si les noms et les liens sont identiques
        } else {
          ctx.strokeStyle = "#000"; // Lien noir sinon
        }

        // Dessiner le lien
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }


      // Dessiner les liens et appeler récursivement les enfants
      if (tree.rigth) {
        // Dessiner la ligne vers l'enfant droit
        const rightX = x + xOffset;
        const rightY = y + rectHeight + yOffset;
        drawLink(x, y + rectHeight, rightX, rightY, tree.rigth);

        // Appel récursif pour dessiner l'enfant droit
        drawTree(ctx, tree.rigth, rightX, rightY, xOffset / 2, yOffset, level + 1);
      }

      // Dessiner l'enfant gauche seulement si l'enfant droit existe
      if (tree.rigth && tree.left) {
        // Dessiner la ligne vers l'enfant gauche
        const leftX = x - xOffset;
        const leftY = y + rectHeight + yOffset;
        drawLink(x, y + rectHeight, leftX, leftY, tree.left);

        // Appel récursif pour dessiner l'enfant gauche
        drawTree(ctx, tree.left, leftX, leftY, xOffset / 2, yOffset, level + 1);
      }
    }

    // Fonction d'initialisation
    function init() {
      const canvas = document.getElementById("myCanvas") as HTMLCanvasElement;
      if (canvas) {
        const ctx = canvas.getContext("2d");

        if (ctx) {
          // Effacer le canevas
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          // Dessiner l'arbre sur le canevas
          drawTree(ctx, treeData.tree, initialX, initialY, 160 * scale, 100 * scale, 1);
        }
      }
    }

    // Gestion des événements de la souris et de la molette
    function addEventListeners() {
      const canvas = document.getElementById("myCanvas") as HTMLCanvasElement;

      // Événement de molette pour zoomer et dézoomer
      canvas.addEventListener("wheel", function (event) {
        event.preventDefault();

        // Ajuster le facteur de zoom de manière plus précise
        const zoomSensitivity = 0.001; // Ajustez cette valeur pour rendre le zoom plus ou moins précis
        scale += event.deltaY * -zoomSensitivity;

        // Limiter le facteur de zoom entre 0.5 et 3
        scale = Math.max(0.5, Math.min(scale, 3));

        // Redessiner l'arbre avec le nouveau facteur de zoom
        init();
      });

      // Événement de mousedown pour commencer à déplacer l'arbre
      canvas.addEventListener("mousedown", function (event) {
        isDragging = true;
        startX = event.clientX - initialX;
        startY = event.clientY - initialY;
      });

      // Événement de mousemove pour déplacer l'arbre
      canvas.addEventListener("mousemove", function (event) {
        if (isDragging) {
          // Mettre à jour les coordonnées initiales
          initialX = event.clientX - startX;
          initialY = event.clientY - startY;

          // Redessiner l'arbre avec les nouvelles coordonnées
          init();
        }
      });

      // Événement de mouseup pour arrêter de déplacer l'arbre
      canvas.addEventListener("mouseup", function () {
        isDragging = false;
        init();
      });

      // Événement de mouseout pour arrêter de déplacer l'arbre si la souris sort du canevas
      canvas.addEventListener("mouseout", function () {
        isDragging = false;
        init();
      });
    }

    init();
    addEventListeners();

  }

}
