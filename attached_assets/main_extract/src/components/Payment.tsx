import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { ArrowLeft, Crown, Rocket, Lock } from "lucide-react";
import { useState } from "react";
import { PaymentForm } from "./payment/PaymentForm";
import { PaymentDestination } from "./payment/PaymentDestination";

interface PaymentProps {
  selectedVPN: {
    id: string;
    name: string;
    price: string;
    description: string;
    features: string[];
  } | null;
  onClose: () => void;
  onSuccess: (paymentDetails: any) => void;
}

export function Payment({ selectedVPN, onClose, onSuccess }: PaymentProps) {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [billingCycle, setBillingCycle] = useState("yearly");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAccountDetails, setShowAccountDetails] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    holderName: "",
    phoneNumber: "",
    bankCode: "maybank"
  });

  if (!selectedVPN) return null;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    
    setTimeout(() => {
      const priceValue = selectedVPN.price.replace(/[^0-9.]/g, '');
      const monthlyPrice = parseFloat(priceValue) || 0;
      const finalAmount = billingCycle === 'yearly' ? (monthlyPrice * 12 * 0.7).toFixed(2) : monthlyPrice.toFixed(2);
      
      const paymentDetails = {
        vpnPlan: selectedVPN.name,
        amount: `$${finalAmount}`,
        billingCycle: billingCycle,
        method: paymentMethod,
        transactionId: `TXN-${Date.now()}`,
        email: formData.email,
        timestamp: new Date().toISOString()
      };
      
      setIsProcessing(false);
      onSuccess(paymentDetails);
    }, 3000);
  };

  const priceValue = selectedVPN.price.replace(/[^0-9.]/g, '');
  const monthlyPrice = parseFloat(priceValue) || 0;
  const yearlyPrice = monthlyPrice * 12 * 0.7;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 payment-modal-backdrop">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto fire-card">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              onClick={onClose}
              className="text-green-400 hover:text-green-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center">
              {selectedVPN.id === 'nordvpn' && <Crown className="w-5 h-5 text-green-400 mr-2" />}
              {selectedVPN.id === 'expressvpn' && <Rocket className="w-5 h-5 text-green-400 mr-2" />}
              <Badge className="bg-green-500 text-black secure-indicator">Secure Payment</Badge>
            </div>
          </div>

          <div className="mb-8">
            <div className="fire-card p-4 rounded-lg mb-4">
              <h2 className="text-xl fire-text mb-2">{selectedVPN.name}</h2>
              <p className="text-muted-foreground text-sm mb-4">{selectedVPN.description}</p>
              
              <Tabs value={billingCycle} onValueChange={setBillingCycle} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="monthly">Monthly</TabsTrigger>
                  <TabsTrigger value="yearly" className="relative">
                    Yearly
                    <Badge className="ml-2 bg-green-500 text-black text-xs">Save 30%</Badge>
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="monthly" className="mt-4">
                  <div className="text-center">
                    <div className="text-2xl fire-text">${monthlyPrice.toFixed(2)}/month</div>
                    <p className="text-muted-foreground text-sm">Billed monthly</p>
                  </div>
                </TabsContent>
                <TabsContent value="yearly" className="mt-4">
                  <div className="text-center">
                    <div className="text-2xl fire-text">${(yearlyPrice/12).toFixed(2)}/month</div>
                    <p className="text-muted-foreground text-sm">Billed ${yearlyPrice.toFixed(2)} annually</p>
                    <p className="text-green-400 text-xs">Save ${((monthlyPrice * 12) - yearlyPrice).toFixed(2)} per year!</p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <PaymentForm
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                formData={formData}
                handleInputChange={handleInputChange}
              />
              
              <Button
                onClick={handlePayment}
                disabled={isProcessing || !formData.email}
                className="w-full bg-green-500 hover:bg-green-400 text-black py-6 text-lg mt-6"
                size="lg"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5 mr-2" />
                    Complete Payment ${billingCycle === 'yearly' ? yearlyPrice.toFixed(2) : monthlyPrice.toFixed(2)}
                  </>
                )}
              </Button>
            </div>

            <PaymentDestination
              paymentMethod={paymentMethod}
              showAccountDetails={showAccountDetails}
              setShowAccountDetails={setShowAccountDetails}
              copyToClipboard={copyToClipboard}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}