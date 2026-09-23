import React, { useState, useEffect } from 'react';
import {
  Student,
  SchoolProfile,
  CardDesignSettings,
  PrintSettings,
  CardTemplate,
  CardOrientation,
} from './types';
import {
  DEFAULT_SCHOOL,
  DEFAULT_DESIGN,
  DEFAULT_PRINT,
  SAMPLE_STUDENTS,
  TEMPLATE_OPTIONS,
  STANDARDS_LIST,
} from './data/defaultData';
import { IDCardView } from './components/IDCardView';
import { StudentModal } from './components/StudentModal';
import { BulkImportModal } from './components/BulkImportModal';
import { SchoolSettingsModal } from './components/SchoolSettingsModal';
import { PrintSheetView } from './components/PrintSheetView';
import {
  Users,
  Palette,
  Printer,
  Building,
  Plus,
  Search,
  FileSpreadsheet,
  Edit2,
  Trash2,
  Eye,
  RotateCw,
  QrCode,
  Check,
  Download,
  Languages,
  BookOpen,
} from 'lucide-react';

export default function App() {
  // Language state: 'gu' (Gujarati) or 'en' (English)
  const [lang, setLang] = useState<'gu' | 'en'>('gu');

  // Navigation tab state: 'students' | 'designer' | 'print'
  const [activeTab, setActiveTab] = useState<'students' | 'designer' | 'print'>('students');

  // School profile state
  const [school, setSchool] = useState<SchoolProfile>(() => {
    const saved = localStorage.getItem('school_id_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return DEFAULT_SCHOOL;
  });

  // Students list state
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('school_id_students');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return SAMPLE_STUDENTS;
  });

  // Design settings state
  const [design, setDesign] = useState<CardDesignSettings>(() => {
    const saved = localStorage.getItem('school_id_design');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return DEFAULT_DESIGN;
  });

  // Print settings state
  const [printSettings, setPrintSettings] = useState<PrintSettings>(DEFAULT_PRINT);

  // Selected student for designer preview
  const [previewStudentId, setPreviewStudentId] = useState<string>(
    students[0]?.id || ''
  );
  const [previewSide, setPreviewSide] = useState<'front' | 'back' | 'both'>('front');

  // Modals state
  const [isStudentModalOpen, setIsStudentModalOpen] = useState<boolean>(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState<boolean>(false);
  const [isSchoolModalOpen, setIsSchoolModalOpen] = useState<boolean>(false);

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [standardFilter, setStandardFilter] = useState<string>('all');

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('school_id_profile', JSON.stringify(school));
  }, [school]);

  useEffect(() => {
    localStorage.setItem('school_id_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('school_id_design', JSON.stringify(design));
  }, [design]);

  // Handle student save
  const handleSaveStudent = (saved: Student) => {
    setStudents((prev) => {
      const idx = prev.findIndex((s) => s.id === saved.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = saved;
        return next;
      }
      return [saved, ...prev];
    });
    setPreviewStudentId(saved.id);
  };

  // Handle student delete
  const handleDeleteStudent = (id: string) => {
    const confirmText =
      lang === 'gu'
        ? 'શું તમે આ વિદ્યાર્થીનું ઓળખપત્ર રદ કરવા માંગો છો?'
        : 'Are you sure you want to delete this student ID?';
    if (window.confirm(confirmText)) {
      setStudents((prev) => prev.filter((s) => s.id !== id));
      if (previewStudentId === id) {
        const remaining = students.filter((s) => s.id !== id);
        setPreviewStudentId(remaining[0]?.id || '');
      }
    }
  };

  // Handle bulk import
  const handleBulkImport = (newStudents: Student[]) => {
    setStudents((prev) => [...newStudents, ...prev]);
    if (newStudents[0]) {
      setPreviewStudentId(newStudents[0].id);
    }
  };

  // Reset to sample data
  const handleResetSampleData = () => {
    const confirmReset =
      lang === 'gu'
        ? 'બધા વિદ્યાર્થીઓનો નમૂના ડેટા ફરીથી લોડ કરવો છે?'
        : 'Reload demo student dataset?';
    if (window.confirm(confirmReset)) {
      setStudents(SAMPLE_STUDENTS);
      setSchool(DEFAULT_SCHOOL);
      setDesign(DEFAULT_DESIGN);
      setPreviewStudentId(SAMPLE_STUDENTS[0].id);
    }
  };

  const previewStudent =
    students.find((s) => s.id === previewStudentId) || students[0] || SAMPLE_STUDENTS[0];

  const filteredStudents = students.filter((st) => {
    if (standardFilter !== 'all' && st.standard !== standardFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchNameGu = st.nameGujarati.toLowerCase().includes(q);
      const matchNameEn = st.nameEnglish.toLowerCase().includes(q);
      const matchGr = st.grNo.toLowerCase().includes(q);
      const matchRoll = st.rollNo.toLowerCase().includes(q);
      return matchNameGu || matchNameEn || matchGr || matchRoll;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* ----------------- TOP BAR (Top Bar Contract: 3 Zones) ----------------- */}
      <header className="no-print bg-white border-b border-slate-200 sticky top-0 z-40 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto h-16 flex items-center justify-between gap-4">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold tracking-tight text-slate-900 truncate">
              {lang === 'gu' ? 'શાળા આઈડી કાર્ડ સ્ટુડિયો' : 'School ID Card Studio'}
            </span>
          </div>

          {/* Zone 2: Navigation Links (Text with active underlines / clean indicators) */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
            <button
              onClick={() => setActiveTab('students')}
              className={`py-5 text-sm transition-colors border-b-2 flex items-center gap-2 ${
                activeTab === 'students'
                  ? 'border-indigo-600 text-indigo-600 font-semibold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-4 h-4" />
              {lang === 'gu' ? 'વિદ્યાર્થી યાદી' : 'Students Roster'}
              <span className="text-xs bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-sm tabular-nums">
                {students.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('designer')}
              className={`py-5 text-sm transition-colors border-b-2 flex items-center gap-2 ${
                activeTab === 'designer'
                  ? 'border-indigo-600 text-indigo-600 font-semibold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Palette className="w-4 h-4" />
              {lang === 'gu' ? 'કાર્ડ ડિઝાઇનર & પ્રિવ્યૂ' : 'Card Designer & Live Preview'}
            </button>

            <button
              onClick={() => setActiveTab('print')}
              className={`py-5 text-sm transition-colors border-b-2 flex items-center gap-2 ${
                activeTab === 'print'
                  ? 'border-indigo-600 text-indigo-600 font-semibold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Printer className="w-4 h-4" />
              {lang === 'gu' ? 'A4 પ્રિન્ટ શીટ' : 'A4 Print Sheet'}
            </button>

            <button
              onClick={() => setIsSchoolModalOpen(true)}
              className="py-5 text-sm text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-2 border-b-2 border-transparent"
            >
              <Building className="w-4 h-4 text-slate-400" />
              {lang === 'gu' ? 'શાળા પ્રોફાઇલ' : 'School Profile'}
            </button>
          </nav>

          {/* Zone 3: 1-2 Primary Actions */}
          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <button
              onClick={() => setLang(lang === 'gu' ? 'en' : 'gu')}
              className="px-2.5 py-1.5 border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap"
              title="Toggle Gujarati / English"
            >
              <Languages className="w-3.5 h-3.5 text-indigo-600" />
              <span>{lang === 'gu' ? 'English' : 'ગુજરાતી'}</span>
            </button>

            {/* Quick Add Student CTA */}
            <button
              onClick={() => {
                setEditingStudent(null);
                setIsStudentModalOpen(true);
              }}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{lang === 'gu' ? 'નવો વિદ્યાર્થી' : 'Add Student'}</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="md:hidden flex items-center justify-around border-t border-slate-200 py-2">
          <button
            onClick={() => setActiveTab('students')}
            className={`text-xs flex items-center gap-1 py-1 px-2 rounded ${
              activeTab === 'students' ? 'text-indigo-600 font-bold bg-indigo-50' : 'text-slate-600'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            {lang === 'gu' ? 'વિદ્યાર્થીઓ' : 'Students'}
          </button>
          <button
            onClick={() => setActiveTab('designer')}
            className={`text-xs flex items-center gap-1 py-1 px-2 rounded ${
              activeTab === 'designer' ? 'text-indigo-600 font-bold bg-indigo-50' : 'text-slate-600'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            {lang === 'gu' ? 'ડિઝાઇનર' : 'Designer'}
          </button>
          <button
            onClick={() => setActiveTab('print')}
            className={`text-xs flex items-center gap-1 py-1 px-2 rounded ${
              activeTab === 'print' ? 'text-indigo-600 font-bold bg-indigo-50' : 'text-slate-600'
            }`}
          >
            <Printer className="w-3.5 h-3.5" />
            {lang === 'gu' ? 'પ્રિન્ટ' : 'Print'}
          </button>
          <button
            onClick={() => setIsSchoolModalOpen(true)}
            className="text-xs text-slate-600 flex items-center gap-1 py-1 px-2"
          >
            <Building className="w-3.5 h-3.5" />
            {lang === 'gu' ? 'શાળા' : 'School'}
          </button>
        </div>
      </header>

      {/* ----------------- MAIN VIEW CONTAINER ----------------- */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {/* ============================================================== */}
        {/* TAB 1: STUDENT ROSTER (વિદ્યાર્થી યાદી)                         */}
        {/* ============================================================== */}
        {activeTab === 'students' && (
          <div className="space-y-6">
            {/* Top Stat & School Summary Strip */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {school.logoUrl ? (
                  <img
                    src={school.logoUrl}
                    alt="Logo"
                    className="w-14 h-14 object-contain rounded-xl p-1 border border-slate-200 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                    <BookOpen className="w-8 h-8" />
                  </div>
                )}
                <div>
                  <h1 className="text-lg font-bold text-slate-900 leading-tight">
                    {school.nameGujarati}
                  </h1>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-0.5">
                    <span>{school.trustNameGujarati}</span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums">DISE: {school.diseCode}</span>
                    <span aria-hidden="true">·</span>
                    <span>વર્ષ: {school.currentAcademicYear}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                <button
                  onClick={() => setIsBulkModalOpen(true)}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                  {lang === 'gu' ? 'એક્સેલ ઇમ્પોર્ટ' : 'Excel Import'}
                </button>

                <button
                  onClick={handleResetSampleData}
                  className="px-3 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-medium rounded-lg transition-colors"
                  title="Reload default sample students"
                >
                  {lang === 'gu' ? 'સેમ્પલ ડેટા' : 'Sample Data'}
                </button>

                <button
                  onClick={() => setActiveTab('print')}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  {lang === 'gu' ? 'બધા કાર્ડ પ્રિન્ટ કરો' : 'Print All Cards'}
                </button>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder={
                    lang === 'gu'
                      ? 'નામ, રોલ નંબર અથવા G.R. નંબરથી શોધો...'
                      : 'Search by student name, roll number, or G.R. No...'
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs text-slate-500 whitespace-nowrap">
                  {lang === 'gu' ? 'ધોરણ પસંદ કરો:' : 'Filter:'}
                </span>
                <select
                  value={standardFilter}
                  onChange={(e) => setStandardFilter(e.target.value)}
                  className="px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white font-medium focus:outline-hidden"
                >
                  <option value="all">
                    {lang === 'gu' ? 'તમામ ધોરણ (All)' : 'All Standards'}
                  </option>
                  {STANDARDS_LIST.map((std) => (
                    <option key={std} value={std}>
                      {std}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Students Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              {filteredStudents.length === 0 ? (
                <div className="p-12 text-center">
                  <p className="text-sm font-semibold text-slate-700">
                    {lang === 'gu' ? 'કોઈ વિદ્યાર્થી મળ્યા નથી' : 'No students found'}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {lang === 'gu'
                      ? 'તમારા સર્ચ ફિલ્ટર્સ બદલો અથવા નવો વિદ્યાર્થી ઉમેરો.'
                      : 'Try adjusting your search criteria or add a new student.'}
                  </p>
                  <button
                    onClick={() => {
                      setEditingStudent(null);
                      setIsStudentModalOpen(true);
                    }}
                    className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold"
                  >
                    {lang === 'gu' ? '+ પ્રથમ વિદ્યાર્થી ઉમેરો' : '+ Add First Student'}
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                      <tr>
                        <th className="py-3 px-4">ફોટો</th>
                        <th className="py-3 px-4">G.R. / રોલ</th>
                        <th className="py-3 px-4">વિદ્યાર્થીનું નામ</th>
                        <th className="py-3 px-4">ધોરણ & વર્ગ</th>
                        <th className="py-3 px-4">બ્લડ ગ્રૂપ</th>
                        <th className="py-3 px-4">સંપર્ક / મોબાઇલ</th>
                        <th className="py-3 px-4 text-right">કાર્યવાહી</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredStudents.map((st) => (
                        <tr key={st.id} className="hover:bg-slate-50/80 transition-colors">
                          {/* Photo */}
                          <td className="py-3 px-4">
                            <div className="w-9 h-11 rounded border border-slate-200 overflow-hidden bg-slate-100 shrink-0">
                              <img
                                src={st.photoUrl}
                                alt={st.nameEnglish}
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                          </td>

                          {/* Roll & GR */}
                          <td className="py-3 px-4">
                            <div className="font-mono tabular-nums text-slate-900 font-bold">
                              {st.grNo}
                            </div>
                            <div className="text-[11px] text-slate-500 tabular-nums">
                              Roll: {st.rollNo}
                            </div>
                          </td>

                          {/* Student Name */}
                          <td className="py-3 px-4">
                            <div className="font-semibold text-slate-900 text-sm">
                              {st.nameGujarati}
                            </div>
                            <div className="text-[10px] text-slate-500 uppercase tracking-wide">
                              {st.nameEnglish}
                            </div>
                          </td>

                          {/* Standard & Div */}
                          <td className="py-3 px-4">
                            <span className="font-medium text-slate-800">{st.standard}</span>
                            <span className="ml-1 px-1.5 py-0.5 rounded bg-slate-100 font-bold text-slate-700">
                              {st.division}
                            </span>
                          </td>

                          {/* Blood Group */}
                          <td className="py-3 px-4">
                            <span className="font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">
                              {st.bloodGroup}
                            </span>
                          </td>

                          {/* Contact */}
                          <td className="py-3 px-4 font-mono tabular-nums text-slate-700">
                            {st.mobileNo}
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Preview Card Button */}
                              <button
                                onClick={() => {
                                  setPreviewStudentId(st.id);
                                  setActiveTab('designer');
                                }}
                                title={lang === 'gu' ? 'આઈડી કાર્ડ જુઓ' : 'Preview ID Card'}
                                className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                              >
                                <Eye className="w-4 h-4" />
                              </button>

                              {/* Edit Button */}
                              <button
                                onClick={() => {
                                  setEditingStudent(st);
                                  setIsStudentModalOpen(true);
                                }}
                                title={lang === 'gu' ? 'સુધારો કરો' : 'Edit Details'}
                                className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>

                              {/* Delete Button */}
                              <button
                                onClick={() => handleDeleteStudent(st.id)}
                                title={lang === 'gu' ? 'ડીલીટ કરો' : 'Delete'}
                                className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: LIVE CARD DESIGNER & PREVIEW                            */}
        {/* ============================================================== */}
        {activeTab === 'designer' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Design Controls (5 columns on large screen) */}
            <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  {lang === 'gu' ? 'ઓળખપત્ર ડિઝાઇન સેટિંગ્સ' : 'ID Card Design Customizer'}
                </h2>
                <p className="text-xs text-slate-500">
                  {lang === 'gu'
                    ? 'તમારી શાળાની શૈલી મુજબ રંગ, ટેમ્પલેટ અને લેઆઉટ પસંદ કરો'
                    : 'Select template, orientation, color scheme, and element toggles'}
                </p>
              </div>

              {/* Template Selection */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 block">
                  {lang === 'gu' ? 'થીમ & ટેમ્પલેટ' : 'Card Template Theme'}
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {TEMPLATE_OPTIONS.map((tmpl) => {
                    const isSelected = design.template === tmpl.id;
                    return (
                      <button
                        key={tmpl.id}
                        type="button"
                        onClick={() =>
                          setDesign({
                            ...design,
                            template: tmpl.id as CardTemplate,
                            primaryColor: tmpl.primary,
                            secondaryColor: tmpl.secondary,
                          })
                        }
                        className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50/50 shadow-xs ring-1 ring-indigo-600'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex gap-1">
                            <span
                              style={{ backgroundColor: tmpl.primary }}
                              className="w-4 h-4 rounded-full border border-black/10 shadow-inner"
                            />
                            <span
                              style={{ backgroundColor: tmpl.secondary }}
                              className="w-4 h-4 rounded-full border border-black/10 shadow-inner"
                            />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-900">
                              {lang === 'gu' ? tmpl.nameGujarati : tmpl.nameEnglish}
                            </p>
                            <p className="text-[11px] text-slate-500">{tmpl.description}</p>
                          </div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-indigo-600" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Card Orientation: Vertical vs Horizontal */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 block">
                  {lang === 'gu' ? 'કાર્ડ લેઆઉટ (Orientation)' : 'Card Orientation'}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setDesign({ ...design, orientation: 'vertical' })}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      design.orientation === 'vertical'
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-bold shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="w-6 h-9 mx-auto border-2 border-current rounded-sm mb-1.5" />
                    <span className="text-xs">
                      {lang === 'gu' ? 'પોર્ટ્રેટ (ઊભું)' : 'Vertical Badge'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDesign({ ...design, orientation: 'horizontal' })}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      design.orientation === 'horizontal'
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-bold shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="w-9 h-6 mx-auto border-2 border-current rounded-sm mb-1.5" />
                    <span className="text-xs">
                      {lang === 'gu' ? 'લેન્ડસ્કેપ (આડું)' : 'Horizontal Card'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Custom Color Swatches */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 block">
                  {lang === 'gu' ? 'મુખ્ય રંગ (Primary Header Color)' : 'Primary Header Color'}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={design.primaryColor}
                    onChange={(e) => setDesign({ ...design, primaryColor: e.target.value })}
                    className="w-10 h-10 rounded-lg cursor-pointer border border-slate-300 p-0.5"
                  />
                  <div className="flex flex-wrap gap-1.5 flex-1">
                    {[
                      '#1E3A8A', // Deep Blue
                      '#065F46', // Emerald
                      '#881337', // Crimson
                      '#1E293B', // Slate
                      '#4C1D95', // Deep Purple
                      '#C2410C', // Rust Orange
                    ].map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setDesign({ ...design, primaryColor: c })}
                        style={{ backgroundColor: c }}
                        className={`w-7 h-7 rounded-lg border border-black/10 transition-transform ${
                          design.primaryColor.toLowerCase() === c.toLowerCase()
                            ? 'scale-110 ring-2 ring-indigo-500'
                            : 'hover:scale-105'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Element Visibility Toggles */}
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <label className="text-xs font-semibold text-slate-700 block">
                  {lang === 'gu' ? 'કાર્ડના ઘટકો (Show/Hide Elements)' : 'Elements & Toggles'}
                </label>
                <div className="space-y-2 text-xs">
                  <label className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 cursor-pointer">
                    <span className="text-slate-700">
                      {lang === 'gu' ? 'સ્કેનેબલ QR કોડ (QR Code)' : 'Verification QR Code'}
                    </span>
                    <input
                      type="checkbox"
                      checked={design.showQrCode}
                      onChange={(e) => setDesign({ ...design, showQrCode: e.target.checked })}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 cursor-pointer">
                    <span className="text-slate-700">
                      {lang === 'gu' ? 'બારકોડ (Barcode)' : 'ID Barcode'}
                    </span>
                    <input
                      type="checkbox"
                      checked={design.showBarcode}
                      onChange={(e) => setDesign({ ...design, showBarcode: e.target.checked })}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 cursor-pointer">
                    <span className="text-slate-700">
                      {lang === 'gu' ? 'બ્લડ ગ્રૂપ બેજ' : 'Blood Group Badge'}
                    </span>
                    <input
                      type="checkbox"
                      checked={design.showBloodGroup}
                      onChange={(e) =>
                        setDesign({ ...design, showBloodGroup: e.target.checked })
                      }
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 cursor-pointer">
                    <span className="text-slate-700">
                      {lang === 'gu' ? 'જન્મ તારીખ (Birth Date)' : 'Date of Birth'}
                    </span>
                    <input
                      type="checkbox"
                      checked={design.showDob}
                      onChange={(e) => setDesign({ ...design, showDob: e.target.checked })}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 cursor-pointer">
                    <span className="text-slate-700">
                      {lang === 'gu' ? 'લેન્યાર્ડ પંચ હોલ ગાઈડ' : 'Lanyard Slot Punch Hole'}
                    </span>
                    <input
                      type="checkbox"
                      checked={design.showLanyardHole}
                      onChange={(e) =>
                        setDesign({ ...design, showLanyardHole: e.target.checked })
                      }
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 cursor-pointer">
                    <span className="text-slate-700">
                      {lang === 'gu' ? 'આચાર્ય સહી (Principal Signature)' : 'Principal Signature'}
                    </span>
                    <input
                      type="checkbox"
                      checked={design.showPrincipalSign}
                      onChange={(e) =>
                        setDesign({ ...design, showPrincipalSign: e.target.checked })
                      }
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column: Live Interactive Card Preview (7 columns on large screen) */}
            <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col items-center">
              {/* Preview Controls Bar */}
              <div className="w-full flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-slate-200">
                {/* Select Student for Preview */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-medium">
                    {lang === 'gu' ? 'વિદ્યાર્થી પ્રિવ્યૂ:' : 'Preview Student:'}
                  </span>
                  <select
                    value={previewStudentId}
                    onChange={(e) => setPreviewStudentId(e.target.value)}
                    className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white font-medium focus:outline-hidden"
                  >
                    {students.map((st) => (
                      <option key={st.id} value={st.id}>
                        {st.nameGujarati} ({st.standard})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Front / Back Toggle Buttons */}
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs">
                  <button
                    onClick={() => setPreviewSide('front')}
                    className={`px-3 py-1 rounded-md font-medium transition-colors ${
                      previewSide === 'front'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {lang === 'gu' ? 'આગળની બાજુ (Front)' : 'Front'}
                  </button>
                  <button
                    onClick={() => setPreviewSide('back')}
                    className={`px-3 py-1 rounded-md font-medium transition-colors ${
                      previewSide === 'back'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {lang === 'gu' ? 'પાછળની બાજુ (Back)' : 'Back'}
                  </button>
                  <button
                    onClick={() => setPreviewSide('both')}
                    className={`px-3 py-1 rounded-md font-medium transition-colors ${
                      previewSide === 'both'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {lang === 'gu' ? 'બંને બાજુ (Both)' : 'Both'}
                  </button>
                </div>
              </div>

              {/* Live Preview Display Stage */}
              <div className="w-full py-8 px-4 flex flex-col items-center justify-center bg-slate-50/70 rounded-2xl border border-dashed border-slate-200 my-5 min-h-[460px]">
                {previewSide === 'both' ? (
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    <div>
                      <p className="text-[11px] font-semibold text-slate-500 mb-1.5 text-center">
                        {lang === 'gu' ? 'મુખપૃષ્ઠ (Front)' : 'Front View'}
                      </p>
                      <IDCardView
                        student={previewStudent}
                        school={school}
                        design={design}
                        side="front"
                        scale={1}
                      />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-slate-500 mb-1.5 text-center">
                        {lang === 'gu' ? 'પાછળનું પૃષ્ઠ (Back)' : 'Back View'}
                      </p>
                      <IDCardView
                        student={previewStudent}
                        school={school}
                        design={design}
                        side="back"
                        scale={1}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <IDCardView
                      student={previewStudent}
                      school={school}
                      design={design}
                      side={previewSide}
                      scale={1.05}
                    />
                  </div>
                )}
              </div>

              {/* Action Bar Under Preview */}
              <div className="w-full flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200">
                <div className="text-xs text-slate-500">
                  <span className="font-semibold text-slate-700">CR80 સ્ટાન્ડર્ડ સાઈઝ:</span> 85.6mm
                  × 54mm (PVC ID કાર્ડ માપદંડ)
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditingStudent(previewStudent);
                      setIsStudentModalOpen(true);
                    }}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1.5"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-slate-500" />
                    {lang === 'gu' ? 'આ વિદ્યાર્થી સુધારો' : 'Edit This Student'}
                  </button>

                  <button
                    onClick={() => setActiveTab('print')}
                    className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    {lang === 'gu' ? 'આ કાર્ડ પ્રિન્ટ કરો' : 'Print Sheet'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: A4 PRINT SHEET (પ્રિન્ટ શીટ)                            */}
        {/* ============================================================== */}
        {activeTab === 'print' && (
          <PrintSheetView
            students={students}
            school={school}
            design={design}
            printSettings={printSettings}
            onUpdatePrintSettings={setPrintSettings}
            onBack={() => setActiveTab('students')}
            lang={lang}
          />
        )}
      </main>

      {/* ----------------- MODALS ----------------- */}
      <StudentModal
        isOpen={isStudentModalOpen}
        onClose={() => setIsStudentModalOpen(false)}
        onSave={handleSaveStudent}
        initialData={editingStudent}
        school={school}
        lang={lang}
      />

      <BulkImportModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        onImport={handleBulkImport}
        school={school}
        lang={lang}
      />

      <SchoolSettingsModal
        isOpen={isSchoolModalOpen}
        onClose={() => setIsSchoolModalOpen(false)}
        school={school}
        onSave={(updated) => setSchool(updated)}
        lang={lang}
      />
    </div>
  );
}
