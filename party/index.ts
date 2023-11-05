import type * as Party from "partykit/server";

import { AI } from "./ai"

export default class Server implements Party.Server {

  ai : AI

  constructor(readonly party: Party.Party) {
    this.ai = new AI(this.party.env['OPEN_AI_API_KEY'] as string)
  }

  onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
    // A websocket just connected!
    console.log(
      `Connected:
  id: ${conn.id}
  room: ${this.party.id}
  url: ${new URL(ctx.request.url).pathname}`
    );

    // let's send a message to the connection
    conn.send(JSON.stringify({msg:"Good to see you!"}));
  }

  async onMessage(message: string, sender: Party.Connection) {
    // let's log the message
    message = JSON.parse(message).msg
    console.log(`connection ${sender.id} sent message: ${message}`);

    await this.ai.userMessage(message, async (data) => {
      console.log('data', data)
      sender.send(JSON.stringify(data))
    })

    // as well as broadcast it to all the other connections in the room...
    // this.party.broadcast(
    //   `${sender.id}: ${message}`,
    //   // ...except for the connection it came from
    //   [sender.id] 
    // );
  }
}

Server satisfies Party.Worker;
