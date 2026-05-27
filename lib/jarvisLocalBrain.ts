import {
  saveLongTermMemory,
  saveShortTermMemory,
} from "@/lib/jarvisMemory";

export type JarvisLocalResult = {
  response: string;
  action:
    | "none"
    | "help"
    | "status"
    | "wake"
    | "timer"
    | "task"
    | "note"
    | "memory"
    | "mode"
    | "cost"
    | "unknown";
};

export const localCommandExamples = [
  "Jarvis, are you up?",
  "help",
  "system status",
  "set timer 25 minutes",
  "add task finish JARVIS dashboard",
  "add note work on British voice next",
  "save memory use Supabase for memory",
  "switch to blender mode",
  "clear chat",
];

function canUseBrowserStorage() {
  return (
    typeof window !== "undefined" && typeof window.localStorage !== "undefined"
  );
}

function saveLocalFallbackItem(key: string, value: string) {
  if (!canUseBrowserStorage()) return;

  try {
    const existing = window.localStorage.getItem(key);
    const parsed = existing ? (JSON.parse(existing) as string[]) : [];
    const updated = [...parsed, value];

    window.localStorage.setItem(key, JSON.stringify(updated));
  } catch {
    window.localStorage.setItem(key, JSON.stringify([value]));
  }
}

function saveLocalFallbackSetting(key: string, value: string) {
  if (!canUseBrowserStorage()) return;
  window.localStorage.setItem(key, value);
}

function getLocalFallbackSetting(key: string, fallback: string) {
  if (!canUseBrowserStorage()) return fallback;
  return window.localStorage.getItem(key) || fallback;
}

function normalizeInput(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[.,!?]/g, "")
    .replace(/\s+/g, " ");
}

function extractAfterCommand(message: string, command: string) {
  return message.replace(new RegExp(`^${command}\\s*:?\\s*`, "i"), "").trim();
}

