import { type NextRequest, NextResponse } from "next/server"
import { applicationsAPI } from "@/lib/api/applications"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const application = await applicationsAPI.getApplication(params.id)
    return NextResponse.json(application)
  } catch (error) {
    console.error(`GET /api/applications/${params.id} error:`, error)
    return NextResponse.json({ error: "Failed to fetch application" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await request.json()
    const application = await applicationsAPI.updateApplication(params.id, data)
    return NextResponse.json(application)
  } catch (error) {
    console.error(`PUT /api/applications/${params.id} error:`, error)
    return NextResponse.json({ error: "Failed to update application" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await applicationsAPI.deleteApplication(params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`DELETE /api/applications/${params.id} error:`, error)
    return NextResponse.json({ error: "Failed to delete application" }, { status: 500 })
  }
}
