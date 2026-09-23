import React, { useState } from 'react';
import { Student, SchoolProfile } from '../types';
import { X, FileSpreadsheet, PlusCircle, CheckCircle2, AlertCircle } from 'lucide-react';

interface BulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (newStudents: Student[]) => void;
  school: SchoolProfile;
  lang: 'gu' | 'en';
}

export const BulkImportModal: React.FC<BulkImportModalProps> = ({
  isOpen,
  onClose,
  onImport,
  school,
  lang,
}) => {
  const sampleCSV = `નામ (ગુજરાતી),Name (English),ધોરણ,વર્ગ,રોલ નં,જી.આર. નં,બ્લડ ગ્રૂપ,મોબાઇલ નં,સરનામું
હર્ષિલ મહેશભાઈ પ્રજાપતિ,HARSHIL MAHESHBHAI PRAJAPATI,ધોરણ ૫ (Std 5),A,15,4660,A+,9825123456,સેક્ટર ૨, ગાંધીનગર
ખુશી સંજયભાઈ પટેલ,KHUSHI SANJAYBHAI PATEL,ધોરણ ૫ (Std 5),A,16,4661,O+,9898123456,કુડાસણ, ગાંધીનગર
મિહિર ભરતભાઈ દેસાઈ,MIHIR BHARATBHAI DESAI,ધોરણ ૫ (Std 5),B,17,4662,B+,9879123456,રાંદેસણ, ગાંધીનગર
રિદ્ધિ વિનોદભાઈ સોની,RIDDHI VINODBHAI SONI,ધોરણ ૬ (Std 6),A,18,4663,AB+,9428123456,સેક્ટર ૨૧, ગાંધીનગર`;

  const [rawText, setRawText] = useState<string>(sampleCSV);
  const [parsedList, setParsedList] = useState<Student[]>([]);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const parseInput = () => {
    try {
      const lines = rawText.trim().split('\n');
      if (lines.length < 2) {
        setErrorMsg(
          lang === 'gu'
            ? 'ઓછામાં ઓછી એક વિદ્યાર્થીની લાઇન હોવી જરૂરી છે'
            : 'At least one student record row is required'
        );
        return;
      }

      const results: Student[] = [];
      // Skip header line if it looks like header
      const startIndex = lines[0].includes('નામ') || lines[0].toLowerCase().includes('name') ? 1 : 0;

      for (let i = startIndex; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        // Support both comma-separated (CSV) and tab-separated (direct Excel copy-paste)
        const delimiter = line.includes('\t') ? '\t' : ',';
        const parts = line.split(delimiter).map((p) => p.trim().replace(/^["']|["']$/g, ''));

        if (parts.length >= 2) {
          const nameGu = parts[0] || '';
          const nameEn = parts[1] || parts[0];
          const std = parts[2] || 'ધોરણ ૫ (Std 5)';
          const div = parts[3] || 'A';
          const roll = parts[4] || `${i}`;
          const gr = parts[5] || `${4700 + i}`;
          const bg = parts[6] || 'B+';
          const mob = parts[7] || '98250 00000';
          const addr = parts[8] || 'ગુજરાત';

          results.push({
            id: `bulk-${Date.now()}-${i}`,
            grNo: gr,
            rollNo: roll,
            nameGujarati: nameGu,
            nameEnglish: nameEn.toUpperCase(),
            standard: std,
            division: div,
            dob: '2016-01-01',
            bloodGroup: bg,
            fatherName: nameGu.split(' ').slice(1, 3).join(' ') || nameGu,
            motherName: '',
            mobileNo: mob,
            emergencyNo: mob,
            address: addr,
            photoUrl:
              i % 2 === 0
                ? '/src/assets/images/student_photo_boy_1790155680074.jpg'
                : '/src/assets/images/student_photo_girl_1790155695309.jpg',
            academicYear: school.currentAcademicYear,
            houseTeam: i % 2 === 0 ? 'સરદાર ગૃહ' : 'ટાગોર ગૃહ',
          });
        }
      }

      setParsedList(results);
      setErrorMsg('');
    } catch {
      setErrorMsg(
        lang === 'gu'
          ? 'ડેટા વાંચવામાં ભૂલ થઈ. કૃપા કરીને ફોર્મેટ તપાસો.'
          : 'Failed to parse data. Please check format.'
      );
    }
  };

  const handleConfirmImport = () => {
    if (parsedList.length === 0) {
      parseInput();
      return;
    }
    onImport(parsedList);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {lang === 'gu' ? 'એક્સેલ / CSV બલ્ક ઇમ્પોર્ટ' : 'Bulk Import Students'}
              </h2>
              <p className="text-xs text-slate-500">
                {lang === 'gu'
                  ? 'એકસાથે ઘણા બધા વિદ્યાર્થીઓના આઈડી કાર્ડ બનાવવા માટે ડેટા પેસ્ટ કરો'
                  : 'Paste Excel rows or CSV to generate multiple ID cards at once'}
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

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-slate-700">
                {lang === 'gu'
                  ? 'CSV અથવા એક્સેલમાંથી કોપી કરેલ ડેટા અહીં પેસ્ટ કરો:'
                  : 'Paste CSV or copied Excel cells below:'}
              </label>
              <button
                type="button"
                onClick={() => setRawText(sampleCSV)}
                className="text-[11px] text-indigo-600 hover:text-indigo-800 font-medium"
              >
                {lang === 'gu' ? 'સેમ્પલ ડેટા રીસેટ કરો' : 'Reset sample data'}
              </button>
            </div>
            <textarea
              rows={8}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="નામ (ગુજરાતી),Name (English),ધોરણ,વર્ગ,રોલ નં,જી.આર. નં,બ્લડ ગ્રૂપ,મોબાઇલ નં,સરનામું..."
              className="w-full font-mono text-xs p-3 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-slate-50"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={parseInput}
              className="px-4 py-2 bg-slate-800 text-white rounded-lg text-xs font-medium hover:bg-slate-900 transition-colors"
            >
              {lang === 'gu' ? 'ડેટા ચકાસો (Preview)' : 'Validate & Preview'}
            </button>
            {parsedList.length > 0 && (
              <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                {parsedList.length} {lang === 'gu' ? 'વિદ્યાર્થીઓ તૈયાર છે' : 'students ready to import'}
              </span>
            )}
            {errorMsg && (
              <span className="text-xs text-red-600 font-medium flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errorMsg}
              </span>
            )}
          </div>

          {/* Table Preview */}
          {parsedList.length > 0 && (
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
              <div className="bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700">
                {lang === 'gu' ? 'ઇમ્પોર્ટ પ્રિવ્યૂ (Import Preview)' : 'Import Preview'}
              </div>
              <div className="max-h-56 overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="py-2 px-3">G.R. No</th>
                      <th className="py-2 px-3">રોલ નં.</th>
                      <th className="py-2 px-3">ગુજરાતી નામ</th>
                      <th className="py-2 px-3">English Name</th>
                      <th className="py-2 px-3">ધોરણ</th>
                      <th className="py-2 px-3">બ્લડ ગ્રૂપ</th>
                      <th className="py-2 px-3">મોબાઇલ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {parsedList.map((st, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="py-2 px-3 font-mono tabular-nums">{st.grNo}</td>
                        <td className="py-2 px-3 tabular-nums">{st.rollNo}</td>
                        <td className="py-2 px-3 font-medium text-slate-900">{st.nameGujarati}</td>
                        <td className="py-2 px-3 text-slate-600 uppercase">{st.nameEnglish}</td>
                        <td className="py-2 px-3">{st.standard} - {st.division}</td>
                        <td className="py-2 px-3 font-bold text-red-600">{st.bloodGroup}</td>
                        <td className="py-2 px-3 tabular-nums">{st.mobileNo}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

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
            onClick={handleConfirmImport}
            disabled={parsedList.length === 0}
            className="px-5 py-2 text-xs font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-colors flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            {lang === 'gu'
              ? `${parsedList.length} વિદ્યાર્થીઓ ઉમેરો`
              : `Import ${parsedList.length} Students`}
          </button>
        </div>
      </div>
    </div>
  );
};
