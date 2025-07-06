import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()

    // Get the current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { applicationId } = await request.json()

    // Fetch the application
    const { data: application, error } = await supabase
      .from("applications")
      .select("*")
      .eq("id", applicationId)
      .eq("user_id", user.id)
      .single()

    if (error || !application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 })
    }

    // Generate PDF using Puppeteer or similar
    // For now, we'll return a simple response
    // In production, you would use a PDF generation library

    const pdfBuffer = Buffer.from("PDF content would go here", "utf-8")

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${application.job_title || "Application"}.pdf"`,
      },
    })
  } catch (error) {
    console.error("PDF export error:", error)
    return NextResponse.json({ error: "Failed to export PDF" }, { status: 500 })
  }
}
