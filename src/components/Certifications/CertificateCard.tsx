import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Award, ShieldCheck, Clock, Eye, Trash2 } from 'lucide-react';

interface CertificateCardProps {
  certificate: {
    title: string;
    org: string;
    issueDate: string;
    expiryDate: string | null;
    status: string;
  };
}

const statusConfig: Record<string, { badge: string; icon: typeof ShieldCheck; iconBg: string }> = {
  Verified: {
    badge: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    icon: ShieldCheck,
    iconBg: 'bg-emerald-100 text-emerald-600',
  },
  Pending: {
    badge: 'bg-amber-100 text-amber-700 border-amber-200',
    icon: Clock,
    iconBg: 'bg-amber-100 text-amber-600',
  },
};

export default function CertificateCard({ certificate }: CertificateCardProps) {
  const cfg = statusConfig[certificate.status] ?? statusConfig.Pending;
  const StatusIcon = cfg.icon;

  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      {/* Gradient accent bar */}
      <div className={`h-1 w-full bg-gradient-to-r ${certificate.status === 'Verified'
          ? 'from-emerald-400 to-teal-400'
          : 'from-amber-400 to-orange-400'
        }`} />

      <CardContent className="p-5 space-y-3">
        {/* Icon + Badge row */}
        <div className="flex items-start justify-between">
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${cfg.iconBg} transition-transform duration-300 group-hover:scale-110`}>
            <Award className="h-6 w-6" />
          </div>
          <Badge className={`${cfg.badge} border text-xs font-medium flex items-center gap-1`}>
            <StatusIcon className="h-3 w-3" />
            {certificate.status}
          </Badge>
        </div>

        {/* Title + Org */}
        <div>
          <h3 className="font-semibold text-foreground leading-tight">{certificate.title}</h3>
          <p className="text-sm text-muted-foreground mt-0.5">{certificate.org}</p>
        </div>

        {/* Dates */}
        <div className="text-xs text-muted-foreground space-y-0.5">
          <p>Issued: {certificate.issueDate}</p>
          {certificate.expiryDate && <p>Expires: {certificate.expiryDate}</p>}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t">
          <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-primary hover:text-primary/80">
            <Eye className="h-3.5 w-3.5" />
            View
          </Button>
          <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-red-500 hover:text-red-600 hover:bg-red-50">
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
