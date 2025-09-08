import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { User, Eye, EyeOff, Copy, Shield, Lock, AlertCircle } from "lucide-react";
import { PAYMENT_ACCOUNTS, PAYMENT_INSTRUCTIONS, SECURITY_FEATURES } from "../../utils/payment-constants";

interface PaymentDestinationProps {
  paymentMethod: string;
  showAccountDetails: boolean;
  setShowAccountDetails: (show: boolean) => void;
  copyToClipboard: (text: string) => void;
}

export function PaymentDestination({ 
  paymentMethod, 
  showAccountDetails, 
  setShowAccountDetails, 
  copyToClipboard 
}: PaymentDestinationProps) {
  const currentAccount = PAYMENT_ACCOUNTS[paymentMethod as keyof typeof PAYMENT_ACCOUNTS];

  return (
    <div className="space-y-4">
      <Card className="fire-card p-4 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <User className="w-5 h-5 text-green-400 mr-2" />
            <span className="text-green-400">Payment Destination</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAccountDetails(!showAccountDetails)}
            className="text-green-400 hover:text-green-300"
          >
            {showAccountDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </Button>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground text-sm">Account Holder:</span>
            <span className="text-green-400 text-sm">{currentAccount.accountName}</span>
          </div>
          
          {paymentMethod === 'card' && (
            <>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground text-sm">Card Type:</span>
                <span className="text-green-400 text-sm">{currentAccount.cardType}</span>
              </div>
              {showAccountDetails && (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground text-sm">Card Number:</span>
                    <div className="flex items-center">
                      <code className="transaction-id text-xs mr-2">{currentAccount.cardNumber}</code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(currentAccount.cardNumber)}
                        className="h-6 w-6 p-0"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground text-sm">Expiry:</span>
                    <span className="text-green-400 text-sm">{currentAccount.expiryDate}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground text-sm">CVV:</span>
                    <span className="text-green-400 text-sm">{currentAccount.cvv}</span>
                  </div>
                </>
              )}
            </>
          )}

          {paymentMethod === 'bank' && (
            <>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground text-sm">Bank:</span>
                <span className="text-green-400 text-sm">{currentAccount.bankName}</span>
              </div>
              {showAccountDetails && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-sm">Account Number:</span>
                  <div className="flex items-center">
                    <code className="transaction-id text-xs mr-2">{currentAccount.accountNumber}</code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(currentAccount.accountNumber)}
                      className="h-6 w-6 p-0"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}

          {paymentMethod === 'ewallet' && (
            <>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground text-sm">Provider:</span>
                <span className="text-green-400 text-sm">{currentAccount.provider}</span>
              </div>
              {showAccountDetails && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-sm">Phone Number:</span>
                  <div className="flex items-center">
                    <code className="transaction-id text-xs mr-2">{currentAccount.phoneNumber}</code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(currentAccount.phoneNumber)}
                      className="h-6 w-6 p-0"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </Card>

      <Card className="fire-card p-4 rounded-lg">
        <div className="flex items-center mb-2">
          <Shield className="w-5 h-5 text-green-400 mr-2" />
          <span className="text-green-400">Secure Payment</span>
          <Lock className="w-4 h-4 text-green-400 ml-2" />
        </div>
        <p className="text-muted-foreground text-sm mb-3">
          Your payment is secured with 256-bit SSL encryption. All payments are transferred directly to 
          Muhammad Izzaddin Bin Idris account (Ijaxt VPN owner).
        </p>
        <div className="text-xs text-muted-foreground">
          {SECURITY_FEATURES.map((feature, index) => (
            <p key={index}>• {feature}</p>
          ))}
        </div>
      </Card>

      <Card className="fire-card p-4 rounded-lg">
        <div className="flex items-center mb-2">
          <AlertCircle className="w-4 h-4 text-green-400 mr-2" />
          <span className="text-green-400 text-sm">Payment Instructions</span>
        </div>
        <div className="text-xs text-muted-foreground space-y-1">
          {PAYMENT_INSTRUCTIONS.map((instruction, index) => (
            <p key={index}>{index + 1}. {instruction}</p>
          ))}
        </div>
      </Card>
    </div>
  );
}