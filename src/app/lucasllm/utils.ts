

export async function initiateConversation(prompt: string, token: string, messageHistory: any): Promise<ReadableStreamDefaultReader<Uint8Array<ArrayBuffer>>> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_LUCAS_LLM_URL}/production_stage/sme_assistant`,
    {
      method: "POST",
      headers: {
        "x-api-key": token || "",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt, messageHistory })
    }
  );

  if (response.status === 403) {
    throw new Error("Unauthorized")

  }
  if (!response.ok) {
    throw new Error("The request did not succeed!")
  }
  if (!response.body) {
    throw new Error("An invalid response was returned!");
  }
  return response.body.getReader();
}