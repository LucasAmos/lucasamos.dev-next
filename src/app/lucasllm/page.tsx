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
  callback: Dispatch<SetStateAction<boolean>>,
  answer: Dispatch<SetStateAction<string | undefined>>
) {
  callback(true);
  answer(undefined);
  try {
    const response = await fetch(
      `https://4e3gn82bia.execute-api.eu-west-2.amazonaws.com/production_stage/sme_assistant`,
      {
        method: "POST",
        headers: {
          Authorization: "0e2a3893-46c1-f07d-7b6f-cba7ffaf60b1",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ prompt })
      }
    );
    const result = await response.json();
    console.log(result);
    console.log(result.answer);
    if (result.answer == "") {
      alert("an error occurred");
    }
    answer(result.answer);
  } catch (error) {
    console.log(error);
  } finally {
    callback(false);
  }
}

export default function LucasLLM(): ReactNode {
  const [question, setQuestion] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState<undefined | string>();
  return (
    <>
      <h1 className="font-Inter text-2xl font-medium tracking-tight text-[#1a202c]">LucasLLM</h1>
      <div>
        <div className="flex flex-col mb-5">
          <textarea
            placeholder="Ask me a question"
            onChange={(e) => handleInput(e, setQuestion)}
            value={question}
            className="min-h-20 max-h-50  overflow-y-auto border-solid border-2 border-t-darkgreen rounded-xl p-1 mt-5"
          />
        </div>
        <button
          disabled={!question || loading}
          onClick={() => question && handleSubmit(question, setLoading, setAnswer)}
          type="submit"
          className="hover:bg-t-darkgreen/80
          disabled:bg-t-darkgreen/80
          disabled:border-t-darkgreen/80 
          bg-t-darkgreen 
          cursor-pointer
          min-w-30
          pl-4 
          pr-4 
          rounded-full 
          p-2
          border-10
          border-red-900
          text-t-violet 
          transition-colors 
          duration-200"
        >
          {!loading ? "SUBMIT" : <FontAwesomeIcon icon={faSpinner} className="animate-spin" />}
        </button>
        <br />
        ANSWER:
        <br />
        {<Markdown remarkPlugins={[remarkGfm]}>{answer}</Markdown>}
      </div>
    </>
  );
}
