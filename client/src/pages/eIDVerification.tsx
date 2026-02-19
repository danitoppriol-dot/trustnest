import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Lock, Globe, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/lib/translations";

function safeUseLanguage() {
  try {
    return useLanguage();
  } catch {
    return { language: "en" };
  }
}

interface eIDProvider {
  id: string;
  name: string;
  country: string;
  icon: string;
  description: string;
}

const eIDProviders: eIDProvider[] = [
  {
    id: "spid",
    name: "SPID",
    country: "Italy",
    icon: "🇮🇹",
    description: "Sistema Pubblico di Identità Digitale",
  },
  {
    id: "cie",
    name: "CIE",
    country: "Italy",
    icon: "🇮🇹",
    description: "Carta d'Identità Elettronica",
  },
  {
    id: "bankid",
    name: "BankID",
    country: "Sweden",
    icon: "🇸🇪",
    description: "Swedish BankID",
  },
  {
    id: "freja",
    name: "Freja eID",
    country: "Sweden",
    icon: "🇸🇪",
    description: "Swedish Freja eID+",
  },
  {
    id: "eid",
    name: "eID",
    country: "Germany",
    icon: "🇩🇪",
    description: "German Personalausweis",
  },
  {
    id: "franceconnect",
    name: "FranceConnect",
    country: "France",
    icon: "🇫🇷",
    description: "French Government eID",
  },
  {
    id: "clave",
    name: "cl@ve",
    country: "Spain",
    icon: "🇪🇸",
    description: "Spanish Government eID",
  },
  {
    id: "luxtrust",
    name: "LuxTrust",
    country: "Luxembourg",
    icon: "🇱🇺",
    description: "Luxembourg eID",
  },
  {
    id: "digid",
    name: "DigiD",
    country: "Netherlands",
    icon: "🇳🇱",
    description: "Dutch Government eID",
  },
];

export default function eIDVerification() {
  const { language } = safeUseLanguage();
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleeIDLogin = async (providerId: string) => {
    setIsAuthenticating(true);
    setSelectedProvider(providerId);

    // For SPID and CIE, redirect to SAML login
    if (providerId === "spid" || providerId === "cie") {
      // Redirect to SAML login endpoint
      window.location.href = "/api/auth/saml/login";
    } else {
      // For other providers, show coming soon message
      setTimeout(() => {
        alert(`${providerId} integration coming soon!`);
        setIsAuthenticating(false);
        setSelectedProvider(null);
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Verify with eID</h1>
          <p className="text-slate-600">
            Use your national electronic ID to instantly verify your identity and complete your TrustNest profile
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Benefits Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardContent className="pt-6">
              <CheckCircle2 className="w-8 h-8 text-green-600 mb-4" />
              <h3 className="font-semibold text-slate-900 mb-2">Instant Verification</h3>
              <p className="text-sm text-slate-600">
                Complete your identity verification in seconds using your official eID
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <Lock className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="font-semibold text-slate-900 mb-2">Secure & Encrypted</h3>
              <p className="text-sm text-slate-600">
                Your data is protected by government-grade encryption and GDPR compliance
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <Globe className="w-8 h-8 text-purple-600 mb-4" />
              <h3 className="font-semibold text-slate-900 mb-2">EU-Wide Support</h3>
              <p className="text-sm text-slate-600">
                Works with eID systems from all EU countries via eIDAS regulation
              </p>
            </CardContent>
          </Card>
        </div>

        {/* How It Works */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
            <CardDescription>Simple 3-step verification process</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">Select Your eID</h4>
                  <p className="text-sm text-slate-600">Choose your country's electronic ID system below</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">Authenticate</h4>
                  <p className="text-sm text-slate-600">You'll be securely redirected to your eID provider</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">Verified!</h4>
                  <p className="text-sm text-slate-600">Your identity is verified and your trust badge is activated</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* eID Providers Grid */}
        <Card>
          <CardHeader>
            <CardTitle>Select Your Electronic ID</CardTitle>
            <CardDescription>Choose the eID system from your country</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {eIDProviders.map((provider) => (
                <button
                  key={provider.id}
                  onClick={() => handleeIDLogin(provider.id)}
                  disabled={isAuthenticating && selectedProvider !== provider.id}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    selectedProvider === provider.id
                      ? "border-blue-600 bg-blue-50"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="text-3xl">{provider.icon}</div>
                    {selectedProvider === provider.id && isAuthenticating && (
                      <div className="animate-spin">⏳</div>
                    )}
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-1">{provider.name}</h3>
                  <p className="text-xs text-slate-600 mb-3">{provider.description}</p>
                  <p className="text-xs font-medium text-slate-500">{provider.country}</p>

                  {selectedProvider === provider.id && isAuthenticating ? (
                    <div className="mt-3 text-sm text-blue-600 font-medium">
                      Authenticating...
                    </div>
                  ) : (
                    <div className="mt-3 flex items-center gap-1 text-sm text-blue-600 font-medium">
                      Login <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900">
                <strong>Privacy Notice:</strong> When you click "Login", you'll be securely redirected to your country's official eID provider.
                We will only receive verified identity information with your explicit consent. Your data is never stored on our servers
                without your authorization.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-semibold text-slate-900 mb-2">What is eID?</h4>
              <p className="text-sm text-slate-600">
                Electronic ID (eID) is a government-issued digital identity that proves who you are online. Each EU country has its own eID system
                that meets the eIDAS regulation standards.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 mb-2">Is my data safe?</h4>
              <p className="text-sm text-slate-600">
                Yes. eID systems use military-grade encryption and are regulated by government authorities. We never store your raw identity data
                - only verified attributes that you authorize us to access.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 mb-2">What if I don't have eID?</h4>
              <p className="text-sm text-slate-600">
                You can still verify your identity using our traditional verification methods (ID upload, selfie, OTP). eID is just a faster option.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 mb-2">Which countries are supported?</h4>
              <p className="text-sm text-slate-600">
                We support eID systems from all EU countries (Italy, Sweden, Germany, France, Spain, Luxembourg, Netherlands, and more) via the eIDAS
                framework.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
