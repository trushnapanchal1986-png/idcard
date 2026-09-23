import React from 'react';
import { Student, SchoolProfile, CardDesignSettings } from '../types';
import { QRCodeRenderer } from './QRCodeRenderer';
import { BarcodeRenderer } from './BarcodeRenderer';
import { ShieldAlert, Phone, MapPin, Award } from 'lucide-react';

interface IDCardViewProps {
  student: Student;
  school: SchoolProfile;
  design: CardDesignSettings;
  side?: 'front' | 'back';
  scale?: number;
  className?: string;
}

export const IDCardView: React.FC<IDCardViewProps> = ({
  student,
  school,
  design,
  side = 'front',
  scale = 1,
  className = '',
}) => {
  const isVertical = design.orientation === 'vertical';

  // Card dimensions based on standard CR80 credit/badge size ratio (54mm x 85.6mm)
  // Standard vertical: 260px x 412px, Horizontal: 412px x 260px
  const cardWidth = isVertical ? 264 : 416;
  const cardHeight = isVertical ? 418 : 264;

  const qrData = JSON.stringify({
    school: school.nameEnglish,
    dise: school.diseCode,
    grNo: student.grNo,
    roll: student.rollNo,
    name: student.nameEnglish,
    std: student.standard,
    div: student.division,
    bg: student.bloodGroup,
    phone: student.mobileNo,
  });

  // Color scheme helpers
  const primaryColor = design.primaryColor || '#1E3A8A';
  const secondaryColor = design.secondaryColor || '#D97706';

  const defaultSignature = (
    <div className="flex flex-col items-center">
      <div className="h-6 flex items-end">
        <span className="font-serif italic text-xs text-slate-800 tracking-tighter transform -rotate-3 select-none font-bold">
          Dr. K. R. Vyas
        </span>
      </div>
      <div className="w-16 border-t border-slate-400 mt-0.5"></div>
      <span className="text-[7.5px] font-semibold text-slate-600 uppercase tracking-wider">
        આચાર્યશ્રી / Principal
      </span>
    </div>
  );

  return (
    <div
      style={{
        transform: scale !== 1 ? `scale(${scale})` : undefined,
        transformOrigin: 'top center',
      }}
      className={`inline-block ${className}`}
    >
      <div
        style={{
          width: `${cardWidth}px`,
          height: `${cardHeight}px`,
          borderColor: primaryColor,
        }}
        className="relative bg-white rounded-xl shadow-md overflow-hidden border border-slate-300 text-slate-800 flex flex-col justify-between select-none print:shadow-none print:border-slate-400"
      >
        {/* Optional Lanyard Punch Slot Indicator */}
        {design.showLanyardHole && (
          <div className="absolute top-1.5 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
            <div className="w-8 h-2 rounded-full border border-slate-300 bg-slate-100/90 shadow-inner flex items-center justify-center">
              <div className="w-4 h-1 rounded-full bg-slate-300"></div>
            </div>
          </div>
        )}

        {/* -------------------- FRONT SIDE -------------------- */}
        {side === 'front' ? (
          isVertical ? (
            /* VERTICAL FRONT */
            <div className="h-full flex flex-col justify-between">
              {/* Card Header */}
              <div
                style={{ backgroundColor: primaryColor }}
                className="pt-4 pb-2 px-2.5 text-center text-white relative shadow-sm"
              >
                {/* Secondary accent line */}
                <div
                  style={{ backgroundColor: secondaryColor }}
                  className="absolute bottom-0 left-0 right-0 h-1"
                />

                <div className="flex items-center justify-center gap-2">
                  {/* School Logo */}
                  {school.logoUrl ? (
                    <img
                      src={school.logoUrl}
                      alt="Logo"
                      className="w-10 h-10 object-contain rounded-full bg-white p-0.5 shadow-xs shrink-0"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                      <Award className="w-6 h-6 text-amber-300" />
                    </div>
                  )}

                  {/* School Name & Trust */}
                  <div className="leading-tight text-center flex-1 min-w-0">
                    <p className="text-[11px] font-bold tracking-tight truncate text-white">
                      {school.nameGujarati}
                    </p>
                    <p className="text-[9px] font-semibold tracking-wider text-amber-200 truncate uppercase">
                      {school.nameEnglish}
                    </p>
                    <p className="text-[7.5px] opacity-85 text-slate-200 truncate">
                      {school.trustNameGujarati}
                    </p>
                  </div>
                </div>

                {/* Sub-bar DISE & Year */}
                <div className="flex items-center justify-between text-[7px] text-slate-200 mt-1.5 pt-0.5 border-t border-white/20 tabular-nums">
                  <span>DISE: {school.diseCode}</span>
                  <span className="font-semibold text-amber-200">
                    વર્ષ: {student.academicYear || school.currentAcademicYear}
                  </span>
                </div>
              </div>

              {/* Student Identity Section */}
              <div className="flex-1 flex flex-col items-center px-3 pt-2 pb-1 justify-between">
                {/* Photo & House Banner */}
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <div
                      style={{ borderColor: primaryColor }}
                      className="w-22 h-26 rounded-md overflow-hidden border-2 bg-slate-100 shadow-xs flex items-center justify-center"
                    >
                      {student.photoUrl ? (
                        <img
                          src={student.photoUrl}
                          alt={student.nameEnglish}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="text-slate-400 text-center p-2">
                          <p className="text-xs">ફોટો</p>
                          <p className="text-[9px]">Photo</p>
                        </div>
                      )}
                    </div>
                    {/* Blood Group Tag at corner */}
                    {design.showBloodGroup && student.bloodGroup && (
                      <div className="absolute -bottom-1 -right-1 bg-red-600 text-white font-black text-[9px] px-1.5 py-0.5 rounded shadow-xs leading-none">
                        {student.bloodGroup}
                      </div>
                    )}
                  </div>

                  {student.houseTeam && (
                    <span className="text-[8px] font-medium text-slate-600 mt-1 tracking-tight">
                      {student.houseTeam}
                    </span>
                  )}
                </div>

                {/* Student Name */}
                <div className="text-center w-full my-1">
                  <h3
                    style={{ color: primaryColor }}
                    className="text-[13px] font-bold leading-tight truncate px-1"
                  >
                    {student.nameGujarati}
                  </h3>
                  <p className="text-[9px] font-semibold text-slate-600 tracking-wider uppercase truncate">
                    {student.nameEnglish}
                  </p>
                </div>

                {/* Details Table */}
                <div className="w-full bg-slate-50/80 rounded border border-slate-200 p-1.5 text-[9px] space-y-0.5">
                  <div className="flex justify-between items-center border-b border-slate-150 pb-0.5">
                    <span className="text-slate-500 font-medium">ધોરણ / વર્ગ:</span>
                    <span className="font-bold text-slate-800">
                      {student.standard} - {student.division}
                    </span>
                  </div>

                  <div className="flex justify-between items-center border-b border-slate-150 pb-0.5">
                    <span className="text-slate-500 font-medium">રોલ નં. / Roll No:</span>
                    <span className="font-bold text-slate-800 tabular-nums">
                      {student.rollNo || '-'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center border-b border-slate-150 pb-0.5">
                    <span className="text-slate-500 font-medium">જી.આર. નં. / G.R. No:</span>
                    <span className="font-bold text-slate-800 tabular-nums">
                      {student.grNo || '-'}
                    </span>
                  </div>

                  {design.showDob && student.dob && (
                    <div className="flex justify-between items-center border-b border-slate-150 pb-0.5">
                      <span className="text-slate-500 font-medium">જન્મ તારીખ / DOB:</span>
                      <span className="font-semibold text-slate-700 tabular-nums">
                        {student.dob}
                      </span>
                    </div>
                  )}

                  {design.showMobile && student.mobileNo && (
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 font-medium">મોબાઇલ / Phone:</span>
                      <span className="font-semibold text-slate-700 tabular-nums">
                        {student.mobileNo}
                      </span>
                    </div>
                  )}
                </div>

                {/* Bottom Bar: QR / Barcode & Sign */}
                <div className="w-full flex items-end justify-between mt-1 px-1">
                  {/* QR Code */}
                  {design.showQrCode ? (
                    <div className="flex flex-col items-center">
                      <div className="p-0.5 bg-white border border-slate-200 rounded">
                        <QRCodeRenderer value={qrData} size={44} />
                      </div>
                      <span className="text-[6.5px] text-slate-400 mt-0.5">Verify ID</span>
                    </div>
                  ) : design.showBarcode ? (
                    <div className="scale-75 origin-bottom-left">
                      <BarcodeRenderer value={student.grNo || '1001'} height={20} />
                    </div>
                  ) : (
                    <div />
                  )}

                  {/* Principal Signature */}
                  {design.showPrincipalSign && (
                    <div className="scale-90 origin-bottom-right">
                      {school.principalSignatureUrl ? (
                        <div className="flex flex-col items-center">
                          <img
                            src={school.principalSignatureUrl}
                            alt="Signature"
                            className="h-6 object-contain"
                            referrerPolicy="no-referrer"
                          />
                          <div className="w-16 border-t border-slate-400 mt-0.5"></div>
                          <span className="text-[7px] font-semibold text-slate-600">
                            આચાર્યશ્રી / Principal
                          </span>
                        </div>
                      ) : (
                        defaultSignature
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer Stripe */}
              <div
                style={{ backgroundColor: primaryColor }}
                className="py-1 px-2 text-center text-white text-[7.5px] flex items-center justify-between"
              >
                <span className="truncate">{school.taglineGujarati || '॥ તમસો મા જ્યોતિર્ગમય ॥'}</span>
                <span className="tabular-nums font-mono opacity-90 text-[7px]">
                  ID: {student.grNo}
                </span>
              </div>
            </div>
          ) : (
            /* HORIZONTAL FRONT */
            <div className="h-full flex flex-col justify-between">
              {/* Header */}
              <div
                style={{ backgroundColor: primaryColor }}
                className="py-2 px-3 text-white flex items-center justify-between relative shadow-sm"
              >
                <div
                  style={{ backgroundColor: secondaryColor }}
                  className="absolute bottom-0 left-0 right-0 h-1"
                />

                <div className="flex items-center gap-2 min-w-0">
                  {school.logoUrl ? (
                    <img
                      src={school.logoUrl}
                      alt="Logo"
                      className="w-9 h-9 object-contain rounded-full bg-white p-0.5 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <Award className="w-8 h-8 text-amber-300 shrink-0" />
                  )}
                  <div className="leading-tight min-w-0">
                    <h2 className="text-[12px] font-bold text-white truncate">
                      {school.nameGujarati}
                    </h2>
                    <p className="text-[8.5px] font-semibold text-amber-200 truncate uppercase">
                      {school.nameEnglish}
                    </p>
                    <p className="text-[7px] text-slate-200 truncate">
                      {school.addressGujarati}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0 pl-2">
                  <span className="text-[8px] bg-white/20 px-2 py-0.5 rounded font-bold text-amber-100 block">
                    {student.academicYear || school.currentAcademicYear}
                  </span>
                  <span className="text-[7px] text-slate-200 block mt-0.5 tabular-nums">
                    DISE: {school.diseCode}
                  </span>
                </div>
              </div>

              {/* Horizontal Content */}
              <div className="flex-1 px-3 py-1.5 flex items-center justify-between gap-3">
                {/* Photo */}
                <div className="relative shrink-0">
                  <div
                    style={{ borderColor: primaryColor }}
                    className="w-24 h-28 rounded-md overflow-hidden border-2 bg-slate-100 flex items-center justify-center shadow-xs"
                  >
                    {student.photoUrl ? (
                      <img
                        src={student.photoUrl}
                        alt={student.nameEnglish}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <span className="text-[10px] text-slate-400">Photo</span>
                    )}
                  </div>
                  {design.showBloodGroup && student.bloodGroup && (
                    <div className="absolute -bottom-1 -right-1 bg-red-600 text-white font-bold text-[8.5px] px-1 py-0.5 rounded shadow-xs leading-none">
                      {student.bloodGroup}
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h3
                    style={{ color: primaryColor }}
                    className="text-[12.5px] font-bold leading-tight truncate"
                  >
                    {student.nameGujarati}
                  </h3>
                  <p className="text-[9px] font-semibold text-slate-600 uppercase tracking-wider truncate mb-1">
                    {student.nameEnglish}
                  </p>

                  <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[8.5px] bg-slate-50 p-1.5 rounded border border-slate-200">
                    <div>
                      <span className="text-slate-400">ધોરણ / વર્ગ:</span>{' '}
                      <span className="font-bold text-slate-800">
                        {student.standard} - {student.division}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400">રોલ નં.:</span>{' '}
                      <span className="font-bold text-slate-800 tabular-nums">
                        {student.rollNo}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400">G.R. No:</span>{' '}
                      <span className="font-bold text-slate-800 tabular-nums">
                        {student.grNo}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400">DOB:</span>{' '}
                      <span className="font-medium text-slate-800 tabular-nums">
                        {student.dob}
                      </span>
                    </div>
                    {student.mobileNo && (
                      <div className="col-span-2">
                        <span className="text-slate-400">મોબાઇલ:</span>{' '}
                        <span className="font-medium text-slate-800 tabular-nums">
                          {student.mobileNo}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* QR Code / Signature */}
                <div className="shrink-0 flex flex-col items-center justify-between h-28 py-0.5">
                  {design.showQrCode && (
                    <div className="p-0.5 bg-white border border-slate-200 rounded">
                      <QRCodeRenderer value={qrData} size={48} />
                    </div>
                  )}
                  {design.showPrincipalSign && (
                    <div className="scale-85 origin-bottom">
                      {defaultSignature}
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div
                style={{ backgroundColor: primaryColor }}
                className="py-1 px-3 text-white text-[7.5px] flex items-center justify-between"
              >
                <span>{school.taglineGujarati}</span>
                <span>{school.phone}</span>
              </div>
            </div>
          )
        ) : (
          /* -------------------- BACK SIDE -------------------- */
          <div className="h-full flex flex-col justify-between bg-slate-50/50">
            {/* Header Back */}
            <div
              style={{ backgroundColor: primaryColor }}
              className="py-1.5 px-3 text-white text-center relative"
            >
              <h4 className="text-[10px] font-bold truncate">{school.nameGujarati}</h4>
              <p className="text-[7.5px] opacity-90 truncate">{school.addressGujarati}</p>
              <div
                style={{ backgroundColor: secondaryColor }}
                className="absolute bottom-0 left-0 right-0 h-0.5"
              />
            </div>

            {/* Back Details */}
            <div className="flex-1 px-3 py-2 flex flex-col justify-between text-[8.5px] space-y-1.5">
              {/* Parent Info */}
              <div className="bg-white p-2 rounded border border-slate-200 space-y-1">
                <div className="flex items-start gap-1.5">
                  <span className="text-slate-500 font-medium shrink-0">પિતાશ્રી:</span>
                  <span className="font-semibold text-slate-800 truncate">
                    {student.fatherName || '-'}
                  </span>
                </div>
                {student.motherName && (
                  <div className="flex items-start gap-1.5">
                    <span className="text-slate-500 font-medium shrink-0">માતાશ્રી:</span>
                    <span className="font-semibold text-slate-800 truncate">
                      {student.motherName}
                    </span>
                  </div>
                )}
                <div className="flex items-start gap-1.5">
                  <MapPin className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
                  <span className="text-slate-700 leading-tight">
                    {student.address || 'સરનામું ઉપલબ્ધ નથી'}
                  </span>
                </div>
              </div>

              {/* Emergency Contacts */}
              <div className="grid grid-cols-2 gap-1.5 bg-amber-50/70 border border-amber-200/80 p-1.5 rounded">
                <div className="flex items-center gap-1">
                  <Phone className="w-3 h-3 text-amber-700 shrink-0" />
                  <div>
                    <span className="text-[7px] text-amber-800 block">વાલી ફોન</span>
                    <span className="font-bold text-slate-800 text-[8px] tabular-nums">
                      {student.mobileNo || '-'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3 text-red-600 shrink-0" />
                  <div>
                    <span className="text-[7px] text-red-700 block">ઇમરજન્સી નં.</span>
                    <span className="font-bold text-slate-800 text-[8px] tabular-nums">
                      {student.emergencyNo || student.mobileNo || '-'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Rules & Instructions */}
              <div className="text-[7px] text-slate-500 leading-relaxed bg-white p-1.5 rounded border border-slate-200">
                <p className="font-bold text-slate-700 mb-0.5">શાળા નિયમો / સૂચના:</p>
                <ol className="list-decimal pl-3 space-y-0.5">
                  <li>વિદ્યાર્થીએ આ ઓળખપત્ર દરરોજ શાળામાં ગળામાં પહેરવું ફરજિયાત છે.</li>
                  <li>કાર્ડ ખોવાઈ જતાં તરત શાળા કાર્યાલયમાં જાણ કરવી.</li>
                  <li>આ કાર્ડ અન્ય કોઈ વ્યક્તિને વાપરવા આપવું માન્ય નથી.</li>
                </ol>
              </div>

              {/* Bottom stamp and barcode */}
              <div className="flex items-center justify-between pt-1">
                <div className="scale-75 origin-left">
                  <BarcodeRenderer value={`ID-${student.grNo}`} height={18} />
                </div>
                <div className="scale-80 origin-right">
                  {defaultSignature}
                </div>
              </div>
            </div>

            {/* Back Footer */}
            <div
              style={{ backgroundColor: primaryColor }}
              className="py-1 px-3 text-white text-[7px] text-center"
            >
              હેલ્પલાઇન: {school.phone} | {school.email}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
