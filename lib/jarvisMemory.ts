import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabaseClient";

export type JarvisMemoryWriteResult = {
  success: boolean;
  message: string;
};

export type LongTermMemoryInput = {
  memory: string;
  memoryType?:
    | "general"
    | "preference"
    | "project"
    | "business"
    | "voice"
    | "workflow"
    | "identity"
    | "rule";
  importance?: 1 | 2 | 3 | 4 | 5;
  tags?: string[];
  source?: string;
};

export type ShortTermMemoryInput = {
  sessionId?: string;
  role: "user" | "jarvis" | "system";
  content: string;
  memoryType?: "chat" | "command" | "status" | "temporary_context";
  expiresInHours?: number;
};

function getExpiryDate(hours: number) {
  const date = new Date();
  date.setHours(date.getHours() + hours);
  return date.toISOString();
}

export async function saveLongTermMemory({
  memory,
  memoryType = "general",
  importance = 3,
  tags = [],
  source = "jarvis_local",
}: LongTermMemoryInput): Promise<JarvisMemoryWriteResult> {
  const cleanMemory = memory.trim();

  if (!cleanMemory) {
    return {
      success: false,
      message: "No long-term memory content provided.",
    };
  }

  if (!isSupabaseConfigured()) {
    return {
      success: false,
      message:
        "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in Vercel.",
    };
  }

  try {
    const supabase = getSupabaseClient();

    const { error } = await supabase.from("jarvis_long_term_memory").insert({
      memory: cleanMemory,
      memory_type: memoryType,
      importance,
      tags,
      source,
      is_active: true,
    });

    if (error) {
      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: true,
      message: "Long-term memory saved to Supabase.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unknown Supabase long-term memory error.",
    };
  }
}

export async function saveShortTermMemory({
  sessionId = "default",
  role,
  content,
  memoryType = "chat",
  expiresInHours = 24,
}: ShortTermMemoryInput): Promise<JarvisMemoryWriteResult> {
  const cleanContent = content.trim();

  if (!cleanContent) {
    return {
      success: false,
      message: "No short-term memory content provided.",
    };
  }

  if (!isSupabaseConfigured()) {
    return {
      success: false,
      message:
        "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in Vercel.",
    };
  }

  try {
    const supabase = getSupabaseClient();

    const { error } = await supabase.from("jarvis_short_term_memory").insert({
      session_id: sessionId,
      role,
      content: cleanContent,
      memory_type: memoryType,
      expires_at: getExpiryDate(expiresInHours),
    });

    if (error) {
      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: true,
      message: "Short-term memory saved to Supabase.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unknown Supabase short-term memory error.",
    };
  }
}

export async function getRecentShortTermMemory(sessionId = "default") {
  if (!isSupabaseConfigured()) {
    return [];
  }

  try {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from("jarvis_short_term_memory")
      .select("id, role, content, memory_type, created_at")
      .eq("session_id", sessionId)
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(20);

    if (error || !data) {
      return [];
    }

    return data.reverse();
  } catch {
    return [];
  }
}

export async function getActiveLongTermMemory() {
  if (!isSupabaseConfigured()) {
    return [];
  }

  try {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from("jarvis_long_term_memory")
      .select("id, memory, memory_type, importance, tags, created_at")
      .eq("is_active", true)
      .order("importance", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(30);

    if (error || !data) {
      return [];
    }

    return data;
  } catch {
    return [];
  }
}
