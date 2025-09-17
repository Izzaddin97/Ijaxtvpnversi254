import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { CreditCard, Smartphone, Building2 } from "lucide-react";
import { BANK_OPTIONS } from "../../utils/payment-constants";

interface PaymentFormProps {
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  formData: any;
  handleInputChange: (field: string, value: string) => void;
}

export function PaymentForm({ paymentMethod, setPaymentMethod, formData, handleInputChange }: PaymentFormProps) {
  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="email" className="text-green-400">Your Email Address</Label>
        <Input
          id="email"
          type="email"
          placeholder="your@email.com"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          className="mt-2 payment-input"
          required
        />
      </div>

      <Tabs value={paymentMethod} onValueChange={setPaymentMethod} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="card" className="flex items-center gap-2 payment-method-tab">
            <CreditCard className="w-4 h-4" />
            Card
          </TabsTrigger>
          <TabsTrigger value="ewallet" className="flex items-center gap-2 payment-method-tab">
            <Smartphone className="w-4 h-4" />
            E-Wallet
          </TabsTrigger>
          <TabsTrigger value="bank" className="flex items-center gap-2 payment-method-tab">
            <Building2 className="w-4 h-4" />
            Bank
          </TabsTrigger>
        </TabsList>

        <TabsContent value="card" className="space-y-4 mt-6">
          <div>
            <Label htmlFor="cardNumber" className="text-green-400">Your Card Number</Label>
            <Input
              id="cardNumber"
              placeholder="1234 5678 9012 3456"
              value={formData.cardNumber}
              onChange={(e) => handleInputChange('cardNumber', e.target.value)}
              className="mt-2 payment-input"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="expiryDate" className="text-green-400">Expiry Date</Label>
              <Input
                id="expiryDate"
                placeholder="MM/YY"
                value={formData.expiryDate}
                onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                className="mt-2 payment-input"
              />
            </div>
            <div>
              <Label htmlFor="cvv" className="text-green-400">CVV</Label>
              <Input
                id="cvv"
                placeholder="123"
                value={formData.cvv}
                onChange={(e) => handleInputChange('cvv', e.target.value)}
                className="mt-2 payment-input"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="holderName" className="text-green-400">Your Name</Label>
            <Input
              id="holderName"
              placeholder="John Doe"
              value={formData.holderName}
              onChange={(e) => handleInputChange('holderName', e.target.value)}
              className="mt-2 payment-input"
            />
          </div>
        </TabsContent>

        <TabsContent value="ewallet" className="space-y-4 mt-6">
          <div>
            <Label htmlFor="phoneNumber" className="text-green-400">Your Phone Number</Label>
            <Input
              id="phoneNumber"
              placeholder="+60 12 345 6789"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
              className="mt-2 payment-input"
            />
          </div>
          <div className="fire-card p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <Smartphone className="w-4 h-4 text-green-400 mr-2" />
              <span className="text-sm text-green-400">Touch & Go Transfer</span>
            </div>
            <p className="text-muted-foreground text-xs">
              Transfer the payment amount via Touch & Go to the account details shown on the right.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="bank" className="space-y-4 mt-6">
          <div>
            <Label htmlFor="bankCode" className="text-green-400">Your Bank</Label>
            <Select value={formData.bankCode} onValueChange={(value) => handleInputChange('bankCode', value)}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Choose your bank" />
              </SelectTrigger>
              <SelectContent>
                {BANK_OPTIONS.map((bank) => (
                  <SelectItem key={bank.value} value={bank.value}>
                    {bank.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="fire-card p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <Building2 className="w-4 h-4 text-green-400 mr-2" />
              <span className="text-sm text-green-400">Bank Transfer Instructions</span>
            </div>
            <p className="text-muted-foreground text-xs">
              Transfer the payment amount to the Maybank account details shown on the right.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
