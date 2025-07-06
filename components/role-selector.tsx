"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { ROLE_DEFINITIONS, type RoleType } from "@/lib/role-templates"

interface RoleSelectorProps {
  selectedRole: RoleType
  onRoleChange: (role: RoleType) => void
}

export function RoleSelector({ selectedRole, onRoleChange }: RoleSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Object.entries(ROLE_DEFINITIONS).map(([key, role]) => {
        const isSelected = selectedRole === key

        return (
          <Card
            key={key}
            className={`cursor-pointer transition-all hover:shadow-md ${
              isSelected ? "ring-2 ring-primary bg-primary/5" : ""
            }`}
            onClick={() => onRoleChange(key as RoleType)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{role.icon}</div>
                  <div>
                    <CardTitle className="text-base">{role.label}</CardTitle>
                    <CardDescription className="text-sm">{role.description}</CardDescription>
                  </div>
                </div>
                {isSelected && (
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-primary-foreground" />
                    </div>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">Key Skills:</p>
                  <div className="flex flex-wrap gap-1">
                    {role.skills.slice(0, 6).map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {role.skills.length > 6 && (
                      <Badge variant="secondary" className="text-xs">
                        +{role.skills.length - 6} more
                      </Badge>
                    )}
                  </div>
                </div>

                {isSelected && (
                  <Button size="sm" className="w-full" variant="default">
                    <Check className="w-4 h-4 mr-2" />
                    Selected
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
