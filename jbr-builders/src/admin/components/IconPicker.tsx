import React from 'react';
import {
  Home,
  Building2,
  Compass,
  Wrench,
  ClipboardCheck,
  KeyRound,
  ShieldCheck,
  Calendar,
  Layers,
  Sparkles,
  MapPin,
  Briefcase,
  Award,
  Paintbrush,
  Maximize2,
  Truck,
} from 'lucide-react';

interface IconPickerProps {
  value: string;
  onChange: (iconName: string) => void;
  label?: string;
}

export const AVAILABLE_ICONS = [
  { name: 'Home', label: 'Residential / House', Icon: Home },
  { name: 'Building2', label: 'Commercial / Building', Icon: Building2 },
  { name: 'Compass', label: 'Design & Planning', Icon: Compass },
  { name: 'Wrench', label: 'Renovation / Repair', Icon: Wrench },
  { name: 'ClipboardCheck', label: 'Quality / Management', Icon: ClipboardCheck },
  { name: 'KeyRound', label: 'Turnkey Handover', Icon: KeyRound },
  { name: 'ShieldCheck', label: 'Structural Safety', Icon: ShieldCheck },
  { name: 'Calendar', label: 'Timeline Execution', Icon: Calendar },
  { name: 'Layers', label: 'Multi-Storey / Materials', Icon: Layers },
  { name: 'Sparkles', label: 'Interior / Finishing', Icon: Sparkles },
  { name: 'MapPin', label: 'Site Surveying', Icon: MapPin },
  { name: 'Briefcase', label: 'Consulting / Contract', Icon: Briefcase },
  { name: 'Award', label: 'Certified Standards', Icon: Award },
  { name: 'Paintbrush', label: 'Architectural Elevation', Icon: Paintbrush },
  { name: 'Maximize2', label: 'Spatial Planning', Icon: Maximize2 },
  { name: 'Truck', label: 'Material Logistics', Icon: Truck },
];

export const IconPicker: React.FC<IconPickerProps> = ({
  value,
  onChange,
  label = 'Select Service Icon',
}) => {
  return (
    <div className="space-y-2">
      {label && <label className="text-xs font-bold text-slate-700 tracking-wide uppercase">{label}</label>}
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 p-3 bg-slate-50 border border-slate-200 rounded-2xl max-h-48 overflow-y-auto">
        {AVAILABLE_ICONS.map(({ name, label: tooltip, Icon }) => {
          const isSelected = value === name;
          return (
            <button
              key={name}
              type="button"
              onClick={() => onChange(name)}
              title={tooltip}
              className={`flex flex-col items-center justify-center p-2.5 rounded-xl transition-all ${
                isSelected
                  ? 'bg-[#123B68] text-white shadow-md ring-2 ring-[#2468A6]'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-[#2468A6] hover:text-[#123B68]'
              }`}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-medium truncate max-w-full">{name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
