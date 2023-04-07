import { EntryDTO } from "./entryDTO";

export class TournamentDTO {
  id: number
  title: string
  description: string
  icon: string
  creator: string

  entries: Array<EntryDTO> = new Array;

  constructor() {
    this.id = -1
    this.title = "default"
    this.description = "i am a default tournament"
    this.icon = "default image"
    this.creator = "default creator"
  }


}
