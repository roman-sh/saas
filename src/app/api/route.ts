import { Hono } from "hono"
import { streamSSE } from "hono/streaming"
import { Agent, run } from "@openai/agents"


// Create the agent using OpenAI's Agents SDK
const agent = new Agent({
   name: "Assistant",
   model: "gpt-5-mini",
})

/**
 * We are using Hono here as a lightweight internal router and middleware layer.
 * This allows us to use its convenient `streamSSE` helper without needing to
 * manually handle the complexities of SSE formatting and stream management.
 * The Hono app itself is not exposed as a server; it's only used to process
 * requests that are passed to it from the Next.js route handler below.
 */
const app = new Hono()

/**
 * This defines an internal Hono route that handles any GET request passed to it.
 * It's not a public route on its own. It only executes when `app.fetch(req)` is called.
 * The main purpose is to gain access to Hono's context (`c`) and helpers like `streamSSE`.
 */
app.get("*", async (c) => {
   /**
    * `streamSSE` is a Hono helper that correctly sets up a Server-Sent Events (SSE) stream.
    * It handles setting the `Content-Type: text/event-stream` header and provides a `stream`
    * object with a `writeSSE` method to easily send formatted events.
    */
   return streamSSE(c, async (stream) => {
      const result = await run(
         agent,
         "Reply with a new concise business idea for AI Agents, formatted with headings, sub-headings and bullet points (use markdown formatting)",
         { stream: true }
      )

      // Stream plain text chunks instead of event objects
      const textStream = result.toTextStream({
         compatibleWithNodeStreams: true,
      })
      for await (const chunk of textStream) {
         const data =
            typeof chunk === "string" ? chunk : new TextDecoder().decode(chunk)
         if (data) {
            await stream.writeSSE({ data })
         }
      }

      await stream.writeSSE({ event: "end", data: "[DONE]" })
   })
})

/**
 * This is the public-facing Next.js App Router API route handler for `GET /api`.
 * Its sole responsibility is to act as a bridge, forwarding the incoming
 * standard Web API `Request` object to the Hono app for processing.
 * @param {Request} req The incoming request from the client.
 * @returns {Promise<Response>} A standard Web API `Response` object returned by Hono.
 */
export async function GET(req: Request) {
   // `app.fetch(req)` delegates the request to the Hono instance. Hono's router
   // matches the request against its own routes (in this case, `app.get("*")`)
   // and returns a standard `Response` object, which Next.js can then send to the client.
   return app.fetch(req)
}
