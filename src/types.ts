export type CardTemplate = 'samskar' | 'pragati' | 'tejaswi' | 'samarth' | 'pratibha';
export type CardOrientation = 'vertical' | 'horizontal';
export type LanguageMode = 'bilingual' | 'gujarati' | 'english';
export type CardSideView = 'front' | 'back' | 'both';

export interface Student {
  id: string;
  grNo: string;
  rollNo: string;
  nameGujarati: string;
  nameEnglish: string;
  standard: string; // e.g. "ધોરણ ૫" / "Std 5"
  division: string; // e.g. "A", "B"
  dob: string; // YYYY-MM-DD or DD/MM/YYYY
  bloodGroup: string; // A+, B+, O+, AB+, etc.
  fatherName: string;
  motherName: string;
  mobileNo: string;
  emergencyNo: string;
  address: string;
  photoUrl: string;
  academicYear: string;
  houseTeam?: string;
}

export interface SchoolProfile {
  nameGujarati: string;
  nameEnglish: string;
  trustNameGujarati: string;
  trustNameEnglish: string;
  diseCode: string;
  regNo: string;
  addressGujarati: string;
  addressEnglish: string;
  phone: string;
  email: string;
  website: string;
  logoUrl: string;
  principalSignatureUrl: string;
  taglineGujarati: string;
  taglineEnglish: string;
  currentAcademicYear: string;
}

export interface CardDesignSettings {
  template: CardTemplate;
  orientation: CardOrientation;
  primaryColor: string; // Hex or theme
  secondaryColor: string;
  headerBg: 'colored' | 'white' | 'gradient';
  showQrCode: boolean;
  showBarcode: boolean;
  showBloodGroup: boolean;
  showDob: boolean;
  showFatherName: boolean;
  showMobile: boolean;
  showAddress: boolean;
  showLanyardHole: boolean;
  showPrincipalSign: boolean;
  languageMode: LanguageMode;
}

export interface PrintSettings {
  cardsPerPage: 4 | 8 | 10;
  cardSide: 'front' | 'back' | 'both';
  showCropMarks: boolean;
  paperSize: 'A4';
  includeLanyardHole: boolean;
}
