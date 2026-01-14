import CertificateCard from "@/components/Certifications/CertificateCard"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

const certifications = [
  {
    title: 'Web Development Certificate',
    org: 'Tech Academy',
    issueDate: 'January 15, 2021',
    expiryDate: 'January 15, 2023',
    status: 'Verified',
  },
  {
    title: 'Digital Marketing Certification',
    org: 'Marketing Institute',
    issueDate: 'March 10, 2022',
    expiryDate: null,
    status: 'Pending',
  },
  {
    title: "Graphic Design Certification",
    org: "Design School",
    issueDate: "February 5, 2021",
    expiryDate: "February 5, 2024",
    status: "Verified",
  },
]

export default function Certifications() {
  return (
    <div className="mx-auto max-w-5xl space-y-10 p-6 md:p-8 lg:p-10">
      <div className="mb-4 text-center">
        <h1 className="text-2xl font-bold text-blue-700 md:text-3xl">
          Your Verified Certifications
        </h1>
        <p className="mt-2 text-sm text-gray-500 md:text-base">
          Showcase your skills and build trust in the community.
        </p>
      </div>

      {/* Existing certifications */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Current Certifications</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {certifications.map((cert, index) => (
            <CertificateCard certificate={cert} key={index} />
          ))}
        </div>
      </section>

      {/* Upload form */}
      <section className="space-y-4">
        <Card className="shadow-sm">
          <CardContent className="space-y-4 p-6">
            <h3 className="text-lg font-semibold">Upload New Certification</h3>
            <form className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="title">Certificate Title</Label>
                <Input id="title" placeholder="Enter certificate title" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="org">Issuing Organization</Label>
                <Input id="org" placeholder="Enter issuing organization" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="date">Issue Date</Label>
                <Input id="date" type="date" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="file">Upload Certificate</Label>
                <Input id="file" type="file" />
              </div>
              <Button type="submit" className="mt-2">
                Submit
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>

      {/* Helper text */}
      <section className="space-y-2 text-center text-sm text-gray-600">
        <p>
          Our verification process ensures that all certifications are authentic and trustworthy.
          After submission, your certification will be reviewed by our team.
        </p>
        <Button variant="link" className="p-0 text-blue-600">
          Learn more about how we verify certifications
        </Button>
      </section>
    </div>
  )
}
