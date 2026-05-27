"use client";

import { useEffect, useRef, useState } from "react";

type SpeechRecognitionResultAlternativeLike = {
  transcript: string;
};

type SpeechRecognitionResultLike = {
  isFinal: boolean;
  [index: number]: SpeechRecognitionResultAlternativeLike;
};

type SpeechRecognitionEventLike = Event & {
  resultIndex: number;
  results: {
    length: number;
    [index: number]: SpeechRecognitionResultLike;
  };
};

type SpeechRecognitionErrorEventLike = Event & {
  error?: string;
};

type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

type JarvisVoiceControlProps = {
  onVoiceCommand: (command: string) => Promise<string>;
  onSpeakingChange: (speaking: boolean) => void;
};

function getSpeechRecognitionConstructor(): SpeechRecognitionConstructor | null {
  if (typeof window === "undefined") return null;

  const speechWindow = window as typeof window & {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  };

  return (
    speechWindow.SpeechRecognition ||
    speechWindow.webkitSpeechRecognition ||
    null
  );
}

function cleanTranscript(value: string) {
  return value
    .trim()
    .replace(/[.,!?]/g, "")
    .replace(/\s+/g, " ");
}

function containsWakeWord(value: string) {
  return cleanTranscript(value).toLowerCase().includes("jarvis");
}

function extractJarvisCommand(value: string) {
  const cleaned = cleanTranscript(value);
  const lower = cleaned.toLowerCase();

  if (!lower.includes("jarvis")) {
    return "";
  }

  const wakeChecks = [
    "jarvis are you up",
    "jarvis are you awake",
    "jarvis are you there",
    "jarvis you awake",
    "are you up jarvis",
    "are you there jarvis",
    "wake up jarvis",
    "jarvis wake up",
    "jarvis online",
    "jarvis status check",
  ];

  if (wakeChecks.some((phrase) => lower.includes(phrase))) {
    return "Jarvis, are you up?";
  }

  const commandAfterWake = cleaned.replace(/jarvis/gi, "").trim();

  if (!commandAfterWake) {
    return "Jarvis, are you up?";
  }

  return commandAfterWake;
}

function chooseBritishVoice() {
  if (typeof window === "undefined" || !window.speechSynthesis) return null;

  const voices = window.speechSynthesis.getVoices();

  const preferredNames = [
    "Daniel",
    "Google UK English Male",
    "Google UK English Female",
    "Microsoft George",
    "Microsoft Ryan",
    "Microsoft Sonia",
    "Serena",
    "Oliver",
  ];

  for (const name of preferredNames) {
    const match = voices.find((voice) =>
      voice.name.toLowerCase().includes(name.toLowerCase())
    );

    if (match) return match;
  }

  const britishVoice = voices.find((voice) =>
    voice.lang.toLowerCase().startsWith("en-gb")
  );

  if (britishVoice) return britishVoice;

  const englishVoice = voices.find((voice) =>
    voice.lang.toLowerCase().startsWith("en")
  );

  return englishVoice || voices[0] || null;
}

