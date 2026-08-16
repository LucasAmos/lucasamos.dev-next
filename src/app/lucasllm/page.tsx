"use client";
import { Dispatch, ReactNode, SetStateAction, ChangeEvent, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

function handleInput(
  e: ChangeEvent<HTMLTextAreaElement>,
  callback: Dispatch<SetStateAction<string | undefined>>
) {
  callback(e.target.value);
}

async function handleSubmit(
  prompt: string,
  loading: Dispatch<SetStateAction<boolean>>,
  answer: Dispatch<SetStateAction<string | undefined>>,
  error: Dispatch<SetStateAction<string | undefined>>
) {
  answer(undefined);
  try {
    const response = await fetch(
      `https://4e3gn82bia.execute-api.eu-west-2.amazonaws.com/production_stage/sme_assistant`,
      {
        method: "POST",
        headers: {
          Authorization: "98c538cb-a154-ad4f-5651-caf707633982",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ prompt })
      }
    );
    loading(true);

    if (response.status === 403) {
      error("These AI models cost 💰💰💰 to talk to LucasLLM you must be authorised!");
      return;
    }

    const result = await response.json();

    if (result.answer == "") {
      alert("an error occurred");
    }
    answer(result.answer);
  } catch (error) {
    console.log("ERROR", error);
  } finally {
    loading(false);
  }
}

export default function LucasLLM(): ReactNode {
  const [question, setQuestion] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState<undefined | string>();
  const [error, setError] = useState<undefined | string>();

  return (
    <div className="flex flex-col xs:h-[calc(100vh-240px)]  sm:h-[calc(100vh-220px)] md:h-[calc(100vh-220px)] lg:h-[calc(100vh-130px)]  ">
      <div>
        <h1 className="font-Inter text-2xl font-medium tracking-tight text-[#1a202c]">LucasLLM</h1>
        Ask me about my career, university studies, academic publishing record or the books I have
        read
        <div>
          <div className="flex flex-col mb-5">
            <textarea
              placeholder="Ask me a question"
              onChange={(e) => handleInput(e, setQuestion)}
              value={question}
              className={`
              min-h-20
              max-h-50 
              overflow-y-auto
              border-solid
              border-2
              focus:outline-none
              focus:border-t-darkgreen/80
              border-t-darkgreen/60
              text-t-violet 
              rounded-xl
              p-1
              mt-5`}
            />
          </div>
          <button
            disabled={!question || loading}
            onClick={() => question && handleSubmit(question, setLoading, setAnswer, setError)}
            type="submit"
            className={`
            bg-t-darkgreen/90
            border-0
            hover:bg-t-darkgreen
            min-w-30 p-2 
            disabled:bg-t-darkgreen/40
            cursor-pointer 
            text-t-purple 
            transition-colors 
            duration-200
            rounded-xl
            `}
          >
            {!loading ? "SUBMIT" : <FontAwesomeIcon icon={faSpinner} className="animate-spin" />}
          </button>
        </div>
      </div>
      {answer && (
        <div className="mt-4 border-t-purple/80 overflow-y-scroll rounded-xl  border-2 p-2">
          {<Markdown remarkPlugins={[remarkGfm]}>{answer}</Markdown>}
        </div>
      )}

      {loading && (
        <div className="mt-4 border-t-purple/80 overflow-y-scroll rounded-xl  border-2 p-2">
          This might seem slow because the response is not being streamed. The bot does not retain
          conversation memory, the tokens are already costing 💰💰💰
        </div>
      )}

      {error && <div className="mt-5 text-red-700 font-bold text-xl"> {error} </div>}
    </div>
  );
}
