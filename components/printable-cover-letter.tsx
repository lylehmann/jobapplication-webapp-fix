"use client"

import Mail from "lucide-react/dist/esm/icons/mail"
import Phone from "lucide-react/dist/esm/icons/phone"
import MapPin from "lucide-react/dist/esm/icons/map-pin"
import Globe from "lucide-react/dist/esm/icons/globe"
import Calendar from "lucide-react/dist/esm/icons/calendar"
import Building from "lucide-react/dist/esm/icons/building"
import type { Database } from "@/lib/database.types"

type Application = Database["public"]["Tables"]["applications"]["Row"]

interface PrintableCoverLetterProps {
  application: Application
}

export function PrintableCoverLetter({ application }: PrintableCoverLetterProps) {
  const personalInfo = application.personal_info || {}
  const coverLetter = application.cover_letter_data || {}

  const formatDate = (dateString: string) => {
    if (!dateString) return new Date().toLocaleDateString("de-DE")
    return new Date(dateString).toLocaleDateString("de-DE")
  }

  return (
    <div
      id="printable-cover-letter"
      className="bg-white mx-auto max-w-none text-black"
      style={{ fontFamily: "Times New Roman, serif", fontSize: "11pt", lineHeight: "1.5" }}
    >
      {/* Clean Header */}
      <div className="flex justify-between items-start mb-8 pb-6 border-gray-300 border-b">
        {/* Sender Info */}
        <div>
          <h1 className="mb-3 font-bold text-gray-900 text-2xl">{personalInfo.fullName || "Ihr Name"}</h1>
          <div className="space-y-1 text-gray-700 text-sm">
            {personalInfo.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{personalInfo.location}</span>
              </div>
            )}
            {personalInfo.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>{personalInfo.phone}</span>
              </div>
            )}
            {personalInfo.email && (
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>{personalInfo.email}</span>
              </div>
            )}
            {personalInfo.portfolio && (
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                <span>{personalInfo.portfolio}</span>
              </div>
            )}
          </div>
        </div>

        {/* Date */}
        <div className="text-right">
          <div className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded text-gray-600 text-sm">
            <Calendar className="w-4 h-4" />
            <span>{coverLetter.date ? formatDate(coverLetter.date) : formatDate("")}</span>
          </div>
        </div>
      </div>

      {/* Recipient Address */}
      <div className="mb-8 p-4 border border-gray-300 rounded">
        <div className="flex items-center gap-2 mb-3">
          <Building className="w-4 h-4 text-gray-600" />
          <span className="font-medium text-gray-700 text-sm">Empfänger</span>
        </div>
        {coverLetter.recipientName && (
          <div className="font-bold text-gray-900">
            {coverLetter.recipientName}
            {coverLetter.recipientTitle && `, ${coverLetter.recipientTitle}`}
          </div>
        )}
        <div className="font-bold text-gray-900">{coverLetter.company || application.company || "Firmenname"}</div>
        {coverLetter.address && <div className="mt-1 text-gray-700 whitespace-pre-line">{coverLetter.address}</div>}
      </div>

      {/* Subject */}
      {coverLetter.subject && (
        <div className="bg-blue-50 mb-6 p-3 border-blue-500 border-l-4">
          <div className="font-bold text-gray-900">
            <strong>Betreff: {coverLetter.subject}</strong>
          </div>
        </div>
      )}

      {/* Letter Content */}
      <div className="space-y-5 text-sm leading-relaxed">
        {/* Salutation */}
        <div className="font-medium text-gray-900">{coverLetter.salutation || "Sehr geehrte Damen und Herren,"}</div>

        {/* Opening Paragraph */}
        {coverLetter.openingParagraph && <p className="text-gray-700 text-justify">{coverLetter.openingParagraph}</p>}

        {/* Body Paragraphs */}
        {coverLetter.bodyParagraphs && (
          <div className="space-y-4">
            {coverLetter.bodyParagraphs.split("\n\n").map((paragraph: string, index: number) => (
              <p key={index} className="text-gray-700 text-justify">
                {paragraph}
              </p>
            ))}
          </div>
        )}

        {/* Closing Paragraph */}
        {coverLetter.closingParagraph && <p className="text-gray-700 text-justify">{coverLetter.closingParagraph}</p>}

        {/* Sign Off */}
        <div className="mt-8">
          <div className="mb-4 text-gray-700">{coverLetter.signOff || "Mit freundlichen Grüßen"}</div>
          <div className="mt-8 font-bold text-gray-900 text-lg">{personalInfo.fullName || "Ihr Name"}</div>
        </div>
      </div>

      {/* Attachments Note */}
      <div className="mt-8 p-4 border border-gray-300 rounded">
        <div className="mb-2 font-bold text-sm">Anlagen:</div>
        <div className="gap-2 grid grid-cols-2 text-sm">
          <div className="flex items-center gap-2">
            <div className="bg-gray-600 rounded-full w-2 h-2"></div>
            <span>Lebenslauf</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-gray-600 rounded-full w-2 h-2"></div>
            <span>Zeugnisse</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-gray-600 rounded-full w-2 h-2"></div>
            <span>Zertifikate</span>
          </div>
          {application.projects_data && application.projects_data.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="bg-gray-600 rounded-full w-2 h-2"></div>
              <span>Projektportfolio</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-4 border-gray-300 border-t text-gray-500 text-xs text-center">
        Anschreiben - {personalInfo.fullName} - {new Date().toLocaleDateString("de-DE")}
      </div>
    </div>
  )
}
