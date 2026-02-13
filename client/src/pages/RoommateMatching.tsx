import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Heart, X, MessageCircle } from "lucide-react";

export default function RoommateMatching() {
  const { data: allUsers, isLoading } = trpc.auth.me.useQuery();
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [matchResult, setMatchResult] = useState<any>(null);
  const calculateCompatibility = trpc.matching.calculateCompatibility.useQuery(
    { targetUserId: selectedUserId || 0 },
    { enabled: selectedUserId !== null }
  );

  const handleSelectUser = (userId: number) => {
    setSelectedUserId(userId);
  };

  const handleLike = () => {
    // TODO: Save match as liked
    setMatchResult(null);
    setSelectedUserId(null);
  };

  const handlePass = () => {
    setMatchResult(null);
    setSelectedUserId(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Trova il tuo roommate perfetto</h1>
          <p className="text-slate-600">Algoritmo AI di compatibilità per coliving ideale</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-slate-500">Caricamento profili...</div>
            </div>
          ) : matchResult ? (
            <MatchCard
              result={matchResult}
              onLike={handleLike}
              onPass={handlePass}
            />
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-600 mb-6">Seleziona un utente per vedere la compatibilità</p>
              <Button onClick={() => setSelectedUserId(1)}>Inizia il matching</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MatchCard({ result, onLike, onPass }: any) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-green-100";
    if (score >= 60) return "bg-yellow-100";
    return "bg-red-100";
  };

  return (
    <Card className="overflow-hidden shadow-lg">
      {/* Profile Header */}
      <div className="w-full h-64 bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center">
        <div className="text-blue-400 text-6xl">👤</div>
      </div>

      <CardHeader>
        <CardTitle className="text-2xl">Compatibilità trovata!</CardTitle>
        <CardDescription>Basato su preferenze e stile di vita</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Overall Score */}
        <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Punteggio di compatibilità</h3>
            <div className={`text-4xl font-bold ${getScoreColor(result.compatibilityScore)}`}>
              {result.compatibilityScore}%
            </div>
          </div>
          <Progress value={result.compatibilityScore} className="h-3" />
        </div>

        {/* Breakdown */}
        <div className="space-y-4">
          <h4 className="font-semibold text-slate-900">Dettagli compatibilità</h4>

          <CompatibilityRow
            label="Budget"
            score={result.budgetMatch}
            icon="💰"
          />
          <CompatibilityRow
            label="Orari sonno"
            score={result.scheduleMatch}
            icon="😴"
          />
          <CompatibilityRow
            label="Pulizia"
            score={result.cleanlinessMatch}
            icon="🧹"
          />
          <CompatibilityRow
            label="Stile di vita"
            score={result.lifestyleMatch}
            icon="🎉"
          />
          <CompatibilityRow
            label="Animali"
            score={result.petsMatch}
            icon="🐾"
          />
        </div>

        {/* Explanation */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-slate-700">
            <span className="font-semibold">Perché compatibili:</span> {result.explanation}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <Button
            variant="outline"
            size="lg"
            className="flex-1"
            onClick={onPass}
          >
            <X className="w-5 h-5 mr-2" />
            Passa
          </Button>
          <Button
            size="lg"
            className="flex-1 bg-green-600 hover:bg-green-700"
            onClick={onLike}
          >
            <Heart className="w-5 h-5 mr-2" />
            Mi piace
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="flex-1"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Messaggio
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function CompatibilityRow({ label, score, icon }: { label: string; score: number; icon: string }) {
  const getColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="flex items-center gap-4">
      <span className="text-2xl">{icon}</span>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium text-slate-700">{label}</span>
          <span className={`text-sm font-semibold ${getColor(score)}`}>{score}%</span>
        </div>
        <Progress value={score} className="h-2" />
      </div>
    </div>
  );
}
