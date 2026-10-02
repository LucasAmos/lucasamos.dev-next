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
import { faSpinner, faLock, faUnlock, faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { initiateConversation } from "./utils";
import { TokenModal } from "./components/TokenModal";

const AUTH_MESSAGE = "You must be authorized to talk to LucasLLM!";

function handleInput(
  e: ChangeEvent<HTMLTextAreaElement>,
  callback: Dispatch<SetStateAction<string | undefined>>
) {
  callback(e.target.value);
}

function Answer({ text }: { text: string }): ReactNode {
  return (
    <div>
      <Markdown remarkPlugins={[remarkGfm]}>{text}</Markdown>
    </div>
  );
}

function Question({ text }: { text: string }): ReactNode {
  return (
    <div className="pt-1.5 pb-1.5 pr-4 pl-4 self-end rounded-4xl bg-t-darkgreen/25">
      <Markdown remarkPlugins={[remarkGfm]}>{text}</Markdown>
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

type SubmitProps = {
  loading: boolean;
  onClick: () => void;
  disabled: boolean;
}

function SubmitButton({ loading, onClick, disabled }: SubmitProps) {
  return <button
    disabled={disabled}
    onClick={onClick}
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
}


function LucasLLM(): ReactNode {
  const searchParams = useSearchParams();
  const [question, setQuestion] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [conversation, setConversation] = useState<{ role: string, text: string }[]>([]);
  const [error, setError] = useState<string | null>();
  const [token, setToken] = useState<string | null>(searchParams.get("token"));
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<object[]>([]);

  async function handleSubmit(
    prompt: string,
  ) {
    setError(null);

    if (!token) {
      setError(AUTH_MESSAGE)
      return;
    }
    try {
      setLoading(true);
      setConversation((previous) => [...previous, { role: "user", text: prompt }]);

      const reader = await initiateConversation(prompt, token, messages)
      const decoder = new TextDecoder();
      setLoading(false)
      let accumulatedAnswer = "";
      setConversation((previous) => [...previous, { role: "assistant", text: "" }]);

      while (true) {
        const { value, done } = await reader.read();

        if (done) {
          accumulatedAnswer += decoder.decode();
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        accumulatedAnswer += chunk;
        setConversation((previous) => [
          ...previous.slice(0, -1),
          { role: "assistant", text: accumulatedAnswer },
        ]);
      }
      addMessage("assistant", accumulatedAnswer)
    } catch {
      setError("Sorry, that's an error!")
    } finally {
      setLoading(false);
    }
  }


  function addMessage(role: string, text: string) {
    setMessages((previousMessages) => [
      ...previousMessages,
      { role, text },
    ]);
  }




  const answerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (answerRef.current) {
      answerRef.current.scrollTop = answerRef.current.scrollHeight;
    }
  }, [conversation]);
  return (
    <div className="xs:h-[calc(100vh-240px)] sm:h-[calc(100vh-220px)] md:h-[calc(100vh-220px)] lg:h-[calc(100vh-130px)]">
      {modalOpen && <TokenModal setToken={setToken} token={token} modal={setModalOpen} />}
      <div className="class1 flex h-full min-h-0 flex-col">
        <div className="class2 shrink-0">
          <h1 className="font-Inter text-2xl font-medium tracking-tight text-[#1a202c]">
            LucasLLM
            {token ? (
              <FontAwesomeIcon
                className="cursor-pointer ml-1"
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
          className="p-3 gap-2 flex flex-col min-h-0 flex-1 overflow-y-auto mt-4 border-t-purple/80 rounded-xl border-2"
        >
          {error && <div className={"text-red-600"}>{error} </div>}
          {conversation && conversation.map((turn, index) => {
            if (turn.role === "assistant") return <Answer key={index} text={turn.text} />
            else if (turn.role === "user") return <Question key={index} text={turn.text} />
            return null
          })}
          {loading && <FontAwesomeIcon
            icon={faEllipsis}
            size="xl"
            className="animate-bounce self-end pt-3"
            aria-label="Loading"
          />}
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

          <SubmitButton disabled={!question || loading} loading={loading} onClick={
            () => {
              if (question) {
                handleSubmit(question)
                addMessage("user", question)
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
