import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { Shield, Users, Home, Search, MessageSquare, TrendingUp } from "lucide-react";
import { Link } from "wouter";

export default function HomePage() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-slate-200 sticky top-0 z-50 bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-2xl">🏠</div>
            <span className="text-xl font-bold text-slate-900">TrustNest</span>
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link href="/properties">
                  <a className="text-slate-600 hover:text-slate-900 font-medium">Proprietà</a>
                </Link>
                <Link href="/matching">
                  <a className="text-slate-600 hover:text-slate-900 font-medium">Matching</a>
                </Link>
                <Link href="/messages">
                  <a className="text-slate-600 hover:text-slate-900 font-medium">Messaggi</a>
                </Link>
                <Link href="/profile">
                  <a className="text-slate-600 hover:text-slate-900 font-medium">Profilo</a>
                </Link>
                <Button variant="outline" size="sm" onClick={logout}>
                  Esci
                </Button>
              </>
            ) : (
                <a href={getLoginUrl()} className="inline-block">
                <Button>Accedi</Button>
              </a>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              Trova il tuo coliving perfetto in sicurezza
            </h1>
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              TrustNest verifica identità di landlord e tenant, calcola compatibilità con AI e crea comunità di coliving affidabili. Zero scam, massima fiducia.
            </p>
            <div className="flex gap-4">
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                <a href={getLoginUrl()}>Inizia ora</a>
              </Button>
              <Button variant="outline" size="lg">
                Scopri di più
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="w-full h-96 bg-gradient-to-br from-blue-100 to-green-100 rounded-2xl flex items-center justify-center shadow-lg">
              <div className="text-6xl">🏠</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-slate-50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-slate-900 mb-4 text-center">Perché scegliere TrustNest?</h2>
          <p className="text-xl text-slate-600 mb-12 text-center max-w-2xl mx-auto">
            Una piattaforma completa per trovare il tuo coliving ideale con massima sicurezza e compatibilità
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Shield className="w-8 h-8 text-green-600" />}
              title="Verifica identità completa"
              description="ID governativo, selfie con liveness detection, verifica email e telefono OTP. Trust badge binario per massima trasparenza."
            />
            <FeatureCard
              icon={<Users className="w-8 h-8 text-blue-600" />}
              title="Matching AI avanzato"
              description="Algoritmo di compatibilità basato su budget, orari, pulizia, lifestyle e animali. Percentuale match con spiegazione dettagliata."
            />
            <FeatureCard
              icon={<Home className="w-8 h-8 text-purple-600" />}
              title="Annunci verificati"
              description="Proprietà pubblicate solo da landlord verificati. Foto, descrizione dettagliata, filtri per città, prezzo e amenità."
            />
            <FeatureCard
              icon={<MessageSquare className="w-8 h-8 text-orange-600" />}
              title="Messaggistica real-time"
              description="Comunica direttamente con landlord e potenziali roommate. Conversazioni one-to-one con cronologia completa."
            />
            <FeatureCard
              icon={<Search className="w-8 h-8 text-red-600" />}
              title="Ricerca avanzata"
              description="Filtra per città, prezzo, numero camere, amenità. Ordina per prezzo o data. Trova esattamente quello che cerchi."
            />
            <FeatureCard
              icon={<TrendingUp className="w-8 h-8 text-indigo-600" />}
              title="Comunità affidabile"
              description="Profili verificati, review e rating. Costruisci relazioni durature con persone compatibili e affidabili."
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-slate-900 mb-12 text-center">Come funziona</h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <StepCard
              number="1"
              title="Registrati"
              description="Crea il tuo profilo con informazioni personali e preferenze di coliving"
            />
            <StepCard
              number="2"
              title="Verifica identità"
              description="Completa le verifiche per ottenere il badge di fiducia e sbloccare tutte le funzioni"
            />
            <StepCard
              number="3"
              title="Trova match"
              description="Scopri proprietà e roommate compatibili con il nostro algoritmo AI"
            />
            <StepCard
              number="4"
              title="Connettiti"
              description="Messaggia direttamente e organizza visite. Inizia il tuo coliving perfetto!"
            />
          </div>
        </div>
      </section>

      {/* Trust & Security */}
      <section className="bg-blue-50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-slate-900 mb-12 text-center">Sicurezza e fiducia</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TrustCard
              icon="🔐"
              title="GDPR Compliant"
              description="Tutti i documenti sono crittografati e archiviati in sicurezza secondo le normative GDPR"
            />
            <TrustCard
              icon="✅"
              title="Verifica a 4 livelli"
              description="Email, telefono OTP, ID governativo e selfie con liveness detection per massima sicurezza"
            />
            <TrustCard
              icon="🛡️"
              title="Zero scam"
              description="Algoritmo di rilevamento frodi e revisione manuale degli annunci sospetti"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-green-600 py-20 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Pronto a trovare il tuo coliving perfetto?</h2>
          <p className="text-xl mb-8 opacity-90">
            Unisciti a migliaia di persone che hanno trovato la loro comunità ideale su TrustNest
          </p>
          <Button asChild size="lg" variant="secondary">
            <a href={getLoginUrl()}>Inizia gratuitamente</a>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold mb-4">TrustNest</h3>
              <p className="text-slate-400">La piattaforma di coliving più sicura d'Europa</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Prodotto</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white">Proprietà</a></li>
                <li><a href="#" className="hover:text-white">Matching</a></li>
                <li><a href="#" className="hover:text-white">Messaggi</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Azienda</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white">Chi siamo</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Contatti</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legale</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white">Privacy</a></li>
                <li><a href="#" className="hover:text-white">Termini</a></li>
                <li><a href="#" className="hover:text-white">Cookie</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-slate-400">
            <p>&copy; 2026 TrustNest. Tutti i diritti riservati.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="pt-6">
        <div className="mb-4">{icon}</div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
        <p className="text-slate-600">{description}</p>
      </CardContent>
    </Card>
  );
}

function StepCard({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="text-center">
      <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
        {number}
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600">{description}</p>
    </div>
  );
}

function TrustCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <Card>
      <CardContent className="pt-6 text-center">
        <div className="text-4xl mb-4">{icon}</div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
        <p className="text-slate-600">{description}</p>
      </CardContent>
    </Card>
  );
}
