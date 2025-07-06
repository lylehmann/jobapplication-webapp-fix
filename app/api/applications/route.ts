import { type NextRequest, NextResponse } from "next/server"
import { applicationsAPI } from "@/lib/api/applications"

export async function GET(request: NextRequest) {
  try {
    const applications = await applicationsAPI.getApplications()
    return NextResponse.json(applications)
  } catch (error) {
    console.error("GET /api/applications error:", error)
    return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const application = await applicationsAPI.createApplication(data)
    return NextResponse.json(application)
  } catch (error) {
    console.error("POST /api/applications error:", error)
    return NextResponse.json({ error: "Failed to create application" }, { status: 500 })
  }
}
