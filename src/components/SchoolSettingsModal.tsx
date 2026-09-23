import React, { useRef } from 'react';
import { SchoolProfile } from '../types';
import { X, Building2, Upload, Award } from 'lucide-react';

interface SchoolSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  school: SchoolProfile;
  onSave: (updated: SchoolProfile) => void;
  lang: 'gu' | 'en';
}

export const SchoolSettingsModal: React.FC<SchoolSettingsModalProps> = ({
  isOpen,
  onClose,
  school,
  onSave,
  lang,
}) => {
  const [formData, setFormData] = React.useState<SchoolProfile>(school);
  const logoInputRef = useRef<HTMLInputElement | null>(null);
  const signInputRef = useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    setFormData(school);
  }, [school, isOpen]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFormData((prev) => ({
            ...prev,
            logoUrl: event.target?.result as string,
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSignUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFormData((prev) => ({
            ...prev,
            principalSignatureUrl: event.target?.result as string,
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {lang === 'gu' ? 'શાળા પ્રોફાઇલ & વિગતો' : 'School Profile & Details'}
              </h2>
              <p className="text-xs text-slate-500">
                {lang === 'gu'
                  ? 'ઓળખપત્ર પર દર્શાવવા માટે શાળાનું નામ, લોગો અને સરનામું સેટ કરો'
                  : 'Configure school identity, logo, DISE code, and contacts for ID cards'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-4">
          {/* Logo and Signature Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
            {/* School Logo */}
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-xl border-2 border-slate-200 bg-white p-1 flex items-center justify-center overflow-hidden shrink-0">
                {formData.logoUrl ? (
                  <img
                    src={formData.logoUrl}
                    alt="Logo"
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <Award className="w-8 h-8 text-amber-500" />
                )}
              </div>
              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-700 block">
                  {lang === 'gu' ? 'શાળાનો લોગો (Emblem)' : 'School Logo / Emblem'}
                </span>
                <input
                  type="file"
                  ref={logoInputRef}
                  onChange={handleLogoUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => logoInputRef.current?.click()}
                  className="px-3 py-1 bg-white border border-slate-300 rounded text-xs font-medium text-slate-700 hover:bg-slate-100 flex items-center gap-1"
                >
                  <Upload className="w-3 h-3 text-slate-500" />
                  {lang === 'gu' ? 'લોગો બદલો' : 'Change Logo'}
                </button>
              </div>
            </div>

            {/* Principal Signature */}
            <div className="flex items-center gap-3">
              <div className="w-24 h-16 rounded-xl border-2 border-slate-200 bg-white p-1 flex items-center justify-center overflow-hidden shrink-0">
                {formData.principalSignatureUrl ? (
                  <img
                    src={formData.principalSignatureUrl}
                    alt="Signature"
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span className="text-[10px] text-slate-400 italic">Default Sign</span>
                )}
              </div>
              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-700 block">
                  {lang === 'gu' ? 'આચાર્યશ્રીની સહી (Signature)' : 'Principal Signature'}
                </span>
                <input
                  type="file"
                  ref={signInputRef}
                  onChange={handleSignUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => signInputRef.current?.click()}
                  className="px-3 py-1 bg-white border border-slate-300 rounded text-xs font-medium text-slate-700 hover:bg-slate-100 flex items-center gap-1"
                >
                  <Upload className="w-3 h-3 text-slate-500" />
                  {lang === 'gu' ? 'સહી અપલોડ કરો' : 'Upload Signature'}
                </button>
              </div>
            </div>
          </div>

          {/* School Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {lang === 'gu' ? 'શાળાનું નામ (ગુજરાતીમાં) *' : 'School Name (Gujarati) *'}
              </label>
              <input
                type="text"
                required
                value={formData.nameGujarati}
                onChange={(e) => setFormData({ ...formData, nameGujarati: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {lang === 'gu' ? 'School Name (English) *' : 'School Name (English) *'}
              </label>
              <input
                type="text"
                required
                value={formData.nameEnglish}
                onChange={(e) =>
                  setFormData({ ...formData, nameEnglish: e.target.value.toUpperCase() })
                }
                className="w-full px-3 py-2 text-xs uppercase rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium"
              />
            </div>
          </div>

          {/* Trust Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {lang === 'gu' ? 'ટ્રસ્ટનું નામ (ગુજરાતી)' : 'Trust Name (Gujarati)'}
              </label>
              <input
                type="text"
                value={formData.trustNameGujarati}
                onChange={(e) =>
                  setFormData({ ...formData, trustNameGujarati: e.target.value })
                }
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {lang === 'gu' ? 'Trust Name (English)' : 'Trust Name (English)'}
              </label>
              <input
                type="text"
                value={formData.trustNameEnglish}
                onChange={(e) =>
                  setFormData({ ...formData, trustNameEnglish: e.target.value })
                }
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* DISE Code & Academic Year */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {lang === 'gu' ? 'DISE કોડ (11 અંક)' : 'DISE Code'}
              </label>
              <input
                type="text"
                value={formData.diseCode}
                onChange={(e) => setFormData({ ...formData, diseCode: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 tabular-nums font-mono focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {lang === 'gu' ? 'શાળા રજીસ્ટ્રેશન નં.' : 'Reg. Number'}
              </label>
              <input
                type="text"
                value={formData.regNo}
                onChange={(e) => setFormData({ ...formData, regNo: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 tabular-nums focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {lang === 'gu' ? 'ચાલુ શૈક્ષણિક વર્ષ' : 'Academic Year'}
              </label>
              <input
                type="text"
                value={formData.currentAcademicYear}
                onChange={(e) =>
                  setFormData({ ...formData, currentAcademicYear: e.target.value })
                }
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 tabular-nums focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium"
              />
            </div>
          </div>

          {/* School Contact info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {lang === 'gu' ? 'શાળા હેલ્પલાઇન ફોન' : 'School Phone'}
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 tabular-nums focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {lang === 'gu' ? 'શાળા ઈમેલ' : 'School Email'}
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Address & Tagline */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {lang === 'gu' ? 'શાળાનું સરનામું (ગુજરાતી)' : 'School Address (Gujarati)'}
            </label>
            <input
              type="text"
              value={formData.addressGujarati}
              onChange={(e) =>
                setFormData({ ...formData, addressGujarati: e.target.value })
              }
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {lang === 'gu' ? 'શાળા ધ્યેયસૂત્ર (Motto / Tagline)' : 'School Motto / Tagline'}
            </label>
            <input
              type="text"
              placeholder="॥ તમસો મા જ્યોતિર્ગમય ॥"
              value={formData.taglineGujarati}
              onChange={(e) =>
                setFormData({ ...formData, taglineGujarati: e.target.value })
              }
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-100"
          >
            {lang === 'gu' ? 'રદ કરો' : 'Cancel'}
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-5 py-2 text-xs font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-sm"
          >
            {lang === 'gu' ? 'માહિતી સાચવો' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};
