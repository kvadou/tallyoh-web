import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings } from "lucide-react"

export default function SettingsPage() {
  return (
    <div>
      <h1 className="font-heading text-2xl font-bold mb-6">Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-heading flex items-center gap-2">
            <Settings className="w-5 h-5" />
            App Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <p>
            App settings, admin user management, and configuration options will
            be added here as the platform grows.
          </p>
          <div className="p-4 rounded-xl bg-surface">
            <p className="font-semibold text-foreground mb-1">
              Current Admin Accounts
            </p>
            <p>
              Manage admin access in Supabase Dashboard &gt; Table Editor &gt;
              admins
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
