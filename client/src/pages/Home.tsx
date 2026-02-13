import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { Shield, Users, Home, Search, MessageSquare, TrendingUp } from "lucide-react";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/lib/translations";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function HomePage() {
  const { isAuthenticated, logout } = useAuth();
  let language: 'en' | 'it' | 'fr' | 'de' | 'es' | 'sv' | 'pt' | 'nl' = 'en';
  try {
    const ctx = useLanguage();
    language = ctx.language;
  } catch (e) {
    // Language context not available, use default
  }

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
                  <a className="text-slate-600 hover:text-slate-900 font-medium">{t('nav.properties', language)}</a>
                </Link>
                <Link href="/matching">
                  <a className="text-slate-600 hover:text-slate-900 font-medium">{t('nav.matching', language)}</a>
                </Link>
                <Link href="/messages">
                  <a className="text-slate-600 hover:text-slate-900 font-medium">{t('nav.messages', language)}</a>
                </Link>
                <Link href="/profile">
                  <a className="text-slate-600 hover:text-slate-900 font-medium">{t('nav.profile', language)}</a>
                </Link>
                <Button variant="outline" size="sm" onClick={logout}>
                  {t('nav.logout', language)}
                </Button>
              </>
            ) : (
              <Button asChild>
                <a href={getLoginUrl()}>{t('nav.login', language)}</a>
              </Button>
            )}
            <LanguageSwitcher />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              {t('hero.title', language)}
            </h1>
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              {t('hero.subtitle', language)}
            </p>
            <div className="flex gap-4">
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                <a href={getLoginUrl()}>{t('hero.cta.start', language)}</a>
              </Button>
              <Button variant="outline" size="lg">
                {t('hero.cta.learn', language)}
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
          <h2 className="text-4xl font-bold text-slate-900 mb-4 text-center">{t('features.title', language)}</h2>
          <p className="text-xl text-slate-600 mb-12 text-center max-w-2xl mx-auto">
            {t('features.subtitle', language)}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Shield className="w-8 h-8 text-green-600" />}
              title={t('features.verification.title', language)}
              description={t('features.verification.desc', language)}
            />
            <FeatureCard
              icon={<Users className="w-8 h-8 text-blue-600" />}
              title={t('features.matching.title', language)}
              description={t('features.matching.desc', language)}
            />
            <FeatureCard
              icon={<Home className="w-8 h-8 text-purple-600" />}
              title={t('features.properties.title', language)}
              description={t('features.properties.desc', language)}
            />
            <FeatureCard
              icon={<MessageSquare className="w-8 h-8 text-orange-600" />}
              title={t('features.messaging.title', language)}
              description={t('features.messaging.desc', language)}
            />
            <FeatureCard
              icon={<Search className="w-8 h-8 text-red-600" />}
              title={t('features.search.title', language)}
              description={t('features.search.desc', language)}
            />
            <FeatureCard
              icon={<TrendingUp className="w-8 h-8 text-indigo-600" />}
              title={t('features.community.title', language)}
              description={t('features.community.desc', language)}
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-slate-900 mb-12 text-center">{t('howitworks.title', language)}</h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <StepCard
              number="1"
              title={t('howitworks.step1.title', language)}
              description={t('howitworks.step1.desc', language)}
            />
            <StepCard
              number="2"
              title={t('howitworks.step2.title', language)}
              description={t('howitworks.step2.desc', language)}
            />
            <StepCard
              number="3"
              title={t('howitworks.step3.title', language)}
              description={t('howitworks.step3.desc', language)}
            />
            <StepCard
              number="4"
              title={t('howitworks.step4.title', language)}
              description={t('howitworks.step4.desc', language)}
            />
          </div>
        </div>
      </section>

      {/* Trust & Security */}
      <section className="bg-blue-50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-slate-900 mb-12 text-center">{t('trust.title', language)}</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TrustCard
              icon="🔐"
              title={t('trust.gdpr.title', language)}
              description={t('trust.gdpr.desc', language)}
            />
            <TrustCard
              icon="✅"
              title={t('trust.verification.title', language)}
              description={t('trust.verification.desc', language)}
            />
            <TrustCard
              icon="🛡️"
              title={t('trust.fraud.title', language)}
              description={t('trust.fraud.desc', language)}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-green-600 py-20 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">{t('cta.title', language)}</h2>
          <p className="text-xl mb-8 opacity-90">
            {t('cta.subtitle', language)}
          </p>
          <a href={getLoginUrl()} className="inline-block">
            <Button size="lg" variant="secondary">
              {t('cta.button', language)}
            </Button>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold mb-4">TrustNest</h3>
              <p className="text-slate-400">{t('footer.tagline', language)}</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">{t('footer.product', language)}</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white">{t('nav.properties', language)}</a></li>
                <li><a href="#" className="hover:text-white">{t('nav.matching', language)}</a></li>
                <li><a href="#" className="hover:text-white">{t('nav.messages', language)}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">{t('footer.company', language)}</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">{t('footer.legal', language)}</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white">Privacy</a></li>
                <li><a href="#" className="hover:text-white">Terms</a></li>
                <li><a href="#" className="hover:text-white">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-slate-400">
            <p>{t('footer.copyright', language)}</p>
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
