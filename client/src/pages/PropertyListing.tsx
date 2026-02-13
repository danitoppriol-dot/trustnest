import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Euro, Bed, Bath, Maximize2 } from "lucide-react";

export default function PropertyListing() {
  const { data: properties, isLoading } = trpc.properties.getAllActive.useQuery();

  // Filter states
  const [searchCity, setSearchCity] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [minRooms, setMinRooms] = useState<string>("");
  const [sortBy, setSortBy] = useState<"price_asc" | "price_desc" | "newest">("newest");

  // Filter properties
  const filteredProperties = useMemo(() => {
    if (!properties) return [];

    return properties
      .filter((property) => {
        // City filter
        if (searchCity && !property.city.toLowerCase().includes(searchCity.toLowerCase())) {
          return false;
        }

        // Price filter
        const price = Number(property.price);
        if (price < priceRange[0] || price > priceRange[1]) {
          return false;
        }

        // Room count filter
        if (minRooms && minRooms !== "0" && property.roomCount && property.roomCount < parseInt(minRooms)) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        const priceA = Number(a.price);
        const priceB = Number(b.price);

        switch (sortBy) {
          case "price_asc":
            return priceA - priceB;
          case "price_desc":
            return priceB - priceA;
          case "newest":
          default:
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
      });
  }, [properties, searchCity, priceRange, minRooms, sortBy]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Trova la tua proprietà perfetta</h1>
          <p className="text-slate-600">Scopri annunci verificati di proprietari affidabili</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters Section */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Filtra annunci</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* City Search */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Città</label>
              <Input
                placeholder="Es. Milano, Roma..."
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Prezzo: €{priceRange[0]} - €{priceRange[1]}
              </label>
              <Slider
                min={0}
                max={5000}
                step={100}
                value={priceRange}
                onValueChange={(value) => setPriceRange([value[0], value[1]])}
                className="w-full"
              />
            </div>

            {/* Min Rooms */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Camere minime</label>
              <Select value={minRooms || "0"} onValueChange={setMinRooms}>
                <SelectTrigger>
                  <SelectValue placeholder="Qualsiasi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Qualsiasi</SelectItem>
                  <SelectItem value="1">1+ camera</SelectItem>
                  <SelectItem value="2">2+ camere</SelectItem>
                  <SelectItem value="3">3+ camere</SelectItem>
                  <SelectItem value="4">4+ camere</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Ordina per</label>
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Più recenti</SelectItem>
                  <SelectItem value="price_asc">Prezzo: basso → alto</SelectItem>
                  <SelectItem value="price_desc">Prezzo: alto → basso</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-slate-600">
            {isLoading ? "Caricamento..." : `${filteredProperties.length} annunci trovati`}
          </p>
        </div>

        {/* Properties Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-slate-500">Caricamento proprietà...</div>
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="flex items-center justify-center py-12 bg-white rounded-lg border border-slate-200">
            <div className="text-center">
              <p className="text-slate-500 mb-2">Nessuna proprietà trovata</p>
              <p className="text-sm text-slate-400">Prova a modificare i filtri</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function PropertyCard({ property }: { property: any }) {
  return (
    <Card className="hover:shadow-lg transition-shadow overflow-hidden">
      {/* Placeholder Image */}
      <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center">
        <div className="text-blue-400 text-4xl">🏠</div>
      </div>

      <CardHeader>
        <CardTitle className="text-lg text-slate-900">{property.title}</CardTitle>
        <CardDescription className="flex items-center gap-1 text-slate-600">
          <MapPin className="w-4 h-4" />
          {property.city}, {property.country}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <p className="text-slate-600 text-sm mb-4 line-clamp-2">{property.description}</p>

        {/* Property Details */}
        <div className="grid grid-cols-3 gap-2 mb-4 py-3 border-y border-slate-200">
          {property.roomCount && (
            <div className="flex items-center gap-1 text-sm text-slate-700">
              <Bed className="w-4 h-4 text-slate-400" />
              <span>{property.roomCount}</span>
            </div>
          )}
          {property.bathroomCount && (
            <div className="flex items-center gap-1 text-sm text-slate-700">
              <Bath className="w-4 h-4 text-slate-400" />
              <span>{property.bathroomCount}</span>
            </div>
          )}
          {property.squareMeters && (
            <div className="flex items-center gap-1 text-sm text-slate-700">
              <Maximize2 className="w-4 h-4 text-slate-400" />
              <span>{property.squareMeters}m²</span>
            </div>
          )}
        </div>

        {/* Price and CTA */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Euro className="w-5 h-5 text-green-600" />
            <span className="text-2xl font-bold text-slate-900">{property.price}</span>
            <span className="text-slate-600 text-sm">/mese</span>
          </div>
          <Button variant="outline" size="sm">
            Dettagli
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
