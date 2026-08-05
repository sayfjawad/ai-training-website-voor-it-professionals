export interface TranslationContent {
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    duration: string;
    location: string;
    date: string;
  };
  intro: {
    title: string;
    lead: string;
    description: string;
    promiseTitle: string;
    promiseText: string;
    whyJoinTitle: string;
    whyJoinPoints: string[];
    painPointsTitle: string;
    painPoints: string[];
  };
  objectives: {
    title: string;
    subtitle: string;
    items: {
      title: string;
      description: string;
    }[];
  };
  audience: {
    title: string;
    subtitle: string;
    description: string;
    requirementsTitle: string;
    requirementsText: string;
    tasksTitle: string;
    tasksList: string[];
    idealTitle: string;
    idealList: string[];
    notForTitle: string;
    notForText: string;
  };
  program: {
    title: string;
    subtitle: string;
    timeline: {
      time: string;
      title: string;
      description: string;
    }[];
  };
  practical: {
    title: string;
    subtitle: string;
    dateLabel: string;
    dateValue: string;
    locationLabel: string;
    locationValue: string;
    locationDetails: string;
    timeLabel: string;
    timeValue: string;
    timeDetails: string;
    includesLabel: string;
    includesList: string[];
    bringLabel: string;
    bringValue: string;
    bringRecommended: string[];
    groupSizeLabel: string;
    groupSizeValue: string;
    levelLabel: string;
    levelValue: string;
    levelDetails: string;
    investmentLabel: string;
    originalPrice: string;
    discountPrice: string;
    priceDetails: string;
    afterRegisterLabel: string;
    afterRegisterValue: string[];
  };
  trainer: {
    title: string;
    subtitle: string;
    intro: string;
    aboutFoundationTitle: string;
    aboutFoundationText: string;
    trainerCardTitle: string;
    trainers: {
      name: string;
      role: string;
      bio: string;
      initials: string;
      experience: string;
      linkedinUrl: string;
    }[];
    approachTitle: string;
    approachIntro: string;
    approachPoints: string[];
  };
  faq: {
    title: string;
    subtitle: string;
    items: {
      question: string;
      answer: string;
    }[];
  };
  stats: {
    eyebrow: string;
    title: string;
    subtitle: string;
    seatsLabel: string;
    seatsFilled: string;
    seatsFull: string;
    totalRegistrations: string;
    totalVisitors: string;
    experienceBreakdownTitle: string;
    loading: string;
    error: string;
  };
  registration: {
    title: string;
    subtitle: string;
    formTitle: string;
    personalData: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    workData: string;
    organization: string;
    function: string;
    experience: string;
    experienceOptions: string[];
    invoiceData: string;
    invoiceRequired: string;
    invoiceRequiredYes: string;
    invoiceRequiredNo: string;
    companyName: string;
    invoiceAddress: string;
    postalCodeCity: string;
    vatNumber: string;
    dietaryLabel: string;
    dietaryOptions: { label: string; value: string }[];
    dietaryPlaceholder: string;
    remarksLabel: string;
    remarksPlaceholder: string;
    consentTerms: string;
    consentPrivacy: string;
    submitBtn: string;
    submitting: string;
    successTitle: string;
    successText: string;
    successSteps: string[];
    validationError: string;
    privacyLink: string;
    termsLink: string;
  };
  footer: {
    tagline: string;
    contact: string;
    rights: string;
    privacy: string;
    terms: string;
    adminPanel: string;
  };
}

export interface RegistrationData {
  id: string;
  createdAt: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  organization: string;
  functionName: string;
  experience: string;
  invoiceToOrganization: boolean;
  companyName?: string;
  invoiceAddress?: string;
  postalCodeCity?: string;
  vatNumber?: string;
  billingEmail?: string;
  discountCode?: string;
  dietaryWishes?: string[];
  dietaryCustom?: string;
  remarks?: string;
  agreeTerms: boolean;
  agreePrivacy: boolean;
  language: "nl" | "en";
}

export interface FaqItem {
  question: string;
  answer: string;
}
