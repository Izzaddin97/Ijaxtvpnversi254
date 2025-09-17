import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { 
  CheckCircle, 
  Download, 
  Mail, 
  Copy, 
  ExternalLink,
  Crown,
  Rocket,
  Shield,
  User,
  CreditCard,
  Building2,
  Smartphone
} from "lucide-react";
import { useState } from "react";

interface PaymentSuccessProps {
  paymentDetails: {
    vpnPlan: string;
    amount: string;
    billingCycle: string;
    method: string;
    transactionId: string;
    email: string;
    timestamp: string;
    recipientAccount: {
      accountName: string;
      [key: string]: any;
    };
  };
  onClose: () => void;
}

export function PaymentSuccess({ paymentDetails, onClose }: PaymentSuccessProps) {
  const [copied, setCopied] = useState(false);

  const copyTransactionId = () => {
    navigator.clipboard.writeText(paymentDetails.transactionId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadReceipt = () => {
    const recipient = paymentDetails.recipientAccount;
    let accountInfo = '';
    
    if (paymentDetails.method === 'card') {
      accountInfo = `
Recipient Account Details:
Account Holder: ${recipient.accountName}
Card Type: ${recipient.cardType}
Card Number: ${recipient.cardNumber}
Expiry Date: ${recipient.expiryDate}`;
    } else if (paymentDetails.method === 'bank') {
      accountInfo = `
Recipient Account Details:
Account Holder: ${recipient.accountName}
Bank: ${recipient.bankName}
Account Number: ${recipient.accountNumber}`;
    } else if (paymentDetails.method === 'ewallet') {
      accountInfo = `
Recipient Account Details:
Account Holder: ${recipient.accountName}
Provider: ${recipient.provider}
Phone Number: ${recipient.phoneNumber}`;
    }

    const receiptData = `
=============================================
           IJAXT VPN - PAYMENT RECEIPT
=============================================

Transaction Details:
VPN Plan: ${paymentDetails.vpnPlan}
Billing Cycle: ${paymentDetails.billingCycle}
Amount Paid: ${paymentDetails.amount}
Payment Method: ${paymentDetails.method.toUpperCase()}
Transaction ID: ${paymentDetails.transactionId}
Customer Email: ${paymentDetails.email}
Payment Date: ${new Date(paymentDetails.timestamp).toLocaleString()}
${accountInfo}

Payment Status: COMPLETED
Funds Transferred To: Muhammad Izzaddin Bin Idris (Ijaxt VPN)

=============================================

Next Steps:
1. Check your email for VPN setup instructions
2. Download the VPN client application
3. Use your login credentials to connect
4. Start browsing securely!

For support, contact us with Transaction ID: ${paymentDetails.transactionId}

Thank you for choosing Ijaxt VPN!
Visit: https://ijaxt-vpn.com
Support: support@ijaxt-vpn.com

=============================================
    `;
    
    const blob = new Blob([receiptData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ijaxt-vpn-receipt-${paymentDetails.transactionId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getVPNIcon = () => {
    if (paymentDetails.vpnPlan.includes('NordVPN')) return <Crown className="w-8 h-8 text-green-400" />;
    if (paymentDetails.vpnPlan.includes('ExpressVPN')) return <Rocket className="w-8 h-8 text-green-400" />;
    return <Shield className="w-8 h-8 text-green-400" />;
  };

  const getPaymentIcon = () => {
    if (paymentDetails.method === 'card') return <CreditCard className="w-4 h-4" />;
    if (paymentDetails.method === 'bank') return <Building2 className="w-4 h-4" />;
    if (paymentDetails.method === 'ewallet') return <Smartphone className="w-4 h-4" />;
    return <Shield className="w-4 h-4" />;
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto fire-card">
        <div className="p-8">
          {/* Success Animation */}
          <div className="text-center mb-8">
            <div className="relative mb-6 payment-success-animation">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 fire-effect">
                <CheckCircle className="w-12 h-12 text-black" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 border-2 border-green-400 rounded-full animate-ping opacity-75"></div>
              </div>
            </div>

            <h2 className="text-3xl fire-text mb-2">Payment Successful!</h2>
            <p className="text-muted-foreground mb-2">
              Your payment has been processed successfully and transferred to Muhammad Izzaddin Bin Idris (Ijaxt VPN owner).
            </p>
            <Badge className="bg-green-500 text-black">
              {paymentDetails.billingCycle === 'yearly' ? 'Annual Subscription' : 'Monthly Subscription'}
            </Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Payment Details */}
            <div className="fire-card p-6 rounded-lg">
              <h3 className="text-lg text-green-400 mb-4 text-center">Payment Summary</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">VPN Plan:</span>
                  <div className="flex items-center">
                    {getVPNIcon()}
                    <span className="ml-2 text-green-400">{paymentDetails.vpnPlan}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Billing Cycle:</span>
                  <span className="text-green-400 capitalize">{paymentDetails.billingCycle}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Amount Paid:</span>
                  <span className="text-green-400 fire-text">{paymentDetails.amount}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Payment Method:</span>
                  <div className="flex items-center">
                    {getPaymentIcon()}
                    <Badge className="ml-2 bg-green-500 text-black capitalize">{paymentDetails.method}</Badge>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Transaction ID:</span>
                  <div className="flex items-center">
                    <code className="transaction-id text-xs mr-2">{paymentDetails.transactionId}</code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={copyTransactionId}
                      className="h-6 w-6 p-0"
                    >
                      {copied ? <CheckCircle className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span className="text-green-400">{paymentDetails.email}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Date:</span>
                  <span className="text-muted-foreground">{new Date(paymentDetails.timestamp).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Recipient Details */}
            <div className="fire-card p-6 rounded-lg">
              <h3 className="text-lg text-green-400 mb-4 text-center">Payment Recipient</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-center mb-4">
                  <User className="w-8 h-8 text-green-400 mr-2" />
                  <span className="text-green-400">{paymentDetails.recipientAccount.accountName}</span>
                </div>

                {paymentDetails.method === 'card' && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Card Type:</span>
                      <span className="text-green-400">{paymentDetails.recipientAccount.cardType}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Card Number:</span>
                      <code className="transaction-id text-xs">{paymentDetails.recipientAccount.cardNumber}</code>
                    </div>
                  </>
                )}

                {paymentDetails.method === 'bank' && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Bank:</span>
                      <span className="text-green-400">{paymentDetails.recipientAccount.bankName}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Account Number:</span>
                      <code className="transaction-id text-xs">{paymentDetails.recipientAccount.accountNumber}</code>
                    </div>
                  </>
                )}

                {paymentDetails.method === 'ewallet' && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Provider:</span>
                      <span className="text-green-400">{paymentDetails.recipientAccount.provider}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Phone Number:</span>
                      <code className="transaction-id text-xs">{paymentDetails.recipientAccount.phoneNumber}</code>
                    </div>
                  </>
                )}

                <div className="mt-4 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                  <p className="text-xs text-center text-green-400">
                    ✓ Payment successfully transferred to Ijaxt VPN account
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="fire-card p-6 rounded-lg mb-6">
            <h3 className="text-lg text-green-400 mb-4 text-center">What's Next?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="text-center p-4 rounded-lg bg-green-500/5 border border-green-500/20">
                <Mail className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <p className="text-muted-foreground">Check your email for VPN credentials and setup instructions</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-green-500/5 border border-green-500/20">
                <Download className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <p className="text-muted-foreground">Download the VPN client for your device</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-green-500/5 border border-green-500/20">
                <Shield className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <p className="text-muted-foreground">Start browsing securely with your new VPN</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={downloadReceipt}
              className="bg-green-600 hover:bg-green-500 text-black"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Receipt
            </Button>
            
            <Button
              onClick={() => {
                document.getElementById('setup')?.scrollIntoView({ behavior: 'smooth' });
                onClose();
              }}
              className="bg-green-500 hover:bg-green-400 text-black"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Setup Guide
            </Button>
            
            <Button
              variant="outline"
              onClick={onClose}
              className="border-green-400 text-green-400 hover:bg-green-400 hover:text-black"
            >
              Close
            </Button>
          </div>

          {/* Support Notice */}
          <div className="mt-6 text-center">
            <p className="text-muted-foreground text-sm">
              Need help? Contact our support team with transaction ID: 
              <code className="transaction-id ml-2">{paymentDetails.transactionId}</code>
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Account activation typically takes 1-2 hours. You will receive email confirmation.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
