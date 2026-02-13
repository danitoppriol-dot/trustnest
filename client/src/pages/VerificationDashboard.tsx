import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Clock, AlertCircle, Upload, Shield, FileText, Camera, Phone, Mail } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/lib/translations";

export default function VerificationDashboard() {
  const { user } = useAuth();
  const { language } = useLanguage();
  const defaultUserType = (user?.userType === "tenant" || user?.userType === "landlord" ? user.userType : "tenant") as "tenant" | "landlord";
  const [userType, setUserType] = useState<"tenant" | "landlord">(defaultUserType);
  const [verificationStep, setVerificationStep] = useState(0);

  const tenantVerificationSteps = [
    { id: 0, label: "Email", icon: Mail, description: "Verify your email address" },
    { id: 1, label: "Phone", icon: Phone, description: "Verify your phone number" },
    { id: 2, label: "ID", icon: FileText, description: "Upload government ID" },
    { id: 3, label: "Selfie", icon: Camera, description: "Selfie with liveness detection" },
  ];

  const landlordVerificationSteps = [
    { id: 0, label: "Email", icon: Mail, description: "Verify your email address" },
    { id: 1, label: "Phone", icon: Phone, description: "Verify your phone number" },
    { id: 2, label: "ID", icon: FileText, description: "Upload government ID" },
    { id: 3, label: "Company", icon: FileText, description: "Company registration (optional)" },
    { id: 4, label: "Property", icon: FileText, description: "Property deed/ownership proof" },
  ];

  const steps = userType === "tenant" ? tenantVerificationSteps : landlordVerificationSteps;
  const completedSteps = Math.min(verificationStep, steps.length);
  const progressPercentage = (completedSteps / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Identity Verification</h1>
          <p className="text-slate-600">Complete your verification to unlock all features and get your trust badge</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Role Selection */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Are you a tenant or landlord?</CardTitle>
            <CardDescription>Choose your role to get started with the right verification process</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => setUserType("tenant")}
                className={`p-6 rounded-lg border-2 transition-all ${
                  userType === "tenant"
                    ? "border-blue-600 bg-blue-50"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className="text-2xl mb-2">🏠</div>
                <h3 className="font-semibold text-slate-900 mb-1">Tenant</h3>
                <p className="text-sm text-slate-600">Looking for a place to live</p>
              </button>

              <button
                onClick={() => setUserType("landlord")}
                className={`p-6 rounded-lg border-2 transition-all ${
                  userType === "landlord"
                    ? "border-green-600 bg-green-50"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className="text-2xl mb-2">🏢</div>
                <h3 className="font-semibold text-slate-900 mb-1">Landlord</h3>
                <p className="text-sm text-slate-600">Renting out properties</p>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Progress Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Verification Progress</CardTitle>
            <CardDescription>Complete all steps to get your trust badge</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-slate-700">
                    {completedSteps} of {steps.length} steps completed
                  </span>
                  <span className="text-sm font-bold text-blue-600">{Math.round(progressPercentage)}%</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>

              {/* Trust Badge */}
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-3">
                  {progressPercentage === 100 ? (
                    <>
                      <CheckCircle2 className="w-8 h-8 text-green-600" />
                      <div>
                        <p className="font-semibold text-slate-900">Verified!</p>
                        <p className="text-sm text-slate-600">Your trust badge is now active</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <Clock className="w-8 h-8 text-blue-600" />
                      <div>
                        <p className="font-semibold text-slate-900">In Progress</p>
                        <p className="text-sm text-slate-600">Complete all steps to get verified</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Verification Steps */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Steps List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Steps</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {steps.map((step, index) => {
                    const isCompleted = index < completedSteps;
                    const isCurrent = index === verificationStep;

                    return (
                      <button
                        key={step.id}
                        onClick={() => setVerificationStep(index)}
                        className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                          isCurrent
                            ? "border-blue-600 bg-blue-50"
                            : isCompleted
                              ? "border-green-600 bg-green-50"
                              : "border-slate-200 bg-white hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {isCompleted ? (
                            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-slate-300 flex items-center justify-center text-xs font-bold text-slate-600">
                              {index + 1}
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-slate-900">{step.label}</p>
                            <p className="text-xs text-slate-600">{step.description}</p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Step Details */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  {steps[verificationStep] && (
                    <>
                      {steps[verificationStep].icon && (() => {
                        const Icon = steps[verificationStep].icon;
                        return <Icon className="w-6 h-6 text-blue-600" />;
                      })()}
                      <div>
                        <CardTitle>{steps[verificationStep].label}</CardTitle>
                        <CardDescription>{steps[verificationStep].description}</CardDescription>
                      </div>
                    </>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <VerificationStepContent
                  step={verificationStep}
                  userType={userType}
                  onComplete={() => {
                    if (verificationStep < steps.length - 1) {
                      setVerificationStep(verificationStep + 1);
                    }
                  }}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

interface VerificationStepContentProps {
  step: number;
  userType: "tenant" | "landlord";
  onComplete: () => void;
}

function VerificationStepContent({ step, userType, onComplete }: VerificationStepContentProps) {
  const [isVerified, setIsVerified] = useState(false);
  const [input, setInput] = useState("");

  const stepTitles = {
    0: "Email Verification",
    1: "Phone Verification",
    2: "Government ID",
    3: "Selfie with Liveness Detection",
    4: "Property Deed",
  };

  const stepDescriptions = {
    0: "We'll send a verification code to your email. Check your inbox and enter the code below.",
    1: "We'll send an OTP to your phone. Enter the code to verify your phone number.",
    2: "Upload a clear photo of your government-issued ID (passport, driver's license, etc.)",
    3: "Take a selfie and we'll verify it's really you using liveness detection.",
    4: "Upload property deed, ownership certificate, or rental agreement.",
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-900">{stepDescriptions[step as keyof typeof stepDescriptions]}</p>
        </div>
      </div>

      {step === 0 || step === 1 ? (
        <div className="space-y-4">
          <div>
            <Label htmlFor="code">Verification Code</Label>
            <Input
              id="code"
              placeholder="Enter 6-digit code"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={6}
              className="mt-2"
            />
          </div>
          <Button onClick={() => setIsVerified(true)} className="w-full">
            Verify Code
          </Button>
        </div>
      ) : step === 2 || step === 4 ? (
        <div className="space-y-4">
          <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-slate-400 transition-colors cursor-pointer">
            <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-900">Click to upload document</p>
            <p className="text-xs text-slate-500 mt-1">PNG, JPG, PDF up to 10MB</p>
          </div>
          <Button onClick={() => setIsVerified(true)} className="w-full">
            Upload & Continue
          </Button>
        </div>
      ) : step === 3 ? (
        <div className="space-y-4">
          <div className="bg-slate-100 rounded-lg aspect-video flex items-center justify-center">
            <div className="text-center">
              <Camera className="w-12 h-12 text-slate-400 mx-auto mb-2" />
              <p className="text-sm text-slate-600">Camera would activate here</p>
            </div>
          </div>
          <Button onClick={() => setIsVerified(true)} className="w-full">
            Take Selfie & Continue
          </Button>
        </div>
      ) : null}

      {isVerified && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
          <div>
            <p className="font-medium text-green-900">Verified!</p>
            <p className="text-sm text-green-800">This step is complete</p>
          </div>
        </div>
      )}

      {isVerified && (
        <Button onClick={onComplete} className="w-full bg-green-600 hover:bg-green-700">
          Continue to Next Step
        </Button>
      )}
    </div>
  );
}
