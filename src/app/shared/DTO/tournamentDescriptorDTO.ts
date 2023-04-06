
export class TournamentDescriptorDTO {
  id: Number
  title: string
  description: string
  icon: string
  creator: string


  constructor() {
    this.id = -1
    this.title = "default"
    this.description = "i am a default tournament"
    this.icon = "default image"
    this.creator = "default creator"
  }


}
