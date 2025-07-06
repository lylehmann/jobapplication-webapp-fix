import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import PDFDocument from "pdfkit"

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { applicationId } = await request.json()

    // Get application data
    const { data: application } = await supabase
      .from("applications")
      .select("*")
      .eq("id", applicationId)
      .eq("user_id", user.id)
      .single()

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 })
    }

    // Create PDF
    const doc = new PDFDocument()
    const chunks: Buffer[] = []

    doc.on("data", (chunk) => chunks.push(chunk))

    await new Promise<void>((resolve) => {
      doc.on("end", resolve)

      // Add content to PDF
      doc.fontSize(20).text("Resume", 50, 50)

      // Personal Info
      const personalInfo = application.personal_info as any
      if (personalInfo) {
        doc.fontSize(16).text(personalInfo.fullName || "Name", 50, 100)
        doc.fontSize(12).text(personalInfo.email || "", 50, 120)
        doc.text(personalInfo.phone || "", 50, 135)
        doc.text(personalInfo.location || "", 50, 150)
      }

      // Resume Data
      const resumeData = application.resume_data as any
      if (resumeData?.summary) {
        doc.fontSize(14).text("Professional Summary", 50, 180)
        doc.fontSize(10).text(resumeData.summary, 50, 200, { width: 500 })
      }

      doc.end()
    })

    const pdfBuffer = Buffer.concat(chunks)

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="resume-${application.job_title}.pdf"`,
      },
    })
  } catch (error) {
    console.error("PDF generation error:", error)
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 })
  }
}
