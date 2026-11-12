# My Private Story Studio

## Run locally

1. Install Node.js 18 or newer.
2. In `backend`, copy `.env.example` to `.env` and set `OPENROUTER_API_KEY` to your own OpenRouter key. Keep `.env` private; it is ignored by Git.
3. From the `backend` directory run:

   ```powershell
   npm install
   npm start
   ```

4. Open <http://127.0.0.1:3000>.

The Story AI panel can answer general writing questions or use the selected story's description, episodes, and world notes as context. Requests go through the local Express server; the OpenRouter key is never sent to the browser. Prompts and selected story context are sent to OpenRouter. Stories remain in this browser's local storage.

Set `OPENROUTER_MODEL` in `backend/.env` to select another model supported by your OpenRouter account. The default is `openai/gpt-4o-mini`.
