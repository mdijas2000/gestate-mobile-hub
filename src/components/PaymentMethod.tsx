import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CreditCard, Wallet, Banknote } from "lucide-react";

interface PaymentMethodProps {
  selected: string;
  onSelect: (method: string) => void;
}

export function PaymentMethod({ selected, onSelect }: PaymentMethodProps) {
  const methods = [
    { id: "card", label: "Credit/Debit Card", icon: CreditCard },
    { id: "wallet", label: "Digital Wallet", icon: Wallet },
    { id: "cash", label: "Cash", icon: Banknote },
  ];

  return (
    <div className="space-y-3">
      <h3 className="font-semibold">Payment Method</h3>
      <RadioGroup value={selected} onValueChange={onSelect}>
        {methods.map((method) => (
          <Card key={method.id} className="p-4">
            <div className="flex items-center space-x-3">
              <RadioGroupItem value={method.id} id={method.id} />
              <Label htmlFor={method.id} className="flex items-center gap-2 cursor-pointer flex-1">
                <method.icon className="h-5 w-5 text-primary" />
                <span>{method.label}</span>
              </Label>
            </div>
          </Card>
        ))}
      </RadioGroup>
      {selected === "card" && (
        <div className="text-xs text-muted-foreground mt-2 p-3 bg-muted rounded">
          Note: Stripe integration will be configured for card payments
        </div>
      )}
    </div>
  );
}
