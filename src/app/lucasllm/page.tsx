// oxlint-disable jsx-a11y/no-static-element-interactions jsx-a11y/click-events-have-key-events
"use client";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  ChangeEvent,
  useState,
  useEffect,
  useRef,
  Suspense
} from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useSearchParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faLock, faUnlock, faCircleCheck } from "@fortawesome/free-solid-svg-icons";

const authorizationMessage = "You must be authorized to talk to LucasLLM!";

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

  if (!token) {
    answer(authorizationMessage);
    return;
  }
  try {
    loading(true);
    error(undefined);
    answer("LucasLLM is thinking...");

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

    if (!response.ok) {
      error("That's an error!");
      return;
    }

    if (!response.body) {
      error("The response did not contain a stream.");
      return;
    }
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let accumulatedAnswer = "";

    while (true) {
      const { value, done } = await reader.read();

      if (done) {
        accumulatedAnswer += decoder.decode();
        break;
      }

      const chunk = decoder.decode(value, { stream: true });
      accumulatedAnswer += chunk;

      answer(accumulatedAnswer);
    }
  } catch {
    error("That's an error!");
  } finally {
    loading(false);
  }
}
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
        <div>
          <b className="">
            Have you seen the price of tokens lately? To avoid Denial of Wallet attacks enter your
            API key
          </b>
        </div>
        <input
          onChange={(e) => setState(e.target.value)}
          value={state || ""}
          className="xs:w-10/12 sm:w-11/12 md:w-11/12 mr-1 border-2 rounded-lg p-1 mt-2 focus:outline-none border-t-darkgreen focus:border-t-darkgreen/80"
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

export default function Suspended(): ReactNode {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LucasLLM />
    </Suspense>
  );
}

function LucasLLM(): ReactNode {
  const searchParams = useSearchParams();

  const [question, setQuestion] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState<undefined | string>();
  const [error, setError] = useState<undefined | string>();
  const [token, setToken] = useState<string | null>(searchParams.get("token"));
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const answerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (answerRef.current) {
      answerRef.current.scrollTop = answerRef.current.scrollHeight;
    }
  }, [answer]);
  return (
    // <div className="flex flex-col"></div>
    <div className="xs:h-[calc(100vh-240px)] sm:h-[calc(100vh-220px)] md:h-[calc(100vh-220px)] lg:h-[calc(100vh-130px)]">
      {modalOpen && <Modal setToken={setToken} token={token} modal={setModalOpen} />}
      <div className="class1 flex h-full min-h-0 flex-col">
        <div className="class2 shrink-0">
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
        </div>
        <div
          ref={answerRef}
          className="class3min-h-0 flex-1 overflow-y-auto mt-4 border-t-purple/80 rounded-xl border-2"
        >
          {answer && (
            <div className={`p-2 ${answer === authorizationMessage ? "text-red-600" : ""}`}>
              <Markdown remarkPlugins={[remarkGfm]}>{answer}</Markdown>
            </div>
          )}
        </div>
        <div className="class4 mt-auto shrink-0">
          <div className="flex flex-col mb-5">
            <textarea
              placeholder="Ask me a question"
              onChange={(e) => handleInput(e, setQuestion)}
              value={question}
              className={`
         
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
    </div>
  );
}
