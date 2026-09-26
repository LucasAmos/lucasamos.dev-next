import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dispatch, SetStateAction, useState } from "react";

export function TokenModal({
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