function isWakeCall(lower: string) {
  const wakePhrases = [
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

  return wakePhrases.some((phrase) => lower.includes(phrase));
}

function isGreeting(lower: string) {
  const greetings = [
    "hello",
    "hi",
    "hey",
    "hey jarvis",
    "hello jarvis",
    "good morning jarvis",
    "good afternoon jarvis",
    "good evening jarvis",
  ];

  return greetings.includes(lower);
}

async function rememberChatTurn(userMessage: string, jarvisResponse: string) {
  await saveShortTermMemory({
    role: "user",
    content: userMessage,
    memoryType: "chat",
    expiresInHours: 24,
  });

  await saveShortTermMemory({
    role: "jarvis",
    content: jarvisResponse,
    memoryType: "chat",
    expiresInHours: 24,
  });
}

export async function getLocalJarvisResponse(
  message: string
): Promise<JarvisLocalResult> {
  const clean = message.trim();
  const lower = normalizeInput(clean);

  if (!clean) {
    return {
      action: "unknown",
      response: "No command detected.",
    };
  }

  if (isWakeCall(lower)) {
    const response = "For you, sir, always.";

    await rememberChatTurn(clean, response);

    return {
      action: "wake",
      response,
    };
  }

  if (isGreeting(lower)) {
    const response =
      "Hello, sir. JARVIS local systems are online and standing by.";

    await rememberChatTurn(clean, response);

    return {
      action: "wake",
      response,
    };
  }

  if (
    lower === "help" ||
    lower === "what can you do" ||
    lower === "commands" ||
    lower === "show commands"
  ) {
    const response =
      "Local command engine online. Available commands include: Jarvis are you up, help, system status, set timer, add task, add note, save memory, switch mode, what mode, cost, and clear chat.";

    await rememberChatTurn(clean, response);

    return {
      action: "help",
      response,
    };
  }

  if (
    lower.includes("system status") ||
    lower === "status" ||
    lower === "diagnostics"
  ) {
    const response =
      "System status: local mode active. Supabase memory is connected for long-term and short-term memory if environment variables are configured. API cost is zero dollars.";

    await rememberChatTurn(clean, response);

    return {
      action: "status",
      response,
    };
  }

  if (lower.includes("api status") || lower.includes("ai status")) {
    const response =
      "AI API is currently offline by design. JARVIS is running local coded responses only. Supabase memory is the active memory layer.";

    await rememberChatTurn(clean, response);

    return {
      action: "status",
      response,
    };
  }

  if (lower.startsWith("set timer") || lower.startsWith("start timer")) {
    const timerMatch = clean.match(
      /(?:set|start)\s+timer\s*(?:for)?\s*(\d+)\s*(second|seconds|minute|minutes|hour|hours)?/i
    );

    if (!timerMatch) {
      const response =
        "Timer command detected, but I need a duration. Example: set timer 25 minutes.";

      await rememberChatTurn(clean, response);

      return {
        action: "timer",
        response,
      };
    }

    const amount = timerMatch[1];
    const unit = timerMatch[2] || "minutes";
    const timerText = `${amount} ${unit}`;

    saveLocalFallbackItem("jarvis_timers", timerText);

    await saveShortTermMemory({
      role: "system",
      content: `Timer registered: ${timerText}`,
      memoryType: "command",
      expiresInHours: 24,
    });

    const response = `Timer registered for ${timerText}. The live countdown tool will be connected next.`;

    await rememberChatTurn(clean, response);

    return {
      action: "timer",
      response,
    };
  }

  if (lower.startsWith("add task")) {
    const task = extractAfterCommand(clean, "add task");

    if (!task) {
      const response =
        "Task command detected, but no task was provided. Example: add task finish JARVIS dashboard.";

      await rememberChatTurn(clean, response);

      return {
        action: "task",
        response,
      };
    }

    saveLocalFallbackItem("jarvis_tasks", task);

    await saveShortTermMemory({
      role: "system",
      content: `Task added: ${task}`,
      memoryType: "command",
      expiresInHours: 24,
    });

    const response = `Task added to short-term memory: ${task}.`;

    await rememberChatTurn(clean, response);

    return {
      action: "task",
      response,
    };
  }

  if (lower.startsWith("add note")) {
    const note = extractAfterCommand(clean, "add note");

    if (!note) {
      const response =
        "Note command detected, but no note was provided. Example: add note work on British voice next.";

      await rememberChatTurn(clean, response);

      return {
        action: "note",
        response,
      };
    }

    saveLocalFallbackItem("jarvis_notes", note);

    await saveShortTermMemory({
      role: "system",
      content: `Note added: ${note}`,
      memoryType: "temporary_context",
      expiresInHours: 48,
    });

    const response = `Note saved to short-term memory: ${note}.`;

    await rememberChatTurn(clean, response);

    return {
      action: "note",
      response,
    };
  }

  if (lower.startsWith("save memory") || lower.startsWith("remember")) {
    const memory = lower.startsWith("save memory")
      ? extractAfterCommand(clean, "save memory")
      : extractAfterCommand(clean, "remember");

    if (!memory) {
      const response =
        "Memory command detected, but no memory was provided. Example: save memory use Supabase for memory.";

      await rememberChatTurn(clean, response);

      return {
        action: "memory",
        response,
      };
    }

    saveLocalFallbackItem("jarvis_memory", memory);

    const memoryResult = await saveLongTermMemory({
      memory,
      memoryType: "general",
      importance: 3,
      tags: ["user_saved", "local_command"],
      source: "jarvis_text_console",
    });

    const response = memoryResult.success
      ? `Long-term memory saved to Supabase: ${memory}.`
      : `I tried to save that to Supabase, but memory storage failed: ${memoryResult.message}`;

    await rememberChatTurn(clean, response);

    return {
      action: "memory",
      response,
    };
  }

  if (lower.includes("switch to blender")) {
    saveLocalFallbackSetting("jarvis_mode", "blender");

    const response =
      "Blender mode activated. I will prioritize 3D workflow, materials, modeling, rendering, and scene guidance.";

    await saveLongTermMemory({
      memory: "Current JARVIS work mode preference: Blender mode.",
      memoryType: "workflow",
      importance: 3,
      tags: ["mode", "blender"],
      source: "jarvis_text_console",
    });

    await rememberChatTurn(clean, response);

    return {
      action: "mode",
      response,
    };
  }

  if (lower.includes("switch to video")) {
    saveLocalFallbackSetting("jarvis_mode", "video");

    const response =
      "Video mode activated. I will prioritize editing, pacing, audio, effects, and export workflow.";

    await saveLongTermMemory({
      memory: "Current JARVIS work mode preference: Video mode.",
      memoryType: "workflow",
      importance: 3,
      tags: ["mode", "video"],
      source: "jarvis_text_console",
    });

    await rememberChatTurn(clean, response);

    return {
      action: "mode",
      response,
    };
  }

  if (lower.includes("switch to business")) {
    saveLocalFallbackSetting("jarvis_mode", "business");

    const response =
      "Business mode activated. I will prioritize clients, tasks, deadlines, pricing, and project planning.";

    await saveLongTermMemory({
      memory: "Current JARVIS work mode preference: Business mode.",
      memoryType: "workflow",
      importance: 3,
      tags: ["mode", "business"],
      source: "jarvis_text_console",
    });

    await rememberChatTurn(clean, response);

    return {
      action: "mode",
      response,
    };
  }

  if (lower.includes("switch to code") || lower.includes("developer mode")) {
    saveLocalFallbackSetting("jarvis_mode", "code");

    const response =
      "Code mode noted. For actual coding, use ChatGPT directly. JARVIS will track tasks, notes, and project context.";

    await saveLongTermMemory({
      memory:
        "Coding help is handled through ChatGPT directly. JARVIS should track coding tasks, notes, and project context.",
      memoryType: "workflow",
      importance: 4,
      tags: ["mode", "code", "workflow"],
      source: "jarvis_text_console",
    });

    await rememberChatTurn(clean, response);

    return {
      action: "mode",
      response,
    };
  }

  if (lower.includes("what mode") || lower.includes("current mode")) {
    const mode = getLocalFallbackSetting("jarvis_mode", "local");
    const response = `Current mode: ${mode}.`;

    await rememberChatTurn(clean, response);

    return {
      action: "mode",
      response,
    };
  }

  if (lower.includes("cost") || lower.includes("how much")) {
    const response =
      "Current JARVIS local response cost is zero dollars. Supabase free-tier usage may apply separately, but no paid AI API, web search, or premium voice system is active.";

    await rememberChatTurn(clean, response);

    return {
      action: "cost",
      response,
    };
  }

  const response =
    "Command received, but I do not recognize that local command yet. Try: Jarvis are you up, help, system status, set timer 25 minutes, add task, add note, save memory, or switch to Blender mode.";

  await rememberChatTurn(clean, response);

  return {
    action: "unknown",
    response,
  };
}
