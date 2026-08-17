// oxlint-disable jsx-a11y/no-static-element-interactions jsx-a11y/click-events-have-key-events
"use client";
import { Dispatch, ReactNode, SetStateAction, ChangeEvent, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useSearchParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faLock, faUnlock, faCircleCheck } from "@fortawesome/free-solid-svg-icons";

function handleInput(
  e: ChangeEvent<HTMLTextAreaElement>,
  callback: Dispatch<SetStateAction<string | undefined>>
) {
  callback(e.target.value);
}

async function handleSubmit(
  token: string | null,
  prompt: string,
  loading: Dispatch<SetStateAction<boolean>>,
  answer: Dispatch<SetStateAction<string | undefined>>,
  error: Dispatch<SetStateAction<string | undefined>>
) {
  answer(undefined);
  try {
    loading(true);
    error(undefined);

    const response = await fetch(
      `https://4e3gn82bia.execute-api.eu-west-2.amazonaws.com/production_stage/sme_assistant`,
      {
        method: "POST",
        headers: {
          Authorization: token || "",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ prompt })
      }
    );
    const result = await response.json();
    console.log(result);
    console.log(response);

    if (response.status === 400 && result.error === "CENSORED") {
      console.log("censired");
      answer(result.message);
      return;
    }

    if (response.status === 500) {
      error("That's an error!");
      return;
    }

    if (response.status === 403) {
      error("These AI models cost 💰💰💰 to talk to LucasLLM you must be authorised!");
      return;
    }

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
  const searchParams = useSearchParams();

  const [question, setQuestion] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState<undefined | string>();
  const [error, setError] = useState<undefined | string>();
  const [token, setToken] = useState<string | null>(searchParams.get("token"));
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  function Modal({
    modal,
    token,
    setToken
  }: {
    token: string | null;
    setToken: Dispatch<SetStateAction<string | null>>;
    modal: Dispatch<SetStateAction<boolean>>;
  }) {
    const [state, setState] = useState(token);

    return (
      <div
        onClick={() => modal(false)}
        className=" bg-t-purple/20 fixed inset-0 z-2 flex items-center justify-center"
        style={{
          display: "flex"
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="m-2 bg-white rounded-xl p-5 max-w-100 h-50  z-10"
        >
          <b className="">
            Have you seen the price of tokens lately? To avoid Denial of Wallet attacks enter your
            API key
          </b>
          <input
            onChange={(e) => setState(e.target.value)}
            value={state || ""}
            className="w-11/12 mr-1 border-2 rounded-lg p-1 mt-2 focus:outline-none border-t-darkgreen focus:border-t-darkgreen/80"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setToken(state);
                modal(false);
              }
            }}
          />
          <FontAwesomeIcon
            size="lg"
            icon={faCircleCheck}
            className="text-t-violet hover:text-t-violet/80 cursor-pointer"
            onClick={() => {
              setToken(state);
              modal(false);
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <>
      {modalOpen && <Modal setToken={setToken} token={token} modal={setModalOpen} />}
      <div className="flex flex-col xs:h-[calc(100vh-240px)]  sm:h-[calc(100vh-220px)] md:h-[calc(100vh-220px)] lg:h-[calc(100vh-130px)]  ">
        <div>
          <h1 className="font-Inter text-2xl font-medium tracking-tight text-[#1a202c]">
            LucasLLM{" "}
            {token ? (
              <FontAwesomeIcon
                className="cursor-pointer"
                icon={faUnlock}
                size="sm"
                onClick={() => setModalOpen(true)}
              />
            ) : (
              <FontAwesomeIcon
                className="cursor-pointer"
                icon={faLock}
                size="sm"
                onClick={() => setModalOpen(true)}
              />
            )}
          </h1>
          Ask me about my career, AWS certifications, university studies, academic publishing record
          or the books I have read
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
              onClick={() =>
                question && handleSubmit(token, question, setLoading, setAnswer, setError)
              }
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
    </>
  );
}
