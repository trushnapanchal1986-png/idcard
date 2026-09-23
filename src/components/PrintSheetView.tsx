import React, { useState } from 'react';
import { Student, SchoolProfile, CardDesignSettings, PrintSettings } from '../types';
import { IDCardView } from './IDCardView';
import { Printer, Filter, Scissors, ArrowLeft, CheckSquare, Square } from 'lucide-react';
import { STANDARDS_LIST } from '../data/defaultData';

interface PrintSheetViewProps {
  students: Student[];
  school: SchoolProfile;
  design: CardDesignSettings;
  printSettings: PrintSettings;
  onUpdatePrintSettings: (s: PrintSettings) => void;
  onBack: () => void;
  lang: 'gu' | 'en';
}

export const PrintSheetView: React.FC<PrintSheetViewProps> = ({
  students,
  school,
  design,
  printSettings,
  onUpdatePrintSettings,
  onBack,
  lang,
}) => {
  const [selectedStandard, setSelectedStandard] = useState<string>('all');
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>(
    students.map((s) => s.id)
  );

  const filteredStudents = students.filter((s) => {
    if (selectedStandard !== 'all' && s.standard !== selectedStandard) return false;
    return true;
  });

  const studentsToPrint = filteredStudents.filter((s) =>
    selectedStudentIds.includes(s.id)
  );

  const toggleSelectAll = () => {
    if (selectedStudentIds.length === filteredStudents.length) {
      setSelectedStudentIds([]);
    } else {
      setSelectedStudentIds(filteredStudents.map((s) => s.id));
    }
  };

  const toggleStudent = (id: string) => {
    setSelectedStudentIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Controls Toolbar (Hidden in Print) */}
      <div className="no-print bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            {lang === 'gu' ? 'પાછા જાવ' : 'Back'}
          </button>
          <div className="h-5 w-px bg-slate-200"></div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {lang === 'gu' ? 'A4 પ્રિન્ટિંગ શીટ માસ્ટર' : 'A4 Sheet Print Studio'}
            </h2>
            <p className="text-xs text-slate-500">
              {lang === 'gu'
                ? `કુલ ${studentsToPrint.length} કાર્ડ પ્રિન્ટ માટે પસંદ થયેલ છે`
                : `${studentsToPrint.length} cards selected for printing`}
            </p>
          </div>
        </div>

        {/* Print Settings Options */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Filter by Standard */}
          <div className="flex items-center gap-1.5 text-xs bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedStandard}
              onChange={(e) => setSelectedStandard(e.target.value)}
              className="bg-transparent text-xs font-medium focus:outline-hidden"
            >
              <option value="all">
                {lang === 'gu' ? 'તમામ ધોરણ (All Standards)' : 'All Standards'}
              </option>
              {STANDARDS_LIST.map((std) => (
                <option key={std} value={std}>
                  {std}
                </option>
              ))}
            </select>
          </div>

          {/* Cards side */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs">
            <button
              onClick={() => onUpdatePrintSettings({ ...printSettings, cardSide: 'front' })}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                printSettings.cardSide === 'front'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {lang === 'gu' ? 'માત્ર આગળ (Front)' : 'Front Only'}
            </button>
            <button
              onClick={() => onUpdatePrintSettings({ ...printSettings, cardSide: 'back' })}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                printSettings.cardSide === 'back'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {lang === 'gu' ? 'માત્ર પાછળ (Back)' : 'Back Only'}
            </button>
            <button
              onClick={() => onUpdatePrintSettings({ ...printSettings, cardSide: 'both' })}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                printSettings.cardSide === 'both'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {lang === 'gu' ? 'બંને બાજુ (Front & Back)' : 'Both Sides'}
            </button>
          </div>

          {/* Crop marks toggle */}
          <button
            onClick={() =>
              onUpdatePrintSettings({
                ...printSettings,
                showCropMarks: !printSettings.showCropMarks,
              })
            }
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors ${
              printSettings.showCropMarks
                ? 'bg-amber-50 border-amber-300 text-amber-900'
                : 'bg-white border-slate-300 text-slate-700'
            }`}
          >
            <Scissors className="w-3.5 h-3.5" />
            {lang === 'gu' ? 'કાપવાની રેખાઓ (Crop Marks)' : 'Crop Marks'}
          </button>

          {/* Print Button */}
          <button
            onClick={handlePrint}
            disabled={studentsToPrint.length === 0}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-sm flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <Printer className="w-4 h-4" />
            {lang === 'gu' ? 'A4 શીટ પ્રિન્ટ કરો' : 'Print to PDF / Printer'}
          </button>
        </div>
      </div>

      {/* Select / Deselect quick bar (no-print) */}
      <div className="no-print flex items-center justify-between text-xs px-2 text-slate-500">
        <button
          onClick={toggleSelectAll}
          className="flex items-center gap-1.5 font-medium hover:text-slate-800"
        >
          {selectedStudentIds.length === filteredStudents.length ? (
            <CheckSquare className="w-4 h-4 text-indigo-600" />
          ) : (
            <Square className="w-4 h-4 text-slate-400" />
          )}
          {lang === 'gu'
            ? `બધા પસંદ કરો (${selectedStudentIds.length}/${filteredStudents.length})`
            : `Select All (${selectedStudentIds.length}/${filteredStudents.length})`}
        </button>

        <span className="text-[11px] text-slate-500">
          {lang === 'gu'
            ? '💡 પ્રિન્ટ ડાયલોગમાં "More settings" > "Background graphics" ચાલુ રાખો'
            : '💡 Tip: Enable "Background graphics" in print settings for full colors'}
        </span>
      </div>

      {/* Printable Sheet Canvas */}
      <div className="print-sheet-area flex flex-col items-center">
        {studentsToPrint.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            {lang === 'gu'
              ? 'કોઈ વિદ્યાર્થી પસંદ થયેલ નથી. કૃપા કરીને વિદ્યાર્થી પસંદ કરો.'
              : 'No students selected for printing.'}
          </div>
        ) : (
          <div className="w-full flex flex-col items-center gap-8">
            {/* The Print Layout Grid */}
            <div className="bg-white p-6 rounded-2xl border border-slate-300 shadow-sm print:shadow-none print:border-none print:p-0 max-w-[960px] w-full">
              <div
                className={`grid gap-4 print:gap-3 items-center justify-items-center ${
                  design.orientation === 'vertical'
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 print:grid-cols-2'
                    : 'grid-cols-1 sm:grid-cols-2 print:grid-cols-2'
                }`}
              >
                {studentsToPrint.map((student) => {
                  const isChecked = selectedStudentIds.includes(student.id);
                  return (
                    <div
                      key={student.id}
                      className="id-card-print-container relative group"
                    >
                      {/* Selection checkbox overlay for screen */}
                      <button
                        onClick={() => toggleStudent(student.id)}
                        className="no-print absolute -top-2 -left-2 z-40 bg-white rounded-md shadow-xs p-1 border border-slate-300 hover:bg-slate-100"
                        title={lang === 'gu' ? 'પસંદ / રદ કરો' : 'Toggle selection'}
                      >
                        {isChecked ? (
                          <CheckSquare className="w-4 h-4 text-indigo-600" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-400" />
                        )}
                      </button>

                      {/* Optional Crop Marks Guide lines */}
                      {printSettings.showCropMarks && (
                        <div className="absolute -inset-1 pointer-events-none border border-dashed border-slate-300/80 rounded-xl" />
                      )}

                      {/* If Both Sides is selected */}
                      {printSettings.cardSide === 'both' ? (
                        <div className="flex flex-col gap-2 print:flex-row print:gap-1.5">
                          <IDCardView
                            student={student}
                            school={school}
                            design={design}
                            side="front"
                            scale={0.92}
                          />
                          <IDCardView
                            student={student}
                            school={school}
                            design={design}
                            side="back"
                            scale={0.92}
                          />
                        </div>
                      ) : (
                        <IDCardView
                          student={student}
                          school={school}
                          design={design}
                          side={printSettings.cardSide}
                          scale={0.94}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
