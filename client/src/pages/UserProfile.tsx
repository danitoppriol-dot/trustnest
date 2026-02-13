import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, AlertCircle, Upload } from "lucide-react";

export default function UserProfile() {
  const { data: currentUser } = trpc.auth.me.useQuery();
  const { data: profile } = trpc.profile.getProfile.useQuery();
  const { data: verification } = trpc.verification.getStatus.useQuery();
  const updateProfileMutation = trpc.profile.updateProfile.useMutation();

  const [formData, setFormData] = useState({
    age: profile?.age || "",
    nationality: profile?.nationality || "",
    budgetMin: profile?.budgetMin || "",
    budgetMax: profile?.budgetMax || "",
    workType: profile?.workType || "",
    sleepSchedule: profile?.sleepSchedule || "",
    cleanlinessLevel: profile?.cleanlinessLevel || 3,
    smokingPreference: profile?.smokingPreference || "",
    drinkingPreference: profile?.drinkingPreference || "",
    petsAllowed: profile?.petsAllowed || false,
    socialLevel: profile?.socialLevel || 3,
    bio: profile?.bio || "",
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async () => {
    const dataToSend: any = {
      ...formData,
      age: typeof formData.age === 'string' ? parseInt(formData.age) : formData.age,
      budgetMin: typeof formData.budgetMin === 'string' ? parseInt(formData.budgetMin) : formData.budgetMin,
      budgetMax: typeof formData.budgetMax === 'string' ? parseInt(formData.budgetMax) : formData.budgetMax,
    };
    await updateProfileMutation.mutateAsync(dataToSend);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Il mio profilo</h1>
          <p className="text-slate-600">Gestisci le tue informazioni e preferenze</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Trust Badge Section */}
          <Card className="mb-6 border-2 border-blue-200 bg-blue-50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Stato di verifica</CardTitle>
                  <CardDescription>Completa le verifiche per ottenere il badge di fiducia</CardDescription>
                </div>
                <div className="text-right">
                  {verification?.trustBadge === "verified" ? (
                    <Badge className="bg-green-600 text-white">
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Verificato
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="border-yellow-600 text-yellow-600">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      Non verificato
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <VerificationItem
                  label="Email"
                  completed={verification?.emailVerified || false}
                />
                <VerificationItem
                  label="Telefono"
                  completed={verification?.phoneVerified || false}
                />
                <VerificationItem
                  label="ID"
                  completed={verification?.idVerified || false}
                />
                <VerificationItem
                  label="Selfie"
                  completed={verification?.selfieVerified || false}
                />
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="profile">Profilo</TabsTrigger>
              <TabsTrigger value="verification">Verifica</TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informazioni personali</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Età</label>
                      <Input
                        type="number"
                        value={formData.age}
                        onChange={(e) => handleInputChange("age", parseInt(e.target.value))}
                        placeholder="Es. 28"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Nazionalità</label>
                      <Input
                        value={formData.nationality}
                        onChange={(e) => handleInputChange("nationality", e.target.value)}
                        placeholder="Es. Italiana"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Bio</label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                      placeholder="Raccontati..."
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Preferenze di coliving</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Budget */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Budget minimo (€)</label>
                      <Input
                        type="number"
                        value={formData.budgetMin}
                        onChange={(e) => handleInputChange("budgetMin", parseInt(e.target.value))}
                        placeholder="Es. 500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Budget massimo (€)</label>
                      <Input
                        type="number"
                        value={formData.budgetMax}
                        onChange={(e) => handleInputChange("budgetMax", parseInt(e.target.value))}
                        placeholder="Es. 1000"
                      />
                    </div>
                  </div>

                  {/* Work Type */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Tipo di lavoro</label>
                    <Select value={formData.workType} onValueChange={(value) => handleInputChange("workType", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleziona..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">Studente</SelectItem>
                        <SelectItem value="remote">Lavoro remoto</SelectItem>
                        <SelectItem value="office">Ufficio</SelectItem>
                        <SelectItem value="freelance">Freelance</SelectItem>
                        <SelectItem value="other">Altro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Sleep Schedule */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Orari sonno</label>
                    <Select value={formData.sleepSchedule} onValueChange={(value) => handleInputChange("sleepSchedule", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleziona..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="early_bird">Mattiniero</SelectItem>
                        <SelectItem value="night_owl">Nottambulo</SelectItem>
                        <SelectItem value="flexible">Flessibile</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Cleanliness Level */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Livello pulizia: {formData.cleanlinessLevel}/5
                    </label>
                    <Slider
                      min={1}
                      max={5}
                      step={1}
                      value={[formData.cleanlinessLevel]}
                      onValueChange={(value) => handleInputChange("cleanlinessLevel", value[0])}
                    />
                  </div>

                  {/* Smoking & Drinking */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Fumo</label>
                      <Select value={formData.smokingPreference} onValueChange={(value) => handleInputChange("smokingPreference", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleziona..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="no_smoking">Non fumo</SelectItem>
                          <SelectItem value="occasional">Occasionalmente</SelectItem>
                          <SelectItem value="regular">Regolarmente</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Alcol</label>
                      <Select value={formData.drinkingPreference} onValueChange={(value) => handleInputChange("drinkingPreference", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleziona..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="no_drinking">Non bevo</SelectItem>
                          <SelectItem value="occasional">Occasionalmente</SelectItem>
                          <SelectItem value="regular">Regolarmente</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Social Level */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Livello sociale: {formData.socialLevel}/5 (Introverso → Estroverso)
                    </label>
                    <Slider
                      min={1}
                      max={5}
                      step={1}
                      value={[formData.socialLevel]}
                      onValueChange={(value) => handleInputChange("socialLevel", value[0])}
                    />
                  </div>
                </CardContent>
              </Card>

              <Button onClick={handleSaveProfile} className="w-full bg-blue-600 hover:bg-blue-700">
                Salva profilo
              </Button>
            </TabsContent>

            {/* Verification Tab */}
            <TabsContent value="verification" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Verifica identità</CardTitle>
                  <CardDescription>Completa tutte le verifiche per ottenere il badge di fiducia</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <VerificationUpload
                    title="Documento d'identità"
                    description="Carica una foto del tuo documento d'identità"
                    icon="🆔"
                    completed={verification?.idVerified || false}
                  />
                  <VerificationUpload
                    title="Selfie"
                    description="Carica un selfie per la verifica del volto"
                    icon="🤳"
                    completed={verification?.selfieVerified || false}
                  />
                  <VerificationUpload
                    title="Email"
                    description="Verifica il tuo indirizzo email"
                    icon="📧"
                    completed={verification?.emailVerified || false}
                  />
                  <VerificationUpload
                    title="Telefono"
                    description="Verifica il tuo numero di telefono con OTP"
                    icon="📱"
                    completed={verification?.phoneVerified || false}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

function VerificationItem({ label, completed }: { label: string; completed: boolean }) {
  return (
    <div className="text-center p-3 bg-white rounded-lg border border-slate-200">
      <p className="text-2xl mb-2">{completed ? "✅" : "⭕"}</p>
      <p className="text-sm font-medium text-slate-700">{label}</p>
    </div>
  );
}

function VerificationUpload({
  title,
  description,
  icon,
  completed,
}: {
  title: string;
  description: string;
  icon: string;
  completed: boolean;
}) {
  return (
    <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
      <div className="flex items-center gap-4">
        <div className="text-3xl">{icon}</div>
        <div>
          <p className="font-medium text-slate-900">{title}</p>
          <p className="text-sm text-slate-600">{description}</p>
        </div>
      </div>
      <div>
        {completed ? (
          <Badge className="bg-green-600">
            <CheckCircle2 className="w-4 h-4 mr-1" />
            Verificato
          </Badge>
        ) : (
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Carica
          </Button>
        )}
      </div>
    </div>
  );
}
