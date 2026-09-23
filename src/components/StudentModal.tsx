import React, { useState, useEffect, useRef } from 'react';
import { Student, SchoolProfile } from '../types';
import { BLOOD_GROUPS, STANDARDS_LIST } from '../data/defaultData';
import { X, Upload, Camera, Sparkles, User, RefreshCw } from 'lucide-react';

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (student: Student) => void;
  initialData?: Student | null;
  school: SchoolProfile;
  lang: 'gu' | 'en';
}

export const StudentModal: React.FC<StudentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  school,
  lang,
}) => {
  const [formData, setFormData] = useState<Student>({
    id: '',
    grNo: '',
    rollNo: '',
    nameGujarati: '',
    nameEnglish: '',
    standard: 'ધોરણ ૫ (Std 5)',
    division: 'A',
    dob: '2016-01-01',
    bloodGroup: 'B+',
    fatherName: '',
    motherName: '',
    mobileNo: '',
    emergencyNo: '',
    address: '',
    photoUrl: '/src/assets/images/student_photo_boy_1790155680074.jpg',
    academicYear: school.currentAcademicYear,
    houseTeam: 'સરદાર ગૃહ (Red)',
  });

  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      // Auto generate next grNo based on timestamp
      const autoGr = Math.floor(4000 + Math.random() * 2000).toString();
      setFormData({
        id: `stud-${Date.now()}`,
        grNo: autoGr,
        rollNo: '01',
        nameGujarati: '',
        nameEnglish: '',
        standard: 'ધોરણ ૫ (Std 5)',
        division: 'A',
        dob: '2016-05-15',
        bloodGroup: 'B+',
        fatherName: '',
        motherName: '',
        mobileNo: '',
        emergencyNo: '',
        address: '',
        photoUrl: '/src/assets/images/student_photo_boy_1790155680074.jpg',
        academicYear: school.currentAcademicYear,
        houseTeam: 'સરદાર ગૃહ (Red)',
      });
    }
  }, [initialData, school.currentAcademicYear, isOpen]);

  // Handle Photo upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFormData((prev) => ({
            ...prev,
            photoUrl: event.target?.result as string,
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Camera start/capture
  const startCamera = async () => {
    try {
      setCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 320, height: 320, facingMode: 'user' },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.error('Camera access failed', err);
      setCameraActive(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = 300;
      canvas.height = 360;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, 300, 360);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setFormData((prev) => ({ ...prev, photoUrl: dataUrl }));
      }
      stopCamera();
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nameGujarati.trim() && !formData.nameEnglish.trim()) {
      alert(lang === 'gu' ? 'કૃપા કરીને વિદ્યાર્થીનું નામ લખો' : 'Please enter student name');
      return;
    }
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {initialData
                ? lang === 'gu'
                  ? 'વિદ્યાર્થી માહિતી સુધારો'
                  : 'Edit Student Details'
                : lang === 'gu'
                ? 'નવો વિદ્યાર્થી ઉમેરો'
                : 'Add New Student'}
            </h2>
            <p className="text-xs text-slate-500">
              {lang === 'gu'
                ? 'વિદ્યાર્થીના ઓળખપત્ર માટે જરૂરી વિગતો ભરો'
                : 'Fill in the information required for student identity card'}
            </p>
          </div>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Photo Selection Area */}
          <div className="flex flex-col sm:flex-row items-center gap-5 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="relative shrink-0">
              <div className="w-24 h-30 rounded-lg border-2 border-indigo-500 overflow-hidden bg-white shadow-xs flex items-center justify-center">
                {formData.photoUrl ? (
                  <img
                    src={formData.photoUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <User className="w-10 h-10 text-slate-300" />
                )}
              </div>
            </div>

            <div className="flex-1 space-y-2 text-center sm:text-left">
              <label className="text-xs font-semibold text-slate-700 block">
                {lang === 'gu' ? 'વિદ્યાર્થી ફોટો' : 'Student Photograph'}
              </label>

              {cameraActive ? (
                <div className="space-y-2">
                  <video
                    ref={videoRef}
                    className="w-48 h-36 object-cover rounded-lg border border-slate-300 mx-auto sm:mx-0"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={capturePhoto}
                      className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-medium hover:bg-emerald-700 transition-colors"
                    >
                      {lang === 'gu' ? 'ફોટો લો (Capture)' : 'Capture Photo'}
                    </button>
                    <button
                      type="button"
                      onClick={stopCamera}
                      className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded-lg text-xs font-medium hover:bg-slate-300 transition-colors"
                    >
                      {lang === 'gu' ? 'રદ કરો' : 'Cancel'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handlePhotoUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 rounded-lg text-xs font-medium flex items-center gap-1.5 hover:bg-slate-100 transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5 text-slate-500" />
                    {lang === 'gu' ? 'ફોટો અપલોડ કરો' : 'Upload Image'}
                  </button>
                  <button
                    type="button"
                    onClick={startCamera}
                    className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 rounded-lg text-xs font-medium flex items-center gap-1.5 hover:bg-slate-100 transition-colors"
                  >
                    <Camera className="w-3.5 h-3.5 text-slate-500" />
                    {lang === 'gu' ? 'કેમેરાથી લો' : 'Webcam'}
                  </button>
                  {/* Preset Photos */}
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((p) => ({
                        ...p,
                        photoUrl: '/src/assets/images/student_photo_boy_1790155680074.jpg',
                      }))
                    }
                    className="px-2.5 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-medium hover:bg-indigo-100 transition-colors"
                  >
                    {lang === 'gu' ? 'કુમાર સેમ્પલ' : 'Sample Boy'}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((p) => ({
                        ...p,
                        photoUrl: '/src/assets/images/student_photo_girl_1790155695309.jpg',
                      }))
                    }
                    className="px-2.5 py-1.5 bg-pink-50 text-pink-700 rounded-lg text-xs font-medium hover:bg-pink-100 transition-colors"
                  >
                    {lang === 'gu' ? 'કન્યા સેમ્પલ' : 'Sample Girl'}
                  </button>
                </div>
              )}
              <p className="text-[11px] text-slate-500">
                {lang === 'gu'
                  ? 'પાસપોર્ટ સાઇઝનો સ્વચ્છ અને સ્પષ્ટ ફોટો શ્રેષ્ઠ પરિણામ આપશે.'
                  : 'Standard passport format image gives the best ID card result.'}
              </p>
            </div>
          </div>

          {/* Student Names (Gujarati & English) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {lang === 'gu' ? 'વિદ્યાર્થીનું નામ (ગુજરાતીમાં) *' : 'Student Name (Gujarati) *'}
              </label>
              <input
                type="text"
                required
                placeholder="દા.ત. આરવ રાજેશભાઈ પટેલ"
                value={formData.nameGujarati}
                onChange={(e) =>
                  setFormData({ ...formData, nameGujarati: e.target.value })
                }
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {lang === 'gu' ? 'Student Full Name (In English CAPITAL) *' : 'Full Name (English) *'}
              </label>
              <input
                type="text"
                placeholder="e.g. AARAV RAJESHBHAI PATEL"
                value={formData.nameEnglish}
                onChange={(e) =>
                  setFormData({ ...formData, nameEnglish: e.target.value.toUpperCase() })
                }
                className="w-full px-3 py-2 text-sm uppercase rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-medium"
              />
            </div>
          </div>

          {/* Academic Info */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {lang === 'gu' ? 'ધોરણ (Standard)' : 'Standard'}
              </label>
              <select
                value={formData.standard}
                onChange={(e) => setFormData({ ...formData, standard: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              >
                {STANDARDS_LIST.map((std) => (
                  <option key={std} value={std}>
                    {std}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {lang === 'gu' ? 'વર્ગ (Section/Div)' : 'Division'}
              </label>
              <input
                type="text"
                placeholder="A, B, C..."
                value={formData.division}
                onChange={(e) =>
                  setFormData({ ...formData, division: e.target.value.toUpperCase() })
                }
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 uppercase focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {lang === 'gu' ? 'રોલ નં. (Roll No)' : 'Roll No'}
              </label>
              <input
                type="text"
                placeholder="14"
                value={formData.rollNo}
                onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 tabular-nums focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {lang === 'gu' ? 'જી.આર. નં. (G.R. No)' : 'G.R. Number'}
              </label>
              <input
                type="text"
                placeholder="4581"
                value={formData.grNo}
                onChange={(e) => setFormData({ ...formData, grNo: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 tabular-nums font-mono focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Personal Info: DOB, Blood Group, House */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {lang === 'gu' ? 'જન્મ તારીખ (Birth Date)' : 'Date of Birth'}
              </label>
              <input
                type="date"
                value={formData.dob}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 tabular-nums"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {lang === 'gu' ? 'બ્લડ ગ્રૂપ (Blood Group)' : 'Blood Group'}
              </label>
              <select
                value={formData.bloodGroup}
                onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-bold"
              >
                {BLOOD_GROUPS.map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {lang === 'gu' ? 'હાઉસ / ટીમ (House Team)' : 'House / Team'}
              </label>
              <input
                type="text"
                placeholder="દા.ત. સરદાર ગૃહ / Red"
                value={formData.houseTeam || ''}
                onChange={(e) => setFormData({ ...formData, houseTeam: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Parents Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {lang === 'gu' ? 'પિતા / વાલીનું નામ' : "Father's / Guardian Name"}
              </label>
              <input
                type="text"
                placeholder="દા.ત. રાજેશભાઈ પટેલ"
                value={formData.fatherName}
                onChange={(e) =>
                  setFormData({ ...formData, fatherName: e.target.value })
                }
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {lang === 'gu' ? 'માતાનું નામ' : "Mother's Name"}
              </label>
              <input
                type="text"
                placeholder="દા.ત. અલ્પાબેન પટેલ"
                value={formData.motherName}
                onChange={(e) =>
                  setFormData({ ...formData, motherName: e.target.value })
                }
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Phone & Emergency Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {lang === 'gu' ? 'વાલીનો મોબાઇલ નંબર' : 'Primary Mobile No'}
              </label>
              <input
                type="tel"
                placeholder="98250 12345"
                value={formData.mobileNo}
                onChange={(e) => setFormData({ ...formData, mobileNo: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 tabular-nums focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {lang === 'gu' ? 'ઇમરજન્સી સંપર્ક નંબર' : 'Emergency Contact No'}
              </label>
              <input
                type="tel"
                placeholder="94260 54321"
                value={formData.emergencyNo}
                onChange={(e) =>
                  setFormData({ ...formData, emergencyNo: e.target.value })
                }
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 tabular-nums focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {lang === 'gu' ? 'રહેઠાણનું સરનામું (પાછળના પૃષ્ઠ માટે)' : 'Residential Address'}
            </label>
            <textarea
              rows={2}
              placeholder="દા.ત. પ્લોટ નં. ૨૪, ગોકુલધામ સોસાયટી, સેક્ટર ૭, ગાંધીનગર"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </form>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="px-4 py-2 text-xs font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
          >
            {lang === 'gu' ? 'રદ કરો' : 'Cancel'}
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-5 py-2 text-xs font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-sm transition-colors"
          >
            {lang === 'gu' ? 'સાચવો અને કાર્ડ બનાવો' : 'Save & Generate Card'}
          </button>
        </div>
      </div>
    </div>
  );
};
