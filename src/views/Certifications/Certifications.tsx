import CertificateCard from "@/components/Certifications/CertificateCard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Award, ShieldCheck, Clock, Upload } from "lucide-react"

const certifications = [
  {
    title: "Web Development Certificate",
    org: "Tech Academy",
    issueDate: "January 15, 2021",
    expiryDate: "January 15, 2023",
    status: "Verified",
  },
  {
    title: "Digital Marketing Certification",
    org: "Marketing Institute",
    issueDate: "March 10, 2022",
    expiryDate: null,
    status: "Pending",
  },
  {
    title: "Graphic Design Certification",
    org: "Design School",
    issueDate: "February 5, 2021",
    expiryDate: "February 5, 2024",
    status: "Verified",
  },
]

const verified = certifications.filter((c) => c.status === "Verified").length
const pending = certifications.filter((c) => c.status === "Pending").length

export default function Certifications() {
  return (
    <main className="flex-1 p-8 space-y-8 bg-background">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
            <Award className="h-6 w-6" />
          </div>
          Certifications
        </h1>
        <p className="text-sm text-muted-foreground md:text-base mt-1">
          Showcase your skills and build trust in the community.
        </p>
      </div>

      {/* Stats Bar */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="group overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
          <CardContent className="flex items-center gap-4 py-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 transition-transform group-hover:scale-110">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold">{certifications.length}</p>
              <p className="text-xs text-muted-foreground">Total Certificates</p>
            </div>
          </CardContent>
        </Card>
        <Card className="group overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
          <CardContent className="flex items-center gap-4 py-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 transition-transform group-hover:scale-110">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold">{verified}</p>
              <p className="text-xs text-muted-foreground">Verified</p>
            </div>
          </CardContent>
        </Card>
        <Card className="group overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
          <CardContent className="flex items-center gap-4 py-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-600 transition-transform group-hover:scale-110">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold">{pending}</p>
              <p className="text-xs text-muted-foreground">Pending Review</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Certification Cards */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Your Certificates</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {certifications.map((cert, index) => (
            <CertificateCard certificate={cert} key={index} />
          ))}
        </div>
      </section>

      {/* Upload Form */}
      <section>
        <Card className="overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-indigo-500 to-teal-500 opacity-60" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Upload className="h-5 w-5 text-primary" />
              Upload New Certification
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="title">Certificate Title</Label>
                <Input id="title" placeholder="e.g. AWS Solutions Architect" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="org">Issuing Organization</Label>
                <Input id="org" placeholder="e.g. Amazon Web Services" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="date">Issue Date</Label>
                <Input id="date" type="date" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="file">Upload Certificate</Label>
                <Input id="file" type="file" />
              </div>
              <div className="sm:col-span-2">
                <Button type="submit" className="w-full sm:w-auto">
                  Submit for Verification
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </section>

      {/* Footer info */}
      <div className="text-center text-sm text-muted-foreground space-y-1">
        <p>
          Certifications are reviewed within 24-48 hours. Verified badges build trust with potential skill partners.
        </p>
        <Button variant="link" className="p-0 text-primary">
          Learn more about verification
        </Button>
      </div>
    </main>
  )
}
