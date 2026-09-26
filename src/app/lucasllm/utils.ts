

export async function initiateConversation(prompt: string, token: string): Promise<ReadableStreamDefaultReader<Uint8Array<ArrayBuffer>>>{
    console.log(1)
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_LUCAS_LLM_URL}/production_stage/sme_assistant`,
      {
        method: "POST",
        headers: {
          "x-api-key": token || "",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ prompt })
      }
    );
    console.log(2)
    if (!response.ok) {
        throw new Error("The request did not succeed!")
    }
console.log(3)
    if (!response.body) {
      throw new Error("An invalid response was returned!");
    }
    console.log(4)
    return response.body.getReader();
}