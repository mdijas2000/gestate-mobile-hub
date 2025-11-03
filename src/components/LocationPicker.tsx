import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation } from "lucide-react";
import { Card } from "@/components/ui/card";

interface LocationPickerProps {
  label: string;
  value: string;
  onChange: (address: string, coords: { lat: number; lng: number }) => void;
  placeholder?: string;
}

export function LocationPicker({ label, value, onChange, placeholder }: LocationPickerProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleSearch = (query: string) => {
    onChange(query, { lat: 0, lng: 0 });
    // TODO: Implement Google Places Autocomplete when API key is added
    // For now, just clear suggestions
    setSuggestions([]);
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // TODO: Reverse geocode to get address when API key is added
          onChange(`Current Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`, {
            lat: latitude,
            lng: longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            value={value}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder={placeholder || "Enter location"}
            className="pl-10"
          />
          {suggestions.length > 0 && (
            <Card className="absolute z-10 w-full mt-1 p-2 max-h-48 overflow-auto">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  className="w-full text-left px-3 py-2 hover:bg-accent rounded text-sm"
                  onClick={() => {
                    onChange(suggestion, { lat: 0, lng: 0 });
                    setSuggestions([]);
                  }}
                >
                  {suggestion}
                </button>
              ))}
            </Card>
          )}
        </div>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={getCurrentLocation}
          title="Use current location"
        >
          <Navigation className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
