import { HardHat } from "lucide-react";
export function BrandLogo({ inverse=false }: { inverse?: boolean }) {
 return <span className="brand-logo" aria-label="SafeNexG Innovation"><span className="brand-mark"><HardHat aria-hidden="true"/></span><span className="brand-copy"><span><b className={inverse?"text-primary-light":"text-primary"}>SafeNex</b><b className="text-brand-green">G</b></span><small className={inverse?"text-dark-muted":"text-muted-foreground"}>innovation</small></span></span>
}
