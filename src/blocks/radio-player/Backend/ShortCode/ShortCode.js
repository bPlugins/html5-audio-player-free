import { useRef, useState } from "react";
import "./shortcode.scss";

const ShortCode = ({ shortCode }) => {
    const tooltip = useRef(null);
    const inputRef = useRef(null);
    const [copied, setCopied] = useState(false);

    const handleCopy = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        if (inputRef.current) {
            inputRef.current.select();
            inputRef.current.setSelectionRange(0, 99999);
        }

        const feedback = () => {
            setCopied(true);

            if (tooltip.current) {
                tooltip.current.innerHTML = "Copied Successfully!";
                tooltip.current.classList.add("copied");
            }

            setTimeout(() => {
                setCopied(false);

                if (tooltip.current) {
                    tooltip.current.innerHTML = "Copy To Clipboard";
                    tooltip.current.classList.remove("copied");
                }
            }, 1500);
        };

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard
                .writeText(shortCode)
                .then(() => {
                    feedback();
                })
                .catch((err) => {
                    console.error("Clipboard API failed, trying fallback", err);
                    fallbackCopy();
                });
        } else {
            fallbackCopy();
        }

        function fallbackCopy() {
            try {
                document.execCommand("copy");
                feedback();
            } catch (err) {
                console.error("Fallback copy failed", err);
            }
        }
    };

    return (
        <div className="radioShortCode">
            <div className="radioShortCodeInner">
                <div className="radioShortCodeInputWrapper">
                    <span ref={tooltip} className="tooltip">
                        Copy To Clipboard
                    </span>

                    <div className="radioShortCodeInput">
                        <input
                            ref={inputRef}
                            readOnly
                            value={shortCode}
                            onClick={handleCopy}
                        />
                    </div>

                    <div className="radioShortCodeCopyBtn" onClick={handleCopy}>
                        {copied ? (
                            "✓"
                        ) : (
                            <svg
                                viewBox="0 0 24 24"
                                width="18"
                                height="18"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                            </svg>
                        )}
                    </div>
                </div>
                <div className="radioShortCodeHeader">
                    <span>Copy the shortcode and use it anywhere.</span>
                </div>
            </div>
        </div>
    );
};

export default ShortCode;
