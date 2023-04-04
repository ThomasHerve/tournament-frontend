
export class TournamentDescriptorDTO {
  id: Number
  name: string
  description: string
  icon: string
  creator: string


  constructor() {
    this.id = -1
    this.name = "default"
    this.description = "i am a default tournament"
    this.icon = "default image"
    this.creator = "default creator"
  }


}