export default function JarvisVoiceControl({
  onVoiceCommand,
  onSpeakingChange,
}: JarvisVoiceControlProps) {
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const shouldListenRef = useRef(false);
  const isSpeakingRef = useRef(false);
  const restartTimerRef = useRef<number | null>(null);

  const [micStatus, setMicStatus] = useState<
    "REQUESTING" | "READY" | "DENIED" | "UNAVAILABLE"
  >("REQUESTING");

  const [listenStatus, setListenStatus] = useState<
    "OFF" | "LISTENING" | "HEARD WAKE" | "PROCESSING" | "RESPONDING" | "ERROR"
  >("OFF");

  const [lastHeard, setLastHeard] = useState("Waiting for microphone...");
  const [lastCommand, setLastCommand] = useState("Say: Jarvis, are you up");
  const [lastResponse, setLastResponse] = useState("Voice response standby.");

  function clearRestartTimer() {
    if (restartTimerRef.current) {
      window.clearTimeout(restartTimerRef.current);
      restartTimerRef.current = null;
    }
  }

  function startRecognition() {
    const recognition = recognitionRef.current;

    if (!recognition || !shouldListenRef.current || isSpeakingRef.current) {
      return;
    }

    try {
      recognition.start();
    } catch {
      // Browser may throw if recognition is already running.
    }
  }

  function scheduleRestart() {
    clearRestartTimer();

    restartTimerRef.current = window.setTimeout(() => {
      if (shouldListenRef.current && !isSpeakingRef.current) {
        startRecognition();
      }
    }, 450);
  }

  function speakJarvis(text: string) {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      onSpeakingChange(false);
      isSpeakingRef.current = false;
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const voice = chooseBritishVoice();

    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang || "en-GB";
    } else {
      utterance.lang = "en-GB";
    }

    utterance.rate = 0.86;
    utterance.pitch = 0.72;
    utterance.volume = 1;

    utterance.onstart = () => {
      isSpeakingRef.current = true;
      setListenStatus("RESPONDING");
      onSpeakingChange(true);
    };

    utterance.onend = () => {
      isSpeakingRef.current = false;
      onSpeakingChange(false);
      setListenStatus("LISTENING");
      scheduleRestart();
    };

    utterance.onerror = () => {
      isSpeakingRef.current = false;
      onSpeakingChange(false);
      setListenStatus("LISTENING");
      scheduleRestart();
    };

    window.speechSynthesis.speak(utterance);
  }

  async function handleTranscript(transcript: string) {
    const cleaned = cleanTranscript(transcript);

    if (!cleaned) return;

    setLastHeard(cleaned);

    if (!containsWakeWord(cleaned)) {
      return;
    }

    const command = extractJarvisCommand(cleaned);

    if (!command) return;

    setListenStatus("HEARD WAKE");
    setLastCommand(command);

    const recognition = recognitionRef.current;

    if (recognition) {
      try {
        recognition.stop();
      } catch {
        // Ignore stop errors.
      }
    }

    setListenStatus("PROCESSING");

    const response = await onVoiceCommand(command);

    setLastResponse(response);
    speakJarvis(response);
  }

  useEffect(() => {
    let mounted = true;

    async function requestMicrophonePermission() {
      const RecognitionConstructor = getSpeechRecognitionConstructor();

      if (!RecognitionConstructor) {
        setMicStatus("UNAVAILABLE");
        setListenStatus("ERROR");
        setLastHeard("Speech recognition is not supported in this browser.");
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

        stream.getTracks().forEach((track) => track.stop());

        if (!mounted) return;

        setMicStatus("READY");
        setLastHeard("Microphone permission granted.");
        shouldListenRef.current = true;

        const recognition = new RecognitionConstructor();

        recognition.continuous = true;
        recognition.interimResults = false;
        recognition.lang = "en-US";
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
          setListenStatus("LISTENING");
        };

        recognition.onend = () => {
          if (shouldListenRef.current && !isSpeakingRef.current) {
            scheduleRestart();
          } else if (!shouldListenRef.current) {
            setListenStatus("OFF");
          }
        };

        recognition.onerror = (event) => {
          setListenStatus("ERROR");
          setLastHeard(`Voice error: ${event.error || "unknown"}`);

          if (shouldListenRef.current && !isSpeakingRef.current) {
            scheduleRestart();
          }
        };

        recognition.onresult = (event) => {
          for (let index = event.resultIndex; index < event.results.length; index += 1) {
            const result = event.results[index];

            if (result?.isFinal && result[0]?.transcript) {
              void handleTranscript(result[0].transcript);
            }
          }
        };

        recognitionRef.current = recognition;

        if (window.speechSynthesis) {
          window.speechSynthesis.onvoiceschanged = () => {
            chooseBritishVoice();
          };
        }

        startRecognition();
      } catch {
        if (!mounted) return;

        setMicStatus("DENIED");
        setListenStatus("ERROR");
        setLastHeard("Microphone permission was denied or blocked.");
      }
    }

    void requestMicrophonePermission();

    return () => {
      mounted = false;
      shouldListenRef.current = false;
      clearRestartTimer();

      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // Ignore abort errors.
        }
      }

      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function manuallyStartListening() {
    shouldListenRef.current = true;
    setListenStatus("LISTENING");
    startRecognition();
  }

  function stopListening() {
    shouldListenRef.current = false;
    clearRestartTimer();

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // Ignore stop errors.
      }
    }

    setListenStatus("OFF");
  }

  return (
    <section className="jarvis-voice-panel">
      <div className="jarvis-voice-header">
        <div>
          <p>VOICE WAKE SYSTEM</p>
          <span>ALWAYS LISTENING FOR “JARVIS” WHILE PAGE IS OPEN</span>
        </div>

        <strong className={listenStatus === "LISTENING" ? "active" : ""}>
          {listenStatus}
        </strong>
      </div>

      <div className="jarvis-voice-grid">
        <div>
          <span>MIC</span>
          <strong>{micStatus}</strong>
        </div>

        <div>
          <span>WAKE WORD</span>
          <strong>JARVIS</strong>
        </div>

        <div>
          <span>VOICE</span>
          <strong>BRITISH</strong>
        </div>
      </div>

      <div className="jarvis-voice-readout">
        <p>
          <span>HEARD</span>
          {lastHeard}
        </p>

        <p>
          <span>COMMAND</span>
          {lastCommand}
        </p>

        <p>
          <span>RESPONSE</span>
          {lastResponse}
        </p>
      </div>

      <div className="jarvis-voice-actions">
        <button type="button" onClick={manuallyStartListening}>
          START LISTENING
        </button>

        <button type="button" onClick={stopListening}>
          STOP
        </button>
      </div>
    </section>
  );
}
