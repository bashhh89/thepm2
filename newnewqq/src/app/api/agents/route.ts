import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Helper to get authenticated Supabase client
async function getServerSupabaseClient() {
  const cookieStore = cookies();
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
        set(name, value, options) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name, options) {
          cookieStore.delete({ name, ...options });
        },
      },
    }
  );
}

// GET /api/agents - Get all agents for current user
export async function GET(req: NextRequest) {
  try {
    const supabase = await getServerSupabaseClient();
    
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Get agents belonging to current user
    const { data, error } = await supabase
      .from("agents")
      .select("*")
      .eq("owner_id", user.id)
      .order("created_at", { ascending: false });
    
    if (error) {
      throw new Error(error.message);
    }
    
    return NextResponse.json({ agents: data });
  } catch (error: any) {
    console.error("Error fetching agents:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch agents" },
      { status: 500 }
    );
  }
}

// POST /api/agents - Create a new agent
export async function POST(req: NextRequest) {
  try {
    const supabase = await getServerSupabaseClient();
    
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Get agent data from request body
    const { name, system_prompt } = await req.json();
    
    if (!name || !system_prompt) {
      return NextResponse.json(
        { error: "Name and system prompt are required" },
        { status: 400 }
      );
    }
    
    // Insert new agent
    const { data, error } = await supabase
      .from("agents")
      .insert({
        name,
        system_prompt,
        owner_id: user.id
      })
      .select()
      .single();
    
    if (error) {
      throw new Error(error.message);
    }
    
    return NextResponse.json({ agent: data });
  } catch (error: any) {
    console.error("Error creating agent:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create agent" },
      { status: 500 }
    );
  }
}

// PUT /api/agents - Update an agent
export async function PUT(req: NextRequest) {
  try {
    const supabase = await getServerSupabaseClient();
    
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Get agent data from request body
    const { id, name, system_prompt } = await req.json();
    
    if (!id) {
      return NextResponse.json(
        { error: "Agent ID is required" },
        { status: 400 }
      );
    }
    
    // First check if the agent belongs to the current user
    const { data: agentData, error: fetchError } = await supabase
      .from("agents")
      .select("owner_id")
      .eq("id", id)
      .single();
    
    if (fetchError) {
      return NextResponse.json(
        { error: "Agent not found" },
        { status: 404 }
      );
    }
    
    if (agentData.owner_id !== user.id) {
      return NextResponse.json(
        { error: "Unauthorized to update this agent" },
        { status: 403 }
      );
    }
    
    // Prepare update data
    const updateData: { name?: string; system_prompt?: string } = {};
    
    if (name) {
      updateData.name = name;
    }
    
    if (system_prompt) {
      updateData.system_prompt = system_prompt;
    }
    
    // Update the agent
    const { data, error } = await supabase
      .from("agents")
      .update(updateData)
      .eq("id", id)
      .eq("owner_id", user.id)
      .select()
      .single();
    
    if (error) {
      throw new Error(error.message);
    }
    
    return NextResponse.json({ agent: data });
  } catch (error: any) {
    console.error("Error updating agent:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update agent" },
      { status: 500 }
    );
  }
}

// DELETE /api/agents - Delete an agent
export async function DELETE(req: NextRequest) {
  try {
    const supabase = await getServerSupabaseClient();
    
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Get agent ID from query params
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    
    if (!id) {
      return NextResponse.json(
        { error: "Agent ID is required" },
        { status: 400 }
      );
    }
    
    // First check if the agent belongs to the current user
    const { data: agentData, error: fetchError } = await supabase
      .from("agents")
      .select("owner_id")
      .eq("id", id)
      .single();
    
    if (fetchError) {
      return NextResponse.json(
        { error: "Agent not found" },
        { status: 404 }
      );
    }
    
    if (agentData.owner_id !== user.id) {
      return NextResponse.json(
        { error: "Unauthorized to delete this agent" },
        { status: 403 }
      );
    }
    
    // Delete the agent
    const { error } = await supabase
      .from("agents")
      .delete()
      .eq("id", id)
      .eq("owner_id", user.id);
    
    if (error) {
      throw new Error(error.message);
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting agent:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete agent" },
      { status: 500 }
    );
  }
}