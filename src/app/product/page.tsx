"use client"

import { useEffect, useState } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkBreaks from "remark-breaks"
import { useAuth } from "@clerk/nextjs"
import { fetchEventSource } from "@microsoft/fetch-event-source"

export default function Product() {
   const { getToken } = useAuth()
   const [idea, setIdea] = useState<string>("…loading")
   /**
    * An AbortController is used to manage the lifecycle of the fetch request.
    * It allows us to cancel the request programmatically, which is crucial for
    * handling the end of the stream and for cleaning up when the component unmounts.
    */
   const [ctrl, setCtrl] = useState(new AbortController())

   useEffect(() => {
      let buffer = ""
      ;(async () => {
         const jwt = await getToken()
         if (!jwt) {
            setIdea("Authentication required")
            return
         }

         /**
          * `fetchEventSource` is a helper from `@microsoft/fetch-event-source` that
          * provides a more robust implementation of Server-Sent Events (SSE) than the
          * browser's native `EventSource`. It supports features like sending headers,
          * which is necessary for our authenticated API endpoint.
          */
         await fetchEventSource("/api/idea", {
            headers: { Authorization: `Bearer ${jwt}` },
            // We pass the AbortController's signal to the request. If ctrl.abort() is called,
            // this fetch request will be immediately cancelled.
            signal: ctrl.signal,
            /**
             * `onmessage` is called for each event received from the server.
             */
            onmessage(ev) {
               // The server sends a special "[DONE]" message to signal the end of the stream.
               if (ev.data === "[DONE]") {
                  ctrl.abort() // Close the connection
                  return
               }
               try {
                  // The server sends data as JSON strings to preserve newline characters.
                  // We parse the JSON to get the actual text chunk.
                  const parsed = JSON.parse(ev.data)
                  buffer += parsed.chunk
                  setIdea(buffer)
               } catch (e) {
                  console.error("Failed to parse SSE data:", ev.data, e)
               }
            },
            /**
             * `onclose` is called when the connection is closed, either by the server
             * or by our `ctrl.abort()` call.
             */
            onclose() {
               console.log("SSE connection closed")
            },
            /**
             * `onerror` is called if a network error occurs.
             */
            onerror(err) {
               console.error("SSE error:", err)
               // The library will automatically retry on network errors.
            },
         })
      })()

      /**
       * This is the cleanup function for the `useEffect` hook. It is called when
       * the component is unmounted (e.g., when the user navigates to another page).
       * Aborting the controller here prevents memory leaks by ensuring that the
       * network request is cancelled and doesn't continue running in the background.
       */
      return () => {
         ctrl.abort()
      }
   }, []) // Empty dependency array - run once on mount

   return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
         <div className="container mx-auto px-4 py-12">
            {/* Header */}
            <header className="text-center mb-12">
               <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                  Business Idea Generator
               </h1>
               <p className="text-gray-600 dark:text-gray-400 text-lg">
                  AI-powered innovation at your fingertips
               </p>
            </header>

            {/* Content Card */}
            <div className="max-w-3xl mx-auto">
               <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 backdrop-blur-lg bg-opacity-95">
                  {idea === "…loading" ? (
                     <div className="flex items-center justify-center py-12">
                        <div className="animate-pulse text-gray-400">
                           Generating your business idea...
                        </div>
                     </div>
                  ) : (
                     <div className="markdown-content text-gray-700 dark:text-gray-300">
                        <ReactMarkdown
                           remarkPlugins={[remarkGfm, remarkBreaks]}
                        >
                           {idea}
                        </ReactMarkdown>
                     </div>
                  )}
               </div>
            </div>
         </div>
      </main>
   )
}
